---
title: "Folder Guide: promises"
---

# Folder Guide: promises

This folder tracks the story promises. A promise is a setup that must pay off. One file is one promise.

## Contents

- `<promise-id>.md` is one promise. The id is kebab-case.
- `_index.md` is the registry of all promises. The CLI writes this file.

## Record Rules

1. Give every file the frontmatter field `status`. Use `planted` or `paid-off`.
2. Write the promise as the first heading of the file.
3. Name the chapter that plants the promise.
4. Name the chapter that pays the promise off when the status changes to `paid-off`.

## Do Not

- Do not edit `_index.md` by hand. Run `story reindex .` instead.
- Do not delete a promise before it pays off.
- This guide is a link to `continuity/guides/promises.md`. Do not replace the link with a real file. The CLI would read a real file here as a promise record and the gate would fail.
