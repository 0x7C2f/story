import { describe, it } from 'node:test';
import { strict as assert } from 'node:assert';
import { formatTimeline } from '../src/timeline.js';

describe('formatTimeline', () => {
  it('formats an empty timeline', () => {
    const timeline = {
      chronology: [],
      undated: [],
      pov: [],
      presence: [],
      hasCalendar: false,
      unit: 'words'
    };

    const expected = `Timeline: 0 dated, 0 undated

Chronology (story order):
- None: add date (YYYY-MM-DD) and time to scenes or chapters to order them

POV balance:
- None

Character presence:
- None\n`;
    assert.equal(formatTimeline(timeline, 0), expected);
  });

  it('formats timeline with hasCalendar true', () => {
    const timeline = {
      chronology: [],
      undated: [],
      pov: [],
      presence: [],
      hasCalendar: true,
      unit: 'words'
    };

    const expected = `Timeline: 0 dated, 0 undated

Chronology (story order):
- None: add date (YYYY-MM-DD, or a story calendar date) and time to scenes or chapters to order them

POV balance:
- None

Character presence:
- None\n`;
    assert.equal(formatTimeline(timeline, 0), expected);
  });

  it('formats a timeline with dated chronology and notes', () => {
    const timeline = {
      chronology: [
        {
          date: '2023-01-01',
          time: '10:00',
          id: 'scene1',
          title: 'Scene 1',
          pov: 'Alice',
          location: 'Home',
          toldLate: true,
          chapterNumber: 2,
          flashbackTo: '1999',
          orphanOf: 'chapter1'
        },
        {
          date: '2023-01-02',
          id: 'scene2',
          title: 'Scene 2'
        }
      ],
      undated: [],
      pov: [],
      presence: [],
      hasCalendar: false,
      unit: 'words'
    };

    const expected = `Timeline: 2 dated, 0 undated

Chronology (story order):
- 2023-01-01 10:00  scene1: Scene 1 (POV Alice, at Home) [told in chapter 2, after later events; flashback to 1999; no chapter file for chapter1]
- 2023-01-02  scene2: Scene 2

POV balance:
- None

Character presence:
- None\n`;
    assert.equal(formatTimeline(timeline, 2), expected);
  });

  it('formats undated entries', () => {
    const timeline = {
      chronology: [],
      undated: [
        {
          id: 'scene1',
          title: 'Scene 1',
          pov: 'Bob',
          location: 'Office'
        },
        {
          id: 'scene2',
          title: 'Scene 2',
          orphanOf: 'chapter2'
        }
      ],
      pov: [],
      presence: [],
      hasCalendar: false,
      unit: 'words'
    };

    const expected = `Timeline: 0 dated, 2 undated

Chronology (story order):
- None: add date (YYYY-MM-DD) and time to scenes or chapters to order them

Undated (reading order):
- scene1: Scene 1 (POV Bob, at Office)
- scene2: Scene 2 [no chapter file for chapter2]

POV balance:
- None

Character presence:
- None\n`;
    assert.equal(formatTimeline(timeline, 0), expected);
  });

  it('formats POV balance in words', () => {
    const timeline = {
      chronology: [],
      undated: [],
      pov: [
        { pov: 'Alice', chapters: 2, words: 1500 },
        { pov: 'Bob', chapters: 1, words: 500 }
      ],
      presence: [],
      hasCalendar: false,
      unit: 'words'
    };

    const expected = `Timeline: 0 dated, 0 undated

Chronology (story order):
- None: add date (YYYY-MM-DD) and time to scenes or chapters to order them

POV balance:
- Alice: 2 chapters, 1,500 words (75%)
- Bob: 1 chapter, 500 words (25%)

Character presence:
- None\n`;
    assert.equal(formatTimeline(timeline, 3), expected);
  });

  it('formats POV balance in characters', () => {
    const timeline = {
      chronology: [],
      undated: [],
      pov: [
        { pov: 'Alice', chapters: 2, characterCount: 1500 },
        { pov: 'Bob', chapters: 1, characterCount: 500 }
      ],
      presence: [],
      hasCalendar: false,
      unit: 'characters'
    };

    const expected = `Timeline: 0 dated, 0 undated

Chronology (story order):
- None: add date (YYYY-MM-DD) and time to scenes or chapters to order them

POV balance:
- Alice: 2 chapters, 1,500 characters (75%)
- Bob: 1 chapter, 500 characters (25%)

Character presence:
- None\n`;
    assert.equal(formatTimeline(timeline, 3), expected);
  });

  it('formats character presence', () => {
    const timeline = {
      chronology: [],
      undated: [],
      pov: [],
      presence: [
        { id: 'Alice', chapters: 0 },
        { id: 'Bob', chapters: 3, first: 1, last: 3, longestGap: 0, trailing: 0 },
        { id: 'Charlie', chapters: 2, first: 1, last: 4, longestGap: 2, gapAfter: 1, trailing: 1 },
        { id: 'Dave', chapters: 1, first: 2, last: 2, longestGap: 0, died: 2 }
      ],
      hasCalendar: false,
      unit: 'words'
    };

    const expected = `Timeline: 0 dated, 0 undated

Chronology (story order):
- None: add date (YYYY-MM-DD) and time to scenes or chapters to order them

POV balance:
- None

Character presence:
- Alice: not present in any chapter
- Bob: 3 of 5 chapters, chapters 1-3
- Charlie: 2 of 5 chapters, chapters 1-4, longest absence 2 chapters after chapter 1, absent from the last 1 chapter
- Dave: 1 of 5 chapters, chapter 2, died in chapter 2\n`;
    assert.equal(formatTimeline(timeline, 5), expected);
  });
});
