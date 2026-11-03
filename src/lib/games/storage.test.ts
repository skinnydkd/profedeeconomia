// src/lib/games/storage.test.ts
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
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

describe('game storage when the browser blocks site data', () => {
  // Chromium with «block all cookies»: reading window.localStorage throws.
  const g = globalThis as { localStorage?: Storage };
  beforeEach(() => {
    Object.defineProperty(globalThis, 'localStorage', {
      get() {
        throw new DOMException("Failed to read the 'localStorage' property from 'Window'", 'SecurityError');
      },
      configurable: true,
    });
  });
  afterEach(() => {
    delete g.localStorage;
  });

  it('can still be created at module level and behaves as empty', () => {
    // The game islands create their store when the module is evaluated.
    const s = makeGameStorage('stonks');
    expect(s.load()).toBeNull();
    expect(() => s.save({ round: 1 })).not.toThrow();
    expect(() => s.clear()).not.toThrow();
    expect(s.getBest()).toBe(0);
    expect(() => s.setBest(10)).not.toThrow();
  });
});

describe('game storage with a failing backend', () => {
  it('swallows quota and access errors', () => {
    const failing = {
      getItem: () => { throw new DOMException('denied', 'SecurityError'); },
      setItem: () => { throw new DOMException('full', 'QuotaExceededError'); },
      removeItem: () => { throw new DOMException('denied', 'SecurityError'); },
    } as unknown as Storage;
    const s = makeGameStorage('econrisk', failing);
    expect(s.load()).toBeNull();
    expect(() => s.save({ round: 1 })).not.toThrow();
    expect(() => s.clear()).not.toThrow();
    expect(s.getBest()).toBe(0);
    expect(() => s.setBest(10)).not.toThrow();
  });
});
