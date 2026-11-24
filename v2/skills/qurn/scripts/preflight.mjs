#!/usr/bin/env node
// Ship preflight for the qurn lead. Built from real operator sessions: a packaged app that opened to a blank screen
// because build-time variables were never passed, a desktop app whose every install shared one hosted database, a tool
// folder committed to a repo, and Docker stopping mid-run.
//   node scripts/preflight.mjs <project-dir> [--json]
// Exit 1 on any FAIL. Suppress a line with a comment: preflight-ignore: <reason of 10+ characters>
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { join, relative, extname, basename } from "node:path";

const SKIP_DIRS = new Set(["worktrees", "node_modules", ".git", "dist", "build", ".next", ".venv", "venv", "__pycache__", "coverage", "target", ".turbo", "out", "release", ".vite", ".output"]);
const SRC_EXT = new Set([".js", ".mjs", ".cjs", ".ts", ".tsx", ".jsx", ".vue", ".svelte", ".py"]);
const DOC_NAMES = /^(\.env(\.[\w-]+)?\.(example|sample|template)|readme(\.md)?|install(\.md)?|docker-compose[\w.-]*\.ya?ml|dockerfile)$/i;
const PUBLIC_PREFIX = /^(VITE_|NEXT_PUBLIC_|REACT_APP_|EXPO_PUBLIC_|PUBLIC_|APP_|NUXT_PUBLIC_)/;
const BUILTIN = new Set(["NODE_ENV", "MODE", "DEV", "PROD", "SSR", "BASE_URL", "PATH", "HOME", "USERPROFILE", "CI", "PWD", "TMP", "TEMP", "TMPDIR", "USER", "SHELL", "LANG", "APPDATA", "LOCALAPPDATA", "PORT", "HOST", "DEBUG", "TERM", "OS", "GITHUB_TOKEN", "GITHUB_ACTIONS", "RUNNER_OS", "PYTHONPATH", "VIRTUAL_ENV"]);
const ENV_REF = [
  /process\.env\.([A-Z][A-Z0-9_]+)/g,
  /process\.env\[\s*["']([A-Z][A-Z0-9_]+)["']\s*\]/g,
  /import\.meta\.env\.([A-Z][A-Z0-9_]+)/g,
  /os\.environ(?:\.get)?\(\s*["']([A-Z][A-Z0-9_]+)["']/g,
  /os\.environ\[\s*["']([A-Z][A-Z0-9_]+)["']\s*\]/g,
  /os\.getenv\(\s*["']([A-Z][A-Z0-9_]+)["']/g,
];
const HOSTED_URL = /https?:\/\/[\w.-]+\.(pythonanywhere\.com|herokuapp\.com|onrender\.com|vercel\.app|netlify\.app|supabase\.co|railway\.app|fly\.dev)\b/;
const IGNORE = /preflight-ignore:\s*(\S.{9,})/;
const TRACKED_BAD = [
  [/^(\.env|\.env\.(local|production|development))$/, "FAIL", "env-file-tracked", "an environment file with real values is committed"],
  [/^\.impeccable(\/|$)/, "WARN", "tool-folder-tracked", "a design tool's working folder is committed; add it to .gitignore"],
  [/^\.claude\/(settings\.local\.json|projects\/)/, "FAIL", "agent-private-tracked", "agent-private settings or transcripts are committed"],
  [/^node_modules\//, "FAIL", "node-modules-tracked", "node_modules is committed"],
];

function walk(dir, out = []) {
  let names;
  try { names = readdirSync(dir); } catch { return out; }
  for (const n of names) {
    if (SKIP_DIRS.has(n)) continue;
    const p = join(dir, n);
    let st;
    try { st = statSync(p); } catch { continue; }
    if (st.isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}

const isTest = (f) => /(\.test\.|\.spec\.|__tests__|[\\/]tests?[\\/]|[\\/]fixtures?[\\/])/i.test(f);

export function preflight(root) {
  const findings = [];
  const add = (level, rule, file, line, msg) => findings.push({ level, rule, file: relative(root, file) || file, line, msg });
  const files = walk(root);
  const docText = [];
  const workflows = [];
  for (const f of files) {
    const base = basename(f);
    const rel = relative(root, f).replace(/\\/g, "/");
    if (DOC_NAMES.test(base) || /^docs\/.*\.md$/i.test(rel)) docText.push(readFileSync(f, "utf8"));
    if (/^\.github\/workflows\/.*\.ya?ml$/.test(rel)) { const t = readFileSync(f, "utf8"); workflows.push({ f, t }); docText.push(t); }
  }
  const documented = docText.join("\n");
  const seen = new Map();
  for (const f of files) {
    if (!SRC_EXT.has(extname(f)) || isTest(f)) continue;
    const lines = readFileSync(f, "utf8").split(/\r?\n/);
    lines.forEach((text, i) => {
      if (IGNORE.test(text) || (i > 0 && IGNORE.test(lines[i - 1]))) return;
      for (const re of ENV_REF) {
        re.lastIndex = 0;
        for (const m of text.matchAll(re)) {
          const name = m[1];
          if (BUILTIN.has(name) || seen.has(name)) continue;
          seen.set(name, { f, line: i + 1 });
        }
      }
      if (HOSTED_URL.test(text) && !/^\s*(\/\/|#)/.test(text)) {
        add("WARN", "hosted-url-literal", f, i + 1, "A hosted server address is written into the code. If this ships in an installed app, every install talks to the same server and database; read it from configuration and say which environment is meant.");
      }
    });
  }
  for (const [name, at] of seen) {
    const inDocs = new RegExp("\\b" + name + "\\b").test(documented);
    if (!inDocs) {
      const pub = PUBLIC_PREFIX.test(name);
      add(pub ? "FAIL" : "WARN", "env-undocumented", at.f, at.line, `${name} is read here but no .env.example, README, docs page or workflow mentions it.` + (pub ? " A build-time variable that is missing makes the shipped app start blank." : " A new machine cannot know it must set it."));
    } else if (PUBLIC_PREFIX.test(name) && workflows.some((w) => /\b(build|package|dist|electron-builder|vite build|npm run build)\b/.test(w.t)) && !workflows.some((w) => new RegExp("\\b" + name + "\\b").test(w.t))) {
      add("FAIL", "ci-var-not-passed", workflows[0].f, 1, `The workflow builds the app but never passes ${name}. The published build will start with it empty (a blank screen in a real session). Add it as a repository secret and an env entry on the build step.`);
    }
  }
  if (existsSync(join(root, ".git"))) {
    try {
      const tracked = execFileSync("git", ["-C", root, "ls-files"], { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 }).split("\n").filter(Boolean);
      for (const t of tracked) for (const [re, level, rule, msg] of TRACKED_BAD) if (re.test(t)) add(level, rule, join(root, t), 0, msg);
    } catch { /* not a usable git repo: skip the tracked-file checks */ }
  }
  for (const n of ["docker-compose.yml", "docker-compose.yaml", "compose.yml"]) {
    if (existsSync(join(root, n))) add("WARN", "service-dependency", join(root, n), 1, "This project needs Docker services. Start them before launching or testing and check they are up again before the final run; Docker stopped twice mid-run in a real session.");
  }
  return findings;
}

function main() {
  const args = process.argv.slice(2);
  const dir = args.find((a) => !a.startsWith("--"));
  if (!dir) { console.error("usage: preflight.mjs <project-dir> [--json]"); process.exit(2); }
  const findings = preflight(dir);
  if (args.includes("--json")) console.log(JSON.stringify(findings, null, 1));
  else for (const f of findings) console.log(`${f.level} ${f.rule} ${f.file}:${f.line} ${f.msg}`);
  const fail = findings.filter((f) => f.level === "FAIL").length;
  console.log(`preflight: ${fail} FAIL, ${findings.length - fail} WARN (a ship checklist, not proof the app works)`);
  process.exit(fail ? 1 : 0);
}

if (process.argv[1] && process.argv[1].replace(/\\/g, "/").endsWith("scripts/preflight.mjs")) main();
