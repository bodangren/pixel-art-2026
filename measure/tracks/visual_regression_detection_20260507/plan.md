# Implementation Plan: Automated Visual Regression Detection

## Phase 1: Diff Engine
- [ ] Task: Build visual diff calculator
  - [ ] Write tests for SSIM calculation between two identical PNGs (expect 1.0)
  - [ ] Write tests for SSIM between different PNGs (expect < 1.0)
  - [ ] Create `lib/visual-diff.ts` with computeDiffScore()
  - [ ] Use Sharp to resize, grayscale, and compare pixel buffers
- [ ] Task: Diff image generation
  - [ ] Write tests for diff overlay output (red highlight on changed pixels)
  - [ ] Implement generateDiffOverlay() returning PNG buffer
  - [ ] Verify overlay preserves alpha channel correctly

## Phase 2: Pipeline Integration
- [ ] Task: Run validation extension
  - [ ] Write tests for detecting re-runs by model_id + variant match
  - [ ] Extend validation pipeline to compute diff against previous run
  - [ ] Store diff_score and diff_overlay_path in run.json
- [ ] Task: Threshold configuration
  - [ ] Write tests for per-asset-type threshold defaults
  - [ ] Create `lib/diff-config.ts` with thresholds (background: 0.95, sprite: 0.90)
  - [ ] Flag runs as "regressed" when diff_score < threshold

## Phase 3: Dashboard Integration
- [ ] Task: Regression alerts
  - [ ] Write tests for RegressionAlert component rendering
  - [ ] Create `src/components/RegressionAlert.tsx`
  - [ ] Show alert banner on run detail page when regression detected
- [ ] Task: Diff overlay mode
  - [ ] Write tests for ComparisonView diff mode toggle
  - [ ] Add "Show Diff" toggle to ComparisonView
  - [ ] Render diff overlay when comparing two runs of same model

## Phase 4: Verification
- [ ] Task: Baseline establishment
  - [ ] Compute diff scores for all existing re-runs (e.g., minimax variants)
  - [ ] Adjust thresholds if too noisy or too lenient
  - [ ] Document regression detection workflow in README
