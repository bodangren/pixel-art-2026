# Lessons Learned

> This file is curated working memory, not an append-only log. Keep it at or below **50 lines**.
> Remove or condense entries that are no longer relevant to near-term planning.

## Architecture & Design
<!-- Decisions made that future tracks should be aware of -->

- (2026-04-09, static_benchmark_app) Static export with dynamic routes requires generateStaticParams - cannot use purely dynamic routes for SSG

- (2026-04-10, automated_validation_scoring_engine) Python Pillow for image validation - good choice for pixel-art analysis; handles RGBA properly

## Recurring Gotchas
<!-- Problems encountered repeatedly; save future tracks from the same pain -->

- (2026-04-09, static_benchmark_app) TypeScript `any` types proliferate when handling external JSON data - need schema validation layer early

- (2026-04-10, automated_validation_scoring_engine) datetime.utcnow() deprecated - use datetime.now(timezone.utc) instead

- (2026-04-13, repo) Adding .gitignore after files are tracked does NOT remove them from history; large files (node_modules/@next/swc-*.node, 124MB) block push. Need `git rm --cached` + history rewrite to fix.

- (2026-04-15, benchmark_dashboard_ui) React `key` prop cannot be spread - must be passed directly to JSX element, not as part of a spread object

## Patterns That Worked Well
<!-- Approaches worth repeating -->

- (2026-04-09, static_benchmark_app) Writing acceptance criteria before implementation caught scope creep early

- (2026-04-14, benchmark_dashboard_ui) TDD approach with vitest + React Testing Library works well - wrote failing tests first, then implemented component

## Platform Notes
<!-- Environment-specific learnings -->

- (2026-04-14, build) Linux/x64 platform requires `next build --webpack` instead of Turbopack due to missing native SWC bindings

## Planning Improvements
<!-- Notes on where estimates were wrong and why -->

- (2026-04-09, static_benchmark_app) Underestimated Phase 5 static export complexity - Next.js Turbopack build behavior differs from expected

- (2026-04-11, automated_validation_scoring_engine) When refactoring score_asset(), the has_transparency flag defaults to False which causes incorrect scoring - validate_asset() only adds has_transparency key when there's an issue, so score_asset() should check issues list instead of flag

- (2026-04-12, automated_validation_scoring_engine) TypeScript for-of loops with async operations - must capture loop variable in compound data structure before loop, not destructure after filter

- (2026-04-16, benchmark_dashboard_ui) jsdom does not perform real bounding rect calculations; mouse hover events in tests need explicit fireEvent calls that update component state directly rather than relying on browser geometry

- (2026-04-17, benchmark_dashboard_ui) Phase 3 (ZoomContainer) implemented with zoom levels (1x, 2x, 4x, 8x, max), pan on drag, and 3x3 grid hover detection
