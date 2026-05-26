/** @jsxImportSource preact */
// src/components/games/cajut/HostApp.tsx
// Root Preact island for the host/projector view at /juegos/cajut/host/
// Wide layout intended for classroom projectors.
// SSR-safe: sessionStorage reads are deferred to useEffect only.

import { useEffect, useState } from 'preact/hooks';
import { createCajutClient, type CajutClient } from '../../../lib/games-multi/cajut/client';
import type { PublicState, PrivateState } from '../../../lib/games-multi/cajut/types';
import { HostLanding } from './screens/HostLanding';
import { HostLobby } from './screens/HostLobby';
import { HostQuestion } from './screens/HostQuestion';
import { HostReveal } from './screens/HostReveal';
import { HostLeaderboardMini } from './screens/HostLeaderboardMini';
import { HostFinal } from './screens/HostFinal';
import './cajut.css';

interface Props {
  partykitHost: string;
}

const HOST_ID_KEY = 'pde:cajut:hostId';

function getOrCreateHostId(): string | null {
  if (typeof window === 'undefined') return null;
  let id = sessionStorage.getItem(HOST_ID_KEY);
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem(HOST_ID_KEY, id);
  }
  return id;
}

function generateRoomCode(): string {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let s = '';
  for (let i = 0; i < 4; i++) s += alphabet[Math.floor(Math.random() * alphabet.length)];
  return s;
}

export default function HostApp({ partykitHost }: Props) {
  const [hostId, setHostId] = useState<string | null>(null);
  const [roomCode, setRoomCode] = useState<string | null>(null);
  const [client, setClient] = useState<CajutClient | null>(null);
  const [publicState, setPublicState] = useState<PublicState | null>(null);
  const [_privateState, setPrivateState] = useState<PrivateState | null>(null);

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
        onStart={(asignaturaSlug, unidades, totalQuestions) =>
          client?.send({ type: 'startMatch', asignaturaSlug, unidades, totalQuestions })
        }
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
