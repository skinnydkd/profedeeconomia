/** @jsxImportSource preact */
// src/components/games/cajut/screens/HostQuestion.tsx
// Projector view during the question phase.
// Shows: question text, 4 option cells (color-coded A/B/C/D), timer top-right,
// response count bottom-left, Skip/End buttons bottom-right.
// Uses a 250ms interval to keep the countdown ticking smoothly between server broadcasts.

import { useState, useEffect } from 'preact/hooks';
import type { PublicState } from '../../../../lib/games-multi/cajut/types';

interface Props {
  publicState: PublicState;
  onSkip: () => void;
  onEnd: () => void;
  onKick: (playerId: string) => void;
}

export function HostQuestion({ publicState, onSkip, onEnd }: Props) {
  // Force a re-render every 250ms so the countdown ticks smoothly
  const [, forceTick] = useState(0);
  useEffect(() => {
    const t = setInterval(() => forceTick((n) => n + 1), 250);
    return () => clearInterval(t);
  }, []);

  const q = publicState.currentQuestion!;
  const respostes = publicState.players.filter((p) => p.hasAnswered).length;
  const total = publicState.players.length;

  const timerLeft = publicState.timerEndsAt
    ? Math.max(0, Math.ceil((publicState.timerEndsAt - Date.now()) / 1000))
    : 0;

  // Grid class: 4+ options → 2 cols, 3 options → 3 cols, 1-2 → 1 col
  const cols =
    q.opciones.length >= 4 ? '' : q.opciones.length === 3 ? 'cols-3' : 'cols-1';

  return (
    <div class="cajut-host">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span class="subtle">
          Pregunta {q.index + 1} / {q.total}
        </span>
        <div class="timer-big">
          00:{String(timerLeft).padStart(2, '0')}
        </div>
      </header>

      <h2 class="enunciado-host" style={{ marginTop: '24px' }}>
        {q.enunciado}
      </h2>

      <div class={`option-grid ${cols}`} style={{ marginTop: '32px' }}>
        {q.opciones.map((opt, i) => (
          <div key={i} class="option-cell" data-opt={i}>
            <span class="letter">{String.fromCharCode(65 + i)}</span>
            <span>{opt}</span>
          </div>
        ))}
      </div>

      <footer
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 'auto',
          paddingTop: '16px',
          borderTop: '1px solid var(--cajut-line-soft)',
        }}
      >
        <span class="subtle">
          Respostes: {respostes} / {total}
        </span>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={onSkip}
            style={{
              fontSize: 12,
              padding: '6px 12px',
              textTransform: 'uppercase',
              letterSpacing: '.1em',
              background: 'transparent',
              border: '1px solid var(--cajut-line)',
              borderRadius: 4,
              cursor: 'pointer',
            }}
          >
            Saltar
          </button>
          <button
            onClick={onEnd}
            style={{
              fontSize: 12,
              padding: '6px 12px',
              textTransform: 'uppercase',
              letterSpacing: '.1em',
              background: 'transparent',
              border: '1px solid var(--cajut-line)',
              borderRadius: 4,
              cursor: 'pointer',
            }}
          >
            Acabar
          </button>
        </div>
      </footer>
    </div>
  );
}
