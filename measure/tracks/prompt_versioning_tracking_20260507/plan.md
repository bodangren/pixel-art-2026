# Implementation Plan: Prompt Versioning & A/B Tracking

## Phase 1: Prompt Schema & Storage
- [ ] Task: Define prompt schema
  - [ ] Write tests for prompt metadata validation (id, version, created_at, content_hash)
  - [ ] Create `lib/prompt-schema.ts` with Zod schema
  - [ ] Validate existing prompt file against schema
- [ ] Task: Create prompts directory
  - [ ] Write tests for prompt discovery (listPrompts, getPromptById)
  - [ ] Create `prompts/v1.md` from existing benchmark prompt
  - [ ] Create `lib/prompts.ts` for prompt loading

## Phase 2: Run-Prompt Linkage
- [ ] Task: Extend run schema
  - [ ] Write tests for run.json with prompt_version_id and prompt_hash
  - [ ] Update `lib/schemas.ts` to include optional prompt fields
  - [ ] Backfill existing runs with "v1" prompt reference
- [ ] Task: Update generation pipeline
  - [ ] Write tests for pipeline using explicit prompt version
  - [ ] Pass prompt_version_id when creating new runs
  - [ ] Compute SHA-256 content hash and store in run.json

## Phase 3: UI & Comparison
- [ ] Task: Prompt history page
  - [ ] Write tests for PromptHistory component rendering
  - [ ] Create `/prompts` page listing versions and usage counts
  - [ ] Link from navbar
- [ ] Task: A/B comparison filter
  - [ ] Write tests for filtering runs by prompt version
  - [ ] Add prompt version selector to comparison view
  - [ ] Show quality delta badge when same model has multiple prompt versions

## Phase 4: Verification
- [ ] Task: Validate all runs linked
  - [ ] Audit existing 16+ runs for prompt_version_id presence
  - [ ] Fix any missing references
  - [ ] Confirm comparison view works with prompt filters
