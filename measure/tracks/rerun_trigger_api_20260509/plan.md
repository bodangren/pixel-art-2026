# Plan: Benchmark Run Re-trigger API

## Phase 1: Backend API (TDD)
- [ ] Write tests for POST /api/runs/{id}/retrigger
- [ ] Implement retrigger handler with validation and queue logic
- [ ] Add parentRunId to Run schema
- [ ] Tests pass

## Phase 2: Pipeline Integration
- [ ] Wire re-trigger into existing batch generation pipeline
- [ ] Ensure same model/prompt/resolution parameters are reused
- [ ] Add re-trigger status tracking
- [ ] Tests pass

## Phase 3: UI Integration
- [ ] Add Re-trigger button to run detail page (failed runs only)
- [ ] Add re-trigger history section
- [ ] Add parent/child run linking in UI
- [ ] Component tests pass

## Phase 4: Verification
- [ ] Full test suite green
- [ ] Build succeeds
- [ ] Update lessons-learned.md
- [ ] Commit and push
