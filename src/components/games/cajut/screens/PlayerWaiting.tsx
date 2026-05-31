// src/components/games/cajut/screens/PlayerWaiting.tsx
import type { PublicState, PrivateState } from '../../../../lib/games-multi/cajut/types';

interface Props {
  publicState: PublicState;
  privateState: PrivateState;
}

export function PlayerWaiting({ publicState, privateState }: Props) {
  const count = publicState.players.length;

  return (
    <div class="cajut-player" style={{ justifyContent: 'center', alignItems: 'center' }}>
      <p class="subtle">
        Sala {publicState.roomCode} &middot; {privateState.myNick}
      </p>
      <h2
        style={{
          fontFamily: 'Fraunces, serif',
          textAlign: 'center',
          margin: '24px 0',
          fontSize: 24,
        }}
      >
        Esperando a que comience la partida&hellip;
      </h2>
      <p class="subtle" style={{ textAlign: 'center' }}>
        {count} alumno{count === 1 ? '' : 's'} en la sala
      </p>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 6,
          justifyContent: 'center',
          maxWidth: 280,
          marginTop: 16,
        }}
      >
        {publicState.players.map((p) => (
          <span
            key={p.id}
            style={{
              background: 'var(--cajut-paper)',
              border: '1px solid var(--cajut-line)',
              borderRadius: 4,
              padding: '4px 8px',
              fontSize: 12,
            }}
          >
            {p.nick}
          </span>
        ))}
      </div>
    </div>
  );
}
