# Plan: Canvas Interaction E2E Testing

## Phase 1: SpriteSheetPreview Integration Tests [ ]

- [ ] Write test: loads sprite sheet and displays first frame
- [ ] Write test: play button starts animation, frame counter increments
- [ ] Write test: pause button stops animation at current frame
- [ ] Write test: step forward advances one frame, step back reverses one frame
- [ ] Write test: FPS slider changes animation speed
- [ ] Write test: loop mode selector switches between once/loop/pingpong
- [ ] Create test fixture: 4-frame sprite sheet PNG (generate programmatically or use existing test data)

## Phase 2: ZoomContainer Integration Tests [ ]

- [ ] Write test: zoom in increases image scale, zoom out decreases
- [ ] Write test: mouse drag pans the image within container
- [ ] Write test: hover shows grid overlay at zoom level > 4x
- [ ] Write test: zoom is capped at max limit (16x)
- [ ] Write test: double-click resets zoom to 1x
- [ ] Mock canvas bounding rect for consistent test results (jsdom limitation)

## Phase 3: GameCanvas Integration Tests [ ]

- [ ] Write test: GameCanvas renders loaded sprite assets
- [ ] Write test: hot-reload updates displayed sprites without full re-render
- [ ] Write test: tilemap renders correctly with loaded tileset
- [ ] Create mock game data fixture with sprite paths and tilemap config

## Phase 4: Cross-Component Sync Tests [ ]

- [ ] Write test: AnimationControls play/pause syncs with SpriteSheetPreview state
- [ ] Write test: FPS change in AnimationControls updates SpriteSheetPreview playback
- [ ] Write test: frame step in SpriteSheetPreview updates AnimationControls counter

## Phase 5: Verification and Handoff [ ]

- [ ] Run full test suite — all 340+ tests pass including new integration tests
- [ ] Run `next lint` — no errors
- [ ] Verify test execution time stays under 30 seconds
- [ ] Document test fixtures and patterns in test file comments
- [ ] Handoff
