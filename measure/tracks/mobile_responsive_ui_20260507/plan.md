# Implementation Plan: Mobile-Responsive Benchmark UI

## Phase 1: Layout Foundation
- [ ] Task: Audit current breakpoints
  - [ ] Write tests verifying no horizontal overflow at 375px and 768px
  - [ ] Audit all pages for fixed widths, overflow-x, and min-w usage
  - [ ] Document touch-unfriendly interactions (hover-only tooltips, drag handles)
- [ ] Task: Responsive container refactor
  - [ ] Write tests for Layout component responsive behavior
  - [ ] Update globals.css with safe-area padding for mobile
  - [ ] Refactor container classes to use `px-4 md:px-8` consistently

## Phase 2: Page Components
- [ ] Task: Leaderboard responsive table
  - [ ] Write tests for LeaderboardTable mobile card layout
  - [ ] Implement card-based layout below `md` breakpoint
  - [ ] Ensure filters collapse into a drawer/modal on mobile
- [ ] Task: Run detail page
  - [ ] Write tests for AssetCard stacking on narrow viewports
  - [ ] Refactor grid layouts to `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
  - [ ] Make SpriteSheetPreview controls touch-accessible
- [ ] Task: Comparison view
  - [ ] Write tests for swipe gesture simulation
  - [ ] Stack ComparisonView panels vertically on mobile
  - [ ] Add swipe navigation for asset switching on touch

## Phase 3: Game Preview & Canvas
- [ ] Task: Responsive GameCanvas
  - [ ] Write tests for canvas scaling with container resize
  - [ ] Scale canvas via CSS `width: 100%` with devicePixelRatio backing
  - [ ] Ensure template tilemaps render correctly at reduced sizes
- [ ] Task: Touch interactions
  - [ ] Write tests for touch event handling in ZoomContainer
  - [ ] Map pinch-to-zoom to ZoomContainer zoom levels
  - [ ] Replace hover tooltips with tap-to-toggle info panels

## Phase 4: Verification
- [ ] Task: Cross-device manual check
  - [ ] Verify all pages at 375px, 768px, 1440px in dev tools
  - [ ] Run full test suite; fix any responsive regressions
  - [ ] Update DESIGN.md with responsive guidelines
