// src/lib/games/econopoly/ai.ts
// AI player decisions for Econopoly — uses only public engine functions.

import type { GameState } from './types';
import {
  advancePhase, buyProperty, startAuction, auctionBid, auctionPass,
  upgradeRd, endTurn, computeRent,
} from './engine';
import { CELLS, sectorCellIds } from './board';
import { AUCTION_MIN_INCREMENT, RD_UPGRADE_COST_PCT } from './constants';

// ─── aiAuctionDecide ──────────────────────────────────────────────────────────

/**
 * Decide whether to bid or pass in the current auction.
 * Strategy: bid if nextBid <= min(0.5 * cash, estimatedValue), else pass.
 * estimatedValue = computeRent(state, cellId) * 8 (8 rounds of expected rent).
 */
export function aiAuctionDecide(
  state: GameState,
): { kind: 'bid'; amount: number } | { kind: 'pass' } {
  const auction = state.activeAuction;
  if (!auction) return { kind: 'pass' };

  const pid = state.current;
  const player = state.players[pid];
  const nextBid = auction.highestBid + AUCTION_MIN_INCREMENT;

  // Can't bid more than we have
  if (nextBid > player.cash) return { kind: 'pass' };

  // Estimate value of the property
  const cell = CELLS[auction.cellId];
  if (!cell.property) return { kind: 'pass' };

  // Create a hypothetical state where AI owns the property to compute rent
  const hypothetical = { ...state };
  const estimatedRentPerTurn = computeRent(
    {
      ...hypothetical,
      properties: {
        ...hypothetical.properties,
        [auction.cellId]: { cellId: auction.cellId, owner: pid, rdLevel: 0 },
      },
    },
    auction.cellId,
  );
  const estimatedValue = estimatedRentPerTurn * 8;

  // Bid cap: 50% of cash or estimated value, whichever is lower
  const bidCap = Math.min(player.cash * 0.5, estimatedValue);

  if (nextBid <= bidCap) {
    return { kind: 'bid', amount: nextBid };
  }
  return { kind: 'pass' };
}

// ─── driveAuction ─────────────────────────────────────────────────────────────

/**
 * Drive the auction state machine while the current bidder is an AI player.
 * Stops when a human is the current bidder, or when the auction ends.
 */
function driveAuction(state: GameState, rng: () => number): GameState {
  let s = state;
  let safety = 0;
  const MAX_ITERATIONS = 100;

  while (s.activeAuction !== null && safety < MAX_ITERATIONS) {
    safety++;
    const auction = s.activeAuction;
    const bidder = s.players[auction.currentBidder];

    // Stop if the current bidder is human — UI must handle their input
    if (bidder.isHuman) break;

    // AI decides
    const decision = aiAuctionDecide({ ...s, current: auction.currentBidder });

    if (decision.kind === 'bid') {
      s = auctionBid(s, decision.amount);
    } else {
      s = auctionPass(s);
    }
  }

  return s;
}

// ─── aiTakeTurn ───────────────────────────────────────────────────────────────

/**
 * Play the current AI player's full turn:
 * 1. Roll (advancePhase: roll → resolve)
 * 2. Resolve cell (advancePhase: resolve → action) — handles tax/news/property effects
 * 3. Handle pendingPurchase: buy if affordable (cash >= 2 * basePrice and sector open), else auction
 * 4. Drive auction (while AI is the current bidder)
 * 5. Action phase: greedy R+D upgrade on most rentable owned property if affordable
 * 6. End turn
 */
export function aiTakeTurn(state: GameState, rng: () => number = Math.random): GameState {
  const pid = state.current;
  const player = state.players[pid];

  // Safety: if game already has a winner, don't touch anything
  if (state.winner !== null) return state;
  // Safety: only act if it's this player's turn and they're alive
  if (!player || !player.alive) {
    return endTurn(state, rng);
  }

  // Step 1: Roll dice and move
  let s = advancePhase(state, rng); // roll → resolve

  // Step 2: Resolve cell
  s = advancePhase(s, rng); // resolve → action

  // Step 3: Handle pendingPurchase
  if (s.pendingPurchase !== null) {
    const cellId = s.pendingPurchase;
    const cell = CELLS[cellId];
    if (cell.property) {
      const currentPlayer = s.players[pid];
      const price = cell.property.basePrice;
      // AI buys if it has >= 2x the price and the other sector property isn't already owned by someone else
      const sectorIds = sectorCellIds(cell.property.sector);
      const otherCellId = sectorIds.find((id) => id !== cellId);
      const sectorOpen = !otherCellId || s.properties[otherCellId]?.owner === null || s.properties[otherCellId]?.owner === pid;

      if (currentPlayer.cash >= 2 * price && sectorOpen) {
        s = buyProperty(s, cellId);
      } else {
        // Start auction — drive AI bidders
        s = startAuction(s, cellId);
        s = driveAuction(s, rng);
      }
    }
  }

  // Drive auction if it was already active (e.g. started by a news card — unlikely but safe)
  if (s.activeAuction !== null) {
    s = driveAuction(s, rng);
  }

  // Step 4: Action phase — greedy R+D upgrade
  if (s.phase === 'action') {
    s = aiUpgradeRd(s, rng);
  }

  // Step 5: End turn
  s = endTurn(s, rng);

  return s;
}

// ─── aiUpgradeRd ─────────────────────────────────────────────────────────────

/**
 * Greedy strategy: find the AI's most rentable owned property that can be upgraded.
 * Upgrade it if cash > 2 * cost.
 */
function aiUpgradeRd(state: GameState, _rng: () => number): GameState {
  const pid = state.current;
  const player = state.players[pid];

  // Find all owned properties that can be upgraded
  const upgradeable = Object.values(state.properties)
    .filter((p) => p.owner === pid && p.rdLevel < 3)
    .map((p) => {
      const cell = CELLS[p.cellId];
      const cost = cell.property ? cell.property.basePrice * RD_UPGRADE_COST_PCT : Infinity;
      const rent = computeRent(state, p.cellId);
      return { cellId: p.cellId, cost, rent };
    })
    .filter(({ cost }) => player.cash > 2 * cost)
    .sort((a, b) => b.rent - a.rent); // highest rent first

  if (upgradeable.length === 0) return state;

  return upgradeRd(state, upgradeable[0].cellId);
}
