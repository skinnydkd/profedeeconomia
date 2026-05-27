// src/components/jocs-economics/screens/Playing.tsx
import { useState, useEffect } from 'preact/hooks';
import type { PublicQuestion } from '../../../lib/jocs-economics/client/types';

const TIMER_MS = 45000;

interface Props {
  session: {
    currentQuestion: PublicQuestion;
    livesLeft: number;
    score: number;
    questionsAnswered: number;
    questionStartedAtMs: number;
  };
  onAnswer: (optionIdx: number) => void;
  onEnd: () => void;
}

export function Playing({ session, onAnswer, onEnd }: Props) {
  const [selected, setSelected] = useState<number | null>(null);
  const [tick, setTick] = useState(0);
  const [showConfirmEnd, setShowConfirmEnd] = useState(false);

  // Reset selected when question changes
  useEffect(() => {
    setSelected(null);
  }, [session.currentQuestion.id]);

  // 250ms tick for the timer bar
  useEffect(() => {
    const t = setInterval(() => setTick((n) => n + 1), 250);
    return () => clearInterval(t);
  }, []);

  const elapsedMs = Date.now() - session.questionStartedAtMs;
  const remainingMs = Math.max(0, TIMER_MS - elapsedMs);
  const fillPct = (remainingMs / TIMER_MS) * 100;
  const urgent = remainingMs < 10000;

  // Auto-fail when timer reaches 0 without an answer.
  // Send optionIdx=0 (valid value); the server detects serverElapsedMs > 50s
  // and forces isCorrect=false (timeout) regardless of the value sent.
  useEffect(() => {
    if (remainingMs === 0 && selected === null) {
      setSelected(0);
      onAnswer(0);
    }
  }, [remainingMs, selected]);

  function click(idx: number) {
    if (selected !== null) return;
    setSelected(idx);
    onAnswer(idx);
  }

  const lives = Array.from({ length: 3 }, (_, i) =>
    i < session.livesLeft ? '●' : '○'
  ).join('');

  const multiplier = (Math.floor((session.score / Math.max(1, session.questionsAnswered)) / 50) / 10).toFixed(1);

  return (
    <>
      <div class="jocs-stats">
        <span class="jocs-lives">{lives}</span>
        <span>{session.score} pts</span>
        <span>{multiplier}×</span>
      </div>
      <div class={`jocs-timer-bar ${urgent ? 'urgent' : ''}`}>
        <div class="fill" style={{ width: `${fillPct}%` }} />
      </div>

      <p class="jocs-mute" style={{ marginBottom: 8 }}>
        Pregunta {session.questionsAnswered + 1}
      </p>
      <p class="jocs-enunciado">{session.currentQuestion.enunciado || session.currentQuestion.id}</p>

      {session.currentQuestion.opciones.map((opt, i) => (
        <button
          key={i}
          class={`jocs-option ${selected !== null ? 'disabled' : ''} ${selected === i ? 'selected' : ''}`}
          data-opt={i}
          onClick={() => click(i)}
        >
          <span class="letter">{String.fromCharCode(65 + i)}</span>
          <span>{opt}</span>
        </button>
      ))}

      <p style={{ textAlign: 'center', marginTop: 24 }}>
        <a class="jocs-link" onClick={() => setShowConfirmEnd(true)}>Terminar</a>
      </p>

      {showConfirmEnd && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: 'var(--jocs-paper)', padding: 24, borderRadius: 8, maxWidth: 320 }}>
            <p>¿Seguro que quieres terminar la partida?</p>
            <button class="jocs-button-primary" onClick={onEnd}>Sí, terminar</button>
            <button class="jocs-button-primary" style={{ background: 'var(--jocs-line)', color: 'var(--jocs-ink)' }} onClick={() => setShowConfirmEnd(false)}>Continuar jugando</button>
          </div>
        </div>
      )}
    </>
  );
}
