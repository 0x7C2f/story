// The contract version `story --version` prints, pinned by
// scripts/preflight.sh (story-skills@0.23.2) and compared to it exactly. The
// fork's own version lives in package.json (0.24.0) and moves on its own;
// this string must not follow it, or preflight reinstalls the registry
// package over the fork.
// This is a repo fork of that CLI with added gates (frontmatter schema,
// ai-slop guards, `story build`); it keeps the pinned version string so the
// immutable preflight script accepts it and never reinstalls the registry
// package over it.
export const VERSION = "0.23.2";
