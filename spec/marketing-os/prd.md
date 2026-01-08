# PRD - Marketing OS (Ask CES / Campaign Intelligence)

## Goal

Deliver campaign intelligence with CES scoring + benchmarking + execution workflows (video analysis + creative insights + audience intelligence) with marketplace readiness.

## Problem Statement

Marketing teams struggle to:
1. Objectively measure creative effectiveness before launch
2. Compare campaign performance against industry benchmarks
3. Automate marketing workflows while maintaining brand consistency
4. Make data-driven decisions about creative optimization

## Solution

Marketing OS provides an AI-powered platform that:
- Scores creative assets using the 8-dimensional CES framework
- Provides real-time benchmarking against industry, channel, and regional peers
- Automates campaign journeys with intelligent triggers
- Offers AI agents for each stage of campaign lifecycle

## Core Modules

### 1. Dashboard
**Purpose:** Single pane of glass for campaign portfolio health

**Tabs:**
- **Overview:** KPI row + CES distribution + performance trends
- **Performance:** Radar chart + KPI breakdown + channel mix analysis
- **Features:** Feature importance + AI recommendations
- **Benchmarks:** Industry benchmarks + peer comparison
- **Campaigns:** Recent campaigns table + quick actions

**KPIs:**
- Total campaigns
- Average CES score
- Total budget
- Average ROI
- Top performers (CES >= 80)
- Needs attention (CES < 60)

### 2. Video Analysis
**Purpose:** AI-powered creative analysis pipeline

**Features:**
- Upload video/image assets
- Add URL references
- Analysis job queue with status tracking
- Structured results with scene breakdown
- Brand detection and attention heatmaps
- Actionable recommendations

**Analysis Outputs:**
- CES score (0-100)
- ROI prediction
- Feature importance breakdown
- Scene-by-scene analysis
- Brand visibility metrics

### 3. Ask CES (Chat Interface)
**Purpose:** Conversational interface for campaign insights

**Tabs:**
- **Chat:** Natural language queries with citations
- **Insights:** Auto-generated insight cards + saved queries
- **Creative:** Creative tools + variant generation + scoring
- **Audience:** Segmentation builder + persona analysis + geo insights

## Data Contract

**Defined in:** `docs/ask-ces/marketing_semantic_contract.yaml`

**Supabase Schemas:**
- `ops` - Workspaces, members, permissions
- `marketing` - Campaigns, creatives, assets, audiences, journeys, sends, events
- `ces` - Analysis jobs, results, benchmarks
- `semantic` - Views and RPCs for dashboard

## AI Agents

| Agent | Role | Key Capabilities |
|-------|------|------------------|
| AdsBot | Campaign Operations | Segments, journeys, scheduling, sends |
| Marian | Creative & Copy | Variant generation, brand voice, optimization |
| Echo | Signal & Triggering | Event processing, triggers, journey progression |
| CESAI | Effectiveness & ROI | CES scoring, attribution, uplift estimation |
| TestSprite | QA & Experiments | A/B testing, validation, deliverability |

## Odoo Integration

**Core Modules:**
- base, mail, contacts, crm, utm, website, website_form

**Marketing Modules:**
- mass_mailing, marketing_automation

**OCA Repositories:**
- mass-mailing (enhancements)
- social (scheduling)
- sale-promotion (coupons)

## Success Metrics

| Metric | Target |
|--------|--------|
| CES prediction accuracy | > 85% correlation with actual performance |
| Analysis job completion time | < 30 seconds for video |
| User satisfaction (NPS) | > 50 |
| Daily active users | > 70% of workspace members |

## Non-Functional Requirements

- **Performance:** Dashboard loads in < 2 seconds
- **Availability:** 99.9% uptime SLA
- **Security:** SOC 2 Type II compliant
- **Scalability:** Handle 10,000+ campaigns per workspace
