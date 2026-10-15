// The AI slop guard taxonomy behind `story slop`. Pattern classes are adapted
// from zenstory-ai's story-deslop detectors (check-ai-patterns.js and
// check-degeneration.js, MIT) to English prose and this book's style-sheet:
// the style-sheet is the authority, so its endorsed habits (em-dashes without
// spaces, for one) are scored by density, never banned outright.
//
// Two axes on every class, the same way the source detectors carry them:
// - severity: `blocking` findings are never legitimate prose and a rewrite is
//   always the fix (AI voice leakage, meta leakage, the negative-setup
//   positive-flip family, degeneration); `advisory` findings cluster before
//   they mean anything and a human reads context before touching them.
// - review: `mechanical` (surface form, fix in place) or `semantic` (may carry
//   narrative function; read the scene before deleting).
//
// Density classes report only when both a hit floor and a rate floor pass,
// the calibration trick of the source detectors: one occurrence of a stock
// reaction is normal human prose, a cluster of them is a template.
//
// Everything here is report-only. No rewrite, no scoring, no model calls.

import fs from "node:fs";
import path from "node:path";

// The last N prose lines of a file are the "tail window" where closing
// summaries and trailer teases live.
export const TAIL_WINDOW_LINES = 12;

// Literal spans listed in the project's `.slop-whitelist` (one literal per
// line, # comments) are masked before scanning. Inherited style, deliberate
// repetition, and in-world dialect get a pass without weakening the guards.
export function loadSlopWhitelist(root) {
  const file = path.join(root, ".slop-whitelist");
  if (!fs.existsSync(file)) {
    return [];
  }
  return fs.readFileSync(file, "utf8")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && !line.startsWith("#"));
}

// ---------------------------------------------------------------------------
// Construction guards: sentence-shaped tells. Blocking unless noted.
// ---------------------------------------------------------------------------

export const CONSTRUCTION_GUARDS = [
  {
    id: "not-a-but-b",
    severity: "blocking",
    review: "mechanical",
    summary: "negative setup followed by a positive flip in the same sentence (\"not X, but Y\")",
    fix: "delete the negative setup and write the positive term directly",
    sources: [
      "\\b(?:it|that|this|there|he|she|they)\\s+(?:was|were|is|are|wasn't|weren't)\\s+not\\s+[^.!?]{1,60}?,?\\s+(?:but|rather)\\b",
      "\\bnot\\s+(?:a|an|the|his|her|their|its|just|merely|only|simply|quite)?\\s*[^.!?,:;]{2,50},\\s*(?:but|rather)\\s+",
      "\\bwas not\\s+[^.!?]{1,50}\\s+so much\\s+(?:as|that)\\b"
    ]
  },
  {
    id: "reverse-not-is",
    severity: "blocking",
    review: "mechanical",
    summary: "the reverse comparison \"it was A, not B\"",
    fix: "state A outright, or fold B into the action",
    sources: [
      "\\b(?:it|that|this)\\s+(?:was|were|is|are)\\s+[^.!?]{2,50},\\s*not\\s+[^.!?]{1,40}[.!?]",
      "\\b(?:it|that|this)\\s+(?:was|were|is|are)\\s+not\\s+[^.!?]{2,50}\\s+so much as\\b"
    ]
  },
  {
    id: "voice-contrast",
    severity: "blocking",
    review: "mechanical",
    summary: "a flat or quiet voice carrying outsized force (\"voice low, but it carried\")",
    fix: "write the words, the sound, or the action instead",
    sources: [
      "\\b(?:low|quiet|soft|small|flat|calm|steady|even|cold|thin)\\b[^.!?]{0,20}\\b(?:voice|tone|whisper|words)\\b[^.!?]{0,28}\\b(?:but|yet)\\b",
      "\\b(?:voice|tone|whisper|words)\\b[^.!?]{0,24}\\b(?:low|quiet|soft|small|flat|steady)\\b[^.!?]{0,28}\\b(?:but|yet)\\b",
      "\\b(?:quiet|low|soft|small|flat|steady)\\b[^.!?]{0,24}\\b(?:voice|tone|whisper)\\b[^.!?]{0,30}\\b(?:carried|carries|filled|filled the|cut|landed|held)\\b"
    ]
  },
  {
    id: "negation-parade",
    severity: "blocking",
    review: "mechanical",
    summary: "stacked negations resolving into one bare positive (\"no X, no Y, just Z\")",
    fix: "keep the one strongest item and write it as fact",
    sources: [
      "(?:^|[.!?]\\s+)(?:There (?:was|were) |It was |He was |She was )?no\\s+[^.!?]{2,30}[,.;]\\s*(?:no\\s+[^.!?]{2,30}[,.;]){1,}\\s*(?:just|only|merely)\\b",
      "^(?:No\\s+[^.!?]{2,30}[.!?]\\s*){2,}(?:Just|Only|Merely)\\b"
    ]
  },
  {
    id: "trailer-ending",
    severity: "blocking",
    review: "mechanical",
    summary: "a trailer tease closing the scene (\"little did X know\", \"it was only the beginning\")",
    fix: "close on the concrete action or the open question instead",
    tailOnly: true,
    sources: [
      "\\blittle did\\s+[^.!?]{2,40}\\s+know\\b",
      "\\bwhat\\s+[^.!?]{2,32}\\s+(?:didn't|did not)\\s+know\\b",
      "\\bno one knew\\b",
      "\\b(?:it|this|that)\\s+was\\s+(?:only|just)\\s+the\\s+beginning\\b",
      "\\bwas\\s+(?:only |just )?(?:the )?beginning\\b",
      "\\bthe\\s+(?:gears|wheels|hand)\\s+of\\s+fate\\b|\\bfate's\\s+(?:gears|wheels|hand)\\b",
      "\\bthe\\s+calm\\s+before\\b",
      "\\bthe\\s+(?:real\\s+)?storm\\s+(?:was\\s+|is\\s+)?(?:coming|brewing|gathering)\\b",
      "\\bbut\\s+(?:that|it|this)\\s+was\\s+a\\s+lie\\b",
      "\\bor so\\s+[^.!?]{2,30}\\s+thought\\b"
    ]
  },
  {
    id: "chapter-summary-close",
    severity: "blocking",
    review: "mechanical",
    summary: "the scene ends on a status summary instead of action (\"everything had changed\")",
    fix: "delete the summary; let the last concrete detail stand",
    tailOnly: true,
    sources: [
      "\\b(?:this|that)\\s+night\\s+(?:would|will|had)\\b",
      "\\beverything\\s+(?:had\\s+)?changed\\b",
      "\\bchanged\\s+(?:everything|forever|it all)\\b",
      "\\b(?:his|her|their)\\s+(?:life|world|story|journey)\\s+(?:was\\s+|had\\s+)?(?:just\\s+)?(?:begun|changed)\\b",
      "\\ba\\s+new\\s+(?:life|beginning|chapter)\\s+(?:was\\s+)?(?:just\\s+)?beginning\\b",
      "\\b(?:fate|destiny)\\b[^.!?]{0,26}\\b(?:gears|chess|dice|plan|hand|rewrote|reshaped|arranged)\\b"
    ]
  },
  {
    id: "placeholder-leakage",
    severity: "blocking",
    review: "mechanical",
    summary: "placeholder, refusal, or AI self-reference leaked into the prose",
    fix: "regenerate the affected passage; never leave the marker in place",
    sources: [
      "\\uFFFD",
      "\\b(?:TODO|TBD|PLACEHOLDER|LOREM IPSUM)\\b",
      "[\\[(](?:\\s*)?(?:omitted|excerpt|placeholder|scene missing|to (?:be )?(?:written|filled|added|come))\\b[^\\])]{0,24}[\\])]",
      "\\b(?:as an ai|as a language model|as an artificial intelligence)\\b",
      "\\bhere'?s\\s+(?:a|the|an)\\s+(?:draft|version|chapter|story)\\b"
    ]
  },
  {
    id: "refusal-voice",
    severity: "blocking",
    review: "mechanical",
    summary: "model refusal voice in narration (\"I cannot continue writing\")",
    fix: "regenerate the affected passage",
    narrationOnly: true,
    sources: [
      "\\bI\\s+(?:cannot|can't|am unable to|won't be able to)\\s+(?:continue|write|generate|complete|proceed|fulfill|create)\\b",
      "\\bI\\s+apologi[sz]e,?\\s+but\\b",
      "\\b(?:as an ai|as a language model)\\b"
    ]
  },
  {
    id: "engineering-leakage",
    severity: "blocking",
    review: "mechanical",
    summary: "writing-pipeline vocabulary inside the story (\"plot point\", \"the protagonist\")",
    fix: "rewrite in the story's own terms, or move the note out of the prose",
    sources: [
      "\\bplot[- ]points?\\b",
      "\\bbeat sheets?\\b",
      "\\bstory bible\\b",
      "\\bstyle sheets?\\b",
      "\\bword[- ]counts?\\b",
      "\\bchapter (?:goal|summary|outline)\\b",
      "\\bthe protagonist\\b",
      "\\bthe antagonist\\b",
      "\\bnarrative (?:arc|structure|tension|stakes)\\b",
      "\\bauthor'?s? (?:intent|note|voice)\\b",
      "\\b(?:the|this|our) outline\\b(?!\\s+of\\b)"
    ]
  },
  {
    id: "double-hyphen",
    severity: "advisory",
    review: "mechanical",
    summary: "double hyphen used as a dash; the style-sheet wants em-dashes (—) without spaces",
    fix: "replace with an em-dash",
    sources: [
      "(?<!-)--(?!-)"
    ]
  }
];

// Story-about-itself vocabulary: chapter talk, the reader, the plot. Only
// suspicious outside dialogue and outside in-world usage, so it is masked for
// dialogue and advisory at two hits or more.
export const META_LEAK_GUARD = {
  id: "meta-leak-tic",
  severity: "advisory",
  review: "semantic",
  minHits: 2,
  summary: "story-about-itself vocabulary clustered (\"this chapter\", \"the reader\", \"the plot\")",
  fix: "return to the character's view; keep meta talk in the records",
  narrationOnly: true,
  sources: [
    "\\b(?:this|the|next|last|previous|first|second|third) chapter\\b",
    "\\bthe readers?\\b",
    "\\bforeshadow(?:ing|ed|s)?\\b",
    "\\bthe narrative\\b",
    "\\bthe plot\\b",
    "\\bsubplots?\\b",
    "\\bact (?:one|two|three|1|2|3)\\b",
    "\\bcliffhangers?\\b"
  ]
};

// ---------------------------------------------------------------------------
// Density tics: cluster before they mean anything. Advisory, semantic.
// Each entry: patterns (counted together), minHits, perThousand rate floor,
// optional per-kilo floor mirroring the source calibration.
// ---------------------------------------------------------------------------

export const DENSITY_TICS = [
  {
    id: "stock-reaction-tic",
    summary: "stock body-reaction beats clustered (fingers tightening, jaws clenching, chests tightening)",
    fix: "deletion test each beat: cut it unless injury, habit, or consequence needs it",
    narrationOnly: true,
    minHits: 4,
    perThousand: 1.5,
    patterns: [
      "\\b(?:fingers?|hands?|grip|knuckles?|palms?)\\b[^.!?]{0,22}\\b(?:tightened|whitened|clenched|curled|flexed|closed|shook|trembled)\\b",
      "\\b(?:jaw|teeth|mouth)\\b[^.!?]{0,18}\\b(?:clenched|tightened|set|gritted)\\b",
      "\\b(?:throat|chest|stomach|gut|heart|lungs?)\\b[^.!?]{0,22}\\b(?:tightened|ached|dropped|lurched|clenched|burned|hammered|pounded|sank|twisted|constricted)\\b",
      "\\bbreath\\b[^.!?]{0,34}\\b(?:didn't know|did not know|never knew)\\b[^.!?]{0,22}\\bholding\\b",
      "\\b(?:eyes?|gaze|look|glance)\\b[^.!?]{0,18}\\b(?:flashed|darkened|softened|narrowed|widened|flickered|darted|lingered|drifted)\\b",
      "\\b(?:lips?|mouth|corners? of (?:his|her) mouth)\\b[^.!?]{0,18}\\b(?:quirked|curled|twitched|pressed|thinned|tightened)\\b",
      "\\b(?:brows?|eyebrows?|forehead)\\b[^.!?]{0,14}\\b(?:furrowed|creased|lifted|rose|drew|knitted)\\b",
      "\\bvoice\\b[^.!?]{0,18}\\b(?:dropped|fell|softened|hardened|tightened|went flat|went quiet|shook|broke)\\b",
      "\\b(?:skin|hair)\\b[^.!?]{0,26}\\b(?:prickled|crawled|raised|stood)\\b"
    ]
  },
  {
    id: "micro-action-tic",
    summary: "weak-adverb micro-beats stacked (\"for a moment\", \"slightly\", \"a beat\")",
    fix: "cut the hedged beat or commit to the plain action",
    narrationOnly: true,
    minHits: 5,
    perThousand: 6,
    patterns: [
      "\\b(?:slightly|faintly|softly|quietly|gently|subtly|somewhat|almost|nearly|barely)\\s+\\w+ed\\b",
      "\\bfor a (?:moment|beat|second|instant|while)\\b",
      "\\bjust a (?:little|bit|moment|beat|second)\\b",
      "\\ba (?:moment|beat|second) (?:later|passed|of silence)\\b",
      "\\b(?:paused|stopped|hesitated) (?:for )?(?:a (?:moment|beat|second))\\b"
    ]
  },
  {
    id: "negation-pair-tic",
    summary: "negation pairs run as a habit (\"didn't X, and didn't Y\")",
    fix: "write what did happen; keep one negation if it earns its place",
    minHits: 3,
    perThousand: 3,
    patterns: [
      "\\b(?:didn't|did not|wasn't|was not|hadn't|had not|couldn't|could not|wouldn't|would not)\\b[^.!?]{1,34},?\\s*(?:and|nor)\\s+(?:didn't|did not|wasn't|was not|hadn't|had not|couldn't|could not|neither|nor)\\b",
      "\\bno\\s+\\w+[^.!?]{1,26}\\band no\\s+\\w+\\b"
    ]
  },
  {
    id: "abstract-summary-tic",
    summary: "abstract author-summary lifts clustered (fate, \"finally understood\", \"only the beginning\")",
    fix: "delete the summary; ground the beat in what the character sees or does",
    minHits: 3,
    perThousand: 4,
    patterns: [
      "\\bin that moment\\b[^.!?]{0,30}\\b(?:finally|at last|suddenly)?\\s*(?:understood|realized|knew|saw|felt)\\b",
      "\\bonly then did\\b",
      "\\bfinally understood\\b",
      "\\bfrom that moment on\\b",
      "\\bfor the first time\\b[^.!?]{0,30}\\b(?:felt|understood|knew|realized|saw)\\b",
      "\\b(?:fate|destiny)\\b[^.!?]{0,28}\\b(?:gears|chess|dice|plan|hand|wove|arranged|decreed)\\b",
      "\\bthe beginning of the end\\b",
      "\\bso it (?:began|started)\\b",
      "\\b(?:it|that) changed everything\\b",
      "\\ba new (?:beginning|dawn|era|chapter)\\b"
    ]
  },
  {
    id: "cliche-density-tic",
    summary: "stock imagery phrases clustered (a flicker of, barely perceptible, hung in the air)",
    fix: "cut to the plain fact, or keep the single strongest image and delete the rest",
    minHits: 4,
    perThousand: 4,
    patterns: [
      "\\ba (?:flicker|whisper|hint|trace|ghost|shadow|touch|note|spark|glimmer|ripple|flicker) of\\b",
      "\\bbarely (?:perceptible|audible|visible|there|there at all)\\b",
      "\\balmost imperceptib\\w*\\b",
      "\\bunmistakabl\\w*\\b",
      "\\b(?:hung|hangs|hung heavy) in the air\\b",
      "\\btime seemed to (?:slow|stop|stand still|stretch)\\b",
      "\\b(?:as cold|cold) as (?:ice|stone|death|winter)\\b",
      "\\b(?:sharp|dark|still|white|black|quiet) as (?:a |the )?\\w{2,10}\\b",
      "\\b(?:sea|ocean|storm|wave|wall|flood|torrent) of\\s+\\w+\\b"
    ]
  },
  {
    id: "metaphor-density-tic",
    summary: "simile markers clustered (like a, as if, as though)",
    fix: "keep the one or two images that carry information; plain-declare the rest",
    minHits: 6,
    perThousand: 12,
    patterns: [
      "\\b(?:as if|as though|like a|like the|as if the|as though the)\\b"
    ]
  },
  {
    id: "reasoning-chain-tic",
    summary: "explanatory judgment chains clustered (knew, realized, this meant, must have)",
    fix: "show the inference in action or cut it; the reader can connect the beats",
    minHits: 5,
    perThousand: 8,
    patterns: [
      "\\b(?:he|she|they|[A-Z][a-z]+)\\s+(?:knew|realized|understood|recognized)\\b",
      "\\bthis (?:meant|was)\\b",
      "\\bit was (?:clear|obvious|plain)\\b",
      "\\bthere was no (?:doubt|question|denying)\\b",
      "\\bafter all\\b",
      "\\bmust have\\b",
      "\\bhad to (?:be|mean|admit|acknowledge)\\b"
    ]
  },
  {
    id: "telling-emotion-tic",
    summary: "named emotion where the scene should carry it (\"he felt a wave of\")",
    fix: "cut the label; keep the choice, the line, or the consequence",
    minHits: 4,
    perThousand: 4,
    patterns: [
      "\\b(?:he|she|they|[A-Z][a-z]+) felt\\b",
      "\\bfelt a (?:wave|surge|pang|flush|rush|prick|sting|flicker) of\\b",
      "\\b(?:was|were) filled with\\b",
      "\\bcouldn't help but\\b",
      "\\b(?:heart|chest) (?:swelled|ached|broke|sang)\\b"
    ]
  },
  {
    id: "action-list-tic",
    summary: "surveillance-camera action chains with no interiority (walked, opened, set down)",
    fix: "merge the chain into the one action that matters; add the viewpoint's judgment",
    narrationOnly: true,
    minHits: 5,
    perThousand: 5,
    patterns: [
      "\\b(?:walked|turned|picked up|set down|opened|closed|stepped|glanced|stood|sat|reached|pulled|pushed|placed|grabbed|crossed|shifted|slid|tossed|dropped|lifted|knelt|leaned|moved)\\b"
    ]
  }
];

// ---------------------------------------------------------------------------
// Degeneration: fingerprints a degrading model cannot self-report.
// ---------------------------------------------------------------------------

export const DEGENERATION_GUARDS = {
  // A visible sentence of >= minWords words repeated >= count times anywhere in
  // the scanned story is a loop, not a refrain (refrains earn exemptions).
  repetition: { id: "verbatim-repetition", minWords: 12, count: 3, severity: "blocking", review: "mechanical" },
  // Two identical prose lines back to back.
  adjacent: { id: "adjacent-loop", minWords: 8, severity: "blocking", review: "mechanical" },
  // The file's last prose line runs out of terminal punctuation.
  truncation: { id: "mid-sentence-truncation", severity: "blocking", review: "mechanical" }
};

// Metadata markup is not prose: HTML comments and the template notes they
// carry are never scanned.
export function stripMetadata(text) {
  return text.replace(/<!--[\s\S]*?-->/g, (match) => match.replace(/[^\n]/g, " "));
}

// Dialogue spans masked out for narration-only guards. Curly and straight
// pairs both count; the mask keeps character offsets stable.
export function stripDialogue(text) {
  return text
    .replace(/\u201c[^\u201c\u201d]{0,2000}\u201d/g, (match) => match.replace(/[^\n]/g, " "))
    .replace(/"[^"\n]{0,2000}"/g, (match) => match.replace(/[^\n]/g, " "))
    .replace(/'[^'\n]{1,200}'/g, (match) => match.replace(/[^\n]/g, " "));
}

// The catalog `story slop --list-classes` prints.
export function listGuardClasses() {
  const rows = [];
  for (const guard of CONSTRUCTION_GUARDS) {
    rows.push({ id: guard.id, severity: guard.severity, review: guard.review, gating: "per occurrence", summary: guard.summary });
  }
  rows.push({ id: META_LEAK_GUARD.id, severity: META_LEAK_GUARD.severity, review: META_LEAK_GUARD.review, gating: `>=${META_LEAK_GUARD.minHits} hits, narration only`, summary: META_LEAK_GUARD.summary });
  for (const tic of DENSITY_TICS) {
    rows.push({ id: tic.id, severity: "advisory", review: "semantic", gating: `>=${tic.minHits} hits and >${tic.perThousand}/1k words`, summary: tic.summary });
  }
  rows.push({ id: DEGENERATION_GUARDS.repetition.id, severity: "blocking", review: "mechanical", gating: `sentence >=${DEGENERATION_GUARDS.repetition.minWords} words x${DEGENERATION_GUARDS.repetition.count}`, summary: "a long sentence repeated verbatim across the story" });
  rows.push({ id: DEGENERATION_GUARDS.adjacent.id, severity: "blocking", review: "mechanical", gating: `line >=${DEGENERATION_GUARDS.adjacent.minWords} words, back to back`, summary: "identical lines looped" });
  rows.push({ id: DEGENERATION_GUARDS.truncation.id, severity: "blocking", review: "mechanical", gating: "file tail", summary: "prose ends mid-sentence without terminal punctuation" });
  rows.push({ id: "em-dash-density", severity: "advisory", review: "mechanical", gating: ">20/1k words", summary: "em-dash overuse (the style-sheet endorses em-dashes; density is the tell)" });
  rows.push({ id: "period-stutter", severity: "advisory", review: "semantic", gating: "run of >=6 sentences <=5 words", summary: "telegraphic short-sentence runs" });
  rows.push({ id: "long-paragraph", severity: "advisory", review: "semantic", gating: "paragraph >220 words", summary: "paragraph runs long for screen reading" });
  rows.push({ id: "low-connective-density", severity: "advisory", review: "semantic", gating: "file-level rates", summary: "outline-like prose: short sentences, few connectives" });
  rows.push({ id: "formulaic-parallelism", severity: "advisory", review: "semantic", gating: "3+ sentences sharing an opener", summary: "mechanical parallel runs" });
  return rows;
}
