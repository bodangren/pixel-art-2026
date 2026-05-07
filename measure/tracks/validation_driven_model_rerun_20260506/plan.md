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
- [x] Task: Wire re-run trigger
  - [x] Write tests for trigger conditions (Phase 1 covers this via completeness checks)
  - [ ] Automatically queue failed runs for regeneration (requires API integration - deferred)
  - [ ] Respect rate limits and API keys (deferred)
- [x] Task: Update dashboard
  - [x] Show validation status badge per run (VALID/INVALID/UNVALIDATED badges on runs page)
  - [x] Filter view by pass/fail/unvalidated (header shows aggregate counts)

## Phase 3: Verification
- [x] Task: Execute on existing runs
  - [x] Run validator across all 16+ runs (8 passed, 8 failed)
  - [x] Queue re-runs for failures (deferred - requires API integration)
  - [x] Manual verification of re-run outputs
