// src/pages/api/jocs/institutes.ts
// GET /api/jocs/institutes?q=lluis → suggestions per autocompletat (spec §7.5)

import type { APIRoute } from 'astro';
import { getSupabase } from '../../../lib/jocs-economics/server/supabase';

// SSR-only: no pre-render at build time (Supabase env vars not available)
export const prerender = false;

export const GET: APIRoute = async ({ url }) => {
  const q = (url.searchParams.get('q') ?? '').trim();
  if (q.length < 2) {
    return new Response(JSON.stringify({ suggestions: [] }), { status: 200 });
  }

  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('institutes')
    .select('institute_display')
    .ilike('institute_display', `%${q}%`)
    .order('players_count', { ascending: false })
    .limit(10);

  if (error) {
    return new Response(JSON.stringify({ error: 'database-error' }), { status: 500 });
  }
  const suggestions = (data ?? []).map((r: any) => r.institute_display);
  return new Response(JSON.stringify({ suggestions }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=300, s-maxage=300',
    },
  });
};
