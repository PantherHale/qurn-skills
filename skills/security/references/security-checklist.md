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
