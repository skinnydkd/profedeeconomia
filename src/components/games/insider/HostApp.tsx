/** @jsxImportSource preact */
// HostApp.tsx — Root Preact island for the host/projector view at /juegos/insider/host/
// Wide layout intended for classroom projectors.

import { useState, useEffect, useRef } from 'preact/hooks';
import type { PublicState, PrivateState } from '@/lib/games-multi/insider/types';
import { createInsiderClient } from '@/lib/games-multi/insider/client';
import { HostLobby } from './screens/HostLobby';
import { HostGame } from './screens/HostGame';
import { HostFinal } from './screens/HostFinal';
import './insider.css';
import { GameLocaleContext, useGameLocale } from '../locale-context';
import { DEFAULT_LOCALE, type Locale } from '@/i18n/locale';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

function generateRoomCode(): string {
  let code = '';
  for (let i = 0; i < 4; i++) {
    const idx = Math.floor(Math.random() * CODE_ALPHABET.length);
    code += CODE_ALPHABET[idx];
  }
  return code;
}

function getOrCreatePlayerId(): string {
  // Use sessionStorage (tab-scoped) so each tab gets its own id.
  // This prevents host/student id collision when both are open in the same browser.
  if (typeof sessionStorage === 'undefined') return crypto.randomUUID();
  const key = 'pde:multi:playerId';
  let id = sessionStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem(key, id);
  }
  return id;
}

function getRoomCodeFromUrl(): string | null {
  if (typeof window === 'undefined') return null;
  return new URLSearchParams(window.location.search).get('room');
}

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface Props {
  partykitHost: string;
  locale?: Locale;
}

export const COPY = {
  es: {
    reconectando: 'Reconectando…',
    eyebrow: 'Juegos · Multijugador',
    titulo: 'Insider',
    sala: 'Sala',
    conectando: 'Conectando a la sala…',
  },
  ca: {
    reconectando: 'Reconnectant…',
    eyebrow: 'Jocs · Multijugador',
    titulo: 'Insider',
    sala: 'Sala',
    conectando: 'Connectant a la sala…',
  },
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function HostApp({ partykitHost, locale = DEFAULT_LOCALE }: Props) {
  return (
    <GameLocaleContext.Provider value={locale}>
      <HostAppInner partykitHost={partykitHost} />
    </GameLocaleContext.Provider>
  );
}

function HostAppInner({ partykitHost }: { partykitHost: string }) {
  const c = COPY[useGameLocale()];
  const [publicState, setPublicState] = useState<PublicState | null>(null);
  const [privateState, setPrivateState] = useState<PrivateState | null>(null);
  const [connected, setConnected] = useState(false);
  const [roomCode, setRoomCode] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const clientRef = useRef<ReturnType<typeof createInsiderClient> | null>(null);

  useEffect(() => {
    // Determine room code: URL param or generate fresh, then update URL
    let code = getRoomCodeFromUrl();
    if (!code) {
      code = generateRoomCode();
      const url = new URL(window.location.href);
      url.searchParams.set('room', code);
      history.replaceState(null, '', url.toString());
    }
    setRoomCode(code);

    const playerId = getOrCreatePlayerId();

    const host = partykitHost || import.meta.env.PUBLIC_PARTYKIT_HOST || '127.0.0.1:1999';

    const client = createInsiderClient({
      host,
      roomCode: code,
      playerId,
      name: 'Profesor',
      asHost: true,
    });
    clientRef.current = client;

    // Subscribe to state updates
    const unsubPublic = client.on('public', (msg) => setPublicState(msg.state));
    const unsubPrivate = client.on('private', (msg) => setPrivateState(msg.state));
    const unsubError = client.on('error', (msg) => setErrorMsg(msg.reason));

    // Connection state tracking via the underlying PartySocket
    const socket = client.socket;
    const handleOpen = () => setConnected(true);
    const handleClose = () => setConnected(false);
    socket.addEventListener('open', handleOpen);
    socket.addEventListener('close', handleClose);

    return () => {
      unsubPublic();
      unsubPrivate();
      unsubError();
      socket.removeEventListener('open', handleOpen);
      socket.removeEventListener('close', handleClose);
      client.close();
    };
  }, []);

  // Handlers passed to sub-screens
  const handleStartGame = (totalRounds: number, impostorCountOverride?: number) => {
    clientRef.current?.send({ type: 'startGame', totalRounds, impostorCountOverride });
  };

  const handleAdvancePhase = () => {
    clientRef.current?.send({ type: 'advancePhase' });
  };

  const handleRestart = () => {
    clientRef.current?.send({ type: 'restart' });
  };

  // Render
  const phase = publicState?.phase ?? 'lobby';

  return (
    <div class="ins">
      {/* Reconnecting badge */}
      {!connected && publicState !== null && (
        <div class="ins-reconnecting">{c.reconectando}</div>
      )}

      {/* Error notice */}
      {errorMsg && (
        <div class="ins-reconnecting" style="background:var(--terra-soft);border-color:var(--terra);">
          {errorMsg}
        </div>
      )}

      <div class="ins-host-wrap">
        <div class="ins-host">
          {/* Top bar: always visible */}
          <div class="ins-host-top">
            <div class="left">
              <div class="eyebrow">{c.eyebrow}</div>
              <div class="title serif">{c.titulo}</div>
            </div>
            <div class="code">
              <div class="l">{c.sala}</div>
              <div class="v mono">{roomCode ?? '----'}</div>
            </div>
          </div>

          {/* Body: phase-driven screens */}
          {!publicState ? (
            <div class="ins-connecting">{c.conectando}</div>
          ) : phase === 'lobby' ? (
            <HostLobby
              publicState={publicState}
              roomCode={roomCode ?? ''}
              onStart={handleStartGame}
            />
          ) : phase === 'finished' ? (
            <HostFinal
              publicState={publicState}
              onRestart={handleRestart}
            />
          ) : (
            <HostGame
              publicState={publicState}
              privateState={privateState}
              onAdvancePhase={handleAdvancePhase}
            />
          )}
        </div>
      </div>
    </div>
  );
}
