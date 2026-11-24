# Market analysis: sizing, competitors, pricing, and customer research

Researched 2026-11-07. Tags as in `domain-atlas-reference.md`. Many sources are consultants and tools that sell market-sizing or survey services, so benchmarks are illustrative. Not investment advice.

## 1. Market sizing

- **Top-down** starts from a broad industry figure and narrows it: fast and uses third-party numbers, but depends on broad assumptions and tends to inflate. **Bottom-up** starts from real customers and prices: slower, more credible. [practice]
- **Bottom-up formula** (several sources): reachable target customers x annual contract value x period. Count real buyers (from lists, directories, registries), not analyst estimates, and use what early customers actually pay, not aspirational pricing.
- **Run both and reconcile.** When top-down says billions and bottom-up says hundreds of millions, one assumption is wrong, and it is usually the top-down. The gap is a diagnostic. [practice]
- **SAM and SOM matter more than TAM**: the serviceable segment you can actually reach, and the share you can realistically win in a stated period. One vendor cites 1 to 5% of a well-defined SAM as a seed-stage benchmark [to verify: vendor claim, not a standard].
- Write the assumptions as a list with a source or "estimate" next to each, and mark the one the answer is most sensitive to. A market number with no assumptions shown is decoration.

## 2. Competitive analysis and positioning

- **Competitive alternatives first** (April Dunford, *Obviously Awesome*; her writing at aprildunford.substack.com) [practice]: ask what the customer would do if your product did not exist. The first alternative to beat is often **doing nothing** or a spreadsheet. Her five positioning inputs: competitive alternatives, unique attributes, the value of those attributes, best-fit customers, market category. Exclude poor-fit customers from this work because their view of alternatives misleads.
- **Where to look** [practice, from practitioner write-ups]: review sites (G2, Capterra, TrustRadius; PeerSpot for enterprise IT) and filter reviews to 1 to 3 stars to find recurring complaints; competitor pricing pages and the Wayback Machine for pricing history; job postings and changelogs for direction; for **public** competitors, filings for stated positioning and customer language (this is general practice, not part of Dunford's method). Traffic-estimate tools (Similarweb) are estimates and deeper features need higher tiers.
- Treat competitors' own marketing as a claim, not a fact. Record the URL and date for each fact so it can be rechecked.
- Output to produce: a table of alternatives (including do-nothing), what customers like and dislike about each (quotes with sources), where you are genuinely different, and for whom. If you cannot name the customer who prefers you, positioning is not done.

## 3. Pricing research

- **Van Westendorp** asks four price-perception questions to map an acceptable price **range**; typically used early. **Gabor-Granger** asks purchase intent at specific prices to pick a **point** (one product at a time). A common sequence is Van Westendorp for the band, Gabor-Granger inside it, then qualitative follow-up. **Conjoint** measures trade-offs between features and price. [practice]
- **All of these measure stated intent**, so hypothetical bias applies: people say they would pay more than they do. The size of the gap is debated: a meta-analysis of stated-preference valuation studies found a **median hypothetical-to-actual ratio of about 1.35** (83 observations, heavily skewed), well below the folk belief of two to three times, while an earlier meta-analysis (List and Gallet, 2001) reported calibration factors with a **median of about 3.1**; choice-based elicitation reduced bias [primary papers, but from environmental and public-goods valuation, so **do not transfer the numbers directly to consumer purchase intent**; meta-analysis results are sensitive to outliers]. Validate with commitments: pre-orders, paid pilots, deposits, or real checkout tests, and treat a survey price as a hypothesis.
- Sample matters more than method: ask people who match the best-fit customer, and say how many answered.

## 4. Customer research: how many people, how to read them

- **The "five users" rule** came from a model in which each tester finds about 31% of usability problems, so five find about 85% [practice, Nielsen]. Critics show it was over-simplified: a 2010 meta-analysis reported about 10 (plus or minus 2) participants for 80% of problems [to verify], and other work found measurable gains from larger samples. Nielsen's own caveat: the rule holds for **comparable users doing similar things** and for finding problems, not for estimating rates.
- **Discovery (qualitative):** roughly 5 to 8 per distinct user type is a common start; stop when new sessions repeat what you have already heard (saturation). **Measurement (quantitative):** success rates, preferences and segment differences need far more data and confidence intervals; NN/g warns that metrics from small qualitative tests are often misleading.
- **Survey bias** (sampling, response, question wording) was not retrieved this session [open item]. Until read, assume: volunteers differ from non-volunteers, leading wording moves answers, and your own customers are not your market.

## 5. When to do what

| Stage | Do | Evidence to reach before moving on |
|---|---|---|
| Before building | 10 to 15 problem interviews with the best-fit customer; list competitive alternatives; bottom-up SAM with assumptions | At least one **commitment** from a real prospect |
| Before pricing | Van Westendorp and a few interviews on budget and current spend | A price band and a reason, tested later against real purchases |
| Before launch | Positioning one-pager: alternative, difference, best-fit customer, category | A prospect can repeat it back correctly |
| After launch | Measure who actually buys, from which channel, at what price; update SAM and positioning from real buyers | Cohort data, not opinions |

## 6. Failure patterns

Top-down only sizing; "1% of a huge market"; competitors listed as brands the customer has never heard of while the real rival is a spreadsheet; pricing set from cost; surveys of friends; treating a stated price as a purchase.
