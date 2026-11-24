# Security: deep auth/crypto checklist and adversarial pass
(adapted 2026-10-15 from github.com/garrytan/gstack, MIT license)

Two passes. The checklist below goes deeper than this project's own security-checklist.md on
auth/authz patterns and cryptographic misuse. The adversarial pass runs after it, looking for
what the checklist itself would miss.

## Deep checklist (run when the diff touches auth or a sizeable backend surface)

**Input validation at trust boundaries** -- user input accepted with no validation at the
controller/handler; query params used directly in a DB query or file path; file uploads with no
type/size/content check; webhook payloads processed without signature verification.

**Auth & authorization bypass** -- an endpoint missing auth middleware; an authorization check
that defaults to allow instead of deny; a role-escalation path (user can edit their own role);
a direct-object-reference bug (user A reaches user B's data by changing an id); a session that
survives fixation/hijack; a token check that skips expiration. Three easy-to-miss ones:
- A shared error page (403/404/500) that builds its body outside the authorization path, so a
  blocked request still leaks internal names or counts the guard was supposed to hide.
- Ownership recorded at creation time that still grants access after the user's role is
  downgraded and they sign back in -- ownership must be re-checked against the *current* role.
- List, detail and download access to the same object checked as one item when each usually
  resolves through a different code path -- audit each path against the role matrix separately.

**Injection beyond SQL** -- command injection via subprocess with user-controlled args; template
injection (Jinja2/ERB/Handlebars) with user input; SSRF via a user-controlled URL; path
traversal via a user-controlled file path; header injection via a user-controlled header value.

**Cryptographic misuse** -- MD5/SHA1 for anything security-sensitive; `Math.random`/`rand()` for
a token or secret; non-constant-time comparison (`==`) on a secret or digest; a hardcoded key or
IV; password hashing with no salt.

**Secrets exposure** -- a key/token/password in source (even in a comment); a secret logged in
app logs or an error message; credentials carried in a URL; sensitive data echoed in an error
response; PII stored in plaintext when encryption was expected.

**XSS via escape hatches** -- `.html_safe`/`raw()` on user data (Rails), `dangerouslySetInnerHTML`
(React), `v-html` (Vue), `|safe`/`mark_safe()` (Django), a raw `innerHTML` assignment.

**Deserialization** -- deserializing untrusted data (`pickle`, `Marshal`, `YAML.load`, parsing
JSON into an executable type) or accepting a serialized object from input/an external API with
no schema validation.

## Adversarial pass (red team -- run after the checklist, or when the diff is large)
Not another checklist: think like an attacker, a chaos engineer and a hostile QA tester at once,
specifically hunting what the checklist above would miss.
- Attack the happy path: what happens at 10x load, two requests racing the same resource, a
  slow (5s+) query, an external service returning garbage?
- Find the silent failures: a catch-all that just logs, an operation that can partially
  complete (3 of 5 items written then a crash), a background job that fails with nobody alerted.
- Exploit trust assumptions: data validated only on the frontend, an internal API called with no
  auth because "only our code calls this," a config value assumed present but never checked.
- Break the edges: max input size, zero/empty/null, the very first run with no existing data,
  the same button clicked twice within 100ms.
- Cross-category gaps: an issue that is both a performance problem and a security hole, or one
  that only shows up at an integration boundary or a specific deployment configuration.

## Agentic AI: prompt-injection and tool-misuse verification (added 2026-10-31, research/security.md pass 3)
For any agent/tool-calling feature (ASI01 Agent Goal Hijack, ASI02 Tool Misuse, LLM01/LLM06),
"we reviewed the system prompt" is not a test. Verify mechanically, with trace evidence, not by
reading the model's own narration of what it did:

**Tools (real, current, open source -- do not re-verify these, they're confirmed):**
- **garak** (NVIDIA, `github.com/NVIDIA/garak`, stable v0.17.0 as of 2026-09-09) -- model-level
  scanner. Sends adversarial probes directly at the LLM API and grades responses; 50+ probe
  modules (prompt injection, jailbreak, data leakage, hallucination, toxicity). `pip install`,
  then `garak --list_probes`. Tests the underlying **model**, not the agent's tool-calling
  wiring -- run this first as a baseline, before testing the agent built on top.
- **Promptfoo red-team mode** (`promptfoo.dev/docs/red-team`, MIT core) -- application/agent-level.
  Exact plugin IDs to run against a live agent: `rbac` (role-based access enforcement), `bola`
  (steered onto another user's objects/data), `bfla` (steered into calling a function outside
  intended scope), `excessive-agency` (acts beyond stated capabilities), `tool-discovery`
  (reveals its tool list to an unauthorized caller), `mcp` (MCP-implementation weaknesses),
  `hijacking` (redirected away from its original objective -- the practical ASI01 test),
  `agentic:memory-poisoning` (corrupted memory/context changes later behavior), and a custom
  `policy` plugin for a project-specific rule ("never call delete-user without confirmation").
  Attack-traffic strategies layered on top: `jailbreak`, `jailbreak:tree`, `crescendo`
  (multi-turn escalation), `mischievous-user` (adversarial multi-turn, pairs with
  memory-poisoning). **Mechanical tool-scope check:** assert on the actual tool-call trace, not
  the chat transcript, via `trajectory:tool-used`, `trajectory:tool-args-match`,
  `trajectory:tool-sequence`, `trajectory:step-count`, `trajectory:goal-success`. A confirmed
  violation becomes a permanent CI regression check via `not-trajectory:tool-args-match`.

**Methodology (practitioner-consensus across vendor sources -- no single authoritative standard,
cite as consensus not verified fact):**
1. Enumerate every tool, permission scope, and external system the agent can reach before
   testing anything -- the attack surface is the permission set, not the vocabulary.
2. Test each tool individually for unauthorized invocation via prompt manipulation and
   parameter injection.
3. Map the tool graph and test **chained** calls for privilege escalation -- Tool A's output
   fed as Tool B's input can exceed either tool's individual privilege (e.g. a read-file
   result landing in a send-email recipient field).
4. Indirect injection -- a hidden instruction inside content the agent reads mid-task (a
   fetched page, a document to summarize, another tool's return value) -- is the primary
   real-world delivery route; this is the buildable version of "the hidden-instruction test
   case" already required elsewhere in this checklist.
5. Enforce scope **outside** the model, in the orchestration/runtime layer -- the model can be
   talked into expanding its own scope, so a control living inside the model under test is not
   a control. Red-team the confirmation gate itself (don't just build it, try to talk it around).

## Reporting
Rate likelihood and impact (High/Med/Low) per finding; a finding with no concrete exploit path
is a question to investigate, not a blocking verdict. Cite file and line.
