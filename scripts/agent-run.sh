#!/usr/bin/env bash
# Orchestrator for one steward run.
# Intended as the scheduled-job entry point. Exits 0 on no-op/pause/skip.
set -euo pipefail

cd "$(git rev-parse --show-toplevel)"

# Pause switch (AGENTS.md)
if [[ -f agent/PAUSED ]]; then
  echo "PAUSED: agent/PAUSED exists; exiting 0"
  exit 0
fi

# Resume safety: never silently continue a dirty tree
if ! git diff --quiet || ! git diff --cached --quiet || [[ -n "$(git status --porcelain --untracked-files=all)" ]]; then
  echo "DIRTY TREE: assess in-flight work manually before running"
  git status --short
  exit 0
fi

# Rebase onto latest main before any work
git fetch origin main
if ! git rebase origin/main; then
  echo "REBASE CONFLICT: stop and report; do not discard commits"
  git status --short
  exit 0
fi

# Open-PR guard: do not start a competing branch
if command -v gh >/dev/null 2>&1; then
  open_prs="$(gh pr list --state open --json number --jq 'length' 2>/dev/null || echo 0)"
  if [[ "${open_prs}" -gt 0 ]]; then
    echo "OPEN PR EXISTS (${open_prs}): skipping new run"
    exit 0
  fi
fi

# Environment lock-in
./scripts/preflight.sh

# Gate: must pass before and after story work
./scripts/run-gates.sh

# Idempotent commit: only if there is work
if git diff --quiet && git diff --cached --quiet && [[ -z "$(git status --porcelain --untracked-files=all)" ]]; then
  echo "NO CHANGES: exiting 0"
  exit 0
fi

branch="agent-run-$(date -u +%Y%m%dT%H%M%SZ)"
git checkout -b "$branch"
git add -A
git commit -m "Agent run ${branch}"

# Push + open PR (small, story-content changes auto-merge when green)
git push origin "$branch"
if command -v gh >/dev/null 2>&1; then
  gh pr create --base main --head "$branch" --title "Agent run: ${branch}" --body "Automated steward run. Gate passed before push."
fi

echo "RUN COMPLETE: ${branch}"
