# Track: Multi-Genre/Style Expansion

## Overview

Expand the pixel-art benchmark to support multiple game genres and art styles beyond the current dungeon crawler/fantasy focus. This will enable evaluation of LLM-generated assets across 16-bit RPG, isometric, top-down sci-fi styles, plus UI elements like buttons and font sheets.

## Functional Requirements

### 1. Style Definitions

- [ ] **16-bit RPG Style**: Define color palette (max 64 colors), sprite dimensions (16x16, 32x32, 64x64), animation frames (4-8), detail level appropriate for SNES-era aesthetics
- [ ] **Isometric Style**: 2:1 pixel ratio, 45-degree angles, consistent light source (top-left), multi-tile sprites that align on isometric grid
- [ ] **Top-down Sci-fi Style**: Neon color palette, tech-specific motifs, grid-aligned tiles, transparency for UI overlays
- [ ] **UI Button Style**: 8-state sprites (normal, hover, pressed, disabled, etc.), consistent border width, scalable sizing metadata
- [ ] **Font Sheet Style**: Monospace grid layout, ASCII coverage, consistent character spacing, transparent backgrounds

### 2. Reference Asset Library

- [ ] Collect 3-5 reference assets per style category from public domain sources (OpenGameArt,itch.io)
- [ ] Store reference assets in `assets/references/<style>/` directory
- [ ] Generate reference metadata JSON with dimensions, color count, animation frame count

### 3. Validation Engine Updates

- [ ] Add style-specific validation rules (isometric alignment, sci-fi color palette adherence)
- [ ] Create style-specific scoring algorithms
- [ ] Update `validate_asset.py` to accept `--style` parameter

### 4. Benchmark Dashboard Updates

- [ ] Add style filter dropdown to dashboard
- [ ] Display style-specific metrics in comparison view
- [ ] Add style reference gallery panel

### 5. Batch Generation Updates

- [ ] Accept `--style` parameter in batch generation requests
- [ ] Add style presets to BatchConfig schema
- [ ] Track per-style generation statistics

## Non-Functional Requirements

- Reference assets must be ≤500KB total per style category
- Validation must complete within 5 seconds per asset
- Dashboard must support switching between styles without page reload

## Acceptance Criteria

1. Dashboard displays assets filtered by style (RPG, Isometric, Sci-fi, UI, Font)
2. Each style category has at least 3 reference assets with validation rules
3. Validation engine produces style-specific scores
4. Batch pipeline accepts style parameter and generates appropriate prompts
5. UI includes style reference gallery with hover zoom
6. All existing tests pass with new style parameters

## Out of Scope

- Generation of actual assets (handled by separate pipelines)
- 3D asset support
- Animation beyond 2-4 frame cycles
- Audio asset benchmarking