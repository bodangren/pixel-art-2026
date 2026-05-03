# Lessons Learned

> This file is curated working memory, not an append-only log. Keep it at or below **50 lines**.
> Remove or condense entries that are no longer relevant to near-term planning.

## Architecture & Design
<!-- Decisions made that future tracks should be aware of -->

- (2026-04-09, static_benchmark_app) Static export with dynamic routes requires generateStaticParams - cannot use purely dynamic routes for SSG

- (2026-04-10, automated_validation_scoring_engine) Python Pillow for image validation - good choice for pixel-art analysis; handles RGBA properly

## Recurring Gotchas
<!-- Problems encountered repeatedly; save future tracks from the same pain -->

- (2026-04-10, automated_validation_scoring_engine) datetime.utcnow() deprecated - use datetime.now(timezone.utc) instead

- (2026-04-13, repo) Adding .gitignore after files are tracked does NOT remove them from history; large files (node_modules/@next/swc-*.node, 124MB) block push. Need `git rm --cached` + history rewrite to fix.

- (2026-04-15, benchmark_dashboard_ui) React `key` prop cannot be spread - must be passed directly to JSX element, not as part of a spread object

## Patterns That Worked Well
<!-- Approaches worth repeating -->

- (2026-04-09, static_benchmark_app) Writing acceptance criteria before implementation caught scope creep early

- (2026-04-14, benchmark_dashboard_ui) TDD approach with vitest + React Testing Library works well - wrote failing tests first, then implemented component

## Planning Improvements
<!-- Notes on where estimates were wrong and why -->

- (2026-04-09, static_benchmark_app) Underestimated Phase 5 static export complexity - Next.js Turbopack build behavior differs from expected; use `next build --webpack` on Linux/x64

- (2026-04-11, automated_validation_scoring_engine) When refactoring score_asset(), the has_transparency flag defaults to False which causes incorrect scoring - validate_asset() only adds has_transparency key when there's an issue, so score_asset() should check issues list instead of flag

- (2026-04-12, automated_validation_scoring_engine) TypeScript for-of loops with async operations - must capture loop variable in compound data structure before loop, not destructure after filter

- (2026-04-16, benchmark_dashboard_ui) jsdom does not perform real bounding rect calculations; mouse hover events in tests need explicit fireEvent calls that update component state directly rather than relying on browser geometry

- (2026-04-17, git_history_cleanup) swc binary files (124MB) were never actually committed to this repo; the tech-debt item was a false alarm. The .gitignore was effective from the start. Do a dry-run push before starting large cleanup operations to verify the issue exists.

- (2026-04-17, benchmark_dashboard_ui) ComparisonView client component cannot dynamically import server-only code (fs). For static export, pass initial data as props from server component instead of fetching client-side.

- (2026-04-23, game_preview) ESLint rules prohibit calling setState synchronously within useEffect. Use setTimeout(() => {...}, 0) to defer execution, or use .then()/.finally() promise chains instead of async/await directly in effects.

- (2026-04-24, game_preview) GameCanvas had duplicate sprite loading - loadSprites callback AND useEffect both loaded sprites independently. Consolidated into single loadSprites function called by both paths.
- (2026-04-24-25, build/validation) Next.js Turbopack requires native SWC bindings on linux/x64 use `next build --webpack`; Recharts Tooltip formatter ValueType | undefined type issue - remove formatter; Static export does not support API routes - embed data fetching in async server components
- (2026-05-02, sprite_inspection) When a type is only used as a value (e.g., in `as const` assertions), importing it with `import type` causes unused import warnings. Use regular import. SpriteSheetPreview had internal animation state instead of using the separate AnimationControls component - refactored to use AnimationControls + FramePlayer for proper separation of concerns.
- (2026-05-03, accessibility_audit) jest-axe with vitest requires custom `expectNoViolations()` helper since `toHaveNoViolations()` is a Chai matcher not available in vitest. axe results need to be awaited in async tests. Phase 4 tasks completed: skip-to-content link, focus-visible CSS, focus trap in modals, prefers-reduced-motion for sprite auto-play, ARIA roles (toolbar, slider, button) and aria attributes (aria-pressed, aria-live, aria-modal).
- (2026-05-03, batch_export) Server components cannot pass event handlers to client components - onClick props containing functions cause serialization error during SSR. Use client components for export buttons that need event handlers, or pass serializable data (exportType, data) instead of callbacks.
