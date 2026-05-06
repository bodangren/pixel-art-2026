# Implementation Plan: Public Deployment Pipeline

## Phase 1: GitHub Actions Workflow
- [x] Task: Create deploy.yml
  - [x] Write tests for build script (if any)
  - [x] Workflow triggers on push to main
  - [x] Install dependencies, run tests, run next export
  - [x] Deploy out/ directory to GitHub Pages

## Phase 2: Static Export Fixes
- [x] Task: Fix asset paths for static hosting
  - [x] Write tests for asset URL resolution
  - [x] Ensure next.config.js has correct basePath or assetPrefix
  - [x] Verify all images load from Pages URL
- [x] Task: Add README badge
  - [x] Deployment status badge
  - [x] Link to public benchmark URL

## Phase 3: Verification
- [ ] Task: Manual verification
  - [ ] Push to main, verify deployment succeeds
  - [ ] Check all pages render correctly on public URL
  - [ ] Verify leaderboard data loads from static JSON
