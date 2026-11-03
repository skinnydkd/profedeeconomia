/**
 * SSR-safe localStorage/sessionStorage helpers for the interactive islands.
 *
 * Astro renders components on the server, where `localStorage` does not exist,
 * so every access is guarded. Values are JSON-serialised unless a raw string
 * helper is used. Failures (quota, privacy mode, malformed data) degrade
 * gracefully to the fallback.
 *
 * Pure-ish: reads `globalThis.localStorage` / `globalThis.sessionStorage`,
 * which tests can stub.
 */

export type StorageArea = 'local' | 'session';

/**
 * The browser storage for `area`, or null when there is none (server render)
 * or the browser blocks site data: then reading the property itself throws a
 * SecurityError.
 */
export function browserStorage(area: StorageArea = 'local'): Storage | null {
  try {
    const g = globalThis as { localStorage?: Storage; sessionStorage?: Storage };
    return (area === 'session' ? g.sessionStorage : g.localStorage) ?? null;
  } catch {
    return null;
  }
}

/** Read a raw string, or null when it is missing or storage is unavailable. */
export function loadString(key: string, area: StorageArea = 'local'): string | null {
  const store = browserStorage(area);
  if (!store) return null;
  try {
    return store.getItem(key);
  } catch {
    return null;
  }
}

/** Store a raw string. Returns true on success. */
export function saveString(key: string, value: string, area: StorageArea = 'local'): boolean {
  const store = browserStorage(area);
  if (!store) return false;
  try {
    store.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

/** Read and parse a JSON value, returning `fallback` on any problem. */
export function loadJSON<T>(key: string, fallback: T, area: StorageArea = 'local'): T {
  const raw = loadString(key, area);
  if (raw === null) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

/** Serialise and store a JSON value. Returns true on success. */
export function saveJSON(key: string, value: unknown, area: StorageArea = 'local'): boolean {
  let raw: string;
  try {
    raw = JSON.stringify(value);
  } catch {
    return false;
  }
  return saveString(key, raw, area);
}

/** Remove a key. No-op when storage is unavailable. */
export function removeKey(key: string, area: StorageArea = 'local'): void {
  const store = browserStorage(area);
  if (!store) return;
  try {
    store.removeItem(key);
  } catch {
    // ignore
  }
}

/** True when a real localStorage is reachable (client-side, not blocked). */
export function storageAvailable(): boolean {
  return browserStorage('local') !== null;
}
