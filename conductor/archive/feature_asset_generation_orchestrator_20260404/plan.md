# Plan: Asset Generation Orchestrator Implementation

## Phase 1: Discovery & Research Agent
- [x] Build `scripts/discover-target-games.ts`: Scans `advantage-games` for primitive-shape usage or empty assets.
- [x] Build `scripts/research-assets.ts`: Extracts technical and thematic requirements from game source code.
- [x] **Validation**: Verify `requirements.json` accurately describes `labyrinth-goblin-king`.

## Phase 2: Generation Runner & Sandbox
- [x] Build `scripts/generate-assets.ts`: Orchestrates prompt construction and LLM code generation.
- [x] Implement `scripts/sandbox-runner.ts`: Safe execution wrapper for model-generated Python/Pillow code.
- [x] **Validation**: Successfully generate assets for an automated run.

## Phase 3: Benchmark Integration
- [x] Implement auto-packaging: Automatically move captured assets into `data/runs/<id>/`.
- [x] Build `scripts/auto-pipeline.ts`: The master script that runs Research -> Generation -> Execution -> Linting -> Derived Data Rebuild.
- [x] **Validation**: Run the full pipeline for `labyrinth-goblin-king`.

## Phase 4: Scaling & UI Visibility
- [x] Support batching multiple target games (via `discover-target-games.ts` output).
- [x] Add "Source Game" tracking to the benchmark dashboard.
- [x] Final UI cleanup to show source game links in run details.
