-- ============================================================================
-- CES COMPLETE SCHEMA: Full Creative Effectiveness System Tables
-- Version: 2.0.0
-- Description: Complete CES schema with assets, features, scores, exposures,
--              recommendations, and Scout join contract fields
-- ============================================================================

-- EXTENSIONS (for content hash and vector storage)
create extension if not exists pgcrypto;

-- ============================================================================
-- CES SCHEMA: Core Asset Tables
-- ============================================================================

-- ces.assets (full implementation)
-- Core creative asset storage with versioning and processing status
create table if not exists ces.assets (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references ops.workspaces(id) on delete cascade,
  campaign_id uuid references marketing.campaigns(id) on delete set null,

  -- Identity
  name text not null,
  type text not null check (type in ('image', 'video', 'audio', 'document', 'html')),
  mime_type text not null,
  content_hash text not null, -- SHA-256 for deduplication

  -- Storage
  storage_path text not null,
  storage_bucket text not null default 'ces-assets',
  file_size bigint not null,

  -- Versioning
  version integer not null default 1,
  parent_asset_id uuid references ces.assets(id) on delete set null,

  -- Status
  status text not null check (status in ('uploaded', 'processing', 'features_ready', 'scored', 'failed')) default 'uploaded',
  error_message text,

  -- Metadata (dimensions, duration, page count, etc.)
  metadata jsonb,

  -- Timestamps
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  processed_at timestamptz,
  scored_at timestamptz
);

create trigger trg_ces_assets_updated_at
before update on ces.assets
for each row execute function ops.set_updated_at();

create index if not exists idx_ces_assets_workspace_status on ces.assets(workspace_id, status);
create index if not exists idx_ces_assets_content_hash on ces.assets(content_hash);
create index if not exists idx_ces_assets_campaign on ces.assets(campaign_id);

-- ============================================================================
-- CES SCHEMA: Model Registry
-- ============================================================================

-- ces.models (model registry with version tracking)
create table if not exists ces.models (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid references ops.workspaces(id) on delete cascade, -- null = global

  name text not null,
  type text not null check (type in ('feature_extractor', 'scorer', 'recommender')),
  version text not null,

  -- Configuration
  config jsonb,

  -- Performance metrics
  accuracy numeric(4, 3),
  latency_p50_ms integer,
  latency_p99_ms integer,

  -- Status
  status text not null check (status in ('active', 'deprecated', 'testing')) default 'active',

  -- Timestamps
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deprecated_at timestamptz
);

create trigger trg_ces_models_updated_at
before update on ces.models
for each row execute function ops.set_updated_at();

create unique index if not exists idx_ces_models_name_version on ces.models(name, version);

-- ============================================================================
-- CES SCHEMA: Feature Extraction
-- ============================================================================

-- ces.asset_features (extracted features per asset and model)
create table if not exists ces.asset_features (
  id uuid primary key default gen_random_uuid(),
  asset_id uuid not null references ces.assets(id) on delete cascade,

  -- Model provenance
  feature_type text not null check (feature_type in ('vision', 'audio', 'text', 'multimodal')),
  model_id uuid not null references ces.models(id) on delete restrict,
  model_version text not null,

  -- Features (structured feature vector)
  features jsonb not null,

  -- Metadata
  extraction_time_ms integer,
  confidence numeric(4, 3),

  -- Timestamps
  created_at timestamptz not null default now()
);

create unique index if not exists idx_ces_features_asset_model on ces.asset_features(asset_id, model_id);

-- ============================================================================
-- CES SCHEMA: Scoring
-- ============================================================================

-- ces.score_dimensions (reference table for score dimensions)
create table if not exists ces.score_dimensions (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid references ops.workspaces(id) on delete cascade, -- null = global

  name text not null,
  code text not null,
  description text,
  default_weight numeric(3, 2) not null default 0.14,

  -- Scoring criteria
  criteria jsonb,

  created_at timestamptz not null default now()
);

create unique index if not exists idx_ces_dimensions_code on ces.score_dimensions(code);

-- ces.scores (immutable CES scores)
create table if not exists ces.scores (
  id uuid primary key default gen_random_uuid(),
  asset_id uuid not null references ces.assets(id) on delete cascade,
  workspace_id uuid not null references ops.workspaces(id) on delete cascade,

  -- Model provenance (immutable)
  model_id uuid not null references ces.models(id) on delete restrict,
  model_version text not null,
  feature_version text not null,

  -- Overall score
  total_score numeric(5, 2) not null check (total_score >= 0 and total_score <= 100),
  confidence numeric(4, 3) not null check (confidence >= 0 and confidence <= 1),

  -- Dimension breakdown
  dimensions jsonb not null,

  -- Run tracking
  run_id uuid not null,

  -- Timestamps (immutable)
  computed_at timestamptz not null default now()
);

create index if not exists idx_ces_scores_asset on ces.scores(asset_id, computed_at);
create index if not exists idx_ces_scores_workspace on ces.scores(workspace_id, computed_at);

-- ============================================================================
-- CES SCHEMA: Attribution & Exposure
-- ============================================================================

-- ces.exposures (when and where assets were shown)
create table if not exists ces.exposures (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references ops.workspaces(id) on delete cascade,
  campaign_id uuid not null references marketing.campaigns(id) on delete cascade,
  asset_id uuid not null references ces.assets(id) on delete cascade,

  -- Channel & Placement
  channel text not null check (channel in ('digital_display', 'social_media', 'video', 'print', 'ooh', 'retail_pos', 'email', 'other')),
  placement text,
  platform text,

  -- Temporal
  start_time timestamptz not null,
  end_time timestamptz,

  -- Geographic
  geography_id uuid,

  -- Metrics
  impressions bigint,
  reach bigint,
  frequency numeric(6, 2),

  -- Attribution window
  attribution_window_days integer not null default 7,

  -- Timestamps
  created_at timestamptz not null default now()
);

create index if not exists idx_ces_exposures_campaign_asset on ces.exposures(campaign_id, asset_id);
create index if not exists idx_ces_exposures_time on ces.exposures(start_time, end_time);

-- ============================================================================
-- CES SCHEMA: Recommendations
-- ============================================================================

-- ces.recommendations (prioritized improvement actions)
create table if not exists ces.recommendations (
  id uuid primary key default gen_random_uuid(),
  asset_id uuid not null references ces.assets(id) on delete cascade,
  workspace_id uuid not null references ops.workspaces(id) on delete cascade,

  -- Classification
  type text not null check (type in ('visual_improvement', 'copy_improvement', 'brand_alignment', 'audience_targeting', 'channel_optimization', 'timing_optimization')),
  priority text not null check (priority in ('critical', 'high', 'medium', 'low')),

  -- Content
  title text not null,
  description text,
  action_items jsonb,

  -- Impact estimation
  expected_score_lift numeric(5, 2),
  confidence numeric(4, 3),

  -- Evidence
  based_on_dimensions jsonb,
  peer_comparison jsonb,

  -- Status
  status text not null check (status in ('pending', 'accepted', 'rejected', 'implemented')) default 'pending',

  -- Timestamps
  created_at timestamptz not null default now(),
  acted_on_at timestamptz
);

create index if not exists idx_ces_recommendations_asset on ces.recommendations(asset_id, priority);
create index if not exists idx_ces_recommendations_workspace on ces.recommendations(workspace_id, status);

-- ============================================================================
-- CES SCHEMA: Pipeline Runs
-- ============================================================================

-- ces.runs (pipeline execution tracking)
create table if not exists ces.runs (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references ops.workspaces(id) on delete cascade,
  asset_id uuid not null references ces.assets(id) on delete cascade,

  -- Pipeline stage
  stage text not null check (stage in ('ingestion', 'feature_extraction', 'scoring', 'recommendation')),
  status text not null check (status in ('pending', 'running', 'completed', 'failed', 'cancelled')) default 'pending',

  -- Progress
  progress_percent integer not null default 0 check (progress_percent >= 0 and progress_percent <= 100),
  current_step text,

  -- Results
  feature_ids uuid[],
  score_id uuid references ces.scores(id),
  recommendation_ids uuid[],

  -- Timing
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  duration_ms integer,

  -- Error handling
  error_message text,
  error_details jsonb,
  retry_count integer not null default 0
);

create index if not exists idx_ces_runs_asset on ces.runs(asset_id, stage);
create index if not exists idx_ces_runs_workspace on ces.runs(workspace_id, status);

-- ============================================================================
-- CES SCHEMA: Conversations (Ask CES)
-- ============================================================================

-- ces.conversations (already exists, ensure it has proper structure)
create table if not exists ces.conversations (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references ops.workspaces(id) on delete cascade,
  user_id uuid not null,
  title text,
  messages jsonb not null default '[]'::jsonb,
  context jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger trg_ces_conversations_updated_at
before update on ces.conversations
for each row execute function ops.set_updated_at();

create index if not exists idx_ces_conversations_workspace on ces.conversations(workspace_id, user_id);

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================

-- Enable RLS on all new tables
alter table ces.assets enable row level security;
alter table ces.models enable row level security;
alter table ces.asset_features enable row level security;
alter table ces.score_dimensions enable row level security;
alter table ces.scores enable row level security;
alter table ces.exposures enable row level security;
alter table ces.recommendations enable row level security;
alter table ces.runs enable row level security;
alter table ces.conversations enable row level security;

-- ============================================================================
-- RLS POLICIES
-- ============================================================================

-- ces.assets: workspace isolation
create policy "assets_rw" on ces.assets
for all using (ops.is_workspace_member(workspace_id, auth.uid()))
with check (ops.is_workspace_member(workspace_id, auth.uid()));

-- ces.models: global readable, workspace writable
create policy "models_read" on ces.models
for select using (workspace_id is null or ops.is_workspace_member(workspace_id, auth.uid()));

create policy "models_write" on ces.models
for insert with check (workspace_id is null or ops.is_workspace_member(workspace_id, auth.uid()));

-- ces.asset_features: via asset
create policy "features_rw" on ces.asset_features
for all using (
  asset_id in (
    select id from ces.assets
    where ops.is_workspace_member(workspace_id, auth.uid())
  )
);

-- ces.score_dimensions: global readable
create policy "dimensions_read" on ces.score_dimensions
for select using (workspace_id is null or ops.is_workspace_member(workspace_id, auth.uid()));

-- ces.scores: workspace isolation
create policy "scores_rw" on ces.scores
for all using (ops.is_workspace_member(workspace_id, auth.uid()))
with check (ops.is_workspace_member(workspace_id, auth.uid()));

-- ces.exposures: workspace isolation
create policy "exposures_rw" on ces.exposures
for all using (ops.is_workspace_member(workspace_id, auth.uid()))
with check (ops.is_workspace_member(workspace_id, auth.uid()));

-- ces.recommendations: workspace isolation
create policy "recommendations_rw" on ces.recommendations
for all using (ops.is_workspace_member(workspace_id, auth.uid()))
with check (ops.is_workspace_member(workspace_id, auth.uid()));

-- ces.runs: workspace isolation
create policy "runs_rw" on ces.runs
for all using (ops.is_workspace_member(workspace_id, auth.uid()))
with check (ops.is_workspace_member(workspace_id, auth.uid()));

-- ces.conversations: workspace isolation
create policy "conversations_rw" on ces.conversations
for all using (ops.is_workspace_member(workspace_id, auth.uid()))
with check (ops.is_workspace_member(workspace_id, auth.uid()));

-- ============================================================================
-- SEED DATA: Default Score Dimensions
-- ============================================================================

insert into ces.score_dimensions (code, name, description, default_weight, criteria) values
  ('visual_clarity', 'Visual Clarity', 'How clear and legible is the visual content', 0.15, '{"min_resolution": 720, "contrast_threshold": 0.7}'),
  ('brand_alignment', 'Brand Alignment', 'How well does the asset align with brand guidelines', 0.20, '{"logo_presence": true, "color_match": 0.8}'),
  ('emotional_resonance', 'Emotional Resonance', 'How effectively does the asset evoke emotion', 0.15, '{"sentiment_range": ["positive", "inspiring"]}'),
  ('cta_strength', 'CTA Strength', 'How clear and compelling is the call to action', 0.15, '{"cta_visible": true, "action_verb": true}'),
  ('platform_fit', 'Platform Fit', 'How well optimized is the asset for its target platform', 0.10, '{"aspect_ratio_match": true}'),
  ('message_clarity', 'Message Clarity', 'How clear is the core message', 0.15, '{"reading_level": 8, "word_count_max": 30}'),
  ('audience_relevance', 'Audience Relevance', 'How relevant is the content to target audience', 0.10, '{"persona_match": 0.7}')
on conflict do nothing;

-- ============================================================================
-- SEED DATA: Default Models
-- ============================================================================

insert into ces.models (name, type, version, status, config) values
  ('vision-base', 'feature_extractor', '1.0.0', 'active', '{"provider": "openai", "model": "gpt-4-vision-preview"}'),
  ('text-embeddings', 'feature_extractor', '1.0.0', 'active', '{"provider": "openai", "model": "text-embedding-3-small"}'),
  ('audio-transcribe', 'feature_extractor', '1.0.0', 'active', '{"provider": "openai", "model": "whisper-1"}'),
  ('ces-scorer', 'scorer', '1.0.0', 'active', '{"dimensions": 7, "ensemble": true}'),
  ('ces-recommender', 'recommender', '1.0.0', 'active', '{"max_recommendations": 5, "min_confidence": 0.6}')
on conflict do nothing;

-- ============================================================================
-- FUNCTIONS
-- ============================================================================

-- Function to compute CES score (placeholder - actual implementation in Edge Function)
create or replace function ces.compute_score(p_asset_id uuid, p_model_id uuid default null)
returns uuid
language plpgsql security invoker as $$
declare
  v_score_id uuid;
  v_model_id uuid;
  v_workspace_id uuid;
begin
  -- Get workspace from asset
  select workspace_id into v_workspace_id
  from ces.assets where id = p_asset_id;

  -- Use default scorer if not specified
  v_model_id := coalesce(p_model_id, (
    select id from ces.models
    where name = 'ces-scorer' and status = 'active'
    order by version desc limit 1
  ));

  -- Create placeholder score (actual computation via Edge Function)
  insert into ces.scores (
    asset_id, workspace_id, model_id, model_version, feature_version,
    total_score, confidence, dimensions, run_id
  )
  select
    p_asset_id,
    v_workspace_id,
    v_model_id,
    m.version,
    '1.0.0',
    0, -- Placeholder
    0, -- Placeholder
    '{}'::jsonb,
    gen_random_uuid()
  from ces.models m where m.id = v_model_id
  returning id into v_score_id;

  return v_score_id;
end;
$$;

-- Function to get recommendations for an asset
create or replace function ces.get_recommendations(p_asset_id uuid, p_limit int default 5)
returns setof ces.recommendations
language sql stable security invoker as $$
  select *
  from ces.recommendations
  where asset_id = p_asset_id
    and status = 'pending'
  order by
    case priority
      when 'critical' then 1
      when 'high' then 2
      when 'medium' then 3
      when 'low' then 4
    end,
    expected_score_lift desc nulls last
  limit greatest(p_limit, 1);
$$;

-- Function to get latest score for an asset
create or replace function ces.get_latest_score(p_asset_id uuid)
returns ces.scores
language sql stable security invoker as $$
  select *
  from ces.scores
  where asset_id = p_asset_id
  order by computed_at desc
  limit 1;
$$;

-- ============================================================================
-- VIEWS
-- ============================================================================

-- Asset with latest score view
create or replace view ces.v_assets_with_scores as
select
  a.*,
  s.total_score,
  s.confidence,
  s.dimensions as score_dimensions,
  s.computed_at as last_scored_at
from ces.assets a
left join lateral (
  select * from ces.scores
  where asset_id = a.id
  order by computed_at desc
  limit 1
) s on true;

-- Campaign asset performance view
create or replace view ces.v_campaign_asset_performance as
select
  c.id as campaign_id,
  c.name as campaign_name,
  c.workspace_id,
  a.id as asset_id,
  a.name as asset_name,
  a.type as asset_type,
  a.status as asset_status,
  s.total_score,
  s.confidence,
  e.impressions,
  e.reach,
  e.channel
from marketing.campaigns c
join ces.assets a on a.campaign_id = c.id
left join lateral (
  select * from ces.scores
  where asset_id = a.id
  order by computed_at desc
  limit 1
) s on true
left join lateral (
  select
    sum(impressions) as impressions,
    sum(reach) as reach,
    string_agg(distinct channel, ', ') as channel
  from ces.exposures
  where asset_id = a.id
) e on true
where c.deleted_at is null;
