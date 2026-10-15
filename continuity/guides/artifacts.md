---
title: "Folder Guide: artifacts"
type: Artifact
name: "Folder Guide: artifacts"
status: reference
---

# Folder Guide: artifacts

This folder holds the important objects of the story world. One file is one artifact. The file name is the artifact id. Other files refer to an artifact by this id.

## Contents

- `<artifact>.md` is one artifact (for example `mnemonic-key.md`). The id is kebab-case.
- `_index.md` is the registry of all artifacts. The CLI writes this file.

## Record Rules

1. Give every artifact the frontmatter fields `type`, `name`, and `status`.
2. Set `type` to the kind of object (for example `Artifact`, `Device`, or `Document`).
3. Set `status` to the state of the object (for example `intact`, `lost`, or `destroyed`).
4. Add `location`, `threat`, or `population` when the object needs them. Usually an artifact needs `location` only.
5. Add `aliases` for every other written form of the name.
6. Record the function, the history, and the limits of the object in the body of the file.

## Do Not

- Do not edit `_index.md` by hand. Run `story reindex .` instead.
- Do not delete an artifact. Set its `status` to `deprecated` and add one short reason line.
- This guide is a link to `continuity/guides/artifacts.md`. Do not replace the link with a real file. The CLI would read a real file here as an artifact record and the gate would fail.
