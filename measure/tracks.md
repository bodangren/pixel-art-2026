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

- [ ] **Track: Asset Quality Metrics Dashboard**
  *Link: [./tracks/asset_quality_dashboard_20260424/](./tracks/asset_quality_dashboard_20260424/)*
  Quality score distribution charts, trend analysis, model comparison radar charts, anomaly detection, export reports.

- [ ] **Track: Game Engine Integration Tests**
  *Link: [./tracks/game_engine_integration_tests_20260424/](./tracks/game_engine_integration_tests_20260424/)*
  Automated testing in Phaser/Unity/Godot, sprite animation verification, tilemap rendering tests, performance benchmarking.

- [x] **Track: Git History Cleanup**
   *Link: [./archive/git_history_cleanup_20260423/](./archive/git_history_cleanup_20260423/)*
   Remove 124MB node_modules/@next/swc-*.node files from git history using BFG Repo-Cleaner or git filter-repo to unblock GitHub pushes. (Resolved: files were never committed, repo is clean)

- [x] **Track: Visual Refresh: Define Unique Identity**
  *Link: [./archive/visual_refresh_20260425/](./archive/visual_refresh_20260425/)*
  *Status: Complete*

- [ ] **Track: TypeScript Strict Mode**
  *Link: [./tracks/typescript_strict_mode_20260426/](./tracks/typescript_strict_mode_20260426/)*
  Replace all any types with proper schemas, add Zod validation for external JSON.

- [ ] **Track: End-to-End Batch Pipeline Test**
  *Link: [./tracks/e2e_batch_pipeline_test_20260426/](./tracks/e2e_batch_pipeline_test_20260426/)*
  Full integration test from LLM generation through validation to dashboard display.
