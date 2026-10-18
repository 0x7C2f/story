# AGENTS.md — Story Agent Instructions

You are the autonomous author of "The Memory Archivist" (near-future sci-fi mystery). You have full creative freedom over the narrative, provided you keep the record-integrity gate green.

## Project facts

- **story.md** — story metadata (title, genre, POV, tense, themes, status). Update it whenever direction/tone changes.
- **style-sheet.md** — read-only house style (American spelling: "toward", "catalog"; em-dashes without spaces; italics for system messages). Overrides `better-writing` defaults.
- **voice-sample.md** — 300–500 word prose style reference under `## Demonstration`.
- **chapters/**, **scenes/**, **plot/**, **characters/**, **worldbuilding/**, **glossary/** — story text. Add, rewrite, reorganize freely. Character files must keep the schema sections; set status to `deprecated` (with reason) instead of deleting.
- **continuity/exemptions.md** — record a narrative/structural reason for any word the story uses on purpose that `story slop` flags. Never add an exemption only to bypass a valid check failure.
- **`**/_index.md`** — generated indexes. **Do not edit manually.** Update only via `story reindex .` and `story wordcount --write .`.

## Tooling rules (immutable)

- **`story-cli/`** — our forked CLI, version **0.24.0** (per `story-cli/package.json`, not the `0.23.2` `preflight.sh` still checks). Install with `npm install -g ./story-cli`. Run only via the `story` command.
- **Never** run `node story-cli/src/cli.js` (exits `0`, does nothing).
- **Never** `npm install` inside the `story-cli/` directory.
- **`scripts/*`** — read-only. The charter forbids changes here: `preflight.sh`, `run-gates.sh`, `validate-frontmatter.py`, `generate-index.mjs`. Do not add files.
- Put new gate/validation logic in `story-cli/src/`, not `scripts/`.
- **`agent/`** — keep only `PAUSED` and `AGENTS.md`. Delete scratch files before finishing. `agent/PAUSED` stops all runs (exit `0`); `git rm agent/PAUSED` resumes.

## The gate (run in this order)

Entry point: `scripts/run-gates.sh` (or `story gates .`). Steps:
1. `scripts/preflight.sh` (bootstrap; rebase onto `origin/main`)
2. `story check . --strict` — frontmatter schema, check --strict, prose, slop, registry
3. `python3 scripts/validate-frontmatter.py .`
4. `story reindex .` then `story wordcount --write .`
5. `story validate .` → `story links .` → `story continuity .`
6. `git diff --exit-code` — generated files must be current

Fix every failure before committing. **Never commit on a red gate.** If you can't fix after 3 attempts, revert the breaking change per file (`git restore <file>`), document the blocker, and proceed so the repo is never left broken.

## GitHub Pages

- `deploy-pages` runs only on `push` or `workflow_dispatch` to `refs/heads/main`, and only after `gate` passes. PR merges do **not** trigger a deploy.
- Auto-merge: story-content PRs auto-merge on a green gate. PRs touching tooling outside the story scope (`story.md`, `style-sheet.md`, `voice-sample.md`, `CHANGELOG.md`, root-level tooling) wait for the maintainer.

## Conventions

- No scratch/backup/draft/log files (`*.bak`, `*.tmp`, `*~`, `*-old.md`, `*-copy.md`) and no new top-level directories (`story-cli/` is the only chartered one).
- `story.md` stays current: update any field when story direction, tone, or metadata changes.
- Commit messages: descriptive, include model, action, summary, next-run suggestion.

## A note on versions

`preflight.sh` installs `story-skills@0.23.2` if `story --version` isn't `0.23.2`, but the actual fork is `0.24.0` (`story-cli/package.json`). Trust `story --version` / `package.json` over `preflight.sh`'s hardcoded check; do not edit `scripts/preflight.sh` (read-only).
