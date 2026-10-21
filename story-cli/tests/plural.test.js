import { roundedShares } from '../src/plural.js';

describe('roundedShares', () => {
  it('handles negative total correctly', () => {
    expect(roundedShares([-1, -2, -3])).toEqual([0, 0, 0]);
  });
  it('handles zero total correctly', () => {
    expect(roundedShares([0, 0, 0])).toEqual([0, 0, 0]);
  });
  it('handles three equal shares, distributing remainder to front elements', () => {
    expect(roundedShares([1, 1, 1])).toEqual([34, 33, 33]);
  });
  it('handles exact percentages without remainder correctly', () => {
    expect(roundedShares([50, 50])).toEqual([50, 50]);
  });
  it('handles mixed values effectively', () => {
    expect(roundedShares([1, 2, 3])).toEqual([17, 33, 50]); // 1/6: ~16.6%, 2/6: ~33.3%, 3/6: 50%
  });
  it('handles single value as 100', () => {
    expect(roundedShares([10])).toEqual([100]);
  });
});
