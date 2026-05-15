# Plan: Multi-Reviewer Consensus Scoring

## Phase 1: Schema & Data Model (TDD)
- [ ] Write tests for `ReviewEntry` Zod schema (reviewer_id, scores, timestamp)
- [ ] Write tests for consensus computation (median, IQR outlier detection)
- [ ] Implement `review-schema.ts` with `ReviewEntry[]` array
- [ ] Implement `consensus.ts` with `computeConsensus()` pure function
- [ ] Run tests → expect pass

## Phase 2: Storage & Backfill
- [ ] Write tests for `loadRunReviews()` and `saveRunReviews()` helpers
- [ ] Update `run.json` schema to include `consensus` field
- [ ] Write migration script to backfill existing reviews as single-entry arrays
- [ ] Run tests → expect pass

## Phase 3: UI Components
- [ ] Write tests for `ReviewCountBadge` component
- [ ] Write tests for `ConsensusScoreDisplay` component
- [ ] Write tests for `OutlierReviewAlert` component
- [ ] Implement components with Storybook-style props
- [ ] Run tests → expect pass

## Phase 4: Review Page Integration
- [ ] Write tests for multi-review submission flow
- [ ] Update review page to load existing reviews and allow additional submissions
- [ ] Wire consensus computation on save
- [ ] Run tests → expect pass

## Phase 5: Leaderboard & Dashboard Integration
- [ ] Write tests for leaderboard sorting using consensus scores
- [ ] Update leaderboard API to prefer `consensus.overall` over `review.overall`
- [ ] Add reviewer reputation panel to admin dashboard
- [ ] Run tests → expect pass

## Phase 6: Verification & Handoff
- [ ] Full test suite pass (existing + new tests)
- [ ] Build passes (`next build --webpack`)
- [ ] Update `tech-debt.md` and `lessons-learned.md`
- [ ] Commit and push
