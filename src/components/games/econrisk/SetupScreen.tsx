/** @jsxImportSource preact */
// SetupScreen — let the teacher pick which factions are human (1-4).
// Props: { onStart(humanFactions: FactionId[]), hasSave, onContinue }

import { useState } from 'preact/hooks';
import type { FactionId } from '@/lib/games/econrisk/types';
import { useGameLocale } from '../locale-context';
import { localizeFactions } from '@/i18n/games/econrisk-ca';

interface Props {
  onStart: (humanFactions: FactionId[]) => void;
  hasSave: boolean;
  onContinue: () => void;
}

export const COPY = {
  es: {
    subtitle:
      'Juego de estrategia de escuelas de pensamiento económico. 4 facciones, 24 territorios, 6 continentes. Conquista por estímulo fiscal, revolución, solidez monetaria o ventaja comparativa.',
    sectionLabel: 'Selecciona las facciones humanas',
    humano: 'Humano',
    ia: 'IA',
    continuar: 'Continuar partida',
    minPlayers: 'Selecciona al menos 1 jugador humano',
    empezar: 'Empezar',
  },
  ca: {
    subtitle:
      "Joc d'estratègia d'escoles de pensament econòmic. 4 faccions, 24 territoris, 6 continents. Conquista per estímul fiscal, revolució, solidesa monetària o avantatge comparatiu.",
    sectionLabel: 'Selecciona les faccions humanes',
    humano: 'Humà',
    ia: 'IA',
    continuar: 'Continua la partida',
    minPlayers: 'Selecciona almenys 1 jugador humà',
    empezar: 'Comença',
  },
};

export function SetupScreen({ onStart, hasSave, onContinue }: Props) {
  const locale = useGameLocale();
  const c = COPY[locale];
  const factions = localizeFactions(locale);

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
          <p class="er-setup-subtitle">{c.subtitle}</p>
        </div>

        <div>
          <div class="er-setup-section-label">{c.sectionLabel}</div>
          <div class="er-faction-list">
            {factions.map((f) => {
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
                    {isHuman ? c.humano : c.ia}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {hasSave && (
            <button class="er-setup-cta ghost" onClick={onContinue}>
              {c.continuar}
            </button>
          )}
          {humanFactions.size === 0 && (
            <p style={{ margin: 0, fontSize: '0.8rem', color: '#C44E2C', textAlign: 'center' }}>
              {c.minPlayers}
            </p>
          )}
          <button
            class="er-setup-cta"
            onClick={handleStart}
            disabled={humanFactions.size === 0}
          >
            {c.empezar}
          </button>
        </div>
      </div>
    </div>
  );
}
