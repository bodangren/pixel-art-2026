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