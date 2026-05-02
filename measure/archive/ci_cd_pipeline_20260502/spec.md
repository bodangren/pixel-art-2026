# Spec: CI/CD Pipeline Automation

## Problem
There is no automated CI/CD pipeline. Linting, testing, and builds must be run manually, increasing the risk of regressions reaching main and slowing down development velocity.

## Goal
Set up GitHub Actions workflows that automatically lint, test, build, and optionally deploy on every push and pull request.

## Requirements
1. **PR Checks Workflow:** On PR to main — run lint, typecheck, tests, and build. Block merge on failure.
2. **Main Branch Workflow:** On push to main — run full pipeline and deploy to Vercel (if configured).
3. **Caching:** Cache node_modules and Next.js build cache for faster runs.
4. **Matrix Testing:** Test on Node 20 and 22 to catch compatibility issues.
5. **Artifact Upload:** Upload test results and build output as artifacts for debugging.
6. **Status Badges:** Add CI status badge to README.

## Acceptance Criteria
- [ ] `.github/workflows/ci.yml` runs lint + test + build on PRs
- [ ] `.github/workflows/deploy.yml` runs on main push
- [ ] Node modules are cached between runs
- [ ] Workflows complete in under 5 minutes
- [ ] All 227+ existing tests pass in CI
- [ ] CI status badge visible in README
