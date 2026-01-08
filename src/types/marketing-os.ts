/**
 * Marketing OS Type Definitions
 *
 * Comprehensive TypeScript types mapping to:
 * - Odoo 18 CE Core Modules
 * - OCA Marketing Extensions
 * - AI Agent Equivalents (AdsBot, Marian, Echo, CESAI, TestSprite)
 *
 * @version 1.0.0
 */

// =============================================================================
// ENUMS
// =============================================================================

/**
 * Campaign lifecycle states
 * @odoo mail.mass_mailing.state
 */
export type CampaignStatus =
  | 'draft'
  | 'pending_review'
  | 'approved'
  | 'scheduled'
  | 'running'
  | 'paused'
  | 'completed'
  | 'archived'
  | 'cancelled';

/**
 * Campaign type classification
 * @odoo marketing.campaign.type
 */
export type CampaignType =
  | 'email_blast'
  | 'drip_sequence'
  | 'social_post'
  | 'sms_campaign'
  | 'push_notification'
  | 'landing_page'
  | 'promotion'
  | 'event'
  | 'retargeting';

/**
 * Creative asset formats
 * @ai_agent Marian
 */
export type ContentFormat =
  | 'html_email'
  | 'plain_text'
  | 'video_short'
  | 'video_long'
  | 'image_static'
  | 'image_carousel'
  | 'gif_animated'
  | 'audio_clip'
  | 'interactive'
  | 'pdf_document';

/**
 * Marketing distribution channels
 * @oca social
 * @ai_agent AdsBot
 */
export type ChannelType =
  | 'email'
  | 'sms'
  | 'facebook'
  | 'instagram'
  | 'twitter_x'
  | 'linkedin'
  | 'tiktok'
  | 'youtube'
  | 'google_ads'
  | 'meta_ads'
  | 'push_web'
  | 'push_mobile'
  | 'whatsapp';

/**
 * Audience segmentation strategies
 * @ai_agent AdsBot, Echo
 */
export type AudienceSegmentType =
  | 'demographic'
  | 'behavioral'
  | 'psychographic'
  | 'firmographic'
  | 'technographic'
  | 'transactional'
  | 'predictive'
  | 'lookalike';

/**
 * Creative Effectiveness Score tiers
 * @ai_agent CESAI
 */
export type CESTier =
  | 'exceptional'       // >= 80
  | 'highly_effective'  // >= 70
  | 'effective'         // >= 60
  | 'moderate'          // >= 50
  | 'needs_improvement'; // < 50

/**
 * Conversion attribution models
 * @ai_agent CESAI
 */
export type AttributionModel =
  | 'first_touch'
  | 'last_touch'
  | 'linear'
  | 'time_decay'
  | 'position_based'
  | 'data_driven'
  | 'custom';

/**
 * Marketing effectiveness metrics
 * @ai_agent CESAI
 */
export type MetricType =
  // Reach
  | 'impressions'
  | 'reach'
  | 'frequency'
  // Engagement
  | 'clicks'
  | 'ctr'
  | 'engagement_rate'
  | 'video_views'
  | 'video_completion_rate'
  // Conversion
  | 'conversions'
  | 'conversion_rate'
  | 'cost_per_conversion'
  | 'roas'
  | 'roi'
  // Brand
  | 'brand_lift'
  | 'ad_recall_lift'
  | 'consideration_lift'
  | 'purchase_intent_lift'
  // Revenue
  | 'revenue'
  | 'aov'
  | 'ltv'
  | 'sales_lift'
  | 'market_share_change';

/**
 * Marketing automation triggers
 * @odoo marketing.automation.trigger
 * @ai_agent Echo
 */
export type EventTriggerType =
  | 'form_submit'
  | 'page_view'
  | 'email_open'
  | 'email_click'
  | 'link_click'
  | 'video_start'
  | 'video_complete'
  | 'purchase'
  | 'cart_abandon'
  | 'signup'
  | 'download'
  | 'custom_event'
  | 'time_delay'
  | 'date_trigger'
  | 'segment_enter'
  | 'segment_exit'
  | 'score_threshold';

/**
 * Content approval workflow states
 * @ai_agent TestSprite
 */
export type ApprovalStatus =
  | 'not_submitted'
  | 'pending_creative'
  | 'pending_legal'
  | 'pending_brand'
  | 'pending_executive'
  | 'approved'
  | 'rejected'
  | 'revision_requested';

/**
 * A/B test experiment states
 * @ai_agent TestSprite
 */
export type ExperimentStatus =
  | 'designing'
  | 'ready'
  | 'running'
  | 'paused'
  | 'completed'
  | 'cancelled'
  | 'inconclusive';

/**
 * External connector health states
 */
export type ConnectorStatus =
  | 'connected'
  | 'disconnected'
  | 'error'
  | 'rate_limited'
  | 'authenticating'
  | 'maintenance';

/**
 * Marketing event types
 * @odoo mail.mail.statistics, website.track
 * @ai_agent Echo, CESAI
 */
export type MarketingEventType =
  // Email events
  | 'email_sent'
  | 'email_delivered'
  | 'email_bounced'
  | 'email_opened'
  | 'email_clicked'
  | 'email_unsubscribed'
  | 'email_complained'
  // SMS events
  | 'sms_sent'
  | 'sms_delivered'
  | 'sms_failed'
  | 'sms_clicked'
  // Web events
  | 'page_view'
  | 'form_submit'
  | 'link_click'
  | 'video_start'
  | 'video_complete'
  // Conversion events
  | 'lead_created'
  | 'opportunity_created'
  | 'purchase_completed'
  | 'cart_abandoned'
  // Journey events
  | 'journey_entered'
  | 'journey_step_completed'
  | 'journey_exited'
  // Engagement
  | 'social_like'
  | 'social_share'
  | 'social_comment';

/**
 * Journey step types
 * @odoo marketing.activity
 * @ai_agent AdsBot, Echo
 */
export type JourneyStepType =
  | 'send_email'
  | 'send_sms'
  | 'send_push'
  | 'wait_time'
  | 'wait_event'
  | 'condition_split'
  | 'random_split'
  | 'update_contact'
  | 'add_to_segment'
  | 'remove_from_segment'
  | 'webhook'
  | 'end_journey';

/**
 * Promotion types
 * @odoo sale.coupon.program, loyalty.program
 * @ai_agent AdsBot, CESAI
 */
export type PromotionType =
  | 'percentage_discount'
  | 'fixed_discount'
  | 'free_shipping'
  | 'bogo'
  | 'bundle'
  | 'loyalty_points'
  | 'cashback';

/**
 * Connector types
 */
export type ConnectorType =
  | 'smtp'
  | 'sms_gateway'
  | 'facebook'
  | 'instagram'
  | 'twitter_x'
  | 'linkedin'
  | 'google_ads'
  | 'meta_ads'
  | 'webhook'
  | 'crm'
  | 'analytics';

// =============================================================================
// CORE ENTITIES
// =============================================================================

/**
 * Base entity with common fields
 */
export interface BaseEntity {
  id: string;
  tenantId: string;
  createdAt: Date;
  updatedAt: Date;
  metadata?: Record<string, unknown>;
}

/**
 * Marketing campaign master entity
 * @odoo mail.mass_mailing.campaign + marketing.campaign
 * @ai_agents AdsBot, Marian, CESAI
 */
export interface Campaign extends BaseEntity {
  // Identity
  name: string;
  code?: string;

  // Classification
  type: CampaignType;
  status: CampaignStatus;

  // Ownership
  workspaceId: string;
  brandId: string;

  // Timing
  scheduledStart?: Date;
  scheduledEnd?: Date;
  actualStart?: Date;
  actualEnd?: Date;

  // Budget
  budgetPlanned?: number;
  budgetSpent: number;
  currency: string;

  // Targeting
  audienceSegmentIds: string[];
  channelIds: ChannelType[];

  // UTM tracking
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;

  // Effectiveness
  cesScore?: number;
  cesTier?: CESTier;

  // Metadata
  tags: string[];
  createdBy: string;
  archivedAt?: Date;
}

/**
 * Creative asset/content entity
 * @odoo mail.mass_mailing + ir.attachment
 * @ai_agents Marian, TestSprite
 */
export interface Creative extends BaseEntity {
  campaignId: string;

  // Content
  name: string;
  format: ContentFormat;
  subjectLine?: string;
  previewText?: string;
  bodyHtml?: string;
  bodyPlain?: string;
  ctaText?: string;
  ctaUrl?: string;

  // Assets
  primaryAssetUrl?: string;
  assetUrls: string[];
  thumbnailUrl?: string;

  // Variants (A/B testing)
  variantGroupId?: string;
  variantLabel?: string;
  variantWeight: number;

  // Approval
  approvalStatus: ApprovalStatus;
  approvedBy?: string;
  approvedAt?: Date;

  // AI Analysis
  aiQualityScore?: number;
  aiSuggestions: AISuggestion[];
  brandVoiceScore?: number;

  createdBy: string;
}

/**
 * AI-generated suggestion
 */
export interface AISuggestion {
  type: 'improvement' | 'warning' | 'insight';
  area: string;
  message: string;
  priority: 'high' | 'medium' | 'low';
  suggestedChange?: string;
}

/**
 * Marketing audience segment
 * @odoo mailing.list + res.partner.category
 * @ai_agents AdsBot, Echo
 */
export interface AudienceSegment extends BaseEntity {
  name: string;
  description?: string;
  segmentType: AudienceSegmentType;

  // Dynamic vs Static
  isDynamic: boolean;
  criteria?: SegmentCriteria;

  // Member count
  memberCount: number;
  memberCountUpdatedAt?: Date;

  // Opt-in
  doubleOptinRequired: boolean;
  isSuppressionList: boolean;

  tags: string[];
  createdBy: string;
}

/**
 * Segment qualification criteria
 */
export interface SegmentCriteria {
  operator: 'AND' | 'OR';
  conditions: SegmentCondition[];
}

export interface SegmentCondition {
  field: string;
  op: '=' | '!=' | '>' | '>=' | '<' | '<=' | 'in' | 'not_in' | 'contains' | 'starts_with' | 'ends_with';
  value: string | number | boolean | string[] | number[];
}

/**
 * Marketing automation journey
 * @odoo marketing.campaign + marketing.activity
 * @ai_agents AdsBot, Echo
 */
export interface Journey extends BaseEntity {
  campaignId?: string;

  name: string;
  description?: string;
  status: CampaignStatus;

  // Entry criteria
  entryTrigger: EventTriggerType;
  entrySegmentId?: string;
  entryCriteria: Record<string, unknown>;

  // Exit criteria
  exitCriteria: Record<string, unknown>;

  // Timing
  scheduledStart?: Date;
  scheduledEnd?: Date;

  // Limits
  maxEntriesPerContact: number;
  reEntryWaitDays: number;

  // Stats
  totalEntered: number;
  totalCompleted: number;
  totalExited: number;

  createdBy: string;
}

/**
 * Journey step configuration
 * @odoo marketing.activity
 * @ai_agents AdsBot, Echo
 */
export interface JourneyStep extends BaseEntity {
  journeyId: string;

  // Position
  stepOrder: number;
  name: string;
  stepType: JourneyStepType;

  // Configuration
  config: JourneyStepConfig;

  // Branching
  parentStepId?: string;
  branchLabel?: string;

  // Stats
  totalReached: number;
  totalCompleted: number;
}

/**
 * Journey step configuration by type
 */
export type JourneyStepConfig =
  | SendEmailConfig
  | SendSmsConfig
  | WaitTimeConfig
  | WaitEventConfig
  | ConditionSplitConfig
  | RandomSplitConfig
  | UpdateContactConfig
  | WebhookConfig;

export interface SendEmailConfig {
  type: 'send_email';
  creativeId: string;
  fromName: string;
  fromEmail: string;
  replyTo?: string;
}

export interface SendSmsConfig {
  type: 'send_sms';
  message: string;
  senderId?: string;
}

export interface WaitTimeConfig {
  type: 'wait_time';
  durationValue: number;
  durationUnit: 'minutes' | 'hours' | 'days' | 'weeks';
}

export interface WaitEventConfig {
  type: 'wait_event';
  eventType: MarketingEventType;
  timeoutHours: number;
}

export interface ConditionSplitConfig {
  type: 'condition_split';
  branches: {
    name: string;
    criteria?: Record<string, unknown>;
    default?: boolean;
  }[];
}

export interface RandomSplitConfig {
  type: 'random_split';
  splits: {
    name: string;
    percentage: number;
  }[];
}

export interface UpdateContactConfig {
  type: 'update_contact';
  updates: Record<string, unknown>;
}

export interface WebhookConfig {
  type: 'webhook';
  url: string;
  method: 'GET' | 'POST' | 'PUT';
  headers?: Record<string, string>;
  payload?: Record<string, unknown>;
}

// =============================================================================
// EVENT & TRACKING ENTITIES
// =============================================================================

/**
 * Unified marketing event log
 * @odoo mail.mail.statistics + website.track
 * @ai_agents Echo, CESAI
 */
export interface MarketingEvent extends BaseEntity {
  // Event identification
  eventType: MarketingEventType;
  eventTimestamp: Date;

  // Source attribution
  campaignId?: string;
  creativeId?: string;
  journeyId?: string;
  journeyStepId?: string;

  // Contact
  contactId?: string;
  contactEmail?: string;

  // UTM
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;

  // Event details
  eventData: Record<string, unknown>;

  // Device/client info
  ipAddress?: string;
  userAgent?: string;
  deviceType?: string;

  processedAt?: Date;
}

/**
 * Idempotent send tracking
 * @odoo mail.mail.statistics
 * @ai_agents AdsBot, TestSprite
 */
export interface SendLog extends BaseEntity {
  // Idempotency key: campaign_id:contact_id:creative_id:date
  idempotencyKey: string;

  campaignId: string;
  creativeId: string;
  contactId: string;
  contactEmail: string;
  channel: ChannelType;

  // Status
  status: 'queued' | 'sending' | 'sent' | 'delivered' | 'bounced' | 'failed' | 'cancelled';

  // Timing
  queuedAt: Date;
  sentAt?: Date;
  deliveredAt?: Date;

  // Error handling
  errorCode?: string;
  errorMessage?: string;
  retryCount: number;
  nextRetryAt?: Date;

  // Provider
  provider?: string;
  providerMessageId?: string;
}

// =============================================================================
// PROMOTION ENTITIES
// =============================================================================

/**
 * Marketing promotion/coupon
 * @odoo sale.coupon.program + loyalty.program
 * @ai_agents AdsBot, CESAI
 */
export interface Promotion extends BaseEntity {
  campaignId?: string;

  name: string;
  code: string;
  promotionType: PromotionType;

  // Value
  discountValue?: number;
  discountPercentage?: number;
  maxDiscountAmount?: number;
  currency: string;

  // Conditions
  minPurchaseAmount?: number;
  applicableProducts: string[];
  applicableCategories: string[];
  excludedProducts: string[];

  // Limits
  totalUsageLimit?: number;
  perCustomerLimit: number;
  currentUsageCount: number;

  // Validity
  validFrom: Date;
  validUntil: Date;
  isActive: boolean;

  // Targeting
  eligibleSegmentIds: string[];
  isFirstPurchaseOnly: boolean;

  // Stacking
  isStackable: boolean;
  priority: number;

  // Tracking
  totalDiscountGiven: number;
  totalOrdersWithPromo: number;

  createdBy: string;
}

// =============================================================================
// EFFECTIVENESS ENTITIES
// =============================================================================

/**
 * Aggregated campaign metrics
 * @odoo mail.mass_mailing.report + utm.mixin
 * @ai_agents CESAI, TestSprite
 */
export interface CampaignMetrics extends BaseEntity {
  campaignId: string;

  // Time dimension
  date: string; // YYYY-MM-DD
  channel: ChannelType;

  // Reach
  sends: number;
  delivered: number;
  bounced: number;
  impressions: number;
  reach: number;

  // Engagement
  opens: number;
  uniqueOpens: number;
  clicks: number;
  uniqueClicks: number;
  unsubscribes: number;
  complaints: number;

  // Video
  videoViews: number;
  videoCompletions: number;

  // Social
  likes: number;
  shares: number;
  comments: number;

  // Conversions
  conversions: number;
  conversionValue: number;

  // Costs
  costActual: number;

  // Computed rates
  deliveryRate?: number;
  openRate?: number;
  clickRate?: number;
  conversionRate?: number;
  ctr?: number;
  roi?: number;
}

/**
 * 8-Dimensional effectiveness scores
 * @ai_agent CESAI
 */
export interface DimensionScores {
  /** Innovation/Risk-taking (0-1) */
  disruption: number;
  /** Award recognition likelihood (0-1) */
  performancePredictors: number;
  /** Narrative impact (0-1) */
  storytelling: number;
  /** Local/Global context fit (0-1) */
  culturalRelevance: number;
  /** Purpose/CSR authenticity (0-1) */
  csrAuthenticity: number;
  /** Technology utilization (0-1) */
  technologyIntegration: number;
  /** Cross-platform consistency (0-1) */
  platformIntegration: number;
  /** AI/Personalization usage (0-1) */
  aiPersonalization: number;
}

/**
 * CES analysis result
 * @ai_agents CESAI, Marian
 */
export interface CESAnalysis extends BaseEntity {
  campaignId?: string;
  creativeId?: string;

  // Analysis type
  analysisType: 'pre_launch' | 'in_flight' | 'post_campaign' | 'benchmark';

  // Core scores
  cesScore: number;
  cesTier: CESTier;
  confidence: number;

  // 8-Dimensional framework
  dimensionScores: DimensionScores;

  // Component scores (0-100)
  messageClarityScore: number;
  callToActionScore: number;
  emotionalImpactScore: number;
  visualDistinctivenessScore: number;
  brandConsistencyScore: number;

  // Benchmarks
  categoryBenchmark?: number;
  categoryPercentile?: number;
  brandBenchmark?: number;

  // Predictions
  awardLikelihood?: number;
  predictedRoi?: number;
  predictedEngagementRate?: number;

  // Insights
  insights: CESInsight[];
  recommendations: CESRecommendation[];
  semanticTags: string[];

  // Source
  dataSources: ('ph_awards' | 'warc' | 'validated')[];

  analyzedBy: string;
  analyzedAt: Date;
}

export interface CESInsight {
  type: 'trend' | 'opportunity' | 'risk' | 'benchmark';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  dimension?: keyof DimensionScores;
}

export interface CESRecommendation {
  area: string;
  action: string;
  expectedImpact: string;
  priority: 'high' | 'medium' | 'low';
  effort: 'low' | 'medium' | 'high';
}

// =============================================================================
// EXPERIMENT ENTITIES
// =============================================================================

/**
 * A/B test experiment
 * @ai_agents TestSprite, CESAI
 */
export interface Experiment extends BaseEntity {
  campaignId: string;

  name: string;
  description?: string;
  hypothesis?: string;
  status: ExperimentStatus;

  // Configuration
  testType: 'ab_test' | 'multivariate' | 'split_url' | 'holdout';
  primaryMetric: MetricType;
  secondaryMetrics: MetricType[];

  // Statistical settings
  confidenceLevel: number;
  minimumDetectableEffect: number;
  sampleSizeRequired?: number;

  // Traffic allocation
  trafficPercentage: number;

  // Results
  winningVariantId?: string;
  statisticalSignificance?: number;
  lift?: number;

  // Timing
  startedAt?: Date;
  endedAt?: Date;

  createdBy: string;
}

/**
 * A/B test variant
 * @ai_agent TestSprite
 */
export interface ExperimentVariant extends BaseEntity {
  experimentId: string;

  name: string;
  isControl: boolean;
  creativeId?: string;
  config: Record<string, unknown>;

  // Traffic
  trafficWeight: number;

  // Results
  sampleSize: number;
  conversions: number;
  conversionRate?: number;
  primaryMetricValue?: number;
  secondaryMetrics: Record<MetricType, number>;
}

/**
 * Statistical analysis results
 */
export interface StatisticalAnalysis {
  isSignificant: boolean;
  confidence: number;
  pValue: number;
  lift: number;
  liftConfidenceInterval: [number, number];
  winner?: string;
  recommendation: string;
}

// =============================================================================
// CONNECTOR ENTITIES
// =============================================================================

/**
 * External service connector
 * @ai_agent AdsBot
 */
export interface Connector extends BaseEntity {
  name: string;
  connectorType: ConnectorType;
  status: ConnectorStatus;

  // Credentials (encrypted in storage)
  credentials: EncryptedCredentials;

  // Configuration
  config: ConnectorConfig;

  // Rate limiting
  rateLimitPerSecond?: number;
  rateLimitPerDay?: number;
  currentDailyUsage: number;
  usageResetAt?: Date;

  // Health
  lastHealthCheck?: Date;
  healthCheckUrl?: string;
  lastError?: string;
  errorCount: number;

  // Backoff
  backoffUntil?: Date;

  createdBy: string;
}

export interface EncryptedCredentials {
  apiKey?: string;
  apiSecret?: string;
  accessToken?: string;
  refreshToken?: string;
  username?: string;
  password?: string;
}

export type ConnectorConfig =
  | SMTPConfig
  | SMSGatewayConfig
  | SocialConfig
  | WebhookConfig;

export interface SMTPConfig {
  type: 'smtp';
  host: string;
  port: number;
  encryption: 'none' | 'ssl' | 'tls';
  fromEmail: string;
  fromName: string;
  dailyLimit?: number;
}

export interface SMSGatewayConfig {
  type: 'sms_gateway';
  provider: 'twilio' | 'nexmo' | 'plivo' | 'other';
  senderId: string;
  quietHoursStart?: string;
  quietHoursEnd?: string;
  quietHoursTimezone?: string;
}

export interface SocialConfig {
  type: 'social';
  platform: 'facebook' | 'instagram' | 'twitter_x' | 'linkedin';
  pageId?: string;
  accountId?: string;
}

// =============================================================================
// BRAND ENTITY
// =============================================================================

/**
 * Brand/advertiser definition
 * @odoo res.partner
 */
export interface Brand extends BaseEntity {
  name: string;
  code: string;
  industry?: string;

  logoUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
  brandGuidelinesUrl?: string;

  voiceAttributes: BrandVoiceAttributes;
  isActive: boolean;
}

/**
 * Brand voice characteristics for Marian
 */
export interface BrandVoiceAttributes {
  tone: string[];
  personality: string[];
  vocabulary: {
    preferred: string[];
    avoided: string[];
  };
  styleGuide?: string;
}

// =============================================================================
// APPROVAL WORKFLOW
// =============================================================================

/**
 * Approval audit trail
 * @ai_agent TestSprite
 */
export interface ApprovalWorkflow extends BaseEntity {
  entityType: 'campaign' | 'creative' | 'journey' | 'promotion';
  entityId: string;

  fromStatus: ApprovalStatus;
  toStatus: ApprovalStatus;

  performedBy: string;
  performedAt: Date;
  comment?: string;
}

// =============================================================================
// REQUEST/RESPONSE TYPES
// =============================================================================

/**
 * Campaign creation request
 */
export interface CreateCampaignRequest {
  name: string;
  type: CampaignType;
  brandId: string;
  workspaceId: string;
  scheduledStart?: Date;
  scheduledEnd?: Date;
  budgetPlanned?: number;
  audienceSegmentIds?: string[];
  channelIds?: ChannelType[];
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  tags?: string[];
  metadata?: Record<string, unknown>;
}

export interface CreateCampaignResponse {
  campaign: Campaign;
}

/**
 * CES analysis request
 */
export interface AnalyzeCESRequest {
  campaignId?: string;
  creativeId?: string;
  analysisType: 'pre_launch' | 'in_flight' | 'post_campaign';
  includeBenchmarks?: boolean;
  benchmarkCategory?: string;
}

export interface AnalyzeCESResponse {
  analysis: CESAnalysis;
  benchmarks?: {
    categoryAvg: number;
    categoryTopQuartile: number;
    brandAvg: number;
  };
  similarCampaigns?: Campaign[];
}

/**
 * Campaign metrics request
 */
export interface GetCampaignMetricsRequest {
  campaignId: string;
  dateFrom?: string;
  dateTo?: string;
  granularity?: 'hour' | 'day' | 'week' | 'month';
  channels?: ChannelType[];
}

export interface GetCampaignMetricsResponse {
  summary: {
    totalSends: number;
    totalDelivered: number;
    totalOpens: number;
    totalClicks: number;
    totalConversions: number;
    totalRevenue: number;
    totalCost: number;
    deliveryRate: number;
    openRate: number;
    clickRate: number;
    conversionRate: number;
    roi: number;
  };
  timeSeries: CampaignMetrics[];
  byChannel: Record<ChannelType, CampaignMetrics>;
}

/**
 * Creative variant generation request
 */
export interface GenerateVariantsRequest {
  creativeId: string;
  numVariants: number;
  focusAreas?: ('subject_line' | 'cta' | 'body' | 'imagery')[];
  brandVoiceEmphasis?: number;
  creativityLevel?: number;
}

export interface GenerateVariantsResponse {
  variants: Creative[];
  generationMetadata: {
    modelVersion: string;
    generationTimeMs: number;
    confidenceScores: number[];
  };
}

/**
 * Experiment results response
 */
export interface GetExperimentResultsResponse {
  experiment: Experiment;
  variants: ExperimentVariant[];
  statisticalAnalysis: StatisticalAnalysis;
}

/**
 * Campaign export request
 */
export interface ExportCampaignReportRequest {
  campaignId: string;
  format: 'csv' | 'pdf' | 'xlsx';
  sections?: ('summary' | 'metrics' | 'ces' | 'timeline' | 'creatives')[];
  dateFrom?: string;
  dateTo?: string;
}

export interface ExportCampaignReportResponse {
  downloadUrl: string;
  expiresAt: Date;
}

// =============================================================================
// AI AGENT INTERFACES
// =============================================================================

/**
 * AdsBot agent interface
 * Campaign Operations Agent
 */
export interface AdsBotAgent {
  buildSegment(criteria: SegmentCriteria): Promise<AudienceSegment>;
  compileJourney(journey: Partial<Journey>): Promise<Journey>;
  schedulesSends(campaignId: string, scheduledTime: Date): Promise<void>;
  logOutcome(event: Partial<MarketingEvent>): Promise<void>;
}

/**
 * Marian agent interface
 * Creative & Copy Agent
 */
export interface MarianAgent {
  generateEmailVariants(baseCreative: Creative, count: number): Promise<Creative[]>;
  generateSMSCopy(context: { brand: Brand; message: string }): Promise<string[]>;
  generateSocialPosts(context: { brand: Brand; topic: string; platforms: ChannelType[] }): Promise<Record<ChannelType, string>>;
  optimizeSubjectLine(subjectLine: string, brand: Brand): Promise<string[]>;
  enforceBrandVoice(content: string, brand: Brand): Promise<{ content: string; score: number }>;
}

/**
 * Echo agent interface
 * Signal & Triggering Agent
 */
export interface EchoAgent {
  processEvent(event: MarketingEvent): Promise<void>;
  evaluateTrigger(trigger: EventTriggerType, context: Record<string, unknown>): Promise<boolean>;
  extractIntent(text: string): Promise<{ intent: string; confidence: number }>;
  progressJourney(contactId: string, journeyId: string): Promise<void>;
}

/**
 * CESAI agent interface
 * Effectiveness & ROI Agent
 */
export interface CESAIAgent {
  calculateCESScore(creative: Creative, metrics?: CampaignMetrics): Promise<number>;
  analyzeDimensions(campaignId: string): Promise<DimensionScores>;
  computeAttribution(events: MarketingEvent[], model: AttributionModel): Promise<Record<string, number>>;
  estimateUplift(campaignId: string): Promise<{ lift: number; confidence: number }>;
  predictAwardLikelihood(cesAnalysis: CESAnalysis): Promise<number>;
}

/**
 * TestSprite agent interface
 * QA & Experiments Agent
 */
export interface TestSpriteAgent {
  createExperiment(config: Partial<Experiment>): Promise<Experiment>;
  computeStatistics(experiment: Experiment): Promise<StatisticalAnalysis>;
  validateTemplate(creative: Creative): Promise<{ valid: boolean; issues: string[] }>;
  checkLinkIntegrity(creative: Creative): Promise<{ brokenLinks: string[]; valid: boolean }>;
  testDeliverability(creative: Creative): Promise<{ spamScore: number; issues: string[] }>;
}

// =============================================================================
// UTILITY TYPES
// =============================================================================

/**
 * Pagination parameters
 */
export interface PaginationParams {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * Paginated response
 */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    totalPages: number;
    totalCount: number;
  };
}

/**
 * Date range filter
 */
export interface DateRangeFilter {
  from?: Date;
  to?: Date;
}

/**
 * Generic filter operators
 */
export interface FilterOperators<T> {
  eq?: T;
  neq?: T;
  gt?: T;
  gte?: T;
  lt?: T;
  lte?: T;
  in?: T[];
  notIn?: T[];
  contains?: string;
  startsWith?: string;
  endsWith?: string;
}

/**
 * Async job reference
 */
export interface JobReference {
  jobId: string;
  status: 'queued' | 'running' | 'completed' | 'failed';
  progress?: number;
  estimatedCompletion?: Date;
}
