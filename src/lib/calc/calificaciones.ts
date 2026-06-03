/**
 * Pure grading math: weighted average of instruments/competences and a
 * rubric-levels → mark converter. Returns `null` for undefined cases.
 */
export function sumaPesos(items: { peso: number }[]): number {
  return items.reduce((acc, it) => acc + it.peso, 0);
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
