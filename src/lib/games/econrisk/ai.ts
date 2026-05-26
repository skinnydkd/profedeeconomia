// src/lib/games/econrisk/ai.ts
// Deterministic AI that plays a full turn for the current (non-human) faction.
// Strategy: reinforce frontier → attack outnumbered enemies → fortify interior → end turn.
// All randomness goes through the injectable rng parameter.

import type { GameState, FactionId } from './types';
import {
  canAttack,
  resolveAttack,
  placeReinforcement,
  fortify,
  reinforcementsFor,
  ownedCount,
  advancePhase,
  endTurn,
} from './engine';
import { TERRITORY_IDS, byId } from './map';

// Max attacks per AI turn to prevent infinite loops
const MAX_ATTACKS_PER_TURN = 6;

/** Returns territory ids owned by the given faction */
function ownedBy(state: GameState, faction: FactionId): string[] {
  return TERRITORY_IDS.filter((id) => state.territories[id].owner === faction);
}

/** Returns territory ids on the frontier: owned by faction, with at least one adjacent enemy */
function frontierOf(state: GameState, faction: FactionId): string[] {
  return ownedBy(state, faction).filter((id) =>
    byId[id].adj.some((n) => state.territories[n].owner !== faction),
  );
}

/** Returns territory ids deep in the interior: owned by faction, with NO adjacent enemy */
function interiorOf(state: GameState, faction: FactionId): string[] {
  return ownedBy(state, faction).filter((id) =>
    byId[id].adj.every((n) => state.territories[n].owner === faction),
  );
}

/**
 * AI plays the reinforce phase: places all reinforcements on frontier territories.
 * Prefers the frontier territory with the most adjacent enemies (most pressure).
 */
function aiReinforce(state: GameState, rng: () => number): GameState {
  let s = state;
  const faction = s.order[s.current];

  while (s.reinforcementsLeft > 0) {
    const frontier = frontierOf(s, faction);
    const candidates = frontier.length > 0 ? frontier : ownedBy(s, faction);
    if (candidates.length === 0) break;

    // Choose the frontier territory with the most adjacent enemies (stable tiebreak via pre-assigned rng)
    const scored = candidates.map((id) => ({
      id,
      enemies: byId[id].adj.filter((n) => s.territories[n].owner !== faction).length,
      tiebreak: rng(),
    }));
    scored.sort((a, b) => b.enemies - a.enemies || b.tiebreak - a.tiebreak);

    s = placeReinforcement(s, scored[0].id);
  }

  return s;
}

/**
 * AI plays the attack phase: attacks adjacent enemy territories where it has a numerical
 * advantage (own units > enemy units). Caps at MAX_ATTACKS_PER_TURN.
 */
function aiAttack(state: GameState, rng: () => number): GameState {
  let s = state;
  const faction = s.order[s.current];
  let attacks = 0;

  while (attacks < MAX_ATTACKS_PER_TURN) {
    // Find a valid attack: own territory with >1 unit → adjacent (or jump) enemy weaker than us
    let bestFrom: string | null = null;
    let bestTo: string | null = null;
    let bestAdvantage = 0;

    for (const fromId of ownedBy(s, faction)) {
      const fromUnits = s.territories[fromId].units;
      if (fromUnits <= 1) continue;

      // Check adjacent enemies first (always preferred)
      for (const toId of byId[fromId].adj) {
        const to = s.territories[toId];
        if (to.owner === faction) continue;
        if (!canAttack(s, fromId, toId)) continue;
        const advantage = fromUnits - to.units;
        if (advantage > bestAdvantage) {
          bestAdvantage = advantage;
          bestFrom = fromId;
          bestTo = toId;
        }
      }

      // Neoclassic: also check non-adjacent (if jump not used)
      if (faction === 'neoclassic' && !s.neoclassicJumpUsed) {
        for (const toId of TERRITORY_IDS) {
          if (byId[fromId].adj.includes(toId)) continue; // already checked adjacent
          if (!canAttack(s, fromId, toId)) continue;
          const to = s.territories[toId];
          const advantage = fromUnits - to.units;
          if (advantage > bestAdvantage) {
            bestAdvantage = advantage;
            bestFrom = fromId;
            bestTo = toId;
          }
        }
      }
    }

    // Only attack if we have a clear advantage (AI is cautious: > 0 advantage needed)
    if (bestFrom === null || bestTo === null || bestAdvantage <= 0) break;

    s = resolveAttack(s, bestFrom, bestTo, rng);
    attacks++;

    // Stop if we won the game
    if (s.winner !== null) break;
  }

  return s;
}

/**
 * AI plays the fortify phase: moves units from an interior territory to an ADJACENT frontier
 * territory. Only fortifies if a valid adjacent interior→frontier pair exists and the source
 * has > 2 units.
 */
function aiFortify(state: GameState, _rng: () => number): GameState {
  let s = state;
  const faction = s.order[s.current];

  const interior = interiorOf(s, faction);
  const frontierSet = new Set(frontierOf(s, faction));

  if (interior.length === 0 || frontierSet.size === 0) return s;

  // Find the best (source, dest) pair where source is interior, dest is an adjacent frontier
  // territory. Prefer source with most spare units; among ties, dest with most adjacent enemies.
  let bestSource: string | null = null;
  let bestDest: string | null = null;
  let bestSpare = 0;
  let bestEnemies = -1;

  for (const sourceId of interior) {
    const sourceUnits = s.territories[sourceId].units;
    if (sourceUnits <= 2) continue; // not worth moving
    const spare = sourceUnits - 1;

    // Iterate adjacency list of the source to find owned frontier neighbours
    for (const adjId of byId[sourceId].adj) {
      if (!frontierSet.has(adjId)) continue;
      const enemies = byId[adjId].adj.filter((n) => s.territories[n].owner !== faction).length;
      if (
        spare > bestSpare ||
        (spare === bestSpare && enemies > bestEnemies)
      ) {
        bestSpare = spare;
        bestEnemies = enemies;
        bestSource = sourceId;
        bestDest = adjId;
      }
    }
  }

  if (bestSource === null || bestDest === null) return s; // no adjacent interior→frontier pair

  // Move half the spare units (keep at least 1)
  const move = Math.max(1, Math.floor(bestSpare / 2));

  s = fortify(s, bestSource, bestDest, move);
  return s;
}

/**
 * `aiTakeTurn(state, rng?)` — plays the current AI faction's entire turn:
 * event → reinforce → attack → fortify → endTurn.
 * Returns the new GameState with current pointing at the next faction.
 * The input state is NOT mutated.
 */
export function aiTakeTurn(state: GameState, rng: () => number = Math.random): GameState {
  // Apply event card (event phase → reinforce)
  let s = advancePhase(state, rng);
  // s is now in 'reinforce' phase with reinforcementsLeft set

  // Reinforce
  s = aiReinforce(s, rng);

  // Advance to attack phase
  s = advancePhase(s, rng);
  // s is now in 'attack' phase

  // Attack
  s = aiAttack(s, rng);

  // Advance to fortify phase
  s = advancePhase(s, rng);
  // s is now in 'fortify' phase

  // Fortify
  s = aiFortify(s, rng);

  // End turn (advances to next faction, increments round if needed)
  s = advancePhase(s, rng);

  return s;
}
