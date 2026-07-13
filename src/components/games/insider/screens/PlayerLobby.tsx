/** @jsxImportSource preact */
// PlayerLobby — Shown when phase === 'lobby' on the player's phone.
// Waiting for the teacher to start.

import type { PublicState } from '@/lib/games-multi/insider/types';
import { useGameLocale } from '../../locale-context';

interface Props {
  publicState: PublicState;
  roomCode: string;
  playerName: string;
}

export const COPY = {
  es: {
    salaEspera: 'Sala de espera',
    hola: (name: string) => `¡Hola, ${name}!`,
    esperando: 'Esperando a que el profesor inicie la partida…',
    jugadoresEnSala: (n: number) => `${n} ${n === 1 ? 'jugador' : 'jugadores'} en la sala`,
  },
  ca: {
    salaEspera: "Sala d'espera",
    hola: (name: string) => `Hola, ${name}!`,
    esperando: 'Esperant que el professor inicie la partida…',
    jugadoresEnSala: (n: number) => `${n} ${n === 1 ? 'jugador' : 'jugadors'} a la sala`,
  },
};

export function PlayerLobby({ publicState, roomCode, playerName }: Props) {
  const c = COPY[useGameLocale()];
  const players = publicState.players;

  return (
    <div class="ins-player-lobby">
      <div class="eyebrow">{c.salaEspera}</div>
      <h2 class="serif">{c.hola(playerName)}</h2>
      <div class="waiting">{c.esperando}</div>

      <div class="code-display mono">{roomCode}</div>

      {players.length > 0 && (
        <div class="ins-players-small">
          <h4>{c.jugadoresEnSala(players.length)}</h4>
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
