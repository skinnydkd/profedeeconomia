/** @jsxImportSource preact */
// PlayerLobby — Shown when phase === 'lobby' on the player's phone.
// Waiting for the teacher to start.

import type { PublicState } from '@/lib/games-multi/insider/types';

interface Props {
  publicState: PublicState;
  roomCode: string;
  playerName: string;
}

export function PlayerLobby({ publicState, roomCode, playerName }: Props) {
  const players = publicState.players;

  return (
    <div class="ins-player-lobby">
      <div class="eyebrow">Sala de espera</div>
      <h2 class="serif">¡Hola, {playerName}!</h2>
      <div class="waiting">Esperando a que el profesor inicie la partida…</div>

      <div class="code-display mono">{roomCode}</div>

      {players.length > 0 && (
        <div class="ins-players-small">
          <h4>{players.length} {players.length === 1 ? 'jugador' : 'jugadores'} en la sala</h4>
          <div class="ins-players-small-list">
            {players.map((p) => (
              <span key={p.id} class="ins-player-tag">{p.name}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
