# Plan: CI/CD Pipeline Automation

## Phase 1: PR Checks Workflow (TDD)
- [ ] Write a workflow validation test — YAML parses correctly, required jobs exist
- [ ] Create `.github/workflows/ci.yml` with lint, typecheck, test, build jobs
- [ ] Configure Node 20 as primary, Node 22 as secondary in matrix
- [ ] Add caching for node_modules and .next/cache
- [ ] Verify workflow YAML is valid using `act` or manual review
- [ ] Verify all tests pass locally before committing

## Phase 2: Deploy Workflow
- [ ] Write workflow validation test — deploy job only runs on main
- [ ] Create `.github/workflows/deploy.yml` triggered on push to main
- [ ] Add Vercel deployment step (using vercel CLI or Vercel GitHub Action)
- [ ] Add environment protection rules for production
- [ ] Verify workflow YAML is valid

## Phase 3: README Integration
- [ ] Add CI status badge to top of README.md
- [ ] Add deploy status badge linking to Vercel dashboard
- [ ] Document CI/CD setup in README for contributors

## Phase 4: Verification
- [ ] Push to a test branch and verify CI workflow triggers
- [ ] Open a test PR and verify checks appear and pass
- [ ] Confirm caching reduces subsequent run times
- [ ] Run full test suite locally — all 227+ tests must pass
