import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL || '';
const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes('placeholder') && 
  !supabaseAnonKey.includes('placeholder')
);

// Fallback to placeholder if unconfigured so client initialization never throws
const effectiveUrl = isSupabaseConfigured ? supabaseUrl : 'https://placeholder.supabase.co';
const effectiveKey = isSupabaseConfigured ? supabaseAnonKey : 'placeholder-anon-key';

export const supabase = createClient(effectiveUrl, effectiveKey);

export interface DiagnosticReport {
  step1_env_check: { success: boolean; message: string };
  step2_client_init: { success: boolean; message: string };
  step3_network_query: { success: boolean; message: string; details?: any };
  overall_status: 'CONNECTED' | 'CONFIG_MISSING' | 'TABLE_MISSING' | 'PERMISSION_ERROR' | 'NETWORK_ERROR';
}

export async function diagnoseSupabaseConnection(): Promise<DiagnosticReport> {
  const report: DiagnosticReport = {
    step1_env_check: { success: false, message: '' },
    step2_client_init: { success: false, message: '' },
    step3_network_query: { success: false, message: '' },
    overall_status: 'NETWORK_ERROR'
  };

  // Step 1: Environment Variables Check
  if (!isSupabaseConfigured) {
    report.step1_env_check = {
      success: false,
      message: 'Missing or placeholder VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY.'
    };
    report.overall_status = 'CONFIG_MISSING';
    console.warn('[Supabase Diagnostic] Step 1 Failed: Environment variables unconfigured.');
    return report;
  } else {
    report.step1_env_check = {
      success: true,
      message: `Environment variables detected (URL: ${supabaseUrl.substring(0, 15)}...)`
    };
  }

  // Step 2: Client Initialization Check
  try {
    if (!supabase || typeof supabase.from !== 'function') {
      throw new Error('Supabase client failed to initialize properly.');
    }
    report.step2_client_init = {
      success: true,
      message: 'Supabase client initialized successfully.'
    };
  } catch (err: any) {
    report.step2_client_init = {
      success: false,
      message: `Client initialization error: ${err.message}`
    };
    report.overall_status = 'NETWORK_ERROR';
    console.error('[Supabase Diagnostic] Step 2 Failed:', err);
    return report;
  }

  // Step 3: Network Query Check (Fetching single row from projects/gate_subjects)
  try {
    console.log('[Supabase Diagnostic] Step 3: Attempting query on public.projects...');
    const { data, error, status } = await supabase
      .from('projects')
      .select('id, title')
      .limit(1);

    if (error) {
      report.step3_network_query = {
        success: false,
        message: `Query failed with status ${status}: ${error.message} (Code: ${error.code})`,
        details: error
      };

      if (error.code === 'PGRST116' || error.message.includes('relation "public.projects" does not exist') || error.message.includes('schema cache')) {
        report.overall_status = 'TABLE_MISSING';
        console.error('[Supabase Diagnostic] Step 3 Failed: Table does not exist in schema cache. Run SQL migration.');
      } else if (error.code === '42501' || error.message.includes('policy')) {
        report.overall_status = 'PERMISSION_ERROR';
        console.error('[Supabase Diagnostic] Step 3 Failed: Row Level Security (RLS) permission denied.');
      } else {
        report.overall_status = 'NETWORK_ERROR';
      }
      return report;
    }

    report.step3_network_query = {
      success: true,
      message: `Query successful! Retrieved ${data?.length || 0} row(s) from public.projects.`,
      details: data
    };
    report.overall_status = 'CONNECTED';
    console.log('[Supabase Diagnostic] Success: Database connected and verified.');
  } catch (err: any) {
    report.step3_network_query = {
      success: false,
      message: `Network exception during query: ${err.message || 'Unknown network error'}`,
      details: err
    };
    report.overall_status = 'NETWORK_ERROR';
    console.error('[Supabase Diagnostic] Step 3 Exception:', err);
  }

  return report;
}

export async function testSupabaseConnection(): Promise<{ connected: boolean; message: string }> {
  const report = await diagnoseSupabaseConnection();
  return {
    connected: report.overall_status === 'CONNECTED',
    message: `[Status: ${report.overall_status}] Env: ${report.step1_env_check.message} | Init: ${report.step2_client_init.message} | Query: ${report.step3_network_query.message}`
  };
}
