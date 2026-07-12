/** @jsxImportSource preact */
// EndScreen — final ranking + Gini + economic lesson.
// Props: { state, onRestart }

import type { GameState } from '@/lib/games/econopoly/types';
import { netWorth, giniIndex } from '@/lib/games/econopoly/engine';
import { useGameLocale } from '../locale-context';

export const COPY = {
  es: {
    finished: (round: number) => `Ronda ${round} · Partida terminada`,
    gana: 'Gana',
    finishedShort: 'Partida terminada',
    ia: '(IA)',
    eliminated: '(eliminado)',
    giniFinal: 'Índice de Gini final:',
    lessonTitle: 'Lección de economía',
    restart: 'Jugar otra vez',
    giniLow: 'Partida muy igualitaria (Gini bajo). Una economía equilibrada distribuye mejor la renta y reduce la pobreza.',
    giniMid: 'Desigualdad moderada (Gini medio). El monopolio y la inversión en R+D concentran la renta — igual que en la realidad.',
    giniHigh: 'Alta desigualdad (Gini elevado). Los primeros en invertir y acaparar sectores consolidan ventajas — el fenómeno del "winner takes all".',
  },
  ca: {
    finished: (round: number) => `Ronda ${round} · Partida acabada`,
    gana: 'Guanya',
    finishedShort: 'Partida acabada',
    ia: '(IA)',
    eliminated: '(eliminat)',
    giniFinal: 'Índex de Gini final:',
    lessonTitle: 'Lliçó d\'economia',
    restart: 'Torna a jugar',
    giniLow: 'Partida molt igualitària (Gini baix). Una economia equilibrada distribuïx millor la renda i reduïx la pobresa.',
    giniMid: 'Desigualtat moderada (Gini mitjà). El monopoli i la inversió en R+D concentren la renda — igual que en la realitat.',
    giniHigh: 'Alta desigualtat (Gini elevat). Els primers a invertir i acaparar sectors consoliden avantatges — el fenomen del «winner takes all».',
  },
};

type Copy = (typeof COPY)[keyof typeof COPY];

// Brief economic lessons linked to common outcomes
const giniLesson = (gini: number, c: Copy): string => {
  if (gini < 0.2) return c.giniLow;
  if (gini < 0.4) return c.giniMid;
  return c.giniHigh;
};

interface Props {
  state: GameState;
  onRestart: () => void;
}

export function EndScreen({ state, onRestart }: Props) {
  const c = COPY[useGameLocale()];
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
            {c.finished(state.round)}
          </div>
          <h2 class="ep2-end-headline">
            {winnerPlayer ? (
              <>
                {c.gana}{' '}
                <span style={{ color: winnerPlayer.color }}>
                  {winnerPlayer.name}
                </span>
              </>
            ) : (
              c.finishedShort
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
                      {' '}{c.ia}
                    </span>
                  )}
                  {!p.alive && (
                    <span style={{ color: '#8A7868', fontWeight: 400, fontSize: '0.75rem' }}>
                      {' '}{c.eliminated}
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
          {c.giniFinal} <strong>{gini.toFixed(3)}</strong>
        </div>

        {/* Economic lesson */}
        <div class="ep2-end-lesson">
          <h3>{c.lessonTitle}</h3>
          <p style={{ margin: 0, lineHeight: 1.55 }}>
            {giniLesson(gini, c)}
          </p>
        </div>

        {/* Restart */}
        <button class="ep2-end-cta" onClick={onRestart}>
          {c.restart}
        </button>
      </div>
    </div>
  );
}
