#!/usr/bin/env node
// scripts/slop-scan.mjs -- a smoke alarm for the mechanical tells of AI-built pages. Not a judge of design quality.
//
//   node scripts/slop-scan.mjs <file-or-folder>... [--json] [--strict]
//
// Exit 1 when any FAIL is found (with --strict, any WARN too). Dependency-free, Node 18+. It reads source only: no
// browser, no network. Contrast with style-signals.mjs (did the DECLARED style get built?) and experience-testers.mjs
// (how does it FEEL in a real browser?). This one asks: does the source carry the tells reviewers keep rejecting?
//
// Rules are our own wording and regexes, written after studying public anti-slop linters (Impeccable, Hallmark,
// auteur, anti-slop, taste-skill); thresholds that came from them are noted in references/quality-gates-reference.md.
//
// Suppress one finding with a reason of 10+ characters on the same line or up to 2 lines above it:
//   /* slop-allow: transition-all -- legacy widget, replaced in ticket 41 */
//   <!-- slop-allow: emoji-label -- the brand mark is an emoji -->
// A suppression with a shorter reason still silences the rule but raises `suppression-no-reason`.
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { extname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const EXTENSIONS = new Set([".css", ".scss", ".html", ".htm", ".js", ".mjs", ".jsx", ".ts", ".tsx", ".vue", ".svelte", ".astro", ".md", ".mdx"]);
const COPY_EXTENSIONS = new Set([".html", ".htm", ".jsx", ".tsx", ".vue", ".svelte", ".astro", ".md", ".mdx"]);
const SKIP_DIRS = new Set(["worktrees", "node_modules", ".git", "dist", "build", ".next", ".cache", "coverage", ".turbo", ".vercel", "out"]);
const MIN_REASON_CHARS = 10;
const MAX_EYEBROWS = 3;
const AI_HUE_MIN = 250;
const AI_HUE_MAX = 290;
const GRAY_CHROMA = 0.1; // (max - min) / 255 below this counts as gray
const BOUNCE_LIMIT = 1.05;

// ---------- colour ----------
export function hueOf(value) {
  const rgb = parseColour(value);
  if (!rgb) return null;
  const [r, g, b] = rgb;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  if ((max - min) / 255 < GRAY_CHROMA) return null;
  const d = max - min;
  let h;
  if (max === r) h = ((g - b) / d) % 6;
  else if (max === g) h = (b - r) / d + 2;
  else h = (r - g) / d + 4;
  return (h * 60 + 360) % 360;
}

function parseColour(value) {
  const hex = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(String(value).trim());
  if (hex) {
    const h = hex[1].length === 3 ? [...hex[1]].map((c) => c + c).join("") : hex[1];
    return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
  }
  const rgb = /^rgba?\(\s*(\d+)[\s,]+(\d+)[\s,]+(\d+)/i.exec(String(value).trim());
  return rgb ? [Number(rgb[1]), Number(rgb[2]), Number(rgb[3])] : null;
}

// ---------- text helpers ----------
const lineOf = (text, index) => text.slice(0, index).split("\n").length;
const blank = (s) => s.replace(/[^\n]/g, " ");
const blocks = (text) => [...text.matchAll(/\{[^{}]*\}/g)].map((m) => ({ body: m[0], index: m.index }));

function visibleText(text) {
  return text
    .replace(/<!--[\s\S]*?-->/g, blank)
    .replace(/<script\b[\s\S]*?<\/script>/gi, blank)
    .replace(/<style\b[\s\S]*?<\/style>/gi, blank)
    .replace(/<title\b[\s\S]*?<\/title>/gi, blank)
    .replace(/<[^>]*>/g, blank);
}

function finding(rule, severity, file, text, index, message) {
  return { rule, severity, file, line: lineOf(text, index), message };
}

// ---------- rules ----------
const RULES = [
  function transitionAll(file, text) {
    return [...text.matchAll(/transition(?:-property)?\s*:\s*all\b/g)].map((m) =>
      finding("transition-all", "FAIL", file, text, m.index, "transition: all animates every property, including layout; name the properties instead."));
  },
  function layoutTransition(file, text) {
    const out = [];
    for (const m of text.matchAll(/transition(?:-property)?\s*:\s*([^;}]*)/g)) {
      if (/^\s*all\b/.test(m[1])) continue;
      if (/(^|[\s,])(width|height|top|left|right|bottom|margin(?:-[a-z]+)?|padding(?:-[a-z]+)?)(?=[\s,]|$)/.test(m[1])) {
        out.push(finding("layout-transition", "WARN", file, text, m.index, "Transitioning a layout property forces layout every frame; use transform or a FLIP/grid technique."));
      }
    }
    return out;
  },
  function rawScrollListener(file, text) {
    const out = [];
    for (const m of text.matchAll(/([\w$.]+)\.addEventListener\(\s*['"]scroll['"]/g)) {
      const onPage = m[1] === "window" || m[1] === "document";
      out.push(finding("raw-scroll-listener", onPage ? "FAIL" : "WARN", file, text, m.index,
        "A scroll listener runs every frame on the main thread; use ScrollTrigger, IntersectionObserver or animation-timeline."));
    }
    for (const m of text.matchAll(/\bonscroll\s*=/g)) {
      out.push(finding("raw-scroll-listener", "FAIL", file, text, m.index, "An onscroll handler runs every frame on the main thread; use ScrollTrigger, IntersectionObserver or animation-timeline."));
    }
    return out;
  },
  function aiGradient(file, text) {
    const out = [];
    for (const m of text.matchAll(/(?:linear|radial|conic)-gradient\(([^;{}]*)\)/g)) {
      const colours = m[1].match(/#[0-9a-f]{3,6}\b|rgba?\([^)]*\)/gi) || [];
      const hues = colours.map(hueOf).filter((h) => h !== null);
      if (hues.filter((h) => h >= AI_HUE_MIN && h <= AI_HUE_MAX).length >= 2) {
        out.push(finding("ai-gradient", "FAIL", file, text, m.index, "A gradient with two violet/indigo stops (hue 250-290) is the most recognisable AI palette; choose colours from the product's world."));
      }
    }
    return out;
  },
  function gradientText(file, text) {
    return blocks(text)
      .filter((b) => /gradient\(/.test(b.body) && /(background-clip\s*:\s*text|text-fill-color\s*:\s*transparent)/.test(b.body))
      .map((b) => finding("gradient-text", "FAIL", file, text, b.index, "Gradient text is decoration, not emphasis; use weight or size."));
  },
  function bounceEasing(file, text) {
    const out = [];
    for (const m of text.matchAll(/cubic-bezier\(\s*(-?[\d.]+)\s*,\s*(-?[\d.]+)\s*,\s*(-?[\d.]+)\s*,\s*(-?[\d.]+)\s*\)/g)) {
      const [y1, y2] = [Number(m[2]), Number(m[4])];
      if (y1 > BOUNCE_LIMIT || y1 < -0.05 || y2 > BOUNCE_LIMIT || y2 < -0.05) {
        out.push(finding("bounce-easing", "WARN", file, text, m.index, "An overshooting curve reads as bounce; keep it for momentum-driven gestures, not UI state."));
      }
    }
    return out;
  },
  function noReducedMotion(file, text) {
    const motion = /@keyframes|\banimation(?:-name)?\s*:|\bgsap\.|ScrollTrigger|new Lenis|\.animate\(/.exec(text);
    if (!motion) return [];
    if (/prefers-reduced-motion|reducedMotion|useReducedMotion/.test(text)) return [];
    return [finding("no-reduced-motion", "WARN", file, text, motion.index, "Motion with no reduced-motion handling in this file (check that a global rule covers it, or add one).")];
  },
  function overflowXHidden(file, text) {
    const out = [];
    for (const m of text.matchAll(/(?:^|[}\s,])(?:html|body)\b[^{}]*\{[^{}]*overflow(?:-x)?\s*:\s*hidden/g)) {
      out.push(finding("overflow-x-hidden", "WARN", file, text, m.index, "overflow hidden on html/body hides a horizontal overflow bug and breaks sticky; find the cause or use overflow-x: clip."));
    }
    return out;
  },
  function fullVwWidth(file, text) {
    return [...text.matchAll(/(?<![-\w])width\s*:\s*100vw\b/g)].map((m) =>
      finding("full-vw-width", "WARN", file, text, m.index, "100vw includes the scrollbar and causes horizontal scroll; use 100% or inset: 0."));
  },
  function focusOutlineRemoved(file, text) {
    const removed = /outline\s*:\s*(?:none|0)\b/.exec(text);
    if (!removed || /:focus-visible/.test(text)) return [];
    return [finding("focus-outline-removed", "WARN", file, text, removed.index, "The focus outline is removed and no :focus-visible style exists in this file; keyboard users lose their place.")];
  },
  function media(file, text) {
    const out = [];
    for (const m of text.matchAll(/<(video|audio)\b[^>]*>/gi)) {
      const tag = m[0];
      const autoplay = /\bautoplay\b/i.test(tag);
      if (autoplay && !/\bmuted\b/i.test(tag)) {
        out.push(finding("autoplay-sound", "FAIL", file, text, m.index, "Autoplaying media without muted is blocked by browsers and hostile to visitors."));
      }
      if (m[1].toLowerCase() === "video" && !/\bposter\s*=/i.test(tag)) {
        out.push(finding("video-no-poster", "WARN", file, text, m.index, "A video with no poster leaves an empty box until it loads; add a poster image."));
      }
    }
    return out;
  },
  function eyebrowOveruse(file, text) {
    const tracked = blocks(text).filter((b) => {
      if (!/text-transform\s*:\s*uppercase/.test(b.body)) return false;
      const ls = /letter-spacing\s*:\s*([\d.]+)(em|px)/.exec(b.body);
      const fs = /font-size\s*:\s*([\d.]+)(px|rem|em)/.exec(b.body);
      if (!ls || !fs) return false;
      const wide = ls[2] === "em" ? Number(ls[1]) >= 0.05 : Number(ls[1]) >= 0.7;
      const small = fs[2] === "px" ? Number(fs[1]) <= 14 : Number(fs[1]) <= 0.875;
      return wide && small;
    });
    return tracked.length > MAX_EYEBROWS
      ? [finding("eyebrow-overuse", "WARN", file, text, tracked[0].index, `${tracked.length} small tracked uppercase label styles; one kicker is a system, a label on every section is a template.`)]
      : [];
  },
];

const COPY_RULES = [
  function emDash(file, text) {
    const index = visibleText(text).indexOf("—");
    return index === -1 ? [] : [finding("em-dash-copy", "WARN", file, text, index, "Em dash in visible copy; use a period, comma or colon.")];
  },
  function emojiLabel(file, text) {
    const out = [];
    for (const m of visibleSafe(text).matchAll(/<(button|a|li|h[1-6]|label|summary|th)\b[^>]*>([^<]*)</gi)) {
      if (/\p{Extended_Pictographic}/u.test(m[2])) {
        out.push(finding("emoji-label", "WARN", file, text, m.index, "Emoji used as an icon or label; use one real icon set or no icon."));
      }
    }
    return out;
  },
  function placeholderCopy(file, text) {
    const seen = new Set();
    for (const m of visibleText(text).matchAll(/lorem ipsum|\bjohn doe\b|\bjane doe\b|\bacme\b|\b99\.99%|\b1,?234,?567\b/gi)) seen.add(m[0].toLowerCase());
    if (seen.size === 0) return [];
    const first = visibleText(text).search(/lorem ipsum|\bjohn doe\b|\bjane doe\b|\bacme\b|\b99\.99%|\b1,?234,?567\b/i);
    return [finding("placeholder-copy", "WARN", file, text, first, `Placeholder or fake-perfect data in copy (${[...seen].join(", ")}); use plausible, specific content.`)];
  },
];

// emoji rule needs tags, so it reads the text with scripts, styles and comments blanked but tags kept
function visibleSafe(text) {
  return text
    .replace(/<!--[\s\S]*?-->/g, blank)
    .replace(/<script\b[\s\S]*?<\/script>/gi, blank)
    .replace(/<style\b[\s\S]*?<\/style>/gi, blank);
}

// ---------- suppression ----------
function suppressions(text) {
  const found = [];
  for (const m of text.matchAll(/slop-allow:\s*([a-z0-9-]+)\s*--\s*([^*\n>]*)/g)) {
    found.push({ rule: m[1], line: lineOf(text, m.index), reasonChars: m[2].replace(/\s/g, "").length });
  }
  return found;
}

export function scanText(file, text) {
  const ext = extname(file).toLowerCase();
  const rules = COPY_EXTENSIONS.has(ext) ? [...RULES, ...COPY_RULES] : RULES;
  let findings = rules.flatMap((rule) => rule(file, text));
  const allowed = suppressions(text);
  findings = findings.filter((f) => !allowed.some((s) => s.rule === f.rule && f.line >= s.line && f.line <= s.line + 2));
  for (const s of allowed) {
    if (s.reasonChars < MIN_REASON_CHARS) {
      findings.push({ rule: "suppression-no-reason", severity: "WARN", file, line: s.line, message: `slop-allow for ${s.rule} needs a reason of at least ${MIN_REASON_CHARS} characters.` });
    }
  }
  return findings.sort((a, b) => a.line - b.line);
}

// ---------- files ----------
function walk(path, out) {
  const st = statSync(path);
  if (st.isDirectory()) {
    for (const name of readdirSync(path)) {
      if (!SKIP_DIRS.has(name)) walk(join(path, name), out);
    }
  } else if (EXTENSIONS.has(extname(path).toLowerCase())) {
    out.push(path);
  }
}

export function scanPaths(paths) {
  const files = [];
  for (const p of paths) {
    if (!existsSync(p)) throw new Error(`path not found: ${p}`);
    walk(p, files);
  }
  return files.flatMap((file) => scanText(file, readFileSync(file, "utf8")));
}

export function summarize(findings, { strict = false } = {}) {
  const fail = findings.filter((f) => f.severity === "FAIL").length;
  const warn = findings.filter((f) => f.severity === "WARN").length;
  return { fail, warn, exitCode: fail > 0 || (strict && warn > 0) ? 1 : 0 };
}

// ---------- cli ----------
function main(argv) {
  const flags = new Set(argv.filter((a) => a.startsWith("--")));
  const paths = argv.filter((a) => !a.startsWith("--"));
  if (paths.length === 0) {
    console.error("usage: node slop-scan.mjs <file-or-folder>... [--json] [--strict]");
    return 2;
  }
  let findings;
  try {
    findings = scanPaths(paths);
  } catch (error) {
    console.error(error.message);
    return 2;
  }
  const summary = summarize(findings, { strict: flags.has("--strict") });
  if (flags.has("--json")) {
    console.log(JSON.stringify({ summary, findings }, null, 2));
  } else {
    for (const f of findings) console.log(`${f.severity} ${f.rule} ${f.file}:${f.line} ${f.message}`);
    console.log(`slop-scan: ${summary.fail} FAIL, ${summary.warn} WARN (a smoke alarm, not a judge)`);
  }
  return summary.exitCode;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  process.exitCode = main(process.argv.slice(2));
}
