/**
 * Time (ms) recorded for an answer: the client's own measure, clamped to
 * [serverElapsedMs - maxLatencyMs, serverElapsedMs]. The server's clock also
 * counts the trip of the answer, so an honest client within that window keeps
 * its exact time; a crafted value (negative, huge, NaN) only moves it inside
 * the window, so it can never buy a 0 ms tiebreaker. Never negative, which
 * also covers a server clock slightly behind the one that started the question.
 */
export function recordedElapsedMs(
  serverElapsedMs: number,
  clientElapsedMs: number,
  maxLatencyMs: number,
): number {
  const lowest = serverElapsedMs - maxLatencyMs;
  const client = Number.isNaN(clientElapsedMs) ? lowest : clientElapsedMs;
  return Math.max(0, Math.min(serverElapsedMs, Math.max(lowest, client)));
}
