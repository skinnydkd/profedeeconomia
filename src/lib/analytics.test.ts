import { describe, it, expect } from 'vitest';
import { DEFAULT_MEASUREMENT_ID, resolveMeasurementId, gaCookieNames } from './analytics';

describe('resolveMeasurementId', () => {
  it('falls back to the default property when the env var is unset', () => {
    expect(resolveMeasurementId(undefined)).toBe(DEFAULT_MEASUREMENT_ID);
  });

  it('lets the env var override the property', () => {
    expect(resolveMeasurementId('G-OTHER123')).toBe('G-OTHER123');
  });

  it('disables analytics on an empty or blank override', () => {
    expect(resolveMeasurementId('')).toBe('');
    expect(resolveMeasurementId('   ')).toBe('');
  });

  it('trims stray whitespace from the env value', () => {
    expect(resolveMeasurementId(' G-ABC123 ')).toBe('G-ABC123');
  });
});

describe('gaCookieNames', () => {
  it('derives the container cookie from the measurement ID', () => {
    expect(gaCookieNames('G-ABC123')).toEqual(['_ga', '_ga_ABC123']);
  });

  it('documents the cookies of the default property', () => {
    const [browserCookie, sessionCookie] = gaCookieNames();
    expect(browserCookie).toBe('_ga');
    expect(sessionCookie).toBe(`_ga_${DEFAULT_MEASUREMENT_ID.slice(2)}`);
  });
});
