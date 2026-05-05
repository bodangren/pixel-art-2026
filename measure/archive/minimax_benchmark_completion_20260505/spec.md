# Specification: Complete Minimax M2.5 Benchmark Run

## Overview

The `minimax-m2.5` benchmark run directory contains only the `generate_assets.py` script but no generated PNG assets. This track will execute the script to generate all required benchmark assets and register them in the system.

## Functional Requirements

1. Execute `minimax-m2.5/generate_assets.py` to produce the four required PNG assets
2. Verify all four assets are created:
   - `background.png` (390x700)
   - `hero-3x3-sheet.png` (192x192, 3x3 grid at 64x64 each)
   - `goblin-3x3-sheet.png` (192x192, 3x3 grid at 64x64 each)
   - `orb-sheet.png` (144x48, 1x3 grid at 48x48 each)
3. Verify asset dimensions match specifications using Python Pillow
4. Create a run entry in `runs-index.json` for the minimax-m2.5 run
5. Update README.md to mark minimax-m2.5 as complete

## Non-Functional Requirements

- Assets must have transparent backgrounds (except background.png)
- Sprite sheets must use 3x3 grid layout where applicable
- Run the existing Python validation script to check technical compliance

## Acceptance Criteria

- [ ] `python3 minimax-m2.5/generate_assets.py` executes without error
- [ ] All 4 PNG files exist in `minimax-m2.5/public/games/sentence/labyrinth-goblin-king/`
- [ ] Asset dimensions verified correct via Pillow
- [ ] Run registered in `runs-index.json`
- [ ] README.md shows minimax-m2.5 as "Complete" with "4/4" assets