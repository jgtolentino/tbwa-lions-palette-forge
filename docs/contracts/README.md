# Schema Contracts

This directory contains semantic contract definitions for the multi-repo architecture:

- **tbwa-lions-palette-forge** (CES) - Creative Effectiveness System
- **tbwa-agency-databank** (Scout) - Retail/Field Analytics
- **odoo-ce** - Operational ERP

## Contract Files

| File | Purpose |
|------|---------|
| `ces.semantic.yaml` | CES schema definitions |
| `scout.semantic.yaml` | Scout schema definitions (for reference) |
| `entities.shared.yaml` | Shared entities across systems |
| `rls.rules.md` | Row-Level Security policies |

## Supabase Schema Boundaries

```
┌─────────────────────────────────────────────────────────────┐
│                    Supabase Project                         │
├─────────────────────────────────────────────────────────────┤
│  ces.*           │ Owned by: tbwa-lions-palette-forge       │
│  - assets        │ Creative assets + metadata               │
│  - asset_features│ Extracted features per model             │
│  - scores        │ CES scores + breakdown                   │
│  - exposures     │ When/where asset shown                   │
│  - recommendations│ Improvement actions                     │
├──────────────────┼──────────────────────────────────────────┤
│  scout.*         │ Owned by: tbwa-agency-databank           │
│  - transactions  │ Retail transactions                      │
│  - stores        │ Store locations                          │
│  - customers     │ Anonymized customer data                 │
│  - attributions  │ Campaign attribution                     │
├──────────────────┼──────────────────────────────────────────┤
│  marketing.*     │ Shared (CES primary)                     │
│  - campaigns     │ Campaign entities                        │
│  - creatives     │ Creative assignments                     │
│  - assets        │ Asset references                         │
├──────────────────┼──────────────────────────────────────────┤
│  ops.*           │ Shared                                   │
│  - workspaces    │ Multi-tenancy                            │
│  - runs          │ Pipeline executions                      │
│  - audit_events  │ Audit trail                              │
├──────────────────┼──────────────────────────────────────────┤
│  semantic.*      │ Shared                                   │
│  - embeddings    │ Vector embeddings for search             │
└──────────────────┴──────────────────────────────────────────┘
```

## Join Contract (CES ↔ Scout)

The integration between CES and Scout is achieved through join fields:

```yaml
# In scout.transactions
campaign_id: UUID  # Links to marketing.campaigns
asset_id: UUID     # Links to ces.assets
exposure_id: UUID  # Links to ces.exposures
```

This enables:
- Attribution analysis: "Which assets drove which transactions?"
- Performance correlation: "Do high CES scores correlate with better retail outcomes?"
- Campaign optimization: "What creative elements work best for this audience?"

## TypeScript Contracts

The TypeScript implementations of these contracts live in:
```
packages/contracts/src/
├── index.ts      # Re-exports
├── shared.ts     # Shared entities
├── ces.ts        # CES types
└── scout.ts      # Scout types (for reference)
```

Install and use:
```typescript
import { Campaign, Asset, Score } from '@tbwa/contracts';
import { Transaction, Attribution } from '@tbwa/contracts/scout';
import { AssetFeature, Recommendation } from '@tbwa/contracts/ces';
```
