/**
 * Scout (Retail Analytics) Types
 * Owned by: tbwa-agency-databank
 *
 * These types are defined here for cross-repo contract alignment.
 * The canonical implementation lives in tbwa-agency-databank.
 */

import type {
  UUID,
  Timestamp,
  WorkspaceId,
  CampaignId,
  AssetId
} from './shared';

// ============================================================================
// Transaction (Core Scout Entity)
// ============================================================================

export interface Transaction {
  id: UUID;
  workspace_id: WorkspaceId;

  // Transaction identity
  transaction_id: string;
  pos_terminal_id?: string;
  store_id: UUID;

  // Customer
  customer_id?: UUID;
  customer_segment?: string;

  // Basket
  items: TransactionItem[];
  total_amount: number;
  currency: string;

  // Timing
  transaction_time: Timestamp;

  // =========================================
  // CES Attribution Fields (join contract)
  // =========================================
  campaign_id?: CampaignId;
  asset_id?: AssetId;
  exposure_id?: UUID;

  // Attribution metrics
  campaign_influenced?: boolean;
  handshake_score?: number;
  attribution_confidence?: number;

  // Derived insights
  combo_basket?: boolean;
  substitution_event?: boolean;

  // Timestamps
  created_at: Timestamp;
  updated_at: Timestamp;
}

export interface TransactionItem {
  id: UUID;
  product_id: UUID;
  sku: string;
  name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  discount_amount?: number;

  // Product attributes
  brand_id?: UUID;
  category?: string;

  // Promotion
  promotion_id?: UUID;
  promotion_type?: string;
}

// ============================================================================
// Store
// ============================================================================

export type StoreType = 'flagship' | 'standard' | 'express' | 'pop_up' | 'franchise';

export interface Store {
  id: UUID;
  workspace_id: WorkspaceId;

  name: string;
  code: string;
  type: StoreType;

  // Location
  address: string;
  city: string;
  region: string;
  country: string;
  latitude?: number;
  longitude?: number;
  geography_id?: UUID;

  // Attributes
  size_sqm?: number;
  opened_at?: Timestamp;

  // Odoo sync
  odoo_warehouse_id?: number;

  created_at: Timestamp;
  updated_at: Timestamp;
}

// ============================================================================
// Customer
// ============================================================================

export interface Customer {
  id: UUID;
  workspace_id: WorkspaceId;

  // Identity (anonymized)
  customer_key: string;
  segment?: string;

  // Aggregates
  total_transactions: number;
  total_spend: number;
  first_transaction_at?: Timestamp;
  last_transaction_at?: Timestamp;

  // Preferences
  preferred_store_id?: UUID;
  preferred_brands?: UUID[];

  // Odoo sync
  odoo_partner_id?: number;

  created_at: Timestamp;
  updated_at: Timestamp;
}

// ============================================================================
// Attribution (Scout perspective)
// ============================================================================

export interface Attribution {
  id: UUID;
  workspace_id: WorkspaceId;

  // Links
  transaction_id: UUID;
  campaign_id: CampaignId;
  asset_id?: AssetId;
  exposure_id?: UUID;

  // Attribution model
  model: 'first_touch' | 'last_touch' | 'linear' | 'time_decay' | 'position_based';
  weight: number; // 0-1

  // Metrics
  attributed_revenue: number;
  attributed_units: number;

  // Confidence
  confidence: number;

  created_at: Timestamp;
}

// ============================================================================
// Performance Aggregates (Scout Gold Layer)
// ============================================================================

export interface CampaignPerformance {
  campaign_id: CampaignId;
  workspace_id: WorkspaceId;

  // Period
  date: Timestamp; // Date only, aggregated daily

  // Metrics
  transactions_count: number;
  influenced_transactions: number;
  total_revenue: number;
  attributed_revenue: number;

  // Derived
  lift_percent: number;
  avg_basket_size: number;
  conversion_rate: number;

  // By channel
  channel_breakdown?: Record<string, ChannelMetrics>;

  computed_at: Timestamp;
}

export interface ChannelMetrics {
  impressions: number;
  reach: number;
  transactions: number;
  revenue: number;
  roi: number;
}

export interface AssetPerformance {
  asset_id: AssetId;
  campaign_id: CampaignId;
  workspace_id: WorkspaceId;

  // Period
  date: Timestamp;

  // Exposure
  impressions: number;
  reach: number;

  // Outcomes
  transactions_attributed: number;
  revenue_attributed: number;

  // CES correlation
  ces_score?: number;
  score_performance_correlation?: number;

  computed_at: Timestamp;
}

// ============================================================================
// Scout RPC Functions (Gold Layer)
// ============================================================================

export interface GetCampaignPerformanceParams {
  campaign_id: CampaignId;
  start_date: Timestamp;
  end_date: Timestamp;
  granularity?: 'day' | 'week' | 'month';
}

export interface GetAssetAttributionParams {
  asset_id: AssetId;
  start_date: Timestamp;
  end_date: Timestamp;
  attribution_model?: Attribution['model'];
}

export interface GetScoreCorrelationParams {
  workspace_id: WorkspaceId;
  min_impressions?: number;
  date_range_days?: number;
}

export interface ScoreCorrelationResult {
  dimension: string;
  correlation_coefficient: number;
  p_value: number;
  sample_size: number;
  interpretation: 'strong_positive' | 'moderate_positive' | 'weak' | 'moderate_negative' | 'strong_negative';
}
