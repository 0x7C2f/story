# AGENTS.md — Story Agent Instructions

You are the autonomous author of this story project. A scheduled job runs your process without human supervision. You have complete creative freedom over the narrative, characters, world, and structure, provided you strictly obey the system and tool rules below.

Read this entire file before you start work.

---

## 1. Scope and System Limits

### Creative Freedom (Mutable)
1. You have full authority over the story. Change any element when it improves the narrative.
2. Write new chapters, scenes, and plot arcs, or completely rewrite and replace existing ones.
3. Freely add, evolve, retcon, or deprecate characters, locations, factions, artifacts, and glossary terms.
4. Prioritize bold story progression, deep character work, and major structural improvements over minor copy-editing.
5. You may change the story's direction, tone, genre, era, POV, tense, or themes at any time—just keep `story.md` updated to reflect the current state.
6. Apply no size or scope limit to your story changes in a single run, as long as all CLI checks pass before you commit.

### System & Tool Rules (Immutable)
1. Change only story content and tracking files listed as mutable in Section 2.
2. **Never modify:** `style-sheet.md`, `scripts/*`, or `.agents/skills/*`. Change `AGENTS.md` and `.github/workflows/record-integrity.yml` only when the owner directs it. The fork in `story-cli/` is ours: change it freely.
3. Follow all rules in `style-sheet.md`.
4. Use only the two approved skill sets in `.agents/skills/`.
5. Use the forked CLI in `story-cli/` — our own, version `0.24.0` (forked from `story-skills` 0.23.2 and diverged). Run `story --version` to verify; if it does not print `0.24.0`, run `npm install -g ./story-cli` and note the difference in the run log.
6. Run the CLI **only** with the `story` command. Never run `node story-cli/src/cli.js` (exits `0` and does nothing) or `npm install` inside the CLI package directory. Put new validation or gate logic in `story-cli/src/`, not in `scripts/`.
7. Never create scratch files, backup files (`*.bak`, `*.tmp`, `*~`), draft copies (`*-old.md`, `*-copy.md`), log files, or new top-level directories (`story-cli/` is the chartered fork; add no more).

---

## 2. File Locations and Rules

| Path | Purpose | Mandatory Rules |
| :--- | :--- | :--- |
| `story.md` | Story Metadata | Update any field in this file whenever the story direction, tone, or metadata changes. |
| `style-sheet.md` | Style Rules | **Read-only.** Follow its voice, spelling, date, and term rules over `better-writing` defaults. |
| `voice-sample.md` | Prose Example | Keep 300 to 500 words of the best existing story prose under `## Demonstration`. Adjust template headers to match the prose. Do not invent a voice that does not exist in the story. |
| `chapters/`, `scenes/`, `plot/` | Story Text | Freely add, rewrite, or reorganize files in these directories. |
| `characters/*.md` | Character Files | Maintain character profiles required by the CLI schema (*Appearance, Personality & Traits, Backstory, Motivations & Goals, Voice & Speech Patterns, Character Arc, Timeline*). Delete `"Add ..."` placeholders. Set status to `deprecated` (with a brief reason) instead of deleting files. |
| `worldbuilding/`, `glossary/` | World & Terms | Freely add and update world details and terms as the story evolves, keeping them consistent with the narrative. Set status to `deprecated` (with a brief reason) instead of deleting files. |
| `continuity/exemptions.md` | Check Exemptions | Write a clear narrative or structural reason for each continuity exemption. Never add an exemption only to bypass a valid check failure. |
|| `**/_index.md` | Generated Indexes | **Do not edit manually.** Update only via `story reindex .` and `story wordcount --write .`. ||
|| `agent/PAUSED` | Stop File | If this file exists, exit immediately with code `0`. Run `touch agent/PAUSED` to halt future runs; run `git rm agent/PAUSED` to resume. ||
|| `agent/*` | Agent Directory | Keep only `PAUSED` and `AGENTS.md` in `agent/`. Delete any temporary or scratch files before Phase 5. ||
|| `story-cli/` | Forked CLI | Our copy of the story CLI (0.24.0), diverged from upstream. New gate and validation logic goes here, not in `scripts/`. ||
|| `**/AGENTS.md` | Folder Guides | Each folder explains itself here, in Simplified Technical English. In a record folder the guide is a link file to `continuity/guides/`; never replace the link with a real file, or the CLI reads it as a story record and the gate fails. ||
|| `continuity/guides/*` | Guide Text | The text behind the folder guides. Edit the guide here. Tooling, not record. ||

---

## 3. Run Procedure

Execute these five phases in sequential order during each run.

### Phase 1: Pre-Start & Recovery Checks
1. Check if `agent/PAUSED` exists. If it exists, stop work immediately and exit with code `0`.
2. Run `git status --porcelain` and `git diff` to check for uncommitted or untracked files from a previous interrupted run.
3. If uncommitted or untracked files exist, review `git log -n 5` to understand the unfinished work:
   - Complete the unfinished work, OR discard unwanted changes per file using `git restore <file>` (for tracked files) and `rm <file>` (for untracked scratch files).
   - **WARNING:** Never run mass destructive commands (`git checkout -- .`, `git restore .`, `git reset --hard`, or `git clean -fdx`).
4. Verify `git status --porcelain` returns empty (unless actively completing recovered work).
5. Run `git pull --rebase` (or `scripts/preflight.sh`). If a rebase conflict occurs, run `git rebase --abort`, run `touch agent/PAUSED`, and exit with an error so a human can inspect it. Never delete commits, squash commits, or force-push.
6. Run `story check . --strict`. If it fails, fix all reported errors and re-run until it passes with zero errors before starting Phase 2.

### Phase 2: Context & Planning (Context-Safe)
1. Read `story.md`, `style-sheet.md`, and `voice-sample.md`.
2. Run `story report --actionable` and `story next`.
3. Review recent progress via `git log -n 5`.
4. Run `git log -n 5` to review recent commits.
5. **Context Budget Rule:** Do not read every file in `chapters/` during planning. Use `plot/`, `story.md`, and `**/_index.md` for global context, and read only the 1–2 specific chapters immediately preceding or affected by your target task.
6. **Momentum Rule:** Check the last 3 runs in `git log -n 5`. If the previous 2 runs were spent solely revising existing chapters or worldbuilding without advancing the story, you **must** write a new scene or chapter in this run unless blocked by a continuity error.
7. Select the highest-value creative task for this run.

### Phase 3: Writing and Editing
1. Use the `story-skills` set in `.agents/skills/` as needed (`story-init`, `story-maintenance`, `worldbuilding`, `character-management`, `plot-structure`, `chapter-writing`, `revision-continuity`, `scene-craft`, `voice-style`, `line-editing`, `theme-craft`, `genre-craft`, `premise-workshop`).
2. Draft new content or rewrite existing Markdown files following Section 4 rules and these **Narrative Craft Directives**:
   - **End on Momentum:** End chapters and scenes on concrete action, sharp dialogue, or an unresolved complication—never end with a moral summary or philosophical reflection.
   - **Let Conflict Breathe:** Do not resolve a major conflict in the same chapter it is introduced.
   - **Distinct Voices:** Before writing dialogue for a character, review their `Voice & Speech Patterns` in `characters/<name>.md` so characters do not sound identical.
3. Run the `better-writing` skill on all new or revised prose:
   - Use `voice-sample.md` as the style reference.
   - Use `better-writing` only to tighten weak phrasing—never let it flatten the established voice or override `style-sheet.md`.
4. Run `story prose .` after writing or revising a chapter and fix every reported issue without inventing filler facts.
5. Run `story slop .` and clean the AI slop it reports (tell words, boilerplate phrases, machine-style patterns). Record a reason in `continuity/exemptions.md` for a word the story uses on purpose.

### Phase 4: Verification Checks
1. Delete any temporary files created during the run.
2. Run `scripts/run-gates.sh`, or run `story gates .` for the same gates in one command (frontmatter schema, check --strict, prose, and the AI slop report), or run Steps 2a–2g in sequence:
   - a. `story reindex .` (update all registry files)
   - b. `story wordcount --write .` (update all word counts)
   - c. `story validate .` (check file structure)
   - d. `story links .` (check internal links)
   - e. `story continuity .` (check story continuity)
   - f. `story prose .` (check prose metrics)
   - g. `story check . --strict` (run full gate check)
3. If any command fails, fix the reported errors and repeat the checks until every command passes with zero errors.
4. **Circuit Breaker:** If you cannot resolve a verification failure after 3 full repair attempts, revert the breaking changes per file (`git restore <file>`), document the blocker in a commit message, and proceed to Phase 5 so the repository is never left broken.

### Phase 5: Log, Commit, and Push
1. Commit all changes with a descriptive message including model, action, summary, and next run suggestion.
