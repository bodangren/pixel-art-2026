# Plan: Batch Export and Reporting

## Phase 1: Export Utilities [x]

- [x] Write test: `toCsv` converts array of objects to CSV string with headers
- [x] Write test: `toCsv` handles special characters (commas, quotes, newlines)
- [x] Write test: `toJsonExport` produces valid JSON with metadata timestamp
- [x] Create `lib/export.ts` with `toCsv` and `toJsonExport` utilities
- [x] Write test: `downloadFile` triggers browser download with correct MIME type
- [x] Create `lib/download.ts` with `downloadFile` helper (Blob + URL.createObjectURL)

## Phase 2: Leaderboard Export [x]

- [x] Write test: leaderboard export button renders on leaderboard page
- [x] Write test: CSV export includes all visible columns (model, rank, score, subscores)
- [x] Add export dropdown to leaderboard page with CSV and JSON options
- [x] Wire export to leaderboard data source (current filtered/sorted view)
- [x] Add accessible button labels and keyboard support

## Phase 3: Quality Dashboard Export [x]

- [x] Write test: quality dashboard export includes score distributions
- [x] Write test: JSON export includes trend data with date keys
- [x] Add export button to quality metrics dashboard
- [x] Export score distributions as JSON (model → score → count)
- [x] Export trend data as JSON (date → model → average score)

## Phase 4: Comparison View Export [x]

- [x] Write test: comparison export includes both models' subscores
- [x] Write test: CSV has columns for model-a, model-b, and delta
- [x] Add export button to comparison view
- [x] Export side-by-side comparison as CSV with delta column

## Phase 5: Verification and Handoff [ ]

- [ ] Verify CSV opens in Excel and Google Sheets without encoding issues
- [ ] Verify JSON is valid and parseable
- [ ] Run full test suite — all 340+ tests pass
- [ ] Run `next lint` — no errors
- [ ] Verify export buttons are keyboard accessible
- [ ] Handoff
