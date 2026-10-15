---
title: "Folder Guide: characters"
name: "Folder Guide: characters"
role: reference
status: reference
---

# Folder Guide: characters

This folder holds the cast. One file is one character profile. The file name is the character id. Other files refer to a character by this id.

## Contents

- `<name>.md` is one profile (for example `elias-thorne.md`). The id is kebab-case.
- `_index.md` is the registry of all characters. The CLI writes this file.

## Record Rules

1. Give every profile the frontmatter fields `name`, `role`, and `status`.
2. Set `role` to `protagonist`, `antagonist`, or `supporting`.
3. Set `status` to `alive`, `dead`, `missing`, `unknown`, or `deprecated`.
4. Write these sections in every profile: Appearance, Personality & Traits, Backstory, Motivations & Goals, Voice & Speech Patterns, Character Arc, Timeline.
5. Delete every `Add ...` placeholder line before you finish.
6. Update `continuity/state.md` when a fact about a character changes.

## Voice Rules

1. Write the Voice & Speech Patterns section before the first line of dialogue.
2. Give each character a distinct voice. Follow the Character Voices list in `style-sheet.md`.
3. Check the voice sections before you revise dialogue in `chapters/`.

## Do Not

- Do not edit `_index.md` by hand. Run `story reindex .` instead.
- Do not delete a profile. Set its `status` to `deprecated` and add one short reason line.
- This guide is a link to `continuity/guides/characters.md`. Do not replace the link with a real file. The CLI would read a real file here as a character record and the gate would fail.
