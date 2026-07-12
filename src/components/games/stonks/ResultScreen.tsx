/** @jsxImportSource preact */
import type { GameState } from '@/lib/games/stonks/types';
import { netWorth } from '@/lib/games/stonks/engine';
import { useGameLocale } from '../locale-context';
import { localizeAssets, localizeLifeEvent } from '@/i18n/games/stonks-ca';

// Per-year results screen: shows asset returns, any life event, and new net worth.

interface Props {
  state: GameState;
  onNext: () => void;
}

export const COPY = {
  es: {
    resultado: (year: number | undefined) => `Resultado del año ${year}`,
    patrimonio: 'Tu patrimonio',
    imprevisto: 'Imprevisto',
    siguiente: 'Siguiente año',
  },
  ca: {
    resultado: (year: number | undefined) => `Resultat de l'any ${year}`,
    patrimonio: 'El teu patrimoni',
    imprevisto: 'Imprevist',
    siguiente: 'Any següent',
  },
};

export function ResultScreen({ state, onNext }: Props) {
  const locale = useGameLocale();
  const c = COPY[locale];
  const assets = localizeAssets(locale);
  const r = state.lastReturns;
  const lastHistory = state.history.at(-1);

  return (
    <div class="sk-phone">
      <div class="sk-round">{c.resultado(lastHistory?.year)}</div>

      <div class="sk-wealth">
        <div class="l">{c.patrimonio}</div>
        <div class="v">{Math.round(netWorth(state)).toLocaleString('es-ES')} €</div>
      </div>

      {state.lastEvent && (
        <div class="sk-news">
          <div class="eyebrow">{c.imprevisto}</div>
          <div class="t">
            {localizeLifeEvent(state.lastEvent, locale)}{' '}
            ({state.lastEvent.amount > 0 ? '+' : ''}
            {state.lastEvent.amount} €)
          </div>
        </div>
      )}

      {r && (
        <ul class="sk-returns">
          {assets.filter((a) => r[a.id] != null).map((a) => (
            <li key={a.id}>
              <span>{a.label}</span>
              <span class={r[a.id]! >= 0 ? 'pos' : 'neg'}>
                {(r[a.id]! * 100).toFixed(1)}%
              </span>
            </li>
          ))}
        </ul>
      )}

      <button class="sk-cta" onClick={onNext}>
        {c.siguiente}
      </button>
    </div>
  );
}
