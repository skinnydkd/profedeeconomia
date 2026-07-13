import { describe, it, expect } from 'vitest';
// stonks
import { COPY as StonksStart } from './stonks/StartScreen';
import { COPY as StonksNews } from './stonks/NewsScreen';
import { COPY as StonksAllocate } from './stonks/AllocateScreen';
import { COPY as StonksResult } from './stonks/ResultScreen';
import { COPY as StonksFinal } from './stonks/FinalScreen';
import { COPY as StonksChart } from './stonks/EvolucionChart';
// econopoly
import { COPY as EcoPolyRoot } from './econopoly/EconopolyGame';
import { COPY as EcoPolySetup } from './econopoly/SetupScreen';
import { COPY as EcoPolyPass } from './econopoly/PassDeviceScreen';
import { COPY as EcoPolyBoard } from './econopoly/BoardView';
import { COPY as EcoPolySide } from './econopoly/SidePanel';
import { COPY as EcoPolyAuction } from './econopoly/AuctionModal';
import { COPY as EcoPolyEnd } from './econopoly/EndScreen';
// econrisk
import { COPY as EcoRiskRoot } from './econrisk/EconriskGame';
import { COPY as EcoRiskSetup } from './econrisk/SetupScreen';
import { COPY as EcoRiskPass } from './econrisk/PassDeviceScreen';
import { COPY as EcoRiskMap } from './econrisk/MapView';
import { COPY as EcoRiskPhase } from './econrisk/PhaseBar';
import { COPY as EcoRiskSide } from './econrisk/SidePanel';
import { COPY as EcoRiskEnd } from './econrisk/EndScreen';
// seguros
import { COPY as SegurosSetup } from './seguros/SetupScreen';
import { COPY as SegurosCoverage } from './seguros/CoverageScreen';
import { COPY as SegurosEvent } from './seguros/EventScreen';
import { COPY as SegurosDebrief } from './seguros/DebriefScreen';
import { COPY as SegurosScore } from './seguros/Scoreboard';
// cajut (multiplayer)
import { COPY as CajPlayer } from './cajut/PlayerApp';
import { COPY as CajHostFinal } from './cajut/screens/HostFinal';
import { COPY as CajHostLanding } from './cajut/screens/HostLanding';
import { COPY as CajHostLeaderboard } from './cajut/screens/HostLeaderboardMini';
import { COPY as CajHostLobby } from './cajut/screens/HostLobby';
import { COPY as CajHostQuestion } from './cajut/screens/HostQuestion';
import { COPY as CajHostReveal } from './cajut/screens/HostReveal';
import { COPY as CajPlayerAnswer } from './cajut/screens/PlayerAnswer';
import { COPY as CajPlayerFinal } from './cajut/screens/PlayerFinal';
import { COPY as CajPlayerJoin } from './cajut/screens/PlayerJoin';
import { COPY as CajPlayerLeaderboard } from './cajut/screens/PlayerLeaderboardMini';
import { COPY as CajPlayerName } from './cajut/screens/PlayerName';
import { COPY as CajPlayerReveal } from './cajut/screens/PlayerRevealLocal';
import { COPY as CajPlayerWaitOthers } from './cajut/screens/PlayerWaitOthers';
import { COPY as CajPlayerWaiting } from './cajut/screens/PlayerWaiting';
// insider (multiplayer)
import { COPY as InsPlayer } from './insider/PlayerApp';
import { COPY as InsHost } from './insider/HostApp';
import { COPY as InsHostFinal } from './insider/screens/HostFinal';
import { COPY as InsHostGame } from './insider/screens/HostGame';
import { COPY as InsHostLobby } from './insider/screens/HostLobby';
import { COPY as InsPlayerFinal } from './insider/screens/PlayerFinal';
import { COPY as InsPlayerGuess } from './insider/screens/PlayerGuess';
import { COPY as InsPlayerJoin } from './insider/screens/PlayerJoin';
import { COPY as InsPlayerLobby } from './insider/screens/PlayerLobby';
import { COPY as InsPlayerReveal } from './insider/screens/PlayerReveal';
import { COPY as InsPlayerVote } from './insider/screens/PlayerVote';
import { COPY as InsPlayerWord } from './insider/screens/PlayerWordOrSilence';

/**
 * Every localized game-chrome island exports a `COPY = { es, ca }`. This guard
 * fails when a key is added to one language and forgotten in the other. Add
 * each island here as it is translated. Mirrors the generadores/calculadoras
 * guards. Functions (interpolated strings) count as leaf keys; array values
 * (e.g. lesson lists) count as a single leaf.
 */
const ISLANDS: [string, { es: Record<string, unknown>; ca: Record<string, unknown> }][] = [
  ['stonks/StartScreen', StonksStart],
  ['stonks/NewsScreen', StonksNews],
  ['stonks/AllocateScreen', StonksAllocate],
  ['stonks/ResultScreen', StonksResult],
  ['stonks/FinalScreen', StonksFinal],
  ['stonks/EvolucionChart', StonksChart],
  ['econopoly/EconopolyGame', EcoPolyRoot],
  ['econopoly/SetupScreen', EcoPolySetup],
  ['econopoly/PassDeviceScreen', EcoPolyPass],
  ['econopoly/BoardView', EcoPolyBoard],
  ['econopoly/SidePanel', EcoPolySide],
  ['econopoly/AuctionModal', EcoPolyAuction],
  ['econopoly/EndScreen', EcoPolyEnd],
  ['econrisk/EconriskGame', EcoRiskRoot],
  ['econrisk/SetupScreen', EcoRiskSetup],
  ['econrisk/PassDeviceScreen', EcoRiskPass],
  ['econrisk/MapView', EcoRiskMap],
  ['econrisk/PhaseBar', EcoRiskPhase],
  ['econrisk/SidePanel', EcoRiskSide],
  ['econrisk/EndScreen', EcoRiskEnd],
  ['seguros/SetupScreen', SegurosSetup],
  ['seguros/CoverageScreen', SegurosCoverage],
  ['seguros/EventScreen', SegurosEvent],
  ['seguros/DebriefScreen', SegurosDebrief],
  ['seguros/Scoreboard', SegurosScore],
  ['cajut/PlayerApp', CajPlayer],
  ['cajut/HostFinal', CajHostFinal],
  ['cajut/HostLanding', CajHostLanding],
  ['cajut/HostLeaderboardMini', CajHostLeaderboard],
  ['cajut/HostLobby', CajHostLobby],
  ['cajut/HostQuestion', CajHostQuestion],
  ['cajut/HostReveal', CajHostReveal],
  ['cajut/PlayerAnswer', CajPlayerAnswer],
  ['cajut/PlayerFinal', CajPlayerFinal],
  ['cajut/PlayerJoin', CajPlayerJoin],
  ['cajut/PlayerLeaderboardMini', CajPlayerLeaderboard],
  ['cajut/PlayerName', CajPlayerName],
  ['cajut/PlayerRevealLocal', CajPlayerReveal],
  ['cajut/PlayerWaitOthers', CajPlayerWaitOthers],
  ['cajut/PlayerWaiting', CajPlayerWaiting],
  ['insider/PlayerApp', InsPlayer],
  ['insider/HostApp', InsHost],
  ['insider/HostFinal', InsHostFinal],
  ['insider/HostGame', InsHostGame],
  ['insider/HostLobby', InsHostLobby],
  ['insider/PlayerFinal', InsPlayerFinal],
  ['insider/PlayerGuess', InsPlayerGuess],
  ['insider/PlayerJoin', InsPlayerJoin],
  ['insider/PlayerLobby', InsPlayerLobby],
  ['insider/PlayerReveal', InsPlayerReveal],
  ['insider/PlayerVote', InsPlayerVote],
  ['insider/PlayerWordOrSilence', InsPlayerWord],
];

const isRecord = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null && !Array.isArray(v);

/** Recurse into nested label maps keyed by a structural id. */
function keyPaths(obj: Record<string, unknown>, prefix = ''): string[] {
  return Object.entries(obj).flatMap(([key, value]) =>
    isRecord(value) ? keyPaths(value, `${prefix}${key}.`) : [`${prefix}${key}`],
  );
}

describe('game chrome COPY parity', () => {
  for (const [name, copy] of ISLANDS) {
    it(`${name}: es and ca have identical key sets`, () => {
      expect(keyPaths(copy.ca).sort()).toEqual(keyPaths(copy.es).sort());
    });

    it(`${name}: ca is non-empty wherever es has content`, () => {
      // Only require a ca value where es actually has text; fields that are
      // intentionally empty in both languages (e.g. a phase with no subtitle)
      // are legitimate and must not be flagged.
      const walk = (es: Record<string, unknown>, ca: Record<string, unknown>, prefix = '') => {
        for (const [key, esVal] of Object.entries(es)) {
          const caVal = ca?.[key];
          if (typeof esVal === 'function') continue;
          if (isRecord(esVal)) walk(esVal, isRecord(caVal) ? caVal : {}, `${prefix}${key}.`);
          else if (esVal) expect(caVal, `${name}.ca.${prefix}${key}`).toBeTruthy();
        }
      };
      walk(copy.es, copy.ca);
    });
  }
});
