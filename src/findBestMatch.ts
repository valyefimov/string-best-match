export interface BestMatchResult {
  /** Starting index of the longest matching sequence within the target array. */
  startIndex: number;
  /** Length of the longest matching sequence. */
  sequenceLength: number;
}

/**
 * Calculates the length of the contiguous matching sequence
 * between `sourceArray` and `targetArray`,
 * starting from the provided indices.
 *
 * @param targetArray - Array to match against.
 * @param sourceArray - Array used as the reference.
 * @param targetStartIndex - Starting index for the target array comparison.
 * @param sourceStartIndex - Starting index for the source array comparison.
 * @returns Number of contiguous matching elements.
 */
const calculateMatchLength = (
  targetArray: string[],
  sourceArray: string[],
  targetStartIndex: number,
  sourceStartIndex: number,
): number => {
  // Initialize match length counter
  let matchLength = 0;

  // Continue matching until either array ends, or elements differ
  while (
    targetStartIndex + matchLength < targetArray.length &&
    sourceStartIndex + matchLength < sourceArray.length &&
    targetArray[targetStartIndex + matchLength] ===
      sourceArray[sourceStartIndex + matchLength]
  ) {
    matchLength++;
  }

  return matchLength;
};

/**
 * Finds the longest contiguous matching sequence shared by
 * the `sourceArray` and the `targetArray`.
 *
 * @param sourceArray - Array of strings used as the reference sequence.
 * @param targetArray - Array of strings evaluated against the reference sequence.
 * @returns Object describing the starting index in the target array
 *          and the length of the longest shared sequence.
 */
export const findBestMatch = (
  sourceArray: string[],
  targetArray: string[],
): BestMatchResult => {
  // Default: no match found
  let bestMatch: BestMatchResult = { startIndex: -1, sequenceLength: 0 };

  // Iterate over all possible target array positions
  for (let targetIndex = 0; targetIndex < targetArray.length; targetIndex++) {
    // Iterate over all possible source array positions
    for (let sourceIndex = 0; sourceIndex < sourceArray.length; sourceIndex++) {
      // Determine how long this sequence matches
      const currentMatchLength = calculateMatchLength(
        targetArray,
        sourceArray,
        targetIndex,
        sourceIndex,
      );

      // Update best match if longer sequence found
      if (currentMatchLength > bestMatch.sequenceLength) {
        bestMatch = {
          startIndex: targetIndex,
          sequenceLength: currentMatchLength,
        };
      }
    }
  }

  return bestMatch;
};

export default findBestMatch;
