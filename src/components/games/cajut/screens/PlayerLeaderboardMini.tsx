// src/components/games/cajut/screens/PlayerLeaderboardMini.tsx
import type { PublicState, PrivateState } from '../../../../lib/games-multi/cajut/types';

// Spanish ordinals: 1.º, 2.º, 3.º, ...
function esOrdinal(n: number): string {
  return `${n}.º`;
}

interface Props {
  publicState: PublicState;
  privateState: PrivateState;
}

export function PlayerLeaderboardMini({ publicState, privateState }: Props) {
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
          Vas {esOrdinal(privateState.myRank!)} con {privateState.myScore} puntos
        </p>
      )}
    </div>
  );
}
