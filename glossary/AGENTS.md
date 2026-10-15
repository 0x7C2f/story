---
title: "Folder Guide: glossary"
term: "Folder Guide: glossary"
---

# Folder Guide: glossary

This folder holds the glossary of the story and its registry.

## Contents

- `terms/` holds one term per file. Read `terms/AGENTS.md`.
- `_index.md` is the registry of the terms. The CLI writes this file.

## Rules

1. Add new terms to `terms/`.
2. Use each term in the same written form in every chapter.
3. Run `story reindex .` after you add or remove a term.
4. Check `style-sheet.md` before you change spelling or usage. The style sheet wins.

## Do Not

- Do not edit `_index.md` by hand.
- Do not use a term in a chapter before you define it in `terms/`.
- Do not add files at this folder's top level except this guide.
