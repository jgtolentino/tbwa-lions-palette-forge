-- ============================================================================
-- MARKETING OS: Complete Schema Migration
-- Version: 1.0.0
-- Description: Campaign Intelligence + Marketing OS with RLS
-- ============================================================================

-- SCHEMAS
create schema if not exists ops;
create schema if not exists marketing;
create schema if not exists ces;
create schema if not exists semantic;

-- EXTENSIONS
create extension if not exists pgcrypto;

-- ============================================================================
-- HELPER FUNCTIONS
-- ============================================================================

-- Auto-update timestamp trigger
create or replace function ops.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

-- ============================================================================
-- OPS SCHEMA: Workspaces & Membership
-- ============================================================================

-- ops.workspaces
create table if not exists ops.workspaces (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  created_at timestamptz not null default now(),
  deleted_at timestamptz
);

-- ops.workspace_members
create table if not exists ops.workspace_members (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references ops.workspaces(id) on delete cascade,
  user_id uuid not null,
  role text not null check (role in ('owner','admin','analyst','viewer')),
  created_at timestamptz not null default now(),
  deleted_at timestamptz
);

create index if not exists idx_members_workspace_user on ops.workspace_members(workspace_id, user_id);

-- ============================================================================
-- MARKETING SCHEMA: Core Campaign Entities
-- ============================================================================

-- marketing.campaigns
create table if not exists marketing.campaigns (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references ops.workspaces(id) on delete cascade,
  name text not null,
  brand text not null,
  industry text not null,
  objective text not null,
  channel text not null check (channel in ('video','display','social','email','sms','web','pr','ooh')),
  status text not null check (status in ('draft','scheduled','running','paused','completed','archived')) default 'draft',
  approval_state text not null check (approval_state in ('draft','in_review','approved','rejected')) default 'draft',
  start_date date,
  end_date date,
  budget_amount numeric,
  budget_currency text,
  tags jsonb,
  metadata jsonb,
  created_by uuid not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create trigger trg_campaigns_updated_at
before update on marketing.campaigns
for each row execute function ops.set_updated_at();

create index if not exists idx_campaigns_workspace on marketing.campaigns(workspace_id);
create index if not exists idx_campaigns_status on marketing.campaigns(status);

-- marketing.creatives
create table if not exists marketing.creatives (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references ops.workspaces(id) on delete cascade,
  campaign_id uuid not null references marketing.campaigns(id) on delete cascade,
  name text not null,
  version text not null,
  asset_primary_id uuid,
  message text,
  target_audience text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create trigger trg_creatives_updated_at
before update on marketing.creatives
for each row execute function ops.set_updated_at();

create index if not exists idx_creatives_campaign on marketing.creatives(campaign_id);

-- marketing.assets
create table if not exists marketing.assets (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references ops.workspaces(id) on delete cascade,
  campaign_id uuid not null references marketing.campaigns(id) on delete cascade,
  creative_id uuid references marketing.creatives(id) on delete set null,
  type text not null check (type in ('video','image','audio','html','copy','landing_page')),
  title text,
  url text,
  storage_path text,
  mime_type text,
  duration_seconds int,
  checksum text,
  meta jsonb,
  created_at timestamptz not null default now(),
  deleted_at timestamptz
);

create index if not exists idx_assets_campaign on marketing.assets(campaign_id);

-- Link creative.asset_primary_id -> assets
do $$
begin
  if not exists (
    select 1 from information_schema.table_constraints
    where constraint_name='fk_creatives_asset_primary'
  ) then
    alter table marketing.creatives
      add constraint fk_creatives_asset_primary
      foreign key (asset_primary_id) references marketing.assets(id) on delete set null;
  end if;
end $$;

-- marketing.audiences
create table if not exists marketing.audiences (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references ops.workspaces(id) on delete cascade,
  name text not null,
  description text,
  definition jsonb not null,
  created_at timestamptz not null default now(),
  deleted_at timestamptz
);

create index if not exists idx_audiences_workspace on marketing.audiences(workspace_id);

-- marketing.journeys
create table if not exists marketing.journeys (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references ops.workspaces(id) on delete cascade,
  campaign_id uuid not null references marketing.campaigns(id) on delete cascade,
  name text not null,
  status text not null check (status in ('draft','scheduled','running','paused','completed','archived')) default 'draft',
  entry_rules jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create trigger trg_journeys_updated_at
before update on marketing.journeys
for each row execute function ops.set_updated_at();

-- marketing.journey_steps
create table if not exists marketing.journey_steps (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references ops.workspaces(id) on delete cascade,
  journey_id uuid not null references marketing.journeys(id) on delete cascade,
  step_key text not null,
  type text not null,
  config jsonb not null,
  next_steps jsonb,
  created_at timestamptz not null default now(),
  deleted_at timestamptz,
  unique (journey_id, step_key)
);

-- marketing.sends
create table if not exists marketing.sends (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references ops.workspaces(id) on delete cascade,
  campaign_id uuid not null references marketing.campaigns(id) on delete cascade,
  creative_id uuid references marketing.creatives(id) on delete set null,
  audience_id uuid references marketing.audiences(id) on delete set null,
  channel text not null check (channel in ('video','display','social','email','sms','web','pr','ooh')),
  status text not null check (status in ('queued','sent','failed','cancelled')) default 'queued',
  scheduled_at timestamptz,
  sent_at timestamptz,
  provider text,
  provider_message_id text,
  error text,
  meta jsonb,
  created_at timestamptz not null default now(),
  deleted_at timestamptz
);

create index if not exists idx_sends_campaign on marketing.sends(campaign_id);
create index if not exists idx_sends_status on marketing.sends(status);

-- marketing.events
create table if not exists marketing.events (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references ops.workspaces(id) on delete cascade,
  campaign_id uuid not null references marketing.campaigns(id) on delete cascade,
  send_id uuid references marketing.sends(id) on delete set null,
  creative_id uuid references marketing.creatives(id) on delete set null,
  event_type text not null check (event_type in (
    'delivered','opened','clicked','bounced','unsubscribed','complained',
    'viewed','completed','form_submitted','purchase'
  )),
  occurred_at timestamptz not null,
  user_ref text,
  properties jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_events_campaign_time on marketing.events(campaign_id, occurred_at);

-- ============================================================================
-- CES SCHEMA: Analysis & Benchmarks
-- ============================================================================

-- ces.analysis_jobs
create table if not exists ces.analysis_jobs (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references ops.workspaces(id) on delete cascade,
  campaign_id uuid not null references marketing.campaigns(id) on delete cascade,
  asset_id uuid not null references marketing.assets(id) on delete cascade,
  status text not null,
  provider text not null check (provider in ('openai','anthropic','gemini','local','none')) default 'none',
  requested_by uuid not null,
  requested_at timestamptz not null default now(),
  completed_at timestamptz,
  error text,
  meta jsonb
);

create index if not exists idx_jobs_campaign on ces.analysis_jobs(campaign_id);

-- ces.analysis_results
create table if not exists ces.analysis_results (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references ops.workspaces(id) on delete cascade,
  job_id uuid not null references ces.analysis_jobs(id) on delete cascade,
  campaign_id uuid not null references marketing.campaigns(id) on delete cascade,
  asset_id uuid not null references marketing.assets(id) on delete cascade,
  ces_score numeric,
  roi_predicted numeric,
  feature_importance jsonb,
  scene_breakdown jsonb,
  brand_detection jsonb,
  attention_heatmaps jsonb,
  recommendations jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_results_campaign on ces.analysis_results(campaign_id);

-- ces.benchmarks (workspace_id nullable -> global benchmarks)
create table if not exists ces.benchmarks (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid references ops.workspaces(id) on delete cascade,
  scope text not null check (scope in ('industry','region','channel','brand','objective')),
  key text not null,
  avg_ces numeric,
  top_quartile_ces numeric,
  avg_roi numeric,
  updated_at timestamptz not null default now()
);

create unique index if not exists uq_benchmarks_scope_key on ces.benchmarks(scope, key, coalesce(workspace_id, '00000000-0000-0000-0000-000000000000'::uuid));

-- ============================================================================
-- SEMANTIC SCHEMA: Views
-- ============================================================================

-- Campaign-level KPIs view
create or replace view semantic.v_campaign_kpis as
select
  c.workspace_id,
  c.id as campaign_id,
  c.name,
  c.brand,
  c.industry,
  c.channel,
  c.status,
  c.approval_state,
  c.budget_amount,
  c.budget_currency,
  max(r.created_at) as last_analysis_at,
  avg(r.ces_score) as avg_ces,
  avg(r.roi_predicted) as avg_roi,
  count(e.id) filter (where e.event_type = 'viewed') as views,
  count(e.id) filter (where e.event_type = 'completed') as completes,
  count(e.id) filter (where e.event_type = 'clicked') as clicks
from marketing.campaigns c
left join ces.analysis_results r on r.campaign_id = c.id and r.workspace_id = c.workspace_id
left join marketing.events e on e.campaign_id = c.id and e.workspace_id = c.workspace_id
where c.deleted_at is null
group by c.workspace_id, c.id;

-- Recent campaigns view
create or replace view semantic.v_recent_campaigns as
select *
from semantic.v_campaign_kpis
order by last_analysis_at desc nulls last, campaign_id desc;

-- Dashboard KPIs view
create or replace view semantic.v_dashboard_kpis as
select
  c.workspace_id,
  count(distinct c.id) as total_campaigns,
  avg(r.ces_score) as avg_ces,
  sum(coalesce(c.budget_amount,0)) as total_budget,
  avg(r.roi_predicted) as avg_roi,
  count(*) filter (where r.ces_score >= 80) as top_performers,
  count(*) filter (where r.ces_score < 60) as need_attention
from marketing.campaigns c
left join ces.analysis_results r on r.campaign_id = c.id and r.workspace_id = c.workspace_id
where c.deleted_at is null
group by c.workspace_id;

-- ============================================================================
-- SEMANTIC SCHEMA: RPCs
-- ============================================================================

-- Get dashboard KPIs
create or replace function semantic.get_dashboard_kpis(p_workspace_id uuid, p_date_from date, p_date_to date)
returns table (
  total_campaigns bigint,
  avg_ces numeric,
  total_budget numeric,
  avg_roi numeric,
  top_performers bigint,
  need_attention bigint
)
language sql stable as $$
  select
    count(distinct c.id) as total_campaigns,
    avg(r.ces_score) as avg_ces,
    sum(coalesce(c.budget_amount,0)) as total_budget,
    avg(r.roi_predicted) as avg_roi,
    count(*) filter (where r.ces_score >= 80) as top_performers,
    count(*) filter (where r.ces_score < 60) as need_attention
  from marketing.campaigns c
  left join ces.analysis_results r on r.campaign_id = c.id and r.workspace_id = c.workspace_id
  where c.workspace_id = p_workspace_id
    and c.deleted_at is null
    and (c.start_date is null or c.start_date <= p_date_to)
    and (c.end_date is null or c.end_date >= p_date_from);
$$;

-- Get recent campaigns
create or replace function semantic.get_recent_campaigns(p_workspace_id uuid, p_limit int default 20)
returns setof semantic.v_campaign_kpis
language sql stable as $$
  select *
  from semantic.v_campaign_kpis
  where workspace_id = p_workspace_id
  order by last_analysis_at desc nulls last
  limit greatest(p_limit, 1);
$$;

-- Get campaign detail
create or replace function semantic.get_campaign_detail(p_workspace_id uuid, p_campaign_id uuid)
returns jsonb
language sql stable as $$
  select jsonb_build_object(
    'campaign', to_jsonb(c),
    'creatives', coalesce((select jsonb_agg(to_jsonb(cr)) from marketing.creatives cr where cr.campaign_id=c.id and cr.deleted_at is null), '[]'::jsonb),
    'assets', coalesce((select jsonb_agg(to_jsonb(a)) from marketing.assets a where a.campaign_id=c.id and a.deleted_at is null), '[]'::jsonb),
    'results', coalesce((select jsonb_agg(to_jsonb(r)) from ces.analysis_results r where r.campaign_id=c.id), '[]'::jsonb)
  )
  from marketing.campaigns c
  where c.workspace_id=p_workspace_id and c.id=p_campaign_id and c.deleted_at is null;
$$;

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================

-- Enable RLS on all tables
alter table ops.workspaces enable row level security;
alter table ops.workspace_members enable row level security;
alter table marketing.campaigns enable row level security;
alter table marketing.creatives enable row level security;
alter table marketing.assets enable row level security;
alter table marketing.audiences enable row level security;
alter table marketing.journeys enable row level security;
alter table marketing.journey_steps enable row level security;
alter table marketing.sends enable row level security;
alter table marketing.events enable row level security;
alter table ces.analysis_jobs enable row level security;
alter table ces.analysis_results enable row level security;
alter table ces.benchmarks enable row level security;

-- Membership check function
create or replace function ops.is_workspace_member(p_workspace_id uuid, p_user_id uuid)
returns boolean language sql stable as $$
  select exists (
    select 1
    from ops.workspace_members m
    where m.workspace_id = p_workspace_id
      and m.user_id = p_user_id
      and m.deleted_at is null
  );
$$;

-- ============================================================================
-- RLS POLICIES
-- ============================================================================

-- Workspaces: read if member
create policy "workspaces_read" on ops.workspaces
for select using (
  ops.is_workspace_member(id, auth.uid())
);

-- Members: read if member of workspace
create policy "members_read" on ops.workspace_members
for select using (
  ops.is_workspace_member(workspace_id, auth.uid())
);

-- Marketing tables: CRUD if workspace member
create policy "campaigns_rw" on marketing.campaigns
for all using (ops.is_workspace_member(workspace_id, auth.uid()))
with check (ops.is_workspace_member(workspace_id, auth.uid()));

create policy "creatives_rw" on marketing.creatives
for all using (ops.is_workspace_member(workspace_id, auth.uid()))
with check (ops.is_workspace_member(workspace_id, auth.uid()));

create policy "assets_rw" on marketing.assets
for all using (ops.is_workspace_member(workspace_id, auth.uid()))
with check (ops.is_workspace_member(workspace_id, auth.uid()));

create policy "audiences_rw" on marketing.audiences
for all using (ops.is_workspace_member(workspace_id, auth.uid()))
with check (ops.is_workspace_member(workspace_id, auth.uid()));

create policy "journeys_rw" on marketing.journeys
for all using (ops.is_workspace_member(workspace_id, auth.uid()))
with check (ops.is_workspace_member(workspace_id, auth.uid()));

create policy "journey_steps_rw" on marketing.journey_steps
for all using (ops.is_workspace_member(workspace_id, auth.uid()))
with check (ops.is_workspace_member(workspace_id, auth.uid()));

create policy "sends_rw" on marketing.sends
for all using (ops.is_workspace_member(workspace_id, auth.uid()))
with check (ops.is_workspace_member(workspace_id, auth.uid()));

create policy "events_rw" on marketing.events
for all using (ops.is_workspace_member(workspace_id, auth.uid()))
with check (ops.is_workspace_member(workspace_id, auth.uid()));

-- CES tables: CRUD if workspace member
create policy "analysis_jobs_rw" on ces.analysis_jobs
for all using (ops.is_workspace_member(workspace_id, auth.uid()))
with check (ops.is_workspace_member(workspace_id, auth.uid()));

create policy "analysis_results_rw" on ces.analysis_results
for all using (ops.is_workspace_member(workspace_id, auth.uid()))
with check (ops.is_workspace_member(workspace_id, auth.uid()));

-- Benchmarks: readable by all authenticated users
create policy "benchmarks_read" on ces.benchmarks
for select using (true);

-- ============================================================================
-- SEED DATA: Global Benchmarks
-- ============================================================================

insert into ces.benchmarks (scope, key, avg_ces, top_quartile_ces, avg_roi) values
  ('industry', 'Automotive', 72.5, 85.0, 3.2),
  ('industry', 'Technology', 68.3, 82.0, 4.1),
  ('industry', 'Retail', 65.8, 78.0, 2.8),
  ('industry', 'Finance', 70.2, 83.0, 3.5),
  ('industry', 'Healthcare', 67.4, 80.0, 2.9),
  ('industry', 'FMCG', 71.1, 84.0, 3.0),
  ('channel', 'video', 74.2, 86.0, 3.8),
  ('channel', 'display', 62.5, 75.0, 2.5),
  ('channel', 'social', 69.8, 82.0, 3.2),
  ('channel', 'email', 58.3, 72.0, 4.5),
  ('region', 'NCR', 71.0, 84.0, 3.3),
  ('region', 'APAC', 68.5, 81.0, 3.1),
  ('region', 'Global', 70.0, 83.0, 3.4)
on conflict do nothing;
