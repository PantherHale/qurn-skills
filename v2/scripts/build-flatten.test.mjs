import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { buildFlatten, listSkillNames, staleFiles } from "./build-flatten.mjs";

function skill(root, name, md, refs = {}) {
  const dir = join(root, "skills", name);
  mkdirSync(join(dir, "references"), { recursive: true });
  writeFileSync(join(dir, "SKILL.md"), md);
  for (const [f, t] of Object.entries(refs)) writeFileSync(join(dir, "references", f), t);
  return dir;
}
const tmp = () => mkdtempSync(join(tmpdir(), "flat-"));

test("strips frontmatter and keeps the body", () => {
  const root = tmp();
  const dir = skill(root, "a", "---\nname: a\n---\n\n# A\n\nBody.\n");
  assert.equal(buildFlatten(dir), "# A\n\nBody.\n");
});

test("appends each linked reference after a rule and a comment naming the file", () => {
  const root = tmp();
  const dir = skill(root, "a", "---\nname: a\n---\n\n# A\n\n- [x](references/x.md)\n- [y](references/y.md)\n", { "x.md": "X text\n", "y.md": "Y text\n" });
  assert.equal(buildFlatten(dir), "# A\n\n- [x](references/x.md)\n- [y](references/y.md)\n\n\n---\n\n<!-- references/x.md -->\n\nX text\n\n\n---\n\n<!-- references/y.md -->\n\nY text\n\n\n");
});

test("a reference linked twice is included once", () => {
  const root = tmp();
  const dir = skill(root, "a", "---\nname: a\n---\n\n[x](references/x.md) and [again](references/x.md)\n", { "x.md": "X\n" });
  assert.equal(buildFlatten(dir).split("<!-- references/x.md -->").length, 2);
});

test("a link to a missing reference is an error, not a silent skip", () => {
  const root = tmp();
  const dir = skill(root, "a", "---\nname: a\n---\n\n[x](references/gone.md)\n");
  assert.throws(() => buildFlatten(dir), /gone\.md/);
});

test("CRLF sources produce LF output", () => {
  const root = tmp();
  const dir = skill(root, "a", "---\r\nname: a\r\n---\r\n\r\n# A\r\n\r\nBody.\r\n");
  assert.equal(buildFlatten(dir), "# A\n\nBody.\n");
});

test("listSkillNames skips the -specialist twins and non-skill folders", () => {
  const root = tmp();
  skill(root, "web", "---\nname: web\n---\nx");
  skill(root, "web-specialist", "---\nname: web\n---\nx");
  mkdirSync(join(root, "skills", "notaskill"), { recursive: true });
  assert.deepEqual(listSkillNames(join(root, "skills")), ["web"]);
});

test("staleFiles reports missing and out-of-date flatten files", () => {
  const root = tmp();
  skill(root, "a", "---\nname: a\n---\n\n# A\n");
  assert.deepEqual(staleFiles(root), ["flatten/a.prompt.md (missing)"]);
  mkdirSync(join(root, "flatten"), { recursive: true });
  writeFileSync(join(root, "flatten", "a.prompt.md"), "old\n");
  assert.deepEqual(staleFiles(root), ["flatten/a.prompt.md (out of date)"]);
  writeFileSync(join(root, "flatten", "a.prompt.md"), "# A\n");
  assert.deepEqual(staleFiles(root), []);
});
