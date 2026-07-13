/** @jsxImportSource preact */
// HostGame — Shown during active game phases (show_word, discussion, voting, reveal, guess).
// Wide projector layout showing current speaker, player grid, and live timer.

import { useState, useEffect } from 'preact/hooks';
import type { PublicState, PrivateState, Phase } from '@/lib/games-multi/insider/types';
import { useGameLocale } from '../../locale-context';

interface Props {
  publicState: PublicState;
  privateState: PrivateState | null;
  onAdvancePhase: () => void;
}

export const COPY = {
  es: {
    phases: {
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
    } as Record<Phase, { label: string; sub: string }>,
    ronda: (r: number, total: number) => `Ronda ${r} / ${total}`,
    eliminado: 'Eliminado',
    eraImpostor: 'Era el impostor',
    eraCiudadano: 'Era ciudadano',
    laPalabraEra: 'La palabra era: ',
    hablaAhora: 'Habla ahora',
    adivina: 'Adivina',
    leePalabra: 'Lee la palabra',
    restante: 'RESTANTE',
    turnosRonda: (n: number) => `Turnos esta ronda · ${n} jugadores`,
    jugadoresVivos: (n: number) => `Jugadores · ${n} vivos`,
    clasificacion: 'Clasificación',
    avanzarFase: 'Avanzar fase',
    footer: {
      showWord: 'Próxima fase: discusión',
      discussion: 'Próxima fase: votación — los alumnos votan en su móvil',
      voting: (cast: number, alive: number) => `${cast} votos emitidos de ${alive} jugadores vivos`,
      revealImpostor: (name: string) => `${name} era el impostor`,
      revealCitizen: (name: string) => `${name} era ciudadano`,
      guess: 'El impostor tiene 30 segundos para adivinar la palabra',
    },
  },
  ca: {
    phases: {
      lobby: { label: "Sala d'espera", sub: '' },
      show_word: {
        label: 'Memoritza la paraula',
        sub: "Els ciutadans veuen la paraula al mòbil. L'impostor no la coneix. Temps per a llegir-la.",
      },
      discussion: {
        label: 'Discussió',
        sub: "Cada jugador descriu la paraula amb una frase. L'impostor dissimula.",
      },
      voting: {
        label: 'Votació',
        sub: "Els jugadors voten qui creuen que és l'impostor.",
      },
      reveal: {
        label: 'Revelació',
        sub: "Es desvela qui ha sigut eliminat i si era l'impostor.",
      },
      guess: {
        label: 'Últim intent',
        sub: "L'impostor atrapat intenta endevinar la paraula.",
      },
      finished: { label: 'Fi de la partida', sub: '' },
    } as Record<Phase, { label: string; sub: string }>,
    ronda: (r: number, total: number) => `Ronda ${r} / ${total}`,
    eliminado: 'Eliminat',
    eraImpostor: "Era l'impostor",
    eraCiudadano: 'Era ciutadà',
    laPalabraEra: 'La paraula era: ',
    hablaAhora: 'Parla ara',
    adivina: 'Endevina',
    leePalabra: 'Llig la paraula',
    restante: 'RESTANT',
    turnosRonda: (n: number) => `Torns d'esta ronda · ${n} jugadors`,
    jugadoresVivos: (n: number) => `Jugadors · ${n} vius`,
    clasificacion: 'Classificació',
    avanzarFase: 'Avança de fase',
    footer: {
      showWord: 'Pròxima fase: discussió',
      discussion: 'Pròxima fase: votació — els alumnes voten al mòbil',
      voting: (cast: number, alive: number) => `${cast} vots emesos de ${alive} jugadors vius`,
      revealImpostor: (name: string) => `${name} era l'impostor`,
      revealCitizen: (name: string) => `${name} era ciutadà`,
      guess: "L'impostor té 30 segons per a endevinar la paraula",
    },
  },
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
  const c = COPY[useGameLocale()];
  const { phase, round, totalRounds, players, currentSpeakerId, speakerOrder, timerEndsAt, votesCast } = publicState;
  const remaining = useCountdown(timerEndsAt);
  const meta = c.phases[phase];

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
    show_word: c.footer.showWord,
    discussion: c.footer.discussion,
    voting: c.footer.voting(votesCast, players.filter((p) => p.alive).length),
    reveal: lastReveal
      ? lastReveal.wasImpostor
        ? c.footer.revealImpostor(players.find((p) => p.id === lastReveal.eliminatedId)?.name ?? '')
        : c.footer.revealCitizen(players.find((p) => p.id === lastReveal.eliminatedId)?.name ?? '')
      : '',
    guess: c.footer.guess,
  };

  return (
    <div class="ins-host-body">
      {/* Phase header */}
      <div class="ins-phase">
        <div class="eyebrow">
          {c.ronda(round, totalRounds)}
        </div>
        <div class="name serif-it">{meta.label}</div>
        {meta.sub && <div class="sub">{meta.sub}</div>}
      </div>

      {/* Reveal box (only during reveal) */}
      {phase === 'reveal' && lastReveal && (() => {
        const eliminated = players.find((p) => p.id === lastReveal.eliminatedId);
        return (
          <div class="ins-reveal-box">
            <div class="lab">{c.eliminado}</div>
            <div class="name serif">{eliminated?.name ?? '?'}</div>
            <div class={`verdict ${lastReveal.wasImpostor ? 'impostor' : 'citizen'}`}>
              {lastReveal.wasImpostor ? c.eraImpostor : c.eraCiudadano}
            </div>
            {publicState.word && (
              <div class="word-reveal">
                {c.laPalabraEra}<strong>{publicState.word}</strong>
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
              {phase === 'discussion' ? c.hablaAhora : phase === 'guess' ? c.adivina : c.leePalabra}
            </div>
            <div class="nm serif">{currentSpeaker.name}</div>
          </div>
          {remaining !== null && (
            <div class={`timer mono${remaining <= 10 ? ' urgent' : ''}`}>
              {formatTimer(remaining)}
              <span class="sm">{c.restante}</span>
            </div>
          )}
        </div>
      )}

      {/* Voting timer */}
      {phase === 'voting' && remaining !== null && (
        <div class="ins-spot" style="justify-content:center;">
          <div class={`timer mono${remaining <= 10 ? ' urgent' : ''}`} style="font-size:56px;">
            {formatTimer(remaining)}
            <span class="sm">{c.restante}</span>
          </div>
        </div>
      )}

      {/* Players grid */}
      <div class="ins-players">
        <h4>
          {phase === 'discussion'
            ? c.turnosRonda(players.filter((p) => p.alive).length)
            : c.jugadoresVivos(players.filter((p) => p.alive).length)}
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
          <div class="l">{c.clasificacion}</div>
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
          {c.avanzarFase}
        </button>
      </div>
    </div>
  );
}
