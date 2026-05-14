# Plan: Benchmark Run Re-trigger Dashboard UI

## Phase 1: API Client and Types
- [ ] Write tests for retrigger API client function
- [ ] Add `retriggerRun(runId: string)` to `lib/api.ts`
- [ ] Add `RetriggerResponse` Zod schema
- [ ] Add `parentRunId` to RunSchema

## Phase 2: Run Detail UI
- [ ] Write tests for RetriggerButton component
- [ ] Implement `RetriggerButton` with disabled state for non-failed runs
- [ ] Add confirmation dialog before retrigger
- [ ] Wire button into RunDetailPage
- [ ] Show retrigger status (pending/completed/error)

## Phase 3: Parent/Child Run Linking
- [ ] Write tests for run lineage display
- [ ] Add "Retrigger History" section to RunDetailPage
- [ ] Link to parent run when viewing a retriggered run
- [ ] Link to child runs from original run

## Phase 4: Verification
- [ ] Full test suite green
- [ ] Build succeeds (`next build --webpack`)
- [ ] Update lessons-learned.md
- [ ] Commit and push
