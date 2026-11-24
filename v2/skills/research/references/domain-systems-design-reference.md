# Designing complex systems: the decisions that matter

Researched 2026-11-07. Tags as in `domain-atlas-reference.md`. Mechanisms here are stable canon; the sources fetched were practitioner and vendor posts, so each rule names the original to read. For a design request, work through sections 1 to 6 as a checklist and write each decision as an ADR with the alternative you rejected.

## 1. Start from the workload, not the technology

Write down, with numbers or honest ranges: read/write ratio; peak and average request rate; data size now and in a year; latency targets by operation; what must never be lost; what may be stale and for how long; who the users and operators are; the team's size and skills; the budget. A design with none of these written is a guess. [practice: every database-selection guide fetched starts here]

## 2. Consistency and consensus

- [practice] **CAP** only says what you give up during a network partition. **PACELC** adds the normal-case trade-off between latency and consistency, which is the one you live in most of the time. CAP "consistency" is not ACID "consistency"; people confuse them.
- [practice] Choose the consistency model **per operation, not per database**: payments and inventory decrements need strong consistency (linearizability); a feed or a counter can be stale. Causal consistency is a useful middle where linearizability is overkill. Linearizability everywhere is expensive and usually unnecessary.
- [practice] Do not implement consensus yourself. Raft is the practical default for understanding and for libraries; Paxos variants appear in existing infrastructure. For locks and leader election use etcd or ZooKeeper rather than writing it.
- Classifications of specific databases as CP or AP are approximate and change by configuration; read the vendor's consistency documentation for the exact setting you will use. [to verify]
- Original: Kleppmann, *Designing Data-Intensive Applications* (replication, transactions, consistency and consensus). [recalled from the canon]

## 3. Failure is the normal case: resilience patterns

From the AWS Builders' Library article on timeouts, retries and backoff with jitter [primary-ish: operator's own engineering write-up]:
- **Set timeouts everywhere.** An unbounded wait holds resources.
- **Retries multiply load.** If each of several layers retries independently, the bottom layer sees the product (the article's example: 243x). Retry in one layer, limit total retries, and prefer a **token bucket** retry budget that stops retries when the service is unhealthy.
- **Exponential backoff with jitter.** Capped backoff alone makes clients retry in lockstep at the cap; jitter spreads them. Add jitter to every timer, periodic job and delayed task, not only retries.
- **Circuit breakers** (closed, open, half-open) help but add states that are hard to test and can lengthen recovery; the same source prefers token buckets where they suffice.
- **Load shedding** deliberately drops work to protect the service during spikes. It is coarse and indiscriminate; pair it with priorities so critical traffic survives.
- **Idempotency** (Amazon Builders' Library, "Making retries safe with idempotent APIs", read 2026-11-07 [primary-ish: operator write-up]): "An idempotent operation is one where a request can be retransmitted or retried with no additional side effects." After a timeout the caller cannot know whether the first call worked, and a blind retry can create duplicates (two volumes, two singleton workloads). The preferred design is a **unique, caller-supplied client token** (EC2 calls it `ClientToken`), preferred over hashing the parameters because identical requests can be intentional. The server keys an idempotent "session" on customer plus token; a **repeat returns a semantically equivalent response** to the first success, not a bare "already exists" error; the **same token with different parameters returns a validation error**, so the server must store the original parameters. **Recording the token and doing the work must be atomic** (otherwise a token with no resource, or a resource with no token). Keep tokens for the resource's lifetime plus an interval, not forever. It adds complexity and is not right for every solution. SDKs can auto-generate and reuse a token across internal retries.
- **Queues and backpressure.** *Queue-based load levelling* (Azure Architecture Center, read 2026-11-07 [primary-ish]): put a queue between callers and a service so it processes at its own pace; "The queue acts as a buffer". Considerations: limit and load-test the processing rate; queues are one-way, so replies need a mechanism; "Autoscaling without bounding consumers' aggregate downstream rate only moves the overload to downstream dependencies"; if producers outpace consumers "the queue continues to grow and latency increases", so monitor depth and shed at the producer; delivery is usually at-least-once, so consumers must be idempotent; send unprocessable messages to a **dead-letter queue**; parallel consumers may break ordering. Avoid it when the caller needs a low-latency synchronous answer or load is low and steady.
- **Insurmountable backlogs** (Builders' Library, "Avoiding insurmountable queue backlogs", read 2026-11-07): a queue system is **bimodal**, fast with no backlog and ever slower once arrivals exceed processing, and recovery is slow (an hour-long outage can need about double capacity for another hour). Mitigations: separate queues per workload or shuffle-sharding so one tenant cannot block others; sideline stale or excess traffic to another queue (check message age on dequeue); drop old messages with a time-to-live where tolerable; backpressure upstream in proportion to backlog; delay queues for low priority; cap in-flight messages and concurrency; dead-letter queues with alarms; heartbeat long jobs so visibility timeouts do not cause duplicates; and **alarm on message age, not only depth**.

## 4. Choosing data stores

- [practice] The question is "what does the system do to its data", not "SQL or NoSQL". Postgres is the default unless there is a specific reason otherwise.
- [practice] **OLTP vs OLAP** is the sharpest divide: row stores for transactional point reads and writes, column stores for scans and aggregates over history. Each is bad at the other's job. The usual pattern is change-data-capture from the transactional store into an analytical store, at the price of two systems and a lag of seconds.
- [practice] Document stores buy schema flexibility and write scale and charge it back in modelling discipline and weaker reporting.
- Event sourcing suits domains that need a full audit trail; CQRS suits very asymmetric read and write loads; the **outbox pattern** gives reliable event publishing alongside a state change (avoids the dual-write bug). Each adds real complexity; require a stated reason. [practice, from an ADR template; the trade-offs are only sketched in the sources, read Kleppmann]

## 5. Shape: monolith, modular monolith, services

- [practice] Most teams are best served by a **modular monolith**: one deployable, strong internal module boundaries. Many reported "microservices" were really a **distributed monolith**: many deployables that must change together, with the costs of both.
- [practice] Extract a service only when a specific pressure justifies it: a component with very different scaling needs, a team boundary that blocks others, a different failure domain. One source gives rough team-size rules (monolith under about 30 engineers, modular monolith about 15 to 80) and "if you cannot afford a platform team you cannot afford microservices" [to verify, opinion].
- [to verify] Prime Video's 2023 case, widely cited, moved one monitoring workload from distributed to a single process and reported about 90% lower infrastructure cost; it was one workload, and the boundaries stayed inside the process. Read the original engineering post before citing it.
- **Strangler fig** migration: put a facade in front, move one capability at a time behind it, verify old and new agree with integration tests, retire the old part last. Build the boundaries first, extract later.

## 6. Make it observable and changeable

Define what "healthy" means before launch (SLIs and SLOs; see `domain-reliability-and-delivery-reference.md`). Log, trace and measure the paths in section 1. Decide how a bad deploy is rolled back, how a schema migration is staged (expand, migrate, contract), and which data stores are the system of record. Record decisions as ADRs so the next engineer can see what was weighed.

## 7. Failure patterns to test a design against

Retry storms; unbounded queues; a shared database behind "independent" services; synchronous chains where one slow dependency stalls all; no timeouts; clock-dependent logic; dual writes; a single region or single tenant assumed forever; capacity planned from average instead of peak; no rollback path; a design chosen for the CV rather than the workload.

## Read the originals

Kleppmann, *Designing Data-Intensive Applications*; the Amazon Builders' Library (aws.amazon.com/builders-library); Google's SRE book and workbook (sre.google); Fowler on microservices, strangler fig and evolutionary architecture (martinfowler.com); Newman, *Building Microservices*; the Raft paper (Ongaro and Ousterhout).
