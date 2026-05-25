/** @jsxImportSource preact */
import { useState, useEffect } from 'preact/hooks';
import type { GameState } from '@/lib/games/stonks/types';
import {
  createInitialState,
  advanceYear,
  currentYear,
  netWorth,
} from '@/lib/games/stonks/engine';
import { makeGameStorage } from '@/lib/games/storage';
import { ALLOCATION_MAX } from '@/lib/games/stonks/data';
import { StartScreen } from './StartScreen';
import { NewsScreen } from './NewsScreen';
import { AllocateScreen } from './AllocateScreen';
import { ResultScreen } from './ResultScreen';
import { FinalScreen } from './FinalScreen';
import './stonks.css';

// Root Preact island — game UI state machine.
// Persists state to localStorage via the shared games storage wrapper.
// Phase transitions:
//   start → (Empezar) → news
//   news  → (Invertir) → allocate
//   allocate → (Confirmar) → advanceYear → results | finished (last round)
//   results → (Siguiente año) → news
//   finished → FinalScreen → (Jugar otra vez) → news (fresh game)

const store = makeGameStorage<GameState>('stonks');

export default function StonksGame() {
  const [state, setState] = useState<GameState>(() => {
    const saved = store.load();
    return saved ?? createInitialState();
  });

  // hasSave derived once at mount and updated imperatively on clear/start.
  const [hasSave, setHasSave] = useState(() => !!store.load());

  useEffect(() => {
    if (state.phase === 'finished') {
      // Game over: record best score, clear in-progress save.
      store.setBest(netWorth(state));
      store.clear();
      setHasSave(false);
    } else if (state.phase !== 'start') {
      // Persist in-progress state so the player can resume.
      store.save(state);
    }
  }, [state]);

  // Transitions ----------------------------------------------------------------

  const start = () => {
    setHasSave(false);
    setState({ ...createInitialState(), phase: 'news' });
  };

  const cont = () => {
    const saved = store.load();
    if (saved) setState(saved);
  };

  const toAllocate = () =>
    setState((s) => ({ ...s, phase: 'allocate' }));

  // Update a single asset's allocation, clamped 0..ALLOCATION_MAX.
  const change = (id: string, delta: number) =>
    setState((s) => {
      const current = s.allocation[id as keyof typeof s.allocation] || 0;
      const next = Math.max(0, Math.min(ALLOCATION_MAX, current + delta));
      return { ...s, allocation: { ...s.allocation, [id]: next } };
    });

  // Confirm allocation: advance the engine one year.
  const confirm = () => setState((s) => advanceYear(s));

  // After results screen: advance to the next news round.
  const next = () =>
    setState((s) => (s.phase === 'finished' ? s : { ...s, phase: 'news' }));

  // Restart: fresh game starting at the news phase.
  const restart = () =>
    setState({ ...createInitialState(), phase: 'news' });

  // Render --------------------------------------------------------------------

  return (
    <div class="sk">
      {state.phase === 'start' && (
        <StartScreen hasSave={hasSave} onStart={start} onContinue={cont} />
      )}
      {state.phase === 'news' && (
        <NewsScreen year={currentYear(state)} onContinue={toAllocate} />
      )}
      {state.phase === 'allocate' && (
        <AllocateScreen state={state} onChange={change} onConfirm={confirm} />
      )}
      {state.phase === 'results' && (
        <ResultScreen state={state} onNext={next} />
      )}
      {state.phase === 'finished' && (
        <FinalScreen state={state} onRestart={restart} />
      )}
    </div>
  );
}
