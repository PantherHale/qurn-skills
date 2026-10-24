# Security: per-system checks

Origin: research 2026-09-23, sources in `specialist-skills/research/security.md`. Extends `security-checklist.md` -- not repeated here.

## Detect which systems are present

- Authz/RLS: `supabase/migrations`, `CREATE POLICY`, `firestore.rules`, a `tenant_id` column.
- API: `express`/`fastify`/`hono`/`nestjs`/tRPC routes, OpenAPI spec.
- Database: `prisma`/`drizzle`/`sequelize`/`knex`/`pg`/`mongodb`.
- Dependencies: any lockfile (`package-lock.json`, `poetry.lock`, `Cargo.lock`, `go.sum`).
- Browser boundary: served HTML/SPA, `helmet`, CORS config.
- Electron: `electron` in `package.json`, `BrowserWindow`.
- Mobile: `ios/`, `android/`, `.xcodeproj`, `build.gradle`, Expo/RN/Flutter files.
- Payments: `stripe`/`paddle`/`braintree`, `/webhook` route.
- AI/LLM: OpenAI/Anthropic SDK, `langchain`, `pinecone`/`pgvector`, a tool-calling agent.
- Logging/privacy: `winston`/`pino`, analytics SDK, a form collecting personal data.
- Infra/deploy: `Dockerfile`, Terraform/CDK, CI YAML, host config.
- Rate limiting: any public endpoint, esp. search, AI-gen, export.

## Per-system checklist

**Authz/RLS**
1. [blocker] RLS/rules enabled on every client-reachable table, not just present. `select relrowsecurity from pg_class`
2. [blocker] Policies check identity AND tenant, not identity alone; `INSERT`/`UPDATE`/`DELETE`/RPCs have `WITH CHECK`, not just `SELECT`.
3. [blocker] `SECURITY DEFINER` fns re-check tenant, or are `SECURITY INVOKER`.
4. [major] Deny test proves cross-tenant access is rejected (CI: seed 2 tenants, assert reject).

**API/input**
1. [blocker] Every ID-taking endpoint re-checks ownership server-side (BOLA); admin routes check role server-side, not just hidden UI.
2. [major] Mass-assignment guarded: `PATCH` can't set `role`/`isAdmin` unless allow-listed; size/pagination/GraphQL-depth limits set. `semgrep --config p/owasp-top-ten`

**Database**
1. [blocker] No string-concatenated SQL; parameterized/ORM only. `semgrep` SQLi rules
2. [major] App DB role is least-privilege, not owner/superuser; backups exist, encrypted, restore-tested once.
3. [blocker] Regulated columns (SSN/card/health) encrypted, not plaintext.

**Browser boundary**
1. [major] CSP: nonce/hash + `strict-dynamic`; no `unsafe-inline`/wildcard. `curl -I`
2. [blocker] CORS on authed routes: explicit origins, never `*` with `credentials: true`.
3. [major] CSRF guard on state-changing session-cookie requests; `HSTS`/`nosniff` headers set.

**Dependencies**
1. [blocker] No known-critical/high CVE reachable. `osv-scanner -r .`
2. [major] Lockfile committed, `npm ci` (not install) in CI; CI actions pinned to a SHA, not `@main`.

**Electron/desktop**
1. [blocker] `contextIsolation: true`, `nodeIntegration: false` for untrusted content, `webSecurity` never disabled. `npx electronegativity -i .`
2. [blocker] Every IPC handler validates sender; preload exposes narrow `contextBridge` fns only; `shell.openExternal` never called with unvalidated input.
3. [major] Sandbox on, navigation restricted, Electron version current.

**Mobile**
1. [blocker] TLS/cert validation not disabled; no secrets in the compiled bundle. MobSF scan
2. [major] Sensitive data in Keychain/Keystore, not plaintext prefs.

**Payments/webhooks**
1. [blocker] Webhook signature verified against raw body via provider SDK, not hand-rolled HMAC; entitlement changes only via verified webhook/server call, never a client flag.
2. [major] Handler idempotent by event ID (test: tampered sig + dup event both rejected).
3. [blocker] No card data touches app servers/logs unless PCI-scoped.

**AI/LLM**
1. [blocker] Untrusted content reaching the model is never treated as instructions (prompt injection).
2. [blocker] Model output is untrusted downstream: no `eval`, no unescaped HTML/SQL/shell insertion.
3. [blocker] Agent tools scoped to minimum needed; destructive actions need confirmation; spend caps and per-user rate limits set.

**Logging/privacy**
1. [blocker] No secrets/tokens/full PII ever logged, even at debug. grep for `password|token|secret|card|ssn`
2. [major] Privacy policy names real processors matching actual deps/env vendors; failed-auth logs are alerted on, not just collected.
3. [major] Data export and deletion both work for a user's own data.

**Infra/deploy**
1. [major] TLS/HSTS everywhere; least-privilege CI/CD and runtime IAM.
2. [blocker] Secrets injected at deploy from a secret manager, never baked into image/IaC.

**Rate limiting/abuse**
1. [blocker] Limits enforced server-side in a shared store (Redis/DB), never client-side/in-process only.
2. [major] Expensive endpoints (search, export, AI-gen) have their own limit, separate from the general API limit; multi-account loopholes (`+tag`/dot-trick emails) considered wherever one account = one allowance.

## Pre-launch gate (ordered)

1. Secrets sweep: `gitleaks detect --source . --log-opts="--all"` clean or triaged.
2. Dependency sweep: `osv-scanner -r .` clean of high/critical.
3. Authz/RLS: enabled + tenant-aware, deny tests pass, no service-role key client-side.
4. Input/output: no string-concat SQL, upload controls, LLM injection/tool-scope reviewed.
5. Browser boundary: CSP, CORS, CSRF, cookies.
6. Platform: Electron checklist / Mobile MASVS as applicable.
7. Payments/webhooks: signatures verified, idempotent, no client-set entitlement.
8. Rate limiting: server-side, shared store, expensive endpoints covered.
9. Logging/privacy: no secrets in logs, alerts wired, export/delete work.
10. Infra: TLS/HSTS, least-privilege IAM, tested backups; every [blocker] passes or has a dated, owner-attributed exception.

## Launch lessons

- Write deny tests, not just allow tests: a passing UI hides an RLS gap one curl exposes. One cross-tenant read blocks the release.
- Any env var read by client/browser bundle code is public once built -- check `dist`/`build` output, not just source.
- A proxy hiding a third-party key isn't done until it has its own user auth and its own rate limit -- unauthenticated, it just moves the target from "steal the key" to "call the proxy free."

## Rationalizations

| Excuse | Reality |
|---|---|
| "Anon key + RLS handles it." | RLS with `USING (true)` equals no RLS. Check the policy body, not that RLS is "on." |
| "CORS blocks unauthorized calls." | CORS is browser-enforced; curl/Postman bypass it. Auth must be server-side. |
| "The UI never sends that request." | An attacker doesn't use your UI. Any request your API accepts is in scope. |
| "It's an env var, not hardcoded." | Client-bundled env vars compile into shipped JS -- as public as a hardcoded string. |
