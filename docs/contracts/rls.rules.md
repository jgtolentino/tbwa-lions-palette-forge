# Row-Level Security (RLS) Policies

This document defines the RLS policies for multi-tenant isolation across all schemas.

## Core Principle

**Workspace Isolation**: Users can only access data belonging to workspaces where they are members.

## Policy Implementation

### Standard Workspace Isolation Policy

Applied to all tables with `workspace_id`:

```sql
CREATE POLICY workspace_isolation ON {table_name}
  FOR ALL
  USING (
    workspace_id IN (
      SELECT workspace_id
      FROM ops.workspace_members
      WHERE user_id = auth.uid()
    )
  );
```

### Nested Entity Policy

For tables without direct `workspace_id`, traverse through parent:

```sql
-- Example: ces.asset_features → ces.assets → workspace_id
CREATE POLICY via_asset ON ces.asset_features
  FOR ALL
  USING (
    asset_id IN (
      SELECT id FROM ces.assets
      WHERE workspace_id IN (
        SELECT workspace_id
        FROM ops.workspace_members
        WHERE user_id = auth.uid()
      )
    )
  );
```

## Schema-Specific Policies

### ops.* (Operational)

| Table | Policy | Notes |
|-------|--------|-------|
| `ops.workspaces` | Owner or member | Users see workspaces they belong to |
| `ops.workspace_members` | Same workspace | Members can see other members |
| `ops.runs` | Workspace isolation | Standard |
| `ops.audit_events` | Workspace isolation | Standard |

### ces.* (Creative Effectiveness)

| Table | Policy | Notes |
|-------|--------|-------|
| `ces.assets` | Workspace isolation | Standard |
| `ces.asset_features` | Via asset | Traverse to asset.workspace_id |
| `ces.scores` | Workspace isolation | Standard |
| `ces.score_dimensions` | Global or workspace | Global (null workspace_id) visible to all |
| `ces.models` | Global or workspace | Global visible to all |
| `ces.exposures` | Workspace isolation | Standard |
| `ces.recommendations` | Workspace isolation | Standard |
| `ces.runs` | Workspace isolation | Standard |

### marketing.* (Campaigns)

| Table | Policy | Notes |
|-------|--------|-------|
| `marketing.campaigns` | Workspace isolation | Standard |
| `marketing.creatives` | Via campaign | Traverse to campaign.workspace_id |
| `marketing.assets` | Workspace isolation | Standard |
| `marketing.performance_metrics` | Via campaign | Traverse to campaign.workspace_id |

### scout.* (Retail Analytics)

| Table | Policy | Notes |
|-------|--------|-------|
| `scout.transactions` | Workspace isolation | Standard |
| `scout.stores` | Workspace isolation | Standard |
| `scout.customers` | Workspace isolation | Standard |
| `scout.attributions` | Workspace isolation | Standard |

### semantic.* (Vector Search)

| Table | Policy | Notes |
|-------|--------|-------|
| `semantic.embeddings` | Workspace isolation | Standard |

## Role-Based Access Control (RBAC)

Within a workspace, roles control actions:

| Role | SELECT | INSERT | UPDATE | DELETE |
|------|--------|--------|--------|--------|
| `owner` | ✓ | ✓ | ✓ | ✓ |
| `admin` | ✓ | ✓ | ✓ | Limited |
| `analyst` | ✓ | ✓ | Limited | ✗ |
| `viewer` | ✓ | ✗ | ✗ | ✗ |

### Role Enforcement

```sql
-- Example: Only owners/admins can delete
CREATE POLICY admin_delete ON ces.assets
  FOR DELETE
  USING (
    workspace_id IN (
      SELECT workspace_id
      FROM ops.workspace_members
      WHERE user_id = auth.uid()
        AND role IN ('owner', 'admin')
    )
  );
```

## Immutable Tables

Some tables should not allow updates:

```sql
-- ces.scores are immutable (create new version instead)
CREATE POLICY scores_insert_only ON ces.scores
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY scores_select ON ces.scores
  FOR SELECT
  USING (
    workspace_id IN (
      SELECT workspace_id
      FROM ops.workspace_members
      WHERE user_id = auth.uid()
    )
  );

-- No UPDATE or DELETE policies = effectively immutable
```

## Service Role Bypass

Edge Functions with service role bypass RLS for system operations:

```typescript
// In Edge Function
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

// This bypasses RLS
const { data } = await supabase.from('ces.assets').select('*');
```

Use service role only for:
- Pipeline operations
- Cross-workspace aggregations
- System-level reporting
- Odoo sync operations

## Testing RLS

```sql
-- Set test user context
SET request.jwt.claim.sub = 'test-user-uuid';

-- Verify isolation
SELECT * FROM ces.assets; -- Should only return user's workspace assets

-- Verify cross-workspace blocked
INSERT INTO ces.assets (workspace_id, ...) VALUES ('other-workspace-id', ...);
-- Should fail with RLS violation
```

## Migration Checklist

When adding new tables:

1. [ ] Add `workspace_id` column (or parent reference)
2. [ ] Enable RLS: `ALTER TABLE {table} ENABLE ROW LEVEL SECURITY;`
3. [ ] Add workspace isolation policy
4. [ ] Add role-based policies if needed
5. [ ] Test with different user contexts
6. [ ] Document in this file
