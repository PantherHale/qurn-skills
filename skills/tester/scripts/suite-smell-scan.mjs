#!/usr/bin/env node
// scripts/suite-smell-scan.mjs -- a smoke alarm for tests that cannot fail, wait badly, or hide skips. Not a judge of coverage.
//
//   node scripts/suite-smell-scan.mjs <file-or-folder>... [--json] [--strict]
//
// Exit 1 when any FAIL is found (with --strict, any WARN too). Dependency-free, Node 18+. It reads source only: no browser,
// no test run. It reads test files (*.test.*, *.spec.*, __tests__/, tests/, e2e/) and the config files that decide how
// tests run (playwright, stryker). A clean scan proves nothing about whether the right things are tested: a reviewer
// still names the production change each test would catch (references/test-quality-reference.md).
//
// Rules are our own wording and regexes, written after studying Playwright's best-practices page, the Stryker,
// Vitest and axe documentation and the superpowers test-quality notes; basis for each rule is in
// references/test-quality-reference.md.
//
// Suppress one finding with a reason of 10+ characters on the same line or up to 2 lines above it:
//   // test-allow: wait-for-timeout -- waiting for a third-party widget with no event, ticket 88
// A suppression with a shorter reason still silences the rule but raises `suppression-no-reason`.
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { basename, extname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const CODE_EXTENSIONS = new Set([".js", ".mjs", ".cjs", ".jsx", ".ts", ".tsx", ".mts", ".cts"]);
const SKIP_DIRS = new Set(["worktrees", "node_modules", ".git", "dist", "build", ".next", ".cache", "coverage", ".turbo", ".vercel", "out", "playwright-report", "test-results", ".stryker-tmp"]);
const MIN_REASON_CHARS = 10;
const MAX_CI_RETRIES = 2;

const IMMEDIATE_STATE_CHECKS = "isVisible|isHidden|isChecked|isEnabled|isDisabled|isEditable";
const SNAPSHOT_OF_VALUE_CHECKS = "textContent|innerText|inputValue|getAttribute|count";
const ASSERTION_WORDS = /\b(expect|assert|should|fail|verify)\b|\.to[A-Z]\w*\(|\.rejects\b|\b(?:expect|assert|verify|check)[A-Z_]\w*\(/;

export function fileKind(file) {
  const name = basename(file);
  // Its own test file is full of deliberately bad snippets held in strings; scanning them is noise.
  if (/^suite-smell-scan\.test\.[cm]?js$/.test(name)) return null;
  if (/^playwright\.config\.[cm]?[jt]s$/.test(name)) return "playwright-config";
  if (/^stryker\.(?:conf|config)\.[cm]?[jt]s$|^\.?stryker\.conf\.json$|^stryker\.conf\.json$/.test(name)) return "stryker-config";
  if (!CODE_EXTENSIONS.has(extname(name).toLowerCase())) return null;
  if (/\.(?:test|spec)\.[cm]?[jt]sx?$/.test(name)) return "test";
  const parts = file.split(/[\\/]/);
  if (parts.some((p) => p === "__tests__" || p === "e2e")) return "test";
  return null;
}

// ---------- text helpers ----------
const lineOf = (text, index) => text.slice(0, index).split("\n").length;

function finding(rule, severity, file, text, index, message) {
  return { rule, severity, file, line: lineOf(text, index), message };
}

// Returns the index just after the matching close brace for the brace at `open`, skipping strings and comments.
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

// ---------- rules for test files ----------
const TEST_RULES = [
  function focusedTest(file, text) {
    return [...text.matchAll(/\b(?:test|it|describe)(?:\.(?:serial|parallel|describe))*\.only\s*\(|\b(?:fit|fdescribe)\s*\(/g)].map((m) =>
      finding("focused-test", "FAIL", file, text, m.index, "A focused test (.only / fit) silently skips every other test; remove it before commit."));
  },
  function waitForTimeout(file, text) {
    return [...text.matchAll(/\bwaitForTimeout\s*\(/g)].map((m) =>
      finding("wait-for-timeout", "FAIL", file, text, m.index, "A fixed sleep is a guess: it is too short on a slow machine and wastes time on a fast one. Wait for a condition (an assertion, a response, a locator state)."));
  },
  function sleepInTest(file, text) {
    return [...text.matchAll(/new Promise\s*\(\s*\(?\s*\w+\s*\)?\s*=>\s*setTimeout\s*\(/g)].map((m) =>
      finding("sleep-in-test", "WARN", file, text, m.index, "A promise-wrapped setTimeout is a bare sleep; poll or wait on the thing you are waiting for."));
  },
  function nonRetryingAssertion(file, text) {
    const out = [];
    const immediate = new RegExp(`expect\\(\\s*await\\s+[^;\\n]*?\\.(?:${IMMEDIATE_STATE_CHECKS})\\s*\\(`, "g");
    for (const m of text.matchAll(immediate)) {
      out.push(finding("non-retrying-assertion", "FAIL", file, text, m.index, "This reads the state once and asserts on the copy, so it never waits. Use the retrying form: await expect(locator).toBeVisible() and its siblings."));
    }
    const values = new RegExp(`expect\\(\\s*await\\s+[^;\\n]*?\\.(?:${SNAPSHOT_OF_VALUE_CHECKS})\\s*\\(`, "g");
    for (const m of text.matchAll(values)) {
      out.push(finding("non-retrying-value-check", "WARN", file, text, m.index, "Reading a value once and asserting on it does not retry; prefer await expect(locator).toHaveText / toHaveValue / toHaveAttribute / toHaveCount."));
    }
    return out;
  },
  function mirrorAssertion(file, text) {
    const out = [];
    for (const m of text.matchAll(/expect\(\s*([^()\n]*(?:\([^()\n]*\)[^()\n]*)*)\s*\)\s*\.(?:toBe|toEqual|toStrictEqual)\(\s*([^\n]*?)\s*\)\s*;?\s*$/gm)) {
      const left = m[1].replace(/\s+/g, "");
      const right = m[2].replace(/\s+/g, "");
      if (left.length > 0 && left === right) {
        // The same call on both sides is usually a determinism or idempotency check (real suites have many); the same plain value is a tautology.
        const call = left.includes("(");
        out.push(finding("mirror-assertion", call ? "WARN" : "FAIL", file, text, m.index, call
          ? "Both sides call the same expression. If this checks determinism or idempotency it is fine; if not, it is true whatever the code does. Compare against a hand-derived literal."
          : "Both sides of this assertion are the same expression, so it is true whatever the code does. Compare against a hand-derived literal."));
      }
    }
    return out;
  },
  function noAssertion(file, text) {
    const out = [];
    // Local helpers that contain an assertion (for example `function inRange(x) { expect(x)... }`) make a call to them an assertion.
    const helpers = [];
    for (const h of text.matchAll(/(?:function\s+(\w+)\s*\([^)]*\)\s*(?::\s*[\w<>\[\]| ]+)?\s*\{|(?:const|let)\s+(\w+)\s*=\s*(?:async\s*)?\([^)]*\)\s*(?::\s*[\w<>\[\]| ]+)?\s*=>\s*\{)/g)) {
      const hOpen = h.index + h[0].length - 1;
      if (ASSERTION_WORDS.test(text.slice(hOpen, matchBrace(text, hOpen)))) helpers.push(h[1] || h[2]);
    }
    const helperCall = helpers.length ? new RegExp("\\b(?:" + helpers.join("|") + ")\\s*\\(") : null;
    for (const m of text.matchAll(/\b(?:test|it)(?:\.(?:only|serial|parallel))?\s*\(\s*(['"`])(?:\\.|(?!\1).)*\1\s*,\s*(?:async\s*)?(?:\([^)]*\)|\w+)\s*=>\s*\{|\b(?:test|it)(?:\.(?:only|serial|parallel))?\s*\(\s*(['"`])(?:\\.|(?!\2).)*\2\s*,\s*(?:async\s+)?function\s*\w*\s*\([^)]*\)\s*\{/g)) {
      const open = m.index + m[0].length - 1;
      const body = text.slice(open, matchBrace(text, open));
      if (!ASSERTION_WORDS.test(body) && !(helperCall && helperCall.test(body))) {
        out.push(finding("no-assertion", "FAIL", file, text, m.index, "This test never asserts anything, so it passes whenever the code runs without throwing. Add an assertion on the outcome, or delete it."));
      }
    }
    return out;
  },
  function skipNoReason(file, text) {
    const out = [];
    const lines = text.split("\n");
    for (const m of text.matchAll(/\b(?:test|it|describe)\.(?:skip|fixme)\s*\(([^\n]*)|\b(?:xit|xdescribe|xtest)\s*\(([^\n]*)/g)) {
      const args = m[1] ?? m[2] ?? "";
      const line = lineOf(text, m.index);
      const here = lines[line - 1] || "";
      const above = lines[line - 2] || "";
      const playwrightReason = /^\s*[^,]+,\s*(['"`])[^'"`]{4,}\1/.test(args) && /\.(?:skip|fixme)\s*\(\s*(?:true|false|!?[\w.]+(?:\([^)]*\))?|\([^)]*\)\s*=>[^,]*)\s*,/.test(m[0]);
      const commented = /\/\/\s*\S{4,}|\/\*\s*\S{4,}/.test(here.slice(here.indexOf(m[0].slice(0, 6)) + 1)) || /^\s*\/\/\s*\S{4,}/.test(above);
      const ticket = /#\d+|\b[A-Z][A-Z0-9]+-\d+\b/.test(here + " " + above);
      if (!playwrightReason && !commented && !ticket) {
        out.push(finding("skip-no-reason", "WARN", file, text, m.index, "A skipped test with no written reason or ticket is a silent gap; add why it is skipped and who owns un-skipping it."));
      }
    }
    return out;
  },
  function mockTestId(file, text) {
    return [...text.matchAll(/getByTestId\(\s*['"`][^'"`]*mock[^'"`]*['"`]|data-testid=['"][^'"]*mock[^'"]*['"]/gi)].map((m) =>
      finding("mock-test-id", "WARN", file, text, m.index, "Asserting on a mock's own test id proves the mock is present, not that the real component works; test the real behaviour or delete the assertion."));
  },
  function networkIdleWait(file, text) {
    return [...text.matchAll(/waitForLoadState\(\s*['"]networkidle['"]\s*\)/g)].map((m) =>
      finding("network-idle-wait", "WARN", file, text, m.index, "Waiting for the network to go quiet is unreliable on pages with polling or analytics; wait for the specific element or response the test needs."));
  },
  function cssLocator(file, text) {
    return [...text.matchAll(/\.locator\(\s*(['"`])(?:\.[\w-]+|#[\w-]+|\/\/|xpath=|css=|[a-z]+\.[\w-]+)/g)].map((m) =>
      finding("css-locator", "WARN", file, text, m.index, "A class, id or XPath selector breaks on any restyle; prefer getByRole, getByLabel or getByText, with a test id only as the last resort."));
  },
  function axeSnapshot(file, text) {
    return [...text.matchAll(/violations\s*\)\s*\.toMatchSnapshot\s*\(/g)].map((m) =>
      finding("axe-violations-snapshot", "WARN", file, text, m.index, "Snapshotting the whole violations array is fragile because it contains rendered HTML; assert an empty list, or fingerprint by rule id and target."));
  },
  function axeTagsUnset(file, text) {
    const used = /new AxeBuilder\s*\(/.exec(text);
    if (!used || /\.withTags\s*\(|runOnly/.test(text)) return [];
    return [finding("axe-tags-unset", "WARN", file, text, used.index, "AxeBuilder with no withTags/runOnly runs the default rule set, which leaves the WCAG 2.2 rule off; pass the tags you are claiming (for example wcag2a, wcag2aa, wcag21aa, wcag22aa).")];
  },
  function unseededRandom(file, text) {
    return [...text.matchAll(/Math\.random\s*\(\s*\)/g)].map((m) =>
      finding("unseeded-random", "WARN", file, text, m.index, "Unseeded randomness makes a failure impossible to replay; use a seeded generator or a property-based tool that prints its seed."));
  },
  function externalUrl(file, text) {
    return [...text.matchAll(/\b(?:goto|fetch|request\.(?:get|post))\(\s*['"`]https?:\/\/(?!localhost|127\.0\.0\.1|0\.0\.0\.0|\[::1\])/g)].map((m) =>
      finding("external-url-in-test", "WARN", file, text, m.index, "A test that calls a real external site fails when that site is down or changes; mock third parties (for example page.route) or point at your own staging."));
  },
  function emptyCatch(file, text) {
    return [...text.matchAll(/catch\s*(?:\([^)]*\))?\s*\{\s*\}/g)].map((m) =>
      finding("empty-catch", "WARN", file, text, m.index, "An empty catch in a test swallows the failure it was meant to report."));
  },
];

// ---------- rules for config files ----------
const PLAYWRIGHT_CONFIG_RULES = [
  function noForbidOnly(file, text) {
    return /\bforbidOnly\b/.test(text) ? [] : [finding("config-no-forbid-only", "WARN", file, text, 0, "No forbidOnly: a committed .only would skip the rest of the suite on CI without failing it. Set forbidOnly: !!process.env.CI.")];
  },
  function traceAlwaysOn(file, text) {
    const m = /\btrace\s*:\s*['"](on|retain-on-failure-and-retries)['"]/.exec(text);
    return m && m[1] === "on"
      ? [finding("config-trace-on", "WARN", file, text, m.index, "trace: 'on' records every test and is slow; use 'on-first-retry' (or 'retain-on-failure') on CI.")]
      : [];
  },
  function noTrace(file, text) {
    return /\btrace\s*:/.test(text) ? [] : [finding("config-no-trace", "WARN", file, text, 0, "No trace setting: a CI failure will have no timeline to read. Set trace: 'on-first-retry'.")];
  },
  function retriesHigh(file, text) {
    const out = [];
    for (const m of text.matchAll(/\bretries\s*:\s*(\d+)\b/g)) {
      if (Number(m[1]) > MAX_CI_RETRIES) {
        out.push(finding("config-retries-high", "WARN", file, text, m.index, `retries: ${m[1]} hides flaky tests; keep retries at ${MAX_CI_RETRIES} or fewer and treat a 'flaky' result as a defect.`));
      }
    }
    return out;
  },
];

const STRYKER_CONFIG_RULES = [
  function noBreak(file, text) {
    const hasBreak = /\bbreak\s*"?\s*:\s*(?!null\b)\d+/.test(text);
    return hasBreak ? [] : [finding("stryker-no-break", "WARN", file, text, 0, "No numeric thresholds.break: the default is null, so the build never fails on a weak mutation score. Set break a few points under today's score.")];
  },
];

// ---------- suppression ----------
function suppressions(text) {
  const found = [];
  for (const m of text.matchAll(/test-allow:\s*([a-z0-9-]+)\s*--\s*([^*\n>]*)/g)) {
    found.push({ rule: m[1], line: lineOf(text, m.index), reasonChars: m[2].replace(/\s/g, "").length });
  }
  return found;
}

export function scanText(file, text) {
  const kind = fileKind(file);
  if (!kind) return [];
  const rules = kind === "test" ? TEST_RULES : kind === "playwright-config" ? PLAYWRIGHT_CONFIG_RULES : STRYKER_CONFIG_RULES;
  let findings = rules.flatMap((rule) => rule(file, text));
  const allowed = suppressions(text);
  findings = findings.filter((f) => !allowed.some((s) => s.rule === f.rule && f.line >= s.line && f.line <= s.line + 2));
  for (const s of allowed) {
    if (s.reasonChars < MIN_REASON_CHARS) {
      findings.push({ rule: "suppression-no-reason", severity: "WARN", file, line: s.line, message: `test-allow for ${s.rule} needs a reason of at least ${MIN_REASON_CHARS} characters.` });
    }
  }
  return findings.sort((a, b) => a.line - b.line);
}

// ---------- files ----------
function walk(path, out) {
  const st = statSync(path);
  if (st.isDirectory()) {
    for (const name of readdirSync(path)) {
      if (!SKIP_DIRS.has(name)) walk(join(path, name), out);
    }
  } else if (fileKind(path)) {
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

// ---------- cli ----------
function main(argv) {
  const flags = new Set(argv.filter((a) => a.startsWith("--")));
  const paths = argv.filter((a) => !a.startsWith("--"));
  if (paths.length === 0) {
    console.error("usage: node suite-smell-scan.mjs <file-or-folder>... [--json] [--strict]");
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
    console.log(`suite-smell-scan: ${summary.fail} FAIL, ${summary.warn} WARN (a smoke alarm, not proof the right things are tested)`);
  }
  return summary.exitCode;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  process.exitCode = main(process.argv.slice(2));
}
