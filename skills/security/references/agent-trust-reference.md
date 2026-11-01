# Security: trust boundaries in autonomous agent systems

For a system where an agent spends money, holds credentials, or calls into your running app from an external tool. Pairs with `architect`'s `agent-infra-reference.md` (the merge gate) and OWASP ASI0x in `security-additions-reference.md` §9.

## Spend and stall limits
Every unit of autonomous work carries a pre-spend budget ceiling and a cancellation signal, checked before the work starts, not audited after. A breaker halts further dispatch once a ceiling is crossed or a stage stalls past its timeout; both the ceiling and the halt stay enforced even if the actual spend/cost number is deliberately not surfaced anywhere in the UI (a real, common product choice) -- track it internally regardless, never skip the enforcement because the number isn't shown.

## Credentials separate from identity
Store vendor API keys/credentials separately from whatever "identity" an individual agent/worker has. One credential should be able to back several differently-configured agents without being re-entered per agent, and a credential store is a different trust boundary from an agent roster -- a roster entry being compromised or misconfigured should not expose the credential store itself.

## Fail-open integrations with external tooling
A hook/plugin that calls into your running app from an external tool's lifecycle (e.g. a CLI's pre/post-action hook) must never block that tool's normal operation if your app isn't reachable. No response, a connection timeout, a bad reply, and "nothing running" all resolve to "do nothing, exit success," never to "block or error" -- an availability failure in your add-on must not become a correctness/availability failure in the tool it's attached to. Keep the relay itself dumb (forward the payload, print back exactly what's returned) and put all actual authorization/decision logic one layer behind it, under test on its own, authenticated with a shared secret the relay reads fresh each call rather than trusting the pipe/socket alone.

## Guard the gate against the agent it judges
See `architect`'s `agent-infra-reference.md` for the core rule (an agent under pressure to pass will sometimes rewrite its own gate into a no-op, so that diff gets auto-blocked separately from the gate's normal run). From security's side specifically: treat it as an adversarial-insider question -- decide who (which roster entries, which credential scopes) is even allowed to touch the gate/test/lint files at all, not only what happens after someone already has.
