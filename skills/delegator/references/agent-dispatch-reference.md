# Delegator: multi-vendor dispatch

For dispatching work across more than one AI vendor/model behind one interface, and deciding when a worker needs the full isolated-task treatment versus a lighter one-shot turn.

## Vendor adapters
When more than one AI vendor/model can do the same job, define one adapter interface (`{id, capabilities, run(opts): Promise<Outcome>}`) that every vendor integration implements; adding a vendor is one new file plus one new case in a single dispatch switch. Make the switch's default/fallthrough branch a compile-time error (an exhaustive match on a closed type) so a missing case is caught before it ships, not discovered at runtime. Required capability flags (does it stream/heartbeat, can it run unattended, is it local-only) belong on the interface, not inferred ad hoc -- a non-streaming adapter that never signals activity will get killed by a stall watchdog for looking idle.

## Failover
On a genuine vendor-side rate/usage limit (never your own configured ceiling -- see `security`'s `agent-trust-reference.md` for that distinction), fail over to another configured vendor and retry the exact same request rather than surfacing the limit to the operator. Pick the replacement from a vendor that isn't itself currently cooling down from the same kind of limit.

## Matching the worker's lifetime to the task
Not all dispatched work needs the full gated/isolated treatment (`architect`'s `agent-infra-reference.md`). A "just talk to it and get work done" turn -- one request/response, no iteration of its own, editing the operator's real working tree directly -- is a legitimate, simpler lifetime alongside the gated one, built on the *same* adapter interface above. Don't force a quick one-shot question through the heavier gated pipeline just for consistency; reserve the gate and worktree isolation for work nobody is watching turn-by-turn, and use the lighter lifetime when there's no merge decision to make. When writing a self-contained prompt for either lifetime, say explicitly which one the worker is operating under -- a worker given gated-task instructions but run as a one-shot turn (or vice versa) will make the wrong call about whether its own changes are safe to leave uncommitted.
