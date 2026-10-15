import fs from "node:fs";
import path from "node:path";
import { err } from "./findings.js";
import { parseFrontmatter } from "./frontmatter.js";
import { portablePath } from "./files.js";

// The frontmatter keys every file in a story folder must carry. This is the
// content schema the repository gates check (once scripts/validate-frontmatter.py,
// now part of the CLI so one tool owns frontmatter generation and validation).
// A file matches a row when its folder is the row's folder or is inside it,
// and the first matching row wins. Files in no row need no keys. Keys beyond
// the row's are allowed. A directory whose path segment starts with a dot is
// skipped, as is any _index.md (the CLI writes those).
export const REQUIRED_KEYS = [
  ["chapters", ["title", "number", "pov", "status", "word-count"]],
  ["scenes", ["title", "chapter", "scene", "pov", "status"]],
  ["characters", ["name", "role", "status"]],
  ["worldbuilding/locations", ["type", "name", "status"]],
  ["worldbuilding/factions", ["type", "name", "status"]],
  ["worldbuilding/artifacts", ["type", "name", "status"]],
  ["glossary", ["term"]],
  ["plot", ["type"]]
];

// Every markdown file the schema covers, in a stable order. Symlinks are read
// through (the file a link points at must still carry its folder's keys),
// while symlinked directories are not followed, so a link cannot loop.
function schemaFiles(root) {
  const files = [];
  const walk = (directory) => {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true }).sort((left, right) => left.name.localeCompare(right.name))) {
      if (entry.name.startsWith(".")) {
        continue;
      }
      const full = path.join(directory, entry.name);
      if (entry.isDirectory()) {
        walk(full);
      } else if (entry.name.endsWith(".md") && entry.name !== "_index.md") {
        files.push(full);
      }
    }
  };
  walk(root);
  return files;
}

// The keys a file must carry, or null when its folder is not covered.
function expectedKeys(relativePath) {
  const parent = path.dirname(relativePath).split(path.sep).join("/");
  for (const [folder, keys] of REQUIRED_KEYS) {
    if (parent === folder || parent.startsWith(`${folder}/`)) {
      return keys;
    }
  }
  return null;
}

// The top-level keys of a file's frontmatter. An error finding stands in for
// the keys when the frontmatter is missing, unterminated, or not a mapping.
function frontmatterKeys(filePath, label) {
  const text = fs.readFileSync(filePath, "utf8");
  const lines = text.split(/\r?\n/);
  if (lines.length < 3 || lines[0].trim() !== "---") {
    return { error: err("frontmatter-missing", `${label}: missing YAML frontmatter`, label) };
  }
  let end = -1;
  for (let index = 1; index < lines.length; index += 1) {
    if (lines[index].trim() === "---") {
      end = index;
      break;
    }
  }
  if (end === -1) {
    return { error: err("frontmatter-unterminated", `${label}: unterminated frontmatter`, label) };
  }
  let data;
  try {
    ({ data } = parseFrontmatter(text, label));
  } catch {
    return { error: err("frontmatter-unterminated", `${label}: unterminated frontmatter`, label) };
  }
  if (data === null || typeof data !== "object" || Array.isArray(data)) {
    return { error: err("frontmatter-not-mapping", `${label}: frontmatter is not a mapping`, label) };
  }
  return { keys: new Set(Object.keys(data)) };
}

// `story frontmatter`: the frontmatter key schema over every story file. The
// result is the CLI's usual finding result: ok is false while any file fails.
export function frontmatterSchemaCheck(root) {
  const errors = [];
  let checked = 0;
  for (const filePath of schemaFiles(root)) {
    const label = portablePath(path.relative(root, filePath));
    const required = expectedKeys(label);
    if (required === null) {
      continue;
    }
    checked += 1;
    const result = frontmatterKeys(filePath, label);
    if (result.error !== undefined) {
      errors.push(result.error);
      continue;
    }
    const missing = required.filter((key) => !result.keys.has(key)).sort();
    if (missing.length > 0) {
      errors.push(err("frontmatter-missing-keys", `${label}: missing frontmatter keys: ${missing.join(", ")}`, label));
    }
  }
  return { ok: errors.length === 0, errors, warnings: [], checked };
}

// `story frontmatter` as text: the count line the schema gate has always
// printed, then one line per finding.
export function formatFrontmatterReport(result) {
  const lines = [`checked ${result.checked} files`];
  for (const error of result.errors) {
    lines.push(`ERROR: ${error.message}`);
  }
  lines.push(result.ok ? "frontmatter schema OK" : "frontmatter schema failed");
  return `${lines.join("\n")}\n`;
}
