// src/lib/games-multi/cajut/client.ts
// Wrapper tipat sobre partysocket per al joc Cajút.
// Refrega el patró d'Insider (src/lib/games-multi/insider/client.ts).

import PartySocket from 'partysocket';
import type { CajutClientOptions, ClientMsg, ServerMsg } from './types';

export type ConnectionStatus = 'connected' | 'timeout' | 'closed' | 'error';

/** Max wait for the first socket open before telling the user the server is unreachable. */
export const CONNECT_TIMEOUT_MS = 10_000;

interface ExtraOptions {
  nick?: string;
  asHost?: boolean;
  /** Connection health, so the UI can stop saying "connecting" when the server is down. */
  onStatus?: (status: ConnectionStatus) => void;
}

export interface CajutClient {
  send: (msg: ClientMsg) => void;
  on: <T extends ServerMsg['type']>(
    type: T,
    handler: (msg: Extract<ServerMsg, { type: T }>) => void,
  ) => () => void;
  close: () => void;
}

export function createCajutClient(opts: CajutClientOptions & ExtraOptions): CajutClient {
  const socket = new PartySocket({
    host: opts.host,
    party: 'cajut',
    room: opts.roomCode,
    id: opts.playerId,
    query: opts.asHost ? { asHost: '1' } : undefined,
  } as any);

  // Auto-join on open
  let opened = false;
  const timer = setTimeout(() => {
    if (!opened) opts.onStatus?.('timeout');
  }, CONNECT_TIMEOUT_MS);
  const onClose = () => opts.onStatus?.('closed');
  const onError = () => opts.onStatus?.('error');
  socket.addEventListener('close', onClose);
  socket.addEventListener('error', onError);

  const onOpen = () => {
    opened = true;
    clearTimeout(timer);
    opts.onStatus?.('connected');
    if (opts.asHost) {
      send({ type: 'join', nick: '__host__' });
    } else if (opts.nick) {
      send({ type: 'join', nick: opts.nick });
    }
  };
  socket.addEventListener('open', onOpen);

  function send(msg: ClientMsg) {
    socket.send(JSON.stringify(msg));
  }

  const handlers = new Map<string, Set<(msg: any) => void>>();

  const onMessage = (ev: MessageEvent) => {
    let type: ServerMsg['type'] | null = null;
    try {
      const parsed = JSON.parse(typeof ev.data === 'string' ? ev.data : '') as ServerMsg;
      type = parsed.type;
      const set = handlers.get(parsed.type);
      if (set) for (const fn of set) fn(parsed);
    } catch {
      // ignore non-JSON
    }
    // Kicked by the host: closing from this side is what stops PartySocket from
    // reconnecting (and re-joining with the same nick) on its own.
    if (type === 'kicked') socket.close();
  };
  socket.addEventListener('message', onMessage);

  function on<T extends ServerMsg['type']>(
    type: T,
    handler: (msg: Extract<ServerMsg, { type: T }>) => void,
  ): () => void {
    if (!handlers.has(type)) handlers.set(type, new Set());
    handlers.get(type)!.add(handler as any);
    return () => handlers.get(type)!.delete(handler as any);
  }

  function close() {
    clearTimeout(timer);
    socket.removeEventListener('close', onClose);
    socket.removeEventListener('error', onError);
    socket.removeEventListener('open', onOpen);
    socket.removeEventListener('message', onMessage);
    socket.close();
  }

  return { send, on, close };
}
