# The 90/10 landing-accent rule

Operator rule (2026-11-08): **two simple colours do about 90% of the work; one unusual ("weird") colour does about 10% and is where you want the user to land.** The accent is not decoration. It marks the destination.

This is the operator's stated design rule. It is a stricter cousin of the 60-30-10 ratio in `color-selection-reference.md`: there the 10% is the accent too, but the 60/30 split is two supporting roles. Here the two quiet colours together are the stage, and the accent is the only thing allowed to stand out.

## The rule

1. **Pick the destination first.** One thing per screen: the primary button, the price, the sign-up field, the product. Write it down before choosing colours.
2. **Two quiet colours (about 90%).** Usually a base (background) and an ink (text and structure). Both should be calm: low saturation, or neutrals tinted slightly toward the brand hue (see the Hobday rules in `color-selection-reference.md`). Their job is to be read, not noticed.
3. **One unusual colour (about 10%).** Far from the other two on the wheel (complementary, or a hue the page otherwise lacks) and more saturated. It appears only on the destination and the few things that lead to it: the main call to action, a key number, the focused field, one highlighted word.
4. **Exclusive use.** If the accent also colours links, icons, borders, tags and hover states, it stops marking anything. Count its uses per screen; if more than the destination plus 2 or 3 supporting touches, cut.
5. **Same destination, same accent everywhere.** The accent colour always means "this is the action". Do not use it for errors, success or decoration. Keep separate, quieter status colours.
6. **Ratio is by attention, not by exact pixels.** A thin accent line can outweigh a large pale area. Check by squinting at the page, or blur it: the eye should land on the destination first.

## Making the accent actually work

- **Contrast with its surroundings, not just with white.** Text on the accent needs WCAG AA (4.5:1 for normal text, 3:1 for large text and UI components). Measure it; do not judge by eye. An odd colour that fails contrast is a bad button.
- **Never colour alone.** Pair the accent with a clear label, size and shape so colour-blind users still find it (grayscale pass from `color-selection-reference.md`).
- **Space around it.** The destination needs breathing room; crowding other elements beside it cancels the pull.
- **Dark mode:** re-pick both quiet colours and re-check the accent's contrast; the accent often needs a lighter tint on dark backgrounds to keep the same pull.
- **One accent per screen, not per site.** A long page can move the accent to a new destination in each section as long as only one is live in view.
- **Cultural note:** colour meanings differ by market and the strongest published claims are weak; choose the accent for contrast and distinctness, then test it locally rather than trusting a colour-meaning chart (`domain-global-markets-and-localization-reference.md` in research).

## What is proven and what is not

The mechanism is well supported: an element that is visually distinct from its surroundings draws attention (the isolation or von Restorff effect), and this is the basis of the standard advice to make the primary action stand out. Specific claims such as "red buttons convert x% better" are not general: results depend on the page's other colours, and published colour A/B stories rarely replicate. [practice; effect sizes to verify on your own traffic.] Treat the rule as a design hypothesis and test it: a stated metric (click-through on the destination), a stop rule, and the expectation that lifts are small (see `domain-human-behaviour-reference.md`, section 1, in research).

## Check before shipping (blocking if missed)

1. Name the destination. If you cannot, the page is not ready.
2. Blur or squint test: does the eye land on the destination first?
3. Count accent uses on each screen; remove any that do not lead to the destination.
4. Contrast of accent versus background and of text on accent, measured.
5. Grayscale pass: is the destination still obvious without colour?
6. Quiet colours still read as one calm family, with no third loud colour sneaking in (gradients, illustrations and photos count).

## Failure patterns

Two loud colours competing; accent used for everything (then nothing stands out); accent chosen for "looks cool" while the main button is grey; weird colour that fails contrast; status colours (red, green) reusing the accent so errors look like actions.
