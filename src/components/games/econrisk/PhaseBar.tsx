/** @jsxImportSource preact */
// PhaseBar — bottom bar showing 4 phases with the active one highlighted.
// Props: { phase, onNext, disabled? }

import type { Phase } from '@/lib/games/econrisk/types';
import { useGameLocale } from '../locale-context';

const PHASE_ORDER: Phase[] = ['event', 'reinforce', 'attack', 'fortify'];

export const COPY = {
  es: {
    phases: {
      event: 'Evento',
      reinforce: 'Reforzar',
      attack: 'Atacar',
      fortify: 'Fortificar',
    } as Record<Phase, string>,
    next: 'Siguiente fase →',
  },
  ca: {
    phases: {
      event: 'Esdeveniment',
      reinforce: 'Reforçar',
      attack: 'Atacar',
      fortify: 'Fortificar',
    } as Record<Phase, string>,
    next: 'Fase següent →',
  },
};

interface Props {
  phase: Phase;
  onNext: () => void;
  disabled?: boolean;
}

export function PhaseBar({ phase, onNext, disabled = false }: Props) {
  const c = COPY[useGameLocale()];
  const activeIdx = PHASE_ORDER.indexOf(phase);

  return (
    <div class="er-phasebar">
      <div class="er-phasebar-phases">
        {PHASE_ORDER.map((id, idx) => {
          const isActive = id === phase;
          const isDone = idx < activeIdx;
          return (
            <div
              key={id}
              class={`er-phase-step${isActive ? ' active' : ''}${isDone ? ' done' : ''}`}
            >
              <span class="er-phase-dot" />
              {c.phases[id]}
            </div>
          );
        })}
      </div>
      <button class="er-next-btn" onClick={onNext} disabled={disabled}>
        {c.next}
      </button>
    </div>
  );
}
