---
title: "Folder Guide: locations"
type: Location
name: "Folder Guide: locations"
status: reference
---

# Folder Guide: locations

This folder holds the places of the story world. One file is one place. The file name is the place id. Other files refer to a place by this id.

## Contents

- `<place>.md` is one place (for example `nexus-archives.md`). The id is kebab-case.
- `_index.md` is the registry of all places. The CLI writes this file.

## Record Rules

1. Give every place the frontmatter fields `type`, `name`, and `status`.
2. Set `type` to the kind of place (for example `Location`, `District`, or `Landmark`).
3. Set `status` to the state of the place (for example `active`, `ruined`, or `unknown`).
4. Add `region`, `population`, or `threat` when the place needs them.
5. Add `aliases` for every other written form of the name.
6. Check the place against `chapters/` before you change a fact the chapters use.

## Do Not

- Do not edit `_index.md` by hand. Run `story reindex .` instead.
- Do not delete a place. Set its `status` to `deprecated` and add one short reason line.
- This guide is a link to `continuity/guides/locations.md`. Do not replace the link with a real file. The CLI would read a real file here as a location record and the gate would fail.
