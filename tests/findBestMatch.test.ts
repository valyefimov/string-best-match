import { describe, expect, it } from 'vitest';
import { findBestMatch } from '../src/findBestMatch';

describe('findBestMatch', () => {
  it('finds longest partial match between arrays', () => {
    const source = ['A', 'B', 'C', 'D', 'E'];
    const target = ['X', 'B', 'C', 'D', 'Y'];

    const result = findBestMatch(source, target);

    expect(result).toEqual({ startIndex: 1, sequenceLength: 3 });
  });

  it('returns zero-length match when no common elements are found', () => {
    const source = ['A', 'B'];
    const target = ['C', 'D'];

    const result = findBestMatch(source, target);

    expect(result).toEqual({ startIndex: -1, sequenceLength: 0 });
  });

  it('detects full match when arrays are identical', () => {
    const source = ['alpha', 'beta'];
    const target = ['alpha', 'beta'];

    const result = findBestMatch(source, target);

    expect(result).toEqual({ startIndex: 0, sequenceLength: 2 });
  });

  it('handles edge cases with empty arrays', () => {
    expect(findBestMatch([], [])).toEqual({ startIndex: -1, sequenceLength: 0 });
    expect(findBestMatch(['A'], [])).toEqual({ startIndex: -1, sequenceLength: 0 });
    expect(findBestMatch([], ['A'])).toEqual({ startIndex: -1, sequenceLength: 0 });
  });
});
