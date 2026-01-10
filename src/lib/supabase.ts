/**
 * Supabase Client Configuration
 *
 * Uses tolerant env loader to support both VITE_ and VITE_PUBLIC_ prefixes.
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { env, hasSupabase } from '../config/env';

// Database types (will be generated from schema)
// For now, use generic types
export type Database = {
  public: {
    Tables: Record<string, unknown>;
    Views: Record<string, unknown>;
    Functions: Record<string, unknown>;
  };
  ces: {
    Tables: {
      assets: {
        Row: {
          id: string;
          workspace_id: string;
          campaign_id: string | null;
          name: string;
          type: string;
          mime_type: string;
          content_hash: string;
          storage_path: string;
          storage_bucket: string;
          file_size: number;
          version: number;
          parent_asset_id: string | null;
          status: string;
          error_message: string | null;
          metadata: Record<string, unknown> | null;
          created_at: string;
          updated_at: string;
          processed_at: string | null;
          scored_at: string | null;
        };
        Insert: Omit<Database['ces']['Tables']['assets']['Row'], 'id' | 'created_at' | 'updated_at'> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['ces']['Tables']['assets']['Insert']>;
      };
      scores: {
        Row: {
          id: string;
          asset_id: string;
          workspace_id: string;
          model_id: string;
          model_version: string;
          feature_version: string;
          total_score: number;
          confidence: number;
          dimensions: Record<string, unknown>;
          run_id: string;
          computed_at: string;
        };
        Insert: Omit<Database['ces']['Tables']['scores']['Row'], 'id'> & {
          id?: string;
        };
        Update: Partial<Database['ces']['Tables']['scores']['Insert']>;
      };
    };
    Views: Record<string, unknown>;
    Functions: Record<string, unknown>;
  };
  ops: {
    Tables: {
      workspaces: {
        Row: {
          id: string;
          name: string;
          slug: string;
          owner_id: string;
          settings: Record<string, unknown> | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['ops']['Tables']['workspaces']['Row'], 'id' | 'created_at' | 'updated_at'> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['ops']['Tables']['workspaces']['Insert']>;
      };
    };
    Views: Record<string, unknown>;
    Functions: Record<string, unknown>;
  };
  marketing: {
    Tables: {
      campaigns: {
        Row: {
          id: string;
          workspace_id: string;
          name: string;
          description: string | null;
          status: string;
          start_date: string | null;
          end_date: string | null;
          budget: number | null;
          objectives: Record<string, unknown> | null;
          created_by: string;
          created_at: string;
          updated_at: string;
          odoo_utm_campaign_id: number | null;
          odoo_synced_at: string | null;
        };
        Insert: Omit<Database['marketing']['Tables']['campaigns']['Row'], 'id' | 'created_at' | 'updated_at'> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['marketing']['Tables']['campaigns']['Insert']>;
      };
    };
    Views: Record<string, unknown>;
    Functions: Record<string, unknown>;
  };
};

/**
 * Create Supabase client
 * Returns null if Supabase is not configured
 */
function createSupabaseClient(): SupabaseClient<Database> | null {
  if (!hasSupabase) {
    console.warn('[Supabase] Not configured. Some features will be disabled.');
    return null;
  }

  return createClient<Database>(env.supabaseUrl, env.supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
    global: {
      headers: {
        'x-application-name': 'palette-forge',
      },
    },
  });
}

/**
 * Supabase client singleton
 * May be null if not configured
 */
export const supabase = createSupabaseClient();

/**
 * Check if Supabase is available
 */
export function isSupabaseAvailable(): boolean {
  return supabase !== null;
}

/**
 * Get Supabase client or throw if not configured
 * Use this when Supabase is required
 */
export function getSupabase(): SupabaseClient<Database> {
  if (!supabase) {
    throw new Error(
      'Supabase is not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.'
    );
  }
  return supabase;
}

/**
 * Execute a Supabase operation with fallback
 * Returns fallback value if Supabase is not configured
 */
export async function withSupabase<T>(
  operation: (client: SupabaseClient<Database>) => Promise<T>,
  fallback: T
): Promise<T> {
  if (!supabase) {
    console.warn('[Supabase] Operation skipped - not configured');
    return fallback;
  }

  try {
    return await operation(supabase);
  } catch (error) {
    console.error('[Supabase] Operation failed:', error);
    throw error;
  }
}

export default supabase;
