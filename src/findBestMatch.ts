export interface BestMatchResult {
  /** Starting index of the longest matching sequence within the target array. */
  startIndex: number;
  /** Length of the longest matching sequence. */
  sequenceLength: number;
}

/**
 * Constants for the rolling hash algorithm.
 * The modulus is kept below 2^26 so that every intermediate product stays
 * under 2^52 and plain numbers can be used instead of BigInt.
 * Collisions are harmless because candidates are verified exactly.
 */
const HASH_BASE = 1_000_003;
const HASH_MODULUS = 67_108_859;

/**
 * Maps every distinct token to a small integer id so that whole tokens
 * (not only their first character) participate in hashing and comparison.
 * Ids start at 1 and the same token always gets the same id across arrays.
 */
const toTokenIds = (array: string[], ids: Map<string, number>): number[] =>
  array.map((token) => {
    let id = ids.get(token);
    if (id === undefined) {
      id = ids.size + 1;
      ids.set(token, id);
    }
    return id;
  });

/**
 * Computes a rolling hash for all substrings of a given length in an array.
 *
 * @param array - The array of token ids to hash.
 * @param substringLength - The length of substrings to hash.
 * @returns A map from hash values to arrays of starting indices where that hash occurs.
 */
const computeRollingHashes = (
  array: number[],
  substringLength: number,
): Map<number, number[]> => {
  const hashToIndices = new Map<number, number[]>();

  if (substringLength === 0 || substringLength > array.length) {
    return hashToIndices;
  }

  // Precompute the base raised to the power of (substringLength - 1)
  let basePower = 1;
  for (let index = 0; index < substringLength - 1; index++) {
    basePower = (basePower * HASH_BASE) % HASH_MODULUS;
  }

  // Compute the hash of the first substring
  let currentHash = 0;
  for (let index = 0; index < substringLength; index++) {
    currentHash = (currentHash * HASH_BASE + array[index]) % HASH_MODULUS;
  }

  // Store the first hash
  hashToIndices.set(currentHash, [0]);

  // Roll the hash through the rest of the array
  for (
    let startIndex = 1;
    startIndex <= array.length - substringLength;
    startIndex++
  ) {
    const outgoing = array[startIndex - 1];
    const incoming = array[startIndex + substringLength - 1];

    // Remove the leftmost token and add the new rightmost token
    // Add HASH_MODULUS before the final modulo to keep the result non-negative
    currentHash =
      (currentHash - ((outgoing * basePower) % HASH_MODULUS) + HASH_MODULUS) %
      HASH_MODULUS;
    currentHash = (currentHash * HASH_BASE + incoming) % HASH_MODULUS;

    const indices = hashToIndices.get(currentHash);
    if (indices) {
      indices.push(startIndex);
    } else {
      hashToIndices.set(currentHash, [startIndex]);
    }
  }

  return hashToIndices;
};

/**
 * Verifies that two substrings actually match (not just a hash collision).
 *
 * @param sourceIds - The source token ids.
 * @param targetIds - The target token ids.
 * @param sourceStartIndex - Starting index in the source array.
 * @param targetStartIndex - Starting index in the target array.
 * @param substringLength - Length of the substring to verify.
 * @returns True if the substrings match exactly, false otherwise.
 */
const verifyExactMatch = (
  sourceIds: number[],
  targetIds: number[],
  sourceStartIndex: number,
  targetStartIndex: number,
  substringLength: number,
): boolean => {
  for (let offset = 0; offset < substringLength; offset++) {
    if (
      sourceIds[sourceStartIndex + offset] !==
      targetIds[targetStartIndex + offset]
    ) {
      return false;
    }
  }
  return true;
};

/**
 * Checks if there exists a common substring of the given length between source and target.
 *
 * @param sourceArray - The source token ids.
 * @param targetArray - The target token ids.
 * @param substringLength - The length to check for.
 * @returns An object with the target start index and length if found, null otherwise.
 */
const hasCommonSubstringOfLength = (
  sourceArray: number[],
  targetArray: number[],
  substringLength: number,
): BestMatchResult | null => {
  if (substringLength === 0) {
    return null;
  }

  // Compute rolling hashes for all substrings of the given length in the source array
  const sourceHashes = computeRollingHashes(sourceArray, substringLength);

  // Compute rolling hashes for all substrings of the given length in the target array
  const targetHashes = computeRollingHashes(targetArray, substringLength);

  // Look for matching hashes
  for (const [hash, targetIndices] of targetHashes.entries()) {
    const sourceIndices = sourceHashes.get(hash);

    if (sourceIndices) {
      // We have a hash collision candidate; verify it's a real match
      for (const targetIndex of targetIndices) {
        for (const sourceIndex of sourceIndices) {
          if (
            verifyExactMatch(
              sourceArray,
              targetArray,
              sourceIndex,
              targetIndex,
              substringLength,
            )
          ) {
            return {
              startIndex: targetIndex,
              sequenceLength: substringLength,
            };
          }
        }
      }
    }
  }

  return null;
};

/**
 * Finds the longest contiguous matching sequence shared by
 * the `sourceArray` and the `targetArray` using Rolling Hash with Binary Search.
 *
 * Time Complexity: O((N + M) * log(min(N, M)))
 * Space Complexity: O(N + M)
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
  // Handle edge cases
  if (sourceArray.length === 0 || targetArray.length === 0) {
    return { startIndex: -1, sequenceLength: 0 };
  }

  // Binary search on the length of the common substring
  let leftBound = 1;
  let rightBound = Math.min(sourceArray.length, targetArray.length);
  let bestMatch: BestMatchResult = { startIndex: -1, sequenceLength: 0 };

  // Convert tokens to integer ids once; both arrays share one id space
  const tokenIds = new Map<string, number>();
  const sourceIds = toTokenIds(sourceArray, tokenIds);
  const targetIds = toTokenIds(targetArray, tokenIds);

  while (leftBound <= rightBound) {
    const middleLength = Math.floor((leftBound + rightBound) / 2);
    const matchResult = hasCommonSubstringOfLength(
      sourceIds,
      targetIds,
      middleLength,
    );

    if (matchResult !== null) {
      // Found a match of this length, try to find a longer one
      bestMatch = matchResult;
      leftBound = middleLength + 1;
    } else {
      // No match of this length, try shorter
      rightBound = middleLength - 1;
    }
  }

  return bestMatch;
};

export default findBestMatch;
