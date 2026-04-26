# Track: Batch Generation Pipeline

## Overview
Extend the asset generation pipeline to handle multiple games simultaneously, with parallel processing and progress tracking.

## Problem Statement
Current pipeline generates assets for one game at a time. Benchmarking multiple models across multiple games requires manual orchestration.

## Goals
1. Generate assets for multiple games in parallel
2. Track progress across all generation jobs
3. Support model comparison across same game set
4. Handle failures gracefully with retry logic

## Acceptance Criteria
- [ ] Batch job configuration (game list, model list)
- [ ] Parallel generation with configurable concurrency
- [ ] Progress dashboard showing all active jobs
- [ ] Failure handling with automatic retry
- [ ] Batch result aggregation and comparison

## Technical Notes
- Extend existing orchestrator with batch capabilities
- Use asyncio for parallel generation
- Store batch metadata in batch.json
- Add batch progress UI to dashboard