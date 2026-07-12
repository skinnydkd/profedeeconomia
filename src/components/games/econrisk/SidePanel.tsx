/** @jsxImportSource preact */
// SidePanel — shows the current faction info + phase instruction.
// Props: { state, selectedId } — purely presentational.

import type { GameState } from '@/lib/games/econrisk/types';
import { reinforcementsFor, ownedCount } from '@/lib/games/econrisk/engine';
import { useGameLocale } from '../locale-context';
import {
  localizeFactionMeta,
  localizeTerritoryName,
  localizeEventText,
} from '@/i18n/games/econrisk-ca';

export const COPY = {
  es: {
    instructions: {
      event: 'Se está aplicando un evento de mercado. Pulsa "Siguiente fase" para continuar.',
      reinforce: 'Haz clic en tus territorios (resaltados) para colocar unidades de refuerzo. Debes colocar todas.',
      attack: 'Selecciona un territorio propio (origen) y luego un territorio enemigo adyacente (destino) para atacar. Cuando termines, avanza de fase.',
      fortify: 'Selecciona un territorio propio y mueve unidades a un territorio propio adyacente. Opcional: puedes avanzar de fase sin fortificar.',
    } as Record<string, string>,
    territorios: 'Territorios',
    refuerzos: 'Refuerzos',
    ronda: 'Ronda',
    turno: 'Turno',
    ia: 'IA',
    humano: 'Humano',
    aiPlaying: 'IA jugando...',
    seleccionado: 'Seleccionado:',
    eventoActivo: 'Evento activo',
  },
  ca: {
    instructions: {
      event: "S'està aplicant un esdeveniment de mercat. Prem «Fase següent» per a continuar.",
      reinforce: 'Fes clic en els teus territoris (ressaltats) per a col·locar unitats de reforç. Has de col·locar-les totes.',
      attack: 'Selecciona un territori propi (origen) i després un territori enemic adjacent (destinació) per a atacar. Quan acabes, avança de fase.',
      fortify: 'Selecciona un territori propi i mou unitats a un territori propi adjacent. Opcional: pots avançar de fase sense fortificar.',
    } as Record<string, string>,
    territorios: 'Territoris',
    refuerzos: 'Reforços',
    ronda: 'Ronda',
    turno: 'Torn',
    ia: 'IA',
    humano: 'Humà',
    aiPlaying: 'IA jugant...',
    seleccionado: 'Seleccionat:',
    eventoActivo: 'Esdeveniment actiu',
  },
};

interface Props {
  state: GameState;
  selectedId: string | null;
}

export function SidePanel({ state, selectedId }: Props) {
  const locale = useGameLocale();
  const c = COPY[locale];
  const currentFaction = state.order[state.current];
  const meta = localizeFactionMeta(locale)[currentFaction];
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
          <span class="er-stat-label">{c.territorios}</span>
          <span class="er-stat-value">{owned}</span>
        </div>
        <div class="er-stat">
          <span class="er-stat-label">{c.refuerzos}</span>
          <span class="er-stat-value">{state.phase === 'reinforce' ? state.reinforcementsLeft : reinforcements}</span>
        </div>
        <div class="er-stat">
          <span class="er-stat-label">{c.ronda}</span>
          <span class="er-stat-value">{state.round}/15</span>
        </div>
        <div class="er-stat">
          <span class="er-stat-label">{c.turno}</span>
          <span class="er-stat-value">{isAI ? c.ia : c.humano}</span>
        </div>
      </div>

      {/* AI indicator */}
      {isAI && (
        <div class="er-ai-indicator">
          <span class="er-ai-dot" />
          {c.aiPlaying}
        </div>
      )}

      {/* Phase instruction (only for human turns) */}
      {!isAI && (
        <div class="er-phase-instruction">
          {c.instructions[state.phase] ?? ''}
        </div>
      )}

      {/* Selected territory info */}
      {selectedId && (
        <div class="er-selection-info">
          {c.seleccionado} <strong>{localizeTerritoryName(selectedId, locale)}</strong>
        </div>
      )}

      {/* Active event card */}
      {state.activeEvent && (
        <div class="er-event-card">
          <span class="er-event-label">{c.eventoActivo}</span>
          {localizeEventText(state.activeEvent, locale)}
        </div>
      )}
    </aside>
  );
}
