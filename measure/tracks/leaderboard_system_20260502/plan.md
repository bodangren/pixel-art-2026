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
- [ ] Implement `LeaderboardTable` component with sortable column headers
- [ ] Implement `LeaderboardFilters` component
- [ ] Implement `ModelDetailPanel` — shows all runs for a selected model
- [ ] Verify all tests pass

## Phase 3: Page Integration
- [ ] Create `/leaderboard/page.tsx` as async server component
- [ ] Load and aggregate data at build time for static export
- [ ] Wire up filters and table in page component
- [ ] Add navigation link to leaderboard in Navbar
- [ ] Run `next build --webpack` to verify static export works

## Phase 4: Polish & Verification
- [ ] Add loading/empty states for no-data scenarios
- [ ] Ensure responsive layout on mobile viewports
- [ ] Run full test suite — all 227+ tests must pass
- [ ] Run `next lint` with no errors
