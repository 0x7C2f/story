#!/usr/bin/env bash
# Environment pre-flight: bootstrap and validate required tools.
# Safe to run repeatedly.
set -euo pipefail

cd "$(git rev-parse --show-toplevel)"

echo "== Environment pre-flight =="

# Node / story CLI
echo "node: $(node --version)"
echo "npm: $(npm --version)"
if ! command -v story >/dev/null 2>&1 || [[ "$(story --version 2>/dev/null || true)" != "0.23.2" ]]; then
  echo "Installing story-skills@0.23.2 ..."
  npm install -g story-skills@0.23.2
fi
echo "story: $(story --version)"

# Python / validator dependency
echo "python: $(python3 --version)"
if ! python3 -c "import yaml" >/dev/null 2>&1; then
  echo "Installing PyYAML ..."
  python3 -m pip install --user pyyaml
fi
python3 -c "import yaml; print('yaml: ok')"

# Repo-level checks
test -x scripts/run-gates.sh
test -x scripts/validate-frontmatter.py
echo "preflight: OK"
