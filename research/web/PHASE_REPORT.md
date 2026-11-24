# Phase 1 (web): final report

Date: 2026-11-24. Status: **research and fulfilment done for web; waiting for operator review before Phase 2 (tester).**
Sources: [studies.md](studies.md) (round 1) and [studies-round2.md](studies-round2.md) (round 2). Nothing was copied verbatim from third-party skills; ideas and thresholds are in our own wording with their source named, and third-party text is treated as data.

## 1. What was studied, and how deeply

| Group | Read | Depth |
|---|---|---|
| Direction and anti-slop skills | Impeccable (core + 5 references + 60-rule detector registry + concept catalogue), Unslop (SKILL + signs + tokens), taste-skill (almost all of the 1,200-line skill, plus three scripts via agent), Hallmark (SKILL, 9 references, 6 themes, linter head), auteur (3 scripts, taste.md, verify.md, in full), Studio-Groei anti-slop, UIZZE skill and guides, Anthropic frontend-design, high-end-visual-design, UI/UX Pro Max (table shapes), apple-design | Mostly full or near-full; sloplint and consistency.mjs only partly (231k and about 1 MB of source) |
| Motion and scroll skills | GSAP official skills (8 of 8), iart web-animation (9 of 9), Emil Kowalski (16 of 20 skills + 2 cheatsheets), ibelick (2 of 10), MengTo (8 skills of 217), scroll-craft, genjutsu, refero, design-dna | Good for the skills that matter most to us |
| Docs | GSAP (ScrollTrigger, SplitText, Flip, matchMedia, useGSAP, installation, licence), Lenis skill, Motion (5 pages), View Transitions, MDN scroll-driven animations, R3F and drei, Rive, Theatre, shadcn, Aceternity, Magic UI | Good except where marked "to verify" |
| Real-world evidence | 6 Awwwards 2026 case studies, HTTP Archive Web Almanac 2025 (fonts, performance, accessibility), web.dev thresholds, MDN Baseline pages | Codrops blocked (403); the Almanac CSS chapter 404; so no CSS-feature adoption numbers |
| uizze.com | Stopped. Its Terms prohibit automated reading; about 15 public pages had already been read before that was known (my mistake). No data from it is in our skills. | See section 6 |

## 2. Corrections to what I told you earlier
- uizze.com is a paid reference library with category counts, not a list of walk-through workflows. The first fetch missed it because the explore view needs JavaScript.
- I wrongly called apple-design a gap; our `fluid-interaction-reference.md` already had it.
- **GSAP is not MIT.** It is under the "Standard 'No Charge' GSAP License" (Webflow, effective 2025-04-30). Commercial use is free, including SplitText and MorphSVG. The one restriction is building a no-code visual animation tool that competes with Webflow. This is now written into our GSAP reference.
- Theatre.js has had no release since 2023-08-10 (v0.7.0): a maintenance warning is in our libraries reference.
- "Scroll-driven animations need an `@supports` fallback" was true but dated: MDN now shows Baseline 2026 (newly available since October 2026). Our doctrine file was updated; the fallback advice stays for older browsers.
- The open web and a curated product library disagree on fonts (Inter is about 1.5% of open-web font-family use in the Almanac). We state which web we mean.

## 3. Gap closure (what changed in `skills/web`, mirrored to `skills/web-specialist`)

| # | Gap from the first matrix | Where it is closed | State |
|---|---|---|---|
| 1 | GSAP engineering rules | `references/gsap-and-lenis-engineering-reference.md` sections 0-9, 11 | Done |
| 2 | Lenis symptom table, limits, snap, nested scroll | same file, sections 1-3 | Done |
| 3 | Mechanical slop scan | `scripts/slop-scan.mjs` + 22 tests (90.7% line coverage), rules listed in `references/quality-gates-reference.md` section 2 | Done; 18 rules |
| 4 | Bounded finish rounds, failing size first | `references/quality-gates-reference.md` section 6, SKILL.md paragraph | Done |
| 5 | Motion decision frame (frequency first) | `references/motion-decision-reference.md` | Done |
| 6 | Motion performance rules | same file, section 6 | Done |
| 7 | Tiered reduced motion | same file, section 7 | Done |
| 8 | Framework page transitions | `references/platform-baseline-reference.md` | Done |
| 9 | Baseline feature facts with dates | same file | Done, with "to verify" on four items |
| 10 | Hero and page numeric rules | `references/page-copy-and-structure.md` rules 21-29, reconciled with our stricter Persuade budgets | Done |
| 11 | Direction contract before code, design record after | `references/quality-gates-reference.md` section 8 | Done |
| 12 | Concept dice (challenger list) | Not done on purpose: our concept method already derives concepts from the product's world; a random dealer is not worth the complexity yet | Deferred |
| 13 | Wide-net variants, live tweak panel | Variant rule belongs with Phase 6 (delegator); tweak panel is tooling | Deferred |
| 14 | Real-site measured data | Replaced by public Web Almanac 2025 figures in `platform-baseline-reference.md` and `design-systems-reference.md` (uizze data excluded) | Done, smaller than planned |
| 15 | Reference-to-decision discipline | `references/quality-gates-reference.md` section 7 | Done |
| 16 | Copy hygiene beyond em dashes | `page-copy-and-structure.md` rules 27-28 and the scanner's `placeholder-copy`, `emoji-label` | Done |
| 17 | Operate-surface token floor | `references/design-systems-reference.md` new section | Done |
| 18 | SVG, Lottie, Rive, morph choices; library table | `references/libraries-decision-reference.md` | Done |
| 19 | Accessibility fix rules | Phase 2 (tester) | Deferred on purpose |
| 20 | Skill-stack routing | Phase 8 (qurn lead) | Deferred on purpose |
| new | Redesign protections (what never changes silently, SEO baseline) | `references/quality-gates-reference.md` section 9 | Done |
| new | Worst-case data test | same file, section 10 | Done |

Also: the twin `skills/web-specialist/` had drifted (it lacked the "Warm ambient glass" recipe and three other references). It is now an exact mirror of `skills/web/` (`diff -rq` clean), and `flatten/web.prompt.md` was regenerated and passes `build-flatten --check`.

### Kept, not diluted
Commercial product presentation, reference-site families A/B/C, phone and first-load as design, 3D product realism, marketing psychology, launch channels, numbered BUILD ORDERS with a measurable CHECK line, `style-signals.mjs` and `experience-testers.mjs`. None of those files was edited, except that `page-copy-and-structure.md`, `design-systems-reference.md` and `web-craft-doctrine-reference.md` got additions or one dated correction.

### Deliberately not copied
Single-look bans (no Inter, no uppercase labels, weights capped at 600), mandatory glass-pill nav and "$150k agency" templates, random theme dealing as the main creative engine, and any rule that requires a Node 22 plus Chrome toolchain for the advisor to work.

## 4. Verification
- Unit tests: `node --test` on every `*.test.mjs` in the repo: 105 of 105 pass (five consecutive runs). **One earlier run showed a single failure that I could not reproduce or identify; I am reporting it rather than hiding it.** (The count includes the new test file twice because it exists in both twins.)
- `slop-scan.mjs`: 22 tests, 90.7% line coverage. Run read-only on two of your other projects it found real tells: 7 `transition: all`, 1 raw scroll listener, a violet two-stop gradient, a gradient-text rule and 96 em-dash warnings. No file there was changed.
- Security scan (`skill-scan.mjs`) over `skills/web`: no injection findings; five LOW "hidden comment" flags, four of them regex literals inside my own scanner.
- `build-flatten --check`: OK.

## 4b. Proof: old skill vs upgraded skill, judged blind
**Setup.** The same brief (a one-page site for "Marrow", a fictional enameled cast-iron maker; Next.js App Router, Lenis + GSAP, pinned scroll hero, 6-7 sections, phone and reduced motion, public deploy) was given to two writers. One read a copy of the web skill WITHOUT the five new references, the scanner, the new SKILL paragraph and page rules 21-29 (A); the other read the upgraded skill (B). A reviewer who had not seen either skill got the two order sets relabelled X and Y in swapped order and scored them on seven criteria with quoted evidence. B was X. Files are in the session scratchpad (`orders-A.md`, `orders-B.md`, `judge/review.md`).

| Criterion (1-5) | Old (Y) | Upgraded (X) |
|---|---|---|
| Engineering correctness (GSAP/Lenis/React) | 3 | 4 |
| Measurable CHECK lines | 4 | 5 |
| Motion restraint | 3 | 4 |
| Slop and template avoidance | 3 | 4 |
| Phone / low-GPU / first load | 4 | 4 |
| Specificity to the brand | 3 | 4 |
| Honesty about what cannot be verified | 3 | 4 |
| **Total** | **23** | **29** |

Objective counts (lines naming each practice, old vs upgraded): `useGSAP`/`gsap.context` 0 vs 1; refresh after `fonts.ready` 0 vs 3; StrictMode 0 vs 1; leak/trigger-count check 0 vs 2; `autoRaf` rule 0 vs 1; `slop-scan` 0 vs 7; both had 14 check lines. The old set had no `ticker.remove` on cleanup, no StrictMode check, no refresh order, a fake-success sign-up (HTTP 200, nothing stored), an overshoot easing on a cast-iron brand, a warm artisan palette close to the one it said it avoided, and a brass focus ring that fails 3:1 contrast. The upgraded set was better on every criterion except phone/first load, where it tied, and the old set's two-width image layers and JS budget were better.

**What the reviewer found wrong in the upgraded set, and what I changed in the skill because of it** (these are gaps in our references, not just in one order set):
1. CSS keyframe loop and GSAP writing the same `opacity` -> rule added to `gsap-and-lenis-engineering-reference.md` plus a grep CHECK.
2. Scrubbed `mask-image` called compositor-only -> added to `motion-decision-reference.md` section 6 (paint-heavy; use a transform-only reveal or a low-tier fallback).
3. A 135-word budget the content could not meet -> rule 29 in `page-copy-and-structure.md` now says to count the real content first.
4. `script-src 'self'` on a Next.js page breaks hydration without nonces or hashes -> added to `quality-gates-reference.md` delivery notes.
5. Async Lenis start after `fonts.ready` with no cancelled flag, inline ticker callback that cannot be removed, StrictMode check counted triggers but not Lenis instances -> added to the GSAP reference and its CHECK lines.
6. Lid state set after hydration flashes the finished state -> start-state-before-paint rule added.
7. Focus ring and dimmed options need 3:1 / contrast checks; contrast ratios must be computed, not asserted; phone-size image variants and a numeric JS budget -> added to the quality-gates delivery notes.
Left for later phases: in-memory rate limiting on serverless (Phase 3, security).

**Limits of this proof (read these before trusting it).** It tests ORDERS, not a built and measured page. It is one run per side by the same model family, judged by one reviewer, so it shows direction, not statistical significance. The upgraded skill tells the writer to include a scan command and finish rules, so part of the measurability gain is the skill being followed, which is the point, but it is not independent evidence that the built page is better. The "old" copy was assembled by removing my additions from the current tree, not by checking out an earlier commit. No page was built, no browser measurement was taken, and real-phone frame rate is unmeasured. A real before/after build with `experience-testers.mjs` numbers is the next step if you want hard evidence.

## 5. What is still unverified (so we do not claim it)
- GSAP LICENSE file text itself (the licence page was read; the file URLs 404'd).
- Per-browser versions for scroll-driven animations; Baseline status of view transitions, container queries and `interpolate-size`.
- Motion's `inView`/`scroll()` pages, LazyMotion sizes and `useReducedMotion`; Rive vs Lottie file sizes; Theatre.js licence; Aceternity and Magic UI licences.
- Rule tables in Hallmark's sloplint and taste-skill's consistency.mjs beyond the parts read; the "tested end to end" ranking in the awesome list.
- Any claim in our new references marked "(SV)" is a starting value from third-party skills, to be measured on a real build.

## 6. Open items and the decision I need
1. **uizze catalogue:** blocked by its Terms. It stays unstudied unless you subscribe to their official MCP (then I study it through that, within its documented limits) or the owners say yes. I would not spend more time on it otherwise.
2. **Unread in the web field:** Impeccable's `live` and `harden` references, Emil's 4 remaining skills, MengTo's other 200 skills, taste-skill's component appendix, Awwwards beyond six case studies, Motion's unread pages. None changes a rule we wrote; they would add depth.
3. **Next phase:** Phase 2 (tester) per `docs/design/FIELD_RESEARCH_PLAN.md`. Phase 2 will also take the accessibility-fix rules that Phase 1 deferred.
