/** @jsxImportSource preact */
// PhaseBar — bottom bar showing 4 phases with the active one highlighted.
// Props: { phase, onNext, disabled? }

import type { Phase } from '@/lib/games/econrisk/types';

const PHASES: Array<{ id: Phase; label: string }> = [
  { id: 'event',    label: 'Evento' },
  { id: 'reinforce', label: 'Reforzar' },
  { id: 'attack',   label: 'Atacar' },
  { id: 'fortify',  label: 'Fortificar' },
];

const PHASE_ORDER: Phase[] = ['event', 'reinforce', 'attack', 'fortify'];

interface Props {
  phase: Phase;
  onNext: () => void;
  disabled?: boolean;
}

export function PhaseBar({ phase, onNext, disabled = false }: Props) {
  const activeIdx = PHASE_ORDER.indexOf(phase);

  return (
    <div class="er-phasebar">
      <div class="er-phasebar-phases">
        {PHASES.map((p, idx) => {
          const isActive = p.id === phase;
          const isDone = idx < activeIdx;
          return (
            <div
              key={p.id}
              class={`er-phase-step${isActive ? ' active' : ''}${isDone ? ' done' : ''}`}
            >
              <span class="er-phase-dot" />
              {p.label}
            </div>
          );
        })}
      </div>
      <button class="er-next-btn" onClick={onNext} disabled={disabled}>
        Siguiente fase →
      </button>
    </div>
  );
}
