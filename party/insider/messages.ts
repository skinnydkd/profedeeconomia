// Validation of what Insider clients send: shape, types and lengths, before
// any handler runs. A guess of 42 used to throw after the phase timer had been
// cleared, leaving the room stuck in `guess`.

import type { ClientMsg } from '../../src/lib/games-multi/insider/types';
import { GUESS_MAX_LENGTH, ID_MAX_LENGTH, MAX_PLAYERS, MAX_ROUNDS, NAME_MAX_LENGTH } from './constants';

export type ParseResult =
  | { ok: true; msg: ClientMsg }
  | { ok: false; reason: 'invalid-message' | 'invalid-name' };

const INVALID: ParseResult = { ok: false, reason: 'invalid-message' };

const isRecord = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null && !Array.isArray(v);

const isCount = (v: unknown, max: number): v is number =>
  typeof v === 'number' && Number.isInteger(v) && v >= 1 && v <= max;

export function isPlayerId(v: unknown): v is string {
  return typeof v === 'string' && v.length > 0 && v.length <= ID_MAX_LENGTH;
}

/** The name as the class will see it: trimmed, 1 to NAME_MAX_LENGTH characters; null otherwise. */
export function cleanPlayerName(raw: unknown): string | null {
  if (typeof raw !== 'string') return null;
  const name = raw.trim();
  return name.length >= 1 && name.length <= NAME_MAX_LENGTH ? name : null;
}

export function parseClientMsg(raw: string): ParseResult {
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    return INVALID;
  }
  if (!isRecord(data)) return INVALID;

  switch (data.type) {
    case 'join': {
      if (!isPlayerId(data.playerId)) return INVALID;
      if (data.asHost !== undefined && typeof data.asHost !== 'boolean') return INVALID;
      const name = cleanPlayerName(data.name);
      if (name === null) return { ok: false, reason: 'invalid-name' };
      const msg: ClientMsg = { type: 'join', name, playerId: data.playerId };
      if (data.asHost !== undefined) msg.asHost = data.asHost;
      return { ok: true, msg };
    }
    case 'startGame': {
      if (!isCount(data.totalRounds, MAX_ROUNDS)) return INVALID;
      if (data.impostorCountOverride === undefined) {
        return { ok: true, msg: { type: 'startGame', totalRounds: data.totalRounds } };
      }
      // The server still caps it at half the players.
      if (!isCount(data.impostorCountOverride, MAX_PLAYERS)) return INVALID;
      return {
        ok: true,
        msg: { type: 'startGame', totalRounds: data.totalRounds, impostorCountOverride: data.impostorCountOverride },
      };
    }
    case 'vote':
      return isPlayerId(data.targetId) ? { ok: true, msg: { type: 'vote', targetId: data.targetId } } : INVALID;
    case 'guess':
      return typeof data.word === 'string' && data.word.length <= GUESS_MAX_LENGTH
        ? { ok: true, msg: { type: 'guess', word: data.word } }
        : INVALID;
    case 'advancePhase':
      return { ok: true, msg: { type: 'advancePhase' } };
    case 'restart':
      return { ok: true, msg: { type: 'restart' } };
    default:
      return INVALID;
  }
}
