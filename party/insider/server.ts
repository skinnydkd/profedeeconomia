// Insider PartyKit server — stub (full implementation is Task 5)
// This file is required by partykit.json to start the dev server.
import type * as Party from 'partykit/server';

export default class InsiderServer implements Party.Server {
  constructor(readonly room: Party.Room) {}

  onConnect(_connection: Party.Connection): void {
    // TODO (Task 5): handle join, assign role, broadcast state
  }

  onMessage(_message: string, _sender: Party.Connection): void {
    // TODO (Task 5): parse ClientMsg and dispatch
  }

  onClose(_connection: Party.Connection): void {
    // TODO (Task 5): handle disconnect/reconnect window
  }
}
