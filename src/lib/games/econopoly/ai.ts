// src/lib/games/econopoly/ai.ts
// AI player decisions for Econopoly — uses only public engine functions.
//
// aiTakeTurn is a resumable single-step state machine:
//   - Each call advances ONE logical step (roll, resolve, buy/auction decision, action, endTurn).
//   - Returns immediately when an auction would block on a human bidder.
//   - The driver in EconopolyGame.tsx re-fires via useEffect on every state change,
//     calling aiTakeTurn (or the inline auction stepper) once per 700ms tick.

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

// ─── aiTakeTurn ───────────────────────────────────────────────────────────────

/**
 * Resumable single-step AI state machine.
 *
 * Each call advances ONE logical step and returns immediately when:
 *   (a) An auction now blocks on a human bidder, or
 *   (b) It is no longer the AI's main turn.
 *
 * The driver in EconopolyGame.tsx re-fires via useEffect on every state change,
 * calling this function (or the inline auction stepper) once per 700 ms tick.
 *
 * Call order per turn:
 *   tick 1 → phase==='roll'    → advancePhase (roll)
 *   tick 2 → phase==='resolve' → advancePhase (resolve) — may set pendingPurchase
 *   tick 3 → pendingPurchase   → buy or startAuction
 *   tick N → auction AI bids   → handled by driver's inline auction stepper
 *   tick M → phase==='action'  → aiUpgradeRdIfAffordable + endTurn
 */
export function aiTakeTurn(state: GameState, rng: () => number = Math.random): GameState {
  // 0. Game over — nothing to do.
  if (state.winner !== null) return state;

  // 1. If there's an active auction whose currentBidder is AI, step it ONCE.
  //    (Defensive — driver normally handles this inline, but belt-and-suspenders.)
  if (state.activeAuction !== null) {
    const bidder = state.players[state.activeAuction.currentBidder];
    if (!bidder.isHuman) {
      const d = aiAuctionDecide({ ...state, current: state.activeAuction.currentBidder });
      return d.kind === 'bid' ? auctionBid(state, d.amount) : auctionPass(state);
    }
    // Auction blocks on a human bidder — return and wait for UI.
    return state;
  }

  // 2. Defensive: if it's not an AI's main turn, return.
  const cp = state.players[state.current];
  if (!cp || cp.isHuman) return state;

  // 3. Handle pendingPurchase (we already rolled and resolved).
  if (state.pendingPurchase !== null) {
    const cellId = state.pendingPurchase;
    const cell = CELLS[cellId];
    if (cell.property) {
      const price = cell.property.basePrice;
      const sectorIds = sectorCellIds(cell.property.sector);
      const otherCellId = sectorIds.find((id) => id !== cellId);
      const sectorOpen =
        !otherCellId ||
        state.properties[otherCellId]?.owner === null ||
        state.properties[otherCellId]?.owner === state.current;

      if (cp.cash >= 2 * price && sectorOpen) {
        // Buy directly — driver re-fires → continues to action phase.
        return buyProperty(state, cellId);
      } else {
        // Start auction — driver re-fires; if the first bidder is human the
        // driver will see activeAuction+human and stop; if AI, it steps it inline.
        return startAuction(state, cellId);
      }
    }
  }

  // 4. Advance roll → resolve (move the AI piece).
  if (state.phase === 'roll') return advancePhase(state, rng);

  // 5. Advance resolve → action (apply cell effect; may set pendingPurchase).
  if (state.phase === 'resolve') return advancePhase(state, rng);

  // 6. Action phase: optional R+D upgrade, then endTurn.
  if (state.phase === 'action') {
    const afterUpgrade = aiUpgradeRd(state, rng);
    return endTurn(afterUpgrade, rng);
  }

  return state;
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
