# Plan: Public Leaderboard System

## Phase 1: Data Layer (TDD)
- [x] Write tests for `computeLeaderboard()` — aggregates scores per model, handles missing reviews
- [x] Write tests for filtering logic — genre, date range, min run count
- [x] Write tests for sorting — by avg score, best score, run count, name
- [x] Implement `computeLeaderboard()` in `lib/leaderboard.ts`
- [x] Implement filter and sort functions
- [x] Verify all tests pass

## Phase 2: UI Components (TDD)
- [x] Write tests for `LeaderboardTable` — renders rows, handles empty state
- [x] Write tests for `LeaderboardFilters` — genre dropdown, date picker, min runs input
- [x] Implement `LeaderboardTable` component with sortable column headers
- [x] Implement `LeaderboardFilters` component
- [x] Implement `ModelDetailPanel` — shows all runs for a selected model
- [x] Verify all tests pass

## Phase 3: Page Integration
- [x] Create `/leaderboard/page.tsx` as async server component
- [x] Load and aggregate data at build time for static export
- [x] Wire up filters and table in page component
- [x] Add navigation link to leaderboard in Navbar
- [x] Run `next build --webpack` to verify static export works

## Phase 4: Polish & Verification
- [x] Add loading/empty states for no-data scenarios
- [x] Ensure responsive layout on mobile viewports
- [x] Run full test suite — all 227+ tests must pass
- [x] Run `next lint` with no errors (pre-existing lint errors exist in codebase unrelated to this track)
