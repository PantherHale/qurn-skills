import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { lintPaths, lintReport, loadFetched, normalizeUrl, registrableDomain, summarize } from "./report-lint.mjs";

const GOOD = `VERDICT: mixed
BRIEF: Playwright does not retry by default; the Vitest browser port is documented once only.

FINDINGS
1. [confirmed] Playwright does not retry failing tests by default. The Playwright retries page (primary, https://playwright.dev/docs/test-retries) says failing tests are not retried by default, and the Playwright test source on GitHub (secondary, https://github.com/microsoft/playwright/blob/main/packages/playwright/src/common/config.ts) sets retries to 0 unless configured. Checked 2026-11-24.
2. [single-sourced] Vitest browser mode uses port 23315 by default as of 2026-11-24. The Vitest browser guide (primary, https://vitest.dev/guide/browser/) says port 23315 is assigned by default to avoid clashing with the dev server.

TO VERIFY
- Vitest port 23315: needs a second independent source such as the maintainers' repository.

ADVICE
Use retries: 2 on CI only.
Searched on 2026-11-24; all sources dated at that check.
`;

const rules = (t, o) => lintReport(t, o).map((x) => x.rule);
const has = (t, r, o) => rules(t, o).includes(r);
const sev = (t, r, o) => lintReport(t, o).find((x) => x.rule === r)?.severity;
const swap = (a, b) => GOOD.replace(a, b);

test("a complete report has no FAIL or WARN and reports a summary", () => {
  const found = lintReport(GOOD);
  assert.deepEqual(found.filter((x) => x.severity !== "INFO"), []);
  assert.match(found.find((x) => x.rule === "summary").message, /2 findings: 1 confirmed, 1 single-sourced/);
});

test("registrableDomain and normalizeUrl", () => {
  assert.equal(registrableDomain("https://www.bbc.co.uk/news/a"), "bbc.co.uk");
  assert.equal(registrableDomain("https://docs.github.com/x"), "github.com");
  assert.equal(registrableDomain("https://raw.githubusercontent.com/o/r/main/a"), "github.com");
  assert.equal(registrableDomain("https://web.archive.org/web/20250101000000/https://example.org/a"), "example.org");
  assert.equal(registrableDomain("https://web.archive.org/web/20250101000000id_/https://example.org/a"), "example.org");
  assert.equal(registrableDomain("not a url"), null);
  assert.equal(normalizeUrl("https://WWW.Example.org/a/?utm_source=x&b=1#frag"), "https://example.org/a?b=1");
  assert.equal(normalizeUrl("https://example.org/a."), "https://example.org/a");
  assert.equal(normalizeUrl("::"), null);
});

test("the verdict line is required, first, and valid", () => {
  assert.equal(sev(GOOD.replace("VERDICT: mixed", "Here is what I found"), "no-verdict"), "FAIL");
  assert.equal(sev(GOOD.replace("VERDICT: mixed", "VERDICT: maybe"), "no-verdict"), "FAIL");
  assert.ok(!has(GOOD.replace("VERDICT: mixed", "**VERDICT: mixed**"), "no-verdict"));
  assert.ok(!has(GOOD.replace("VERDICT: mixed", "VERDICT: Mixed"), "no-verdict"));
});

test("a missing or empty FINDINGS section FAILs", () => {
  assert.equal(sev(GOOD.replace(/FINDINGS[\s\S]*TO VERIFY/, "TO VERIFY"), "missing-findings"), "FAIL");
  assert.equal(sev(GOOD.replace(/1\. \[confirmed\][\s\S]*?\n(?=TO VERIFY)/, ""), "no-finding-entries"), "FAIL");
});

test("every finding needs a tier and, above to-verify, a citation", () => {
  assert.equal(sev(swap("1. [confirmed] Playwright", "1. Playwright"), "finding-no-tier"), "FAIL");
  assert.equal(sev(swap(/2\. \[single-sourced\].*\n/.exec(GOOD)[0], "2. [single-sourced] Vitest uses port 23315 by default as of 2026-11-24 according to its browser guide page.\n"), "finding-no-citation"), "FAIL");
  assert.ok(!has(swap(/2\. \[single-sourced\].*\n/.exec(GOOD)[0], "2. [to verify] Vitest uses port 23315 by default as of 2026-11-24, recalled but not fetched this session.\n"), "finding-no-citation"));
});

test("tier labels in several styles are understood", () => {
  for (const label of ["(single-sourced)", "Confidence: single-sourced", "single sourced:", "[Single-Sourced]"]) {
    const t = swap("2. [single-sourced]", `2. ${label}`);
    assert.ok(!has(t, "finding-no-tier"), label);
  }
  assert.ok(!has(swap("2. [single-sourced]", "2. [unconfirmed]"), "finding-no-tier"));
});

test("confirmed needs two independent origins", () => {
  const oneSite = swap("and the Playwright test source on GitHub (secondary, https://github.com/microsoft/playwright/blob/main/packages/playwright/src/common/config.ts)", "and its docs home (secondary, https://playwright.dev/docs/intro)");
  assert.equal(sev(oneSite, "confirmed-needs-two-origins"), "FAIL");
  const mirror = swap("https://github.com/microsoft/playwright/blob/main/packages/playwright/src/common/config.ts", "https://web.archive.org/web/20251101000000/https://playwright.dev/docs/test-retries");
  assert.equal(sev(mirror, "confirmed-needs-two-origins"), "FAIL");
  const sameGithub = swap("https://playwright.dev/docs/test-retries", "https://raw.githubusercontent.com/microsoft/playwright/main/docs/src/test-retries-js.md");
  assert.equal(sev(sameGithub, "confirmed-needs-two-origins"), "FAIL");
  assert.ok(!has(GOOD, "confirmed-needs-two-origins"));
  assert.equal(sev(swap(/1\. \[confirmed\].*\n/.exec(GOOD)[0], "1. [confirmed] Playwright does not retry failing tests by default, per its docs, checked 2026-11-24 and described at length here without a link.\n"), "confirmed-needs-two-origins"), "FAIL");
});

test("verdict must agree with the tiers and the TO VERIFY list", () => {
  assert.equal(sev(GOOD.replace("VERDICT: mixed", "VERDICT: confirmed"), "verdict-mismatch"), "FAIL");
  const allConfirmed = swap("2. [single-sourced]", "2. [confirmed]").replace("https://vitest.dev/guide/browser/", "https://vitest.dev/guide/browser/ and https://github.com/vitest-dev/vitest").replace(/TO VERIFY[\s\S]*?\n\nADVICE/, "TO VERIFY\nnone\n\nADVICE");
  assert.ok(!has(allConfirmed.replace("VERDICT: mixed", "VERDICT: confirmed"), "verdict-mismatch"));
  assert.equal(sev(allConfirmed, "verdict-mismatch-soft"), "WARN");
  assert.equal(sev(allConfirmed.replace("VERDICT: mixed", "VERDICT: unconfirmed"), "verdict-mismatch-soft"), "WARN");
});

test("non-confirmed findings need a visible TO VERIFY list", () => {
  assert.equal(sev(GOOD.replace(/TO VERIFY[\s\S]*?\n\nADVICE/, "ADVICE"), "missing-to-verify"), "FAIL");
  assert.equal(sev(GOOD.replace(/- Vitest port 23315: .*\n/, "none\n"), "missing-to-verify"), "FAIL");
});

test("time-sensitive claims need a date", () => {
  const t = swap("Vitest browser mode uses port 23315 by default as of 2026-11-24. The Vitest browser guide", "Vitest browser mode currently uses port 23315 by default. The Vitest browser guide");
  assert.equal(sev(t, "time-sensitive-no-date"), "WARN");
  assert.ok(!has(GOOD, "time-sensitive-no-date"));
  // "press release" is not a time-sensitive keyword on its own; "latest release" is
  const noDate = swap("as of 2026-11-24. The Vitest browser guide (primary, https://vitest.dev/guide/browser/) says", ". The Vitest browser guide (primary, https://vitest.dev/guide/browser/) says").replace("port 23315 is assigned", "port 23315, which a vendor press release repeats, is assigned");
  assert.ok(!has(noDate, "time-sensitive-no-date"));
  assert.ok(has(noDate.replace("a vendor press release repeats", "the latest release uses"), "time-sensitive-no-date"));
});

test("absolute language on unconfirmed claims, significance without statistics", () => {
  assert.equal(sev(swap("assigned by default to avoid", "always assigned by default to avoid"), "absolute-language"), "WARN");
  assert.ok(!has(swap("Playwright does not retry failing tests by default.", "Playwright never retries failing tests by default."), "absolute-language"));
  assert.equal(sev(swap("is assigned by default", "is significantly different by default"), "significance-word"), "WARN");
  assert.ok(!has(swap("is assigned by default", "is significantly different (p < 0.01, n = 120) by default"), "significance-word"));
});

test("thin findings, snippets and search pages as sources", () => {
  assert.equal(sev(swap(/2\. \[single-sourced\].*\n/.exec(GOOD)[0], "2. [single-sourced] https://vitest.dev/guide/browser/ as of 2026-11-24\n"), "finding-thin"), "WARN");
  assert.equal(sev(swap("says port 23315", "snippet says port 23315"), "snippet-source"), "WARN");
  assert.equal(sev(swap("https://vitest.dev/guide/browser/", "https://www.google.com/search?q=vitest+port"), "search-page-as-source"), "WARN");
});

test("freshness statement and source tiers", () => {
  const t = GOOD.replace("Searched on 2026-11-24; all sources dated at that check.\n", "").replace("Checked 2026-11-24.", "").replace(" as of 2026-11-24", "");
  assert.equal(sev(t, "no-freshness-statement"), "WARN");
  const u = GOOD.replace(/\((primary|secondary), /g, "(");
  assert.equal(sev(u, "source-tier-missing"), "WARN");
});

test("--fetched: a cited URL missing from the log FAILs as a fabricated citation", () => {
  const log = new Set(["https://playwright.dev/docs/test-retries", "https://github.com/microsoft/playwright/blob/main/packages/playwright/src/common/config.ts", "https://vitest.dev/guide/browser"].map(normalizeUrl));
  assert.deepEqual(lintReport(GOOD, { fetched: log }).filter((x) => x.severity !== "INFO"), []);
  const small = new Set(["https://playwright.dev/docs/test-retries"].map(normalizeUrl));
  const f = lintReport(GOOD, { fetched: small }).filter((x) => x.rule === "url-not-fetched");
  assert.equal(f.length, 2);
  assert.equal(f[0].severity, "FAIL");
});

test("a malformed cited URL FAILs", () => {
  const t = swap("https://vitest.dev/guide/browser/", "https://[bad");
  assert.equal(sev(t, "url-malformed"), "FAIL");
  assert.ok(!has(GOOD, "url-malformed"));
});

test("suppression needs a reason of 10+ characters", () => {
  const thin = swap(/2\. \[single-sourced\].*\n/.exec(GOOD)[0], "2. [single-sourced] https://vitest.dev/guide/browser/ as of 2026-11-24\n");
  const ok = thin.replace("2. [single-sourced]", "<!-- report-allow: finding-thin -- one-line yes/no claim, the source is quoted in section 3 -->\n2. [single-sourced]");
  assert.ok(!has(ok, "finding-thin"));
  const short = thin.replace("2. [single-sourced]", "<!-- report-allow: finding-thin -- later -->\n2. [single-sourced]");
  assert.ok(has(short, "suppression-no-reason"));
});

test("multi-line entries with nested bullets belong to their finding", () => {
  const t = GOOD.replace("2. [single-sourced] Vitest", "2. [single-sourced]\n   - Vitest").replace("by default to avoid", "by default\n   - to avoid");
  assert.deepEqual(lintReport(t).filter((x) => x.severity === "FAIL"), []);
});

test("summarize, loadFetched, lintPaths and the cli", () => {
  assert.deepEqual(summarize([{ severity: "WARN" }, { severity: "INFO" }]), { fail: 0, warn: 1, info: 1, exitCode: 0 });
  assert.equal(summarize([{ severity: "WARN" }], { strict: true }).exitCode, 1);
  assert.equal(summarize([{ severity: "FAIL" }]).exitCode, 1);
  const dir = mkdtempSync(join(tmpdir(), "rl-"));
  try {
    mkdirSync(join(dir, "docs"));
    writeFileSync(join(dir, "good.md"), GOOD);
    writeFileSync(join(dir, "bad.md"), GOOD.replace("VERDICT: mixed", "VERDICT: confirmed"));
    writeFileSync(join(dir, "fetched.txt"), "fetched https://playwright.dev/docs/test-retries ok\nhttps://github.com/microsoft/playwright/blob/main/packages/playwright/src/common/config.ts\nhttps://vitest.dev/guide/browser/\n");
    assert.equal(loadFetched(join(dir, "fetched.txt")).size, 3);
    assert.throws(() => loadFetched(join(dir, "nope.txt")), /path not found/);
    assert.throws(() => lintPaths([join(dir, "nope.md")]), /path not found/);
    assert.throws(() => lintPaths([join(dir, "docs")]), /is a folder/);
    const script = fileURLToPath(new URL("./report-lint.mjs", import.meta.url));
    const bad = spawnSync(process.execPath, [script, join(dir, "bad.md")], { encoding: "utf8" });
    assert.equal(bad.status, 1);
    assert.match(bad.stdout, /FAIL verdict-mismatch/);
    const good = spawnSync(process.execPath, [script, join(dir, "good.md"), "--fetched", join(dir, "fetched.txt"), "--json"], { encoding: "utf8" });
    assert.equal(good.status, 0);
    assert.equal(JSON.parse(good.stdout).summary.fail, 0);
    writeFileSync(join(dir, "partial.txt"), "https://playwright.dev/docs/test-retries\n");
    const invented = spawnSync(process.execPath, [script, join(dir, "good.md"), "--fetched", join(dir, "partial.txt")], { encoding: "utf8" });
    assert.equal(invented.status, 1);
    assert.match(invented.stdout, /FAIL url-not-fetched/);
    assert.equal(spawnSync(process.execPath, [script], { encoding: "utf8" }).status, 2);
    assert.equal(spawnSync(process.execPath, [script, join(dir, "good.md"), "--fetched"], { encoding: "utf8" }).status, 2);
    assert.equal(spawnSync(process.execPath, [script, join(dir, "missing.md")], { encoding: "utf8" }).status, 2);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
