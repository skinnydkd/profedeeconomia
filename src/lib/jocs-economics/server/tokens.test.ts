import { describe, it, expect } from 'vitest';
import { signGameToken, verifyGameToken } from './tokens';

const SECRET = 'test-secret-at-least-32-chars-long-aaaa';

describe('signGameToken / verifyGameToken', () => {
  it('roundtrip: sign then verify returns the gameId', () => {
    const token = signGameToken('game-abc', SECRET);
    const result = verifyGameToken(token, SECRET);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.gameId).toBe('game-abc');
  });

  it('rejects token signed with different secret', () => {
    const token = signGameToken('game-abc', SECRET);
    const result = verifyGameToken(token, 'WRONG-SECRET-aaaa-bbbb-cccc-dddd-eeee');
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.reason).toBe('invalid-signature');
  });

  it('rejects malformed token', () => {
    const result = verifyGameToken('not.a.real.token.lalala', SECRET);
    expect(result.ok).toBe(false);
  });

  it('rejects expired token', () => {
    const token = signGameToken('game-abc', SECRET, { expiresInSeconds: -1 });
    const result = verifyGameToken(token, SECRET);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.reason).toBe('expired');
  });

  it('default expiry is ~60 minutes (sane upper bound for a game)', () => {
    const token = signGameToken('game-abc', SECRET);
    const [, payloadB64] = token.split('.');
    const payload = JSON.parse(Buffer.from(payloadB64, 'base64').toString());
    const now = Math.floor(Date.now() / 1000);
    expect(payload.exp - now).toBeGreaterThan(3500);
    expect(payload.exp - now).toBeLessThan(3700);
  });
});
