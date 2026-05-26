import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  registerHost,
  addPlayer,
  removePlayer,
  kickPlayer,
  setPlayerConnection,
  configureMatch,
  startMatch,
  recordAnswer,
  allAnswered,
  advanceToReveal,
  advanceToLeaderboard,
  advanceToNextQuestion,
  skipQuestion,
  endMatch,
  toPublicState,
  toPrivateState,
  type MatchState,
  type Question,
} from './state';
import { MAX_PLAYERS, SCORE_MAX, SCORE_MIN_ON_CORRECT, TIMER_QUESTION_S } from './constants';

function rng(seed: number): () => number {
  let t = seed;
  return () => {
    t = (t + 0x6d2b79f5) | 0;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

const NOW = 1_700_000_000_000;

const SAMPLE_QUESTIONS: Question[] = [
  { enunciado: 'Q1', opciones: ['A', 'B', 'C', 'D'], correcta: 1 },
  { enunciado: 'Q2', opciones: ['A', 'B', 'C', 'D'], correcta: 2 },
  { enunciado: 'Q3', opciones: ['A', 'B', 'C', 'D'], correcta: 0 },
];

describe('createInitialState', () => {
  it('creates an empty lobby with the given room code', () => {
    const s = createInitialState('A7K2');
    expect(s.phase).toBe('lobby');
    expect(s.roomCode).toBe('A7K2');
    expect(s.hostId).toBeNull();
    expect(s.players.size).toBe(0);
    expect(s.config).toBeNull();
    expect(s.questions).toEqual([]);
    expect(s.questionIndex).toBe(0);
    expect(s.answers.size).toBe(0);
  });
});

describe('registerHost', () => {
  it('sets hostId and does NOT add to players', () => {
    const s = registerHost(createInitialState('A7K2'), 'host-1');
    expect(s.hostId).toBe('host-1');
    expect(s.players.has('host-1')).toBe(false);
  });

  it('replaces previous hostId (reclaim)', () => {
    let s = registerHost(createInitialState('A7K2'), 'host-1');
    s = registerHost(s, 'host-2');
    expect(s.hostId).toBe('host-2');
  });
});

describe('addPlayer', () => {
  const base = registerHost(createInitialState('A7K2'), 'host-1');

  it('adds a player with score=0, connected=true', () => {
    const r = addPlayer(base, 'p1', 'Alice', NOW);
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    const p = r.state.players.get('p1');
    expect(p?.nick).toBe('Alice');
    expect(p?.score).toBe(0);
    expect(p?.isConnected).toBe(true);
    expect(p?.lastSeenAt).toBe(NOW);
  });

  it('rejects empty nick', () => {
    expect(addPlayer(base, 'p1', '', NOW)).toEqual({ ok: false, reason: 'invalid-nick' });
    expect(addPlayer(base, 'p1', '   ', NOW)).toEqual({ ok: false, reason: 'invalid-nick' });
  });

  it('rejects too-long nick', () => {
    const long = 'x'.repeat(25);
    expect(addPlayer(base, 'p1', long, NOW)).toEqual({ ok: false, reason: 'invalid-nick' });
  });

  it('trims nick', () => {
    const r = addPlayer(base, 'p1', '  Alice  ', NOW);
    if (!r.ok) throw new Error('expected ok');
    expect(r.state.players.get('p1')?.nick).toBe('Alice');
  });

  it('rejects duplicate nick (case-insensitive)', () => {
    const a = addPlayer(base, 'p1', 'Alice', NOW);
    if (!a.ok) throw new Error('expected ok');
    const b = addPlayer(a.state, 'p2', 'alice', NOW);
    expect(b).toEqual({ ok: false, reason: 'nick-taken' });
  });

  it('rejects when already joined (same playerId)', () => {
    const a = addPlayer(base, 'p1', 'Alice', NOW);
    if (!a.ok) throw new Error('expected ok');
    const b = addPlayer(a.state, 'p1', 'Bob', NOW);
    expect(b).toEqual({ ok: false, reason: 'already-joined' });
  });

  it('rejects when sala plena', () => {
    let s = base;
    for (let i = 0; i < MAX_PLAYERS; i++) {
      const r = addPlayer(s, `p${i}`, `Nick${i}`, NOW);
      if (!r.ok) throw new Error('unexpected fail');
      s = r.state;
    }
    expect(addPlayer(s, 'overflow', 'Plus', NOW)).toEqual({ ok: false, reason: 'too-many' });
  });

  it('rejects when phase is not lobby', () => {
    const a = addPlayer(base, 'p1', 'Alice', NOW);
    if (!a.ok) throw new Error('expected ok');
    const cfg = configureMatch(a.state, { asignaturaSlug: 'x', unidades: [1], totalQuestions: 'all' }, SAMPLE_QUESTIONS);
    const started = startMatch(cfg, NOW);
    const r = addPlayer(started, 'p2', 'Late', NOW);
    expect(r).toEqual({ ok: false, reason: 'match-started' });
  });
});

describe('removePlayer / kickPlayer / setPlayerConnection', () => {
  function setupTwo(): MatchState {
    let s = registerHost(createInitialState('A7K2'), 'host-1');
    s = (addPlayer(s, 'p1', 'Alice', NOW) as { ok: true; state: MatchState }).state;
    s = (addPlayer(s, 'p2', 'Bob', NOW) as { ok: true; state: MatchState }).state;
    return s;
  }

  it('removePlayer removes the player', () => {
    const s = removePlayer(setupTwo(), 'p1');
    expect(s.players.has('p1')).toBe(false);
    expect(s.players.has('p2')).toBe(true);
  });

  it('removePlayer is a no-op for unknown id', () => {
    const s = removePlayer(setupTwo(), 'zzz');
    expect(s.players.size).toBe(2);
  });

  it('kickPlayer removes and frees the nick for re-use', () => {
    const s = kickPlayer(setupTwo(), 'p1');
    expect(s.players.has('p1')).toBe(false);
    const re = addPlayer(s, 'p3', 'Alice', NOW);
    expect(re.ok).toBe(true);
  });

  it('setPlayerConnection updates flag and lastSeenAt without removing', () => {
    const s = setPlayerConnection(setupTwo(), 'p1', false, NOW + 1000);
    expect(s.players.get('p1')?.isConnected).toBe(false);
    expect(s.players.get('p1')?.lastSeenAt).toBe(NOW + 1000);
  });
});

describe('configureMatch + startMatch', () => {
  function setupReady(): MatchState {
    let s = registerHost(createInitialState('A7K2'), 'host-1');
    s = (addPlayer(s, 'p1', 'Alice', NOW) as { ok: true; state: MatchState }).state;
    s = (addPlayer(s, 'p2', 'Bob', NOW) as { ok: true; state: MatchState }).state;
    return s;
  }

  it('configureMatch stores config and questions, keeps phase lobby', () => {
    const s = configureMatch(
      setupReady(),
      { asignaturaSlug: 'edmn-2bach', unidades: [1, 2], totalQuestions: 15 },
      SAMPLE_QUESTIONS,
    );
    expect(s.phase).toBe('lobby');
    expect(s.config?.asignaturaSlug).toBe('edmn-2bach');
    expect(s.questions).toEqual(SAMPLE_QUESTIONS);
  });

  it('startMatch transitions to question phase, index=0, sets questionStartedAt', () => {
    let s = setupReady();
    s = configureMatch(s, { asignaturaSlug: 'x', unidades: [1], totalQuestions: 'all' }, SAMPLE_QUESTIONS);
    s = startMatch(s, NOW);
    expect(s.phase).toBe('question');
    expect(s.questionIndex).toBe(0);
    expect(s.questionStartedAt).toBe(NOW);
  });
});

describe('recordAnswer + allAnswered', () => {
  function setupInQuestion(): MatchState {
    let s = registerHost(createInitialState('A7K2'), 'host-1');
    s = (addPlayer(s, 'p1', 'Alice', NOW) as { ok: true; state: MatchState }).state;
    s = (addPlayer(s, 'p2', 'Bob', NOW) as { ok: true; state: MatchState }).state;
    s = configureMatch(s, { asignaturaSlug: 'x', unidades: [1], totalQuestions: 'all' }, SAMPLE_QUESTIONS);
    return startMatch(s, NOW);
  }

  it('correct answer awards SCORE_MAX at t=0', () => {
    const s = setupInQuestion();
    const r = recordAnswer(s, 'p1', 0, 1, NOW); // correcta=1 per Q1
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.gained).toBe(SCORE_MAX);
    expect(r.state.players.get('p1')?.score).toBe(SCORE_MAX);
    const rec = r.state.answers.get('p1')?.[0];
    expect(rec?.wasCorrect).toBe(true);
    expect(rec?.optionIndex).toBe(1);
  });

  it('incorrect answer awards 0 points', () => {
    const s = setupInQuestion();
    const r = recordAnswer(s, 'p1', 0, 0, NOW + 5000);
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.gained).toBe(0);
    expect(r.state.players.get('p1')?.score).toBe(0);
  });

  it('respects elapsedMs for score decay', () => {
    const s = setupInQuestion();
    const r = recordAnswer(s, 'p1', 0, 1, NOW + TIMER_QUESTION_S * 1000); // correcta al límit
    if (!r.ok) throw new Error('expected ok');
    expect(r.gained).toBe(SCORE_MIN_ON_CORRECT);
  });

  it('rejects answer if phase is not question', () => {
    let s = registerHost(createInitialState('A7K2'), 'host-1');
    s = (addPlayer(s, 'p1', 'Alice', NOW) as { ok: true; state: MatchState }).state;
    const r = recordAnswer(s, 'p1', 0, 0, NOW);
    expect(r).toEqual({ ok: false, reason: 'wrong-phase' });
  });

  it('rejects answer for a different questionIndex', () => {
    const s = setupInQuestion();
    const r = recordAnswer(s, 'p1', 5, 0, NOW);
    expect(r).toEqual({ ok: false, reason: 'wrong-question' });
  });

  it('rejects double-answer for the same question', () => {
    const s = setupInQuestion();
    const r1 = recordAnswer(s, 'p1', 0, 1, NOW);
    if (!r1.ok) throw new Error('expected ok');
    const r2 = recordAnswer(r1.state, 'p1', 0, 2, NOW + 1000);
    expect(r2).toEqual({ ok: false, reason: 'already-answered' });
  });

  it('rejects answer from unknown player', () => {
    const s = setupInQuestion();
    const r = recordAnswer(s, 'p999', 0, 0, NOW);
    expect(r).toEqual({ ok: false, reason: 'not-a-player' });
  });

  it('allAnswered is true when all connected players answered current question', () => {
    let s = setupInQuestion();
    expect(allAnswered(s)).toBe(false);
    const r1 = recordAnswer(s, 'p1', 0, 1, NOW);
    if (!r1.ok) throw new Error('expected ok');
    s = r1.state;
    expect(allAnswered(s)).toBe(false);
    const r2 = recordAnswer(s, 'p2', 0, 0, NOW);
    if (!r2.ok) throw new Error('expected ok');
    s = r2.state;
    expect(allAnswered(s)).toBe(true);
  });

  it('allAnswered ignores disconnected players', () => {
    let s = setupInQuestion();
    s = setPlayerConnection(s, 'p2', false, NOW);
    const r1 = recordAnswer(s, 'p1', 0, 1, NOW);
    if (!r1.ok) throw new Error('expected ok');
    expect(allAnswered(r1.state)).toBe(true);
  });
});

describe('phase transitions', () => {
  function setupInQuestion(answered: boolean): MatchState {
    let s = registerHost(createInitialState('A7K2'), 'host-1');
    s = (addPlayer(s, 'p1', 'Alice', NOW) as { ok: true; state: MatchState }).state;
    s = configureMatch(s, { asignaturaSlug: 'x', unidades: [1], totalQuestions: 'all' }, SAMPLE_QUESTIONS);
    s = startMatch(s, NOW);
    if (answered) {
      const r = recordAnswer(s, 'p1', 0, 1, NOW);
      if (r.ok) s = r.state;
    }
    return s;
  }

  it('advanceToReveal moves to reveal phase', () => {
    const s = advanceToReveal(setupInQuestion(true), NOW + 5000);
    expect(s.phase).toBe('reveal');
  });

  it('advanceToLeaderboard moves to leaderboard phase', () => {
    let s = advanceToReveal(setupInQuestion(true), NOW + 5000);
    s = advanceToLeaderboard(s, NOW + 10000);
    expect(s.phase).toBe('leaderboard');
  });

  it('advanceToNextQuestion advances index and returns to question', () => {
    let s = advanceToReveal(setupInQuestion(true), NOW + 5000);
    s = advanceToLeaderboard(s, NOW + 10000);
    s = advanceToNextQuestion(s, NOW + 15000);
    expect(s.phase).toBe('question');
    expect(s.questionIndex).toBe(1);
    expect(s.questionStartedAt).toBe(NOW + 15000);
  });

  it('advanceToNextQuestion transitions to final when no more questions', () => {
    let s = setupInQuestion(false);
    // Saltem fins l'última pregunta
    for (let i = 0; i < SAMPLE_QUESTIONS.length; i++) {
      const r = recordAnswer(s, 'p1', i, 0, NOW);
      if (r.ok) s = r.state;
      s = advanceToReveal(s, NOW);
      s = advanceToLeaderboard(s, NOW);
      s = advanceToNextQuestion(s, NOW);
    }
    expect(s.phase).toBe('final');
  });

  it('skipQuestion advances to reveal even if not all answered', () => {
    const s = skipQuestion(setupInQuestion(false), NOW + 2000);
    expect(s.phase).toBe('reveal');
  });

  it('endMatch jumps to final from any phase', () => {
    expect(endMatch(setupInQuestion(false)).phase).toBe('final');
    let s = advanceToReveal(setupInQuestion(true), NOW);
    expect(endMatch(s).phase).toBe('final');
  });
});

describe('toPublicState', () => {
  function setupWithReveal(): MatchState {
    let s = registerHost(createInitialState('A7K2'), 'host-1');
    s = (addPlayer(s, 'p1', 'Alice', NOW) as { ok: true; state: MatchState }).state;
    s = configureMatch(s, { asignaturaSlug: 'x', unidades: [1], totalQuestions: 'all' }, SAMPLE_QUESTIONS);
    s = startMatch(s, NOW);
    const r = recordAnswer(s, 'p1', 0, 1, NOW + 1000);
    if (r.ok) s = r.state;
    return advanceToReveal(s, NOW + 5000);
  }

  it('exposes phase, roomCode, players (sense host)', () => {
    const s = setupWithReveal();
    const pub = toPublicState(s);
    expect(pub.phase).toBe('reveal');
    expect(pub.roomCode).toBe('A7K2');
    expect(pub.players).toHaveLength(1);
    expect(pub.players.find((p) => p.id === 'host-1')).toBeUndefined();
  });

  it('exposes currentQuestion WITHOUT correcta during question phase', () => {
    let s = registerHost(createInitialState('A7K2'), 'host-1');
    s = (addPlayer(s, 'p1', 'Alice', NOW) as { ok: true; state: MatchState }).state;
    s = configureMatch(s, { asignaturaSlug: 'x', unidades: [1], totalQuestions: 'all' }, SAMPLE_QUESTIONS);
    s = startMatch(s, NOW);
    const pub = toPublicState(s);
    expect(pub.currentQuestion).not.toBeNull();
    expect(pub.currentQuestion).toEqual(
      expect.objectContaining({
        index: 0,
        total: SAMPLE_QUESTIONS.length,
        enunciado: 'Q1',
        opciones: ['A', 'B', 'C', 'D'],
      }),
    );
    expect(pub.currentQuestion as any).not.toHaveProperty('correcta');
    expect(pub.currentQuestion as any).not.toHaveProperty('explicacion');
    expect(pub.lastReveal).toBeNull();
  });

  it('exposes lastReveal during reveal/leaderboard with correctOption + per-option counts + top5', () => {
    const s = setupWithReveal();
    const pub = toPublicState(s);
    expect(pub.lastReveal).not.toBeNull();
    expect(pub.lastReveal?.correctOption).toBe(1);
    expect(pub.lastReveal?.perOptionCounts).toEqual([0, 1, 0, 0]);
    expect(pub.lastReveal?.top5).toHaveLength(1);
  });

  it('exposes finalRanking at final phase, sorted desc by score', () => {
    let s = endMatch(setupWithReveal());
    const pub = toPublicState(s);
    expect(pub.finalRanking).not.toBeNull();
    expect(pub.finalRanking?.[0].nick).toBe('Alice');
  });
});

describe('toPrivateState', () => {
  it('reports isHost for the hostId', () => {
    let s = registerHost(createInitialState('A7K2'), 'host-1');
    const priv = toPrivateState(s, 'host-1');
    expect(priv.isHost).toBe(true);
    expect(priv.myAnswerHistory).toBeNull();
  });

  it('reports isHost=false and myNick/myScore for a player', () => {
    let s = registerHost(createInitialState('A7K2'), 'host-1');
    s = (addPlayer(s, 'p1', 'Alice', NOW) as { ok: true; state: MatchState }).state;
    const priv = toPrivateState(s, 'p1');
    expect(priv.isHost).toBe(false);
    expect(priv.myNick).toBe('Alice');
    expect(priv.myScore).toBe(0);
  });

  it('returns myAnswerHistory with full correct+explicacion ONLY at final', () => {
    let s = registerHost(createInitialState('A7K2'), 'host-1');
    s = (addPlayer(s, 'p1', 'Alice', NOW) as { ok: true; state: MatchState }).state;
    s = configureMatch(
      s,
      { asignaturaSlug: 'x', unidades: [1], totalQuestions: 'all' },
      [{ enunciado: 'Q1', opciones: ['A', 'B'], correcta: 0, explicacion: 'Per què A' }],
    );
    s = startMatch(s, NOW);
    const r = recordAnswer(s, 'p1', 0, 1, NOW); // fallat
    if (r.ok) s = r.state;
    // Encara no final → null
    expect(toPrivateState(s, 'p1').myAnswerHistory).toBeNull();
    // Quan acaba → ple
    s = endMatch(s);
    const priv = toPrivateState(s, 'p1');
    expect(priv.myAnswerHistory).toHaveLength(1);
    expect(priv.myAnswerHistory?.[0]).toMatchObject({
      enunciado: 'Q1',
      opciones: ['A', 'B'],
      correcta: 0,
      explicacion: 'Per què A',
      myOptionIndex: 1,
      wasCorrect: false,
    });
  });
});
