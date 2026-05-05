# Plan: Multi-Game Preview Expansion

## Phase 1: Template Registry and Types [x]

- [x] Write test: GameTemplate type has required fields (id, name, genre, spriteSlots, tilemapConfig)
- [x] Write test: registry.getTemplate("labyrinth") returns the existing game config
- [x] Define `GameTemplate` interface with id, name, genre, spriteSlots, tilemapConfig, renderConfig
- [x] Create `lib/game-templates.ts` with template registry
- [x] Migrate existing Labyrinth config into registry format

## Phase 2: RPG Town Template [x]

- [x] Write test: RPG town template renders with hero, NPC, and building sprites
- [x] Define RPG town tilemap (grass, paths, buildings, trees)
- [x] Map sprite slots: hero → character, npc → character, building → structure, tree → scenery
- [x] Implement minimal top-down render logic (tile grid + sprite overlay)
- [x] Test with existing asset packs that have character sprites

## Phase 3: Isometric City Template [x]

- [x] Write test: isometric template renders with correct diamond-shaped tiles
- [x] Define isometric tilemap (ground tiles, building footprints, roads)
- [x] Map sprite slots: building → structure, ground → terrain, vehicle → prop
- [x] Implement isometric projection math (diamond tile rendering)
- [x] Test with isometric style assets from multi-genre expansion

## Phase 4: Sci-Fi Platformer Template [x]

- [x] Write test: platformer template renders platforms and character sprites
- [x] Define side-scrolling tilemap (platforms, background, enemies)
- [x] Map sprite slots: hero → character, enemy → creature, platform → terrain, background → scenery
- [x] Implement simple parallax background rendering
- [x] Test with sci-fi style assets

## Phase 5: Template Selector UI [x]

- [x] Write test: template selector dropdown renders on game preview page
- [x] Write test: selecting a template re-renders the canvas with new config
- [x] Add template selector to dynamic game preview page
- [x] Persist selected template in URL search params
- [x] Wire template selection to GameCanvas re-render

## Phase 6: Verification and Handoff [ ]

- [ ] Verify all 4 templates render correctly with their respective asset styles
- [ ] Run full test suite — all 340+ tests pass
- [ ] Run `next lint` — no errors
- [ ] Verify template switching doesn't cause memory leaks (old canvas cleanup)
- [ ] Document template creation guide for future styles
- [ ] Handoff
