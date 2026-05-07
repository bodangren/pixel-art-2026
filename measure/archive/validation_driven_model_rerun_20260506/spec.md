# Track: Validation-Driven Model Re-run Pipeline

## Overview
Run automated validation across all existing model runs, flag failures, and re-trigger generation for failing models.

## Goals
- Validate all 16+ existing runs for completeness
- Flag broken/incomplete assets (e.g., 223-byte sprite sheets)
- Re-trigger generation for failing models
- Improve overall benchmark data quality

## Acceptance Criteria
- [ ] Validation script checks every run for asset completeness
- [ ] Failed runs are flagged with specific error reason
- [ ] Re-run pipeline triggers generation for flagged models
- [ ] Results dashboard shows validation status per run
- [ ] Tests cover validation logic

## Non-Goals
- Modifying scoring rubric
- Human re-review automation
