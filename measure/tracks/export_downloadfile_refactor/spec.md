# Specification: Export DownloadFile Refactor

## Problem

`ExportButton`, `ExportDropdown`, and `ComparisonExport` components all inline their own Blob/URL.createObjectURL download logic instead of using the existing `lib/export.ts:downloadFile()` function. This creates:
1. Code duplication (~40 lines duplicated across 3 components)
2. Inconsistent filename generation
3. Potential for subtle bugs in one copy but not others

## Solution

Refactor all three components to import and use `downloadFile()` from `lib/export.ts`.

## Changes Required

1. **`src/components/ExportButton.tsx`**:
   - Import `downloadFile` from `lib/export`
   - Replace inline Blob/URL creation with `downloadFile(csv, filename, 'text/csv')`
   - Replace inline JSON Blob/URL creation with `downloadFile(json, filename, 'application/json')`

2. **`src/components/ExportDropdown.tsx`**:
   - Import `downloadFile` from `lib/export`
   - Replace inline Blob/URL creation with `downloadFile(csv, filename, 'text/csv')` and `downloadFile(json, filename, 'application/json')`
   - Already imports `toCsv` and `toJsonExport` - just add `downloadFile`

3. **`src/components/ComparisonExport.tsx`**:
   - Import `downloadFile` from `lib/export`
   - Replace inline Blob/URL creation with `downloadFile()`

## Acceptance Criteria

- [ ] ExportButton uses downloadFile() from lib/export.ts
- [ ] ExportDropdown uses downloadFile() from lib/export.ts
- [ ] ComparisonExport uses downloadFile() from lib/export.ts
- [ ] All existing export functionality works identically
- [ ] All tests pass (especially export-related tests)
- [ ] Build succeeds with no errors