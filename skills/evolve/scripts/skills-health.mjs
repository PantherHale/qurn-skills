#!/usr/bin/env node
// scripts/skills-health.mjs -- a health check for a folder of skills: frontmatter limits, dangling and orphaned files,
// twin copies that have drifted apart, reference files with no table of contents, stale review dates. A hygiene check,
// not a judge of whether a skill is any good.
//
//   node scripts/skills-health.mjs <skills-folder> [--compare <other-skills-folder>] [--today YYYY-MM-DD]
//                                  [--max-age-days N] [--json] [--strict]
//
// Exit 1 on any FAIL (with --strict, any WARN too). Dependency-free, Node 18+, reads files only. Every folder under the
// given root that contains a SKILL.md is a skill. A folder named "<name>-specialist" next to "<name>" is its twin and
// must be byte-for-byte the same (line endings ignored); --compare lists how another copy of the whole folder (for
// example a V2 tree) differs, as INFO.
//
// Limits come from Anthropic's Agent Skills documentation (read 2026-11-24): name at most 64 characters of lowercase
// letters, digits and hyphens, no reserved words "anthropic" or "claude"; description non-empty, at most 1,024
// characters, no XML tags, third person, says what the skill does and when to use it; SKILL.md body under 500 lines;
// references one level deep from SKILL.md; a table of contents for reference files over 100 lines; the instructions
// level should stay under about 5,000 tokens. Our own rules: no file under references/ or scripts/ left unlisted in
// SKILL.md; every script has a test; a review date no older than --max-age-days (default 30).
//
// Suppress one finding with a reason of 10+ characters inside SKILL.md:
//   <!-- health-allow: nested-reference -- the glossary is read together with this file by design -->
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { basename, dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const MAX_NAME = 64;
const MAX_DESCRIPTION = 1024;
const MAX_BODY_LINES = 500;
const TOC_FROM_LINES = 100;
const MAX_SKILL_TOKENS = 5000;
const TOKENS_PER_WORD = 4 / 3; // rough: a word is about 1.3 tokens
const DEFAULT_MAX_AGE_DAYS = 30;
const MIN_REASON_CHARS = 10;
const RESERVED = ["anthropic", "claude"];
const SKIP_DIRS = new Set(["node_modules", ".git", "dist", "build", "coverage"]);

const f = (rule, severity, file, line, message) => ({ rule, severity, file, line, message });
const nl = (s) => s.replace(/\r\n/g, "\n");

// ---------- parsing ----------
export function parseFrontmatter(text) {
  const t = nl(text);
  if (!t.startsWith("---\n")) return null;
  const end = t.indexOf("\n---", 4);
  if (end === -1) return null;
  const block = t.slice(4, end);
  const out = { raw: block, bodyStart: t.slice(0, end + 4).split("\n").length, data: {} };
  let parent = null;
  for (const line of block.split("\n")) {
    const m = /^(\s*)([A-Za-z][\w-]*)\s*:\s*(.*)$/.exec(line);
    if (!m) continue;
    let v = m[3].trim();
    if (/^(["']).*\1$/.test(v)) v = v.slice(1, -1);
    if (m[1].length === 0) { out.data[m[2]] = v; parent = v === "" ? m[2] : null; }
    else if (parent) out.data[`${parent}.${m[2]}`] = v;
  }
  return out;
}

function listFiles(dir, base = dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    if (SKIP_DIRS.has(name)) continue;
    const p = join(dir, name);
    if (statSync(p).isDirectory()) out.push(...listFiles(p, base));
    else out.push(relative(base, p).replace(/\\/g, "/"));
  }
  return out.sort();
}

function mentions(skillText, rel) {
  const base = rel.split("/").pop();
  return skillText.includes(rel) || skillText.includes(base);
}

// ---------- per-skill checks ----------
export function checkSkill(dir, { today = new Date().toISOString().slice(0, 10), maxAgeDays = DEFAULT_MAX_AGE_DAYS } = {}) {
  const file = join(dir, "SKILL.md");
  const text = readFileSync(file, "utf8");
  const lines = nl(text).split("\n");
  const out = [];
  const fm = parseFrontmatter(text);
  if (!fm) {
    out.push(f("no-frontmatter", "FAIL", file, 1, "SKILL.md has no YAML frontmatter (--- name and description ---), so the skill cannot be discovered."));
    return finish(out, lines);
  }
  const name = fm.data.name ?? "";
  const description = fm.data.description ?? "";
  if (!name) out.push(f("name-missing", "FAIL", file, 2, "No name in the frontmatter."));
  else {
    if (name.length > MAX_NAME || !/^[a-z0-9-]+$/.test(name)) out.push(f("name-invalid", "FAIL", file, 2, `name "${name}" must be at most ${MAX_NAME} characters of lowercase letters, digits and hyphens.`));
    if (RESERVED.some((r) => name.includes(r))) out.push(f("name-reserved", "FAIL", file, 2, `name "${name}" contains a reserved word (${RESERVED.join(", ")}).`));
  }
  if (!description.trim()) out.push(f("description-missing", "FAIL", file, 2, "No description: it is what the model reads to decide whether to load the skill."));
  else {
    if (description.length > MAX_DESCRIPTION) out.push(f("description-too-long", "FAIL", file, 2, `description is ${description.length} characters; the limit is ${MAX_DESCRIPTION}.`));
    if (/<\/?[a-zA-Z][^>]*>/.test(description)) out.push(f("description-xml", "FAIL", file, 2, "description contains XML-like tags, which are not allowed."));
    if (/^(i|you|we|my)\b/i.test(description.trim()) || /\b(I can|you can use|I will|I help)\b/i.test(description)) out.push(f("description-voice", "WARN", file, 2, "description should be in the third person (\"Processes ...\"), because it is injected into the system prompt."));
    if (!/\b(use when|use for|use this|when (the|a|an|you|asked|someone)|triggers?)\b/i.test(description)) out.push(f("description-no-when", "WARN", file, 2, "description says nothing about when to use the skill; include the situations and key terms that should trigger it."));
  }
  const bodyLines = lines.length - fm.bodyStart;
  if (bodyLines > MAX_BODY_LINES) out.push(f("body-too-long", "WARN", file, fm.bodyStart + 1, `SKILL.md body is ${bodyLines} lines; keep it under ${MAX_BODY_LINES} and move detail into references.`));
  const words = nl(text).split(/\s+/).filter(Boolean).length;
  const tokens = Math.round(words * TOKENS_PER_WORD);
  if (tokens > MAX_SKILL_TOKENS) out.push(f("instructions-heavy", "WARN", file, 1, `SKILL.md is about ${tokens} tokens (${words} words); the instructions level should stay under about ${MAX_SKILL_TOKENS}.`));

  const reviewed = fm.data["metadata.last-reviewed"];
  if (reviewed && /^\d{4}-\d{2}-\d{2}$/.test(reviewed)) {
    const age = Math.round((Date.parse(today) - Date.parse(reviewed)) / 86_400_000);
    if (age > maxAgeDays) out.push(f("stale-review", "WARN", file, 2, `last-reviewed ${reviewed} is ${age} days old (limit ${maxAgeDays}); refresh or re-confirm it.`));
  }

  // dangling pointers and orphans
  const files = listFiles(dir);
  const fileSet = new Set(files);
  const pointers = new Set([
    ...[...text.matchAll(/\]\(((?:references|scripts)\/[^)#\s]+)\)/g)].map((m) => m[1]),
    ...[...text.matchAll(/`((?:references|scripts)\/[A-Za-z0-9._-]+\.[A-Za-z0-9]+)`/g)].map((m) => m[1]),
  ]);
  for (const p of pointers) if (!fileSet.has(p)) out.push(f("dangling-reference", "FAIL", file, lineIndex(lines, p), `SKILL.md points to ${p}, which does not exist in this skill.`));
  for (const rel of files) {
    if (!/^(references|scripts)\//.test(rel) || /\.test\.[cm]?js$/.test(rel)) continue;
    if (!mentions(text, rel)) out.push(f("orphan-file", "WARN", join(dir, rel), 1, `${rel} is not mentioned in SKILL.md, so progressive disclosure never reaches it.`));
  }
  for (const rel of files) {
    if (/^scripts\/[^/]+\.[cm]?js$/.test(rel) && !/\.test\./.test(rel) && !fileSet.has(rel.replace(/\.([cm]?js)$/, ".test.$1"))) out.push(f("script-no-test", "WARN", join(dir, rel), 1, `${rel} has no test file next to it.`));
  }

  // reference files: table of contents and nesting
  for (const rel of files.filter((x) => /^references\/.+\.md$/.test(x))) {
    const body = nl(readFileSync(join(dir, rel), "utf8"));
    const n = body.split("\n").length;
    if (n > TOC_FROM_LINES && !/^#{1,3}\s*(table of )?contents\b/im.test(body) && !/^\s*[-*]\s*\[[^\]]+\]\(#/m.test(body)) out.push(f("no-toc", "WARN", join(dir, rel), 1, `${rel} is ${n} lines with no table of contents; a model that reads only the top of the file will miss the rest.`));
    const nested = [...body.matchAll(/\]\(((?:\.\/)?(?:references\/)?[A-Za-z0-9._-]+-?[A-Za-z0-9._-]*\.md)\)/g)].map((m) => m[1]).filter((x) => x !== rel);
    if (nested.length) out.push(f("nested-reference", "WARN", join(dir, rel), 1, `${rel} links to ${[...new Set(nested)].slice(0, 3).join(", ")}; keep references one level deep from SKILL.md (a model may read a nested file only partly).`));
  }
  return finish(out, lines);
}

const lineIndex = (lines, needle) => Math.max(1, lines.findIndex((l) => l.includes(needle)) + 1);

function finish(out, lines) {
  const allowed = [];
  lines.forEach((l, i) => {
    const m = /health-allow:\s*([a-z0-9-]+)\s*--\s*([^>\n]*)/.exec(l);
    if (m) allowed.push({ rule: m[1], line: i + 1, chars: m[2].replace(/\s/g, "").length });
  });
  let res = out.filter((x) => !allowed.some((s) => s.rule === x.rule));
  for (const s of allowed) if (s.chars < MIN_REASON_CHARS) res.push(f("suppression-no-reason", "WARN", "", s.line, `health-allow for ${s.rule} needs a reason of at least ${MIN_REASON_CHARS} characters.`));
  return res;
}

// ---------- twins and comparison ----------
export function diffFolders(a, b) {
  const fa = new Set(listFiles(a)), fb = new Set(listFiles(b));
  const onlyA = [...fa].filter((x) => !fb.has(x));
  const onlyB = [...fb].filter((x) => !fa.has(x));
  const differ = [...fa].filter((x) => fb.has(x) && nl(readFileSync(join(a, x), "utf8")) !== nl(readFileSync(join(b, x), "utf8")));
  return { onlyA, onlyB, differ };
}

function skillDirs(root) {
  return readdirSync(root).filter((n) => !SKIP_DIRS.has(n)).map((n) => join(root, n)).filter((p) => statSync(p).isDirectory() && existsSync(join(p, "SKILL.md")));
}

export function checkRoot(root, opts = {}) {
  if (!existsSync(root)) throw new Error(`path not found: ${root}`);
  const dirs = skillDirs(root);
  const out = [];
  for (const d of dirs) out.push(...checkSkill(d, opts));
  for (const d of dirs) {
    const n = basename(d);
    if (!n.endsWith("-specialist")) continue;
    const main = join(root, n.slice(0, -"-specialist".length));
    if (!existsSync(join(main, "SKILL.md"))) continue;
    const { onlyA, onlyB, differ } = diffFolders(main, d);
    if (onlyA.length + onlyB.length + differ.length > 0) {
      const parts = [];
      if (onlyA.length) parts.push(`only in ${basename(main)}: ${onlyA.slice(0, 4).join(", ")}${onlyA.length > 4 ? ", ..." : ""}`);
      if (onlyB.length) parts.push(`only in ${n}: ${onlyB.slice(0, 4).join(", ")}${onlyB.length > 4 ? ", ..." : ""}`);
      if (differ.length) parts.push(`differ: ${differ.slice(0, 4).join(", ")}${differ.length > 4 ? ", ..." : ""}`);
      out.push(f("twin-drift", "FAIL", d, 1, `${n} is not identical to ${basename(main)} (${parts.join("; ")}). Diff both ways before syncing: either copy can hold the newer content.`));
    }
  }
  if (opts.compare) {
    if (!existsSync(opts.compare)) throw new Error(`path not found: ${opts.compare}`);
    const there = new Set(skillDirs(opts.compare).map((p) => basename(p)));
    for (const d of dirs) {
      const n = basename(d);
      if (!there.has(n)) { out.push(f("compare-missing", "INFO", d, 1, `${n} has no counterpart in ${opts.compare}.`)); continue; }
      const { onlyA, onlyB, differ } = diffFolders(d, join(opts.compare, n));
      if (onlyA.length + onlyB.length + differ.length > 0) out.push(f("compare-differs", "INFO", d, 1, `${n} differs from the copy in ${opts.compare}: ${onlyA.length} files only here, ${onlyB.length} only there, ${differ.length} different.`));
    }
  }
  return out;
}

export function summarize(findings, { strict = false } = {}) {
  const fail = findings.filter((x) => x.severity === "FAIL").length;
  const warn = findings.filter((x) => x.severity === "WARN").length;
  const info = findings.filter((x) => x.severity === "INFO").length;
  return { fail, warn, info, exitCode: fail > 0 || (strict && warn > 0) ? 1 : 0 };
}

// ---------- cli ----------
function opt(argv, name) {
  const i = argv.indexOf(name);
  return i >= 0 ? argv[i + 1] : undefined;
}

function main(argv) {
  const valueFlags = new Set(["--compare", "--today", "--max-age-days"]);
  const flags = new Set(argv.filter((a) => a.startsWith("--") && !valueFlags.has(a)));
  const values = new Set(argv.flatMap((a, i) => (valueFlags.has(a) ? [i + 1] : [])));
  const paths = argv.filter((a, i) => !a.startsWith("--") && !values.has(i));
  const maxAgeDays = opt(argv, "--max-age-days") !== undefined ? Number(opt(argv, "--max-age-days")) : DEFAULT_MAX_AGE_DAYS;
  const today = opt(argv, "--today") ?? new Date().toISOString().slice(0, 10);
  if (paths.length !== 1 || !Number.isFinite(maxAgeDays) || Number.isNaN(Date.parse(today)) || (argv.includes("--compare") && !opt(argv, "--compare"))) {
    console.error("usage: node skills-health.mjs <skills-folder> [--compare <other-folder>] [--today YYYY-MM-DD] [--max-age-days N] [--json] [--strict]");
    return 2;
  }
  let findings;
  try {
    findings = checkRoot(paths[0], { today, maxAgeDays, compare: opt(argv, "--compare") });
  } catch (error) {
    console.error(error.message);
    return 2;
  }
  const summary = summarize(findings, { strict: flags.has("--strict") });
  if (flags.has("--json")) {
    console.log(JSON.stringify({ summary, findings }, null, 2));
  } else {
    for (const x of findings) console.log(`${x.severity} ${x.rule} ${x.file}:${x.line} ${x.message}`);
    console.log(`skills-health: ${summary.fail} FAIL, ${summary.warn} WARN, ${summary.info} INFO (hygiene only; not a judge of skill quality)`);
  }
  return summary.exitCode;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  process.exitCode = main(process.argv.slice(2));
}
