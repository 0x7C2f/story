import { describe, it } from 'node:test';
import { strict as assert } from 'node:assert';
import { plural, roundedShares } from '../src/plural.js';

describe('plural', () => {
  it('returns singular form when count is 1', () => {
    assert.equal(plural(1, 'chapter'), '1 chapter');
  });

  it('returns default plural form (singular + "s") when count is not 1', () => {
    assert.equal(plural(0, 'chapter'), '0 chapters');
    assert.equal(plural(2, 'chapter'), '2 chapters');
    assert.equal(plural(10, 'chapter'), '10 chapters');
    assert.equal(plural(-1, 'chapter'), '-1 chapters');
  });

  it('returns custom plural form when provided', () => {
    assert.equal(plural(1, 'goose', 'geese'), '1 goose');
    assert.equal(plural(2, 'goose', 'geese'), '2 geese');
    assert.equal(plural(0, 'goose', 'geese'), '0 geese');
  });
});

describe('roundedShares', () => {
  it('handles negative total correctly', () => {
    assert.deepStrictEqual(roundedShares([-1, -2, -3]), [0, 0, 0]);
  });
  it('handles zero total correctly', () => {
    assert.deepStrictEqual(roundedShares([0, 0, 0]), [0, 0, 0]);
  });
  it('handles three equal shares, distributing remainder to front elements', () => {
    assert.deepStrictEqual(roundedShares([1, 1, 1]), [34, 33, 33]);
  });
  it('handles exact percentages without remainder correctly', () => {
    assert.deepStrictEqual(roundedShares([50, 50]), [50, 50]);
  });
  it('handles mixed values effectively', () => {
    assert.deepStrictEqual(roundedShares([1, 2, 3]), [17, 33, 50]);
  });
  it('handles single value as 100', () => {
    assert.deepStrictEqual(roundedShares([10]), [100]);
  });
});
