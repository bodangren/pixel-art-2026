# Implementation Plan: Batch Generation Pipeline

## Phase 1: Batch Configuration
- [x] 1.1 Create BatchConfig schema (games, models, concurrency)
- [x] 1.2 Implement BatchJob dataclass with status tracking
- [x] 1.3 Add batch configuration UI
- [x] 1.4 Write unit tests for batch config validation

## Phase 2: Parallel Execution
- [x] 2.1 Extend orchestrator with batch execution mode
- [x] 2.2 Implement asyncio-based parallel generation
- [x] 2.3 Add concurrency limiter (max 3 concurrent jobs)
- [x] 2.4 Write tests for parallel execution logic

## Phase 3: Progress Tracking
- [x] 3.1 Create BatchProgress component with real-time updates
- [x] 3.2 Add per-game progress indicators
- [x] 3.3 Implement job status persistence
- [x] 3.4 Write component tests for progress display

## Phase 4: Failure Handling
- [x] 4.1 Add retry logic with exponential backoff
- [x] 4.2 Implement failure isolation (one game failure doesn't stop others)
- [x] 4.3 Create failure report with error details
- [x] 4.4 Write tests for failure scenarios

## Phase 5: Result Aggregation
- [x] 5.1 Create batch result comparison view
- [x] 5.2 Add model performance aggregation across games
- [x] 5.3 Implement batch export functionality
- [x] 5.4 Write end-to-end tests for batch workflow