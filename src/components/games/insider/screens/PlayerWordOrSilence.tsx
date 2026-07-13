/** @jsxImportSource preact */
// PlayerWordOrSilence — Shown during show_word and discussion phases.
// Citizens see the word; impostors see "you don't know the word".
// Both see the current speaker and turn info.

import { useState, useEffect } from 'preact/hooks';
import type { PublicState, PrivateState } from '@/lib/games-multi/insider/types';
import { useGameLocale } from '../../locale-context';

interface Props {
  publicState: PublicState;
  privateState: PrivateState | null;
  playerName: string;
}

export const COPY = {
  es: {
    eresImpostor: 'Eres el impostor',
    eresCiudadano: 'Eres ciudadano',
    noConoces: 'No conoces la palabra',
    laPalabraEs: 'La palabra es',
    hintImpostor:
      'Escucha lo que dicen los demás. Cuando te toque, inventa una frase coherente con las pistas que has oído.',
    estrategiaLabel: 'Estrategia:',
    estrategiaTexto: ' si te votan, podrás intentar adivinar la palabra. Acertar = ganas igualmente.',
    tuPalabraEs: 'Tu palabra es',
    hintCiudadano:
      'Descríbela con UNA frase cuando llegue tu turno. No la digas literalmente: hazla adivinar.',
    hablaAhora: 'Habla ahora',
    esTuTurno: (name: string) => `${name} — ¡es tu turno!`,
    tiempoRestante: 'Tiempo restante',
    tuTurno: 'Tu turno',
    turnos: (n: number) => `${n} ${n === 1 ? 'turno' : 'turnos'}`,
  },
  ca: {
    eresImpostor: "Eres l'impostor",
    eresCiudadano: 'Eres ciutadà',
    noConoces: 'No coneixes la paraula',
    laPalabraEs: 'La paraula és',
    hintImpostor:
      'Escolta el que diuen els altres. Quan et toque, inventa una frase coherent amb les pistes que has sentit.',
    estrategiaLabel: 'Estratègia:',
    estrategiaTexto: ' si et voten, podràs intentar endevinar la paraula. Encertar = guanyes igualment.',
    tuPalabraEs: 'La teua paraula és',
    hintCiudadano:
      'Descriu-la amb UNA frase quan arribe el teu torn. No la digues literalment: fes-la endevinar.',
    hablaAhora: 'Parla ara',
    esTuTurno: (name: string) => `${name} — és el teu torn!`,
    tiempoRestante: 'Temps restant',
    tuTurno: 'El teu torn',
    turnos: (n: number) => `${n} ${n === 1 ? 'torn' : 'torns'}`,
  },
};

function useCountdown(timerEndsAt: number | null): number | null {
  const [remaining, setRemaining] = useState<number | null>(null);

  useEffect(() => {
    if (timerEndsAt === null) {
      setRemaining(null);
      return;
    }
    let raf: number;
    const tick = () => {
      const diff = Math.max(0, Math.ceil((timerEndsAt - Date.now()) / 1000));
      setRemaining(diff);
      if (diff > 0) {
        raf = requestAnimationFrame(tick);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [timerEndsAt]);

  return remaining;
}

export function PlayerWordOrSilence({ publicState, privateState, playerName }: Props) {
  const c = COPY[useGameLocale()];
  const { phase, currentSpeakerId, speakerOrder, timerEndsAt, players } = publicState;
  const remaining = useCountdown(timerEndsAt);
  const isImpostor = privateState?.role === 'impostor';
  const word = privateState?.word ?? null;

  const currentSpeaker = players.find((p) => p.id === currentSpeakerId);
  const myId = privateState?.myId ?? '';
  const myIdx = speakerOrder.indexOf(myId);
  const currentIdx = currentSpeakerId ? speakerOrder.indexOf(currentSpeakerId) : -1;
  const turnsUntilMe = myIdx >= 0 && currentIdx >= 0 ? myIdx - currentIdx : null;
  const isMyTurn = myId === currentSpeakerId;

  return (
    <>
      {/* Role badge */}
      {isImpostor ? (
        <div class="ins-role-impostor">{c.eresImpostor}</div>
      ) : (
        <div class="ins-role-citizen">{c.eresCiudadano}</div>
      )}

      {/* Word section */}
      {isImpostor ? (
        <>
          <div class="ins-impostor-big serif-it">{c.noConoces}</div>
          <div class="ins-word-label">{c.laPalabraEs}</div>
          <div class="ins-word-hidden">???</div>
          <div class="ins-hint">
            {c.hintImpostor}
          </div>
          <div class="ins-strategy-box">
            <strong>{c.estrategiaLabel}</strong>{c.estrategiaTexto}
          </div>
        </>
      ) : (
        <>
          <div class="ins-word-label">{c.tuPalabraEs}</div>
          <div class="ins-word-display">{word}</div>
          <div class="ins-hint">
            {c.hintCiudadano}
          </div>
        </>
      )}

      {/* Current speaker status */}
      {phase === 'discussion' && currentSpeaker && (
        <div class="ins-status-box">
          <div class="l">{c.hablaAhora}</div>
          <div class="t">
            {isMyTurn
              ? c.esTuTurno(playerName)
              : currentSpeaker.name}
          </div>
        </div>
      )}

      {/* Timer */}
      {remaining !== null && phase === 'discussion' && (
        <div class="ins-turn-info">
          <span>{c.tiempoRestante}</span>
          <span class={`v mono${remaining <= 10 ? '' : ''}`}>
            {remaining}s
          </span>
        </div>
      )}

      {/* Turn order info for non-impostors */}
      {phase === 'discussion' && !isMyTurn && turnsUntilMe !== null && turnsUntilMe > 0 && (
        <div class="ins-turn-info">
          <span>{c.tuTurno}</span>
          <span class="v mono">{c.turnos(turnsUntilMe)}</span>
        </div>
      )}
    </>
  );
}
