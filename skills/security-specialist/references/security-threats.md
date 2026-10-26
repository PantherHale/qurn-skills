# Security: threat sweep

Operator, 2026-10-01. Run this list on every project, next to `security-systems.md`. An item is a finding only when you can cite the file and line; mark the rest "n/a, reason". Items already in the other two files are not repeated.

## Supply chain
- **Vulnerable dependencies.** Run `osv-scanner -r .` or `npm audit --omit=dev`. A reachable critical or high CVE blocks.
- **Malicious packages.** For every new dependency check: the name is not a typo of a popular one, it was published more than 30 days ago, it has a real repo, and it has no `postinstall` script that downloads or runs code. Lockfile committed; CI uses `npm ci --ignore-scripts` where scripts are not needed.

## AI features
- **Prompt injection.** Text from users, web pages, files, emails or tool output is data, never instructions. Keep it in a separate, labelled block. Tools reachable after reading untrusted text must be the minimum set.
- **Unpermissioned AI access.** An agent only touches what the signed-in user may touch: it runs with the user's identity, not a service key. No file, mailbox, repo or DB access that is not granted per task.
- **Unreviewed AI code.** AI-written code reaches main only through review and the test gate. Flag commits with no test and no reviewer, and any `eval`, `exec` or generated SQL built from model output.

## Data and access
- **Excessive DB permissions.** The app connects as a role limited to the tables and verbs it uses. No owner, superuser or `service_role` key in the client or in handlers that serve users.
- **Poor tenant isolation.** Every query and storage path is scoped by tenant or user id on the server. Test: user A requests user B's id and gets 403 or 404.
- **Unencrypted sensitive data.** TLS everywhere. Passwords hashed (argon2id or bcrypt), tokens stored hashed, regulated fields (card, health, ID) encrypted at rest. No sensitive data in URLs, logs or localStorage.
- **Mass assignment.** Create and update handlers pick named fields from the body. Never `Model.create(req.body)` or `{...req.body}`. `role`, `isAdmin`, `tenantId`, `price`, `balance` are never client-settable.

## Injection and parsing
- **Command injection.** No `exec` or shell string built from input. Use `execFile` with an argument array and an allow-list. Same for `shell.openExternal` and file paths (reject `..`).
- **Insecure deserialisation.** Parse untrusted input as JSON against a schema (zod or similar). No `pickle`, `yaml.load`, `eval`, native `unserialize` or `node-serialize` on outside data.

## Auth and browser
- **Misconfigured OAuth.** Authorization code flow with PKCE; exact-match redirect URIs (no wildcards, no open redirect); `state` and `nonce` checked; minimal scopes; tokens never in URLs; refresh tokens rotated.
- **Missing security headers.** Check with `curl -I`: `Content-Security-Policy`, `Strict-Transport-Security`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy`, `frame-ancestors` (or `X-Frame-Options`).
- **Insecure cookies.** Session cookies are `HttpOnly; Secure; SameSite=Lax` (or `Strict`), `__Host-` prefixed where possible, short-lived, and rotated on login.
- **Exposed internal dashboards.** Admin, metrics, queue and DB UIs, `/debug`, `/swagger`, `.env` and source maps are not reachable from the public internet: login plus an allow-list or VPN. Test the deployed URL, not only the code.

## Detection
- **Missing audit logs.** Log who did what and when for login, failed login, password change, role change, export, delete, payment, admin action and every AI tool call. Append-only, no secrets inside.
- **No security monitoring.** Alerts exist for repeated failed logins, a spike in 4xx/5xx, a new admin, an unusual export and a spend spike. A log nobody is paged on is a finding.

## Rollout and operational safety
- **No post-deploy canary.** A release is not "done" at green build: watch error rates and logs for a defined window after it ships before calling it stable. Flag a deploy process with no such window.
- **Default-allow authorization paths.** Any resource with routing/access config but no explicit allow policy must deny by default. Flag an authorization path that fails open when its policy is missing or misconfigured.
- **No staged rollout for risky changes.** A broad or risky policy, pricing, or config change ships disabled or scoped to a pilot slice first, not to 100% of users at once. Flag a flip-the-switch deploy for anything with blast radius.
- **Missing destructive-command guardrails.** An agent or script operating with elevated autonomy should have an explicit pre-flight check before `rm -rf`, force-push, or a drop-table-shaped command, and an edit-scope boundary confining writes to an agreed directory — not just advice to be careful.

## Verdict
Any item above that applies and is missing is a blocking finding, the same weight as CRITICAL. Cite the file that proves it.
