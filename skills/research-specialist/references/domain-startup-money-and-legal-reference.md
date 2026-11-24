# Startup: money, funding and legal basics

Researched 2026-11-07. **This file is not legal, tax or investment advice.** Entity choice, equity, tax elections and securities rules depend on jurisdiction and facts. **This file is US-centred** (Delaware C corporation, US 83(b), Carta and US benchmarks); for Europe and India read `domain-global-startup-and-funding-reference.md`, and for law by country `domain-global-law-and-compliance-reference.md`. A startup lawyer and an accountant must confirm anything the operator will act on. Figures below come mostly from vendor blogs and secondary write-ups and differ between sources; the publishers of the data are named so you can pull the primary numbers.

## 1. Unit economics

- Definitions first: **CAC** (cost to win a customer), **LTV** (lifetime value), **payback** (months of gross margin to recover CAC), **NRR/GRR** (net/gross revenue retention). LTV can be revenue-based or gross-margin-based, which changes the ratio a lot; always say which.
- [to verify, secondary 2026 benchmark posts] Frequently cited: LTV:CAC of 3:1 as a minimum viable threshold (one source cites a 3.2:1 median, attributed to OpenView); median NRR near 101% and GRR near 88% for private B2B SaaS; gross margin medians quoted between about 75% and 82%; CAC payback quoted anywhere from 12 months as a ceiling for early stage to an 18 to 24 month median for SMB SaaS.
- No single dataset with consistent definitions was found. Pull the primary reports (KeyBanc, Bessemer, OpenView, ChartMogul, Maxio) and quote the segment (ARR band, sales motion) with the date.
- Rule of use: unit economics at validation stage are estimates built on assumed conversion. Label them so and replace them with measured cohorts as soon as there are any.

## 2. Pricing

- [practice] Price from the value to the buyer and what alternatives cost them, not from your costs or a competitor's cheapest plan. One 2026 pricing post warns that copying a $29 plan can drain runway when the buyer's budget is far higher [to verify].
- Test willingness to pay with commitments (pre-orders, paid pilots), not hypotheticals. Raise prices before you add discounts.
- Usage-based vs seat-based vs flat: choose the unit that scales with the value the customer gets and that they can predict. State the trade-off to the operator rather than defaulting.

## 3. Funding

- [to verify; Carta, PitchBook-NVCA via secondary posts] Seed medians reported in 2026 differ by measure: one source gives a Carta median of about $4.1M raised at roughly a $24M post-money valuation (about 18% dilution); another cites a PitchBook-NVCA pre-money median of about $18.4M on about $3.0M raised. These are different measures; do not compare them directly. The valuation figures are skewed by AI companies.
- [practice, Carta] At pre-seed, the post-money SAFE with a valuation cap and no discount is the dominant instrument (one source: 94% of capped SAFEs in H1 2026). Reported median caps: about $10M for $250k to $1M rounds and about $15M for $1M to $2.5M rounds [to verify].
- Funding is a tool for a business that needs capital to reach a measurable milestone, not a goal. Many businesses should not raise. Name the milestone the money buys and the evidence that makes the next round possible.

## 4. Entity, equity, vesting

- [practice] Venture-backed US startups almost always form a **Delaware C corporation**; an LLC is common for bootstrapped, profitable businesses because losses flow through to owners. Changing later (including a "Delaware flip") costs time and money, especially mid-raise.
- [practice] Founder stock commonly vests over 4 years with a 1-year cliff (25% at 12 months, then monthly). Founders may get credit for time already worked.
- [practice, **deadline risk**] A US **83(b) election** must be filed within 30 days of receiving restricted stock; sources say there are no extensions and a late filing generally cannot be cured. This is exactly the kind of fact to confirm with a lawyer or the IRS instructions the day shares are issued.
- Outside the US the entity, tax and equity rules differ materially (including for non-US founders raising from US investors). Do not transpose the US answer.
- Cap table hygiene: write down who owns what, vesting terms, IP assignment to the company from every contributor, and any promised equity before the round, not during it.

## 5. Questions to hand the professionals

"Which entity and jurisdiction for our funding plan and our founders' tax residency?" "Are our founder shares subject to vesting and have 83(b) elections been filed for them?" "Is every contributor's IP assigned to the company?" "What does the SAFE we are offered convert at under our cap table?" "What are our obligations on user data and marketing consent?"

## 6. How Qurn uses this

Money and legal questions are always ASK items in the assumptions gate and are never cleared by Qurn (management rule 4). Qurn can structure the question and the evidence; it cannot decide the answer.
