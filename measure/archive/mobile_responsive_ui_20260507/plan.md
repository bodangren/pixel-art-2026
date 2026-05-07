# Implementation Plan: Mobile-Responsive Benchmark UI

## Phase 1: Layout Foundation
- [x] Task: Audit current breakpoints
  - [x] Write tests verifying no horizontal overflow at 375px and 768px
  - [x] Audit all pages for fixed widths, overflow-x, and min-w usage
  - [x] Document touch-unfriendly interactions (hover-only tooltips, drag handles)
- [x] Task: Responsive container refactor
  - [x] Write tests for Layout component responsive behavior
  - [x] Update globals.css with safe-area padding for mobile
  - [x] Refactor container classes to use `px-4 md:px-8` consistently

## Phase 2: Page Components
- [x] Task: Leaderboard responsive table
  - [x] Write tests for LeaderboardTable mobile card layout
  - [x] Implement card-based layout below `md` breakpoint
  - [x] Ensure filters collapse into a drawer/modal on mobile
- [x] Task: Run detail page
  - [x] Write tests for AssetCard stacking on narrow viewports
  - [x] Refactor grid layouts to `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
  - [x] Make SpriteSheetPreview controls touch-accessible
- [x] Task: Comparison view
  - [x] Write tests for swipe gesture simulation
  - [x] Stack ComparisonView panels vertically on mobile
  - [ ] Add swipe navigation for asset switching on touch

## Phase 3: Game Preview & Canvas
- [x] Task: Responsive GameCanvas
  - [x] Write tests for canvas scaling with container resize
  - [x] Scale canvas via CSS `width: 100%` with devicePixelRatio backing
  - [x] Ensure template tilemaps render correctly at reduced sizes
- [x] Task: Touch interactions
  - [x] Write tests for touch event handling in ZoomContainer
  - [x] Map pinch-to-zoom to ZoomContainer zoom levels
  - [x] Replace hover tooltips with tap-to-toggle info panels

## Phase 4: Verification
- [x] Task: Cross-device manual check
  - [x] Verify all pages at 375px, 768px, 1440px in dev tools
  - [x] Run full test suite; fix any responsive regressions
  - [x] Update DESIGN.md with responsive guidelines
