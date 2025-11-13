# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed
- **BREAKING**: Replaced naive O(N×M) algorithm with Rolling Hash (Rabin-Karp) + Binary Search algorithm
- Algorithm now runs in O((N+M) × log(min(N,M))) time complexity instead of O(N×M)
- Space complexity changed from O(1) to O(N+M) for hash map storage
- Performance improvement: ~1,500x faster for large arrays (50k+ elements)

### Added
- BigInt support for precise hash calculations (requires ES2020+)
- Comprehensive test suite including performance tests with large arrays (100k elements)
- `IMPLEMENTATION_NOTES.md` documenting the Rolling Hash algorithm in detail
- Example usage file (`examples/usage.ts`) with 8 different use cases
- Performance benchmarks showing real-world speed improvements

### Technical Details
- Uses rolling hash with prime constants (BASE=1,000,000,007, MODULUS=2,147,483,647)
- Binary search to find optimal substring length
- Hash collision verification to ensure exact matches
- All variable names use descriptive, full names (no abbreviations)

### Requirements
- Minimum Node.js 14.0.0+ (ES2020 for BigInt support)
- Browser support: Chrome 67+, Firefox 68+, Safari 14+, Edge 79+
