#!/usr/bin/env node
// scripts/perf-scan.mjs -- a smoke alarm for mechanical performance and data-layer tells in source. Not a profiler.
//
//   node scripts/perf-scan.mjs <file-or-folder>... [--json] [--strict]
//
// Exit 1 when any FAIL is found (with --strict, any WARN too). Dependency-free, Node 18+. It reads source only: no
// build, no database, no browser. It points at lines worth a reviewer's time; it cannot see real query plans, bundle
// sizes or field metrics. Measure those (EXPLAIN ANALYZE, a bundle visualiser, Lighthouse and field data) before and
// after any change it prompts.
//
// Rules are our own wording and regexes, written after the web.dev Core Web Vitals guides, the PostgreSQL wiki "Don't
// Do This" page and CREATE INDEX docs, the SQLite WAL and pragma docs, the FastAPI async guide and the Anthropic
// prompt-caching docs; the basis for each rule is in references/stack-and-platform-reference.md.
//
// Suppress one finding with a reason of 10+ characters on the same line or up to 2 lines above it:
//   // perf-allow: n-plus-one -- at most 5 items by construction, see ticket 12
// A suppression with a shorter reason still silences the rule but raises `suppression-no-reason`.
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { basename, extname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const JS_EXT = new Set([".js", ".mjs", ".cjs", ".jsx", ".ts", ".tsx", ".mts", ".vue", ".svelte", ".astro"]);
const HTML_EXT = new Set([".html", ".htm", ".jsx", ".tsx", ".vue", ".svelte", ".astro"]);
const SKIP_DIRS = new Set(["worktrees", "node_modules", ".git", "dist", "build", ".next", ".cache", "coverage", ".turbo", ".vercel", "out", "vendor", "__pycache__", ".venv", "venv"]);
const SELF = /^perf-scan(\.test)?\.mjs$/;
const MIN_REASON_CHARS = 10;
const MAX_BYTES = 1_000_000;

const lineOf = (text, index) => text.slice(0, index).split("\n").length;
const finding = (rule, severity, file, text, index, message) => ({ rule, severity, file, line: lineOf(text, index), message });

export function kindsOf(file) {
  const name = basename(file);
  const ext = extname(name).toLowerCase();
  const kinds = new Set();
  if (SELF.test(name)) return kinds;
  if (JS_EXT.has(ext)) kinds.add("js");
  if (ext === ".py") kinds.add("py");
  if (ext === ".sql") kinds.add("sql");
  if (HTML_EXT.has(ext)) kinds.add("markup");
  if (ext === ".css" || ext === ".html" || ext === ".htm") kinds.add("css");
  return kinds;
}

// brace-matching that skips strings and comments
export function matchBrace(text, open) {
  let depth = 0;
  for (let i = open; i < text.length; i++) {
    const c = text[i];
    if (c === "/" && text[i + 1] === "/") { i = text.indexOf("\n", i); if (i === -1) return text.length; continue; }
    if (c === "/" && text[i + 1] === "*") { i = text.indexOf("*/", i + 2); if (i === -1) return text.length; i += 1; continue; }
    if (c === "'" || c === '"' || c === "`") {
      for (i++; i < text.length && text[i] !== c; i++) if (text[i] === "\\") i++;
      continue;
    }
    if (c === "{") depth++;
    else if (c === "}" && --depth === 0) return i + 1;
  }
  return text.length;
}

function matchParen(text, open) {
  let depth = 0;
  for (let i = open; i < text.length; i++) {
    if (text[i] === "(") depth++;
    else if (text[i] === ")" && --depth === 0) return i;
  }
  return text.length;
}

// ---------- n-plus-one ----------
const JS_IO = /\bawait\s+(?:[\w$]+\.)*(?:query|execute|findOne|findUnique|findFirst|findMany|findById|findByPk|fetch|send|request)\s*\(|\bawait\s+(?:axios|http|client|redis|cache|api|got|ky)\.(?:get|post|put|delete|request)\s*\(|\bawait\s+fetch\s*\(/;

function jsNPlusOne(file, text) {
  const out = [];
  const loops = [];
  for (const m of text.matchAll(/\b(?:for|while)\s*(?:await\s*)?\(/g)) {
    const close = matchParen(text, m.index + m[0].length - 1);
    const rest = text.slice(close + 1);
    const brace = /^\s*\{/.exec(rest);
    if (brace) loops.push({ index: m.index, body: text.slice(close + 1 + brace[0].length - 1, matchBrace(text, close + 1 + brace[0].length - 1)) });
  }
  for (const m of text.matchAll(/\.(?:map|forEach|flatMap)\(\s*async\s*(?:\([^)]*\)|\w+)\s*=>\s*\{/g)) {
    const open = m.index + m[0].length - 1;
    loops.push({ index: m.index, body: text.slice(open, matchBrace(text, open)) });
  }
  for (const l of loops) {
    if (JS_IO.test(l.body)) {
      out.push(finding("n-plus-one", "WARN", file, text, l.index, "A database or network call is awaited inside a loop, so it runs once per item (N+1). Batch it: one query with IN/ANY or a join, a loader, or a bounded Promise.all over a fixed chunk."));
    }
  }
  return out;
}

function pyNPlusOne(file, text) {
  const out = [];
  const lines = text.split("\n");
  const io = /\.objects\.(?:get|filter)\(|\bcur(?:sor)?\.execute\(|\bconn(?:ection)?\.execute\(|\bsession\.(?:query|get|execute)\(|\brequests\.(?:get|post|put|delete)\(|\bhttpx\.(?:get|post)\(/;
  let offset = 0;
  for (let i = 0; i < lines.length; i++) {
    const head = /^(\s*)for\s+.+\s+in\s+.+:\s*(?:#.*)?$/.exec(lines[i]);
    if (head) {
      const indent = head[1].length;
      for (let j = i + 1; j < lines.length; j++) {
        if (lines[j].trim() === "") continue;
        if (lines[j].search(/\S/) <= indent) break;
        if (io.test(lines[j])) {
          out.push(finding("n-plus-one", "WARN", file, text, offset, "A database or network call sits inside a loop, so it runs once per item (N+1). Fetch all rows in one query (IN / select_related / prefetch_related / a join)."));
          break;
        }
      }
    }
    offset += lines[i].length + 1;
  }
  return out;
}

// ---------- python async ----------
function asyncBlocking(file, text) {
  const out = [];
  const lines = text.split("\n");
  let offset = 0;
  for (let i = 0; i < lines.length; i++) {
    const head = /^(\s*)async\s+def\s/.exec(lines[i]);
    if (head) {
      let o = offset + lines[i].length + 1;
      for (let j = i + 1; j < lines.length; j++) {
        if (lines[j].trim() !== "" && lines[j].search(/\S/) <= head[1].length) break;
        const m = /\btime\.sleep\(|\brequests\.(?:get|post|put|delete|request)\(|\burllib\.request\.urlopen\(/.exec(lines[j]);
        if (m) out.push(finding("async-blocking-call", "WARN", file, text, o + m.index, "A blocking call inside async def stalls the whole event loop. Use await asyncio.sleep, an async client (httpx.AsyncClient), or a plain def handler so the framework runs it in a thread pool."));
        o += lines[j].length + 1;
      }
    }
    offset += lines[i].length + 1;
  }
  return out;
}

// ---------- generic regex rules ----------
const RULES = [
  { id: "select-star", severity: "WARN", kinds: ["js", "py", "sql"], re: /\bSELECT\s+\*\s+FROM\b/gi,
    message: "SELECT * pulls every column, including ones added later, and defeats covering indexes. Name the columns you use." },
  { id: "unbounded-query", severity: "WARN", kinds: ["js"], re: /\.findMany\(\s*(?:\)|\{[^)]*\}\s*\))/g, test: (m) => !/\b(?:take|cursor)\b/.test(m[0]),
    message: "A findMany with no take or cursor returns the whole table as it grows. Paginate (keyset where you can) and cap the page size." },
  { id: "sync-io-in-handler", severity: "WARN", kinds: ["js"], file: (t) => /\b(?:app|router|server|fastify)\.(?:get|post|put|patch|delete|use)\(|export\s+(?:async\s+)?function\s+(?:GET|POST|PUT|DELETE|PATCH)\b|new Hono\(/.test(t),
    re: /\b(?:readFileSync|writeFileSync|readdirSync|statSync|execSync|spawnSync)\s*\(/g,
    message: "A synchronous call in a file that serves requests blocks the event loop for every user while it runs. Use the async version, or do it once at startup." },
  { id: "heavy-import", severity: "WARN", kinds: ["js"], re: /(?:\bfrom\s+|\brequire\(\s*)['"](?:moment|lodash|jquery|underscore)['"]/g,
    message: "This library is large and hard to tree-shake. Prefer a small alternative (date-fns, dayjs, native Intl/Date, per-method imports, lodash-es) and check the bundle with a visualiser." },
  { id: "json-deep-clone", severity: "WARN", kinds: ["js"], re: /JSON\.parse\(\s*JSON\.stringify\(/g,
    message: "A JSON round trip as a deep clone is slow and drops Dates, Maps, undefined and more. Use structuredClone." },
  { id: "pg-timestamp-without-tz", severity: "WARN", kinds: ["sql"], re: /^\s*["`]?\w+["`]?\s+timestamp(?!\s*(?:tz\b|with\s+time\s+zone))(?:\s*\(\d+\))?\s*(?:,|\)|not\b|null\b|default\b|primary\b|$)/gim,
    message: "timestamp without time zone loses the zone and is a classic source of off-by-hours bugs. Use timestamptz." },
  { id: "pg-money", severity: "WARN", kinds: ["sql"], re: /^\s*["`]?\w+["`]?\s+money\b/gim,
    message: "The money type depends on a locale setting and has rounding traps. Use numeric (or integer cents)." },
  { id: "pg-char-n", severity: "WARN", kinds: ["sql"], re: /\b(?:var)?char\s*\(\s*\d+\s*\)/gi,
    message: "char(n) pads with spaces and varchar(n) adds a length cap with no speed gain. Use text, and a CHECK constraint if you need a real limit." },
  { id: "pg-serial", severity: "WARN", kinds: ["sql"], re: /\b(?:big|small)?serial\b(?!\w)/gi,
    message: "serial is a legacy shortcut with ownership and permission quirks. Use GENERATED ... AS IDENTITY (PostgreSQL 10 and later)." },
  { id: "pg-not-in-subquery", severity: "WARN", kinds: ["sql", "js", "py"], re: /\bNOT\s+IN\s*\(\s*SELECT\b/gi,
    message: "NOT IN returns no rows if the subquery yields a single NULL, and it often plans badly. Use NOT EXISTS." },
  { id: "pg-index-not-concurrent", severity: "WARN", kinds: ["sql"], re: /\bCREATE\s+(?:UNIQUE\s+)?INDEX\s+(?!CONCURRENTLY\b)/gi,
    message: "A plain CREATE INDEX blocks writes to the table while it builds. On a live table use CREATE INDEX CONCURRENTLY (outside a transaction block); a plain index is fine only on a new or empty table." },
  { id: "lazy-lcp-image", severity: "FAIL", kinds: ["markup"], re: /<img\b(?=[^>]*\bloading\s*=\s*["'{]*lazy)(?=[^>]*\bfetch[Pp]riority\s*=\s*["'{]*high)[^>]*>/gi,
    message: "The image that is most likely the largest paint is marked both high priority and lazy. Never lazy-load the LCP image: remove loading=lazy." },
];

function volatileSystemPrompt(file, text) {
  if (!/anthropic|messages\.create|claude/i.test(text)) return [];
  const out = [];
  const volatile = /\bnew Date\(|\bDate\.now\(|\bdatetime\.(?:now|utcnow)\(|\buuid|randomUUID|time\.time\(\)/i;
  for (const m of text.matchAll(/\bsystem\w*\s*[:=]\s*[\[`'"{f]/gi)) {
    // the block that follows, up to the messages list or about 600 characters
    let block = text.slice(m.index, m.index + 600);
    const end = block.search(/;|\bmessages\s*[:=]/);
    if (end > 0) block = block.slice(0, end);
    const v = volatile.exec(block);
    if (v) {
      out.push(finding("volatile-system-prompt", "WARN", file, text, m.index + v.index, "A timestamp or random id inside the system prompt changes the cached prefix every request, so prompt caching never hits. Keep the system prompt and tool list byte-identical and put volatile text after the last cache breakpoint."));
    }
  }
  return out;
}

function blockingScript(file, text) {
  if (!/\.html?$/i.test(file)) return [];
  const headEnd = text.search(/<\/head>/i);
  const limit = headEnd === -1 ? text.length : headEnd;
  const out = [];
  for (const m of text.matchAll(/<script\b[^>]*\bsrc\s*=[^>]*>/gi)) {
    if (m.index > limit) break;
    if (!/\b(?:async|defer)\b|type\s*=\s*["']module["']/i.test(m[0])) {
      out.push(finding("blocking-script", "WARN", file, text, m.index, "A synchronous script in <head> blocks rendering until it downloads and runs. Add defer (or async), or move it to the end of <body>."));
    }
  }
  return out;
}

function imgDimensions(file, text) {
  const out = [];
  for (const m of text.matchAll(/<img\b[^>]*>/g)) {
    const tag = m[0];
    if (/\{\s*\.\.\./.test(tag) || /aspect-ratio/.test(tag)) continue;
    if (!/\bwidth\s*=/.test(tag) || !/\bheight\s*=/.test(tag)) {
      out.push(finding("img-no-dimensions", "WARN", file, text, m.index, "An <img> without width and height (or an aspect-ratio) reserves no space, so the page shifts when it loads (CLS). Set both attributes or an aspect-ratio."));
    }
  }
  return out;
}

function fontDisplay(file, text) {
  const out = [];
  for (const m of text.matchAll(/@font-face\s*\{[^}]*\}/g)) {
    const d = /font-display\s*:\s*([a-z-]+)/.exec(m[0]);
    if (!d) out.push(finding("font-display", "WARN", file, text, m.index, "@font-face with no font-display uses the browser default, which can hide text while the font loads. Use swap or optional, and preload the critical font."));
    else if (d[1] === "block" || d[1] === "auto") out.push(finding("font-display", "WARN", file, text, m.index, `font-display: ${d[1]} can leave text invisible while the font loads. Use swap or optional.`));
  }
  return out;
}

function sqlitePragmas(file, text) {
  if (!/sqlite3\.connect\(|better-sqlite3|new Database\(|sqlite3\.Database|aiosqlite\.connect|sqlite:\/\//i.test(text)) return [];
  const missing = [];
  if (!/journal_mode\s*=\s*WAL/i.test(text)) missing.push("journal_mode=WAL");
  if (!/foreign_keys\s*=\s*(?:ON|1|true)/i.test(text)) missing.push("foreign_keys=ON");
  if (!/busy_timeout/i.test(text)) missing.push("busy_timeout");
  if (missing.length === 0) return [];
  const m = /sqlite3\.connect\(|better-sqlite3|new Database\(|sqlite3\.Database|aiosqlite\.connect|sqlite:\/\//i.exec(text);
  return [finding("sqlite-pragmas", "WARN", file, text, m.index, `SQLite connection with no ${missing.join(", ")} in this file. foreign_keys is OFF by default per connection; WAL lets readers and writers overlap (not over a network filesystem); a busy_timeout avoids instant "database is locked" errors.`)];
}

function applyRule(rule, file, text) {
  if (rule.file && !rule.file(text)) return [];
  const out = [];
  for (const m of text.matchAll(rule.re)) {
    if (rule.test && !rule.test(m)) continue;
    out.push(finding(rule.id, rule.severity, file, text, m.index, rule.message));
  }
  return out;
}

function suppressions(text) {
  const found = [];
  for (const m of text.matchAll(/perf-allow:\s*([a-z0-9-]+)\s*--\s*([^*\n>]*)/g)) {
    found.push({ rule: m[1], line: lineOf(text, m.index), reasonChars: m[2].replace(/\s/g, "").length });
  }
  return found;
}

export function scanText(file, text) {
  const kinds = kindsOf(file);
  if (kinds.size === 0) return [];
  const sqlText = kinds.has("sql") || /CREATE\s+TABLE/i.test(text);
  const effective = new Set(kinds);
  if (sqlText) effective.add("sql");
  let findings = [];
  if (kinds.has("js")) findings.push(...jsNPlusOne(file, text));
  if (kinds.has("py")) findings.push(...pyNPlusOne(file, text), ...asyncBlocking(file, text));
  if (kinds.has("markup")) findings.push(...imgDimensions(file, text));
  if (kinds.has("css")) findings.push(...fontDisplay(file, text), ...blockingScript(file, text));
  if (kinds.has("js") || kinds.has("py")) findings.push(...sqlitePragmas(file, text), ...volatileSystemPrompt(file, text));
  for (const rule of RULES) {
    if (rule.kinds.some((k) => effective.has(k))) findings.push(...applyRule(rule, file, text));
  }
  const seen = new Set();
  findings = findings.filter((f) => !seen.has(`${f.rule}:${f.line}`) && seen.add(`${f.rule}:${f.line}`));
  const allowed = suppressions(text);
  findings = findings.filter((f) => !allowed.some((s) => s.rule === f.rule && f.line >= s.line && f.line <= s.line + 2));
  for (const s of allowed) {
    if (s.reasonChars < MIN_REASON_CHARS) {
      findings.push({ rule: "suppression-no-reason", severity: "WARN", file, line: s.line, message: `perf-allow for ${s.rule} needs a reason of at least ${MIN_REASON_CHARS} characters.` });
    }
  }
  return findings.sort((a, b) => a.line - b.line);
}

function walk(path, out) {
  const st = statSync(path);
  if (st.isDirectory()) {
    for (const name of readdirSync(path)) if (!SKIP_DIRS.has(name)) walk(join(path, name), out);
  } else if (st.size <= MAX_BYTES && kindsOf(path).size > 0) {
    out.push(path);
  }
}

export function scanPaths(paths) {
  const files = [];
  for (const p of paths) {
    if (!existsSync(p)) throw new Error(`path not found: ${p}`);
    walk(p, files);
  }
  return files.flatMap((file) => scanText(file, readFileSync(file, "utf8")));
}

export function summarize(findings, { strict = false } = {}) {
  const fail = findings.filter((f) => f.severity === "FAIL").length;
  const warn = findings.filter((f) => f.severity === "WARN").length;
  return { fail, warn, exitCode: fail > 0 || (strict && warn > 0) ? 1 : 0 };
}

function main(argv) {
  const flags = new Set(argv.filter((a) => a.startsWith("--")));
  const paths = argv.filter((a) => !a.startsWith("--"));
  if (paths.length === 0) {
    console.error("usage: node perf-scan.mjs <file-or-folder>... [--json] [--strict]");
    return 2;
  }
  let findings;
  try {
    findings = scanPaths(paths);
  } catch (error) {
    console.error(error.message);
    return 2;
  }
  const summary = summarize(findings, { strict: flags.has("--strict") });
  if (flags.has("--json")) {
    console.log(JSON.stringify({ summary, findings }, null, 2));
  } else {
    for (const f of findings) console.log(`${f.severity} ${f.rule} ${f.file}:${f.line} ${f.message}`);
    console.log(`perf-scan: ${summary.fail} FAIL, ${summary.warn} WARN (a smoke alarm, not a profiler)`);
  }
  return summary.exitCode;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  process.exitCode = main(process.argv.slice(2));
}
