# Palette Forge (CES) Product Requirements Document

## Overview

### Goal

Creative Effectiveness System (CES): Ingest creative assets, extract features, compute effectiveness scores, and connect results to retail outcomes in Scout and operational records in Odoo.

### Problem Statement

Creative teams lack quantitative feedback on asset performance until weeks after campaign launch. CES provides:
1. Pre-launch scoring based on feature analysis
2. Post-launch attribution to retail outcomes
3. Actionable recommendations for improvement

## Users

| Role | Needs |
|------|-------|
| **Creative Director** | Quick scores, comparison across assets, trend analysis |
| **Strategist** | Attribution to business outcomes, campaign-level insights |
| **Analyst** | Deep-dive into features, model explainability, export |
| **Ops** | Pipeline health, audit trails, job scheduling |

## Key Flows

### 1. Asset Ingestion

**Trigger**: Upload or link asset (image, video, document)

**Flow**:
1. Upload to Supabase Storage / provide URL
2. Create `ces.assets` record with metadata
3. Generate content hash for deduplication
4. Queue for feature extraction

### 2. Feature Extraction

**Trigger**: New asset in queue

**Flow**:
1. Dispatch to appropriate extractor (vision/audio/text)
2. Extract features using configured models
3. Store in `ces.asset_features` with model version
4. Update asset status to `features_ready`

### 3. Score Computation

**Trigger**: Features ready

**Flow**:
1. Load relevant features for asset
2. Apply scoring model (configurable per campaign type)
3. Generate breakdown by dimension:
   - Visual clarity
   - Brand alignment
   - Emotional resonance
   - Call-to-action strength
   - Platform fit
4. Store in `ces.scores` with confidence intervals
5. Update asset status to `scored`

### 4. Attribution

**Trigger**: Campaign goes live + retail data available

**Flow**:
1. Link asset to campaign exposures (`ces.exposures`)
2. Join to Scout transactions via exposure windows
3. Compute attribution metrics:
   - Lift vs. control
   - Correlation to basket composition
   - Time-to-conversion impact
4. Update `ces.scores` with attribution overlay

### 5. Recommendations

**Trigger**: Score computed or attribution updated

**Flow**:
1. Analyze score breakdown for improvement areas
2. Compare to high-performing assets in same category
3. Generate prioritized recommendations
4. Store in `ces.recommendations` with expected impact

### 6. Export

**Formats**: JSON, CSV, PDF report, dashboard embed

**Contents**:
- Asset metadata
- Feature summary
- Score breakdown
- Attribution results
- Recommendations

## Data Surfaces

### Core CES Tables

| Table | Purpose |
|-------|---------|
| `ces.assets` | Creative files + metadata + status |
| `ces.asset_features` | Extracted features per model version |
| `ces.scores` | CES score breakdown + confidence |
| `ces.score_dimensions` | Dimension definitions (clarity, alignment, etc.) |
| `ces.models` | Model registry with versions |
| `ces.exposures` | When/where asset shown |
| `ces.recommendations` | Prioritized improvement actions |
| `ces.runs` | Pipeline execution audit |

### Existing Tables (from marketing_os migration)

| Table | Purpose |
|-------|---------|
| `marketing.campaigns` | Campaign entity |
| `marketing.creatives` | Creative assignments to campaigns |
| `marketing.assets` | Asset references |
| `marketing.performance_metrics` | Performance data |
| `ops.workspaces` | Multi-tenancy |
| `ces.conversations` | Ask CES chat history |

## Integrations

### Scout (tbwa-agency-databank)

- **Join fields**: `campaign_id`, `asset_id`, `exposure_id`
- **Use case**: Attribution overlay on transactions
- **Direction**: Scout reads CES scores, CES reads Scout outcomes

### Odoo (odoo-ce)

- **Entities**: `utm.campaign`, `ir.attachment`, `res.partner`
- **Use case**: Campaign sync, asset registry, customer correlation
- **Direction**: Server-side JSON-RPC (no client access)

## Non-Functional Requirements

### Determinism

- All pipelines must be idempotent
- Re-running extraction with same input = same features
- Scores are immutable once computed (create new version instead)

### Auditability

- Every run logged in `ces.runs` or `ops.runs`
- Model version + feature version tracked per score
- User actions logged with workspace context

### Multi-tenancy

- RLS enforced by `workspace_id`
- Strict isolation between tenants
- Cross-workspace queries require explicit permission

### Performance

- Score computation < 30s for single asset
- Batch processing support for bulk ingestion
- Real-time updates via Supabase Realtime

## Success Metrics

| Metric | Target |
|--------|--------|
| Time from upload to score | < 2 minutes |
| Score accuracy vs. post-launch performance | > 70% correlation |
| User adoption (weekly active) | > 80% of creative team |
| Attribution coverage | > 60% of campaigns |
