# Specification: GameCanvas Template Canvas Dimensions

## Problem

`GameCanvas` hardcodes `CANVAS_WIDTH = 640` and `CANVAS_HEIGHT = 480`, ignoring the template's `tilemapConfig.canvasWidth` and `tilemapConfig.canvasHeight`. This causes the `scifi-platformer` template (which needs 960x720) to render incorrectly.

## Solution

Modify `GameCanvas` to read `canvasWidth` and `canvasHeight` from the selected template's `tilemapConfig` and use those values instead of the hardcoded constants.

## Changes Required

1. **`src/components/GameCanvas.tsx`**:
   - Remove hardcoded `CANVAS_WIDTH` and `CANVAS_HEIGHT` constants
   - Read dimensions from `selectedTemplate?.tilemapConfig.canvasWidth/canvasHeight`
   - Apply the template's scale factor to canvas attributes

2. **Tests**: Ensure existing tests pass and add tests for template-specific dimensions.

## Acceptance Criteria

- [ ] `scifi-platformer` template renders at 960x720
- [ ] `labyrinth` template continues to render at 640x480
- [ ] `rpg-town` template renders at 768x576
- [ ] `isometric-city` template renders at 640x480
- [ ] All existing tests pass