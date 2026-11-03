/**
 * Whether the current round already has results while the league still shows it
 * open: a close that saved them and then failed hands the round back to
 * 'decisiones' (cerrar.ts), and closing it again keeps those results. The teams
 * can no longer change anything, and the teacher only has to close it again.
 */
export function rondaYaCalculada(
  liga: { ronda: number; fase: string },
  resultados: readonly { ronda: number }[],
): boolean {
  return liga.fase !== 'cerrada' && resultados.some((r) => r.ronda === liga.ronda);
}
