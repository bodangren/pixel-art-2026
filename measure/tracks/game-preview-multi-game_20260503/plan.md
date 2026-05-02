# Plan: Multi-Game Preview Expansion

## Phase 1: Template Registry and Types [ ]

- [ ] Write test: GameTemplate type has required fields (id, name, genre, spriteSlots, tilemapConfig)
- [ ] Write test: registry.getTemplate("labyrinth") returns the existing game config
- [ ] Define `GameTemplate` interface with id, name, genre, spriteSlots, tilemapConfig, renderConfig
- [ ] Create `lib/game-templates.ts` with template registry
- [ ] Migrate existing Labyrinth config into registry format

## Phase 2: RPG Town Template [ ]

- [ ] Write test: RPG town template renders with hero, NPC, and building sprites
- [ ] Define RPG town tilemap (grass, paths, buildings, trees)
- [ ] Map sprite slots: hero → character, npc → character, building → structure, tree → scenery
- [ ] Implement minimal top-down render logic (tile grid + sprite overlay)
- [ ] Test with existing asset packs that have character sprites

## Phase 3: Isometric City Template [ ]

- [ ] Write test: isometric template renders with correct diamond-shaped tiles
- [ ] Define isometric tilemap (ground tiles, building footprints, roads)
- [ ] Map sprite slots: building → structure, ground → terrain, vehicle → prop
- [ ] Implement isometric projection math (diamond tile rendering)
- [ ] Test with isometric style assets from multi-genre expansion

## Phase 4: Sci-Fi Platformer Template [ ]

- [ ] Write test: platformer template renders platforms and character sprites
- [ ] Define side-scrolling tilemap (platforms, background, enemies)
- [ ] Map sprite slots: hero → character, enemy → creature, platform → terrain, background → scenery
- [ ] Implement simple parallax background rendering
- [ ] Test with sci-fi style assets

## Phase 5: Template Selector UI [ ]

- [ ] Write test: template selector dropdown renders on game preview page
- [ ] Write test: selecting a template re-renders the canvas with new config
- [ ] Add template selector to dynamic game preview page
- [ ] Persist selected template in URL search params
- [ ] Wire template selection to GameCanvas re-render

## Phase 6: Verification and Handoff [ ]

- [ ] Verify all 4 templates render correctly with their respective asset styles
- [ ] Run full test suite — all 340+ tests pass
- [ ] Run `next lint` — no errors
- [ ] Verify template switching doesn't cause memory leaks (old canvas cleanup)
- [ ] Document template creation guide for future styles
- [ ] Handoff
