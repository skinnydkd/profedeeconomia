// src/lib/jocs-economics/server/supabase.ts
// Client Supabase server-only amb service-role key (bypassa RLS).
// MAI importar des de codi client.

import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let cached: SupabaseClient | null = null;

/**
 * Retorna un client Supabase amb la service-role key.
 * Validem les env vars al primer ús per fallar ràpid si falten.
 */
export function getSupabase(): SupabaseClient {
  if (cached) return cached;
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url) throw new Error('SUPABASE_URL env var missing');
  if (!key) throw new Error('SUPABASE_SERVICE_ROLE_KEY env var missing');
  cached = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return cached;
}

/** Test-only: reset del cache (per a injectar mocks en tests) */
export function __resetSupabaseForTests(): void {
  cached = null;
}
