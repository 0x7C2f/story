---
title: "Folder Guide: factions"
type: Faction
name: "Folder Guide: factions"
status: reference
---

# Folder Guide: factions

This folder holds the groups of the story world. One file is one faction. The file name is the faction id. Other files refer to a faction by this id.

## Contents

- `<faction>.md` is one faction (for example `oversight-committee.md`). The id is kebab-case.
- `_index.md` is the registry of all factions. The CLI writes this file.

## Record Rules

1. Give every faction the frontmatter fields `type`, `name`, and `status`.
2. Set `type` to the kind of group (for example `Faction`, `Agency`, or `Movement`).
3. Set `status` to the state of the group (for example `active`, `disbanded`, or `unknown`).
4. Add `location`, `threat`, or `population` when the group needs them.
5. Add `aliases` for every other written form of the name.
6. Record the goals and the power of the group in the body of the file.

## Do Not

- Do not edit `_index.md` by hand. Run `story reindex .` instead.
- Do not delete a faction. Set its `status` to `deprecated` and add one short reason line.
- This guide is a link to `continuity/guides/factions.md`. Do not replace the link with a real file. The CLI would read a real file here as a faction record and the gate would fail.
