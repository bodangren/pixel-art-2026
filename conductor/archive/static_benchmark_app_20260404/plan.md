# Implementation Plan - Build static benchmark/review app for game-asset model leaderboard

## Phase 1: Foundation & Data Model [checkpoint: 24682b4]
- [x] **Task: Define Zod schemas for Run and Review metadata** d78abbf
    - [x] Write tests for schema validation (success and fail cases)
    - [x] Implement schemas in `lib/schemas.ts`
- [x] **Task: Implement data fetching utilities for local JSON files** bff74d1
    - [x] Write tests for reading run and review data
    - [x] Implement utilities in `lib/data.ts`
- [x] **Task: Setup mock data for initial development** 9357025
    - [x] Write tests for data integrity
    - [x] Create initial directory structure and sample `run.json`
- [x] **Task: Conductor - User Manual Verification 'Foundation & Data Model' (Protocol in workflow.md)**

## Phase 2: Core Components & Asset Previews [checkpoint: 144e443]
- [x] **Task: Implement SpriteSheetPreview component with animation and media controls** dc08b64
    - [x] Write unit tests for frame calculation and FPS logic
    - [x] Implement component in `src/components/SpriteSheetPreview.tsx`
- [x] **Task: Implement BackgroundPreview component with viewport scaling** 09aec2e
    - [x] Write unit tests for scaling calculations
    - [x] Implement component in `src/components/BackgroundPreview.tsx`
- [x] **Task: Implement UI controls for zoom, grid, and transparency toggles** 05e41c5
    - [x] Write unit tests for toggle states and UI reactivity
    - [x] Implement component controls in `src/components/ReviewTools.tsx`
- [x] **Task: Conductor - User Manual Verification 'Core Components & Asset Previews' (Protocol in workflow.md)**

## Phase 3: Review Mode & Scoring [checkpoint: f451575]
- [x] **Task: Implement Rubric form with weighted scoring** c4df627
    - [x] Write unit tests for score calculation logic
    - [x] Implement `src/components/RubricForm.tsx`
- [x] **Task: Setup Review Mode environment toggle and UI state** 87cf62e
    - [x] Write tests for environment-based conditional rendering
    - [x] Implement state management in `src/app/runs/[runId]/page.tsx`
- [x] **Task: Implement local API for saving review.json** cfe9b05
    - [x] Write tests for file write operations (via server actions or a local script)
    - [x] Implement `scripts/save-review.ts` and integration
- [x] **Task: Conductor - User Manual Verification 'Review Mode & Scoring' (Protocol in workflow.md)**

## Phase 4: Pages & Routing [checkpoint: a3ef439]
- [x] **Task: Implement Run detail page (`/runs/[runId]`)**
    - [x] Write tests for dynamic routing and data loading
    - [x] Implement page logic in `src/app/runs/[runId]/page.tsx`
- [x] **Task: Implement Model history page (`/models/[modelId]`)**
    - [x] Write tests for model run aggregation
    - [x] Implement page in `src/app/models/[modelId]/page.tsx`
- [x] **Task: Implement Leaderboard page (`/leaderboard`)**
    - [x] Write tests for leaderboard sorting and scoring
    - [x] Implement page in `src/app/leaderboard/page.tsx`
- [x] **Task: Conductor - User Manual Verification 'Pages & Routing' (Protocol in workflow.md)**

## Phase 5: Derived Data & Static Export [checkpoint: 8a3e76f]
- [x] **Task: Implement build-derived.ts script** 0ab7290
    - [x] Write tests for aggregation logic
    - [x] Implement `scripts/build-derived.ts` to generate leaderboard/model index
- [x] **Task: Implement asset validation script** 6af6b9b
    - [x] Write tests for dimension and grid checks
    - [x] Implement `scripts/validate-run.ts`
- [x] **Task: Configure Next.js static export** 64cfbf2
    - [x] Write tests for static route generation (generateStaticParams)
    - [x] Update `next.config.ts` and verify build
- [x] **Task: Conductor - User Manual Verification 'Derived Data & Static Export' (Protocol in workflow.md)**
    - Automated verification: `npm run build` succeeded - 8 static pages generated
    - Static routes: /, /leaderboard, /models/[modelId], /runs/[runId], /api/review
