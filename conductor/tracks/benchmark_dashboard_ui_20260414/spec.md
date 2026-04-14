# Specification - Benchmark Dashboard & Comparison UI

## Summary
Replace the static README with an interactive web dashboard using Next.js. Features include pixel-level zooming, side-by-side comparison of sprites across models, and metadata visualization.

## Goals
- Provide interactive visualization of benchmark results
- Enable pixel-level inspection of generated assets
- Support side-by-side model comparison
- Display metadata and scoring information

## Functional Requirements

### Dashboard Features
1. **Asset Gallery View**
   - Grid display of all generated assets
   - Filter by model, run date, asset type
   - Sort by score, date, model name

2. **Pixel-Level Zoom**
   - Nearest-neighbor interpolation for crisp pixel art
   - Zoom controls (1x, 2x, 4x, 8x, max)
   - Pan functionality when zoomed

3. **Side-by-Side Comparison**
   - Select two assets from different models
   - Synchronized zoom and pan
   - Toggle transparency overlay

4. **Metadata Display**
   - Technical validation scores
   - Generation parameters
   - Run timestamps
   - Model information

### Data Integration
- Read from existing `data/runs/<run-id>/` structure
- Parse existing JSON validation reports
- Display sprite sheet grid breakdown

## Technical Stack
- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Existing validation pipeline output

## Acceptance Criteria
- [ ] Dashboard loads without errors
- [ ] Asset gallery displays all runs
- [ ] Pixel zoom renders with nearest-neighbor interpolation
- [ ] Comparison view shows two assets side-by-side
- [ ] Metadata panel shows validation scores
- [ ] Filters work correctly
- [ ] Responsive design for mobile viewing

## Out of Scope
- Backend API changes
- Database integration
- User authentication
- Export functionality