# Experience playbook: seasoned judgment for the lead

An agent has no career, so "experience" here means three concrete things: a library of failure patterns with their sources, a pre-mortem that applies them before work starts, and a loop that turns every run's mistakes into the next run's rules. Nothing below is invented; each seeded pattern names where it came from, and anything unconfirmed is tagged **[to verify]**.

## 1. The pre-mortem (runs right after the assumptions gate, before the first build order)

1. Read `docs/design/QURN_EXPERIENCE.md` if it exists (the project's and the operator's own lessons), then section 3 below.
2. Say: "It is three weeks later and this failed. Why?" Write the five most likely reasons for **this** project, each matched to a pattern from the library or marked "new".
3. Turn each into a line in the risk register (management-v2 section 8) with an owner, a trigger and a response, and into a definition-of-done check where it can be measured.
4. Add any pattern whose cheap prevention costs less than its failure to the first wave, not the last (for example, test on a phone in wave one, not at ship time).

A pre-mortem that lists generic risks ("bugs", "delays") is a failed pre-mortem. Each line must name a file, a device, a number or a decision.

## 2. Senior-judgment rules

- **Evidence ladder.** Measured on the failing case > run and observed > read in the code > assumed. A verdict at the bottom rungs is a guess; log it as one. "It should work now" is never a pass (management rule 3).
- **Walking skeleton first.** The thinnest end-to-end slice that touches every risky part (real asset, real deploy, real phone) before any polish. Late integration is where most expensive surprises live.
- **Kill scope early, cheaply.** The assumptions gate cuts extras before code; change control prices them after. Anything the plan did not ask for is a decision, not a freebie.
- **Distrust the easy pass.** A pass that arrived on the first attempt with thin evidence gets a second look from the blind reviewer; a pass after two redos with strong evidence is usually safer.
- **Read verdicts for smells.** A redo with no cited evidence, a pass with "looks fine", a fix that touched files outside its owner's list, or a verdict that restates the goal: send each back.
- **Two rejections = new method.** Same complaint twice means stop adjusting and study, rebuild and show (circuit breaker, `qurn-pro-system-reference.md`).
- **Ask late only about irreversible things.** Cheap-to-reverse choices get a default and a note; irreversible ones (money, deletion, publishing, brand risk) get the operator before the work, not after.
- **Prefer the boring option you can verify** over the clever one you cannot test on the target device.
- **Say what you could not measure.** Every final report ends with that list. Unmeasured is not the same as passed.

## 3. Seeded failure patterns (with sources)

Match by project type. Each: pattern, early signal, prevention, source.

### Any public web build
- **Ship concerns discovered after the build.** Phone layout, weak-GPU first load, a cold test of the live URL, a public-safe brand, repo hygiene (`git ls-files`), and what analytics will show were each asked for one at a time. *Prevention:* plan all of them in the first reply and add `web`, `tester`, `coder` for them. *Source:* operator feedback, Qurn Cola, 2026-11-03 (SKILL.md "Lessons").
- **Design drift on "keep it the same".** Rebrand work needed two corrections because design changes slipped in. *Prevention:* list what you will not touch, change only that, diff afterwards. *Source:* same.
- **Verified a nearby case, not the failing one.** *Prevention:* measure at the viewport and page that failed, after a cache-ignored reload, and say what could not be measured. *Source:* same.

### 3D product pages
- **Primitive-built hero object rejected repeatedly.** A can was rejected six times ("blocky", "boxy ends", "make it realistic"). *Prevention:* real dimensions and a reference study before code; close-up stills at rest; stop tweaking after the second rejection. *Source:* `web/references/3d-product-realism-reference.md`, Qurn Cola, 2026-11-03.
- **Mirrored text from a flipped UV.** *Prevention:* check lid and rim text specifically in the stills. *Source:* same.
- **Compressed asset renders blank because the loader is missing**, or Draco/Meshopt run before other transforms. *Prevention:* compression is the last pipeline step, loaders wired, cold-load test on the live URL. *Source:* research 2026-11-07, `3d-pipeline-and-ai-assets-reference.md` [practice, secondary sources].
- **iOS Safari kills the tab on WebGL memory pressure; undisposed viewers leak.** *Prevention:* dispose on teardown, handle context loss, poster fallback, test on an older iPhone. *Source:* WebKit bug reports and community threads, `3d-formats-viewers-and-ios-reference.md` [community reports; Apple publishes no limits].
- **Asset with no recorded source or licence**, including AI-generated 3D whose plan terms were never checked. *Prevention:* `REFERENCES.md` entry before use. *Source:* `3d-modelling-reference.md`, `3d-pipeline-and-ai-assets-reference.md`.
- **Real-time 3D used where a frame sequence would be lighter and better-looking.** *Prevention:* decide the method first. *Source:* `3d-lighting-scroll-and-fallbacks-reference.md` [secondary sources; Apple's own build unconfirmed].
- **Public demo that mimics a real brand.** *Prevention:* ask once, record the decision. *Source:* `3d-product-realism-reference.md`.

### Any build, from operator feedback (reviewed 2026-11-07; the source log was not stored)
- **Scripted edits corrupt files.** Shell and Python find-and-replace turned escape sequences into real line breaks, dropped backslashes and flipped line endings, repeatedly. *Prevention:* make edits with the editor tool; if a script is unavoidable, write it to a file with a quoted heredoc, re-read the changed region, run the compiler or linter, and confirm line endings are unchanged.
- **Tests pass, the real thing is broken.** A fake model hid that the real app never handed the model its tools; a hard-coded limit (16 tools) broke every chat when a 17th was added. *Prevention:* one test per integration point against the real component, a regression test for every limit, and the real app launched in the first wave.
- **"All tests pass" reported without opening the product.** The verdict stayed `fix` round after round. *Prevention:* the definition of done names a real-run check (drive the product as a user would, measure it); do it before reporting, or state it as the single open item.
- **A failed tool reported as success.** An assistant answered "no unread emails" when the mail tool had failed. *Prevention:* failures reach the model marked as failures with the reason, the reply must state the reason, and a test covers it.
- **Suggestion against the product's principle.** A cloud key was proposed for a product whose principle is fully local, and the operator pushed back. *Prevention:* ask the non-negotiables at G0 and lock them; anything that sends data off the device or needs a paid key is an ASK; offer optional providers off by default with the principled option as default.
- **Fixing one thing breaks one that worked.** A smoother frame-timing change and an animation rework made a visual worse ("the earlier version was good"). *Prevention:* before touching visuals record a KEEP baseline (screenshot and measured values); when told it got worse, revert first, then investigate.
- **Performance by guessing.** Idle CPU was chased by hypothesis until a per-process, then per-thread breakdown plus an on/off test of the suspect isolated it (an always-on listener transcribing every sound). *Prevention:* CPU, memory and latency budgets in the definition of done, an environment baseline, isolate by toggling the suspect, measure before and after in the real app.
- **The environment is a finding.** Memory at 99% from other apps limited local-model speed more than any code change. *Prevention:* report it with numbers and the specific fix; do not tune code to hide it.
- **Speech accuracy and speed.** Simple phrases were mis-transcribed, transcription was slow, and the first spoken reply failed because the browser's voice list was briefly empty at start-up. *Prevention:* an accuracy gate on the operator's own recorded phrases, compare model sizes for the speed/accuracy trade, verify downloaded model files by checksum and pin versions, and test the **first** call after a cold start, not only the second.
- **Cache-friendly prompts.** First-reply time fell from about 64 s to about 16 s once warm-up and live chat used identical instructions so the local model reused its cache [one observation, local model server]. *Prevention:* keep the warm-up prefix identical to the live prefix and measure "first word" in the real app.
- **Good pattern to keep: untrusted read, then no actions.** After the assistant read a document, action tools were locked for that turn so hidden instructions in the document could not trigger anything. See `security/references/agent-context-supply-chain-reference.md`.
- **Errors need a human voice.** Speak the error in plain words, keep other tasks running while waiting for the owner, and let "try again" redo it (matches management rule 3).
- **Close the gap to a reference product with a table, honestly.** For "make it work like X": yes / partly / no per feature, ranked by usefulness against effort, with the model-size ceiling stated, and features that cost money or send data out skipped unless asked.
- **Quota and rate limits interrupt long builds.** A current ledger let work resume cleanly after a usage limit. Keep ledger lines up to date and steps resumable.

### Agent-infrastructure builds (task queue, coding-agent runner, merge gate)
- *Pattern:* spend, credentials and tampering boundaries decided late. *Prevention:* pull in `architect`, `delegator`, `coder` and `security` together at the start. *Source:* SKILL.md step 3 note and those specialists' agent-infra references.

### Builds touching auth, payments, uploads, personal data
- This playbook has no seeded field patterns for these. Do not improvise: consult `security` at the start checkpoint, not only before release, and add what it finds here at the retro.

## 4. The learning loop (how Qurn gets more experienced)

1. At the end of every Pro run, `node scripts/qurn-ledger.mjs lessons --project <name>` lists every redo/fix paired with its eventual pass, plus changes and escalations.
2. Qurn reviews each candidate and keeps **only** those that would change a future decision. For each kept one it writes the `rule:` in one sentence and appends the line to `docs/design/QURN_EXPERIENCE.md`. Unresolved candidates stay unresolved in the file; they are not rewritten into successes.
3. Operator-stated preferences go to `QURN_PROFILE.md` instead (standing rules); `QURN_EXPERIENCE.md` is for patterns about the work. Neither is shared across operators without their say-so.
4. A pattern that has proven itself on three separate projects can be promoted into section 3 of this file by the repo owner, with its sources. Promotion is a deliberate edit with a date, never automatic.
5. A pattern that stopped being true (a browser fixed a bug, a library changed) is superseded by a new dated line, not deleted.

## 5. What this does not do

It does not make the agent infallible and it does not replace the specialists' own expertise. It stops the same mistake from being made twice, makes risks explicit before work starts, and forces claims to the evidence ladder. How much it helps depends on the quality of the lessons that are kept, so the review in step 2 matters more than the script.

Not built yet: estimate-versus-actual calibration (logging each task's estimated and real cost so future estimates use the ratio). It needs several real runs of data first; add a `calibrate` command once the ledger holds that data.
