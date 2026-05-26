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
    if (humanFactions.size === 0) return;
    onStart([...humanFactions] as FactionId[]);
  }

  return (
    <div class="er-setup">
      <div class="er-setup-card">
        <div>
          <h1 class="er-setup-title">Econrisk</h1>
          <p class="er-setup-subtitle">
            Juego de estrategia de escuelas de pensamiento económico. 4 facciones, 24 territorios, 6 continentes.
            Conquista por estímulo fiscal, revolución, solidez monetaria o ventaja comparativa.
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
          {humanFactions.size === 0 && (
            <p style={{ margin: 0, fontSize: '0.8rem', color: '#C44E2C', textAlign: 'center' }}>
              Selecciona al menos 1 jugador humano
            </p>
          )}
          <button
            class="er-setup-cta"
            onClick={handleStart}
            disabled={humanFactions.size === 0}
          >
            Empezar
          </button>
        </div>
      </div>
    </div>
  );
}
