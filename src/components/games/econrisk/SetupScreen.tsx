/** @jsxImportSource preact */
// SetupScreen — let the teacher pick which factions are human (1-4).
// Props: { onStart(humanFactions: FactionId[]), hasSave, onContinue }

import { useState } from 'preact/hooks';
import type { FactionId } from '@/lib/games/econrisk/types';
import { FACTIONS } from '@/lib/games/econrisk/factions';

interface Props {
  onStart: (humanFactions: FactionId[]) => void;
  hasSave: boolean;
  onContinue: () => void;
}

export function SetupScreen({ onStart, hasSave, onContinue }: Props) {
  // Default: only Keynes is human
  const [humanFactions, setHumanFactions] = useState<Set<FactionId>>(new Set(['keynes']));

  function toggle(id: FactionId) {
    setHumanFactions((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  function handleStart() {
    // At least 1 faction must exist (even if all are AI, game can run; but UI requires at least 1)
    onStart([...humanFactions] as FactionId[]);
  }

  return (
    <div class="er-setup">
      <div class="er-setup-card">
        <div>
          <h1 class="er-setup-title">Econrisk</h1>
          <p class="er-setup-subtitle">
            Joc d'estratègia d'escoles de pensament econòmic. 4 faccions, 24 territoris, 6 continents.
            Conquesta per estímul fiscal, revolució, solidesa monetaria o avantatge comparatiu.
          </p>
        </div>

        <div>
          <div class="er-setup-section-label">Selecciona las facciones humanas</div>
          <div class="er-faction-list">
            {FACTIONS.map((f) => {
              const isHuman = humanFactions.has(f.id);
              return (
                <div
                  key={f.id}
                  class={`er-faction-row${isHuman ? ' selected' : ''}`}
                  style={{ color: isHuman ? f.color : undefined }}
                  onClick={() => toggle(f.id)}
                  role="checkbox"
                  aria-checked={isHuman}
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') toggle(f.id); }}
                >
                  <span
                    class="er-faction-swatch"
                    style={{ background: f.color }}
                  />
                  <span class="er-faction-row-label">
                    <div class="er-faction-row-name">{f.label}</div>
                    <div class="er-faction-row-school">{f.school}</div>
                  </span>
                  <span
                    class="er-faction-row-tag"
                    style={{ background: isHuman ? f.color : '#8A7868' }}
                  >
                    {isHuman ? 'Humano' : 'IA'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {hasSave && (
            <button class="er-setup-cta ghost" onClick={onContinue}>
              Continuar partida
            </button>
          )}
          <button class="er-setup-cta" onClick={handleStart}>
            Empezar
          </button>
        </div>
      </div>
    </div>
  );
}
