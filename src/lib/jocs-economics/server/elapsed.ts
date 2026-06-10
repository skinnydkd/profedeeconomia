/**
 * Time (ms) recorded for an answer. Takes min(server, client+tolerance) so
 * network latency doesn't penalize the player. Clamped to [0, serverElapsedMs]
 * so a malicious negative client value cannot produce a negative recorded time
 * (which would corrupt the leaderboard tiebreaker).
 */
export function recordedElapsedMs(
  serverElapsedMs: number,
  clientElapsedMs: number,
  toleranceMs: number,
): number {
  return Math.max(0, Math.min(serverElapsedMs, clientElapsedMs + toleranceMs));
}
