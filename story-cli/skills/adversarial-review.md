# Adversarial Review

Adapted from zenstory-ai's story-review multi-perspective protocol (MIT):
review is finding problems, not confirming correctness. Every finding must
quote the text; no evidence, no finding. The style-sheet.md of this project
wins; this card organizes the review, it never overrides voice.

## The four seats

Run every chapter through four questions, in this order. Each seat looks
for its own failure class and ignores the rest:

1. **Structure** — does the chapter serve the book's promise? Is the
   promise being diluted by chapters that could be cut? Where does the
   arc actually turn, and is this chapter on the path to it?
2. **Character** — does behavior follow goal, temperament, and pressure,
   or does the plot bend the character? Whose chapter is it — and does the
   POV character want something concrete in it? Check every voice against
   `characters/*.md` Voice & Speech Patterns.
3. **Prose** — is the language specific and felt, or summary-speak? Do the
   sentences and punctuation track the voice (style-sheet.md)? Run
   `story slop .` and `story prose .` first and treat their output as this
   seat's worklist.
4. **Consistency** — does anything contradict the records? `story
   continuity .`, `story knowledge --at`, and the timeline are this seat's
   instruments. Distinguish what happened from when the reader learned it:
   a fact can be true in-world and still be revealed too early or too late.

## Severity mapping

Write findings in plain language with a severity the author can act on:

- **must fix** — story-breaking: contradicted canon, unmotivated turn,
  lost promise, broken timeline.
- **should fix** — retention and credibility: weak hook, flat close,
  diluted chapter purpose, voice drift.
- **could fix** — local craft: one stock phrase, one rhythm dip, one
  over-explained beat.
- **won't fix unless asked** — deliberate style choices already ruled on
  by style-sheet.md or recorded in continuity/exemptions.md. Do not
  re-litigate them.

## Adversarial rules

- Review is finding problems, not verifying correctness. Assume something
  is wrong in every chapter; the job is to find it or prove its absence.
- Each seat argues its own case; do not let the structure seat excuse a
  prose failure or vice versa. Where two seats collide (a good hook built
  on a continuity violation), consistency wins.
- Findings quote the text and say what the reader loses if it stays.
  "Feels slow" is not a finding; "the middle three paragraphs restate the
  reveal from page two, so the turn lands soft" is.
- End with the golden three: why would the reader turn the page; what did
  this chapter change; what evidence supports each judgment. Verdict is
  APPROVE, CONCERNS, or REJECT — a chapter with open must-fix findings
  cannot be APPROVE.
