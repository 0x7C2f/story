---
title: "Folder Guide: chapters"
number: 0
pov: reference
status: reference
word-count: 0
---

# Folder Guide: chapters

This folder holds the finished story text. One file is one chapter of *The Memory Archivist*.

## Contents

- `chapter-NN.md` is one chapter. The file name sets the chapter number.
- `_index.md` is the registry of all chapters. The CLI writes this file.

## Record Rules

1. Give every chapter the frontmatter fields `title`, `number`, `pov`, `status`, and `word-count`.
2. Keep `number` equal to the number in the file name.
3. Set `pov` to the id of the point-of-view character in `characters/`. Use `none` for an interlude.
4. Set `status` to `outline`, `draft`, or `final`.
5. Update `word-count` with `story wordcount --write .`.

## Prose Rules

1. Read `style-sheet.md` before you draft or revise.
2. Keep `voice-sample.md` as the style reference.
3. End every chapter on action, dialogue, or an open problem. Do not end on a summary.
4. Resolve no major conflict in the chapter that introduces it.
5. Read the Voice & Speech Patterns section of a character before you write their dialogue.

## Commands

- `story prose .` checks the prose. Fix every finding.
- `story build .` builds the book.

## Do Not

- Do not edit `_index.md` by hand. Run `story reindex .` instead.
- Do not add scratch files or backup copies to this folder.
- This guide is a link to `continuity/guides/chapters.md`. Do not replace the link with a real file. The CLI would read a real file here as chapter 0 and the gate would fail.
