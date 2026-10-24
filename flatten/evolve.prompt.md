# Weekly evolve

The specialists are advisers whose knowledge is fixed text. This skill is how they keep up: you research the past week in each specialist's field and write what changed into notes that are added to that specialist's next brief. The notes are hints, not truth: every claim carries a source and a date, and the current code and the operator's latest word always win.

**Self-contained.** Everything this skill needs is in its own `references/` and `scripts/` folders; it requires no other skill, plugin or MCP server. Where the instructions mention using an installed skill, first check which skills this environment actually has (the session's skill list, or the agent's skills folder) and use one only when it is installed and fits; otherwise do the step directly from these instructions and references.

**Brief the user as you go.** Before reading, say in one plain sentence what you are about to check or plan. When you reply, start with a short BRIEF (two or three plain sentences, no jargon) saying what you found and what you are directing or making next, then the full verdict below it.

## When to activate

- When the operator asks you to evolve, refresh, update yourself or the team, or asks what changed this week.
- On a weekly schedule when a routine runs it. Not for a question that one search answers.

## As a command

Run it as `/evolve [topic]` in Claude Code or Gemini CLI, or `/prompts:evolve [topic]` in Codex. The text after the command is an optional topic to look at first.

## Instructions

WEEKLY REFRESH (<today, YYYY-MM-DD>). Research what happened in the PAST 7 DAYS and use it to make the team better. Focus first on: <optional topic from the request>.

Use your web search and fetch tools. Prefer primary sources (vendor posts, release notes, advisories, papers) over summaries; ignore rumours; every claim needs a source URL and its date, and anything older than 14 days is background, not news.

RESEARCH EXTENSIVELY, not just headlines (operator, 2026-10-18: specialists keep picking generic/default choices instead of researched ones). For each field below, do not stop at "X trend is happening" -- find at least one REAL, concrete implementation (an open-source repo, a shipped product, a named prompt/template library, an official example) and extract its actual technique: exact values, exact mechanism, not a summary of a summary. A finding with no concrete technique to copy from is not finished research.

MISTAKE RETRO (do this every run, not just when prompted): read every knowledge file under src/specialists/knowledge/*.md for lines starting with dated "Operator, 20..." feedback entries. If two or more entries across any files describe the SAME category of mistake (e.g. multiple entries about a generic/templated default being shipped before being corrected, or about a fix being claimed without live verification), that is a REPEATED mistake, not a one-off: name it explicitly in the relevant coworker's Latest note as a "REPEATED:" line with a concrete, checkable rule to stop it (e.g. a specific self-check to run BEFORE shipping a default, not after a complaint), and say which files already have a dated entry for it so the next run does not just restate the same note.

For each coworker, find what changed in its field this week:
- security: new vulnerabilities, exploited packages and supply-chain attacks, framework security advisories, prompt-injection and agent-security findings, new compliance or privacy rules
- web-designer: design and front-end trends that actually shipped, new CSS and browser features, motion and 3D techniques, new component libraries, accessibility changes
- architect: architecture and planning practice, new frameworks and breaking releases, how teams run AI agents in production, reliability and cost lessons
- coder: language and runtime releases, tooling and package changes, performance findings, new coding-agent capabilities and pitfalls
- test-board: testing tools and releases, flaky-test and CI findings, browser-testing and accessibility-testing changes
- delegator: multi-agent and coworker products and patterns (OpenAI Dots, Grok Bot, Meta Muse and their successors), orchestration lessons, parallel-work pitfalls

Then write, into the vault at <your vault folder>:

1. Research/Weekly <today, YYYY-MM-DD>.md: a short summary of the week for the operator, grouped by field, each item with its source and date, ending with "What I changed in the team" (one line per coworker note updated) and a "REPEATED MISTAKES" section (empty if none found).

2. Research/Latest/<id>.md for each coworker id above (security, web-designer, architect, coder, test-board, delegator): OVERWRITE it. Contents: the dated findings that change what that coworker should check or say, each with its source URL, and "Do differently:" lines saying exactly how its reviews change. Any REPEATED mistake found for this coworker goes at the TOP of its note, not buried. Say nothing you cannot source. If nothing relevant changed, write that in one line.

These notes are hints, not truth: say so at the top of each, and never put code, secrets or anything from the operator's private projects in them.

Finish with one short paragraph in the chat: the three things from this week that matter most to this operator, and any LEARNED: lines for what you noticed about how he works.

## Where the notes go

The vault is a folder of plain markdown (open it in Obsidian). Write `Research/Weekly <date>.md` and one `Research/Latest/<id>.md` per specialist, overwriting the old one.
