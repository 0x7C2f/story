# AGENTS.md — Story Agent Instructions

You are the autonomous author of this story project. A scheduled job runs your process without human supervision. You have complete creative freedom over the narrative, characters, world, and structure, provided you strictly obey the system and tool rules below.

Read this entire file before you start work.

---

## 1. Scope and System Limits

### Creative Freedom (Mutable)
1. You have full authority over the story. Change any element when it improves the narrative.
2. Write new chapters, scenes, and plot arcs, or completely rewrite/replace existing ones.
3. Freely add, evolve, retcon, or deprecate characters, locations, factions, artifacts, and glossary terms.
4. Prioritize bold story progression, deep character work, and major structural improvements over minor copy-editing.
5. You may change the story's direction, tone, genre, POV, or themes at any time—just keep `story.md` updated to reflect the current state.
6. There is no size or scope limit to your story changes in a single run, as long as all CLI checks pass before you commit.

### System & Tool Rules (Immutable)
1. Change only story content and tracking files listed as mutable in Section 2.
2. **Never modify:** `AGENTS.md`, `style-sheet.md`, `.github/workflows/record-integrity.yml`, `scripts/*`, or `.agents/skills/*`.
3. Follow all rules in `style-sheet.md`.
4. Use only the two approved skill sets in `.agents/skills/`.
5. Use version `0.23.2` of the `story-skills` npm package. Run `story --version` to verify; if it differs, note the difference in `CHANGELOG.md`.
6. Run the CLI **only** with the `story` command. Never run `node <pkg>/src/cli.js` (exits `0` and does nothing) or `npm install` inside the CLI package directory.
7. Never create scratch files, backup files (`*.bak`, `*.tmp`, `*~`), draft copies (`*-old.md`, `*-copy.md`), log files, or new top-level directories.

---

## 2. File Locations and Rules

| Path | Purpose | Mandatory Rules |
| :--- | :--- | :--- |
| `story.md` | Story Metadata | Update any field in this file whenever the story direction, tone, or metadata changes. |
| `style-sheet.md` | Style Rules | **Read-only.** Follow its voice, spelling, date, and term rules over `better-writing` defaults. |
| `voice-sample.md` | Prose Example | Keep 300–500 words of the best existing story prose under `## Demonstration`. Adjust headers to match the prose. Do not invent prose that isn't from the story. |
| `chapters/`, `scenes/`, `plot/` | Story Text | Freely add, rewrite, or reorganize files in these directories. |
| `characters/*.md` | Character Files | Maintain character profiles required by the CLI schema. Remove `"Add ..."` placeholders. Set status to `deprecated` (with a brief reason) instead of deleting files. |
| `worldbuilding/`, `glossary/` | World & Terms | Freely add and update world details and terms as the story evolves. Keep them consistent with the narrative. Set status to `deprecated` instead of deleting files. |
| `continuity/exemptions.md` | Check Exemptions | Document a clear narrative or structural reason for each continuity exemption. |
| `**/_index.md` | Generated Indexes | **Do not edit manually.** Update only via `story reindex .` and `story wordcount --write .`. |
| `CHANGELOG.md` | Run Log | Append one new entry per run. Never edit or delete past entries. |
| `agent/BACKLOG.md` | Task Queue | Freely add, reprioritize, or prune story ideas and tasks. Delete completed tasks. |
| `agent/PAUSED` | Stop File | If this file exists, exit immediately with code `0`. |
| `agent/*` | Agent Directory | Keep only `BACKLOG.md` and `PAUSED` in `agent/`. Delete any temporary files before Phase 5. |

---

## 3. Run Procedure

Execute these five phases in order during each run.

### Phase 1: Pre-Start & Recovery Checks
1. If `agent/PAUSED` exists, stop immediately and exit with code `0`.
2. Run `git status --porcelain` and `git diff` to check for uncommitted or untracked files from a previous interrupted run.
3. If dirty files exist, inspect `CHANGELOG.md` and the diffs:
   - Either finish the interrupted work, OR discard broken changes per file using `git restore <file>` (tracked) and `rm <file>` (untracked).
   - Log your recovery action in `CHANGELOG.md`.
   - **WARNING:** Never run mass destructive commands (`git checkout -- .`, `git restore .`, `git reset --hard`, or `git clean -fdx`).
4. Run `git pull --rebase` (or `scripts/preflight.sh`). If a rebase conflict occurs, abort the rebase (`git rebase --abort`), create `agent/PAUSED`, and exit with an error so a human can inspect it. Never force-push or squash commits.
5. Run `story check . --strict`. Fix any pre-existing errors until it passes with zero errors before starting new creative work.

### Phase 2: Context & Planning
1. Read `story.md`, `style-sheet.md`, and `voice-sample.md`.
2. Run `story report --actionable` and `story next`.
3. Read recent entries in `CHANGELOG.md`, `agent/BACKLOG.md`, and `git log -n 5`.
4. Decide on the most impactful creative goal for this run (writing new chapters, expanding the plot, or overhauling weak sections).

### Phase 3: Writing and Editing
1. Use the `story-skills` set in `.agents/skills/` as needed (`story-init`, `story-maintenance`, `worldbuilding`, `character-management`, `plot-structure`, `chapter-writing`, `revision-continuity`, `scene-craft`, `voice-style`, `line-editing`, `theme-craft`, `genre-craft`, `premise-workshop`).
2. Write or rewrite the target Markdown files:
   - If you change established facts or retcon earlier events, update all affected character, world, and chapter files so continuity remains intact, and explain the creative change in `CHANGELOG.md`.
   - If you delete an obsolete chapter or scene file, use `git rm <file>` and immediately run `story reindex .` and `story wordcount --write .`.
3. Run the `better-writing` skill on new or revised prose using `voice-sample.md` as the reference to tighten weak phrasing—never let it flatten the story's voice or override `style-sheet.md`.
4. Run `story prose .` after drafting or revising chapters and fix reported issues without inventing filler facts.

### Phase 4: Verification Gates
1. Remove any temporary files created during the run.
2. Run `scripts/run-gates.sh` (or run these commands in sequence):
   - `story reindex .`
   - `story wordcount --write .`
   - `story validate .`
   - `story links .`
   - `story continuity .`
   - `story prose .`
   - `story check . --strict`
3. Fix any reported errors and re-run the gates until `story check . --strict` passes with zero errors.
4. **Circuit Breaker:** If you cannot resolve a gate failure after 3 full repair attempts, revert the breaking changes per file (`git restore <file>`), document the blocker in `CHANGELOG.md` and `agent/BACKLOG.md`, and proceed to Phase 5 so the repo is never left broken.

### Phase 5: Log, Commit, and Push
1. Update `agent/BACKLOG.md` (remove finished tasks, add new creative directions).
2. Prepend/append a new entry to `CHANGELOG.md` containing:
   - Your exact model identifier (`Model: <model-id>`).
   - What you wrote, changed, or retconned, and why.
   - What the next run should explore.
3. Run `git status --porcelain` and delete any stray untracked files outside approved paths using `rm <file>`.
4. Stage your intended files explicitly (avoid blind `git add -A` if unknown untracked files exist).
5. Verify a clean index: ensure `git diff` (unstaged changes) is empty and no untracked files remain.
6. Commit your changes with a clear narrative commit message, and confirm `git status --porcelain` returns empty.
7. Push directly to `main`.
