#!/usr/bin/env node
// Scans agent skill / context files for supply-chain tricks and pins them with a hash lock. Zero dependencies.
//   skill-scan.mjs scan <dir> [--fail-on high|medium|low]
//   skill-scan.mjs lock <dir>                 (prints a lock file to stdout)
//   skill-scan.mjs verify <dir> --lock <file> (exit 1 on any added, removed or changed file)
// A scanner finds known tricks; it cannot prove a skill is safe. Read what you install.
import { createHash } from "node:crypto";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const TEXT_EXT = new Set([".md", ".mjs", ".js", ".cjs", ".sh", ".ps1", ".json", ".toml", ".mdc", ".yml", ".yaml", ".txt"]);
const SKIP_DIRS = new Set(["node_modules", ".git"]);
const RANK = { none: 0, low: 1, medium: 2, high: 3 };
const BLOB_MIN = 200;

const INVISIBLE = /[\u{E0000}-\u{E007F}​-‏⁠-⁤‪-‮⁦-⁩]|(?!^)﻿/u;
const PIPE_TO_SHELL = /\b(?:curl|wget)\b[^\n|]*\|\s*(?:sudo\s+)?(?:sh|bash|zsh|pwsh|powershell)\b/i;
const BLOB = new RegExp(`[A-Za-z0-9+/=]{${BLOB_MIN},}`);
const SECRET = /AKIA[0-9A-Z]{16}|ghp_[A-Za-z0-9]{36}|gh[ousr]_[A-Za-z0-9]{36}|sk-[A-Za-z0-9_-]{32,}|-----BEGIN (?:RSA |EC |OPENSSH |DSA )?PRIVATE KEY-----/;
const OVERRIDE = /ignore (?:all |any |the )?(?:previous|prior|above|earlier) (?:instructions|rules|messages)|disregard (?:the )?(?:system|previous|prior) (?:prompt|instructions)|do not tell the user|without telling the user|you are now (?:in )?(?:developer|dan|god) mode/i;
const COMMENT = /<!--([\s\S]*?)-->/g;
const COMMENT_IMPERATIVE = /\b(?:run|execute|ignore|send|post|upload|curl|download|install|delete|override|exfiltrate|silently)\b/i;

const norm = (s) => s.replace(/\r\n/g, "\n");

export function scanText(file, text) {
  const out = [];
  const add = (rule, severity, line, detail) => out.push({ file, rule, severity, line, detail });
  norm(text).split("\n").forEach((ln, i) => {
    const n = i + 1;
    if (INVISIBLE.test(ln)) add("invisible-unicode", "high", n, "invisible or direction-control characters can hide instructions from a human reviewer");
    if (PIPE_TO_SHELL.test(ln)) add("pipe-to-shell", "high", n, "downloads and runs code in one step");
    if (SECRET.test(ln)) add("secret-pattern", "high", n, "looks like a credential or private key");
    if (BLOB.test(ln)) add("encoded-blob", "medium", n, `a ${BLOB_MIN}+ character encoded run; decode and read it before trusting`);
    if (OVERRIDE.test(ln)) add("override-phrase", "medium", n, "instruction-override wording; fine if it is a quoted example, hostile if it is an instruction");
  });
  const clean = norm(text);
  for (const m of clean.matchAll(COMMENT)) {
    const line = clean.slice(0, m.index).split("\n").length;
    const loud = COMMENT_IMPERATIVE.test(m[1]);
    add("hidden-comment", loud ? "medium" : "low", line, loud ? "html comment hidden from the rendered page that contains an instruction" : "html comment is invisible when rendered but visible to the model");
  }
  return out;
}

function walk(dir, base = dir, acc = []) {
  for (const name of readdirSync(dir).sort()) {
    if (SKIP_DIRS.has(name)) continue;
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) walk(p, base, acc);
    else if (TEXT_EXT.has(name.slice(name.lastIndexOf(".")).toLowerCase())) acc.push(p);
  }
  return acc;
}

export function scanDir(dir) {
  const root = resolve(dir);
  return walk(root).flatMap((p) => scanText(relative(root, p).split(sep).join("/"), readFileSync(p, "utf8")));
}

export const worstSeverity = (findings) => findings.reduce((w, f) => (RANK[f.severity] > RANK[w] ? f.severity : w), "none");

const digest = (p) => createHash("sha256").update(norm(readFileSync(p, "utf8"))).digest("hex");

function manifest(dir) {
  const root = resolve(dir);
  return new Map(walk(root).map((p) => [relative(root, p).split(sep).join("/"), digest(p)]));
}

export function lockDir(dir) {
  const m = manifest(dir);
  return [...m].map(([f, h]) => `${h}  ${f}`).sort((a, b) => a.split("  ")[1].localeCompare(b.split("  ")[1])).join("\n") + "\n";
}

export function verifyLock(dir, lockText) {
  const locked = new Map(lockText.split("\n").filter(Boolean).map((l) => { const i = l.indexOf("  "); return [l.slice(i + 2), l.slice(0, i)]; }));
  const now = manifest(dir);
  return {
    added: [...now.keys()].filter((f) => !locked.has(f)).sort(),
    removed: [...locked.keys()].filter((f) => !now.has(f)).sort(),
    changed: [...now].filter(([f, h]) => locked.has(f) && locked.get(f) !== h).map(([f]) => f).sort(),
  };
}

function main() {
  const [cmd, dir, ...rest] = process.argv.slice(2);
  const opt = (k) => { const i = rest.indexOf(k); return i >= 0 ? rest[i + 1] : undefined; };
  if (!dir || !["scan", "lock", "verify"].includes(cmd)) { console.error("usage: skill-scan.mjs scan|lock|verify <dir> [--fail-on high|medium|low] [--lock file]"); process.exit(2); }
  if (cmd === "lock") { process.stdout.write(lockDir(dir)); return; }
  if (cmd === "verify") {
    const lf = opt("--lock");
    if (!lf) { console.error("--lock <file> is required"); process.exit(2); }
    const v = verifyLock(dir, readFileSync(lf, "utf8"));
    for (const k of ["added", "removed", "changed"]) v[k].forEach((f) => console.log(`${k}: ${f}`));
    const bad = v.added.length + v.removed.length + v.changed.length;
    console.log(bad ? "DRIFT: files differ from the lock; review the diff before trusting" : "OK: matches the lock");
    process.exit(bad ? 1 : 0);
  }
  const findings = scanDir(dir);
  for (const f of findings) console.log(`${f.severity.toUpperCase().padEnd(6)} ${f.rule} ${f.file}:${f.line} -- ${f.detail}`);
  const worst = worstSeverity(findings);
  const threshold = opt("--fail-on");
  console.log(`${findings.length} finding(s); worst: ${worst}`);
  process.exit(threshold && RANK[worst] >= RANK[threshold] ? 1 : 0);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) main();
