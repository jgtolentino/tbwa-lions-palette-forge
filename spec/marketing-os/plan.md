# Plan - Marketing OS Implementation

## Phase 1: Data Layer

### 1.1 Schema Setup
- [x] Apply Supabase migration (`202601090211_marketing_os.sql`)
- [x] Verify all schemas exist (ops, marketing, ces, semantic)
- [x] Verify all tables, indexes, and constraints
- [x] Confirm RLS policies active

### 1.2 Seed Data
- [ ] Create demo workspace
- [ ] Add workspace members with roles
- [ ] Seed sample campaigns (10 campaigns)
- [ ] Seed sample assets and creatives
- [ ] Seed analysis results with CES scores
- [ ] Verify benchmark data loaded

## Phase 2: API Layer

### 2.1 Semantic RPCs
- [ ] Implement `get_dashboard_kpis` client wrapper
- [ ] Implement `get_recent_campaigns` client wrapper
- [ ] Implement `get_campaign_detail` client wrapper
- [ ] Add TypeScript types for RPC responses

### 2.2 CRUD Operations
- [ ] Campaign create/update/delete
- [ ] Creative create/update/delete
- [ ] Asset upload and management
- [ ] Audience segment builder

### 2.3 Real-time Subscriptions
- [ ] Campaign status changes
- [ ] Analysis job updates
- [ ] Event stream for dashboard

## Phase 3: Analysis Jobs

### 3.1 Job Queue
- [ ] Create Edge Function for job processor
- [ ] Implement job status state machine
- [ ] Add retry logic with exponential backoff
- [ ] Dead letter queue for failures

### 3.2 Analysis Pipeline
- [ ] Video frame extraction
- [ ] AI model integration (OpenAI/Anthropic)
- [ ] Feature extraction and scoring
- [ ] Results writeback to `ces.analysis_results`

### 3.3 Monitoring
- [ ] Job queue metrics dashboard
- [ ] Error alerting
- [ ] Performance tracking

## Phase 4: UI Wiring

### 4.1 Dashboard
- [ ] KPI cards with live data
- [ ] CES distribution chart
- [ ] Performance trends line chart
- [ ] Channel mix pie chart
- [ ] Recent campaigns table

### 4.2 Video Analysis
- [ ] File upload component
- [ ] URL input and validation
- [ ] Job queue display with polling
- [ ] Results visualization
- [ ] Recommendation cards

### 4.3 Ask CES
- [ ] Chat interface with streaming
- [ ] Citation rendering
- [ ] Insight cards
- [ ] Saved queries management

### 4.4 State Management
- [ ] Time filter global state
- [ ] Industry/channel filter sync
- [ ] URL state persistence

## Phase 5: AI Agents

### 5.1 Service Integration
- [ ] AdsBot service connection
- [ ] Marian service connection
- [ ] Echo event processing
- [ ] CESAI scoring pipeline
- [ ] TestSprite validation

### 5.2 Agent Orchestration
- [ ] Agent selection logic
- [ ] Context passing
- [ ] Response aggregation
- [ ] Error handling

## Phase 6: Release Readiness

### 6.1 Testing
- [ ] Unit tests for services
- [ ] Integration tests for RPCs
- [ ] E2E tests for critical flows
- [ ] RLS verification tests

### 6.2 Performance
- [ ] Load testing dashboard
- [ ] Query optimization review
- [ ] Asset CDN configuration
- [ ] Cache strategy

### 6.3 Documentation
- [ ] API documentation
- [ ] User guide
- [ ] Admin guide
- [ ] Runbook

### 6.4 Deployment
- [ ] Staging environment validation
- [ ] Production migration plan
- [ ] Rollback procedures
- [ ] Monitoring dashboards

## Dependencies

| Dependency | Status | Notes |
|------------|--------|-------|
| Supabase project | Required | Database + Auth + Storage |
| OpenAI API | Optional | For video analysis |
| Anthropic API | Optional | For chat interface |
| Vercel Edge | Optional | For job processing |

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Analysis job timeouts | High | Implement chunked processing |
| RLS performance | Medium | Optimize membership queries |
| AI API rate limits | Medium | Implement request queuing |
| Data migration failures | High | Thorough staging testing |
