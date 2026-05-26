/** @jsxImportSource preact */
// PlayerGuess — Shown during phase === 'guess' on the player's phone.
// If this player is the caught impostor (canGuess), shows a text input.
// Otherwise shows a waiting message.

import { useState } from 'preact/hooks';
import type { PublicState, PrivateState } from '@/lib/games-multi/insider/types';

interface Props {
  publicState: PublicState;
  privateState: PrivateState | null;
  onGuess: (word: string) => void;
}

export function PlayerGuess({ publicState: _publicState, privateState, onGuess }: Props) {
  const [guess, setGuess] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const canGuess = privateState?.canGuess ?? false;

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    const trimmed = guess.trim();
    if (!trimmed || submitted) return;
    setSubmitted(true);
    onGuess(trimmed);
  };

  if (!canGuess) {
    return (
      <>
        <div class="ins-eyebrow" style="text-align:center;">Último intento</div>
        <div class="ins-player-lobby">
          <div class="waiting">El impostor está intentando adivinar la palabra…</div>
        </div>
      </>
    );
  }

  return (
    <>
      <div class="ins-role-impostor" style="margin-bottom:4px;">Eres el impostor</div>
      <div class="ins-impostor-big serif-it">
        ¡Última oportunidad!
      </div>
      <div class="ins-hint">
        Adivina la palabra que describieron los ciudadanos. Si aciertas, ganas puntos de todas formas.
      </div>

      {submitted ? (
        <div class="ins-notice">
          Respuesta enviada. Esperando resultado…
        </div>
      ) : (
        <form onSubmit={handleSubmit} class="ins-guess-input-wrap">
          <input
            class="ins-guess-input"
            type="text"
            placeholder="Escribe la palabra…"
            value={guess}
            onInput={(e) => setGuess((e.target as HTMLInputElement).value)}
            autocomplete="off"
            autocapitalize="sentences"
            maxLength={60}
          />
          <button type="submit" class="ins-btn" disabled={!guess.trim()}>
            Enviar respuesta
          </button>
        </form>
      )}
    </>
  );
}
