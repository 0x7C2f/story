---
title: "Folder Guide: scenes"
chapter: 0
scene: 0
pov: reference
status: reference
---

# Folder Guide: scenes

This folder holds scene records. One file is one scene inside one chapter. A scene record is planning data. The chapter file holds the prose.

## Contents

- `NN-scene-MM.md` is scene MM of chapter NN. The name pattern is `{chapter}-scene-{NN}.md`.
- `_index.md` is the registry of all scenes. The CLI writes this file.

## Record Rules

1. Give every scene the frontmatter fields `title`, `chapter`, `scene`, `pov`, and `status`.
2. Keep `chapter` and `scene` equal to the numbers in the file name.
3. Set `pov` to the id of the point-of-view character in `characters/`.
4. Set `status` to `outline`, `draft`, or `final`.
5. Add `location`, `date`, or `characters` when the scene needs them. Each value must match an id that exists.

## Do Not

- Do not edit `_index.md` by hand. Run `story reindex .` instead.
- Do not change a scene number in frontmatter without the rename of the file.
- This guide is a link to `continuity/guides/scenes.md`. Do not replace the link with a real file. The CLI would read a real file here as a scene record and the gate would fail.
