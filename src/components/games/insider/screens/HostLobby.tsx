/** @jsxImportSource preact */
// HostLobby — Shown while phase === 'lobby' on the host projector.
// Displays the room code prominently, the player list, and game config.

import { useState } from 'preact/hooks';
import type { PublicState } from '@/lib/games-multi/insider/types';
import { useGameLocale } from '../../locale-context';

interface Props {
  publicState: PublicState;
  roomCode: string;
  onStart: (totalRounds: number, impostorCountOverride?: number) => void;
}

const MIN_PLAYERS = 4;

export const COPY = {
  es: {
    salaEspera: 'Sala de espera',
    titulo: 'Insider',
    codigoSala: 'Código de sala',
    hintPre: 'Los alumnos entran en ',
    hintPost: ' e introducen este código.',
    jugadoresConectados: (n: number) => `${n} ${n === 1 ? 'jugador' : 'jugadores'} conectados`,
    esperando: 'Esperando a que se unan los alumnos…',
    rondas: 'Rondas',
    impostores: 'Impostores',
    auto: 'Auto',
    empezar: 'Empezar partida',
    faltan: (n: number) => `Faltan ${n} jugadores para empezar`,
    minimo: (n: number) => `Mínimo ${n} jugadores para iniciar.`,
  },
  ca: {
    salaEspera: "Sala d'espera",
    titulo: 'Insider',
    codigoSala: 'Codi de sala',
    hintPre: 'Els alumnes entren a ',
    hintPost: ' i introduïxen este codi.',
    jugadoresConectados: (n: number) => `${n} ${n === 1 ? 'jugador' : 'jugadors'} connectats`,
    esperando: "Esperant que s'unisquen els alumnes…",
    rondas: 'Rondes',
    impostores: 'Impostors',
    auto: 'Auto',
    empezar: 'Comença la partida',
    faltan: (n: number) => `Falten ${n} jugadors per a començar`,
    minimo: (n: number) => `Mínim ${n} jugadors per a iniciar.`,
  },
};

export function HostLobby({ publicState, roomCode, onStart }: Props) {
  const c = COPY[useGameLocale()];
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
        <div class="eyebrow">{c.salaEspera}</div>
        <h1 class="serif">{c.titulo}</h1>
      </div>

      {/* Prominent room code */}
      <div class="ins-lobby-code-block">
        <div class="l">{c.codigoSala}</div>
        <div class="code mono">{roomCode}</div>
        <div class="hint">{c.hintPre}<strong>profedeeconomia.es/juegos/insider/</strong>{c.hintPost}</div>
      </div>

      {/* Players list */}
      <div class="ins-lobby-players">
        <h4>{c.jugadoresConectados(players.length)}</h4>
        {players.length === 0 ? (
          <div class="ins-empty-players">
            {c.esperando}
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
          <label for="rounds-select">{c.rondas}</label>
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
          <label for="impostor-select">{c.impostores}</label>
          <select
            id="impostor-select"
            value={impostorOverride ?? ''}
            onChange={(e) => {
              const v = (e.target as HTMLSelectElement).value;
              setImpostorOverride(v === '' ? undefined : Number(v));
            }}
          >
            <option value="">{c.auto}</option>
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
            ? c.empezar
            : c.faltan(MIN_PLAYERS - players.length)}
        </button>
      </div>

      {!canStart && players.length > 0 && (
        <p style="font-size:12px;color:var(--mute);margin-top:8px;font-style:italic;font-family:'Fraunces',serif;">
          {c.minimo(MIN_PLAYERS)}
        </p>
      )}
    </div>
  );
}
