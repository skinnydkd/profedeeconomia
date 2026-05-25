/** @jsxImportSource preact */
import type { GameState } from '@/lib/games/stonks/types';
import { ASSETS } from '@/lib/games/stonks/data';
import { netWorth } from '@/lib/games/stonks/engine';

// Per-year results screen: shows asset returns, any life event, and new net worth.

interface Props {
  state: GameState;
  onNext: () => void;
}

export function ResultScreen({ state, onNext }: Props) {
  const r = state.lastReturns;
  const lastHistory = state.history.at(-1);

  return (
    <div class="sk-phone">
      <div class="sk-round">Resultado del año {lastHistory?.year}</div>

      <div class="sk-wealth">
        <div class="l">Tu patrimonio</div>
        <div class="v">{Math.round(netWorth(state)).toLocaleString('es-ES')} €</div>
      </div>

      {state.lastEvent && (
        <div class="sk-news">
          <div class="eyebrow">Imprevisto</div>
          <div class="t">
            {state.lastEvent.text}{' '}
            ({state.lastEvent.amount > 0 ? '+' : ''}
            {state.lastEvent.amount} €)
          </div>
        </div>
      )}

      {r && (
        <ul class="sk-returns">
          {ASSETS.filter((a) => r[a.id] != null).map((a) => (
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
        {state.phase === 'finished' ? 'Ver resumen' : 'Siguiente año'}
      </button>
    </div>
  );
}
