# Tech Debt Registry

> This file is curated working memory, not an append-only log. Keep it at or below **50 lines**.
> Remove or summarize resolved items when they no longer need to influence near-term planning.
>
> **Severity:** `Critical` | `High` | `Medium` | `Low`
> **Status:** `Open` | `Resolved`

| Date | Track | Item | Severity | Status | Notes |
|------|-------|------|----------|--------|-------|
| 2026-04-09 | static_benchmark_app | Missing`.gitignore` - build artifacts committed | Medium | Resolved | Added .gitignore with .next/, node_modules/ |
| 2026-04-09 | static_benchmark_app | Widespread `any` types (22 locations) | Low | Open | Gradually replace with proper types |
| 2026-04-11 | automated_validation_scoring_engine | score_asset transparency logic - defaulting to False | Low | Resolved | Refactored to check issue list directly instead of has_transparency flag |
| 2026-04-12 | automated_validation_scoring_engine | Validation pipeline integration | Low | Resolved | build-derived-logic.ts now runs validation and computes average_tech_score |
| 2026-04-13 | repo | node_modules/@next/swc-*.node files tracked (124MB each) exceed GitHub 100MB limit | Critical | Resolved | Verified: swc files were never committed to this repo; backup confirmed clean (992K), push succeeds |
| 2026-04-16 | benchmark_dashboard_ui | ZoomContainer replaced ZoomPanel in ComparisonView | Low | Resolved | ZoomContainer has more features (pan, max zoom, hover grid); consolidated implementations |
| 2026-04-24 | dynamic_game_preview | GameCanvas has duplicate sprite-loading logic (loadSprites callback + useEffect both do the same thing) | Medium | Resolved | Consolidated into single loadSprites function; useEffect now calls loadSprites directly |
| 2026-04-24 | dynamic_game_preview | ComparisonView ZoomPanel uses inline `<img>` with `imageRendering: pixelated` instead of ZoomContainer | Medium | Open | ZoomPanel in ComparisonView should reuse ZoomContainer component for consistency |
| 2026-04-24 | batch_generation_pipeline | Phase 1: BatchConfig schema and BatchState implemented | Low | Resolved | Phase 2-5 now complete - parallel execution, progress UI, failure handling, result aggregation |
| 2026-04-24 | batch_generation_pipeline | Phase 5: BatchResultsComparison and export functions | Low | Open | Batch results UI complete with CSV/JSON export |
| 2026-04-24 | multi_genre_expansion | New track created for style expansion (RPG, isometric, sci-fi, UI, font) | Medium | Resolved | All 5 phases complete - style-metadata, validation, dashboard, batch pipeline, integration |
| 2026-04-24 | build | Next.js Turbopack lacks native bindings on linux/x64 | Medium | Open | Use `next build --webpack` on this platform |