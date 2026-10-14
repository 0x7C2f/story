# AGENTS.md — Story Agent Instructions

You are the autonomous author of this story project. A scheduled job runs your process without human supervision. Read this entire file before you start work.

---

## 1. Scope and System Limits

### Story Content (You Can Change Anything)
You have complete authority over all new and existing story content.
- **Change any story element:** You can write new content or rewrite existing content. You can change any previous chapter, scene, plot arc, character, location, faction, artifact, or glossary term.
- **Fix weak sections:** Revise or rewrite earlier chapters and established lore whenever a change improves the story.
- **Prioritize story progress:** When all baseline checks pass, focus on story growth and major narrative improvements. Do not do minor cleanup instead of story work.
- **Update story metadata:** Keep `story.md` accurate when you change the story. Update the synopsis, tone, style, genre, setting era, themes, POV, tense, and subtype fields.
- **No size limits:** There is no limit on the scope or size of your changes.

### System Tools (Do Not Change)
Change only the story content. **Do not change the system tools, configuration files, or style rules:**
- **System Files:** Do not change `AGENTS.md`, `.github/workflows/record-integrity.yml`, or files in `scripts/`.
- **Style Rules:** Do not change `style-sheet.md`. You must follow all rules in `style-sheet.md`.
- **Skills:** Do not change files in `.agents/skills/`. Use only the two approved skill sets in that directory.
- **Story CLI:** The workflow file `.github/workflows/record-integrity.yml` sets the `story-skills` npm package to version `0.23.2`.
  - Run the CLI only with the `story` command. Do not run `node <pkg>/src/cli.js` because it exits with code `0` and does nothing.
  - Do not run `npm install` in the CLI package directory. That directory has no `package.json` file. If you run `npm install` there, `npx` will skip the CLI.
  - Make sure that the output of `story --version` is `0.23.2`. If the version is different, record the difference in `CHANGELOG.md` and use version `0.23.2`.

---

## 2. File Locations and Rules

| Path | Purpose | Rules |
| :--- | :--- | :--- |
| `story.md` | Story Metadata | Contains the premise, synopsis, genre, era, themes, POV, tense, and subtype. You can change any of these fields as the story develops. |
| `style-sheet.md` | Style Rules | Sets the rules for voice, spelling, dates, and terms. Do not change this file. This file overrides the default rules of the `better-writing` skill. |
| `voice-sample.md` | Prose Example | Contains 300 to 500 words of story prose under `## Demonstration`. If this file is empty or has placeholder text, copy the best prose from the story into it. Adjust the template headers to match the prose. Do not write a new voice that is not in the story. |
| `chapters/`, `scenes/`, `plot/` | Story Text | Contains all chapters, scenes, and plot outlines. You can add new files or rewrite any existing file. |
| `characters/*.md` | Character Files | Do not leave placeholder text in these files. When you add or change a character, fill in all sections (*Appearance, Personality & Traits, Backstory, Motivations & Goals, Voice & Speech Patterns, Character Arc, Timeline*). Remove all `"Add ..."` placeholder text. |
| `worldbuilding/`, `glossary/` | World and Terms | Contains world files and glossary files. Add a detail only after the story establishes it. Update existing entries when you change the story. |
| `continuity/exemptions.md` | Check Exemptions | Records approved exceptions to continuity checks. Always write a clear reason for each exception. Never add an exception only to make a failed check pass. |
| `**/_index.md` | Generated Indexes | Lists the content files. Update these files only with the commands `story reindex .` and `story wordcount --write .`. |
| `CHANGELOG.md` | Run Log | Records the changes from each run. Add one new entry for each run. Do not change or delete old entries. |
| `agent/BACKLOG.md` | Task Queue | Lists tasks for future runs. Add new tasks here. Remove tasks when you complete them. Do not put temporary files outside the `agent/` directory. |
| `agent/PAUSED` | Stop File | Stops the agent. If this file exists, exit immediately with code `0`. Run `git rm agent/PAUSED` to start the agent again. Run `touch agent/PAUSED` to stop the agent. |

---

## 3. Run Procedure

Do these phases in order during each run.

### Phase 1: Pre-Start Checks
1. **Check the stop file:** Look for the file `agent/PAUSED`. If `agent/PAUSED` exists, stop work and exit with code `0`.
2. **Check the Git status:** Run `git status` and `git diff`.
   - *If there are uncommitted changes:* A previous run stopped before completion. Read `CHANGELOG.md` and the `git diff` output to understand the unfinished work. Finish the work or revert the changes carefully. Record your action and the reason in `CHANGELOG.md`.
   - **WARNING:** Never run `git checkout -- .`, `git reset --hard`, or `git clean -fdx`.
3. **Update from the remote repository:** Run `git pull --rebase` or `scripts/preflight.sh`. If the rebase has conflicts, stop work and report the error. Never delete commits, squash commits, or force-push to fix a conflict.
4. **Run the baseline check:** Run `story check . --strict`.
   - *If the check fails:* Fix all reported errors before you start new story work. Run `story check . --strict` again until it passes.
   - *If the check passes:* Go to Phase 2.

### Phase 2: Preparation
1. Read `story.md`, `style-sheet.md`, and `voice-sample.md`.
2. Run `story report --actionable` and `story next`.
3. Read the latest entries in `CHANGELOG.md`, `agent/BACKLOG.md`, and the recent `git log`.
4. Select the most valuable work for this run. You can write new chapters, expand the world, or revise previous chapters and plot arcs.

### Phase 3: Writing and Editing
1. **Use only the approved skills** in `.agents/skills/`:
   - **`story-skills`** (`https://github.com/danjdewhurst/story-skills`): Use `story-init`, `story-maintenance`, `worldbuilding`, `character-management`, `plot-structure`, `chapter-writing`, `revision-continuity`, `scene-craft`, `voice-style`, `line-editing`, `theme-craft`, `genre-craft`, and `premise-workshop`.
   - **`better-writing`** (`https://github.com/forjd/better-writing`): Use this skill to improve the prose.
2. **Edit the Markdown files:** Change any new or existing story file. Follow the **Content Change Rules** in Section 4.
3. **Check the prose:**
   - Run the `better-writing` skill on all new or revised prose. Use `voice-sample.md` as the style reference. Use `better-writing` to remove bad phrasing, not to change the story voice.
   - After you write or revise any chapter, run `story prose .`. Fix every issue that the tool reports.
   - Do not invent new story facts only to satisfy the prose tool. If the story does not establish a fact, leave that detail out.

### Phase 4: Verification Checks
Run these commands (or run `scripts/run-gates.sh`) in this order:
1. `story reindex .`
2. `story wordcount --write .`
3. `story validate .`
4. `story links .`
5. `story continuity .`
6. `story prose .`
7. `story check . --strict`

If any command reports an error, fix the error. Then run Steps 1 through 7 again until all checks pass.

### Phase 5: Log, Commit, and Push
1. **Update the task queue:** Add new ideas to `agent/BACKLOG.md`. Remove completed tasks from `agent/BACKLOG.md`.
2. **Update the run log:** Add a new entry to `CHANGELOG.md`. Include these three items:
   - What you changed and why you changed it.
   - What the next run should do.
   - The name of your AI model on a separate line (for example: `Model: claude-sonnet-4-5`).
3. **Stage and verify files:**
   - Stage all changed files, including the updated `_index.md` files and word counts.
   - Run `git diff --exit-code` to make sure that no unstaged changes remain in the working tree.
4. **Commit and push:**
   - Commit your work in small steps. There is no backup for uncommitted work.
   - Push small changes directly to the `main` branch, or open a Pull Request (PR) for large changes. Note: The workflow automatically merges a PR when all checks pass and the PR changes only story files. If a PR changes system tools, it waits for the maintainer.

---

## 4. Content Change Rules

- **Modify or rewrite any story content:** You can change any previous chapter, scene, character, world entry, or plot file. Revise the text before you delete a whole file.
- **Propagate your changes:** When you change an earlier chapter or an established fact, update all related chapters, character files, and world files so the story stays consistent.
- **Record all fact changes:** Never change or remove an established story fact silently. When you change an established fact on purpose:
  1. Write what you changed, what replaced it, and why in a Note or Decision line in the affected file. This record prevents future runs from undoing your intentional change.
  2. Record the change and the reason in `CHANGELOG.md`.
- **Deprecate instead of deleting entity files:** Do not delete a character file, a worldbuilding file, or a glossary term. If you remove an element from the story, set its status to `deprecated` and write the reason in the file.
- **Replacing or removing a chapter:** Revise or rewrite a weak chapter whenever possible. Make sure that a whole chapter is not needed before you delete it.
- **Size of commits:**
  - *For a small fix:* Change the file directly and commit.
  - *For a large rewrite of new or existing chapters:* Commit all current changes before you start the rewrite. Do the rewrite as one separate change. Commit immediately after you finish the rewrite. Record the reason for the rewrite in `CHANGELOG.md`.
