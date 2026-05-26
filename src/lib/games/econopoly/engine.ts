// src/lib/games/econopoly/engine.ts
// Pure game-rules engine — no side effects, injectable RNG for deterministic tests.

import type { GameState, PlayerState, PropertyState, RdLevel } from './types';
import { CELLS, sectorCellIds } from './board';
import { NEWS_CARDS } from './events';
import {
  INITIAL_CASH, PASS_START_BONUS, PUBLIC_FUND_SHARE_PCT, TOTAL_ROUNDS,
  RD_MULTIPLIERS, RD_UPGRADE_COST_PCT, MONOPOLY_BONUS, TAX_BRACKETS,
  CYCLE_RENT, CYCLE_PROPERTY, CYCLE_LENGTH, CB_INITIAL_RATE, CB_RATE_RANGE,
  AUCTION_MIN_INCREMENT, BOARD_SIZE,
} from './constants';

// ─── helpers ─────────────────────────────────────────────────────────────────

/** True if player `pid` controls both properties in the sector that contains `cellId`. */
function controlsSector(state: GameState, pid: number, cellId: number): boolean {
  const cell = CELLS[cellId];
  if (!cell.property) return false;
  const ids = sectorCellIds(cell.property.sector);
  return ids.every((id) => state.properties[id]?.owner === pid);
}

// ─── createInitialState ───────────────────────────────────────────────────────

export function createInitialState(
  players: { name: string; color: string; isHuman: boolean }[],
): GameState {
  if (players.length < 1 || players.length > 6) {
    throw new Error('Econopoly requires 1–6 players');
  }

  const playerStates: PlayerState[] = players.map((p, i) => ({
    id: i,
    name: p.name,
    color: p.color,
    isHuman: p.isHuman,
    alive: true,
    cash: INITIAL_CASH,
    position: 0,
  }));

  // Initialise all property cells with owner=null, rdLevel=0
  const properties: Record<number, PropertyState> = {};
  for (const cell of CELLS) {
    if (cell.kind === 'property') {
      properties[cell.id] = { cellId: cell.id, owner: null, rdLevel: 0 };
    }
  }

  return {
    cells: CELLS,
    players: playerStates,
    properties,
    current: 0,
    round: 1,
    phase: 'roll',
    cycle: 'expansion',
    cbRate: CB_INITIAL_RATE,
    publicFund: 0,
    lastEvent: null,
    lastRoll: null,
    pendingPurchase: null,
    activeAuction: null,
    taxHolidayActive: false,
    log: [],
    winner: null,
    turnsThisRound: 0,
  };
}

// ─── rollDice ─────────────────────────────────────────────────────────────────

export function rollDice(rng: () => number = Math.random): { d1: number; d2: number } {
  const d1 = Math.floor(rng() * 6) + 1;
  const d2 = Math.floor(rng() * 6) + 1;
  return { d1, d2 };
}

// ─── move ─────────────────────────────────────────────────────────────────────

export function move(state: GameState, steps: number): GameState {
  const s = structuredClone(state) as GameState;
  const pid = s.current;
  const player = s.players[pid];
  const oldPos = player.position;
  const newPos = (oldPos + steps) % BOARD_SIZE;

  // Detect wrap (crossing/landing on SALIDA)
  const wrapped = newPos < oldPos || steps >= BOARD_SIZE;

  player.position = newPos;

  if (wrapped) {
    const fundShare = Math.floor(s.publicFund * PUBLIC_FUND_SHARE_PCT);
    const bonus = PASS_START_BONUS + fundShare;
    player.cash += bonus;
    s.publicFund -= fundShare;
    s.log.push(`${player.name} pasa por SALIDA y cobra ${bonus} €.`);
  }

  s.lastRoll = null; // cleared by move; was already set in advancePhase
  return s;
}

// ─── computeRent ──────────────────────────────────────────────────────────────

export function computeRent(state: GameState, cellId: number): number {
  const cell = CELLS[cellId];
  if (!cell.property) return 0;
  const propState = state.properties[cellId];
  if (!propState || propState.owner === null) return 0;

  const rdLevel = propState.rdLevel as RdLevel;
  const rdMult = RD_MULTIPLIERS[rdLevel];
  const cycleMult = CYCLE_RENT[state.cycle];
  const monopoly = controlsSector(state, propState.owner, cellId) ? MONOPOLY_BONUS : 1;

  // Check for temporary sector boost/bust from lastEvent
  let eventMult = 1;
  if (state.lastEvent) {
    const ev = state.lastEvent;
    if (ev.kind === 'sectorBoost' && ev.sector === cell.property.sector) {
      eventMult = 1 + (ev.amount ?? 0.2);
    } else if (ev.kind === 'sectorBust' && ev.sector === cell.property.sector) {
      eventMult = 1 + (ev.amount ?? -0.2);
    }
  }

  return Math.round(cell.property.baseRent * rdMult * cycleMult * monopoly * eventMult);
}

// ─── resolveCell ──────────────────────────────────────────────────────────────

export function resolveCell(state: GameState, rng: () => number = Math.random): GameState {
  const s = structuredClone(state) as GameState;
  const pid = s.current;
  const player = s.players[pid];
  const cell = CELLS[player.position];

  switch (cell.kind) {
    case 'start':
      // SALIDA: bonus already handled by move(); nothing extra
      s.log.push(`${player.name} está en SALIDA.`);
      break;

    case 'tax':
      return applyTax(s);

    case 'news':
      return applyNewsCard(s, rng);

    case 'cb': {
      // Banco Central: bump rate +/-1 randomly, clamped to range
      const delta = rng() > 0.5 ? 1 : -1;
      s.cbRate = Math.max(CB_RATE_RANGE[0], Math.min(CB_RATE_RANGE[1], s.cbRate + delta));
      s.log.push(`Banco Central: tipos ${delta > 0 ? '▲' : '▼'} al ${s.cbRate}%.`);
      break;
    }

    case 'rd':
      // Player can upgrade R+D during action phase — no immediate effect
      s.log.push(`${player.name} cae en R+D. Puede mejorar I+D en la fase de acción.`);
      break;

    case 'freemarket':
      // MERCADO LIBRE: nothing
      s.log.push(`${player.name} está en el MERCADO LIBRE. Sin efecto.`);
      break;

    case 'property': {
      const cellId = cell.id;
      const propState = s.properties[cellId];
      if (!propState || propState.owner === null) {
        // Unowned — offer purchase
        s.pendingPurchase = cellId;
        s.log.push(`${player.name} puede comprar ${cell.label} por ${cell.property!.basePrice} €.`);
      } else if (propState.owner !== pid) {
        // Pay rent to owner
        const rent = computeRent(s, cellId);
        const actualRent = Math.min(rent, player.cash);
        player.cash -= actualRent;
        s.players[propState.owner].cash += actualRent;
        s.log.push(`${player.name} paga ${actualRent} € de alquiler a ${s.players[propState.owner].name} por ${cell.label}.`);
      } else {
        // Own property — nothing
        s.log.push(`${player.name} está en su propiedad ${cell.label}.`);
      }
      break;
    }
  }

  return s;
}

// ─── buyProperty ──────────────────────────────────────────────────────────────

export function buyProperty(state: GameState, cellId: number): GameState {
  const s = structuredClone(state) as GameState;
  const pid = s.current;
  const player = s.players[pid];
  const cell = CELLS[cellId];
  if (!cell.property) return s;

  const price = cell.property.basePrice;
  if (player.cash < price) {
    s.log.push(`${player.name} no tiene suficiente dinero para comprar ${cell.label}.`);
    return s;
  }

  player.cash -= price;
  s.properties[cellId] = { cellId, owner: pid, rdLevel: 0 };
  s.pendingPurchase = null;
  s.log.push(`${player.name} compra ${cell.label} por ${price} €.`);
  return s;
}

// ─── startAuction ─────────────────────────────────────────────────────────────

export function startAuction(state: GameState, cellId: number): GameState {
  const s = structuredClone(state) as GameState;
  const cell = CELLS[cellId];
  if (!cell.property) return s;

  // Safety: if no OTHER alive player exists, skip auction and leave property free
  const otherAlive = s.players.filter((p) => p.alive && p.id !== s.current);
  if (otherAlive.length === 0) {
    s.pendingPurchase = null;
    s.log.push(`No hay otros jugadores vivos — ${cell.label} queda libre (sin subasta).`);
    return s;
  }

  // First bidder: next alive player after current
  const total = s.players.length;
  let firstBidder = (s.current + 1) % total;
  while (!s.players[firstBidder].alive && firstBidder !== s.current) {
    firstBidder = (firstBidder + 1) % total;
  }

  s.activeAuction = {
    cellId,
    currentBidder: firstBidder,
    highestBid: cell.property.basePrice - AUCTION_MIN_INCREMENT,
    highestBidder: null,
    passed: [],
  };
  s.pendingPurchase = null;
  s.log.push(`Subasta de ${cell.label} abierta. Precio base: ${cell.property.basePrice} €.`);
  return s;
}

// ─── auctionBid ───────────────────────────────────────────────────────────────

export function auctionBid(state: GameState, amount: number): GameState {
  if (!state.activeAuction) return state;
  const s = structuredClone(state) as GameState;
  const auction = s.activeAuction!;
  const bidderIdx = auction.currentBidder;
  const bidder = s.players[bidderIdx];

  // Validation
  if (amount < auction.highestBid + AUCTION_MIN_INCREMENT) return s;
  if (amount > bidder.cash) return s;

  auction.highestBid = amount;
  auction.highestBidder = bidderIdx;
  s.log.push(`${bidder.name} puja ${amount} €.`);

  // Advance to next non-passed alive bidder
  auction.currentBidder = nextAuctionBidder(s, auction.currentBidder, auction.passed);
  return s;
}

// ─── auctionPass ──────────────────────────────────────────────────────────────

export function auctionPass(state: GameState): GameState {
  if (!state.activeAuction) return state;
  const s = structuredClone(state) as GameState;
  const auction = s.activeAuction!;
  const bidderIdx = auction.currentBidder;
  const bidder = s.players[bidderIdx];

  if (!auction.passed.includes(bidderIdx)) {
    auction.passed.push(bidderIdx);
  }
  s.log.push(`${bidder.name} pasa en la subasta.`);

  // Count alive players not yet passed (excluding highest bidder — they can't be forced out)
  const alivePlayers = s.players.filter((p) => p.alive).map((p) => p.id);
  const activePlayers = alivePlayers.filter((id) => !auction.passed.includes(id));

  // Auction ends when only the highest bidder is left (or everyone passed)
  if (activePlayers.length === 0 || (activePlayers.length === 1 && activePlayers[0] === auction.highestBidder)) {
    // Resolve auction
    if (auction.highestBidder !== null) {
      const winner = s.players[auction.highestBidder];
      winner.cash -= auction.highestBid;
      s.properties[auction.cellId] = { cellId: auction.cellId, owner: auction.highestBidder, rdLevel: 0 };
      s.log.push(`${winner.name} gana la subasta de ${CELLS[auction.cellId].label} por ${auction.highestBid} €.`);
    } else {
      s.log.push(`Subasta de ${CELLS[auction.cellId].label} sin pujadores. Propiedad libre.`);
    }
    s.activeAuction = null;
    return s;
  }

  // Advance to next non-passed player
  auction.currentBidder = nextAuctionBidder(s, bidderIdx, auction.passed);
  return s;
}

/** Returns the next alive non-passed player id after `fromId`. */
function nextAuctionBidder(state: GameState, fromId: number, passed: number[]): number {
  const total = state.players.length;
  let next = (fromId + 1) % total;
  let attempts = 0;
  while (attempts < total) {
    if (state.players[next].alive && !passed.includes(next)) {
      return next;
    }
    next = (next + 1) % total;
    attempts++;
  }
  return fromId; // fallback (shouldn't happen)
}

// ─── upgradeRd ────────────────────────────────────────────────────────────────

export function upgradeRd(state: GameState, cellId: number): GameState {
  const s = structuredClone(state) as GameState;
  const pid = s.current;
  const propState = s.properties[cellId];

  if (!propState) return s;
  if (propState.owner !== pid) return s; // must be owner
  if (propState.rdLevel >= 3) return s;  // max level
  if (s.phase !== 'action') return s;    // only in action phase

  const cell = CELLS[cellId];
  if (!cell.property) return s;

  const cost = cell.property.basePrice * RD_UPGRADE_COST_PCT;
  if (s.players[pid].cash < cost) {
    s.log.push(`${s.players[pid].name} no tiene suficiente dinero para mejorar I+D.`);
    return s;
  }

  s.players[pid].cash -= cost;
  s.properties[cellId].rdLevel = (propState.rdLevel + 1) as RdLevel;
  s.log.push(`${s.players[pid].name} mejora I+D de ${cell.label} al nivel ${s.properties[cellId].rdLevel}.`);
  return s;
}

// ─── applyTax ─────────────────────────────────────────────────────────────────

export function applyTax(state: GameState): GameState {
  const s = structuredClone(state) as GameState;
  const pid = s.current;
  const player = s.players[pid];

  // Tax holiday: skip deduction and clear the flag (one-shot effect)
  if (s.taxHolidayActive) {
    s.taxHolidayActive = false;
    s.log.push(`${player.name}: Vacaciones fiscales — no se cobra impuesto.`);
    return s;
  }

  const nw = netWorth(s, pid);

  // Find applicable bracket (TAX_BRACKETS has Infinity as last threshold, always matches)
  let rate = TAX_BRACKETS[TAX_BRACKETS.length - 1].rate;
  for (const bracket of TAX_BRACKETS) {
    if (nw < bracket.threshold) {
      rate = bracket.rate;
      break;
    }
  }

  const tax = Math.floor(nw * rate);
  const actualTax = Math.min(tax, player.cash); // can't pay more than cash
  player.cash -= actualTax;
  s.publicFund += actualTax;
  s.log.push(`${player.name} paga ${actualTax} € de impuestos (${(rate * 100).toFixed(0)}% sobre ${nw} €).`);
  return s;
}

// ─── applyNewsCard ────────────────────────────────────────────────────────────

export function applyNewsCard(state: GameState, rng: () => number = Math.random): GameState {
  const s = structuredClone(state) as GameState;
  const idx = Math.floor(rng() * NEWS_CARDS.length);
  const card = NEWS_CARDS[idx];
  s.lastEvent = card;
  s.log.push(`Noticia: ${card.text}`);

  const pid = s.current;
  const player = s.players[pid];

  switch (card.kind) {
    case 'bonusCash': {
      const amount = card.amount ?? 0;
      if (card.sector) {
        // Sector-conditional: only if player owns a property in that sector
        const owns = sectorCellIds(card.sector).some((id) => s.properties[id]?.owner === pid);
        if (owns) {
          player.cash += amount;
          s.log.push(`${player.name} recibe ${amount} € (subvención sectorial).`);
        }
      } else if (card.target === 'all') {
        // Global bonus: all alive players
        for (const p of s.players) {
          if (p.alive) p.cash += amount;
        }
      } else {
        // Default: current player only
        player.cash += amount;
      }
      break;
    }

    case 'penaltyCash': {
      const amount = card.amount ?? 0;
      if (card.target === 'all') {
        // All alive players pay
        for (const p of s.players) {
          if (p.alive) {
            const actual = Math.min(amount, p.cash);
            p.cash -= actual;
          }
        }
      } else {
        // Current player only
        const actual = Math.min(amount, player.cash);
        player.cash -= actual;
      }
      break;
    }

    case 'rateChange': {
      const delta = card.amount ?? 0;
      s.cbRate = Math.max(CB_RATE_RANGE[0], Math.min(CB_RATE_RANGE[1], s.cbRate + delta));
      break;
    }

    case 'sectorBoost':
    case 'sectorBust':
      // lastEvent is already set; computeRent reads it for the boost/bust multiplier
      // Effect lasts until endTurn clears lastEvent
      break;

    case 'taxHoliday':
      // Set flag — applyTax will skip the next tax payment and clear it
      s.taxHolidayActive = true;
      break;

    case 'none':
      // Flavour text only — already logged
      break;
  }

  return s;
}

// ─── advancePhase ─────────────────────────────────────────────────────────────

export function advancePhase(state: GameState, rng: () => number = Math.random): GameState {
  switch (state.phase) {
    case 'roll': {
      // Roll dice, move player, transition to resolve
      const s = structuredClone(state) as GameState;
      const { d1, d2 } = rollDice(rng);
      s.lastRoll = { d1, d2 };
      s.log.push(`${s.players[s.current].name} saca ${d1} + ${d2} = ${d1 + d2}.`);
      const moved = move(s, d1 + d2);
      const resolved = { ...moved, phase: 'resolve' as const };
      return resolved;
    }

    case 'resolve': {
      // Resolve the cell the current player is on
      const s = resolveCell(state, rng);
      return { ...s, phase: 'action' as const };
    }

    case 'action':
      // action phase is ended explicitly via endTurn
      return state;

    default:
      return state;
  }
}

// ─── endTurn ──────────────────────────────────────────────────────────────────

export function endTurn(state: GameState, _rng: () => number = Math.random): GameState {
  const s = structuredClone(state) as GameState;

  // Clear per-turn temp flags
  s.lastEvent = null;
  s.pendingPurchase = null;
  s.lastRoll = null;

  // Advance to next alive player
  const total = s.players.length;
  let next = (s.current + 1) % total;
  let attempts = 0;
  while (attempts < total && !s.players[next].alive) {
    next = (next + 1) % total;
    attempts++;
  }

  // Robust wrap detection: count turns in this round vs alive players
  const alivePlayers = s.players.filter((p) => p.alive);
  s.turnsThisRound = (s.turnsThisRound ?? 0) + 1;
  const wrapped = s.turnsThisRound >= alivePlayers.length;

  if (wrapped) {
    s.turnsThisRound = 0;
    s.round += 1;
    s.log.push(`Comienza la ronda ${s.round}.`);

    // Flip cycle every CYCLE_LENGTH rounds (after round 5, 10, 15, 20...)
    // Round 1-5: expansion, round 6-10: recession, round 11-15: expansion, etc.
    // Flip when (round - 1) % CYCLE_LENGTH === 0 and round > 1
    if (s.round > 1 && (s.round - 1) % CYCLE_LENGTH === 0) {
      s.cycle = s.cycle === 'expansion' ? 'recession' : 'expansion';
      s.log.push(`Ciclo económico: ${s.cycle === 'expansion' ? 'Expansión' : 'Recesión'}.`);
    }
  }

  s.current = next;
  s.phase = 'roll';

  // Check for winner
  s.winner = checkVictory(s);

  return s;
}

// ─── netWorth ─────────────────────────────────────────────────────────────────

export function netWorth(state: GameState, pid: number): number {
  const player = state.players[pid];
  let worth = player.cash;

  for (const [cellIdStr, propState] of Object.entries(state.properties)) {
    if (propState.owner !== pid) continue;
    const cellId = Number(cellIdStr);
    const cell = CELLS[cellId];
    if (!cell.property) continue;
    const rdMult = RD_MULTIPLIERS[propState.rdLevel as RdLevel];
    const cycleMult = CYCLE_PROPERTY[state.cycle];
    worth += cell.property.basePrice * rdMult * cycleMult;
  }

  return worth;
}

// ─── giniIndex ────────────────────────────────────────────────────────────────

export function giniIndex(state: GameState): number {
  const alive = state.players.filter((p) => p.alive);
  const n = alive.length;
  if (n <= 1) return 0;

  const worths = alive.map((p) => netWorth(state, p.id)).sort((a, b) => a - b);
  const sum = worths.reduce((acc, w) => acc + w, 0);
  if (sum === 0) return 0;

  // Gini = (2 * sum(i * xi) - (n+1) * sum(xi)) / (n * sum(xi))
  // where xi are sorted ascending and i is 1-indexed
  const weightedSum = worths.reduce((acc, w, i) => acc + (i + 1) * w, 0);
  return (2 * weightedSum - (n + 1) * sum) / (n * sum);
}

// ─── checkVictory ─────────────────────────────────────────────────────────────

export function checkVictory(state: GameState): number | null {
  if (state.round <= TOTAL_ROUNDS) return null;

  const alive = state.players.filter((p) => p.alive);
  if (alive.length === 0) return null;

  // Highest net worth among alive players
  let best: number | null = null;
  let bestWorth = -Infinity;

  for (const p of alive) {
    const nw = netWorth(state, p.id);
    if (nw > bestWorth) {
      bestWorth = nw;
      best = p.id;
    }
  }

  return best;
}
