# Plan: Dynamic Game Preview Integration

## Phase 1: Game Canvas Setup
- [x] Task: Create game preview page structure
  - [x] New route `/preview` in app/
  - [x] Canvas component setup
  - [x] Load benchmark runs dropdown
- [x] Task: Implement sprite sheet loader
  - [x] Load images from public/assets/
  - [x] Parse 3x3 grid structure
  - [x] Handle transparency

## Phase 2: Animation System
- [ ] Task: Implement animation engine
  - [ ] Frame-based sprite animation
  - [ ] Animation state machine (idle, walk, attack)
  - [ ] Configurable FPS
- [ ] Task: Add animation controls
  - [ ] Play/pause controls
  - [ ] Speed slider
  - [ ] Animation state selector

## Phase 3: Tiled Map Preview
- [ ] Task: Implement tilemap renderer
  - [ ] Background tile rendering
  - [ ] Sprite z-ordering
  - [ ] Grid overlay toggle
- [ ] Task: Add sprite placement
  - [ ] Hero sprite positioning
  - [ ] Enemy sprite positioning
  - [ ] Collision visualization

## Phase 4: Hot-Reload Capability
- [ ] Task: Implement file watching
  - [ ] Use polling to check for asset changes
  - [ ] Reload changed assets only
  - [ ] Show reload indicator
- [ ] Task: Add asset selector
  - [ ] Dropdown to select different runs
  - [ ] Asset preview thumbnails

## Phase 5: Testing & Polish
- [ ] Task: Verify functionality
  - [ ] Test animation playback
  - [ ] Test hot-reload
  - [ ] Test tilemap rendering
- [ ] Task: Build verification
  - [ ] TypeScript check
  - [ ] Production build