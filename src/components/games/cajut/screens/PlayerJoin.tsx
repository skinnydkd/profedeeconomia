// src/components/games/cajut/screens/PlayerJoin.tsx
import { useState } from 'preact/hooks';

interface Props {
  onSubmit: (code: string) => void;
}

export function PlayerJoin({ onSubmit }: Props) {
  const [code, setCode] = useState('');

  return (
    <div class="cajut-player" style={{ justifyContent: 'center', alignItems: 'center' }}>
      <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: 48, margin: '0 0 8px' }}>Cajut</h1>
      <p class="subtle" style={{ marginBottom: 24 }}>Introdueix el codi de sala</p>
      <input
        autoFocus
        maxLength={4}
        value={code}
        onInput={(e) =>
          setCode(
            (e.target as HTMLInputElement).value
              .toUpperCase()
              .replace(/[^A-Z2-9]/g, ''),
          )
        }
        style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: 36,
          padding: '8px 16px',
          width: 140,
          textAlign: 'center',
          letterSpacing: '.15em',
          border: '1px solid var(--cajut-line)',
          borderRadius: 6,
          textTransform: 'uppercase',
          background: 'var(--cajut-paper)',
        }}
      />
      <button
        disabled={code.length !== 4}
        onClick={() => onSubmit(code)}
        style={{
          marginTop: 24,
          padding: '12px 28px',
          background: code.length === 4 ? 'var(--cajut-ink)' : 'var(--cajut-ink-mute)',
          color: 'white',
          border: 'none',
          borderRadius: 6,
          fontSize: 16,
          cursor: code.length === 4 ? 'pointer' : 'not-allowed',
        }}
      >
        Entrar
      </button>
    </div>
  );
}
