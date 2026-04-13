# Spec: Asset Generation Orchestrator

## Summary
Build an autonomous pipeline that identifies games in the `advantage-games` repository that are missing assets, researches their technical and thematic requirements, and triggers LLMs to generate pixel art assets.

## Core Requirements
1. **Game Discovery (Scanner)**:
   - Identify games in `advantage-games/src/components/games/` that rely on primitive shapes (`Rect`, `Circle`) or have empty asset directories.
2. **Asset Researcher Agent**:
   - Analyze game source code (`Game.tsx`, `Config.ts`) to extract:
     - **Thematic Context**: Game title, description, and character names.
     - **Technical Specs**: Sprite sheet dimensions (e.g., 3x3), tile sizes (e.g., 64x64), and required background resolution.
3. **Generation Runner**:
   - Construct high-context prompts for LLMs using researched data.
   - Execute model-generated code (e.g., Python/Pillow) in a safe environment.
   - Capture resulting PNGs and package them into the `data/runs/` structure of the benchmark app.
4. **Integration**:
   - Automatically trigger the Technical Linter after generation.
   - Update the benchmark dashboard index.

## Target Games
- Primary initial target: `labyrinth-goblin-king` (currently uses circles/rects).
- Secondary targets: Any games in `advantage-games` with "Coming Soon" or placeholder status.

## Technical Constraints
- Must use `advantage-games` as the source of truth for requirements.
- Resulting assets must be stored in `pixel-art-benchmark/data/runs/`.
- Prompting must enforce "Pixel Art via Code" rather than generative image models.
