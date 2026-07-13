// src/components/games/cajut/screens/PlayerRevealLocal.tsx
// Simple reveal: shows correct letter + current score. No per-player green/red
// (approach a: simpler, avoids needing private state delta computation).
import type { PublicState, PrivateState } from '../../../../lib/games-multi/cajut/types';
import { useGameLocale } from '../../locale-context';

// Spanish ordinals: 1.º, 2.º, 3.º, ...
function esOrdinal(n: number): string {
  return `${n}.º`;
}

// Valencian (AVL) masculine ordinals: 1r, 2n, 3r, 4t, then Né
function caOrdinal(n: number): string {
  if (n === 1) return '1r';
  if (n === 2) return '2n';
  if (n === 3) return '3r';
  if (n === 4) return '4t';
  return `${n}é`;
}

interface Props {
  publicState: PublicState;
  privateState: PrivateState;
}

export const COPY = {
  es: {
    laCorrecta: 'La correcta era',
    puntos: 'puntos',
    vas: (ord: string) => `Vas ${ord}`,
  },
  ca: {
    laCorrecta: 'La correcta era',
    puntos: 'punts',
    vas: (ord: string) => `Vas ${ord}`,
  },
};

export function PlayerRevealLocal({ publicState, privateState }: Props) {
  const locale = useGameLocale();
  const c = COPY[locale];
  const ordinal = locale === 'ca' ? caOrdinal : esOrdinal;
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
      <p class="subtle" style={{ marginBottom: 8 }}>{c.laCorrecta}</p>
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
        {privateState.myScore} {c.puntos}
      </p>
      {privateState.myRank !== null && (
        <p class="subtle" style={{ marginTop: 8 }}>
          {c.vas(ordinal(privateState.myRank))}
        </p>
      )}
    </div>
  );
}
