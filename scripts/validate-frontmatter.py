#!/usr/bin/env python3
"""Validate YAML frontmatter keys for story content files.

Usage:
    python3 scripts/validate-frontmatter.py [ROOT]

Returns 0 when every relevant file has the required frontmatter keys.
Unknown extra keys are allowed.
"""
from __future__ import annotations

import sys
import os
from pathlib import Path
import yaml
import concurrent.futures

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
    with path.open(encoding="utf-8") as f:
        first = f.readline()
        if not first or first.strip() != "---":
            return None
        lines = []
        for line in f:
            if line.strip() == "---":
                break
            lines.append(line)
        else:
            raise ValueError(f"{path}: unterminated frontmatter")
    data = yaml.safe_load("".join(lines)) or {}
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



def process_file(path: Path) -> tuple[bool, list[str]]:
    keys_required = expected_keys(path)
    if keys_required is None:
        return False, []

    rel = path.relative_to(ROOT)
    try:
        actual = frontmatter_keys(path)
    except Exception as exc:
        return True, [str(exc)]

    if actual is None:
        return True, [f"{rel}: missing YAML frontmatter"]

    missing = keys_required - actual
    if missing:
        return True, [f"{rel}: missing frontmatter keys: {sorted(missing)}"]

    return True, []


def main() -> int:
    failures: list[str] = []
    paths_to_check = []
    for dirpath, dirnames, filenames in os.walk(ROOT):
        dirnames[:] = [d for d in dirnames if not d.startswith(".")]
        for filename in filenames:
            if not filename.endswith(".md") or filename.startswith("."):
                continue
            path = Path(dirpath) / filename
            if path.name == "_index.md":
                continue
            paths_to_check.append(path)

    checked = 0
    with concurrent.futures.ProcessPoolExecutor() as executor:
        for was_checked, file_failures in executor.map(process_file, paths_to_check):
            if was_checked:
                checked += 1
            failures.extend(file_failures)

    print(f"checked {checked} files")
    if failures:
        for failure in failures:
            print(f"ERROR: {failure}")
        return 1
    print("frontmatter schema OK")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
