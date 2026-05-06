# Track: Prompt Versioning & A/B Tracking

## Overview
Track which prompt version was used for each benchmark run and enable A/B comparison of prompt effectiveness across models. Currently all runs use an ad-hoc prompt with no versioning, making it impossible to correlate output quality with prompt changes.

## Goals
- Introduce a `prompts/` directory with versioned prompt files
- Link each `run.json` to a specific prompt version via `prompt_version_id`
- Build a prompt comparison view that shows side-by-side quality deltas when the same model uses different prompts
- Improve reproducibility for AI researchers

## Acceptance Criteria
- [ ] `prompts/v1.md`, `prompts/v2.md` etc. exist and are schema-validated
- [ ] `run.json` schema extended with `prompt_version_id` and `prompt_hash`
- [ ] Prompt history page lists all versions with usage counts
- [ ] Comparison view can filter by prompt version
- [ ] Tests cover prompt schema validation and run linkage

## Non-Goals
- Automated prompt generation or LLM-based prompt optimization
- Changing the existing benchmark asset specification
