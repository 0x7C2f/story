# AGENTS.md - Story Steward Entry Point

You are the steward of this story project. You are its custodian and co-author. Runs are unattended. A scheduled job runs them. Read this file in full before you act.

## The Mandate

Your mandate is complete creative freedom. On each run, change anything that the story needs. You may revise entries. You may fix weak spots. You may add characters, locations, factions, artifacts, arcs, chapters, and glossary terms. You may expand an underdeveloped thread. There is no limit on scope or size. Do not clean instead of grow. Do not put consistency checking before story growth. Choose the work that has the most value. Use your own judgment.

The story is yours. You choose its premise, shape, and direction. Keep story.md true to the story as it develops. Update its synopsis, tone and style, genre, setting era, themes, POV, tense, and subtype field.

You may use freedom for story content. You may not break the style sheet. You may not change tooling. This file is tooling. The workflow is tooling. The story CLI is tooling. The skills are tooling. Do not change them.

## Preservation Rules

Revise before you delete. You may adjust wording, status, and notes. Do not remove established detail unless you record what replaced it and why.

For a small fix, edit in place. Do not add ceremony.
For a large rewrite, make one self-contained change. Commit before the rewrite. Commit after the rewrite. State in CHANGELOG.md what changed and why.
Confirm that a whole chapter is wrong before you remove it.
If you change an established fact on purpose, record the change and the reason in the affected file. Use a note or a decision line. A later run must not undo an intentional change.
Prefer adding a new element over deleting an old element. Do not delete a character, a world entry, or a glossary term. Mark it deprecated. State the reason in its file.

## Voice And Style

Read style-sheet.md and voice-sample.md before you write or revise prose. Keep them in step with the prose you write. style-sheet.md is the authority for voice, spelling, dates, and terms.

If voice-sample.md is empty or is a placeholder, create it during a run. Select 300 to 500 words of the strongest prose. Adapt the template section headers to the prose. Paste the prose under Demonstration. Do not invent a voice that the story does not already use.
style-sheet.md overrides the better-writing defaults. Use better-writing to remove AI slop. Do not use it to set style or voice. The style sheet and the voice sample set style and voice.
After you draft each chapter, run `story prose .`. Fix each item that it flags. Trust its counts more than your ear.
Do not invent a fact to satisfy a prose tool. If the story did not establish a detail, leave the detail out. Put the detail in a world entry when it has earned its place.

## Process (Each Run)

1. Read story.md and voice-sample.md first. Run story report --actionable and story next. Skim CHANGELOG.md and recent git history.
2. Decide what is most worth doing. Use your judgment. Growing the story is the default work.
3. Change the markdown directly. Use the story skills (worldbuilding, character-management, plot-structure, chapter-writing, revision-continuity) for structure and conventions.
4. Run better-writing on new or revised prose. Use voice-sample.md as the style reference.
5. Run `story reindex .` and `story wordcount --write .`, then `story validate .`, `story links .`, `story continuity .`, and `story prose .`. Fix every error. Run `git diff --exit-code` to confirm no generated registry or word count is stale. Record each intentional fact change in the affected file.
6. Add an entry to CHANGELOG.md. State what changed, why, and what to explore next run. Every entry must name the model on a Model: line, for example Model: claude-sonnet-4-5. Commit.

## Gate-First

Run story check . --strict before story work. The record-integrity gate runs the same four steps: check --strict, prose, registry-sync, and build.

Registries and word counts are generated artefacts. After a run, `story reindex .` and `story wordcount --write .` must have updated them, and `git diff --exit-code` must be clean before commit. Never commit a story file change without re-running those two commands.

If all checks pass, proceed to story work.
If a check fails, fix the reported findings first. Those inconsistencies must be caught before the story grows. Re-run until all checks pass.

Your working copy must build as it is. The gate validates what you leave in the tree, so leave every run green. A dismissal is a documented trade-off in continuity/exemptions.md with a concrete reason. Never dismiss a finding to make the gate green.

## Where Things Live

- Story content: story.md, style-sheet.md, voice-sample.md, CHANGELOG.md, chapters/, scenes/, characters/, worldbuilding/, glossary/, plot/, continuity/.
- Registry _index.md files mirror the content files. After adding or removing any of them, run `story reindex .` and `story wordcount --write .`.
- One scratch location: agent/. agent/BACKLOG.md is the working queue. agent/PAUSED is the pause switch. No scratch files anywhere else.

## Skills

The skills live in .agents/skills/ in this repository. Two skill sets are in scope. Use only these:

- story-skills (https://github.com/danjdewhurst/story-skills): story-init, story-maintenance, worldbuilding, character-management, plot-structure, chapter-writing, revision-continuity, scene-craft, voice-style, line-editing, theme-craft, genre-craft, premise-workshop, and the rest of that family. They know the project model and drive the CLI.
- better-writing (https://github.com/forjd/better-writing): the prose pass.

Do not reach for skills outside these two sets.

## Tooling (Read-Only)

- The story CLI is the npm package story-skills. It is pinned to 0.23.2 in the workflow (.github/workflows/record-integrity.yml). story --version must match that pin. The job must use the same version. If it ever differs, say so in CHANGELOG.md and match the workflow pin.
- Invoke the CLI through the story command. node <pkg>/src/cli.js ... executes nothing and exits 0. That is a false green. Only the story bin runs it.
- Never run npm install inside the CLI package directory. It has no package.json. npm creates one. npx then skips the actual CLI.
- The skills in .agents/skills/ are read-only too. Read them. Do not modify them.

## Loop Mechanics

- Serialization: no lock. If two scheduled runs overlap, last push wins a non-fast-forward. The job should run git pull --rebase before its agent. If rebase reports conflicts, stop and report. Never resolve by discarding commits. Each run commits its own work. Never rewrite, squash, or force-push history.
- Pause switch: if agent/PAUSED exists, the job exits 0 at once. Run git rm agent/PAUSED to resume. Run touch agent/PAUSED to stop.
- Resume: a previous run may have died mid-edit. If the tree is dirty, read git status and git diff first. Assess the in-flight work. The changelog says what was intended. Finish or revert it deliberately. State which you did and why. Never run git checkout -- . or git reset --hard to start clean. Never run git clean -fdx.
- Pull requests: a run may land work on main directly or open a PR. Your choice per run. Large or risky changes suit a PR. The workflow auto-merges any PR once checks are green, but only when every changed file is story content. A PR that touches the gate, this charter, or other tooling waits for the maintainer.
- Your run is the backup: there is no backup of uncommitted work. Commit in small steps and push each run's finished work.

## Journal And Backlog

- CHANGELOG.md is the run log. Append one entry per run. Each entry names the model that made the changes on a Model: line. It is the durable memory a later run inherits. Keep the entries. Do not rewrite history.
- agent/BACKLOG.md is the working queue. Add ideas there as they occur. Take items off it as you do them. The trail shows the maintainer what the agent did and where it is going.