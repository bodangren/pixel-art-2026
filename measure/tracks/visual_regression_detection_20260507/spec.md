# Track: Automated Visual Regression Detection

## Overview
Add pixel-level diff detection between benchmark runs to automatically flag when a model's output changes significantly between re-runs or prompt versions. This enables CI-friendly monitoring of model consistency and early detection of quality drift.

## Goals
- Build a `lib/visual-diff.ts` module that computes perceptual diffs between PNG assets
- Integrate diff scores into the run validation pipeline
- Surface regressions in the dashboard with before/after overlays
- Establish a diff threshold baseline per asset type

## Acceptance Criteria
- [ ] `lib/visual-diff.ts` computes SSIM or perceptual hash diff between two PNGs
- [ ] Diff scores persisted in `run.json` when a re-run is detected
- [ ] Dashboard shows regression alerts for runs with diff > threshold
- [ ] Comparison view supports "diff overlay" mode (red highlight on changed pixels)
- [ ] Tests cover diff calculation, threshold logic, and alert generation

## Non-Goals
- Full screenshot visual testing of the Next.js UI itself
- Automated re-generation when regression is detected (handled by validation_driven_model_rerun)
