/** @jsxImportSource preact */
// SidePanel — shows the current faction info + phase instruction.
// Props: { state, selectedId } — purely presentational.

import type { GameState } from '@/lib/games/econrisk/types';
import { factionMeta } from '@/lib/games/econrisk/factions';
import { reinforcementsFor, ownedCount } from '@/lib/games/econrisk/engine';
import { byId } from '@/lib/games/econrisk/map';

const PHASE_INSTRUCTION: Record<string, string> = {
  event:     'Se está aplicando un evento de mercado. Pulsa "Siguiente fase" para continuar.',
  reinforce: 'Haz clic en tus territorios (resaltados) para colocar unidades de refuerzo. Debes colocar todas.',
  attack:    'Selecciona un territorio propio (origen) y luego un territorio enemigo adyacente (destino) para atacar. Cuando termines, avanza de fase.',
  fortify:   'Selecciona un territorio propio y mueve unidades a un territorio propio adyacente. Opcional: puedes avanzar de fase sin fortificar.',
};

interface Props {
  state: GameState;
  selectedId: string | null;
}

export function SidePanel({ state, selectedId }: Props) {
  const currentFaction = state.order[state.current];
  const meta = factionMeta[currentFaction];
  const owned = ownedCount(state, currentFaction);
  const reinforcements = reinforcementsFor(state, currentFaction);
  const isAI = !state.factions[currentFaction].isHuman;

  return (
    <aside class="er-panel">
      {/* Faction card */}
      <div class="er-faction-card">
        <div class="er-faction-card-top" style={{ background: meta.color }} />
        <div class="er-faction-card-body">
          <p class="er-faction-school">{meta.school}</p>
          <h2 class="er-faction-name">{meta.label}</h2>
          <div class="er-faction-power">{meta.power}</div>
        </div>
      </div>

      {/* Stats */}
      <div class="er-stats">
        <div class="er-stat">
          <span class="er-stat-label">Territorios</span>
          <span class="er-stat-value">{owned}</span>
        </div>
        <div class="er-stat">
          <span class="er-stat-label">Refuerzos</span>
          <span class="er-stat-value">{state.phase === 'reinforce' ? state.reinforcementsLeft : reinforcements}</span>
        </div>
        <div class="er-stat">
          <span class="er-stat-label">Ronda</span>
          <span class="er-stat-value">{state.round}/15</span>
        </div>
        <div class="er-stat">
          <span class="er-stat-label">Turno</span>
          <span class="er-stat-value">{isAI ? 'IA' : 'Humano'}</span>
        </div>
      </div>

      {/* AI indicator */}
      {isAI && (
        <div class="er-ai-indicator">
          <span class="er-ai-dot" />
          IA jugando...
        </div>
      )}

      {/* Phase instruction (only for human turns) */}
      {!isAI && (
        <div class="er-phase-instruction">
          {PHASE_INSTRUCTION[state.phase] ?? ''}
        </div>
      )}

      {/* Selected territory info */}
      {selectedId && (
        <div class="er-selection-info">
          Seleccionado: <strong>{byId[selectedId]?.label ?? selectedId}</strong>
        </div>
      )}

      {/* Active event card */}
      {state.activeEvent && (
        <div class="er-event-card">
          <span class="er-event-label">Evento activo</span>
          {state.activeEvent.text}
        </div>
      )}
    </aside>
  );
}
