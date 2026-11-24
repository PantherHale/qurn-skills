# Reliability and delivery: SLOs, error budgets, DORA

Researched 2026-11-07. Tags as in `domain-atlas-reference.md`.

## 1. SLIs, SLOs, error budgets

- [primary: Google SRE book and Workbook, sre.google] An **SLI** is a measured ratio of good events to total events (requests under a latency bound, successful requests). An **SLO** is the target for an SLI over a window. The **error budget** is 1 minus the SLO: how much unreliability is acceptable.
- [primary] As long as the SLO is met, releases may continue; when the budget is spent, effort moves from features to reliability. This turns an argument into a number both sides agreed in advance.
- Pick SLIs users would notice (availability, latency, correctness), not machine metrics (CPU). Fewer, well-chosen SLOs beat many.

## 2. Alerting on budget burn

- [primary: Workbook, "Alerting on SLOs"] Alert on how fast the budget is being consumed (**burn rate** = observed error rate divided by 1 minus the SLO), not on raw error rate. Use **multiple windows and multiple burn rates**: a fast burn pages immediately; a slow burn opens a ticket.
- [to verify] Example thresholds quoted in secondary posts for a 99.9% SLO: burn 14.4x over 1 hour, 6x over 6 hours. Take the exact values from the Workbook before using them.
- At a 99.9% SLO a burn rate of 1 consumes the 30-day budget in exactly 30 days.

## 3. Postmortems

Source: Google SRE book, chapter 15 "Postmortem Culture: Learning from Failure" (sre.google/sre-book/postmortem-culture), read 2026-11-07 [primary].

- **Definition:** "a written record of an incident, its impact, the actions taken to mitigate or resolve it, the root cause(s), and the follow-up actions to prevent the incident from recurring." It is "not punishment" but a learning opportunity for the whole company.
- **Blameless** means finding contributing causes without blaming an individual or team; assume people "had good intentions and did the right thing with the information they had." The reason given: blame makes people hide problems, and "You can't 'fix' people, but you can fix systems and processes." Blameless does not mean uncritical: it should call out where services can be improved.
- **Triggers to define in advance:** user-visible downtime or degradation past a threshold; data loss of any kind; on-call intervention such as a rollback or rerouting traffic; resolution time above a threshold; a monitoring failure (the incident was found by hand). Any stakeholder may also request one.
- **Review and culture:** drafts are reviewed by senior engineers ("An unreviewed postmortem might as well never have existed"), then stored in a searchable repository. Reviewers check that key data was collected, the impact is assessed, the root cause is "sufficiently deep", the action plan and priorities are right, and stakeholders were told the outcome. Senior management takes part, good postmortems are rewarded publicly, and teams are surveyed on whether the practice is too much toil.
- **Structure:** the chapter points to a template in its Appendix D example postmortem; it gives no section list itself. A workable shape: timeline, impact, contributing factors (plural), what went well, action items with owners and dates, and a later check that they were done.
- **Adopt gradually:** trial with a few postmortems and define the triggers first.

## 4. DORA and AI-assisted delivery

- [primary: Google Cloud DORA 2025 "State of AI-assisted Software Development", about 5,000 respondents, via coverage] AI is described as an **amplifier**: adoption was near-universal (about 90% of respondents using AI at work) and is now associated with higher delivery throughput, but also with more instability. Gains concentrate in teams with **loosely coupled architectures and fast feedback loops**; tightly coupled systems and slow processes see little benefit. **Small batches** are singled out as especially powerful. Only about 3% reported high trust in AI output [to verify: figure quoted by a summary]. The report adds a seven-capability model and stresses platform teams.
- **DORA's current delivery metrics** (dora.dev/guides/dora-metrics, page last updated 2026-01-05, read 2026-11-07 [primary]) are five, in two groups. *Throughput:* change lead time (committed to version control until deployed in production), deployment frequency, and failed deployment recovery time (time to recover from a deployment that fails and needs immediate intervention; this replaced the older "time to restore" / MTTR framing). *Instability:* change fail rate (share of deployments needing immediate intervention, often a rollback or hotfix) and deployment rework rate (share of deployments that are unplanned and caused by a production incident).
- **How DORA says to use them:** per application or service, not across a whole company; speed and stability are not a trade-off (top performers do well on all five). Listed pitfalls: setting a metric as a target (Goodhart's law invites gaming), relying on a single metric, using the industry as a shield, comparing very different applications, siloed ownership, competing against other teams, and measuring at the expense of improving. Suggested loop: baseline (DORA Quick Check), discuss friction, fix the main constraint, re-check.
- The page gives **no performance-tier thresholds or numeric benchmarks**, so do not quote "elite" cut-offs from memory; read the current report.
- Implication for Qurn: AI speed without review, tests and small changes buys instability. This matches Qurn's evidence-before-pass rule.

## 5. Cost and platform (thin)

Source: FinOps Foundation framework (finops.org/framework, principles and phases pages), read 2026-11-07 [primary; the framework describes itself as "flexible and non-prescriptive"].

- **Definition (verbatim):** "FinOps is an operational framework and cultural practice which maximizes the business value of technology, enables timely data-driven decision making, and creates financial accountability through collaboration between engineering, finance, and business teams."
- **Principles** ("in no particular order"): teams need to collaborate; business value drives technology decisions; everyone takes ownership for their technology usage; FinOps data should be accessible, timely, and accurate; FinOps should be enabled centrally; take advantage of the variable cost model of the cloud.
- **Phases, worked iteratively:** *Inform* (visibility and allocation: examine cost, usage and efficiency data), *Optimize* (rates and usage: usage and rate optimisation), *Operate* (continuous improvement, looping back).
- **Domains** (from the framework navigation): understand usage and cost (data ingestion, allocation, reporting, anomaly management); quantify business value (planning, forecasting, budgeting, KPIs and benchmarking, unit economics); optimize usage and cost (architecting and workload placement, usage optimisation, rate optimisation, licensing and SaaS, sustainability); manage the practice (strategy alignment, governance, education, invoicing and chargeback, assessment, tooling).
- **Personas:** core: FinOps practitioner, engineering, finance, leadership, procurement, product; allied: ITAM, ITFM, ITSM, security, sustainability.
- Practical start for a small team: tag or allocate every resource to an owner, review cost by owner monthly, set a budget with alerts, and tie cost to a unit (cost per customer or per request) so a rising bill can be told apart from growth. [practice; the framework's allocation and unit-economics capabilities]

## 6. Use

When reviewing a plan: does it define an SLO before launch? Is there a rollback and a staged migration? Are changes small? Does the team measure change failure rate? Add any "no" to the risk register with an owner.
