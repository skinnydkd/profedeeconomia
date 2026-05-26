/** @jsxImportSource preact */
// HostFinal — Shown when phase === 'finished' on the host projector.
// Displays the final ranking and a restart button.

import type { PublicState } from '@/lib/games-multi/insider/types';

interface Props {
  publicState: PublicState;
  onRestart: () => void;
}

export function HostFinal({ publicState, onRestart }: Props) {
  const ranking = publicState.finalRanking ?? [...publicState.players]
    .sort((a, b) => b.score - a.score)
    .map((p) => ({ id: p.id, name: p.name, score: p.score }));

  return (
    <div class="ins-final">
      <h2 class="serif">Fin de partida</h2>

      {publicState.word && (
        <p style="font-size:14px;color:var(--soft);margin-bottom:20px;font-style:italic;font-family:'Fraunces',serif;">
          La palabra era: <strong style="color:var(--teal);font-size:18px;">{publicState.word}</strong>
        </p>
      )}

      <div class="ins-ranking">
        {ranking.map((entry, i) => (
          <div key={entry.id} class={`ins-ranking-entry${i === 0 ? ' gold' : ''}`}>
            <span class="pos mono">{i + 1}º</span>
            <span class="nm">{entry.name}</span>
            <span class="sc mono">{entry.score}</span>
          </div>
        ))}
      </div>

      <div class="ins-btn-row" style="justify-content:center;">
        <button class="ins-btn" onClick={onRestart}>
          Jugar otra vez
        </button>
      </div>
    </div>
  );
}
