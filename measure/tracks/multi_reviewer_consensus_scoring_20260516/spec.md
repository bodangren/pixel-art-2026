# Track: Multi-Reviewer Consensus Scoring

## Background
Current review workflow supports a single review per asset. To improve score reliability and surface reviewer bias, we need multi-reviewer support with statistical consensus computation.

## Goals
1. Allow multiple reviewers to submit independent scores for the same asset
2. Compute consensus scores using median + interquartile range (IQR) outlier detection
3. Surface reviewer statistics (agreement rate, average deviation from consensus)
4. Backfill consensus for existing single-review assets using current score as sole data point

## Acceptance Criteria
- [ ] Review schema supports multiple `review_entries` per asset
- [ ] Consensus score computed and stored in `run.json` after 2+ reviews
- [ ] Outlier reviews flagged in UI (red border / warning icon)
- [ ] Reviewer reputation dashboard showing agreement rate per reviewer
- [ ] Existing leaderboard aggregates consensus scores when available, falls back to single review
- [ ] All changes covered by unit tests; build passes

## Non-Goals
- Real-time collaborative review (simultaneous editing)
- Weighted scoring by reviewer reputation (deferred to v2)
- ML model retraining on consensus data (deferred to post-ML-scoring track)

## Related Tracks
- `ml_automated_quality_scoring_20260508` — consensus data will improve ML training set
- `benchmark_retrigger_dashboard_ui_20260514` — consensus scores displayed in re-trigger UI
