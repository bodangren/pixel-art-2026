# Implementation Plan: Human Review Data Population

## Phase 1: Review API
- [x] Task: Create review submission endpoint
  - [x] Write tests for POST /api/review
  - [x] Validate ReviewData schema (score, rubric, notes)
  - [x] Persist to {runId}/review.json
- [x] Task: Create review retrieval endpoint
  - [x] Write tests for GET /api/review/{runId}
  - [x] Return 404 if no review exists
  - [x] Include computed aggregate score

## Phase 2: Backfill Reviews
- [x] Task: Audit existing runs
  - [x] Script to list all runs without review.json
  - [x] Generate review template for each missing run
- [x] Task: Populate minimum viable reviews
  - [x] Manually review or auto-flag each run
  - [x] Ensure at least 1 review per model on leaderboard

## Phase 3: UI Integration
- [x] Task: Wire review form to API
  - [x] Write tests for review form submission
  - [x] Pre-fill rubric criteria from task definition
  - [x] Show review status in run detail page
