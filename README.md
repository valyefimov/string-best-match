# string-best-match

![npm version](https://img.shields.io/npm/v/string-best-match)
![build status](https://img.shields.io/badge/build-passing-brightgreen)
![test status](https://img.shields.io/badge/tests-passing-brightgreen)

Finds the longest matching substring (or sequence) between two arrays of strings using a fast Rolling Hash (Rabin-Karp) algorithm with binary search. Useful whenever you need to align or highlight shared runs of tokens.

## Installation

```bash
npm install string-best-match
```

## Requirements

- **Node.js**: 14.0.0+ (ES2020 or later)
- **TypeScript**: 4.0+ (if using TypeScript)

This library uses **BigInt** for precise hash calculations, which requires ES2020 or later. BigInt is supported in:
- Node.js 10.4.0+
- Chrome 67+
- Firefox 68+
- Safari 14+
- Edge 79+

## Usage

```ts
import { findBestMatch } from 'string-best-match';

const source = ['A', 'B', 'C', 'D', 'E'];
const target = ['X', 'B', 'C', 'D', 'Y'];

const result = findBestMatch(source, target);
console.log(result); // { startIndex: 1, sequenceLength: 3 }
```

## Use Cases

- Text highlighting (e.g., showing best match between user selection and document text)
- Comparing DNA or code sequences
- Diff visualization or fuzzy search improvements

## API

| Parameter | Type | Description |
| --- | --- | --- |
| `sourceArray` | `string[]` | Array of tokens you want to match against. |
| `targetArray` | `string[]` | Array to scan for the longest contiguous sequence also present in the source. |

| Returns | Type | Description |
| --- | --- | --- |
| `BestMatchResult` | `{ startIndex: number; sequenceLength: number; }` | Start index of the best match inside `targetArray` and the length of that sequence (`-1, 0` when no match is found). |

## Performance

⭐ **Algorithm**: Rolling Hash (Rabin-Karp) + Binary Search

This is the fastest approach for large arrays (100k–1M+ elements).

**Time Complexity**: O((N + M) × log(min(N, M)))
- N = length of source array
- M = length of target array
- Significantly faster than naive O(N × M) for large datasets

**Space Complexity**: O(N + M)
- Uses hash maps to store rolling hashes of substrings

**How it works**:
1. Binary search is used to find the optimal substring length L
2. For each candidate length L, compute rolling hashes of all substrings of length L in both arrays
3. Check if any hashes match between source and target
4. Verify that matches are genuine (not hash collisions)
5. Converge to the longest matching substring

This approach is ideal for:
- Large text processing (100k+ tokens)
- DNA sequence comparison
- Code diff algorithms
- Real-time text analysis

**Performance Example**:

For arrays with 50,000 elements each:
- **Naive O(N × M)**: ~2.5 billion operations
- **Rolling Hash O((N+M) log min(N,M))**: ~1.6 million operations
- **Speed improvement**: ~1,500x faster

Real-world test results (100k total elements):
```
✓ performs well with very large arrays (108ms)
```

## Examples

See the [`examples/usage.ts`](examples/usage.ts) file for comprehensive examples including:

1. Basic usage with simple arrays
2. Text token matching (highlighting user selections)
3. Code diff comparison
4. DNA sequence alignment
5. Handling no matches
6. Performance tests with large arrays (32k elements)
7. Multiple matches of the same length
8. Finding longest among partial overlaps

Run the examples:
```bash
npx tsx examples/usage.ts
```

## Scripts

- `npm run build` — Type-checks and emits ESM output plus type declarations to `dist/`
- `npm run test` — Executes the Vitest suite in `tests/`

## License

MIT © Valentyn
