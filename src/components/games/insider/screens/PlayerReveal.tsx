/** @jsxImportSource preact */
// PlayerReveal — Shown during phase === 'reveal' on the player's phone.
// Shows who was eliminated and whether they were the impostor.

import type { PublicState, PrivateState } from '@/lib/games-multi/insider/types';

interface Props {
  publicState: PublicState;
  privateState: PrivateState | null;
}

export function PlayerReveal({ publicState, privateState: _privateState }: Props) {
  const lastReveal = publicState.lastReveal;
  const eliminated = lastReveal
    ? publicState.players.find((p) => p.id === lastReveal.eliminatedId)
    : null;

  if (!lastReveal || !eliminated) {
    return (
      <div class="ins-player-lobby">
        <div class="waiting">Revelando resultado…</div>
      </div>
    );
  }

  return (
    <>
      <div class="ins-eyebrow" style="text-align:center;">Resultado de la votación</div>

      <div class="ins-reveal-box" style="margin:0;">
        <div class="lab">Eliminado</div>
        <div class="name serif">{eliminated.name}</div>
        <div class={`verdict ${lastReveal.wasImpostor ? 'impostor' : 'citizen'}`}>
          {lastReveal.wasImpostor ? 'Era el impostor' : 'Era ciudadano'}
        </div>
        {publicState.word && lastReveal.wasImpostor && (
          <div class="word-reveal">
            La palabra era: <strong>{publicState.word}</strong>
          </div>
        )}
      </div>

      {/* Score update hint */}
      <div class="ins-hint" style="text-align:center;">
        {lastReveal.wasImpostor
          ? 'Los ciudadanos que votaron correctamente han ganado puntos.'
          : 'El impostor sobrevive y gana puntos extra.'}
      </div>

      <div class="ins-notice" style="text-align:center;">
        Esperando la siguiente fase…
      </div>
    </>
  );
}
