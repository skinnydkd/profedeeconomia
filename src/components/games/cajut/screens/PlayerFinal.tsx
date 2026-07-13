// src/components/games/cajut/screens/PlayerFinal.tsx
import { useState } from 'preact/hooks';
import type { PublicState, PrivateState } from '../../../../lib/games-multi/cajut/types';
import { useGameLocale } from '../../locale-context';

interface Props {
  publicState: PublicState;
  privateState: PrivateState;
}

export const COPY = {
  es: {
    title: 'Final de la partida',
    puntos: 'puntos',
    posicion: (rank: number, total: number) => `Posición ${rank} de ${total}`,
    revisa: 'Revisa tus respuestas',
    sinRespuesta: 'Sin respuesta',
    tuRespuesta: (letter: string, opt: string) => `Tu respuesta: ${letter} (${opt})`,
    correcta: (letter: string, opt: string) => `Correcta: ${letter} (${opt})`,
  },
  ca: {
    title: 'Final de la partida',
    puntos: 'punts',
    posicion: (rank: number, total: number) => `Posició ${rank} de ${total}`,
    revisa: 'Revisa les teues respostes',
    sinRespuesta: 'Sense resposta',
    tuRespuesta: (letter: string, opt: string) => `La teua resposta: ${letter} (${opt})`,
    correcta: (letter: string, opt: string) => `Correcta: ${letter} (${opt})`,
  },
};

export function PlayerFinal({ publicState, privateState }: Props) {
  const c = COPY[useGameLocale()];
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
        {c.title}
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
        <p class="subtle" style={{ marginTop: 4 }}>{c.puntos}</p>
        {privateState.myRank !== null && totalPlayers > 0 && (
          <p class="subtle" style={{ marginTop: 8 }}>
            {c.posicion(privateState.myRank, totalPlayers)}
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
          {c.revisa}
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
                  ? c.sinRespuesta
                  : c.tuRespuesta(String.fromCharCode(65 + a.myOptionIndex), a.opciones[a.myOptionIndex])}
              </p>
              <p style={{ fontSize: 12, color: 'var(--cajut-pine)', margin: '2px 0 0' }}>
                {c.correcta(String.fromCharCode(65 + a.correcta), a.opciones[a.correcta])}
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
