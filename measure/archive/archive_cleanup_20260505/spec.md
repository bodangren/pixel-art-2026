# Specification: Archive Active Tracks

## Overview

The `measure/tracks/` directory contains 5 tracks that have been completed but not yet archived. These should be moved to `measure/archive/` to maintain a clean active workspace.

## Tracks to Archive

1. `canvas-interaction-testing_20260503` - Phase 1-5 complete (172 tests passing)
2. `game-preview-multi-game_20260503` - Phase 1-5 complete (408 tests passing)
3. `export_downloadfile_refactor` - Complete (all 3 components use shared lib/export.ts)
4. `gamecanvas_template_canvas` - Phase 1-4 complete (232 tests passing)
5. `minimax_benchmark_completion_20260505` - Phase 1-4 complete (all 4 assets generated)

## Procedure

1. For each track:
   - Verify track is complete (all tasks checked off)
   - Move track directory to `measure/archive/`
2. Update `measure/tracks.md` to mark these as archived
3. Verify project still builds and tests pass

## Acceptance Criteria

- [ ] All 5 completed tracks archived
- [ ] tracks.md updated to show archived links
- [ ] Project builds successfully
- [ ] Tests still pass
