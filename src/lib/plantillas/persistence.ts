/** @jsxImportSource preact */
import { useEffect, useState } from 'preact/hooks';
import { loadJSON, saveJSON } from '@/lib/storage';

/**
 * State backed by localStorage under `key`. SSR-safe: the storage helpers guard
 * for the absence of `window` and degrade to the in-memory value.
 */
export function usePersistentState<T>(key: string, initial: T): [T, (v: T) => void] {
  const [value, setValue] = useState<T>(() => loadJSON<T>(key, initial));
  useEffect(() => { saveJSON(key, value); }, [key, value]);
  return [value, setValue];
}
