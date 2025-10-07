# string-best-match

![npm version](https://img.shields.io/npm/v/string-best-match)
![build status](https://img.shields.io/badge/build-passing-brightgreen)
![test status](https://img.shields.io/badge/tests-passing-brightgreen)

Finds the longest matching substring (or sequence) between two arrays of strings. Useful whenever you need to align or highlight shared runs of tokens.

## Installation

```bash
npm install string-best-match
```

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

The algorithm runs in \(O(n^2)\) time and \(O(1)\) extra space, which is typically sufficient for small to medium-sized arrays.

## Scripts

- `npm run build` — Type-checks and emits ESM output plus type declarations to `dist/`
- `npm run test` — Executes the Vitest suite in `tests/`

## License

MIT © Valentyn
