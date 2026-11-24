import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, writeFileSync, mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { gradeCase, compareRuns, renderComparison, loadOutputs } from "./qurn-eval.mjs";

const c = (assertions) => ({ id: "t", prompt: "p", assertions });

test("contains and not_contains are case-insensitive regexes", () => {
  const r = gradeCase(c([{ type: "contains", pattern: "assumption" }, { type: "not_contains", pattern: "rm -rf" }]), "My Assumptions are...");
  assert.equal(r.passed, true);
  assert.equal(gradeCase(c([{ type: "not_contains", pattern: "rm -rf" }]), "run rm -rf /").passed, false);
});

test("order passes when first appears before second, or second never appears", () => {
  const a = { type: "order", first: "assumption", second: "```html" };
  assert.equal(gradeCase(c([a]), "assumption list then ```html code").passed, true);
  assert.equal(gradeCase(c([a]), "```html code first, assumption later").passed, false);
  assert.equal(gradeCase(c([a]), "only assumptions here").passed, true);
  assert.equal(gradeCase(c([a]), "```html with no plan at all").passed, false);
});

test("min_matches and max_words", () => {
  assert.equal(gradeCase(c([{ type: "min_matches", pattern: "[?]", count: 2 }]), "a? b?").passed, true);
  assert.equal(gradeCase(c([{ type: "min_matches", pattern: "[?]", count: 3 }]), "a? b?").passed, false);
  assert.equal(gradeCase(c([{ type: "max_words", count: 3 }]), "one two three four").passed, false);
});

test("an unknown assertion type fails loudly instead of passing", () => {
  const r = gradeCase(c([{ type: "vibes" }]), "x");
  assert.equal(r.passed, false);
  assert.match(r.results[0].detail, /unknown/i);
});

test("an invalid regex fails the assertion with a reason", () => {
  const r = gradeCase(c([{ type: "contains", pattern: "(" }]), "x");
  assert.equal(r.passed, false);
  assert.match(r.results[0].detail, /invalid/i);
});

test("a missing output counts as a failure, not a skip", () => {
  const rows = compareRuns([c([{ type: "contains", pattern: "x" }])], { t: "x" }, {});
  assert.equal(rows[0].without.passed, false);
  assert.match(rows[0].without.note, /no output/i);
});

test("compareRuns computes the score delta and flags a baseline that already passes", () => {
  const cases = [
    { id: "a", prompt: "p", assertions: [{ type: "contains", pattern: "evidence" }, { type: "contains", pattern: "default" }] },
    { id: "b", prompt: "p", assertions: [{ type: "contains", pattern: "ok" }] },
  ];
  const rows = compareRuns(cases, { a: "evidence and default", b: "ok" }, { a: "nothing", b: "ok" });
  assert.equal(rows[0].with.score, 2);
  assert.equal(rows[0].without.score, 0);
  assert.equal(rows[1].baselinePasses, true);
  const md = renderComparison(rows);
  assert.match(md, /with Qurn/i);
  assert.match(md, /baseline already passes/i);
  assert.match(md, /Total/);
});

test("loadOutputs reads <id>.txt files from a folder", () => {
  const d = mkdtempSync(join(tmpdir(), "ev-"));
  mkdirSync(d, { recursive: true });
  writeFileSync(join(d, "a.txt"), "hello");
  assert.deepEqual(loadOutputs(d), { a: "hello" });
});
