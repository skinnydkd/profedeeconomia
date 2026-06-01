// src/components/games/cajut/screens/PlayerName.tsx
import { useState } from 'preact/hooks';

interface Props {
  onSubmit: (nick: string) => void;
}

export function PlayerName({ onSubmit }: Props) {
  const [nick, setNick] = useState('');
  const valid = nick.trim().length >= 1 && nick.trim().length <= 20;

  return (
    <div class="cajut-player" style={{ justifyContent: 'center', alignItems: 'center' }}>
      <p class="subtle" style={{ marginBottom: 16 }}>¿Cuál es tu nick?</p>
      <input
        autoFocus
        maxLength={20}
        value={nick}
        onInput={(e) => setNick((e.target as HTMLInputElement).value)}
        style={{
          fontSize: 20,
          padding: '10px 16px',
          width: 240,
          textAlign: 'center',
          border: '1px solid var(--cajut-line)',
          borderRadius: 6,
          background: 'var(--cajut-paper)',
        }}
      />
      <button
        disabled={!valid}
        onClick={() => onSubmit(nick.trim())}
        style={{
          marginTop: 24,
          padding: '12px 28px',
          background: valid ? 'var(--cajut-ink)' : 'var(--cajut-ink-mute)',
          color: 'white',
          border: 'none',
          borderRadius: 6,
          fontSize: 16,
          cursor: valid ? 'pointer' : 'not-allowed',
        }}
      >
        Entrar
      </button>
    </div>
  );
}
