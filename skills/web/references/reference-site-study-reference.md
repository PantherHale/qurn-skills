# Reference-site study: two commercial-grade animated landing pages

Operator, 2026-11-12: "qurn cannot make amazing animated sites. I want it like these two: structure, colour, gradient, UI, components." Measured from the live source and a rendered hero screenshot of both sites on 2026-11-12 (not guessed): https://signalview-ai-land.pages.dev/ (A) and https://www.cobble.video/ (B). The numbers below are real values; the recipes are the working mechanism behind each effect.

**How to use it.** These are two proven *families* of finish. Pick the one whose mood fits THIS product (A: calm, premium, photographic, trust. B: playful, loud, sticker-pop, creator/consumer), or when the operator names one of them, build that family. Reuse the mechanism and the level of finish. Substitute this product's own photo/video, hues, type and words: copying a reference's hex values, fonts and wording together is the "reference's skin" that web-director.md's anti-copy test bans. Style names to declare in docs/design/DESIGN.md (style-recipes.md): A = "Liquid glass" + "Minimalism"; B = "Brutalism / neo-brutalism" (warm, spring-motion variant).

## What both sites share (the bar qurn builds were missing)
1. **One real moving or photographic asset carries the mood.** A: a full-bleed sky-and-leaves photograph (`assets/anthr.jpg`, preloaded `fetchpriority="high"`). B: a looping `<video src="/hero/main.mp4" muted loop playsInline>` plus looping demo videos inside every feature card. Never a CSS-only hero.
2. **A headline of 3 to 6 words, huge, with a staged entrance.** A: "Your Personal Market Researcher" at `clamp(40px, 5.1vw, 70px)`. B: "Edit your videos in minutes." at `clamp(2.3rem, 9vw, 5.9rem)`, weight 800, `letter-spacing: -0.04em`, `line-height: .95`. Subhead one line. Two CTAs at most.
3. **One hue family plus neutrals.** A: pure black/white plus a 10-step neutral ramp (`#0a0a0a`, `#171717`, `#262626`, `#404040`, `#525252`, `#737373`, `#a3a3a3`, `#d4d4d4`, `#e5e5e5`, `#f5f5f5`, `#fafafa`); colour comes only from photography. B: one wine/peach family, nothing else.
4. **Exactly two easing curves, used everywhere.** A: `cubic-bezier(0.16, 1, 0.3, 1)` (expo ease-out) for all reveals and hovers, `cubic-bezier(0.22, 1, 0.36, 1)` for the nav morph. B: spring overshoot `cubic-bezier(.34, 1.56, .64, 1)` for all reveals, `cubic-bezier(.76, 0, .24, 1)` for the intro curtain. No linear, no default `ease` on anything visible.
5. **Section changes are physical.** Pinned sections that a rounded sheet slides over (A), a full-screen intro curtain that lifts away (B). Not a hard cut between rectangles.
6. **Cheap, robust tech, no animation library needed.** Neither site loads GSAP, Lenis, Framer Motion or three.js for its motion except A's single three.js globe. Motion = CSS transitions toggled by `IntersectionObserver` + ONE `requestAnimationFrame` scroll loop that only writes `transform`, `filter`, `opacity`. A has a failsafe (`window.addEventListener('error', ...)` adds `html.reveal-safe` which forces everything visible) and a full `prefers-reduced-motion` block.
7. **Every control reacts.** Buttons, links, FAQ rows, nav, chips all have a designed hover and focus state (details below). A page where only the hero moves is the failure.

## Site A: SignalView (photographic, black and white, liquid glass)
**Section order:** floating glass capsule nav, full-viewport photo hero, "how it works" three image cards (numbered black circles), product intro, editorial feature rows (text + big screenshot in a 30px-radius card with a deep shadow), interactive three.js globe of data sources, full-bleed immersive band with a side panel, a white "curtain" sheet that lifts to reveal a pinned three-item stepper (420vh tall), FAQ sheet sliding over it, a pinned rounded research card, then a footer that is itself a full-screen hero with a giant watermark.

**Tokens:** fonts Fraunces (serif, weight 300, headings), Instrument Sans (body, weight 300), Poppins 13px (nav links), hero in a geometric sans (Century Gothic stack, weight 400). Heading scale `clamp(34px, 4.6vw, 62px)`, `line-height 1.12`, `letter-spacing -0.015em`. Body `clamp(15px, 1.3vw, 17.5px)`, `line-height 1.85`, `#525252`. Kicker labels 12px uppercase `letter-spacing .22em`. Radii 18px (small cards), 30px (showcases), 80px (sheet corners), 999px (every button). Section padding `clamp(48px, 5vw, 76px) clamp(20px, 3.5vw, 52px)`, max-width 1500px.

**Hero:** photo as `<img>` 112% tall, `translateY(-4%)`, scroll parallax `translateY(calc(-4% + scrollY*0.12px))`. A left-to-right scrim `linear-gradient(90deg, rgba(4,10,14,.38) 0%, rgba(4,10,14,.18) 34%, rgba(4,10,14,0) 60%)` for text contrast. White corner clouds (`radial-gradient(circle at 0% 100%, #fff, transparent 70%)`, `blur(26px)`) and a 130px bottom haze so the photo melts into the next white section. Title `text-shadow: 0 2px 18px rgba(0,0,0,.5), 0 4px 60px rgba(0,0,0,.3)`.

**Liquid glass capsule nav (the signature component):**
```css
.header-nav{position:fixed;top:24px;left:50%;transform:translateX(-50%);width:min(1100px,90%);height:60px;
  border-radius:999px;background:rgba(255,255,255,.72);backdrop-filter:blur(30px) saturate(1.8);
  border:1px solid rgba(255,255,255,.45);overflow:hidden;isolation:isolate;
  box-shadow:0 0 2px 1px rgba(0,0,0,.08) inset,0 0 10px 4px rgba(255,255,255,.4) inset,0 8px 32px rgba(17,17,26,.12);
  transition:width .56s cubic-bezier(.22,1,.36,1),height .56s cubic-bezier(.22,1,.36,1);
  animation:navDrop .8s cubic-bezier(.25,1,.35,1) .4s both}            /* from translateY(-140%) */
.header-nav::before{content:'';position:absolute;inset:-50%;pointer-events:none;filter:blur(12px);opacity:.4;
  background:radial-gradient(ellipse 100% 80% at 20% -30%,rgba(255,255,255,.9),transparent 55%);
  animation:sheenDrift 14s cubic-bezier(.45,0,.55,1) infinite alternate}  /* drifts translate3d(±6%,±4%) rotate(-6..8deg) */
.header-nav.capsule-mini{width:56px;height:28px;background:#f5f6f7;backdrop-filter:none;cursor:pointer}
/* a 24x3px bar replaces the content; hover / focus-within / click-to-pin expands it back to full width */
@supports (backdrop-filter:url(#f)){ /* true refraction: an SVG feDisplacementMap filter, map regenerated on resize */ }
@supports not (backdrop-filter:url(#f)){ .header-nav{backdrop-filter:blur(36px) saturate(2.2) brightness(1.06)} }
```
JS: at `scrollY < 20` the nav is full; past that it collapses to the 56x28 pill; only click, hover or scroll-to-top expands it. Primary CTA inside: black pill `padding 11px 24px`, plus two skewed light streaks (`::before` 60px blurred, `::after` 22px sharp, `rotate(12deg)`) that sweep across on hover with `@keyframes sheenOnce{from{left:-25%}to{left:135%}}` (1.15s and .9s).

**Hero text entrance:** words split into `<span class="hero-word">`, each `opacity 0, translateY(34px), blur(18px)` to clear over `1.35s` with stagger `.12s .30s .48s .66s`, subhead at `.95s`, buttons at `1.22s`. Entrances only fire after `document.fonts.ready` (capped at 2.2s) so the headline never reflows mid-animation.

**Buttons:** primary white pill `padding 19px 44px`, hover flips to black with a bigger shadow over `.45s`. Secondary is glass: `rgba(255,255,255,.1)`, `blur(16px) saturate(1.6)`, 1px `rgba(255,255,255,.32)` border, hover turns solid white with black text and the arrow `translateX(6px)`. Text link: 12px uppercase `letter-spacing .18em` with a 1.5px underline that scales in from the left (`scaleX 0 to 1`, `transform-origin` swaps right to left on hover).

**Sheet and pin mechanics (the part that makes it feel produced):**
```css
.essentials{position:relative;height:420vh;margin-top:-100vh;background:#0a0a0a}       /* tall scroll track, sits UNDER the previous section */
#quantitative{position:relative;z-index:2;background:#fff;border-radius:0 0 80px 80px}  /* the sheet that lifts to reveal it */
.essentials-pin{position:sticky;top:0;height:100svh;/* photo + 3-stop dark scrim */}
.faq-section{position:relative;z-index:2;margin-top:-100vh;background:#fff;border-radius:80px 80px 0 0}  /* slides back over it */
.site-footer{margin-top:-100vh;border-radius:80px 80px 0 0}                              /* footer covers the last pinned card */
```
Stepper logic: `p = clamp(-rect.top / (section.offsetHeight - innerHeight), 0, 1)`; item 2 activates at `p >= .40`, item 3 at `p >= .60`, with hysteresis (go back at `.36` and `.56`) so it never flickers at the boundary. Active item's lines slide up from a `overflow:hidden` mask (`translateY(118%)` + `blur(6px)` to `0`, `.85s`, body line delayed `.09s`); leaving lines exit up `-118%`. Each step image swaps with `clip-path: inset(14% round 24px)` to `inset(0 round 24px)` plus `scale(1.1)` to `1`. Progress dots are 7px; the active one stretches to 20px wide. Dots are clickable (smooth scroll to `p = .28 / .55 / .82`).

**Scroll-linked text frost:** one function sets `filter: blur(Npx)` on headings only: 12px the moment a pinned section opens, hold until `p = .08`, clear linearly to 0 by `p = .30`, re-blur from `p = .72` to 12px as the next sheet covers it. Footer text starts at `blur(28px)` and clears as the section passes the viewport midpoint. Skipped under 900px and for reduced motion. Image never blurs, only text.

**Reveals:** `.reveal-child` = `opacity 0, translateY(54px)` to rest over `1s` expo-out, stagger `0 .08s .16s .24s` by `nth-child`. Showcase images reveal with `clip-path: inset(7% 5% 7% 5% round 30px)` to `inset(0 round 30px)` + `translateY(70px) scale(.985)` over `1.3s`. Observer: `threshold .12`, `rootMargin 0 0 -6% 0`, re-arms on exit (reveals replay in both directions) but never hides content already scrolled past.

**Globe (three.js r128 via cdnjs + topojson):** 30,000 points (16,000 under 760px wide) on a sunflower/Fibonacci sphere, kept only where a 1024x512 land mask (drawn from world GeoJSON on a canvas) is white. `PointsMaterial({color:0x1a3a7a,size:.016,map:softDotTexture,transparent:true,opacity:.9,depthWrite:false})`. Auto-rotates, drag to spin (`touch-action:none`, grab cursor). Nine 46px circular logo chips (white, 1px `#e5e5e5` border, shadow `0 6px 18px rgba(0,0,0,.12)`) are projected from lat/lon to screen every frame, hidden when facing away from the camera; hover or click selects a source, focuses the globe on it and swaps the info panel.

**Footer-as-hero:** `min-height:100svh`, 80px radius, photo + scrim `linear-gradient(180deg, rgba(10,10,10,.35) 0%, rgba(10,10,10,.65) 50%, #0a0a0a 100%)`, eyebrow 16px uppercase `letter-spacing .3em`, title `clamp(28px, 5.2vw, 84px)`, a serif-italic white pill CTA with the same light-sweep, then below it a black link block and a `13vw` weight-900 uppercase watermark at `rgba(255,255,255,.35)` masked to fade out downward (`mask-image: linear-gradient(to bottom, #000 50%, transparent)`).

## Site B: Cobble (sticker-pop, wine and peach, spring motion)
**Section order:** full-screen intro curtain (cream radial; a tile flies in from off-screen, the wordmark types in, the curtain lifts with a rounded edge), wine-to-peach hero with outlined headline and a one-field waitlist, a before/after demo timeline, problem statement, "other AI editors vs cobble" comparison, three feature cards each with a looping demo video and an animated micro-UI (waveform that cuts, b-roll clips that drop in, a style card), founders block with drifting blurred blobs and a spinning dashed ring, FAQ, repeat CTA, footer.

**Tokens (real):** `ink #1f0b0e`, `paper #e3b9a2`, `muted #5b4548`, `maroon #48171d`, `bone #f6eee5`, `amber #f6d5bd`, `line #ebcdb6`, `card #f8e2d1`, `lifted #a3303f`, plus `#2a0d11` (darkest wine, used on 18 borders/labels), `#541e28`, `#6e2432`, `#94434b`, `#d29d8b`. Fonts: Bricolage Grotesque (display, weights 600 to 800, `-0.04em` tracking) and JetBrains Mono (timestamps, labels, 11px). Tailwind v4 with those as `@theme` tokens.

**Hero background gradient:** `radial-gradient(circle at 50% 20%, #6e2432 0%, #541e28 50%), linear-gradient(#541e28 0%, #8e3a42 40%, #a4645c 72%, #d29d8b 100%)`: a wine page that warms to peach at the bottom, so the hero hands over to the cream sections without a seam. A blurred blob `radial-gradient(closest-side, #c8786461, #c8786400 100%)` sits behind the headline.

**Sticker-outline headline (the signature type treatment):** cream fill `#e9d3b8` with an 8-direction hard black outline plus a drop:
```css
.hl{color:#e9d3b8;text-shadow:2px 0 #0a0a0a,-2px 0 #0a0a0a,0 2px #0a0a0a,0 -2px #0a0a0a,
 2px 2px #0a0a0a,-2px -2px #0a0a0a,2px -2px #0a0a0a,-2px 2px #0a0a0a,0 4px #0a0a0a}
```
Per-word entrance with overshoot and a tilt: `.w{opacity:0;display:inline-block;transform:translateY(.55em) rotate(5deg) scale(.92);transition:opacity .5s, transform .85s cubic-bezier(.34,1.56,.64,1);transition-delay:calc(var(--i)*85ms + .15s)}` (word index set as `style="--i:n"`).

**Generic reveal:** `.rv{opacity:0;transform:translateY(28px) scale(.97);transition:opacity .7s, transform .9s cubic-bezier(.34,1.56,.64,1);transition-delay:calc(var(--i,0)*90ms)}`. An `IntersectionObserver` adds the visible class.

**Neo-brutalist button (hero CTA):** peach fill `#f6d5bd`, `border-2 #2a0d11`, text `#2a0d11` weight 700, pill, `min-height 56px`. At rest `box-shadow:0 0 0 0 #2a0d11`; hover `translateY(-4px)` + `box-shadow:0 4px 0 0 #2a0d11` (a solid ledge appears under it); active `translateY(0)` + no shadow, `150ms`. Input beside it is a white pill with a `1.5px #ebcdb6` border that turns ink on focus. Progressive form: extra fields (handle, country) open with `grid-template-rows: 0fr` to `1fr` over `.7s` (no height animation hacks), labelled with small peach pill tags `rgba(246,213,189,.92)`.

**Nav:** logo wordmark left (cream with the same black outline), a near-white pill on the right holding links plus a wine pill CTA (`border-2`, rounded-full). Fades in `0.6s .2s` after the intro.

**Intro sequence (`.intro-curtain`):** `radial-gradient(120% 90% at 50% 38%, #f7efe6 0%, #e7d8c9 55%, #d6c2b1 100%)`. Keyframes `intro-tilein` (scale .5 + rotate -10deg to rest), `intro-stonefly` (an item flies from `--fx/--fy` with rotate and scale .35 to rest, opacity at 16%), `intro-wordin`, then the curtain leaves with `transform .65s cubic-bezier(.76,0,.24,1)` and animated `border-radius`. Tile: `border-radius 25%/25.5%`, `box-shadow 0 26px 60px -26px #2e0d1299`.

**Always-alive details (all CSS, no library):** floating stickers `.dd-in{animation:dd-float var(--d,6s) ease-in-out var(--del,0s) infinite; rotate:var(--r); filter:drop-shadow(0 6px 10px #14141424)}` with `dd-float` = `translateY(0)` to `-8px` and back; a `REC` dot that blinks `1.1s steps(2,start) infinite` between opacity 1 and .15; a typing caret `cobble-caret`; a waveform whose "dead air" bars collapse (`wave-cut` 3.2s: width 5px to 0, opacity 1 to 0) on loop; b-roll clips that drop in (`broll-drop-1/2/3`: `translateY(-80px) rotate(-7deg) scale(1.1)` to rest with a 3px bounce, staggered at 3%, 30%, 58% of one loop) with a playhead sweeping 0 to 100%; founder blobs `blur(48px)` drifting `translate(40px,-30px) scale(1.12)` over 14s alternate, a dashed ring spinning 360deg over 18s linear.

**Copy:** founder-voice, lowercase brand, headlines 4 to 6 words ("Edit your videos in minutes.", "Most solo creators waste hours editing reels."). Form note: "Free during early access. No spam, ever."

## Build rules these two prove (apply to every animated site)
1. **Real asset first.** If there is no photo/video, generate or source one (image-rules.md) or build a canvas/three.js scene in the same slot. A gradient-only hero is the generic default.
2. **Two named easings per site.** Declare them once as CSS variables (`--ease-out`, `--ease-spring`) and ban every other curve in review.
3. **Every section has a transition into it:** sheet with 60 to 80px top radius sliding over a pinned section, curtain, clip-path reveal, or a gradient hand-off between section backgrounds. Count them; at least one pinned or sticky section per page in a Persuade site.
4. **Each interactive element gets a designed hover AND focus-visible state** (ledge shadow, light sweep, underline scale, arrow nudge, glass to solid). List them in the order.
5. **Scroll loop discipline.** One `requestAnimationFrame` guarded by a `ticking` flag, passive listeners, only `transform`/`filter`/`opacity`, skip work when the section is off-screen, ignore sub-0.06px blur changes.
6. **Entrances wait for fonts** (`document.fonts.ready`, 2.2s cap) and are paired with a `reveal-safe` failsafe and a `prefers-reduced-motion` block that shows everything immediately.
7. **One micro-animation loop per feature card** (a looping `<video muted loop playsInline>` or a CSS-keyframe mini-UI) so the page keeps moving between scroll beats. Pause off-screen videos.
8. **Copy discipline matches motion:** headline 3 to 6 words, one-line subhead, CTA starts with a verb (`Start Free`, `Get early access`).
9. **Phone is its own composition.** Both sites switch to single columns at 900px, drop the scroll-frost under 900px, halve the globe point count under 760px, and drop `min-height` pins. Order this per page.

## Measurable checks (add to the order's CHECK line)
- Hero: asset present and `fetchpriority="high"` or `poster` set; headline word count 3 to 6; entrance stagger 80 to 180ms per word; first meaningful text visible by 1.5s after fonts are ready.
- Easing audit: `grep -o "cubic-bezier([^)]*)" *.css | sort -u` returns at most 3 distinct curves, none of them the bare `ease` on a reveal.
- Pinned section: a `position: sticky` element inside a track of at least `300vh` and the next section has negative `margin-top` plus `border-radius >= 40px`.
- Reduced motion: a `@media (prefers-reduced-motion: reduce)` block exists and the page is fully readable with it forced on.
- Hover audit: every `a`, `button`, `summary` has a `:hover` and `:focus-visible` rule.
- Performance: no layout-property animation (`width`/`height`/`top`/`left`) in the scroll loop; globe or canvas pauses when off-screen and halves its count on phones.
