#!/usr/bin/env node
// Scores saved agent replies against fixed prompts and compares a run WITH the skill to a run WITHOUT it.
// Deterministic: no AI judge, so the same replies always get the same score.
//   node scripts/qurn-eval.mjs list  --cases evals/qurn/cases.json
//   node scripts/qurn-eval.mjs grade --cases evals/qurn/cases.json --with <dir> --without <dir>
// A <dir> holds one <case-id>.txt per case: the agent's reply to that case's prompt.
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const flags = "i";

function test(pattern, text) {
  try { return { re: new RegExp(pattern, flags) }; } catch { return { error: `invalid pattern: ${pattern}` }; }
}

const CHECKS = {
  contains: (a, t) => { const { re, error } = test(a.pattern, t); return error ? { ok: false, detail: error } : { ok: re.test(t), detail: `contains /${a.pattern}/` }; },
  not_contains: (a, t) => { const { re, error } = test(a.pattern, t); return error ? { ok: false, detail: error } : { ok: !re.test(t), detail: `must not contain /${a.pattern}/` }; },
  min_matches: (a, t) => { const { error } = test(a.pattern, t); if (error) return { ok: false, detail: error }; const n = (t.match(new RegExp(a.pattern, "gi")) || []).length; return { ok: n >= a.count, detail: `${n} match(es) of /${a.pattern}/, need ${a.count}` }; },
  max_words: (a, t) => { const n = t.trim() ? t.trim().split(/\s+/).length : 0; return { ok: n <= a.count, detail: `${n} words, limit ${a.count}` }; },
  order: (a, t) => {
    const f = test(a.first, t); const s = test(a.second, t);
    if (f.error || s.error) return { ok: false, detail: f.error || s.error };
    const fi = t.search(f.re); const si = t.search(s.re);
    if (si === -1) return { ok: true, detail: `/${a.second}/ never appears` };
    return { ok: fi !== -1 && fi < si, detail: `/${a.first}/ must come before /${a.second}/` };
  },
};

export function gradeCase(testCase, text) {
  const results = testCase.assertions.map((a) => {
    const check = CHECKS[a.type];
    return check ? { type: a.type, ...check(a, text) } : { type: a.type, ok: false, detail: `unknown assertion type: ${a.type}` };
  });
  const score = results.filter((r) => r.ok).length;
  return { score, total: results.length, passed: score === results.length, results };
}

export function loadOutputs(dir) {
  const out = {};
  if (!existsSync(dir)) return out;
  for (const f of readdirSync(dir)) if (f.endsWith(".txt")) out[f.slice(0, -4)] = readFileSync(join(dir, f), "utf8");
  return out;
}

function gradeOne(testCase, outputs) {
  if (!(testCase.id in outputs)) return { score: 0, total: testCase.assertions.length, passed: false, note: "no output file for this case" };
  return gradeCase(testCase, outputs[testCase.id]);
}

export function compareRuns(cases, withOut, withoutOut) {
  return cases.map((c) => {
    const w = gradeOne(c, withOut); const wo = gradeOne(c, withoutOut);
    return { id: c.id, with: w, without: wo, baselinePasses: wo.passed };
  });
}

export function renderComparison(rows) {
  const lines = ["| case | with Qurn | without | note |", "|---|---|---|---|"];
  for (const r of rows) {
    const note = r.without.note || r.with.note || (r.baselinePasses ? "baseline already passes: this behaviour may not need the skill" : r.with.score > r.without.score ? "skill helped" : r.with.score < r.without.score ? "skill HURT" : "no difference");
    lines.push(`| ${r.id} | ${r.with.score}/${r.with.total} | ${r.without.score}/${r.without.total} | ${note} |`);
  }
  const sum = (k, f) => rows.reduce((n, r) => n + r[k][f], 0);
  lines.push(`| **Total** | ${sum("with", "score")}/${sum("with", "total")} | ${sum("without", "score")}/${sum("without", "total")} | |`);
  return lines.join("\n") + "\n";
}

function main() {
  const [cmd, ...rest] = process.argv.slice(2);
  const opt = (k) => { const i = rest.indexOf(k); return i >= 0 ? rest[i + 1] : undefined; };
  const casesFile = opt("--cases");
  if (!casesFile || !["list", "grade"].includes(cmd)) { console.error("usage: qurn-eval.mjs list|grade --cases <file> [--with <dir> --without <dir>]"); process.exit(2); }
  const cases = JSON.parse(readFileSync(casesFile, "utf8"));
  if (cmd === "list") { cases.forEach((c) => console.log(`${c.id}\n  ${c.prompt}\n`)); return; }
  const rows = compareRuns(cases, loadOutputs(resolve(opt("--with") || "")), loadOutputs(resolve(opt("--without") || "")));
  process.stdout.write(renderComparison(rows));
  for (const r of rows) for (const x of r.with.results || []) if (!x.ok) console.log(`  with Qurn, ${r.id}: FAILED ${x.type} -- ${x.detail}`);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) main();
