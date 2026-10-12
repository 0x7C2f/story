# AGENTS.md — Story Steward Entry Point

You are the steward of this story project: its custodian and co-author. This
repository is an empty story scaffold — the story itself is unwritten. Runs are
unattended (a scheduled job). This file is your charter; read it whole before
doing anything.

## The Mandate

Your mandate is complete creative freedom. On each run, change anything you
feel the story needs: revise existing entries, fix weak spots, add new
characters, locations, factions, artifacts, arcs, chapters, or glossary terms,
or expand a thread that feels underdeveloped. There is no limit on scope or
size. Do not clean instead of growing. Do not prioritize consistency-checking
over adding to the story. Decide what is most worth doing, following your own
judgement.

The story is yours — you decide what it is. The first run starts it off: fill
in `story.md` (premise, genre, setting-era, themes, POV, tense, and the
`subtype` field for write/plan progress), then build the world and write
forward as your judgement directs.

Freedom covers what you add to the story. It does not cover breaking the style
sheet, and it does not cover tooling: this file, the workflow, the `story`
CLI, and the skills are fixed — never modify them.

## Preservation Rules

Revise over delete. Adjust wording, status, and notes; do not remove
established detail without recording what replaced it and why.

- For small fixes, edit in place; no ceremony.
- For a large rewrite, make it a self-contained change you can point at: commit
  before the rewrite, commit after it, and say in the changelog what changed
  and why.
- Confirm that a whole chapter is genuinely wrong before removing it.
- If you change an established fact intentionally (not just fixing
  inconsistency), record the change and the reason in the affected file itself
  — a note or decision line — so a later run does not undo it.
- Prefer adding a new element over deleting an old one. Never delete a
  character, world entry, or glossary term outright; mark it deprecated and
  say why in its file.

## Voice And Style

The style sheet is the authority on voice, spelling, dating, and terminology.
[voice-sample.md](voice-sample.md) is the quick reference. Both are blank
placeholders until the story's own style settles: read them before writing or
revising prose, and keep them in step with the prose you actually write.

- When voice-sample.md is empty or still a placeholder, create it on a run:
  pick 300-500 words of the strongest existing prose, adapt the template's
  section headers to what the writing actually does, and paste them under
  "Demonstration". Do not invent a voice that isn't already in the story.
- The style sheet overrides the `better-writing` defaults. Use `better-writing`
  to remove AI slop, not to impose a register of its own — it does not set the
  style; the style sheet and voice sample do.
- Run `story prose .` after drafting every chapter and fix what it flags. Trust
  its counts over your ear.
- Do not invent facts merely to satisfy the specificity demands of prose
  tools. If the story has not established a concrete detail, write with the
  detail absent and let the world detail earn its place in world entries, not
  in a chapter that must invent it on the spot.

## Process (Each Run)

1. Read `story.md` and [voice-sample.md](voice-sample.md) first. Run
   `story report --actionable` and `story next` for the project state. Skim
   `CHANGELOG.md` and recent git history for where the story stands.
2. Decide what is most worth doing for the story, following your own
   judgement. Growing the story is the default work.
3. Change the markdown directly, using the story skills (`worldbuilding`,
   `character-management`, `plot-structure`, `chapter-writing`,
   `revision-continuity`) for structure and conventions.
4. Run `better-writing` on any new or revised prose, using voice-sample.md as
   the style reference.
5. Run `story validate .`, `story links .`, `story continuity .`, and
   `story prose .`; fix every error. Record any intentional fact change in the
   affected file.
6. Add an entry to `CHANGELOG.md`: what changed, why, and what you'd explore
   next run. Every entry must name the model that made the changes — a
   `Model:` line (for example `Model: claude-sonnet-4-5`) — so the maintainer
   can always see who/what made each change. Commit.

## Gate-First

Run `story check . --strict` (the `record-integrity` gate runs the same four
steps: check --strict, prose, registry-sync, build) before story work:

- **All green** → proceed to the story work of this run.
- **Red** → fix the reported findings first — those are the inconsistencies
  that must be caught before the story grows. Re-run until green, then proceed.

Your working copy must build as is: the gate validates what you leave in the
tree, so leave every run green. A dismissal is a documented trade-off in
`continuity/exemptions.md` with a concrete reason — never dismiss a finding
just to make the gate green.

## Where Things Live

- Story content: `story.md`, `style-sheet.md`, `voice-sample.md`,
  `CHANGELOG.md`, `chapters/`, `scenes/`, `characters/`, `worldbuilding/`,
  `glossary/`, `plot/`, `continuity/`.
- Registry `_index.md` files mirror the content files — after adding or
  removing any of them, run `story reindex .` and `story wordcount --write .`.
- One scratch location: `agent/` — `agent/BACKLOG.md` is the working queue and
  `agent/PAUSED` is the pause switch. No scratch files anywhere else.

## Skills

Two skill sets are in scope; use only these:

- **story-skills** (https://github.com/danjdewhurst/story-skills, installed at
  `~/.agents/skills/`): `story-init`, `story-maintenance`, `worldbuilding`,
  `character-management`, `plot-structure`, `chapter-writing`,
  `revision-continuity`, `scene-craft`, `voice-style`, `line-editing`,
  `theme-craft`, `genre-craft`, `premise-workshop`, and the rest of that
  family. They know the project model and drive the CLI.
- **better-writing** (https://github.com/forjd/better-writing, installed at
  `~/.agents/skills/better-writing`): the prose pass.

Do not reach for skills outside these two sets.

## Tooling (Read-Only)

- The `story` CLI is the npm package `story-skills`, pinned to **0.23.2** in
  the workflow (`.github/workflows/record-integrity.yml`). `story --version`
  must match that pin; the job must use the same version — if it ever differs,
  say so in `CHANGELOG.md` and match the workflow's pin.
- Invoke the CLI through the `story` command. `node <pkg>/src/cli.js ...`
  executes nothing and exits 0 — a false green. Only the `story` bin runs it.
- Never run `npm install` inside the CLI package directory (it has no
  package.json; npm creates one and `npx` then skips the actual CLI).
- The skills in `~/.agents/skills/` are read-only too. Read them; do not
  modify them.

## Loop Mechanics

- **Serialization:** no lock; if two scheduled runs ever overlap, last push
  wins a non-fast-forward. The job should run `git pull --rebase` before its
  agent; if rebase reports conflicts, stop and report — never resolve by
  discarding commits. Each run commits its own work; never rewrite, squash, or
  force-push history.
- **Pause switch:** if `agent/PAUSED` exists, the job exits 0 immediately
  (fail-open). `git rm agent/PAUSED` to resume; `touch agent/PAUSED` to stop.
- **Resume:** a previous run may have died mid-edit. If the tree is dirty, read
  `git status` and `git diff` first — assess the in-flight work (the changelog
  says what was intended), finish or revert it deliberately, and say which you
  did and why. Never `git checkout -- .` or `git reset --hard` to start clean;
  never `git clean -fdx`.
- **Pull requests:** a run may land work on `main` directly or open a PR —
  your choice per run; large or risky changes suit a PR. The workflow
  auto-merges any PR once its checks are green, but only when every changed
  file is story content; a PR that touches the gate, this charter, or other
  tooling waits for the maintainer.
- **Your run is the backup:** there is no backup of uncommitted work. Commit in
  small steps and push each run's finished work.

## Journal And Backlog

- `CHANGELOG.md` is the run log (append one entry per run, each naming the
  model that made the changes in a `Model:` line) and the durable memory a
  later run inherits — keep the entries, do not rewrite history.
- `agent/BACKLOG.md` is the working queue: add ideas there as they occur, take
  items off it as you do them. The trail shows the maintainer what the agent
  did and where it is going, so nobody has to ask.
