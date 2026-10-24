# Security: how API keys actually leak, and how to catch it

Checked against primary sources (Vite/Next.js/Expo docs, GitHub docs, vendor key-format references) 2026-10-06. Extends `security-checklist.md`/`security-systems.md` — those already require "no secret in client JS" and run `gitleaks` at the pre-launch gate; this file is the concrete mechanics of *how* a key ends up there anyway and how to find one that already did, so the existing checklist item can actually be verified rather than taken on faith.

## The #1 real-world leak mechanism: a bundler's "public" env prefix
Every modern frontend bundler reserves an env-var prefix that gets **statically inlined into the shipped client bundle at build time** — this is a documented, intentional feature for genuinely public values (an API base URL, a publishable/public key), not a bug, but it is the single most common way a real secret ends up public, because the variable "looks" like ordinary server-side config right up until it's prefixed.

| Framework | Public-prefix (gets bundled, world-readable) | Confirmed via |
|---|---|---|
| Vite | `VITE_*` | vite.dev/guide/env-and-mode |
| Next.js | `NEXT_PUBLIC_*` | Next.js docs |
| Create React App | `REACT_APP_*` | CRA docs |
| Expo | `EXPO_PUBLIC_*` | Expo docs |

**The exact failure mode to check for:** a developer has a real secret (an API token, a database URL, a private key) sitting in `.env`, needs the frontend to read *some* config, and reaches for the matching public prefix out of habit or copy-paste — `VITE_OPENAI_API_KEY`, `NEXT_PUBLIC_STRIPE_SECRET_KEY` — without registering that the prefix is the thing that makes it public. **Minification, base64-encoding the value, or disabling source maps do none of the work people assume** — the value is inlined as a plain string literal in the shipped JS; any of these is cosmetic, not protection. Grep the actual **built output** (`dist/`, `build/`, `.next/`, not just source) for the names of every secret the project holds — `security-systems.md`'s existing "check `dist`/`build` output, not just source" line is exactly this check; this file adds *why* it happens and the exact prefixes to search for across all four frameworks above, not just the one the project happens to use.

**The fix is a hard rule, not a judgment call:** real secrets (API tokens, DB credentials, private keys, webhook signing secrets) never get a public prefix, full stop — they live in server-only env vars (no prefix, or a framework's server-only convention) and are reached through a backend route/serverless function the frontend calls, never read directly by client code. Only genuinely public values (a base URL, a `pk_live_`/publishable key meant for client use, a feature flag) belong behind the public prefix.

## Concrete key-format patterns for an actual sweep (confirmed current formats)
Use these as a manual grep (or feed them into a gitleaks custom rule) against both source **and built output** when auditing a project, in addition to running `gitleaks detect` generically:

| Provider | Pattern | Note |
|---|---|---|
| AWS Access Key ID | `AKIA[0-9A-Z]{16}` (long-term) / `ASIA[0-9A-Z]{16}` (session) | Secret key itself has no fixed prefix — harder to grep, rely on gitleaks/entropy detection for it |
| GitHub | `ghp_[A-Za-z0-9]{36}` (PAT), `github_pat_[A-Za-z0-9_]{82}` (fine-grained), `gho_`/`ghs_`/`ghu_`/`ghr_[A-Za-z0-9]{36}` (OAuth/app/user/refresh) | |
| Stripe | `sk_live_[A-Za-z0-9]{24,}` (secret, live), `sk_test_...` (secret, test — still worth rotating if leaked, just lower severity), `pk_live_`/`pk_test_...` (publishable — these are *meant* to be public, don't flag as a leak) | Don't confuse `sk_` (secret, never client-side) with `pk_` (publishable, fine client-side) — this distinction is the whole ballgame for Stripe specifically |
| OpenAI | `sk-proj-[A-Za-z0-9\-_]{50,}` or `sk-[A-Za-z0-9]{48}` | |
| Anthropic | `sk-ant-[A-Za-z0-9\-_]{90,}` | |
**Practical use:** this table is for a fast manual confirmation during a review ("I see a string starting `sk_live_` in the bundle — that's a live Stripe secret key, not a publishable one, this is a blocking finding") — it does not replace `gitleaks`/`trufflehog`, which cover hundreds of providers and also catch high-entropy strings with no fixed prefix (raw AWS secret keys, generic bearer tokens, JWT signing secrets).

## GitHub's own push protection — a second, earlier gate worth enabling by name
GitHub Secret Scanning **Push Protection** scans the content of every `git push` (including commits made via the GitHub UI and file uploads) for known secret patterns *before* the push is accepted, rather than detecting a secret only after it's already in the repository (plain secret scanning, which runs after the fact). On a match it blocks the push and shows the developer the file, line, and secret type; the developer must either remove the secret, mark it a false positive (test credential), or explicitly request a bypass — and every bypass decision is logged and auditable, so it's not a silent escape hatch. **This is a strictly earlier gate than the pre-launch `gitleaks detect` sweep already in `security-systems.md`'s pre-launch gate** — enable it at the repository/organization level where the project hosts on GitHub, rather than relying solely on the end-of-build sweep to catch what a push-time gate would have stopped immediately.

## A leaked secret is not fixed by deleting the file — git history remembers
Deleting a file with the secret in a new commit, or even `git rm`-ing it, **does not remove it from history** — anyone with clone access can still find it in an old commit. The two tools that actually scrub history: **`git-filter-repo`** (the tool the Git project itself now recommends — `git filter-branch`'s own docs carry a prominent warning to use `filter-repo` instead) for most cases, or **BFG Repo-Cleaner** (faster specifically on very large repositories, requires a JVM) when repo size makes that the deciding factor. **The order of operations matters and is non-negotiable:**
1. **Rotate the credential at the provider first** — assume it's already compromised the moment it's confirmed in history; scrubbing git history does nothing about a copy an attacker already scraped.
2. Scrub history with `git-filter-repo`/BFG.
3. Force-push the rewritten history.
4. **Every other clone of the repo must re-sync from the rewritten history, not pull-and-push** — a collaborator who does an ordinary `git pull && git push` on their stale local clone will silently reintroduce the scrubbed secret right back into the remote. Communicate this explicitly to the whole team, don't just rewrite and assume it's handled.

## Where to read more (name, do not paste)
vite.dev/guide/env-and-mode, Next.js's own environment-variables docs, and Expo's env-vars docs (for the exact current public-prefix behavior, re-verify per framework before citing a version-specific detail); docs.github.com/code-security/secret-scanning (push protection, current behavior); github.com/newren/git-filter-repo and the BFG Repo-Cleaner docs (history-rewrite mechanics); gitleaks' own default ruleset (github.com/gitleaks/gitleaks) for the authoritative, maintained version of the key-format table above — this file's table is a fast-reference subset, gitleaks' own rules are the thing actually run in the pre-launch gate.
