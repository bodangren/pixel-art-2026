# Implementation Plan: Validation-Driven Model Re-run

## Phase 1: Validation Script
- [x] Task: Build run validator
  - [x] Write tests for validation rules (15 tests pass)
  - [x] Check PNG file sizes (reject < 1KB)
  - [x] Verify expected asset count matches manifest
  - [x] Check JSON metadata validity
- [x] Task: Generate validation report
  - [x] Write tests for report format (tests pass)
  - [x] Per-run pass/fail with reason
  - [x] Aggregate summary by model

## Phase 2: Re-run Pipeline
- [ ] Task: Wire re-run trigger
  - [ ] Write tests for trigger conditions
  - [ ] Automatically queue failed runs for regeneration
  - [ ] Respect rate limits and API keys
- [ ] Task: Update dashboard
  - [ ] Show validation status badge per run
  - [ ] Filter view by pass/fail/unvalidated

## Phase 3: Verification
- [ ] Task: Execute on existing runs
  - [ ] Run validator across all 16+ runs
  - [ ] Queue re-runs for failures
  - [ ] Manual verification of re-run outputs
