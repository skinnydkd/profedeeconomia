/** @jsxImportSource preact */
// src/components/games/cajut/screens/HostLeaderboardMini.tsx
// Projector view during the leaderboard phase (auto-shown after each reveal).
// Shows top-5 ranking with nick + score. Auto-advances after TIMER_LEADERBOARD_S.

import type { PublicState } from '../../../../lib/games-multi/cajut/types';

interface Props {
  publicState: PublicState;
}

export function HostLeaderboardMini({ publicState }: Props) {
  const top5 = publicState.lastReveal?.top5 ?? [];

  return (
    <div class="cajut-host" style={{ justifyContent: 'center' }}>
      <h2
        style={{
          fontFamily: 'Fraunces, serif',
          textAlign: 'center',
          fontSize: 36,
          margin: '0 0 8px',
        }}
      >
        Classificació
      </h2>
      <p class="subtle" style={{ textAlign: 'center', marginBottom: 0 }}>
        Continua automàticament…
      </p>

      <ol style={{ listStyle: 'none', padding: 0, maxWidth: 600, margin: '24px auto 0' }}>
        {top5.map((p, i) => (
          <li
            key={p.id}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '12px 16px',
              borderBottom: '1px solid var(--cajut-line-soft)',
              fontSize: 18,
            }}
          >
            <span>
              <strong
                style={{
                  color: i === 0 ? 'var(--cajut-terracota)' : 'var(--cajut-ink)',
                  marginRight: 8,
                }}
              >
                {i + 1}.
              </strong>
              {p.nick}
            </span>
            <span
              style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontWeight: i === 0 ? 600 : 400,
              }}
            >
              {p.score}
            </span>
          </li>
        ))}
        {top5.length === 0 && (
          <li style={{ padding: '12px 16px', color: 'var(--cajut-ink-mute)' }}>
            Sense dades de classificació.
          </li>
        )}
      </ol>
    </div>
  );
}
