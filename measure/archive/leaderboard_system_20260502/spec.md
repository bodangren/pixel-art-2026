# Spec: Public Leaderboard System

## Problem
The product vision calls for "a global leaderboard across all models and runs" but currently scores are only viewable per-run in the review interface. There is no ranked, sortable view that lets users compare model performance at a glance.

## Goal
Build a leaderboard page that aggregates review scores across all runs, ranks models, and provides filtering/sorting to identify top performers.

## Requirements
1. **Aggregation:** Compute average total scores per model from `review.json` subscores.
2. **Ranking Table:** Display models ranked by average score with columns for model name, run count, avg score, best score, and last run date.
3. **Filtering:** Filter by genre/style, date range, and minimum run count.
4. **Sorting:** Sort by any column (avg score, best score, run count, name).
5. **Drill-down:** Click a model row to see all its runs with individual scores.
6. **Static Export:** Leaderboard page must work with `output: 'export'` (no server-side data fetching at runtime).

## Acceptance Criteria
- [x] Leaderboard page renders at `/leaderboard` route
- [x] Models are ranked by average total score descending
- [x] Filters for genre, date range, and min runs work correctly
- [x] Click-through to model detail shows all runs
- [x] All 263+ existing tests still pass
- [x] New tests cover leaderboard computation, filtering, and sorting logic
