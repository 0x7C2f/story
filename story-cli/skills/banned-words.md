# Banned Words And Sentence Templates

Adapted from zenstory-ai's story-deslop banned-words table (MIT) to English,
and kept in step with the `story slop` guards. The style-sheet's allow-words
list can license a word the guards flag; that override is the book's
decision. Words the story uses on purpose go in `continuity/exemptions.md`
with a reason.

## The worst sentence templates (fix on sight)

| Template | Example | Fix |
|---|---|---|
| not-A-but-B flip | "It was not fear, but relief." | Write B outright: "Relief." |
| reverse not-is | "It was a signal, not a mistake." | State A; fold B into action |
| universal "with a" tail | "He smiled, with a trace of bitterness." | Delete the tail; keep the verb |
| low voice, outsized force | "Her voice was quiet, but it carried." | Write the words, the sound, or the act |
| "he knew / she realized" summary | "He knew then it was too late." | Show the knowledge in behavior |
| stock body beats | fingers tightening, jaws clenching | Deletion test: cut unless consequence needs it |
| abstract fate close | "the gears of fate", "it was only the beginning" | End on the concrete open thread |
| trailer tease | "Little did he know..." | Cut; use the open question itself |
| scare-quote emphasis | "the 'solution'" | Plain nouns or real dialogue |
| rule-of-three stacks | "cold, sharp, and absolute" | Keep the strongest single term |

## Tier 1 — machine diction (one hit rewrites)

delve, tapestry, moreover, furthermore, crucial, pivotal, testament,
resonate, vibrant, bustling, intricate, nuanced, underscore, myriad,
plethora, realm, embark, unleash, elevate, seamless, robust, leverage,
utilize, foster, cultivate, harness, empower, unlock, navigate,
transformative, holistic, synergy, multifaceted, breathtaking, profound,
serene, illuminate, captivate, mesmerize, meticulous, daunting, poignant,
evocative, unforgettable, unmistakable, undeniable, insightful,
thought-provoking, uncharted, unwavering, relentless, nestled, boast,
fleeting, ethereal, dazzling, remarkable, extraordinary, compelling, vivid,
striking, paradigm, ecosystem, landscape, symphony, beacon

## Tier 2 — density control (clusters rewrite, singles may stay)

- Hedged verbs and adverbs: slightly, faintly, softly, quietly, subtly,
  somewhat, almost, nearly, barely; "for a moment", "a beat", "just a
  little" — ≤3 per 1,000 words combined.
- Similes: like a, as if, as though — keep the one or two that carry
  information per scene; the rest become plain declaration.
- Judgment chains: knew, realized, understood, this meant, must have,
  after all — show the inference; do not narrate it.
- Named emotion: felt a wave of, was filled with, couldn't help but — cut
  the label, keep the choice or consequence.

## Metaphor policy (review, never bulk-delete)

Living, character-grounded similes that carry information stay. Stock
images (fate's gears, seas of X, cold as death) come out first. Functional
physical similes stay when the body is really doing it. Never replace a cut
metaphor with a fresh metaphor — plain fact is the replacement.

## Punctuation (this project's house rules — they differ from the source)

The style-sheet **endorses** em-dashes (—) without spaces for interruptions
and parentheticals; the guards score em-dash *density*, never the mere
presence. Double hyphens should be em-dashes. Ellipses follow the
style-sheet's dialogue rules. This diverges from the source table's
no-dash rule on purpose: the style-sheet is the authority.

## Replacement discipline

**Do not reuse replacements.** When one word trips five times, each fix is
its own concrete rewrite — five "he looked away" fixes are a new template.
Priority when a passage trips the density classes: delete abstract
summaries first, then land emotion in visible action, object, line, or
consequence.
