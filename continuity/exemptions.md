---
type: exemption-log
story: untitled
exemptions:
  - code: stray-file
    pattern: "CHANGELOG.md is not part of the story project model"
    reason: Log file for automated agent runs. Tooling, not record.

  - code: stray-file
    pattern: "AGENTS.md is not part of the story project model"
    reason: The agent entry point — the steward charter for any agent pointed at this repository. Tooling, not record.
  - code: stray-file
    pattern: "voice-sample.md is not part of the story project model"
    reason: The voice sample is the style source of truth — the quick-read companion to style-sheet.md (root, beside it on purpose). Tooling, not record.
  - code: stray-file
    pattern: "index.md is not part of the story project model"
    reason: GitHub Pages entry point — static site root. Tooling, not record.
  - code: symlinked-file
    pattern: "AGENTS.md is a symlink"
    reason: The folder guides in record folders are tooling, not record. Each is a link to its text in continuity/guides/, so the record scanner ignores it and the registries, word counts, and gates stay clean.
---

# Exemptions

Findings this record has decided are intentional. Each entry names the
finding it dismisses and why; `story check` reports matched findings as
dismissed rather than passing them over. Never add an entry just to make the
gate green; fix the finding instead.
engineering-leakage: Exemption for plot files which use a structural table for foreshadowing that happens to match an AI structural signature.

plot/arcs/memory-liberation.md: The table format uses structural headings 'Planted' and 'Payoff' which are required by the arc template. Exemption for engineering-leakage.
plot/arcs/vane-countermove.md: The table format uses structural headings 'Planted' and 'Payoff' which are required by the arc template. Exemption for engineering-leakage.
