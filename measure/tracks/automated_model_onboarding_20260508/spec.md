# Track: Automated Model Onboarding Pipeline

## Overview
Enable the addition of new LLMs to the pixel art benchmark without manual configuration edits. A self-service onboarding flow will accept a model identifier, API endpoint template, and generation parameters, then automatically scaffold the necessary config, prompt templates, and validation rules so the new model can be benchmarked immediately.

## Goals
- Build an admin UI and API for registering new models
- Auto-generate model-specific config entries (temperature, max_tokens, image format rules)
- Scaffold prompt variant files and validation expectations for the new model
- Trigger an initial benchmark run automatically after onboarding completes

## Acceptance Criteria
- [ ] `/admin/onboard-model` page provides a form for model ID, provider, API endpoint, and auth env var name
- [ ] Onboarding API route `POST /api/models/onboard` validates input and writes to `config/models.json`
- [ ] Auto-generated prompt variant files are created in `prompts/models/<model_id>/`
- [ ] Validation rules are inherited from a base template and customized per provider
- [ ] Initial benchmark run is queued automatically via existing batch pipeline
- [ ] Tests cover form validation, config persistence, file scaffolding, and API integration

## Non-Goals
- Billing or rate-limit management for model APIs
- Support for non-HTTP model providers (local inference, gRPC)
- Automatic prompt engineering / hyperparameter tuning for new models
