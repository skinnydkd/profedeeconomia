/** @jsxImportSource preact */
// src/components/games/cajut/HostApp.tsx
// Root Preact island for the host/projector view at /juegos/cajut/host/
// Wide layout intended for classroom projectors.
// SSR-safe: sessionStorage reads are deferred to useEffect only.

import { useEffect, useState } from 'preact/hooks';
import { createCajutClient, type CajutClient } from '../../../lib/games-multi/cajut/client';
import type { PublicState, PrivateState, ServerMsg } from '../../../lib/games-multi/cajut/types';
import { HostLanding } from './screens/HostLanding';
import { HostLobby } from './screens/HostLobby';
import { HostQuestion } from './screens/HostQuestion';
import { HostReveal } from './screens/HostReveal';
import { HostLeaderboardMini } from './screens/HostLeaderboardMini';
import { HostFinal } from './screens/HostFinal';
import './cajut.css';
import { GameLocaleContext, useGameLocale } from '../locale-context';
import { DEFAULT_LOCALE, type Locale } from '@/i18n/locale';
import { loadString, saveString } from '@/lib/storage';

interface Props {
  partykitHost: string;
  locale?: Locale;
}

const HOST_ID_KEY = 'pde:cajut:hostId';

type ServerError = Extract<ServerMsg, { type: 'error' }>['reason'];

// Storage may be blocked by the browser: then the id lasts for this page load.
function getOrCreateHostId(): string | null {
  if (typeof window === 'undefined') return null;
  let id = loadString(HOST_ID_KEY, 'session');
  if (!id) {
    id = crypto.randomUUID();
    saveString(HOST_ID_KEY, id, 'session');
  }
  return id;
}

function generateRoomCode(): string {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let s = '';
  for (let i = 0; i < 4; i++) s += alphabet[Math.floor(Math.random() * alphabet.length)];
  return s;
}

export default function HostApp({ partykitHost, locale = DEFAULT_LOCALE }: Props) {
  return (
    <GameLocaleContext.Provider value={locale}>
      <HostAppInner partykitHost={partykitHost} />
    </GameLocaleContext.Provider>
  );
}

function HostAppInner({ partykitHost }: { partykitHost: string }) {
  const locale = useGameLocale();
  const [hostId, setHostId] = useState<string | null>(null);
  const [roomCode, setRoomCode] = useState<string | null>(null);
  const [client, setClient] = useState<CajutClient | null>(null);
  const [publicState, setPublicState] = useState<PublicState | null>(null);
  const [_privateState, setPrivateState] = useState<PrivateState | null>(null);
  // Bank the PartyKit server was deployed with, to compare with the manifest's.
  const [serverBankVersion, setServerBankVersion] = useState<string | null>(null);
  const [startError, setStartError] = useState<ServerError | null>(null);

  // SSR-safe: only read sessionStorage in useEffect
  useEffect(() => {
    setHostId(getOrCreateHostId());
    const url = new URL(window.location.href);
    let code = url.searchParams.get('room');
    if (!code) {
      code = generateRoomCode();
      url.searchParams.set('room', code);
      window.history.replaceState({}, '', url.toString());
    }
    setRoomCode(code);
  }, []);

  // Create the client once we have hostId + roomCode
  useEffect(() => {
    if (!hostId || !roomCode) return;
    const c = createCajutClient({
      host: partykitHost,
      roomCode,
      playerId: hostId,
      asHost: true,
    });
    c.on('public', (m) => setPublicState(m.state));
    c.on('private', (m) => setPrivateState(m.state));
    c.on('hello', (m) => setServerBankVersion(m.bankVersion));
    c.on('error', (m) => setStartError(m.reason));
    setClient(c);
    return () => c.close();
  }, [hostId, roomCode, partykitHost]);

  if (!hostId || !roomCode || !publicState) {
    return <HostLanding roomCode={roomCode} />;
  }

  const phase = publicState.phase;

  if (phase === 'lobby') {
    return (
      <HostLobby
        publicState={publicState}
        serverBankVersion={serverBankVersion}
        startError={startError}
        onClearError={() => setStartError(null)}
        onStart={(asignaturaSlug, unidades, totalQuestions) => {
          setStartError(null);
          // The locale picks the question bank: Valencian under /ca/.
          client?.send({ type: 'startMatch', asignaturaSlug, unidades, totalQuestions, locale });
        }}
        onKick={(playerId) => client?.send({ type: 'kickPlayer', playerId })}
      />
    );
  }
  if (phase === 'question') {
    return (
      <HostQuestion
        publicState={publicState}
        onSkip={() => client?.send({ type: 'skipQuestion' })}
        onEnd={() => client?.send({ type: 'endMatch' })}
        onKick={(playerId) => client?.send({ type: 'kickPlayer', playerId })}
      />
    );
  }
  if (phase === 'reveal') {
    return <HostReveal publicState={publicState} />;
  }
  if (phase === 'leaderboard') {
    return <HostLeaderboardMini publicState={publicState} />;
  }
  return (
    <HostFinal
      publicState={publicState}
      onRestart={() => client?.send({ type: 'restart' })}
    />
  );
}
