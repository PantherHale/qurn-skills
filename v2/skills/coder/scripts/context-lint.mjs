#!/usr/bin/env node
// scripts/context-lint.mjs -- lint the instruction files an agent loads every session (CLAUDE.md, AGENTS.md), and
// check that the files and imports they point to still exist. Not a judge of whether the instructions are good.
//
//   node scripts/context-lint.mjs <file-or-folder>... [--md] [--json] [--strict]
//
// Default targets: CLAUDE.md, CLAUDE.local.md, AGENTS.md (the files loaded into every session). With --md every
// markdown file is checked for broken path references only. Exit 1 on any FAIL (with --strict, any WARN too).
// Dependency-free, Node 18+, reads files only.
//
// Rules come from the Claude Code memory and best-practices docs (target under 200 lines per CLAUDE.md; @imports
// resolve relative to the importing file, four hops at most, and are skipped inside code spans; the most useful line is
// the command that runs the check; leave out what the agent could find by reading the code) and from the AGENTS.md
// format page. Basis for each rule is in references/agent-cost-and-context-reference.md.
//
// Suppress one finding with a reason of 10+ characters on the same line or up to 2 lines above it:
//   <!-- ctx-allow: broken-path -- file is generated at build time -->
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { basename, dirname, extname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const MAX_LINES = 200;
const MAX_IMPORT_DEPTH = 4;
const MIN_REASON_CHARS = 10;
const MIN_DUP_CHARS = 30;
const SKIP_DIRS = new Set(["node_modules", ".git", "dist", "build", ".next", ".cache", "coverage", ".venv", "venv", "vendor"]);
const CONTEXT_NAMES = /^(?:CLAUDE|CLAUDE\.local|AGENTS)\.md$/;
const PATH_EXT = "md|mjs|cjs|js|ts|tsx|jsx|json|py|sh|yml|yaml|toml|txt|html|css|sql";
const PATH_RE = new RegExp(`^(?:\\.{1,2}/)?[\\w.@-]+(?:/[\\w.@-]+)+\\.(?:${PATH_EXT})$`);
const CHECK_WORDS = /\b(?:npm|pnpm|yarn|bun)\s+(?:run\s+)?(?:test|lint|build|check|typecheck)\b|\bpytest\b|\bgo\s+test\b|\bcargo\s+(?:test|check|clippy)\b|\bmake\s+(?:test|check|lint)\b|\bnode\s+--test\b|\btsc\b|\bruff\b|\beslint\b|\bvitest\b|\bjest\b|\bplaywright\s+test\b/;
const VAGUE = /\b(?:write clean code|follow best practices|be careful|high[- ]quality code|production[- ]ready code|use common sense|write good code|keep it simple and clean)\b/i;

const lineOf = (text, index) => text.slice(0, index).split("\n").length;
const finding = (rule, severity, file, text, index, message) => ({ rule, severity, file, line: lineOf(text, index), message });

export function isContextFile(file) {
  return CONTEXT_NAMES.test(basename(file));
}

function findRoot(start) {
  let dir = resolve(start);
  for (let i = 0; i < 12; i++) {
    if (existsSync(join(dir, ".git"))) return dir;
    const up = dirname(dir);
    if (up === dir) break;
    dir = up;
  }
  return null;
}

// text with fenced blocks and inline code kept but HTML comments blanked, for @import detection we also blank code
const blank = (s) => s.replace(/[^\n]/g, " ");
const withoutComments = (t) => t.replace(/<!--[\s\S]*?-->/g, blank);
const withoutCode = (t) => withoutComments(t).replace(/```[\s\S]*?```/g, blank).replace(/`[^`\n]*`/g, blank);

function resolvesSomewhere(ref, fromDir, root) {
  const clean = ref.replace(/[#?].*$/, "");
  if (existsSync(resolve(fromDir, clean))) return true;
  if (root && existsSync(resolve(root, clean.replace(/^\.\//, "")))) return true;
  // a skill's references point at paths relative to the skill folder (the nearest ancestor holding SKILL.md)
  let dir = resolve(fromDir);
  for (let i = 0; i < 6; i++) {
    if (existsSync(join(dir, "SKILL.md"))) return existsSync(resolve(dir, clean.replace(/^\.\//, "")));
    const up = dirname(dir);
    if (up === dir) break;
    dir = up;
  }
  return false;
}

// ---------- rules ----------
function tooLong(file, text) {
  if (!isContextFile(file)) return [];
  const n = text.split("\n").length;
  return n > MAX_LINES
    ? [finding("too-long", "WARN", file, text, 0, `${n} lines; the memory docs target under ${MAX_LINES} per file. Longer files cost tokens every session and bury the rules that matter. Move detail into imported or on-demand files.`)]
    : [];
}

function brokenImports(file, text, root) {
  if (!isContextFile(file)) return [];
  const out = [];
  const visible = withoutCode(text);
  for (const m of visible.matchAll(/(?:^|\s)@((?:\\ |[^\s`'"()<>])+\.[A-Za-z0-9]+)/g)) {
    const ref = m[1].replace(/\\ /g, " ");
    if (/^[\w.+-]+@[\w.-]+$/.test(ref) || /^https?:/.test(ref) || /^\w+$/.test(ref)) continue;
    if (!/[\\/]|^~/.test(ref) && !/\.(?:md|txt|json|ya?ml)$/i.test(ref)) continue;
    if (ref.startsWith("~")) continue;
    if (!resolvesSomewhere(ref, dirname(file), root)) {
      out.push(finding("broken-import", "FAIL", file, text, m.index + 1, `@${ref} points to a file that does not exist, so that guidance silently never loads.`));
    }
  }
  return out;
}

function brokenPaths(file, text, root) {
  const out = [];
  const visible = withoutComments(text);
  for (const m of visible.matchAll(/`([^`\n]+)`/g)) {
    const ref = m[1].trim();
    if (!PATH_RE.test(ref) || /[<>*{}$]/.test(ref) || /^https?:/.test(ref)) continue;
    if (!resolvesSomewhere(ref, dirname(file), root)) {
      out.push(finding("broken-path", "WARN", file, text, m.index, `\`${ref}\` does not exist relative to this file or the repository root. A stale path sends an agent hunting, or into the wrong file.`));
    }
  }
  return out;
}

function noCheckCommand(file, text) {
  if (!isContextFile(file)) return [];
  return CHECK_WORDS.test(text) ? [] : [finding("no-check-command", "WARN", file, text, 0, "No test, lint, build or typecheck command found. The docs call the command that runs the check the most useful line you can give an agent, because it can then verify its own work.")];
}

function duplicateLines(file, text) {
  if (!isContextFile(file)) return [];
  const out = [];
  const seen = new Map();
  let offset = 0;
  for (const l of text.split("\n")) {
    const key = l.trim().toLowerCase();
    if (key.length >= MIN_DUP_CHARS && !/^[#>|`-]{1,3}\s*$/.test(key)) {
      if (seen.has(key)) out.push(finding("duplicate-line", "WARN", file, text, offset, `Repeats the line at line ${seen.get(key)}. Duplicates cost tokens and drift apart.`));
      else seen.set(key, lineOf(text, offset));
    }
    offset += l.length + 1;
  }
  return out;
}

function vagueRules(file, text) {
  if (!isContextFile(file)) return [];
  const out = [];
  let offset = 0;
  for (const l of text.split("\n")) {
    const m = VAGUE.exec(l);
    if (m) out.push(finding("vague-rule", "WARN", file, text, offset, `"${m[0]}" tells an agent nothing it would not do anyway. State the checkable rule instead (a command, a naming rule, a forbidden pattern).`));
    offset += l.length + 1;
  }
  return out;
}

function importDepth(file, text, root) {
  if (!isContextFile(file)) return [];
  const seen = new Set([resolve(file)]);
  return importDepthInner(file, text, root, seen, 1).map((f) => ({ ...f, file, line: 1 }));
}

function importDepthInner(file, text, root, seen, depth) {
  const out = [];
  for (const m of withoutCode(text).matchAll(/(?:^|\s)@((?:\\ |[^\s`'"()<>])+\.(?:md|txt))/g)) {
    const ref = m[1].replace(/\\ /g, " ");
    const target = [resolve(dirname(file), ref), root ? resolve(root, ref) : null].find((p) => p && existsSync(p));
    if (!target || seen.has(target)) continue;
    if (depth > MAX_IMPORT_DEPTH) {
      out.push({ rule: "import-too-deep", severity: "WARN", message: `An import chain here is more than ${MAX_IMPORT_DEPTH} hops deep; the loader stops at ${MAX_IMPORT_DEPTH}, so the deepest file will not load.` });
      continue;
    }
    seen.add(target);
    out.push(...importDepthInner(target, readFileSync(target, "utf8"), root, seen, depth + 1));
  }
  return out;
}

function suppressions(text) {
  const found = [];
  for (const m of text.matchAll(/ctx-allow:\s*([a-z0-9-]+)\s*--\s*([^*\n>]*)/g)) {
    found.push({ rule: m[1], line: lineOf(text, m.index), reasonChars: m[2].replace(/\s/g, "").length });
  }
  return found;
}

export function scanText(file, text, { root = null, allMd = false } = {}) {
  const isCtx = isContextFile(file);
  if (!isCtx && !(allMd && extname(file).toLowerCase() === ".md")) return [];
  const rootDir = root ?? findRoot(dirname(resolve(file)));
  let findings = [
    ...tooLong(file, text), ...brokenImports(file, text, rootDir), ...brokenPaths(file, text, rootDir),
    ...noCheckCommand(file, text), ...duplicateLines(file, text), ...vagueRules(file, text),
    ...importDepth(file, text, rootDir),
  ];
  const seen = new Set();
  findings = findings.filter((f) => !seen.has(`${f.rule}:${f.line}:${f.message}`) && seen.add(`${f.rule}:${f.line}:${f.message}`));
  const allowed = suppressions(text);
  findings = findings.filter((f) => !allowed.some((s) => s.rule === f.rule && f.line >= s.line && f.line <= s.line + 2));
  for (const s of allowed) {
    if (s.reasonChars < MIN_REASON_CHARS) {
      findings.push({ rule: "suppression-no-reason", severity: "WARN", file, line: s.line, message: `ctx-allow for ${s.rule} needs a reason of at least ${MIN_REASON_CHARS} characters.` });
    }
  }
  return findings.sort((a, b) => a.line - b.line);
}

function walk(path, out, allMd) {
  const st = statSync(path);
  if (st.isDirectory()) {
    for (const name of readdirSync(path)) if (!SKIP_DIRS.has(name)) walk(join(path, name), out, allMd);
  } else if (isContextFile(path) || (allMd && extname(path).toLowerCase() === ".md")) {
    out.push(path);
  }
}

export function scanPaths(paths, { allMd = false } = {}) {
  const files = [];
  for (const p of paths) {
    if (!existsSync(p)) throw new Error(`path not found: ${p}`);
    walk(p, files, allMd);
  }
  return files.flatMap((file) => scanText(file, readFileSync(file, "utf8"), { allMd }));
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
    console.error("usage: node context-lint.mjs <file-or-folder>... [--md] [--json] [--strict]");
    return 2;
  }
  let findings;
  try {
    findings = scanPaths(paths, { allMd: flags.has("--md") });
  } catch (error) {
    console.error(error.message);
    return 2;
  }
  const summary = summarize(findings, { strict: flags.has("--strict") });
  if (flags.has("--json")) {
    console.log(JSON.stringify({ summary, findings }, null, 2));
  } else {
    for (const f of findings) console.log(`${f.severity} ${f.rule} ${f.file}:${f.line} ${f.message}`);
    console.log(`context-lint: ${summary.fail} FAIL, ${summary.warn} WARN (a linter for instruction files, not a judge of them)`);
  }
  return summary.exitCode;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  process.exitCode = main(process.argv.slice(2));
}
