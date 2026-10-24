# Coder: quality floor additions

Checked 2026-10-08 against pages read that day: Prisma's query-optimisation docs (N+1), Fowler's "Feature Toggles", semver.org, Conventional Commits 1.0.0, Zod's basics page, The Twelve-Factor App (Logs) and Claude Code's best-practices guide. Use with `coder-reference.md`, `coder-efficiency.md` and `performance-checklist.md`; this file covers what those did not name.

## N+1 queries
Prisma's definition: the problem "occurs when looping through query results and performing one additional query per result." Its fixes, in order of effort: a nested read (`include`) runs two queries instead of one per row; an `in` filter over the collected ids fetches all related rows at once; a join strategy (`relationLoadStrategy: "join"`) runs one query; for GraphQL, DataLoader-style batching collects calls made in the same tick. Detect it by logging queries and counting them against rows returned. Review rule: a database call inside a loop or a `.map` is a finding until proven bounded.

## Feature toggles (Fowler, after Hodgson)
Four kinds, by lifetime and how often the decision changes: **release** toggles (days to weeks, usually static; they let unfinished work ship as latent code so trunk-based development works), **experiment** toggles (hours to weeks, decided per request so a user always sees the same variant), **ops** toggles (mostly transient; a few kill switches stay), **permissioning** toggles (years, per user group).
- Keep the decision point apart from the decision logic: one decision function, not toggle checks scattered through the code. For a long-lived toggle use a strategy object, not a growing if/else.
- Release toggles belong in source-controlled static configuration so they travel through the delivery pipeline; ops toggles may need dynamic configuration.
- Toggles are inventory with a carrying cost. Give each an owner and an expiry date or a removal task, and consider a cap on how many may exist at once.
- Testing: you need not test every combination. Test the intended production configuration and the fallback with toggles off.

## Safe schema and interface changes
Expand, migrate, contract, as three separate changes (see `architect-evolution-reference.md`). A migration that drops or renames a column in the same change that stops using it is a finding.

## Versions and commit messages
- **SemVer:** MAJOR for incompatible API changes, MINOR for backward-compatible functionality, PATCH for backward-compatible fixes. `0.y.z` means anything may change at any time. A released version is immutable: any change is a new version. To retire something, announce the deprecation in a minor release first and remove it in a later major.
- **Conventional Commits 1.0.0:** `<type>[optional scope]: <description>`, then an optional body and footers. `feat` maps to MINOR and `fix` to PATCH; a breaking change is marked with `!` before the colon or a `BREAKING CHANGE:` footer and maps to MAJOR whatever the type. The point is mechanical: generated changelogs and automatic version bumps.

## Validate untrusted data at the boundary (Zod)
`schema.parse(input)` returns a typed deep clone or throws a `ZodError`; `schema.safeParse(input)` returns `{ success, data | error }` and needs no try/catch, which is the better default at an API or form boundary. Derive the type from the schema with `z.infer<typeof schema>` so type and validator cannot drift; when `.transform()` changes the shape use `z.input` and `z.output`. Schemas with async refinements need `parseAsync` or `safeParseAsync`.

## Logs
The Twelve-Factor rule: treat logs as event streams. The app "never concerns itself with routing or storage of its output stream": it writes unbuffered to stdout and the environment captures and routes it. A service that opens and rotates its own log files is a finding. (Practice, not in that text: emit one structured JSON record per event with a level and a request id, so the stream is searchable.)

## Working with a coding agent (Claude Code's own guidance, additions only)
- After TWO failed corrections of the same problem, clear the session and write a better first prompt that includes what you learned; a clean session with a better prompt beats a long one carrying failed attempts.
- Advice versus guarantee: CLAUDE.md is advisory, hooks are deterministic. If something must happen every time (lint after each edit, block writes to a folder), make it a hook, and if the agent already does something correctly without an instruction, delete the instruction. A Stop hook that runs the check blocks the turn from ending until it passes.
- For a larger feature, have the agent interview you and write a spec, then execute it in a fresh session. A useful spec is self-contained: it names the files and interfaces, says what is out of scope, and ends with an end-to-end verification step.
- Give a reviewer in a fresh context only the diff and the criteria, and tell it to flag gaps that affect correctness or the stated requirements; otherwise it reports something regardless and drives over-engineering.
