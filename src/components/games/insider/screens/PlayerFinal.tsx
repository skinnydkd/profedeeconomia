/** @jsxImportSource preact */
// PlayerFinal — Shown when phase === 'finished' on the player's phone.
// Shows the player's rank and score, and the top-3 ranking.

import type { PublicState, PrivateState } from '@/lib/games-multi/insider/types';
import { useGameLocale } from '../../locale-context';

interface Props {
  publicState: PublicState;
  privateState: PrivateState | null;
}

export const COPY = {
  es: {
    finPartida: 'Fin de partida',
    primeraPosicion: '¡Primera posición!',
    posicion: (rank: number, total: number) => `Posición ${rank} de ${total}`,
    laPalabraEra: 'La palabra era: ',
    esperaProfesor: 'Espera al profesor para una nueva partida.',
  },
  ca: {
    finPartida: 'Fi de la partida',
    primeraPosicion: 'Primera posició!',
    posicion: (rank: number, total: number) => `Posició ${rank} de ${total}`,
    laPalabraEra: 'La paraula era: ',
    esperaProfesor: 'Espera el professor per a una nova partida.',
  },
};

export function PlayerFinal({ publicState, privateState }: Props) {
  const c = COPY[useGameLocale()];
  const myId = privateState?.myId ?? '';
  const ranking = publicState.finalRanking ?? [...publicState.players]
    .sort((a, b) => b.score - a.score)
    .map((p) => ({ id: p.id, name: p.name, score: p.score }));

  const myRank = ranking.findIndex((e) => e.id === myId);
  const myEntry = ranking[myRank];

  return (
    <div class="ins-player-final">
      <h2 class="serif">{c.finPartida}</h2>

      {myEntry && (
        <>
          <div class="your-score mono">{myEntry.score}</div>
          <div class="your-rank">
            {myRank === 0
              ? c.primeraPosicion
              : c.posicion(myRank + 1, ranking.length)}
          </div>
        </>
      )}

      {publicState.word && (
        <p style="font-size:13px;color:var(--soft);margin-bottom:16px;font-style:italic;font-family:'Fraunces',serif;">
          {c.laPalabraEra}<strong style="color:var(--teal);">{publicState.word}</strong>
        </p>
      )}

      <div class="ins-ranking" style="max-width:100%;">
        {ranking.slice(0, 5).map((entry, i) => (
          <div
            key={entry.id}
            class={`ins-ranking-entry${i === 0 ? ' gold' : ''}${entry.id === myId ? '' : ''}`}
            style={entry.id === myId ? 'border-color:var(--terra);' : ''}
          >
            <span class="pos mono">{i + 1}º</span>
            <span class="nm">{entry.name}</span>
            <span class="sc mono">{entry.score}</span>
          </div>
        ))}
      </div>

      <p style="font-size:12px;color:var(--mute);margin-top:12px;font-style:italic;font-family:'Fraunces',serif;">
        {c.esperaProfesor}
      </p>
    </div>
  );
}
