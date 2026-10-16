#!/usr/bin/env python3
"""Validate YAML frontmatter keys for story content files.

Usage:
    python3 scripts/validate-frontmatter.py [ROOT]

Returns 0 when every relevant file has the required frontmatter keys.
Unknown extra keys are allowed.
"""
from __future__ import annotations

import sys
from pathlib import Path
import yaml

ROOT = Path(sys.argv[1]).resolve() if len(sys.argv) > 1 else Path.cwd()

REQUIRED = {
    "chapters": {"title", "number", "pov", "status", "word-count"},
    "scenes": {"title", "chapter", "scene", "pov", "status"},
    "characters": {"name", "role", "status"},
    "worldbuilding/locations": {"type", "name", "status"},
    "worldbuilding/factions": {"type", "name", "status"},
    "worldbuilding/artifacts": {"type", "name", "status"},
    "glossary": {"term"},
    "plot": {"type"},
}



def frontmatter_keys(path: Path) -> set[str] | None:
    text = path.read_text(encoding="utf-8")
    lines = text.splitlines()
    if len(lines) < 3 or lines[0].strip() != "---":
        return None
    end = None
    for i in range(1, len(lines)):
        if lines[i].strip() == "---":
            end = i
            break
    if end is None:
        raise ValueError(f"{path}: unterminated frontmatter")
    data = yaml.safe_load("\n".join(lines[1:end])) or {}
    if not isinstance(data, dict):
        raise ValueError(f"{path}: frontmatter is not a mapping")
    return set(data.keys())


def expected_keys(path: Path) -> set[str] | None:
    rel = path.relative_to(ROOT)
    parent = rel.parent.as_posix()
    for prefix, keys in REQUIRED.items():
        if parent == prefix or parent.startswith(prefix + "/"):
            return keys
    return None


def main() -> int:
    failures: list[str] = []
    checked = 0
    for path in ROOT.rglob("*.md"):
        rel = path.relative_to(ROOT)
        if any(part.startswith(".") for part in rel.parts):
            continue
        # Registry/index files are generated; skip them.
        if path.name == "_index.md":
            continue
        keys_required = expected_keys(path)
        if keys_required is None:
            continue
        checked += 1
        try:
            actual = frontmatter_keys(path)
        except Exception as exc:  # pylint: disable=broad-except
            failures.append(str(exc))
            continue
        if actual is None:
            failures.append(f"{rel}: missing YAML frontmatter")
            continue
        missing = keys_required - actual
        if missing:
            failures.append(f"{rel}: missing frontmatter keys: {sorted(missing)}")
    print(f"checked {checked} files")
    if failures:
        for failure in failures:
            print(f"ERROR: {failure}")
        return 1
    print("frontmatter schema OK")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
