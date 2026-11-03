// src/lib/games/stonks/lessons.ts
import type { GameState } from './types';
import type { Locale } from '@/i18n/locale';
import { finalize } from './engine';
import { assetMeta } from './data/assets';

const eur = (n: number): string => `${Math.round(n).toLocaleString('es-ES')} €`;
const pct = (n: number): string => `${Math.round(n * 100)} %`;

/**
 * Every sentence the closing screen can say, per locale. The rules that pick
 * them live in buildLessons and are shared, so both languages always tell the
 * player the same thing about the same game.
 */
const TEXT = {
  es: {
    /**
     * Fallbacks. Only used to pad a game too quiet to say anything specific, and
     * every one of them is true of any game whatsoever.
     */
    generic: [
      'Diversificar no elimina el riesgo de mercado, pero sí el de que una sola decisión te arruine.',
      'El interés compuesto necesita tiempo, y el tiempo es la única variable de esta partida que no se puede acelerar.',
      'Lo que no vendes no tributa todavía. Ese aplazamiento del impuesto vale dinero por sí solo.',
    ],
    inflation: (nominal: number, year: number, real: number) =>
      `Acabas con ${eur(nominal)}, que en poder adquisitivo de ${year} son ${eur(real)}. ` +
      'La inflación no aparece en ningún extracto bancario y se lleva su parte igual.',
    costs: (total: number) =>
      `Mover la cartera te ha costado ${eur(total)} en comisiones e impuestos. ` +
      'Cada cambio de idea se paga, y se paga también cuando el cambio era acertado.',
    noCosts:
      'No has pagado ni un euro en comisiones ni en impuestos por operar. ' +
      'Dejar quieta una cartera es gratis, y rara vez es la peor opción.',
    concentration: (share: number) =>
      `Llegaste a tener el ${pct(share)} de todo tu patrimonio en una sola empresa. ` +
      'Cuando sale bien parece visión de futuro; cuando sale mal no hay de dónde agarrarse.',
    and: ' y ',
    deaths: (names: string, many: boolean) =>
      `${names} ${many ? 'desaparecieron' : 'desapareció'} durante tu partida. ` +
      `No ${many ? 'quebraron' : 'quebró'} por sorpresa: ${many ? 'quebraron' : 'quebró'} ` +
      'después de años de señales que casi nadie quiso leer a tiempo.',
    ahead: (gap: number) =>
      `Has terminado ${eur(gap)} por encima de «El Mercado», que se limitó a comprar el índice mundial y no vender nunca.`,
    behind: (gap: number) =>
      `«El Mercado» te ha ganado por ${eur(gap)} sin tomar una sola decisión: compró el índice mundial y no vendió nunca.`,
  },
  ca: {
    generic: [
      'Diversificar no elimina el risc de mercat, però sí el risc que una sola decisió t’arruïne.',
      'L’interés compost necessita temps, i el temps és l’única variable d’esta partida que no es pot accelerar.',
      'El que no vens encara no tributa. Eixe ajornament de l’impost ja val diners per si mateix.',
    ],
    inflation: (nominal: number, year: number, real: number) =>
      `Acabes amb ${eur(nominal)}, que en poder adquisitiu de ${year} són ${eur(real)}. ` +
      'La inflació no apareix en cap extracte bancari i se n’emporta la seua part igualment.',
    costs: (total: number) =>
      `Moure la cartera t’ha costat ${eur(total)} en comissions i impostos. ` +
      'Cada canvi d’idea es paga, i es paga també quan el canvi era encertat.',
    noCosts:
      'No has pagat ni un euro en comissions ni en impostos per operar. ' +
      'Deixar quieta una cartera és gratis, i rarament és la pitjor opció.',
    concentration: (share: number) =>
      `Vas arribar a tindre el ${pct(share)} de tot el teu patrimoni en una sola empresa. ` +
      'Quan ix bé pareix visió de futur; quan ix malament no hi ha on agafar-se.',
    and: ' i ',
    deaths: (names: string, many: boolean) =>
      `${names} ${many ? 'van desaparéixer' : 'va desaparéixer'} durant la teua partida. ` +
      `No ${many ? 'van fer' : 'va fer'} fallida per sorpresa: ${many ? 'la van fer' : 'la va fer'} ` +
      'després d’anys de senyals que quasi ningú no va voler llegir a temps.',
    ahead: (gap: number) =>
      `Has acabat ${eur(gap)} per damunt de «El Mercat», que es va limitar a comprar l’índex mundial i no vendre mai.`,
    behind: (gap: number) =>
      `«El Mercat» t’ha guanyat per ${eur(gap)} sense prendre ni una sola decisió: va comprar l’índex mundial i no va vendre mai.`,
  },
};

/**
 * Closing lessons built from THIS game.
 *
 * The old screen showed the same six sentences to everybody, including things
 * that were plainly false for the player reading them — telling someone who
 * never traded what their trading had cost. Every rule here returns a sentence
 * only when the game actually supports it.
 */
export function buildLessons(s: GameState, locale: Locale = 'es'): string[] {
  const t = TEXT[locale];
  const out: string[] = [];
  const first = s.history[0];
  const last = s.history.at(-1);
  const { player, ai } = finalize(s);

  // 1. Nominal euros grew and purchasing power did not follow.
  if (first && last && last.nominal > first.nominal && last.real < last.nominal * 0.9) {
    out.push(t.inflation(last.nominal, s.startYear, last.real));
  }

  // 2. What moving the portfolio actually cost.
  out.push(s.totalCosts > 1 ? t.costs(s.totalCosts) : t.noCosts);

  // 3. Concentration in a single company.
  if (s.peakStockShare > 0.3) {
    out.push(t.concentration(s.peakStockShare));
  }

  // 4. A company on the board disappeared.
  if (s.deaths.length > 0) {
    const names = s.deaths.map((id) => assetMeta[id].realName).join(t.and);
    out.push(t.deaths(names, s.deaths.length > 1));
  }

  // 5. Against the benchmark that did nothing at all.
  const gap = player - ai;
  out.push(gap >= 0 ? t.ahead(gap) : t.behind(-gap));

  for (const g of t.generic) {
    if (out.length >= 3) break;
    out.push(g);
  }
  return out.slice(0, 6);
}
