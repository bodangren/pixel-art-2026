# Implementation Plan: ML-Based Automated Quality Scoring

## Phase 1: Feature Extraction & Training Pipeline
- [ ] Task: Define feature extraction for pixel art assets
  - [ ] Write tests for feature vector generation from PNG (color histogram, edge density, transparency ratio, grid alignment score)
  - [ ] Create `lib/quality-features.ts` with extractFeatures()
  - [ ] Validate features against existing human review scores for correlation
- [ ] Task: Train lightweight scoring model
  - [ ] Write tests for model training script output (ONNX file creation)
  - [ ] Create `scripts/train-quality-model.ts` using TensorFlow.js or scikit-learn via Python bridge
  - [ ] Export trained model to ONNX in `public/models/quality-scorer.onnx`

## Phase 2: Inference Engine
- [ ] Task: Build quality scorer module
  - [ ] Write tests for score inference (mock ONNX runtime if needed for CI)
  - [ ] Create `lib/quality-scorer.ts` with scoreAsset()
  - [ ] Handle model load errors gracefully (fallback to no score)
- [ ] Task: Batch scoring integration
  - [ ] Write tests for batch scoring across all assets in a run
  - [ ] Extend `lib/validation.ts` to invoke scorer after technical validation
  - [ ] Store per-asset and per-run mean scores in `run.json`

## Phase 3: Dashboard Integration
- [ ] Task: Automated score display
  - [ ] Write tests for AutomatedScoreBadge component rendering
  - [ ] Create `src/components/AutomatedScoreBadge.tsx`
  - [ ] Show score + confidence (high/medium/low) on AssetCard and RunDetail
- [ ] Task: Calibration view
  - [ ] Write tests for ScoreCalibrationChart (scatter plot human vs. auto)
  - [ ] Create `src/components/ScoreCalibrationChart.tsx` using Recharts
  - [ ] Add route `/calibration` accessible from admin menu

## Phase 4: Filtering & Workflow
- [ ] Task: Likely-failure flagging
  - [ ] Write tests for filtering logic (score < 40)
  - [ ] Update human review queue to show "likely failure" badges
  - [ ] Allow reviewers to override flag and confirm failure or pass
- [ ] Task: Model retraining trigger
  - [ ] Write tests for retraining script when N new human reviews accumulate
  - [ ] Add GitHub Action or manual trigger to retrain model monthly
  - [ ] Document retraining workflow in README
