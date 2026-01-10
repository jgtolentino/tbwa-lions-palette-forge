# Palette Forge (CES) Tasks

## Immediate (This Sprint)

### Infrastructure

- [x] Create spec kit bundle (constitution, prd, plan, tasks)
- [x] Set up packages/contracts structure
- [x] Add tolerant env loader for VITE_/VITE_PUBLIC_ prefixes
- [x] Create vercel.json with Vite configuration
- [ ] Connect Vercel project to Supabase integration

### Schema

- [ ] Add ces.assets extended fields (content_hash, status, version)
- [ ] Create ces.asset_features table
- [ ] Create ces.scores table with dimension breakdown
- [ ] Create ces.score_dimensions reference table
- [ ] Create ces.models registry table
- [ ] Create ces.exposures table
- [ ] Create ces.recommendations table
- [ ] Add RLS policies for all new tables

### Contracts

- [x] Create shared entity types (Campaign, Asset, Score)
- [x] Create CES-specific types
- [x] Create Scout integration types
- [x] Document schema contracts in YAML

## Short-Term (Next 2 Sprints)

### Asset Pipeline

- [ ] Implement asset upload component
- [ ] Integrate Supabase Storage
- [ ] Add content hash generation
- [ ] Create asset status state machine
- [ ] Build asset gallery view

### Scoring

- [ ] Create score computation Edge Function
- [ ] Implement score display component
- [ ] Add score history tracking
- [ ] Build score comparison UI
- [ ] Create score export (JSON, CSV)

### UI Enhancements

- [ ] Add campaign selector with CES context
- [ ] Create asset-to-campaign linking UI
- [ ] Build score dashboard widgets
- [ ] Implement real-time score updates

## Medium-Term (This Quarter)

### Feature Extraction

- [ ] Integrate vision API for image analysis
- [ ] Implement video frame sampling
- [ ] Add text feature extraction
- [ ] Create audio transcription pipeline
- [ ] Build feature visualization

### Scout Attribution

- [ ] Coordinate schema changes with tbwa-agency-databank
- [ ] Implement exposure tracking
- [ ] Create attribution computation functions
- [ ] Build attribution dashboards
- [ ] Add performance correlation views

### Odoo Integration

- [ ] Create Odoo JSON-RPC Edge Function
- [ ] Implement campaign sync
- [ ] Add asset registry sync
- [ ] Set up webhook receivers
- [ ] Build reconciliation jobs

## Long-Term (Next Quarter)

### Recommendations Engine

- [ ] Build recommendation algorithms
- [ ] Create recommendation UI
- [ ] Add action tracking
- [ ] Implement feedback loop

### Advanced Analytics

- [ ] A/B testing framework
- [ ] Predictive scoring
- [ ] Trend analysis
- [ ] Cohort comparison

### Platform Maturity

- [ ] Comprehensive monitoring
- [ ] Performance optimization
- [ ] Security audit
- [ ] User documentation

## Blocked / Waiting

| Task | Blocker | Owner |
|------|---------|-------|
| Scout join fields migration | Requires tbwa-agency-databank coordination | TBD |
| Odoo webhook setup | Requires odoo-ce addon | TBD |
| Vision API integration | Requires API key provisioning | TBD |

## Completed

- [x] Initial repo setup
- [x] Marketing OS schema migration
- [x] Basic UI with shadcn components
- [x] MCP integration configuration
- [x] Video analysis page
- [x] Campaign dashboard
- [x] Ask CES chat interface
