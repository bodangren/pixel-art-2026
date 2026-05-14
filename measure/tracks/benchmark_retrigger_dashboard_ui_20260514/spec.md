# Spec: Benchmark Run Re-trigger Dashboard UI

## Context
The `rerun_trigger_api_20260509` track defines a backend API for re-triggering failed benchmark runs. This track builds the frontend UI to expose that capability to users.

## Goal
Add a "Re-trigger" action to the benchmark dashboard that allows users to re-run failed or incomplete benchmark runs directly from the UI.

## Acceptance Criteria
- [ ] Re-trigger button appears on run detail pages for failed/incomplete runs
- [ ] Button triggers POST to `/api/runs/{id}/retrigger` with confirmation dialog
- [ ] Re-trigger history (parent/child run linking) is visible on run detail
- [ ] Loading and error states are handled gracefully
- [ ] Component tests cover happy path and error cases
