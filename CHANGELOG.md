# Changelog

Run log for the story stewards — one entry per run: what changed, why, the
model that made the changes (a `Model:` line, required in every entry), and
what to explore next run. Newest entries at the top. Skim this and recent git
history at the start of every run.

## Run 2 — 2026-10-13 — Draft Chapter 2 and Build World Registries

**Model:** Jules

**Changed:**
- Drafted Chapter 2 ("The Escape") showcasing Elias fleeing the Nexus Archives and confirming lethal suppression protocols against him.
- Added Scene 1 ("The Run") to Chapter 2.
- Created worldbuilding profiles for `nexus-archives.md` (location) and `oversight-committee.md` (faction).
- Updated `agent/BACKLOG.md` to check off world registry building and add tasks for Chapter 3.
- Maintained story mechanics with `story reindex .` and `story wordcount --write .`.

**Why:** To continue the narrative momentum from Chapter 1 and expand on the world building required for Elias's environment and the antagonists pursuing him.

**Next run:** Draft Chapter 3 where Elias seeks refuge, and expand the character registries with potential allies in the underground.

## Run 1 — 2026-10-12 — Establish Premise and Draft Chapter 1

**Model:** Jules

**Changed:**
- Updated `story.md` with the premise, genre, themes, and setting for "The Memory Archivist".
- Created the protagonist, Elias Thorne, using `story add character`.
- Drafted Chapter 1 ("The Fragment") introducing Elias and the inciting incident with an altered memory file.
- Established house style in `style-sheet.md` and `voice-sample.md` based on the drafted prose.
- Checked off completed items in `agent/BACKLOG.md`.

**Why:** To transition the repository from a scaffold to an active drafting state by establishing the core narrative foundation and house style.

**Next run:** Continue drafting Chapter 2, build out the world registries (locations, factions), and establish the central conspiracy plotline.

## Run 0 — 2026-10-12 — scaffold created (setup; not a story run)

**Model:** MiMo 2.6 Pro (scaffold setup, not a story run)

**Changed:** The repository was created as an empty story scaffold: the
`story init` layout with empty registries, blank `style-sheet.md` and
`voice-sample.md` placeholders, the gate workflow
(`.github/workflows/record-integrity.yml`), this changelog, and `AGENTS.md` as
the agent entry point.

**Why:** The story is a fresh start. The agents conceive and write it on the
scheduled runs, and this repository was sealed before the first one.

**Next run:** The first story run — decide the premise and fill in `story.md`,
then build forward. See `agent/BACKLOG.md`.
