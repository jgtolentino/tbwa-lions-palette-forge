# Marketing OS Constitution

## Non-negotiables

### Tenant Isolation
- **Tenant boundary = workspace_id** for all domain rows
- No cross-workspace data leakage under any circumstances
- RLS enforced on all tables; no bypass in app code

### Event Integrity
- Every async action produces an immutable event trail
- Events are append-only; no updates or deletes
- All events include workspace_id, timestamp, and actor

### Idempotency
- Idempotent operations for sends and analysis jobs
- Duplicate sends prevented via idempotency_key
- Analysis jobs deduplicated by asset_id + status

### Security
- All credentials encrypted at rest
- API keys rotated quarterly minimum
- Audit trail for all admin actions

## Quality Gates

### Empty States
- No empty states in production pages: always show helpful fallback + CTA
- Skeleton loaders for async operations
- Error boundaries with actionable recovery

### Filter Integrity
- No broken filters: date/industry/channel must round-trip correctly
- URL state preserved on navigation
- Clear all / reset filters always available

### Accessibility
- Every chart has: label, units, tooltip, and accessible alt text
- WCAG 2.1 AA compliance minimum
- Keyboard navigation for all interactive elements

### Job Reliability
- Every job has: queued/running/succeeded/failed + retry policy
- Exponential backoff for retries
- Dead letter queue for permanent failures

## AI Agent Principles

### AdsBot (Campaign Operations)
- Never double-send to same contact within 24 hours
- Respect quiet hours and contact preferences
- Log all send decisions with reasoning

### Marian (Creative & Copy)
- Always preserve brand voice score > 0.7
- Generate minimum 3 variants for A/B testing
- Flag potentially problematic content

### Echo (Signal & Triggering)
- Process events within 5 seconds
- Idempotent trigger evaluation
- Grace period for late-arriving events

### CESAI (Effectiveness & ROI)
- Confidence thresholds for predictions (minimum 0.6)
- Benchmark comparisons always include sample size
- Clear methodology documentation for scores

### TestSprite (QA & Experiments)
- Minimum sample size before declaring significance
- Automatic experiment termination on clear winners
- Link validation before every send

## Marketplace Requirements

### Data Portability
- Full data export in standard formats (CSV, JSON)
- API access for all data with proper pagination
- No vendor lock-in on core campaign data

### Integration Standards
- Webhook support for all major events
- OAuth 2.0 for third-party integrations
- Rate limiting with clear documentation

### Compliance
- GDPR data subject rights support
- Audit log retention minimum 2 years
- Data residency options documented
