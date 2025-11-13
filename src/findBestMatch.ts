export interface BestMatchResult {
  /** Starting index of the longest matching sequence within the target array. */
  startIndex: number;
  /** Length of the longest matching sequence. */
  sequenceLength: number;
}

/**
 * Constants for the rolling hash algorithm.
 * Using a large prime base and modulus to minimize hash collisions.
 * Using BigInt to avoid precision loss with large number multiplication.
 */
const HASH_BASE = 1_000_000_007n;
const HASH_MODULUS = 2_147_483_647n;

/**
 * Computes a rolling hash for all substrings of a given length in an array.
 *
 * @param array - The array of strings to hash.
 * @param substringLength - The length of substrings to hash.
 * @returns A map from hash values to arrays of starting indices where that hash occurs.
 */
const computeRollingHashes = (
  array: string[],
  substringLength: number,
): Map<bigint, number[]> => {
  const hashToIndices = new Map<bigint, number[]>();

  if (substringLength === 0 || substringLength > array.length) {
    return hashToIndices;
  }

  // Precompute the base raised to the power of (substringLength - 1)
  let basePower = 1n;
  for (let index = 0; index < substringLength - 1; index++) {
    basePower = (basePower * HASH_BASE) % HASH_MODULUS;
  }

  // Compute the hash of the first substring
  let currentHash = 0n;
  for (let index = 0; index < substringLength; index++) {
    const charCode = BigInt(array[index].charCodeAt(0));
    currentHash = (currentHash * HASH_BASE + charCode) % HASH_MODULUS;
  }

  // Store the first hash
  if (!hashToIndices.has(currentHash)) {
    hashToIndices.set(currentHash, []);
  }
  hashToIndices.get(currentHash)!.push(0);

  // Roll the hash through the rest of the array
  for (
    let startIndex = 1;
    startIndex <= array.length - substringLength;
    startIndex++
  ) {
    const outgoingCharCode = BigInt(array[startIndex - 1].charCodeAt(0));
    const incomingCharCode = BigInt(
      array[startIndex + substringLength - 1].charCodeAt(0),
    );

    // Remove the leftmost character and add the new rightmost character
    // Ensure positive result after subtraction by adding HASH_MODULUS before modulo
    currentHash =
      (((currentHash - ((outgoingCharCode * basePower) % HASH_MODULUS)) %
        HASH_MODULUS) +
        HASH_MODULUS) %
      HASH_MODULUS;
    currentHash = (currentHash * HASH_BASE + incomingCharCode) % HASH_MODULUS;

    // Store this hash
    if (!hashToIndices.has(currentHash)) {
      hashToIndices.set(currentHash, []);
    }
    hashToIndices.get(currentHash)!.push(startIndex);
  }

  return hashToIndices;
};

/**
 * Verifies that two substrings actually match (not just a hash collision).
 *
 * @param sourceArray - The source array.
 * @param targetArray - The target array.
 * @param sourceStartIndex - Starting index in the source array.
 * @param targetStartIndex - Starting index in the target array.
 * @param substringLength - Length of the substring to verify.
 * @returns True if the substrings match exactly, false otherwise.
 */
const verifyExactMatch = (
  sourceArray: string[],
  targetArray: string[],
  sourceStartIndex: number,
  targetStartIndex: number,
  substringLength: number,
): boolean => {
  for (let offset = 0; offset < substringLength; offset++) {
    if (
      sourceArray[sourceStartIndex + offset] !==
      targetArray[targetStartIndex + offset]
    ) {
      return false;
    }
  }
  return true;
};

/**
 * Checks if there exists a common substring of the given length between source and target.
 *
 * @param sourceArray - The source array of strings.
 * @param targetArray - The target array of strings.
 * @param substringLength - The length to check for.
 * @returns An object with the target start index and length if found, null otherwise.
 */
const hasCommonSubstringOfLength = (
  sourceArray: string[],
  targetArray: string[],
  substringLength: number,
): BestMatchResult | null => {
  if (substringLength === 0) {
    return null;
  }

  // Compute rolling hashes for all substrings of the given length in the source array
  const sourceHashes = computeRollingHashes(sourceArray, substringLength);

  // Compute rolling hashes for all substrings of the given length in the target array
  const targetHashes = computeRollingHashes(targetArray, substringLength);

  // Look for matching hashes (convert BigInt to Number for Map key comparison)
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

  while (leftBound <= rightBound) {
    const middleLength = Math.floor((leftBound + rightBound) / 2);
    const matchResult = hasCommonSubstringOfLength(
      sourceArray,
      targetArray,
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
