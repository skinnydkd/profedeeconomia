/**
 * SSR-safe localStorage helpers for the interactive islands.
 *
 * Astro renders components on the server, where `localStorage` does not exist,
 * so every access is guarded. All values are JSON-serialised. Failures (quota,
 * privacy mode, malformed data) degrade gracefully to the fallback.
 *
 * Pure-ish: reads `globalThis.localStorage`, which tests can stub.
 */

function getStore(): Storage | null {
  try {
    const s = (globalThis as { localStorage?: Storage }).localStorage;
    return s ?? null;
  } catch {
    // Accessing localStorage can throw in some privacy modes.
    return null;
  }
}

/** Read and parse a JSON value, returning `fallback` on any problem. */
export function loadJSON<T>(key: string, fallback: T): T {
  const store = getStore();
  if (!store) return fallback;
  try {
    const raw = store.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

/** Serialise and store a JSON value. Returns true on success. */
export function saveJSON(key: string, value: unknown): boolean {
  const store = getStore();
  if (!store) return false;
  try {
    store.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

/** Remove a key. No-op when storage is unavailable. */
export function removeKey(key: string): void {
  const store = getStore();
  if (!store) return;
  try {
    store.removeItem(key);
  } catch {
    // ignore
  }
}

/** True when a real localStorage is reachable (client-side, not blocked). */
export function storageAvailable(): boolean {
  return getStore() !== null;
}
