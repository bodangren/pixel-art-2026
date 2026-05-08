# Track: Benchmark Run Re-trigger API

## Problem
The validation-driven rerun pipeline identified 8 of 16 benchmark runs with broken assets (< 1KB). Currently there is no API to programmatically re-trigger generation for failing runs.

## Goal
Add an API endpoint and UI button to re-trigger asset generation for failed benchmark runs, using the same pipeline that produced the original run.

## Acceptance Criteria
- [ ] POST /api/runs/{id}/retrigger endpoint validates run status and enqueues re-generation
- [ ] Re-trigger uses the same model, prompt version, and resolution as the original run
- [ ] New run is linked to the original via parentRunId
- [ ] Dashboard shows re-trigger button for failed runs only
- [ ] Re-trigger history visible on run detail page
- [ ] Tests pass (API + component tests)
- [ ] Build and lint clean
