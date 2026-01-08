# Tasks - Marketing OS

## Immediate (Sprint 1)

- [x] Create semantic contract YAML (`specs/marketing_os_semantic_contract.yaml`)
- [x] Create TypeScript types (`src/types/marketing-os.ts`)
- [x] Create AI agent services (`src/services/marketing-os-agents.ts`)
- [x] Apply Supabase migration
- [ ] Verify schemas/tables/views/rpcs exist in database
- [ ] Implement Supabase client DAL with typed RPC wrappers

## Data Layer (Sprint 2)

- [ ] Create `useMarketingDashboard` hook
- [ ] Create `useCampaigns` hook with CRUD
- [ ] Create `useAnalysisJobs` hook with status polling
- [ ] Create `useCESAnalysis` hook
- [ ] Add seed script for demo workspace
- [ ] Add CI checks: migration lint + RLS enforcement

## Analysis Pipeline (Sprint 3)

- [ ] Build analysis worker (Edge Function)
- [ ] Implement video frame extraction
- [ ] Integrate AI models for analysis
- [ ] Implement results writeback
- [ ] Add job retry logic
- [ ] Add dead letter queue handling

## Dashboard UI (Sprint 4)

- [ ] Wire dashboard KPI cards to real queries
- [ ] Implement CES distribution chart
- [ ] Implement performance trends chart
- [ ] Wire recent campaigns table
- [ ] Add time filter functionality
- [ ] Add industry/channel filters
- [ ] Add empty-state fallbacks
- [ ] Add skeleton loaders

## Video Analysis UI (Sprint 5)

- [ ] Implement file upload component
- [ ] Implement URL input with validation
- [ ] Display job queue with polling
- [ ] Render analysis results
- [ ] Display scene breakdown
- [ ] Display feature importance
- [ ] Display recommendations

## Ask CES UI (Sprint 6)

- [ ] Implement chat interface
- [ ] Add streaming response support
- [ ] Render citations inline
- [ ] Implement insight cards
- [ ] Implement saved queries
- [ ] Add creative tools panel
- [ ] Add audience segmentation builder

## AI Agent Integration (Sprint 7)

- [ ] Wire AdsBot for campaign operations
- [ ] Wire Marian for creative generation
- [ ] Wire Echo for event processing
- [ ] Wire CESAI for effectiveness scoring
- [ ] Wire TestSprite for validation
- [ ] Implement agent orchestrator UI

## Testing & QA (Sprint 8)

- [ ] Write unit tests for agent services
- [ ] Write integration tests for RPCs
- [ ] Write E2E tests for dashboard
- [ ] Write E2E tests for video analysis
- [ ] Write E2E tests for Ask CES
- [ ] Verify RLS policies work correctly
- [ ] Performance testing

## Documentation (Sprint 9)

- [ ] Write API documentation
- [ ] Write user guide
- [ ] Write admin configuration guide
- [ ] Create runbook for operations
- [ ] Record demo video

## Production Readiness (Sprint 10)

- [ ] Complete staging environment validation
- [ ] Finalize production migration plan
- [ ] Document rollback procedures
- [ ] Set up monitoring dashboards
- [ ] Configure alerting
- [ ] Load test production environment
- [ ] Security review
- [ ] Go-live checklist completion

## Backlog

- [ ] Add A/B experiment creation UI
- [ ] Add journey builder visual editor
- [ ] Add connector management UI
- [ ] Add export to PDF/CSV functionality
- [ ] Add share link generation
- [ ] Add email notification preferences
- [ ] Add Slack integration
- [ ] Add webhook configuration UI
- [ ] Add custom benchmark uploads
- [ ] Add competitive analysis features
