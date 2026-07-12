/** @jsxImportSource preact */
// SetupScreen — pick 1-6 players (name, color, human/AI).
// At least 1 player must be human before the game can start.
// Props: { onStart(players), hasSave, onContinue }

import { useState } from 'preact/hooks';
import { useGameLocale } from '../locale-context';

// 6 distinct player colors (Variant C palette)
const PLAYER_COLORS = [
  '#1F6E6E', // teal
  '#C44E2C', // terra
  '#A87A2A', // mostaza
  '#2E5E3A', // pine
  '#5B3A4E', // berenjena
  '#8C2F39', // garnet
];

const DEFAULT_NAMES = [
  'Jugador 1', 'Jugador 2', 'Jugador 3',
  'Jugador 4', 'Jugador 5', 'Jugador 6',
];

interface PlayerConfig {
  name: string;
  color: string;
  isHuman: boolean;
}

interface Props {
  onStart: (players: PlayerConfig[]) => void;
  hasSave: boolean;
  onContinue: () => void;
}

export const COPY = {
  es: {
    title: 'Econopoly',
    subtitle:
      'Juego de tablero de economía. Hasta 6 jugadores (humanos o IA), monopolios, R+D, ciclos económicos y subasta. 20 rondas. Gana quien más patrimonio acumule.',
    jugadores: (n: number) => `Jugadores (${n}/6)`,
    humano: 'Humano',
    ia: 'IA',
    toggleTitle: 'Cambiar entre Humano e IA',
    removeTitle: 'Eliminar jugador',
    add: '+ Añadir jugador',
    continue: 'Continuar partida',
    needHuman: 'Selecciona al menos 1 jugador humano',
    start: 'Empezar',
  },
  ca: {
    title: 'Econopoly',
    subtitle:
      'Joc de tauler d\'economia. Fins a 6 jugadors (humans o IA), monopolis, R+D, cicles econòmics i subhasta. 20 rondes. Guanya qui més patrimoni acumule.',
    jugadores: (n: number) => `Jugadors (${n}/6)`,
    humano: 'Humà',
    ia: 'IA',
    toggleTitle: 'Canviar entre Humà i IA',
    removeTitle: 'Eliminar jugador',
    add: '+ Afig un jugador',
    continue: 'Continua la partida',
    needHuman: 'Selecciona almenys 1 jugador humà',
    start: 'Comença',
  },
};

export function SetupScreen({ onStart, hasSave, onContinue }: Props) {
  const c = COPY[useGameLocale()];
  const [players, setPlayers] = useState<PlayerConfig[]>([
    { name: 'Jugador 1', color: PLAYER_COLORS[0], isHuman: true },
    { name: 'IA 1',      color: PLAYER_COLORS[1], isHuman: false },
  ]);

  function addPlayer() {
    if (players.length >= 6) return;
    const idx = players.length;
    const isHuman = false;
    setPlayers([
      ...players,
      {
        name: isHuman ? DEFAULT_NAMES[idx] : `IA ${idx}`,
        color: PLAYER_COLORS[idx],
        isHuman,
      },
    ]);
  }

  function removePlayer(idx: number) {
    if (players.length <= 1) return;
    setPlayers(players.filter((_, i) => i !== idx));
  }

  function updateName(idx: number, name: string) {
    const next = [...players];
    next[idx] = { ...next[idx], name };
    setPlayers(next);
  }

  function toggleType(idx: number) {
    const next = [...players];
    const wasHuman = next[idx].isHuman;
    next[idx] = { ...next[idx], isHuman: !wasHuman };
    setPlayers(next);
  }

  const hasHuman = players.some((p) => p.isHuman);
  const canStart = hasHuman;

  function handleStart() {
    if (!canStart) return;
    onStart(players);
  }

  return (
    <div class="ep2-setup">
      <div class="ep2-setup-card">
        {/* Title */}
        <div>
          <h1 class="ep2-setup-title">{c.title}</h1>
          <p class="ep2-setup-subtitle">{c.subtitle}</p>
        </div>

        {/* Player list */}
        <div>
          <div class="ep2-setup-section-label">
            {c.jugadores(players.length)}
          </div>
          <div class="ep2-player-list">
            {players.map((p, idx) => (
              <div
                key={idx}
                class={`ep2-player-row${p.isHuman ? ' active' : ''}`}
              >
                {/* Color swatch */}
                <span
                  class="ep2-player-swatch"
                  style={{ background: p.color }}
                />

                {/* Name input */}
                <input
                  class="ep2-player-name-input"
                  type="text"
                  value={p.name}
                  maxLength={20}
                  onInput={(e) => updateName(idx, (e.target as HTMLInputElement).value)}
                />

                {/* Human / AI toggle */}
                <button
                  class="ep2-player-type-tag"
                  style={{ background: p.isHuman ? p.color : '#8A7868' }}
                  onClick={() => toggleType(idx)}
                  title={c.toggleTitle}
                >
                  {p.isHuman ? c.humano : c.ia}
                </button>

                {/* Remove button (only if more than 1 player) */}
                {players.length > 1 && (
                  <button
                    class="ep2-player-remove"
                    onClick={() => removePlayer(idx)}
                    title={c.removeTitle}
                  >
                    x
                  </button>
                )}
              </div>
            ))}

            {/* Add player button */}
            {players.length < 6 && (
              <button class="ep2-setup-add" onClick={addPlayer}>
                {c.add}
              </button>
            )}
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {hasSave && (
            <button class="ep2-setup-cta ghost" onClick={onContinue}>
              {c.continue}
            </button>
          )}
          {!hasHuman && (
            <p class="ep2-setup-error">
              {c.needHuman}
            </p>
          )}
          <button
            class="ep2-setup-cta"
            onClick={handleStart}
            disabled={!canStart}
          >
            {c.start}
          </button>
        </div>
      </div>
    </div>
  );
}
