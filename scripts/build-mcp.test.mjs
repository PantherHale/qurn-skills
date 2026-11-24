import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { buildMcp, buildSpecialist } from "./build-mcp.mjs";

function fixture() {
  const root = mkdtempSync(join(tmpdir(), "mcp-"));
  const dir = join(root, "coder-specialist");
  mkdirSync(join(dir, "references"), { recursive: true });
  writeFileSync(
    join(dir, "SKILL.md"),
    '---\nname: coder\ndescription: "Advises on code. Use when choosing a stack. Do not use for design."\n---\n\n# Coder specialist\n\nAdvises on code in one paragraph.\n\nSee [ref](references/a.md).\n\n## References\n\n- [ref](references/a.md)\n',
  );
  writeFileSync(join(dir, "references", "a.md"), "# Coder: a\r\n\r\ntext\r\n");
  return root;
}

test("splits the description and cuts instructions before References", () => {
  const s = buildSpecialist(fixture(), "coder");
  assert.equal(s.name, "coder-specialist");
  assert.equal(s.title, "Coder");
  assert.equal(s.purpose, "Advises on code.");
  assert.equal(s.use, "Use when choosing a stack.");
  assert.equal(s.avoid, "Do not use for design.");
  assert.equal(s.description, "Advises on code in one paragraph.");
  assert.ok(!s.instructions.includes("## References"));
  assert.deepEqual(s.references.map((r) => [r.path, r.title]), [["references/a.md", "Coder: a"]]);
  assert.ok(!s.references[0].text.includes("\r"));
});

test("is deterministic and lists every twin", () => {
  const root = fixture();
  assert.equal(buildMcp(root), buildMcp(root));
  assert.equal(JSON.parse(buildMcp(root)).specialists.length, 1);
});

test("a linked reference that does not exist is an error", () => {
  const root = fixture();
  writeFileSync(join(root, "coder-specialist", "SKILL.md"), '---\nname: coder\ndescription: "x. Use when y."\n---\n\n# C\n\nd\n\n[m](references/missing.md)\n');
  assert.throws(() => buildSpecialist(root, "coder"), /does not exist/);
});
