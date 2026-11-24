# Qurn V2

A second, self-contained copy of the specialist skills with the Pro lead. The folder above this one (`../skills`) stays V1 and is untouched by anything here.

## What V2 adds

- **Qurn lead:** assumptions gate before any code, run modes (Lite, Standard, Pro), quality gates, change control, a hash-chained proof ledger (`skills/qurn/scripts/qurn-ledger.mjs`), blind review, an operator profile, a pre-mortem and lessons loop, and a client delivery report.
- **Security:** skill and context-file supply-chain review with a scanner and a hash lock (`skills/security/scripts/skill-scan.mjs`).
- **Web:** four extra 3D references (pipeline and AI assets, formats and viewers and iOS, lighting and scroll and fallbacks).
- **Research:** a domain atlas and briefs for startups (validation, go-to-market, money and legal basics), complex-systems design, reliability and delivery, product and experiments, and building with LLMs. Each fact is tagged by how well it was sourced, and open items are listed.
- **Evals:** `evals/qurn` and `scripts/qurn-eval.mjs` compare a run with Qurn against a run without it on fixed prompts.

## Use it

Install from this folder exactly as the repo root does (`./install.sh claude`, or `install.ps1` on Windows): the install scripts here copy `v2/skills`. Rebuild the single-file prompts with `node scripts/build-flatten.mjs`, check them with `--check`, run the tests with `node --test $(find . -name '*.test.mjs')`.

## Status

Tested: the scripts (unit tests). Not yet tested: the end-to-end Qurn workflow on a real project, and the with/without eval (no results exist; the harness is ready).
