// src/components/games/cajut/screens/PlayerFinal.tsx
import { useState } from 'preact/hooks';
import type { PublicState, PrivateState } from '../../../../lib/games-multi/cajut/types';

interface Props {
  publicState: PublicState;
  privateState: PrivateState;
}

export function PlayerFinal({ publicState, privateState }: Props) {
  const [showReview, setShowReview] = useState(false);
  const totalPlayers = publicState.finalRanking?.length ?? 0;

  return (
    <div class="cajut-player">
      <h2
        style={{
          fontFamily: 'Fraunces, serif',
          textAlign: 'center',
          marginTop: 32,
          fontSize: 28,
        }}
      >
        Final de la partida
      </h2>

      <div style={{ textAlign: 'center', marginTop: 32 }}>
        <p
          style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: 48,
            margin: 0,
          }}
        >
          {privateState.myScore}
        </p>
        <p class="subtle" style={{ marginTop: 4 }}>punts</p>
        {privateState.myRank !== null && totalPlayers > 0 && (
          <p class="subtle" style={{ marginTop: 8 }}>
            Posició {privateState.myRank} de {totalPlayers}
          </p>
        )}
      </div>

      {!showReview ? (
        <button
          onClick={() => setShowReview(true)}
          style={{
            marginTop: 32,
            padding: '12px 20px',
            background: 'var(--cajut-ink)',
            color: 'white',
            border: 'none',
            borderRadius: 6,
            fontSize: 14,
            cursor: 'pointer',
            alignSelf: 'center',
          }}
        >
          Revisa les teues respostes
        </button>
      ) : (
        <div style={{ marginTop: 16, overflowY: 'auto', flex: 1 }}>
          {privateState.myAnswerHistory?.map((a) => (
            <div
              key={a.questionIndex}
              style={{ borderTop: '1px solid var(--cajut-line-soft)', padding: '12px 0' }}
            >
              <p style={{ fontFamily: 'Fraunces, serif', fontSize: 15, margin: 0 }}>
                {a.enunciado}
              </p>
              <p
                style={{
                  fontSize: 12,
                  color: a.wasCorrect ? 'var(--cajut-pine)' : 'var(--cajut-terracota)',
                  marginTop: 4,
                }}
              >
                {a.myOptionIndex === null
                  ? 'Sense resposta'
                  : `La teua: ${String.fromCharCode(65 + a.myOptionIndex)} (${a.opciones[a.myOptionIndex]})`}
              </p>
              <p style={{ fontSize: 12, color: 'var(--cajut-pine)', margin: '2px 0 0' }}>
                Correcta: {String.fromCharCode(65 + a.correcta)} ({a.opciones[a.correcta]})
              </p>
              {a.explicacion && (
                <p
                  class="subtle"
                  style={{ fontSize: 12, fontStyle: 'italic', marginTop: 6 }}
                >
                  {a.explicacion}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
