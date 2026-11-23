/** @jsxImportSource preact */
// src/components/games/cajut/screens/HostLanding.tsx
// Shown while connecting / loading (before publicState arrives).

import { useGameLocale } from '../../locale-context';

interface Props {
  roomCode: string | null;
  connIssue?: boolean;
}

export const COPY = {
  es: {
    connecting: (room: string | null) => `Conectando${room ? ` a sala ${room}` : ''}…`,
    connectionLost: 'No se puede conectar con el servidor del juego. Comprueba la conexión; reintentamos solos.',
  },
  ca: {
    connecting: (room: string | null) => `Connectant${room ? ` a la sala ${room}` : ''}…`,
    connectionLost: 'No es pot connectar amb el servidor del joc. Comprova la connexió; ho reintentem soles.',
  },
};

export function HostLanding({ roomCode, connIssue }: Props) {
  const c = COPY[useGameLocale()];
  return (
    <div class="cajut-host" style={{ alignItems: 'center', justifyContent: 'center' }}>
      <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: '64px', margin: '0 0 16px' }}>Cajut</h1>
      <p class="subtle">{connIssue ? c.connectionLost : c.connecting(roomCode)}</p>
    </div>
  );
}
