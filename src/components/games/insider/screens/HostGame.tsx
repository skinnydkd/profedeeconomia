/** @jsxImportSource preact */
// HostGame — Shown during active game phases (show_word, discussion, voting, reveal, guess).
// Wide projector layout showing current speaker, player grid, and live timer.

import { useState, useEffect } from 'preact/hooks';
import type { PublicState, PrivateState, Phase } from '@/lib/games-multi/insider/types';

interface Props {
  publicState: PublicState;
  privateState: PrivateState | null;
  onAdvancePhase: () => void;
}

// Phase display metadata
const PHASE_META: Record<Phase, { label: string; sub: string }> = {
  lobby: { label: 'Sala de espera', sub: '' },
  show_word: {
    label: 'Memoriza la palabra',
    sub: 'Los ciudadanos ven la palabra en su móvil. El impostor no la conoce. Tiempo para leerla.',
  },
  discussion: {
    label: 'Discusión',
    sub: 'Cada jugador describe la palabra con una frase. El impostor disimula.',
  },
  voting: {
    label: 'Votación',
    sub: 'Los jugadores votan quién creen que es el impostor.',
  },
  reveal: {
    label: 'Revelación',
    sub: 'Se desvela quién ha sido eliminado y si era el impostor.',
  },
  guess: {
    label: 'Último intento',
    sub: 'El impostor atrapado intenta adivinar la palabra.',
  },
  finished: { label: 'Fin de partida', sub: '' },
};

// ---------------------------------------------------------------------------
// Timer hook — ticks from timerEndsAt (unix ms from server)
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function initial(name: string) {
  return name.charAt(0).toUpperCase();
}

function formatTimer(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function HostGame({ publicState, privateState: _privateState, onAdvancePhase }: Props) {
  const { phase, round, totalRounds, players, currentSpeakerId, speakerOrder, timerEndsAt, votesCast } = publicState;
  const remaining = useCountdown(timerEndsAt);
  const meta = PHASE_META[phase];

  // Current speaker info
  const currentSpeaker = players.find((p) => p.id === currentSpeakerId);
  // Done speaker IDs (those before currentSpeaker in speakerOrder)
  const currentIdx = currentSpeakerId ? speakerOrder.indexOf(currentSpeakerId) : -1;
  const doneIds = new Set(speakerOrder.slice(0, currentIdx));

  // Top-3 scoreboard (alive players, sorted by score desc)
  const sorted = [...players].sort((a, b) => b.score - a.score);
  const top3 = sorted.slice(0, 3);

  // Reveal info
  const lastReveal = publicState.lastReveal;

  // Footer hint based on phase
  const footerTexts: Partial<Record<Phase, string>> = {
    show_word: 'Próxima fase: discusión',
    discussion: 'Próxima fase: votación — los alumnos votan en su móvil',
    voting: `${votesCast} votos emitidos de ${players.filter((p) => p.alive).length} jugadores vivos`,
    reveal: lastReveal
      ? `${players.find((p) => p.id === lastReveal.eliminatedId)?.name ?? ''} era ${lastReveal.wasImpostor ? 'el impostor' : 'ciudadano'}`
      : '',
    guess: 'El impostor tiene 30 segundos para adivinar la palabra',
  };

  return (
    <div class="ins-host-body">
      {/* Phase header */}
      <div class="ins-phase">
        <div class="eyebrow">
          Ronda {round} / {totalRounds}
        </div>
        <div class="name serif-it">{meta.label}</div>
        {meta.sub && <div class="sub">{meta.sub}</div>}
      </div>

      {/* Reveal box (only during reveal) */}
      {phase === 'reveal' && lastReveal && (() => {
        const eliminated = players.find((p) => p.id === lastReveal.eliminatedId);
        return (
          <div class="ins-reveal-box">
            <div class="lab">Eliminado</div>
            <div class="name serif">{eliminated?.name ?? '?'}</div>
            <div class={`verdict ${lastReveal.wasImpostor ? 'impostor' : 'citizen'}`}>
              {lastReveal.wasImpostor ? 'Era el impostor' : 'Era ciudadano'}
            </div>
            {publicState.word && (
              <div class="word-reveal">
                La palabra era: <strong>{publicState.word}</strong>
              </div>
            )}
          </div>
        );
      })()}

      {/* Speaker spotlight (discussion / show_word / guess) */}
      {(phase === 'discussion' || phase === 'show_word' || phase === 'guess') && currentSpeaker && (
        <div class="ins-spot">
          <div class="avatar">{initial(currentSpeaker.name)}</div>
          <div class="info">
            <div class="lab">
              {phase === 'discussion' ? 'Habla ahora' : phase === 'guess' ? 'Adivina' : 'Lee la palabra'}
            </div>
            <div class="nm serif">{currentSpeaker.name}</div>
          </div>
          {remaining !== null && (
            <div class={`timer mono${remaining <= 10 ? ' urgent' : ''}`}>
              {formatTimer(remaining)}
              <span class="sm">RESTANTE</span>
            </div>
          )}
        </div>
      )}

      {/* Voting timer */}
      {phase === 'voting' && remaining !== null && (
        <div class="ins-spot" style="justify-content:center;">
          <div class={`timer mono${remaining <= 10 ? ' urgent' : ''}`} style="font-size:56px;">
            {formatTimer(remaining)}
            <span class="sm">RESTANTE</span>
          </div>
        </div>
      )}

      {/* Players grid */}
      <div class="ins-players">
        <h4>
          {phase === 'discussion'
            ? `Turnos esta ronda · ${players.filter((p) => p.alive).length} jugadores`
            : `Jugadores · ${players.filter((p) => p.alive).length} vivos`}
        </h4>
        <div class="ins-players-grid">
          {players.map((p) => {
            const isDone = doneIds.has(p.id) || p.turnDone;
            const isActive = p.id === currentSpeakerId;
            const isEliminated = !p.alive;
            let chipClass = 'ins-pchip';
            if (isEliminated) chipClass += ' eliminated';
            else if (isActive) chipClass += ' active';
            else if (isDone) chipClass += ' done';
            const mark = isActive ? '●' : isDone ? '+' : '—';
            return (
              <div key={p.id} class={chipClass}>
                <span class="av">{initial(p.name)}</span>
                <span class="nm">{p.name}</span>
                <span class="mk mono">{mark}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mini scoreboard */}
      {top3.length > 0 && (
        <div class="ins-score">
          <div class="l">Clasificación</div>
          <div class="top3">
            {top3.map((p, i) => (
              <div key={p.id} class="e">
                <span class="pos mono">{i + 1}º</span>
                {p.name}
                <span class="pt mono">{p.score}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer + advance button */}
      <div class="ins-footer">
        {footerTexts[phase] ?? ''}
      </div>

      {/* Host force-advance (skip timer / next phase) */}
      <div class="ins-btn-row" style="justify-content:center;padding-bottom:16px;">
        <button class="ins-btn ghost" onClick={onAdvancePhase}>
          Avanzar fase
        </button>
      </div>
    </div>
  );
}
