import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, writeFileSync, mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { scanText, scanPaths, hueOf, summarize } from "./slop-scan.mjs";

const ids = (findings) => findings.map((f) => f.rule).sort();
const css = (body) => scanText("a.css", body);
const html = (body) => scanText("a.html", body);

test("hueOf reads hex and rgb, and treats grays as chroma-free", () => {
  assert.ok(Math.abs(hueOf("#7c3aed") - 262) < 6);
  assert.ok(Math.abs(hueOf("rgb(255, 0, 0)") - 0) < 1);
  assert.equal(hueOf("#888888"), null);
  assert.equal(hueOf("not-a-colour"), null);
});

test("transition: all is a FAIL", () => {
  const f = css(".a{transition:all .3s ease}");
  assert.deepEqual(ids(f), ["transition-all"]);
  assert.equal(f[0].severity, "FAIL");
});

test("transition on named paint properties is clean", () => {
  assert.deepEqual(ids(css(".a{transition:opacity .2s, transform .2s}")), []);
});

test("transition on layout properties is a WARN", () => {
  const f = css(".a{transition:width .3s}");
  assert.deepEqual(ids(f), ["layout-transition"]);
  assert.equal(f[0].severity, "WARN");
});

test("window scroll listener is a FAIL in js and in html", () => {
  assert.deepEqual(ids(scanText("a.js", "window.addEventListener('scroll', fn)")), ["raw-scroll-listener"]);
  assert.deepEqual(ids(html("<script>document.addEventListener(\"scroll\",f)</script>")), ["raw-scroll-listener"]);
});

test("a purple-to-violet gradient is a FAIL, a blue-to-green one is not", () => {
  assert.deepEqual(ids(css(".a{background:linear-gradient(90deg,#7c3aed,#a855f7)}")), ["ai-gradient"]);
  assert.deepEqual(ids(css(".a{background:linear-gradient(90deg,#0ea5e9,#22c55e)}")), []);
});

test("gradient text is a FAIL", () => {
  const f = css(".h{background:linear-gradient(#f00,#00f);-webkit-background-clip:text;color:transparent}");
  assert.ok(ids(f).includes("gradient-text"));
});

test("overshooting cubic-bezier is a WARN, an exponential ease-out is clean", () => {
  assert.deepEqual(ids(css(".a{transition:transform .3s cubic-bezier(.34,1.56,.64,1)}")), ["bounce-easing"]);
  assert.deepEqual(ids(css(".a{transition:transform .3s cubic-bezier(.23,1,.32,1)}")), []);
});

test("motion with no reduced-motion handling is a WARN once per file", () => {
  const f = css("@keyframes spin{to{transform:rotate(1turn)}} .a{animation:spin 1s infinite}");
  assert.deepEqual(ids(f), ["no-reduced-motion"]);
  assert.deepEqual(ids(css("@media (prefers-reduced-motion: reduce){.a{animation:none}} @keyframes s{to{opacity:1}} .a{animation:s 1s}")), []);
});

test("gsap use is covered by matchMedia as reduced-motion handling", () => {
  assert.deepEqual(ids(scanText("a.js", "gsap.to('.a',{x:1}); gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {})")), []);
  assert.deepEqual(ids(scanText("a.js", "gsap.to('.a',{x:1})")), ["no-reduced-motion"]);
});

test("overflow-x hidden on body and 100vw widths are WARNs", () => {
  assert.deepEqual(ids(css("body{overflow-x:hidden}")), ["overflow-x-hidden"]);
  assert.deepEqual(ids(css(".a{width:100vw}")), ["full-vw-width"]);
  assert.deepEqual(ids(css("body{overflow-x:clip}")), []);
});

test("removed focus outline without focus-visible is a WARN", () => {
  assert.deepEqual(ids(css("button{outline:none}")), ["focus-outline-removed"]);
  assert.deepEqual(ids(css("button{outline:none} button:focus-visible{outline:2px solid #000}")), []);
});

test("unmuted autoplay media is a FAIL and a video with no poster is a WARN", () => {
  assert.deepEqual(ids(html("<video autoplay loop muted playsinline poster='p.jpg'></video>")), []);
  assert.deepEqual(ids(html("<video autoplay muted></video>")), ["video-no-poster"]);
  assert.deepEqual(ids(html("<video autoplay poster='p.jpg'></video>")), ["autoplay-sound"]);
});

test("em dashes in visible copy are a WARN, but not in scripts, styles or comments", () => {
  assert.deepEqual(ids(html("<h1>Fast — simple</h1>")), ["em-dash-copy"]);
  assert.deepEqual(ids(html("<script>var a='x — y'</script><style>/* — */</style><!-- — -->")), []);
});

test("emoji used as a label is a WARN", () => {
  assert.deepEqual(ids(html("<button>🚀 Launch</button>")), ["emoji-label"]);
  assert.deepEqual(ids(html("<button>Launch</button>")), []);
});

test("more than three tracked uppercase labels is a WARN", () => {
  const label = ".l{text-transform:uppercase;letter-spacing:.14em;font-size:12px}";
  const many = [1, 2, 3, 4].map((n) => `.k${n}{text-transform:uppercase;letter-spacing:.14em;font-size:12px}`).join("");
  assert.deepEqual(ids(css(label)), []);
  assert.deepEqual(ids(css(many)), ["eyebrow-overuse"]);
});

test("placeholder copy and fake-perfect numbers are WARNs", () => {
  assert.deepEqual(ids(html("<p>Lorem ipsum dolor</p>")), ["placeholder-copy"]);
  assert.deepEqual(ids(html("<p>Trusted by John Doe with 99.99% uptime</p>")), ["placeholder-copy"]);
});

test("a suppression comment with a reason silences a rule; without one it raises a WARN", () => {
  const ok = css("/* slop-allow: transition-all -- legacy widget, replaced in ticket 41 */ .a{transition:all .3s}");
  assert.deepEqual(ids(ok), []);
  const bad = css("/* slop-allow: transition-all -- ok */ .a{transition:all .3s}");
  assert.deepEqual(ids(bad), ["suppression-no-reason"]);
});

test("findings carry file, 1-based line and a message", () => {
  const f = css("\n\n.a{transition:all 1s}");
  assert.equal(f[0].file, "a.css");
  assert.equal(f[0].line, 3);
  assert.ok(f[0].message.length > 10);
});

test("summarize counts FAIL and WARN and decides the exit code", () => {
  const s = summarize([{ severity: "FAIL" }, { severity: "WARN" }, { severity: "WARN" }]);
  assert.deepEqual([s.fail, s.warn, s.exitCode], [1, 2, 1]);
  assert.equal(summarize([{ severity: "WARN" }]).exitCode, 0);
  assert.equal(summarize([{ severity: "WARN" }], { strict: true }).exitCode, 1);
});

test("scanPaths walks a folder, skips node_modules and unknown extensions", () => {
  const root = mkdtempSync(join(tmpdir(), "slop-"));
  mkdirSync(join(root, "node_modules"));
  writeFileSync(join(root, "a.css"), ".a{transition:all 1s}");
  writeFileSync(join(root, "node_modules", "b.css"), ".a{transition:all 1s}");
  writeFileSync(join(root, "c.png"), "transition:all");
  const f = scanPaths([root]);
  assert.equal(f.length, 1);
  assert.ok(f[0].file.endsWith("a.css"));
});

test("scanPaths reports a missing path as an error, not as clean", () => {
  assert.throws(() => scanPaths([join(tmpdir(), "does-not-exist-slop")]), /not found/i);
});
