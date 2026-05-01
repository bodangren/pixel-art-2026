# Spec: Accessibility Audit (WCAG 2.1 AA)

## Problem
The review and benchmark interfaces have not been audited for accessibility. Evaluators using screen readers or keyboard navigation cannot effectively use the tool, limiting the audience and potentially violating compliance requirements.

## Goal
Audit the entire UI for WCAG 2.1 AA compliance and fix all critical and high-severity issues to ensure the tool is usable by people with disabilities.

## Requirements
1. **Keyboard Navigation:** All interactive elements (buttons, sliders, tabs, filters) must be keyboard accessible with visible focus indicators.
2. **Screen Reader Support:** Proper ARIA labels, roles, and live regions for dynamic content (scores, animations, comparisons).
3. **Color Contrast:** All text meets 4.5:1 contrast ratio; large text meets 3:1.
4. **Image Alt Text:** All sprite/asset images have descriptive alt text.
5. **Form Controls:** All inputs have associated labels; error messages are announced.
6. **Motion:** Respect `prefers-reduced-motion` for sprite animations.

## Acceptance Criteria
- [ ] axe-core automated audit passes with 0 critical violations
- [ ] All interactive elements keyboard-navigable with visible focus
- [ ] Screen reader testing confirms readable content flow
- [ ] Color contrast ratios meet WCAG AA thresholds
- [ ] All images have alt text
- [ ] Reduced motion preference disables sprite animation auto-play
- [ ] All 227+ existing tests still pass
- [ ] New tests cover ARIA attributes and keyboard interaction patterns
