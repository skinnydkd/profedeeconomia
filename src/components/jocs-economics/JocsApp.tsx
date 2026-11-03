// src/components/jocs-economics/JocsApp.tsx
import { useState, useEffect } from 'preact/hooks';
import type { FinalStats } from '../../lib/jocs-economics/client/types';
import { api } from '../../lib/jocs-economics/client/api';
import { loadJSON, saveJSON } from '../../lib/storage';
import {
  applyAnswer,
  RESULT_SCREEN_MS,
  type GameSession,
  type ResultData,
} from '../../lib/jocs-economics/client/session';
import { Welcome } from './screens/Welcome';
import { Playing } from './screens/Playing';
import { Result } from './screens/Result';
import { GameOver } from './screens/GameOver';
import './jocs.css';

const STORAGE_KEY = 'jocs:player';

interface SavedIdentity { name: string; institute: string }

type Phase = 'welcome' | 'playing' | 'result' | 'gameover';

export default function JocsApp() {
  const [identity, setIdentity] = useState<SavedIdentity | null>(null);
  const [phase, setPhase] = useState<Phase>('welcome');
  const [session, setSession] = useState<GameSession | null>(null);
  const [lastResult, setLastResult] = useState<ResultData | null>(null);
  const [final, setFinal] = useState<FinalStats | null>(null);

  // SSR-safe: only read localStorage in useEffect (blocked or malformed: no saved identity)
  useEffect(() => {
    const saved = loadJSON<SavedIdentity | null>(STORAGE_KEY, null);
    if (saved) setIdentity(saved);
  }, []);

  function saveIdentity(name: string, institute: string) {
    const i = { name, institute };
    setIdentity(i);
    saveJSON(STORAGE_KEY, i);
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
      alert(
        err?.message === 'rate-limited'
          ? 'Se han empezado muchas partidas desde esta red en el último minuto. Espera un momento y vuelve a intentarlo.'
          : `Error: ${err?.message || 'no se puede iniciar la partida'}`,
      );
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
      const outcome = applyAnswer(session, optionIdx, res, Date.now());
      setLastResult(outcome.lastResult);
      if (outcome.kind === 'finished') {
        setFinal(outcome.final);
        // Show result 3s then transition to GameOver
        setPhase('result');
        setTimeout(() => setPhase('gameover'), RESULT_SCREEN_MS);
      } else {
        setSession(outcome.session);
        setPhase('result');
        setTimeout(() => {
          setSession((prev) => prev ? { ...prev, questionStartedAtMs: Date.now() } : prev);
          setPhase('playing');
        }, RESULT_SCREEN_MS);
      }
    } catch (err: any) {
      alert(`Error: ${err?.message || 'no se puede enviar la respuesta'}`);
    }
  }

  async function endVoluntary() {
    if (!session) return;
    try {
      const res = await api.finish(session.gameId, session.token);
      setFinal(res.final);
      setPhase('gameover');
    } catch (err: any) {
      alert(`Error: ${err?.message || 'no se puede finalizar la partida'}`);
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
        {/* The answered question: the session already holds the next one. */}
        <Result {...lastResult} />
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

  return <div class="jocs-app"><p class="jocs-mute">Cargando…</p></div>;
}
