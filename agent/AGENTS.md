---
title: "Folder Guide: agent"
---

# Folder Guide: agent

This folder controls the autonomous run. It holds run state only.

## Contents

- `PAUSED` is the stop file. When it exists, the agent must exit at once.

## Rules

1. Check for `agent/PAUSED` at the start of every run.
2. Exit with code 0 when `agent/PAUSED` exists.
3. Run `touch agent/PAUSED` to stop future runs.
4. Run `git rm agent/PAUSED` to resume the runs.
5. Delete every other file from this folder before you finish a run.

## Do Not

- Do not store scratch files or notes in this folder.
- Do not remove `AGENTS.md` or `PAUSED` without a charter change.
