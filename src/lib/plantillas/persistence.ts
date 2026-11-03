/** @jsxImportSource preact */
import { useEffect, useState } from 'preact/hooks';
import { loadJSON, saveJSON } from '@/lib/storage';

/**
 * State backed by localStorage under `key`. SSR-safe: the storage helpers guard
 * for the absence of `window` and degrade to the in-memory value.
 *
 * The first render always uses `initial`, like the server render: the islands
 * hydrate, and Preact does not patch input values while hydrating, so reading
 * storage there left the fields empty while the state already held the saved
 * data (and the next keystroke wrote over it). The saved value is loaded after
 * mount instead, as UnitNotes does, and nothing is written until it has been,
 * so `initial` never replaces what the teacher saved.
 */
export function usePersistentState<T>(key: string, initial: T): [T, (v: T) => void] {
  const [value, setValue] = useState<T>(initial);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    setValue(loadJSON<T>(key, initial));
    setLoaded(true);
    // `initial` is only the fallback for a missing key: callers may pass a
    // fresh object on every render, and reloading on it would drop the edits.
  }, [key]);
  useEffect(() => {
    if (loaded) saveJSON(key, value);
  }, [key, value, loaded]);
  return [value, setValue];
}
