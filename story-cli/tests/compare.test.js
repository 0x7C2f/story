import { test } from "node:test";
import assert from "node:assert";
import { compareChapters } from "../src/compare.js";

test("compareChapters handles empty arrays", () => {
  const result = compareChapters([], []);
  assert.deepStrictEqual(result, {
    chapters: [],
    beforeChapters: 0,
    afterChapters: 0,
    beforeWords: 0,
    afterWords: 0
  });
});

test("compareChapters identifies unchanged chapter", () => {
  const previous = [{ id: "chapter-01", title: "One", paragraphs: ["a", "b"], words: 10 }];
  const current = [{ id: "chapter-01", title: "One", paragraphs: ["a", "b"], words: 10 }];

  const result = compareChapters(previous, current);
  assert.deepStrictEqual(result, {
    chapters: [
      { id: "chapter-01", title: "One", status: "unchanged", before: 10, after: 10, unchanged: 1 }
    ],
    beforeChapters: 1,
    afterChapters: 1,
    beforeWords: 10,
    afterWords: 10
  });
});

test("compareChapters identifies changed chapter", () => {
  const previous = [{ id: "chapter-01", title: "One", paragraphs: ["a", "b"], words: 10 }];
  const current = [{ id: "chapter-01", title: "One", paragraphs: ["a", "c"], words: 12 }];

  const result = compareChapters(previous, current);
  assert.deepStrictEqual(result, {
    chapters: [
      { id: "chapter-01", title: "One", status: "changed", before: 10, after: 12, unchanged: 0.5 }
    ],
    beforeChapters: 1,
    afterChapters: 1,
    beforeWords: 10,
    afterWords: 12
  });
});

test("compareChapters identifies added chapter", () => {
  const previous = [];
  const current = [{ id: "chapter-01", title: "One", paragraphs: ["a", "b"], words: 10 }];

  const result = compareChapters(previous, current);
  assert.deepStrictEqual(result, {
    chapters: [
      { id: "chapter-01", title: "One", status: "added", before: 0, after: 10, unchanged: 0 }
    ],
    beforeChapters: 0,
    afterChapters: 1,
    beforeWords: 0,
    afterWords: 10
  });
});

test("compareChapters identifies removed chapter", () => {
  const previous = [{ id: "chapter-01", title: "One", paragraphs: ["a", "b"], words: 10 }];
  const current = [];

  const result = compareChapters(previous, current);
  assert.deepStrictEqual(result, {
    chapters: [
      { id: "chapter-01", title: "One", status: "removed", before: 10, after: 0, unchanged: 0 }
    ],
    beforeChapters: 1,
    afterChapters: 0,
    beforeWords: 10,
    afterWords: 0
  });
});

test("compareChapters identifies moved chapter", () => {
  const previous = [{ id: "chapter-01", title: "One", paragraphs: ["a", "b", "c"], words: 15 }];
  const current = [{ id: "chapter-02", title: "One", paragraphs: ["a", "b", "c"], words: 15 }];

  const result = compareChapters(previous, current);
  assert.deepStrictEqual(result, {
    chapters: [
      { id: "chapter-02", title: "One", status: "unchanged", before: 15, after: 15, unchanged: 1, movedFrom: "chapter-01" }
    ],
    beforeChapters: 1,
    afterChapters: 1,
    beforeWords: 15,
    afterWords: 15
  });
});

test("compareChapters matches by id even with few matching paragraphs", () => {
  const previous = [{ id: "chapter-01", title: "One", paragraphs: ["a", "b", "c"], words: 15 }];
  const current = [{ id: "chapter-01", title: "One (Edited)", paragraphs: ["x", "y", "z"], words: 18 }];

  const result = compareChapters(previous, current);
  assert.deepStrictEqual(result, {
    chapters: [
      { id: "chapter-01", title: "One (Edited)", status: "changed", before: 15, after: 18, unchanged: 0 }
    ],
    beforeChapters: 1,
    afterChapters: 1,
    beforeWords: 15,
    afterWords: 18
  });
});
