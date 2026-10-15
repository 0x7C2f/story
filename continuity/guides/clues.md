---
title: "Folder Guide: clues"
---

# Folder Guide: clues

This folder tracks the clues of the mystery. One file is one clue. The story is a mystery, so every clue needs a plant and a reveal.

## Contents

- `<clue-id>.md` is one clue. The id is kebab-case.
- `_index.md` is the registry of all clues. The CLI writes this file.

## Record Rules

1. Give every file the frontmatter field `status`. Use `planted`, `revealed`, or `red-herring`.
2. Write the clue as the first heading of the file.
3. Name the chapter that plants the clue.
4. Name the chapter that reveals the clue.
5. Mark a false lead as `red-herring`. Keep the reason in the body.

## Do Not

- Do not edit `_index.md` by hand. Run `story reindex .` instead.
- Do not reveal a clue before you plant it.
- Do not delete a clue. Set its `status` to `revealed` and keep the record.
- This guide is a link to `continuity/guides/clues.md`. Do not replace the link with a real file. The CLI would read a real file here as a clue record and the gate would fail.
