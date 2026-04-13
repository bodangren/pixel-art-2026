# Specification - Automated Technical Validation (Scoring Engine)

## Summary
Develop a validation tool to automatically verify if generated assets meet technical specs and score them against a defined rubric.

## Goals
- Validate pixel art assets against technical specifications
- Support automated scoring based on defined criteria
- Generate validation reports in JSON format
- Integrate with existing benchmark infrastructure

## Technical Requirements

### Asset Validation Criteria
1. **Dimensions**: Assets must have correct pixel dimensions per type
   - 3x3 sprite sheets: 96x96 pixels (3 frames x 32px, or configurable)
   - Background: 512x512 or 256x256 (configurable)
   
2. **Grid Alignment**: 3x3 sheets must have proper 3x3 grid layout
   - Each sprite cell must be equal size
   - Sprites must be evenly distributed

3. **Transparent Background**: 
   - Alpha channel must be present and functional
   - Background pixels should be transparent (alpha = 0)

4. **Color Palette Validation**:
   - Adherence to specified hex codes
   - Maximum color count limits
   - Palette validation for pixel art constraints

### Scoring Rubric
- `dimensions_correct`: boolean
- `grid_alignment_valid`: boolean  
- `has_transparency`: boolean
- `palette_valid`: boolean
- `overall_score`: 0-100 weighted calculation

### Output Format
```json
{
  "run_id": "string",
  "validation_timestamp": "ISO8601",
  "assets": {
    "background.png": {
      "dimensions": { "width": number, "height": number },
      "has_transparency": boolean,
      "palette": string[],
      "issues": string[],
      "score": number
    },
    "hero-3x3-sheet.png": {
      "dimensions": { "width": number, "height": number },
      "grid_cells": { "cols": number, "rows": number },
      "has_transparency": boolean,
      "palette": string[],
      "issues": string[],
      "score": number
    }
  },
  "overall_score": number,
  "passed": boolean
}
```

## Technical Constraints
- Use Python with Pillow for image processing
- Output validation reports as JSON
- CLI interface: `python scripts/validate-run.py <run-id>`
- Reuse existing run data structure from `data/runs/<run-id>/`