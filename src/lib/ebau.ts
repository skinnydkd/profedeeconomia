/** Routes under /[asignatura]/ebau/ that a family slug must never shadow. */
export const RUTAS_RESERVADAS_EBAU = ['imprimir', 'examenes'] as const;

/**
 * Public slug of a family entry id: drops the subject and folder prefix,
 * the `NN-` ordering prefix and the `.ca` language suffix.
 */
export function slugFamilia(id: string): string {
  const base = id.split('/').pop() ?? id;
  return base.replace(/\.ca$/, '').replace(/^\d+-/, '');
}

export type BloqueEbau<S, F> =
  | { kind: 'seccion'; entry: S }
  | { kind: 'familias'; entries: F[] };

/**
 * Orders the notebook sections and inserts one block with all families after
 * the first section flagged `incluye_problemas` (at the end if none is).
 * Callers filter by `estado`, subject and language beforehand.
 */
export function intercalarFamilias<
  S extends { data: { orden: number; incluye_problemas: boolean } },
  F extends { data: { orden: number } },
>(secciones: S[], familias: F[]): BloqueEbau<S, F>[] {
  const out: BloqueEbau<S, F>[] = [...secciones]
    .sort((a, b) => a.data.orden - b.data.orden)
    .map((entry) => ({ kind: 'seccion', entry }));
  if (familias.length === 0) return out;
  const bloque: BloqueEbau<S, F> = {
    kind: 'familias',
    entries: [...familias].sort((a, b) => a.data.orden - b.data.orden),
  };
  const i = out.findIndex((b) => b.kind === 'seccion' && b.entry.data.incluye_problemas);
  out.splice(i === -1 ? out.length : i + 1, 0, bloque);
  return out;
}
