/** @jsxImportSource preact */
// PlayerVote — Shown during phase === 'voting' on the player's phone.
// Grid of alive players to tap and vote. Submits once.

import { useState } from 'preact/hooks';
import type { PublicState, PrivateState } from '@/lib/games-multi/insider/types';

interface Props {
  publicState: PublicState;
  privateState: PrivateState | null;
  myId: string;
  onVote: (targetId: string) => void;
}

export function PlayerVote({ publicState, privateState, myId, onVote }: Props) {
  const [voted, setVoted] = useState<string | null>(null);
  const canVote = privateState?.canVote ?? true;
  const aliveOthers = publicState.players.filter((p) => p.alive && p.id !== myId);
  const hasVoted = voted !== null;

  const handleVote = (targetId: string) => {
    if (hasVoted || !canVote) return;
    setVoted(targetId);
    onVote(targetId);
  };

  const initial = (name: string) => name.charAt(0).toUpperCase();

  return (
    <>
      <div class="ins-eyebrow" style="text-align:center;">Fase de votación</div>

      {!canVote ? (
        <div class="ins-notice info">
          No participas en la votación esta ronda.
        </div>
      ) : hasVoted ? (
        <div class="ins-notice">
          Voto emitido. Esperando a los demás jugadores…
          <br />
          <span style="font-size:11px;color:var(--soft);">
            {publicState.votesCast} de {aliveOthers.length + 1} votos
          </span>
        </div>
      ) : (
        <>
          <p style="font-size:13px;color:var(--soft);margin:0;font-style:italic;font-family:'Fraunces',serif;">
            ¿Quién crees que es el impostor? Toca para votar.
          </p>
          <div class="ins-vote-grid">
            {aliveOthers.map((p) => (
              <button
                key={p.id}
                class={`ins-vote-chip${voted === p.id ? ' selected' : ''}`}
                onClick={() => handleVote(p.id)}
              >
                <div class="av">{initial(p.name)}</div>
                {p.name}
              </button>
            ))}
          </div>
        </>
      )}
    </>
  );
}
