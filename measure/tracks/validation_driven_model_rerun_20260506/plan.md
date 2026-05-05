# Implementation Plan: Validation-Driven Model Re-run

## Phase 1: Validation Script
- [ ] Task: Build run validator
  - [ ] Write tests for validation rules
  - [ ] Check PNG file sizes (reject < 1KB)
  - [ ] Verify expected asset count matches manifest
  - [ ] Check JSON metadata validity
- [ ] Task: Generate validation report
  - [ ] Write tests for report format
  - [ ] Per-run pass/fail with reason
  - [ ] Aggregate summary by model

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
