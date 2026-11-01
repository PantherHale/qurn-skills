---
name: status
description: "Reads the ledger and project state and gives a plain, no-jargon summary of what's done and what's left. Use when asked for the status, what's left, where things stand, or a progress check. Do not use to do new work, give a verdict, or consult a specialist -- it only reports what already happened."
argument-hint: "[path to project, optional]"
allowed-tools: Read, Grep, Glob, Bash
metadata:
  origin: specialist-skills
  last-reviewed: 2026-11-01
---

# Status

A pure reporting command. It never builds, fixes, or consults a specialist -- it only reads what's already there and explains it in plain language.

**Self-contained.** Everything this skill needs is in this file; it requires no other skill, plugin or MCP server.

## When to activate

- When asked "what's the status", "what's left", "where are we", "what's done so far", or similar, about work `qurn` or a specialist has been doing.
- Do not use to start, continue, or judge any work -- that's `qurn` or the specific specialist's job. If there's nothing to report on yet, say so and suggest running `/qurn` instead.

## As a command

Run it as `/status [path]` in Claude Code or Gemini CLI, or `/prompts:status [path]` in Codex. With no path, use the current project.

## Instructions

1. Look for `docs/design/QURN_LEDGER.md` in the project. If present, read it -- it's the authoritative append-only record of every specialist consulted and every verdict reached for the current or most recent `qurn` run.
2. If there's no ledger, look for other signs of in-progress work: recent git status/diff (uncommitted changes), recent commit messages, or an open plan/task list the operator mentioned. Say plainly if you found nothing to report on.
3. Translate what you found into plain English, in this order:
   - **Done** -- what's finished and passed, named plainly (e.g. "the security review passed, no open issues").
   - **Blocked** -- what's actively stuck and why, one sentence each, no jargon (e.g. "the web build is blocked: the contact form still submits without validating email format").
   - **Not started** -- what hasn't been touched yet, if the ledger or plan implies more specialists or steps are still expected.
   - **Next step** -- the one thing that should happen next, in a single sentence.
4. Keep the whole report short -- a handful of sentences or a short bullet list, not a restatement of the ledger's raw lines. If the operator asks a follow-up ("why is X blocked?"), answer from what you already read rather than re-scanning the project.
5. Never invent progress that isn't backed by the ledger, a commit, or a visible file change. If you're not sure something is actually done, say it's unconfirmed rather than marking it done.

## Report format

```
STATUS
Done: <plain sentence(s), or "nothing yet">
Blocked: <plain sentence(s), or "nothing blocked">
Not started: <plain sentence(s), or "nothing pending">
Next: <one sentence>
```
