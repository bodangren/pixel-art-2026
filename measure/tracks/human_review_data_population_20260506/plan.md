# Implementation Plan: Human Review Data Population

## Phase 1: Review API
- [ ] Task: Create review submission endpoint
  - [ ] Write tests for POST /api/review
  - [ ] Validate ReviewData schema (score, rubric, notes)
  - [ ] Persist to {runId}/review.json
- [ ] Task: Create review retrieval endpoint
  - [ ] Write tests for GET /api/review/{runId}
  - [ ] Return 404 if no review exists
  - [ ] Include computed aggregate score

## Phase 2: Backfill Reviews
- [ ] Task: Audit existing runs
  - [ ] Script to list all runs without review.json
  - [ ] Generate review template for each missing run
- [ ] Task: Populate minimum viable reviews
  - [ ] Manually review or auto-flag each run
  - [ ] Ensure at least 1 review per model on leaderboard

## Phase 3: UI Integration
- [ ] Task: Wire review form to API
  - [ ] Write tests for review form submission
  - [ ] Pre-fill rubric criteria from task definition
  - [ ] Show review status in run detail page
