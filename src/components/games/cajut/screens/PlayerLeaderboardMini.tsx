// src/components/games/cajut/screens/PlayerLeaderboardMini.tsx
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
    vas: (ord: string, score: number) => `Vas ${ord} con ${score} puntos`,
  },
  ca: {
    vas: (ord: string, score: number) => `Vas ${ord} amb ${score} punts`,
  },
};

export function PlayerLeaderboardMini({ publicState, privateState }: Props) {
  const locale = useGameLocale();
  const c = COPY[locale];
  const ordinal = locale === 'ca' ? caOrdinal : esOrdinal;
  const top5 = publicState.lastReveal?.top5 ?? [];
  const meInTop = top5.some((p) => p.id === privateState.myId);

  return (
    <div class="cajut-player" style={{ justifyContent: 'center' }}>
      <h2 style={{ fontFamily: 'Fraunces, serif', textAlign: 'center' }}>Top 5</h2>
      <ol style={{ listStyle: 'none', padding: 0, maxWidth: 280, margin: '24px auto' }}>
        {top5.map((p, i) => (
          <li
            key={p.id}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '8px 12px',
              borderBottom: '1px solid var(--cajut-line-soft)',
              fontSize: 16,
              fontWeight: p.id === privateState.myId ? 600 : 400,
              background:
                p.id === privateState.myId ? 'var(--cajut-line-soft)' : 'transparent',
              borderRadius: p.id === privateState.myId ? 4 : 0,
            }}
          >
            <span>
              {i + 1}. {p.nick}
            </span>
            <span style={{ fontFamily: 'JetBrains Mono, monospace' }}>{p.score}</span>
          </li>
        ))}
      </ol>
      {!meInTop && privateState.myRank !== null && (
        <p class="subtle" style={{ textAlign: 'center' }}>
          {c.vas(ordinal(privateState.myRank), privateState.myScore)}
        </p>
      )}
    </div>
  );
}
