# Spec: Dynamic Game Preview Integration

## Overview
Create a lightweight web-based preview engine for 'Labyrinth of the Goblin King' that can hot-reload pixel art assets to see how they look when animated and tiled in-game.

## Problem Statement
Currently, the benchmark only shows static images of generated assets. We need a way to preview how these assets look in actual gameplay - animated, tiled, and with typical game interactions.

## Core Features

### Phase 1: Game Canvas Setup
- Set up HTML5 Canvas for game rendering
- Load sprite sheets from generated assets
- Implement 3x3 grid extraction for animated sprites
- Basic tile rendering with transparency support

### Phase 2: Animation System
- Frame-based animation from sprite sheets
- Configurable animation speed
- Support for idle, walk, attack animation states

### Phase 3: Tiled Map Preview
- Render tilemap using background assets
- Place hero/enemy sprites on the map
- Demonstrate sprite tiling and z-ordering

### Phase 4: Hot-Reload Capability
- Watch asset directory for changes
- Auto-reload assets without page refresh
- Show asset reload indicator

## Technical Constraints
- Must work with static export (no server-side code)
- Should be lightweight (< 500KB total)
- Pixel-perfect rendering with nearest-neighbor scaling
- Transparent background support

## Acceptance Criteria
1. Canvas renders hero sprite from benchmark data
2. Sprite animates (idle loop)
3. Background tiles correctly
4. Assets can be swapped via hot-reload
5. Works in static export mode