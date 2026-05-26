export type SectorId = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H';
export type PlayerId = number; // 0..5
export type CellKind = 'start' | 'tax' | 'news' | 'cb' | 'rd' | 'freemarket' | 'property';
export type Phase = 'roll' | 'resolve' | 'action';
export type Cycle = 'expansion' | 'recession';
export type RdLevel = 0 | 1 | 2 | 3;

export interface PropertyData {
  sector: SectorId;
  label: string;      // es
  basePrice: number;
  baseRent: number;
}
export interface Cell {
  id: number;         // 0..27 position on the ring (clockwise starting at SALIDA)
  kind: CellKind;
  label: string;      // es display (corners and specials)
  property?: PropertyData;
}
export interface NewsCard {
  id: string;
  text: string;       // es
  kind: 'bonusCash' | 'penaltyCash' | 'rateChange' | 'sectorBoost' | 'sectorBust' | 'taxHoliday' | 'none';
  amount?: number;
  sector?: SectorId;
  target?: 'current' | 'all';  // for bonusCash/penaltyCash: 'all' applies to every alive player
}
export interface PlayerState {
  id: PlayerId;
  name: string;
  color: string;
  isHuman: boolean;
  alive: boolean;
  cash: number;
  position: number;   // 0..27
}
export interface PropertyState {
  cellId: number;
  owner: PlayerId | null;
  rdLevel: RdLevel;
}
export interface AuctionBid { player: PlayerId; amount: number; }
export interface AuctionState {
  cellId: number;
  currentBidder: PlayerId;     // next to act
  highestBid: number;
  highestBidder: PlayerId | null;
  passed: PlayerId[];          // who has passed this round
}
export interface GameState {
  cells: Cell[];
  players: PlayerState[];
  properties: Record<number, PropertyState>;
  current: number;             // index into players (alive only)
  round: number;               // 1..TOTAL_ROUNDS
  phase: Phase;
  cycle: Cycle;
  cbRate: number;
  publicFund: number;
  lastEvent: NewsCard | null;
  lastRoll: { d1: number; d2: number } | null;
  pendingPurchase: number | null;  // cellId, set when human lands on free property awaiting buy/pass
  activeAuction: AuctionState | null;
  taxHolidayActive: boolean;   // set by taxHoliday card; cleared after next tax payment
  log: string[];
  winner: PlayerId | null;
  turnsThisRound: number;      // counts turns in current round for wrap detection
}
