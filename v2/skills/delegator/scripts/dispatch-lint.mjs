#!/usr/bin/env node
// scripts/dispatch-lint.mjs -- check a set of worker prompts against the delegator playbook. A format and consistency
// check on a dispatch plan, not a judge of whether fanning out is the right call.
//
//   node scripts/dispatch-lint.mjs <dispatch.md | folder>... [--max-workers N] [--json] [--strict]
//
// Exit 1 on any FAIL (with --strict, any WARN too). Dependency-free, Node 18+, reads files only. A dispatch file holds one
// block per worker, each starting with a heading such as "## WORKER W1" (or a line of "---") and using the playbook
// template fields: OBJECTIVE, OWNS, DO NOT TOUCH, CONTEXT YOU NEED, DEPENDS ON, OUTPUT FORMAT, DONE WHEN, MODEL (and an
// optional ROLE and ID). A block headed LEAD or INTEGRATION describes what the lead does after fan-in.
//
// It can check: required fields; file ownership that collides between workers that can run at the same time; shared
// wiring handed to a worker instead of the lead; a worker told to touch what it owns; dangling or circular DEPENDS ON;
// back-references a worker cannot resolve ("as discussed", "see above"); done-when that cannot be verified; report
// output with no size cap; shared ports; the worker count; and a missing integration gate. It cannot tell whether the
// work should be split at all (tightly coupled changes usually should not), whether two workers will make conflicting
// design decisions, or whether a worker's context is the right context. Those need a reader.
//
// The default worker cap of 4 is the playbook's own rule (the serial remainder dominates past a handful of workers); Claude
// Code's default concurrency limit is 20. Pass --max-workers to match your setup.
//
// Suppress one finding with a reason of 10+ characters on the same line or the line above:
//   <!-- dispatch-allow: owns-overlap -- both only append to CHANGELOG.md in different sections -->
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { extname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const REQUIRED = ["objective", "owns", "do not touch", "output format", "done when"];
const EXPECTED = ["context you need", "depends on"];
const DEFAULT_MAX_WORKERS = 4;
const MIN_REASON_CHARS = 10;
const SKIP_DIRS = new Set(["node_modules", ".git", "dist", "build", ".next", "coverage"]);
const FIELD_RE = /^\s*(?:[-*]\s*)?(ROLE|OBJECTIVE|OWNS(?:\s*\([^)]*\))?|DO NOT TOUCH|CONTEXT YOU NEED|CONTEXT|DEPENDS ON|OUTPUT FORMAT|OUTPUT|DONE WHEN|MODEL|ID)\s*:\s*(.*)$/i;
const HEADING_RE = /^\s*(?:#{1,4}\s*)?(WORKER|TASK|LEAD|INTEGRATION)\b[\s:.-]*([\w.-]*)\s*(.*)$/i;
const WIRING = /(^|\/)(package(-lock)?\.json|pnpm-lock\.yaml|yarn\.lock|pyproject\.toml|requirements\.txt|Cargo\.toml|go\.mod|urls\.py|routes?\.\w+|router\.\w+|ipc-contract\.\w+|(di|container)\.\w+)$|(^|\/)\.github\/workflows\/|(^|\/)(ci|pipeline)\.ya?ml$|^(src\/)?(main|index|app)\.\w+$/i;
const BROAD = /^(\.|\/|\*|\*\*|src|src\/|src\/\*\*?|\.\/|\*\*\/\*)$/;
const BACKREF = /\b(as discussed|see above|as mentioned( earlier| above)?|as we agreed|as before|previous conversation|earlier conversation|per our discussion|same as last time|continue where (we|you) left|you know the|the usual)\b/i;
const VAGUE_DONE = /\b(works?|working|is done|complete[d]?|properly|correctly|looks (right|good)|as expected|finished|all good)\b/i;
const BLOAT = /\b(report|summary|summari[sz]e|explain|describe|narrative|write-?up|findings)\b/i;
const CAPPED = /\b(diff|patch|json|bullets?|table|checklist|lines?|words?|under \d+|at most \d+|no more than \d+|max(?:imum)? \d+|<=\s*\d+|≤\s*\d+|one line|single line|status)\b/i;

const f = (rule, severity, line, message) => ({ rule, severity, line, message });
const norm = (p) => p.replace(/`/g, "").replace(/\\/g, "/").replace(/^\.\//, "").trim();
const samePathOrParent = (a, b) => a === b || b.startsWith(a.endsWith("/") ? a : `${a}/`) || a.startsWith(b.endsWith("/") ? b : `${b}/`);

// ---------- parsing ----------
function parse(text) {
  const lines = text.split("\n");
  const blocks = [];
  let cur = null;
  let field = null;
  const open = (kind, id, line, title) => {
    cur = { kind, id: id || null, line, title, fields: {}, fieldLines: {}, body: [] };
    blocks.push(cur);
    field = null;
  };
  lines.forEach((l, i) => {
    const h = HEADING_RE.exec(l);
    if (h && (/^\s*#{1,4}\s/.test(l) || /^\s*(WORKER|LEAD|INTEGRATION)\b/i.test(l)) && !FIELD_RE.test(l)) {
      const kind = /^(lead|integration)$/i.test(h[1]) ? "lead" : "worker";
      open(kind, h[2], i + 1, l.trim());
      return;
    }
    if (/^\s*---+\s*$/.test(l)) {
      if (cur && cur.kind === "worker" && Object.keys(cur.fields).length) cur = null;
      field = null;
      return;
    }
    const m = FIELD_RE.exec(l);
    if (m) {
      if (!cur) open("worker", null, i + 1, "");
      const name = m[1].toLowerCase().replace(/\s*\(.*\)$/, "");
      const canon = name === "context" ? "context you need" : name === "output" ? "output format" : name;
      if (canon === "id") cur.id = m[2].trim().replace(/[^\w.-]/g, "") || cur.id;
      cur.fields[canon] = m[2].trim();
      cur.fieldLines[canon] = i + 1;
      field = canon;
      cur.body.push(l);
      return;
    }
    if (cur) {
      cur.body.push(l);
      if (field && l.trim() !== "") cur.fields[field] += ` ${l.trim()}`;
    }
  });
  let n = 0;
  for (const b of blocks) if (b.kind === "worker") b.id = b.id || `W${++n}`;
  return blocks;
}

function ownedPaths(w) {
  return (w.fields.owns ?? "").split(/[,;]|\s+and\s+/).map(norm).filter((x) => x && !/^(none|n\/a|nothing)$/i.test(x));
}

// ---------- checks ----------
export function lintDispatch(text, { maxWorkers = DEFAULT_MAX_WORKERS } = {}) {
  const lines = text.split("\n");
  const blocks = parse(text);
  const workers = blocks.filter((b) => b.kind === "worker" && Object.keys(b.fields).length > 0);
  let out = [];
  if (workers.length === 0) {
    return [f("no-workers", "FAIL", 1, "No worker prompts found. Start each with a heading such as \"## WORKER W1\" and use the playbook template fields.")];
  }
  const byId = new Map();
  for (const w of workers) {
    if (byId.has(w.id)) out.push(f("duplicate-worker-id", "FAIL", w.line, `${w.id} is defined twice.`));
    byId.set(w.id, w);
  }

  for (const w of workers) {
    const missing = REQUIRED.filter((k) => !w.fields[k]);
    if (missing.length) out.push(f("worker-field-missing", "FAIL", w.line, `${w.id} is missing: ${missing.map((m) => m.toUpperCase()).join(", ")}. A worker starts with nothing, so each prompt carries the full template.`));
    const soft = EXPECTED.filter((k) => !w.fields[k]);
    if (soft.length) out.push(f("worker-field-recommended", "WARN", w.line, `${w.id} has no ${soft.map((m) => m.toUpperCase()).join(" or ")}. Write "DEPENDS ON: none" explicitly, and give the context the worker cannot get elsewhere.`));
    const all = w.body.join("\n") + " " + w.title;
    const back = BACKREF.exec(all);
    if (back) out.push(f("back-reference", "FAIL", w.line, `${w.id} says "${back[0]}". The worker has no "above" and no earlier conversation; put the content in the prompt.`));
    const dw = w.fields["done when"];
    if (dw && !/`[^`]+`/.test(dw) && !/\d/.test(dw) && (dw.length < 20 || VAGUE_DONE.test(dw))) out.push(f("done-when-vague", "WARN", w.fieldLines["done when"] ?? w.line, `${w.id} "done when" is not checkable ("${dw.slice(0, 40)}"). Name a command, a test, a status code or a number.`));
    const of = w.fields["output format"];
    if (of && BLOAT.test(of) && !CAPPED.test(of)) out.push(f("report-bloat", "WARN", w.fieldLines["output format"] ?? w.line, `${w.id} asks for a report with no size cap. Many narrative reports fill the lead's context; ask for a diff or a short structured result.`));
    const owned = ownedPaths(w);
    for (const p of owned) {
      if (BROAD.test(p)) out.push(f("owns-too-broad", "WARN", w.fieldLines.owns ?? w.line, `${w.id} owns "${p}", which is too broad to prove disjoint from its siblings. Name exact files or narrow directories.`));
      if (WIRING.test(p)) out.push(f("shared-wiring-owned", "FAIL", w.fieldLines.owns ?? w.line, `${w.id} owns shared wiring (${p}). Exactly one owner, the lead, edits manifests, entry points, route registration, CI config and shared contracts, before or after the parallel set.`));
    }
    const dnt = (w.fields["do not touch"] ?? "").split(/[,;]|\s+and\s+/).map(norm).filter(Boolean);
    for (const p of owned) if (dnt.some((d) => d && samePathOrParent(p, d) && p === d)) out.push(f("owns-and-forbidden", "FAIL", w.fieldLines["do not touch"] ?? w.line, `${w.id} owns ${p} and also lists it under DO NOT TOUCH.`));
    w.deps = [...(w.fields["depends on"] ?? "").matchAll(/\b[Ww]\d+(?:\.\d+)?\b|\b[A-Z][A-Z0-9_-]{1,}\d\b/g)].map((m) => m[0]);
    for (const d of w.deps) {
      const target = [...byId.keys()].find((k) => k.toLowerCase() === d.toLowerCase());
      if (!target) out.push(f("dangling-depends", "FAIL", w.fieldLines["depends on"] ?? w.line, `${w.id} depends on ${d}, which is not a worker in this dispatch.`));
    }
    w.deps = w.deps.map((d) => [...byId.keys()].find((k) => k.toLowerCase() === d.toLowerCase())).filter(Boolean);
  }

  // cycles and ancestors
  const state = new Map();
  const stack = [];
  const visit = (w) => {
    state.set(w.id, 1);
    stack.push(w.id);
    for (const d of w.deps) {
      if (d === w.id) { out.push(f("dependency-cycle", "FAIL", w.line, `${w.id} depends on itself.`)); continue; }
      if (state.get(d) === 1) out.push(f("dependency-cycle", "FAIL", w.line, `Dependency cycle: ${[...stack.slice(stack.indexOf(d)), d].join(" -> ")}.`));
      else if (!state.get(d)) visit(byId.get(d));
    }
    stack.pop();
    state.set(w.id, 2);
  };
  for (const w of workers) if (!state.get(w.id)) visit(w);
  const ancestors = (w, seen = new Set()) => {
    for (const d of w.deps) if (!seen.has(d)) { seen.add(d); ancestors(byId.get(d), seen); }
    return seen;
  };
  const anc = new Map(workers.map((w) => [w.id, ancestors(w)]));
  const parallel = (a, b) => !anc.get(a.id).has(b.id) && !anc.get(b.id).has(a.id);

  const unnamed = new Map();
  for (let i = 0; i < workers.length; i++) {
    for (let j = i + 1; j < workers.length; j++) {
      const a = workers[i], b = workers[j];
      const pa = ownedPaths(a), pb = ownedPaths(b);
      const shared = pa.filter((x) => pb.some((y) => samePathOrParent(x, y)));
      if (shared.length) {
        out.push(parallel(a, b)
          ? f("owns-overlap", "FAIL", b.fieldLines.owns ?? b.line, `${a.id} and ${b.id} both own ${shared.join(", ")} and can run at the same time. Give the file one owner, merge the workers, or order them with DEPENDS ON.`)
          : f("owns-overlap-ordered", "WARN", b.fieldLines.owns ?? b.line, `${a.id} and ${b.id} both own ${shared.join(", ")}; they are ordered, so they cannot collide, but one owner per file is the rule.`));
      }
      if (parallel(a, b)) {
        const dntA = (a.fields["do not touch"] ?? "").toLowerCase();
        const dntB = (b.fields["do not touch"] ?? "").toLowerCase();
        const missA = pb.filter((p) => !dntA.includes(p.toLowerCase()));
        const missB = pa.filter((p) => !dntB.includes(p.toLowerCase()));
        if (missA.length) (unnamed.get(a.id) ?? unnamed.set(a.id, []).get(a.id)).push(`${b.id}: ${missA.slice(0, 2).join(", ")}`);
        if (missB.length) (unnamed.get(b.id) ?? unnamed.set(b.id, []).get(b.id)).push(`${a.id}: ${missB.slice(0, 2).join(", ")}`);
        const portsA = new Set((a.body.join(" ").match(/(?:localhost|127\.0\.0\.1|--port[ =]|PORT=|:)(\d{4,5})\b/g) ?? []).map((x) => x.replace(/\D/g, "")));
        const shared2 = (b.body.join(" ").match(/(?:localhost|127\.0\.0\.1|--port[ =]|PORT=|:)(\d{4,5})\b/g) ?? []).map((x) => x.replace(/\D/g, "")).filter((x) => portsA.has(x));
        if (shared2.length) out.push(f("shared-runtime-resource", "WARN", b.line, `${a.id} and ${b.id} both use port ${shared2[0]}. Worktrees isolate files, not ports, databases or caches; give each worker its own.`));
      }
    }
  }

  for (const [id, list] of unnamed) {
    const w = byId.get(id);
    out.push(f("do-not-touch-incomplete", "WARN", w.fieldLines["do not touch"] ?? w.line, `${id} does not name the files of ${list.length} parallel sibling${list.length > 1 ? "s" : ""} under DO NOT TOUCH (${list.slice(0, 3).join("; ")}${list.length > 3 ? "; ..." : ""}).`));
  }
  if (workers.length > maxWorkers) out.push(f("worker-count", "WARN", workers[0].line, `${workers.length} workers is over the cap of ${maxWorkers} (the serial remainder dominates past a handful; pass --max-workers if your setup differs).`));
  const lead = blocks.some((b) => b.kind === "lead") || /^\s*(LEAD|INTEGRATION|FAN-?IN)\s*:/im.test(text);
  const gate = /`[^`]*(test|build|lint|check|verify)[^`]*`/i.test(blocks.filter((b) => b.kind === "lead").map((b) => b.body.join(" ")).join(" ") + " " + (/^\s*(LEAD|INTEGRATION|FAN-?IN)\s*:.*$/im.exec(text)?.[0] ?? ""));
  if (workers.length >= 2 && !(lead && gate)) out.push(f("no-integration-gate", "WARN", 1, "No lead or integration step with a build or test command. A worker's \"done\" does not mean the whole is done: the lead integrates and runs the checks after every fan-in."));
  if (workers.length === 1 && workers[0].deps.length === 0) {
    const w = workers[0];
    if (ownedPaths(w).length === 1 && (w.fields.objective ?? "").split(/\s+/).length < 12) out.push(f("trivial-worker", "WARN", w.line, "One worker for one file and a one-line objective: the lead should just do it. Prompt writing and integration cost more than they save."));
  }

  // waves
  const depth = new Map();
  const wave = (w) => { if (depth.has(w.id)) return depth.get(w.id); depth.set(w.id, 1); const d = 1 + Math.max(0, ...w.deps.map((x) => wave(byId.get(x)))); depth.set(w.id, d); return d; };
  const byWave = new Map();
  for (const w of workers) { const k = wave(w); byWave.set(k, [...(byWave.get(k) ?? []), w.id]); }
  if (workers.length > 1) out.push(f("waves", "INFO", 1, [...byWave.entries()].sort((a, b) => a[0] - b[0]).map(([k, ids]) => `Wave ${k}: ${ids.join(", ")}`).join(" | ")));

  // suppression
  const allowed = [];
  lines.forEach((l, i) => {
    const m = /dispatch-allow:\s*([a-z0-9-]+)\s*--\s*([^>\n]*)/.exec(l);
    if (m) allowed.push({ rule: m[1], line: i + 1, chars: m[2].replace(/\s/g, "").length });
  });
  const seen = new Set();
  out = out.filter((x) => !seen.has(`${x.rule}:${x.line}:${x.message}`) && seen.add(`${x.rule}:${x.line}:${x.message}`));
  out = out.filter((x) => !allowed.some((s) => s.rule === x.rule && (x.line === s.line || x.line === s.line + 1)));
  for (const s of allowed) if (s.chars < MIN_REASON_CHARS) out.push(f("suppression-no-reason", "WARN", s.line, `dispatch-allow for ${s.rule} needs a reason of at least ${MIN_REASON_CHARS} characters.`));
  return out.sort((a, b) => a.line - b.line);
}

// ---------- files ----------
function walk(path, out) {
  const st = statSync(path);
  if (st.isDirectory()) {
    for (const name of readdirSync(path)) if (!SKIP_DIRS.has(name)) walk(join(path, name), out);
  } else if (extname(path).toLowerCase() === ".md") {
    out.push(path);
  }
}

export function lintPaths(paths, opts = {}) {
  const out = [];
  for (const p of paths) {
    if (!existsSync(p)) throw new Error(`path not found: ${p}`);
    const isDir = statSync(p).isDirectory();
    const files = [];
    if (isDir) walk(p, files); else files.push(p);
    for (const file of files) {
      const text = readFileSync(file, "utf8");
      if (isDir && !/^\s*OBJECTIVE\s*:/im.test(text)) continue;
      for (const x of lintDispatch(text, opts)) out.push({ ...x, file });
    }
  }
  return out;
}

export function summarize(findings, { strict = false } = {}) {
  const fail = findings.filter((x) => x.severity === "FAIL").length;
  const warn = findings.filter((x) => x.severity === "WARN").length;
  const info = findings.filter((x) => x.severity === "INFO").length;
  return { fail, warn, info, exitCode: fail > 0 || (strict && warn > 0) ? 1 : 0 };
}

function main(argv) {
  const flags = new Set(argv.filter((a) => a.startsWith("--") && !/^--max-workers$/.test(a)));
  const mw = argv.indexOf("--max-workers");
  const maxWorkers = mw >= 0 ? Number(argv[mw + 1]) : DEFAULT_MAX_WORKERS;
  const paths = argv.filter((a, i) => !a.startsWith("--") && !(mw >= 0 && i === mw + 1));
  if (paths.length === 0 || !Number.isInteger(maxWorkers) || maxWorkers < 1) {
    console.error("usage: node dispatch-lint.mjs <dispatch.md | folder>... [--max-workers N] [--json] [--strict]");
    return 2;
  }
  let findings;
  try {
    findings = lintPaths(paths, { maxWorkers });
  } catch (error) {
    console.error(error.message);
    return 2;
  }
  const summary = summarize(findings, { strict: flags.has("--strict") });
  if (flags.has("--json")) {
    console.log(JSON.stringify({ summary, findings }, null, 2));
  } else {
    for (const x of findings) console.log(`${x.severity} ${x.rule} ${x.file}:${x.line} ${x.message}`);
    console.log(`dispatch-lint: ${summary.fail} FAIL, ${summary.warn} WARN (format and consistency only; not a judge of whether to fan out)`);
  }
  return summary.exitCode;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  process.exitCode = main(process.argv.slice(2));
}
