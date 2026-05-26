/** @jsxImportSource preact */
// PlayerJoin — Shown when the player has no ?room= in the URL.
// Name + code inputs; on submit redirects to ?room=CODE&name=NAME.

import { useState } from 'preact/hooks';

interface Props {
  onJoin: (name: string, code: string) => void;
}

export function PlayerJoin({ onJoin }: Props) {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    const trimName = name.trim();
    const trimCode = code.trim().toUpperCase();
    if (!trimName) { setError('Introduce tu nombre.'); return; }
    if (trimCode.length !== 4) { setError('El código tiene 4 caracteres.'); return; }
    setError('');
    onJoin(trimName, trimCode);
  };

  return (
    <div class="ins-join">
      <h1 class="serif">Insider</h1>
      <p class="sub">
        Juego de deducción social con vocabulario económico. Introduce el código
        que aparece en la pantalla del proyector.
      </p>

      <form class="ins-join-form" onSubmit={handleSubmit}>
        <div class="ins-join-field">
          <label for="player-name">Tu nombre</label>
          <input
            id="player-name"
            type="text"
            placeholder="p. ej. María"
            maxLength={20}
            value={name}
            onInput={(e) => setName((e.target as HTMLInputElement).value)}
            autocomplete="given-name"
            autocapitalize="words"
          />
        </div>

        <div class="ins-join-field">
          <label for="room-code">Código de sala</label>
          <input
            id="room-code"
            class="code-input"
            type="text"
            placeholder="XXXX"
            maxLength={4}
            value={code}
            onInput={(e) => {
              const v = (e.target as HTMLInputElement).value.toUpperCase();
              setCode(v);
            }}
            autocomplete="off"
            inputMode="text"
          />
        </div>

        {error && (
          <p style="color:var(--terra-deep);font-size:12px;margin:0;">{error}</p>
        )}

        <button type="submit" class="ins-btn">
          Unirse a la partida
        </button>
      </form>
    </div>
  );
}
