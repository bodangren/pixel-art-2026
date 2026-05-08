# Plan: Benchmark Alert System

## Phase 1: Alert Rules Engine (TDD)
- [x] Write tests for regression detection between consecutive runs
- [x] Write tests for run failure detection
- [x] Implement AlertRulesEngine with configurable thresholds

## Phase 2: Alert Storage & API (TDD)
- [x] Write tests for alert CRUD endpoints
- [x] Implement Alert model and API routes
- [x] Add alert subscription settings to user preferences

## Phase 3: Transport Layer (TDD)
- [x] Write tests for webhook delivery with retry
- [x] Implement WebhookTransport
- [x] Implement EmailTransport (nodemailer or fetch to external API)

## Phase 4: Frontend UI (TDD)
- [x] Write tests for AlertHistory component
- [x] Implement AlertHistory page with filter/sort
- [x] Add alert bell to navbar with unread count

## Phase 5: Integration & Verification
- [x] Trigger alert on synthetic regression and verify delivery
- [x] Update tracks.md and commit