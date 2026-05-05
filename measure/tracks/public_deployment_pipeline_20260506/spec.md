# Track: Public Deployment Pipeline

## Overview
Set up GitHub Actions to deploy the static benchmark dashboard to GitHub Pages or Vercel on every push to main.

## Goals
- Automated deployment on push to main
- Static export (next export) deployed correctly
- Public URL for sharing benchmark results

## Acceptance Criteria
- [ ] GitHub Actions workflow builds and deploys on push to main
- [ ] next export output deployed to GitHub Pages
- [ ] Asset paths work correctly from Pages root
- [ ] Deployment status badge in README
- [ ] Tests verify build succeeds in CI

## Non-Goals
- Custom domain setup
- Preview deployments for PRs
