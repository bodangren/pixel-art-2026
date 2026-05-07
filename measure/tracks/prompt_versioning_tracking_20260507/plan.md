# Implementation Plan: Prompt Versioning & A/B Tracking

## Phase 1: Prompt Schema & Storage
- [x] Task: Define prompt schema
  - [x] Write tests for prompt metadata validation (id, version, created_at, content_hash)
  - [x] Create `lib/prompt-schema.ts` with Zod schema
  - [x] Validate existing prompt file against schema
- [x] Task: Create prompts directory
  - [x] Write tests for prompt discovery (listPrompts, getPromptById)
  - [x] Create `prompts/v1.md` from existing benchmark prompt
  - [x] Create `lib/prompts.ts` for prompt loading

## Phase 2: Run-Prompt Linkage
- [x] Task: Extend run schema
  - [x] Write tests for run.json with prompt_version_id and prompt_hash
  - [x] Update `lib/schemas.ts` to include optional prompt fields
  - [x] Backfill existing runs with "v1" prompt reference
- [x] Task: Update generation pipeline
  - [x] Write tests for pipeline using explicit prompt version
  - [x] Pass prompt_version_id when creating new runs
  - [x] Compute SHA-256 content hash and store in run.json

## Phase 3: UI & Comparison
- [x] Task: Prompt history page
  - [x] Write tests for PromptHistory component rendering
  - [x] Create `/prompts` page listing versions and usage counts
  - [x] Link from navbar
- [x] Task: A/B comparison filter
  - [x] Write tests for filtering runs by prompt version
  - [x] Add prompt version selector to comparison view
  - [x] Show quality delta badge when same model has multiple prompt versions
- [x] Task: Phase 4: Verify all runs linked
  - [x] Audit existing 16+ runs for prompt_version_id presence
  - [x] Confirm comparison view works with prompt filters
