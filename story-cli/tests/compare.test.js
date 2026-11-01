import { describe, it } from 'node:test';
import { strict as assert } from 'node:assert';
import { proseParagraphs } from '../src/compare.js';

describe('proseParagraphs', () => {
  it('splits prose into paragraphs', () => {
    const text = 'Paragraph one.\n\nParagraph two.';
    assert.deepStrictEqual(proseParagraphs(text), ['Paragraph one.', 'Paragraph two.']);
  });

  it('removes scene break lines', () => {
    const text = 'Paragraph one.\n\n---\n\nParagraph two.';
    assert.deepStrictEqual(proseParagraphs(text), ['Paragraph one.', 'Paragraph two.']);
  });

  it('removes fenced code', () => {
    const text = 'Paragraph one.\n\n```js\nconst x = 1;\n```\n\nParagraph two.';
    assert.deepStrictEqual(proseParagraphs(text), ['Paragraph one.', 'Paragraph two.']);
  });

  it('normalizes spaces and trims paragraphs', () => {
    const text = '  Paragraph   one.  \n\n  Paragraph\n  two.  ';
    assert.deepStrictEqual(proseParagraphs(text), ['Paragraph one.', 'Paragraph two.']);
  });

  it('ignores empty paragraphs', () => {
    const text = 'Paragraph one.\n\n\n\nParagraph two.';
    assert.deepStrictEqual(proseParagraphs(text), ['Paragraph one.', 'Paragraph two.']);
  });

  it('handles scene break lines without blank lines around them', () => {
    const text = 'Paragraph one.\n---\nParagraph two.';
    assert.deepStrictEqual(proseParagraphs(text), ['Paragraph one.', 'Paragraph two.']);
  });
});
