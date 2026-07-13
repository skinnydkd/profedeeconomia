/** @jsxImportSource preact */
// PlayerJoin — Shown when the player has no ?room= in the URL.
// Name + code inputs; on submit redirects to ?room=CODE&name=NAME.

import { useState } from 'preact/hooks';
import { useGameLocale } from '../../locale-context';

interface Props {
  onJoin: (name: string, code: string) => void;
}

export const COPY = {
  es: {
    errNombre: 'Introduce tu nombre.',
    errCodigo: 'El código tiene 4 caracteres.',
    titulo: 'Insider',
    sub: 'Juego de deducción social con vocabulario económico. Introduce el código que aparece en la pantalla del proyector.',
    tuNombre: 'Tu nombre',
    placeholderNombre: 'p. ej. María',
    codigoSala: 'Código de sala',
    unirse: 'Unirse a la partida',
  },
  ca: {
    errNombre: 'Introduïx el teu nom.',
    errCodigo: 'El codi té 4 caràcters.',
    titulo: 'Insider',
    sub: 'Joc de deducció social amb vocabulari econòmic. Introduïx el codi que apareix a la pantalla del projector.',
    tuNombre: 'El teu nom',
    placeholderNombre: 'p. ex. Maria',
    codigoSala: 'Codi de sala',
    unirse: "Unix-te a la partida",
  },
};

export function PlayerJoin({ onJoin }: Props) {
  const c = COPY[useGameLocale()];
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    const trimName = name.trim();
    const trimCode = code.trim().toUpperCase();
    if (!trimName) { setError(c.errNombre); return; }
    if (trimCode.length !== 4) { setError(c.errCodigo); return; }
    setError('');
    onJoin(trimName, trimCode);
  };

  return (
    <div class="ins-join">
      <h1 class="serif">{c.titulo}</h1>
      <p class="sub">
        {c.sub}
      </p>

      <form class="ins-join-form" onSubmit={handleSubmit}>
        <div class="ins-join-field">
          <label for="player-name">{c.tuNombre}</label>
          <input
            id="player-name"
            type="text"
            placeholder={c.placeholderNombre}
            maxLength={20}
            value={name}
            onInput={(e) => setName((e.target as HTMLInputElement).value)}
            autocomplete="given-name"
            autocapitalize="words"
          />
        </div>

        <div class="ins-join-field">
          <label for="room-code">{c.codigoSala}</label>
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
          {c.unirse}
        </button>
      </form>
    </div>
  );
}
