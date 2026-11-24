#!/usr/bin/env node
// scripts/plan-lint.mjs -- check a twelve-part plan document against the format and quality rules in
// references/planner-playbook.md. A format and consistency check, not a judge of whether the plan is any good.
//
//   node scripts/plan-lint.mjs <plan.md | folder>... [--json] [--strict]
//
// Exit 1 on any FAIL (with --strict, any WARN too). Dependency-free, Node 18+, reads files only. A folder is searched
// for markdown files that contain a "## 1 PRODUCT BRIEF" heading.
//
// What it can check: all twelve headings; every task line has owns, depends, est, covers and done-when; every depends
// names a real task and the graph has no cycle; no file is owned by two tasks of one phase that could run in parallel;
// every Must requirement is covered by some task and every covers entry exists; estimates are three-point, add up and
// stay at or under 8 hours; risks and ADRs have every required field; NFRs carry a number. It also prints the critical
// path. What it cannot check: whether the scope is right, the estimates honest, the architecture sound, or the risks
// the real ones. Those need a reader (and, for a plan that will drive agents, a second reviewer who has not seen it).
//
// Suppress one finding with a reason of 10+ characters on the same line or the line above:
//   <!-- plan-allow: file-overlap -- both tasks only append to the same changelog -->
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { extname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const SECTIONS = [
  "PRODUCT BRIEF", "SCOPE", "USERS AND STORIES", "REQUIREMENTS", "ARCHITECTURE", "DECISIONS", "PHASES AND TASKS",
  "TEST STRATEGY", "SECURITY AND PERFORMANCE BUDGETS", "RISKS", "MILESTONES AND RELEASE", "OPEN QUESTIONS",
];
const TASK_FIELDS = ["owns", "depends", "est", "covers", "done when"];
const RISK_FIELDS = ["likelihood", "impact", "mitigation", "contingency", "owner"];
const ADR_FIELDS = ["Context", "Decision", "Consequences", "Alternatives"];
const MAX_TASK_HOURS = 8;
const HOURS_PER_DAY = 8;
const PERT_TOLERANCE_HOURS = 0.5;
const THREE_POINT_FROM_HOURS = 4;
const MIN_REASON_CHARS = 10;
const SKIP_DIRS = new Set(["node_modules", ".git", "dist", "build", ".next", "coverage"]);
const WIRING = /(^|\/)(package(-lock)?\.json|pnpm-lock\.yaml|yarn\.lock|pyproject\.toml|requirements\.txt|Cargo\.toml|go\.mod|urls\.py|routes?\.\w+|router\.\w+)$|(^|\/)migrations?\//i;

const f = (rule, severity, line, message) => ({ rule, severity, line, message });

// ---------- parsing ----------
function sections(lines) {
  const found = new Map();
  lines.forEach((l, i) => {
    const m = /^##\s+(\d+)\s+(.+?)\s*$/.exec(l);
    if (m) found.set(Number(m[1]), { title: m[2].toUpperCase(), start: i, end: lines.length });
  });
  const starts = [...found.values()].map((s) => s.start).sort((a, b) => a - b);
  for (const s of found.values()) {
    const next = starts.find((x) => x > s.start);
    s.end = next ?? lines.length;
  }
  return found;
}

function fields(text, names) {
  // "name: value | name: value" in order, tolerant of case
  const out = {};
  const parts = text.split("|").map((p) => p.trim());
  for (const p of parts) {
    const m = /^([a-z][a-z ]*?)\s*:\s*(.*)$/i.exec(p);
    if (m) out[m[1].toLowerCase()] = m[2].trim();
  }
  return { values: out, missing: names.filter((n) => !(n in out) || out[n] === "") };
}

function hoursOf(est) {
  const m = /^([\d.]+)\s*(h|hr|hrs|hours?|d|days?)\b(?:\s*\(\s*([\d.]+)\s*\/\s*([\d.]+)\s*\/\s*([\d.]+)\s*\))?/i.exec(est.trim());
  if (!m) return null;
  const k = /^d/i.test(m[2]) ? HOURS_PER_DAY : 1;
  const headline = Number(m[1]) * k;
  if (m[3] === undefined) return { headline, triple: null, pert: null };
  const [o, mm, p] = [Number(m[3]) * k, Number(m[4]) * k, Number(m[5]) * k];
  return { headline, triple: [o, mm, p], pert: (o + 4 * mm + p) / 6 };
}

const samePathOrParent = (a, b) => a === b || (a.endsWith("/") && b.startsWith(a)) || (b.endsWith("/") && a.startsWith(b)) || b.startsWith(`${a}/`) || a.startsWith(`${b}/`);
const normPath = (p) => p.replace(/`/g, "").replace(/\\/g, "/").replace(/^\.\//, "").trim();

// ---------- checks ----------
function checkSections(found) {
  const out = [];
  SECTIONS.forEach((name, i) => {
    const n = i + 1;
    const s = found.get(n);
    if (!s) out.push(f("missing-section", "FAIL", 0, `Section "## ${n} ${name}" is missing. A small plan still has all twelve headings, each one honest line.`));
    else if (s.title !== name) out.push(f("section-title", "WARN", s.start + 1, `Section ${n} is titled "${s.title}"; the playbook heading is "${name}".`));
  });
  return out;
}

function parseTasks(lines, found) {
  const sec = found.get(7);
  const tasks = [];
  const phases = [];
  if (!sec) return { tasks, phases };
  let phase = null;
  for (let i = sec.start + 1; i < sec.end; i++) {
    const l = lines[i];
    const ph = /^\s*(?:#+\s*)?PHASE\s+(\d+)\s*:?\s*(.*)$/i.exec(l);
    if (ph) {
      phase = { n: Number(ph[1]), line: i + 1, text: l, tasks: [], block: [] };
      phases.push(phase);
      continue;
    }
    if (phase) phase.block.push(l);
    const t = /^\s*(?:[-*]\s*)?(T\d+\.\d+)\b\s*(?:[|:])?\s*(.*)$/.exec(l);
    if (t) {
      const { values, missing } = fields(t[2], TASK_FIELDS);
      const task = { id: t[1], line: i + 1, phase: phase ? phase.n : null, values, missing, raw: t[2] };
      tasks.push(task);
      if (phase) phase.tasks.push(task);
    }
  }
  return { tasks, phases };
}

function checkTasks(tasks, phases, reqs) {
  const out = [];
  const byId = new Map();
  for (const t of tasks) {
    if (byId.has(t.id)) out.push(f("duplicate-task-id", "FAIL", t.line, `${t.id} is defined twice (first on line ${byId.get(t.id).line}).`));
    else byId.set(t.id, t);
  }
  for (const t of tasks) {
    if (t.missing.length) out.push(f("task-field-missing", "FAIL", t.line, `${t.id} is missing: ${t.missing.join(", ")}. Every task line carries owns, depends, est, covers and done when.`));
    t.deps = [...(t.values.depends ?? "").matchAll(/T\d+\.\d+/g)].map((m) => m[0]);
    for (const d of t.deps) {
      if (!byId.has(d)) out.push(f("dangling-dependency", "FAIL", t.line, `${t.id} depends on ${d}, which is not a task in this plan.`));
      if (d === t.id) out.push(f("dependency-cycle", "FAIL", t.line, `${t.id} depends on itself.`));
    }
  }
  // cycles (DFS)
  const state = new Map();
  const stack = [];
  const visit = (t) => {
    state.set(t.id, 1);
    stack.push(t.id);
    for (const d of t.deps) {
      const dep = byId.get(d);
      if (!dep || d === t.id) continue;
      if (state.get(d) === 1) out.push(f("dependency-cycle", "FAIL", t.line, `Dependency cycle: ${[...stack.slice(stack.indexOf(d)), d].join(" -> ")}.`));
      else if (!state.get(d)) visit(dep);
    }
    stack.pop();
    state.set(t.id, 2);
  };
  for (const t of tasks) if (!state.get(t.id)) visit(t);

  // ancestors, to know which tasks can run in parallel
  const ancestors = (t, seen = new Set()) => {
    for (const d of t.deps) {
      if (seen.has(d) || !byId.has(d)) continue;
      seen.add(d);
      ancestors(byId.get(d), seen);
    }
    return seen;
  };
  const anc = new Map(tasks.map((t) => [t.id, ancestors(t)]));

  for (const ph of phases) {
    for (let i = 0; i < ph.tasks.length; i++) {
      for (let j = i + 1; j < ph.tasks.length; j++) {
        const a = ph.tasks[i], b = ph.tasks[j];
        const fa = (a.values.owns ?? "").split(/[,;]/).map(normPath).filter((x) => x && !/^(none|n\/a)$/i.test(x));
        const fb = (b.values.owns ?? "").split(/[,;]/).map(normPath).filter((x) => x && !/^(none|n\/a)$/i.test(x));
        const shared = fa.filter((x) => fb.some((y) => samePathOrParent(x, y)));
        if (shared.length === 0) continue;
        const ordered = anc.get(a.id).has(b.id) || anc.get(b.id).has(a.id);
        out.push(ordered
          ? f("file-overlap-ordered", "WARN", b.line, `${a.id} and ${b.id} both own ${shared.join(", ")}; they are ordered by depends so they cannot collide, but one owner per file is the rule.`)
          : f("file-overlap", "FAIL", b.line, `${a.id} and ${b.id} both own ${shared.join(", ")} and can run in parallel. Merge the tasks, order them with depends, or give the file one owner.`));
      }
    }
    // shared wiring belongs to the last task of its phase
    ph.tasks.forEach((t, idx) => {
      if (ph.tasks.length < 2 || idx === ph.tasks.length - 1) return;
      const wiring = (t.values.owns ?? "").split(/[,;]/).map(normPath).filter((x) => WIRING.test(x));
      if (wiring.length) out.push(f("wiring-not-last", "WARN", t.line, `${t.id} owns shared wiring (${wiring.join(", ")}) but is not the last task of phase ${ph.n}. Shared wiring has one owner in the last task.`));
    });
    if (ph.tasks.length === 0) out.push(f("phase-empty", "WARN", ph.line, `PHASE ${ph.n} has no task lines.`));
    if (!/non-?goals?/i.test(ph.text + ph.block.join("\n"))) out.push(f("phase-no-nongoals", "WARN", ph.line, `PHASE ${ph.n} names no non-goals. Out of scope per phase stops creep into the next phase.`));
    if (ph.tasks.length > 0 && !/contingency|buffer|20\s*%/i.test(ph.text + ph.block.join("\n"))) out.push(f("phase-no-contingency", "WARN", ph.line, `PHASE ${ph.n} has no contingency line (the playbook adds 20% per phase and says what it covers).`));
  }

  // estimates, size, done-when, covers
  const reqIds = new Set(reqs.map((r) => r.id));
  for (const t of tasks) {
    const est = t.values.est;
    if (est) {
      const h = hoursOf(est);
      if (!h) out.push(f("est-unparsed", "WARN", t.line, `${t.id} estimate "${est}" is not like "3h (2/3/6)".`));
      else {
        t.hours = h.pert ?? h.headline;
        if (h.headline > MAX_TASK_HOURS || (h.pert !== null && h.pert > MAX_TASK_HOURS)) out.push(f("task-too-big", "FAIL", t.line, `${t.id} is over ${MAX_TASK_HOURS} hours (${est}). Split it into tasks that each fit one review.`));
        if (h.triple === null && h.headline >= THREE_POINT_FROM_HOURS) out.push(f("est-no-three-point", "WARN", t.line, `${t.id} is ${est} with no optimistic/most-likely/pessimistic triple; write it as "3h (2/3/6)".`));
        if (h.pert !== null && Math.abs(h.pert - h.headline) > PERT_TOLERANCE_HOURS) out.push(f("est-math", "WARN", t.line, `${t.id} says ${h.headline}h but (O+4M+P)/6 of ${h.triple.join("/")} is ${h.pert.toFixed(1)}h.`));
      }
    }
    const dw = t.values["done when"];
    if (dw && !/`[^`]+`/.test(dw) && !/\d/.test(dw) && (dw.length < 20 || /\b(works?|working|is done|complete[d]?|properly|correctly|looks (right|good)|as expected|finished)\b/i.test(dw))) {
      out.push(f("done-when-vague", "WARN", t.line, `${t.id} "done when" is not verifiable ("${dw.slice(0, 40)}"). Name a command, a test, a status code or a number.`));
    }
    const covers = t.values.covers;
    if (covers && !/infra/i.test(covers)) {
      for (const id of covers.match(/\b(?:NFR|R|S)\d+\b/g) ?? []) {
        if (!reqIds.has(id)) out.push(f("unknown-cover", "FAIL", t.line, `${t.id} covers ${id}, which is not a requirement or story in this plan.`));
      }
    }
  }
  return { findings: out, byId };
}

function parseReqs(lines, found) {
  const reqs = [];
  for (const n of [3, 4]) {
    const sec = found.get(n);
    if (!sec) continue;
    for (let i = sec.start + 1; i < sec.end; i++) {
      const m = /^\s*(?:[-*]\s*)?((?:NFR|R|S)\d+)\s*\[(Must|Should|Could|Won'?t)\]\s*(.*)$/i.exec(lines[i]);
      if (m) reqs.push({ id: m[1], priority: m[2].toLowerCase(), text: m[3], line: i + 1 });
    }
  }
  return reqs;
}

function checkRequirements(reqs, tasks, found, lines) {
  const out = [];
  const covered = new Set();
  for (const t of tasks) for (const id of (t.values.covers ?? "").match(/\b(?:NFR|R|S)\d+\b/g) ?? []) covered.add(id);
  for (const r of reqs) {
    if (r.priority === "must" && !covered.has(r.id)) out.push(f("uncovered-must", "FAIL", r.line, `${r.id} is a Must but no task covers it. The tasks together must equal the whole scope.`));
    if (/^NFR/.test(r.id) && !/\d/.test(r.text)) out.push(f("nfr-no-number", "FAIL", r.line, `${r.id} has no number. Every quality target is measurable ("p95 under 300 ms").`));
    if (/^S\d/.test(r.id) && !/so that/i.test(r.text)) out.push(f("story-no-outcome", "WARN", r.line, `${r.id} has no "so that" outcome.`));
  }
  if (found.get(4) && !reqs.some((r) => /^R\d/.test(r.id))) out.push(f("no-requirements", "WARN", found.get(4).start + 1, "No requirement lines of the form \"R1 [Must] ...\"."));
  return out;
}

function checkRisksAndAdrs(lines, found) {
  const out = [];
  const risks = found.get(10);
  if (risks) {
    let count = 0;
    for (let i = risks.start + 1; i < risks.end; i++) {
      const m = /^\s*(?:[-*]\s*)?(RISK-\d+)\b\s*\|?\s*(.*)$/i.exec(lines[i]);
      if (!m) continue;
      count++;
      const { missing } = fields(m[2], RISK_FIELDS);
      if (missing.length) out.push(f("risk-field-missing", "FAIL", i + 1, `${m[1]} is missing: ${missing.join(", ")}.`));
    }
    if (count === 0) out.push(f("no-risks", "WARN", risks.start + 1, "No RISK lines. Every plan has at least a few; write them as RISK-1 | likelihood: ... | impact: ... | mitigation: ... | contingency: ... | owner: ..."));
  }
  const adrs = found.get(6);
  if (adrs) {
    const body = lines.slice(adrs.start + 1, adrs.end);
    const starts = body.map((l, i) => (/^\s*(?:[-*]\s*)?ADR-\d+\b/.test(l) ? i : -1)).filter((i) => i >= 0);
    starts.forEach((s, k) => {
      const chunk = body.slice(s, starts[k + 1] ?? body.length).join(" ");
      const id = /ADR-\d+/.exec(chunk)[0];
      const missing = ADR_FIELDS.filter((n) => !new RegExp(`\\b${n}\\s*:`).test(chunk));
      if (missing.length) out.push(f("adr-field-missing", "FAIL", adrs.start + 2 + s, `${id} is missing: ${missing.join(", ")}.`));
      else if (/Consequences\s*:\s*(?:none|n\/a|-)?\.?\s*(?:Alternatives\s*:|$)/i.test(chunk)) out.push(f("adr-empty-consequences", "WARN", adrs.start + 2 + s, `${id} has an empty Consequences. Say what it costs and what it rules out.`));
    });
    if (starts.length === 0) out.push(f("no-adrs", "WARN", adrs.start + 1, "No ADR lines. Every choice that is costly to reverse (language, framework, database, auth, hosting) gets one."));
  }
  const tests = found.get(8);
  if (tests && !/`[^`]+`/.test(lines.slice(tests.start + 1, tests.end).join("\n"))) out.push(f("test-strategy-no-command", "WARN", tests.start + 1, "The test strategy names no command in backticks. Each layer needs a tool, a command and a pass condition."));
  const open = found.get(12);
  if (open) {
    for (let i = open.start + 1; i < open.end; i++) {
      const l = lines[i];
      if (/^\s*(?:[-*]|\d+[.)])\s+\S/.test(l) && !/default|assum/i.test(l)) out.push(f("open-question-no-default", "WARN", i + 1, "An open question with no default assumption. Say what the plan assumes until it is answered."));
    }
  }
  return out;
}

function criticalPath(tasks, byId) {
  const memo = new Map();
  const best = (t, trail = new Set()) => {
    if (memo.has(t.id)) return memo.get(t.id);
    if (trail.has(t.id)) return { hours: 0, path: [] };
    trail.add(t.id);
    let top = { hours: 0, path: [] };
    for (const d of t.deps) {
      const dep = byId.get(d);
      if (!dep) continue;
      const r = best(dep, trail);
      if (r.hours > top.hours) top = r;
    }
    trail.delete(t.id);
    const result = { hours: top.hours + (t.hours ?? 0), path: [...top.path, t.id] };
    memo.set(t.id, result);
    return result;
  };
  let longest = { hours: 0, path: [] };
  for (const t of tasks) {
    const r = best(t);
    if (r.hours > longest.hours) longest = r;
  }
  return longest;
}

// ---------- suppression ----------
function suppressions(lines) {
  const found = [];
  lines.forEach((l, i) => {
    const m = /plan-allow:\s*([a-z0-9-]+)\s*--\s*([^>\n]*)/.exec(l);
    if (m) found.push({ rule: m[1], line: i + 1, reasonChars: m[2].replace(/\s/g, "").length });
  });
  return found;
}

export function lintPlan(text) {
  const lines = text.split("\n");
  const found = sections(lines);
  let findings = checkSections(found);
  const reqs = parseReqs(lines, found);
  const { tasks, phases } = parseTasks(lines, found);
  let byId = new Map();
  if (found.get(7)) {
    if (tasks.length === 0) findings.push(f("no-tasks", "FAIL", found.get(7).start + 1, "No task lines like \"- T1.1 | owns: ... | depends: none | est: 3h (2/3/6) | covers: R1 | done when: ...\"."));
    const r = checkTasks(tasks, phases, reqs);
    if (r.findings) { findings.push(...r.findings); byId = r.byId; }
  }
  findings.push(...checkRequirements(reqs, tasks, found, lines), ...checkRisksAndAdrs(lines, found));
  if (tasks.length > 0) {
    const cp = criticalPath(tasks, byId);
    if (cp.path.length > 1) findings.push(f("critical-path", "INFO", 0, `Critical path (${cp.hours.toFixed(1)}h of expected work): ${cp.path.join(" -> ")}. Anything off this path has float.`));
  }
  const allowed = suppressions(lines);
  findings = findings.filter((x) => !allowed.some((s) => s.rule === x.rule && (x.line === s.line || x.line === s.line + 1)));
  for (const s of allowed) {
    if (s.reasonChars < MIN_REASON_CHARS) findings.push(f("suppression-no-reason", "WARN", s.line, `plan-allow for ${s.rule} needs a reason of at least ${MIN_REASON_CHARS} characters.`));
  }
  return findings.sort((a, b) => a.line - b.line);
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

export function lintPaths(paths) {
  const out = [];
  for (const p of paths) {
    if (!existsSync(p)) throw new Error(`path not found: ${p}`);
    const files = [];
    if (statSync(p).isDirectory()) walk(p, files); else files.push(p);
    const explicit = !statSync(p).isDirectory();
    for (const file of files) {
      const text = readFileSync(file, "utf8");
      if (!explicit && !/^##\s+1\s+PRODUCT BRIEF/m.test(text)) continue;
      for (const x of lintPlan(text)) out.push({ ...x, file });
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
  const flags = new Set(argv.filter((a) => a.startsWith("--")));
  const paths = argv.filter((a) => !a.startsWith("--"));
  if (paths.length === 0) {
    console.error("usage: node plan-lint.mjs <plan.md | folder>... [--json] [--strict]");
    return 2;
  }
  let findings;
  try {
    findings = lintPaths(paths);
  } catch (error) {
    console.error(error.message);
    return 2;
  }
  const summary = summarize(findings, { strict: flags.has("--strict") });
  if (flags.has("--json")) {
    console.log(JSON.stringify({ summary, findings }, null, 2));
  } else {
    for (const x of findings) console.log(`${x.severity} ${x.rule} ${x.file}:${x.line} ${x.message}`);
    console.log(`plan-lint: ${summary.fail} FAIL, ${summary.warn} WARN (format and consistency only; not a judge of the plan)`);
  }
  return summary.exitCode;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  process.exitCode = main(process.argv.slice(2));
}
