/** @jsxImportSource preact */
import { useState, useEffect } from 'preact/hooks';
import type { GameState } from '@/lib/games/stonks/types';
import {
  createInitialState, advanceSemester, availableAssets,
  currentYear, currentHalf, netWorth,
} from '@/lib/games/stonks/engine';
import { CLASS_CARD_ID } from '@/lib/games/stonks/data/cards';
import { makeGameStorage } from '@/lib/games/storage';
import { ALLOCATION_MAX } from '@/lib/games/stonks/data';
import { StartScreen } from './StartScreen';
import { WindowIntro } from './WindowIntro';
import { NewsScreen } from './NewsScreen';
import { AllocateScreen } from './AllocateScreen';
import { AssetCardModal } from './AssetCardModal';
import { ResultScreen } from './ResultScreen';
import { RevealScreen } from './RevealScreen';
import { FinalScreen } from './FinalScreen';
import { GameLocaleContext } from '../locale-context';
import { DEFAULT_LOCALE, type Locale } from '@/i18n/locale';
import './stonks.css';

// Root Preact island — game UI state machine.
//
//   start → (Empezar)    → intro
//   intro → (Empezar)    → news
//   news  → (Invertir)   → allocate   [+ any unseen asset cards queue up here]
//   allocate → (Confirmar) → advanceSemester → results | reveal (after 50)
//   results → (Siguiente) → news
//   reveal  → (Ver resultado) → finished
//   finished → (Jugar otra vez) → intro (fresh window)

const store = makeGameStorage<GameState>('stonks');

export default function StonksGame({ locale = DEFAULT_LOCALE }: { locale?: Locale }) {
  return (
    <GameLocaleContext.Provider value={locale}>
      <StonksGameInner />
    </GameLocaleContext.Provider>
  );
}

/**
 * Cards the player has not seen yet for the assets on this semester's board.
 * The shared "buying one company" card jumps the queue the first time any
 * company appears, because it is the context the profile cards assume.
 */
function pendingCards(s: GameState): string[] {
  const seen = new Set(s.seenCards);
  const board = availableAssets(s);
  const queue: string[] = [];
  if (board.some((a) => a.group === 'empresa') && !seen.has(CLASS_CARD_ID)) {
    queue.push(CLASS_CARD_ID);
  }
  for (const a of board) if (!seen.has(a.id)) queue.push(a.id);
  return queue;
}

function StonksGameInner() {
  // Initialized unconditionally (never reading storage during server render)
  // to avoid an SSR/client hydration mismatch — mirrors QuizPlayer pattern.
  const [state, setState] = useState<GameState>(createInitialState);
  const [hasSave, setHasSave] = useState(false);
  const [cardQueue, setCardQueue] = useState<string[]>([]);

  useEffect(() => {
    const saved = store.load();
    // Saves written before the replant have no window and cannot be migrated;
    // resuming one would silently deal a different 25 years (design spec §13).
    setHasSave(!!saved && typeof saved.startYear === 'number' && Array.isArray(saved.stocks));
  }, []);

  useEffect(() => {
    if (state.phase === 'finished') {
      store.setBest(netWorth(state));
      store.clear();
      setHasSave(false);
    } else if (state.phase !== 'start') {
      store.save(state);
    }
  }, [state]);

  // Transitions ----------------------------------------------------------------

  const start = () => {
    setHasSave(false);
    setState({ ...createInitialState(), phase: 'intro' });
  };

  const cont = () => {
    const saved = store.load();
    if (saved && typeof saved.startYear === 'number') setState(saved);
  };

  const toNews = () => setState((s) => ({ ...s, phase: 'news' }));

  const toAllocate = () =>
    setState((s) => {
      setCardQueue(pendingCards(s));
      return { ...s, phase: 'allocate' };
    });

  const change = (id: string, delta: number) =>
    setState((s) => {
      const current = s.allocation[id as keyof typeof s.allocation] || 0;
      const next = Math.max(0, Math.min(ALLOCATION_MAX, current + delta));
      return { ...s, allocation: { ...s.allocation, [id]: next } };
    });

  const openCard = (id: string) => setCardQueue((q) => (q.includes(id) ? q : [id, ...q]));

  const closeCard = () =>
    setCardQueue((q) => {
      const [shown, ...rest] = q;
      if (shown) setState((s) => ({ ...s, seenCards: [...new Set([...s.seenCards, shown])] }));
      return rest;
    });

  const confirm = () => setState((s) => advanceSemester(s));

  const next = () => setState((s) => (s.phase === 'results' ? { ...s, phase: 'news' } : s));

  const toFinished = () => setState((s) => ({ ...s, phase: 'finished' }));

  const restart = () => setState({ ...createInitialState(), phase: 'intro' });

  // Render --------------------------------------------------------------------

  return (
    <div class="sk">
      {state.phase === 'start' && (
        <StartScreen hasSave={hasSave} onStart={start} onContinue={cont} />
      )}
      {state.phase === 'intro' && (
        <WindowIntro startYear={state.startYear} onContinue={toNews} />
      )}
      {state.phase === 'news' && (
        <NewsScreen
          year={currentYear(state)}
          half={currentHalf(state)}
          onContinue={toAllocate}
        />
      )}
      {state.phase === 'allocate' && (
        <AllocateScreen
          state={state}
          onChange={change}
          onOpenCard={openCard}
          onConfirm={confirm}
        />
      )}
      {state.phase === 'results' && <ResultScreen state={state} onNext={next} />}
      {state.phase === 'reveal' && <RevealScreen state={state} onContinue={toFinished} />}
      {state.phase === 'finished' && <FinalScreen state={state} onRestart={restart} />}

      {cardQueue.length > 0 && state.phase === 'allocate' && (
        <AssetCardModal id={cardQueue[0]} onClose={closeCard} />
      )}
    </div>
  );
}
