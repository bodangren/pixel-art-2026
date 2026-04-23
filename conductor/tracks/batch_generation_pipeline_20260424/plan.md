# Implementation Plan: Batch Generation Pipeline

## Phase 1: Batch Configuration
- [ ] 1.1 Create BatchConfig schema (games, models, concurrency)
- [ ] 1.2 Implement BatchJob dataclass with status tracking
- [ ] 1.3 Add batch configuration UI
- [ ] 1.4 Write unit tests for batch config validation

## Phase 2: Parallel Execution
- [ ] 2.1 Extend orchestrator with batch execution mode
- [ ] 2.2 Implement asyncio-based parallel generation
- [ ] 2.3 Add concurrency limiter (max 3 concurrent jobs)
- [ ] 2.4 Write tests for parallel execution logic

## Phase 3: Progress Tracking
- [ ] 3.1 Create BatchProgress component with real-time updates
- [ ] 3.2 Add per-game progress indicators
- [ ] 3.3 Implement job status persistence
- [ ] 3.4 Write component tests for progress display

## Phase 4: Failure Handling
- [ ] 4.1 Add retry logic with exponential backoff
- [ ] 4.2 Implement failure isolation (one game failure doesn't stop others)
- [ ] 4.3 Create failure report with error details
- [ ] 4.4 Write tests for failure scenarios

## Phase 5: Result Aggregation
- [ ] 5.1 Create batch result comparison view
- [ ] 5.2 Add model performance aggregation across games
- [ ] 5.3 Implement batch export functionality
- [ ] 5.4 Write end-to-end tests for batch workflow