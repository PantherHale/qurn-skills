# Security: research notes

2026-09-23

Scope note: this document is written for the SECURITY specialist of an AI coding agent that *reviews* projects (it never builds). It must be able to look at an arbitrary codebase, recognize which systems are present, and apply an enforceable, checkable standard to each one. It extends, and does not repeat, `C:\Users\gaura\Documents\PManagerProject\src\specialists\knowledge\security-checklist.md` (account/subscription handling, secrets/client boundary, sessions/auth errors, uploads, login/signup flooding, forgot-password limits — all read as prior context, not restated here except where a new source adds a sharper version of the same control).

---

## Sources

| URL | What it adds |
|---|---|
| https://top10.owasp.org/2025 | Confirms the OWASP Top 10:2025 category list and ordering (fetched homepage navigation) — Broken Access Control, Security Misconfiguration, Software Supply Chain Failures, Cryptographic Failures, Injection, Insecure Design, Authentication Failures, Software/Data Integrity Failures, Security Logging & Alerting Failures, Mishandling of Exceptional Conditions. |
| https://api-security.owasp.org/editions/2023/en/0x11-t10 | Full OWASP API Security Top 10 (2023) list, IDs and one-line risk statement for each of the 10 categories — used as the API/backend section spine. |
| https://www.oligo.security/academy/owasp-top-10-llm-updated-2025-examples-and-mitigation-strategies | OWASP Top 10 for LLM Applications 2025, LLM01–LLM10 with IDs and descriptions — used as the AI/LLM section spine (sensitive info disclosure at #2, up from #6 in the prior edition). |
| https://www.electronjs.org/docs/latest/tutorial/security | Full 20-item Electron security checklist (load secure content, disable Node integration for remote content, context isolation, sandboxing, permission handler, webSecurity, CSP, insecure content, experimental features, blink features, webview allowpopups, webview creation, navigation limits, new-window limits, openExternal, current Electron version, IPC sender validation, custom protocol over file://, fuses, no raw IPC exposure) — used verbatim as the Electron/desktop section. |
| https://asvs.dev | OWASP ASVS 5.0 chapter list — 17 verification chapters (Encoding/Sanitization, Validation/Business Logic, Web Frontend, API/Web Service, File Handling, Authentication, Session Management, Authorization, Self-contained Tokens, OAuth/OIDC, Cryptography, Secure Communication, Configuration, Data Protection, Secure Coding/Architecture, Security Logging/Error Handling, WebRTC) — used to structure per-system coverage so nothing in ASVS 5.0's scope is missing below. |
| https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html | Concrete auth requirements: 8-char minimum with MFA / 15-char without, 64-char max, no forced rotation, breached-password screening, generic error message wording, account (not IP) lockout with exponential backoff. |
| https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html | Exact algorithm parameters: Argon2id (m=19456 KiB, t=2, p=1 minimum, or listed alternates), scrypt (N=2^17, r=8, p=1 minimum), bcrypt (cost ≥10, legacy only, 72-byte input cap), PBKDF2-HMAC-SHA256 (≥600,000 iterations, FIPS contexts only). Fast hashes (MD5/SHA-1/SHA-256 alone) named as unacceptable for passwords. |
| https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html | Ten checkable upload controls: allow-list extensions (guard `.jpg.php`, null-byte, alternate PHP extensions, ADS), magic-byte validation, Content-Type is advisory only, random server-generated filenames, storage priority (different host > outside webroot > webroot with write-only perms), size/decompressed-size caps, AV/sandbox scan, image reprocessing to strip injected payloads, authz before upload, least-privilege filesystem permissions. |
| https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html | SSRF control hierarchy: allow-list host + build the request yourself (never accept a full URL from the user), validated IP/domain libraries without trusting DNS resolution, network segmentation, disable HTTP redirects, IMDSv2 / block 169.254.169.254, deny-list private ranges only as a last resort. |
| https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html | CSRF control set: synchronizer token (per-session or per-request, server-generated), signed double-submit cookie (naive variant now discouraged), `SameSite=Strict/Lax`, custom header requirement for AJAX/API, `Sec-Fetch-Site` as the modern primary signal, Origin/Referer as defense-in-depth. |
| https://cheatsheetseries.owasp.org/cheatsheets/Content_Security_Policy_Cheat_Sheet.html | Concrete CSP guidance: strict nonce- or hash-based `script-src` with `strict-dynamic` and `object-src 'none'; base-uri 'none'`, `unsafe-inline`/`unsafe-eval` and wildcard sources named as defeating the policy, warns against a nonce-injecting middleware that also nonces attacker-injected `<script>` tags, `X-Content-Security-Policy` legacy header called out as obsolete/buggy. |
| https://cwe.mitre.org/top25/archive/2024/2024_top25_list.html | Full ranked CWE Top 25 (2024) with CWE IDs — used to cross-check that every category below maps to a concrete CWE (XSS CWE-79, OOB write CWE-787, SQLi CWE-89, CSRF CWE-352, path traversal CWE-22, OOB read CWE-125, OS command injection CWE-78, use-after-free CWE-416, missing authorization CWE-862, unrestricted upload CWE-434, code injection CWE-94, improper input validation CWE-20, command injection CWE-77, improper authentication CWE-287, improper privilege management CWE-269, insecure deserialization CWE-502, sensitive info exposure CWE-200, incorrect authorization CWE-863, SSRF CWE-918, buffer bounds CWE-119, null deref CWE-476, hard-coded credentials CWE-798, integer overflow CWE-190, uncontrolled resource consumption CWE-400, missing authentication CWE-306). |
| https://mas.owasp.org/MASVS/ | MASVS category list for the mobile section: MASVS-STORAGE, MASVS-CRYPTO, MASVS-AUTH, MASVS-NETWORK, MASVS-PLATFORM, MASVS-CODE, MASVS-RESILIENCE, MASVS-PRIVACY. |
| https://docs.github.com/en/code-security/secret-scanning/about-secret-scanning | GitHub secret scanning: detects known credential patterns across commits/PRs/issues/discussions/wikis/gists, raises alerts in the Security tab, partner validation program notifies providers to auto-revoke live keys. |
| https://docs.github.com/en/code-security/secret-scanning/introduction/about-push-protection | Push protection actually blocks the `git push` (and UI commit / file upload / REST API write) containing a detected secret *before* it lands in history, rather than alerting after the fact; off by default, turned on per-repo/org/enterprise, requires Secret Protection enabled first, supports custom patterns and named bypass reasons. |
| https://docs.npmjs.com/generating-provenance-statements | `npm publish --provenance` (npm ≥9.5.0, GitHub Actions or GitLab CI/CD only) produces a Sigstore-signed, publicly logged link from the published package back to its source repo and build steps; explicitly does **not** mean the code is safe, only that its origin is verifiable. |

## Video notes

Picked for concrete, enforceable additions — not generic "be secure" advice. All fetched via the `youtube-transcript` skill; transcripts are auto-captions (no punctuation, phonetic mangling) so quotes below are lightly cleaned.

### 1. "Supabase Row Level Security (RLS): Common Mistakes & Real Risks" — https://www.youtube.com/watch?v=3yDr4mrZXAw (security-scanner vendor demo channel, self-identified contact "rateify.co" / possibly "gatefy.co" — could not confirm exact company name, to verify)
- Names the #1 RLS mistake precisely: policies that check `auth.uid()` alone. Identity is not authorization — a policy must check **both** that the caller has a user ID *and* that the row's tenant column matches the caller's tenant. A dashboard aggregate view is the classic place this leaks (Alice silently sees Bob's order, no error, looks like normal traffic).
- Names the #2 mistake: teams lock down `SELECT` policies and stop, leaving `UPDATE`/`DELETE` — especially RPCs — without an explicit policy or `WITH CHECK` clause, so a caller can mutate rows they don't own (e.g. bump another tenant's invoice by swapping an ID in the request).
- Names the #3 mistake: `SECURITY DEFINER` functions run as the function owner, not the caller, and silently step outside RLS unless the function body itself re-checks tenant/ownership. Rule of thumb given: prefer `SECURITY INVOKER`; if `DEFINER` is required, hand-write the tenant check inside the function body.
- Enforceable practice: **negative/deny tests**, not just happy-path functional tests. "UI test passed, one curl command still pulled another tenant's table because nobody wrote a must-not-read test." Concrete CI check: a job spins up a temp DB, seeds two tenants, and asserts both an allow case and a deny case per table/RPC; a passing deny-test-expected-to-fail should fail the build.
- Personal ship rule stated on camera: "if my tenant's user can read tenant B's data with a single request, that build does not go out."

### 2. "YOU NEVER WANT TO DISABLE YOUR RLS POLICIES ON @Supabase" — https://www.youtube.com/watch?v=-GnGklqjwkg (Supabase-course creator, channel name not confirmed in transcript, to verify)
- Concrete demonstrable state change: with RLS **off**, `SELECT * FROM orders` from an anonymous client returns every row publicly; enabling RLS with zero policies attached flips this to zero rows (correct fail-closed default) until an explicit policy is added.
- Enforceable check for a reviewer: for every table exposed through the Supabase/PostgREST layer, RLS must show `ENABLED` (`pg_tables.rowsecurity = true` / `select relrowsecurity from pg_class`), and there must be at least one non-trivial policy — an enabled table with a `USING (true)` policy is equivalent to disabled RLS and should be flagged the same way.

### 3. "Firebase Security Misconfiguration: How I Gained Unauthorized Database Access (Full Lab Guide)" — https://www.youtube.com/watch?v=Sebs1Nk0VcA (pentest/bug-bounty walkthrough channel, name not given in transcript, to verify)
- Full attack chain a reviewer should be able to replicate: Firebase config keys are meant to be public, but the project was started in **Firestore "test mode"** (`allow read, write: if true` for 30 days) and never hardened before shipping — that default expiry window is exactly the gap that ships to production.
- Concrete exploitation with zero authentication: attacker copies the public `app.js` (which contains the Firebase config object), strips the query's `where(uid == ...)` filter client-side, points a local copy of the same JS at the live project, and reads the entire collection — because the *filter* was client-side and the *backend rule* still allowed unauthenticated reads.
- Collection/bucket names are guessable or leak via error messages/GitHub — brute-forcing common collection names (`users`, `products`, `orders`) is a real recon step, so a reviewer should check that security rules do not depend on the collection name being secret.
- The fix demonstrated: change default rule to `allow read, write: if false;` then add narrow rules keyed on `request.auth.uid == resource.data.uid` (read) and `request.auth.uid == request.resource.data.uid` (write) — i.e., authorization decided by the security rules engine on the server, never by a client-side query filter.
- Enforceable check: any Firebase/Firestore project must show these rules were reviewed and moved off test-mode defaults before the 30-day test-mode window in `firestore.rules`; "started in test mode" with no later hardening commit is itself a finding.

### 4. "5 JavaScript API Key Mistakes (and how to fix them)" — https://www.youtube.com/watch?v=7oJgdyMS4rQ (James Q Quick — name self-stated on camera, transcript renders it "James Q Hick")
- Mistake 1: hardcoding the key directly in source instead of an environment variable.
- Mistake 2: committing the actual `.env` (vs. `.env.example`) — check it is `.gitignore`d, not just that a sample file exists.
- Mistake 3 (the one most AI-assisted codebases get wrong): assuming a secret environment variable is safe to reference from front-end/React/Next.js code because it's "just an env var" — at build time the bundler inlines the value into the shipped JS, so anyone can view-source or open devtools and read it. **Any env var consumed by client-side bundle code must be treated as public**, full stop.
- Mistake 4: standing up a backend proxy for the third-party API but leaving the proxy endpoint itself unauthenticated/unrated — the secret key is now safe, but anyone who reverse-engineers your app can hit your proxy directly and run up your bill on someone else's behalf. Fix stack given, in order of rigor: CORS (browser-enforced only, doesn't stop Postman/curl) → per-endpoint design instead of a blind passthrough → app-level rate limiting → real user auth (JWT) so the proxy call is tied to an accountable identity.
- Mistake 5: leaking the key live on camera/stream by having the `.env` visible in an IDE tab — recommends a screen-redaction tool (`cloak`, or built-in “hide secrets” IDE extensions) for anyone who streams or records their coding sessions.

### 5. "How We Exposed API Keys to 500,000 Users" (Flutter/mobile API-key security talk) — https://www.youtube.com/watch?v=0dvEtfSVrfg (speaker self-identifies informally as "Ty"; channel name not confirmed in transcript, to verify)
- Blunt framing worth carrying into the checklist verbatim: "if your client-side code needs the API key, there is no secure way to do it — none. If it's in your front-end code, someone smart enough can figure it out," including intercepting HTTPS traffic via a local host-file + fake cert, so bundle obfuscation is not a mitigation.
- App-bundle-ID / domain allow-listing on a key is a mitigation, not a fix — demonstrated bypass: point a local hosts-file entry + self-signed cert at the allow-listed domain and run the request from your own machine.
- The proxy-server fix has to go two levels deep or it just moves the vulnerability: (1) build specific narrow endpoints, never a blind pass-through of the third-party URL, because the third party's secret key usually has more power than the client should ever get (Stripe secret key can create products, not just list them); (2) require your **own** user authentication on the proxy, or anyone who sniffs the proxy's existence can call it directly and drain your quota/budget even without ever seeing the real key.
- Anti-abuse detail specific to consumer apps: rate limiting keyed only on "user account" is defeated by disposable multi-account creation (Gmail `+tag` / dot-insertion tricks make "one email = one account" false) — recommends phone-number-based verification (2FA/SMS code) as a materially harder-to-forge unique identity signal when quota abuse is the threat, plus IP logging as a secondary signal (explicitly warned not to hard-block by IP alone — shared office/NAT IPs cause false positives).
- Practical sequencing advice for an MVP: start with the proxy + narrow endpoints; add logging/rate-limiting/harder identity once real abuse or billing spikes are observed, rather than gold-plating auth before any users exist — but the proxy step itself is not optional even at MVP stage.

### 6. "Live Demo: Finding Supabase RLS Issues Using Our Free Scanner" — https://www.youtube.com/watch?v=1oz73jAKiu8 (same scanner-vendor channel as video 1)
- Live scan of a real (anonymized) Supabase-backed site found 54 tables, of which 167 rows/functions were flagged with excessive permissions; several tables had RLS fully disabled and were marked critical specifically because they also carried PII columns — concrete illustration of "PII + no RLS = critical, not just a warning."
- Explicitly busts five myths a reviewer should watch for in written self-attestations: (1) "auth alone is enough" — a `SELECT` policy existing says nothing about `UPDATE`/`DELETE`/RPC; (2) "it works in the UI so it's safe" — negative/deny testing was never performed; (3) "CORS blocks direct calls" — CORS is enforced by the *browser*, not the server, so curl/Postman bypass it entirely; (4) "service-role keys in the front end are fine" — a service-role key fully bypasses every RLS policy by design; (5) "views/materialized views are safe by default" — inherited/implicit access and stale snapshots both leak.
- Recommends pairing an automated scanner (fast, wide coverage) with manual review for business-logic intent, abuse paths, and compliance evidence (SOC 2 / ISO) — automation is described as getting "80% of the way," not a substitute for judgment.

### 7. "Firebase Security in 100 Seconds" (Fireship) — https://www.youtube.com/watch?v=sw1Uy3zwsLs
- Sharp one-line framing for reviewers of any BaaS (Firebase, Supabase, PocketBase, Appwrite): "every operation is denied by default; when a request comes in, the engine looks for the first rule that allows it" — a reviewer should be able to point at the rules file and show the default-deny, then trace which rule opens which path, rather than accepting "we have rules" as sufficient.
- Concrete anti-pattern named directly: a document-level rule of bare `allow read, write` (no condition) is insecure by construction, regardless of whether the client code happens to only ever send authorized requests today.

### 8. "100 Firebase Tips, Tricks, and Screw-ups" (Fireship) — https://www.youtube.com/watch?v=iWEgpdVSZyg
Long-form but several individually enforceable checks land inside it:
- Use **two separate Firebase/GCP projects** (dev and prod) so test data and customer data never share a project — a reviewer should be able to see two project IDs in config, not one shared project gated only by an environment flag.
- Team members should be scoped via IAM "principle of least privilege" (Settings → Users and permissions) rather than everyone holding Owner/Editor.
- New Firestore databases should be created in **locked mode** and operations opened incrementally, not started in test/open mode and "hardened later" (this is the same failure mode video 3 exploited).
- Cloud Functions service-account JSON key: if it must be embedded rather than pulled from `GOOGLE_APPLICATION_CREDENTIALS`, it must be `.gitignore`d — same secret-in-repo failure mode as any other credential file.
- Callable Cloud Functions (vs. raw HTTP functions) automatically carry the caller's auth context, removing an entire class of "forgot to validate the Authorization header manually" bugs — worth flagging raw HTTP Cloud Functions that reimplement auth-header parsing by hand as higher-risk than callable functions doing the same job.
- Cloud Functions must be idempotent because the platform guarantees at-least-once (not exactly-once) delivery; a Firestore `onWrite` trigger that writes back to the same document without an equality guard creates an infinite trigger loop that will run up the bill until quota kills it — a reviewer should look for a before/after equality check in any function that writes to the collection that triggered it.
- Never set a write timestamp from client clock time; use the server-side timestamp function, since client clocks aren't trustworthy for ordering/audit data.

### 9. "What Is Credential Stuffing? How Hackers Break Into Your Accounts and How to Stop It" — https://www.youtube.com/watch?v=k8e96YxElKU (Marco Beranzoni, FinCrime-focused channel)
- Frames credential stuffing as industrial, not opportunistic: attackers buy aggregated breach "combo lists" cheaply, then run automated tools that rotate IPs, mimic human timing, and solve CAPTCHAs, testing millions of credential pairs in hours — a login endpoint with only a flat rate limit and no bot/behavioral signal will not stop this class of attack.
- Names the detection blind spot precisely: "a successful credential-stuffing login looks identical to a legitimate login at the authentication layer" — detection has to come from signals *around* the login (failed-login spikes from rotating IPs, device fingerprinting, behavioral biometrics) and *after* it (immediate contact-info change, a transfer to a brand-new payee right after login), not from the login event alone.
- Concrete institutional controls named: MFA as baseline (not optional) for anything financial or email-adjacent; real-time login/device-change notifications to the user; and — the one most projects skip — actually analyzing failed-authentication logs for patterns, since "you already have this early-warning signal, you're just not looking at it."
- User-facing signs of an already-compromised account worth building alerts for: unrecognized-device login alert, an unrequested password-reset email, a contact-details-changed notification, or a sudden unexplained logout.

---

## Per-system checklist

Each entry: how to detect the system is present in a codebase → checks (each individually verifiable by reading code or running a tool) → verification tool/command → severity if missing/failed. Severities: CRITICAL (blocks ship), HIGH (should fix before ship), MEDIUM (fix soon), LOW (note).

### 1. Authentication and sessions
**Detect:** `passport`, `next-auth`/`auth.js`, `lucia`, `@supabase/auth`, Firebase Auth SDK, custom `bcrypt`/`argon2`/`jsonwebtoken` imports, `login`/`signup`/`session` route files, cookie-setting code (`Set-Cookie`, `res.cookie`).
**Checks:**
1. Passwords hashed with Argon2id (m≥19 MiB, t≥2, p=1) or scrypt (N≥2^17) or, legacy only, bcrypt (cost≥10) / PBKDF2-HMAC-SHA256 (≥600k iters) — never MD5/SHA-1/SHA-256 alone or reversible encryption. — HIGH/CRITICAL
2. Password policy: min 8 chars with MFA / 15 without, max ≥64, no character-composition rules, no forced periodic rotation, checked against a breached-password list (e.g. HaveIBeenPwned k-anonymity API) at signup/reset. — MEDIUM
3. Session tokens are long, random (≥128 bits), unpredictable, and rotated on privilege change (login, password change, MFA enrollment). — HIGH
4. Sign-out invalidates the session **server-side** (token/session row revoked), not just the client cookie cleared (already in base checklist — repeated here because it's ASVS §7 and must be checked per session-storage backend used: JWT blocklist/short TTL+refresh rotation, or DB session row deletion). — CRITICAL
5. One generic error message for login/signup/reset across all failure modes (already in base checklist). — HIGH
6. MFA available (TOTP or WebAuthn preferred over SMS) at minimum for privileged actions (payment method change, email change, data export/delete). — MEDIUM/HIGH depending on data sensitivity
7. Cookies: `HttpOnly`, `Secure`, `SameSite=Lax` or `Strict` set on every session cookie. — HIGH
8. Account lockout/backoff is keyed by **account**, not just IP (base checklist already covers rate limiting; check specifically that a distributed/rotating-IP credential-stuffing run against one account is still throttled). — HIGH
**Verification:** manual code read of the hashing call and cookie flags; `semgrep --config p/owasp-top-ten` for hardcoded secrets/weak crypto; ASVS §6/§7 chapters as the checklist.

### 2. Authorization and multi-tenancy (RLS)
**Detect:** Supabase/Postgres project (`supabase/migrations`, `.sql` with `CREATE POLICY`), Firebase (`firestore.rules`, `storage.rules`), any multi-tenant schema (a `tenant_id`/`org_id`/`workspace_id` column), RBAC middleware (`casl`, `permit.io`, hand-rolled `role ===` checks).
**Checks:**
1. Every table reachable through a client-facing API (PostgREST, Firestore, GraphQL) has RLS/rules **enabled**, not just present-but-off. For Postgres: `relrowsecurity = true` in `pg_class` for every such table. — CRITICAL
2. Policies check identity **and** tenant/ownership together, not identity alone (video 1's #1 mistake) — a policy of `USING (auth.uid() IS NOT NULL)` with no tenant predicate is a finding. — CRITICAL
3. `INSERT`/`UPDATE`/`DELETE` have explicit policies with `WITH CHECK`, not just `SELECT` (video 1's #2 mistake). — CRITICAL
4. `SECURITY DEFINER` functions/RPCs re-check caller identity and tenant scope inside the function body, or are converted to `SECURITY INVOKER`. — CRITICAL
5. No service-role/admin key is reachable from client code or bundled JS (video 6's myth #4) — this fully bypasses RLS by design. — CRITICAL
6. Negative/deny tests exist: an automated test that a cross-tenant read/write is rejected, not just that same-tenant access works (video 1, video 6). — HIGH
7. Views and materialized views inherit the base table's access model explicitly — don't assume a view is automatically as protected as its source table. — HIGH
**Verification:** `select relname, relrowsecurity from pg_class where relkind='r'` against a review copy of the schema; Supabase/PostgREST RLS scanner (as demoed in videos 1 & 6) or hand-written allow/deny test suite in CI; `firebase emulators:exec` with a rules unit test suite for Firebase.

### 3. API and input validation
**Detect:** REST/GraphQL route handlers, OpenAPI/Swagger spec, `express`/`fastify`/`hono`/`nestjs`, tRPC.
**Checks (mapped to OWASP API Security Top 10 2023):**
1. API1 Broken Object Level Authorization — every endpoint taking an object ID re-checks that the caller owns/may access that specific object, server-side, on every call. — CRITICAL
2. API2 Broken Authentication — tokens validated with correct expiry, issuer, audience; no "trust the client-sent user id" pattern. — CRITICAL
3. API3 Broken Object Property Level Authorization — mass-assignment guarded (allow-list writable fields; a `PATCH /user` cannot set `role` or `isAdmin` unless explicitly permitted). — HIGH
4. API4 Unrestricted Resource Consumption — request size caps, pagination limits, timeouts, query depth/complexity limits on GraphQL. — HIGH
5. API5 Broken Function Level Authorization — admin-only routes actually check role server-side, not just hidden from a nav menu. — CRITICAL
6. API6 Unrestricted Access to Sensitive Business Flows — flows like "place order," "redeem coupon," "send invite" have abuse-rate controls, not just raw auth. — MEDIUM
7. API7 SSRF — see dedicated SSRF checks below wherever the API fetches a user-supplied URL (webhooks, "import from URL," link previews, avatar-from-URL). — CRITICAL
8. API8 Security Misconfiguration — verbose error/stack traces disabled in production, default credentials changed, unused HTTP methods disabled, CORS not wildcard on authenticated routes.— HIGH
9. API9 Improper Inventory Management — no forgotten `/v1` endpoints or debug routes left reachable; OpenAPI spec matches deployed routes. — MEDIUM
10. API10 Unsafe Consumption of APIs — responses from third-party/webhook APIs are validated/sanitized before use, same rigor as user input. — MEDIUM
**Verification:** `semgrep --config p/owasp-top-ten`, OWASP ZAP baseline/API scan against a running instance, manual route-by-route authz matrix review.

### 4. Database
**Detect:** any SQL/ORM (`prisma`, `drizzle`, `sequelize`, `knex`, raw `pg`/`mysql2`), NoSQL client (`mongodb`, Firestore SDK).
**Checks:**
1. No string-concatenated SQL; parameterized queries or ORM query builder throughout. Maps to CWE-89 (#3 in CWE Top 25). — CRITICAL
2. Least-privilege DB role for the application connection (not the superuser/owner role). — HIGH
3. Backups exist, are tested for restore, and are encrypted at rest. — HIGH
4. Sensitive columns (SSN, card data, health data) encrypted at the column level or tokenized, not stored plaintext. — CRITICAL for regulated data
5. Migrations don't leave debug/seed data with real-looking credentials or a superuser account with a default password in any environment reachable from the internet. — HIGH
**Verification:** `semgrep` SQL-injection ruleset; manual grep for string concatenation into query strings (`` `SELECT * FROM ${table}` ``, `+ req.query.x +`); connection-string role audit.

### 5. Files and uploads
**Detect:** `multer`/`formidable`/`busboy`, `<input type=file>`, S3/GCS/Supabase Storage SDK calls, any `/uploads` route.
**Checks:** (extends base checklist's upload item with the Cheat Sheet's ten controls)
1. Extension **allow-list**, not block-list; guards against double extensions (`.jpg.php`), null bytes, alternate PHP extensions (`.phtml`), NTFS ADS. — CRITICAL
2. File type verified by magic bytes, not just extension or client `Content-Type`. — CRITICAL (already in base checklist)
3. Filenames are server-generated random IDs, never the user-supplied name, and length-capped. — HIGH
4. Storage location: ideally a separate host/bucket, else outside the webroot, else webroot with write-only/no-execute permissions. — CRITICAL
5. Upload size cap enforced, and for archives, decompressed-size cap enforced (zip-bomb guard). — HIGH
6. AV/sandbox scan step present (ClamAV, storage-host scanning service) — already flagged CRITICAL in base checklist.
7. Images are reprocessed/re-encoded server-side (strips embedded payloads/EXIF), not served as uploaded. — HIGH
8. Served with `Content-Disposition: attachment` and `X-Content-Type-Options: nosniff` (already in base checklist).
**Verification:** manual trace of the upload handler for each control above; `clamscan` integration test; a test upload of a polyglot file (e.g. GIFAR or `.jpg.php`) that should be rejected.

### 6. Secrets and config
**Detect:** `.env`/`.env.*` files, `docker-compose.yml` env blocks, CI YAML with inline credentials, any hardcoded string matching key patterns (`sk_live_`, `AKIA`, `ghp_`, private key PEM headers).
**Checks:**
1. No secret is hardcoded in source, config committed to the repo, or client-bundled JS (base checklist item, repeated because it's the single most common vibe-coding failure per the video research: 62% of scanned AI-built apps shipped a critical vuln, and hundreds of exposed secrets/PII were found across thousands of scanned "vibe-coded" apps — see Sources note below). — CRITICAL
2. `.env` is `.gitignore`d; only `.env.example` (no real values) is committed (video 4). — CRITICAL
3. Any env var consumed by client/browser bundle code is, by definition, public — treat as such, don't rely on "it's an env var" as protection (video 4, video 5). — CRITICAL
4. Secrets loaded from a secret manager or CI-injected env var in production, not baked into the built image. — HIGH
5. GitHub push protection and/or a pre-commit secret scanner enabled on the repo (see Enforcement). — HIGH
6. `npm publish --provenance` (or equivalent) used for any package this project publishes, so consumers can verify build origin. — LOW/MEDIUM, only if the project publishes packages
**Verification:** `gitleaks detect --source .` (full history scan), GitHub secret scanning + push protection enabled in repo settings, manual grep for key-shaped strings in `dist`/`build` output specifically (catches the "env var leaked into client bundle" failure mode that source-only scanning misses).

### 7. Dependencies and supply chain
**Detect:** `package.json`/`package-lock.json`, `requirements.txt`/`poetry.lock`, `Cargo.lock`, `go.sum`, any lockfile.
**Checks:**
1. No known-critical/high CVEs in direct or transitive dependencies. — CRITICAL/HIGH depending on exploitability and reachability
2. Lockfile committed and used (`npm ci`, not `npm install`, in CI/deploy). — MEDIUM
3. Dependency count and provenance sanity-checked for typosquats on recently-added packages (a package added right before a security incident is a bigger red flag than a long-standing one). — MEDIUM
4. If the project publishes its own packages, provenance/signing enabled. — LOW
5. Now a distinct OWASP Top 10:2025 category on its own (#3, "Software Supply Chain Failures") — reviewer should treat a compromised/malicious dependency, build-pipeline compromise, or unpinned CI action (`uses: actions/checkout@main` instead of a pinned SHA) as its own finding class, not folded into "misconfiguration." — HIGH
**Verification:** `npm audit --audit-level=high`, `osv-scanner -r .`, Dependabot/Renovate enabled, `pip-audit` / `cargo audit` / `govulncheck` per ecosystem.

### 8. Browser boundary (CSP, cookies, CORS)
**Detect:** any served HTML/SPA, `helmet`/`next-safe` middleware, CORS middleware config.
**Checks:**
1. CSP present with a strict nonce- or hash-based `script-src` + `strict-dynamic`, `object-src 'none'`, `base-uri 'none'` — a CSP that includes `unsafe-inline`, `unsafe-eval`, or a wildcard source is not a mitigation and should be flagged as such, not credited. — HIGH
2. CORS on authenticated routes lists explicit origins, never `*` combined with `credentials: true`. — CRITICAL if combined with credentials
3. Cookies `HttpOnly`/`Secure`/`SameSite` as above.
4. CSRF protection present for any state-changing request reachable via a browser session cookie: synchronizer token, signed double-submit cookie, or `Sec-Fetch-Site` check — a JSON API relying solely on `Content-Type` as an implicit CSRF guard is a weak/legacy pattern. — HIGH
5. Security headers present: `X-Content-Type-Options: nosniff`, `X-Frame-Options`/`frame-ancestors`, `Strict-Transport-Security`. — MEDIUM
**Verification:** `curl -I` against the deployed site, Mozilla Observatory / securityheaders.com scan, OWASP ZAP passive scan.

### 9. Electron / desktop
**Detect:** `electron` in `package.json`, `main.js`/`main/index.ts` with `BrowserWindow`.
**Checks (full 20-item Electron checklist, https://www.electronjs.org/docs/latest/tutorial/security, fetched above):**
1. Only load secure (HTTPS/WSS/FTPS or bundled `file://`) content. — CRITICAL
2. `nodeIntegration: false` for any window/webview that can load remote or untrusted content. — CRITICAL
3. `contextIsolation: true` (default since Electron 12 — flag any explicit override to `false`). — CRITICAL
4. Process sandboxing (`sandbox: true`) enabled. — HIGH
5. `setPermissionRequestHandler()` implemented rather than accepting all permission requests by default. — HIGH
6. `webSecurity` never disabled. — CRITICAL
7. A CSP defined for renderer-loaded content. — HIGH
8. `allowRunningInsecureContent` never enabled. — HIGH
9. No experimental Chromium features enabled without justification. — MEDIUM
10. `enableBlinkFeatures` not used to re-enable disabled-by-default engine features. — MEDIUM
11. `<webview>` `allowpopups` not set (blocks uncontrolled `window.open`). — MEDIUM
12. `will-attach-webview` validated before allowing dynamically created webviews. — MEDIUM
13. Navigation restricted/validated (`will-navigate` handler) so the app can't be redirected to an attacker-controlled origin. — HIGH
14. New-window creation restricted via the window-open handler. — MEDIUM
15. `shell.openExternal` never called with untrusted/unvalidated input — this is command-execution-adjacent on some platforms. — CRITICAL
16. Electron kept at a current, patched version. — HIGH
17. Every IPC message handler validates the sender (`event.senderFrame`/webContents identity), not just the channel name — prevents a compromised iframe/renderer from invoking privileged main-process actions. — CRITICAL
18. Custom app protocol used instead of raw `file://` for loading app assets, to avoid path-traversal-style access to arbitrary local files. — HIGH
19. Fuses reviewed and dangerous ones (e.g. `runAsNode`) disabled for shipped builds. — HIGH
20. Preload scripts expose narrow, purpose-built functions via `contextBridge`, never raw `ipcRenderer.invoke` passthroughs or the full `ipcRenderer` object. — CRITICAL
**Verification:** `npx electronegativity -i .` (Doyensec's Electron-specific static scanner), manual read of every `BrowserWindow`/`webPreferences` block and every `ipcMain.handle`/`contextBridge.exposeInMainWorld` call.

### 10. Mobile
**Detect:** `ios/`, `android/`, React Native/Flutter/Expo project files, `.xcodeproj`, `build.gradle`.
**Checks (MASVS categories):**
1. MASVS-STORAGE: no sensitive data in plaintext `SharedPreferences`/`UserDefaults`/unencrypted SQLite; use Keychain/Keystore. — HIGH
2. MASVS-CRYPTO: platform crypto APIs used correctly, no hand-rolled crypto, no hardcoded keys. — HIGH
3. MASVS-AUTH: biometric/session handling doesn't silently downgrade to a static PIN or skip server-side session validation. — HIGH
4. MASVS-NETWORK: TLS enforced (no cleartext traffic allowed in the manifest/Info.plist), certificate validation not disabled for convenience. — CRITICAL
5. MASVS-PLATFORM: exported Android components (`exported="true"`) and iOS URL schemes/universal links validate their inputs; IPC/deep-link handlers treat incoming data as untrusted. — HIGH
6. MASVS-CODE: no debug/test flags shipped to release builds, no exposed secret keys in the compiled bundle (same failure mode as web — a mobile app is just as easy to reverse-engineer, per video 5). — CRITICAL
7. MASVS-RESILIENCE: only apply to the extent the app's threat model needs it (financial/DRM apps benefit from root/jailbreak and tamper detection; most apps don't need to over-invest here). — LOW/MEDIUM depending on app
8. MASVS-PRIVACY: permissions requested match declared use, no over-broad permission requests. — MEDIUM
**Verification:** MobSF (Mobile Security Framework) static/dynamic scan, `adb` inspection of exported components, manual `Info.plist`/`AndroidManifest.xml` review.

### 11. Payments and subscriptions
**Detect:** `stripe`, `paddle`, `lemonsqueezy`, `braintree` SDKs, `/webhook`/`/billing` routes.
**Checks:**
1. Webhook signature verified using the provider SDK's own verification function against the **raw** request body (not re-serialized JSON) and a signing secret from env/secret manager — never a hand-rolled HMAC comparison. — CRITICAL
2. Webhook handler is idempotent (dedupes on the event ID) since providers retry delivery. — HIGH
3. Entitlement/subscription state is only ever changed by a verified webhook or a verified server-to-server API call to the provider — never by a client-submitted "I paid" flag. — CRITICAL
4. Cancel-subscription and refund flows call the provider's API and only update local state after success or via webhook (base checklist item, repeated — this is the single most common billing-logic bug). — CRITICAL
5. No card data touches the app's own servers/logs unless the project is explicitly PCI-scoped for it (use the provider's hosted fields/Elements/Checkout). — CRITICAL
6. Webhook endpoint optionally IP-allow-listed to the provider's published ranges as defense-in-depth (not a substitute for signature verification). — LOW
**Verification:** manual trace from webhook receipt → signature check → DB write; test-mode replay of a webhook with a tampered signature (must be rejected) and a duplicate event ID (must not double-apply).

### 12. Email
**Detect:** `nodemailer`, `sendgrid`/`resend`/`postmark`/`ses` SDKs, transactional email templates.
**Checks:**
1. SPF, DKIM, and DMARC configured for the sending domain (prevents spoofing of the app's own emails and improves deliverability). — MEDIUM
2. Marketing/promotional templates carry a working unsubscribe link (base checklist item). — HIGH
3. Password-reset and account-notification emails don't leak whether an account exists (base checklist's forgot-password section) and rate/cooldown limits are enforced server-side (base checklist). — CRITICAL
4. Email content doesn't include sensitive data (full card numbers, full SSNs, plaintext temporary passwords) — a reset **link**, never a reset **password**, is sent. — HIGH
5. Outbound email sending itself is rate-limited per account/IP to prevent the app being used as a spam relay against arbitrary third-party addresses. — MEDIUM
**Verification:** DNS lookup for SPF/DKIM/DMARC records against the sending domain; manual template review for unsubscribe link and content.

### 13. Logging, monitoring, and privacy (PII, GDPR/CCPA)
**Detect:** logging library usage (`winston`, `pino`, `console.log` prevalence), analytics SDKs, any collection of personal data (forms, profile fields).
**Checks:**
1. No secrets, full tokens, passwords, or full payment details ever written to logs — even at debug level. — CRITICAL
2. PII is identified and its handling matches a stated privacy policy naming the real processors used (base checklist item). — HIGH
3. A basic legal basis / consent mechanism exists for non-essential cookies/tracking (GDPR) and a "do not sell/share" mechanism exists if California users are in scope (CCPA/CPRA) — flag as a finding if the app targets EU/CA users and has neither. — HIGH (legal exposure) for apps with EU/CA users
4. Data export and data deletion are both possible for a user's own data (supports GDPR Art. 15/17 rights) — ties directly into the base checklist's "delete-account must really delete" item. — HIGH
5. Security-relevant events are logged with enough context to investigate an incident (auth failures, privilege changes, admin actions) but without logging the sensitive payload itself — this is OWASP Top 10:2025's "Security Logging & Alerting Failures" category, and per video 9, failed-auth log analysis specifically is the early-warning signal most projects have but never look at. — HIGH
6. Alerting exists on the logs above (not just collection) — a log nobody reads is not a control. — MEDIUM
**Verification:** grep log statements for variable names matching `password`, `token`, `secret`, `card`, `ssn`; manual privacy-policy-vs-actual-processors cross-check; check for a SIEM/alerting integration (even a simple Slack webhook on repeated auth failures counts).

### 14. Deploy and infrastructure
**Detect:** `Dockerfile`, `docker-compose.yml`, Terraform/Pulumi/CDK, CI/CD YAML, hosting platform config (Vercel/Netlify/Render/Fly).
**Checks:**
1. TLS enforced everywhere (no plain HTTP endpoint in production); HSTS header set. — HIGH
2. Least-privilege cloud IAM roles for CI/CD deploy credentials and running services — not a single account with admin/owner rights everywhere. — HIGH
3. Backups exist for any persistent data store and have been test-restored at least once. — HIGH
4. Security headers set at the edge/CDN or app layer (see Browser boundary section). — MEDIUM
5. Secrets injected at deploy time from a secret manager/CI secret store, not baked into the container image or committed IaC files. — CRITICAL
6. Auth routes (login/signup/reset) sit behind whatever edge protection the host offers (WAF, Cloudflare, platform-level rate limiting) as an additional layer over app-level rate limiting (base checklist item). — MEDIUM
7. Unpinned/`@main`-referencing third-party GitHub Actions in CI are a supply-chain risk (OWASP Top 10:2025 #3) — pin to a commit SHA. — MEDIUM
**Verification:** `curl -I` for HSTS/TLS, cloud provider IAM policy review, a documented/tested restore runbook, CI YAML grep for unpinned `uses:` actions.

### 15. AI/LLM features
**Detect:** OpenAI/Anthropic/other LLM SDK imports, `langchain`/`llamaindex`, a chat/agent/tool-calling feature, RAG/vector DB usage (`pinecone`, `pgvector`, `weaviate`), any "AI writes/executes/sends X" feature.
**Checks (OWASP Top 10 for LLM Applications 2025, LLM01–LLM10):**
1. LLM01 Prompt Injection — user-supplied or fetched (web page, document, email) content that reaches the model is never implicitly trusted as instructions; the app validates/constrains what an injected instruction can actually cause the agent to do (tool allow-list, confirmation for destructive actions). — CRITICAL
2. LLM02 Sensitive Information Disclosure — now the **#2** risk overall (up from #6 in the prior edition, reflecting real leakage incidents) — check that prompts/context don't concatenate secrets, other users' data, or system credentials into what the model sees or can echo back. — CRITICAL
3. LLM03 Supply Chain — third-party models, fine-tunes, prompts, or MCP/tool packages pulled from unverified sources are a supply-chain risk like any other dependency. — MEDIUM/HIGH
4. LLM04 Data and Model Poisoning — any user-contributed data feeding fine-tuning, RAG ingestion, or few-shot examples is validated/sanitized before use. — MEDIUM
5. LLM05 Improper Output Handling — model output is treated as untrusted input to whatever consumes it next: never `eval`'d, never inserted into HTML/SQL/shell without the normal escaping/parameterization that any user input would get. This is the concrete link to CWE-79/89/78 above — an LLM output path is just another injection surface. — CRITICAL
6. LLM06 Excessive Agency — agents/tools are scoped to the minimum permissions needed (a "read email" agent should not also have "send email" or "delete file" tool access unless the feature requires it, and destructive/irreversible actions get a human-confirmation step). — CRITICAL
7. LLM07 System Prompt Leakage — system prompts don't contain secrets or security-relevant logic the app depends on staying hidden (assume it will eventually leak). — MEDIUM
8. LLM08 Vector and Embedding Weaknesses — vector DB access control mirrors regular DB access control (RLS/tenant scoping applies to embeddings too, not just relational rows). — HIGH
9. LLM09 Misinformation — user-facing flows built on model output that could be confidently wrong (medical/legal/financial advice, factual claims) have a disclaimer or human-review gate proportional to the harm of being wrong. — MEDIUM
10. LLM10 Unbounded Consumption — token/spend caps and per-user/per-session rate limits exist on LLM calls, since this is a direct-to-dollar-cost DoS vector in a way normal API abuse isn't. — HIGH
**Verification:** manual trace of every place external/user content enters the prompt and every tool an agent can call; a prompt-injection test suite (adversarial inputs attempting to override system instructions or exfiltrate context); spend/rate-limit alarms on the LLM provider account itself as a backstop.

### 16. Rate limiting and abuse
**Detect:** any public-facing endpoint, especially auth, search, AI-generation, or anything metered/billed.
**Checks:**
1. Auth endpoints rate-limited per-account and per-IP with exponential backoff (base checklist item) — and, per video 9, this alone does not stop credential stuffing; pair with anomaly signals (failed-login spikes from rotating IPs, device fingerprinting) rather than a flat threshold only. — HIGH
2. Expensive endpoints (search, export, AI generation, email send) have their own limits independent of the general API rate limit, since these carry a much higher per-request cost. — HIGH
3. Limits are enforced server-side in a shared store (Redis, DB), never only in client-side JS (base checklist principle, repeated here since it applies beyond just login). — CRITICAL
4. Multi-account abuse is considered for anything gated "one account = one allowance" (email `+tag`/dot tricks defeat naive email-uniqueness checks, per video 5) — phone verification or payment-method verification is the stronger signal when the allowance has real cost. — MEDIUM
5. `429` responses include `Retry-After` and don't leak internal state. — LOW
**Verification:** load-test/replay script against a rate-limited endpoint asserting the 429 kicks in at the documented threshold; manual check that the limit store is server-side and shared across instances (not per-process in-memory only, which resets on every deploy and doesn't work behind multiple app instances).

---

## Pre-launch gate

Ordered — each step assumes the prior ones pass. A CRITICAL failure at any step blocks progressing to the next.

1. **Secrets sweep.** `gitleaks detect --source . --log-opts="--all"` across full git history returns clean, or every hit is triaged/rotated. No secret-shaped string appears in `dist`/`build` output.
2. **Dependency sweep.** `npm audit --audit-level=high` / `osv-scanner -r .` clean of high/critical, or each finding has a documented reason it's not exploitable in this app's usage.
3. **Authn/session review.** Password hashing algorithm and parameters checked; sign-out invalidates server-side; one generic auth error message; MFA available for sensitive actions.
4. **Authz/RLS review.** Every client-reachable table/collection has enabled, tenant-aware policies; deny tests exist and pass; no service-role/admin key reachable client-side.
5. **Input/output review.** No string-concatenated SQL; file uploads pass the ten-point control list; any LLM feature's tool permissions and injection surface reviewed (LLM01/LLM05/LLM06).
6. **Browser boundary review.** CSP present without `unsafe-inline`/`unsafe-eval`; CORS explicit on authenticated routes; CSRF protection present; cookies flagged correctly.
7. **Platform-specific review.** Electron: full 20-item checklist. Mobile: MASVS categories relevant to the app's threat model. Desktop/mobile builds don't embed secrets any differently than web does — same rule applies.
8. **Payments/account-lifecycle review.** Webhook signatures verified server-side; cancel/delete actually call the provider and delete data; age check and privacy policy present (base checklist).
9. **Rate limiting and abuse review.** Auth, expensive endpoints, and multi-account loopholes covered server-side.
10. **Logging/privacy review.** No secrets/PII in logs; privacy policy names real processors; data export/delete work.
11. **Infra review.** TLS/HSTS enforced; least-privilege deploy credentials; backups exist and have been restore-tested at least once.
12. **Final sign-off.** Every CRITICAL item above is either passing or has an explicit, dated, owner-attributed exception with a remediation date — nothing CRITICAL ships silently unaddressed.

## Enforcement

**Automatable in CI or pre-commit (no human judgment needed to run, though findings may need human triage):**
- Secret scanning: `gitleaks` (pre-commit hook + full-history CI job) and/or GitHub push protection (blocks the push itself, not just an alert after the fact — enable at the org level, requires Secret Protection first).
- Dependency/SCA scanning: `npm audit` / `osv-scanner` / `pip-audit` / `cargo audit` / Dependabot, run on every PR and on a schedule.
- SAST: `semgrep --config p/owasp-top-ten` (and language-specific rulesets) on every PR diff.
- RLS/authz deny-tests: a CI job seeding two tenants and asserting cross-tenant reads/writes fail, for any Supabase/Postgres-RLS project (videos 1 & 6's core recommendation, directly automatable).
- Electron static scan: `electronegativity` on every build.
- Header/TLS check: automated `curl -I`-style check against the deployed URL for HSTS/CSP/X-Content-Type-Options presence, post-deploy.
- Webhook signature test: an automated replay of a tampered-signature and duplicate-event-ID webhook payload that must be rejected/deduped.
- License/provenance check: verify `npm publish --provenance` was used for any package the project itself publishes.

**Needs human/agent judgment (not purely mechanical), but should still be a required checklist item, not optional:**
- Whether a CSP's specific allowed sources are actually necessary vs. left over from a copy-pasted config.
- Whether an LLM agent's tool scope matches what the feature actually needs (LLM06 Excessive Agency).
- Whether a privacy policy's named processors match the actual vendor list in the codebase's dependencies/env vars.
- Whether MFA/step-up auth is proportionate to the actual sensitivity of the action being gated.
- Whether a rate limit's threshold is reasonable for the feature's real cost/abuse profile.

**What a blocking finding looks like (for the specialist's own output format):** cite the exact file and line (or table/policy name for a DB-level finding), name the missing/failed control by its ID from this document (e.g. "RLS #2: `orders` table has a `SELECT` policy but no `UPDATE`/`WITH CHECK` policy — a caller can mutate rows it does not own"), state the severity, and — for CRITICAL findings — treat it exactly as the existing checklist's Verdict section does: grounds for VERDICT: redo on its own, not a note to fix later.

---

## Distilled checklist (numbered, checkable)

1. No hardcoded secret anywhere in source, config, or client-bundled JS output (check `dist`/`build`, not just source).
2. `.env` is git-ignored; only `.env.example` with placeholder values is committed.
3. Any env var referenced by front-end/client bundle code is treated as public — no secret value is ever assigned to one.
4. GitHub push protection (or equivalent) enabled on the repo; `gitleaks` clean across full git history.
5. `npm audit`/`osv-scanner` clean of high/critical CVEs, or each is documented as non-exploitable here.
6. CI actions/dependencies pinned to a commit SHA, not a floating branch/tag.
7. Passwords hashed with Argon2id/scrypt (or bcrypt cost≥10/PBKDF2≥600k iters as legacy fallback only) — never a fast hash alone.
8. Password policy: 8+ chars with MFA / 15+ without, no forced rotation, checked against a breach list.
9. Sign-out invalidates the session server-side, not just the client cookie.
10. One generic error message for all login/signup/reset failure modes.
11. Account lockout/backoff is keyed by account (not just IP), with exponential backoff, resistant to rotating-IP credential stuffing.
12. MFA (TOTP/WebAuthn preferred) available for account and payment-sensitive actions.
13. Every client-reachable DB table/collection has RLS/security rules **enabled**, not merely present.
14. Every RLS/security-rule policy checks identity **and** tenant/ownership together, not identity alone.
15. `INSERT`/`UPDATE`/`DELETE` and RPCs have explicit policies with `WITH CHECK` — not just `SELECT`.
16. `SECURITY DEFINER` functions re-check tenant/ownership internally, or are `SECURITY INVOKER`.
17. No service-role/admin key reachable from client code.
18. A negative/deny test exists proving cross-tenant access is rejected, not just that same-tenant access works.
19. No string-concatenated SQL anywhere; parameterized queries/ORM only.
20. Every admin/privileged route checks role/permission server-side, not just hides the UI.
21. Mass-assignment guarded: a user-editable endpoint cannot set `role`/`isAdmin`/other privileged fields unless explicitly allowed.
22. Any user-supplied-URL fetch (webhooks, link preview, import) is allow-listed and does not accept a full URL blindly — SSRF guard, including cloud metadata endpoint blocking.
23. File uploads: allow-listed extensions, magic-byte type check, random server-side filenames, stored outside webroot or on a separate host, size/decompressed-size caps, AV scan, image re-encoding, `Content-Disposition: attachment` + `nosniff` on serving.
24. CSP uses nonce/hash + `strict-dynamic`, no `unsafe-inline`/`unsafe-eval`, no wildcard sources.
25. CORS on authenticated routes lists explicit origins; never `*` with `credentials: true`.
26. CSRF protection present on every state-changing browser-session request (token, signed double-submit, or `Sec-Fetch-Site` check).
27. Cookies: `HttpOnly`, `Secure`, `SameSite=Lax`/`Strict`.
28. Security headers present: HSTS, `X-Content-Type-Options: nosniff`, `X-Frame-Options`/`frame-ancestors`.
29. Electron: `contextIsolation: true`, `nodeIntegration: false` for untrusted content, `sandbox: true`, `webSecurity` never disabled.
30. Electron: every IPC handler validates the sender; preload exposes narrow wrapper functions only, never raw `ipcRenderer`.
31. Electron: `shell.openExternal` never called with unvalidated input; navigation and new-window creation are restricted; app is on a current patched version.
32. Mobile: TLS/cert validation not disabled; no secrets in the compiled bundle; exported components/deep links validate input.
33. Payment webhook signatures verified server-side against the raw body using the provider SDK; handler is idempotent by event ID.
34. Entitlement/subscription state changes only via verified webhook or verified server call — never a client-submitted flag.
35. Cancel-subscription and delete-account actually call the provider/delete real data, not a soft flag (base checklist).
36. Age check at signup; privacy policy exists and names real data processors (base checklist).
37. Marketing emails carry a working unsubscribe link; transactional emails send a reset **link**, never a plaintext password (base checklist covers unsubscribe; link-not-password is new here).
38. SPF/DKIM/DMARC configured for the sending domain.
39. No secrets, tokens, or full payment/PII details ever written to logs, even at debug level.
40. Failed-authentication logs are actually monitored/alerted on, not just collected.
41. Data export and data deletion both work for a user's own data.
42. LLM features: untrusted content reaching the model is never implicitly treated as instructions (prompt-injection guard); agent tool permissions are minimum-necessary with confirmation on destructive actions.
43. LLM features: model output is treated as untrusted input wherever it's consumed next (no `eval`, no unescaped insertion into HTML/SQL/shell).
44. LLM features: token/spend caps and per-user rate limits exist on model calls.
45. Rate limits are enforced server-side in a shared store, never client-side or in-process-only.
46. Multi-account abuse loopholes (email `+tag`/dot tricks) are considered wherever "one account = one allowance" matters.
47. TLS/HSTS enforced everywhere in production; no plain-HTTP endpoint.
48. Deploy credentials and cloud IAM roles are least-privilege, not a single admin/owner credential everywhere.
49. Backups exist for persistent data and have been restore-tested at least once.
50. Every CRITICAL item above either passes or carries a dated, owner-attributed exception before ship.

## Open questions

- Exact channel/company names for three of the nine videos could not be confirmed from the transcript alone (the RLS-scanner vendor channel behind videos 1 and 6 gives a garbled contact domain in auto-captions — "rateify.co" / "the rate securityi.co" — likely a mis-transcription of the actual product name; the Flutter API-key talk's channel name; the Firebase-pentest-lab channel name) — to verify by opening the URLs directly rather than relying on captions.
- OWASP Top 10:2025's one-line descriptions per category and the specific 2021→2025 re-ranking rationale were only available via secondary sources in this session (the primary `top10.owasp.org/2025` fetch returned only the category list, not per-category prose) — worth a follow-up fetch of the individual `0x01`–`0x0a` chapter pages if the specialist needs exact OWASP wording rather than this document's paraphrase.
- ASVS 5.0's specific verification-level (L1/L2/L3) assignment per requirement was not retrievable from the fetched page (`asvs.dev` homepage only gave the chapter list) — the per-system checklist above is structured to cover the same 17 chapters but does not yet map individual checks to an L1/L2/L3 tier; if the specialist wants to gate "MVP" projects at L1 and "handles payments/health data" projects at L2/L3, that mapping needs a follow-up fetch of the ASVS requirement-level data (e.g. the GitHub CSV/JSON export in `OWASP/ASVS`).
- CWE Top 25 fetched is the 2024 edition (2025's, if published, was not checked in this session) — worth confirming no reordering before treating rank order as authoritative for severity weighting.
- No primary source was fetched for GDPR/CCPA specifics beyond the general framing in the Cheat Sheet Series and general knowledge — if the specialist needs jurisdiction-specific enforceable checks (e.g. exact CCPA "Do Not Sell" mechanics, GDPR Art. 30 record-of-processing requirements), that needs a dedicated legal/compliance-source pass, which was out of scope for this security-research session.
- Did not independently verify the "62% of AI-built apps ship critical vulnerabilities" / "98% of Supabase-backed apps scanned had a flaw" statistics beyond the WebSearch summaries that surfaced them (OX Security, Symbiotic Security blog posts) — these were not WebFetched directly, so they're cited above only as directional context for why the RLS/secrets findings matter, not as a hard verified figure; if the specialist wants to quote a specific percentage, fetch the original report directly first.
