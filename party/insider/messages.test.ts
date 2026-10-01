import { describe, it, expect } from 'vitest';
import { cleanPlayerName, isPlayerId, parseClientMsg } from './messages';
import { GUESS_MAX_LENGTH, MAX_ROUNDS, NAME_MAX_LENGTH } from './constants';

const parse = (msg: unknown) => parseClientMsg(JSON.stringify(msg));

describe('parseClientMsg', () => {
  it('accepts every message the Insider client sends', () => {
    const msgs = [
      { type: 'join', name: 'María', playerId: '0b0a6f5c-3d2e-4b8a-9c1d-2e3f4a5b6c7d', asHost: false },
      { type: 'startGame', totalRounds: 5 },
      { type: 'startGame', totalRounds: 10, impostorCountOverride: 2 },
      { type: 'advancePhase' },
      { type: 'vote', targetId: 'p2' },
      { type: 'guess', word: 'Inflación' },
      { type: 'restart' },
    ];
    for (const msg of msgs) expect(parse(msg), msg.type).toEqual({ ok: true, msg });
  });

  it('rejects a guess that is not a string, or longer than the input allows', () => {
    // {"type":"guess","word":42} used to throw after the guess timer was cleared.
    expect(parse({ type: 'guess', word: 42 })).toEqual({ ok: false, reason: 'invalid-message' });
    expect(parse({ type: 'guess' })).toEqual({ ok: false, reason: 'invalid-message' });
    expect(parse({ type: 'guess', word: 'x'.repeat(GUESS_MAX_LENGTH + 1) })).toEqual({ ok: false, reason: 'invalid-message' });
    expect(parse({ type: 'guess', word: 'x'.repeat(GUESS_MAX_LENGTH) }).ok).toBe(true);
  });

  it('trims names and rejects empty or overlong ones', () => {
    expect(parse({ type: 'join', name: '  Pau  ', playerId: 'p1' })).toEqual({
      ok: true,
      msg: { type: 'join', name: 'Pau', playerId: 'p1' },
    });
    expect(parse({ type: 'join', name: 'x'.repeat(1000), playerId: 'p1' })).toEqual({ ok: false, reason: 'invalid-name' });
    expect(parse({ type: 'join', name: '   ', playerId: 'p1' })).toEqual({ ok: false, reason: 'invalid-name' });
    expect(parse({ type: 'join', name: 7, playerId: 'p1' })).toEqual({ ok: false, reason: 'invalid-name' });
  });

  it('rejects malformed ids, flags and counts', () => {
    const bad = [
      { type: 'join', name: 'Pau', playerId: 42 },
      { type: 'join', name: 'Pau', playerId: 'x'.repeat(65) },
      { type: 'join', name: 'Pau', playerId: 'p1', asHost: 'yes' },
      { type: 'startGame', totalRounds: 'five' },
      { type: 'startGame', totalRounds: 0 },
      { type: 'startGame', totalRounds: MAX_ROUNDS + 1 },
      { type: 'startGame', totalRounds: 2.5 },
      { type: 'startGame', totalRounds: 5, impostorCountOverride: 0 },
      { type: 'vote', targetId: { $ne: null } },
      { type: 'launchMissiles' },
      null,
      [1, 2],
    ];
    for (const msg of bad) expect(parse(msg), JSON.stringify(msg)).toEqual({ ok: false, reason: 'invalid-message' });
    expect(parseClientMsg('{not json')).toEqual({ ok: false, reason: 'invalid-message' });
  });
});

describe('cleanPlayerName / isPlayerId', () => {
  it(`keeps names of 1 to ${NAME_MAX_LENGTH} characters after trimming`, () => {
    expect(cleanPlayerName(' Ana ')).toBe('Ana');
    expect(cleanPlayerName('x'.repeat(NAME_MAX_LENGTH))).toBe('x'.repeat(NAME_MAX_LENGTH));
    expect(cleanPlayerName('x'.repeat(NAME_MAX_LENGTH + 1))).toBeNull();
    expect(cleanPlayerName(null)).toBeNull();
  });

  it('accepts ids up to 64 characters', () => {
    expect(isPlayerId('0b0a6f5c-3d2e-4b8a-9c1d-2e3f4a5b6c7d')).toBe(true);
    expect(isPlayerId('')).toBe(false);
    expect(isPlayerId('x'.repeat(65))).toBe(false);
  });
});
