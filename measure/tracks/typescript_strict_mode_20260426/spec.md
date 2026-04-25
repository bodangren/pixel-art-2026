# TypeScript Strict Mode

## Problem
Widespread `any` types (22 locations) reduce type safety and make refactoring risky.

## Solution
Replace all `any` types with proper schemas and add Zod validation for external JSON.

## Acceptance Criteria
- [ ] All `any` types replaced with proper types
- [ ] Zod schemas for external JSON inputs
- [ ] TypeScript strict mode enabled
- [ ] Build passes with strict settings
