/**
 * CES (Creative Effectiveness System) Types
 * Owned by: tbwa-lions-palette-forge
 */

import type {
  UUID,
  Timestamp,
  WorkspaceId,
  CampaignId,
  AssetId,
  RunStatus
} from './shared';

// ============================================================================
// Asset
// ============================================================================

export type AssetType = 'image' | 'video' | 'audio' | 'document' | 'html';
export type AssetStatus =
  | 'uploaded'
  | 'processing'
  | 'features_ready'
  | 'scored'
  | 'failed';

export interface Asset {
  id: AssetId;
  workspace_id: WorkspaceId;
  campaign_id?: CampaignId;

  // Identity
  name: string;
  type: AssetType;
  mime_type: string;
  content_hash: string; // SHA-256 for deduplication

  // Storage
  storage_path: string;
  storage_bucket: string;
  file_size: number;

  // Versioning
  version: number;
  parent_asset_id?: AssetId;

  // Status
  status: AssetStatus;
  error_message?: string;

  // Metadata
  metadata?: AssetMetadata;

  // Timestamps
  created_at: Timestamp;
  updated_at: Timestamp;
  processed_at?: Timestamp;
  scored_at?: Timestamp;
}

export interface AssetMetadata {
  // Image/Video
  width?: number;
  height?: number;
  duration_seconds?: number;
  frame_count?: number;

  // Audio
  sample_rate?: number;
  channels?: number;

  // Document
  page_count?: number;
  word_count?: number;

  // Source
  source_url?: string;
  source_platform?: string;

  // Custom
  tags?: string[];
  labels?: Record<string, string>;
}

// ============================================================================
// Asset Features
// ============================================================================

export type FeatureType = 'vision' | 'audio' | 'text' | 'multimodal';

export interface AssetFeature {
  id: UUID;
  asset_id: AssetId;

  // Model provenance
  feature_type: FeatureType;
  model_id: UUID;
  model_version: string;

  // Features
  features: FeatureVector;

  // Metadata
  extraction_time_ms: number;
  confidence: number;

  // Timestamps
  created_at: Timestamp;
}

export interface FeatureVector {
  // Vision features
  dominant_colors?: string[];
  objects_detected?: ObjectDetection[];
  faces_detected?: FaceDetection[];
  text_regions?: TextRegion[];
  scene_classification?: Classification[];
  brand_elements?: BrandElement[];

  // Audio features
  transcription?: string;
  speaker_segments?: SpeakerSegment[];
  music_detected?: boolean;
  speech_emotion?: Classification[];

  // Text features
  embeddings?: number[];
  entities?: NamedEntity[];
  sentiment?: SentimentScore;
  keywords?: string[];
  readability_score?: number;

  // Multimodal
  audio_visual_sync?: number;
  pacing_score?: number;
}

export interface ObjectDetection {
  label: string;
  confidence: number;
  bounding_box?: BoundingBox;
}

export interface FaceDetection {
  confidence: number;
  bounding_box?: BoundingBox;
  emotion?: string;
  age_range?: [number, number];
}

export interface TextRegion {
  text: string;
  confidence: number;
  bounding_box?: BoundingBox;
}

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Classification {
  label: string;
  confidence: number;
}

export interface BrandElement {
  type: 'logo' | 'color' | 'font' | 'slogan';
  detected: string;
  expected?: string;
  match_score: number;
}

export interface SpeakerSegment {
  speaker_id: string;
  start_time: number;
  end_time: number;
  text?: string;
}

export interface NamedEntity {
  text: string;
  type: 'person' | 'organization' | 'location' | 'product' | 'date' | 'other';
  confidence: number;
}

export interface SentimentScore {
  positive: number;
  negative: number;
  neutral: number;
}

// ============================================================================
// Scoring
// ============================================================================

export interface Score {
  id: UUID;
  asset_id: AssetId;
  workspace_id: WorkspaceId;

  // Model provenance (immutable)
  model_id: UUID;
  model_version: string;
  feature_version: string;

  // Overall score
  total_score: number; // 0-100
  confidence: number; // 0-1

  // Dimension breakdown
  dimensions: ScoreDimension[];

  // Run tracking
  run_id: UUID;

  // Timestamps (immutable)
  computed_at: Timestamp;
}

export interface ScoreDimension {
  dimension_id: UUID;
  name: string;
  score: number; // 0-100
  weight: number; // 0-1, sum to 1
  weighted_score: number; // score * weight

  // Explainability
  contributing_features: string[];
  explanation?: string;
}

export interface ScoreDimensionDefinition {
  id: UUID;
  workspace_id?: WorkspaceId; // null = global
  name: string;
  code: string;
  description: string;
  default_weight: number;

  // Scoring criteria
  criteria: ScoringCriterion[];
}

export interface ScoringCriterion {
  name: string;
  description: string;
  weight: number;
  feature_requirements: string[];
}

// Standard dimension codes
export const SCORE_DIMENSIONS = {
  VISUAL_CLARITY: 'visual_clarity',
  BRAND_ALIGNMENT: 'brand_alignment',
  EMOTIONAL_RESONANCE: 'emotional_resonance',
  CTA_STRENGTH: 'cta_strength',
  PLATFORM_FIT: 'platform_fit',
  MESSAGE_CLARITY: 'message_clarity',
  AUDIENCE_RELEVANCE: 'audience_relevance',
} as const;

// ============================================================================
// Model Registry
// ============================================================================

export type ModelType = 'feature_extractor' | 'scorer' | 'recommender';
export type ModelStatus = 'active' | 'deprecated' | 'testing';

export interface Model {
  id: UUID;
  workspace_id?: WorkspaceId; // null = global

  name: string;
  type: ModelType;
  version: string;

  // Configuration
  config: Record<string, unknown>;

  // Performance metrics
  accuracy?: number;
  latency_p50_ms?: number;
  latency_p99_ms?: number;

  // Status
  status: ModelStatus;

  // Timestamps
  created_at: Timestamp;
  updated_at: Timestamp;
  deprecated_at?: Timestamp;
}

// ============================================================================
// Exposure (Attribution Link)
// ============================================================================

export type ExposureChannel =
  | 'digital_display'
  | 'social_media'
  | 'video'
  | 'print'
  | 'ooh' // out of home
  | 'retail_pos'
  | 'email'
  | 'other';

export interface Exposure {
  id: UUID;
  workspace_id: WorkspaceId;
  campaign_id: CampaignId;
  asset_id: AssetId;

  // Channel & Placement
  channel: ExposureChannel;
  placement?: string;
  platform?: string;

  // Temporal
  start_time: Timestamp;
  end_time?: Timestamp;

  // Geographic
  geography_id?: UUID;

  // Metrics
  impressions?: number;
  reach?: number;
  frequency?: number;

  // Attribution window
  attribution_window_days: number;

  // Timestamps
  created_at: Timestamp;
}

// ============================================================================
// Recommendations
// ============================================================================

export type RecommendationType =
  | 'visual_improvement'
  | 'copy_improvement'
  | 'brand_alignment'
  | 'audience_targeting'
  | 'channel_optimization'
  | 'timing_optimization';

export type RecommendationPriority = 'critical' | 'high' | 'medium' | 'low';

export interface Recommendation {
  id: UUID;
  asset_id: AssetId;
  workspace_id: WorkspaceId;

  // Classification
  type: RecommendationType;
  priority: RecommendationPriority;

  // Content
  title: string;
  description: string;
  action_items: string[];

  // Impact estimation
  expected_score_lift: number; // percentage points
  confidence: number;

  // Evidence
  based_on_dimensions: string[];
  peer_comparison?: PeerComparison;

  // Status
  status: 'pending' | 'accepted' | 'rejected' | 'implemented';

  // Timestamps
  created_at: Timestamp;
  acted_on_at?: Timestamp;
}

export interface PeerComparison {
  peer_count: number;
  peer_avg_score: number;
  percentile: number;
  top_performer_traits: string[];
}

// ============================================================================
// CES Pipeline Run
// ============================================================================

export interface CESRun {
  id: UUID;
  workspace_id: WorkspaceId;
  asset_id: AssetId;

  // Pipeline stage
  stage: 'ingestion' | 'feature_extraction' | 'scoring' | 'recommendation';
  status: RunStatus;

  // Progress
  progress_percent: number;
  current_step?: string;

  // Results
  feature_ids?: UUID[];
  score_id?: UUID;
  recommendation_ids?: UUID[];

  // Timing
  started_at: Timestamp;
  completed_at?: Timestamp;
  duration_ms?: number;

  // Error handling
  error_message?: string;
  error_details?: Record<string, unknown>;
  retry_count: number;
}
