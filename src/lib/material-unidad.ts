/**
 * What each book unit of a subject has besides its chapter: the slides, the
 * test, the printable activities and the challenges. It lets the hub list the
 * units with their material and each unit link its own (VIS-NAV-05).
 * PURE module (no astro:content imports) so it can be unit-tested;
 * material-unidad-sources.ts feeds it from the collections.
 */
export interface EntradaUnidad { unidad: number; slug: string; title: string; }
export interface EntradaMaterial { unidad: number; slug: string; }

export interface MaterialDeUnidad {
  unidad: number;
  title: string;
  libro: string;
  diapositivas: string;
  test?: string;
  actividades: number;
  /** Anchor of the unit's first card in the activities index, when it has any. */
  actividadesHref?: string;
  retos: string[];
}

export function materialPorUnidad(
  asignatura: string,
  unidades: EntradaUnidad[],
  tests: EntradaMaterial[],
  actividades: EntradaMaterial[],
  retos: EntradaMaterial[],
): MaterialDeUnidad[] {
  return [...unidades]
    .sort((x, y) => x.unidad - y.unidad)
    .map((u) => {
      const test = tests.find((t) => t.unidad === u.unidad);
      const nAct = actividades.filter((x) => x.unidad === u.unidad).length;
      return {
        unidad: u.unidad,
        title: u.title,
        libro: `/${asignatura}/libro/${u.slug}/`,
        diapositivas: `/${asignatura}/diapositivas/${u.slug}/`,
        test: test ? `/${asignatura}/tests/${test.slug}/` : undefined,
        actividades: nAct,
        actividadesHref: nAct > 0 ? `/${asignatura}/actividades/#${anclaActividades(u.unidad)}` : undefined,
        retos: retos
          .filter((r) => r.unidad === u.unidad)
          .sort((x, y) => x.slug.localeCompare(y.slug))
          .map((r) => `/${asignatura}/retos/${r.slug}/`),
      };
    });
}

/** id of the first activity card of a unit in the activities index. */
export function anclaActividades(unidad: number): string {
  return `unidad-${unidad}`;
}
