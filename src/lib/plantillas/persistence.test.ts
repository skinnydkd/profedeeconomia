import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { h, render } from 'preact';
import { act } from 'preact/test-utils';
import { usePersistentState } from './persistence';

/**
 * The plantillas (rúbrica, DAFO, registro de aula…) hydrate with `client:load`,
 * and Preact does not patch input values while hydrating. Reading localStorage
 * in the first render left every field empty on reload while the state held
 * the saved data, and the next keystroke saved one field over all the others.
 *
 * The hook is rendered for real here. Its probe returns null, so Preact never
 * creates a DOM node and a bare object is enough as the container; `document`
 * only has to exist for the check `render()` makes against it.
 */
class FakeStorage {
  private map = new Map<string, string>();
  /** Every value written, in order, so a transient overwrite shows up too. */
  writes: string[] = [];
  getItem(k: string) {
    return this.map.has(k) ? this.map.get(k)! : null;
  }
  setItem(k: string, v: string) {
    this.writes.push(v);
    this.map.set(k, v);
  }
  removeItem(k: string) {
    this.map.delete(k);
  }
}

const KEY = 'pde:generador:registro-aula';
const INITIAL = { fecha: '', sesion: '' };
const SAVED = { fecha: '01/10/2026', sesion: 'Sesión 3' };

type State = typeof INITIAL;

let store: FakeStorage;
let seen: State[];
let set: (v: State) => void;
let container: HTMLElement;

function Probe() {
  const [value, setValue] = usePersistentState<State>(KEY, INITIAL);
  seen.push(value);
  set = setValue;
  return null;
}

async function mount() {
  await act(() => {
    render(h(Probe, null), container);
  });
}

describe('usePersistentState', () => {
  beforeEach(() => {
    store = new FakeStorage();
    seen = [];
    container = { childNodes: [], firstChild: null } as unknown as HTMLElement;
    vi.stubGlobal('localStorage', store);
    vi.stubGlobal('document', {});
  });
  afterEach(async () => {
    await act(() => {
      render(null, container);
    });
    vi.unstubAllGlobals();
  });

  it('renders `initial` first, as the server did, even with saved data', async () => {
    store.setItem(KEY, JSON.stringify(SAVED));
    await mount();
    expect(seen[0]).toEqual(INITIAL);
  });

  it('shows the saved data once mounted', async () => {
    store.setItem(KEY, JSON.stringify(SAVED));
    await mount();
    expect(seen.at(-1)).toEqual(SAVED);
  });

  it('never writes `initial` over the saved data while loading', async () => {
    store.setItem(KEY, JSON.stringify(SAVED));
    await mount();
    expect(store.writes.map((w) => JSON.parse(w))).not.toContainEqual(INITIAL);
    expect(JSON.parse(store.getItem(KEY)!)).toEqual(SAVED);
  });

  it('keeps the other fields when one is edited after loading', async () => {
    store.setItem(KEY, JSON.stringify(SAVED));
    await mount();
    const current = seen.at(-1)!;
    await act(() => set({ ...current, sesion: 'Sesión 4' }));
    expect(JSON.parse(store.getItem(KEY)!)).toEqual({ fecha: '01/10/2026', sesion: 'Sesión 4' });
  });

  it('starts from `initial` when nothing is saved', async () => {
    await mount();
    expect(seen.at(-1)).toEqual(INITIAL);
  });
});
