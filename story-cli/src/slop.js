import fs from "node:fs";
import path from "node:path";
import { warn } from "./findings.js";
import { portablePath } from "./files.js";
import {
  CONSTRUCTION_GUARDS,
  DEGENERATION_GUARDS,
  DENSITY_TICS,
  META_LEAK_GUARD,
  TAIL_WINDOW_LINES,
  listGuardClasses,
  loadSlopWhitelist,
  stripDialogue,
  stripMetadata
} from "./slop-guards.js";

// AI slop guards for `story slop`: deterministic counting over story prose.
// Everything here is pattern matching and density, like the prose linter: no
// scoring and no rewriting. A guard raises one warning per file per pattern,
// with its count and lines, and the report lists every hit so a writer can
// judge each one. A word the story uses on purpose is dismissed in
// continuity/exemptions.md like any other finding.
//
// The guard taxonomy lives in slop-guards.js: construction tells (severity
// blocking or advisory, review mechanical or semantic), density tics that
// fire only when count and rate floors pass together, and degeneration
// fingerprints (verbatim repetition, line loops, truncation). The classic
// three kinds below stay as they were:
// - words: machine diction a human first draft rarely reaches for;
// - phrases: boilerplate and filler clauses;
// - style: constructions and densities that machine prose repeats.

// [label, pattern] pairs matched whole-word and case-insensitive. Inflections
// ride in the pattern so one label covers the family.
export const SLOP_WORDS = [
  ["delve", "delv(?:e|es|ed|ing)"],
  ["tapestry", "tapestr(?:y|ies)"],
  ["moreover", "moreover"],
  ["furthermore", "furthermore"],
  ["crucial", "crucial(?:ly)?"],
  ["pivotal", "pivotal(?:ly)?"],
  ["testament", "testament"],
  ["resonate", "resonat(?:e|es|ed|ing)"],
  ["vibrant", "vibrant(?:ly)?"],
  ["bustling", "bustling"],
  ["intricate", "intricate(?:ly)?"],
  ["nuanced", "nuanced"],
  ["underscore", "underscor(?:e|es|ed|ing)"],
  ["myriad", "myriad"],
  ["plethora", "plethora"],
  ["realm", "realms?"],
  ["embark", "embark(?:s|ed|ing)?"],
  ["unleash", "unleash(?:es|ed|ing)?"],
  ["elevate", "elevat(?:e|es|ed|ing)"],
  ["seamless", "seamless(?:ly)?"],
  ["robust", "robust(?:ly)?"],
  ["leverage", "leverag(?:e|es|ed|ing)"],
  ["utilize", "utiliz(?:e|es|ed|ing)"],
  ["foster", "foster(?:s|ed|ing)?"],
  ["cultivate", "cultivat(?:e|es|ed|ing)"],
  ["harness", "harness(?:es|ed|ing)?"],
  ["empower", "empower(?:s|ed|ing)?"],
  ["unlock", "unlock(?:s|ed|ing)?"],
  ["navigate", "navigat(?:e|es|ed|ing)"],
  ["transformative", "transformative"],
  ["holistic", "holistic(?:ally)?"],
  ["synergy", "synerg(?:y|ies)"],
  ["multifaceted", "multifaceted"],
  ["game-changing", "game-chang(?:er|ing)"],
  ["cutting-edge", "cutting-edge"],
  ["state-of-the-art", "state-of-the-art"],
  ["ever-changing", "ever-changing"],
  ["ever-evolving", "ever-evolving"],
  ["fast-paced", "fast-paced"],
  ["breathtaking", "breathtaking"],
  ["profound", "profound(?:ly)?"],
  ["serene", "serene(?:ly)?"],
  ["illuminate", "illuminat(?:e|es|ed|ing|ion)"],
  ["captivate", "captivat(?:e|es|ed|ing|ion)"],
  ["mesmerize", "mesmeriz(?:e|es|ed|ing)"],
  ["meticulous", "meticulous(?:ly)?"],
  ["daunting", "daunting"],
  ["poignant", "poignant(?:ly)?"],
  ["evocative", "evocative(?:ly)?"],
  ["unforgettable", "unforgettable"],
  ["unmistakable", "unmistakable"],
  ["undeniable", "undeniably?"],
  ["insightful", "insight(?:ful|fully)"],
  ["thought-provoking", "thought-provoking"],
  ["uncharted", "uncharted"],
  ["unwavering", "unwavering"],
  ["relentless", "relentless(?:ly)?"],
  ["nestled", "nestled"],
  ["boast", "boast(?:s|ed|ing)?"],
  ["fleeting", "fleeting"],
  ["ethereal", "ethereal"],
  ["dazzling", "dazzling"],
  ["remarkable", "remarkabl(?:e|y)"],
  ["extraordinary", "extraordinary"],
  ["compelling", "compelling"],
  ["vivid", "vivid(?:ly)?"],
  ["striking", "striking(?:ly)?"],
  ["paradigm", "paradigms?"],
  ["ecosystem", "ecosystems?"],
  ["landscape", "landscapes?"],
  ["symphony", "symphon(?:y|ies)"],
  ["beacon", "beacons?"]
];

// Boilerplate clauses and stock phrases. Matched case-insensitively, with
// flexible whitespace between the words.
export const SLOP_PHRASES = [
  "it is important to note",
  "it's important to note",
  "important to note",
  "worth noting",
  "needless to say",
  "first and foremost",
  "in conclusion",
  "in summary",
  "to summarize",
  "at the end of the day",
  "in this day and age",
  "in today's",
  "when it comes to",
  "a testament to",
  "stands as a testament",
  "serves as a testament",
  "rich tapestry",
  "tapestry of",
  "delve into",
  "dive into",
  "deep dive",
  "navigate the complexities",
  "in the realm of",
  "the realm of",
  "the fabric of",
  "a beacon of",
  "a symphony of",
  "plays a role",
  "plays an important role",
  "plays a crucial role",
  "plays a vital role",
  "plays a key role",
  "plays a pivotal role",
  "in order to",
  "the fact that",
  "a wide range of",
  "a broad array of",
  "a vast array of",
  "a diverse range of",
  "a wealth of",
  "a myriad of",
  "a plethora of",
  "one of the most",
  "one of the few",
  "the world of",
  "a world of",
  "at its core",
  "the heart of",
  "against all odds",
  "tip of the iceberg",
  "needle in a haystack",
  "double-edged sword",
  "stands the test of time",
  "only time will tell",
  "a labor of love",
  "seemed to",
  "unlock the",
  "harness the power",
  "leverage the power"
];

// Constructions machine prose repeats. `perThousand` is the rate above which
// the guard warns (0: one occurrence is enough); rates need SLOP_THRESHOLDS
// minRateWords of prose before they mean anything.
export const SLOP_PATTERNS = [
  { label: "not only ... but also", source: "\\bnot only\\b[^.!?\\n]*\\bbut also\\b", perThousand: 0 },
  { label: "hedge stacking", source: "\\b(?:may|might|could|can)\\s+(?:potentially|perhaps|possibly)\\b", perThousand: 0 },
  { label: "intensifier", source: "\\b(?:very|really|extremely|incredibly|truly|absolutely|utterly|remarkably|exceptionally|undeniably|unquestionably)\\s+[a-z]", perThousand: 8 },
  { label: "em-dash", source: "—", perThousand: 20 },
  { label: "rule-of-three list", source: ",\\s*[\\w'-]{2,},\\s*(?:and|or)\\s+[\\w'-]{2,}", perThousand: 12 }
];

export const SLOP_THRESHOLDS = {
  minRateWords: 300
};

// The story folders `slop --all` scans. Chapter prose is the default scope.
const STORY_DIRS = ["chapters", "scenes", "characters", "worldbuilding", "glossary", "plot", "continuity"];

function wordMatcher(source) {
  return new RegExp(`\\b(?:${source})\\b`, "gi");
}

function phraseMatcher(phrase) {
  const words = phrase.split(/\s+/).map((word) => word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  return new RegExp(`\\b${words.join("\\s+")}\\b`, "gi");
}

function countMatches(matcher, text) {
  let count = 0;
  matcher.lastIndex = 0;
  while (matcher.exec(text) !== null) {
    count += 1;
  }
  return count;
}

function ratePerThousand(count, words) {
  return words >= SLOP_THRESHOLDS.minRateWords ? (count * 1000) / words : 0;
}

function wordCount(lines) {
  return lines.reduce((sum, line) => sum + (line.text.match(/\S+/g)?.length ?? 0), 0);
}

// The markdown body as lines, with the line number of each in the file. Code
// spans and fenced blocks blank out but keep their lines, HTML comments and
// .slop-whitelist literal spans mask out the same way, and heading lines are
// marked so the guards read prose only. The numbers the findings print point
// at the file the writer has open.
function proseLines(text, whitelist = []) {
  let body = stripMetadata(text);
  for (const literal of whitelist) {
    const needle = literal.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    body = body.replace(new RegExp(needle, "g"), (match) => match.replace(/[^\n]/g, " "));
  }
  const raw = body.split(/\r?\n/);
  let start = 0;
  if (raw[0]?.trim() === "---") {
    start = 1;
    while (start < raw.length && raw[start].trim() !== "---") {
      start += 1;
    }
    start += 1;
  }
  const lines = [];
  let fenced = false;
  for (let index = start; index < raw.length; index += 1) {
    const line = raw[index];
    if (/^\s*(```|~~~)/.test(line)) {
      fenced = !fenced;
      lines.push({ number: index + 1, text: "", heading: false });
      continue;
    }
    lines.push({
      number: index + 1,
      text: fenced ? "" : line.replace(/`[^`]*`/g, ""),
      heading: !fenced && /^\s{0,3}#{1,6}\s/.test(line)
    });
  }
  return lines;
}

// Files `story slop` reads: chapter prose, or with --all every story markdown
// file except the generated registries. Tooling is skipped, not scanned: a
// symlinked or plain AGENTS.md folder guide and the continuity/guides/ text
// behind the guides are instructions, and their meta vocabulary is not
// story prose.
function slopFiles(root, all) {
  const files = [];
  const take = (directory) => {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true }).sort((left, right) => left.name.localeCompare(right.name, undefined, { numeric: true }))) {
      if (entry.name.startsWith(".") || entry.name === "AGENTS.md") {
        continue;
      }
      const full = path.join(directory, entry.name);
      if (entry.isDirectory()) {
        if (all && entry.name !== "guides") {
          take(full);
        }
      } else if (entry.name.endsWith(".md") && entry.name !== "_index.md" && !entry.isSymbolicLink()) {
        files.push(full);
      }
    }
  };
  for (const dir of all ? STORY_DIRS : [STORY_DIRS[0]]) {
    const directory = path.join(root, dir);
    if (fs.existsSync(directory)) {
      take(directory);
    }
  }
  return files;
}

// Sentences as normalized text plus their words, for the repetition detector.
function proseSentences(lines) {
  const out = [];
  for (const line of lines) {
    if (line.heading || line.text.trim() === "") {
      continue;
    }
    for (const raw of line.text.split(/(?<=[.!?])\s+/)) {
      const words = raw.match(/\S+/g) ?? [];
      if (words.length === 0) {
        continue;
      }
      const normalized = raw.toLowerCase().replace(/[^a-z0-9' ]/g, "").replace(/\s+/g, " ").trim();
      out.push({ number: line.number, words: words.length, normalized });
    }
  }
  return out;
}

function findingEntry(map, totals, kind, label, severity, review, count, line) {
  if (count === 0) {
    return;
  }
  const key = `${kind}:${label}`;
  const entry = map.get(key) ?? { kind, label, severity, review, count: 0, lines: [] };
  entry.count += count;
  if (line !== null && entry.lines.length < 8 && !entry.lines.includes(line)) {
    entry.lines.push(line);
  }
  map.set(key, entry);
  totals.set(key, { kind, label, severity, count: (totals.get(key)?.count ?? 0) + count });
}

// `story slop`: every AI-tell the guards find, one warning per file per
// pattern. Blocking and advisory findings are kept apart: --fail-on=blocking
// fails only on the blocking ones. ok is false while the fail-on rule is
// broken.
export function slopReport(root, options = {}) {
  const failOn = options["fail-on"] === "blocking" ? "blocking" : "all";
  const all = options.all === true || options.all === "true";
  const whitelist = loadSlopWhitelist(root);
  const warnings = [];
  const files = [];
  const totals = new Map();
  const scannedFiles = slopFiles(root, all);
  const corpus = scannedFiles.map((filePath) => ({
    label: portablePath(path.relative(root, filePath)),
    lines: proseLines(fs.readFileSync(filePath, "utf8"), whitelist)
  }));

  for (const { label, lines } of corpus) {
    const words = wordCount(lines);
    const found = new Map();
    const prose = lines.filter((line) => !line.heading && line.text.trim() !== "");
    const tail = prose.slice(-TAIL_WINDOW_LINES);

    for (const [name, source] of SLOP_WORDS) {
      const matcher = wordMatcher(source);
      for (const line of prose) {
        findingEntry(found, totals, "word", name, "advisory", "semantic", countMatches(matcher, line.text), line.number);
      }
    }
    for (const phrase of SLOP_PHRASES) {
      const matcher = phraseMatcher(phrase);
      for (const line of prose) {
        findingEntry(found, totals, "phrase", phrase, "advisory", "semantic", countMatches(matcher, line.text), line.number);
      }
    }
    for (const pattern of SLOP_PATTERNS) {
      const matcher = new RegExp(pattern.source, "gi");
      const hitsByLine = prose.map((line) => ({ number: line.number, hits: countMatches(matcher, line.text) }));
      const count = hitsByLine.reduce((sum, entry) => sum + entry.hits, 0);
      // A rate threshold needs enough prose to mean anything; below it the
      // pattern reports nothing rather than swinging on a short file.
      const over = count > 0 && (pattern.perThousand === 0 || ratePerThousand(count, words) > pattern.perThousand);
      if (!over) {
        continue;
      }
      for (const entry of hitsByLine) {
        findingEntry(found, totals, "style", pattern.label, "advisory", "semantic", entry.hits, entry.number);
      }
    }

    // Construction tells: sentence-shaped, blocking or advisory per class.
    for (const guard of CONSTRUCTION_GUARDS) {
      const scope = guard.tailOnly ? tail : prose;
      let count = 0;
      let first = null;
      for (const line of scope) {
        const text = guard.narrationOnly ? stripDialogue(line.text) : line.text;
        let hits = 0;
        for (const source of guard.sources) {
          hits += countMatches(new RegExp(source, "gi"), text);
        }
        count += hits;
        if (hits > 0 && first === null) {
          first = line.number;
        }
      }
      findingEntry(found, totals, "pattern", guard.id, guard.severity, guard.review, count, first);
    }

    // Density tics: both the hit floor and the rate floor must pass, so one
    // stock beat is normal prose and a cluster is a template.
    for (const tic of DENSITY_TICS) {
      let count = 0;
      let first = null;
      for (const line of prose) {
        const text = tic.narrationOnly ? stripDialogue(line.text) : line.text;
        let hits = 0;
        for (const source of tic.patterns) {
          hits += countMatches(new RegExp(source, "gi"), text);
        }
        count += hits;
        if (hits > 0 && first === null) {
          first = line.number;
        }
      }
      const rate = words > 0 ? (count * 1000) / words : 0;
      if (count >= tic.minHits && rate > tic.perThousand) {
        findingEntry(found, totals, "tic", tic.id, "advisory", "semantic", count, first);
      }
    }

    // Story-about-itself vocabulary: advisory from two hits.
    {
      let count = 0;
      let first = null;
      for (const line of prose) {
        const text = stripDialogue(line.text);
        let hits = 0;
        for (const source of META_LEAK_GUARD.sources) {
          hits += countMatches(new RegExp(source, "gi"), text);
        }
        count += hits;
        if (hits > 0 && first === null) {
          first = line.number;
        }
      }
      if (count >= META_LEAK_GUARD.minHits) {
        findingEntry(found, totals, "tic", META_LEAK_GUARD.id, "advisory", "semantic", count, first);
      }
    }

    // Adjacent identical prose lines: a loop, not a refrain.
    for (let index = 1; index < prose.length; index += 1) {
      const previous = prose[index - 1];
      const current = prose[index];
      const a = previous.text.toLowerCase().replace(/[^a-z0-9' ]/g, "").replace(/\s+/g, " ").trim();
      const b = current.text.toLowerCase().replace(/[^a-z0-9' ]/g, "").replace(/\s+/g, " ").trim();
      if (a === b && a.split(/\s+/).length >= DEGENERATION_GUARDS.adjacent.minWords) {
        findingEntry(found, totals, "degenerate", DEGENERATION_GUARDS.adjacent.id, "blocking", "mechanical", 1, current.number);
      }
    }

    // Truncation: the file's last prose line runs out of punctuation.
    const last = prose[prose.length - 1];
    if (last && !/^\s*[-*>|]/.test(last.text)) {
      const lastWords = last.text.match(/\S+/g)?.length ?? 0;
      const ended = /[.!?"'\u2019\u201d)\]*_`—]$/.test(last.text.trim());
      if (lastWords >= 3 && !ended) {
        findingEntry(found, totals, "degenerate", DEGENERATION_GUARDS.truncation.id, "blocking", "mechanical", 1, last.number);
      }
    }

    const findings = [...found.values()].sort((left, right) => severityRank(left.severity) - severityRank(right.severity) || right.count - left.count || left.label.localeCompare(right.label));
    if (findings.length > 0) {
      files.push({ file: label, words, findings });
    }
    for (const finding of findings) {
      const linesText = finding.lines.length > 0 ? ` (line${finding.lines.length === 1 ? "" : "s"} ${finding.lines.join(", ")})` : "";
      const what = finding.kind === "word"
        ? `"${finding.label}" x${finding.count}${linesText} reads as AI slop`
        : finding.kind === "phrase"
          ? `phrase "${finding.label}" x${finding.count}${linesText} is AI boilerplate`
          : `${finding.label} x${finding.count}${linesText} repeats like machine prose`;
      warnings.push({
        ...warn(codeFor(finding.kind), `${label}: [${finding.severity}] ${what}`, label),
        severity: finding.severity,
        review: finding.review
      });
    }
  }

  // Verbatim repetition: a long sentence recurring across the story is a
  // degeneration loop a model cannot see in itself.
  const sentences = new Map();
  for (const { label, lines } of corpus) {
    for (const sentence of proseSentences(lines)) {
      if (sentence.words < DEGENERATION_GUARDS.repetition.minWords) {
        continue;
      }
      const bucket = sentences.get(sentence.normalized) ?? [];
      bucket.push({ label, number: sentence.number });
      sentences.set(sentence.normalized, bucket);
    }
  }
  for (const [normalized, places] of sentences) {
    if (places.length < DEGENERATION_GUARDS.repetition.count) {
      continue;
    }
    const shown = normalized.split(" ").slice(0, 12).join(" ");
    const where = places.slice(0, 6).map((place) => `${place.label}:${place.number}`).join(", ");
    const head = places[0].label;
    const finding = { kind: "degenerate", label: DEGENERATION_GUARDS.repetition.id, severity: "blocking", review: "mechanical", count: places.length, lines: [] };
    const fileEntry = files.find((entry) => entry.file === head);
    const summary = { ...finding, lines: places.slice(0, 8).map((place) => place.number) };
    if (fileEntry) {
      fileEntry.findings.push(summary);
    } else {
      files.push({ file: head, words: 0, findings: [summary] });
    }
    totals.set(`degenerate:${DEGENERATION_GUARDS.repetition.id}`, {
      kind: "degenerate",
      label: DEGENERATION_GUARDS.repetition.id,
      severity: "blocking",
      count: (totals.get(`degenerate:${DEGENERATION_GUARDS.repetition.id}`)?.count ?? 0) + places.length
    });
    warnings.push({
      ...warn("ai-slop-degenerate", `${head}: [blocking] sentence "${shown} ..." repeats verbatim x${places.length} (${where})`, head),
      severity: "blocking",
      review: "mechanical"
    });
  }

  const blocking = warnings.filter((finding) => finding.severity === "blocking");
  const advisory = warnings.filter((finding) => finding.severity !== "blocking");
  return {
    ok: failOn === "blocking" ? blocking.length === 0 : warnings.length === 0,
    failOn,
    errors: [],
    warnings,
    blocking,
    advisory,
    files,
    scanned: scannedFiles.length,
    totals: [...totals.values()].sort((left, right) => severityRank(left.severity) - severityRank(right.severity) || right.count - left.count || left.label.localeCompare(right.label))
  };
}

function severityRank(severity) {
  return severity === "blocking" ? 0 : 1;
}

function codeFor(kind) {
  return kind === "word" ? "ai-slop-word"
    : kind === "phrase" ? "ai-slop-phrase"
      : kind === "style" ? "ai-slop-style"
        : kind === "pattern" ? "ai-slop-pattern"
          : kind === "tic" ? "ai-slop-tic"
            : "ai-slop-degenerate";
}

// `story slop` as text: one block per file with severity and review class,
// then the totals that show which pattern runs through the whole story.
export function formatSlopReport(report) {
  const lines = [`AI slop: ${report.scanned} files scanned, ${report.blocking.length} blocking and ${report.advisory.length} advisory findings in ${report.files.length} files`];
  for (const file of report.files) {
    lines.push("");
    lines.push(`${file.file}${file.words > 0 ? ` (${file.words} words)` : ""}`);
    for (const finding of file.findings) {
      const where = finding.lines.length > 0 ? ` lines ${finding.lines.join(", ")}` : "";
      lines.push(`  [${finding.severity}/${finding.review}] ${finding.kind} "${finding.label}" x${finding.count}:${where}`);
    }
  }
  if (report.totals.length > 0) {
    lines.push("");
    lines.push("story totals:");
    for (const total of report.totals.slice(0, 20)) {
      lines.push(`  [${total.severity}] ${total.kind} "${total.label}" x${total.count}`);
    }
  }
  lines.push("");
  lines.push(`fail-on: ${report.failOn} — ${report.ok ? "pass" : "fail"}; story slop --list-classes prints the guard taxonomy`);
  return `${lines.join("\n")}\n`;
}

// `story slop --list-classes`: the taxonomy as a table, one row per guard.
export function formatGuardClasses() {
  const rows = listGuardClasses();
  const lines = ["AI slop guard classes:", ""];
  const idWidth = Math.max(...rows.map((row) => row.id.length), 2);
  for (const row of rows) {
    lines.push(`  ${row.id.padEnd(idWidth)}  ${row.severity}/${row.review}  ${row.gating}`);
    lines.push(`  ${" ".repeat(idWidth)}  ${row.summary}`);
  }
  lines.push("");
  lines.push("severity: blocking findings are never legitimate prose; advisory findings cluster");
  lines.push("before they mean anything. review: mechanical fixes in place; semantic needs the scene.");
  lines.push("Intentional hits are dismissed in continuity/exemptions.md like any other finding.");
  return `${lines.join("\n")}\n`;
}
