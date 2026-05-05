# Track: Human Review Data Population Sprint

## Overview
Fix broken review persistence and systematically populate reviews for all existing model runs so the benchmark has scores to display.

## Goals
- Fix `/api/review` persistence (no API route exists)
- Populate review.json for all 16+ existing runs
- Ensure leaderboard and quality dashboard have data

## Acceptance Criteria
- [ ] API route for submitting reviews exists and persists to disk
- [ ] Review schema validates score, rubric, and notes
- [ ] All existing runs have at least one review or are flagged for re-run
- [ ] Leaderboard displays populated scores
- [ ] Tests cover review submission and retrieval

## Non-Goals
- Changing review rubric structure
- Automated review generation
