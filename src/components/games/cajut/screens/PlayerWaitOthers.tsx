// src/components/games/cajut/screens/PlayerWaitOthers.tsx
import type { PublicState } from '../../../../lib/games-multi/cajut/types';

interface Props {
  publicState: PublicState;
}

export function PlayerWaitOthers({ publicState }: Props) {
  const respostes = publicState.players.filter((p) => p.hasAnswered).length;
  const total = publicState.players.length;

  return (
    <div class="cajut-player" style={{ justifyContent: 'center', alignItems: 'center' }}>
      <h2 style={{ fontFamily: 'Fraunces, serif', textAlign: 'center', fontSize: 28 }}>
        Resposta enviada!
      </h2>
      <p class="subtle" style={{ marginTop: 12 }}>Esperant els companys&hellip;</p>
      <p
        style={{
          marginTop: 16,
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: 24,
        }}
      >
        {respostes}&nbsp;/&nbsp;{total}
      </p>
    </div>
  );
}
