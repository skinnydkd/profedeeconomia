import { describe, it, expect } from 'vitest';
import { recordedElapsedMs } from './elapsed';

describe('recordedElapsedMs', () => {
  it("records the client's own time when it is within the latency window", () => {
    // The server's clock also counts the trip of the answer: that must not penalize.
    expect(recordedElapsedMs(5000, 4800, 1500)).toBe(4800);
    expect(recordedElapsedMs(5000, 3500, 1500)).toBe(3500);
  });
  it('never records less than the server time minus the latency window', () => {
    expect(recordedElapsedMs(5000, 2000, 1500)).toBe(3500);
  });
  it('a negative client value cannot buy a 0 ms tiebreaker', () => {
    // Before: max(0, min(server, client + tolerance)) turned -999999 into 0 ms.
    expect(recordedElapsedMs(5000, -999999, 1500)).toBe(3500);
    expect(recordedElapsedMs(5000, -Infinity, 1500)).toBe(3500);
  });
  it('never exceeds the authoritative server time', () => {
    expect(recordedElapsedMs(3000, 999999, 1500)).toBe(3000);
  });
  it('is never negative (fast answers or a server clock just behind)', () => {
    expect(recordedElapsedMs(0, 0, 1500)).toBe(0);
    expect(recordedElapsedMs(1000, -5000, 1500)).toBe(0);
    expect(recordedElapsedMs(-200, 100, 1500)).toBe(0);
  });
  it('falls back to the lower bound when the client value is not a number', () => {
    expect(recordedElapsedMs(5000, Number.NaN, 1500)).toBe(3500);
  });
});
