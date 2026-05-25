import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  reinforcementsFor,
  ownedCount,
  resolveAttack,
  canAttack,
  checkVictory,
  controlsContinent,
  placeReinforcement,
  fortify,
  applyEvent,
  advancePhase,
  endTurn,
} from './engine';
import { FACTION_IDS } from './factions';
import { TERRITORIES, byId } from './map';
import type { GameState } from './types';

// byId is imported but used only in structural helpers (keep for future tests)
void byId;

// Helper: sequential RNG from a fixed array (loops)
const seq = (vals: number[]) => {
  let i = 0;
  return () => vals[i++ % vals.length];
};

// Helper: make a minimal state with all territories owned by keynes, attack phase
function dominantState(): GameState {
  const s = createInitialState(['keynes'], () => 0.5);
  for (const t of TERRITORIES) {
    s.territories[t.id] = { owner: 'keynes', units: 3 };
  }
  return { ...s, phase: 'attack', current: s.order.indexOf('keynes') };
}

describe('econrisk engine', () => {
  // ─── Initial state ───────────────────────────────────────────────────────────

  it('initial state distributes all 24 territories among factions with >=1 unit each', () => {
    const s = createInitialState(['keynes'], () => 0.5); // 1 human, 3 AI
    expect(Object.keys(s.territories).length).toBe(24);
    for (const t of TERRITORIES) {
      expect(s.territories[t.id].units).toBeGreaterThanOrEqual(1);
    }
    expect(s.factions.keynes.isHuman).toBe(true);
    expect(s.factions.marx.isHuman).toBe(false);
    expect(s.factions.austrian.isHuman).toBe(false);
    expect(s.factions.neoclassic.isHuman).toBe(false);
    expect(s.round).toBe(1);
    expect(s.phase).toBe('event');
    expect(s.winner).toBeNull();
    expect(s.peaceUntilRound).toBe(0);
    expect(s.neoclassicJumpUsed).toBe(false);
  });

  it('initial state gives each faction exactly 6 territories (24 / 4)', () => {
    const s = createInitialState(['keynes', 'marx'], () => 0.5);
    for (const f of FACTION_IDS) {
      expect(ownedCount(s, f)).toBe(6);
    }
  });

  it('all factions are alive at start', () => {
    const s = createInitialState(['keynes'], () => 0.5);
    for (const f of FACTION_IDS) {
      expect(s.factions[f].alive).toBe(true);
    }
  });

  // ─── Reinforcements ───────────────────────────────────────────────────────────

  it('reinforcements = max(3, floor(owned/3)) + continental bonus', () => {
    const s = createInitialState(['keynes'], () => 0.5);
    const f = s.order[0];
    const owned = ownedCount(s, f);
    const r = reinforcementsFor(s, f);
    expect(r).toBeGreaterThanOrEqual(Math.max(3, Math.floor(owned / 3)));
  });

  it('reinforcements = 3 minimum even with 3 or fewer territories', () => {
    const s = createInitialState(['keynes'], () => 0.5);
    // Give keynes only 2 territories
    let count = 0;
    for (const t of TERRITORIES) {
      if (count < 2) {
        s.territories[t.id] = { owner: 'keynes', units: 1 };
        count++;
      } else {
        s.territories[t.id] = { owner: 'marx', units: 1 };
      }
    }
    expect(reinforcementsFor(s, 'keynes')).toBe(3);
  });

  it('controlsContinent true only when faction owns every territory of a continent', () => {
    const s = createInitialState(['keynes'], () => 0.5);
    const c = TERRITORIES[0].continent; // norteamerica
    for (const t of TERRITORIES.filter((x) => x.continent === c)) {
      s.territories[t.id] = { owner: 'keynes', units: 1 };
    }
    // Give the others to another faction
    for (const t of TERRITORIES.filter((x) => x.continent !== c)) {
      s.territories[t.id] = { owner: 'marx', units: 1 };
    }
    expect(controlsContinent(s, 'keynes', c)).toBe(true);
    expect(controlsContinent(s, 'marx', c)).toBe(false);
  });

  // ─── canAttack ────────────────────────────────────────────────────────────────

  it('canAttack requires adjacency, enemy owner, and >1 unit (non-neoclassic)', () => {
    const s = createInitialState(['keynes'], () => 0.5);
    const a = TERRITORIES[0];
    const b = a.adj[0];
    s.territories[a.id] = { owner: 'keynes', units: 3 };
    s.territories[b] = { owner: 'marx', units: 1 };
    const attackState = { ...s, current: s.order.indexOf('keynes'), phase: 'attack' as const };
    expect(canAttack(attackState, a.id, b)).toBe(true);
  });

  it('canAttack returns false when attacker has only 1 unit', () => {
    const s = createInitialState(['keynes'], () => 0.5);
    const a = TERRITORIES[0];
    const b = a.adj[0];
    s.territories[a.id] = { owner: 'keynes', units: 1 };
    s.territories[b] = { owner: 'marx', units: 1 };
    const attackState = { ...s, current: s.order.indexOf('keynes'), phase: 'attack' as const };
    expect(canAttack(attackState, a.id, b)).toBe(false);
  });

  it('canAttack returns false when target is owned by attacker', () => {
    const s = createInitialState(['keynes'], () => 0.5);
    const a = TERRITORIES[0];
    const b = a.adj[0];
    s.territories[a.id] = { owner: 'keynes', units: 3 };
    s.territories[b] = { owner: 'keynes', units: 1 };
    const attackState = { ...s, current: s.order.indexOf('keynes'), phase: 'attack' as const };
    expect(canAttack(attackState, a.id, b)).toBe(false);
  });

  it('canAttack returns false when source is not owned by current faction', () => {
    const s = createInitialState(['keynes'], () => 0.5);
    const a = TERRITORIES[0];
    const b = a.adj[0];
    s.territories[a.id] = { owner: 'marx', units: 3 };
    s.territories[b] = { owner: 'keynes', units: 1 };
    const attackState = { ...s, current: s.order.indexOf('keynes'), phase: 'attack' as const };
    expect(canAttack(attackState, a.id, b)).toBe(false);
  });

  it('canAttack returns false during peace round', () => {
    const s = createInitialState(['keynes'], () => 0.5);
    const a = TERRITORIES[0];
    const b = a.adj[0];
    s.territories[a.id] = { owner: 'keynes', units: 3 };
    s.territories[b] = { owner: 'marx', units: 1 };
    const attackState = {
      ...s,
      current: s.order.indexOf('keynes'),
      phase: 'attack' as const,
      peaceUntilRound: 1,
      round: 1,
    };
    expect(canAttack(attackState, a.id, b)).toBe(false);
  });

  it('canAttack returns false when target is non-adjacent and faction is not neoclassic', () => {
    const s = createInitialState(['keynes'], () => 0.5);
    // Find two non-adjacent territories
    const a = TERRITORIES[0];
    const nonAdj = TERRITORIES.find((t) => t.id !== a.id && !a.adj.includes(t.id))!;
    s.territories[a.id] = { owner: 'keynes', units: 5 };
    s.territories[nonAdj.id] = { owner: 'marx', units: 1 };
    const attackState = { ...s, current: s.order.indexOf('keynes'), phase: 'attack' as const };
    expect(canAttack(attackState, a.id, nonAdj.id)).toBe(false);
  });

  it('neoclassic can attack a non-adjacent territory once per turn', () => {
    const s = createInitialState(['neoclassic'], () => 0.5);
    const a = TERRITORIES[0];
    const nonAdj = TERRITORIES.find((t) => t.id !== a.id && !a.adj.includes(t.id))!;
    s.territories[a.id] = { owner: 'neoclassic', units: 5 };
    s.territories[nonAdj.id] = { owner: 'marx', units: 1 };
    const attackState = {
      ...s,
      current: s.order.indexOf('neoclassic'),
      phase: 'attack' as const,
      neoclassicJumpUsed: false,
    };
    expect(canAttack(attackState, a.id, nonAdj.id)).toBe(true);
  });

  it('neoclassic cannot use the non-adjacent attack a second time in the same turn', () => {
    const s = createInitialState(['neoclassic'], () => 0.5);
    const a = TERRITORIES[0];
    const nonAdj = TERRITORIES.find((t) => t.id !== a.id && !a.adj.includes(t.id))!;
    s.territories[a.id] = { owner: 'neoclassic', units: 5 };
    s.territories[nonAdj.id] = { owner: 'marx', units: 1 };
    const attackState = {
      ...s,
      current: s.order.indexOf('neoclassic'),
      phase: 'attack' as const,
      neoclassicJumpUsed: true, // already used
    };
    expect(canAttack(attackState, a.id, nonAdj.id)).toBe(false);
  });

  // ─── resolveAttack ────────────────────────────────────────────────────────────

  it('resolveAttack: higher dice win — attacker wins overwhelmingly and captures', () => {
    const s = createInitialState(['keynes'], () => 0.5);
    const a = TERRITORIES[0];
    const b = a.adj[0];
    s.territories[a.id] = { owner: 'keynes', units: 4 };
    s.territories[b] = { owner: 'marx', units: 2 };
    // rng: attacker rolls 0.99,0.99,0.99 → dice 6,6,6; defender rolls 0.0,0.0 → dice 1,1
    // Attacker wins both pairs (6>1, 6>1) → defender loses 2 units → 0 → capture
    const next = resolveAttack(
      { ...s, current: s.order.indexOf('keynes'), phase: 'attack' as const },
      a.id,
      b,
      seq([0.99, 0.99, 0.99, 0.0, 0.0]),
    );
    // After capture: territory belongs to attacker
    expect(next.territories[b].owner).toBe('keynes');
    // Attacker territory still has at least 1 unit left
    expect(next.territories[a.id].units).toBeGreaterThanOrEqual(1);
  });

  it('resolveAttack tie goes to defender — attacker loses a unit on equal dice', () => {
    const s = createInitialState(['keynes'], () => 0.5);
    const a = TERRITORIES[0];
    const b = a.adj[0];
    s.territories[a.id] = { owner: 'keynes', units: 3 };
    s.territories[b] = { owner: 'marx', units: 2 };
    // attacker: 0.5 → 3+1=4... actually floor(0.5*6)+1 = 4; defender: 0.5 → 4; TIES = defender wins
    // Use exact tie: both roll exactly the same value
    const rng = seq([0.5, 0.5, 0.5, 0.5, 0.5]);
    const next = resolveAttack(
      { ...s, current: s.order.indexOf('keynes'), phase: 'attack' as const },
      a.id,
      b,
      rng,
    );
    const attackerUnits = next.territories[a.id].units;
    const defenderUnits = next.territories[b].units;
    // On a tie, attacker loses. Combined losses should reflect attacker paying
    expect(attackerUnits).toBeLessThan(3); // attacker lost at least 1
    // Defender keeps exactly its 2 units: ties cost the attacker, not the defender
    expect(defenderUnits).toBe(2);
  });

  it('resolveAttack: attacker captures when defender units reach 0', () => {
    const s = createInitialState(['keynes'], () => 0.5);
    const a = TERRITORIES[0];
    const b = a.adj[0];
    s.territories[a.id] = { owner: 'keynes', units: 5 };
    s.territories[b] = { owner: 'marx', units: 1 };
    // attacker rolls 0.99 → 6, defender rolls 0.0 → 1; attacker wins easily
    const next = resolveAttack(
      { ...s, current: s.order.indexOf('keynes'), phase: 'attack' as const },
      a.id,
      b,
      seq([0.99, 0.0]),
    );
    expect(next.territories[b].owner).toBe('keynes');
    expect(next.territories[b].units).toBeGreaterThanOrEqual(1);
    expect(next.territories[a.id].units).toBeGreaterThanOrEqual(1);
  });

  it('resolveAttack: marxist auto-captures territory defended by exactly 1 unit', () => {
    const s = createInitialState(['marx'], () => 0.5);
    const a = TERRITORIES[0];
    const b = a.adj[0];
    s.territories[a.id] = { owner: 'marx', units: 3 };
    s.territories[b] = { owner: 'keynes', units: 1 };
    const before = s.territories[a.id].units;
    const next = resolveAttack(
      { ...s, current: s.order.indexOf('marx'), phase: 'attack' as const },
      a.id,
      b,
      seq([]), // no RNG needed — marxist auto-captures
    );
    expect(next.territories[b].owner).toBe('marx');
    expect(next.territories[a.id].units).toBeLessThan(before); // moved units out
  });

  it('resolveAttack: marxist does NOT auto-capture when defender has 2+ units', () => {
    const s = createInitialState(['marx'], () => 0.5);
    const a = TERRITORIES[0];
    const b = a.adj[0];
    s.territories[a.id] = { owner: 'marx', units: 4 };
    s.territories[b] = { owner: 'keynes', units: 2 }; // 2 units — no auto-capture
    // attacker rolls low, defender high → defend wins
    const next = resolveAttack(
      { ...s, current: s.order.indexOf('marx'), phase: 'attack' as const },
      a.id,
      b,
      seq([0.0, 0.99, 0.99]), // attacker 1,1 | defender 6,6
    );
    // Territory should still be owned by keynes (defender won)
    expect(next.territories[b].owner).toBe('keynes');
  });

  it('austrian power: +1 to defender die flips combat outcome (attacker 2 vs defender 1+bonus)', () => {
    // Single-die combat: attacker has 2 units (1 attacker die), defender has 1 unit (1 defender die).
    // RNG sequence: attacker die → rng=0.17 → floor(0.17*6)+1 = floor(1.02)+1 = 2
    //               defender die → rng=0.0  → floor(0.0*6)+1  = floor(0)+1   = 1
    //
    // WITHOUT austrian bonus: attacker(2) > defender(1) → DEFENDER loses unit (drops to 0 → captured).
    // WITH    austrian bonus: defender raw(1) + 1 = 2, attacker(2) vs defender(2) → TIE → ATTACKER loses unit.
    //
    // This test would FAIL if the +1 bonus were removed: in that case both scenarios produce an
    // attacker win and the austrian defender would be captured too.
    const a = TERRITORIES[0];
    const b = a.adj[0];

    // --- Non-austrian case (marx defender) ---
    const sNonAustrian = createInitialState(['keynes'], () => 0.5);
    sNonAustrian.territories[a.id] = { owner: 'keynes', units: 2 };
    sNonAustrian.territories[b]    = { owner: 'marx',   units: 1 };
    // rng: attacker=0.17 (→2), defender=0.0 (→1)
    const nextNonAustrian = resolveAttack(
      { ...sNonAustrian, current: sNonAustrian.order.indexOf('keynes'), phase: 'attack' as const },
      a.id,
      b,
      seq([0.17, 0.0]),
    );
    // Attacker(2) > defender(1): defender loses its only unit → territory captured by keynes
    expect(nextNonAustrian.territories[b].owner).toBe('keynes'); // non-austrian defender IS captured

    // --- Austrian case ---
    const sAustrian = createInitialState(['keynes'], () => 0.5);
    sAustrian.territories[a.id] = { owner: 'keynes',   units: 2 };
    sAustrian.territories[b]    = { owner: 'austrian', units: 1 };
    // Same rng: attacker=0.17 (→2), defender raw=0.0 (→1), +1 bonus → 2; tie → attacker loses
    const nextAustrian = resolveAttack(
      { ...sAustrian, current: sAustrian.order.indexOf('keynes'), phase: 'attack' as const },
      a.id,
      b,
      seq([0.17, 0.0]),
    );
    // Tie (2 vs 2): attacker loses a unit; defender does NOT lose a unit
    expect(nextAustrian.territories[b].owner).toBe('austrian');   // austrian defender NOT captured
    expect(nextAustrian.territories[b].units).toBe(1);             // defender still has 1 unit
    expect(nextAustrian.territories[a.id].units).toBe(1);          // attacker lost 1 unit (2→1)
  });

  it('neoclassic sets neoclassicJumpUsed after a non-adjacent attack', () => {
    const s = createInitialState(['neoclassic'], () => 0.5);
    const a = TERRITORIES[0];
    const nonAdj = TERRITORIES.find((t) => t.id !== a.id && !a.adj.includes(t.id))!;
    s.territories[a.id] = { owner: 'neoclassic', units: 5 };
    s.territories[nonAdj.id] = { owner: 'marx', units: 1 };
    const attackState = {
      ...s,
      current: s.order.indexOf('neoclassic'),
      phase: 'attack' as const,
      neoclassicJumpUsed: false,
    };
    // Attacker wins easily with high dice
    const next = resolveAttack(attackState, a.id, nonAdj.id, seq([0.99, 0.99, 0.99, 0.0]));
    expect(next.neoclassicJumpUsed).toBe(true);
  });

  it('neoclassic does NOT set neoclassicJumpUsed for adjacent attacks', () => {
    const s = createInitialState(['neoclassic'], () => 0.5);
    const a = TERRITORIES[0];
    const adjId = a.adj[0];
    s.territories[a.id] = { owner: 'neoclassic', units: 5 };
    s.territories[adjId] = { owner: 'marx', units: 1 };
    const attackState = {
      ...s,
      current: s.order.indexOf('neoclassic'),
      phase: 'attack' as const,
      neoclassicJumpUsed: false,
    };
    const next = resolveAttack(attackState, a.id, adjId, seq([0.99, 0.99, 0.99, 0.0]));
    expect(next.neoclassicJumpUsed).toBe(false);
  });

  // ─── placeReinforcement ───────────────────────────────────────────────────────

  it('placeReinforcement decrements reinforcementsLeft and adds a unit', () => {
    const s = createInitialState(['keynes'], () => 0.5);
    const f = 'keynes';
    const territory = TERRITORIES.find((t) => s.territories[t.id].owner === f)!;
    const state = { ...s, phase: 'reinforce' as const, reinforcementsLeft: 3 };
    const before = state.territories[territory.id].units;
    const next = placeReinforcement(state, territory.id);
    expect(next.territories[territory.id].units).toBe(before + 1);
    expect(next.reinforcementsLeft).toBe(2);
  });

  // ─── fortify ─────────────────────────────────────────────────────────────────

  it('fortify moves n units between own territories', () => {
    const s = createInitialState(['keynes'], () => 0.5);
    const a = TERRITORIES[0];
    const b = a.adj[0];
    s.territories[a.id] = { owner: 'keynes', units: 5 };
    s.territories[b] = { owner: 'keynes', units: 1 };
    const fState = { ...s, phase: 'fortify' as const, current: s.order.indexOf('keynes') };
    const next = fortify(fState, a.id, b, 2);
    expect(next.territories[a.id].units).toBe(3);
    expect(next.territories[b].units).toBe(3);
  });

  it('fortify is rejected when from and to are not adjacent (state unchanged)', () => {
    const s = createInitialState(['keynes'], () => 0.5);
    const a = TERRITORIES[0];
    // Find a territory that is NOT adjacent to a
    const nonAdj = TERRITORIES.find((t) => t.id !== a.id && !a.adj.includes(t.id))!;
    s.territories[a.id]      = { owner: 'keynes', units: 5 };
    s.territories[nonAdj.id] = { owner: 'keynes', units: 1 };
    const fState = { ...s, phase: 'fortify' as const, current: s.order.indexOf('keynes') };
    const next = fortify(fState, a.id, nonAdj.id, 2);
    // State must be returned unchanged
    expect(next.territories[a.id].units).toBe(5);
    expect(next.territories[nonAdj.id].units).toBe(1);
  });

  it('fortify succeeds when from and to are adjacent', () => {
    const s = createInitialState(['keynes'], () => 0.5);
    const a = TERRITORIES[0];
    const adjId = a.adj[0];
    s.territories[a.id] = { owner: 'keynes', units: 5 };
    s.territories[adjId] = { owner: 'keynes', units: 1 };
    const fState = { ...s, phase: 'fortify' as const, current: s.order.indexOf('keynes') };
    const next = fortify(fState, a.id, adjId, 3);
    expect(next.territories[a.id].units).toBe(2);
    expect(next.territories[adjId].units).toBe(4);
  });

  // ─── Victory conditions ───────────────────────────────────────────────────────

  it('checkVictory: 18+ territories → that faction wins', () => {
    const s = createInitialState(['keynes'], () => 0.5);
    let i = 0;
    for (const t of TERRITORIES) {
      s.territories[t.id] = { owner: 'keynes', units: 1 };
      if (++i >= 18) break;
    }
    expect(checkVictory(s)).toBe('keynes');
  });

  it('checkVictory: only one faction alive → that faction wins', () => {
    const s = createInitialState(['keynes'], () => 0.5);
    for (const t of TERRITORIES) s.territories[t.id] = { owner: 'keynes', units: 1 };
    for (const f of FACTION_IDS) s.factions[f].alive = f === 'keynes';
    expect(checkVictory(s)).toBe('keynes');
  });

  it('checkVictory returns null mid-game with no clear winner', () => {
    const s = createInitialState(['keynes'], () => 0.5);
    expect(checkVictory(s)).toBeNull();
  });

  it('checkVictory: round > 15 → faction with most territories wins', () => {
    const s = createInitialState(['keynes'], () => 0.5);
    // Give keynes 13 territories, marx 11
    let i = 0;
    for (const t of TERRITORIES) {
      s.territories[t.id] = { owner: i < 13 ? 'keynes' : 'marx', units: 1 };
      i++;
    }
    const lateState = { ...s, round: 16 };
    expect(checkVictory(lateState)).toBe('keynes');
  });

  // ─── Phase transitions ────────────────────────────────────────────────────────

  it('advancePhase transitions event → reinforce and sets reinforcementsLeft', () => {
    const s = createInitialState(['keynes'], () => 0.5);
    const state = { ...s, phase: 'event' as const };
    const next = advancePhase(state, () => 0.5);
    expect(next.phase).toBe('reinforce');
    expect(next.reinforcementsLeft).toBeGreaterThanOrEqual(3);
  });

  it('advancePhase transitions reinforce → attack', () => {
    const s = createInitialState(['keynes'], () => 0.5);
    const state = { ...s, phase: 'reinforce' as const };
    const next = advancePhase(state, () => 0.5);
    expect(next.phase).toBe('attack');
  });

  it('advancePhase transitions attack → fortify', () => {
    const s = createInitialState(['keynes'], () => 0.5);
    const state = { ...s, phase: 'attack' as const };
    const next = advancePhase(state, () => 0.5);
    expect(next.phase).toBe('fortify');
  });

  it('advancePhase transitions fortify → event (endTurn called, advances to next faction)', () => {
    const s = createInitialState(['keynes'], () => 0.5);
    const state = { ...s, phase: 'fortify' as const };
    const next = advancePhase(state, () => 0.5);
    // After fortify, endTurn runs which advances current
    expect(next.phase).toBe('event');
  });

  // ─── endTurn ─────────────────────────────────────────────────────────────────

  it('endTurn resets neoclassicJumpUsed', () => {
    const s = createInitialState(['keynes'], () => 0.5);
    const state = { ...s, neoclassicJumpUsed: true };
    const next = endTurn(state, () => 0.5);
    expect(next.neoclassicJumpUsed).toBe(false);
  });

  it('endTurn advances current to next alive faction', () => {
    const s = createInitialState(['keynes'], () => 0.5);
    const before = s.current;
    const next = endTurn(s, () => 0.5);
    expect(next.current).not.toBe(before);
  });

  it('endTurn increments round when all factions have had a turn', () => {
    const s = createInitialState(['keynes'], () => 0.5);
    // Put current at the last faction so next wrap would increment round
    const last = s.order.length - 1;
    const state = { ...s, current: last };
    const next = endTurn(state, () => 0.5);
    expect(next.round).toBe(2);
    expect(next.current).toBe(0);
  });

  it('keynes faction gets +2 units every 3 turns (turnsSinceBonus resets to 0)', () => {
    const s = createInitialState(['keynes'], () => 0.5);
    const keynesTerritory = TERRITORIES.find((t) => s.territories[t.id].owner === 'keynes')!;
    // Set turnsSinceBonus = 2 so next turn triggers the bonus
    s.factions.keynes.turnsSinceBonus = 2;
    // Put current on keynes so endTurn processes keynes' bonus
    const state = { ...s, current: s.order.indexOf('keynes') };
    const totalBefore = Object.values(state.territories).reduce((a, t) => a + t.units, 0);
    const next = endTurn(state, () => 0.5);
    const totalAfter = Object.values(next.territories).reduce((a, t) => a + t.units, 0);
    expect(totalAfter).toBeGreaterThanOrEqual(totalBefore + 2);
    expect(next.factions.keynes.turnsSinceBonus).toBe(0);
  });

  // ─── applyEvent ───────────────────────────────────────────────────────────────

  it('applyEvent draws a card and sets activeEvent', () => {
    const s = createInitialState(['keynes'], () => 0.5);
    const state = { ...s, phase: 'event' as const };
    const next = applyEvent(state, () => 0.5);
    expect(next.activeEvent).not.toBeNull();
  });

  it('applyEvent peaceRound sets peaceUntilRound = current round', () => {
    // trade_deal is index 1 (kind: peaceRound), rngVal = 1/15 + 0.001
    // EVENT_CARDS has 15 cards; index 1 → rng in [1/15, 2/15)
    const rngVal = 1 / 15 + 0.001;
    const s = createInitialState(['keynes'], () => 0.5);
    const state = { ...s, round: 3 };
    const next = applyEvent(state, () => rngVal);
    expect(next.peaceUntilRound).toBe(3);
  });

  it('faction marked dead when last territory captured', () => {
    const s = createInitialState(['keynes'], () => 0.5);
    // Give marx ONLY one territory adjacent to keynes
    const a = TERRITORIES[0];
    const b = a.adj[0];
    for (const t of TERRITORIES) {
      s.territories[t.id] = { owner: 'keynes', units: 3 };
    }
    s.territories[b] = { owner: 'marx', units: 1 };
    s.factions.marx.alive = true;
    const attackState = { ...s, current: s.order.indexOf('keynes'), phase: 'attack' as const };
    // Attacker wins with certainty
    const next = resolveAttack(attackState, a.id, b, seq([0.99, 0.99, 0.99, 0.0]));
    if (next.territories[b].owner === 'keynes') {
      expect(next.factions.marx.alive).toBe(false);
    }
  });

  // ─── m-5: Marxist auto-capture eliminates defender when it is their last territory ─

  it('resolveAttack: Marxist auto-capture sets defender alive=false when capturing last territory', () => {
    const s = createInitialState(['marx'], () => 0.5);
    const a = TERRITORIES[0];
    const b = a.adj[0];

    // Give all territories to marx except b (keynes' sole territory)
    for (const t of TERRITORIES) {
      s.territories[t.id] = { owner: 'marx', units: 3 };
    }
    s.territories[a.id] = { owner: 'marx', units: 3 };
    s.territories[b]    = { owner: 'keynes', units: 1 }; // keynes' LAST territory
    s.factions.keynes.alive = true;

    const attackState = { ...s, current: s.order.indexOf('marx'), phase: 'attack' as const };
    // Marxist auto-captures because defender has exactly 1 unit — no RNG needed
    const next = resolveAttack(attackState, a.id, b, seq([]));

    expect(next.territories[b].owner).toBe('marx');
    expect(next.factions.keynes.alive).toBe(false);
  });

  // ─── m-6: applyEvent with redistribute kind (capital_flight card) ─────────────

  it('applyEvent redistribute: transfers units from leader (strongest territory) to weakest faction', () => {
    const s = createInitialState(['keynes'], () => 0.5);

    // Set up a clear leader (keynes, 12 territories) and a clear weakest (marx, 4 territories)
    // austrian and neoclassic get 4 each
    const allIds = Object.keys(s.territories);
    for (let i = 0; i < allIds.length; i++) {
      if (i < 12) {
        s.territories[allIds[i]] = { owner: 'keynes', units: i < 6 ? 5 : 1 }; // first 6 are "strong"
      } else if (i < 16) {
        s.territories[allIds[i]] = { owner: 'marx', units: 1 };
      } else if (i < 20) {
        s.territories[allIds[i]] = { owner: 'austrian', units: 1 };
      } else {
        s.territories[allIds[i]] = { owner: 'neoclassic', units: 1 };
      }
    }

    // Find keynes' strongest territory and marx' strongest territory before the event
    const keynesTerrs = allIds.filter((id) => s.territories[id].owner === 'keynes');
    const marxTerrs   = allIds.filter((id) => s.territories[id].owner === 'marx');
    const leaderStrongest = keynesTerrs.reduce((best, id) =>
      s.territories[id].units > s.territories[best].units ? id : best,
    );
    const weakestStrongest = marxTerrs.reduce((best, id) =>
      s.territories[id].units > s.territories[best].units ? id : best,
    );
    const leaderUnitsBefore  = s.territories[leaderStrongest].units;
    const weakestUnitsBefore = s.territories[weakestStrongest].units;

    // capital_flight is index 11 in EVENT_CARDS (0-based), kind: 'redistribute', amount: 2
    // rng = 11/15 + epsilon forces that card to be selected
    const rngVal = 11 / 15 + 0.001;
    const next = applyEvent(s, () => rngVal);

    expect(next.territories[leaderStrongest].units).toBeLessThan(leaderUnitsBefore);
    expect(next.territories[weakestStrongest].units).toBeGreaterThan(weakestUnitsBefore);
    // The transferred amount should equal card.amount (2), capped to leaderUnits - 1
    const removed = leaderUnitsBefore  - next.territories[leaderStrongest].units;
    const gained  = next.territories[weakestStrongest].units - weakestUnitsBefore;
    expect(removed).toBe(gained); // same units removed = units added
    expect(removed).toBeLessThanOrEqual(2); // never more than card.amount
  });
});
