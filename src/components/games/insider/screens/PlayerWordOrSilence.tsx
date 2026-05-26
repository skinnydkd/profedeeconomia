/** @jsxImportSource preact */
// PlayerWordOrSilence — Shown during show_word and discussion phases.
// Citizens see the word; impostors see "you don't know the word".
// Both see the current speaker and turn info.

import { useState, useEffect } from 'preact/hooks';
import type { PublicState, PrivateState } from '@/lib/games-multi/insider/types';

interface Props {
  publicState: PublicState;
  privateState: PrivateState | null;
  playerName: string;
}

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
        <div class="ins-role-impostor">Eres el impostor</div>
      ) : (
        <div class="ins-role-citizen">Eres ciudadano</div>
      )}

      {/* Word section */}
      {isImpostor ? (
        <>
          <div class="ins-impostor-big serif-it">No conoces la palabra</div>
          <div class="ins-word-label">La palabra es</div>
          <div class="ins-word-hidden">???</div>
          <div class="ins-hint">
            Escucha lo que dicen los demás. Cuando te toque, inventa una frase coherente con las pistas que has oído.
          </div>
          <div class="ins-strategy-box">
            <strong>Estrategia:</strong> si te votan, podrás intentar adivinar la palabra. Acertar = ganas igualmente.
          </div>
        </>
      ) : (
        <>
          <div class="ins-word-label">Tu palabra es</div>
          <div class="ins-word-display">{word}</div>
          <div class="ins-hint">
            Descríbela con UNA frase cuando llegue tu turno. No la digas literalmente: hazla adivinar.
          </div>
        </>
      )}

      {/* Current speaker status */}
      {phase === 'discussion' && currentSpeaker && (
        <div class="ins-status-box">
          <div class="l">{isMyTurn ? 'Habla ahora' : 'Habla ahora'}</div>
          <div class="t">
            {isMyTurn
              ? `${playerName} — ¡es tu turno!`
              : currentSpeaker.name}
          </div>
        </div>
      )}

      {/* Timer */}
      {remaining !== null && phase === 'discussion' && (
        <div class="ins-turn-info">
          <span>Tiempo restante</span>
          <span class={`v mono${remaining <= 10 ? '' : ''}`}>
            {remaining}s
          </span>
        </div>
      )}

      {/* Turn order info for non-impostors */}
      {phase === 'discussion' && !isMyTurn && turnsUntilMe !== null && turnsUntilMe > 0 && (
        <div class="ins-turn-info">
          <span>Tu turno</span>
          <span class="v mono">{turnsUntilMe} {turnsUntilMe === 1 ? 'turno' : 'turnos'}</span>
        </div>
      )}
    </>
  );
}
