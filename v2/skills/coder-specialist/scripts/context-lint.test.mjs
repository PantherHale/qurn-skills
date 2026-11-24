import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { isContextFile, scanPaths, scanText, summarize } from "./context-lint.mjs";

function project(files) {
  const dir = mkdtempSync(join(tmpdir(), "cl-"));
  mkdirSync(join(dir, ".git"));
  for (const [name, text] of Object.entries(files)) {
    mkdirSync(join(dir, name, ".."), { recursive: true });
    writeFileSync(join(dir, name), text);
  }
  return dir;
}
const lint = (dir, name, text, opts) => scanText(join(dir, name), text, { root: dir, ...opts });
const rules = (dir, name, text, opts) => lint(dir, name, text, opts).map((f) => f.rule);
const GOOD = "# Project\nRun `npm test` before every commit.\n";

test("isContextFile matches CLAUDE.md, CLAUDE.local.md and AGENTS.md only", () => {
  assert.ok(isContextFile("a/CLAUDE.md"));
  assert.ok(isContextFile("CLAUDE.local.md"));
  assert.ok(isContextFile("x/AGENTS.md"));
  assert.ok(!isContextFile("README.md"));
  assert.ok(!isContextFile("SKILL.md"));
});

test("a short file with a check command is clean", () => {
  const dir = project({ "CLAUDE.md": GOOD });
  try {
    assert.deepEqual(rules(dir, "CLAUDE.md", GOOD), []);
  } finally { rmSync(dir, { recursive: true, force: true }); }
});

test("too long over 200 lines", () => {
  const dir = project({});
  try {
    const long = GOOD + Array.from({ length: 210 }, (_, i) => `Rule number ${i} about something specific.`).join("\n");
    assert.ok(rules(dir, "CLAUDE.md", long).includes("too-long"));
    assert.ok(!rules(dir, "CLAUDE.md", GOOD).includes("too-long"));
    assert.ok(!rules(dir, "README.md", long, { allMd: true }).includes("too-long"));
  } finally { rmSync(dir, { recursive: true, force: true }); }
});

test("missing check command", () => {
  const dir = project({});
  try {
    assert.ok(rules(dir, "AGENTS.md", "# Notes\nBe nice.\n").includes("no-check-command"));
    assert.ok(!rules(dir, "AGENTS.md", "Run pytest and ruff.\n").includes("no-check-command"));
    assert.ok(!rules(dir, "AGENTS.md", "Verify with `node --test`.\n").includes("no-check-command"));
  } finally { rmSync(dir, { recursive: true, force: true }); }
});

test("broken @import FAILs, existing ones and code spans do not", () => {
  const dir = project({ "docs/api.md": "x", "CLAUDE.md": GOOD });
  try {
    const text = GOOD + "See @docs/api.md and @docs/missing.md\nExample: `@docs/inline-missing.md`\n```\n@docs/fenced-missing.md\n```\nmail me@example.com\n";
    const found = lint(dir, "CLAUDE.md", text).filter((f) => f.rule === "broken-import");
    assert.equal(found.length, 1);
    assert.equal(found[0].severity, "FAIL");
    assert.match(found[0].message, /missing\.md/);
  } finally { rmSync(dir, { recursive: true, force: true }); }
});

test("import chain deeper than four hops warns", () => {
  const dir = project({
    "a.md": "@b.md", "b.md": "@c.md", "c.md": "@d.md", "d.md": "@e.md", "e.md": "@f.md", "f.md": "end",
    "CLAUDE.md": GOOD + "@a.md\n",
  });
  try {
    assert.ok(rules(dir, "CLAUDE.md", GOOD + "@a.md\n").includes("import-too-deep"));
  } finally { rmSync(dir, { recursive: true, force: true }); }
  const ok = project({ "a.md": "@b.md", "b.md": "end", "CLAUDE.md": GOOD + "@a.md\n" });
  try {
    assert.ok(!rules(ok, "CLAUDE.md", GOOD + "@a.md\n").includes("import-too-deep"));
  } finally { rmSync(ok, { recursive: true, force: true }); }
});

test("broken backticked paths WARN, real ones and non-paths do not", () => {
  const dir = project({ "src/app.ts": "x", "CLAUDE.md": GOOD });
  try {
    const text = GOOD + "Entry is `src/app.ts`. Old file `src/gone.ts` and `scripts/old-check.mjs`. Use `npm run build`. URL `https://x.org/a/b.md`. Glob `src/**/*.ts`. Template `docs/<name>.md`.\n";
    const found = lint(dir, "CLAUDE.md", text).filter((f) => f.rule === "broken-path");
    assert.equal(found.length, 2);
    assert.ok(found.every((f) => f.severity === "WARN"));
  } finally { rmSync(dir, { recursive: true, force: true }); }
});

test("--md checks every markdown file for broken paths only; paths resolve from the file or the repo root", () => {
  const dir = project({ "skills/x/SKILL.md": "x", "docs/guide.md": "x" });
  try {
    const text = "See `skills/x/SKILL.md` (root-relative) and `../x/SKILL.md` and `./nope/file.md`.\n";
    // the root-relative path resolves; the other two are broken
    const found = lint(dir, "docs/guide.md", text, { allMd: true });
    assert.deepEqual(found.map((f) => f.rule), ["broken-path", "broken-path"]);
    assert.ok(!found.some((f) => f.message.includes("`skills/x/SKILL.md`")));
    assert.deepEqual(rules(dir, "docs/guide.md", text), []);
  } finally { rmSync(dir, { recursive: true, force: true }); }
});

test("paths inside a skill resolve against the skill folder", () => {
  const dir = project({ "skills/t/SKILL.md": "x", "skills/t/scripts/run.mjs": "x", "skills/t/references/r.md": "x" });
  try {
    const text = "Run `scripts/run.mjs`; see `references/r.md`; not `scripts/gone.mjs`.\n";
    const found = lint(dir, "skills/t/references/r.md", text, { allMd: true });
    assert.equal(found.length, 1);
    assert.match(found[0].message, /gone\.mjs/);
  } finally { rmSync(dir, { recursive: true, force: true }); }
});

test("duplicate and vague lines", () => {
  const dir = project({});
  try {
    const dup = GOOD + "Never commit directly to the main branch.\nNever commit directly to the main branch.\n";
    assert.ok(rules(dir, "CLAUDE.md", dup).includes("duplicate-line"));
    assert.ok(!rules(dir, "CLAUDE.md", GOOD + "Short.\nShort.\n").includes("duplicate-line"));
    assert.ok(rules(dir, "CLAUDE.md", GOOD + "Always write clean code and follow best practices.\n").includes("vague-rule"));
    assert.ok(!rules(dir, "CLAUDE.md", GOOD + "Use 2-space indent; no default exports.\n").includes("vague-rule"));
  } finally { rmSync(dir, { recursive: true, force: true }); }
});

test("suppression needs a reason of 10+ characters", () => {
  const dir = project({});
  try {
    const ok = GOOD + "<!-- ctx-allow: broken-path -- generated at build time by the docs job -->\nSee `docs/generated.md`.\n";
    assert.deepEqual(rules(dir, "CLAUDE.md", ok), []);
    const short = GOOD + "<!-- ctx-allow: broken-path -- later -->\nSee `docs/generated.md`.\n";
    assert.deepEqual(rules(dir, "CLAUDE.md", short), ["suppression-no-reason"]);
  } finally { rmSync(dir, { recursive: true, force: true }); }
});

test("root detection falls back to the file's own directory without a .git", () => {
  const dir = mkdtempSync(join(tmpdir(), "cl-nogit-"));
  try {
    writeFileSync(join(dir, "CLAUDE.md"), GOOD + "See `docs/none.md`.\n");
    const found = scanText(join(dir, "CLAUDE.md"), GOOD + "See `docs/none.md`.\n");
    assert.ok(found.some((f) => f.rule === "broken-path"));
  } finally { rmSync(dir, { recursive: true, force: true }); }
});

test("summarize, scanPaths and the cli", () => {
  assert.deepEqual(summarize([{ severity: "WARN" }]), { fail: 0, warn: 1, exitCode: 0 });
  assert.equal(summarize([{ severity: "WARN" }], { strict: true }).exitCode, 1);
  assert.equal(summarize([{ severity: "FAIL" }]).exitCode, 1);
  const dir = project({ "CLAUDE.md": GOOD + "@docs/missing.md\n", "other/README.md": "`nope/x.md`" });
  try {
    assert.equal(scanPaths([dir]).filter((f) => f.rule === "broken-import").length, 1);
    assert.ok(scanPaths([dir], { allMd: true }).some((f) => f.rule === "broken-path"));
    assert.throws(() => scanPaths([join(dir, "nope")]), /path not found/);
    const script = fileURLToPath(new URL("./context-lint.mjs", import.meta.url));
    const bad = spawnSync(process.execPath, [script, dir], { encoding: "utf8" });
    assert.equal(bad.status, 1);
    assert.match(bad.stdout, /FAIL broken-import/);
    assert.equal(JSON.parse(spawnSync(process.execPath, [script, dir, "--json"], { encoding: "utf8" }).stdout).summary.fail, 1);
    assert.equal(spawnSync(process.execPath, [script], { encoding: "utf8" }).status, 2);
    assert.equal(spawnSync(process.execPath, [script, join(dir, "missing")], { encoding: "utf8" }).status, 2);
  } finally { rmSync(dir, { recursive: true, force: true }); }
});
