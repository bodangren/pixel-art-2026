# Plan: Static Benchmark App Implementation

## Phase 1: Project Scaffolding & Data Structure (TDD)
- [x] Initialize Next.js app in the root directory.
- [x] Define Zod schemas for `run.json` and `review.json` in `lib/schemas.ts`.
- [x] Create utility scripts in `scripts/` for run validation and derived data generation.
- [x] Migrate existing model results into the new `data/runs/<run-id>/` structure.

## Phase 2: Core Data Layer & Automated Validation
- [x] Implement local filesystem data fetching for `getStaticProps`/`getStaticPaths`.
- [x] Build the derived data generator to produce `leaderboard.json` and index files.
- [x] **Build Automated Technical Linter**: Create a script (`scripts/linter.ts`) to validate grid alignment, transparency, and palette consistency.
- [x] Verify static export (`next build`).

## Phase 3: Dynamic Asset Preview Components
- [x] Build `SpriteSheetPreview` with animation playback, zoom, and grid overlay.
- [x] Build `BackgroundPreview` with viewport scaling and mock UI overlays.
- [x] Implement `AssetGallery` for run-specific asset display.
- [x] Refactor Asset Gallery to dynamically map assets from `run.json`.

## Phase 4: Review Interface & Scoring (Blind Mode)
- [x] Implement `/runs/[runId]` page with conditional "Review Mode" UI.
- [x] Build the weighted rubric scoring form.
- [x] Implement **Blind Review Mode** logic.
- [x] Implement "Save Review" functionality (writes to `review.json` via local API).

## Phase 5: Advanced Leaderboard & History
- [x] Implement `/leaderboard` with model rankings and weighted averages.
- [x] Enhance Leaderboard to allow sorting by individual rubric subscores.
- [x] Implement **Golden Samples** support in data layer and UI.
- [x] Implement `/models/[modelId]` for run history and trend visualization.
- [x] Final polish of UI/UX for "rugged" construction-style accessibility.

## Phase 6: Validation & Verification
- [x] Run full validation suite and Technical Linter on all existing runs.
- [x] Verify static export handles all routes correctly.
- [x] Final documentation update.
