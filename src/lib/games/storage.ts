// src/lib/games/storage.ts
/** Namespaced localStorage wrapper for games. Pass a custom Storage in tests. */
export function makeGameStorage<T = unknown>(
  slug: string,
  backend: Storage | null = typeof localStorage !== 'undefined' ? localStorage : null,
) {
  const stateKey = `pde:game:${slug}:state`;
  const bestKey = `pde:game:${slug}:best`;
  return {
    load(): T | null {
      if (!backend) return null;
      const raw = backend.getItem(stateKey);
      if (!raw) return null;
      try { return JSON.parse(raw) as T; } catch { return null; }
    },
    save(state: T): void { backend?.setItem(stateKey, JSON.stringify(state)); },
    clear(): void { backend?.removeItem(stateKey); },
    getBest(): number {
      const raw = backend?.getItem(bestKey);
      const n = raw ? Number(raw) : 0;
      return Number.isFinite(n) ? n : 0;
    },
    setBest(value: number): void {
      if (!backend) return;
      if (value > this.getBest()) backend.setItem(bestKey, String(Math.round(value)));
    },
  };
}
