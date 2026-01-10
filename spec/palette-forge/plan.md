# Palette Forge (CES) Implementation Plan

## Phase 1: Foundations

### Database & Infrastructure

- [ ] Complete `ces.*` schema with full table set
  - `ces.assets` (extend existing)
  - `ces.asset_features` (new)
  - `ces.scores` (new)
  - `ces.score_dimensions` (new)
  - `ces.models` (new)
  - `ces.exposures` (new)
  - `ces.recommendations` (new)
- [ ] Add RLS policies for all new tables
- [ ] Create database functions for score computation
- [ ] Set up Supabase Storage buckets for assets

### Vercel Deployment

- [ ] Create `vercel.json` with Vite configuration
- [ ] Add tolerant env loader for `VITE_` / `VITE_PUBLIC_` prefixes
- [ ] Configure Supabase integration in Vercel dashboard
- [ ] Verify production build and deployment

### Asset Ingestion UI

- [ ] Create asset upload component
- [ ] Integrate with Supabase Storage
- [ ] Add drag-and-drop support
- [ ] Display upload progress and status
- [ ] Show asset preview and metadata

### Scoring Placeholder

- [ ] Create score display component
- [ ] Implement mock scoring for development
- [ ] Add score history view
- [ ] Create score comparison interface

## Phase 2: Feature Extraction

### Extractors

- [ ] Image feature extractor (vision API)
- [ ] Video feature extractor (frame sampling + vision)
- [ ] Text feature extractor (NLP/embeddings)
- [ ] Audio feature extractor (transcription + analysis)

### Model Registry

- [ ] Create `ces.models` table with version tracking
- [ ] Implement model selection per asset type
- [ ] Add model performance metrics
- [ ] Create model A/B testing framework

### Feature Storage

- [ ] Design feature schema for each modality
- [ ] Implement efficient feature retrieval
- [ ] Add feature versioning
- [ ] Create feature visualization components

## Phase 3: Attribution to Scout

### Exposure Modeling

- [ ] Create `ces.exposures` with temporal fields
- [ ] Define exposure windows per channel
- [ ] Link exposures to campaigns
- [ ] Add exposure aggregation views

### Scout Integration

- [ ] Add join fields to Scout schema:
  - `scout.transactions.campaign_id`
  - `scout.transactions.asset_id`
  - `scout.transactions.exposure_id`
- [ ] Create cross-database views (if same Supabase project)
- [ ] Implement attribution RPC functions
- [ ] Build attribution overlay components

### Performance Correlation

- [ ] Compute lift metrics
- [ ] Analyze basket composition impact
- [ ] Generate time-series correlation
- [ ] Create performance dashboards

## Phase 4: Odoo Sync

### Server-Side Bridge

- [ ] Create Edge Function for Odoo JSON-RPC
- [ ] Implement campaign sync (Odoo -> Supabase)
- [ ] Implement asset registry sync
- [ ] Add brand/product reference sync

### Webhook Handlers

- [ ] Set up Odoo outbound webhooks
- [ ] Create Supabase Edge Function receivers
- [ ] Implement event transformation
- [ ] Add error handling and retry logic

### Reconciliation

- [ ] Create reconciliation jobs
- [ ] Add drift detection
- [ ] Implement conflict resolution
- [ ] Build sync status dashboard

## Phase 5: Recommendations Engine

### Analysis

- [ ] Implement score breakdown analysis
- [ ] Create peer comparison algorithms
- [ ] Build improvement opportunity detection
- [ ] Add impact estimation models

### Presentation

- [ ] Create recommendations component
- [ ] Add priority visualization
- [ ] Implement action tracking
- [ ] Build feedback collection

## Phase 6: Production Hardening

### Monitoring

- [ ] Add Sentry error tracking
- [ ] Implement performance monitoring
- [ ] Create pipeline health dashboard
- [ ] Set up alerting

### Security

- [ ] Audit RLS policies
- [ ] Penetration testing
- [ ] Add rate limiting
- [ ] Implement input validation

### Documentation

- [ ] API documentation
- [ ] User guide
- [ ] Admin guide
- [ ] Runbook for operations

## Dependencies

### Cross-Repo Coordination

| Task | Dependent Repo | Blocker |
|------|----------------|---------|
| Scout join fields | tbwa-agency-databank | Requires schema migration |
| Odoo webhooks | odoo-ce | Requires addon development |
| Shared contracts | Both repos | Requires type sync |

### External Services

| Service | Purpose | Status |
|---------|---------|--------|
| Supabase | Database + Auth + Storage | Active |
| Vercel | Hosting | Pending setup |
| Vision API | Image analysis | TBD |
| Claude API | Text analysis | Active |
