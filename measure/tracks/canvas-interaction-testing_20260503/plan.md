# Plan: Canvas Interaction E2E Testing

## Phase 1: SpriteSheetPreview Integration Tests [x]

- [x] Write test: loads sprite sheet and displays first frame
- [x] Write test: play button starts animation, frame counter increments
- [x] Write test: pause button stops animation at current frame
- [x] Write test: step forward advances one frame, step back reverses one frame
- [x] Write test: FPS slider changes animation speed
- [x] Write test: loop mode selector switches between once/loop/pingpong
- [x] Create test fixture: 4-frame sprite sheet PNG (generate programmatically or use existing test data)

## Phase 2: ZoomContainer Integration Tests [x]

- [x] Write test: zoom in increases image scale, zoom out decreases
- [x] Write test: mouse drag pans the image within container
- [x] Write test: hover shows grid overlay at zoom level > 4x
- [x] Write test: zoom is capped at max limit (16x)
- [x] Write test: double-click resets zoom to 1x
- [x] Mock canvas bounding rect for consistent test results (jsdom limitation)

## Phase 3: GameCanvas Integration Tests [x]

- [x] Write test: GameCanvas renders loaded sprite assets
- [x] Write test: hot-reload updates displayed sprites without full re-render
- [x] Write test: tilemap renders correctly with loaded tileset
- [x] Create mock game data fixture with sprite paths and tilemap config

## Phase 4: Cross-Component Sync Tests [x]

- [x] Write test: AnimationControls play/pause syncs with SpriteSheetPreview state
- [x] Write test: FPS change in AnimationControls updates SpriteSheetPreview playback
- [x] Write test: frame step in SpriteSheetPreview updates AnimationControls counter

## Phase 5: Verification and Handoff [x]

- [x] Run full test suite — all tests pass including new integration tests
- [x] Run `next lint` — no errors (only existing warnings)
- [x] Verify test execution time stays under 30 seconds
- [x] Document test fixtures and patterns in test file comments
- [x] Handoff
