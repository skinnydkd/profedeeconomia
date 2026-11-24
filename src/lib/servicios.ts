/**
 * Whether the games that need a server can run in this build.
 *
 * Evaluated at build time: on Vercel the env vars are present during the
 * build, so setting them and redeploying turns the games back on with no
 * code change. In development everything stays on (local partykit).
 */

/** Cajút and Insider need a deployed PartyKit host, not the localhost fallback. */
export function partykitDisponible(host: string | undefined, prod: boolean): boolean {
  if (!prod) return true;
  const h = (host ?? '').trim();
  return h !== '' && !/^(127\.0\.0\.1|localhost)(:\d+)?$/.test(h);
}

export const PARTYKIT_OK = partykitDisponible(import.meta.env.PUBLIC_PARTYKIT_HOST, import.meta.env.PROD);
