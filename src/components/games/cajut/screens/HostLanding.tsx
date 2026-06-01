/** @jsxImportSource preact */
// src/components/games/cajut/screens/HostLanding.tsx
// Shown while connecting / loading (before publicState arrives).

interface Props {
  roomCode: string | null;
}

export function HostLanding({ roomCode }: Props) {
  return (
    <div class="cajut-host" style={{ alignItems: 'center', justifyContent: 'center' }}>
      <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: '64px', margin: '0 0 16px' }}>Cajut</h1>
      <p class="subtle">Conectando{roomCode ? ` a sala ${roomCode}` : ''}…</p>
    </div>
  );
}
