# Implementation Plan: Asset Pack Distribution

## Phase 1: ZIP Generation
- [ ] Task: Build ZIP generation endpoint
  - [ ] Write tests for ZIP contents
  - [ ] Collect all validated PNGs from run directory
  - [ ] Generate README.md with model name, date, rubric scores
  - [ ] Use streaming ZIP to handle large runs

## Phase 2: Download UI
- [ ] Task: Add download button to run detail
  - [ ] Write tests for download button rendering
  - [ ] Show asset count and total size
  - [ ] Disable button if no validated assets

## Phase 3: Polish
- [ ] Task: Add credits and license files
  - [ ] Include MODEL_CARD info if available
  - [ ] Add CC-BY or equivalent license note
- [ ] Task: Manual verification
  - [ ] Download ZIP, verify contents
  - [ ] Check README accuracy
