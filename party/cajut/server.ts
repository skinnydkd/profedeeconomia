// party/cajut/server.ts
// PartyKit server per al joc Cajút. Orquestra la lògica pura de state.ts.
// Patró: thin orchestrator, tots els transitions deleguen a funcions pures.

import type * as Party from 'partykit/server';
import { randomUUID } from 'node:crypto';
import {
  TIMER_QUESTION_S,
  TIMER_REVEAL_S,
  TIMER_LEADERBOARD_S,
  RECONNECT_WINDOW_MS,
  ROOM_CODE_ALPHABET,
  ROOM_CODE_LENGTH,
} from './constants';
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
  endMatch,
  toPublicState,
  toPrivateState,
  type MatchState,
  type AnswerRecord,
} from './state';
import { getPool, samplePool, shuffleOptions } from './questions';
import type { ClientMsg, ServerMsg } from '../../src/lib/games-multi/cajut/types';

interface ConnMeta {
  playerId: string;
  isHost: boolean;
}

export default class CajutServer implements Party.Server {
  state: MatchState;
  conns = new Map<string, ConnMeta>();
  phaseTimer: ReturnType<typeof setTimeout> | null = null;
  pendingDisconnects = new Map<string, ReturnType<typeof setTimeout>>();
  timerEndsAt: number | null = null;

  constructor(readonly room: Party.Room) {
    this.state = createInitialState(generateRoomCode(this.room.id));
  }

  onConnect(conn: Party.Connection, ctx: Party.ConnectionContext) {
    const url = new URL(ctx.request.url);
    const playerId = url.searchParams.get('id') ?? conn.id ?? randomUUID();
    const asHost = url.searchParams.get('asHost') === '1';

    this.conns.set(conn.id, { playerId, isHost: asHost });

    // Cancel pending cleanup if this is a reconnect
    const pending = this.pendingDisconnects.get(playerId);
    if (pending) {
      clearTimeout(pending);
      this.pendingDisconnects.delete(playerId);
      this.state = setPlayerConnection(this.state, playerId, true, Date.now());
    }

    if (asHost) {
      if (this.state.hostId === null || this.state.hostId === playerId) {
        this.state = registerHost(this.state, playerId);
      } else {
        // Another host is already registered — demote this connection to non-host.
        this.conns.set(conn.id, { playerId, isHost: false });
      }
    }

    this.sendPrivate(conn, playerId);
    this.broadcastPublic();
  }

  onMessage(message: string, conn: Party.Connection) {
    const meta = this.conns.get(conn.id);
    if (!meta) return;
    let msg: ClientMsg;
    try {
      msg = JSON.parse(message) as ClientMsg;
    } catch {
      return;
    }
    switch (msg.type) {
      case 'join':
        this.handleJoin(conn, meta, msg.nick);
        break;
      case 'startMatch':
        this.handleStartMatch(meta, msg.asignaturaSlug, msg.unidades, msg.totalQuestions);
        break;
      case 'submitAnswer':
        this.handleSubmitAnswer(meta, msg.questionIndex, msg.optionIndex);
        break;
      case 'skipQuestion':
        if (this.requireHost(meta, conn)) this.doSkip();
        break;
      case 'kickPlayer':
        if (this.requireHost(meta, conn)) this.doKick(msg.playerId);
        break;
      case 'endMatch':
        if (this.requireHost(meta, conn)) this.doEnd();
        break;
      case 'restart':
        if (this.requireHost(meta, conn)) this.doRestart();
        break;
    }
  }

  onClose(conn: Party.Connection) {
    const meta = this.conns.get(conn.id);
    if (!meta) return;
    this.conns.delete(conn.id);

    const otherConnsForPlayer = [...this.conns.values()].some(
      (m) => m.playerId === meta.playerId,
    );
    if (otherConnsForPlayer) return;

    this.state = setPlayerConnection(this.state, meta.playerId, false, Date.now());
    const t = setTimeout(() => {
      this.pendingDisconnects.delete(meta.playerId);
      if (meta.isHost) {
        this.doEnd();
      } else {
        this.state = removePlayer(this.state, meta.playerId);
        this.broadcastPublic();
      }
    }, RECONNECT_WINDOW_MS);
    this.pendingDisconnects.set(meta.playerId, t);
    this.broadcastPublic();
  }

  private handleJoin(conn: Party.Connection, meta: ConnMeta, nick: string) {
    if (meta.isHost) {
      // Host registrat a onConnect; no entra al roster
      this.broadcastPublic();
      return;
    }
    const r = addPlayer(this.state, meta.playerId, nick, Date.now());
    if (!r.ok) {
      this.sendError(conn, r.reason);
      return;
    }
    this.state = r.state;
    this.sendPrivate(conn, meta.playerId);
    this.broadcastPublic();
  }

  private handleStartMatch(
    meta: ConnMeta,
    asignaturaSlug: string,
    unidades: number[],
    totalQuestions: number | 'all',
  ) {
    if (!meta.isHost) return;
    if (this.state.phase !== 'lobby') return;
    if (this.state.config !== null) return; // already configured/started
    if (this.state.players.size < 1) return;

    const pool = getPool(asignaturaSlug, unidades);
    if (pool.length === 0) return;

    const n = totalQuestions === 'all' ? pool.length : Math.min(totalQuestions, pool.length);
    const rng = makeRng(`${this.state.roomCode}:${Date.now()}`);
    const sampled = samplePool(pool, n, rng);
    const shuffled = sampled.map((q) => shuffleOptions(q, rng));

    this.state = configureMatch(this.state, { asignaturaSlug, unidades, totalQuestions }, shuffled);
    this.state = startMatch(this.state, Date.now());
    this.scheduleQuestionTimer();
    this.broadcastPublic();
  }

  private handleSubmitAnswer(meta: ConnMeta, questionIndex: number, optionIndex: number) {
    if (meta.isHost) return;
    const r = recordAnswer(this.state, meta.playerId, questionIndex, optionIndex, Date.now());
    if (!r.ok) return;
    this.state = r.state;
    this.broadcastPublic();
    // Update myScore for this player
    for (const [connId, m] of this.conns) {
      if (m.playerId === meta.playerId) {
        const c = this.room.getConnection(connId);
        if (c) this.sendPrivate(c, meta.playerId);
      }
    }
    if (allAnswered(this.state)) {
      this.advancePastQuestion();
    }
  }

  private doSkip() {
    if (this.state.phase !== 'question') return;
    this.clearPhaseTimer();
    this.advancePastQuestion();
  }

  private doKick(targetPlayerId: string) {
    this.state = kickPlayer(this.state, targetPlayerId);
    for (const [connId, m] of [...this.conns]) {
      if (m.playerId === targetPlayerId) {
        this.room.getConnection(connId)?.close();
        this.conns.delete(connId);
      }
    }
    this.broadcastPublic();
    if (this.state.phase === 'question' && allAnswered(this.state)) {
      this.advancePastQuestion();
    }
  }

  private doEnd() {
    this.clearPhaseTimer();
    this.state = endMatch(this.state);
    this.broadcastPublic();
    this.broadcastPrivates();
  }

  private doRestart() {
    this.clearPhaseTimer();
    // Snapshot players + nicks BEFORE clearing state
    const previousPlayers = [...this.state.players.values()];
    this.state = createInitialState(this.state.roomCode);
    // Re-register host first
    const hostMeta = [...this.conns.values()].find((m) => m.isHost);
    if (hostMeta) this.state = registerHost(this.state, hostMeta.playerId);
    // Re-add all previously-known players whose connections are still open
    const connectedPlayerIds = new Set([...this.conns.values()].map((m) => m.playerId));
    for (const p of previousPlayers) {
      if (!connectedPlayerIds.has(p.id)) continue; // disconnected, skip
      const r = addPlayer(this.state, p.id, p.nick, Date.now());
      if (r.ok) this.state = r.state;
    }
    // Broadcast public + send private to every conn so PlayerApp routes back to PlayerWaiting
    this.broadcastPublic();
    this.broadcastPrivates();
  }

  /**
   * Per a cada jugador connectat que NO ha respost la pregunta actual,
   * registra un AnswerRecord amb optionIndex=null (timeout). Crucial perquè
   * la revisió final del alumne mostri "Sense resposta" enlloc d'una entrada
   * buida. Cridar abans d'avançar des de 'question'.
   */
  private fillInMissingAnswers(): void {
    if (this.state.phase !== 'question') return;
    const qIdx = this.state.questionIndex;
    let answers = this.state.answers;
    let changed = false;
    for (const [pid, player] of this.state.players) {
      if (!player.isConnected) continue;
      const existing = answers.get(pid) ?? [];
      if (existing.some((a) => a.questionIndex === qIdx)) continue;
      const record: AnswerRecord = {
        questionIndex: qIdx,
        optionIndex: null,
        elapsedMs: 0,
        scoreGained: 0,
        wasCorrect: false,
      };
      if (!changed) {
        answers = new Map(this.state.answers);
        changed = true;
      }
      answers.set(pid, [...existing, record]);
    }
    if (changed) {
      this.state = { ...this.state, answers };
    }
  }

  private advancePastQuestion() {
    this.clearPhaseTimer();
    this.fillInMissingAnswers();
    this.state = advanceToReveal(this.state, Date.now());
    this.timerEndsAt = Date.now() + TIMER_REVEAL_S * 1000;
    this.broadcastPublic();
    this.phaseTimer = setTimeout(() => this.advancePastReveal(), TIMER_REVEAL_S * 1000);
  }

  private advancePastReveal() {
    this.clearPhaseTimer();
    this.state = advanceToLeaderboard(this.state, Date.now());
    this.timerEndsAt = Date.now() + TIMER_LEADERBOARD_S * 1000;
    this.broadcastPublic();
    this.phaseTimer = setTimeout(() => this.advancePastLeaderboard(), TIMER_LEADERBOARD_S * 1000);
  }

  private advancePastLeaderboard() {
    this.clearPhaseTimer();
    this.state = advanceToNextQuestion(this.state, Date.now());
    if (this.state.phase === 'final') {
      this.timerEndsAt = null;
      this.broadcastPublic();
      this.broadcastPrivates();
      return;
    }
    this.scheduleQuestionTimer();
    this.broadcastPublic();
  }

  private scheduleQuestionTimer() {
    this.clearPhaseTimer();
    this.timerEndsAt = Date.now() + TIMER_QUESTION_S * 1000;
    this.phaseTimer = setTimeout(() => {
      this.advancePastQuestion();
    }, TIMER_QUESTION_S * 1000);
  }

  private clearPhaseTimer() {
    if (this.phaseTimer) {
      clearTimeout(this.phaseTimer);
      this.phaseTimer = null;
    }
  }

  private broadcastPublic() {
    const msg: ServerMsg = { type: 'public', state: toPublicState(this.state, this.timerEndsAt) };
    this.room.broadcast(JSON.stringify(msg));
  }

  private sendPrivate(conn: Party.Connection, playerId: string) {
    const msg: ServerMsg = { type: 'private', state: toPrivateState(this.state, playerId) };
    conn.send(JSON.stringify(msg));
  }

  private broadcastPrivates() {
    for (const [connId, m] of this.conns) {
      const conn = this.room.getConnection(connId);
      if (conn) this.sendPrivate(conn, m.playerId);
    }
  }

  private sendError(conn: Party.Connection, reason: Extract<ServerMsg, { type: 'error' }>['reason']) {
    const msg: ServerMsg = { type: 'error', reason };
    conn.send(JSON.stringify(msg));
  }

  private requireHost(meta: ConnMeta, conn: Party.Connection): boolean {
    if (!meta.isHost) {
      this.sendError(conn, 'not-host');
      return false;
    }
    return true;
  }
}

function generateRoomCode(roomId: string): string {
  if (
    roomId.length === ROOM_CODE_LENGTH &&
    [...roomId.toUpperCase()].every((c) => ROOM_CODE_ALPHABET.includes(c))
  ) {
    return roomId.toUpperCase();
  }
  let h = 2166136261;
  for (let i = 0; i < roomId.length; i++) h = (h ^ roomId.charCodeAt(i)) * 16777619;
  const out: string[] = [];
  for (let i = 0; i < ROOM_CODE_LENGTH; i++) {
    h = (h >>> 0) * 1664525 + 1013904223;
    out.push(ROOM_CODE_ALPHABET[(h >>> 0) % ROOM_CODE_ALPHABET.length]);
  }
  return out.join('');
}

function makeRng(seed: string): () => number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) h = (h ^ seed.charCodeAt(i)) * 16777619;
  let t = h >>> 0;
  return () => {
    t = (t + 0x6d2b79f5) | 0;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}
