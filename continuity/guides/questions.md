---
title: "Folder Guide: questions"
---

# Folder Guide: questions

This folder tracks the open questions of the story. One file is one question. A question stays open until a chapter answers it.

## Contents

- `<question-id>.md` is one open question. The id is kebab-case.
- `_index.md` is the registry of all questions. The CLI writes this file.

## Record Rules

1. Give every file the frontmatter field `status`. Use `open` or `resolved`.
2. Write the question as the first heading of the file.
3. Record the answer in the body when the status changes to `resolved`.
4. Name the chapter that answers the question.

## Do Not

- Do not edit `_index.md` by hand. Run `story reindex .` instead.
- Do not delete a question. Set its `status` to `resolved` and keep the answer.
- This guide is a link to `continuity/guides/questions.md`. Do not replace the link with a real file. The CLI would read a real file here as a question record and the gate would fail.
