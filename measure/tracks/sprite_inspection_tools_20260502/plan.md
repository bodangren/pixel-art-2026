# Plan: Advanced Sprite Inspection Tools

## Phase 1: Frame Extraction Logic (TDD)
- [x] Write tests for `extractFrames()` — splits sprite sheet into individual frames by grid dimensions
- [x] Write tests for `FramePlayer` class — play, pause, step, set FPS, loop modes
- [x] Write tests for ping-pong frame sequence generation
- [x] Implement `extractFrames()` utility in `lib/sprite-utils.ts`
- [x] Implement `FramePlayer` with state machine (playing/paused/stepping)
- [x] Verify all tests pass

## Phase 2: Animation Controls UI (TDD)
- [x] Write tests for `AnimationControls` — play/pause button, FPS slider, frame counter
- [x] Write tests for keyboard shortcut handling (←/→ for stepping)
- [x] Implement `AnimationControls` component with play/pause, FPS slider, step buttons
- [x] Implement `FrameCounter` display component
- [x] Implement `LoopModeSelector` (once/loop/ping-pong)
- [x] Verify all tests pass

## Phase 3: Canvas Renderer
- [x] Write tests for `SpriteSheetPreview` — renders correct frame at given index
- [x] Implement `SpriteSheetPreview` component with existing code
- [x] Verify SpriteSheetPreview tests pass (10 tests)

## Phase 4: Integration & Polish
- [x] Integrate `AnimationControls` with `SpriteSheetPreview`
- [x] Use `FramePlayer` for animation state management in SpriteSheetPreview
- [x] Verify SpriteSheetPreview tests pass (10 tests)
- [x] Run full test suite — all tests must pass
- [ ] Run `next lint` with no new errors
