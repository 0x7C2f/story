import fs from "node:fs";
import path from "node:path";
import { parseFrontmatter, withoutLeadingFrontmatter } from "./frontmatter.js";
import { splitSentences } from "./sentences.js";
import { slopReport } from "./slop.js";

// `story review`: a review-council rubric over computed signals. The numbers
// are deterministic; the judgment stays with the reviewer. The rubric itself
// is adapted from zenstory-ai's story-review quality-rubric and
// fiction-quality-rubric (MIT): sixteen dimensions marked PASS/WARN/FAIL with
// S1-S4 severity, the golden three questions, and the verdict thresholds.
// Every finding a reviewer writes must quote the text; the signals below say
// where to look first.

// The rubric rows: dimension and what PASS/WARN/FAIL means, with the signal
// column naming the computed field that backs the judgment.
export const RUBRIC = [
  ["core selling point", "the chapter advances the promise the reader is holding", "the promise exists but is diluted", "nothing in the chapter serves the story's promise"],
  ["conflict movement", "a clear obstacle, choice, or cost lands", "conflict is light; movement feels thin", "explanation or recap only; nothing moves"],
  ["complication", "the goal hits friction that yields information, cost, or a turn", "friction exists but changes little", "the friction is process detail; cut it and nothing breaks"],
  ["emotional curve", "build, peak, and release are staged", "emotion moves but the beats blur", "flat line or an unearned turn"],
  ["hook and expectation", "the open or the close sets an expectation", "the hook is weak but a question remains", "no suspense, goal, or open expectation"],
  ["opening freshness", "a specific person and situation, not the genre default", "a hook exists but the shape is familiar", "the opening could be pasted into any book of the genre"],
  ["character motivation", "behavior follows goal, temperament, and pressure", "a beat lacks setup", "the character bends to serve the plot"],
  ["dialogue", "subtext, controlled information, distinct voices", "voices blur or the dialogue explains", "the dialogue is a manual; everyone speaks alike"],
  ["world consistency", "no rule, timeline, or attribute is contradicted", "a soft spot needs evidence", "an established fact is contradicted"],
  ["prose naturalness", "specific, felt, action carrying information", "stock phrase or summary creep", "AI voice, cliches, or summary-speak dominate"],
  ["sentence rhythm", "comma-length narration with short sentences as accents", "local chop or telegraphic drift", "endless fragments, or prose chopped into confetti"],
  ["punctuation rhythm", "punctuation tracks voice and turn", "local monotony or stacking", "period-storms, random bangs, or dashes/ellipses faking tension"],
  ["concrete counts", "word-count claims in prose are checked and true", "true but smoother without the count", "count is wrong or unverifiable"],
  ["format readability", "paragraphs break on dramatic units; dialogue stands alone", "locally long or shredded paragraphs", "slabs, mechanical breaks, subject pile-ups"],
  ["plot loop", "goal, obstacle, action, cost, new expectation close the loop", "a link is missing or weak", "no goal, no obstacle, or no consequence"],
  ["climax build", "charge, false peak, break, payoff are layered", "a peak exists but the charge or payoff is thin", "flat delivery, no cost, no payoff"]
];

// The four review seats, adapted from zenstory-ai's story-review
// multi-perspective protocol (MIT): each seat owns one failure class, runs in
// order, and argues its own case. Consistency outranks the other seats when
// they collide (a hook built on a continuity violation is still a violation).
export const SEATS = [
  ["structure", "does the chapter serve the book's promise, and where does the arc turn?", "chapters that could be cut; a diluted promise"],
  ["character", "does behavior follow goal, temperament, and pressure? Whose chapter is it?", "the plot bending the character; blurred voices"],
  ["prose", "is the language specific and felt? Do sentences and punctuation track the voice?", "summary-speak; slop and rhythm failures (story slop, story prose)"],
  ["consistency", "does anything contradict the records — and was any fact revealed too early or too late?", "canon, timeline, and knowledge-order failures (story continuity, story knowledge)"]
];

// The tail/open classification regexes: where a chapter closes is the single
// strongest reading-retention signal, so review reports it per chapter.
const TRAILER_RE = /\b(?:little did|no one knew|was only (?:just )?(?:the )?beginning|the calm before|changed forever|gears of fate)\b/i;

// Sections whose text is scaffolding, not prose: metrics skip them.
const NON_PROSE_SECTION = /^##\s+(outline|notes|appendix)\b/mi;

function chapterSections(text) {
  const body = withoutLeadingFrontmatter(text);
  const lines = body.split(/\r?\n/);
  const prose = [];
  let skip = false;
  for (const line of lines) {
    if (/^\s{0,3}#{1,6}\s/.test(line)) {
      skip = NON_PROSE_SECTION.test(line);
      continue;
    }
    if (!skip) {
      prose.push(line);
    }
  }
  return prose.join("\n");
}

function proseBlocks(text) {
  return text
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter((block) => block !== "" && !/^\s{0,3}(#{1,6}\s|[-*>|])/.test(block));
}

function dialogueWords(text) {
  let words = 0;
  const spans = [...text.matchAll(/\u201c([^\u201c\u201d]*)\u201d/g), ...text.matchAll(/"([^"\n]*)"/g)];
  for (const [, span] of spans) {
    words += span.match(/\S+/g)?.length ?? 0;
  }
  return words;
}

function classifyClose(block) {
  const last = block.trim().split(/(?<=[.!?])\s+/).pop() ?? "";
  if (TRAILER_RE.test(last)) {
    return "summary/trailer close";
  }
  if (last.endsWith("?")) {
    return "question hook";
  }
  if (/\u201d$|"$/.test(last.trim())) {
    return "dialogue close";
  }
  return "narration close";
}

function classifyOpen(block) {
  if (/^\s*\u201c|^\s*"/.test(block)) {
    return "opens on dialogue";
  }
  const first = block.split(/(?<=[.!?])\s+/)[0] ?? "";
  if (first.endsWith("?")) {
    return "opens on a question";
  }
  return "opens on narration";
}

function chapterSignals(filePath, slopByFile) {
  const text = fs.readFileSync(filePath, "utf8");
  const prose = chapterSections(text);
  const blocks = proseBlocks(prose);
  const body = blocks.join("\n");
  const words = body.match(/\S+/g)?.length ?? 0;
  const sentences = splitSentences(body).map((sentence) => sentence.match(/\S+/g)?.length ?? 0);
  const total = sentences.length || 1;
  const avg = sentences.reduce((sum, n) => sum + n, 0) / total;
  const stdev = Math.sqrt(sentences.reduce((sum, n) => sum + (n - avg) ** 2, 0) / total);
  const shortRatio = sentences.filter((n) => n <= 5).length / total;
  const dialogue = dialogueWords(body);
  const slop = slopByFile.get(path.basename(filePath)) ?? { blocking: 0, advisory: 0 };
  return {
    chapter: path.basename(filePath),
    words,
    paragraphs: blocks.length,
    sentences: sentences.length,
    sentenceAvg: Math.round(avg * 10) / 10,
    sentenceStdev: Math.round(stdev * 10) / 10,
    shortSentenceRatio: Math.round(shortRatio * 100) / 100,
    dialogueRatio: words > 0 ? Math.round((dialogue / words) * 100) / 100 : 0,
    emDashes: (body.match(/—/g) ?? []).length,
    open: blocks.length > 0 ? classifyOpen(blocks[0]) : "empty",
    close: blocks.length > 0 ? classifyClose(blocks[blocks.length - 1]) : "empty",
    slopBlocking: slop.blocking,
    slopAdvisory: slop.advisory
  };
}

function continuityLoops(root) {
  const loops = {};
  for (const folder of ["questions", "promises", "clues"]) {
    const directory = path.join(root, "continuity", folder);
    const records = [];
    if (fs.existsSync(directory)) {
      for (const entry of fs.readdirSync(directory, { withFileTypes: true }).sort((left, right) => left.name.localeCompare(right.name, undefined, { numeric: true }))) {
        if (!entry.name.endsWith(".md") || entry.name === "_index.md" || entry.isSymbolicLink() || entry.name === "AGENTS.md") {
          continue;
        }
        const { data } = parseFrontmatter(fs.readFileSync(path.join(directory, entry.name), "utf8"));
        records.push({ file: entry.name, status: data.status ?? "unset" });
      }
    }
    loops[folder] = records;
  }
  return loops;
}

// `story review`: chapter signals, open loops, and the rubric scaffold. ok is
// always true: review is analysis, the verdict is the reviewer's call.
export function reviewReport(root, options = {}) {
  const slop = slopReport(root, { all: true, ...options.slop });
  const slopByFile = new Map();
  for (const file of slop.files) {
    const current = slopByFile.get(path.basename(file.file)) ?? { blocking: 0, advisory: 0 };
    for (const finding of file.findings) {
      if (finding.severity === "blocking") {
        current.blocking += 1;
      } else {
        current.advisory += 1;
      }
    }
    slopByFile.set(path.basename(file.file), current);
  }
  const chapterDir = path.join(root, "chapters");
  const chapters = fs.existsSync(chapterDir)
    ? fs.readdirSync(chapterDir, { withFileTypes: true })
      .filter((entry) => entry.isFile() && entry.name.endsWith(".md") && entry.name !== "_index.md" && entry.name !== "AGENTS.md")
      .map((entry) => entry.name)
      .sort((left, right) => left.localeCompare(right, undefined, { numeric: true }))
      .map((name) => chapterSignals(path.join(chapterDir, name), slopByFile))
    : [];
  const loops = continuityLoops(root);
  return {
    ok: true,
    errors: [],
    warnings: [],
    chapters,
    totals: {
      chapters: chapters.length,
      words: chapters.reduce((sum, chapter) => sum + chapter.words, 0),
      slopBlocking: chapters.reduce((sum, chapter) => sum + chapter.slopBlocking, 0),
      slopAdvisory: chapters.reduce((sum, chapter) => sum + chapter.slopAdvisory, 0)
    },
    loops
  };
}

// `story review` as text: the computed signals first, then the rubric to fill
// with evidence, then the golden three questions and the verdict rules.
export function formatReviewReport(report) {
  const lines = [`Review signals: ${report.totals.chapters} chapters, ${report.totals.words} words, slop ${report.totals.slopBlocking} blocking / ${report.totals.slopAdvisory} advisory`, ""];
  lines.push("chapter                          words  para  sent  avg  stdev  short%  dial%  close");
  for (const chapter of report.chapters) {
    lines.push(
      `${chapter.chapter.padEnd(30)} ${String(chapter.words).padStart(6)} ${String(chapter.paragraphs).padStart(5)} ${String(chapter.sentences).padStart(5)} ${String(chapter.sentenceAvg).padStart(5)} ${String(chapter.sentenceStdev).padStart(6)} ${String(chapter.shortSentenceRatio).padStart(6)} ${String(chapter.dialogueRatio).padStart(6)}  ${chapter.close}`
    );
    const flags = [];
    if (chapter.slopBlocking > 0) {
      flags.push(`slop ${chapter.slopBlocking} blocking`);
    }
    if (chapter.close === "summary/trailer close") {
      flags.push("closes on a summary");
    }
    if (chapter.shortSentenceRatio > 0.35) {
      flags.push("telegraphic drift");
    }
    if (flags.length > 0) {
      lines.push(`  ${flags.join("; ")}`);
    }
  }
  lines.push("");
  lines.push("open loops (continuity records):");
  for (const [folder, records] of Object.entries(report.loops)) {
    const byStatus = new Map();
    for (const record of records) {
      byStatus.set(record.status, (byStatus.get(record.status) ?? 0) + 1);
    }
    const detail = [...byStatus.entries()].map(([status, count]) => `${status} ${count}`).join(", ") || "none";
    lines.push(`  ${folder}: ${records.length} records — ${detail}`);
  }
  lines.push("");
  lines.push("Review seats (each argues its own case; consistency wins collisions):");
  for (const [seat, question, failure] of SEATS) {
    lines.push(`  - ${seat}: ${question} — look for ${failure}`);
  }
  lines.push("");
  lines.push("Severity: must fix (story-breaking) | should fix (retention/credibility)");
  lines.push("| could fix (local craft) | won't fix unless asked (style-sheet or");
  lines.push("continuity/exemptions.md already ruled). Every finding quotes the text");
  lines.push("and says what the reader loses if it stays.");
  lines.push("");
  lines.push("Rubric (mark each PASS/WARN/FAIL with quoted evidence; S1 story-breaking,");
  lines.push("S2 retention/credibility, S3 local, S4 optional):");
  for (const [dimension, pass, warn, fail] of RUBRIC) {
    lines.push(`  - ${dimension}: PASS when ${pass}; WARN when ${warn}; FAIL when ${fail}`);
  }
  lines.push("");
  lines.push("Golden three questions:");
  lines.push("  1. Why would the reader turn the page? No answer means at least S2.");
  lines.push("  2. What did this chapter change — plot, relation, information, emotion?");
  lines.push("     Nothing changed means at least S2.");
  lines.push("  3. What text evidence supports each judgment? No evidence, no finding.");
  lines.push("");
  lines.push("Verdict: APPROVE (no S1/S2; S3 quick) | CONCERNS (S2 present or S3 pile-up)");
  lines.push("| REJECT (S1, or the promise/motivation/rules collapse).");
  return `${lines.join("\n")}\n`;
}
