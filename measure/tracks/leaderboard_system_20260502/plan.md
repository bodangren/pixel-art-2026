# Plan: Public Leaderboard System

## Phase 1: Data Layer (TDD)
- [ ] Write tests for `computeLeaderboard()` — aggregates scores per model, handles missing reviews
- [ ] Write tests for filtering logic — genre, date range, min run count
- [ ] Write tests for sorting — by avg score, best score, run count, name
- [ ] Implement `computeLeaderboard()` in `lib/leaderboard.ts`
- [ ] Implement filter and sort functions
- [ ] Verify all tests pass

## Phase 2: UI Components (TDD)
- [ ] Write tests for `LeaderboardTable` — renders rows, handles empty state
- [ ] Write tests for `LeaderboardFilters` — genre dropdown, date picker, min runs input
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
