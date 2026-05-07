# Implementation Plan: Automated Model Onboarding Pipeline

## Phase 1: Onboarding API
- [ ] Task: Build model registration endpoint
  - [ ] Write tests for `POST /api/models/onboard` with valid payload
  - [ ] Write tests for validation errors (missing provider, invalid endpoint URL)
  - [ ] Create `app/api/models/onboard/route.ts` with Zod schema validation
  - [ ] Persist model config to `config/models.json` with atomic write
- [ ] Task: Config scaffolding
  - [ ] Write tests for auto-generated model config structure
  - [ ] Create `lib/model-scaffold.ts` with generateModelConfig()
  - [ ] Derive default parameters from provider templates (OpenAI, Anthropic, Google, MiniMax)

## Phase 2: Prompt & Validation Scaffolding
- [ ] Task: Prompt variant generation
  - [ ] Write tests for prompt file scaffolding
  - [ ] Create `lib/prompt-scaffold.ts` that copies base prompts into `prompts/models/<model_id>/`
  - [ ] Substitute model-specific placeholders (e.g., resolution hints, format constraints)
- [ ] Task: Validation rule inheritance
  - [ ] Write tests for merged validation rules (base + provider overrides)
  - [ ] Create `lib/validation-scaffold.ts` with mergeValidationRules()
  - [ ] Write provider-specific overrides (e.g., MiniMax requires base64 encoding hint)

## Phase 3: Admin UI
- [ ] Task: Onboarding form
  - [ ] Write tests for OnboardingForm component (rendering, validation, submit)
  - [ ] Create `src/components/OnboardingForm.tsx` with provider selector
  - [ ] Show preview of generated config before submission
- [ ] Task: Model management dashboard
  - [ ] Write tests for ModelList component
  - [ ] Create `src/components/ModelList.tsx` showing onboarded models + status
  - [ ] Add `/admin/models` route protected by simple env-based auth

## Phase 4: Auto-Run Integration
- [ ] Task: Trigger initial benchmark
  - [ ] Write tests for run queueing after onboarding
  - [ ] Extend onboarding API to invoke existing batch pipeline for new model
  - [ ] Surface onboarding + run status in ModelList
- [ ] Task: Documentation & rollback
  - [ ] Write tests for model removal API (`DELETE /api/models/:id`)
  - [ ] Implement soft-delete (mark inactive, preserve historical runs)
  - [ ] Document onboarding workflow in README for maintainers
