# Research domain atlas: where to start, what to trust, what is still open

Built 2026-11-07. This is the map for researching a topic you have no prior notes on. The domain files below hold briefs for the areas covered so far; for anything else, use the method in section 2. Confidence tags used everywhere: **[primary]** a standard, spec, paper or the original author; **[practice]** several practitioner sources agree; **[to verify]** one source, vendor blog, conflicting figures, or recalled from the established canon without being re-fetched this session.

## 1. Domain files

| Topic | File |
|---|---|
| Is the idea real? Customer discovery, product-market fit, first customers | `domain-startup-validation-and-gtm-reference.md` |
| Money and legal for a startup: unit economics, pricing, funding, entity, vesting | `domain-startup-money-and-legal-reference.md` |
| Designing complex systems: consistency, resilience, data stores, monolith vs services | `domain-systems-design-reference.md` |
| Running them: SLOs and error budgets, delivery metrics, AI-assisted delivery | `domain-reliability-and-delivery-reference.md` |
| Product discovery, prioritisation, experiments | `domain-product-and-experimentation-reference.md` |
| Building with LLMs: RAG, agents, evals, cost | `domain-ai-systems-reference.md` |
| Web development: performance targets, rendering choice, accessibility law dates, search in the AI era | `domain-web-development-reference.md` |
| Market analysis: sizing, competitors and positioning, pricing research, customer-research sample sizes | `domain-market-analysis-reference.md` |
| Human behaviour: nudge effect sizes, how people read pages, dark patterns and subscription law | `domain-human-behaviour-reference.md` |
| Law and compliance outside the US: EU, UK, India, Canada, Brazil, China, Japan, Singapore, Australia | `domain-global-law-and-compliance-reference.md` |
| Global markets: payment methods, devices, language and localization, whether behavioural findings travel | `domain-global-markets-and-localization-reference.md` |
| Starting and funding a company outside the US (Europe, India) | `domain-global-startup-and-funding-reference.md` |
| What to do and when across a whole build | `qurn/references/sequencing-playbook-reference.md` |

**Jurisdiction first.** Before any legal, tax, funding, payment or behavioural answer, establish which countries the company, the founders and the users are in. Several older briefs were written from US sources; where a brief says so, read the global brief next to it, and never present a US rule as if it applied everywhere.
| Security of agents and skills | the `security` specialist, `agent-context-supply-chain-reference.md` |
| 3D and web delivery | the `web` specialist's 3D references |

**Not covered yet** (do not answer these from memory; research them from scratch with section 2): hardware and embedded, regulated sectors (health, finance, children, gambling: a lawyer is required regardless), data engineering and ML training pipelines, mobile-specific constraints, accessibility law by country, tax, hiring and compensation, international expansion, sales process design for enterprise, content and SEO strategy, game design.

## 2. Method for any new domain

1. **Decompose.** Write the 5 to 8 questions a practitioner in that domain would ask first. A topic is not a question.
2. **Name the primary sources before searching.** Every field has them: the original books and papers, the standards body, the regulator, the maintainers' own docs, the large operators' engineering write-ups. A search that returns only vendor blogs means you have not found them yet; say so.
3. **Ladder the evidence:** primary source > independent measurement > several agreeing practitioners > one vendor > a summary of a summary. Vendor surveys sell the product that fixes the problem they measure; label that.
4. **Separate the three kinds of claim:** definitions and mechanisms (stable, learn from the canon), numbers and benchmarks (date-stamped, vary by definition, treat as ranges), and prescriptions ("always do X"; check what evidence supports them, most have none beyond author authority).
5. **Look for the disagreement.** Every mature field has a live argument (monolith vs services, RICE vs alternatives). Report both sides and what each depends on, not a winner by default.
6. **Record the gap.** What you searched for and did not find goes in the report as an open item, with the query that would close it.
7. **Flag the expert boundary.** Law, tax, securities, medicine and safety-critical engineering get "a qualified professional must confirm", with the specific question to ask them.

## 3. Standing rules for numbers

- Quote a benchmark only with its date, its source, its definition and its segment. "Median CAC payback is 18 months" without those is noise.
- When two sources differ by a definition (post-money vs pre-money, revenue LTV vs margin LTV), say which is which and do not average them.
- A figure repeated across blogs may trace to one source. Count independent origins, not pages.
- Survey percentages describe respondents, not the world. Note the sample and who ran it.

## 4. Open items found while building this atlas

Closed on 2026-11-07 by reading the primary pages: blameless postmortems (SRE book), idempotency and queue load levelling and backlogs (Amazon Builders' Library, Azure Architecture Center), FinOps (FinOps Foundation framework), DORA metric definitions, Paul Graham's essay. Still open: the HBR jobs-to-be-done article body (only the abstract was readable; the Strategyn vendor page is used instead and labelled as such); DORA performance-tier values (the current DORA metrics page gives none); primary startup benchmark data (Carta, PitchBook-NVCA, KeyBanc, Bessemer, ChartMogul, Maxio publish them directly); the original books (Kleppmann, Fitzpatrick, Torres, Kohavi) which are not web pages and must be read as books.
