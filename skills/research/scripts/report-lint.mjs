#!/usr/bin/env node
// scripts/report-lint.mjs -- check a research report against the handback format and the discipline in references/.
// A format and consistency check, not a judge of whether the sources say what the report claims.
//
//   node scripts/report-lint.mjs <report.md>... [--fetched <urls.txt>] [--json] [--strict]
//
// Exit 1 on any FAIL (with --strict, any WARN too). Dependency-free, Node 18+, reads files only.
//
// What it can check: a VERDICT line; FINDINGS with a confidence tier and a citation each; "confirmed" findings that
// really cite two independent origins (two pages on one site, or an archive copy plus its original, are one origin); the
// verdict agreeing with the tiers and the TO VERIFY list; time-sensitive claims that carry a date; absolute language on
// claims that are not confirmed; "significant" with no statistics; a stated freshness ceiling. With --fetched <file>
// (one URL per line: every page the researcher actually fetched or was returned by search) it also fails any cited URL
// that is not in that log, which is the mechanical catch for an invented citation.
// What it cannot check: whether a cited page says what the report says it does, whether two outlets share one origin
// behind different domains (syndication, one press release), or whether a source is credible. Those need a reader who
// opens the sources.
//
// Suppress one finding with a reason of 10+ characters on the same line or the line above:
//   <!-- report-allow: finding-thin -- the claim is a one-line yes/no and the source is quoted below -->
import { existsSync, readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const MIN_REASON_CHARS = 10;
const MIN_FINDING_CHARS = 60;
const MULTI = new Set(["co.uk", "org.uk", "ac.uk", "gov.uk", "com.au", "net.au", "org.au", "gov.au", "co.jp", "co.nz", "com.br", "co.in", "co.za", "com.cn"]);
const ALIAS = { "githubusercontent.com": "github.com", "twitter.com": "x.com", "github.io": "github.io" };
const TIME_SENSITIVE = /\b(prices?|pricing|costs?|versions?|latest|currently|as of|laws?|regulations?|deadlines?|released|release (date|notes)|new release|latest release|ceo|rankings?|market share|per month|per year|per user)\b|\$\s?\d/i;
const HAS_DATE = /\b(?:19|20)\d{2}\b|\b(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.? \d{1,2}\b/i;
const ABSOLUTE = /\b(always|never|everyone|no one|nobody|all experts|undisputed|proven|guaranteed|without exception|100\s?%|beyond doubt)\b/i;
const SIGNIFICANT = /\bsignificant(ly)?\b/i;
const HAS_STATS = /\bp\s*[<=>]|confidence interval|\bCI\b|95\s?%|statistically|standard deviation|effect size|sample size|\bn\s*=/i;
const FRESHNESS = /\b(as of|searched on|retrieved|accessed|knowledge (cut-?off|gap)|freshness|date of search|checked on)\b/i;
const SNIPPET = /\b(search snippet|the snippet|snippet says|search result says|according to (the )?(search )?results? page)\b/i;
const SOURCE_TIER = /\b(primary|secondary|tertiary)\b/i;

const f = (rule, severity, line, message) => ({ rule, severity, line, message });

// ---------- URLs and domains ----------
export function normalizeUrl(u) {
  try {
    const x = new URL(u.replace(/[.,;:)\]>"']+$/, ""));
    x.hash = "";
    for (const k of [...x.searchParams.keys()]) if (/^(utm_|fbclid|gclid)/i.test(k)) x.searchParams.delete(k);
    let s = `${x.protocol}//${x.host.toLowerCase().replace(/^www\./, "")}${x.pathname.replace(/\/+$/, "")}${x.search}`;
    return s;
  } catch {
    return null;
  }
}

export function registrableDomain(u) {
  let url;
  try { url = new URL(u.replace(/[.,;:)\]>"']+$/, "")); } catch { return null; }
  let host = url.hostname.toLowerCase().replace(/^www\./, "");
  if (host === "web.archive.org" || host === "archive.org") {
    const m = /\/web\/\d+[a-z_]*\/(https?:\/\/.+)$/.exec(url.pathname + url.search);
    if (m) return registrableDomain(m[1]);
  }
  const parts = host.split(".");
  let dom = parts.length >= 3 && MULTI.has(parts.slice(-2).join(".")) ? parts.slice(-3).join(".") : parts.slice(-2).join(".");
  return ALIAS[dom] ?? dom;
}

const urlsIn = (text) => [...text.matchAll(/https?:\/\/[^\s<>"'`]+/g)].map((m) => m[0].replace(/[.,;:)\]]+$/, ""));

// ---------- parsing ----------
function parse(text) {
  const lines = text.split("\n");
  const first = lines.findIndex((l) => l.trim() !== "");
  const verdictMatch = first >= 0 ? /^\s*(?:\*\*|#+\s*)?VERDICT\s*:\s*\**\s*(confirmed|mixed|unconfirmed)\b/i.exec(lines[first]) : null;
  const heads = [];
  lines.forEach((l, i) => {
    const m = /^\s*(?:#{1,4}\s*|\*\*)?(FINDINGS|TO VERIFY|ADVICE)\s*[:*]*\s*$/i.exec(l);
    if (m) heads.push({ name: m[1].toUpperCase(), line: i });
  });
  const sec = (name) => {
    const h = heads.find((x) => x.name === name);
    if (!h) return null;
    const next = heads.filter((x) => x.line > h.line).sort((a, b) => a.line - b.line)[0];
    return { start: h.line, end: next ? next.line : lines.length };
  };
  return { lines, verdict: verdictMatch ? verdictMatch[1].toLowerCase() : null, verdictLine: first, findings: sec("FINDINGS"), toVerify: sec("TO VERIFY") };
}

function entries(lines, s) {
  const out = [];
  let cur = null;
  for (let i = s.start + 1; i < s.end; i++) {
    const l = lines[i];
    if (/^ {0,1}(?:[-*]|\d+[.)]|F\d+[.:)]?)\s+\S/.test(l)) {
      cur = { line: i + 1, text: l };
      out.push(cur);
    } else if (cur && l.trim() !== "") cur.text += "\n" + l;
  }
  return out;
}

function tierOf(text) {
  const norm = (t) => { const x = t.toLowerCase().replace(/\s+/g, " "); return x === "single sourced" ? "single-sourced" : x === "unconfirmed" ? "to verify" : x; };
  const pat = "confirmed|single[- ]sourced|contested|to verify|unconfirmed";
  const m = new RegExp(`\\[(${pat})\\]|\\((${pat})\\)|\\b(?:confidence|tier)\\s*:\\s*\\**(${pat})|^\\W*(?:\\d+[.)]\\s*|F\\d+[.:)]?\\s*)?\\W*(${pat})\\b`, "i").exec(text);
  if (m) return norm(m[1] ?? m[2] ?? m[3] ?? m[4]);
  const loose = new RegExp(`\\b(${pat})\\b`, "i").exec(text.slice(0, 160));
  return loose ? norm(loose[1]) : null;
}

// ---------- checks ----------
export function lintReport(text, { fetched = null } = {}) {
  const p = parse(text);
  let out = [];
  if (!p.verdict) out.push(f("no-verdict", "FAIL", p.verdictLine + 1 || 1, "The first line must be \"VERDICT: confirmed\", \"VERDICT: mixed\" or \"VERDICT: unconfirmed\"."));
  if (!p.findings) {
    out.push(f("missing-findings", "FAIL", 1, "No FINDINGS section. One entry per claim, each with a confidence tier and its citations."));
    return finish(out, p);
  }
  const items = entries(p.lines, p.findings);
  if (items.length === 0) out.push(f("no-finding-entries", "FAIL", p.findings.start + 1, "FINDINGS has no entries (use a numbered or bulleted line per claim)."));
  const tiers = [];
  for (const e of items) {
    const tier = tierOf(e.text);
    tiers.push(tier);
    const urls = urlsIn(e.text);
    const domains = new Set(urls.map(registrableDomain).filter(Boolean));
    if (!tier) out.push(f("finding-no-tier", "FAIL", e.line, "No confidence tier (confirmed, single-sourced, contested or to verify)."));
    if (tier && tier !== "to verify" && urls.length === 0) out.push(f("finding-no-citation", "FAIL", e.line, `A "${tier}" finding with no URL. Every claim above "to verify" cites what it actually read.`));
    if (tier === "confirmed" && urls.length > 0 && domains.size < 2) out.push(f("confirmed-needs-two-origins", "FAIL", e.line, `Marked confirmed but its citations come from ${domains.size === 0 ? "no usable URL" : `one origin (${[...domains][0]})`}. Two pages on one site, or an archive copy and its original, are one source; confirmed needs two independent origins.`));
    if (tier === "confirmed" && urls.length === 0) out.push(f("confirmed-needs-two-origins", "FAIL", e.line, "Marked confirmed with no citations."));
    const bare = e.text.replace(/https?:\/\/\S+/g, "").replace(/\[(?:confirmed|single[- ]sourced|contested|to verify)\]/gi, "").replace(/\s+/g, " ").trim();
    if (bare.length < MIN_FINDING_CHARS) out.push(f("finding-thin", "WARN", e.line, "The finding is little more than a link. State the claim and what the source actually says (a short quote or close paraphrase)."));
    if (TIME_SENSITIVE.test(e.text) && !HAS_DATE.test(e.text)) out.push(f("time-sensitive-no-date", "WARN", e.line, "A time-sensitive claim (price, version, law, latest...) with no date on the source or the check."));
    if (tier && tier !== "confirmed" && ABSOLUTE.test(e.text)) out.push(f("absolute-language", "WARN", e.line, `Absolute wording ("${ABSOLUTE.exec(e.text)[0]}") on a claim that is only ${tier}.`));
    if (SIGNIFICANT.test(e.text) && !HAS_STATS.test(e.text)) out.push(f("significance-word", "WARN", e.line, "\"significant\" with no statistic beside it. If it means large, say large; if it means statistical, give the test and the numbers."));
    if (SNIPPET.test(e.text)) out.push(f("snippet-source", "WARN", e.line, "The basis is a search snippet. A snippet is a pointer to a source, not a source: open the page."));
    for (const u of urls) {
      if (/^https?:\/\/(www\.)?(google|bing|duckduckgo)\.[a-z.]+\/search/i.test(u)) out.push(f("search-page-as-source", "WARN", e.line, "A search results page is cited. Cite the page that holds the claim."));
      if (fetched) {
        const n = normalizeUrl(u);
        if (n && !fetched.has(n)) out.push(f("url-not-fetched", "FAIL", e.line, `${u} is not in the fetched log. Cite only pages actually fetched or returned by search this session; an invented or recalled URL is a fabricated citation.`));
      }
      if (!normalizeUrl(u)) out.push(f("url-malformed", "FAIL", e.line, `${u} is not a valid URL.`));
    }
  }
  // report-level
  const nonConfirmed = tiers.filter((t) => t && t !== "confirmed").length;
  const tv = p.toVerify ? p.lines.slice(p.toVerify.start + 1, p.toVerify.end).filter((l) => l.trim().length >= 5 && !/^\W*(none|n\/a|nothing|nil)\W*$/i.test(l.trim())) : [];
  if (nonConfirmed > 0 && !p.toVerify) out.push(f("missing-to-verify", "FAIL", 1, "Some findings are not confirmed but there is no TO VERIFY list. A reply with single-sourced findings and no visible gap list is unfinished."));
  if (nonConfirmed > 0 && p.toVerify && tv.length === 0) out.push(f("missing-to-verify", "FAIL", p.toVerify.start + 1, "TO VERIFY is empty although some findings are not confirmed."));
  if (p.verdict === "confirmed" && (nonConfirmed > 0 || tv.length > 0)) out.push(f("verdict-mismatch", "FAIL", p.verdictLine + 1, "VERDICT: confirmed requires every material claim confirmed and nothing left to verify; this report has unconfirmed claims or a TO VERIFY list. Use VERDICT: mixed."));
  if (p.verdict === "mixed" && items.length > 0 && nonConfirmed === 0 && tv.length === 0) out.push(f("verdict-mismatch-soft", "WARN", p.verdictLine + 1, "VERDICT: mixed but every finding is confirmed and nothing is left to verify; the verdict may understate the result."));
  if (p.verdict === "unconfirmed" && tiers.length > 0 && tiers.every((t) => t === "confirmed")) out.push(f("verdict-mismatch-soft", "WARN", p.verdictLine + 1, "VERDICT: unconfirmed but every finding is confirmed."));
  if (!FRESHNESS.test(text)) out.push(f("no-freshness-statement", "WARN", 1, "No statement of when the search was done or how fresh the sources are (\"as of 2026-11-24\", \"searched on...\"). The currency reference asks for the freshness ceiling out loud."));
  if (!SOURCE_TIER.test(text)) out.push(f("source-tier-missing", "WARN", 1, "No source is labelled primary, secondary or tertiary."));
  return finish(out, p, items.length, tiers);
}

function finish(out, p, count = 0, tiers = []) {
  const lines = p.lines;
  const allowed = [];
  lines.forEach((l, i) => {
    const m = /report-allow:\s*([a-z0-9-]+)\s*--\s*([^>\n]*)/.exec(l);
    if (m) allowed.push({ rule: m[1], line: i + 1, chars: m[2].replace(/\s/g, "").length });
  });
  const seen = new Set();
  out = out.filter((x) => !seen.has(`${x.rule}:${x.line}:${x.message}`) && seen.add(`${x.rule}:${x.line}:${x.message}`));
  out = out.filter((x) => !allowed.some((s) => s.rule === x.rule && (x.line === s.line || x.line === s.line + 1)));
  for (const s of allowed) if (s.chars < MIN_REASON_CHARS) out.push(f("suppression-no-reason", "WARN", s.line, `report-allow for ${s.rule} needs a reason of at least ${MIN_REASON_CHARS} characters.`));
  if (count > 0) {
    const c = (t) => tiers.filter((x) => x === t).length;
    out.push(f("summary", "INFO", 1, `${count} findings: ${c("confirmed")} confirmed, ${c("single-sourced")} single-sourced, ${c("contested")} contested, ${c("to verify")} to verify, ${tiers.filter((x) => !x).length} untiered.`));
  }
  return out.sort((a, b) => a.line - b.line);
}

// ---------- files ----------
export function loadFetched(path) {
  if (!existsSync(path)) throw new Error(`path not found: ${path}`);
  const set = new Set();
  for (const l of readFileSync(path, "utf8").split("\n")) for (const u of urlsIn(l)) { const n = normalizeUrl(u); if (n) set.add(n); }
  return set;
}

export function lintPaths(paths, opts = {}) {
  const out = [];
  for (const p of paths) {
    if (!existsSync(p)) throw new Error(`path not found: ${p}`);
    if (statSync(p).isDirectory()) throw new Error(`${p} is a folder; pass report files`);
    for (const x of lintReport(readFileSync(p, "utf8"), opts)) out.push({ ...x, file: p });
  }
  return out;
}

export function summarize(findings, { strict = false } = {}) {
  const fail = findings.filter((x) => x.severity === "FAIL").length;
  const warn = findings.filter((x) => x.severity === "WARN").length;
  const info = findings.filter((x) => x.severity === "INFO").length;
  return { fail, warn, info, exitCode: fail > 0 || (strict && warn > 0) ? 1 : 0 };
}

function main(argv) {
  const flags = new Set(argv.filter((a) => a.startsWith("--") && a !== "--fetched"));
  const fi = argv.indexOf("--fetched");
  const paths = argv.filter((a, i) => !a.startsWith("--") && !(fi >= 0 && i === fi + 1));
  if (paths.length === 0 || (fi >= 0 && !argv[fi + 1])) {
    console.error("usage: node report-lint.mjs <report.md>... [--fetched <urls.txt>] [--json] [--strict]");
    return 2;
  }
  let findings;
  try {
    const fetched = fi >= 0 ? loadFetched(argv[fi + 1]) : null;
    findings = lintPaths(paths, { fetched });
  } catch (error) {
    console.error(error.message);
    return 2;
  }
  const summary = summarize(findings, { strict: flags.has("--strict") });
  if (flags.has("--json")) {
    console.log(JSON.stringify({ summary, findings }, null, 2));
  } else {
    for (const x of findings) console.log(`${x.severity} ${x.rule} ${x.file}:${x.line} ${x.message}`);
    console.log(`report-lint: ${summary.fail} FAIL, ${summary.warn} WARN (format and consistency only; it does not open the sources)`);
  }
  return summary.exitCode;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  process.exitCode = main(process.argv.slice(2));
}
