import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import type * as Party from 'partykit/server';
import CajutServer from './server';
import { BANK_VERSION, getPool } from './questions';
import type { ClientMsg, PublicState, ServerMsg } from '../../src/lib/games-multi/cajut/types';

// ---- Minimal fake of the PartyKit room and connections the server uses ----
class FakeConn {
  sent: ServerMsg[] = [];
  closed = false;
  constructor(readonly id: string, private readonly room: FakeRoom) {}
  send(raw: string) { this.sent.push(JSON.parse(raw) as ServerMsg); }
  close() { this.closed = true; this.room.conns.delete(this.id); }
  last<T extends ServerMsg['type']>(type: T): Extract<ServerMsg, { type: T }> | undefined {
    return [...this.sent].reverse().find((m): m is Extract<ServerMsg, { type: T }> => m.type === type);
  }
}

class FakeRoom {
  readonly id = 'A7K2';
  conns = new Map<string, FakeConn>();
  private seq = 0;
  getConnection(id: string) { return this.conns.get(id); }
  broadcast(raw: string) { for (const c of this.conns.values()) c.send(raw); }
  open(): FakeConn {
    const c = new FakeConn(`conn-${++this.seq}`, this);
    this.conns.set(c.id, c);
    return c;
  }
}

let room: FakeRoom;
let server: CajutServer;

/** What PartySocket does: connect with ?id= (and asHost), then send `join` on open. */
function connect(playerId: string, opts: { nick?: string; asHost?: boolean } = {}): FakeConn {
  const conn = room.open();
  const url = `https://pde-games.example/parties/cajut/A7K2?id=${playerId}${opts.asHost ? '&asHost=1' : ''}`;
  server.onConnect(conn as unknown as Party.Connection, { request: new Request(url) } as unknown as Party.ConnectionContext);
  if (room.conns.has(conn.id)) {
    send(conn, { type: 'join', nick: opts.asHost ? '__host__' : (opts.nick ?? playerId) });
  }
  return conn;
}

function send(conn: FakeConn, msg: ClientMsg) {
  server.onMessage(JSON.stringify(msg), conn as unknown as Party.Connection);
}

const publicState = (conn: FakeConn): PublicState => conn.last('public')!.state;
const nicks = (conn: FakeConn) => publicState(conn).players.map((p) => p.nick);

beforeEach(() => {
  vi.useFakeTimers();
  room = new FakeRoom();
  server = new CajutServer(room as unknown as Party.Room);
});

afterEach(() => {
  vi.useRealTimers();
});

describe('CajutServer — kicking a player (CODE-SRV-12)', () => {
  it('tells the kicked client to stop and closes its connection', () => {
    const host = connect('host-1', { asHost: true });
    const p1 = connect('p1', { nick: 'Troll' });
    send(host, { type: 'kickPlayer', playerId: 'p1' });
    expect(p1.last('kicked')).toBeDefined();
    expect(p1.closed).toBe(true);
    expect(nicks(host)).toEqual([]);
  });

  it('does not let the kicked player straight back in when its socket reconnects', () => {
    const host = connect('host-1', { asHost: true });
    connect('p1', { nick: 'Troll' });
    send(host, { type: 'kickPlayer', playerId: 'p1' });

    // PartySocket reconnects on its own after a server-side close, with the same id and nick.
    const again = connect('p1', { nick: 'Troll' });
    expect(again.last('kicked')).toBeDefined();
    expect(again.closed).toBe(true);
    expect(nicks(host)).toEqual([]);

    // Other students can still join.
    connect('p2', { nick: 'Ana' });
    expect(nicks(host)).toEqual(['Ana']);
  });

  it('keeps the ban after «restart»', () => {
    const host = connect('host-1', { asHost: true });
    connect('p1', { nick: 'Troll' });
    send(host, { type: 'kickPlayer', playerId: 'p1' });
    send(host, { type: 'restart' });
    const again = connect('p1', { nick: 'Troll' });
    expect(again.closed).toBe(true);
    expect(nicks(host)).toEqual([]);
  });
});

describe('CajutServer — question bank (CODE-SRV-17, CODE-SRV-21)', () => {
  it('tells every connection which bank it was deployed with', () => {
    const host = connect('host-1', { asHost: true });
    expect(host.last('hello')).toEqual({ type: 'hello', bankVersion: BANK_VERSION });
  });

  it('answers the host with empty-pool instead of doing nothing when the units have no questions', () => {
    const host = connect('host-1', { asHost: true });
    connect('p1', { nick: 'Ana' });
    send(host, { type: 'startMatch', asignaturaSlug: 'eco-4eso', unidades: [99], totalQuestions: 10, locale: 'es' });
    expect(host.last('error')).toEqual({ type: 'error', reason: 'empty-pool' });
    expect(publicState(host).phase).toBe('lobby');
  });

  it('plays in the language the host sends', () => {
    const host = connect('host-1', { asHost: true });
    connect('p1', { nick: 'Ana' });
    send(host, { type: 'startMatch', asignaturaSlug: 'eco-4eso', unidades: [1], totalQuestions: 'all', locale: 'ca' });
    const q = publicState(host).currentQuestion;
    expect(q).not.toBeNull();
    const ca = getPool('eco-4eso', [1], 'ca').map((x) => x.enunciado);
    const es = getPool('eco-4eso', [1], 'es').map((x) => x.enunciado);
    expect(ca).toContain(q!.enunciado);
    expect(es).not.toContain(q!.enunciado);
  });

  it('falls back to Spanish for a host that sends no locale', () => {
    const host = connect('host-1', { asHost: true });
    connect('p1', { nick: 'Ana' });
    send(host, { type: 'startMatch', asignaturaSlug: 'eco-4eso', unidades: [1], totalQuestions: 'all' });
    const es = getPool('eco-4eso', [1], 'es').map((x) => x.enunciado);
    expect(es).toContain(publicState(host).currentQuestion!.enunciado);
  });
});
