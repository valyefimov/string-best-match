import { findBestMatch } from '../src/findBestMatch';

// ============================================================================
// Example 1: Basic Usage
// ============================================================================
console.log('=== Example 1: Basic Usage ===\n');

const source1 = ['A', 'B', 'C', 'D', 'E'];
const target1 = ['X', 'B', 'C', 'D', 'Y'];

const result1 = findBestMatch(source1, target1);
console.log('Source:', source1);
console.log('Target:', target1);
console.log('Result:', result1);
console.log('Match:', target1.slice(result1.startIndex, result1.startIndex + result1.sequenceLength));
console.log();

// ============================================================================
// Example 2: Text Token Matching
// ============================================================================
console.log('=== Example 2: Text Token Matching ===\n');

const document = [
  'The', 'quick', 'brown', 'fox', 'jumps', 'over', 'the', 'lazy', 'dog'
];
const userSelection = [
  'Some', 'text', 'before', 'brown', 'fox', 'jumps', 'over', 'and', 'after'
];

const result2 = findBestMatch(document, userSelection);
console.log('Document:', document.join(' '));
console.log('Selection:', userSelection.join(' '));
console.log('Result:', result2);
console.log('Matched text:', userSelection.slice(result2.startIndex, result2.startIndex + result2.sequenceLength).join(' '));
console.log();

// ============================================================================
// Example 3: Code Diff
// ============================================================================
console.log('=== Example 3: Code Diff ===\n');

const originalCode = [
  'function calculateSum(a, b) {',
  '  const result = a + b;',
  '  return result;',
  '}'
];

const modifiedCode = [
  'function calculateSum(a, b, c) {',
  '  const result = a + b;',
  '  return result;',
  '}',
  'export default calculateSum;'
];

const result3 = findBestMatch(originalCode, modifiedCode);
console.log('Original code:', originalCode.length, 'lines');
console.log('Modified code:', modifiedCode.length, 'lines');
console.log('Result:', result3);
console.log('Unchanged lines:', modifiedCode.slice(result3.startIndex, result3.startIndex + result3.sequenceLength));
console.log();

// ============================================================================
// Example 4: DNA Sequence Comparison
// ============================================================================
console.log('=== Example 4: DNA Sequence Comparison ===\n');

const dnaSequence1 = ['A', 'T', 'G', 'C', 'A', 'T', 'G', 'C', 'T', 'A'];
const dnaSequence2 = ['G', 'A', 'T', 'G', 'C', 'A', 'T', 'G', 'C', 'C'];

const result4 = findBestMatch(dnaSequence1, dnaSequence2);
console.log('DNA Sequence 1:', dnaSequence1.join(''));
console.log('DNA Sequence 2:', dnaSequence2.join(''));
console.log('Result:', result4);
console.log('Common subsequence:', dnaSequence2.slice(result4.startIndex, result4.startIndex + result4.sequenceLength).join(''));
console.log();

// ============================================================================
// Example 5: No Match
// ============================================================================
console.log('=== Example 5: No Common Elements ===\n');

const source5 = ['apple', 'banana', 'cherry'];
const target5 = ['dog', 'elephant', 'frog'];

const result5 = findBestMatch(source5, target5);
console.log('Source:', source5);
console.log('Target:', target5);
console.log('Result:', result5);
console.log('(startIndex -1 and sequenceLength 0 indicates no match)\n');

// ============================================================================
// Example 6: Performance Test with Large Arrays
// ============================================================================
console.log('=== Example 6: Performance Test ===\n');

// Generate large arrays with a common substring
const commonSubstring = Array.from({ length: 1000 }, (_, index) => `token_${index}`);

const largeSource = [
  ...Array.from({ length: 10000 }, (_, index) => `source_${index}`),
  ...commonSubstring,
  ...Array.from({ length: 10000 }, (_, index) => `source_end_${index}`)
];

const largeTarget = [
  ...Array.from({ length: 5000 }, (_, index) => `target_${index}`),
  ...commonSubstring,
  ...Array.from({ length: 5000 }, (_, index) => `target_end_${index}`)
];

console.log('Source array length:', largeSource.length);
console.log('Target array length:', largeTarget.length);
console.log('Total elements:', largeSource.length + largeTarget.length);

const startTime = performance.now();
const result6 = findBestMatch(largeSource, largeTarget);
const endTime = performance.now();

console.log('Result:', result6);
console.log('Time taken:', (endTime - startTime).toFixed(2), 'ms');
console.log('Operations per second:', Math.round((largeSource.length + largeTarget.length) / (endTime - startTime) * 1000), 'elements/sec');
console.log();

// ============================================================================
// Example 7: Multiple Matches (Returns First Found)
// ============================================================================
console.log('=== Example 7: Multiple Matches of Same Length ===\n');

const source7 = ['A', 'B', 'C', 'X', 'Y', 'Z'];
const target7 = ['X', 'Y', 'Z', 'M', 'A', 'B', 'C'];

const result7 = findBestMatch(source7, target7);
console.log('Source:', source7);
console.log('Target:', target7);
console.log('Result:', result7);
console.log('Match:', target7.slice(result7.startIndex, result7.startIndex + result7.sequenceLength));
console.log('(Note: Both "XYZ" and "ABC" are length 3, algorithm returns first found)\n');

// ============================================================================
// Example 8: Partial Overlaps
// ============================================================================
console.log('=== Example 8: Finding Longest Among Partial Overlaps ===\n');

const source8 = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
const target8 = ['X', 'A', 'B', 'Y', 'C', 'D', 'E', 'F', 'Z'];

const result8 = findBestMatch(source8, target8);
console.log('Source:', source8);
console.log('Target:', target8);
console.log('Result:', result8);
console.log('Match:', target8.slice(result8.startIndex, result8.startIndex + result8.sequenceLength));
console.log('(Found "CDEF" with length 4, not "AB" with length 2)\n');

// ============================================================================
// Summary
// ============================================================================
console.log('=== Algorithm Summary ===\n');
console.log('Time Complexity: O((N + M) × log(min(N, M)))');
console.log('Space Complexity: O(N + M)');
console.log('\nIdeal for:');
console.log('  ✓ Large text processing (100k+ tokens)');
console.log('  ✓ DNA/RNA sequence alignment');
console.log('  ✓ Code diff algorithms');
console.log('  ✓ Real-time text synchronization');
console.log('  ✓ Plagiarism detection');
console.log('  ✓ Version control systems');
