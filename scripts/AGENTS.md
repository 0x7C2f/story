---
title: "Folder Guide: scripts"
---

# Folder Guide: scripts

This folder holds the automation of the repository. It guards the record.

## Contents

- `preflight.sh` prepares a run. It runs `git pull --rebase`.
- `run-gates.sh` runs every verification gate in order.
- `validate-frontmatter.py` checks the frontmatter keys of the story files.

## Rules

1. Treat this folder as read-only. The project charter forbids changes here.
2. Run `scripts/run-gates.sh` before every commit.
3. Fix every gate failure before you commit.
4. Read the script output. Each failure names the file and the fix.

## Do Not

- Do not change these scripts.
- Do not add files to this folder.
- Do not commit when a gate fails.
