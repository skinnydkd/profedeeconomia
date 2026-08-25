/**
 * Google Analytics configuration.
 *
 * The measurement ID lives here rather than in Vercel env because it is not a
 * secret (it ships in the page source of every GA site) and because a missing
 * env var would silently disable analytics on deploy. PUBLIC_GA_MEASUREMENT_ID
 * still overrides it — set it to "" in the Vercel Preview environment to keep
 * preview deploys out of the production property.
 *
 * The cookie names are derived from the same constant so the privacy policy
 * can never drift from what the tag actually sets.
 */

/** Production GA4 property for profedeeconomia.es. */
export const DEFAULT_MEASUREMENT_ID = 'G-3ECWVDWNF2';

/**
 * The measurement ID for this build. Pass `import.meta.env.PUBLIC_GA_MEASUREMENT_ID`;
 * an unset var falls back to the default property, and an empty (or blank)
 * value disables analytics entirely.
 */
export function resolveMeasurementId(configured?: string): string {
  return (configured ?? DEFAULT_MEASUREMENT_ID).trim();
}

/**
 * The two cookies gtag.js sets once analytics consent is granted: `_ga`
 * (browser identifier) and `_ga_<container>` (session state). Both expire
 * after two years. Nothing is set while consent is denied or unanswered.
 */
export function gaCookieNames(measurementId: string = DEFAULT_MEASUREMENT_ID): [string, string] {
  return ['_ga', `_ga_${measurementId.replace(/^G-/, '')}`];
}
