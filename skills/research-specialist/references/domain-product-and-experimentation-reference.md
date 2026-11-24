# Product discovery, prioritisation and experiments

Researched 2026-11-07. Tags as in `domain-atlas-reference.md`. The honest headline: the evidence for popular product frameworks is mostly advocacy and anecdote, while experiment statistics are well established.

## 1. Discovery and prioritisation

- [practice] **Opportunity solution trees** (Teresa Torres, *Continuous Discovery Habits*) enforce a hierarchy: outcome, then opportunities, then solutions, so you compare opportunities, not one solution against another. A critical review found **no controlled study** comparing the tree with alternatives, and a community survey reported many users find trees get messy (the sample and method were unclear) [to verify].
- [practice] **RICE** is widely criticised as opinion presented as arithmetic: Confidence tends to default high, Effort is often wrong, and effort-weighting favours small items regardless of impact. A useful repair is to tie Confidence to evidence levels (an opinion scores low; a live experiment scores high) and split Effort into engineering, design and QA. Treat these as perspectives, not findings.
- **Jobs to be done** has two lineages. The Harvard Business Review article (Christensen, Hall, Dillon and Duncan, "Know Your Customers' 'Jobs to Be Done'", Sept 2016) was fetched but **only its abstract and opening paragraph were readable** (it quotes a McKinsey poll: 84% of executives call innovation extremely important to growth, 94% are dissatisfied with their innovation performance), so none of its method is cited here; read it directly. [Open item] The second lineage, Strategyn's Outcome-Driven Innovation (strategyn.com/jobs-to-be-done, read 2026-11-07; a vendor page, so its success-rate claims are the vendor's own and are not repeated here): JTBD is "a theory of innovation that holds that people buy products and services to get a job done"; a job statement should be solution-free (its example: "cut a piece of wood in a straight line"); "A market is not defined around a product or a customer demographic" but around a group of people and the core job; **desired outcomes** are the metrics customers use to judge success at the job, with markets having dozens to well over a hundred. Its research method: qualitative interviews to build a **job map** (eight universal steps: define, locate, prepare, confirm, execute, monitor, modify, conclude), then a quantitative survey rating each outcome's importance and current satisfaction to find unmet and over-served needs. Distinguish the job executor from the buyer and the support team. Use it as a lens for what to ask in discovery, and remember the page itself is sales material.
- Rule of use: no framework replaces talking to customers (`domain-startup-validation-and-gtm-reference.md`). Pick the lightest method that makes the trade-off visible, and say what evidence each score rests on.

## 2. Experiments (A/B tests)

Original: Kohavi, Tang and Xu, *Trustworthy Online Controlled Experiments* (2020). Pitfalls repeated across the sources:
- **Peeking.** Checking repeatedly and stopping at the first significant result inflates false positives; one source cites uncorrected peeking taking a nominal 5% to above 25% [to verify]. Fix the sample size in advance, or use sequential methods designed for continuous monitoring.
- **Sample ratio mismatch (SRM).** If the traffic split differs from the design, there is a randomisation or logging bug. Check SRM before reading any metric, and stop if it fails.
- **Underpowered tests.** Without a power calculation, a non-significant result does not show "no effect"; it may show "too little data".
- **Novelty and primacy effects.** Short tests can capture curiosity or adaptation instead of the lasting effect; run long enough and consider new-user cohorts.
- Also: multiple comparisons (many metrics, many variants), interference between users (network effects), and metrics that move for the wrong reason.
- Small companies often lack the traffic for a well-powered test. Then use larger effects, qualitative evidence and before/after with honest caveats, and say that it is not an experiment.

## 3. How Qurn uses this

In a plan, every claim of "this improved X" names its evidence level: measured experiment, observational, or opinion. A decision driven by a score names the evidence behind each input.
