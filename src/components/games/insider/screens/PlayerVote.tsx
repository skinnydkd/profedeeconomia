/** @jsxImportSource preact */
// PlayerVote — Shown during phase === 'voting' on the player's phone.
// Grid of alive players to tap and vote. Submits once.

import { useState } from 'preact/hooks';
import type { PublicState, PrivateState } from '@/lib/games-multi/insider/types';
import { useGameLocale } from '../../locale-context';

interface Props {
  publicState: PublicState;
  privateState: PrivateState | null;
  myId: string;
  onVote: (targetId: string) => void;
}

export const COPY = {
  es: {
    faseVotacion: 'Fase de votación',
    noParticipas: 'No participas en la votación esta ronda.',
    votoEmitido: 'Voto emitido. Esperando a los demás jugadores…',
    votos: (cast: number, total: number) => `${cast} de ${total} votos`,
    quienImpostor: '¿Quién crees que es el impostor? Toca para votar.',
  },
  ca: {
    faseVotacion: 'Fase de votació',
    noParticipas: "No participes en la votació d'esta ronda.",
    votoEmitido: 'Vot emés. Esperant els altres jugadors…',
    votos: (cast: number, total: number) => `${cast} de ${total} vots`,
    quienImpostor: "Qui creus que és l'impostor? Toca per a votar.",
  },
};

export function PlayerVote({ publicState, privateState, myId, onVote }: Props) {
  const c = COPY[useGameLocale()];
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
      <div class="ins-eyebrow" style="text-align:center;">{c.faseVotacion}</div>

      {!canVote ? (
        <div class="ins-notice info">
          {c.noParticipas}
        </div>
      ) : hasVoted ? (
        <div class="ins-notice">
          {c.votoEmitido}
          <br />
          <span style="font-size:11px;color:var(--soft);">
            {c.votos(publicState.votesCast, aliveOthers.length + 1)}
          </span>
        </div>
      ) : (
        <>
          <p style="font-size:13px;color:var(--soft);margin:0;font-style:italic;font-family:'Fraunces',serif;">
            {c.quienImpostor}
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
