/** @jsxImportSource preact */
import { useState, useEffect } from 'preact/hooks';
import type { GameState, GameConfig } from '@/lib/games/seguros/types';
import { createInitialState } from '@/lib/games/seguros/engine';
import { makeGameStorage } from '@/lib/games/storage';
import SetupScreen from './SetupScreen';
import CoverageScreen from './CoverageScreen';
import EventScreen from './EventScreen';
import DebriefScreen from './DebriefScreen';
import './seguros.css';

const store = makeGameStorage<GameState>('seguros');

export default function SegurosGame() {
  const [state, setState] = useState<GameState | null>(null);
  const [hasSave, setHasSave] = useState(false);

  useEffect(() => { setHasSave(!!store.load()); }, []);

  useEffect(() => {
    if (!state) return;
    if (state.phase === 'debrief') store.clear();
    else store.save(state);
  }, [state]);

  if (!state) {
    return (
      <SetupScreen
        hasSave={hasSave}
        onStart={(cfg: GameConfig) => setState(createInitialState(cfg))}
        onResume={() => { const s = store.load(); if (s) setState(s); }}
      />
    );
  }
  if (state.phase === 'coverage') return <CoverageScreen state={state} setState={setState} />;
  if (state.phase === 'event' || state.phase === 'resolved') return <EventScreen state={state} setState={setState} />;
  return <DebriefScreen state={state} onRestart={() => { store.clear(); setState(null); }} />;
}
