# Implementation Plan: Multi-Genre/Style Expansion

## Phase 1: Reference Asset Library Setup

### Tasks

- [ ] Create reference asset directory structure (`assets/references/{rpg,isometric,scifi,ui,font}/`)
- [ ] Write unit tests for reference asset loader (`tests/test_reference_assets.py`)
- [ ] Implement reference asset loader (`assets/reference_loader.py`)
- [ ] Create style metadata schema (`assets/style_metadata.py`)
- [ ] Add 3 reference assets per style category (placeholder 1x1 transparent PNGs for now)
- [ ] Verify: All tests pass

## Phase 2: Validation Engine Style Support

### Tasks

- [ ] Write tests for style-specific validation (`tests/test_style_validation.py`)
- [ ] Update validate_asset.py to accept `--style` parameter
- [ ] Implement style-specific rule sets (color palette, dimensions, alignment)
- [ ] Create scoring algorithms per style
- [ ] Verify: Existing validation tests + new style tests pass

## Phase 3: Benchmark Dashboard Style Filtering

### Tasks

- [ ] Write tests for style filter component (`tests/dashboard/test_style_filter.py`)
- [ ] Add style filter dropdown to dashboard
- [ ] Implement style-filtered asset display
- [ ] Create style reference gallery panel with hover zoom
- [ ] Verify: Dashboard tests pass, no console errors

## Phase 4: Batch Pipeline Style Support

### Tasks

- [ ] Write tests for style-aware batch config (`tests/batch/test_style_config.py`)
- [ ] Add style presets to BatchConfig schema
- [ ] Update batch generation to include style in prompt generation
- [ ] Add per-style statistics tracking to batch results
- [ ] Verify: Batch pipeline tests pass

## Phase 5: Integration & Documentation

### Tasks

- [ ] Run full test suite
- [ ] Update README with new style categories
- [ ] Update index.md with style reference paths
- [ ] Final verification: build succeeds, all tests green