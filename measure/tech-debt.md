# Tech Debt Registry

> This file is curated working memory, not an append-only log. Keep it at or below **50 lines**.
> Remove or summarize resolved items when they no longer need to influence near-term planning.
>
> **Severity:** `Critical` | `High` | `Medium` | `Low`
> **Status:** `Open` | `Resolved`

| Date | Track | Item | Severity | Status | Notes |
|------|-------|------|----------|--------|-------|
| 2026-04-09 | static_benchmark_app | Missing`.gitignore` - build artifacts committed | Medium | Resolved | Added .gitignore with .next/, node_modules/ |
| 2026-04-09 | static_benchmark_app | Widespread `any` types (22 locations) | Low | Resolved | 0 found - strict mode already enabled; test file had missing type import |
| 2026-04-11 | automated_validation_scoring_engine | score_asset transparency logic - defaulting to False | Low | Resolved | Refactored to check issue list directly instead of has_transparency flag |
| 2026-04-12 | automated_validation_scoring_engine | Validation pipeline integration | Low | Resolved | build-derived-logic.ts now runs validation and computes average_tech_score |
| 2026-04-13 | repo | node_modules/@next/swc-*.node files tracked (124MB each) exceed GitHub 100MB limit | Critical | Resolved | Verified: swc files were never committed to this repo; backup confirmed clean (992K), push succeeds |
| 2026-04-16 | benchmark_dashboard_ui | ZoomContainer replaced ZoomPanel in ComparisonView | Low | Resolved | ZoomContainer has more features (pan, max zoom, hover grid); consolidated implementations |
| 2026-04-24 | dynamic_game_preview | GameCanvas has duplicate sprite-loading logic (loadSprites callback + useEffect both do the same thing) | Medium | Resolved | Consolidated into single loadSprites function; useEffect now calls loadSprites directly |
| 2026-05-03 | canvas_interaction_testing | Phase 1-4: SpriteSheetPreview, ZoomContainer, GameCanvas integration tests added | Low | Resolved | 157 component tests pass; cross-component sync tests for AnimationControls/FramePlayer |
| 2026-05-03 | canvas_interaction_testing | Phase 5: Verification and handoff complete | Low | Resolved | Build succeeds, lint passes (only pre-existing warnings), 172 tests pass |
| 2026-04-24 | dynamic_game_preview | ComparisonView ZoomPanel uses inline `<img>` with `imageRendering: pixelated` instead of ZoomContainer | Medium | Resolved | ZoomPanel in ComparisonView now reuses ZoomContainer component |
| 2026-04-24 | batch_generation_pipeline | Phase 1: BatchConfig schema and BatchState implemented | Low | Resolved | Phase 2-5 now complete - parallel execution, progress UI, failure handling, result aggregation |
| 2026-04-24 | batch_generation_pipeline | Phase 5: BatchResultsComparison and export functions | Low | Resolved | Batch results UI complete with CSV/JSON export |
| 2026-04-24 | multi_genre_expansion | New track created for style expansion (RPG, isometric, sci-fi, UI, font) | Medium | Resolved | All 5 phases complete - style-metadata, validation, dashboard, batch pipeline, integration |
| 2026-04-24 | build | Next.js Turbopack lacks native bindings on linux/x64 | Medium | Resolved | Use `next build --webpack` on this platform |
| 2026-04-25 | asset_quality_dashboard | Quality metrics dashboard - Recharts tooltip formatter typing issue | Low | Resolved | Removed custom formatter to avoid TS2322 error |
| 2026-04-25 | visual_refresh | Lamborghini identity applied to UI (Navbar, AssetCard, layout, globals.css) | Medium | Resolved | New DESIGN.md defines obsidian/gold aesthetic; build + 168 tests pass |
| 2026-05-02 | typescript_strict_mode | test file missing type-only import (GameEngineTestRunner) | Low | Resolved | Added explicit `type` import in test file; no `any` types found in codebase |
| 2026-05-02 | e2e_batch_pipeline | E2E pipeline tests in lib/ | Low | Resolved | 8 tests added covering generation→validation→display; 227 total tests pass |
| 2026-05-02 | sprite_inspection | Phase 1: sprite-utils.ts with extractFrames() and FramePlayer class | Low | Resolved | 31 tests; lib/sprite-utils.ts created |
| 2026-05-02 | sprite_inspection | Phase 2: AnimationControls component with LoopModeSelector, FrameCounter | Low | Resolved | 18 tests; src/components/AnimationControls.tsx created |
| 2026-05-02 | sprite_inspection | Phase 3-4: SpriteSheetPreview integrated with AnimationControls and FramePlayer | Low | Resolved | 10 tests; SpriteSheetPreview now uses FramePlayer for state management |
| 2026-05-02 | sprite_inspection | SpriteSheetPreview used internal state instead of AnimationControls | Medium | Resolved | Refactored to use AnimationControls with FramePlayer; proper separation of concerns |
| 2026-05-04 | game-preview-multi-game | Phase 1-5: Multi-Game Template Expansion | Low | Resolved | 4 game templates (labyrinth, rpg-town, isometric-city, scifi-platformer); template selector UI added to GameCanvas; 408 tests pass |
| 2026-05-04 | batch-export | Export components duplicate downloadFile logic | Low | Open | ExportButton, ExportDropdown, ComparisonExport all inline Blob/URL.createObjectURL instead of using lib/export.ts:downloadFile() |
| 2026-05-04 | game-preview-multi-game | GameCanvas hardcodes CANVAS_WIDTH/HEIGHT ignoring template config | Medium | Resolved | GameCanvas now reads canvasWidth/Height from template tilemapConfig |