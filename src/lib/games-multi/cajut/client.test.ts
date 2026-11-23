import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createCajutClient, CONNECT_TIMEOUT_MS } from './client';
import type { ServerMsg, ClientMsg } from './types';

// --- Mock partysocket ---
const sentMessages: string[] = [];
const listeners: Record<string, Array<(ev: any) => void>> = {};
const closeFn = vi.fn();

vi.mock('partysocket', () => {
  return {
    default: class FakeSocket {
      constructor(public opts: any) {}
      addEventListener(type: string, fn: (ev: any) => void) {
        (listeners[type] ??= []).push(fn);
      }
      removeEventListener(type: string, fn: (ev: any) => void) {
        listeners[type] = (listeners[type] ?? []).filter((f) => f !== fn);
      }
      send(data: string) {
        sentMessages.push(data);
      }
      close() {
        closeFn();
      }
    },
  };
});

function emit(type: string, payload: any) {
  for (const fn of listeners[type] ?? []) fn(payload);
}

beforeEach(() => {
  sentMessages.length = 0;
  for (const k of Object.keys(listeners)) delete listeners[k];
  closeFn.mockClear();
});

describe('createCajutClient', () => {
  it('serializes ClientMsg to JSON when sending', () => {
    const c = createCajutClient({
      host: 'localhost:1999',
      roomCode: 'A7K2',
      playerId: 'p1',
    });
    const msg: ClientMsg = { type: 'submitAnswer', questionIndex: 0, optionIndex: 1 };
    c.send(msg);
    expect(sentMessages).toEqual([JSON.stringify(msg)]);
  });

  it('on(public) only fires for matching server msg type', () => {
    const c = createCajutClient({ host: 'h', roomCode: 'A7K2', playerId: 'p1' });
    const onPublic = vi.fn();
    const onPrivate = vi.fn();
    c.on('public', onPublic);
    c.on('private', onPrivate);

    const publicMsg: ServerMsg = { type: 'public', state: {} as any };
    emit('message', { data: JSON.stringify(publicMsg) });
    expect(onPublic).toHaveBeenCalledOnce();
    expect(onPrivate).not.toHaveBeenCalled();
  });

  it('on() returns an unsubscribe function', () => {
    const c = createCajutClient({ host: 'h', roomCode: 'A7K2', playerId: 'p1' });
    const fn = vi.fn();
    const unsub = c.on('error', fn);
    emit('message', { data: JSON.stringify({ type: 'error', reason: 'too-many' }) });
    expect(fn).toHaveBeenCalledOnce();
    unsub();
    emit('message', { data: JSON.stringify({ type: 'error', reason: 'nick-taken' }) });
    expect(fn).toHaveBeenCalledOnce();
  });

  it('auto-sends join on `open` if nick + asPlayer provided', () => {
    const c = createCajutClient({
      host: 'h',
      roomCode: 'A7K2',
      playerId: 'p1',
      nick: 'Alice',
    } as any);
    emit('open', {});
    expect(sentMessages).toEqual([JSON.stringify({ type: 'join', nick: 'Alice' })]);
  });

  it('auto-sends join with asHost=true if asHost provided', () => {
    const c = createCajutClient({
      host: 'h',
      roomCode: 'A7K2',
      playerId: 'host-1',
      asHost: true,
    });
    emit('open', {});
    expect(sentMessages.length).toBe(1);
    expect(JSON.parse(sentMessages[0])).toMatchObject({ type: 'join' });
  });

  it('close() invokes underlying socket close', () => {
    const c = createCajutClient({ host: 'h', roomCode: 'A7K2', playerId: 'p1' });
    c.close();
    expect(closeFn).toHaveBeenCalledOnce();
  });

  it('stops reconnecting once the server says the player was kicked', () => {
    // PartySocket reconnects after any close it did not start itself, and on
    // open it would send `join` again with the same nick.
    const c = createCajutClient({ host: 'h', roomCode: 'A7K2', playerId: 'p1', nick: 'Troll' });
    const onKicked = vi.fn();
    c.on('kicked', onKicked);
    emit('message', { data: JSON.stringify({ type: 'kicked' }) });
    expect(onKicked).toHaveBeenCalledOnce();
    expect(closeFn).toHaveBeenCalledOnce();
  });

  describe('connection status', () => {
    beforeEach(() => vi.useFakeTimers());
    afterEach(() => vi.useRealTimers());

    it('reports a timeout when the socket never opens', () => {
      const onStatus = vi.fn();
      createCajutClient({ host: 'h', roomCode: 'A7K2', playerId: 'p1', onStatus });
      vi.advanceTimersByTime(CONNECT_TIMEOUT_MS);
      expect(onStatus).toHaveBeenCalledWith('timeout');
    });

    it('does not time out once connected', () => {
      const onStatus = vi.fn();
      createCajutClient({ host: 'h', roomCode: 'A7K2', playerId: 'p1', onStatus });
      emit('open', {});
      vi.advanceTimersByTime(CONNECT_TIMEOUT_MS * 2);
      expect(onStatus).toHaveBeenCalledOnce();
      expect(onStatus).toHaveBeenCalledWith('connected');
    });

    it('reports close and error events', () => {
      const onStatus = vi.fn();
      createCajutClient({ host: 'h', roomCode: 'A7K2', playerId: 'p1', onStatus });
      emit('error', {});
      emit('close', {});
      expect(onStatus).toHaveBeenCalledWith('error');
      expect(onStatus).toHaveBeenCalledWith('closed');
    });

    it('stops reporting after close()', () => {
      const onStatus = vi.fn();
      const c = createCajutClient({ host: 'h', roomCode: 'A7K2', playerId: 'p1', onStatus });
      c.close();
      vi.advanceTimersByTime(CONNECT_TIMEOUT_MS);
      expect(onStatus).not.toHaveBeenCalled();
    });
  });
});
