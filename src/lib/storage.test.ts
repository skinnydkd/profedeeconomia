import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { loadJSON, saveJSON, removeKey, storageAvailable } from './storage';

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

const g = globalThis as { localStorage?: Storage };

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
