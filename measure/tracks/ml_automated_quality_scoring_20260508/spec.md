# Track: ML-Based Automated Quality Scoring

## Overview
Reduce the human review burden by introducing an automated quality scoring system that evaluates generated pixel art assets using a lightweight ML model trained on historical human review data. The scorer will produce a 0-100 quality score per asset, flagging obvious failures (broken transparency, miscolored pixels, misaligned grids) without requiring manual inspection.

## Goals
- Build a `lib/quality-scorer.ts` module that invokes a lightweight ONNX/TensorFlow.js model for asset quality prediction
- Train or adapt a pre-trained model using existing human review scores and asset metadata
- Integrate the automated score into the validation pipeline as a pre-filter before human review
- Surface scores in the dashboard alongside human review scores for calibration

## Acceptance Criteria
- [ ] `lib/quality-scorer.ts` loads an ONNX model and returns a quality score (0-100) for a given PNG buffer
- [ ] Automated scores are persisted in `run.json` under `automated_quality_score`
- [ ] Dashboard displays automated scores on the run detail page with a confidence indicator
- [ ] Runs with automated score < 40 are flagged as "likely failure" and deprioritized in the human review queue
- [ ] Calibration view compares human vs. automated scores for all reviewed assets (scatter plot)
- [ ] Tests cover model inference, score persistence, flagging logic, and calibration UI

## Non-Goals
- Replacing human review entirely (this is a pre-filter and calibration tool)
- Training a model from scratch on massive datasets (use transfer learning or a simple feature-based regressor)
- Real-time inference at generation time (run after generation completes, async)
