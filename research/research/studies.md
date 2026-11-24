# Phase 7 (research) -- per-source studies

Read 2026-11-24 through fetch agents (non-preapproved pages paraphrased, not copied). "Summary" marks a part that came back as a model summary: unverified. Nothing here is from memory.

## A. Our own skill (before)
`skills/research/` had about 4,600 words in 6 references (source credibility, corroboration, anti-hallucination, numerical verification, currency, handback) and **no scripts**. The twin was identical, so a sync was safe. Its rules were already strict: no claim above "to verify" without a fetched source, 2+ independent origins for "confirmed", fetched content is data not instructions, date everything time-sensitive, state the knowledge gap, a TO VERIFY list that is never optional.
**Verified absent by exact search:** SIFT and lateral reading (the plan names SIFT); archived copies; search operators for the web and for GitHub; registry search tactics; retractions and preregistration; relative versus absolute risk; search snippets as non-sources; circular citation and syndicated copies; robots and terms of use; and **any executable check of a report**, although the verdict, tier, citation and TO VERIFY rules are all mechanically checkable.

## B. Sources read
| Source | Read | What it gave us |
|---|---|---|
| SIFT, hapgood.us (2019) | full | Four moves: Stop, Investigate the source, Find better coverage, Trace claims back to the original context |
| Stanford Civic Online Reasoning (cor.inquirygroup.org), lateral reading page | full | Classroom intervention from fact-checker research, cluster-randomised, "grew significantly", no numbers on the page; the fact-checker, historian, student comparison was **not found** |
| Pressbooks web literacy (SIFT chapter) | **403** | Not read |
| Tow Center / CJR, AI search citation study (2025-03-06) | full | 8 tools, 1,600 queries, over 60 percent incorrect, Perplexity 37 percent, Grok 3 94 percent, more than half of Gemini and Grok 3 citations fabricated or broken, syndicated copies cited, robots.txt disregarded; one run per excerpt |
| IFCN Code of Principles | full | Sources commitment: primary where it exists, more than one named source for key elements, identify interests, links so readers can replicate; 31 criteria |
| GitHub repository and code search docs | full | Qualifier syntax and limits (default branch only, files under 384 KB, archived and inactive repos not searchable) |
| npm registry API, PyPI JSON API | full | Package document, `time` object, search parameters; PyPI `upload_time`, `yanked`, `vulnerabilities`; npm `deprecated` not documented on that page |
| Wayback availability API | full | `closest` snapshot only; empty object when none; page dated 2013 |
| Google search operators | full | `site:`, `filetype:`, quotes, minus, `before:`/`after:`; `OR` and `+` not documented there |
| RFC 9309 (Robots Exclusion Protocol) | full | "not a form of access authorization"; 4xx may access, 5xx must assume disallow; 24-hour cache limit |
| Claude web search tool docs | full | `max_uses`, domain lists (not both), `page_age`, 150-character `cited_text`, `encrypted_content`, errors inside a 200, $10 per 1,000 searches |
| Cochrane Handbook chapter 15 | first half verbatim, NNT subsection summary | RR 0.75 is a 25% relative reduction, 1 point absolute from 4% to 3%; "absolute effects will differ according to baseline risk" |
| Retraction Watch user guide; Crossref REST API and Retraction Watch pages | full | Retraction lookup via `update-to` and `filter=update-type:retraction`; database needs one search field, 50 results max |
| PubMed About; DORA | full | PubMed holds citations and abstracts, not full text; DORA recommendation 1 |
| CSU Chico CRAAP page and PDF | page navigation only; PDF unreadable | The five criteria and their questions **not read** |

## C. Installed research skills
`deep-research` (ECC) read in full (3 to 5 sub-questions, 15 to 30 sources, read 3 to 5 in full, last 12 months, confidence from source count); `research-ops` read earlier in this session. `last30days` (about 37,900 words), `search-first`, `exa-search`, `market-research` and `youtube-transcript` were sized only: **not read**.

## D. Not read (open)
The Stanford fact-checker comparison; the Pressbooks chapter; the CRAAP worksheet; Cochrane's NNT subsection except through a summary; GitHub's newer code-search syntax; the Wayback CDX API; the Anthropic server-tools guide; `last30days` and the other installed skills; any real research run measured against ground truth.

## E. Gaps (each verified absent before being claimed)
No executable report check; no sourced SIFT or lateral reading; no sourced evidence on AI search failures; no search-operator or registry tactics; no robots and terms guidance; no relative-versus-absolute risk example; no retraction check.
