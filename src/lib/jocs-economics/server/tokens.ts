// src/lib/jocs-economics/server/tokens.ts
// JWT HS256 per a tokens de partida (spec §2 V8 anti-cheat).
// Secret = env JOCS_TOKEN_SECRET (server-only).

import jwt from 'jsonwebtoken';

const DEFAULT_EXPIRY_SECONDS = 60 * 60; // 1 hora — sane upper bound per a una partida

interface TokenPayload {
  gameId: string;
}

interface SignOptions {
  expiresInSeconds?: number;
}

export function signGameToken(gameId: string, secret: string, opts: SignOptions = {}): string {
  const payload: TokenPayload = { gameId };
  const expiresIn = opts.expiresInSeconds ?? DEFAULT_EXPIRY_SECONDS;
  return jwt.sign(payload, secret, { algorithm: 'HS256', expiresIn });
}

export type VerifyResult =
  | { ok: true; gameId: string }
  | { ok: false; reason: 'invalid-signature' | 'expired' | 'malformed' };

export function verifyGameToken(token: string, secret: string): VerifyResult {
  try {
    const decoded = jwt.verify(token, secret, { algorithms: ['HS256'] }) as TokenPayload;
    if (typeof decoded.gameId !== 'string') {
      return { ok: false, reason: 'malformed' };
    }
    return { ok: true, gameId: decoded.gameId };
  } catch (err: unknown) {
    const e = err as { name?: string };
    if (e?.name === 'TokenExpiredError') return { ok: false, reason: 'expired' };
    if (e?.name === 'JsonWebTokenError') return { ok: false, reason: 'invalid-signature' };
    return { ok: false, reason: 'malformed' };
  }
}
