import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { lintDispatch, lintPaths, summarize } from "./dispatch-lint.mjs";

const GOOD = `# Dispatch: add exports
## WORKER W1
ROLE: backend engineer
OBJECTIVE: Add the CSV export endpoint for the shopping list.
OWNS (files/dirs): src/export/csv.ts, tests/export-csv.test.ts
DO NOT TOUCH: package.json, src/routes.ts, src/export/pdf.ts, tests/export-pdf.test.ts
CONTEXT YOU NEED: Express 5 app; lists are arrays of {name, qty, unit}; follow src/export/README.md for naming.
DEPENDS ON: none
OUTPUT FORMAT: a git diff plus one line of test results
DONE WHEN: \`npm test -- export-csv\` passes 6 tests
MODEL: sonnet
## WORKER W2
ROLE: backend engineer
OBJECTIVE: Add the PDF export endpoint for the shopping list.
OWNS (files/dirs): src/export/pdf.ts, tests/export-pdf.test.ts
DO NOT TOUCH: package.json, src/routes.ts, src/export/csv.ts, tests/export-csv.test.ts
CONTEXT YOU NEED: Express 5 app; use the pdf-lib package already in package.json.
DEPENDS ON: none
OUTPUT FORMAT: a git diff plus one line of test results
DONE WHEN: \`npm test -- export-pdf\` passes 4 tests and the generated file opens
MODEL: sonnet
## WORKER W3
OBJECTIVE: Add the export menu to the shopping-list screen and call both endpoints.
OWNS (files/dirs): web/export-menu.tsx, web/export-menu.test.tsx
DO NOT TOUCH: package.json, src/routes.ts
CONTEXT YOU NEED: React 19; endpoints are GET /export/csv and GET /export/pdf returning files.
DEPENDS ON: W1, W2
OUTPUT FORMAT: a git diff plus at most 3 lines of notes
DONE WHEN: \`npm test -- export-menu\` passes 3 tests
## LEAD
After fan-in the lead owns package.json and src/routes.ts, registers the routes, then runs \`npm run build && npm test\`.
`;

const rules = (t, o) => lintDispatch(t, o).map((x) => x.rule);
const has = (t, r, o) => rules(t, o).includes(r);
const sev = (t, r) => lintDispatch(t).find((x) => x.rule === r)?.severity;
const swap = (a, b) => GOOD.replace(a, b);

test("a complete dispatch has no FAIL or WARN and reports its waves", () => {
  const found = lintDispatch(GOOD);
  assert.deepEqual(found.filter((x) => x.severity !== "INFO"), []);
  assert.match(found.find((x) => x.rule === "waves").message, /Wave 1: W1, W2 \| Wave 2: W3/);
});

test("no workers found FAILs", () => {
  assert.equal(sev("just some notes", "no-workers"), "FAIL");
});

test("required fields FAIL, recommended fields WARN", () => {
  const noDone = swap("DONE WHEN: `npm test -- export-csv` passes 6 tests\n", "");
  const f = lintDispatch(noDone).find((x) => x.rule === "worker-field-missing");
  assert.equal(f.severity, "FAIL");
  assert.match(f.message, /DONE WHEN/);
  assert.ok(has(swap("DO NOT TOUCH: package.json, src/routes.ts, src/export/pdf.ts, tests/export-pdf.test.ts\n", ""), "worker-field-missing"));
  assert.equal(sev(swap("DEPENDS ON: none\nOUTPUT FORMAT: a git diff plus one line of test results\nDONE WHEN: `npm test -- export-csv`", "OUTPUT FORMAT: a git diff plus one line of test results\nDONE WHEN: `npm test -- export-csv`"), "worker-field-recommended"), "WARN");
});

test("duplicate worker ids FAIL", () => {
  assert.ok(has(swap("## WORKER W2", "## WORKER W1"), "duplicate-worker-id"));
});

test("parallel workers owning the same file FAIL; ordered ones WARN", () => {
  const clash = swap("OWNS (files/dirs): src/export/pdf.ts, tests/export-pdf.test.ts", "OWNS (files/dirs): src/export/csv.ts, tests/export-pdf.test.ts");
  assert.equal(sev(clash, "owns-overlap"), "FAIL");
  const dir = swap("OWNS (files/dirs): src/export/pdf.ts, tests/export-pdf.test.ts", "OWNS (files/dirs): src/export/");
  assert.ok(has(dir, "owns-overlap"));
  const ordered = swap("OWNS (files/dirs): web/export-menu.tsx, web/export-menu.test.tsx", "OWNS (files/dirs): web/export-menu.tsx, src/export/csv.ts");
  assert.equal(sev(ordered, "owns-overlap-ordered"), "WARN");
  assert.ok(!has(ordered, "owns-overlap"));
});

test("shared wiring owned by a worker FAILs", () => {
  assert.equal(sev(swap("OWNS (files/dirs): web/export-menu.tsx,", "OWNS (files/dirs): package.json, web/export-menu.tsx,"), "shared-wiring-owned"), "FAIL");
  assert.ok(has(swap("OWNS (files/dirs): src/export/csv.ts,", "OWNS (files/dirs): src/routes.ts, src/export/csv.ts,"), "shared-wiring-owned"));
  assert.ok(has(swap("OWNS (files/dirs): src/export/csv.ts,", "OWNS (files/dirs): .github/workflows/ci.yml, src/export/csv.ts,"), "shared-wiring-owned"));
  assert.ok(has(swap("OWNS (files/dirs): src/export/csv.ts,", "OWNS (files/dirs): src/main.ts, src/export/csv.ts,"), "shared-wiring-owned"));
  assert.ok(!has(GOOD, "shared-wiring-owned"));
});

test("too-broad ownership WARNs", () => {
  assert.equal(sev(swap("OWNS (files/dirs): web/export-menu.tsx, web/export-menu.test.tsx", "OWNS (files/dirs): src/"), "owns-too-broad"), "WARN");
});

test("a file both owned and forbidden FAILs", () => {
  assert.ok(has(swap("DO NOT TOUCH: package.json, src/routes.ts, src/export/pdf.ts, tests/export-pdf.test.ts", "DO NOT TOUCH: src/export/csv.ts, src/export/pdf.ts, tests/export-pdf.test.ts"), "owns-and-forbidden"));
});

test("a parallel worker that does not name its sibling's files WARNs", () => {
  assert.equal(sev(swap("DO NOT TOUCH: package.json, src/routes.ts, src/export/pdf.ts, tests/export-pdf.test.ts", "DO NOT TOUCH: package.json, src/routes.ts"), "do-not-touch-incomplete"), "WARN");
});

test("missing sibling names are reported once per worker, not once per pair", () => {
  const three = GOOD.replace(/DEPENDS ON: W1, W2/, "DEPENDS ON: none");
  const stripped = three.replace(/DO NOT TOUCH: package\.json, src\/routes\.ts, src\/export\/pdf\.ts, tests\/export-pdf\.test\.ts/, "DO NOT TOUCH: package.json").replace(/DO NOT TOUCH: package\.json, src\/routes\.ts, src\/export\/csv\.ts, tests\/export-csv\.test\.ts/, "DO NOT TOUCH: package.json");
  const found = lintDispatch(stripped).filter((x) => x.rule === "do-not-touch-incomplete");
  assert.equal(found.length, 3);
  assert.match(found[0].message, /2 parallel siblings/);
});

test("dangling, self and circular dependencies FAIL", () => {
  assert.equal(sev(swap("DEPENDS ON: W1, W2", "DEPENDS ON: W1, W9"), "dangling-depends"), "FAIL");
  assert.ok(has(swap("DEPENDS ON: none\nOUTPUT FORMAT: a git diff plus one line of test results\nDONE WHEN: `npm test -- export-csv`", "DEPENDS ON: W3\nOUTPUT FORMAT: a git diff plus one line of test results\nDONE WHEN: `npm test -- export-csv`"), "dependency-cycle"));
  assert.ok(has(swap("DEPENDS ON: W1, W2", "DEPENDS ON: W3"), "dependency-cycle"));
});

test("back-references FAIL", () => {
  assert.equal(sev(swap("Express 5 app; lists are arrays", "As discussed, the lists are arrays"), "back-reference"), "FAIL");
  assert.ok(has(swap("use the pdf-lib package already in package.json.", "see above for the library choice."), "back-reference"));
  assert.ok(!has(GOOD, "back-reference"));
});

test("done-when must be checkable and output must be capped", () => {
  assert.equal(sev(swap("DONE WHEN: `npm test -- export-menu` passes 3 tests", "DONE WHEN: it works properly"), "done-when-vague"), "WARN");
  assert.equal(sev(swap("OUTPUT FORMAT: a git diff plus at most 3 lines of notes", "OUTPUT FORMAT: a detailed report of what you did"), "report-bloat"), "WARN");
  assert.ok(!has(swap("OUTPUT FORMAT: a git diff plus at most 3 lines of notes", "OUTPUT FORMAT: a short summary, under 100 words"), "report-bloat"));
});

test("workers sharing a port WARN", () => {
  const withPort = swap("CONTEXT YOU NEED: Express 5 app; lists", "CONTEXT YOU NEED: run the dev server on localhost:3000; lists").replace("CONTEXT YOU NEED: Express 5 app; use", "CONTEXT YOU NEED: start the server with --port 3000; use");
  assert.equal(sev(withPort, "shared-runtime-resource"), "WARN");
  assert.ok(!has(GOOD, "shared-runtime-resource"));
});

test("worker count over the cap WARNs and --max-workers changes the cap", () => {
  assert.ok(!has(GOOD, "worker-count"));
  assert.ok(has(GOOD, "worker-count", { maxWorkers: 2 }));
});

test("a missing integration step WARNs; a lead line with a command satisfies it", () => {
  const noLead = GOOD.replace(/## LEAD[\s\S]*$/, "");
  assert.equal(sev(noLead, "no-integration-gate"), "WARN");
  const noCmd = swap("then runs `npm run build && npm test`.", "then looks it over.");
  assert.ok(has(noCmd, "no-integration-gate"));
  const inline = noLead + "LEAD: after fan-in run `npm run build && npm test`.\n";
  assert.ok(!has(inline, "no-integration-gate"));
});

test("a single trivial worker should be done by the lead", () => {
  const one = "## WORKER W1\nOBJECTIVE: Fix the typo.\nOWNS: README.md\nDO NOT TOUCH: src/\nDEPENDS ON: none\nOUTPUT FORMAT: a diff\nDONE WHEN: `git diff` shows one line changed\n";
  assert.equal(sev(one, "trivial-worker"), "WARN");
});

test("workers separated by --- lines and field-only blocks are understood", () => {
  const text = "OBJECTIVE: One.\nOWNS: a.ts\nDO NOT TOUCH: b.ts\nDEPENDS ON: none\nOUTPUT FORMAT: a diff\nDONE WHEN: `npm test` passes 2 tests\n---\nOBJECTIVE: Two.\nOWNS: b.ts\nDO NOT TOUCH: a.ts\nDEPENDS ON: none\nOUTPUT FORMAT: a diff\nDONE WHEN: `npm test` passes 3 tests\n";
  const found = lintDispatch(text);
  assert.equal(found.filter((x) => x.rule === "worker-field-missing").length, 0);
  assert.match(found.find((x) => x.rule === "waves").message, /Wave 1: W1, W2/);
});

test("multi-line field values continue until the next field", () => {
  const text = GOOD.replace("DONE WHEN: `npm test -- export-menu` passes 3 tests", "DONE WHEN: `npm test -- export-menu`\n  passes 3 tests and the menu opens");
  assert.deepEqual(lintDispatch(text).filter((x) => x.severity !== "INFO"), []);
});

test("suppression needs a reason of 10+ characters", () => {
  const clash = swap("OWNS (files/dirs): src/export/pdf.ts, tests/export-pdf.test.ts", "OWNS (files/dirs): src/export/csv.ts, tests/export-pdf.test.ts");
  const ok = clash.replace("OWNS (files/dirs): src/export/csv.ts, tests/export-pdf.test.ts", "<!-- dispatch-allow: owns-overlap -- both only append different sections of one file -->\nOWNS (files/dirs): src/export/csv.ts, tests/export-pdf.test.ts");
  assert.ok(!has(ok, "owns-overlap"));
  const short = clash.replace("OWNS (files/dirs): src/export/csv.ts, tests/export-pdf.test.ts", "<!-- dispatch-allow: owns-overlap -- later -->\nOWNS (files/dirs): src/export/csv.ts, tests/export-pdf.test.ts");
  assert.ok(has(short, "suppression-no-reason"));
});

test("summarize, lintPaths and the cli", () => {
  assert.deepEqual(summarize([{ severity: "WARN" }, { severity: "INFO" }]), { fail: 0, warn: 1, info: 1, exitCode: 0 });
  assert.equal(summarize([{ severity: "WARN" }], { strict: true }).exitCode, 1);
  assert.equal(summarize([{ severity: "FAIL" }]).exitCode, 1);
  const dir = mkdtempSync(join(tmpdir(), "dl-"));
  try {
    mkdirSync(join(dir, "docs"));
    writeFileSync(join(dir, "docs", "dispatch.md"), swap("DEPENDS ON: W1, W2", "DEPENDS ON: W1, W9"));
    writeFileSync(join(dir, "docs", "notes.md"), "# not a dispatch\n");
    writeFileSync(join(dir, "good.md"), GOOD);
    const all = lintPaths([dir]);
    assert.ok(all.some((x) => x.rule === "dangling-depends"));
    assert.ok(!all.some((x) => x.file.endsWith("notes.md")));
    assert.throws(() => lintPaths([join(dir, "nope")]), /path not found/);
    const script = fileURLToPath(new URL("./dispatch-lint.mjs", import.meta.url));
    const bad = spawnSync(process.execPath, [script, join(dir, "docs", "dispatch.md")], { encoding: "utf8" });
    assert.equal(bad.status, 1);
    assert.match(bad.stdout, /FAIL dangling-depends/);
    const good = spawnSync(process.execPath, [script, join(dir, "good.md"), "--json"], { encoding: "utf8" });
    assert.equal(good.status, 0);
    assert.equal(JSON.parse(good.stdout).summary.fail, 0);
    const capped = spawnSync(process.execPath, [script, join(dir, "good.md"), "--max-workers", "2", "--strict"], { encoding: "utf8" });
    assert.equal(capped.status, 1);
    assert.match(capped.stdout, /worker-count/);
    assert.equal(spawnSync(process.execPath, [script], { encoding: "utf8" }).status, 2);
    assert.equal(spawnSync(process.execPath, [script, join(dir, "good.md"), "--max-workers", "x"], { encoding: "utf8" }).status, 2);
    assert.equal(spawnSync(process.execPath, [script, join(dir, "missing")], { encoding: "utf8" }).status, 2);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
