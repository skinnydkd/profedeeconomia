/** @jsxImportSource preact */
// PlayerFinal — Shown when phase === 'finished' on the player's phone.
// Shows the player's rank and score, and the top-3 ranking.

import type { PublicState, PrivateState } from '@/lib/games-multi/insider/types';

interface Props {
  publicState: PublicState;
  privateState: PrivateState | null;
}

export function PlayerFinal({ publicState, privateState }: Props) {
  const myId = privateState?.myId ?? '';
  const ranking = publicState.finalRanking ?? [...publicState.players]
    .sort((a, b) => b.score - a.score)
    .map((p) => ({ id: p.id, name: p.name, score: p.score }));

  const myRank = ranking.findIndex((e) => e.id === myId);
  const myEntry = ranking[myRank];

  return (
    <div class="ins-player-final">
      <h2 class="serif">Fin de partida</h2>

      {myEntry && (
        <>
          <div class="your-score mono">{myEntry.score}</div>
          <div class="your-rank">
            {myRank === 0
              ? '¡Primera posición!'
              : `Posición ${myRank + 1} de ${ranking.length}`}
          </div>
        </>
      )}

      {publicState.word && (
        <p style="font-size:13px;color:var(--soft);margin-bottom:16px;font-style:italic;font-family:'Fraunces',serif;">
          La palabra era: <strong style="color:var(--teal);">{publicState.word}</strong>
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
        Espera al profesor para una nueva partida.
      </p>
    </div>
  );
}
