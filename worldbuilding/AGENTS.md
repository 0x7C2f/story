---
title: "Folder Guide: worldbuilding"
---

# Folder Guide: worldbuilding

This folder holds the story world. The world has three kinds of element. Each kind has its own subfolder.

## Contents

- `locations/` holds the places of the world. Read `locations/AGENTS.md`.
- `factions/` holds the groups of the world. Read `factions/AGENTS.md`.
- `artifacts/` holds the important objects of the world. Read `artifacts/AGENTS.md`.
- `_index.md` is the registry of the three subfolders. The CLI writes this file.

## Rules

1. Put each world element in the subfolder that matches its kind.
2. Give every element a kebab-case id in the file name.
3. Run `story reindex .` after you add or remove a file.
4. Update `continuity/state.md` when you change a fact that chapters use.
5. Check `chapters/` before you change a world fact. The prose wins on established facts.

## Do Not

- Do not edit `_index.md` by hand.
- Do not add story prose to this folder. Story prose belongs in `chapters/`.
- Do not add files at this folder's top level except this guide.
