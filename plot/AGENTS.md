---
title: "Folder Guide: plot"
type: guide
---

# Folder Guide: plot

This folder holds the structure of the story.

## Contents

- `timeline.md` is the chronology of the story world. Keep dates and order there.
- `_index.md` is the registry of plot arcs. The CLI writes this file.

## Rules

1. Keep `timeline.md` current when chapters establish new dates or order.
2. Plan arcs in `arcs/` when the story grows past one arc file. One file is one arc.
3. Run `story reindex .` after you add or remove a file.
4. Follow the narrative craft rules in the project charter for chapter and scene work.

## Do Not

- Do not edit `_index.md` by hand.
- Do not add story prose to this folder. Story prose belongs in `chapters/`.
