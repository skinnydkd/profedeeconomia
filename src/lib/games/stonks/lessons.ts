// src/lib/games/stonks/lessons.ts
import type { GameState } from './types';
import { finalize } from './engine';
import { assetMeta } from './data/assets';

const eur = (n: number): string => `${Math.round(n).toLocaleString('es-ES')} €`;
const pct = (n: number): string => `${Math.round(n * 100)} %`;

/**
 * Fallbacks. Only used to pad a game too quiet to say anything specific, and
 * every one of them is true of any game whatsoever.
 */
const GENERIC = [
  'Diversificar no elimina el riesgo de mercado, pero sí el de que una sola decisión te arruine.',
  'El interés compuesto necesita tiempo, y el tiempo es la única variable de esta partida que no se puede acelerar.',
  'Lo que no vendes no tributa todavía. Ese aplazamiento del impuesto vale dinero por sí solo.',
];

/**
 * Closing lessons built from THIS game.
 *
 * The old screen showed the same six sentences to everybody, including things
 * that were plainly false for the player reading them — telling someone who
 * never traded what their trading had cost. Every rule here returns a sentence
 * only when the game actually supports it.
 */
export function buildLessons(s: GameState): string[] {
  const out: string[] = [];
  const first = s.history[0];
  const last = s.history.at(-1);
  const { player, ai } = finalize(s);

  // 1. Nominal euros grew and purchasing power did not follow.
  if (first && last && last.nominal > first.nominal && last.real < last.nominal * 0.9) {
    out.push(
      `Acabas con ${eur(last.nominal)}, que en poder adquisitivo de ${s.startYear} son ${eur(last.real)}. ` +
      'La inflación no aparece en ningún extracto bancario y se lleva su parte igual.',
    );
  }

  // 2. What moving the portfolio actually cost.
  if (s.totalCosts > 1) {
    out.push(
      `Mover la cartera te ha costado ${eur(s.totalCosts)} en comisiones e impuestos. ` +
      'Cada cambio de idea se paga, y se paga también cuando el cambio era acertado.',
    );
  } else {
    out.push(
      'No has pagado ni un euro en comisiones ni en impuestos por operar. ' +
      'Dejar quieta una cartera es gratis, y rara vez es la peor opción.',
    );
  }

  // 3. Concentration in a single company.
  if (s.peakStockShare > 0.3) {
    out.push(
      `Llegaste a tener el ${pct(s.peakStockShare)} de todo tu patrimonio en una sola empresa. ` +
      'Cuando sale bien parece visión de futuro; cuando sale mal no hay de dónde agarrarse.',
    );
  }

  // 4. A company on the board disappeared.
  if (s.deaths.length > 0) {
    const names = s.deaths.map((id) => assetMeta[id].realName).join(' y ');
    out.push(
      `${names} desapareció durante tu partida. No quebró por sorpresa: quebró después de ` +
      'años de señales que casi nadie quiso leer a tiempo.',
    );
  }

  // 5. Against the benchmark that did nothing at all.
  const gap = player - ai;
  out.push(
    gap >= 0
      ? `Has terminado ${eur(gap)} por encima de «El Mercat», que se limitó a comprar el índice mundial y no vender nunca.`
      : `«El Mercat» te ha ganado por ${eur(-gap)} sin tomar una sola decisión: compró el índice mundial y no vendió nunca.`,
  );

  for (const g of GENERIC) {
    if (out.length >= 3) break;
    out.push(g);
  }
  return out.slice(0, 6);
}
