# Spec: Advanced Sprite Inspection Tools

## Problem
The product vision specifies "animation, frame-stepping, FPS control, zoom, grid overlay" for sprite sheet inspection. The current ZoomContainer provides zoom and grid, but lacks animation playback controls critical for evaluating sprite quality.

## Goal
Add animation playback controls to the sprite sheet viewer so evaluators can step through frames, control playback speed, and assess animation quality frame-by-frame.

## Requirements
1. **Frame Stepping:** Previous/Next frame buttons with keyboard shortcuts (←/→).
2. **FPS Control:** Adjustable frames-per-second slider (1-30 FPS) with play/pause toggle.
3. **Frame Counter:** Display current frame / total frames (e.g., "3 / 12").
4. **Animation Preview:** Render sprite sheet frames in sequence using canvas or DOM cycling.
5. **Loop Modes:** Play once, loop, ping-pong (forward then reverse).
6. **Integration:** Works within existing ZoomContainer and ComparisonView contexts.

## Acceptance Criteria
- [ ] Sprite animation plays at configurable FPS
- [ ] Frame stepping works via buttons and keyboard
- [ ] Frame counter shows current/total
- [ ] Loop modes (once, loop, ping-pong) function correctly
- [ ] Animation controls integrate with existing zoom/pan
- [ ] All 227+ existing tests still pass
- [ ] New tests cover frame extraction, playback timing, and control state
