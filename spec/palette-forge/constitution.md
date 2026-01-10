# Palette Forge (CES) Constitution

## Purpose

Creative Effectiveness System (CES) - the creative intelligence layer for TBWA's multi-repo architecture.

## Non-Negotiables

### Data Plane Architecture

- **Supabase is the shared data plane** across all repos
- Schema boundaries are strictly enforced:
  - `ces.*` - Creative Effectiveness System (this repo owns)
  - `scout.*` - Retail/field analytics (tbwa-agency-databank owns)
  - `ops.*` - Jobs, audit, agent schedules (shared)
  - `marketing.*` - Campaign entities (shared, this repo primary)
  - `semantic.*` - Vector embeddings (shared)

### Write Policies

- No direct client-side writes to Odoo
- All Odoo writes go through server-side functions (Edge Functions or API routes)
- Client writes to Supabase are RLS-protected

### Score Immutability

Every CES score record MUST include:
- `model_version` - which ML model produced the score
- `feature_version` - which feature extraction version was used
- `confidence` - model confidence interval
- `computed_at` - immutable timestamp
- `run_id` - links to ops.runs for audit trail

### Asset Identity

- Every asset MUST have immutable `asset_id` (UUID)
- Content hash required for deduplication
- Version history preserved (never delete, only supersede)

## Interfaces

### CES UI (this repo)

- Reads/writes: `ces.*`, `marketing.*` via RPC (preferred) or RLS-protected tables
- Real-time subscriptions via Supabase Realtime

### Scout Integration

- Cross-link via: `campaign_id`, `asset_id`, `exposure_id`
- Scout reads `ces.scores` for attribution overlays
- CES reads `scout.transactions` for performance correlation

### Odoo Integration

Server-side only via:
- JSON-RPC for read/write operations
- Outbound webhooks from Odoo -> Supabase for event sync
- Never expose Odoo credentials to client

## Deployment Rules

### Vercel

- UI runtime (SPA)
- Environment variables with `VITE_` prefix
- No serverless functions in this repo (use Edge Functions)

### Supabase

- Migrations live in `/supabase/migrations/`
- This repo owns `ces.*` schema
- Shared schemas (`ops.*`, `marketing.*`) require coordination

### Environment Variables

Required public vars (with `VITE_` prefix):
```
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
VITE_MCP_HTTP_URL
```

Optional:
```
VITE_ENABLE_WEBSOCKET
VITE_LOG_LEVEL
VITE_SENTRY_DSN
```

## Repo Boundaries

| Repo | Primary Schemas | Role |
|------|----------------|------|
| tbwa-lions-palette-forge | `ces.*`, `marketing.*` | Creative effectiveness UI + scoring |
| tbwa-agency-databank | `scout.*` | Retail analytics + gold RPC |
| odoo-ce | N/A (operational DB) | ERP source of truth |

## Security

- RLS enabled on all tables
- Workspace-level isolation
- Audit logging for all score computations
- No secrets in client bundle
