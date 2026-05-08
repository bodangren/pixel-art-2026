# Spec: Benchmark Alert System

## Goal
Notify users when benchmark runs complete, when model scores regress significantly, or when a run fails validation.

## Acceptance Criteria
- [ ] Alert rules engine: define thresholds for score regression (>5% drop), run failure, completion
- [ ] Webhook and email alert transports (pluggable)
- [ ] Alert history page in the dashboard
- [ ] Per-model alert subscription settings
- [ ] Alerts triggered automatically after each run completion

## Out of Scope
- SMS or push notifications
- Alert deduplication beyond simple rate limiting
