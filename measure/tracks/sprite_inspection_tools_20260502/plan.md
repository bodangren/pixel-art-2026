# Plan: Advanced Sprite Inspection Tools

## Phase 1: Frame Extraction Logic (TDD)
- [ ] Write tests for `extractFrames()` — splits sprite sheet into individual frames by grid dimensions
- [ ] Write tests for `FramePlayer` class — play, pause, step, set FPS, loop modes
- [ ] Write tests for ping-pong frame sequence generation
- [ ] Implement `extractFrames()` utility in `lib/sprite-utils.ts`
- [ ] Implement `FramePlayer` with state machine (playing/paused/stepping)
- [ ] Verify all tests pass

## Phase 2: Animation Controls UI (TDD)
- [ ] Write tests for `AnimationControls` — play/pause button, FPS slider, frame counter
- [ ] Write tests for keyboard shortcut handling (←/→ for stepping)
- [ ] Implement `AnimationControls` component with play/pause, FPS slider, step buttons
- [ ] Implement `FrameCounter` display component
- [ ] Implement `LoopModeSelector` (once/loop/ping-pong)
- [ ] Verify all tests pass

## Phase 3: Canvas Renderer
- [ ] Write tests for `SpriteCanvas` — renders correct frame at given index
- [ ] Implement `SpriteCanvas` component using HTML canvas for pixel-perfect rendering
- [ ] Integrate `FramePlayer` with `SpriteCanvas` for automatic frame cycling
- [ ] Wire up animation controls to canvas renderer
- [ ] Verify all tests pass

## Phase 4: Integration & Polish
- [ ] Integrate animation controls into existing asset detail view
- [ ] Ensure zoom/pan still works alongside animation playback
- [ ] Add keyboard focus management for accessibility
- [ ] Run full test suite — all 227+ tests must pass
- [ ] Run `next lint` with no errors
