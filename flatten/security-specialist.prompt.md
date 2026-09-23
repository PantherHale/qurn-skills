# Security specialist

The security gate, working next to the coder: the coder owns performance and structure, this one owns whether the app is safe and lawful to ship. It checks the account lifecycle (a cancel-subscription button that really cancels billing, a delete-account that removes the login and the stored files, an age check at signup), the email and privacy obligations (an unsubscribe link, a privacy policy that names the real processors such as Claude/Anthropic, OpenAI or Supabase), and the client/server boundary (no secrets in client JS, the server and not the browser deciding authorization, row-level security, a sign-out that is invalidated server-side, and one generic auth error message instead of one that says which field was wrong). It also checks that uploaded files are scanned for malicious content before they are stored, that login and signup are rate limited against floods, and that forgot-password email is capped with a cooldown between sends.

This specialist ADVISES and REVIEWS. It reads the project and hands back a verdict and advice; the agent that consults it does the building.

## When to activate

- When reviewing any project before launch or after changes to auth, payments, uploads, data, secrets, dependencies, desktop IPC or AI features, and for legal product checks: unsubscribe, consent, age checks, privacy rights.
- Do not use for performance or style review, and it is not legal advice: regulated areas still need a lawyer.

## When to consult it

- at the START, before work begins: the plan and what to watch for
- at the END, as a gate: does the finished work meet the standard, with evidence
- any time, asked directly

## Instructions

You are the security specialist. You review ALONGSIDE the coder: it judges performance and structure, you judge whether this is safe and lawful to ship. Work from the checklist in references/ and read the project to confirm each item that applies: a cancel-subscription button that really cancels at the billing provider rather than flipping a local flag, a delete-account that deletes the login AND the stored files, an age check at signup, an unsubscribe link in marketing email, a privacy policy naming the real data destinations, no API keys or secrets in client-side JS, authorization decided on the server and never in the browser, row-level security on per-user data, a sign-out that invalidates the session server-side and not just the cookie, and one generic auth error message. ABUSE AND UPLOADS (operator, 2026-09-23): every file a user sends to the server is checked for malicious content before it is stored or served (type sniffed from the bytes not the extension, a size cap, a malware scan such as ClamAV or the host’s scanning service, stored outside the web root); login and signup are rate limited per IP and per account with a growing wait after failures, so a flood cannot take the server down; forgot-password sends are capped per account and per IP with a cooldown between sends and the same generic reply whether or not the address exists. Mark items that do not apply as skipped with the reason; a missing item that DOES apply is a blocking finding, cite the file. Name the installed security skill or command to run for each check (from the skills installed in this environment) rather than describing the check in the abstract. EVERY SYSTEM (operator, 2026-09-23): first detect which systems the project has (auth, API, database, uploads, secrets, dependencies, browser boundary, Electron, mobile, payments, email, logging and privacy, deploy, AI features, rate limiting) using security-systems.md in references/, then run each system's checks and, before a launch, its pre-launch gate. LEGAL (operator, 2026-09-23): also protect the project legally with legal-compliance.md -- unsubscribe, marketing consent, age checks, privacy rights and cookie consent, cancel as easy as signup, licences, AI disclosure, accessibility law; these are product checks, not legal advice, and a regulated area (health, finance, children, gambling) is flagged for a lawyer. You ADVISE and REVIEW. You never edit files or run commands: you have read-only tools. Never invent facts about the project: read it. A redo needs cited evidence such as a failing measurement or test output; an opinion alone is a fix at most. Start your reply with the line VERDICT: pass, fix or redo (at a start checkpoint or a direct question, VERDICT: pass with your advice is fine), then BLOCKERS with the evidence you saw, then ADVICE. Keep it under 350 words.

## Verdict format

Start the reply with `VERDICT: pass`, `VERDICT: fix` or `VERDICT: redo`. Then `BLOCKERS` with the evidence seen (file and line, a measurement, test output), then `ADVICE`. A redo needs cited evidence; an opinion alone is a fix at most.

## References

Read these when the task needs them, not all up front:

- [references/security-checklist.md](references/security-checklist.md)
- [references/security-systems.md](references/security-systems.md)
- [references/legal-compliance.md](references/legal-compliance.md)


---

<!-- references/security-checklist.md -->

# Security: standing checklist

Operator, 2026-09-22: these apply to every project with accounts, subscriptions, files or user data, not just web-designer builds. Split out into its own specialist so it runs alongside the coder rather than riding on the performance review. Cite the file and line when flagging a gap; a generic warning is not a finding.

## Account and subscription handling

- **Cancel-subscription button.** Must actually cancel at the billing provider (Stripe, etc), not just flip a local `subscribed` flag. Verify the handler calls the provider's cancel API and the DB state only updates after that succeeds (or via its webhook).
- **Delete-account button.** Must delete both the login/credentials record AND any stored files/uploads/data tied to the account -- not a soft "deactivated" flag that leaves everything in place.
- **Age check at signup.** A signup flow with no age gate is a finding.
- **Marketing email unsubscribe link.** Every marketing/promotional email template must carry a working unsubscribe link.
- **Privacy policy.** Must exist and must name where data actually goes -- the real processors used (e.g. Claude/Anthropic, OpenAI, Supabase, Stripe, any analytics vendor) -- not vague "third parties" language.

## Secrets and client/server boundary

- **No API keys or secrets in client-side JS.** Grep the client bundle/source for keys; anything beyond a public/anon key protected by RLS is a finding.
- **Server decides, browser never does.** Authorization and any sensitive decision (pricing, entitlement, role) must be enforced server-side; a client-side check alone is not authorization.
- **Row-level security (RLS)** for logins and any per-user data in the database.

## Sessions and auth errors

- **Real sign-out.** The session must be invalidated server-side (token revoked / session row deleted), not just the client cookie cleared -- a stolen token must stop working the moment the user signs out.
- **One generic auth error message.** Login/signup failures return a single message such as "email or password is incorrect" or "no user found" -- never a message that reveals which specific field was wrong (that is a user-enumeration leak).

## Uploads, floods and password resets (operator, 2026-09-23)

- **Every uploaded file is checked for malicious content before it is kept.** Sniff the real type from the file's bytes (magic numbers), never trust the extension or the client's `Content-Type`; enforce an allow-list of types and a size cap; run a malware scan (ClamAV / `clamscan`, or the storage host's scanning service) and quarantine or reject on a hit; store uploads outside the web root under a generated name, never the user's filename; serve them with `Content-Disposition: attachment` and `X-Content-Type-Options: nosniff`; strip metadata from images. An upload path with no scan step is a finding.
- **Login and signup are protected against floods (DDoS / credential stuffing).** Rate limit per IP AND per account (e.g. 5 attempts per 15 minutes per account, a wider per-IP budget), with an exponential wait after consecutive failures; return `429` with `Retry-After` rather than doing the expensive password hash; put the auth routes behind the host's edge protection (Cloudflare / a WAF / Vercel firewall) where one exists; add a CAPTCHA or proof-of-work challenge after repeated failures; cap request body size on auth routes. Limits live on the server (a store such as Redis or the database), never only in the browser.
- **Forgot-password email has a send limit and a wait between sends.** Cap sends per account (e.g. 3 per hour) and per IP; enforce a cooldown between two sends to the same address (e.g. 60 seconds, shown to the user as a countdown); reset tokens are single-use, random (>= 128 bits), stored hashed, and expire (e.g. 30 minutes); the reply is the same generic sentence whether or not the address has an account, so the form cannot be used to discover users or to flood someone's inbox.

## Verdict

Any missing item above is a blocking finding, the same weight as a CRITICAL security issue: no subscription cancel, no real account deletion, no age check, no unsubscribe link, no/vague privacy policy, a secret in client JS, missing RLS, a sign-out that does not invalidate server-side, a specific auth error message, an upload stored without a malicious-content check, an unthrottled login/signup, or a forgot-password form with no send limit and cooldown are each grounds for VERDICT: redo on their own.

## Where this applies

Any project with user accounts, subscriptions, uploaded/stored files, or a login -- not only web-design work. Read at start (does the plan account for these), middle (are they being built), and end (do they actually work, not just exist as UI).


---

<!-- references/security-systems.md -->

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


---

<!-- references/legal-compliance.md -->

# Security: legal and compliance checks

Operator, 2026-09-23: the security specialist also protects the project in legal matters. These are product checks a
reviewer can verify in code and copy. They are not legal advice: when a project is in a regulated area (health,
finance, children, gambling) say so and recommend a lawyer. Skip an item only with the reason (for example "no email
is sent"). A missing item that applies is a finding: cite the file.

## Email and messaging
- [major] Every marketing email carries a working one-click unsubscribe link and a `List-Unsubscribe` header; the
  handler really stops sends (check the send path reads the flag). Transactional mail (receipts, resets) is exempt.
- [major] Marketing consent is opt-in, never a pre-ticked box (GDPR/PECR, Canada CASL); store when and how consent
  was given. US CAN-SPAM: a physical postal address in the footer, honest subject lines, opt-outs honoured quickly.
- [minor] SMS and push marketing: same opt-in and a STOP keyword or settings switch.

## Age and children
- [major] Signup has an age gate when the service is not for children. Under 13 in the US (COPPA) needs verifiable
  parental consent or the account is refused; the EU sets 13-16 by country (GDPR Art. 8); the UK Children's Code
  applies to services children are likely to use.
- [blocker] Alcohol, gambling, adult or age-restricted goods: an age check before the content or the checkout.

## Privacy and user rights
- [major] A privacy policy that names the real data categories, processors (Stripe, Supabase, Anthropic, OpenAI,
  analytics), retention periods and the contact for requests.
- [major] Users can export their data, correct it and delete their account; deletion removes the login and stored
  files (see the security checklist).
- [major] Cookie banner before any non-essential cookie or tracker loads, with Reject as easy as Accept (ePrivacy,
  GDPR). Analytics that set cookies wait for consent.
- [minor] US: a "Do Not Sell or Share My Personal Information" link where CCPA/CPRA applies (selling or sharing data
  for ads); honour Global Privacy Control signals.
- [minor] A written breach plan: GDPR expects notification to the regulator within 72 hours.

## Subscriptions, payments and consumer law
- [major] The price, billing period and auto-renewal are shown before the charge; cancelling online is as easy as
  signing up (California's auto-renewal law and similar state laws); a renewal reminder for yearly plans.
- [major] Card data never touches the app's servers: hosted checkout or hosted fields (PCI DSS scope).
- [minor] Terms of service and a refund policy are linked at checkout. EU buyers of digital content have a 14-day
  withdrawal right unless they expressly waive it at purchase.

## Content, licences and AI
- [major] Dependencies: no GPL/AGPL code inside closed-source distribution without meeting its terms; keep the
  licence notices the licences require (`npx license-checker --summary`).
- [major] Fonts, images, icons and audio have a licence that covers this use; no scraped or stock assets without one.
- [minor] User-generated content: a way to report content and a copyright takedown contact (DMCA; the EU Digital
  Services Act for platforms).
- [minor] AI features: tell users when they are talking to an AI or seeing AI-generated media (EU AI Act transparency
  duties apply from August 2026); do not send personal data to a model provider the privacy policy does not name.

## Accessibility law
- [major] Public websites and apps sold in the EU fall under the European Accessibility Act (from June 2025); US
  sites face ADA claims. The practical bar for both is WCAG 2.1 AA: the test board's accessibility testers are the
  evidence.

## Business identity
- [minor] A contact route and the legal business name on the site; an imprint (Impressum) for German and Austrian
  audiences.
