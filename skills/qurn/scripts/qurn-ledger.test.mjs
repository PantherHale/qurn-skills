import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { appendEntry, verifyLedger, renderReport } from "./qurn-ledger.mjs";

const T = (n) => `2026-11-07T10:00:0${n}Z`;
const add = (text, e, n = 0) => appendEntry(text, e, T(n));

test("appendEntry numbers ids per kind and chains hashes", () => {
  let t = add("", { owner: "coder", kind: "verdict", status: "fix", summary: "slow", evidence: "cmd:lighthouse" }, 1);
  t = add(t, { owner: "coder", kind: "verdict", status: "pass", summary: "fast", evidence: "cmd:lighthouse" }, 2);
  const lines = t.trim().split("\n");
  assert.match(lines[0], /\| V1 \|/);
  assert.match(lines[1], /\| V2 \|/);
  assert.equal(verifyLedger(t, {}).errors.length, 0);
});

test("editing a past line breaks the chain", () => {
  let t = add("", { owner: "web", kind: "verdict", status: "pass", summary: "ok", evidence: "cmd:x" }, 1);
  t = add(t, { owner: "tester", kind: "verdict", status: "pass", summary: "ok", evidence: "cmd:y" }, 2);
  const tampered = t.replace("| ok |", "| fine |");
  const r = verifyLedger(tampered, {});
  assert.ok(r.errors.some((e) => /chain/i.test(e)));
});

test("deleting a line breaks the chain", () => {
  let t = add("", { owner: "a", kind: "verdict", status: "fix", summary: "bad", evidence: "cmd:x" }, 1);
  t = add(t, { owner: "a", kind: "verdict", status: "pass", summary: "good", evidence: "cmd:y" }, 2);
  const r = verifyLedger(t.split("\n").slice(1).join("\n"), {});
  assert.ok(r.errors.some((e) => /chain/i.test(e)));
});

test("a pass verdict with no evidence is rejected", () => {
  const t = add("", { owner: "security", kind: "verdict", status: "pass", summary: "looks fine", evidence: "none" });
  assert.ok(verifyLedger(t, {}).errors.some((e) => /without evidence/i.test(e)));
});

test("file evidence must exist", () => {
  const dir = mkdtempSync(join(tmpdir(), "qurn-"));
  writeFileSync(join(dir, "shot.png"), "x");
  let t = add("", { owner: "tester", kind: "verdict", status: "pass", summary: "ok", evidence: "file:shot.png" }, 1);
  assert.equal(verifyLedger(t, { cwd: dir }).errors.length, 0);
  t = add(t, { owner: "tester", kind: "verdict", status: "pass", summary: "ok2", evidence: "file:missing.png" }, 2);
  assert.ok(verifyLedger(t, { cwd: dir }).errors.some((e) => /missing\.png/.test(e)));
});

test("an unresolved redo blocks final but a later pass by the same owner clears it", () => {
  let t = add("", { owner: "security", kind: "verdict", status: "redo", summary: "auth gap", evidence: "cmd:test" }, 1);
  assert.ok(verifyLedger(t, { final: true }).errors.some((e) => /open redo/i.test(e)));
  assert.equal(verifyLedger(t, {}).errors.length, 0);
  t = add(t, { owner: "security", kind: "verdict", status: "pass", summary: "fixed", evidence: "cmd:test" }, 2);
  assert.equal(verifyLedger(t, { final: true }).errors.length, 0);
});

test("two redos by one owner warn to change method", () => {
  let t = add("", { owner: "web", kind: "verdict", status: "redo", summary: "can blocky", evidence: "cmd:a" }, 1);
  t = add(t, { owner: "web", kind: "verdict", status: "redo", summary: "can still blocky", evidence: "cmd:b" }, 2);
  assert.ok(verifyLedger(t, {}).warnings.some((w) => /change (the )?method/i.test(w)));
});

test("budget over cap is an error, near cap is a warning", () => {
  let t = add("", { owner: "qurn", kind: "budget", status: "info", summary: "tokens 85/100", evidence: "none" }, 1);
  assert.ok(verifyLedger(t, {}).warnings.some((w) => /80%/.test(w)));
  t = add(t, { owner: "qurn", kind: "budget", status: "info", summary: "tokens 120/100", evidence: "none" }, 2);
  assert.ok(verifyLedger(t, {}).errors.some((e) => /over cap/i.test(e)));
});

test("requireBlind needs a passing blind-reviewer verdict in final mode", () => {
  let t = add("", { owner: "web", kind: "verdict", status: "pass", summary: "ok", evidence: "cmd:a" }, 1);
  assert.ok(verifyLedger(t, { final: true, requireBlind: true }).errors.some((e) => /blind/i.test(e)));
  t = add(t, { owner: "blind-reviewer", kind: "verdict", status: "pass", summary: "ok", evidence: "file:x" }, 2);
  const dir = mkdtempSync(join(tmpdir(), "qurn-"));
  writeFileSync(join(dir, "x"), "x");
  assert.equal(verifyLedger(t, { final: true, requireBlind: true, cwd: dir }).errors.length, 0);
});

test("summary pipes are neutralised so lines stay parseable", () => {
  const t = add("", { owner: "a", kind: "decision", status: "info", summary: "use a | b", evidence: "none" });
  assert.equal(verifyLedger(t, {}).errors.length, 0);
});

test("report summarises owners, blockers and chain state", () => {
  let t = add("", { owner: "coder", kind: "verdict", status: "redo", summary: "leak", evidence: "cmd:a" }, 1);
  t = add(t, { owner: "tester", kind: "verdict", status: "pass", summary: "ok", evidence: "cmd:b" }, 2);
  const md = renderReport(t, {});
  assert.match(md, /Open blockers/);
  assert.match(md, /coder/);
  assert.match(md, /chain: intact/i);
});

import { lessonCandidates } from "./qurn-ledger.mjs";

test("lessonCandidates pairs each redo or fix with the same owner's next pass", () => {
  let t = add("", { owner: "web", kind: "verdict", status: "redo", summary: "can boxy at the lid", evidence: "file:a.png" }, 1);
  t = add(t, { owner: "coder", kind: "verdict", status: "fix", summary: "textures never disposed", evidence: "cmd:renderer.info" }, 2);
  t = add(t, { owner: "web", kind: "verdict", status: "pass", summary: "lid rebuilt from reference", evidence: "file:b.png" }, 3);
  const c = lessonCandidates(t);
  const web = c.find((x) => x.owner === "web");
  assert.equal(web.problem, "can boxy at the lid");
  assert.equal(web.fix, "lid rebuilt from reference");
  assert.equal(web.resolved, true);
  assert.equal(c.find((x) => x.owner === "coder").resolved, false);
});

test("lessonCandidates includes approved changes and escalations as context lessons", () => {
  const t = add("", { owner: "qurn", kind: "change", status: "approved", summary: "added phone layout order", evidence: "none" }, 1);
  assert.ok(lessonCandidates(t).some((x) => x.kind === "change" && /phone layout/.test(x.problem)));
});

test("file evidence that escapes the project folder is rejected, not probed", () => {
  const dir = mkdtempSync(join(tmpdir(), "qurn-"));
  const t = add("", { owner: "tester", kind: "verdict", status: "pass", summary: "ok", evidence: "file:../../../etc/hosts" }, 1);
  const r = verifyLedger(t, { cwd: dir });
  assert.ok(r.errors.some((e) => /outside the project/i.test(e)));
  const abs = add("", { owner: "tester", kind: "verdict", status: "pass", summary: "ok", evidence: "file:C:/Windows/win.ini" }, 1);
  assert.ok(verifyLedger(abs, { cwd: dir }).errors.some((e) => /outside the project/i.test(e)));
});

import { spawn } from "node:child_process";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

test("a ledger whose line endings became CRLF still verifies", () => {
  let t = add("", { owner: "a", kind: "verdict", status: "fix", summary: "one", evidence: "cmd:x" }, 1);
  t = add(t, { owner: "a", kind: "verdict", status: "pass", summary: "two", evidence: "cmd:y" }, 2);
  const crlf = t.replace(/\n/g, "\r\n");
  assert.equal(verifyLedger(crlf, {}).errors.length, 0);
  assert.equal(parseLedgerCount(crlf), 2);
});

test("a tampered CRLF ledger is still detected", () => {
  let t = add("", { owner: "a", kind: "verdict", status: "fix", summary: "one", evidence: "cmd:x" }, 1);
  t = add(t, { owner: "a", kind: "verdict", status: "pass", summary: "two", evidence: "cmd:y" }, 2);
  assert.ok(verifyLedger(t.replace(/\n/g, "\r\n").replace("| one |", "| ONE |"), {}).errors.some((e) => /chain/i.test(e)));
});

function parseLedgerCount(text) {
  return verifyLedger(text, {}).rows.length;
}

test("lock retry codes: EEXIST everywhere, EPERM/EBUSY/EACCES only on Windows", async () => {
  const { isRetryableLockError } = await import("./qurn-ledger.mjs");
  assert.equal(isRetryableLockError({ code: "EEXIST" }, "linux"), true);
  assert.equal(isRetryableLockError({ code: "EEXIST" }, "win32"), true);
  for (const code of ["EPERM", "EBUSY", "EACCES"]) {
    assert.equal(isRetryableLockError({ code }, "win32"), true, code);
    assert.equal(isRetryableLockError({ code }, "linux"), false, code);
  }
  assert.equal(isRetryableLockError({ code: "ENOENT" }, "win32"), false);
  assert.equal(isRetryableLockError(null, "win32"), false);
});

test("concurrent writers on one file never break the chain", async () => {
  const cli = fileURLToPath(new URL("./qurn-ledger.mjs", import.meta.url));
  const dir = mkdtempSync(join(tmpdir(), "qurn-race-"));
  const file = join(dir, "ledger.md");
  const run = (i) => new Promise((res, rej) => {
    const p = spawn(process.execPath, [cli, "add", "--file", file, "--owner", `w${i}`, "--kind", "decision", "--status", "info", "--summary", `d${i}`]);
    p.on("exit", (c) => (c === 0 ? res() : rej(new Error(`writer ${i} exited ${c}`))));
  });
  await Promise.all(Array.from({ length: 8 }, (_, i) => run(i)));
  const r = verifyLedger(readFileSync(file, "utf8"), {});
  assert.deepEqual(r.errors, []);
  assert.equal(r.rows.length, 8);
});
