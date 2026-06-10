import { describe, it, expect } from 'vitest';
import { recordedElapsedMs } from './elapsed';

describe('recordedElapsedMs', () => {
  it('takes the min of server and client+tolerance for honest play', () => {
    expect(recordedElapsedMs(5000, 2000, 2000)).toBe(4000);
    expect(recordedElapsedMs(5000, 4800, 2000)).toBe(5000);
  });
  it('never records negative time (malicious negative client value)', () => {
    expect(recordedElapsedMs(5000, -999999, 2000)).toBe(0);
  });
  it('never exceeds the authoritative server time', () => {
    expect(recordedElapsedMs(3000, 999999, 2000)).toBe(3000);
  });
  it('is 0 when server time is 0', () => {
    expect(recordedElapsedMs(0, 0, 2000)).toBe(0);
  });
});
