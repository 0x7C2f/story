# Natural Text Baseline

Adapted from zenstory-ai's story-deslop natural-text baseline (MIT). Deslop
needs to know what natural prose looks like before it can spot the flavor.
The style-sheet.md of this project wins over every default below; this card
only describes the contrast, it never sets the voice.

## The baseline

| Dimension | Natural prose | AI-flavored prose |
|-----------|---------------|-------------------|
| Paragraph length | varies with the beat: peaks and turns run short, reasoning, mood, and emotion chains run long | one uniform length throughout, neat and even |
| Sentence rhythm | comma-led narration (8–12 words between commas, 20–30 per sentence) | either bloated long sentences or confetti fragments like an outline |
| Dialogue tags | rare and unformulaic; action or context introduces the speaker; plain "said" is fine | nearly every line carries "said/asked/smiled" |
| Emotion | direct when the scene earns it; reactions carry consequences | emotion-summary lines that spin, or a micro-gesture glued to every emotion word |
| Figurative language | lived-in ("like a husky guarding its food") | literary ("cold as ice") |
| Interjections | "hm", "ah", "damn", "fine then" — almost none of these in AI text |
| Omission | heavy; the reader fills in the gaps | exhaustive; terrified the reader won't get it |

## How to use it

1. Run `story review` first: its rhythm, dialogue, and close signals point at
   the rows above (uniform sentence averages, high dialogue-tag density,
   summary closes).
2. Compare flagged passages against the table row by row. A passage only
   reads "AI-flavored" when several rows tilt the same way; one hit is a
   style choice, not a verdict.
3. Fix with the deslop-gates card: delete first, de-template, ground the
   emotion. Never add interjections or slang to fake naturalness — that is
   the flip side of the same slop.
4. Re-check with `story prose .`; the house style still stands after every
   pass.

Report-only discipline: this baseline describes. The judgment about what
the book's voice actually is belongs to style-sheet.md and the author.
