/** @jsxImportSource preact */
// PlayerGuess — Shown during phase === 'guess' on the player's phone.
// If this player is the caught impostor (canGuess), shows a text input.
// Otherwise shows a waiting message.

import { useState } from 'preact/hooks';
import type { PublicState, PrivateState } from '@/lib/games-multi/insider/types';
import { useGameLocale } from '../../locale-context';

interface Props {
  publicState: PublicState;
  privateState: PrivateState | null;
  onGuess: (word: string) => void;
}

export const COPY = {
  es: {
    ultimoIntento: 'Último intento',
    intentandoAdivinar: 'El impostor está intentando adivinar la palabra…',
    eresImpostor: 'Eres el impostor',
    ultimaOportunidad: '¡Última oportunidad!',
    hint: 'Adivina la palabra que describieron los ciudadanos. Si aciertas, ganas puntos de todas formas.',
    respuestaEnviada: 'Respuesta enviada. Esperando resultado…',
    placeholder: 'Escribe la palabra…',
    enviar: 'Enviar respuesta',
  },
  ca: {
    ultimoIntento: 'Últim intent',
    intentandoAdivinar: "L'impostor està intentant endevinar la paraula…",
    eresImpostor: "Eres l'impostor",
    ultimaOportunidad: 'Última oportunitat!',
    hint: "Endevina la paraula que han descrit els ciutadans. Si l'encertes, guanyes punts igualment.",
    respuestaEnviada: 'Resposta enviada. Esperant el resultat…',
    placeholder: 'Escriu la paraula…',
    enviar: 'Envia la resposta',
  },
};

export function PlayerGuess({ publicState: _publicState, privateState, onGuess }: Props) {
  const c = COPY[useGameLocale()];
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
        <div class="ins-eyebrow" style="text-align:center;">{c.ultimoIntento}</div>
        <div class="ins-player-lobby">
          <div class="waiting">{c.intentandoAdivinar}</div>
        </div>
      </>
    );
  }

  return (
    <>
      <div class="ins-role-impostor" style="margin-bottom:4px;">{c.eresImpostor}</div>
      <div class="ins-impostor-big serif-it">
        {c.ultimaOportunidad}
      </div>
      <div class="ins-hint">
        {c.hint}
      </div>

      {submitted ? (
        <div class="ins-notice">
          {c.respuestaEnviada}
        </div>
      ) : (
        <form onSubmit={handleSubmit} class="ins-guess-input-wrap">
          <input
            class="ins-guess-input"
            type="text"
            placeholder={c.placeholder}
            value={guess}
            onInput={(e) => setGuess((e.target as HTMLInputElement).value)}
            autocomplete="off"
            autocapitalize="sentences"
            maxLength={60}
          />
          <button type="submit" class="ins-btn" disabled={!guess.trim()}>
            {c.enviar}
          </button>
        </form>
      )}
    </>
  );
}
