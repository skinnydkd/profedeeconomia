/** @jsxImportSource preact */
// EconriskGame — root Preact island for the Econrisk hot-seat strategy game.
//
// UI state machine:
//   'setup'  → SetupScreen: choose human factions, optionally resume a save
//   'pass'   → PassDeviceScreen: interstitial before each human turn
//   'playing'→ main game (map + sidepanel + phasebar), driven by state.phase
//   'finished'→ EndScreen
//
// SSR safety: localStorage is NEVER read during render or useState initializer.
//   All storage access is deferred to post-mount useEffect hooks (mirror StonksGame.tsx).
//
// AI driver: a single useEffect that fires whenever `state` changes. When the
//   current faction is AI, not finished, and not mid-pass-interstitial, it
//   schedules aiTakeTurn via setTimeout (~700ms) so the class can see the turn.
//   A ref flag guards against re-entry (the timeout may fire after a rapid state change).
//
// Attack flow: click own territory (source) → click adjacent enemy territory (target)
//   → resolveAttack is called automatically.
//
// Reinforce flow: click own territory → placeReinforcement called.
//   When reinforcementsLeft === 0, phase auto-advances.
//
// Fortify flow: click own territory (source) → click own adjacent territory (target)
//   → fortify called (moves all spare units − 1).

import { useState, useEffect, useRef } from 'preact/hooks';
import type { GameState, FactionId } from '@/lib/games/econrisk/types';
import {
  createInitialState,
  placeReinforcement,
  resolveAttack,
  fortify,
  advancePhase,
  canAttack,
  ownedCount,
} from '@/lib/games/econrisk/engine';
import { aiTakeTurn } from '@/lib/games/econrisk/ai';
import { factionMeta } from '@/lib/games/econrisk/factions';
import { byId, TERRITORIES } from '@/lib/games/econrisk/map';
import { makeGameStorage } from '@/lib/games/storage';

import { SetupScreen } from './SetupScreen';
import { PassDeviceScreen } from './PassDeviceScreen';
import { MapView } from './MapView';
import { SidePanel } from './SidePanel';
import { PhaseBar } from './PhaseBar';
import { EndScreen } from './EndScreen';

import './econrisk.css';

// ─── Storage ──────────────────────────────────────────────────────────────────
// Instantiated at module level (safe — makeGameStorage only accesses localStorage
// inside its returned methods, not on construction).
const store = makeGameStorage<GameState>('econrisk');

// ─── Types ────────────────────────────────────────────────────────────────────
type UIState = 'setup' | 'pass' | 'playing' | 'finished';

// ─── Root island ─────────────────────────────────────────────────────────────
export default function EconriskGame() {
  // UI sub-state — never read localStorage in this initializer (SSR safety).
  const [ui, setUi] = useState<UIState>('setup');

  // Game state — null while on setup screen.
  // We do NOT initialize from storage here; that is deferred to a useEffect below.
  const [state, setState] = useState<GameState | null>(null);

  // Whether a saved game exists (detected post-mount).
  const [hasSave, setHasSave] = useState(false);

  // Selected territory id for multi-click interactions (attack / fortify).
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // AI driver re-entry guard: true while a setTimeout is pending.
  const aiPending = useRef(false);

  // ─── Post-mount: detect saved game (SSR-safe) ────────────────────────────
  useEffect(() => {
    setHasSave(!!store.load());
  }, []);

  // ─── Persist on state change (skip while on setup) ───────────────────────
  useEffect(() => {
    if (state === null || ui === 'setup') return;
    if (state.winner !== null) {
      store.clear();
      setHasSave(false);
    } else {
      store.save(state);
    }
  }, [state, ui]);

  // ─── AI driver ──────────────────────────────────────────────────────────
  // Fires whenever `state` changes. Schedules aiTakeTurn ~700ms later if:
  //   1. A game state exists
  //   2. No winner yet
  //   3. Current faction is AI
  //   4. UI sub-state is 'playing' (not in pass/setup/finished interstitial)
  //   5. No AI turn is already pending (re-entry guard)
  useEffect(() => {
    if (state === null) return;
    if (state.winner !== null) return;
    if (ui !== 'playing') return;

    const currentFaction = state.order[state.current];
    const isAI = !state.factions[currentFaction].isHuman;
    if (!isAI) return;
    if (aiPending.current) return;

    aiPending.current = true;
    const tid = setTimeout(() => {
      setState((prev) => {
        if (!prev) return prev;
        // Re-validate: the faction might have changed by the time the timer fires
        const cf = prev.order[prev.current];
        if (prev.factions[cf].isHuman || prev.winner !== null) {
          aiPending.current = false;
          return prev;
        }
        const next = aiTakeTurn(prev);
        aiPending.current = false;
        // Pass-screen is handled by the separate useEffect below that watches state+ui.
        return next;
      });
    }, 700);

    return () => {
      clearTimeout(tid);
      aiPending.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, ui]);

  // ─── Pass-screen logic ───────────────────────────────────────────────────
  // When state changes while playing and the new current faction is human,
  // show the pass-device screen (interstitial before human turn).
  // We track the "last human who played" to avoid showing pass on the very first turn.
  const lastHumanFaction = useRef<FactionId | null>(null);

  useEffect(() => {
    if (state === null || ui === 'setup' || ui === 'finished') return;
    if (state.winner !== null) {
      setUi('finished');
      return;
    }
    if (ui === 'pass') return; // already on pass screen — wait for user action

    const currentFaction = state.order[state.current];
    const isHuman = state.factions[currentFaction].isHuman;

    if (isHuman) {
      // If this is a different human turn than the last one, show pass screen
      if (lastHumanFaction.current !== null && lastHumanFaction.current !== currentFaction) {
        setUi('pass');
        return;
      }
      // Also show pass screen if the same human just passed through an AI sequence
      // (i.e., we were in 'playing' and came back to the same human after AI turns)
      lastHumanFaction.current = currentFaction;
    }
  }, [state, ui]);

  // ─── Transitions ─────────────────────────────────────────────────────────

  function startGame(humanFactions: FactionId[]) {
    const newState = createInitialState(humanFactions);
    lastHumanFaction.current = newState.order[newState.current] as FactionId;
    setState(newState);
    setSelectedId(null);
    setUi('playing');
  }

  function continueGame() {
    const saved = store.load();
    if (!saved) return;
    setState(saved);
    setSelectedId(null);
    // Find the current faction
    const cf = saved.order[saved.current];
    lastHumanFaction.current = saved.factions[cf].isHuman ? (cf as FactionId) : null;
    setUi(saved.winner ? 'finished' : 'playing');
  }

  function readyAfterPass() {
    if (!state) return;
    const cf = state.order[state.current];
    lastHumanFaction.current = cf as FactionId;
    setUi('playing');
  }

  function restartGame() {
    setState(null);
    setSelectedId(null);
    lastHumanFaction.current = null;
    aiPending.current = false;
    setHasSave(!!store.load()); // re-check (should be false after clear)
    setUi('setup');
  }

  // ─── Human interaction ───────────────────────────────────────────────────

  function handleTerritoryClick(id: string) {
    if (!state) return;
    const currentFaction = state.order[state.current];
    if (!state.factions[currentFaction].isHuman) return; // ignore clicks during AI turn

    const cell = state.territories[id];

    if (state.phase === 'reinforce') {
      // Reinforce: click own territory → place 1 unit
      if (cell.owner === currentFaction && state.reinforcementsLeft > 0) {
        const next = placeReinforcement(state, id);
        setState(next);
        // Auto-advance when all reinforcements placed
        if (next.reinforcementsLeft === 0) {
          setState(advancePhase(next));
        }
      }
      return;
    }

    if (state.phase === 'attack') {
      if (!selectedId) {
        // First click: select source (must be own territory with > 1 unit)
        if (cell.owner === currentFaction && cell.units > 1) {
          setSelectedId(id);
        }
      } else {
        // Second click: attack target OR re-select
        if (id === selectedId) {
          setSelectedId(null);
          return;
        }
        if (cell.owner === currentFaction) {
          // Re-select as source
          if (cell.units > 1) setSelectedId(id);
          return;
        }
        // Try to attack
        if (canAttack(state, selectedId, id)) {
          setState(resolveAttack(state, selectedId, id));
          setSelectedId(null);
        }
        // If attack not valid (not adjacent for non-neoclassic), just re-select
      }
      return;
    }

    if (state.phase === 'fortify') {
      if (!selectedId) {
        // First click: select source (must be own territory with > 1 unit)
        if (cell.owner === currentFaction && cell.units > 1) {
          setSelectedId(id);
        }
      } else {
        if (id === selectedId) {
          setSelectedId(null);
          return;
        }
        if (cell.owner === currentFaction && byId[selectedId]?.adj.includes(id)) {
          // Move all spare units (keep 1 behind)
          const spare = state.territories[selectedId].units - 1;
          if (spare > 0) {
            setState(fortify(state, selectedId, id, spare));
          }
          setSelectedId(null);
        } else if (cell.owner === currentFaction && cell.units > 1) {
          setSelectedId(id); // re-select
        } else {
          setSelectedId(null);
        }
      }
      return;
    }

    // Event phase: clicks are ignored (auto-handled by "Siguiente fase")
  }

  function handleNextPhase() {
    if (!state) return;
    setSelectedId(null);
    setState(advancePhase(state));
  }

  // ─── Render ──────────────────────────────────────────────────────────────

  if (ui === 'setup') {
    return (
      <SetupScreen
        hasSave={hasSave}
        onStart={startGame}
        onContinue={continueGame}
      />
    );
  }

  if (ui === 'finished' && state) {
    return (
      <EndScreen state={state} onRestart={restartGame} />
    );
  }

  if (!state) return null;

  if (ui === 'pass') {
    const cf = state.order[state.current];
    const meta = factionMeta[cf];
    return (
      <PassDeviceScreen
        factionLabel={meta.label}
        factionColor={meta.color}
        onReady={readyAfterPass}
      />
    );
  }

  // ─── Playing screen ───────────────────────────────────────────────────────
  const currentFaction = state.order[state.current];
  const meta = factionMeta[currentFaction];
  const isAI = !state.factions[currentFaction].isHuman;

  // Determine if the "Siguiente fase" button should be disabled
  // During 'reinforce' phase, force the player to place all units first
  const nextDisabled = isAI || (state.phase === 'reinforce' && state.reinforcementsLeft > 0);

  // Log entries (show most-recent last; cap at 8)
  const recentLog = state.log.slice(-8);

  return (
    <div class="er">
      {/* Top bar */}
      <header class="er-topbar">
        <h1 class="er-topbar-title">Econrisk</h1>
        <span class="er-topbar-round">Ronda {state.round}/15</span>
        <span class="er-topbar-sep" />
        <span
          class="er-faction-badge"
          style={{ background: meta.color }}
        >
          {meta.label}
          {isAI ? ' (IA)' : ''}
        </span>
      </header>

      {/* Main area: map + side panel */}
      <div class="er-body">
        {/* Map area */}
        <main class="er-map-area">
          <div class="er-map-wrap">
            <MapView
              state={state}
              selectedId={selectedId}
              onSelect={handleTerritoryClick}
            />
          </div>

          {/* Map legend */}
          <div class="er-legend">
            {[
              { label: 'Keynesianos', color: '#1F6E6E' },
              { label: 'Marxistas', color: '#8C2F39' },
              { label: 'Austríacos', color: '#A87A2A' },
              { label: 'Neoclásicos', color: '#2E5E3A' },
            ].map((f) => (
              <div key={f.label} class="er-legend-item">
                <span class="er-legend-dot" style={{ background: f.color }} />
                {f.label}
              </div>
            ))}
            <span style={{ marginLeft: 'auto', fontSize: '0.7rem', color: '#8A7868', fontStyle: 'italic' }}>
              {ownedCount(state, currentFaction)} / {TERRITORIES.length} — objetivo: 18+
            </span>
          </div>

          {/* Recent log */}
          {recentLog.length > 0 && (
            <div class="er-log">
              {recentLog.map((entry, i) => (
                <div key={i} class="er-log-entry">{entry}</div>
              ))}
            </div>
          )}
        </main>

        {/* Side panel */}
        <SidePanel state={state} selectedId={selectedId} />
      </div>

      {/* Phase bar — bottom */}
      <PhaseBar
        phase={state.phase}
        onNext={handleNextPhase}
        disabled={nextDisabled}
      />
    </div>
  );
}
