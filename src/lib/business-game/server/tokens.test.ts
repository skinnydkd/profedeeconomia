import { describe, it, expect } from 'vitest';
import jwt from 'jsonwebtoken';
import { signBgToken, verifyBgToken } from './tokens';

const SECRET = 'test-secret-at-least-32-chars-long-aaaa';
const DAY = 24 * 60 * 60;
const now = () => Math.floor(Date.now() / 1000);

/** A token as the server signed it before the 365-day change: 30-day `exp`. */
function tokenSigned(daysAgo: number, lifetimeDays: number, payload: object = { ligaId: 'L1', rol: 'profe' }): string {
  const iat = now() - daysAgo * DAY;
  return jwt.sign({ ...payload, iat, exp: iat + lifetimeDays * DAY }, SECRET, { algorithm: 'HS256' });
}

describe('verifyBgToken', () => {
  it('roundtrip: a fresh token carries the league and role', () => {
    const r = verifyBgToken(signBgToken({ ligaId: 'L1', rol: 'equipo', equipoId: 'E1' }, SECRET), SECRET);
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.payload).toMatchObject({ ligaId: 'L1', rol: 'equipo', equipoId: 'E1' });
  });

  it('keeps accepting a league token from before the 365-day change once its 30-day exp has passed', () => {
    // Issued 45 days ago with the old 30-day lifetime: `exp` was 15 days ago.
    const r = verifyBgToken(tokenSigned(45, 30), SECRET);
    expect(r).toMatchObject({ ok: true, payload: { ligaId: 'L1', rol: 'profe' } });
  });

  it('rejects tokens signed more than about 400 days ago', () => {
    const r = verifyBgToken(tokenSigned(401, 365), SECRET);
    expect(r).toEqual({ ok: false, reason: 'expired' });
  });

  it('rejects a token without an issue date', () => {
    const t = jwt.sign({ ligaId: 'L1', rol: 'profe' }, SECRET, { algorithm: 'HS256', noTimestamp: true });
    expect(verifyBgToken(t, SECRET)).toEqual({ ok: false, reason: 'expired' });
  });

  it('rejects a token signed with another secret', () => {
    const t = signBgToken({ ligaId: 'L1', rol: 'profe' }, 'another-secret-at-least-32-chars-long-bbbb');
    expect(verifyBgToken(t, SECRET)).toEqual({ ok: false, reason: 'invalid-signature' });
  });

  it('rejects a payload without league or with an unknown role', () => {
    expect(verifyBgToken(tokenSigned(1, 365, { rol: 'profe' }), SECRET)).toEqual({ ok: false, reason: 'malformed' });
    expect(verifyBgToken(tokenSigned(1, 365, { ligaId: 'L1', rol: 'admin' }), SECRET)).toEqual({ ok: false, reason: 'malformed' });
  });
});
