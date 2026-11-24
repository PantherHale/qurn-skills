#!/usr/bin/env node
// Builds flatten/<name>.prompt.md from skills/<name>/ so the single-file prompts can never drift from the skills.
//   node scripts/build-flatten.mjs            write every flatten file
//   node scripts/build-flatten.mjs --check    exit 1 if any flatten file is missing or out of date (for CI)
// Format: SKILL.md body without frontmatter, then each linked reference after a rule and a comment naming the file.
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const TWIN_SUFFIX = "-specialist";
const REF_LINK = /\]\((references\/[^)]+)\)/g;
const REF_BLOCK_END = "\n\n\n";

const lf = (s) => s.replace(/\r\n/g, "\n");

export function buildFlatten(skillDir) {
  const skill = lf(readFileSync(join(skillDir, "SKILL.md"), "utf8"));
  const front = skill.match(/^---\n[\s\S]*?\n---\n/);
  if (!front) throw new Error(`${skillDir}/SKILL.md has no frontmatter`);
  const body = skill.slice(front[0].length).replace(/^\n+/, "").replace(/\n+$/, "");
  const refs = [...new Set([...body.matchAll(REF_LINK)].map((m) => m[1]))];
  let out = body;
  for (const ref of refs) {
    const file = join(skillDir, ref);
    if (!existsSync(file)) throw new Error(`${skillDir}/SKILL.md links ${ref} but the file does not exist`);
    out += `\n\n\n---\n\n<!-- ${ref} -->\n\n${lf(readFileSync(file, "utf8")).replace(/^\n+|\n+$/g, "")}`;
  }
  return out + (refs.length ? REF_BLOCK_END : "\n");
}

export function listSkillNames(skillsDir) {
  return readdirSync(skillsDir, { withFileTypes: true })
    .filter((d) => d.isDirectory() && !d.name.endsWith(TWIN_SUFFIX) && existsSync(join(skillsDir, d.name, "SKILL.md")))
    .map((d) => d.name)
    .sort();
}

export function staleFiles(root) {
  const stale = [];
  for (const name of listSkillNames(join(root, "skills"))) {
    const target = join(root, "flatten", `${name}.prompt.md`);
    const rel = `flatten/${name}.prompt.md`;
    if (!existsSync(target)) { stale.push(`${rel} (missing)`); continue; }
    if (lf(readFileSync(target, "utf8")) !== buildFlatten(join(root, "skills", name))) stale.push(`${rel} (out of date)`);
  }
  return stale;
}

function main() {
  const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
  if (process.argv.includes("--check")) {
    const stale = staleFiles(root);
    stale.forEach((s) => console.log(`stale: ${s}`));
    console.log(stale.length ? "FAIL: run `node scripts/build-flatten.mjs` and commit the result" : "OK: flatten files match the skills");
    process.exit(stale.length ? 1 : 0);
  }
  mkdirSync(join(root, "flatten"), { recursive: true });
  for (const name of listSkillNames(join(root, "skills"))) {
    writeFileSync(join(root, "flatten", `${name}.prompt.md`), buildFlatten(join(root, "skills", name)));
    console.log(`wrote flatten/${name}.prompt.md`);
  }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) main();
