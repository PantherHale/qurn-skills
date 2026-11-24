# What to do, and when

One timeline for any build that real people will use, joining the research briefs (web development, market analysis, human behaviour, startup, systems) to Qurn's gates. Each row names the evidence needed to move on and the specialist who owns it. Run only the rows the mode needs (Lite skips most, Pro runs all).

## Stage 0: decide whether to build (before any code)

| Do | Evidence to reach | Owner |
|---|---|---|
| Talk to 10 to 15 people who match the best-fit customer about the problem, not your idea | At least one **commitment** (pre-order, paid pilot, introduction) | research |
| List the **competitive alternatives**, including "do nothing" | A table with sourced complaints about each | research |
| Size the market **bottom-up** and reconcile with top-down | Assumptions listed; the most sensitive one marked | research |
| Write the **non-negotiables** (for example "fully local", "no data leaves the PC", "must work offline", a budget cap) | Operator-confirmed list; every one becomes a locked decision | qurn (assumptions gate) |
| Check which rules apply (accessibility date, privacy, subscriptions, regulated sector) | Named rules and "a professional must confirm" items | security, research |

**Stop signs:** no problem evidence; a non-negotiable that the idea breaks; a legal scope nobody has checked.

## Stage 1: plan (gate G0 to G1)

| Do | Evidence | Owner |
|---|---|---|
| Assumptions gate; ASK items answered or defaulted | Locked decisions in the ledger | qurn |
| Pre-mortem: five ways this fails, each with a measurable check | Risk register | qurn |
| Definition of done in **measurable** terms, including budgets (for example idle CPU, first-load time, word-error rate on real recordings, accessibility target) | Numbers with the method of measuring | tester, architect |
| Choose rendering or architecture by workload (`domain-web-development-reference`, `domain-systems-design-reference`) | ADR with the rejected alternative | architect, coder |
| Record the **environment baseline**: the target device, what else is running, memory and CPU headroom | A measured baseline, not a guess | tester |

## Stage 2: build (G2)

| Do | Evidence | Owner |
|---|---|---|
| **Walking skeleton first:** the thinnest end-to-end slice, running for real (the real app, the real host, the real device) | A screenshot or log from the real thing | coder, web |
| Build in small steps; **edit files with the editor tool**, not scripted find-and-replace; re-read the changed region | The file reads correctly; line endings unchanged | coder |
| Accessibility, performance and privacy built into components, not retrofitted | Per-component checks | web, security |
| Fakes allowed in unit tests, but **every integration point gets one test against the real thing** | A real-path test that fails when the wiring is wrong | tester |
| Each failure the user can see gets a **plain-words error**; failed tools are reported as failed, never summarised as success | A test where a tool fails and the reply says so | coder, tester |

## Stage 3: verify (G3 to G4)

| Do | Evidence | Owner |
|---|---|---|
| **Run the real product**, drive it as a user would, and measure the done-criteria | Screenshots, timings, per-process CPU and memory, error log | tester |
| Reproduce each reported complaint at the exact place it appeared, before and after | Before and after measurements | tester |
| Blind review of the finished result against the definition of done | `blind-reviewer` verdict | qurn |
| Security pass: untrusted input paths, secrets, supply chain | Findings with fixes | security |
| Accuracy checks on anything fuzzy (speech, search, summarisation) using the operator's **own real examples** | A pass rate on a fixed set | tester |

**Not done means not done:** unit tests passing while the real app was never opened is verdict `fix`, with "not yet seen in the running app" stated plainly.

## Stage 4: launch (G5)

| Do | Evidence | Owner |
|---|---|---|
| Ship checklist: phone layout, first load, cold URL, public-safe brand, repo hygiene, analytics, accessibility date, consent | Checked list with evidence | web, tester, coder, security |
| Operator approval for anything public, paid or irreversible | Ledger line | qurn |
| For an open-source repository: the 16-item launch audit (`open-source-launch-reference.md`) | PASS / FAIL table with evidence | qurn, coder, security |
| First customers by hand; do not automate a channel before it works by hand | Names and conversations | operator, research |

## Stage 5: learn

| Do | Evidence | Owner |
|---|---|---|
| Measure what people actually do: retention, source by source, real purchases | Cohorts, not opinions | research |
| PMF survey only with enough responses; read the "very disappointed" share with retention | Counts and the survey sample | research |
| Experiments only when traffic can power them; pre-register metric, size and stop rule | Power calculation | research |
| Retro: lessons that would change a future decision; update the playbook | `lessons` output, reviewed | qurn |

## Do not do yet

A/B tests without the traffic to power them; llms.txt; microservices before a team boundary needs them; scaling spend before retention flattens; adding a cloud dependency to a product whose principle is local; changing something that already worked to fix something else without a baseline to compare against; polishing visuals before the core path works end to end.

## When a complaint repeats

Same complaint twice: stop adjusting, study the references, rebuild the weak part, and show the evidence (circuit breaker). A change the operator calls worse is **reverted first**, then understood, because the baseline they liked is a KEEP item.
