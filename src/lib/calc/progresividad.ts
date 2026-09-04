/**
 * Why the same tax weighs differently on two people.
 *
 * The module compares a bracket-based income tax with a flat consumption tax
 * on the same purchase, and reports the EFFECTIVE rate each person pays on
 * their income. That single comparison is the whole point: the income tax is
 * progressive because its effective rate rises with income, and the
 * consumption tax is regressive in practice because it does not.
 *
 * The brackets are an input, not a constant: this is a teaching model for
 * lower secondary, not a tax calculator, and inventing an authoritative scale
 * here would be worse than asking for one.
 */

export interface Tramo {
  hasta: number;
  tipo: number;
}

export interface Persona {
  nombre: string;
  renta: number;
}

export interface PersonaValorada extends Persona {
  cuotaRenta: number;
  /** cuotaRenta / renta — what actually matters. */
  tipoMedioRenta: number;
  /** The consumption tax paid on the shared purchase. */
  cuotaConsumo: number;
  /** cuotaConsumo / renta: the same euros, a different weight. */
  pesoConsumo: number;
  /** Both taxes together as a share of income. */
  pesoTotal: number;
}

export interface Resultado {
  valido: boolean;
  personas: PersonaValorada[];
  /** True when the effective income-tax rate rises with income. */
  rentaEsProgresiva: boolean;
  /** True when the consumption tax weighs more on the lower income. */
  consumoEsRegresivo: boolean;
}

export function cuotaPorTramos(base: number, tramos: Tramo[]): number {
  if (!Number.isFinite(base) || base <= 0) return 0;
  let restante = base;
  let anterior = 0;
  let cuota = 0;
  for (const t of tramos) {
    const anchura = Math.min(restante, t.hasta - anterior);
    if (anchura <= 0) break;
    cuota += anchura * t.tipo;
    restante -= anchura;
    anterior = t.hasta;
    if (restante <= 0) break;
  }
  return cuota;
}

export function comparar(
  personas: Persona[],
  tramos: Tramo[],
  compra: number,
  tipoConsumo: number,
): Resultado {
  const vacio: Resultado = { valido: false, personas: [], rentaEsProgresiva: false, consumoEsRegresivo: false };
  if (!Array.isArray(personas) || personas.length < 2) return vacio;
  if (!personas.every((p) => Number.isFinite(p.renta) && p.renta > 0)) return vacio;
  if (!Array.isArray(tramos) || tramos.length === 0) return vacio;
  // The top bracket legitimately runs to Infinity, so `hasta` is checked for
  // being a positive number rather than a finite one, and the ceilings must
  // strictly increase or the slice arithmetic silently skips brackets.
  const techosValidos = tramos.every((t, i) =>
    typeof t.hasta === 'number' && !Number.isNaN(t.hasta) && t.hasta > 0 &&
    (i === 0 || t.hasta > tramos[i - 1].hasta));
  const tiposValidos = tramos.every((t) => Number.isFinite(t.tipo) && t.tipo >= 0 && t.tipo <= 1);
  if (!techosValidos || !tiposValidos) return vacio;
  if (!Number.isFinite(compra) || compra < 0) return vacio;
  if (!Number.isFinite(tipoConsumo) || tipoConsumo < 0 || tipoConsumo > 1) return vacio;

  const cuotaConsumo = compra * tipoConsumo;
  const valoradas: PersonaValorada[] = personas.map((p) => {
    const cuotaRenta = cuotaPorTramos(p.renta, tramos);
    return {
      ...p,
      cuotaRenta,
      tipoMedioRenta: cuotaRenta / p.renta,
      cuotaConsumo,
      pesoConsumo: cuotaConsumo / p.renta,
      pesoTotal: (cuotaRenta + cuotaConsumo) / p.renta,
    };
  });

  const ordenadas = [...valoradas].sort((a, b) => a.renta - b.renta);
  const menor = ordenadas[0];
  const mayor = ordenadas[ordenadas.length - 1];

  return {
    valido: true,
    personas: valoradas,
    rentaEsProgresiva: mayor.tipoMedioRenta > menor.tipoMedioRenta,
    consumoEsRegresivo: menor.pesoConsumo > mayor.pesoConsumo,
  };
}
