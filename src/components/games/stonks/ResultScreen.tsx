/** @jsxImportSource preact */
import type { GameState } from '@/lib/games/stonks/types';
import { netWorth, realNetWorth, availableAssets } from '@/lib/games/stonks/engine';
import { assetMeta } from '@/lib/games/stonks/data/assets';
import { useGameLocale } from '../locale-context';
import { localizeAsset, localizeLifeEvent } from '@/i18n/games/stonks-ca';

// Per-semester results: what each asset did, what moving cost, whether an
// imprevisto forced a sale, and whether a company disappeared.

interface Props {
  state: GameState;
  onNext: () => void;
}

export const COPY = {
  es: {
    result: (h: number, y: number) => `Resultado del ${h === 0 ? '1.er' : '2.º'} semestre de ${y}`,
    patrimonio: 'Tu patrimonio',
    real: (y: number) => `en poder adquisitivo de ${y}`,
    imprevisto: 'Imprevisto',
    costs: 'Lo que ha costado moverla',
    commission: 'Comisiones',
    tax: 'Impuestos por plusvalías',
    forced:
      'No tenías efectivo suficiente y has tenido que vender parte de la cartera para cubrirlo. ' +
      'Sin colchón, se vende en el momento que toca, no en el que te conviene.',
    death: (label: string) =>
      `La empresa de ${label} ha desaparecido del mercado. Lo que tenías invertido en ella vale 0 €.`,
    siguiente: 'Siguiente semestre',
  },
  ca: {
    result: (h: number, y: number) => `Resultat del ${h === 0 ? '1r' : '2n'} semestre de ${y}`,
    patrimonio: 'El teu patrimoni',
    real: (y: number) => `en poder adquisitiu de ${y}`,
    imprevisto: 'Imprevist',
    costs: 'El que ha costat moure-la',
    commission: 'Comissions',
    tax: 'Impostos per plusvàlues',
    forced:
      'No tenies prou efectiu i has hagut de vendre part de la cartera per a cobrir-ho. ' +
      'Sense coixí, es ven en el moment que toca, no en el que et convé.',
    death: (label: string) =>
      `L’empresa de ${label} ha desaparegut del mercat. El que hi tenies invertit val 0 €.`,
    siguiente: 'Semestre següent',
  },
};

const euros = (n: number) => Math.round(n).toLocaleString('es-ES');

export function ResultScreen({ state, onNext }: Props) {
  const locale = useGameLocale();
  const c = COPY[locale];
  const returns = state.lastReturns;
  const last = state.history.at(-1);
  const costs = state.lastCosts;
  const paid = costs ? costs.commission + costs.tax : 0;

  // The board of the semester just played, plus any company that died in it —
  // availableAssets has already dropped the dead one.
  const rows = availableAssets(state).filter((a) => returns?.[a.id] != null);

  return (
    <div class="sk-phone">
      <div class="sk-round">{c.result(last?.half ?? 0, last?.year ?? state.startYear)}</div>

      <div class="sk-wealth">
        <div class="l">{c.patrimonio}</div>
        <div class="v">{euros(netWorth(state))} €</div>
        <div class="r">
          {euros(realNetWorth(state))} € {c.real(state.startYear)}
        </div>
      </div>

      {state.lastDeath && (
        <div class="sk-alert">
          {c.death(localizeAsset(assetMeta[state.lastDeath], locale).label)}
        </div>
      )}

      {state.lastEvent && (
        <div class="sk-news">
          <div class="eyebrow">{c.imprevisto}</div>
          <div class="t">{localizeLifeEvent(state.lastEvent, locale)}</div>
        </div>
      )}

      {costs?.forced && <div class="sk-alert">{c.forced}</div>}

      {paid > 0.5 && (
        <ul class="sk-costs">
          <li class="sk-costs-h">{c.costs}</li>
          <li>
            <span>{c.commission}</span>
            <span>−{euros(costs!.commission)} €</span>
          </li>
          {costs!.tax > 0.5 && (
            <li>
              <span>{c.tax}</span>
              <span>−{euros(costs!.tax)} €</span>
            </li>
          )}
        </ul>
      )}

      {returns && (
        <ul class="sk-returns">
          {rows.map((raw) => {
            const a = localizeAsset(raw, locale);
            const r = returns[a.id]!;
            return (
              <li key={a.id}>
                <span>{a.label}</span>
                <span class={r >= 0 ? 'pos' : 'neg'}>
                  {r >= 0 ? '+' : ''}
                  {(r * 100).toFixed(1)} %
                </span>
              </li>
            );
          })}
        </ul>
      )}

      <button class="sk-cta" onClick={onNext}>
        {c.siguiente}
      </button>
    </div>
  );
}
