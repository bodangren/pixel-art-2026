# Spec: Canvas Interaction E2E Testing

## Problem

The sprite inspection tools (SpriteSheetPreview, AnimationControls, ZoomContainer) and the game canvas (GameCanvas) have unit tests but lack integration tests that verify the full interaction flow: loading a sprite sheet, playing animation, stepping frames, zooming, and panning. These components are critical for the review workflow — if they break, evaluators cannot inspect assets.

## Goal

Add integration tests covering the complete sprite inspection and canvas interaction workflows, ensuring all interactive features work together correctly.

## Requirements

1. **SpriteSheetPreview Integration**: Test loading a sprite sheet, playing animation, pausing, stepping forward/back, changing FPS, switching loop modes.
2. **ZoomContainer Integration**: Test zoom in/out, pan with mouse drag, hover grid overlay, max zoom limits.
3. **GameCanvas Integration**: Test loading sprites into the game canvas, rendering tiles, hot-reloading asset changes.
4. **Cross-Component**: Test that AnimationControls state syncs with SpriteSheetPreview playback.

## Non-Goals

- Visual regression testing (screenshot comparison)
- Performance benchmarking of canvas rendering
- Mobile touch interaction testing

## Success Criteria

- 15+ new integration tests covering full interaction flows
- All existing 340+ tests still pass
- Tests use realistic sprite sheet fixtures (not mocks)
