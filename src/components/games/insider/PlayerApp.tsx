/** @jsxImportSource preact */
// PlayerApp.tsx — Root Preact island for the player/mobile view at /juegos/insider/
// Phone-width layout for students.

import { useState, useEffect, useRef } from 'preact/hooks';
import type { PublicState, PrivateState } from '@/lib/games-multi/insider/types';
import { createInsiderClient } from '@/lib/games-multi/insider/client';
import { PlayerJoin } from './screens/PlayerJoin';
import { PlayerLobby } from './screens/PlayerLobby';
import { PlayerWordOrSilence } from './screens/PlayerWordOrSilence';
import { PlayerVote } from './screens/PlayerVote';
import { PlayerReveal } from './screens/PlayerReveal';
import { PlayerGuess } from './screens/PlayerGuess';
import { PlayerFinal } from './screens/PlayerFinal';
import './insider.css';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getOrCreatePlayerId(): string {
  // Use sessionStorage (tab-scoped) so each tab gets its own id.
  // Prevents id collision when host and player tabs share the same browser.
  if (typeof sessionStorage === 'undefined') return crypto.randomUUID();
  const key = 'pde:multi:playerId';
  let id = sessionStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem(key, id);
  }
  return id;
}

function getSearchParam(key: string): string | null {
  if (typeof window === 'undefined') return null;
  return new URLSearchParams(window.location.search).get(key);
}

function getStoredName(): string {
  if (typeof localStorage === 'undefined') return '';
  return localStorage.getItem('pde:multi:playerName') ?? '';
}

function storePlayerName(name: string) {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('pde:multi:playerName', name);
  }
}

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface Props {
  partykitHost: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function PlayerApp({ partykitHost }: Props) {
  const [publicState, setPublicState] = useState<PublicState | null>(null);
  const [privateState, setPrivateState] = useState<PrivateState | null>(null);
  const [connected, setConnected] = useState(false);
  const [roomCode, setRoomCode] = useState<string | null>(null);
  const [playerName, setPlayerName] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const clientRef = useRef<ReturnType<typeof createInsiderClient> | null>(null);

  useEffect(() => {
    // Read room code and player name from URL/localStorage (client-only)
    const code = getSearchParam('room');
    const nameFromUrl = getSearchParam('name');
    const storedName = getStoredName();
    const name = nameFromUrl ?? storedName;

    setRoomCode(code);
    setPlayerName(name);

    if (!code || !name) {
      // No room code or no name — stay on join screen, don't connect
      return;
    }

    // Persist name for reconnects
    storePlayerName(name);

    const playerId = getOrCreatePlayerId();
    const host = partykitHost || import.meta.env.PUBLIC_PARTYKIT_HOST || '127.0.0.1:1999';

    const client = createInsiderClient({
      host,
      roomCode: code,
      playerId,
      name,
      asHost: false,
    });
    clientRef.current = client;

    const unsubPublic = client.on('public', (msg) => setPublicState(msg.state));
    const unsubPrivate = client.on('private', (msg) => setPrivateState(msg.state));
    const unsubError = client.on('error', (msg) => setErrorMsg(msg.reason));

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

  // Join handler: redirect to same page with query params
  const handleJoin = (name: string, code: string) => {
    storePlayerName(name);
    const url = new URL(window.location.href);
    url.searchParams.set('room', code.toUpperCase());
    url.searchParams.set('name', name);
    window.location.href = url.toString();
  };

  // Vote handler
  const handleVote = (targetId: string) => {
    clientRef.current?.send({ type: 'vote', targetId });
  };

  // Guess handler
  const handleGuess = (word: string) => {
    clientRef.current?.send({ type: 'guess', word });
  };

  // If no room code OR no name — show join screen
  if (!roomCode || !playerName) {
    return (
      <div class="ins">
        <div class="ins-player-wrap">
          <PlayerJoin onJoin={handleJoin} />
        </div>
      </div>
    );
  }

  const phase = publicState?.phase ?? 'lobby';
  const myId = privateState?.myId ?? '';

  return (
    <div class="ins">
      {/* Reconnecting badge */}
      {!connected && publicState !== null && (
        <div class="ins-reconnecting">Reconectando…</div>
      )}

      {/* Error notice */}
      {errorMsg && (
        <div class="ins-reconnecting" style="background:var(--terra-soft);border-color:var(--terra);">
          {errorMsg}
        </div>
      )}

      <div class="ins-player-wrap">
        <div class="ins-phone-card">
          {/* Top status bar */}
          <div class="ins-phone-top-bar">
            <div class="me">
              <span
                class={`av${privateState?.role === 'impostor' ? ' impostor' : ''}`}
              />
              {playerName}
            </div>
            <div>Sala {roomCode}</div>
          </div>

          {/* Body: phase-driven content */}
          {!publicState ? (
            <div class="ins-connecting">Conectando…</div>
          ) : (
            <div class="ins-phone-body">
              {phase === 'lobby' && (
                <PlayerLobby
                  publicState={publicState}
                  roomCode={roomCode}
                  playerName={playerName}
                />
              )}
              {(phase === 'show_word' || phase === 'discussion') && (
                <PlayerWordOrSilence
                  publicState={publicState}
                  privateState={privateState}
                  playerName={playerName}
                />
              )}
              {phase === 'voting' && (
                <PlayerVote
                  publicState={publicState}
                  privateState={privateState}
                  myId={myId}
                  onVote={handleVote}
                />
              )}
              {phase === 'reveal' && (
                <PlayerReveal
                  publicState={publicState}
                  privateState={privateState}
                />
              )}
              {phase === 'guess' && (
                <PlayerGuess
                  publicState={publicState}
                  privateState={privateState}
                  onGuess={handleGuess}
                />
              )}
              {phase === 'finished' && (
                <PlayerFinal
                  publicState={publicState}
                  privateState={privateState}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
