// src/components/jocs-economics/JocsApp.tsx
import { useState, useEffect } from 'preact/hooks';
import type { PublicQuestion, FinalStats, AnswerResult } from '../../lib/jocs-economics/client/types';
import { api } from '../../lib/jocs-economics/client/api';
import { Welcome } from './screens/Welcome';
import { Playing } from './screens/Playing';
import { Result } from './screens/Result';
import { GameOver } from './screens/GameOver';
import './jocs.css';

const STORAGE_KEY = 'jocs:player';

interface SavedIdentity { name: string; institute: string }

type Phase = 'welcome' | 'playing' | 'result' | 'gameover';

interface GameSession {
  gameId: string;
  token: string;
  currentQuestion: PublicQuestion;
  livesLeft: number;
  score: number;
  questionsAnswered: number;
  timeTotalMs: number;
  questionStartedAtMs: number;
}

interface ResultData {
  result: AnswerResult;
  selectedOptionIdx: number;
}

export default function JocsApp() {
  const [identity, setIdentity] = useState<SavedIdentity | null>(null);
  const [phase, setPhase] = useState<Phase>('welcome');
  const [session, setSession] = useState<GameSession | null>(null);
  const [lastResult, setLastResult] = useState<ResultData | null>(null);
  const [final, setFinal] = useState<FinalStats | null>(null);

  // SSR-safe: only read localStorage in useEffect
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        setIdentity(JSON.parse(raw));
      } catch {
        // ignore malformed data
      }
    }
  }, []);

  function saveIdentity(name: string, institute: string) {
    const i = { name, institute };
    setIdentity(i);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(i)); } catch {}
  }

  async function startGame(name: string, institute: string) {
    saveIdentity(name, institute);
    try {
      const res = await api.start({ playerName: name, institute });
      setSession({
        gameId: res.gameId,
        token: res.token,
        currentQuestion: res.question,
        livesLeft: res.lives,
        score: res.score,
        questionsAnswered: 0,
        timeTotalMs: 0,
        questionStartedAtMs: Date.now(),
      });
      setPhase('playing');
    } catch (err: any) {
      alert(`Error: ${err?.message || 'no es pot iniciar la partida'}`);
    }
  }

  async function submitAnswer(optionIdx: number) {
    if (!session) return;
    const clientElapsedMs = Date.now() - session.questionStartedAtMs;
    try {
      const res = await api.answer({
        gameId: session.gameId,
        token: session.token,
        questionId: session.currentQuestion.id,
        optionIdx,
        clientElapsedMs,
      });
      setLastResult({ result: res.result, selectedOptionIdx: optionIdx });
      if ('finished' in res) {
        setFinal(res.final);
        // Show result 3s then transition to GameOver
        setPhase('result');
        setTimeout(() => setPhase('gameover'), 3000);
      } else {
        setSession({
          ...session,
          currentQuestion: res.nextQuestion,
          livesLeft: res.result.livesLeft,
          score: res.totals.score,
          questionsAnswered: res.totals.questionsAnswered,
          timeTotalMs: res.totals.timeTotalMs,
          questionStartedAtMs: Date.now() + 3000, // applied when transitioning back to playing after 3s
        });
        setPhase('result');
        setTimeout(() => {
          setSession((prev) => prev ? { ...prev, questionStartedAtMs: Date.now() } : prev);
          setPhase('playing');
        }, 3000);
      }
    } catch (err: any) {
      alert(`Error: ${err?.message || 'no es pot enviar la resposta'}`);
    }
  }

  async function endVoluntary() {
    if (!session) return;
    try {
      const res = await api.finish(session.gameId, session.token);
      setFinal(res.final);
      setPhase('gameover');
    } catch (err: any) {
      alert(`Error: ${err?.message || 'no es pot finalitzar'}`);
    }
  }

  function playAgain() {
    if (!identity) return;
    startGame(identity.name, identity.institute);
  }

  if (phase === 'welcome' || !session) {
    return (
      <div class="jocs-app">
        <Welcome initialIdentity={identity} onStart={startGame} />
      </div>
    );
  }

  if (phase === 'playing') {
    return (
      <div class="jocs-app">
        <Playing
          session={session}
          onAnswer={submitAnswer}
          onEnd={endVoluntary}
        />
      </div>
    );
  }

  if (phase === 'result' && lastResult) {
    return (
      <div class="jocs-app">
        <Result
          question={session.currentQuestion}
          result={lastResult.result}
          selectedOptionIdx={lastResult.selectedOptionIdx}
        />
      </div>
    );
  }

  if (phase === 'gameover' && final) {
    return (
      <div class="jocs-app">
        <GameOver final={final} onPlayAgain={playAgain} />
      </div>
    );
  }

  return <div class="jocs-app"><p class="jocs-mute">Carregant…</p></div>;
}
