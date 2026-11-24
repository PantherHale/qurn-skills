import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { spawnSync } from "node:child_process";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { checkRoot, checkSkill, diffFolders, parseFrontmatter, summarize } from "./skills-health.mjs";

const GOOD_SKILL = `---
name: demo-skill
description: "Checks demo things. Use when a demo needs checking or someone asks for a demo audit."
metadata:
  last-reviewed: 2026-11-20
---

# Demo skill

Read [references/a.md](references/a.md) and run \`scripts/run.mjs\`.
`;

function make(files) {
  const root = mkdtempSync(join(tmpdir(), "sh-"));
  for (const [rel, text] of Object.entries(files)) {
    mkdirSync(dirname(join(root, rel)), { recursive: true });
    writeFileSync(join(root, rel), text);
  }
  return root;
}
const GOOD = { "demo/SKILL.md": GOOD_SKILL, "demo/references/a.md": "# A\nshort\n", "demo/scripts/run.mjs": "// x\n", "demo/scripts/run.test.mjs": "// t\n" };
const rules = (root, opts = {}) => checkRoot(root, { today: "2026-11-24", ...opts }).map((x) => x.rule);
const withRoot = (files, fn) => { const r = make(files); try { return fn(r); } finally { rmSync(r, { recursive: true, force: true }); } };

test("parseFrontmatter reads fields, quoted values and nested metadata; CRLF is fine", () => {
  const fm = parseFrontmatter(GOOD_SKILL.replace(/\n/g, "\r\n"));
  assert.equal(fm.data.name, "demo-skill");
  assert.match(fm.data.description, /^Checks demo things/);
  assert.equal(fm.data["metadata.last-reviewed"], "2026-11-20");
  assert.equal(parseFrontmatter("no frontmatter"), null);
  assert.equal(parseFrontmatter("---\nname: x\n"), null);
});

test("a healthy skill has no findings", () => {
  withRoot(GOOD, (r) => assert.deepEqual(checkRoot(r, { today: "2026-11-24" }), []));
});

test("frontmatter problems FAIL", () => {
  const skill = (fm) => ({ ...GOOD, "demo/SKILL.md": `---\n${fm}\n---\n\nRead [references/a.md](references/a.md) and run \`scripts/run.mjs\`.\n` });
  withRoot({ ...GOOD, "demo/SKILL.md": "# no frontmatter\n" }, (r) => assert.ok(rules(r).includes("no-frontmatter")));
  withRoot(skill("description: Use when needed"), (r) => assert.ok(rules(r).includes("name-missing")));
  withRoot(skill("name: Bad_Name\ndescription: Use when needed"), (r) => assert.ok(rules(r).includes("name-invalid")));
  withRoot(skill(`name: ${"a".repeat(65)}\ndescription: Use when needed`), (r) => assert.ok(rules(r).includes("name-invalid")));
  withRoot(skill("name: my-claude-helper\ndescription: Use when needed"), (r) => assert.ok(rules(r).includes("name-reserved")));
  withRoot(skill("name: ok-name"), (r) => assert.ok(rules(r).includes("description-missing")));
  withRoot(skill(`name: ok-name\ndescription: "${"x".repeat(1030)} use when needed"`), (r) => assert.ok(rules(r).includes("description-too-long")));
  withRoot(skill("name: ok-name\ndescription: Use when <b>bold</b> is needed"), (r) => assert.ok(rules(r).includes("description-xml")));
});

test("description voice and trigger wording WARN", () => {
  const skill = (d) => ({ ...GOOD, "demo/SKILL.md": GOOD_SKILL.replace(/description: .*/, `description: ${d}`) });
  withRoot(skill("I can help you check demos. Use when asked"), (r) => assert.ok(rules(r).includes("description-voice")));
  withRoot(skill("You can use this to check demos when asked"), (r) => assert.ok(rules(r).includes("description-voice")));
  withRoot(skill("Checks demo things in great detail"), (r) => assert.ok(rules(r).includes("description-no-when")));
});

test("body length and instruction weight WARN", () => {
  const long = GOOD_SKILL + Array.from({ length: 510 }, (_, i) => `Line ${i}.`).join("\n") + "\n";
  withRoot({ ...GOOD, "demo/SKILL.md": long }, (r) => assert.ok(rules(r).includes("body-too-long")));
  const heavy = GOOD_SKILL + "word ".repeat(4000);
  withRoot({ ...GOOD, "demo/SKILL.md": heavy }, (r) => assert.ok(rules(r).includes("instructions-heavy")));
});

test("stale review date WARNs and respects --max-age-days", () => {
  withRoot({ ...GOOD, "demo/SKILL.md": GOOD_SKILL.replace("2026-11-20", "2026-09-01") }, (r) => {
    assert.ok(rules(r).includes("stale-review"));
    assert.ok(!rules(r, { maxAgeDays: 120 }).includes("stale-review"));
  });
});

test("dangling pointers FAIL; unlisted references and scripts WARN; scripts need tests", () => {
  withRoot({ ...GOOD, "demo/SKILL.md": GOOD_SKILL + "\nAlso see [references/gone.md](references/gone.md) and `scripts/missing.mjs`.\n" }, (r) => {
    assert.equal(rules(r).filter((x) => x === "dangling-reference").length, 2);
  });
  withRoot({ ...GOOD, "demo/references/orphan.md": "# O\n", "demo/scripts/other.mjs": "// o\n" }, (r) => {
    const found = checkRoot(r, { today: "2026-11-24" });
    assert.equal(found.filter((x) => x.rule === "orphan-file").length, 2);
    assert.ok(found.some((x) => x.rule === "script-no-test" && x.file.endsWith("other.mjs")));
  });
});

test("long reference files need a table of contents; references should not link to each other", () => {
  const body = "# Big\n" + Array.from({ length: 120 }, (_, i) => `line ${i}`).join("\n") + "\n";
  withRoot({ ...GOOD, "demo/references/a.md": body }, (r) => assert.ok(rules(r).includes("no-toc")));
  withRoot({ ...GOOD, "demo/references/a.md": "# Contents\n" + body }, (r) => assert.ok(!rules(r).includes("no-toc")));
  withRoot({ ...GOOD, "demo/references/a.md": "# A\nSee [the other](b.md) for more.\n", "demo/references/b.md": "# B\n", "demo/SKILL.md": GOOD_SKILL + "\nAlso [references/b.md](references/b.md).\n" }, (r) => assert.ok(rules(r).includes("nested-reference")));
});

test("a health-allow comment with a real reason suppresses a rule; a short one is reported", () => {
  const nested = { "demo/references/a.md": "# A\nSee [the other](b.md).\n", "demo/references/b.md": "# B\n" };
  const base = GOOD_SKILL + "\nAlso [references/b.md](references/b.md).\n";
  withRoot({ ...GOOD, ...nested, "demo/SKILL.md": base + "<!-- health-allow: nested-reference -- read together on purpose by design -->\n" }, (r) => assert.ok(!rules(r).includes("nested-reference")));
  withRoot({ ...GOOD, ...nested, "demo/SKILL.md": base + "<!-- health-allow: nested-reference -- later -->\n" }, (r) => assert.ok(rules(r).includes("suppression-no-reason")));
});

test("twin copies must be identical: drift in either direction FAILs, CRLF is ignored", () => {
  const twins = (extra) => ({ ...GOOD, ...Object.fromEntries(Object.entries(GOOD).map(([k, v]) => [k.replace("demo/", "demo-specialist/"), v])), ...extra });
  withRoot(twins({}), (r) => assert.ok(!rules(r).includes("twin-drift")));
  withRoot(twins({ "demo-specialist/references/a.md": "# A\r\nshort\r\n" }), (r) => assert.ok(!rules(r).includes("twin-drift")));
  withRoot(twins({ "demo/references/extra.md": "# E\n" }), (r) => assert.ok(rules(r).includes("twin-drift")));
  withRoot(twins({ "demo-specialist/references/extra.md": "# E\n" }), (r) => {
    const f = checkRoot(r, { today: "2026-11-24" }).find((x) => x.rule === "twin-drift");
    assert.match(f.message, /only in demo-specialist/);
  });
  withRoot(twins({ "demo-specialist/references/a.md": "# A changed\n" }), (r) => assert.match(checkRoot(r, { today: "2026-11-24" }).find((x) => x.rule === "twin-drift").message, /differ/));
});

test("--compare reports another copy's differences as INFO", () => {
  const a = make(GOOD);
  const b = make({ ...GOOD, "demo/references/a.md": "# A different\n", "other/SKILL.md": GOOD_SKILL.replace("demo-skill", "other") });
  try {
    const found = checkRoot(a, { today: "2026-11-24", compare: b });
    assert.ok(found.some((x) => x.rule === "compare-differs" && x.severity === "INFO"));
    const rev = checkRoot(b, { today: "2026-11-24", compare: a });
    assert.ok(rev.some((x) => x.rule === "compare-missing"));
    assert.throws(() => checkRoot(a, { compare: join(a, "nope") }), /path not found/);
    assert.deepEqual(diffFolders(a, a), { onlyA: [], onlyB: [], differ: [] });
  } finally { rmSync(a, { recursive: true, force: true }); rmSync(b, { recursive: true, force: true }); }
});

test("checkSkill on a bare folder and summarize", () => {
  withRoot(GOOD, (r) => assert.deepEqual(checkSkill(join(r, "demo"), { today: "2026-11-24" }), []));
  assert.deepEqual(summarize([{ severity: "WARN" }, { severity: "INFO" }]), { fail: 0, warn: 1, info: 1, exitCode: 0 });
  assert.equal(summarize([{ severity: "WARN" }], { strict: true }).exitCode, 1);
  assert.equal(summarize([{ severity: "FAIL" }]).exitCode, 1);
});

test("cli exit codes, json and usage errors", () => {
  const script = fileURLToPath(new URL("./skills-health.mjs", import.meta.url));
  withRoot({ ...GOOD, "demo/SKILL.md": GOOD_SKILL + "\n`scripts/missing.mjs`\n" }, (r) => {
    const bad = spawnSync(process.execPath, [script, r, "--today", "2026-11-24"], { encoding: "utf8" });
    assert.equal(bad.status, 1);
    assert.match(bad.stdout, /FAIL dangling-reference/);
  });
  withRoot(GOOD, (r) => {
    const good = spawnSync(process.execPath, [script, r, "--today", "2026-11-24", "--json"], { encoding: "utf8" });
    assert.equal(good.status, 0);
    assert.equal(JSON.parse(good.stdout).summary.fail, 0);
    const stale = spawnSync(process.execPath, [script, r, "--today", "2027-06-01", "--strict"], { encoding: "utf8" });
    assert.equal(stale.status, 1);
    assert.match(stale.stdout, /stale-review/);
    assert.equal(spawnSync(process.execPath, [script, r, "--max-age-days", "x"], { encoding: "utf8" }).status, 2);
    assert.equal(spawnSync(process.execPath, [script, r, "--today", "not-a-date"], { encoding: "utf8" }).status, 2);
    assert.equal(spawnSync(process.execPath, [script, r, "--compare"], { encoding: "utf8" }).status, 2);
    assert.equal(spawnSync(process.execPath, [script, join(r, "nope")], { encoding: "utf8" }).status, 2);
    assert.equal(spawnSync(process.execPath, [script], { encoding: "utf8" }).status, 2);
  });
});
