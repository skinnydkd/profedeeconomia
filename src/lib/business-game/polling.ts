/**
 * How the Business Game screens poll /api/business-game/estado.
 *
 * Every open screen used to ask every 4 s for as long as it stayed open, closed
 * leagues and hidden tabs included, and the session survives in localStorage,
 * so a page reopened weeks later started again. Each request is a function
 * invocation and four Supabase queries: thirty laptops left open over a weekend
 * came close to the monthly invocation quota.
 */

/** While a round is being closed, or before the first answer: results are imminent. */
export const POLL_RAPIDO_MS = 4_000;

/**
 * While the teams decide, which takes minutes. A screen's own actions (closing
 * a round, sending decisions) refresh it at once, so only the others' changes
 * wait for the next tick.
 */
export const POLL_DECISIONES_MS = 15_000;

/** Milliseconds between polls for this phase, or null to stop polling. */
export function intervaloPolling(fase: string | undefined, visible: boolean): number | null {
  if (!visible || fase === 'cerrada') return null;
  return fase === 'decisiones' ? POLL_DECISIONES_MS : POLL_RAPIDO_MS;
}

/**
 * The newer of two league states, by the time the server built them. Answers
 * can arrive out of order, and a poll answered from the CDN copy can be a few
 * seconds older than the refresh after closing a round, which skips the copy:
 * showing the older one would bring back the round just closed, and the button
 * that closes it, which would then close the next one.
 */
export function estadoMasReciente<T extends { generadoEn?: number }>(actual: T | null, nuevo: T): T {
  if (!actual) return nuevo;
  return (nuevo.generadoEn ?? 0) >= (actual.generadoEn ?? 0) ? nuevo : actual;
}
