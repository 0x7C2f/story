# story-cli

The story CLI: plan, track, and draft fiction in markdown. This is **our
fork** of the `story-skills` package (0.23.2, MIT, Daniel Dewhurst). It has
diverged from upstream and is maintained here. Do not sync it with upstream.

The fork keeps the upstream package identity and contract version
(`story-skills@0.23.2`) on purpose: `scripts/preflight.sh` reinstalls the
registry package whenever `story --version` is not exactly `0.23.2`, so
matching that version is what lets the fork survive preflight. All upstream
commands and behavior are preserved; our additions are strictly new commands
plus one extra rule inside `validate` (frontmatter schema).

Install it so the `story` command points at this code:

```
npm uninstall -g story-skills story-cli 2>/dev/null || true
npm install -g ./story-cli
story --version    # must print 0.23.2
```

## What this fork adds

- **`story frontmatter [path]`** — the frontmatter key schema over every
  story file (the keys each folder's files must carry). `story validate`,
  `story check`, `story report`, `story next`, and `story doctor` run it as
  part of their validation.
- **`story gates [path]`** — every project gate in one pass: the frontmatter
  schema, `check --strict`, prose, and an AI slop report.
- **`story slop [path]`** — AI slop guards: tell words, boilerplate phrases,
  and machine-style patterns in the prose. `--all` scans every story file,
  not only chapter prose.

Everything the upstream CLI does still works: `story init`, `story check`,
`story prose`, `story reindex`, `story build`, and the rest. Run
`story --help` for the command list.

## Provenance

Forked from [`story-skills`](https://github.com/danjdewhurst/story-skills)
0.23.2 under the MIT license. The upstream copyright notice stays in
[LICENSE](LICENSE). Fork changes are in this repository's history; the
version here is 0.24.0 and moves on its own.
