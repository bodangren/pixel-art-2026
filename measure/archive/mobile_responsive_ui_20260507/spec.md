# Track: Mobile-Responsive Benchmark UI

## Overview
The benchmark app is currently desktop-optimized with fixed widths and hover-dependent interactions. This track makes the leaderboard, comparison view, run detail pages, and game preview usable on mobile phones and tablets, expanding the audience to game developers reviewing assets on-the-go.

## Goals
- Audit all pages for mobile usability issues
- Refactor layout components to use responsive Tailwind breakpoints
- Replace hover-only interactions (zoom, tooltips) with touch-friendly alternatives
- Ensure game preview canvas scales correctly on smaller viewports
- Maintain the existing obsidian/gold visual identity

## Acceptance Criteria
- [ ] All pages pass manual check at 375px, 768px, and 1440px widths
- [ ] Leaderboard table switches to card layout on mobile
- [ ] ComparisonView supports horizontal swipe to switch assets on touch devices
- [ ] GameCanvas scales with container width without distortion
- [ ] No horizontal scroll on any page below 768px
- [ ] Tests cover responsive breakpoints with resize simulation

## Non-Goals
- Native mobile app or PWA features
- Changing the desktop layout significantly
