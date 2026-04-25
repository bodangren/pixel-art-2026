# TypeScript Strict Mode — Implementation Plan

## Phase 1: Audit `any` Types [ ]
- [ ] List all 22 `any` type locations
- [ ] Categorize by root cause (missing types, lazy typing, etc.)
- [ ] Design proper types for each

## Phase 2: Replace Types [ ]
- [ ] Replace `any` in API response handlers
- [ ] Replace `any` in component props
- [ ] Replace `any` in utility functions
- [ ] Add Zod schemas for external JSON

## Phase 3: Enable Strict Mode [ ]
- [ ] Enable `strict: true` in tsconfig
- [ ] Fix any remaining type errors
- [ ] Run full build and test suite
