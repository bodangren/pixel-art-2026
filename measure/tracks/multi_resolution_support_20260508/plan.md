# Plan: Multi-Resolution Asset Support

## Phase 1: Schema & Task Update (TDD)
- [x] Write tests for Run schema with resolution field
- [x] Update RunSchema, TaskSchema, and validation to accept resolution
- [x] Seed tasks for 32x32 and 128x128 variants

## Phase 2: Pipeline Adaptation (TDD)
- [x] Write tests for generation script with resolution parameter
- [x] Update generate_assets.py to accept --resolution flag
- [x] Update validation engine scoring thresholds per resolution

## Phase 3: UI Integration (TDD)
- [x] Write tests for ResolutionBadge component
- [x] Add resolution filter to leaderboard and comparison pages
- [x] Display resolution on AssetCard and RunDetail

## Phase 4: Leaderboard Segmentation (TDD)
- [x] Write tests for resolution-specific leaderboard queries
- [x] Update leaderboard API to filter/group by resolution
- [x] Add resolution selector to leaderboard page

## Phase 5: Integration & Verification
- [ ] Run benchmark at 32x32 and 128x128 for one model as smoke test
- [ ] Update tracks.md and commit
