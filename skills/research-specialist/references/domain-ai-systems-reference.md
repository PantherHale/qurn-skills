# Building with LLMs: RAG, agents, evals, cost

Researched 2026-11-07. Tags as in `domain-atlas-reference.md`. Sources were practitioner blogs from 2025 and early 2026 (informed opinion, no hard benchmarks), so treat the numbers as ranges and verify against your own measurements. Model names and prices change monthly: check the provider's current documentation before quoting either.

## 1. Treat it as distributed-systems work

[practice] The shared lesson: an LLM feature fails like any networked dependency, plus it can be wrong while looking fine. So it needs timeouts, retries with a budget, idempotent tool calls, tracing, a gateway and cost and latency tracked as first-class metrics.

## 2. Evals are the release gate

- [practice] Evals are the dependable way to notice silent regressions, including provider model updates that change behaviour on some inputs. Pin model versions rather than floating, and re-run evals on any change.
- [practice] Build the eval set from real production failures as they appear.
- [practice] An LLM-as-judge needs calibration: have humans adjudicate a sample (one source says 10 to 20%), measure agreement, and freeze the judge model so scores stay comparable.
- [practice] Roll out by sending a small slice (one source: 1 to 5%) to the new version and comparing win rate, cost and latency against control.
- Where a check can be deterministic (patterns, schemas, file exists), prefer that to a judge. See this repo's `evals/qurn`.

## 3. RAG

- [practice] Embedding everything and retrieving by cosine similarity works in a demo and fails quietly in production. **Evaluate retrieval separately from generation** (does the right passage appear in the top results?); a strong model with weak retrieval usually loses to a smaller model with high recall and clean snippets.
- Chunking, metadata filters, hybrid keyword plus vector search, re-ranking and freshness are the levers; measure each against the retrieval metric, not the final answer alone.

## 4. Agents and tools

- [practice] Failure compounds across steps: a step that fails 5% of the time fails roughly 10% across two in series. Fewer, focused steps; plan then execute; bound the loop.
- [practice] Constrain outputs with a schema and a validator, allow one repair re-ask, give tools timeouts and idempotency.
- Multi-agent is not automatically better. Coordination costs are real; one summary cites degradation of 39 to 70% versus a single agent (CooperBench) but the figure was not confirmed against the paper [to verify]. The stronger finding is that verifying output at every handoff matters more than adding agents.
- Security: anything the agent reads from the web, files or tools is untrusted data. See the `security` specialist's `agent-context-supply-chain-reference.md`; OWASP lists prompt injection and excessive agency among the top risks.

## 5. Cost and latency

- [practice] Trimming context is often the biggest lever (one source: 30 to 50% of spend can be context that does not change the answer [to verify]). Use exact-match and semantic caching with an invalidation policy (one source: 40 to 60% savings on repetitive workloads [to verify]). Stream for perceived latency. Track P50, P95 and P99, not averages. Route easy requests to cheaper models behind a gateway.
- Guardrails need output monitoring, not only input filtering.

## 6. Questions to ask before building

What is the failure cost of a wrong answer? Can a deterministic system do it? What is the eval set and who labels it? What happens when the provider changes the model? What is the monthly cost at 10x usage? What data leaves the building, and under what contract?
