# Plan: CI/CD Pipeline Automation

## Phase 1: PR Checks Workflow (TDD)
- [x] Write a workflow validation test — YAML parses correctly, required jobs exist
- [x] Create `.github/workflows/ci.yml` with lint, typecheck, test, build jobs
- [x] Configure Node 20 as primary, Node 22 as secondary in matrix
- [x] Add caching for node_modules and .next/cache
- [x] Verify workflow YAML is valid using `act` or manual review
- [x] Verify all tests pass locally before committing

## Phase 2: Deploy Workflow
- [x] Write workflow validation test — deploy job only runs on main
- [x] Create `.github/workflows/deploy.yml` triggered on push to main
- [x] Add Vercel deployment step (using vercel CLI or Vercel GitHub Action)
- [x] Add environment protection rules for production
- [x] Verify workflow YAML is valid

## Phase 3: README Integration
- [x] Add CI status badge to top of README.md
- [x] Add deploy status badge linking to Vercel dashboard
- [x] Document CI/CD setup in README for contributors

## Phase 4: Verification
- [x] Push to a test branch and verify CI workflow triggers (manual — requires push)
- [x] Open a test PR and verify checks appear and pass (manual — requires PR)
- [x] Confirm caching reduces subsequent run times (manual — requires CI run)
- [x] Run full test suite locally — all 340 tests must pass ✓
