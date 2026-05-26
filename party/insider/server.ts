// Insider PartyKit server — full implementation (Task 5)
//
// Timer strategy: plain setTimeout / clearTimeout.
// PartyKit v0.0.115 in dev mode runs inside a Node-compatible DO emulation that supports
// native setTimeout. For production (Cloudflare DO), the Cloudflare runtime also supports
// setTimeout inside DO handlers, so plain timers are fine at this scale (classroom use,
// dozens of rooms). If we ever need durability across restarts, migrate to
// this.room.storage.setAlarm / onAlarm. Documented here so future maintainers know the trade-off.
//
// Reconnect behaviour: when onClose fires, the player is marked disconnected but remains in
// the roster. A cleanup timer fires after RECONNECT_WINDOW_MS; if they haven't rejoined, they
// are removed. When a join msg arrives with an existing playerId, the old conn.id → new conn.id
// mapping is updated (reconnect path).
//
// Host disconnection: the host connection id is tracked. On close, hostConnId is cleared.
// The first player who sends join with asHost:true, while no host conn exists, reclaims the host
// seat. If the host's playerId reconnects, they automatically reclaim it.

import type * as Party from 'partykit/server';
import type { ClientMsg, PublicState, PrivateState, ServerMsg } from '../../src/lib/games-multi/insider/types';
import {
  createLobby,
  startRound,
  applyVote,
  tallyAndEliminate,
  applyGuess,
  advanceToNextRound,
  advanceSpeaker,
  isFinished,
} from './state';
import type { GameState, TallyResult } from './state';
import {
  MIN_PLAYERS,
  TIMER_SHOW_WORD_S,
  TIMER_DISCUSSION_PER_PLAYER_S,
  TIMER_GUESS_S,
  TIMER_VOTING_S,
  impostorCountFor,
} from './constants';

// ----- Internal types -------------------------------------------------------

interface PlayerMeta {
  id: string;          // playerId (game identity)
  name: string;
  connId: string;      // current Party.Connection.id (changes on reconnect)
  connected: boolean;
  isHost: boolean;
}

const RECONNECT_WINDOW_MS = 120_000; // 2 minutes

// ----- Server ---------------------------------------------------------------

export default class InsiderServer implements Party.Server {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly options: Party.ServerOptions = { hibernate: false };

  constructor(readonly room: Party.Room) {}

  // --- State ---
  private state: GameState = createLobby();
  // playerId → PlayerMeta
  private players: Map<string, PlayerMeta> = new Map();
  // connId → playerId (fast reverse lookup)
  private connToPlayer: Map<string, string> = new Map();
  // playerId of the host (game identity, not connId)
  private hostPlayerId: string | null = null;
  // Active phase timer handle
  private phaseTimer: ReturnType<typeof setTimeout> | null = null;
  // Reconnect cleanup timers: playerId → timeout
  private reconnectTimers: Map<string, ReturnType<typeof setTimeout>> = new Map();
  // Pending tally result (stored so guess handler can apply bonus scoring)
  private pendingTally: TallyResult | null = null;

  // --- Helpers ----------------------------------------------------------------

  /** Send a typed ServerMsg to a specific connection. */
  private sendTo(connId: string, msg: ServerMsg): void {
    const conn = this.room.getConnection(connId);
    if (conn) conn.send(JSON.stringify(msg));
  }

  /** Send error to a connection. */
  private sendError(connId: string, reason: string): void {
    this.sendTo(connId, { type: 'error', reason });
  }

  /** Compute PublicState and broadcast to all connections. */
  private broadcastPublic(): void {
    const pub = this.toPublicState();
    this.room.broadcast(JSON.stringify({ type: 'public', state: pub } satisfies ServerMsg));
  }

  /** Send PrivateState to a specific player by playerId. */
  private sendPrivate(playerId: string): void {
    const meta = this.players.get(playerId);
    if (!meta || !meta.connected) return;
    const priv = this.toPrivateState(playerId);
    this.sendTo(meta.connId, { type: 'private', state: priv });
  }

  /** Send PrivateState to ALL connected players. */
  private broadcastPrivates(): void {
    for (const [playerId] of this.players) {
      this.sendPrivate(playerId);
    }
  }

  // --- State projection -------------------------------------------------------

  private toPublicState(): PublicState {
    const gs = this.state;
    const currentSpeakerId = gs.speakerOrder[gs.currentSpeakerIndex] ?? null;

    const players = Object.values(gs.players).map((p) => ({
      id: p.id,
      name: p.name,
      alive: p.alive,
      hasVoted: p.hasVoted,
      turnDone: p.turnDone,
      score: p.score,
    }));

    let finalRanking: PublicState['finalRanking'] = null;
    if (gs.phase === 'finished') {
      finalRanking = [...players]
        .sort((a, b) => b.score - a.score)
        .map(({ id, name, score }) => ({ id, name, score }));
    }

    // Word is revealed to everyone only in finished phase (or could be revealed after reveal)
    const wordPublic = gs.phase === 'finished' ? gs.word : null;

    return {
      phase: gs.phase,
      round: gs.round,
      totalRounds: gs.totalRounds,
      impostorCount: gs.impostorCount,
      players,
      currentSpeakerId,
      speakerOrder: gs.speakerOrder,
      timerEndsAt: null, // set by callers that schedule timers
      votesCast: Object.keys(gs.votes).length,
      lastReveal: null,  // updated by callers
      lastGuess: null,   // updated by callers
      word: wordPublic,
      finalRanking,
    };
  }

  private toPrivateState(playerId: string): PrivateState {
    const gs = this.state;
    const meta = this.players.get(playerId);
    const isImpostor = gs.impostors.has(playerId);
    const isHost = meta?.isHost ?? false;

    // Impostors don't receive the word; host (not in gs.players) also doesn't receive it
    const playerState = gs.players[playerId];
    const isParticipant = playerState !== undefined; // host is not a participant
    const word = (isParticipant && !isImpostor) ? (gs.word ?? null) : null;

    // canVote: only alive game participants during voting phase (host cannot vote)
    const alive = playerState?.alive ?? false;
    const canVote = gs.phase === 'voting' && isParticipant && alive && !(playerId in gs.votes);

    // canGuess: only the caught impostor in guess phase
    const canGuess =
      gs.phase === 'guess' &&
      isImpostor &&
      this.pendingTally?.eliminatedId === playerId &&
      this.pendingTally?.wasImpostor === true;

    return {
      myId: playerId,
      role: isImpostor ? 'impostor' : 'citizen',
      word,
      canVote,
      canGuess,
      isHost,
    };
  }

  // --- Timer management -------------------------------------------------------

  private clearPhaseTimer(): void {
    if (this.phaseTimer !== null) {
      clearTimeout(this.phaseTimer);
      this.phaseTimer = null;
    }
  }

  /**
   * Schedules a timer for the current phase.
   * Returns the unix ms timestamp when it will fire (for timerEndsAt in PublicState).
   */
  private scheduleTimer(ms: number, callback: () => void): number {
    this.clearPhaseTimer();
    const endsAt = Date.now() + ms;
    this.phaseTimer = setTimeout(callback, ms);
    return endsAt;
  }

  // --- Broadcast with timer ---------------------------------------------------

  private broadcastPublicWithTimer(timerEndsAt: number | null, overrides?: Partial<PublicState>): void {
    const pub: PublicState = { ...this.toPublicState(), timerEndsAt, ...overrides };
    this.room.broadcast(JSON.stringify({ type: 'public', state: pub } satisfies ServerMsg));
  }

  // --- Phase transitions -------------------------------------------------------

  private advanceToDiscussion(timerOverride?: number): void {
    this.state = { ...this.state, phase: 'discussion' };

    if (timerOverride === 0 || this.state.speakerOrder.length === 0) {
      // Immediate: no per-speaker rotation (e.g. host force-advanced with timerOverride=0)
      this.broadcastPublicWithTimer(null);
      this.broadcastPrivates();
      return;
    }

    // Per-speaker rotation: schedule each speaker's slot individually.
    this.scheduleNextSpeaker();
  }

  /** Schedules a timer for the current speaker. On expiry: advance to next speaker or voting. */
  private scheduleNextSpeaker(): void {
    const perPlayerMs = TIMER_DISCUSSION_PER_PLAYER_S * 1000;
    const { currentSpeakerIndex, speakerOrder } = this.state;

    if (currentSpeakerIndex >= speakerOrder.length) {
      // All speakers done — move to voting
      this.advanceToVoting();
      return;
    }

    const endsAt = this.scheduleTimer(perPlayerMs, () => {
      // Advance speaker in state
      this.state = advanceSpeaker(this.state);

      if (this.state.currentSpeakerIndex >= this.state.speakerOrder.length) {
        // Last speaker done → voting
        this.advanceToVoting();
      } else {
        // More speakers remaining → reschedule for next speaker
        this.scheduleNextSpeaker();
      }
    });

    this.broadcastPublicWithTimer(endsAt);
    this.broadcastPrivates();
  }

  private advanceToVoting(): void {
    this.clearPhaseTimer();
    this.state = { ...this.state, phase: 'voting' };
    // Schedule auto-tally timer so the round can't stall if students don't all vote
    const endsAt = this.scheduleTimer(TIMER_VOTING_S * 1000, () => this.forceTally());
    this.broadcastPublicWithTimer(endsAt);
    this.broadcastPrivates();
  }

  /** Auto-tallies votes when the voting timer expires (or host force-advances). */
  private forceTally(): void {
    this.clearPhaseTimer();
    const tally = tallyAndEliminate(this.state);

    if (tally.eliminatedId === null) {
      // No votes at all — skip to next round without scoring
      this.doReveal(tally);
      return;
    }

    this.pendingTally = tally;
    if (tally.wasImpostor) {
      this.state = tally.state;
      const capturedTally = tally;
      const endsAt = this.scheduleTimer(TIMER_GUESS_S * 1000, () => {
        this.pendingTally = null;
        this.doReveal(capturedTally, { guess: '', correct: false });
      });
      this.broadcastPublicWithTimer(endsAt);
      this.broadcastPrivates();
    } else {
      this.doReveal(tally);
    }
  }

  private doReveal(tally: TallyResult, guessResult?: { guess: string; correct: boolean }): void {
    this.state = { ...tally.state, phase: 'reveal' };
    this.pendingTally = null;

    const pub: PublicState = {
      ...this.toPublicState(),
      timerEndsAt: null,
      // null eliminatedId means no one was eliminated (0-vote or all-dead-target scenario)
      lastReveal: tally.eliminatedId !== null
        ? { eliminatedId: tally.eliminatedId, wasImpostor: tally.wasImpostor }
        : null,
      lastGuess: guessResult ?? null,
      // Reveal the word when impostor is caught
      word: tally.wasImpostor ? (this.state.word ?? null) : null,
    };
    this.room.broadcast(JSON.stringify({ type: 'public', state: pub } satisfies ServerMsg));
    this.broadcastPrivates();

    // Auto-advance after 5s to next round / finished
    this.scheduleTimer(5_000, () => {
      if (isFinished(this.state)) {
        this.state = { ...this.state, phase: 'finished' };
        this.broadcastPublicWithTimer(null);
      } else {
        this.state = advanceToNextRound(this.state, Math.random);
        const endsAt = this.scheduleTimer(TIMER_SHOW_WORD_S * 1000, () => this.advanceToDiscussion());
        this.broadcastPublicWithTimer(endsAt);
        this.broadcastPrivates();
      }
    });
  }

  // --- Connection lifecycle ----------------------------------------------------

  async onConnect(conn: Party.Connection, ctx: Party.ConnectionContext): Promise<void> {
    // Parse query params from the request URL
    const url = new URL(ctx.request.url);
    const playerId = url.searchParams.get('playerId') ?? conn.id;
    const name = url.searchParams.get('name') ?? 'Jugador';
    const asHost = url.searchParams.get('asHost') === '1' || url.searchParams.get('asHost') === 'true';

    // Store playerId on the connection state for later lookups
    conn.setState({ playerId, name, asHost });

    // If we already know this player (reconnect), update connId immediately
    const existingMeta = this.players.get(playerId);
    if (existingMeta) {
      // Cancel any pending removal timer
      const removalTimer = this.reconnectTimers.get(playerId);
      if (removalTimer !== undefined) {
        clearTimeout(removalTimer);
        this.reconnectTimers.delete(playerId);
      }
      // Remove old connId mapping
      this.connToPlayer.delete(existingMeta.connId);
      // Update with new connection
      existingMeta.connId = conn.id;
      existingMeta.connected = true;
      // Reclaim host if this was the host
      if (existingMeta.isHost) this.hostPlayerId = playerId;

      this.connToPlayer.set(conn.id, playerId);

      // Send current state
      this.sendPrivate(playerId);
      const pub = this.toPublicState();
      this.sendTo(conn.id, { type: 'public', state: pub });
      return;
    }

    // New connection — register with a placeholder (will be confirmed by join msg)
    this.connToPlayer.set(conn.id, playerId);
    // Don't add to players map yet; wait for explicit join message with name.
    // But if name is in query (client auto-sends join), we can pre-register.
    // We pre-register here so that reconnect from onConnect (without waiting for message) works.
    if (name && name !== 'Jugador') {
      this.registerPlayer(conn.id, playerId, name, asHost);
      this.sendPrivate(playerId);
      this.broadcastPublic();
    }
    // If name is missing, the client will send a join message shortly.
  }

  async onMessage(message: string, sender: Party.Connection): Promise<void> {
    let msg: ClientMsg;
    try {
      msg = JSON.parse(message as string) as ClientMsg;
    } catch {
      this.sendError(sender.id, 'Invalid JSON');
      return;
    }

    const playerId = this.connToPlayer.get(sender.id)
      ?? (sender.state as { playerId?: string } | null)?.playerId
      ?? sender.id;

    switch (msg.type) {
      case 'join':
        this.handleJoin(sender.id, msg.playerId ?? playerId, msg.name, msg.asHost ?? false);
        break;

      case 'startGame':
        this.handleStartGame(sender.id, playerId, msg.totalRounds, msg.impostorCountOverride);
        break;

      case 'advancePhase':
        this.handleAdvancePhase(sender.id, playerId);
        break;

      case 'vote':
        this.handleVote(sender.id, playerId, msg.targetId);
        break;

      case 'guess':
        this.handleGuess(sender.id, playerId, msg.word);
        break;

      case 'restart':
        this.handleRestart(sender.id, playerId);
        break;

      default:
        this.sendError(sender.id, 'Unknown message type');
    }
  }

  async onClose(conn: Party.Connection): Promise<void> {
    const playerId = this.connToPlayer.get(conn.id)
      ?? (conn.state as { playerId?: string } | null)?.playerId;

    if (!playerId) {
      this.connToPlayer.delete(conn.id);
      return;
    }

    const meta = this.players.get(playerId);
    if (meta) {
      meta.connected = false;
      if (meta.isHost) {
        // Host disconnected — clear hostConnId but keep hostPlayerId so they can reclaim
        // (any other player with asHost can claim while host is away)
      }

      // Start reconnect cleanup window
      const timer = setTimeout(() => {
        // If they haven't reconnected, remove from roster
        const current = this.players.get(playerId);
        if (current && !current.connected) {
          this.players.delete(playerId);
          this.connToPlayer.delete(conn.id);
          this.reconnectTimers.delete(playerId);
          // If this was the host, clear hostPlayerId
          if (this.hostPlayerId === playerId) this.hostPlayerId = null;
          // Update game state if mid-game
          if (this.state.phase !== 'lobby' && this.state.players[playerId]) {
            // Remove from game state — mark as dead (simplification for disconnected players)
            this.state = {
              ...this.state,
              players: {
                ...this.state.players,
                [playerId]: { ...this.state.players[playerId]!, alive: false },
              },
            };
          }
          this.broadcastPublic();
        }
      }, RECONNECT_WINDOW_MS);

      this.reconnectTimers.set(playerId, timer);
    }

    this.connToPlayer.delete(conn.id);
  }

  // --- Message handlers -------------------------------------------------------

  private handleJoin(connId: string, playerId: string, name: string, asHost: boolean): void {
    // Reconnect: player already exists
    const existing = this.players.get(playerId);
    if (existing) {
      // Cancel removal timer if pending
      const removalTimer = this.reconnectTimers.get(playerId);
      if (removalTimer !== undefined) {
        clearTimeout(removalTimer);
        this.reconnectTimers.delete(playerId);
      }
      // Update connection
      this.connToPlayer.delete(existing.connId);
      existing.connId = connId;
      existing.connected = true;
      existing.name = name; // allow name update on reconnect
      this.connToPlayer.set(connId, playerId);

      // Reclaim host seat if original host reconnects or if no host and asHost requested
      if (existing.isHost || (asHost && !this.hostPlayerId)) {
        existing.isHost = true;
        this.hostPlayerId = playerId;
      }

      // Also ensure game state has this player's name synced
      if (this.state.players[playerId]) {
        this.state = {
          ...this.state,
          players: {
            ...this.state.players,
            [playerId]: { ...this.state.players[playerId]!, name },
          },
        };
      }

      this.sendPrivate(playerId);
      this.sendTo(connId, { type: 'public', state: this.toPublicState() });
      return;
    }

    // New player
    if (this.state.phase !== 'lobby') {
      this.sendError(connId, 'Game already in progress');
      return;
    }

    this.registerPlayer(connId, playerId, name, asHost);
    this.sendPrivate(playerId);
    this.broadcastPublic();
  }

  private registerPlayer(connId: string, playerId: string, name: string, asHost: boolean): void {
    // Claim host seat if none yet and asHost requested
    const becomeHost = asHost && !this.hostPlayerId;
    if (becomeHost) this.hostPlayerId = playerId;

    const meta: PlayerMeta = {
      id: playerId,
      name,
      connId,
      connected: true,
      isHost: becomeHost,
    };
    this.players.set(playerId, meta);
    this.connToPlayer.set(connId, playerId);

    // The host is only an orchestrator — do NOT add them to state.players.
    // state.players contains only actual game participants (students).
    if (becomeHost) return;

    // Add student to game state
    this.state = {
      ...this.state,
      players: {
        ...this.state.players,
        [playerId]: {
          id: playerId,
          name,
          alive: true,
          hasVoted: false,
          turnDone: false,
          score: 0,
        },
      },
    };
  }

  private handleStartGame(
    connId: string,
    playerId: string,
    totalRounds: number,
    impostorCountOverride?: number,
  ): void {
    if (!this.isHost(playerId)) {
      this.sendError(connId, 'Only the host can start the game');
      return;
    }
    if (this.state.phase !== 'lobby') {
      this.sendError(connId, 'Game already started');
      return;
    }

    const playerCount = Object.keys(this.state.players).length;
    if (playerCount < MIN_PLAYERS) {
      this.sendError(connId, `Not enough players (minimum ${MIN_PLAYERS})`);
      return;
    }

    // Configure and start
    const defaultImpostorCount = impostorCountFor(playerCount);
    const impostorCount = impostorCountOverride ?? defaultImpostorCount;

    this.state = {
      ...this.state,
      totalRounds: Math.max(1, totalRounds),
      impostorCount: Math.min(impostorCount, Math.floor(playerCount / 2)),
    };

    this.state = startRound(this.state, Math.random);

    // Schedule show_word → discussion timer
    const endsAt = this.scheduleTimer(TIMER_SHOW_WORD_S * 1000, () => this.advanceToDiscussion());

    this.broadcastPublicWithTimer(endsAt);
    this.broadcastPrivates();
  }

  private handleAdvancePhase(connId: string, playerId: string): void {
    if (!this.isHost(playerId)) {
      this.sendError(connId, 'Only the host can advance the phase');
      return;
    }

    this.clearPhaseTimer();

    switch (this.state.phase) {
      case 'show_word':
        this.advanceToDiscussion(0); // immediate
        break;
      case 'discussion':
        this.advanceToVoting();
        break;
      case 'voting': {
        // Force-tally with current votes (reuse same path as timer expiry)
        this.forceTally();
        break;
      }
      case 'reveal':
        // Skip the auto-advance timer
        this.clearPhaseTimer();
        if (isFinished(this.state)) {
          this.state = { ...this.state, phase: 'finished' };
          this.broadcastPublicWithTimer(null);
        } else {
          this.state = advanceToNextRound(this.state, Math.random);
          const endsAt = this.scheduleTimer(TIMER_SHOW_WORD_S * 1000, () => this.advanceToDiscussion());
          this.broadcastPublicWithTimer(endsAt);
          this.broadcastPrivates();
        }
        break;
      default:
        this.sendError(connId, `Cannot advance from phase: ${this.state.phase}`);
    }
  }

  private handleVote(connId: string, playerId: string, targetId: string): void {
    if (this.state.phase !== 'voting') {
      this.sendError(connId, 'Not in voting phase');
      return;
    }
    const playerState = this.state.players[playerId];
    if (!playerState?.alive) {
      this.sendError(connId, 'Dead players cannot vote');
      return;
    }
    if (playerId in this.state.votes) {
      this.sendError(connId, 'Already voted');
      return;
    }
    if (!this.state.players[targetId]?.alive) {
      this.sendError(connId, 'Cannot vote for a dead player');
      return;
    }

    this.state = applyVote(this.state, playerId, targetId);

    // Mark hasVoted in player state
    this.state = {
      ...this.state,
      players: {
        ...this.state.players,
        [playerId]: { ...this.state.players[playerId]!, hasVoted: true },
      },
    };

    // Check if all alive players have voted
    const alivePlayers = Object.values(this.state.players).filter((p) => p.alive);
    const allVoted = alivePlayers.every((p) => p.id in this.state.votes);

    if (allVoted) {
      // All alive players voted — cancel the voting timer and tally immediately
      this.forceTally();
    } else {
      // Partial votes broadcast
      this.broadcastPublicWithTimer(null);
    }
  }

  private handleGuess(connId: string, playerId: string, word: string): void {
    if (this.state.phase !== 'guess') {
      this.sendError(connId, 'Not in guess phase');
      return;
    }
    if (!this.pendingTally) {
      this.sendError(connId, 'No pending tally');
      return;
    }
    if (this.pendingTally.eliminatedId !== playerId) {
      this.sendError(connId, 'Only the eliminated impostor can guess');
      return;
    }

    this.clearPhaseTimer();

    const { state: stateAfterGuess, guessCorrect } = applyGuess(this.state, word);
    this.state = stateAfterGuess;

    // Apply guess bonus scoring if correct
    if (guessCorrect) {
      const impostorId = playerId;
      this.state = {
        ...this.state,
        players: {
          ...this.state.players,
          [impostorId]: {
            ...this.state.players[impostorId]!,
            score: (this.state.players[impostorId]?.score ?? 0) + 150, // SCORE_IMPOSTOR_GUESS_CORRECT
          },
        },
      };
    }

    const savedTally = this.pendingTally;
    this.doReveal(savedTally, { guess: word, correct: guessCorrect });
  }

  private handleRestart(connId: string, playerId: string): void {
    if (!this.isHost(playerId)) {
      this.sendError(connId, 'Only the host can restart');
      return;
    }

    this.clearPhaseTimer();
    this.pendingTally = null;

    // Preserve current roster (names + scores optionally reset)
    const freshLobby = createLobby();
    const preservedPlayers = Object.fromEntries(
      Object.values(this.state.players).map((p) => [
        p.id,
        { ...p, alive: true, hasVoted: false, turnDone: false, score: 0 },
      ]),
    );

    this.state = {
      ...freshLobby,
      players: preservedPlayers,
      totalRounds: this.state.totalRounds,
      impostorCount: this.state.impostorCount,
    };

    this.broadcastPublic();
    this.broadcastPrivates();
  }

  // --- Helpers ----------------------------------------------------------------

  private isHost(playerId: string): boolean {
    return this.hostPlayerId === playerId;
  }
}
