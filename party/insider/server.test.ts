import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import type * as Party from 'partykit/server';
import InsiderServer from './server';
import type { GameState } from './state';
import { MAX_PLAYERS, TIMER_GUESS_S } from './constants';
import type { ClientMsg, ServerMsg } from '../../src/lib/games-multi/insider/types';

// ---- Minimal fake of the PartyKit room and connections the server uses ----
class FakeConn {
  sent: ServerMsg[] = [];
  state: unknown = null;
  constructor(readonly id: string, private readonly room: FakeRoom) {}
  send(raw: string) { this.sent.push(JSON.parse(raw) as ServerMsg); }
  setState(s: unknown) { this.state = s; return s; }
  close() { this.room.conns.delete(this.id); }
  errors() { return this.sent.filter((m): m is Extract<ServerMsg, { type: 'error' }> => m.type === 'error').map((m) => m.reason); }
}

class FakeRoom {
  readonly id = 'K7P2';
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
let server: InsiderServer;
const game = () => (server as unknown as { state: GameState }).state;

async function send(conn: FakeConn, msg: ClientMsg | Record<string, unknown>) {
  await server.onMessage(JSON.stringify(msg), conn as unknown as Party.Connection);
}

/** What the Insider client does: connect with ?playerId&name&asHost, then send `join` on open. */
async function connect(playerId: string, name: string, asHost = false): Promise<FakeConn> {
  const conn = room.open();
  const q = new URLSearchParams({ playerId, name, asHost: asHost ? '1' : '0' });
  await server.onConnect(
    conn as unknown as Party.Connection,
    { request: new Request(`https://pde-games.example/parties/insider/K7P2?${q}`) } as Party.ConnectionContext,
  );
  await send(conn, { type: 'join', name, playerId, asHost });
  return conn;
}

/** Four students vote out the impostor, which opens the impostor's guess. */
async function reachGuessPhase() {
  const host = await connect('host', 'Profesor', true);
  const players = new Map<string, FakeConn>();
  for (const id of ['p1', 'p2', 'p3', 'p4']) players.set(id, await connect(id, `Alumno ${id}`));
  await send(host, { type: 'startGame', totalRounds: 1 });
  await send(host, { type: 'advancePhase' }); // show_word → discussion
  await send(host, { type: 'advancePhase' }); // discussion → voting
  const [impostor] = [...game().impostors];
  const someoneElse = [...players.keys()].find((id) => id !== impostor)!;
  for (const [id, conn] of players) await send(conn, { type: 'vote', targetId: id === impostor ? someoneElse : impostor });
  expect(game().phase).toBe('guess');
  return { host, impostorConn: players.get(impostor)! };
}

beforeEach(() => {
  vi.useFakeTimers();
  room = new FakeRoom();
  server = new InsiderServer(room as unknown as Party.Room);
});

afterEach(() => {
  vi.useRealTimers();
});

describe('InsiderServer — guess phase (CODE-SRV-13)', () => {
  it('a malformed guess from the caught impostor does not freeze the room', async () => {
    const { impostorConn } = await reachGuessPhase();
    // Used to throw inside applyGuess after the guess timer had been cleared.
    await send(impostorConn, { type: 'guess', word: 42 });
    expect(impostorConn.errors()).toContain('invalid-message');
    expect(game().phase).toBe('guess');
    // The guess timer is still there and closes the phase.
    vi.advanceTimersByTime(TIMER_GUESS_S * 1000);
    expect(game().phase).toBe('reveal');
  });

  it('the host can close the guess phase', async () => {
    const { host } = await reachGuessPhase();
    await send(host, { type: 'advancePhase' });
    expect(host.errors()).toEqual([]);
    expect(game().phase).toBe('reveal');
  });
});

describe('InsiderServer — joining (CODE-SRV-13)', () => {
  it('one connection registers one player, whatever ids its join messages carry', async () => {
    await connect('host', 'Profesor', true);
    const p1 = await connect('p1', 'Ana');
    for (let i = 0; i < 50; i++) await send(p1, { type: 'join', name: `Bot ${i}`, playerId: `bot-${i}` });
    await send(p1, { type: 'join', name: 'x'.repeat(1000), playerId: 'bot-long' });
    expect(Object.keys(game().players)).toEqual(['p1']);
    expect(game().players.p1.name).toBe('Ana');
    expect(p1.errors()).toContain('invalid-message');
    expect(p1.errors()).toContain('invalid-name');
  });

  it(`caps the room at ${MAX_PLAYERS} students and still lets them reconnect`, async () => {
    await connect('host', 'Profesor', true);
    for (let i = 0; i < MAX_PLAYERS; i++) await connect(`p${i}`, `Alumno ${i}`);
    const late = await connect('late', 'Tarde');
    expect(late.errors()).toContain('room-full');
    expect(Object.keys(game().players)).toHaveLength(MAX_PLAYERS);

    // A student already in the room gets back in after losing the connection.
    const again = await connect('p0', 'Alumno p0');
    expect(again.errors()).toEqual([]);
    expect(again.sent.some((m) => m.type === 'private' && m.state.myId === 'p0')).toBe(true);
  });

  it('does not register a name longer than the join form allows', async () => {
    await connect('host', 'Profesor', true);
    const p = await connect('p1', 'x'.repeat(1000));
    expect(game().players.p1).toBeUndefined();
    expect(p.errors()).toContain('invalid-name');
  });
});
