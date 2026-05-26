export type FactionId = 'keynes' | 'marx' | 'austrian' | 'neoclassic';
export type ContinentId = 'norteamerica' | 'sudamerica' | 'europa' | 'africa' | 'asia' | 'oceania';
export type Phase = 'event' | 'reinforce' | 'attack' | 'fortify';

export interface Territory {
  id: string;
  label: string;          // es
  continent: ContinentId;
  adj: string[];          // adjacent territory ids
  x: number; y: number;   // schematic node coordinates (SVG viewBox 0..600 x 0..360)
}

export interface EventCard {
  id: string;
  text: string;           // es
  // pure effect applied to state; described by a discriminated kind handled in engine
  kind: 'bonusUnits' | 'penaltyUnits' | 'peaceRound' | 'redistribute' | 'none';
  amount?: number;
}

export interface FactionState { isHuman: boolean; alive: boolean; turnsSinceBonus: number; }

export interface GameState {
  territories: Record<string, { owner: FactionId; units: number }>;
  factions: Record<FactionId, FactionState>;
  order: FactionId[];
  current: number;             // index into order (skips dead factions)
  round: number;               // 1..15
  phase: Phase;
  reinforcementsLeft: number;
  activeEvent: EventCard | null;
  peaceUntilRound: number;     // attacks blocked while round <= this
  neoclassicJumpUsed: boolean; // neoclassic non-adjacent attack used this turn
  log: string[];
  winner: FactionId | null;
}
