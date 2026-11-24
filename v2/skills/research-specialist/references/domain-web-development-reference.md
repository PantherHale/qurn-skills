# Web development: what the evidence supports, and what to do when

Researched 2026-11-07. Tags as in `domain-atlas-reference.md`. Most sources were third-party blogs; where a primary page exists it is named so it can be re-checked. Not legal advice.

## 1. Performance targets

- **Core Web Vitals "good" thresholds** [practice; confirm on web.dev]: LCP 2.5 s or less, INP 200 ms or less, CLS 0.1 or less, each judged at the **75th percentile of real visits** over a rolling 28-day window (CrUX). "Poor" starts above 4.0 s, 500 ms and 0.25. A page passes when at least 75% of visits are good on all three. INP replaced FID in March 2024. One source claimed thresholds had tightened; most said unchanged, so treat that as an outlier.
- **Field data beats lab data.** A Lighthouse score on your laptop is a diagnostic; the pass/fail is what real users on real phones experience. Measure on a throttled mid-range phone and, after launch, with real-user monitoring.
- **Does speed raise conversion?** The much-quoted study is Deloitte's "Milliseconds Make Millions" (web.dev/milliseconds-make-millions) [primary, with caveats]: 37 brands, about 30 million mobile sessions, four weeks of data from late 2019, reporting that a 0.1 s improvement was associated with about 8.4% higher retail conversion and 10.1% for travel. **It was commissioned by Google, is observational (correlation), uses old data, and the effect was not uniform across the funnel.** Use it as direction ("faster is better, and it is worth measuring"), never as a forecast for a specific site.

## 2. Choosing how to render

[practice; synthesis from 2026 framework guides, verify framework details in official docs]
- **Hybrid per route is the default**: decide by how often content changes and how personalised it is.
- Static, rarely changing pages: SSG. Content that updates (blogs, docs, catalogues): ISR or SSG with revalidation. Personalised or authenticated pages: SSR or edge rendering. Dashboards and tools: client-rendered is fine.
- Server Components and **islands** (Astro-style partial hydration) are about *how much JavaScript reaches the browser*, a separate decision from *when* HTML is produced.
- Relying on client-side rendering alone for a content site hurts Core Web Vitals and crawlability. SSG build time grows with page count.
- The split "content site leans static, app leans server or client" is a synthesis from several sources, not a rule from one authority.

## 3. Accessibility is a legal date, not a polish step

- **European Accessibility Act (EAA):** enforceable from **28 June 2025** [primary: EU directive; secondary reporting]. It covers B2C e-commerce and certain digital services sold to EU consumers **regardless of where the company is based**; microenterprises (fewer than 10 employees) are generally exempt [practice]. National authorities enforce (Sweden's PTS and the Dutch ACM were reported inspecting e-commerce). One vendor claim of first lawsuits in France could not be confirmed.
- **Standard:** the harmonised standard EN 301 549 is commonly cited as incorporating **WCAG 2.1 AA**; one source reports a newer version incorporating WCAG 2.2, with citation in the EU Official Journal pending [to verify]. Build to **WCAG 2.2 AA** as the safe target, since it includes 2.1.
- **Other countries and the US:** see `domain-global-law-and-compliance-reference.md`. In short: WCAG 2.1 AA is the common benchmark worldwide (2.2 AA safer); the US has a 2024 DOJ rule for state and local government sites (compliance dates extended in April 2026, to verify) and roughly 4,000 federal web-accessibility suits were reported for 2024; Canada (Accessible Canada Act, Ontario's AODA) and Australia have their own regimes.
- Automated scanners catch only part of the issues; keyboard, screen-reader and zoom testing are manual. Build accessibility into components from the first wave, because retrofitting is the expensive path.
- A qualified accessibility or legal professional must confirm legal scope for a specific business.

## 4. Search in the AI-answer era

- **Randomised evidence:** a field experiment with about 1,065 Chrome users (Agarwal and Sen, SSRN, April 2026, as reported by trade press) found AI Overviews cut outbound organic clicks by roughly **38 to 40%** on queries where they appeared and raised zero-click searches, with no gain in user satisfaction [to verify: read the paper].
- **Observational:** Pew's panel found about 8% of users clicked a result when an AI Overview appeared versus about 15% without; Ahrefs' large keyword analysis reported a 58% fall in click-through for top results. Observational studies cannot isolate the cause as cleanly. **Aggregate** US organic traffic was reported down only about 2.5% year on year (Graphite via Search Engine Land), so effects vary heavily by query type.
- **llms.txt:** Google states Google Search does not use it. A server-log study (Ahrefs) found 97% of valid files drew no requests in the study month, and SE Ranking found no predictive signal for AI citations across three analyses [practice]. **Do not spend a sprint on it.**
- **Structured data:** Google says no special markup is required for its generative features; claims that it boosts AI citations are vendor assertions with thin evidence [to verify]. Use schema for the rich results it is documented to produce.
- **Implication:** do not rely on organic search as the only acquisition channel. Build direct channels early (email list, community, referrals) and measure source by source.

## 5. What to do, in which order

| When | Do | Why now |
|---|---|---|
| Before design | Decide the rendering approach per route; set a performance budget (CWV targets above) and an accessibility target (WCAG 2.2 AA) | Cheap now, expensive after the layout exists |
| First wave | Walking skeleton deployed on the real host, opened on a mid-range phone | Surfaces hosting, font, image and JS weight problems while they are cheap |
| During build | Components built keyboard-operable with visible focus, real labels, contrast checked; images sized and lazy-loaded; JS budget watched | Retrofits cost more than first builds |
| Before launch | Cold load of the live URL on a throttled phone; axe or equivalent plus manual keyboard and screen-reader pass; consent and privacy copy; analytics plan | The checks the Cola build had to be asked for one at a time |
| After launch | Real-user monitoring for CWV; look at source-by-source traffic; do not run A/B tests until traffic can power them (see `domain-product-and-experimentation-reference.md`) | Lab numbers are not field numbers |

## 6. Questions to answer before choosing a stack

Who updates the content and how often? How much of the page is personalised? What is the slowest device and network we must serve? Which regions' accessibility law applies? Where will traffic come from if organic clicks fall? What is the team able to maintain?
