/** @jsxImportSource preact */
// HostLobby — Shown while phase === 'lobby' on the host projector.
// Displays the room code prominently, the player list, and game config.

import { useState } from 'preact/hooks';
import type { PublicState } from '@/lib/games-multi/insider/types';

interface Props {
  publicState: PublicState;
  roomCode: string;
  onStart: (totalRounds: number, impostorCountOverride?: number) => void;
}

const MIN_PLAYERS = 4;

export function HostLobby({ publicState, roomCode, onStart }: Props) {
  const [rounds, setRounds] = useState(5);
  const [impostorOverride, setImpostorOverride] = useState<number | undefined>(undefined);

  const players = publicState.players;
  const canStart = players.length >= MIN_PLAYERS;

  const handleStart = () => {
    onStart(rounds, impostorOverride);
  };

  // Ordinal position in grid — stable suffix
  const initial = (name: string) => name.charAt(0).toUpperCase();

  return (
    <div class="ins-lobby">
      {/* Header */}
      <div class="ins-lobby-header">
        <div class="eyebrow">Sala de espera</div>
        <h1 class="serif">Insider</h1>
      </div>

      {/* Prominent room code */}
      <div class="ins-lobby-code-block">
        <div class="l">Código de sala</div>
        <div class="code mono">{roomCode}</div>
        <div class="hint">Los alumnos entran en <strong>profedeeconomia.es/juegos/insider/</strong> e introducen este código.</div>
      </div>

      {/* Players list */}
      <div class="ins-lobby-players">
        <h4>{players.length} {players.length === 1 ? 'jugador' : 'jugadores'} conectados</h4>
        {players.length === 0 ? (
          <div class="ins-empty-players">
            Esperando a que se unan los alumnos…
          </div>
        ) : (
          <div class="ins-lobby-players-list">
            {players.map((p) => (
              <div key={p.id} class="ins-lobby-player-chip">
                <span class="av">{initial(p.name)}</span>
                <span class="nm">{p.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Config controls */}
      <div class="ins-config">
        <div class="ins-config-field">
          <label for="rounds-select">Rondas</label>
          <select
            id="rounds-select"
            value={rounds}
            onChange={(e) => setRounds(Number((e.target as HTMLSelectElement).value))}
          >
            <option value={3}>3</option>
            <option value={4}>4</option>
            <option value={5}>5</option>
            <option value={7}>7</option>
            <option value={10}>10</option>
          </select>
        </div>
        <div class="ins-config-field">
          <label for="impostor-select">Impostores</label>
          <select
            id="impostor-select"
            value={impostorOverride ?? ''}
            onChange={(e) => {
              const v = (e.target as HTMLSelectElement).value;
              setImpostorOverride(v === '' ? undefined : Number(v));
            }}
          >
            <option value="">Auto</option>
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
          </select>
        </div>
      </div>

      {/* Start button */}
      <div class="ins-btn-row">
        <button
          class="ins-btn"
          disabled={!canStart}
          onClick={handleStart}
        >
          {canStart
            ? 'Empezar partida'
            : `Faltan ${MIN_PLAYERS - players.length} jugadores para empezar`}
        </button>
      </div>

      {!canStart && players.length > 0 && (
        <p style="font-size:12px;color:var(--mute);margin-top:8px;font-style:italic;font-family:'Fraunces',serif;">
          Mínimo {MIN_PLAYERS} jugadores para iniciar.
        </p>
      )}
    </div>
  );
}
