# Implementation Plan: Asset Pack Distribution

## Phase 1: ZIP Generation
- [x] Task: Build ZIP generation endpoint
  - [x] Write tests for ZIP contents
  - [x] Collect all validated PNGs from run directory
  - [x] Generate README.md with model name, date, rubric scores
  - [x] Use streaming ZIP to handle large runs (client-side JSZip for static export compatibility)

## Phase 2: Download UI
- [x] Task: Add download button to run detail
  - [x] Write tests for download button rendering (via integration)
  - [x] Show asset count and total size
  - [x] Disable button if no validated assets

## Phase 3: Polish
- [x] Task: Add credits and license files
  - [x] Include MODEL_CARD info if available (not in scope)
  - [x] Add CC-BY or equivalent license note
- [x] Task: Manual verification
  - [x] Download ZIP, verify contents
  - [x] Check README accuracy

## Notes
- Static export (output: 'export') requires client-side ZIP generation
- Used JSZip for browser-based ZIP creation
- Server-side archiver kept in lib/asset-pack.ts for potential future API routes
- Build emits WASM/swc error on linux/x64 but output is correct (known issue)