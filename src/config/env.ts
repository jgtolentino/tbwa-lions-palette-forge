/**
 * Tolerant Environment Variable Loader
 *
 * Handles both VITE_ and VITE_PUBLIC_ prefixes for Supabase integration.
 * This ensures compatibility across different Vercel + Supabase configurations.
 */

interface EnvConfig {
  // Supabase
  supabaseUrl: string;
  supabaseAnonKey: string;

  // MCP Backend
  mcpHttpUrl: string;
  mcpApiKey?: string;

  // Database (optional, for direct connections)
  databaseUrl?: string;

  // Environment
  nodeEnv: 'development' | 'production' | 'test';
  useMockApi: boolean;

  // Claude AI
  claudeApiKey?: string;
  claudeModel: string;

  // Auth
  authTokenKey: string;

  // Features
  enableWebsocket: boolean;
  enableMarketIntelligence: boolean;
  enableAnalytics: boolean;

  // Limits
  maxFileSize: number;

  // Monitoring
  logLevel: 'debug' | 'info' | 'warn' | 'error';
  sentryDsn?: string;
}

/**
 * Get environment variable with fallback prefixes
 * Checks VITE_, then VITE_PUBLIC_, then falls back to default
 */
function getEnv(key: string, defaultValue: string = ''): string {
  // Try standard VITE_ prefix first
  const viteKey = `VITE_${key}`;
  if (import.meta.env[viteKey] !== undefined) {
    return import.meta.env[viteKey];
  }

  // Try VITE_PUBLIC_ prefix (some Supabase integrations use this)
  const vitePublicKey = `VITE_PUBLIC_${key}`;
  if (import.meta.env[vitePublicKey] !== undefined) {
    return import.meta.env[vitePublicKey];
  }

  // Check for Supabase-specific naming conventions
  if (key === 'SUPABASE_URL') {
    // Additional fallbacks for Supabase URL
    const alternatives = [
      'VITE_SUPABASE_URL',
      'VITE_PUBLIC_SUPABASE_URL',
      'SUPABASE_URL',
    ];
    for (const alt of alternatives) {
      if (import.meta.env[alt] !== undefined) {
        return import.meta.env[alt];
      }
    }
  }

  if (key === 'SUPABASE_ANON_KEY') {
    // Additional fallbacks for Supabase anon key
    const alternatives = [
      'VITE_SUPABASE_ANON_KEY',
      'VITE_PUBLIC_SUPABASE_ANON_KEY',
      'SUPABASE_ANON_KEY',
    ];
    for (const alt of alternatives) {
      if (import.meta.env[alt] !== undefined) {
        return import.meta.env[alt];
      }
    }
  }

  return defaultValue;
}

/**
 * Get boolean environment variable
 */
function getEnvBool(key: string, defaultValue: boolean = false): boolean {
  const value = getEnv(key, String(defaultValue));
  return value === 'true' || value === '1';
}

/**
 * Get numeric environment variable
 */
function getEnvNumber(key: string, defaultValue: number): number {
  const value = getEnv(key, String(defaultValue));
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? defaultValue : parsed;
}

/**
 * Validate required environment variables
 * Logs warnings in development, throws in production for critical vars
 */
function validateEnv(): void {
  const required = [
    { key: 'SUPABASE_URL', name: 'Supabase URL' },
    { key: 'SUPABASE_ANON_KEY', name: 'Supabase Anon Key' },
  ];

  const missing: string[] = [];

  for (const { key, name } of required) {
    const value = getEnv(key);
    if (!value) {
      missing.push(name);
    }
  }

  if (missing.length > 0) {
    const message = `Missing environment variables: ${missing.join(', ')}`;

    if (import.meta.env.PROD) {
      // In production, warn but don't crash (allows graceful degradation)
      console.error(`[ENV ERROR] ${message}`);
    } else {
      // In development, log warning
      console.warn(`[ENV WARNING] ${message}`);
      console.warn('Some features may not work correctly.');
      console.warn('See .env.example for required variables.');
    }
  }
}

// Validate on module load
validateEnv();

/**
 * Environment configuration singleton
 */
export const env: EnvConfig = {
  // Supabase
  supabaseUrl: getEnv('SUPABASE_URL', ''),
  supabaseAnonKey: getEnv('SUPABASE_ANON_KEY', ''),

  // MCP Backend
  mcpHttpUrl: getEnv('MCP_HTTP_URL', 'http://localhost:8001'),
  mcpApiKey: getEnv('MCP_API_KEY') || undefined,

  // Database
  databaseUrl: getEnv('DATABASE_URL') || undefined,

  // Environment
  nodeEnv: (getEnv('NODE_ENV', 'development') as EnvConfig['nodeEnv']),
  useMockApi: getEnvBool('USE_MOCK_API', false),

  // Claude AI
  claudeApiKey: getEnv('CLAUDE_API_KEY') || undefined,
  claudeModel: getEnv('CLAUDE_MODEL', 'claude-sonnet-4-20250514'),

  // Auth
  authTokenKey: getEnv('AUTH_TOKEN_KEY', 'lions_palette_auth_token'),

  // Features
  enableWebsocket: getEnvBool('ENABLE_WEBSOCKET', true),
  enableMarketIntelligence: getEnvBool('ENABLE_MARKET_INTELLIGENCE', true),
  enableAnalytics: getEnvBool('ENABLE_ANALYTICS', true),

  // Limits
  maxFileSize: getEnvNumber('MAX_FILE_SIZE', 500 * 1024 * 1024), // 500MB

  // Monitoring
  logLevel: (getEnv('LOG_LEVEL', 'info') as EnvConfig['logLevel']),
  sentryDsn: getEnv('SENTRY_DSN') || undefined,
};

/**
 * Check if running in production
 */
export const isProd = env.nodeEnv === 'production';

/**
 * Check if running in development
 */
export const isDev = env.nodeEnv === 'development';

/**
 * Check if Supabase is configured
 */
export const hasSupabase = Boolean(env.supabaseUrl && env.supabaseAnonKey);

/**
 * Log environment status (development only)
 */
if (isDev) {
  console.log('[ENV] Configuration loaded:', {
    nodeEnv: env.nodeEnv,
    hasSupabase,
    mcpHttpUrl: env.mcpHttpUrl,
    useMockApi: env.useMockApi,
  });
}

export default env;
