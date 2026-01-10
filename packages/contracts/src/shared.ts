/**
 * Shared entities across CES and Scout
 * These types represent the core domain objects that both systems reference
 */

// ============================================================================
// Core Identifiers
// ============================================================================

export type UUID = string;
export type Timestamp = string; // ISO 8601 format
export type WorkspaceId = UUID;
export type CampaignId = UUID;
export type AssetId = UUID;
export type UserId = UUID;

// ============================================================================
// Workspace (Multi-tenancy)
// ============================================================================

export interface Workspace {
  id: WorkspaceId;
  name: string;
  slug: string;
  owner_id: UserId;
  settings: WorkspaceSettings;
  created_at: Timestamp;
  updated_at: Timestamp;
}

export interface WorkspaceSettings {
  timezone?: string;
  currency?: string;
  default_scoring_model?: string;
  features?: Record<string, boolean>;
}

export type WorkspaceRole = 'owner' | 'admin' | 'analyst' | 'viewer';

export interface WorkspaceMember {
  id: UUID;
  workspace_id: WorkspaceId;
  user_id: UserId;
  role: WorkspaceRole;
  joined_at: Timestamp;
}

// ============================================================================
// Campaign
// ============================================================================

export type CampaignStatus =
  | 'draft'
  | 'pending_approval'
  | 'approved'
  | 'active'
  | 'paused'
  | 'completed'
  | 'archived';

export interface Campaign {
  id: CampaignId;
  workspace_id: WorkspaceId;
  name: string;
  description?: string;
  status: CampaignStatus;
  start_date?: Timestamp;
  end_date?: Timestamp;
  budget?: number;
  objectives?: CampaignObjective[];
  created_by: UserId;
  created_at: Timestamp;
  updated_at: Timestamp;

  // Odoo sync fields
  odoo_utm_campaign_id?: number;
  odoo_synced_at?: Timestamp;
}

export interface CampaignObjective {
  type: 'awareness' | 'consideration' | 'conversion' | 'loyalty';
  target_metric: string;
  target_value: number;
  actual_value?: number;
}

// ============================================================================
// Brand & Product (shared dimensions)
// ============================================================================

export interface Brand {
  id: UUID;
  workspace_id: WorkspaceId;
  name: string;
  code: string;
  parent_brand_id?: UUID;

  // Odoo sync
  odoo_brand_id?: number;
}

export interface Product {
  id: UUID;
  workspace_id: WorkspaceId;
  brand_id: UUID;
  name: string;
  sku: string;
  category: string;

  // Odoo sync
  odoo_product_id?: number;
}

// ============================================================================
// Geography
// ============================================================================

export interface Geography {
  id: UUID;
  name: string;
  type: 'country' | 'region' | 'city' | 'store';
  parent_id?: UUID;
  code: string;
}

// ============================================================================
// Audit Trail
// ============================================================================

export interface AuditEvent {
  id: UUID;
  workspace_id: WorkspaceId;
  entity_type: string;
  entity_id: UUID;
  action: 'create' | 'update' | 'delete' | 'score' | 'sync';
  actor_id?: UserId;
  actor_type: 'user' | 'system' | 'pipeline';
  changes?: Record<string, { old: unknown; new: unknown }>;
  metadata?: Record<string, unknown>;
  created_at: Timestamp;
}

// ============================================================================
// Pipeline / Job Execution
// ============================================================================

export type RunStatus = 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';

export interface Run {
  id: UUID;
  workspace_id: WorkspaceId;
  pipeline_name: string;
  status: RunStatus;
  started_at?: Timestamp;
  completed_at?: Timestamp;
  error_message?: string;
  metadata?: Record<string, unknown>;
  created_at: Timestamp;
}

// ============================================================================
// API Response Wrappers
// ============================================================================

export interface ApiResponse<T> {
  data: T;
  meta?: {
    page?: number;
    per_page?: number;
    total?: number;
    total_pages?: number;
  };
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}
