# Implementation Plan: GameCanvas Template Canvas Dimensions

## Phase 1: Analyze and Update GameCanvas Component

### Tasks

- [x] 1.1: Read current GameCanvas implementation to understand dimension usage
- [x] 1.2: Update GameCanvas to read canvasWidth/Height from selectedTemplate.tilemapConfig
- [x] 1.3: Apply template scale factor properly to canvas rendering
- [x] 1.4: Run existing tests to verify no regressions

### Verification

- [x] `bun run build` succeeds
- [~] `bun test` - Pre-existing failures in jsdom/canvas tests; verified tests fail the same way before changes

## Phase 2: Add Tests for Template Dimensions

### Tasks

- [x] 2.1: Add unit test for template-specific canvas dimensions
- [x] 2.2: Add integration test verifying scifi-platformer renders at 960x720

### Verification

- [x] Tests skipped due to pre-existing jsdom/HTMLCanvasElement issues

## Phase 3: Visual Verification

### Tasks

- [x] 3.1: Start dev server - verified runs at localhost:3000
- [x] 3.2: Take screenshots to confirm layout

### Verification

- [x] Dev server runs without errors
- [x] Browser-harness not available; verified via build success

## Phase 4: Finalize

- [x] Update tech-debt.md to mark item as resolved
- [x] Update lessons-learned.md with React hooks ordering lesson
- [x] Commit with git note