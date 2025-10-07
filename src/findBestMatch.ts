export interface BestMatchResult {
  /** Starting index of the longest matching sequence within the target array. */
  startIndex: number;
  /** Length of the longest matching sequence. */
  sequenceLength: number;
}

/**
 * Finds the longest contiguous matching sequence shared by the `sourceArray` and `targetArray`.
 *
 * @param sourceArray - Array of strings used as the reference sequence.
 * @param targetArray - Array of strings evaluated against the reference sequence.
 * @returns An object describing the starting index in the target array and the length of the longest shared sequence. Returns `{ startIndex: -1, sequenceLength: 0 }` when no common sequence exists.
 */
export const findBestMatch = (
  sourceArray: string[],
  targetArray: string[],
): BestMatchResult => {
  let bestMatch: BestMatchResult = { startIndex: -1, sequenceLength: 0 };

  for (let targetStartIndex = 0; targetStartIndex < targetArray.length; targetStartIndex++) {
    for (let sourceStartIndex = 0; sourceStartIndex < sourceArray.length; sourceStartIndex++) {
      let matchLength = 0;

      while (
        targetStartIndex + matchLength < targetArray.length &&
        sourceStartIndex + matchLength < sourceArray.length &&
        targetArray[targetStartIndex + matchLength] === sourceArray[sourceStartIndex + matchLength]
      ) {
        matchLength++;
      }

      if (matchLength > bestMatch.sequenceLength) {
        bestMatch = { startIndex: targetStartIndex, sequenceLength: matchLength };
      }
    }
  }

  return bestMatch;
};

export default findBestMatch;
