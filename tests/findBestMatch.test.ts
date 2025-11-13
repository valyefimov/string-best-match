import { describe, expect, it } from "vitest";
import { findBestMatch } from "../src/findBestMatch";

describe("findBestMatch", () => {
  it("finds longest partial match between arrays", () => {
    const source = ["A", "B", "C", "D", "E"];
    const target = ["X", "B", "C", "D", "Y"];

    const result = findBestMatch(source, target);

    expect(result).toEqual({ startIndex: 1, sequenceLength: 3 });
  });

  it("returns zero-length match when no common elements are found", () => {
    const source = ["A", "B"];
    const target = ["C", "D"];

    const result = findBestMatch(source, target);

    expect(result).toEqual({ startIndex: -1, sequenceLength: 0 });
  });

  it("detects full match when arrays are identical", () => {
    const source = ["alpha", "beta"];
    const target = ["alpha", "beta"];

    const result = findBestMatch(source, target);

    expect(result).toEqual({ startIndex: 0, sequenceLength: 2 });
  });

  it("handles edge cases with empty arrays", () => {
    expect(findBestMatch([], [])).toEqual({
      startIndex: -1,
      sequenceLength: 0,
    });
    expect(findBestMatch(["A"], [])).toEqual({
      startIndex: -1,
      sequenceLength: 0,
    });
    expect(findBestMatch([], ["A"])).toEqual({
      startIndex: -1,
      sequenceLength: 0,
    });
  });

  it("finds match in large arrays efficiently", () => {
    // Create large arrays with a common substring in the middle
    const commonSubstring = Array.from(
      { length: 100 },
      (_, index) => `common_${index}`,
    );
    const source = [
      ...Array.from({ length: 5000 }, (_, index) => `source_${index}`),
      ...commonSubstring,
      ...Array.from({ length: 5000 }, (_, index) => `source_end_${index}`),
    ];
    const target = [
      ...Array.from({ length: 3000 }, (_, index) => `target_${index}`),
      ...commonSubstring,
      ...Array.from({ length: 3000 }, (_, index) => `target_end_${index}`),
    ];

    const result = findBestMatch(source, target);

    expect(result).toEqual({ startIndex: 3000, sequenceLength: 100 });
  });

  it("handles arrays with multiple matches of same length", () => {
    const source = ["A", "B", "C", "X", "Y", "Z"];
    const target = ["X", "Y", "Z", "M", "A", "B", "C"];

    const result = findBestMatch(source, target);

    // Should find one of the matches of length 3
    expect(result.sequenceLength).toBe(3);
    expect([0, 4]).toContain(result.startIndex);
  });

  it("finds longest match when there are partial overlaps", () => {
    const source = ["A", "B", "C", "D", "E", "F", "G"];
    const target = ["X", "A", "B", "Y", "C", "D", "E", "F", "Z"];

    const result = findBestMatch(source, target);

    expect(result).toEqual({ startIndex: 4, sequenceLength: 4 });
  });

  it("performs well with very large arrays", () => {
    // Test with 50k elements to verify O((N+M) log min(N,M)) performance
    const largeCommonSubstring = Array.from(
      { length: 500 },
      (_, index) => `token_${index}`,
    );
    const source = [
      ...Array.from({ length: 25000 }, (_, index) => `src_${index}`),
      ...largeCommonSubstring,
      ...Array.from({ length: 24500 }, (_, index) => `src_end_${index}`),
    ];
    const target = [
      ...Array.from({ length: 10000 }, (_, index) => `tgt_${index}`),
      ...largeCommonSubstring,
      ...Array.from({ length: 39500 }, (_, index) => `tgt_end_${index}`),
    ];

    const startTime = performance.now();
    const result = findBestMatch(source, target);
    const endTime = performance.now();

    expect(result).toEqual({ startIndex: 10000, sequenceLength: 500 });
    // Should complete in reasonable time (< 1 second for 100k total elements)
    expect(endTime - startTime).toBeLessThan(1000);
  });
});
