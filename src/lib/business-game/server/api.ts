// Business Game — helpers compartits per als endpoints (server-only).
import { getSupabase } from '../../jocs-economics/server/supabase';
import { verifyBgToken, getSecret, bearer, type BgTokenPayload } from './tokens';

export { getSupabase };

export function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
  });
}

export function bad(message: string, status = 400): Response {
  return json({ error: message }, status);
}

/** Verifica el token Bearer y exige un rol concreto. */
export function auth(request: Request, rol: 'profe' | 'equipo'): BgTokenPayload | null {
  const token = bearer(request);
  if (!token) return null;
  const res = verifyBgToken(token, getSecret());
  if (!res.ok || res.payload.rol !== rol) return null;
  return res.payload;
}
