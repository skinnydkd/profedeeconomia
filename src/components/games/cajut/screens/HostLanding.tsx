/** @jsxImportSource preact */
// src/components/games/cajut/screens/HostLanding.tsx
// Shown while connecting / loading (before publicState arrives).

import { useGameLocale } from '../../locale-context';

interface Props {
  roomCode: string | null;
}

export const COPY = {
  es: {
    connecting: (room: string | null) => `Conectando${room ? ` a sala ${room}` : ''}…`,
  },
  ca: {
    connecting: (room: string | null) => `Connectant${room ? ` a la sala ${room}` : ''}…`,
  },
};

export function HostLanding({ roomCode }: Props) {
  const c = COPY[useGameLocale()];
  return (
    <div class="cajut-host" style={{ alignItems: 'center', justifyContent: 'center' }}>
      <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: '64px', margin: '0 0 16px' }}>Cajut</h1>
      <p class="subtle">{c.connecting(roomCode)}</p>
    </div>
  );
}
