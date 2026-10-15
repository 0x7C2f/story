import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// `story skills`: the skill cards bundled with the CLI. Each card is one
// working method distilled from the zenstory-ai skill collections (MIT),
// adapted to this project's style-sheet and record layout: the style-sheet
// always wins over a card's defaults, and the cards point at the CLI commands
// that enforce what they describe. Cards are knowledge for whoever writes or
// reviews prose; the CLI never executes them.

const SKILLS_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "skills");

function cardFiles() {
  if (!fs.existsSync(SKILLS_DIR)) {
    return [];
  }
  return fs.readdirSync(SKILLS_DIR)
    .filter((name) => name.endsWith(".md"))
    .sort((left, right) => left.localeCompare(right));
}

// Title and summary: the first heading and the first non-empty paragraph.
function readCard(name) {
  const file = path.join(SKILLS_DIR, `${name}.md`);
  if (!cardFiles().includes(`${name}.md`)) {
    return null;
  }
  const text = fs.readFileSync(file, "utf8");
  const title = text.match(/^#\s+(.+)$/m)?.[1] ?? name;
  const body = text.replace(/^#.*$/m, "");
  const summary = body.split(/\n\s*\n/).map((block) => block.trim()).find((block) => block !== "" && !block.startsWith("```") && !block.startsWith("|")) ?? "";
  return { name, title, summary: summary.split("\n")[0], text };
}

export function skillsIndex() {
  return cardFiles()
    .map((file) => readCard(file.replace(/\.md$/, "")))
    .filter((card) => card !== null)
    .map(({ name, title, summary }) => ({ name, title, summary }));
}

export function skillCard(name) {
  return readCard(name);
}

export function formatSkillsList(index) {
  const lines = ["Bundled skills (story skills <name> prints a card):", ""];
  const width = Math.max(...index.map((entry) => entry.name.length), 4);
  for (const entry of index) {
    lines.push(`  ${entry.name.padEnd(width)}  ${entry.title}`);
    lines.push(`  ${" ".repeat(width)}  ${entry.summary}`);
  }
  lines.push("");
  lines.push("Cards are distilled from the zenstory-ai skill collections (MIT); the");
  lines.push("style-sheet.md of this project always wins over a card's defaults.");
  return `${lines.join("\n")}\n`;
}

export function formatSkillCard(card) {
  return card.text.endsWith("\n") ? card.text : `${card.text}\n`;
}
