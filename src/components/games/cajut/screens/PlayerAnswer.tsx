// src/components/games/cajut/screens/PlayerAnswer.tsx
// Mobile-first answer screen. Shows ONLY color + letter (A/B/C/D), NO question text.
// The student reads the question from the classroom board.
import type { PublicState } from '../../../../lib/games-multi/cajut/types';
import { useEffect, useState } from 'preact/hooks';

interface Props {
  publicState: PublicState;
  onAnswer: (optionIndex: number) => void;
}

export function PlayerAnswer({ publicState, onAnswer }: Props) {
  const q = publicState.currentQuestion!;
  const [selected, setSelected] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);

  // 250ms tick for smooth countdown (mirrors HostQuestion)
  useEffect(() => {
    function tick() {
      if (!publicState.timerEndsAt) {
        setTimeLeft(0);
        return;
      }
      setTimeLeft(Math.max(0, Math.ceil((publicState.timerEndsAt - Date.now()) / 1000)));
    }
    tick();
    const interval = setInterval(tick, 250);
    return () => clearInterval(interval);
  }, [publicState.timerEndsAt]);

  function handleClick(i: number) {
    if (selected !== null) return; // block further clicks once answered
    setSelected(i);
    onAnswer(i);
  }

  const total = q.total;
  const index = q.index + 1;
  const optCount = q.opciones.length;

  return (
    <div class="cajut-player" style={{ gap: 12 }}>
      {/* Top bar: progress + timer */}
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: 12,
          color: 'var(--cajut-ink-soft)',
        }}
      >
        <span
          style={{
            background: 'var(--cajut-paper)',
            border: '1px solid var(--cajut-line)',
            borderRadius: 4,
            padding: '3px 8px',
          }}
        >
          {index}&nbsp;/&nbsp;{total}
        </span>
        <span
          style={{
            background: 'var(--cajut-paper)',
            border: '1px solid var(--cajut-line)',
            borderRadius: 4,
            padding: '3px 8px',
          }}
        >
          00:{String(timeLeft).padStart(2, '0')}
        </span>
      </header>

      {/* Instruction subtext */}
      <p
        style={{
          textAlign: 'center',
          fontFamily: 'Fraunces, serif',
          fontStyle: 'italic',
          fontSize: 13,
          color: 'var(--cajut-ink-mute)',
          margin: 0,
        }}
      >
        Mira la pregunta a la pissarra
      </p>

      {/* Answer buttons — full-screen grid, only color + letter */}
      <div
        class="player-button-grid"
        style={
          optCount === 2
            ? { gridTemplateColumns: '1fr', gridTemplateRows: '1fr 1fr' }
            : optCount === 3
              ? { gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr' }
              : {}
        }
      >
        {q.opciones.map((_, i) => (
          <button
            key={i}
            class={`player-button${selected === i ? ' selected' : ''}`}
            data-opt={i}
            onClick={() => handleClick(i)}
            disabled={selected !== null}
          >
            {String.fromCharCode(65 + i)}
          </button>
        ))}
      </div>
    </div>
  );
}
