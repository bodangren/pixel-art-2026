# Implementation Plan: Public Deployment Pipeline

## Phase 1: GitHub Actions Workflow
- [ ] Task: Create deploy.yml
  - [ ] Write tests for build script (if any)
  - [ ] Workflow triggers on push to main
  - [ ] Install dependencies, run tests, run next export
  - [ ] Deploy out/ directory to GitHub Pages

## Phase 2: Static Export Fixes
- [ ] Task: Fix asset paths for static hosting
  - [ ] Write tests for asset URL resolution
  - [ ] Ensure next.config.js has correct basePath or assetPrefix
  - [ ] Verify all images load from Pages URL
- [ ] Task: Add README badge
  - [ ] Deployment status badge
  - [ ] Link to public benchmark URL

## Phase 3: Verification
- [ ] Task: Manual verification
  - [ ] Push to main, verify deployment succeeds
  - [ ] Check all pages render correctly on public URL
  - [ ] Verify leaderboard data loads from static JSON
