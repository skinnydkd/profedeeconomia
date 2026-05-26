/** @jsxImportSource preact */
// EconopolyGame — root Preact island for Econopoly hot-seat board game.
//
// UI state machine:
//   'setup'    → SetupScreen: choose players (names, colors, human/AI), resume save
//   'pass'     → PassDeviceScreen: interstitial before each human turn
//   'playing'  → main game (board + side panel + auction modal)
//   'finished' → EndScreen
//
// SSR safety: localStorage is NEVER read during render or useState initializer.
//   All storage access is deferred to post-mount useEffect hooks.
//
// AI driver: useEffect([state, ui]) fires on every state/ui change.
//   When current player is AI, ui==='playing', no winner, and either no auction
//   OR auction's currentBidder is AI — schedules aiTakeTurn / auction step after
//   ~700ms. A ref flag (aiPending) prevents re-entry.
//
// Auction flow: activeAuction !== null shows <AuctionModal>.
//   If currentBidder is human → bid/pass buttons are live.
//   If currentBidder is AI → AI driver advances it via the setTimeout.
//
// Hot-seat pass: tracks lastHumanPlayer. When the new current player is a
//   different human, shows PassDeviceScreen first. Skipped on the very first turn.

import { useState, useEffect, useRef } from 'preact/hooks';
import type { GameState } from '@/lib/games/econopoly/types';
import {
  createInitialState,
  advancePhase,
  buyProperty,
  startAuction,
  auctionBid,
  auctionPass,
  upgradeRd,
  endTurn,
} from '@/lib/games/econopoly/engine';
import { aiTakeTurn, aiAuctionDecide } from '@/lib/games/econopoly/ai';
import { makeGameStorage } from '@/lib/games/storage';
import { CELLS } from '@/lib/games/econopoly/board';

import { SetupScreen } from './SetupScreen';
import { PassDeviceScreen } from './PassDeviceScreen';
import { BoardView } from './BoardView';
import { SidePanel } from './SidePanel';
import { AuctionModal } from './AuctionModal';
import { EndScreen } from './EndScreen';

import './econopoly.css';

// ─── Storage ──────────────────────────────────────────────────────────────────
// Safe to instantiate at module level; localStorage is only accessed inside the
// returned methods, never on construction.
const store = makeGameStorage<GameState>('econopoly');

// ─── Types ────────────────────────────────────────────────────────────────────
type UIState = 'setup' | 'pass' | 'playing' | 'finished';

interface PlayerConfig {
  name: string;
  color: string;
  isHuman: boolean;
}

// ─── Root island ─────────────────────────────────────────────────────────────
export default function EconopolyGame() {
  // Game state — null while on setup screen.
  // NEVER initialized from localStorage here (SSR safety).
  const [state, setState] = useState<GameState | null>(null);

  // UI sub-state — starts on setup.
  const [ui, setUi] = useState<UIState>('setup');

  // Whether a saved game exists (detected post-mount).
  const [hasSave, setHasSave] = useState(false);

  // AI driver re-entry guard: true while a setTimeout is pending.
  const aiPending = useRef(false);

  // Track last human player id to decide when to show pass screen.
  // null = no human has acted yet (first turn).
  const lastHumanId = useRef<number | null>(null);

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
  // Fires whenever state or ui changes.
  // Schedules the AI action ~700ms later when:
  //   1. A game state exists
  //   2. No winner yet
  //   3. ui === 'playing'
  //   4. Current player is AI
  //   5. Either no auction active, or the auction's current bidder is AI
  //   6. No AI turn already pending (re-entry guard)
  useEffect(() => {
    if (state === null) return;
    if (state.winner !== null) return;
    if (ui !== 'playing') return;

    const currentPlayer = state.players[state.current];
    if (!currentPlayer || currentPlayer.isHuman) return;

    // If there's an active auction and the current bidder is human, don't drive
    if (state.activeAuction !== null) {
      const bidder = state.players[state.activeAuction.currentBidder];
      if (bidder?.isHuman) return;
    }

    if (aiPending.current) return;

    aiPending.current = true;
    const tid = setTimeout(() => {
      setState((prev) => {
        if (!prev) {
          aiPending.current = false;
          return prev;
        }
        // Re-validate inside callback (state may have changed between schedule and fire)
        if (prev.winner !== null) {
          aiPending.current = false;
          return prev;
        }
        const cp = prev.players[prev.current];
        if (!cp || cp.isHuman) {
          aiPending.current = false;
          return prev;
        }

        // Case 1: active auction with AI as current bidder — step the auction
        if (prev.activeAuction !== null) {
          const bidder = prev.players[prev.activeAuction.currentBidder];
          if (bidder?.isHuman) {
            aiPending.current = false;
            return prev;
          }
          const decision = aiAuctionDecide({ ...prev, current: prev.activeAuction.currentBidder });
          const next = decision.kind === 'bid'
            ? auctionBid(prev, decision.amount)
            : auctionPass(prev);
          aiPending.current = false;
          return next;
        }

        // Case 2: AI takes full turn
        const next = aiTakeTurn(prev);
        aiPending.current = false;
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
  // When state changes and the new current player is a human different from the
  // last human who played, show the pass-device screen.
  useEffect(() => {
    if (state === null) return;
    if (ui === 'setup' || ui === 'finished') return;
    if (ui === 'pass') return; // already showing pass screen

    // If game finished, switch to end screen
    if (state.winner !== null) {
      setUi('finished');
      return;
    }

    const currentPlayer = state.players[state.current];
    if (!currentPlayer?.isHuman) return; // AI player — no pass needed

    // Skip pass screen on the very first human turn (lastHumanId.current === null)
    if (lastHumanId.current === null) {
      lastHumanId.current = currentPlayer.id;
      return;
    }

    // If a different human is now current, show pass screen
    if (lastHumanId.current !== currentPlayer.id) {
      setUi('pass');
    }
  }, [state, ui]);

  // ─── Game transitions ────────────────────────────────────────────────────

  function startGame(players: PlayerConfig[]) {
    const newState = createInitialState(players);
    // Find the first human player (if any) to initialize lastHumanId
    const firstHuman = newState.players[newState.current];
    lastHumanId.current = firstHuman?.isHuman ? firstHuman.id : null;
    aiPending.current = false;
    setState(newState);
    setUi('playing');
  }

  function continueGame() {
    const saved = store.load();
    if (!saved) return;
    const currentPlayer = saved.players[saved.current];
    lastHumanId.current = currentPlayer?.isHuman ? currentPlayer.id : null;
    aiPending.current = false;
    setState(saved);
    setUi(saved.winner !== null ? 'finished' : 'playing');
  }

  function readyAfterPass() {
    if (!state) return;
    const currentPlayer = state.players[state.current];
    lastHumanId.current = currentPlayer?.id ?? null;
    setUi('playing');
  }

  function restartGame() {
    store.clear();
    setState(null);
    lastHumanId.current = null;
    aiPending.current = false;
    setHasSave(false);
    setUi('setup');
  }

  // ─── Human game actions ──────────────────────────────────────────────────

  function handleRollDice() {
    if (!state) return;
    // advancePhase from 'roll' → moves player → goes to 'resolve'
    // then immediately auto-advance through 'resolve' to 'action'
    const afterRoll = advancePhase(state);      // roll → resolve (moves player)
    const afterResolve = advancePhase(afterRoll); // resolve → action (resolves cell)
    setState(afterResolve);
  }

  function handleBuyPending() {
    if (!state || state.pendingPurchase === null) return;
    setState(buyProperty(state, state.pendingPurchase));
  }

  function handlePassPending() {
    if (!state || state.pendingPurchase === null) return;
    setState(startAuction(state, state.pendingPurchase));
  }

  function handleUpgradeRd(cellId: number) {
    if (!state) return;
    setState(upgradeRd(state, cellId));
  }

  function handleEndTurn() {
    if (!state) return;
    const next = endTurn(state);
    // Track the last human player before updating state
    const nextPlayer = next.players[next.current];
    if (nextPlayer?.isHuman) {
      // PassDeviceScreen logic handled via useEffect watching state+ui
    }
    setState(next);
  }

  function handleAuctionBid(amount: number) {
    if (!state) return;
    setState(auctionBid(state, amount));
  }

  function handleAuctionPass() {
    if (!state) return;
    setState(auctionPass(state));
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
    const currentPlayer = state.players[state.current];
    return (
      <PassDeviceScreen
        playerName={currentPlayer?.name ?? '?'}
        color={currentPlayer?.color ?? '#8A7868'}
        onReady={readyAfterPass}
      />
    );
  }

  // ─── Playing screen ────────────────────────────────────────────────────

  const currentPlayer = state.players[state.current];
  const isCurrentAI = !currentPlayer?.isHuman;

  return (
    <div class="ep2">
      {/* Top bar */}
      <header class="ep2-topbar">
        <div>
          <div class="ep2-topbar-eyebrow">Juegos · Economia</div>
          <h1 class="ep2-topbar-title">Econopoly</h1>
        </div>
        <div class="ep2-topbar-meta">
          Ronda {state.round}/20 · {state.players.filter((p) => p.alive).length} jugadores
        </div>
        <span class="ep2-topbar-sep" />
        {/* Current player turn pill */}
        <div class="ep2-turn-pill">
          <span
            class="ep2-turn-dot"
            style={{ background: currentPlayer?.color ?? '#8A7868' }}
          />
          <span>
            Turno:{' '}
            <strong>{currentPlayer?.name ?? '?'}</strong>
            {isCurrentAI ? ' (IA)' : ''}
          </span>
        </div>
      </header>

      {/* Main body */}
      <div class="ep2-body">
        {/* Board area */}
        <main class="ep2-board-wrap">
          <BoardView state={state} />

          {/* Sector legend */}
          <div class="ep2-legend">
            <span>
              <i style={{ background: '#1F6E6E' }} />
              <span class="pair">A · B</span>
              Tecnologia · Servicios
            </span>
            <span>
              <i style={{ background: '#A87A2A' }} />
              <span class="pair">C · D</span>
              Energia · Finanzas
            </span>
            <span>
              <i style={{ background: '#C44E2C' }} />
              <span class="pair">E · F</span>
              Agricultura · Industria
            </span>
            <span>
              <i style={{ background: '#2E5E3A' }} />
              <span class="pair">G · H</span>
              Turismo · Construccion
            </span>
          </div>
        </main>

        {/* Side panel */}
        <SidePanel
          state={state}
          onRollDice={handleRollDice}
          onBuyPending={handleBuyPending}
          onPassPending={handlePassPending}
          onUpgradeRd={handleUpgradeRd}
          onEndTurn={handleEndTurn}
        />
      </div>

      {/* Auction modal — rendered on top when active */}
      {state.activeAuction !== null && (
        <AuctionModal
          state={state}
          onBid={handleAuctionBid}
          onPass={handleAuctionPass}
        />
      )}
    </div>
  );
}
