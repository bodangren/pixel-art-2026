# Project Tracks — Pixel Art Benchmark

This repository tracks the ability of LLMs to generate game-ready pixel art assets using Python/Pillow.

---

- [x] **Track: Build static benchmark/review app for game-asset model leaderboard**
  *Link: [./archive/static_benchmark_app_20260404/](./archive/static_benchmark_app_20260404/)*
  Turn this repo into a semi-automated benchmark system for evaluating image models on generating starter pixel-art asset packs.

- [x] **Track: Build autonomous asset generation pipeline**
  *Link: [./archive/feature_asset_generation_orchestrator_20260404/](./archive/feature_asset_generation_orchestrator_20260404/)*
  Identify games missing assets in advantage-games, research requirements, and trigger LLM generation.

- [x] **Track: Automated Technical Validation (Scoring Engine)**
  *Link: [./archive/automated_validation_scoring_engine_20260410/](./archive/automated_validation_scoring_engine_20260410/)*
  Develop a validation tool to automatically verify if generated assets meet technical specs (correct dimensions, 3x3 grid alignment, transparent backgrounds, and specific hex code adherence).
  Phase 1: Complete | Phase 2: Complete | Phase 3: Complete

- [x] **Track: Benchmark Dashboard & Comparison UI**
   *Link: [./archive/benchmark_dashboard_ui_20260414/](./archive/benchmark_dashboard_ui_20260414/)*
   Replace the static README with an interactive web dashboard (e.g., Next.js). Features include pixel-level zooming, side-by-side comparison of sprites across models, and metadata visualization.
   Phase 1-6: Complete

- [x] **Track: Dynamic Game Preview Integration**
   *Link: [./archive/dynamic_game_preview_20260423/](./archive/dynamic_game_preview_20260423/)*
   Create a lightweight web-based engine for 'Labyrinth of the Goblin King' that can hot-reload these assets to see how they look when animated and tiled in-game.
   Phase 1-2: Complete

- [x] **Track: Multi-Genre/Style Expansion**
  *Link: [./archive/multi_genre_expansion_20260424/](./archive/multi_genre_expansion_20260424/)*
  Expand the benchmark to include other styles (e.g., 16-bit RPG, Isometric, Top-down Sci-fi) and assets (UI buttons, font sheets).
  Phase 1-5: Complete (141 tests passing)

- [x] **Track: Asset Quality Metrics Dashboard**
   *Link: [./archive/asset_quality_dashboard_20260424/](./archive/asset_quality_dashboard_20260424/)*
   Quality score distribution charts, trend analysis, model comparison radar charts, anomaly detection, export reports.
   Phase 1-5: Complete (168 tests passing)

- [x] **Track: Game Engine Integration Tests**
   *Link: [./archive/game_engine_integration_tests_20260424/](./archive/game_engine_integration_tests_20260424/)*
   Automated testing in Phaser/Unity/Godot, sprite animation verification, tilemap rendering tests, performance benchmarking.
   Phase 1-5: Complete (219 tests passing)

- [x] **Track: Git History Cleanup**
   *Link: [./archive/git_history_cleanup_20260423/](./archive/git_history_cleanup_20260423/)*
   Remove 124MB node_modules/@next/swc-*.node files from git history using BFG Repo-Cleaner or git filter-repo to unblock GitHub pushes. (Resolved: files were never committed, repo is clean)

- [x] **Track: Visual Refresh: Define Unique Identity**
  *Link: [./archive/visual_refresh_20260425/](./archive/visual_refresh_20260425/)*
  *Status: Complete*

- [x] **Track: TypeScript Strict Mode**
   *Link: [./archive/typescript_strict_mode_20260426/](./archive/typescript_strict_mode_20260426/)*
   *Status: Complete* — 0 `any` types found, strict mode already enabled; fixed type import bug.

- [x] **Track: End-to-End Batch Pipeline Test**
   *Link: [./archive/e2e_batch_pipeline_test_20260426/](./archive/e2e_batch_pipeline_test_20260426/)*
   *Status: Complete* — 8 integration tests covering 3 pipeline stages (generation → validation → display); 227 tests passing

---

## Upcoming Tracks

- [x] **Track: Public Leaderboard System**
   *Link: [./archive/leaderboard_system_20260502/](./archive/leaderboard_system_20260502/)*
   *Priority: High* — Aggregate review scores across all runs, rank models, provide filtering/sorting to identify top performers.
   **Phase 1-4: Complete (263 tests passing)**

- [x] **Track: Advanced Sprite Inspection Tools**
   *Link: [./archive/sprite_inspection_tools_20260502/](./archive/sprite_inspection_tools_20260502/)*
   *Priority: High* — Add animation playback controls (frame-stepping, FPS slider, loop modes) for evaluating sprite quality frame-by-frame.
   **Phase 1-4: Complete (59 sprite-related tests passing)**

- [x] **Track: CI/CD Pipeline Automation**
   *Link: [./archive/ci_cd_pipeline_20260502/](./archive/ci_cd_pipeline_20260502/)*
   *Priority: Medium* — GitHub Actions workflows for automated lint, test, build, and deploy on PRs and main branch pushes.
   **Phase 1-4: Complete (340 tests passing)**

- [x] **Track: Accessibility Audit (WCAG 2.1 AA)**
   *Link: [./tracks/accessibility_audit_20260502/](./tracks/accessibility_audit_20260502/)*
   *Priority: Medium* — Audit and fix keyboard navigation, screen reader support, color contrast, and motion preferences.
   **Phase 1-4: Complete (359 tests passing)**

- [x] **Track: Batch Export and Reporting**
   *Link: [./archive/batch-export-and-reporting_20260503/](./archive/batch-export-and-reporting_20260503/)*
   *Priority: High* — Add CSV/JSON export for leaderboard rankings, quality metrics, and model comparison data.
   **Phase 1-4: Complete (370 tests passing)**

- [x] **Track: Canvas Interaction E2E Testing**
    *Link: [./tracks/canvas-interaction-testing_20260503/](./tracks/canvas-interaction-testing_20260503/)*
    *Priority: Medium* — Add integration tests for sprite inspection tools, zoom/pan interactions, and game canvas workflows.
    **Phase 1-5: Complete (172 tests passing)**

- [ ] **Track: Multi-Game Preview Expansion**
   *Link: [./tracks/game-preview-multi-game_20260503/](./tracks/game-preview-multi-game_20260503/)*
   *Priority: Medium* — Extend dynamic game preview to support RPG, isometric, and sci-fi templates beyond Labyrinth.
