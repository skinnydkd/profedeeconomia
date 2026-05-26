// src/lib/games-multi/cajut/client.ts
// Wrapper tipat sobre partysocket per al joc Cajút.
// Refrega el patró d'Insider (src/lib/games-multi/insider/client.ts).

import PartySocket from 'partysocket';
import type { CajutClientOptions, ClientMsg, ServerMsg } from './types';

interface ExtraOptions {
  nick?: string;
  asHost?: boolean;
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
  const onOpen = () => {
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
    try {
      const parsed = JSON.parse(typeof ev.data === 'string' ? ev.data : '') as ServerMsg;
      const set = handlers.get(parsed.type);
      if (set) for (const fn of set) fn(parsed);
    } catch {
      // ignore non-JSON
    }
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
    socket.removeEventListener('open', onOpen);
    socket.removeEventListener('message', onMessage);
    socket.close();
  }

  return { send, on, close };
}
