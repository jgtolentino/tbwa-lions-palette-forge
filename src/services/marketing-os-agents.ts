/**
 * Marketing OS AI Agent Integration Service
 *
 * Maps AI agents to Marketing OS capabilities for campaign intelligence:
 * - AdsBot: Campaign Operations
 * - Marian: Creative & Copy
 * - Echo: Signal & Triggering
 * - CESAI: Effectiveness & ROI
 * - TestSprite: QA & Experiments
 *
 * @version 1.0.0
 */

import type {
  Campaign,
  Creative,
  AudienceSegment,
  Journey,
  JourneyStep,
  MarketingEvent,
  CESAnalysis,
  Experiment,
  ExperimentVariant,
  DimensionScores,
  SegmentCriteria,
  Brand,
  CampaignMetrics,
  CESTier,
  AttributionModel,
  StatisticalAnalysis,
  ChannelType,
} from '@/types/marketing-os';

// =============================================================================
// AI AGENT CONFIGURATION
// =============================================================================

export interface AgentConfig {
  name: string;
  description: string;
  capabilities: string[];
  ownedEntities: string[];
  odooMapping: string[];
  ocaModules: string[];
  endpoints: string[];
}

export const AI_AGENTS: Record<string, AgentConfig> = {
  AdsBot: {
    name: 'AdsBot',
    description: 'Campaign Operations Agent - Builds segments, compiles journeys, schedules sends, logs outcomes',
    capabilities: [
      'build_segments',
      'compile_journeys',
      'schedule_sends',
      'log_outcomes',
      'manage_promotions',
      'channel_orchestration',
    ],
    ownedEntities: [
      'campaign',
      'journey',
      'journey_step',
      'audience_segment',
      'send_log',
      'promotion',
    ],
    odooMapping: [
      'mail.mass_mailing',
      'marketing.campaign',
      'marketing.activity',
      'mailing.list',
    ],
    ocaModules: ['mass-mailing', 'social'],
    endpoints: [
      '/api/campaigns',
      '/api/segments',
      '/api/journeys',
      '/api/send',
    ],
  },

  Marian: {
    name: 'Marian',
    description: 'Creative & Copy Agent - Generates variants, optimizes copy, enforces brand voice',
    capabilities: [
      'generate_email_variants',
      'generate_sms_copy',
      'generate_social_posts',
      'subject_line_optimization',
      'cta_optimization',
      'brand_voice_enforcement',
      'content_localization',
    ],
    ownedEntities: ['creative'],
    odooMapping: ['mail.mass_mailing', 'mail.template'],
    ocaModules: ['mass-mailing'],
    endpoints: [
      '/api/creatives',
      '/api/creatives/generate-variants',
    ],
  },

  Echo: {
    name: 'Echo',
    description: 'Signal & Triggering Agent - Processes events, evaluates triggers, extracts intent',
    capabilities: [
      'event_processing',
      'trigger_evaluation',
      'intent_extraction',
      'journey_progression',
      'real_time_personalization',
    ],
    ownedEntities: ['marketing_event', 'journey_step'],
    odooMapping: [
      'marketing.automation.trigger',
      'website.track',
      'utm.mixin',
    ],
    ocaModules: ['mass-mailing'],
    endpoints: [
      '/api/events',
      '/api/triggers',
      '/api/journeys/progress',
    ],
  },

  CESAI: {
    name: 'CESAI',
    description: 'Effectiveness & ROI Agent - Computes CES, attribution, uplift, trend analysis',
    capabilities: [
      'ces_scoring',
      'dimension_analysis',
      'attribution_modeling',
      'uplift_estimation',
      'trend_analysis',
      'benchmark_comparison',
      'roi_calculation',
      'award_likelihood_prediction',
    ],
    ownedEntities: ['ces_analysis', 'campaign_metrics'],
    odooMapping: ['mail.mass_mailing.report', 'utm.mixin'],
    ocaModules: [],
    endpoints: [
      '/api/ces/analyze',
      '/api/ces/insights',
      '/api/campaigns/metrics',
    ],
  },

  TestSprite: {
    name: 'TestSprite',
    description: 'QA & Experiments Agent - A/B testing, validation, deliverability, approval workflow',
    capabilities: [
      'ab_test_management',
      'statistical_analysis',
      'template_validation',
      'link_integrity_check',
      'deliverability_testing',
      'approval_workflow',
      'regression_detection',
    ],
    ownedEntities: ['experiment', 'experiment_variant', 'approval_workflow'],
    odooMapping: [],
    ocaModules: [],
    endpoints: [
      '/api/experiments',
      '/api/experiments/results',
      '/api/creatives/validate',
    ],
  },
};

// =============================================================================
// ADSBOT AGENT SERVICE
// =============================================================================

export class AdsBotService {
  /**
   * Build a new audience segment from criteria
   */
  async buildSegment(
    tenantId: string,
    name: string,
    criteria: SegmentCriteria
  ): Promise<AudienceSegment> {
    // Validate criteria
    this.validateSegmentCriteria(criteria);

    const segment: Partial<AudienceSegment> = {
      tenantId,
      name,
      isDynamic: true,
      criteria,
      memberCount: 0,
      doubleOptinRequired: true,
      isSuppressionList: false,
      tags: [],
      segmentType: this.inferSegmentType(criteria),
    };

    // In production: POST to /api/segments
    console.log('[AdsBot] Building segment:', name);
    return segment as AudienceSegment;
  }

  /**
   * Compile journey from steps
   */
  async compileJourney(
    tenantId: string,
    journey: Partial<Journey>,
    steps: Partial<JourneyStep>[]
  ): Promise<{ journey: Journey; steps: JourneyStep[] }> {
    // Validate journey structure
    if (!journey.entryTrigger) {
      throw new Error('Journey must have an entry trigger');
    }

    if (steps.length === 0) {
      throw new Error('Journey must have at least one step');
    }

    // Validate step ordering and branching
    this.validateJourneySteps(steps);

    console.log('[AdsBot] Compiling journey:', journey.name);
    return {
      journey: journey as Journey,
      steps: steps as JourneyStep[],
    };
  }

  /**
   * Schedule campaign sends
   */
  async scheduleSends(
    campaignId: string,
    scheduledTime: Date,
    segmentIds: string[]
  ): Promise<{ jobId: string; queuedCount: number; estimatedCompletion: Date }> {
    if (scheduledTime <= new Date()) {
      throw new Error('Scheduled time must be in the future');
    }

    console.log('[AdsBot] Scheduling sends for campaign:', campaignId);

    return {
      jobId: crypto.randomUUID(),
      queuedCount: 0, // Would be calculated from segment sizes
      estimatedCompletion: new Date(scheduledTime.getTime() + 3600000), // +1 hour
    };
  }

  /**
   * Log marketing outcome event
   */
  async logOutcome(event: Partial<MarketingEvent>): Promise<void> {
    if (!event.eventType || !event.eventTimestamp) {
      throw new Error('Event must have type and timestamp');
    }

    console.log('[AdsBot] Logging outcome:', event.eventType);
    // In production: POST to /api/events
  }

  private validateSegmentCriteria(criteria: SegmentCriteria): void {
    if (!criteria.operator || !criteria.conditions) {
      throw new Error('Invalid segment criteria structure');
    }

    if (criteria.conditions.length === 0) {
      throw new Error('Segment must have at least one condition');
    }
  }

  private validateJourneySteps(steps: Partial<JourneyStep>[]): void {
    const orders = new Set<number>();
    for (const step of steps) {
      if (step.stepOrder !== undefined) {
        if (orders.has(step.stepOrder)) {
          throw new Error('Duplicate step order detected');
        }
        orders.add(step.stepOrder);
      }
    }
  }

  private inferSegmentType(criteria: SegmentCriteria): AudienceSegment['segmentType'] {
    const fields = criteria.conditions.map(c => c.field.toLowerCase());

    if (fields.some(f => ['age', 'gender', 'location', 'country'].includes(f))) {
      return 'demographic';
    }
    if (fields.some(f => ['purchase', 'order', 'ltv', 'aov'].includes(f))) {
      return 'transactional';
    }
    if (fields.some(f => ['click', 'open', 'visit', 'engagement'].includes(f))) {
      return 'behavioral';
    }

    return 'behavioral';
  }
}

// =============================================================================
// MARIAN AGENT SERVICE
// =============================================================================

export class MarianService {
  /**
   * Generate email creative variants
   */
  async generateEmailVariants(
    baseCreative: Creative,
    count: number,
    options: {
      focusAreas?: ('subject_line' | 'cta' | 'body' | 'imagery')[];
      brandVoiceEmphasis?: number;
      creativityLevel?: number;
    } = {}
  ): Promise<Creative[]> {
    const { focusAreas = ['subject_line', 'cta'], creativityLevel = 0.5 } = options;

    console.log('[Marian] Generating', count, 'variants for:', baseCreative.name);
    console.log('[Marian] Focus areas:', focusAreas.join(', '));

    const variants: Creative[] = [];

    for (let i = 0; i < count; i++) {
      const variant: Partial<Creative> = {
        ...baseCreative,
        id: crypto.randomUUID(),
        name: `${baseCreative.name} - Variant ${String.fromCharCode(65 + i)}`,
        variantGroupId: baseCreative.variantGroupId || baseCreative.id,
        variantLabel: `Variant ${String.fromCharCode(65 + i)}`,
        variantWeight: 100 / (count + 1),
        approvalStatus: 'not_submitted',
      };

      // Generate variations based on focus areas
      if (focusAreas.includes('subject_line') && baseCreative.subjectLine) {
        variant.subjectLine = this.generateSubjectLineVariant(
          baseCreative.subjectLine,
          creativityLevel
        );
      }

      if (focusAreas.includes('cta') && baseCreative.ctaText) {
        variant.ctaText = this.generateCTAVariant(baseCreative.ctaText);
      }

      variants.push(variant as Creative);
    }

    return variants;
  }

  /**
   * Generate SMS copy options
   */
  async generateSMSCopy(
    brand: Brand,
    message: string,
    options: { maxLength?: number; count?: number } = {}
  ): Promise<string[]> {
    const { maxLength = 160, count = 3 } = options;

    console.log('[Marian] Generating SMS copy for:', brand.name);

    // Simulated variants - in production would use LLM
    const variants: string[] = [];
    for (let i = 0; i < count; i++) {
      variants.push(this.truncateToLength(message, maxLength));
    }

    return variants;
  }

  /**
   * Generate social media posts
   */
  async generateSocialPosts(
    brand: Brand,
    topic: string,
    platforms: ChannelType[]
  ): Promise<Record<ChannelType, string>> {
    console.log('[Marian] Generating social posts for:', platforms.join(', '));

    const posts: Partial<Record<ChannelType, string>> = {};

    for (const platform of platforms) {
      posts[platform] = this.generatePlatformPost(topic, platform, brand);
    }

    return posts as Record<ChannelType, string>;
  }

  /**
   * Optimize subject line
   */
  async optimizeSubjectLine(
    subjectLine: string,
    brand: Brand
  ): Promise<{ optimized: string[]; scores: number[] }> {
    console.log('[Marian] Optimizing subject line');

    const optimized = [
      subjectLine,
      this.generateSubjectLineVariant(subjectLine, 0.3),
      this.generateSubjectLineVariant(subjectLine, 0.6),
    ];

    return {
      optimized,
      scores: optimized.map(() => Math.random() * 0.3 + 0.7), // 0.7-1.0
    };
  }

  /**
   * Enforce brand voice on content
   */
  async enforceBrandVoice(
    content: string,
    brand: Brand
  ): Promise<{ content: string; score: number; suggestions: string[] }> {
    console.log('[Marian] Enforcing brand voice for:', brand.name);

    // Simulated brand voice analysis
    const score = Math.random() * 0.3 + 0.7;
    const suggestions: string[] = [];

    if (score < 0.8) {
      suggestions.push('Consider using more brand-aligned terminology');
    }

    return {
      content,
      score,
      suggestions,
    };
  }

  private generateSubjectLineVariant(original: string, creativity: number): string {
    // Simulated variant generation
    const prefixes = ['🎯 ', '⚡ ', '✨ ', ''];
    const prefix = creativity > 0.5 ? prefixes[Math.floor(Math.random() * prefixes.length)] : '';
    return prefix + original;
  }

  private generateCTAVariant(original: string): string {
    const alternatives: Record<string, string[]> = {
      'Buy Now': ['Shop Now', 'Get Yours', 'Order Today'],
      'Learn More': ['Discover More', 'Find Out More', 'Explore'],
      'Sign Up': ['Join Now', 'Get Started', 'Register Free'],
    };

    return alternatives[original]?.[Math.floor(Math.random() * 3)] || original;
  }

  private truncateToLength(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength - 3) + '...';
  }

  private generatePlatformPost(
    topic: string,
    platform: ChannelType,
    brand: Brand
  ): string {
    const limits: Record<string, number> = {
      twitter_x: 280,
      instagram: 2200,
      facebook: 63206,
      linkedin: 3000,
    };

    const limit = limits[platform] || 500;
    return this.truncateToLength(`${topic} - ${brand.name}`, limit);
  }
}

// =============================================================================
// ECHO AGENT SERVICE
// =============================================================================

export class EchoService {
  /**
   * Process marketing event
   */
  async processEvent(event: MarketingEvent): Promise<{
    processed: boolean;
    triggeredActions: string[];
  }> {
    console.log('[Echo] Processing event:', event.eventType);

    const triggeredActions: string[] = [];

    // Check for journey triggers
    if (['email_clicked', 'form_submit', 'purchase_completed'].includes(event.eventType)) {
      triggeredActions.push('journey_progression');
    }

    // Check for segment membership changes
    if (event.eventType === 'purchase_completed') {
      triggeredActions.push('segment_evaluation');
    }

    return {
      processed: true,
      triggeredActions,
    };
  }

  /**
   * Evaluate trigger condition
   */
  async evaluateTrigger(
    trigger: MarketingEvent['eventType'],
    context: Record<string, unknown>
  ): Promise<{ matches: boolean; confidence: number }> {
    console.log('[Echo] Evaluating trigger:', trigger);

    // Simulated trigger evaluation
    const matches = Math.random() > 0.3;

    return {
      matches,
      confidence: matches ? Math.random() * 0.3 + 0.7 : Math.random() * 0.3,
    };
  }

  /**
   * Extract intent from text
   */
  async extractIntent(text: string): Promise<{
    intent: string;
    confidence: number;
    entities: Record<string, string>;
  }> {
    console.log('[Echo] Extracting intent from:', text.slice(0, 50));

    // Simulated intent extraction
    const intents = ['purchase', 'inquiry', 'support', 'feedback', 'unsubscribe'];
    const intent = intents[Math.floor(Math.random() * intents.length)];

    return {
      intent,
      confidence: Math.random() * 0.3 + 0.7,
      entities: {},
    };
  }

  /**
   * Progress contact through journey
   */
  async progressJourney(
    contactId: string,
    journeyId: string,
    currentStepId: string
  ): Promise<{
    nextStepId: string | null;
    action: string;
    completed: boolean;
  }> {
    console.log('[Echo] Progressing journey for contact:', contactId);

    return {
      nextStepId: null, // Would be determined by journey logic
      action: 'wait_event',
      completed: false,
    };
  }
}

// =============================================================================
// CESAI AGENT SERVICE
// =============================================================================

export class CESAIService {
  /**
   * Calculate Creative Effectiveness Score
   */
  async calculateCESScore(
    creative: Creative,
    metrics?: CampaignMetrics
  ): Promise<{
    cesScore: number;
    cesTier: CESTier;
    confidence: number;
  }> {
    console.log('[CESAI] Calculating CES for:', creative.name);

    // Base score from creative quality
    let score = 50;

    // Add points for quality indicators
    if (creative.aiQualityScore) {
      score += creative.aiQualityScore * 0.2;
    }
    if (creative.brandVoiceScore) {
      score += creative.brandVoiceScore * 0.1;
    }

    // Add points from metrics if available
    if (metrics) {
      if (metrics.openRate) score += metrics.openRate * 10;
      if (metrics.clickRate) score += metrics.clickRate * 15;
      if (metrics.conversionRate) score += metrics.conversionRate * 20;
    }

    // Normalize to 0-100
    score = Math.min(100, Math.max(0, score));

    return {
      cesScore: score,
      cesTier: this.getCESTier(score),
      confidence: metrics ? 0.9 : 0.6,
    };
  }

  /**
   * Analyze 8-dimensional effectiveness
   */
  async analyzeDimensions(
    campaignId: string,
    creatives: Creative[],
    metrics?: CampaignMetrics
  ): Promise<DimensionScores> {
    console.log('[CESAI] Analyzing dimensions for campaign:', campaignId);

    // Simulated dimension analysis
    // In production, this would use ML models trained on the validated dataset
    return {
      disruption: Math.random() * 0.3 + 0.6,
      performancePredictors: Math.random() * 0.4 + 0.4,
      storytelling: Math.random() * 0.3 + 0.5,
      culturalRelevance: Math.random() * 0.3 + 0.5,
      csrAuthenticity: Math.random() * 0.4 + 0.1,
      technologyIntegration: Math.random() * 0.4 + 0.2,
      platformIntegration: Math.random() * 0.4 + 0.2,
      aiPersonalization: Math.random() * 0.3 + 0.1,
    };
  }

  /**
   * Compute multi-touch attribution
   */
  async computeAttribution(
    events: MarketingEvent[],
    model: AttributionModel
  ): Promise<Record<string, number>> {
    console.log('[CESAI] Computing attribution with model:', model);

    const attribution: Record<string, number> = {};
    const campaignIds = [...new Set(events.map(e => e.campaignId).filter(Boolean))];

    if (campaignIds.length === 0) {
      return attribution;
    }

    switch (model) {
      case 'first_touch':
        if (campaignIds[0]) {
          attribution[campaignIds[0]] = 1.0;
        }
        break;

      case 'last_touch':
        if (campaignIds[campaignIds.length - 1]) {
          attribution[campaignIds[campaignIds.length - 1]] = 1.0;
        }
        break;

      case 'linear':
        const share = 1.0 / campaignIds.length;
        for (const id of campaignIds) {
          if (id) attribution[id] = share;
        }
        break;

      case 'position_based':
        // 40% first, 40% last, 20% distributed middle
        if (campaignIds.length >= 2) {
          if (campaignIds[0]) attribution[campaignIds[0]] = 0.4;
          if (campaignIds[campaignIds.length - 1]) {
            attribution[campaignIds[campaignIds.length - 1]] = 0.4;
          }
          const middleShare = 0.2 / Math.max(1, campaignIds.length - 2);
          for (let i = 1; i < campaignIds.length - 1; i++) {
            if (campaignIds[i]) attribution[campaignIds[i]] = middleShare;
          }
        } else if (campaignIds[0]) {
          attribution[campaignIds[0]] = 1.0;
        }
        break;

      default:
        // Default to linear
        const defaultShare = 1.0 / campaignIds.length;
        for (const id of campaignIds) {
          if (id) attribution[id] = defaultShare;
        }
    }

    return attribution;
  }

  /**
   * Estimate uplift from campaign
   */
  async estimateUplift(
    campaignId: string,
    metrics: CampaignMetrics
  ): Promise<{
    lift: number;
    confidence: number;
    baseline: number;
    treatment: number;
  }> {
    console.log('[CESAI] Estimating uplift for campaign:', campaignId);

    // Simulated uplift calculation
    const baseline = 0.02; // 2% baseline conversion
    const treatment = baseline * (1 + Math.random() * 0.5); // 0-50% lift
    const lift = (treatment - baseline) / baseline;

    return {
      lift,
      confidence: Math.random() * 0.2 + 0.8,
      baseline,
      treatment,
    };
  }

  /**
   * Predict award likelihood
   */
  async predictAwardLikelihood(
    cesAnalysis: CESAnalysis
  ): Promise<{
    likelihood: number;
    category: string;
    strengths: string[];
    improvements: string[];
  }> {
    console.log('[CESAI] Predicting award likelihood');

    // Based on the 8-dimensional framework
    const dimensions = cesAnalysis.dimensionScores;
    const avgScore =
      (dimensions.disruption +
        dimensions.performancePredictors +
        dimensions.storytelling +
        dimensions.culturalRelevance) /
      4;

    const likelihood = Math.min(0.95, avgScore * 0.8 + cesAnalysis.cesScore / 200);

    const strengths: string[] = [];
    const improvements: string[] = [];

    if (dimensions.disruption > 0.7) strengths.push('High innovation');
    else if (dimensions.disruption < 0.5) improvements.push('Increase creative risk-taking');

    if (dimensions.storytelling > 0.7) strengths.push('Strong narrative');
    else if (dimensions.storytelling < 0.5) improvements.push('Strengthen storytelling');

    if (dimensions.culturalRelevance > 0.7) strengths.push('Culturally resonant');
    else if (dimensions.culturalRelevance < 0.5) improvements.push('Improve cultural relevance');

    return {
      likelihood,
      category: likelihood > 0.7 ? 'Gold' : likelihood > 0.5 ? 'Silver' : 'Bronze',
      strengths,
      improvements,
    };
  }

  /**
   * Get CES tier from score
   */
  private getCESTier(score: number): CESTier {
    if (score >= 80) return 'exceptional';
    if (score >= 70) return 'highly_effective';
    if (score >= 60) return 'effective';
    if (score >= 50) return 'moderate';
    return 'needs_improvement';
  }
}

// =============================================================================
// TESTSPRITE AGENT SERVICE
// =============================================================================

export class TestSpriteService {
  /**
   * Create A/B test experiment
   */
  async createExperiment(
    campaignId: string,
    config: Partial<Experiment>
  ): Promise<Experiment> {
    console.log('[TestSprite] Creating experiment for campaign:', campaignId);

    const experiment: Partial<Experiment> = {
      ...config,
      id: crypto.randomUUID(),
      campaignId,
      status: 'designing',
      confidenceLevel: config.confidenceLevel || 0.95,
      minimumDetectableEffect: config.minimumDetectableEffect || 0.05,
      trafficPercentage: config.trafficPercentage || 100,
    };

    return experiment as Experiment;
  }

  /**
   * Compute statistical significance
   */
  async computeStatistics(
    experiment: Experiment,
    variants: ExperimentVariant[]
  ): Promise<StatisticalAnalysis> {
    console.log('[TestSprite] Computing statistics for experiment:', experiment.id);

    if (variants.length < 2) {
      throw new Error('Need at least 2 variants for analysis');
    }

    const control = variants.find(v => v.isControl);
    const treatment = variants.find(v => !v.isControl);

    if (!control || !treatment) {
      throw new Error('Must have control and treatment variants');
    }

    // Simplified statistical calculation
    const controlRate = control.sampleSize > 0 ? control.conversions / control.sampleSize : 0;
    const treatmentRate = treatment.sampleSize > 0 ? treatment.conversions / treatment.sampleSize : 0;
    const lift = controlRate > 0 ? (treatmentRate - controlRate) / controlRate : 0;

    // Z-test approximation
    const pooledRate = (control.conversions + treatment.conversions) /
                       (control.sampleSize + treatment.sampleSize);
    const se = Math.sqrt(
      pooledRate * (1 - pooledRate) *
      (1 / control.sampleSize + 1 / treatment.sampleSize)
    );
    const z = se > 0 ? Math.abs(treatmentRate - controlRate) / se : 0;
    const pValue = Math.exp(-0.5 * z * z); // Approximation

    const isSignificant = pValue < (1 - experiment.confidenceLevel);

    return {
      isSignificant,
      confidence: 1 - pValue,
      pValue,
      lift,
      liftConfidenceInterval: [lift - 0.1, lift + 0.1], // Simplified
      winner: isSignificant ? (lift > 0 ? treatment.id : control.id) : undefined,
      recommendation: isSignificant
        ? lift > 0
          ? `Treatment variant shows ${(lift * 100).toFixed(1)}% improvement. Recommend deploying.`
          : `Control variant performs better. Recommend keeping current approach.`
        : `Results not statistically significant. Continue collecting data.`,
    };
  }

  /**
   * Validate creative template
   */
  async validateTemplate(creative: Creative): Promise<{
    valid: boolean;
    issues: ValidationIssue[];
    score: number;
  }> {
    console.log('[TestSprite] Validating template:', creative.name);

    const issues: ValidationIssue[] = [];

    // Check required fields
    if (!creative.subjectLine && creative.format === 'html_email') {
      issues.push({
        severity: 'error',
        field: 'subjectLine',
        message: 'Email must have a subject line',
      });
    }

    if (!creative.bodyHtml && !creative.bodyPlain) {
      issues.push({
        severity: 'error',
        field: 'body',
        message: 'Creative must have content',
      });
    }

    // Check subject line length
    if (creative.subjectLine && creative.subjectLine.length > 60) {
      issues.push({
        severity: 'warning',
        field: 'subjectLine',
        message: 'Subject line may be truncated on mobile',
      });
    }

    // Check CTA
    if (!creative.ctaText) {
      issues.push({
        severity: 'warning',
        field: 'ctaText',
        message: 'Missing call-to-action',
      });
    }

    const errorCount = issues.filter(i => i.severity === 'error').length;
    const warningCount = issues.filter(i => i.severity === 'warning').length;
    const score = Math.max(0, 100 - errorCount * 30 - warningCount * 10);

    return {
      valid: errorCount === 0,
      issues,
      score,
    };
  }

  /**
   * Check link integrity
   */
  async checkLinkIntegrity(creative: Creative): Promise<{
    links: LinkCheckResult[];
    brokenCount: number;
    valid: boolean;
  }> {
    console.log('[TestSprite] Checking links for:', creative.name);

    const links: LinkCheckResult[] = [];

    // Extract links from HTML
    if (creative.bodyHtml) {
      const linkRegex = /href="([^"]+)"/g;
      let match;
      while ((match = linkRegex.exec(creative.bodyHtml)) !== null) {
        links.push({
          url: match[1],
          status: 'valid', // In production, would actually check
          responseTime: Math.random() * 500,
        });
      }
    }

    // Check CTA URL
    if (creative.ctaUrl) {
      links.push({
        url: creative.ctaUrl,
        status: 'valid',
        responseTime: Math.random() * 500,
      });
    }

    const brokenCount = links.filter(l => l.status === 'broken').length;

    return {
      links,
      brokenCount,
      valid: brokenCount === 0,
    };
  }

  /**
   * Test email deliverability
   */
  async testDeliverability(creative: Creative): Promise<{
    spamScore: number;
    issues: string[];
    verdict: 'pass' | 'review' | 'fail';
  }> {
    console.log('[TestSprite] Testing deliverability for:', creative.name);

    const issues: string[] = [];
    let spamScore = 0;

    // Check for spam triggers
    if (creative.subjectLine) {
      const spamWords = ['free', 'winner', 'urgent', 'act now', 'limited'];
      for (const word of spamWords) {
        if (creative.subjectLine.toLowerCase().includes(word)) {
          spamScore += 1;
          issues.push(`Subject contains spam trigger word: "${word}"`);
        }
      }
    }

    // Check image-to-text ratio (if HTML)
    if (creative.bodyHtml) {
      const textLength = creative.bodyHtml.replace(/<[^>]*>/g, '').length;
      const imgCount = (creative.bodyHtml.match(/<img/g) || []).length;
      if (imgCount > 0 && textLength < 100) {
        spamScore += 2;
        issues.push('Low text-to-image ratio');
      }
    }

    return {
      spamScore,
      issues,
      verdict: spamScore === 0 ? 'pass' : spamScore <= 2 ? 'review' : 'fail',
    };
  }
}

interface ValidationIssue {
  severity: 'error' | 'warning' | 'info';
  field: string;
  message: string;
}

interface LinkCheckResult {
  url: string;
  status: 'valid' | 'broken' | 'redirect' | 'timeout';
  responseTime?: number;
  redirectUrl?: string;
}

// =============================================================================
// AGENT ORCHESTRATOR
// =============================================================================

/**
 * Unified agent orchestrator for Marketing OS
 */
export class MarketingOSAgentOrchestrator {
  private adsBot: AdsBotService;
  private marian: MarianService;
  private echo: EchoService;
  private cesai: CESAIService;
  private testSprite: TestSpriteService;

  constructor() {
    this.adsBot = new AdsBotService();
    this.marian = new MarianService();
    this.echo = new EchoService();
    this.cesai = new CESAIService();
    this.testSprite = new TestSpriteService();
  }

  /**
   * Get agent by name
   */
  getAgent(name: keyof typeof AI_AGENTS): unknown {
    switch (name) {
      case 'AdsBot':
        return this.adsBot;
      case 'Marian':
        return this.marian;
      case 'Echo':
        return this.echo;
      case 'CESAI':
        return this.cesai;
      case 'TestSprite':
        return this.testSprite;
      default:
        throw new Error(`Unknown agent: ${name}`);
    }
  }

  /**
   * Execute full campaign analysis workflow
   */
  async analyzeCampaign(
    campaign: Campaign,
    creatives: Creative[],
    metrics?: CampaignMetrics
  ): Promise<{
    cesAnalysis: CESAnalysis;
    validationResults: Awaited<ReturnType<TestSpriteService['validateTemplate']>>[];
    recommendations: string[];
  }> {
    console.log('[Orchestrator] Running full campaign analysis');

    // 1. Validate creatives (TestSprite)
    const validationResults = await Promise.all(
      creatives.map(c => this.testSprite.validateTemplate(c))
    );

    // 2. Calculate CES for each creative (CESAI)
    const cesScores = await Promise.all(
      creatives.map(c => this.cesai.calculateCESScore(c, metrics))
    );

    // 3. Analyze dimensions
    const dimensions = await this.cesai.analyzeDimensions(campaign.id, creatives, metrics);

    // 4. Build CES analysis
    const avgCesScore = cesScores.reduce((sum, s) => sum + s.cesScore, 0) / cesScores.length;
    const cesAnalysis: Partial<CESAnalysis> = {
      id: crypto.randomUUID(),
      tenantId: campaign.tenantId,
      campaignId: campaign.id,
      analysisType: metrics ? 'in_flight' : 'pre_launch',
      cesScore: avgCesScore,
      cesTier: cesScores[0]?.cesTier || 'moderate',
      confidence: cesScores.reduce((sum, s) => sum + s.confidence, 0) / cesScores.length,
      dimensionScores: dimensions,
      messageClarityScore: 70 + Math.random() * 20,
      callToActionScore: 70 + Math.random() * 20,
      emotionalImpactScore: 60 + Math.random() * 30,
      visualDistinctivenessScore: 65 + Math.random() * 25,
      brandConsistencyScore: 75 + Math.random() * 20,
      insights: [],
      recommendations: [],
      semanticTags: [],
      dataSources: ['validated'],
      analyzedBy: 'CESAI v1.0',
      analyzedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
      metadata: {},
    };

    // 5. Generate recommendations
    const recommendations: string[] = [];

    if (avgCesScore < 60) {
      recommendations.push('Consider revising creative strategy to improve effectiveness');
    }

    const invalidCreatives = validationResults.filter(r => !r.valid);
    if (invalidCreatives.length > 0) {
      recommendations.push(`Fix validation issues in ${invalidCreatives.length} creative(s)`);
    }

    if (dimensions.storytelling < 0.6) {
      recommendations.push('Strengthen narrative elements in campaign messaging');
    }

    return {
      cesAnalysis: cesAnalysis as CESAnalysis,
      validationResults,
      recommendations,
    };
  }

  /**
   * Get available agents and their capabilities
   */
  getAgentDirectory(): typeof AI_AGENTS {
    return AI_AGENTS;
  }
}

// =============================================================================
// EXPORTS
// =============================================================================

export const marketingOSOrchestrator = new MarketingOSAgentOrchestrator();

export {
  AdsBotService,
  MarianService,
  EchoService,
  CESAIService,
  TestSpriteService,
};
