# Open-source repo launch: a 16-item audit

Added at the operator's request (2026-11-07) from a checklist they supplied; written here in Qurn's own words. Use it when asked to prepare a repository for public attention, or at the launch gate (G5) of anything published as open source. Facts about GitHub limits are from GitHub's documentation as the checklist cites them [practice; re-check the docs before quoting a number].

## How to run the audit

1. For each item, report **PASS, FAIL or NOT APPLICABLE**, the file or setting that proves it, and the **smallest fix**. Flag anything unsure instead of guessing.
2. **Change nothing until the operator approves.** Everything on this list is public-facing, and several fixes are hard to reverse (history rewrites, force-pushes, releases, posts), so management rule 4 applies.
3. Check against the repo and GitHub itself (`gh repo view`, `gh label list`, `gh release list`, `gh run list`, `gh api repos/<owner>/<repo>`), not against memory. Compare README claims with what the repo contains (counts of commands, supported clients, badges that say something untrue).
4. Order fixes by impact for effort: first screen of the README, license, install, CI green, then discoverability, then community files, then launch posts.

## The 16 items

| # | Item | PASS when | Smallest fix |
|---|---|---|---|
| 1 | **Demo at the top of the README** | A 5 to 10 second screen recording of the main command appears before any prose | Record the one command that shows the value; keep the file small; link it, do not block the page on a large file |
| 2 | **One-line description** | Plain words, no jargon, above the demo: what it does and for whom; the repo's "About" text says the same, and matches the README's numbers | Rewrite to "X for Y that does Z"; fix mismatched counts |
| 3 | **One-command install** | A single copy-paste command works from a clean machine | Add the command under the description; test it in a clean folder |
| 4 | **Live demo** | A hosted page, playground or short video so people can try or see it without installing; the link works | Link it; check it returns a success status |
| 5 | **License** | A license file exists (without one, default copyright applies and nobody may legally reuse the code); MIT or Apache-2.0 are the common permissive choices | Add the file; state the license in the README |
| 6 | **Topics** | Up to 20 topics set so the repo appears in topic pages and search | Set relevant topics (the tool, the file format, the clients it supports) |
| 7 | **Social preview image** | A custom image set in repository settings (about 1280x640, PNG or JPG under 1 MB is the documented recommendation) | Make one card; the setting is manual in the web UI |
| 8 | **CI is green** | A passing check on the default branch; a badge if wanted; a red build tells visitors it is broken | Add a workflow that runs the tests; fix failures before launch |
| 9 | **No secrets in history** | No keys in any commit, push protection and secret scanning on | **Rotate the key first**, then scrub history (`git filter-repo`) or start a fresh repo; enable push protection |
| 10 | **Good first issues** | 3 to 5 small, clearly scoped issues carry the `good first issue` label | Write them with the file to change and how to verify |
| 11 | **Contributing guide** | `CONTRIBUTING.md`: how to run it locally, run the tests, open a pull request | Write it from the commands that actually work |
| 12 | **Issue templates** | Bug report and feature request templates under `.github/ISSUE_TEMPLATE` so reports arrive with the details needed | Add two templates asking for version, steps and expected result |
| 13 | **Discussions** | Enabled, so questions go there and bugs stay in Issues | Turn on in settings |
| 14 | **Tagged release with changelog** | At least one tagged version with notes; people trust things that have versions | Tag, write notes, publish the release |
| 15 | **Show HN (or equivalent) draft** | A drafted post: plain title, what it is, why it exists, what to try, honest limits | Draft only; **posting is the operator's decision** |
| 16 | **Answer-in-a-day plan** | Someone owns issues and pull requests and replies within a day during launch week | Set notifications; write 3 canned replies; decide who is on duty |

## Rules that go with it

- **Do not overclaim.** Badges, counts and feature lists must match the repo today. A README that says "ten commands" while the About text says "eight skills" is a trust problem.
- **Do not publish what is not meant to be public.** Check unpushed folders, private notes and the project's own ignore rules before any push; keep a separate private copy for work in progress.
- **History rewrites and force-pushes** need explicit operator approval and a verified backup first; old commits can stay reachable by ID until the host collects garbage, and existing clones keep them.
- **Outward actions (posting, tagging a release, enabling features, pushing) are the operator's call**; prepare them, do not perform them unasked.
- **Launch week is a support week.** Plan to be answering, fixing and thanking people, not shipping new features.

## Report format

A table (item, PASS / FAIL / NOT APPLICABLE, evidence, smallest fix), then a short ordered list of the three fixes with the best effect for effort, then the questions that need the operator.
