// src/components/games/cajut/PlayerApp.tsx
import { useEffect, useState } from 'preact/hooks';
import { createCajutClient, type CajutClient } from '../../../lib/games-multi/cajut/client';
import type { PublicState, PrivateState } from '../../../lib/games-multi/cajut/types';
import { PlayerJoin } from './screens/PlayerJoin';
import { PlayerName } from './screens/PlayerName';
import { PlayerWaiting } from './screens/PlayerWaiting';
import { PlayerAnswer } from './screens/PlayerAnswer';
import { PlayerWaitOthers } from './screens/PlayerWaitOthers';
import { PlayerRevealLocal } from './screens/PlayerRevealLocal';
import { PlayerLeaderboardMini } from './screens/PlayerLeaderboardMini';
import { PlayerFinal } from './screens/PlayerFinal';
import './cajut.css';
import { GameLocaleContext, useGameLocale } from '../locale-context';
import { DEFAULT_LOCALE, type Locale } from '@/i18n/locale';

interface Props { partykitHost: string; locale?: Locale; }

const PLAYER_ID_KEY = 'pde:cajut:playerId';
const NICK_KEY = 'pde:cajut:nick';

function getOrCreatePlayerId(): string | null {
  if (typeof window === 'undefined') return null;
  let id = sessionStorage.getItem(PLAYER_ID_KEY);
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem(PLAYER_ID_KEY, id);
  }
  return id;
}

export const COPY = {
  es: {
    backToJoin: 'Volver a entrar',
    connecting: 'Conectando…',
    errorGeneric: 'Ha ocurrido un error.',
    errors: {
      'invalid-nick': 'El nick no es válido.',
      'nick-taken': 'Ya hay un alumno con ese nick.',
      'already-joined': 'Ya estás en la sala.',
      'too-many': 'Esta sala ya tiene 40 jugadores.',
      'match-started': 'La partida ya ha comenzado. Espera la próxima.',
      'room-not-found': 'Este código de sala no existe.',
    } as Record<string, string>,
  },
  ca: {
    backToJoin: 'Torna a entrar',
    connecting: 'Connectant…',
    errorGeneric: "S'ha produït un error.",
    errors: {
      'invalid-nick': 'El nick no és vàlid.',
      'nick-taken': 'Ja hi ha un alumne amb eixe nick.',
      'already-joined': 'Ja estàs a la sala.',
      'too-many': 'Esta sala ja té 40 jugadors.',
      'match-started': 'La partida ja ha començat. Espera la pròxima.',
      'room-not-found': 'Este codi de sala no existix.',
    } as Record<string, string>,
  },
};

export default function PlayerApp({ partykitHost, locale = DEFAULT_LOCALE }: Props) {
  return (
    <GameLocaleContext.Provider value={locale}>
      <PlayerAppInner partykitHost={partykitHost} />
    </GameLocaleContext.Provider>
  );
}

function PlayerAppInner({ partykitHost }: { partykitHost: string }) {
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [roomCode, setRoomCode] = useState<string | null>(null);
  const [nick, setNick] = useState<string | null>(null);
  const [client, setClient] = useState<CajutClient | null>(null);
  const [publicState, setPublicState] = useState<PublicState | null>(null);
  const [privateState, setPrivateState] = useState<PrivateState | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const copy = COPY[useGameLocale()];

  // SSR-safe: all storage/URL reads deferred to useEffect
  useEffect(() => {
    setPlayerId(getOrCreatePlayerId());
    const url = new URL(window.location.href);
    const code = url.searchParams.get('room');
    if (code) setRoomCode(code.toUpperCase());
    const savedNick = localStorage.getItem(NICK_KEY);
    if (savedNick) setNick(savedNick);
  }, []);

  // Create client only when playerId + roomCode + nick are all available
  useEffect(() => {
    if (!playerId || !roomCode || !nick) return;
    const c = createCajutClient({
      host: partykitHost,
      roomCode,
      playerId,
      nick,
    });
    c.on('public', (m) => setPublicState(m.state));
    c.on('private', (m) => setPrivateState(m.state));
    c.on('error', (m) => setErrorMsg(reasonToMessage(m.reason, copy)));
    setClient(c);
    return () => c.close();
  }, [playerId, roomCode, nick, partykitHost, copy]);

  // --- Routing ---

  if (!roomCode) {
    return (
      <PlayerJoin
        onSubmit={(code) => {
          const url = new URL(window.location.href);
          url.searchParams.set('room', code.toUpperCase());
          window.history.replaceState({}, '', url.toString());
          setRoomCode(code.toUpperCase());
        }}
      />
    );
  }

  if (!nick) {
    return (
      <PlayerName
        onSubmit={(n) => {
          localStorage.setItem(NICK_KEY, n);
          setNick(n);
        }}
      />
    );
  }

  if (errorMsg) {
    return (
      <div class="cajut-player" style={{ justifyContent: 'center', textAlign: 'center' }}>
        <p style={{ color: 'var(--cajut-terracota)', fontSize: 16 }}>{errorMsg}</p>
        <button
          onClick={() => {
            setErrorMsg(null);
            setNick(null);
            localStorage.removeItem(NICK_KEY);
          }}
          style={{
            marginTop: 16,
            padding: '10px 20px',
            border: '1px solid var(--cajut-line)',
            borderRadius: 6,
            background: 'var(--cajut-paper)',
            fontSize: 14,
            cursor: 'pointer',
          }}
        >
          {copy.backToJoin}
        </button>
      </div>
    );
  }

  if (!publicState || !privateState) {
    return (
      <div class="cajut-player" style={{ justifyContent: 'center', textAlign: 'center' }}>
        <p class="subtle">{copy.connecting}</p>
      </div>
    );
  }

  const phase = publicState.phase;
  const myAnswered =
    publicState.players.find((p) => p.id === privateState.myId)?.hasAnswered ?? false;

  if (phase === 'lobby') {
    return <PlayerWaiting publicState={publicState} privateState={privateState} />;
  }
  if (phase === 'question') {
    if (myAnswered) {
      return <PlayerWaitOthers publicState={publicState} />;
    }
    return (
      <PlayerAnswer
        publicState={publicState}
        onAnswer={(optionIndex) => {
          const q = publicState.currentQuestion!;
          client?.send({ type: 'submitAnswer', questionIndex: q.index, optionIndex });
        }}
      />
    );
  }
  if (phase === 'reveal') {
    return <PlayerRevealLocal publicState={publicState} privateState={privateState} />;
  }
  if (phase === 'leaderboard') {
    return <PlayerLeaderboardMini publicState={publicState} privateState={privateState} />;
  }
  // final
  return <PlayerFinal publicState={publicState} privateState={privateState} />;
}

function reasonToMessage(reason: string, copy: (typeof COPY)['es']): string {
  return copy.errors[reason] ?? copy.errorGeneric;
}
