-- ============================================================================
-- SCOUT JOIN CONTRACT: Cross-repo integration fields
-- Version: 1.0.0
-- Description: Defines the join contract between CES and Scout.
--              This migration creates the attribution views and functions
--              that Scout can use to integrate with CES data.
--
-- NOTE: The actual scout.* schema is owned by tbwa-agency-databank.
--       This migration creates the CES-side functions for attribution.
-- ============================================================================

-- ============================================================================
-- ATTRIBUTION FUNCTIONS (for Scout to call)
-- ============================================================================

-- Function to get CES score for an asset (callable by Scout)
create or replace function ces.get_asset_score_for_attribution(
  p_asset_id uuid
)
returns table (
  asset_id uuid,
  total_score numeric,
  confidence numeric,
  model_version text,
  computed_at timestamptz
)
language sql stable security invoker as $$
  select
    s.asset_id,
    s.total_score,
    s.confidence,
    s.model_version,
    s.computed_at
  from ces.scores s
  where s.asset_id = p_asset_id
  order by s.computed_at desc
  limit 1;
$$;

-- Function to get exposure data for attribution window
create or replace function ces.get_exposures_for_attribution(
  p_campaign_id uuid,
  p_start_time timestamptz,
  p_end_time timestamptz
)
returns table (
  exposure_id uuid,
  asset_id uuid,
  channel text,
  start_time timestamptz,
  end_time timestamptz,
  impressions bigint,
  attribution_window_days integer
)
language sql stable security invoker as $$
  select
    e.id as exposure_id,
    e.asset_id,
    e.channel,
    e.start_time,
    e.end_time,
    e.impressions,
    e.attribution_window_days
  from ces.exposures e
  where e.campaign_id = p_campaign_id
    and e.start_time <= p_end_time
    and (e.end_time is null or e.end_time >= p_start_time)
  order by e.start_time;
$$;

-- Function to compute score-performance correlation (for Scout analytics)
create or replace function ces.get_score_performance_correlation(
  p_workspace_id uuid,
  p_date_from date default (current_date - interval '30 days')::date,
  p_date_to date default current_date
)
returns table (
  dimension_code text,
  dimension_name text,
  avg_score numeric,
  sample_count bigint
)
language sql stable security invoker as $$
  select
    d.code as dimension_code,
    d.name as dimension_name,
    avg((s.dimensions->d.code->>'score')::numeric) as avg_score,
    count(*) as sample_count
  from ces.scores s
  cross join ces.score_dimensions d
  where s.workspace_id = p_workspace_id
    and s.computed_at >= p_date_from
    and s.computed_at <= p_date_to + interval '1 day'
    and s.dimensions ? d.code
  group by d.code, d.name
  order by avg_score desc;
$$;

-- ============================================================================
-- JOIN CONTRACT DOCUMENTATION (stored as comment)
-- ============================================================================

comment on function ces.get_asset_score_for_attribution is
'Scout Join Contract: Returns the latest CES score for an asset.
Used by Scout to enrich transactions with creative effectiveness data.

Join Pattern:
  scout.transactions
    -> ces.get_asset_score_for_attribution(asset_id)

Returns: asset_id, total_score, confidence, model_version, computed_at';

comment on function ces.get_exposures_for_attribution is
'Scout Join Contract: Returns exposure data for attribution window matching.
Used by Scout to link transactions to specific exposures.

Join Pattern:
  scout.transactions (transaction_time)
    -> ces.get_exposures_for_attribution(campaign_id, start, end)
    -> match on time window + attribution_window_days

Returns: exposure_id, asset_id, channel, start_time, end_time, impressions, attribution_window_days';

-- ============================================================================
-- ATTRIBUTION VIEWS (for cross-schema queries if same Supabase project)
-- ============================================================================

-- View for campaigns with CES performance summary
create or replace view ces.v_campaign_ces_summary as
select
  c.id as campaign_id,
  c.workspace_id,
  c.name as campaign_name,
  c.status as campaign_status,
  count(distinct a.id) as asset_count,
  count(distinct s.id) as scored_asset_count,
  avg(s.total_score) as avg_ces_score,
  min(s.total_score) as min_ces_score,
  max(s.total_score) as max_ces_score,
  sum(e.impressions) as total_impressions,
  sum(e.reach) as total_reach
from marketing.campaigns c
left join ces.assets a on a.campaign_id = c.id
left join lateral (
  select * from ces.scores
  where asset_id = a.id
  order by computed_at desc
  limit 1
) s on true
left join ces.exposures e on e.asset_id = a.id
where c.deleted_at is null
group by c.id, c.workspace_id, c.name, c.status;

-- ============================================================================
-- SCOUT SCHEMA PLACEHOLDER (for reference only)
-- The actual scout.* schema is managed by tbwa-agency-databank
-- ============================================================================

-- This is the expected schema that Scout should implement:
--
-- create schema if not exists scout;
--
-- create table scout.transactions (
--   id uuid primary key,
--   workspace_id uuid not null,
--   transaction_id text not null,
--   store_id uuid not null,
--   customer_id uuid,
--   total_amount numeric(12, 2) not null,
--   transaction_time timestamptz not null,
--
--   -- CES Join Contract Fields
--   campaign_id uuid references marketing.campaigns(id),
--   asset_id uuid references ces.assets(id),
--   exposure_id uuid references ces.exposures(id),
--   campaign_influenced boolean,
--   handshake_score numeric(4, 3),
--   attribution_confidence numeric(4, 3),
--
--   created_at timestamptz not null default now()
-- );
--
-- Indexes for join performance:
-- create index idx_scout_transactions_campaign on scout.transactions(campaign_id);
-- create index idx_scout_transactions_asset on scout.transactions(asset_id);
-- create index idx_scout_transactions_exposure on scout.transactions(exposure_id);

-- ============================================================================
-- OPS SCHEMA: Shared runs table extension
-- ============================================================================

-- Add pipeline types for CES-Scout integration
do $$
begin
  -- Ensure ops.runs can track CES pipelines
  if not exists (
    select 1 from pg_constraint
    where conname = 'runs_pipeline_name_check'
  ) then
    -- No constraint exists, add one that includes CES pipelines
    -- (If there's an existing constraint, we'll leave it as-is)
    null;
  end if;
end $$;

-- ============================================================================
-- CROSS-REPO SYNC TRACKING
-- ============================================================================

-- Table to track sync status between repos
create table if not exists ops.repo_sync_status (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references ops.workspaces(id) on delete cascade,

  source_repo text not null, -- 'ces' | 'scout' | 'odoo'
  target_repo text not null,
  entity_type text not null, -- 'campaign' | 'asset' | 'transaction'
  entity_id uuid not null,

  sync_status text not null check (sync_status in ('pending', 'synced', 'failed', 'conflict')),
  sync_direction text not null check (sync_direction in ('push', 'pull', 'bidirectional')),

  last_synced_at timestamptz,
  error_message text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger trg_repo_sync_updated_at
before update on ops.repo_sync_status
for each row execute function ops.set_updated_at();

create index if not exists idx_repo_sync_entity on ops.repo_sync_status(entity_type, entity_id);
create index if not exists idx_repo_sync_status on ops.repo_sync_status(workspace_id, sync_status);

alter table ops.repo_sync_status enable row level security;

create policy "repo_sync_rw" on ops.repo_sync_status
for all using (ops.is_workspace_member(workspace_id, auth.uid()))
with check (ops.is_workspace_member(workspace_id, auth.uid()));
