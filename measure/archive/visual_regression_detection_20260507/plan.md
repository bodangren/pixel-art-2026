# Implementation Plan: Automated Visual Regression Detection

## Phase 1: Diff Engine
- [x] Task: Build visual diff calculator
  - [x] Write tests for SSIM calculation between two identical PNGs (expect 1.0)
  - [x] Write tests for SSIM between different PNGs (expect < 1.0)
  - [x] Create `lib/visual-diff.ts` with computeDiffScore()
  - [x] Use Sharp to resize, grayscale, and compare pixel buffers
- [x] Task: Diff image generation
  - [x] Write tests for diff overlay output (red highlight on changed pixels)
  - [x] Implement generateDiffOverlay() returning PNG buffer
  - [x] Verify overlay preserves alpha channel correctly

## Phase 2: Pipeline Integration
- [x] Task: Run validation extension
  - [x] Write tests for detecting re-runs by model_id + variant match
  - [x] Extend validation pipeline to compute diff against previous run
  - [x] Store diff_score and diff_overlay_path in run.json
- [x] Task: Threshold configuration
  - [x] Write tests for per-asset-type threshold defaults
  - [x] Create `lib/diff-config.ts` with thresholds (background: 0.95, sprite: 0.90)
  - [x] Flag runs as "regressed" when diff_score < threshold

## Phase 3: Dashboard Integration
- [x] Task: Regression alerts
  - [x] Write tests for RegressionAlert component rendering
  - [x] Create `src/components/RegressionAlert.tsx`
  - [x] Show alert banner on run detail page when regression detected
- [x] Task: Diff overlay mode
  - [x] Write tests for ComparisonView diff mode toggle
  - [x] Add "Show Diff" toggle to ComparisonView
  - [x] Render diff overlay when comparing two runs of same model

## Phase 4: Verification
- [x] Task: Baseline establishment
  - [x] Compute diff scores for all existing re-runs (e.g., minimax variants)
  - [x] Adjust thresholds if too noisy or too lenient
  - [x] Document regression detection workflow in README
