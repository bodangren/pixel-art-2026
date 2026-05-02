# Plan: Batch Export and Reporting

## Phase 1: Export Utilities [ ]

- [ ] Write test: `toCsv` converts array of objects to CSV string with headers
- [ ] Write test: `toCsv` handles special characters (commas, quotes, newlines)
- [ ] Write test: `toJsonExport` produces valid JSON with metadata timestamp
- [ ] Create `lib/export.ts` with `toCsv` and `toJsonExport` utilities
- [ ] Write test: `downloadFile` triggers browser download with correct MIME type
- [ ] Create `lib/download.ts` with `downloadFile` helper (Blob + URL.createObjectURL)

## Phase 2: Leaderboard Export [ ]

- [ ] Write test: leaderboard export button renders on leaderboard page
- [ ] Write test: CSV export includes all visible columns (model, rank, score, subscores)
- [ ] Add export dropdown to leaderboard page with CSV and JSON options
- [ ] Wire export to leaderboard data source (current filtered/sorted view)
- [ ] Add accessible button labels and keyboard support

## Phase 3: Quality Dashboard Export [ ]

- [ ] Write test: quality dashboard export includes score distributions
- [ ] Write test: JSON export includes trend data with date keys
- [ ] Add export button to quality metrics dashboard
- [ ] Export score distributions as JSON (model → score → count)
- [ ] Export trend data as JSON (date → model → average score)

## Phase 4: Comparison View Export [ ]

- [ ] Write test: comparison export includes both models' subscores
- [ ] Write test: CSV has columns for model-a, model-b, and delta
- [ ] Add export button to comparison view
- [ ] Export side-by-side comparison as CSV with delta column

## Phase 5: Verification and Handoff [ ]

- [ ] Verify CSV opens in Excel and Google Sheets without encoding issues
- [ ] Verify JSON is valid and parseable
- [ ] Run full test suite — all 340+ tests pass
- [ ] Run `next lint` — no errors
- [ ] Verify export buttons are keyboard accessible
- [ ] Handoff
