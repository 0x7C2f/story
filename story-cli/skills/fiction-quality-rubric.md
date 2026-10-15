# Fiction Quality Scoring

Adapted from zenstory-ai's fiction-quality-rubric (MIT): a 1–5 scorecard for
comparing versions of a deliverable. Every dimension's score carries a
50–150-word excerpt from the text as its evidence — the excerpt is what
makes the score arguable; the number just orders versions.

## Dimensions (1–5)

| Dimension | 5 | 3 | 1 |
|---|---|---|---|
| completion | delivered in full, length on target (±20%) | delivered short or missing a piece | unfinished, stops mid-thought |
| continuity | clear cause and effect; no breaks or re-tells across chapters | occasional jump or recap | contradiction, broken causality |
| character consistency | names, traits, abilities, relations hold; voices distinct | slight drift | renamed, snapped, relations scrambled |
| rhythm and hooks | opens strong; chapter ends on hooks; payoffs land where placed | flat, weak hooks | rushed or dragged; no hooks |
| genre fit | serves the genre's promises and habits | elements present but off-key | off-genre |
| naturalness / AI flavor | reads human; dialogue has grain | occasional stock phrase | template-speak, stacked parallelism, summary closes |
| format | paragraphs, dialogue, chapter shape all in house style | minor slips | broken shape (outline as prose, prose as outline) |

**Composite** = mean, one decimal. If completion ≤ 2, the composite is
capped at 2.5 — an unfinished piece scores nothing higher however pretty.

## AI-flavor checklist (count and report the counts)

- Stock phrases: per the banned-words card's Tier 1.
- Structure: every paragraph ending in a summary; three parallel paragraphs
  in a row; "in that moment, he finally understood" uplifts.
- Dialogue: everyone in the same register; lines that narrate instead of
  act.
- Rhythm: every chapter the same conflict–solve–reflect triple; closes that
  always preview ("but what he didn't know...").

## Cross-unit checks (after several chapters)

- **Character table**: per chapter, who appears and with which attributes —
  look for conflicts.
- **Timeline**: dates, seasons, ages, injuries hold.
- **Foreshadowing**: planted lines tracked in `continuity/questions/` or
  `continuity/promises/` pay off or stay open on purpose.
- **Repetition**: is chapter N re-telling N-1 or reusing its structure?
- **Escalation**: does the pressure rise, or does the story spin?

## Cause table (report as "open questions", never as verdicts)

| Symptom | Likely upstream cause |
|---|---|
| later chapters forget setup | context given to the writer lacked records |
| length far under target | target never reached the draft, or output truncated |
| content stayed in chat, not files | the write step never ran |
| a revision overwrote untouched paragraphs | edit scope uncontrolled, no diff check |
