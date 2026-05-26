// Typed partysocket wrapper for Insider multiplayer game (Task 6)
//
// Auto-reconnect: PartySocket (which extends ReconnectingWebSocket) reconnects by default.
// No additional reconnect logic needed — the server handles re-joining via playerId.
//
// Usage:
//   const client = createInsiderClient({ host, roomCode, playerId, name, asHost: true });
//   const unsub = client.on('public', (msg) => setState(msg.state));
//   client.send({ type: 'startGame', totalRounds: 5 });
//   // on unmount:
//   unsub();
//   client.close();

import PartySocket from 'partysocket';
import type { ClientMsg, ServerMsg, PublicState, PrivateState } from './types';

export interface InsiderClientOptions {
  host: string;
  roomCode: string;
  playerId: string;
  name: string;
  asHost?: boolean;
}

export interface InsiderClient {
  /** Send a typed ClientMsg to the server. */
  send(msg: ClientMsg): void;
  /**
   * Subscribe to a specific ServerMsg type.
   * Returns an unsubscribe function.
   */
  on<T extends ServerMsg['type']>(
    type: T,
    handler: (msg: Extract<ServerMsg, { type: T }>) => void,
  ): () => void;
  /** Close the WebSocket connection. */
  close(): void;
  /** Expose the underlying PartySocket for advanced use (e.g., readyState checks). */
  socket: PartySocket;
}

export function createInsiderClient(opts: InsiderClientOptions): InsiderClient {
  const query: Record<string, string> = {
    playerId: opts.playerId,
    name: opts.name,
    asHost: opts.asHost ? '1' : '0',
  };

  const ws = new PartySocket({
    host: opts.host,
    party: 'insider',
    room: opts.roomCode,
    query,
  });

  // Listener registry: type → Set of handlers
  const listeners = new Map<ServerMsg['type'], Set<(msg: ServerMsg) => void>>();

  // Dispatch incoming messages to registered handlers
  ws.addEventListener('message', (e: MessageEvent<string>) => {
    let msg: ServerMsg;
    try {
      msg = JSON.parse(e.data) as ServerMsg;
    } catch {
      return;
    }
    const set = listeners.get(msg.type);
    if (set) {
      for (const handler of set) {
        handler(msg);
      }
    }
  });

  // On open (and on reconnect), auto-send join so the server re-registers this connection.
  // PartySocket fires 'open' on every (re)connect, so this covers both initial join and reconnect.
  ws.addEventListener('open', () => {
    const joinMsg: ClientMsg = {
      type: 'join',
      name: opts.name,
      playerId: opts.playerId,
      asHost: opts.asHost ?? false,
    };
    ws.send(JSON.stringify(joinMsg));
  });

  return {
    send(msg: ClientMsg): void {
      ws.send(JSON.stringify(msg));
    },

    on<T extends ServerMsg['type']>(
      type: T,
      handler: (msg: Extract<ServerMsg, { type: T }>) => void,
    ): () => void {
      let set = listeners.get(type);
      if (!set) {
        set = new Set<(msg: ServerMsg) => void>();
        listeners.set(type, set);
      }
      // Cast: safe because we only call this handler when msg.type === T
      const typedHandler = handler as unknown as (msg: ServerMsg) => void;
      set.add(typedHandler);
      return () => {
        set!.delete(typedHandler);
      };
    },

    close(): void {
      ws.close();
    },

    socket: ws,
  };
}

// Re-export state types for convenience — consumers can import from one place.
export type { PublicState, PrivateState, ClientMsg, ServerMsg };
