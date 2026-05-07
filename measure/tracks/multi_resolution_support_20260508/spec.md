# Spec: Multi-Resolution Asset Support

## Goal
Extend the benchmark to support and compare pixel art assets at multiple resolutions: 32x32, 64x64 (current), and 128x128.

## Acceptance Criteria
- [ ] Resolution field added to Run schema and benchmark task definition
- [ ] Generation pipeline supports resolution parameter
- [ ] Validation engine adapts scoring criteria per resolution (e.g., grid alignment tolerance)
- [ ] UI displays resolution badge on asset cards and filters by resolution
- [ ] Leaderboard supports resolution-specific rankings

## Out of Scope
- Non-square aspect ratios
- Vector or SVG output
