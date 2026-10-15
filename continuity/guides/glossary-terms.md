---
title: "Folder Guide: glossary terms"
term: "Folder Guide: glossary terms"
---

# Folder Guide: glossary terms

This folder holds the glossary of the story. One file is one term. The file name is the term id. A chapter uses the term in the same written form every time.

## Contents

- `<term>.md` is one term (for example `batch-protocol.md`). The id is kebab-case.
- `_index.md` is the registry of all terms. The CLI writes this file.

## Record Rules

1. Give every term the frontmatter field `term`. The field holds the written form of the term.
2. Set `category` to one word that groups the term (for example `term`, `system`, or `title`).
3. Write `definition` in one or two short sentences.
4. Add `aliases` for every other written form of the term.
5. Check the term against `style-sheet.md`. The style sheet wins on spelling and usage.

## Do Not

- Do not edit `_index.md` by hand. Run `story reindex .` instead.
- Do not use a term in a chapter before you define it here.
- Do not delete a term. Set its `status` to `deprecated` and add one short reason line.
- This guide is a link to `continuity/guides/glossary-terms.md`. Do not replace the link with a real file. The CLI would read a real file here as a glossary record and the gate would fail.
