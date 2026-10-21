import { roundedShares } from '../src/plural.js';

describe('roundedShares', () => {
  it('should handle values that sum to 0 or negative', () => {
    expect(roundedShares([0, 0, 0])).toEqual([0, 0, 0]);
    expect(roundedShares([-1, -2, -3])).toEqual([0, 0, 0]);
  });
});
