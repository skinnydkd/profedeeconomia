/**
 * Pure grading math: weighted average of instruments/competences and a
 * rubric-levels → mark converter. Returns `null` for undefined cases.
 */
export function sumaPesos(items: { peso: number }[]): number {
  return items.reduce((acc, it) => acc + it.peso, 0);
}

/**
 * Whether the weights add up to 100 %. Decimal weights carry float noise
 * (24,6 + 39,7 + 35,7 = 100.00000000000001), so they are compared with a
 * tolerance instead of `=== 100`.
 */
export function pesosSuman100(total: number): boolean {
  return Math.abs(total - 100) <= 1e-6;
}

export function mediaPonderada(items: { peso: number; nota: number }[]): number | null {
  const total = sumaPesos(items);
  if (total <= 0) return null;
  const acc = items.reduce((sum, it) => sum + it.peso * it.nota, 0);
  return acc / total;
}

export function rubricaANota(obtenidos: number, maximos: number, escala = 10): number | null {
  if (maximos <= 0) return null;
  return (obtenidos / maximos) * escala;
}
