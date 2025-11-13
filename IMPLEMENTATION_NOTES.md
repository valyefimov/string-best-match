# Implementation Notes: Rolling Hash Algorithm

## Overview

This library uses a **Rolling Hash (Rabin-Karp) algorithm with Binary Search** to find the longest common substring between two arrays of strings.

## Algorithm Complexity

- **Time Complexity**: O((N + M) × log(min(N, M)))
  - N = length of source array
  - M = length of target array
- **Space Complexity**: O(N + M)
  - Hash maps store rolling hashes for all substrings

## Why Rolling Hash?

Compared to the naive O(N × M) approach, the Rolling Hash algorithm is significantly faster for large arrays:

- **Naive approach**: O(N × M) - compares every position in both arrays
- **Rolling Hash**: O((N + M) × log(min(N, M))) - uses binary search to quickly find the optimal length

For arrays with 50,000 elements each, this is the difference between:
- Naive: ~2.5 billion operations
- Rolling Hash: ~1.6 million operations

## How It Works

### 1. Binary Search on Length

The algorithm uses binary search to find the longest matching substring length:

```
leftBound = 1
rightBound = min(sourceArray.length, targetArray.length)

while leftBound <= rightBound:
  middleLength = (leftBound + rightBound) / 2
  if hasCommonSubstringOfLength(middleLength):
    bestMatch = found match
    leftBound = middleLength + 1  // try to find longer
  else:
    rightBound = middleLength - 1  // try shorter
```

### 2. Rolling Hash Computation

For each candidate length L, the algorithm computes rolling hashes of all substrings of length L in both arrays.

A **rolling hash** is a hash function that can be efficiently updated when sliding a window through the array:

```
Initial hash for [A, B, C]:
  hash = (A × BASE² + B × BASE¹ + C × BASE⁰) mod MODULUS

Rolling from [A, B, C] to [B, C, D]:
  1. Remove A from the left: hash = hash - A × BASE²
  2. Shift left by multiplying by BASE: hash = hash × BASE
  3. Add D to the right: hash = hash + D
  4. Take modulo: hash = hash mod MODULUS
```

This allows computing all hashes in O(N) time instead of O(N × L).

### 3. Hash Matching

Once all hashes are computed for both arrays:
1. For each hash in the target array, check if it exists in the source array
2. If a hash match is found, verify it's not a collision by comparing the actual substrings
3. Return the first valid match found

### 4. BigInt for Precision

JavaScript's standard `number` type uses 64-bit floating point, which loses precision for integers larger than 2^53 - 1 (≈ 9 × 10^15).

Since our hash calculations involve:
- BASE = 1,000,000,007
- BASE² ≈ 10^18 (larger than 2^53)

We use **BigInt** to maintain precision during modular arithmetic operations.

## Hash Constants

```javascript
HASH_BASE = 1_000_000_007n      // Large prime for good distribution
HASH_MODULUS = 2_147_483_647n   // 2^31 - 1 (Mersenne prime)
```

These constants are chosen to:
- Minimize hash collisions through prime number properties
- Fit within standard integer ranges after modulo operations
- Provide good distribution across different input patterns

## Performance Characteristics

### Best Case
- Arrays with a long common substring at the beginning
- O((N + M) × log(1)) ≈ O(N + M)

### Average Case
- O((N + M) × log(min(N, M)))

### Worst Case
- No common substring or very short common substring
- Still O((N + M) × log(min(N, M)))

## Trade-offs

### Advantages
- Extremely fast for large arrays (100k+ elements)
- Predictable performance regardless of input patterns
- Memory usage scales linearly with input size

### Disadvantages
- More complex implementation than naive approach
- Slight overhead for very small arrays (< 100 elements)
- Requires BigInt support (ES2020+)

## Use Cases

This algorithm excels in scenarios involving:
- Large text document comparison (10k+ tokens)
- DNA/RNA sequence alignment
- Code diff algorithms
- Real-time text synchronization
- Plagiarism detection
- Version control systems

## References

- Rabin, M.O.; Karp, R.M. (1987). "Efficient randomized pattern-matching algorithms"
- Rolling hash technique for substring search
- Binary search optimization for longest common substring problem