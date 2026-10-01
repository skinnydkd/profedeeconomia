// Business Game — tokens JWT HS256 (server-only).
// Reutilitza el mateix secret que Jocs Econòmics (JOCS_TOKEN_SECRET) per no
// afegir env vars noves. Un token identifica el profe d'una liga o un equip.

import jwt from 'jsonwebtoken';

// Un any: una lliga dura un curs sencer, i el token només s'emet en crear-la o en
// unir-s'hi. Amb 30 dies el profe perdia el control de la lliga a mig curs.
const DEFAULT_EXPIRY_SECONDS = 60 * 60 * 24 * 365;

// What verification actually enforces: the token's age, not its `exp`. Tokens
// issued before the one-year change carry a 30-day `exp` and cannot be renewed,
// so honouring it would orphan leagues created back then in the middle of the
// course. A bit over a year covers a full course for old and new tokens alike.
const MAX_TOKEN_AGE_SECONDS = 60 * 60 * 24 * 400;

export type Rol = 'profe' | 'equipo';

export interface BgTokenPayload {
  ligaId: string;
  rol: Rol;
  equipoId?: string;
}

export function getSecret(): string {
  const s = process.env.JOCS_TOKEN_SECRET;
  if (!s) throw new Error('JOCS_TOKEN_SECRET env var missing');
  return s;
}

export function signBgToken(payload: BgTokenPayload, secret: string): string {
  return jwt.sign(payload, secret, { algorithm: 'HS256', expiresIn: DEFAULT_EXPIRY_SECONDS });
}

export type VerifyResult =
  | { ok: true; payload: BgTokenPayload }
  | { ok: false; reason: 'invalid-signature' | 'expired' | 'malformed' };

export function verifyBgToken(token: string, secret: string): VerifyResult {
  try {
    const decoded = jwt.verify(token, secret, { algorithms: ['HS256'], ignoreExpiration: true }) as
      BgTokenPayload & { iat?: number };
    if (typeof decoded.iat !== 'number' || Date.now() / 1000 - decoded.iat > MAX_TOKEN_AGE_SECONDS) {
      return { ok: false, reason: 'expired' };
    }
    if (typeof decoded.ligaId !== 'string' || (decoded.rol !== 'profe' && decoded.rol !== 'equipo')) {
      return { ok: false, reason: 'malformed' };
    }
    return { ok: true, payload: decoded };
  } catch (err: unknown) {
    const e = err as { name?: string };
    if (e?.name === 'TokenExpiredError') return { ok: false, reason: 'expired' };
    if (e?.name === 'JsonWebTokenError') return { ok: false, reason: 'invalid-signature' };
    return { ok: false, reason: 'malformed' };
  }
}

/** Lee el token Bearer de la cabecera Authorization. */
export function bearer(request: Request): string | null {
  const h = request.headers.get('authorization') ?? '';
  const m = h.match(/^Bearer\s+(.+)$/i);
  return m ? m[1] : null;
}

const ALFABETO = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // sin I,O,0,1 para no confundir
/** Código de unión de 6 caracteres legibles. */
export function generarCodigo(): string {
  let s = '';
  for (let i = 0; i < 6; i++) s += ALFABETO[Math.floor(Math.random() * ALFABETO.length)];
  return s;
}
