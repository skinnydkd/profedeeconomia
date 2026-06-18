// src/lib/games/seguros/types.ts
export type InsuranceKey = 'movil' | 'coche' | 'hogar' | 'salud' | 'rc';

export interface Insurance {
  key: InsuranceKey;
  label: string;
  prima: number; // premium charged per round when covered
}

export interface EventCard {
  key: string;                 // unique id ('calma', 'movil', ...)
  label: string;               // shown when revealed
  cubre: InsuranceKey | null;  // which insurance protects against it; null = no event
  dano: number;                // damage paid if NOT covered (0 for 'calma')
  peso: number;                // deck weight (probability share)
}

export interface GameConfig {
  numTeams: number;
  teamNames: string[];
  rounds: number;
  startingCash: number;
  income: number; // added to every team at the start of each round
}

export interface Team {
  id: number;
  name: string;
  cash: number;
  coverage: Record<InsuranceKey, boolean>; // current coverage (carries over each round)
  totalPremiums: number; // cumulative premiums paid
  totalDamages: number;  // cumulative damages paid while uncovered
  totalAvoided: number;  // cumulative damages avoided while covered
}

export type Phase = 'coverage' | 'event' | 'resolved' | 'debrief';

export interface GameState {
  config: GameConfig;
  round: number;                  // 1-based
  phase: Phase;
  teams: Team[];
  currentEvent: EventCard | null; // the event drawn this round (set in 'resolved')
}
