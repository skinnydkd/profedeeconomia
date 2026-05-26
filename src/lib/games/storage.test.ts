// src/lib/games/storage.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { makeGameStorage } from './storage';

function memoryStorage(): Storage {
  const m = new Map<string, string>();
  return {
    getItem: (k) => (m.has(k) ? m.get(k)! : null),
    setItem: (k, v) => void m.set(k, v),
    removeItem: (k) => void m.delete(k),
    clear: () => m.clear(),
    key: (i) => [...m.keys()][i] ?? null,
    get length() { return m.size; },
  } as Storage;
}

describe('game storage', () => {
  let store: ReturnType<typeof makeGameStorage>;
  beforeEach(() => { store = makeGameStorage('stonks', memoryStorage()); });

  it('saves and loads state', () => {
    expect(store.load()).toBeNull();
    store.save({ round: 3 });
    expect(store.load()).toEqual({ round: 3 });
  });

  it('clears state', () => {
    store.save({ round: 1 });
    store.clear();
    expect(store.load()).toBeNull();
  });

  it('tracks best score (max wins)', () => {
    expect(store.getBest()).toBe(0);
    store.setBest(100);
    store.setBest(50);
    expect(store.getBest()).toBe(100);
  });

  it('survives corrupt JSON', () => {
    const raw = memoryStorage();
    raw.setItem('pde:game:stonks:state', '{not json');
    const s = makeGameStorage('stonks', raw);
    expect(s.load()).toBeNull();
  });
});
