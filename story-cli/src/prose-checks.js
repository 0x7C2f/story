export const PROSE_CHECKS = [
  { check: "filter-words", label: "Filter words", lists: ["filterWords"] },
  { check: "adverbs", label: "Adverbs", lists: ["adverbSuffixes", "adverbExceptions"] },
  { check: "dialogue-tags", label: "Dialogue tags", lists: ["plainTags", "saidBookisms", "beatPronouns"] },
  { check: "echoes", label: "Echoes", lists: ["echoStopwords"] },
  { check: "repeated-phrases", label: "Repeated phrases", lists: ["phraseStopwords"] }
];

export const BASELINE_CHECKS = [
  { check: "signature-words", label: "Baseline signature words", lists: ["echoStopwords", "phraseStopwords"] }
];

export const DIALECT_CHECK = { check: "dialect-spellings", label: "British and American spellings", lists: ["dialectPairs"] };

export const PROSE_THRESHOLDS = {
  filterPerThousand: 10,
  adverbsPerThousand: 12,
  minRateWords: 300,
  maxBookisms: 2,
  echoWindow: 30,
  echoMinLength: 5,
  uniformMinSentences: 20,
  uniformSpread: 5,
  phraseLength: 4,
  phraseMinCount: 3,
  phraseLimit: 10
};
