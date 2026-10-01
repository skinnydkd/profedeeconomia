import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { loadJSON, saveJSON, removeKey, storageAvailable, loadString, saveString } from './storage';

class FakeStorage {
  private map = new Map<string, string>();
  getItem(k: string) {
    return this.map.has(k) ? this.map.get(k)! : null;
  }
  setItem(k: string, v: string) {
    this.map.set(k, v);
  }
  removeItem(k: string) {
    this.map.delete(k);
  }
  clear() {
    this.map.clear();
  }
  get length() {
    return this.map.size;
  }
  key(i: number) {
    return Array.from(this.map.keys())[i] ?? null;
  }
}

const g = globalThis as { localStorage?: Storage; sessionStorage?: Storage };

describe('storage helpers (with localStorage available)', () => {
  beforeEach(() => {
    g.localStorage = new FakeStorage() as unknown as Storage;
  });
  afterEach(() => {
    delete g.localStorage;
  });

  it('reports availability', () => {
    expect(storageAvailable()).toBe(true);
  });

  it('round-trips a JSON value', () => {
    expect(saveJSON('k', { a: 1, b: [2, 3] })).toBe(true);
    expect(loadJSON('k', null)).toEqual({ a: 1, b: [2, 3] });
  });

  it('returns the fallback for a missing key', () => {
    expect(loadJSON('missing', 'fb')).toBe('fb');
  });

  it('returns the fallback for malformed JSON', () => {
    g.localStorage!.setItem('bad', '{not json');
    expect(loadJSON('bad', 42)).toBe(42);
  });

  it('removes a key', () => {
    saveJSON('k', 1);
    removeKey('k');
    expect(loadJSON('k', 'gone')).toBe('gone');
  });
});

describe('storage helpers (no localStorage / SSR)', () => {
  beforeEach(() => {
    delete g.localStorage;
  });

  it('reports unavailability', () => {
    expect(storageAvailable()).toBe(false);
  });

  it('load returns the fallback', () => {
    expect(loadJSON('whatever', 'fb')).toBe('fb');
  });

  it('save returns false without throwing', () => {
    expect(saveJSON('k', 1)).toBe(false);
  });

  it('remove is a no-op without throwing', () => {
    expect(() => removeKey('k')).not.toThrow();
  });
});

describe('storage helpers (sessionStorage and raw strings)', () => {
  beforeEach(() => {
    g.localStorage = new FakeStorage() as unknown as Storage;
    g.sessionStorage = new FakeStorage() as unknown as Storage;
  });
  afterEach(() => {
    delete g.localStorage;
    delete g.sessionStorage;
  });

  it('keeps the two areas apart', () => {
    expect(saveJSON('k', { tab: 1 }, 'session')).toBe(true);
    expect(loadJSON('k', null, 'session')).toEqual({ tab: 1 });
    expect(loadJSON('k', 'none')).toBe('none');
    removeKey('k', 'session');
    expect(loadJSON('k', 'gone', 'session')).toBe('gone');
  });

  it('round-trips raw strings without JSON quoting', () => {
    expect(saveString('nick', 'Pau', 'local')).toBe(true);
    expect(g.localStorage!.getItem('nick')).toBe('Pau');
    expect(loadString('nick')).toBe('Pau');
    expect(loadString('missing', 'session')).toBeNull();
  });
});

describe('storage helpers (site data blocked by the browser)', () => {
  // With «block all cookies», merely reading window.localStorage throws.
  const blocked = () => {
    throw new DOMException("Failed to read the 'localStorage' property from 'Window'", 'SecurityError');
  };
  beforeEach(() => {
    Object.defineProperty(globalThis, 'localStorage', { get: blocked, configurable: true });
    Object.defineProperty(globalThis, 'sessionStorage', { get: blocked, configurable: true });
  });
  afterEach(() => {
    delete g.localStorage;
    delete g.sessionStorage;
  });

  it('degrades to the fallbacks without throwing', () => {
    expect(storageAvailable()).toBe(false);
    expect(loadJSON('k', 'fb', 'session')).toBe('fb');
    expect(saveJSON('k', 1, 'session')).toBe(false);
    expect(loadString('k')).toBeNull();
    expect(saveString('k', 'v', 'session')).toBe(false);
    expect(() => removeKey('k', 'session')).not.toThrow();
  });
});
