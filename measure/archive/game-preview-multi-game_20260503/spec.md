# Spec: Multi-Game Preview Expansion

## Problem

The dynamic game preview currently supports only "Labyrinth of the Goblin King." The multi-genre expansion added RPG, isometric, sci-fi, UI, and font styles, but there's no way to preview how these style assets look in a game context. Evaluators must imagine how isometric tiles or sci-fi sprites would render in a real game, which defeats the purpose of the benchmark.

## Goal

Extend the dynamic game preview to support multiple game templates — one per genre/style — so evaluators can see how generated assets render in context for each supported style.

## Requirements

1. **Game Template Registry**: Define a registry of game templates (tilemap config, sprite slot mappings, render logic) per genre.
2. **Labyrinth Template**: Existing game (rename to "Labyrinth of the Goblin King" template).
3. **RPG Town Template**: Top-down RPG town with NPCs, buildings, and dialogue.
4. **Isometric City Template**: Isometric city builder with placed buildings and paths.
5. **Sci-Fi Platformer Template**: Side-scrolling sci-fi platformer with platforms and enemies.
6. **Template Selector**: UI to switch between game templates when viewing a run's assets.

## Non-Goals

- Full game engine (keep templates minimal — render only, no gameplay)
- Custom game creation by users
- Asset editing within the preview

## Success Criteria

- 4 game templates render correctly with appropriate assets
- Template selector allows switching between games
- Each template loads correct sprite slots from the run's asset pack
- All existing tests pass
