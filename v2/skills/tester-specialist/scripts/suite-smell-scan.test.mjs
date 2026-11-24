import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { fileKind, matchBrace, scanPaths, scanText, summarize } from "./suite-smell-scan.mjs";

const rules = (file, text) => scanText(file, text).map((f) => f.rule);
const has = (file, text, rule) => rules(file, text).includes(rule);
const sev = (file, text, rule) => scanText(file, text).find((f) => f.rule === rule)?.severity;
const SPEC = "a.spec.ts";

test("fileKind classifies test files, configs and ignores source", () => {
  assert.equal(fileKind("src/a.spec.ts"), "test");
  assert.equal(fileKind("src/a.test.mjs"), "test");
  assert.equal(fileKind("tests/e2e/helpers.ts"), "test");
  assert.equal(fileKind("src/__tests__/x.js"), "test");
  assert.equal(fileKind("playwright.config.ts"), "playwright-config");
  assert.equal(fileKind("stryker.config.mjs"), "stryker-config");
  assert.equal(fileKind("src/app.ts"), null);
  assert.equal(fileKind("README.md"), null);
});

test("non-test files produce nothing", () => {
  assert.deepEqual(scanText("src/app.ts", "test.only('x', () => {}); page.waitForTimeout(5)"), []);
});

test("focused tests FAIL", () => {
  assert.equal(sev(SPEC, "test.only('a', async () => { expect(1).toBe(2) })", "focused-test"), "FAIL");
  assert.ok(has(SPEC, "it.only('a', () => { expect(x).toBe(1) })", "focused-test"));
  assert.ok(has(SPEC, "describe.only('a', () => {})", "focused-test"));
  assert.ok(has(SPEC, "fit('a', () => { expect(x).toBe(1) })", "focused-test"));
  assert.ok(!has(SPEC, "test('only this', () => { expect(x).toBe(1) })", "focused-test"));
});

test("waitForTimeout FAILs and promise sleeps WARN", () => {
  assert.equal(sev(SPEC, "await page.waitForTimeout(3000)", "wait-for-timeout"), "FAIL");
  assert.equal(sev(SPEC, "await new Promise(r => setTimeout(r, 500))", "sleep-in-test"), "WARN");
  assert.ok(!has(SPEC, "await page.waitForResponse(/api/)", "wait-for-timeout"));
});

test("non-retrying state checks FAIL, value reads WARN, web-first form is clean", () => {
  assert.equal(sev(SPEC, "expect(await page.getByText('welcome').isVisible()).toBe(true)", "non-retrying-assertion"), "FAIL");
  assert.ok(has(SPEC, "expect(await box.isChecked()).toBeTruthy()", "non-retrying-assertion"));
  assert.equal(sev(SPEC, "expect(await row.textContent()).toBe('Paid')", "non-retrying-value-check"), "WARN");
  assert.ok(has(SPEC, "expect(await list.count()).toBe(3)", "non-retrying-value-check"));
  const good = "await expect(page.getByText('welcome')).toBeVisible()";
  assert.ok(!has(SPEC, good, "non-retrying-assertion"));
  assert.ok(!has(SPEC, good, "non-retrying-value-check"));
});

test("mirror assertions FAIL, literal comparisons do not", () => {
  assert.equal(sev(SPEC, "expect(total).toBe(total);", "mirror-assertion"), "FAIL");
  assert.equal(sev(SPEC, "expect(buildQuery({ tag: 'a' })).toBe(buildQuery({ tag: 'a' }));", "mirror-assertion"), "WARN"); // determinism check, real suites have many
  assert.ok(has(SPEC, "expect(total).toEqual(total)", "mirror-assertion"));
  assert.ok(!has(SPEC, "expect(buildQuery({ tag: 'a' })).toBe('tag:\"a\"');", "mirror-assertion"));
  assert.ok(!has(SPEC, "expect(total).toBe(expectedTotal)", "mirror-assertion"));
});

test("a test with no assertion FAILs; helpers, soft and rejects count as assertions", () => {
  assert.equal(sev(SPEC, "test('does a thing', async () => {\n  await doThing();\n});", "no-assertion"), "FAIL");
  assert.ok(has(SPEC, "it('does a thing', function () {\n  run();\n});", "no-assertion"));
  assert.ok(!has(SPEC, "test('ok', async () => {\n  await expect(page).toHaveURL('/a');\n});", "no-assertion"));
  assert.ok(!has(SPEC, "test('ok', async () => {\n  assert.equal(1, 1);\n});", "no-assertion"));
  assert.ok(!has(SPEC, "test('ok', async () => {\n  await expectToastShown(page);\n});", "no-assertion"));
  assert.ok(!has(SPEC, "test('ok', async () => {\n  await assert.rejects(run());\n});", "no-assertion"));
  assert.ok(!has(SPEC, "test('ok', async ({ page }) => {\n  expect.soft(a).toBe(1);\n});", "no-assertion"));
});

test("no-assertion looks only at its own test body", () => {
  const text = "test('first', () => {\n  run();\n});\ntest('second', () => {\n  expect(1).toBe(1 + 0);\n});";
  const found = scanText(SPEC, text).filter((f) => f.rule === "no-assertion");
  assert.equal(found.length, 1);
  assert.equal(found[0].line, 1);
});

test("matchBrace skips braces inside strings and comments", () => {
  const text = "{ const a = '}'; // }\n /* } */ const b = `}`; }";
  assert.equal(matchBrace(text, 0), text.length);
});

test("skips need a reason, a comment or a ticket", () => {
  assert.ok(has(SPEC, "test.skip('flaky thing', async () => {})", "skip-no-reason"));
  assert.ok(has(SPEC, "xit('thing', () => {})", "skip-no-reason"));
  assert.ok(has(SPEC, "describe.skip('suite', () => {})", "skip-no-reason"));
  assert.ok(!has(SPEC, "test.fixme(true, 'Flaky on CI, see queue note')", "skip-no-reason"));
  assert.ok(!has(SPEC, "test.skip(process.env.CI, 'needs a real GPU')", "skip-no-reason"));
  assert.ok(!has(SPEC, "// TODO(sam): backend not ready yet\ntest.skip('thing', () => {})", "skip-no-reason"));
  assert.ok(!has(SPEC, "test.skip('thing', () => {}) // blocked by #123", "skip-no-reason"));
  assert.ok(!has(SPEC, "test.skip('PROJ-42 thing', () => {})", "skip-no-reason"));
});

test("locator, wait and data smells WARN", () => {
  assert.ok(has(SPEC, "page.locator('.btn.primary').click()", "css-locator"));
  assert.ok(has(SPEC, "page.locator('//div[@id=1]')", "css-locator"));
  assert.ok(has(SPEC, "page.locator('#submit')", "css-locator"));
  assert.ok(!has(SPEC, "page.locator('[data-testid=\"x\"]')", "css-locator"));
  assert.ok(!has(SPEC, "page.getByRole('button', { name: 'Save' })", "css-locator"));
  assert.ok(has(SPEC, "await page.waitForLoadState('networkidle')", "network-idle-wait"));
  assert.ok(has(SPEC, "page.getByTestId('sidebar-mock')", "mock-test-id"));
  assert.ok(has(SPEC, "const n = Math.random()", "unseeded-random"));
  assert.ok(has(SPEC, "await page.goto('https://example.com/pricing')", "external-url-in-test"));
  assert.ok(!has(SPEC, "await page.goto('http://localhost:3000/')", "external-url-in-test"));
  assert.ok(has(SPEC, "try { go() } catch (e) {}", "empty-catch"));
});

test("axe rules: snapshot of violations and unset tags", () => {
  assert.ok(has(SPEC, "expect(results.violations).toMatchSnapshot()", "axe-violations-snapshot"));
  assert.ok(has(SPEC, "const r = await new AxeBuilder({ page }).analyze();", "axe-tags-unset"));
  assert.ok(!has(SPEC, "await new AxeBuilder({ page }).withTags(['wcag2aa']).analyze();", "axe-tags-unset"));
  assert.ok(!has(SPEC, "const a = 1;", "axe-tags-unset"));
});

test("playwright config rules", () => {
  const bad = "export default defineConfig({ retries: 5, use: { trace: 'on' } })";
  const r = rules("playwright.config.ts", bad);
  for (const rule of ["config-no-forbid-only", "config-trace-on", "config-retries-high"]) assert.ok(r.includes(rule), rule);
  const good = "export default defineConfig({ forbidOnly: !!process.env.CI, retries: process.env.CI ? 2 : 0, use: { trace: 'on-first-retry' } })";
  assert.deepEqual(rules("playwright.config.ts", good), []);
  assert.ok(has("playwright.config.ts", "export default {}", "config-no-trace"));
});

test("stryker config needs a numeric break threshold", () => {
  assert.ok(has("stryker.config.mjs", "export default { thresholds: { high: 80, low: 60, break: null } }", "stryker-no-break"));
  assert.ok(has("stryker.config.mjs", "export default { testRunner: 'vitest' }", "stryker-no-break"));
  assert.ok(!has("stryker.config.mjs", "export default { thresholds: { high: 80, low: 60, break: 55 } }", "stryker-no-break"));
});

test("suppression needs a reason of 10+ characters", () => {
  const ok = "// test-allow: wait-for-timeout -- third-party widget exposes no event, ticket 88\nawait page.waitForTimeout(500)";
  assert.deepEqual(rules(SPEC, ok), []);
  const short = "// test-allow: wait-for-timeout -- later\nawait page.waitForTimeout(500)";
  assert.deepEqual(rules(SPEC, short), ["suppression-no-reason"]);
  const far = "// test-allow: wait-for-timeout -- a long enough reason here\n\n\n\nawait page.waitForTimeout(500)";
  assert.ok(has(SPEC, far, "wait-for-timeout"));
});

test("summarize counts and exit codes", () => {
  const findings = [{ severity: "WARN" }, { severity: "WARN" }];
  assert.deepEqual(summarize(findings), { fail: 0, warn: 2, exitCode: 0 });
  assert.equal(summarize(findings, { strict: true }).exitCode, 1);
  assert.equal(summarize([{ severity: "FAIL" }]).exitCode, 1);
});

test("scanPaths walks folders, skips node_modules, and rejects missing paths", () => {
  const dir = mkdtempSync(join(tmpdir(), "tss-"));
  try {
    mkdirSync(join(dir, "tests"));
    mkdirSync(join(dir, "node_modules"));
    writeFileSync(join(dir, "tests", "a.spec.ts"), "test.only('x', () => { expect(1).toBe(2) })");
    writeFileSync(join(dir, "node_modules", "b.spec.ts"), "test.only('x', () => {})");
    const found = scanPaths([dir]);
    assert.equal(found.length, 1);
    assert.equal(found[0].rule, "focused-test");
    assert.throws(() => scanPaths([join(dir, "nope")]), /path not found/);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("cli exits 1 on FAIL, 0 when clean, 2 on bad usage, and prints json", () => {
  const script = fileURLToPath(new URL("./suite-smell-scan.mjs", import.meta.url));
  const dir = mkdtempSync(join(tmpdir(), "tss-cli-"));
  try {
    writeFileSync(join(dir, "bad.spec.ts"), "test.only('x', () => { expect(1).toBe(2) })");
    writeFileSync(join(dir, "good.spec.ts"), "test('x', () => { expect(sum(1, 2)).toBe(3) })");
    const bad = spawnSync(process.execPath, [script, join(dir, "bad.spec.ts")], { encoding: "utf8" });
    assert.equal(bad.status, 1);
    assert.match(bad.stdout, /FAIL focused-test/);
    const good = spawnSync(process.execPath, [script, join(dir, "good.spec.ts"), "--json"], { encoding: "utf8" });
    assert.equal(good.status, 0);
    assert.equal(JSON.parse(good.stdout).summary.fail, 0);
    assert.equal(spawnSync(process.execPath, [script], { encoding: "utf8" }).status, 2);
    assert.equal(spawnSync(process.execPath, [script, join(dir, "missing")], { encoding: "utf8" }).status, 2);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("a call to a local helper that asserts counts as an assertion", () => {
  const withHelper = "function inRange(x) { expect(x).toBeLessThan(3); }\nit('scores', () => {\n  inRange(2);\n});\n";
  const without = "function note(x) { return x; }\nit('scores', () => {\n  note(2);\n});\n";
  assert.ok(!has(SPEC, withHelper, "no-assertion"));
  assert.ok(has(SPEC, without, "no-assertion"));
});
