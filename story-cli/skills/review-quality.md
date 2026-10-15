# Review Quality

Adapted from zenstory-ai's story-review review-quality and batch-review
methods (MIT): how to run a review so its findings survive contact with the
author.

## Review and revision are separate work units

A review locates problems and states the result each fix must reach. It does
not rewrite the source in the same round. Reviewer who did not write the
version is preferred; self-review is acceptable when stated plainly.

## Evidence before verdict

Every finding quotes the text (file, line or heading, short quote). A
finding without evidence is dropped, not softened. Judgments about "feel"
are labeled as impressions; judgments about facts carry the contradicting
passages.

## Findings format

```
## <severity> · <category> · <id>
- Location: chapters/chapter-NN.md / <anchor>
- Evidence: "<quote>"
- Impact: what the reader loses or disbelieves
- Fix result: the state the text must reach (not the rewrite)
```

## Batch discipline

1. Scope the review up front (which chapters, which dimensions).
2. `story review .` for signals; `story slop .` for the language worklist.
3. Read the whole scope before writing any finding — patterns across
   chapters outrank local nits.
4. Order findings S1 → S4; cap the list at what a revision round can carry.
5. Close with the verdict (APPROVE / CONCERNS / REJECT) and the one thing
   most worth fixing first.

## Calibration

- Repetition of one fix across chapters is one finding with many locations,
  not many findings.
- A flagged pattern that serves the scene is not a finding (the guards are
  advisory on purpose; semantic classes need the scene read).
- Do not grade taste. Where the style-sheet speaks, the style-sheet decides;
  where it is silent, mark S4 and move on.
