#!/usr/bin/env node
// Qurn proof ledger: append-only, hash-chained, evidence-checked. Zero dependencies.
// Line: <utc> | <id> | <owner> | <kind> | <status> | <summary> | ev:<evidence> | h:<hash12>
import { createHash } from "node:crypto";
import { existsSync, readFileSync, appendFileSync, mkdirSync, openSync, closeSync, unlinkSync, statSync } from "node:fs";
import { dirname, isAbsolute, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const PREFIX = { verdict: "V", assumption: "A", decision: "D", change: "C", risk: "R", gate: "G", budget: "B", escalation: "E", retro: "T" };
const VERDICT_STATUS = new Set(["pass", "fix", "redo"]);
const BLIND_OWNER = "blind-reviewer";
const NEAR_CAP = 0.8;
const GENESIS = "genesis";

const clean = (s) => String(s).replace(/\s*\|\s*/g, " / ").replace(/\s+/g, " ").trim();
const hash = (prev, body) => createHash("sha256").update(`${prev}\n${body}`).digest("hex").slice(0, 12);

export function parseLedger(text) {
  return text.split(/\r?\n/).filter((l) => l.trim() && !l.startsWith("#")).map((raw, i) => {
    const parts = raw.split(" | ");
    if (parts.length !== 8) return { raw, index: i, malformed: true };
    const [time, id, owner, kind, status, summary, ev, h] = parts;
    if (!ev.startsWith("ev:") || !h.startsWith("h:")) return { raw, index: i, malformed: true };
    return { raw, index: i, time, id, owner, kind, status, summary, evidence: ev.slice(3), hash: h.slice(2), body: parts.slice(0, 7).join(" | ") };
  });
}

export function appendEntry(text, entry, now = new Date().toISOString()) {
  const rows = parseLedger(text);
  const kind = entry.kind;
  if (!PREFIX[kind]) throw new Error(`unknown kind: ${kind}`);
  const n = rows.filter((r) => r.kind === kind).length + 1;
  const evidence = clean(entry.evidence || "none");
  const body = [now, `${PREFIX[kind]}${n}`, clean(entry.owner), kind, clean(entry.status), clean(entry.summary), `ev:${evidence}`].join(" | ");
  const prev = rows.length ? rows[rows.length - 1].hash : GENESIS;
  const line = `${body} | h:${hash(prev, body)}`;
  return (text.endsWith("\n") || text === "" ? text : text + "\n") + line + "\n";
}

function checkChain(rows, errors) {
  let prev = GENESIS;
  for (const r of rows) {
    if (r.malformed) { errors.push(`line ${r.index + 1} is malformed`); return; }
    if (hash(prev, r.body) !== r.hash) { errors.push(`chain broken at line ${r.index + 1} (${r.id}): an earlier line was edited, removed or reordered`); return; }
    prev = r.hash;
  }
}

function openRedos(rows) {
  const open = new Map();
  for (const r of rows.filter((x) => !x.malformed && x.kind === "verdict")) {
    if (r.status === "redo") open.set(r.owner, r);
    else if (r.status === "pass") open.delete(r.owner);
  }
  return [...open.values()];
}

export function verifyLedger(text, { cwd = process.cwd(), final = false, requireBlind = false } = {}) {
  const rows = parseLedger(text);
  const errors = [];
  const warnings = [];
  checkChain(rows, errors);
  for (const r of rows.filter((x) => !x.malformed)) {
    if (r.kind === "verdict" && !VERDICT_STATUS.has(r.status)) errors.push(`${r.id}: verdict status must be pass, fix or redo`);
    if (r.kind === "verdict" && r.status === "pass" && r.evidence === "none") errors.push(`${r.id}: pass without evidence (${r.owner})`);
    if (r.evidence.startsWith("file:")) {
      const rel = r.evidence.slice(5);
      const target = resolve(cwd, rel);
      const inside = relative(resolve(cwd), target);
      if (inside.startsWith("..") || isAbsolute(inside)) errors.push(`${r.id}: evidence path is outside the project: ${rel}`);
      else if (!existsSync(target)) errors.push(`${r.id}: evidence file not found: ${rel}`);
    }
    const m = r.kind === "budget" && r.summary.match(/(\d+(?:\.\d+)?)\s*\/\s*(\d+(?:\.\d+)?)/);
    if (m) {
      const [spent, cap] = [Number(m[1]), Number(m[2])];
      if (spent > cap) errors.push(`${r.id}: budget over cap (${spent}/${cap})`);
      else if (spent >= cap * NEAR_CAP) warnings.push(`${r.id}: budget at ${Math.round((spent / cap) * 100)}% of cap, tell the operator (80% rule)`);
    }
  }
  const redoCount = new Map();
  for (const r of rows.filter((x) => x.kind === "verdict" && x.status === "redo")) redoCount.set(r.owner, (redoCount.get(r.owner) || 0) + 1);
  for (const [owner, n] of redoCount) if (n >= 2) warnings.push(`${owner} has ${n} redos: change the method (reference study, rebuild, close-up), do not tweak again`);
  if (final) {
    for (const r of openRedos(rows)) errors.push(`open redo from ${r.owner} (${r.id}): ${r.summary}`);
    if (requireBlind && !rows.some((r) => r.owner === BLIND_OWNER && r.kind === "verdict" && r.status === "pass")) errors.push("no passing blind-reviewer verdict");
  }
  return { errors, warnings, rows };
}

export function renderReport(text, opts = {}) {
  const { errors, warnings, rows } = verifyLedger(text, opts);
  const good = rows.filter((r) => !r.malformed);
  const chainOk = !errors.some((e) => /chain|malformed/i.test(e));
  const owners = [...new Set(good.filter((r) => r.kind === "verdict").map((r) => r.owner))];
  const last = (o) => good.filter((r) => r.owner === o && r.kind === "verdict").at(-1);
  const out = ["# Delivery report", "", `Ledger chain: ${chainOk ? "intact" : "BROKEN"}. Entries: ${good.length}.`, "", "## Verdicts by specialist", ""];
  for (const o of owners) { const v = last(o); out.push(`- ${o}: ${v.status} (${v.id}) -- ${v.summary} [evidence: ${v.evidence}]`); }
  const blockers = openRedos(good);
  out.push("", "## Open blockers", "", ...(blockers.length ? blockers.map((b) => `- ${b.owner}: ${b.summary} (${b.id})`) : ["- none"]));
  const kinds = ["assumption", "decision", "change", "risk", "gate", "escalation"];
  for (const k of kinds) {
    const items = good.filter((r) => r.kind === k);
    if (items.length) out.push("", `## ${k[0].toUpperCase() + k.slice(1)}s`, "", ...items.map((r) => `- ${r.id} ${r.status}: ${r.summary}`));
  }
  out.push("", "## Warnings", "", ...(warnings.length ? warnings.map((w) => `- ${w}`) : ["- none"]));
  out.push("", "## Problems", "", ...(errors.length ? errors.map((e) => `- ${e}`) : ["- none"]));
  return out.join("\n") + "\n";
}

// Turns a finished run into candidate lessons: each redo/fix paired with the same owner's next pass.
export function lessonCandidates(text) {
  const rows = parseLedger(text).filter((r) => !r.malformed);
  const out = [];
  rows.forEach((r, i) => {
    if (r.kind === "verdict" && (r.status === "redo" || r.status === "fix")) {
      const next = rows.slice(i + 1).find((x) => x.kind === "verdict" && x.owner === r.owner && x.status === "pass");
      out.push({ kind: "verdict", owner: r.owner, id: r.id, problem: r.summary, fix: next ? next.summary : "", resolved: Boolean(next), evidence: next ? next.evidence : r.evidence });
    } else if (r.kind === "change" || r.kind === "escalation") {
      out.push({ kind: r.kind, owner: r.owner, id: r.id, problem: r.summary, fix: r.status, resolved: true, evidence: r.evidence });
    }
  });
  return out;
}

export function renderLessons(text, project = "unnamed", today = new Date().toISOString().slice(0, 10)) {
  const c = lessonCandidates(text);
  if (!c.length) return "No lesson candidates: no redo, fix, change or escalation in this ledger.\n";
  const lines = ["# Lesson candidates (review each; keep only what would change a future decision)", ""];
  for (const x of c) {
    lines.push(`${today} | ${project} | ${x.owner} | ${x.kind} ${x.id} | went wrong: ${x.problem} | ${x.resolved ? `fixed by: ${x.fix}` : "UNRESOLVED"} | rule: <one sentence, filled in by Qurn> | ev: ${x.evidence}`);
  }
  return lines.join("\n") + "\n";
}

// Writers queue on <file>.lock so parallel workers cannot fork the hash chain.
const LOCK_WAIT_MS = 10;
const LOCK_GIVE_UP_MS = 10000;
const LOCK_STALE_MS = 30000;
const sleep = (ms) => Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);

// A lock file that exists is EEXIST everywhere. On Windows a lock file whose deletion is still pending (another writer
// just unlinked it) is reported as EPERM, EBUSY or EACCES instead, so those mean "try again" there and only there.
export function isRetryableLockError(e, platform = process.platform) {
  if (e && e.code === "EEXIST") return true;
  return platform === "win32" && !!e && ["EPERM", "EBUSY", "EACCES"].includes(e.code);
}

export function withLock(file, fn) {
  const lock = `${file}.lock`;
  mkdirSync(dirname(file), { recursive: true });
  const start = Date.now();
  for (;;) {
    try { closeSync(openSync(lock, "wx")); break; } catch (e) {
      if (!isRetryableLockError(e)) throw e;
      try { if (Date.now() - statSync(lock).mtimeMs > LOCK_STALE_MS) unlinkSync(lock); } catch { /* another writer just released it */ }
      if (Date.now() - start > LOCK_GIVE_UP_MS) throw new Error(`could not lock ${file} within ${LOCK_GIVE_UP_MS} ms`);
      sleep(LOCK_WAIT_MS);
    }
  }
  try { return fn(); } finally { try { unlinkSync(lock); } catch { /* already gone */ } }
}

function parseArgs(argv) {
  const [cmd, ...rest] = argv;
  const o = { cmd };
  for (let i = 0; i < rest.length; i++) {
    if (rest[i].startsWith("--")) { const k = rest[i].slice(2); const v = rest[i + 1] && !rest[i + 1].startsWith("--") ? rest[++i] : true; o[k] = v; }
  }
  return o;
}

function main() {
  const a = parseArgs(process.argv.slice(2));
  const file = resolve(a.file || "docs/design/QURN_LEDGER.md");
  const text = existsSync(file) ? readFileSync(file, "utf8") : "";
  const opts = { final: Boolean(a.final), requireBlind: Boolean(a["require-blind"]) };
  if (a.cmd === "add") {
    for (const k of ["owner", "kind", "status", "summary"]) if (!a[k] || a[k] === true) { console.error(`--${k} is required`); process.exit(2); }
    if (a.kind === "verdict" && a.status === "pass" && (!a.evidence || a.evidence === "none")) { console.error("refusing: a pass verdict needs --evidence (file:, cmd:, or url:)"); process.exit(1); }
    const line = withLock(file, () => {
      const current = existsSync(file) ? readFileSync(file, "utf8") : "";
      const broken = verifyLedger(current, opts).errors.filter((e) => /chain|malformed/i.test(e));
      if (broken.length) return { broken };
      const next = appendEntry(current, { owner: a.owner, kind: a.kind, status: a.status, summary: a.summary, evidence: a.evidence || "none" });
      appendFileSync(file, next.slice(current.length));
      return { line: next.trim().split(/\r?\n/).at(-1) };
    });
    if (line.broken) { console.error("refusing to append to a broken ledger:\n" + line.broken.join("\n")); process.exit(1); }
    console.log(line.line);
  } else if (a.cmd === "verify") {
    const r = verifyLedger(text, opts);
    r.warnings.forEach((w) => console.log(`warn: ${w}`));
    r.errors.forEach((e) => console.log(`error: ${e}`));
    console.log(r.errors.length ? "FAIL" : "OK");
    process.exit(r.errors.length ? 1 : 0);
  } else if (a.cmd === "lessons") {
    process.stdout.write(renderLessons(text, typeof a.project === "string" ? a.project : undefined));
  } else if (a.cmd === "report") {
    process.stdout.write(renderReport(text, opts));
  } else {
    console.error("usage: qurn-ledger.mjs add|verify|report|lessons [--file path] [--final] [--require-blind]\n  add --owner o --kind k --status s --summary text [--evidence file:path|cmd:text|url:u|none]");
    process.exit(2);
  }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) main();
