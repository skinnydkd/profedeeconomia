// src/components/games/cajut/screens/PlayerRevealLocal.tsx
// Simple reveal: shows correct letter + current score. No per-player green/red
// (approach a: simpler, avoids needing private state delta computation).
import type { PublicState, PrivateState } from '../../../../lib/games-multi/cajut/types';

interface Props {
  publicState: PublicState;
  privateState: PrivateState;
}

export function PlayerRevealLocal({ publicState, privateState }: Props) {
  const rev = publicState.lastReveal!;
  const correctLetter = String.fromCharCode(65 + rev.correctOption);

  return (
    <div
      class="cajut-player"
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        background: 'var(--cajut-paper)',
      }}
    >
      <p class="subtle" style={{ marginBottom: 8 }}>La correcta era</p>
      <h2
        style={{
          fontFamily: 'Fraunces, serif',
          fontSize: 64,
          margin: 0,
          color: 'var(--cajut-ink)',
        }}
      >
        {correctLetter}
      </h2>
      <p
        style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: 24,
          marginTop: 24,
        }}
      >
        {privateState.myScore} punts
      </p>
      {privateState.myRank !== null && (
        <p class="subtle" style={{ marginTop: 8 }}>
          Vas {privateState.myRank}r
        </p>
      )}
    </div>
  );
}
