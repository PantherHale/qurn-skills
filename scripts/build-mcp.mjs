#!/usr/bin/env node
// Builds mcp/specialists.json from skills/<name>-specialist/ so the MCP server can never serve stale skills.
//   node scripts/build-mcp.mjs            write mcp/specialists.json
//   node scripts/build-mcp.mjs --check    exit 1 if the file is missing or out of date (for CI)
// Fields per specialist: name, title, purpose, description, use, avoid, instructions (body up to "## References"),
// skill (whole SKILL.md), references (each linked file: path, title = its first heading, text).
import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const TWIN_SUFFIX = "-specialist";
const REF_LINK = /\]\((references\/[^)]+)\)/g;
const TITLES = {
  web: "Web designer",
  tester: "Test board",
  architect: "Architect",
  coder: "Coder",
  security: "Security",
  delegator: "Delegator",
  research: "Research",
};
const ORDER = ["web", "tester", "architect", "coder", "security", "delegator", "research"];

const lf = (s) => s.replace(/\r\n/g, "\n");

export function buildSpecialist(skillsDir, name) {
  const dir = join(skillsDir, name + TWIN_SUFFIX);
  const skill = lf(readFileSync(join(dir, "SKILL.md"), "utf8"));
  const front = skill.match(/^---\n([\s\S]*?)\n---\n\n?/);
  if (!front) throw new Error(`${dir}/SKILL.md has no frontmatter`);
  const desc = (front[1].match(/^description: "(.*)"$/m) || [])[1];
  if (!desc) throw new Error(`${dir}/SKILL.md has no quoted description`);
  const body = skill.slice(front[0].length);
  const cut = body.indexOf("\n## References");
  const instructions = cut === -1 ? body : body.slice(0, cut);
  const useAt = desc.indexOf(" Use when");
  const avoidAt = desc.indexOf(" Do not use");
  const end = (at) => (at === -1 ? desc.length : at);
  const purpose = desc.slice(0, end(useAt === -1 ? avoidAt : useAt)).trim();
  const use = useAt === -1 ? "" : desc.slice(useAt, avoidAt > useAt ? avoidAt : desc.length).trim();
  const avoid = avoidAt === -1 ? "" : desc.slice(avoidAt).trim();
  const refs = [...new Set([...body.matchAll(REF_LINK)].map((m) => m[1]))];
  const references = refs.map((path) => {
    const file = join(dir, path);
    if (!existsSync(file)) throw new Error(`${dir}/SKILL.md links ${path} but the file does not exist`);
    const text = lf(readFileSync(file, "utf8"));
    const heading = text.match(/^#\s+(.+)$/m);
    return { path, title: heading ? heading[1].trim() : path, text };
  });
  return {
    name: name + TWIN_SUFFIX,
    title: TITLES[name] || name,
    purpose,
    description: body.split("\n\n")[1] || purpose,
    use,
    avoid,
    instructions,
    skill,
    references,
  };
}

export function buildMcp(skillsDir) {
  const names = readdirSync(skillsDir)
    .filter((d) => d.endsWith(TWIN_SUFFIX))
    .map((d) => d.slice(0, -TWIN_SUFFIX.length))
    .sort((a, b) => (ORDER.indexOf(a) + 1 || 99) - (ORDER.indexOf(b) + 1 || 99));
  return JSON.stringify({ specialists: names.map((n) => buildSpecialist(skillsDir, n)) });
}

function main() {
  const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
  const target = join(root, "mcp", "specialists.json");
  const want = buildMcp(join(root, "skills"));
  if (process.argv.includes("--check")) {
    const have = existsSync(target) ? readFileSync(target, "utf8") : "";
    if (have !== want) {
      console.error("mcp/specialists.json is missing or out of date; run: node scripts/build-mcp.mjs");
      process.exit(1);
    }
    console.log("mcp/specialists.json is up to date");
    return;
  }
  writeFileSync(target, want);
  console.log(`wrote ${target} (${JSON.parse(want).specialists.length} specialists)`);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
