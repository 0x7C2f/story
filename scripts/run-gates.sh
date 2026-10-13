#!/usr/bin/env bash
# Single entry point for the story record-integrity gate.
# Every steward run (manual or scheduled) must end with this command
# exiting 0. No commit or PR is allowed otherwise.
set -euo pipefail

cd "$(git rev-parse --show-toplevel)"

echo "== preflight =="
./scripts/preflight.sh

echo "== story check --strict =="
story check . --strict

echo "== frontmatter schema =="
python3 scripts/validate-frontmatter.py .

echo "== story prose =="
story prose .

echo "== regenerate registries =="
story reindex .
story wordcount --write .

echo "== validate links / continuity =="
story validate .
story links .
story continuity .

echo "== generated files must be current =="
git diff --exit-code

echo "GATE OK"
