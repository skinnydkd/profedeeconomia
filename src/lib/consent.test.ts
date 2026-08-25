import { describe, it, expect, vi } from 'vitest';
import {
  CONSENT_STORAGE_KEY,
  readConsent,
  writeConsent,
  clearConsent,
  applyConsent,
  decideConsent,
  type ConsentScope,
} from './consent';

/** In-memory stand-in for localStorage. */
function fakeStore(seed: Record<string, string> = {}) {
  const data = new Map(Object.entries(seed));
  return {
    getItem: (k: string) => data.get(k) ?? null,
    setItem: (k: string, v: string) => void data.set(k, v),
    removeItem: (k: string) => void data.delete(k),
    size: () => data.size,
  };
}

/** Storage that throws on every access (private mode, blocked site data). */
const throwingStore = {
  getItem() { throw new Error('blocked'); },
  setItem() { throw new Error('blocked'); },
  removeItem() { throw new Error('blocked'); },
};

describe('readConsent', () => {
  it('returns null when nothing was stored', () => {
    expect(readConsent(fakeStore())).toBeNull();
  });

  it('reads back a stored decision', () => {
    expect(readConsent(fakeStore({ [CONSENT_STORAGE_KEY]: 'granted' }))).toBe('granted');
    expect(readConsent(fakeStore({ [CONSENT_STORAGE_KEY]: 'denied' }))).toBe('denied');
  });

  it('treats an unrecognised stored value as no decision', () => {
    expect(readConsent(fakeStore({ [CONSENT_STORAGE_KEY]: 'yes' }))).toBeNull();
  });

  it('degrades to "no decision" when storage is unavailable or throws', () => {
    expect(readConsent(null)).toBeNull();
    expect(readConsent(throwingStore)).toBeNull();
  });
});

describe('writeConsent / clearConsent', () => {
  it('round-trips a decision', () => {
    const store = fakeStore();
    writeConsent('granted', store);
    expect(readConsent(store)).toBe('granted');
    clearConsent(store);
    expect(readConsent(store)).toBeNull();
    expect(store.size()).toBe(0);
  });

  it('never throws when storage is blocked', () => {
    expect(() => writeConsent('granted', throwingStore)).not.toThrow();
    expect(() => clearConsent(throwingStore)).not.toThrow();
    expect(() => writeConsent('granted', null)).not.toThrow();
  });
});

describe('applyConsent', () => {
  it('loads the Google tag only when granted', () => {
    const scope: ConsentScope = { __pdeLoadAnalytics: vi.fn(), gtag: vi.fn() };
    applyConsent('granted', scope);
    expect(scope.__pdeLoadAnalytics).toHaveBeenCalledOnce();
    expect(scope.gtag).not.toHaveBeenCalled();
  });

  it('never loads the tag when denied', () => {
    const scope: ConsentScope = { __pdeLoadAnalytics: vi.fn(), gtag: vi.fn() };
    applyConsent('denied', scope);
    expect(scope.__pdeLoadAnalytics).not.toHaveBeenCalled();
  });

  it('revokes storage on an already-loaded tag when denied', () => {
    const gtag = vi.fn();
    applyConsent('denied', { gtag });
    expect(gtag).toHaveBeenCalledWith(
      'consent',
      'update',
      expect.objectContaining({ analytics_storage: 'denied' }),
    );
  });

  it('keeps every advertising signal denied when granting analytics', () => {
    const gtag = vi.fn();
    // Granting goes through the loader, which is what flips analytics_storage;
    // the denied branch must not re-enable ad signals either.
    applyConsent('denied', { gtag });
    const consent = gtag.mock.calls[0]?.[2] as Record<string, string>;
    expect(consent.ad_storage).toBe('denied');
    expect(consent.ad_user_data).toBe('denied');
    expect(consent.ad_personalization).toBe('denied');
  });

  it('is a no-op when analytics is disabled (no gtag, no loader)', () => {
    expect(() => applyConsent('granted', {})).not.toThrow();
    expect(() => applyConsent('denied', {})).not.toThrow();
  });
});

describe('decideConsent', () => {
  it('stores and applies in one step', () => {
    const store = fakeStore();
    const scope: ConsentScope = { __pdeLoadAnalytics: vi.fn() };
    decideConsent('granted', store, scope);
    expect(readConsent(store)).toBe('granted');
    expect(scope.__pdeLoadAnalytics).toHaveBeenCalledOnce();
  });

  it('records a refusal without touching Google', () => {
    const store = fakeStore();
    const scope: ConsentScope = { __pdeLoadAnalytics: vi.fn() };
    decideConsent('denied', store, scope);
    expect(readConsent(store)).toBe('denied');
    expect(scope.__pdeLoadAnalytics).not.toHaveBeenCalled();
  });
});
