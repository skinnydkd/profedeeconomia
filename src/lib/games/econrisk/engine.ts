// src/lib/games/econrisk/engine.ts
// Pure game-rules engine — no side effects, injectable RNG for deterministic tests.

import type { FactionId, ContinentId, GameState, Phase } from './types';
import { FACTION_IDS } from './factions';
import { TERRITORIES, TERRITORY_IDS, byId, CONTINENT_BONUS, CONTINENTS, continentTerritories } from './map';
import { EVENT_CARDS } from './events';

// ─── helpers ─────────────────────────────────────────────────────────────────

/** Roll a single d6 using the supplied rng */
function rollD6(rng: () => number): number {
  return Math.floor(rng() * 6) + 1;
}

/** Fisher-Yates shuffle (returns new array) */
function shuffle<T>(arr: T[], rng: () => number): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ─── query functions ──────────────────────────────────────────────────────────

export function ownedCount(state: GameState, faction: FactionId): number {
  return Object.values(state.territories).filter((t) => t.owner === faction).length;
}

export function controlsContinent(state: GameState, faction: FactionId, continent: ContinentId): boolean {
  return continentTerritories(continent).every((t) => state.territories[t.id].owner === faction);
}

export function reinforcementsFor(state: GameState, faction: FactionId): number {
  const owned = ownedCount(state, faction);
  const base = Math.max(3, Math.floor(owned / 3));
  const continentBonus = CONTINENTS.reduce(
    (sum, c) => sum + (controlsContinent(state, faction, c) ? CONTINENT_BONUS[c] : 0),
    0,
  );
  return base + continentBonus;
}

export function checkVictory(state: GameState): FactionId | null {
  // 1. Dominant faction (18+ territories)
  for (const f of FACTION_IDS) {
    if (ownedCount(state, f) >= 18) return f;
  }

  // 2. Only one alive
  const alive = FACTION_IDS.filter((f) => state.factions[f].alive);
  if (alive.length === 1) return alive[0];

  // 3. Round > 15 → most territories
  if (state.round > 15) {
    let best: FactionId | null = null;
    let bestCount = -1;
    for (const f of FACTION_IDS) {
      const c = ownedCount(state, f);
      if (c > bestCount) {
        bestCount = c;
        best = f;
      }
    }
    return best;
  }

  return null;
}

// ─── canAttack ────────────────────────────────────────────────────────────────

export function canAttack(state: GameState, fromId: string, toId: string): boolean {
  // Peace round blocks all attacks
  if (state.round <= state.peaceUntilRound) return false;

  const currentFaction = state.order[state.current];
  const from = state.territories[fromId];
  const to = state.territories[toId];

  if (!from || !to) return false;

  // From must be owned by current faction
  if (from.owner !== currentFaction) return false;

  // Attacker must have > 1 unit
  if (from.units <= 1) return false;

  // Target must be an enemy
  if (to.owner === currentFaction) return false;

  // Adjacency check
  const adjacent = byId[fromId]?.adj.includes(toId) ?? false;
  if (adjacent) return true;

  // Non-adjacent: only neoclassic can do this, once per turn
  if (currentFaction === 'neoclassic' && !state.neoclassicJumpUsed) return true;

  return false;
}

// ─── resolveAttack ────────────────────────────────────────────────────────────

export function resolveAttack(
  state: GameState,
  fromId: string,
  toId: string,
  rng: () => number = Math.random,
): GameState {
  const s = structuredClone(state) as GameState;
  const currentFaction = s.order[s.current];
  const from = s.territories[fromId];
  const to = s.territories[toId];
  const defenderFaction = to.owner;
  const isMarxAttacker = currentFaction === 'marx';
  const isAustrianDefender = defenderFaction === 'austrian';
  const isNonAdjacent = !(byId[fromId]?.adj.includes(toId) ?? false);

  // Marxist power: auto-capture if defender has exactly 1 unit
  if (isMarxAttacker && to.units === 1) {
    const movedUnits = Math.min(from.units - 1, 3); // move up to 3 units (like a 3-die attack)
    from.units -= movedUnits;
    to.units = movedUnits;
    to.owner = currentFaction;
    s.log.push(`${currentFaction} auto-captures ${toId} (Marxist power).`);
    // Check if defender faction is eliminated
    if (ownedCount(s, defenderFaction) === 0) {
      s.factions[defenderFaction].alive = false;
      s.log.push(`${defenderFaction} has been eliminated.`);
    }
    return s;
  }

  // Roll attacker dice: min(3, from.units - 1)
  const numAttackerDice = Math.min(3, from.units - 1);
  const numDefenderDice = Math.min(2, to.units);

  const attackerDice = Array.from({ length: numAttackerDice }, () => rollD6(rng)).sort((a, b) => b - a);
  const defenderDiceRaw = Array.from({ length: numDefenderDice }, () => rollD6(rng));
  // Austrian power: +1 to each defender die (capped at 6)
  const defenderDice = defenderDiceRaw.map((d) => (isAustrianDefender ? Math.min(6, d + 1) : d)).sort((a, b) => b - a);

  s.log.push(
    `Attack ${fromId}→${toId}: attacker [${attackerDice}] defender [${defenderDice}]${isAustrianDefender ? ' (+1 austrian)' : ''}`,
  );

  // Compare top pairs; ties → defender wins (attacker loses)
  const pairs = Math.min(numAttackerDice, numDefenderDice);
  for (let i = 0; i < pairs; i++) {
    if (attackerDice[i] > defenderDice[i]) {
      to.units -= 1; // attacker wins this pair
    } else {
      from.units -= 1; // defender wins (or tie → attacker loses)
    }
  }

  // Check for capture
  if (to.units <= 0) {
    const movedUnits = Math.min(from.units - 1, numAttackerDice);
    from.units -= movedUnits;
    to.units = movedUnits;
    to.owner = currentFaction;
    s.log.push(`${currentFaction} captures ${toId}.`);
    // Check if defender faction is eliminated
    if (ownedCount(s, defenderFaction) === 0) {
      s.factions[defenderFaction].alive = false;
      s.log.push(`${defenderFaction} has been eliminated.`);
    }
  }

  // Neoclassic: mark non-adjacent jump as used
  if (currentFaction === 'neoclassic' && isNonAdjacent) {
    s.neoclassicJumpUsed = true;
  }

  return s;
}

// ─── placeReinforcement ───────────────────────────────────────────────────────

export function placeReinforcement(state: GameState, territoryId: string): GameState {
  if (state.reinforcementsLeft <= 0) return state;
  const currentFaction = state.order[state.current];
  if (state.territories[territoryId].owner !== currentFaction) return state;

  const s = structuredClone(state) as GameState;
  s.territories[territoryId].units += 1;
  s.reinforcementsLeft -= 1;
  return s;
}

// ─── fortify ─────────────────────────────────────────────────────────────────

export function fortify(state: GameState, fromId: string, toId: string, n: number): GameState {
  const currentFaction = state.order[state.current];
  const from = state.territories[fromId];
  const to = state.territories[toId];

  if (from.owner !== currentFaction || to.owner !== currentFaction) return state;
  if (n <= 0 || from.units - n < 1) return state;

  const s = structuredClone(state) as GameState;
  s.territories[fromId].units -= n;
  s.territories[toId].units += n;
  return s;
}

// ─── applyEvent ──────────────────────────────────────────────────────────────

export function applyEvent(state: GameState, rng: () => number = Math.random): GameState {
  const s = structuredClone(state) as GameState;
  const idx = Math.floor(rng() * EVENT_CARDS.length);
  const card = EVENT_CARDS[idx];
  s.activeEvent = card;
  s.log.push(`Event: ${card.text}`);

  const currentFaction = s.order[s.current];

  switch (card.kind) {
    case 'bonusUnits': {
      const amount = card.amount ?? 1;
      // Different cards have different targeting — use card id to determine behaviour
      if (card.id === 'export_boom') {
        // Only factions that fully control a continent gain bonus
        for (const f of FACTION_IDS) {
          if (!s.factions[f].alive) continue;
          const controlsAny = CONTINENTS.some((c) => controlsContinent(s, f, c));
          if (controlsAny) {
            const ownedTerrs = TERRITORY_IDS.filter((id) => s.territories[id].owner === f);
            if (ownedTerrs.length > 0) {
              const strongest = ownedTerrs.reduce((best, id) =>
                s.territories[id].units > s.territories[best].units ? id : best,
              );
              s.territories[strongest].units += amount;
            }
          }
        }
      } else if (card.id === 'tech_advance') {
        // Weakest faction (fewest territories) gains bonus
        const weakestFaction = FACTION_IDS.filter((f) => s.factions[f].alive).reduce((worst, f) =>
          ownedCount(s, f) < ownedCount(s, worst) ? f : worst,
        );
        const ownedTerrs = TERRITORY_IDS.filter((id) => s.territories[id].owner === weakestFaction);
        if (ownedTerrs.length > 0) {
          const strongest = ownedTerrs.reduce((best, id) =>
            s.territories[id].units > s.territories[best].units ? id : best,
          );
          s.territories[strongest].units += amount;
        }
      } else if (card.id === 'temp_alliance') {
        // Two factions with fewest territories gain bonus
        const ranked = FACTION_IDS.filter((f) => s.factions[f].alive).sort(
          (a, b) => ownedCount(s, a) - ownedCount(s, b),
        );
        const targets = ranked.slice(0, 2);
        for (const f of targets) {
          const ownedTerrs = TERRITORY_IDS.filter((id) => s.territories[id].owner === f);
          if (ownedTerrs.length > 0) {
            const strongest = ownedTerrs.reduce((best, id) =>
              s.territories[id].units > s.territories[best].units ? id : best,
            );
            s.territories[strongest].units += amount;
          }
        }
      } else if (card.id === 'humanitarian_aid') {
        // All territories with exactly 1 unit gain +1
        for (const id of TERRITORY_IDS) {
          if (s.territories[id].units === 1) {
            s.territories[id].units += amount;
          }
        }
      } else if (card.id === 'industrial_revolution') {
        // Each faction gains 1 unit per 3 territories
        for (const f of FACTION_IDS) {
          if (!s.factions[f].alive) continue;
          const bonus = Math.floor(ownedCount(s, f) / 3);
          if (bonus > 0) {
            const ownedTerrs = TERRITORY_IDS.filter((id) => s.territories[id].owner === f);
            const strongest = ownedTerrs.reduce((best, id) =>
              s.territories[id].units > s.territories[best].units ? id : best,
            );
            s.territories[strongest].units += bonus;
          }
        }
      } else {
        // Default: current faction (or all — economic_spring gives +2 to all)
        if (card.id === 'economic_spring') {
          for (const f of FACTION_IDS) {
            if (!s.factions[f].alive) continue;
            const ownedTerrs = TERRITORY_IDS.filter((id) => s.territories[id].owner === f);
            if (ownedTerrs.length > 0) {
              const strongest = ownedTerrs.reduce((best, id) =>
                s.territories[id].units > s.territories[best].units ? id : best,
              );
              s.territories[strongest].units += amount;
            }
          }
        } else {
          // Fallback: bonus to current faction's strongest territory
          const ownedTerrs = TERRITORY_IDS.filter((id) => s.territories[id].owner === currentFaction);
          if (ownedTerrs.length > 0) {
            const strongest = ownedTerrs.reduce((best, id) =>
              s.territories[id].units > s.territories[best].units ? id : best,
            );
            s.territories[strongest].units += amount;
          }
        }
      }
      break;
    }

    case 'penaltyUnits': {
      const amount = card.amount ?? 1;
      if (card.id === 'debt_crisis') {
        // All factions lose `amount` units from their strongest territory
        for (const f of FACTION_IDS) {
          if (!s.factions[f].alive) continue;
          const ownedTerrs = TERRITORY_IDS.filter((id) => s.territories[id].owner === f);
          if (ownedTerrs.length > 0) {
            const strongest = ownedTerrs.reduce((best, id) =>
              s.territories[id].units > s.territories[best].units ? id : best,
            );
            s.territories[strongest].units = Math.max(1, s.territories[strongest].units - amount);
          }
        }
      } else if (card.id === 'sanctions') {
        // Leader (most territories) loses `amount` units distributed across territories
        const leader = FACTION_IDS.filter((f) => s.factions[f].alive).reduce((best, f) =>
          ownedCount(s, f) > ownedCount(s, best) ? f : best,
        );
        const ownedTerrs = TERRITORY_IDS.filter((id) => s.territories[id].owner === leader);
        let remaining = amount;
        while (remaining > 0 && ownedTerrs.length > 0) {
          const strongest = ownedTerrs.reduce((best, id) =>
            s.territories[id].units > s.territories[best].units ? id : best,
          );
          const remove = Math.min(remaining, s.territories[strongest].units - 1);
          if (remove <= 0) break;
          s.territories[strongest].units -= remove;
          remaining -= remove;
        }
      } else if (card.id === 'hyperinflation') {
        // All territories with 3+ units lose 1 unit
        for (const id of TERRITORY_IDS) {
          if (s.territories[id].units >= 3) {
            s.territories[id].units -= amount;
          }
        }
      } else {
        // Default (financial_crisis_2008, etc.): current faction loses from weakest territory
        const ownedTerrs = TERRITORY_IDS.filter((id) => s.territories[id].owner === currentFaction);
        if (ownedTerrs.length > 0) {
          const weakest = ownedTerrs.reduce((worst, id) =>
            s.territories[id].units < s.territories[worst].units ? id : worst,
          );
          s.territories[weakest].units = Math.max(1, s.territories[weakest].units - amount);
        }
      }
      break;
    }

    case 'peaceRound':
      s.peaceUntilRound = s.round;
      break;

    case 'redistribute': {
      // capital_flight: leader transfers `amount` units to the weakest faction
      const amount = card.amount ?? 1;
      const alive = FACTION_IDS.filter((f) => s.factions[f].alive);
      const leader = alive.reduce((best, f) => (ownedCount(s, f) > ownedCount(s, best) ? f : best));
      const weakest = alive.reduce((worst, f) => (ownedCount(s, f) < ownedCount(s, worst) ? f : worst));
      if (leader !== weakest) {
        // Take from leader's strongest
        const leaderTerrs = TERRITORY_IDS.filter((id) => s.territories[id].owner === leader);
        const weakestTerrs = TERRITORY_IDS.filter((id) => s.territories[id].owner === weakest);
        if (leaderTerrs.length > 0 && weakestTerrs.length > 0) {
          const fromId = leaderTerrs.reduce((best, id) =>
            s.territories[id].units > s.territories[best].units ? id : best,
          );
          const toId = weakestTerrs.reduce((best, id) =>
            s.territories[id].units > s.territories[best].units ? id : best,
          );
          const remove = Math.min(amount, s.territories[fromId].units - 1);
          if (remove > 0) {
            s.territories[fromId].units -= remove;
            s.territories[toId].units += remove;
          }
        }
      }
      break;
    }

    case 'none':
      // Flavour only — log already done
      break;
  }

  return s;
}

// ─── Phase and turn management ────────────────────────────────────────────────

export function endTurn(state: GameState, rng: () => number = Math.random): GameState {
  const s = structuredClone(state) as GameState;
  const currentFaction = s.order[s.current];

  // Reset per-turn flags
  s.neoclassicJumpUsed = false;

  // Keynes power: +2 units every 3 turns
  s.factions[currentFaction].turnsSinceBonus += 1;
  if (currentFaction === 'keynes' && s.factions.keynes.turnsSinceBonus >= 3) {
    // Add 2 units to keynes' strongest territory
    const keynesTerrs = TERRITORY_IDS.filter((id) => s.territories[id].owner === 'keynes');
    if (keynesTerrs.length > 0) {
      const strongest = keynesTerrs.reduce((best, id) =>
        s.territories[id].units > s.territories[best].units ? id : best,
      );
      s.territories[strongest].units += 2;
      s.log.push(`Keynes fiscal stimulus: +2 units on ${strongest}.`);
    }
    s.factions.keynes.turnsSinceBonus = 0;
  }

  // Advance to next alive faction
  const total = s.order.length;
  let next = (s.current + 1) % total;
  while (!s.factions[s.order[next]].alive && next !== s.current) {
    next = (next + 1) % total;
  }

  // Did we wrap around? If so, increment round
  if (next <= s.current) {
    s.round += 1;
    s.log.push(`Round ${s.round} begins.`);
  }

  s.current = next;
  s.phase = 'event';

  // Check for winner
  s.winner = checkVictory(s);

  void rng; // rng available for future use (tie-breaking etc.)
  return s;
}

export function advancePhase(state: GameState, rng: () => number = Math.random): GameState {
  const current: Phase = state.phase;

  switch (current) {
    case 'event': {
      // Apply the event card (draw + effects)
      const withEvent = applyEvent(state, rng);
      const s = structuredClone(withEvent) as GameState;
      s.phase = 'reinforce';
      s.reinforcementsLeft = reinforcementsFor(s, s.order[s.current]);
      return s;
    }
    case 'reinforce': {
      const s = structuredClone(state) as GameState;
      s.phase = 'attack';
      return s;
    }
    case 'attack': {
      const s = structuredClone(state) as GameState;
      s.phase = 'fortify';
      return s;
    }
    case 'fortify':
      // End the current faction's turn
      return endTurn(state, rng);
    default:
      return state;
  }
}

// ─── createInitialState ───────────────────────────────────────────────────────

export function createInitialState(
  humanFactions: FactionId[],
  rng: () => number = Math.random,
): GameState {
  // Shuffle territory ids then deal round-robin to the 4 factions
  const shuffled = shuffle(TERRITORY_IDS, rng);
  const territories: GameState['territories'] = {};

  for (let i = 0; i < shuffled.length; i++) {
    const faction = FACTION_IDS[i % 4];
    territories[shuffled[i]] = { owner: faction, units: 1 };
  }

  // Distribute extra units deterministically: each faction gets 1 bonus unit on their first territory
  // (24 territories / 4 factions = 6 each — no extras needed; all start with 1 unit)
  // But add a couple more for a more interesting start (2 extra per faction)
  for (const f of FACTION_IDS) {
    const owned = shuffled.filter((_, i) => FACTION_IDS[i % 4] === f);
    if (owned.length > 0) {
      territories[owned[0]].units += 1;
    }
    if (owned.length > 1) {
      territories[owned[1]].units += 1;
    }
  }

  const factions: GameState['factions'] = {
    keynes:     { isHuman: humanFactions.includes('keynes'),     alive: true, turnsSinceBonus: 0 },
    marx:       { isHuman: humanFactions.includes('marx'),       alive: true, turnsSinceBonus: 0 },
    austrian:   { isHuman: humanFactions.includes('austrian'),   alive: true, turnsSinceBonus: 0 },
    neoclassic: { isHuman: humanFactions.includes('neoclassic'), alive: true, turnsSinceBonus: 0 },
  };

  return {
    territories,
    factions,
    order: [...FACTION_IDS],
    current: 0,
    round: 1,
    phase: 'event',
    reinforcementsLeft: 0,
    activeEvent: null,
    peaceUntilRound: 0,
    neoclassicJumpUsed: false,
    log: [],
    winner: null,
  };
}
