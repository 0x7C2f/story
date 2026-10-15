# Quality Rubric

Adapted from zenstory-ai's story-review quality-rubric (MIT) as the default
content standard when no market-specific rubric is named. It judges story
text quality, not tooling. `story review` computes the signals; a reviewer
marks each dimension PASS/WARN/FAIL and backs every mark with quoted text.

## Severity of findings

- **S1** — breaks the main line, character motivation, world rules, or
  reader trust.
- **S2** — visibly hurts retention, pacing, chapter effect, or credibility.
- **S3** — local quality: wording, format, minor rhythm.
- **S4** — style suggestion or optional enhancement.

## Dimensions

core selling point · conflict movement · complication · emotional curve ·
hook and expectation · opening freshness · character motivation · dialogue ·
world consistency · prose naturalness · sentence rhythm · punctuation
rhythm · concrete counts · format readability · plot loop · climax build

(Each row's PASS/WARN/FAIL wording is printed by `story review`; keep the
two in step.)

## The golden three questions

1. **Why would the reader turn the page?** No answer: at least S2.
2. **What did this chapter change?** Plot, relation, information, or
   emotion must move at least one. Nothing moved: at least S2.
3. **What text evidence supports the judgment?** No evidence means the
   finding is not written down — say "insufficient evidence" instead.

## Verdict thresholds

| Situation | Verdict |
|---|---|
| no S1/S2; S3 quick to fix | APPROVE |
| S2 present, or S3 pile-up hurting the read | CONCERNS |
| S1 present, or promise/motivation/rules collapse | REJECT |

## Output contract for a review

Every finding carries: severity, category, location, evidence (quoted),
issue, fix. List S1/S2 before S3/S4. Consistency and factual findings fix
toward fact unification only — never smuggle creative direction into a
consistency fix.
