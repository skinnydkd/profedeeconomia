// src/components/jocs-economics/screens/GameOver.tsx
import type { FinalStats } from '../../../lib/jocs-economics/client/types';

interface Props { final: FinalStats; onPlayAgain: () => void; }

export function GameOver({ final, onPlayAgain }: Props) {
  return (
    <>
      <h2 class="jocs-title" style={{ fontSize: 28, textAlign: 'center', margin: '32px 0' }}>
        Fin de la partida
      </h2>
      <p style={{ fontSize: 48, fontFamily: 'JetBrains Mono, monospace', textAlign: 'center', margin: '16px 0' }}>
        {final.score}
      </p>
      <p class="jocs-mute" style={{ textAlign: 'center' }}>puntos</p>

      <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid var(--jocs-line-soft)' }}>
        <p>Preguntas acertadas: {final.questionsAnswered}</p>
        <p>Tiempo total: {Math.round(final.timeTotalMs / 1000)} s</p>
        <p>Nivel máximo: {final.maxDifficultyReached.toFixed(1)}×</p>
      </div>

      {final.finalRank !== null && (
        <p style={{ marginTop: 24, textAlign: 'center', fontSize: 20 }}>
          Posición #{final.finalRank}
        </p>
      )}
      {final.instituteRank !== null && (
        <p style={{ textAlign: 'center' }}>
          Tu instituto: #{final.instituteRank}
        </p>
      )}

      <button class="jocs-button-primary" onClick={onPlayAgain} style={{ marginTop: 24 }}>
        Jugar de nuevo
      </button>
      <p style={{ textAlign: 'center', marginTop: 16 }}>
        <a class="jocs-link" href="/jocs-economics/leaderboard/">Ver ranking completo →</a>
      </p>
    </>
  );
}
