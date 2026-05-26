/** @jsxImportSource preact */
// EndScreen — final ranking + Gini + economic lesson.
// Props: { state, onRestart }

import type { GameState } from '@/lib/games/econopoly/types';
import { netWorth, giniIndex } from '@/lib/games/econopoly/engine';

// Brief economic lessons linked to common outcomes
const GINI_LESSON = (gini: number): string => {
  if (gini < 0.2) return 'Partida muy igualitaria (Gini bajo). Una economia equilibrada distribuye mejor la renta y reduce la pobreza.';
  if (gini < 0.4) return 'Desigualdad moderada (Gini medio). El monopolio y la inversion en R+D concentran la renta — igual que en la realidad.';
  return 'Alta desigualdad (Gini elevado). Los primeros en invertir y acaparar sectores consolidan ventajas — el fenomeno del "winner takes all".';
};

interface Props {
  state: GameState;
  onRestart: () => void;
}

export function EndScreen({ state, onRestart }: Props) {
  const gini = giniIndex(state);
  const winner = state.winner;

  // Sort players by net worth descending
  const sorted = [...state.players].sort((a, b) => netWorth(state, b.id) - netWorth(state, a.id));

  const winnerPlayer = winner !== null ? state.players[winner] : null;

  return (
    <div class="ep2-end">
      <div class="ep2-end-card">
        {/* Header */}
        <div>
          <div class="ep2-end-eyebrow">
            Ronda {state.round} &middot; Partida terminada
          </div>
          <h2 class="ep2-end-headline">
            {winnerPlayer ? (
              <>
                Gana{' '}
                <span style={{ color: winnerPlayer.color }}>
                  {winnerPlayer.name}
                </span>
              </>
            ) : (
              'Partida terminada'
            )}
          </h2>
        </div>

        {/* Ranking */}
        <div class="ep2-ranking">
          {sorted.map((p, rank) => {
            const nw = netWorth(state, p.id);
            const isWinner = p.id === winner;
            return (
              <div
                key={p.id}
                class={`ep2-ranking-row${isWinner ? ' winner' : ''}`}
              >
                <span class="ep2-ranking-pos">#{rank + 1}</span>
                <span
                  class="ep2-ranking-swatch"
                  style={{ background: p.color }}
                />
                <span class="ep2-ranking-name">
                  {p.name}
                  {!p.isHuman && (
                    <span style={{ color: '#8A7868', fontWeight: 400, fontSize: '0.75rem' }}>
                      {' '}(IA)
                    </span>
                  )}
                  {!p.alive && (
                    <span style={{ color: '#8A7868', fontWeight: 400, fontSize: '0.75rem' }}>
                      {' '}(eliminado)
                    </span>
                  )}
                </span>
                <span class="ep2-ranking-worth">{Math.round(nw)} €</span>
              </div>
            );
          })}
        </div>

        {/* Gini index */}
        <div class="ep2-end-gini">
          Indice de Gini final: <strong>{gini.toFixed(3)}</strong>
        </div>

        {/* Economic lesson */}
        <div class="ep2-end-lesson">
          <h3>Leccion de economia</h3>
          <p style={{ margin: 0, lineHeight: 1.55 }}>
            {GINI_LESSON(gini)}
          </p>
        </div>

        {/* Restart */}
        <button class="ep2-end-cta" onClick={onRestart}>
          Jugar otra vez
        </button>
      </div>
    </div>
  );
}
