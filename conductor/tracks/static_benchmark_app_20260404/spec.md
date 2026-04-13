# Specification - Build static benchmark/review app for game-asset model leaderboard

## Summary
Turn this repo into a semi-automated benchmark system for evaluating image models on generating starter pixel-art asset packs for games under construction.

## Goals
- Next.js with static export.
- Public deployment: fully read-only.
- Local/dev mode: editable score entry and review editing.
- Source-of-truth data: versioned JSON in the repo.
- Support repeated runs of the same model over time.
- Provide a leaderboard and per-model history pages.

## Core Data Model
### Run Identity
- `<model-id>__<YYYY-MM-DD>__<variant>`
- Example: `gpt-image-1__2026-04-04__r1`

### Directory Structure
```text
data/
  runs/
    <run-id>/
      run.json
      review.json
      assets/
        background.png
        hero-3x3-sheet.png
        goblin-3x3-sheet.png
        orb-sheet.png
```

### run.json
- `run_id`, `model_id`, `run_date`, `variant`, `benchmark/game id`, `prompt version`, `asset file paths`, `status`, `generation notes`.

### review.json
- `review timestamp`, `rubric subscores`, `notes`, `weighted total score`, `prototype-ready yes/no`.

## App Routes
- `/leaderboard`
- `/models/[modelId]`
- `/runs/[runId]`

## Asset Preview Requirements (3x3 sheets)
- Autoplay animation, frame-step, FPS control, zoom, grid overlay, transparency checkerboard.

## Asset Preview Requirements (Background)
- Full preview, gameplay-scale viewport, optional overlays.

## Validation
- File presence, dimensions, grid alignment, alpha channel.

## Rubric Categories
- Background, Hero sheet, Enemy sheet, Orb/pickup sheet, Whole pack.
- `would_use_in_prototype_now: boolean`

## Technical Constraints
- Next.js static export.
- `NEXT_PUBLIC_REVIEW_MODE=true/false`.
- No database required (JSON-in-repo).
