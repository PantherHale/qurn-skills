import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { lintPaths, lintPlan, summarize } from "./plan-lint.mjs";

const GOOD = `# Plan: Habit tracker
## 1 PRODUCT BRIEF
A habit tracker for busy parents. Success: 60% of new users log a habit on 3 days in week 1.
## 2 SCOPE
In: log a habit, streaks. Out: social feed. Later: reminders.
## 3 USERS AND STORIES
S1 [Must] As a parent, I can log a habit in two taps, so that I keep my streak.
## 4 REQUIREMENTS
R1 [Must] A user can create a habit and log it.
R2 [Should] A streak counter shows consecutive days.
NFR1 [Must] First load under 2 s on 4G.
## 5 ARCHITECTURE
Context: users, browser. Containers: web app, API, SQLite. Data model: habit, log. Contracts: POST /logs. Flows: 1) log a habit.
## 6 DECISIONS
ADR-1 Use SQLite. Context: single server, small data. Decision: SQLite with WAL. Consequences: no horizontal writes; simple backups. Alternatives: Postgres (more ops).
## 7 PHASES AND TASKS
PHASE 1: Walking skeleton (goal: log one habit end to end; non-goals: streaks, auth). Contingency: 20% buffer for the SQLite setup.
- T1.1 | owns: src/db.ts | depends: none | est: 3h (2/3/6) | covers: R1 | done when: \`npm test\` passes the db round-trip test
- T1.2 | owns: src/api/logs.ts | depends: T1.1 | est: 2h (1/2/3) | covers: R1,S1 | done when: POST /logs returns 201 in the smoke test
- T1.3 | owns: package.json, src/server.ts, migrations/001.sql | depends: T1.2 | est: 1h | covers: NFR1 | done when: \`npm run build\` exits 0 and bundle is under 170 KB
PHASE 2: Streaks (goal: show streaks; non-goals: sharing). Contingency: 20% buffer.
- T2.1 | owns: src/streak.ts | depends: T1.3 | est: 2h | covers: R2 | done when: \`npm test\` passes 4 streak cases
## 8 TEST STRATEGY
Unit: \`npm test\` passes. E2E: \`npx playwright test\` for the log-a-habit journey.
## 9 SECURITY AND PERFORMANCE BUDGETS
First load under 2 s; rate limit 60 requests per minute per IP.
## 10 RISKS
RISK-1 | likelihood: medium | impact: high | mitigation: spike SQLite WAL on the host first | contingency: fall back to rollback journal | owner: Sam
## 11 MILESTONES AND RELEASE
M1 phase 1: a habit can be logged live; rollback by redeploying the previous build; smoke test on /health.
## 12 OPEN QUESTIONS
- Do users need accounts? Default assumption: no, a device id is enough.
`;

const rules = (text) => lintPlan(text).map((x) => x.rule);
const has = (text, rule) => rules(text).includes(rule);
const sev = (text, rule) => lintPlan(text).find((x) => x.rule === rule)?.severity;
const swap = (from, to) => GOOD.replace(from, to);

test("a complete plan has no FAIL or WARN and reports the critical path", () => {
  const found = lintPlan(GOOD);
  assert.deepEqual(found.filter((x) => x.severity !== "INFO"), []);
  const cp = found.find((x) => x.rule === "critical-path");
  assert.match(cp.message, /T1\.1 -> T1\.2 -> T1\.3 -> T2\.1/);
});

test("a missing section FAILs; a retitled one WARNs", () => {
  assert.equal(sev(GOOD.replace("## 5 ARCHITECTURE", "## 5 DESIGN"), "section-title"), "WARN");
  assert.equal(sev(GOOD.replace(/## 12 OPEN QUESTIONS[\s\S]*$/, ""), "missing-section"), "FAIL");
  assert.equal(lintPlan("just words").filter((x) => x.rule === "missing-section").length, 12);
});

test("task lines need every field", () => {
  const bad = swap(" | depends: T1.1 | est: 2h (1/2/3)", " | est: 2h (1/2/3)");
  const found = lintPlan(bad).find((x) => x.rule === "task-field-missing");
  assert.equal(found.severity, "FAIL");
  assert.match(found.message, /depends/);
  assert.ok(has(swap("done when: POST /logs returns 201 in the smoke test", "done when:"), "task-field-missing"));
});

test("dangling dependencies, self dependency and cycles FAIL", () => {
  assert.equal(sev(swap("depends: T1.1 |", "depends: T9.9 |"), "dangling-dependency"), "FAIL");
  assert.ok(has(swap("depends: T1.1 | est: 2h", "depends: T1.2 | est: 2h"), "dependency-cycle"));
  const cyc = swap("depends: none | est: 3h", "depends: T1.3 | est: 3h");
  assert.match(lintPlan(cyc).find((x) => x.rule === "dependency-cycle").message, /->/);
});

test("duplicate task ids FAIL", () => {
  assert.ok(has(swap("- T1.2 |", "- T1.1 |"), "duplicate-task-id"));
});

test("parallel tasks owning the same file FAIL; ordered ones only WARN", () => {
  const parallel = swap("owns: src/api/logs.ts | depends: T1.1", "owns: src/db.ts | depends: none");
  assert.equal(sev(parallel, "file-overlap"), "FAIL");
  const ordered = swap("owns: src/api/logs.ts", "owns: src/db.ts");
  assert.equal(sev(ordered, "file-overlap-ordered"), "WARN");
  assert.ok(!has(ordered, "file-overlap"));
  const dir = swap("owns: src/api/logs.ts | depends: T1.1", "owns: src/ | depends: none");
  assert.ok(has(dir, "file-overlap"));
  assert.ok(!has(GOOD, "file-overlap"));
});

test("shared wiring must be owned by the last task of its phase", () => {
  const early = swap("owns: src/db.ts |", "owns: src/db.ts, package.json |").replace("owns: package.json, src/server.ts, migrations/001.sql", "owns: src/server.ts, migrations/001.sql");
  assert.equal(sev(early, "wiring-not-last"), "WARN");
  assert.ok(!has(GOOD, "wiring-not-last"));
});

test("estimates: too big FAILs, missing triple, bad math and bad format WARN", () => {
  assert.equal(sev(swap("est: 3h (2/3/6)", "est: 12h (8/12/16)"), "task-too-big"), "FAIL");
  assert.equal(sev(swap("est: 3h (2/3/6)", "est: 2d"), "task-too-big"), "FAIL");
  assert.equal(sev(swap("est: 3h (2/3/6)", "est: 1d"), "task-too-big"), undefined);
  assert.equal(sev(swap("est: 3h (2/3/6)", "est: 5h"), "est-no-three-point"), "WARN");
  assert.ok(!has(swap("est: 3h (2/3/6)", "est: 2h"), "est-no-three-point"));
  assert.equal(sev(swap("est: 3h (2/3/6)", "est: 6h (2/3/6)"), "est-math"), "WARN");
  assert.equal(sev(swap("est: 3h (2/3/6)", "est: soon"), "est-unparsed"), "WARN");
});

test("done-when must be verifiable", () => {
  assert.equal(sev(swap("done when: POST /logs returns 201 in the smoke test", "done when: it works"), "done-when-vague"), "WARN");
  assert.equal(sev(swap("done when: POST /logs returns 201 in the smoke test", "done when: complete properly"), "done-when-vague"), "WARN");
  assert.ok(!has(GOOD, "done-when-vague"));
});

test("a Must requirement no task covers FAILs; unknown covers FAIL; infrastructure is allowed", () => {
  assert.equal(sev(swap("covers: R1 |", "covers: S1 |"), "uncovered-must"), undefined);
  assert.equal(sev(swap("covers: R1,S1", "covers: S1"), "uncovered-must"), undefined);
  const dropped = swap("covers: R1 | done when: `npm test`", "covers: infrastructure | done when: `npm test`").replace("covers: R1,S1", "covers: S1");
  assert.equal(sev(dropped, "uncovered-must"), "FAIL");
  assert.equal(sev(swap("covers: R2 |", "covers: R7 |"), "unknown-cover"), "FAIL");
  assert.ok(!has(swap("covers: R1 | done when: `npm test`", "covers: infrastructure | done when: `npm test`"), "unknown-cover"));
});

test("NFRs need a number and stories need an outcome", () => {
  assert.equal(sev(swap("NFR1 [Must] First load under 2 s on 4G.", "NFR1 [Must] The app is fast."), "nfr-no-number"), "FAIL");
  assert.equal(sev(swap(", so that I keep my streak.", "."), "story-no-outcome"), "WARN");
});

test("risks need every field", () => {
  const bad = swap(" | contingency: fall back to rollback journal", "");
  const found = lintPlan(bad).find((x) => x.rule === "risk-field-missing");
  assert.equal(found.severity, "FAIL");
  assert.match(found.message, /contingency/);
  assert.ok(has(swap(/RISK-1.*\n/.exec(GOOD)[0], ""), "no-risks"));
});

test("ADRs need context, decision, consequences and alternatives", () => {
  assert.equal(sev(swap(" Consequences: no horizontal writes; simple backups.", ""), "adr-field-missing"), "FAIL");
  assert.equal(sev(swap("Consequences: no horizontal writes; simple backups.", "Consequences: none."), "adr-empty-consequences"), "WARN");
  assert.ok(has(swap(/ADR-1.*\n/.exec(GOOD)[0], ""), "no-adrs"));
  const two = swap("ADR-1 Use SQLite.", "ADR-0 Use Node. Context: a. Decision: b. Consequences: c. Alternatives: d.\nADR-1 Use SQLite.");
  assert.ok(!has(two, "adr-field-missing"));
});

test("phases need non-goals and a contingency line, and tasks", () => {
  assert.equal(sev(swap("; non-goals: sharing", ""), "phase-no-nongoals"), "WARN");
  assert.equal(sev(swap(" Contingency: 20% buffer.", ""), "phase-no-contingency"), "WARN");
  assert.ok(has(GOOD.replace(/- T2\.1 .*\n/, ""), "phase-empty"));
  assert.ok(has(GOOD.replace(/- T\d\.\d .*\n/g, ""), "no-tasks"));
});

test("test strategy needs a command; open questions need a default", () => {
  assert.equal(sev(swap(/Unit: .*\n/.exec(GOOD)[0], "Unit tests and e2e tests.\n"), "test-strategy-no-command"), "WARN");
  assert.equal(sev(swap("Default assumption: no, a device id is enough.", ""), "open-question-no-default"), "WARN");
});

test("no requirement lines at all warns", () => {
  assert.ok(has(GOOD.replace(/^R\d .*\n/gm, "").replace(/^NFR1.*\n/m, ""), "no-requirements"));
});

test("suppression needs a reason of 10+ characters on the same or the line above", () => {
  const overlap = swap("owns: src/api/logs.ts | depends: T1.1", "owns: src/db.ts | depends: none");
  const ok = overlap.replace("- T1.2 |", "<!-- plan-allow: file-overlap -- both only append to one changelog file -->\n- T1.2 |");
  assert.ok(!has(ok, "file-overlap"));
  const short = overlap.replace("- T1.2 |", "<!-- plan-allow: file-overlap -- later -->\n- T1.2 |");
  assert.ok(has(short, "suppression-no-reason"));
});

test("also handles tasks written without a leading dash and with day units", () => {
  const alt = swap("- T1.1 | owns", "T1.1 | owns").replace("est: 3h (2/3/6)", "est: 0.5d (0.25/0.5/1)");
  assert.deepEqual(lintPlan(alt).filter((x) => x.severity === "FAIL"), []);
});

test("summarize, lintPaths and the cli", () => {
  assert.deepEqual(summarize([{ severity: "WARN" }, { severity: "INFO" }]), { fail: 0, warn: 1, info: 1, exitCode: 0 });
  assert.equal(summarize([{ severity: "WARN" }], { strict: true }).exitCode, 1);
  assert.equal(summarize([{ severity: "FAIL" }]).exitCode, 1);
  const dir = mkdtempSync(join(tmpdir(), "pl-"));
  try {
    mkdirSync(join(dir, "docs"));
    writeFileSync(join(dir, "docs", "plan.md"), swap("depends: T1.1 |", "depends: T9.9 |"));
    writeFileSync(join(dir, "docs", "notes.md"), "# not a plan\n");
    writeFileSync(join(dir, "good.md"), GOOD);
    const all = lintPaths([dir]);
    assert.ok(all.filter((x) => x.severity !== "INFO").every((x) => x.file.endsWith("plan.md")));
    assert.ok(!all.some((x) => x.file.endsWith("notes.md")));
    assert.ok(all.some((x) => x.rule === "dangling-dependency"));
    assert.throws(() => lintPaths([join(dir, "nope")]), /path not found/);
    const script = fileURLToPath(new URL("./plan-lint.mjs", import.meta.url));
    const bad = spawnSync(process.execPath, [script, join(dir, "docs", "plan.md")], { encoding: "utf8" });
    assert.equal(bad.status, 1);
    assert.match(bad.stdout, /FAIL dangling-dependency/);
    const good = spawnSync(process.execPath, [script, join(dir, "good.md"), "--json"], { encoding: "utf8" });
    assert.equal(good.status, 0);
    assert.equal(JSON.parse(good.stdout).summary.fail, 0);
    assert.equal(spawnSync(process.execPath, [script, join(dir, "docs", "notes.md")], { encoding: "utf8" }).status, 1);
    assert.equal(spawnSync(process.execPath, [script], { encoding: "utf8" }).status, 2);
    assert.equal(spawnSync(process.execPath, [script, join(dir, "missing")], { encoding: "utf8" }).status, 2);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
