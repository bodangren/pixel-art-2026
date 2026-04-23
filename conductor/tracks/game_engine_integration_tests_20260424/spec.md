# Track: Game Engine Integration Tests

## Overview
Validate that generated assets work correctly in actual game engines, ensuring they're truly game-ready.

## Problem Statement
Assets pass technical validation (dimensions, transparency) but may fail in real game engines due to sprite sheet layout, animation timing, or rendering issues.

## Goals
1. Test assets in multiple game engines (Phaser, Unity, Godot)
2. Validate sprite sheet animation playback
3. Check tilemap rendering correctness
4. Verify performance under load

## Acceptance Criteria
- [ ] Automated test suite for Phaser integration
- [ ] Sprite animation playback verification
- [ ] Tilemap rendering tests
- [ ] Performance benchmark (FPS under load)
- [ ] Cross-engine compatibility report

## Technical Notes
- Use Playwright for browser-based engine testing
- Create minimal test games for each engine
- Automate asset loading and visual verification
- Store test results in integration-results.json