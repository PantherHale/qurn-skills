# Test board: field additions

Checked 2026-10-08 against pages read that day: Fowler's bliki entry on Test-Driven Development and the WebAIM Screen Reader User Survey #10. Use with `test-board-playbook.md` and `test-board-reference.md`, which already cover flakiness, contract tests, mutation testing, load testing and automated accessibility checks.

## Was TDD actually done? (Fowler)
The cycle is three steps: write a test for the next bit of functionality; write the functional code until it passes; refactor the new and the old code. It began with Kent Beck in the late 1990s. Fowler's benefits: the tests can only pass when the code meets them, and thinking about how to test forces the interface to be designed before the implementation. His warning: "The most common way that I hear to screw up TDD is neglecting the third step."
What the board asks for as evidence, not as a claim:
- A test that FAILED first: the failing run's output, or a commit order showing the test landing before the code. A test written after the code that never failed proves nothing about the code.
- A refactor step: duplication removed, names improved, tests still green. A series of commits that only ever adds is a signal the third step was skipped.
- Tests named for the behaviour under test, so a failure reads as a sentence.

## Assistive-technology pass (manual, on top of automated checks)
Automated tools find only part of the problems, so a keyboard-only pass and a screen-reader pass on the key flows are required. Which screen readers to use should follow real usage. WebAIM Screen Reader User Survey #10 (1,539 respondents, December 2023 to January 2024), primary desktop screen reader: JAWS 40.5%, NVDA 37.7%, VoiceOver 9.7%, Dolphin SuperNova 3.7%, ZoomText/Fusion 2.7%. Most common pairs: JAWS with Chrome 24.7%, NVDA with Chrome 21.3%, JAWS with Edge 11.4%, NVDA with Firefox 10.0%, VoiceOver with Safari 7.0%. On mobile, VoiceOver 70.6% and TalkBack 34.7% (the two sum past 100%, so respondents use more than one). It is a survey of respondents, not a census, and a newer edition may exist: check webaim.org before quoting these as current.
- A minimal matrix derived from those numbers (an inference of this file, not WebAIM's own recommendation): NVDA with Chrome or Firefox on Windows, VoiceOver with Safari on macOS and iOS, TalkBack with Chrome on Android, and JAWS where a licence is available because it has the largest share.
- Pass condition per flow: a person who cannot see the screen can finish the task. Record the screen reader, browser and flow tested; "ran axe" is not this check.

## Device and browser matrix
(Practice, no primary page fetched this session: the MDN page tried was missing.) Choose the browsers and devices from the project's own analytics when they exist, always include one Chromium, one Firefox and one WebKit engine, and test at least one real phone because emulation does not reproduce touch, memory pressure or the on-screen keyboard. Mark any cell not run as skipped with the reason.
