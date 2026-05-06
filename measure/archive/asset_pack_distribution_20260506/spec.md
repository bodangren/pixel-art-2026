# Track: Asset Pack Distribution (ZIP Downloads)

## Overview
Package validated PNGs from a run into downloadable ZIP files with README/credits for game developers.

## Goals
- ZIP generation endpoint per run
- Include all validated PNGs, README, and credits
- Direct download from benchmark UI

## Acceptance Criteria
- [ ] API endpoint generates ZIP from run assets
- [ ] ZIP contains README with model info and license notes
- [ ] Download button on run detail page
- [ ] Large runs stream ZIP without memory issues
- [ ] Tests cover ZIP structure and content

## Non-Goals
- Paid/licensing gating
- CDN hosting
