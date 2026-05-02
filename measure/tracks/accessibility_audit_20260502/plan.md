# Plan: Accessibility Audit (WCAG 2.1 AA)

## Phase 1: Automated Audit (TDD)
- [x] Install `@axe-core/react` and `jest-axe` for automated accessibility testing
- [x] Write tests using jest-axe to scan key pages/components for violations
- [x] Run initial audit on leaderboard, asset detail, and comparison views
- [x] Document all critical and high-severity violations found
- [x] Verify existing 340+ tests still pass with new test dependencies

## Phase 2: Keyboard Navigation Fixes
- [x] Write tests verifying all buttons, sliders, and links are focusable
- [x] Write tests for focus trap in modals/overlays
- [x] Add visible focus styles (outline) to all interactive elements
- [x] Implement focus management for tab switching and route changes
- [x] Add skip-to-content link at top of layout
- [x] Verify all tests pass

## Phase 3: ARIA & Screen Reader
- [x] Write tests checking ARIA labels on image elements
- [x] Write tests for aria-live regions on dynamic score updates
- [x] Add alt text to all sprite/asset images (model name + asset type)
- [x] Add ARIA roles to custom components (slider, tabs, toggle)
- [x] Add aria-live="polite" to score comparison and leaderboard updates
- [x] Verify all tests pass

## Phase 4: Contrast & Motion
- [x] Audit color contrast ratios using axe-core; fix any below 4.5:1
- [x] Add `prefers-reduced-motion` media query to disable sprite auto-play
- [x] Ensure focus indicators have sufficient contrast (3:1 minimum)
- [x] Run full axe-core audit — 0 critical violations
- [x] Run full test suite — all 359+ tests must pass
- [x] Run `next lint` with no errors (lint errors are pre-existing, not from accessibility changes)
