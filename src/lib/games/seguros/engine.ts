// src/lib/games/seguros/engine.ts
import type { GameState, GameConfig, Team, InsuranceKey, EventCard } from './types';
import { INSURANCES, INSURANCE_KEYS, EVENT_DECK, DEFAULT_CONFIG } from './data';

function emptyCoverage(): Record<InsuranceKey, boolean> {
  const c = {} as Record<InsuranceKey, boolean>;
  for (const k of INSURANCE_KEYS) c[k] = false;
  return c;
}

export function createInitialState(config: GameConfig = DEFAULT_CONFIG): GameState {
  const teams: Team[] = [];
  for (let i = 0; i < config.numTeams; i++) {
    teams.push({
      id: i,
      name: config.teamNames[i] ?? `Equipo ${i + 1}`,
      cash: config.startingCash,
      coverage: emptyCoverage(),
      totalPremiums: 0,
      totalDamages: 0,
      totalAvoided: 0,
    });
  }
  return { config, round: 1, phase: 'coverage', teams, currentEvent: null };
}

export function setCoverage(state: GameState, teamId: number, key: InsuranceKey): GameState {
  if (state.phase !== 'coverage') return state;
  const teams = state.teams.map((t) =>
    t.id === teamId ? { ...t, coverage: { ...t.coverage, [key]: !t.coverage[key] } } : t,
  );
  return { ...state, teams };
}

export function premiumsFor(team: Team): number {
  return INSURANCES.reduce((s, ins) => (team.coverage[ins.key] ? s + ins.prima : s), 0);
}

export function lockCoverage(state: GameState): GameState {
  if (state.phase !== 'coverage') return state;
  const teams = state.teams.map((t) => {
    const primas = premiumsFor(t);
    return {
      ...t,
      cash: t.cash + state.config.income - primas,
      totalPremiums: t.totalPremiums + primas,
    };
  });
  return { ...state, teams, phase: 'event' };
}

export function drawCard(deck: EventCard[], rng: () => number): EventCard {
  const total = deck.reduce((s, c) => s + c.peso, 0);
  let r = rng() * total;
  for (const card of deck) {
    if (r < card.peso) return card;
    r -= card.peso;
  }
  return deck[deck.length - 1];
}

export function revealEvent(state: GameState, rng: () => number = Math.random): GameState {
  if (state.phase !== 'event') return state;
  const card = drawCard(EVENT_DECK, rng);
  const teams = state.teams.map((t) => {
    if (!card.cubre || card.dano === 0) return t; // calma
    if (t.coverage[card.cubre]) {
      return { ...t, totalAvoided: t.totalAvoided + card.dano };
    }
    return { ...t, cash: t.cash - card.dano, totalDamages: t.totalDamages + card.dano };
  });
  return { ...state, teams, currentEvent: card, phase: 'resolved' };
}

export function nextRound(state: GameState): GameState {
  // Only advance from a resolved round, so a double-click (or a functional
  // setState that re-applies) is idempotent and never skips a round.
  if (state.phase !== 'resolved') return state;
  if (state.round >= state.config.rounds) {
    return { ...state, phase: 'debrief', currentEvent: null };
  }
  return { ...state, round: state.round + 1, phase: 'coverage', currentEvent: null };
}

export function isFinished(state: GameState): boolean {
  return state.phase === 'debrief';
}

export function ranking(state: GameState): Team[] {
  return [...state.teams].sort((a, b) => b.cash - a.cash);
}

export interface DebriefRow {
  id: number;
  name: string;
  cash: number;
  premiums: number;
  damages: number;
  avoided: number;
  net: number; // avoided - premiums: >0 means coverage saved more than it cost
}

export function debriefStats(state: GameState): DebriefRow[] {
  return state.teams.map((t) => ({
    id: t.id,
    name: t.name,
    cash: t.cash,
    premiums: t.totalPremiums,
    damages: t.totalDamages,
    avoided: t.totalAvoided,
    net: t.totalAvoided - t.totalPremiums,
  }));
}
