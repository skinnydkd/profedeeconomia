/**
 * Analytics consent (RGPD / AEPD).
 *
 * Google Analytics 4 writes cookies and sends data to Google, so under the
 * ePrivacy rules as enforced in Spain it may only run after the visitor opts
 * in. We take the strict reading: nothing from googletagmanager.com is
 * requested until consent is granted — not even Consent Mode's cookieless
 * pings — matching how the site already self-hosts its fonts to avoid leaking
 * visitor IPs to third parties.
 *
 * The decision lives in localStorage. `Analytics.astro` bootstraps Google
 * Consent Mode v2 in a `denied` state and exposes the loader on `window`; this
 * module is the client-side seam the banner and the privacy page talk to.
 */

/** localStorage key holding the visitor's decision. Also read by the inline
 *  Consent Mode bootstrap in Analytics.astro, which receives it via
 *  define:vars from this constant so there is a single source of truth. */
export const CONSENT_STORAGE_KEY = 'pde:consent';

export type ConsentValue = 'granted' | 'denied';

/** Minimal shape we need from localStorage — keeps the module unit-testable. */
type StorageLike = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;

/** Global surface published by the inline bootstrap in Analytics.astro. */
export type ConsentScope = {
  gtag?: (...args: unknown[]) => void;
  /** Injects gtag.js and flips Consent Mode to granted. Absent when GA is off. */
  __pdeLoadAnalytics?: () => void;
};

/**
 * localStorage, or null when it is unavailable. Access itself can throw when
 * site data is blocked (private windows, hardened browsers), so it is guarded.
 */
function browserStorage(): StorageLike | null {
  try {
    return globalThis.localStorage ?? null;
  } catch {
    return null;
  }
}

/** The stored decision, or null when the visitor has not chosen yet. */
export function readConsent(store: StorageLike | null = browserStorage()): ConsentValue | null {
  if (!store) return null;
  try {
    const raw = store.getItem(CONSENT_STORAGE_KEY);
    return raw === 'granted' || raw === 'denied' ? raw : null;
  } catch {
    return null;
  }
}

/** Persist the decision. Failing to store it is non-fatal: the banner shows again. */
export function writeConsent(
  value: ConsentValue,
  store: StorageLike | null = browserStorage(),
): void {
  try {
    store?.setItem(CONSENT_STORAGE_KEY, value);
  } catch {
    /* storage blocked — the choice applies to this page load only */
  }
}

/** Forget the decision so the banner asks again (used by the privacy page). */
export function clearConsent(store: StorageLike | null = browserStorage()): void {
  try {
    store?.removeItem(CONSENT_STORAGE_KEY);
  } catch {
    /* nothing to clean up */
  }
}

/**
 * Apply a decision to Google's tag on the current page.
 *
 * Granted: load gtag.js (the loader is idempotent, so re-granting is a no-op).
 * Denied: only meaningful when the visitor is revoking within a page where the
 * tag already loaded — we tell it to stop using storage. Ad signals stay denied
 * in every branch; this site never runs advertising tags.
 *
 * A no-op when GA is disabled (no measurement ID, or a dev build).
 */
export function applyConsent(
  value: ConsentValue,
  scope: ConsentScope = globalThis as ConsentScope,
): void {
  if (value === 'granted') {
    scope.__pdeLoadAnalytics?.();
    return;
  }
  scope.gtag?.('consent', 'update', {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: 'denied',
  });
}

/** Record a decision and apply it in one step. Used by the banner buttons. */
export function decideConsent(
  value: ConsentValue,
  store: StorageLike | null = browserStorage(),
  scope: ConsentScope = globalThis as ConsentScope,
): void {
  writeConsent(value, store);
  applyConsent(value, scope);
}
