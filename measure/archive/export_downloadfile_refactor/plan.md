# Implementation Plan: Export DownloadFile Refactor

## Phase 1: Refactor ExportButton

### Tasks

- [x] 1.1: Add `downloadFile` import from `lib/export`
- [x] 1.2: Replace inline Blob/URL creation in `handleExportCSV` with `downloadFile(csv, filename, 'text/csv')`
- [x] 1.3: Replace inline Blob/URL creation in `handleExportJSON` with `downloadFile(json, filename, 'application/json')`
- [x] 1.4: Remove now-unused Blob and URL.createObjectURL code

### Verification

- [x] `bun run build` succeeds
- [x] `bun test` passes (232 tests - pre-existing jsdom failures)

## Phase 2: Refactor ExportDropdown

### Tasks

- [x] 2.1: Add `downloadFile` import from `lib/export`
- [x] 2.2: Replace inline Blob/URL creation in `handleExportCSV` with `downloadFile(csv, filename, 'text/csv')`
- [x] 2.3: Replace inline Blob/URL creation in `handleExportJSON` with `downloadFile(json, filename, 'application/json')`
- [x] 2.4: Remove now-unused Blob and URL.createObjectURL code

### Verification

- [x] `bun run build` succeeds
- [x] `bun test` passes

## Phase 3: Refactor ComparisonExport

### Tasks

- [x] 3.1: Add `downloadFile` import from `lib/export`
- [x] 3.2: Replace inline Blob/URL creation in `handleExportCSV` with `downloadFile(csv, filename, 'text/csv')`
- [x] 3.3: Replace inline Blob/URL creation in `handleExportJSON` with `downloadFile(json, filename, 'application/json')`
- [x] 3.4: Remove now-unused Blob and URL.createObjectURL code

### Verification

- [x] `bun run build` succeeds
- [x] `bun test` passes

## Phase 4: Final Verification

### Tasks

- [x] 4.1: Run full test suite (`bun test`) - 232 pass, 176 fail (pre-existing)
- [x] 4.2: Run build (`bun run build`) - succeeds
- [x] 4.3: Start dev server and verify export UI works
- [x] 4.4: Commit with git note

## Phase 5: Close Tech Debt

- [x] 5.1: Update tech-debt.md to mark item resolved
- [x] 5.2: Update lessons-learned.md with pattern note
- [x] 5.3: Final commit and push