# Deslop Gates

Adapted from zenstory-ai's story-deslop gate rules (MIT). The one law that
overrules every gate: **the style-sheet.md of this project wins**. Its voice,
punctuation, and term decisions are the book's; a gate only changes how an
idea is said, never what the story does.

## Delete first, before any rewrite

Most AI-flavor sentences are filler. Before polishing a flagged line, ask:
does deleting it lose a hook, a plant, a character trait, a turn, or a
necessary fact? If nothing is lost, delete — do not polish padding.

If something would be lost: keep the information, rewrite only how it is
said. Never delete plot function. Cap deletion at ~15% of a light pass, 25%
of a heavy one; if a passage falls under length, rewrite denser, do not
refill with new filler.

If after deletion the prose is all five-word stubs with no connective tissue,
you cut too far: restore the plain narration around the peak beats.

## The gates

1. **Banned words** — walk `story slop --list-classes` and the banned-words
   card. Replace tell words with concrete action or detail; never swap in
   another adjective.
2. **Sentence de-templating** — kill the not-A-but-B flips, the "with a X"
   tail modifiers, the low-voice-but-force contrasts, the "he knew" summary
   lines. Write the positive term directly.
3. **Emotion grounding** — direct emotion is fine when the scene earns it;
   cut the redundant body-beat label. Injury, habit, and consequence beats
   stay. Merge a split action into one continuous picture.
4. **Redundancy** — same fact named twice in a paragraph: keep the stronger
   one. Adjective stacking, synonym pairs, repeated subject recall: cut.
5. **Modifier sweep** — one adjective per noun at most, and only when it
   changes the picture. "the white pill" → "the pill".
6. **Ending on momentum** — chapter and scene closes end on action, sharp
   dialogue, or an open complication. Status summaries and trailer teases
   (trailer-ending, chapter-summary-close) come out.
7. **Author asides** — narrator explanations of meaning come out; the
   reader can carry the inference.

## Protection rules (they beat every gate)

Foreshadowing, hooks, character memory, emotional carry-over, causal
anchors, key facts, and necessary turns are untouchable. When a gate and a
protected element collide, rewrite to satisfy both or mark the line for
human review — never cut the story to satisfy a detector.

## Working loop

1. `story slop .` — the report is the worklist (blocking first).
2. Fix each blocking hit; read each advisory hit in scene context before
   touching it (advisory classes cluster before they mean anything).
3. Intentional hits go in `continuity/exemptions.md` with a reason, the way
   every other finding is dismissed. Never edit the detector to hide a hit.
4. `story prose .` after any rewrite — the house style still stands.

Report-only discipline: these gates find and describe. The rewrite is a
writer's judgment, always in context.
