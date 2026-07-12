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

    it(`${name}: no ca value is empty`, () => {
      const walk = (obj: Record<string, unknown>, prefix = '') => {
        for (const [key, value] of Object.entries(obj)) {
          if (typeof value === 'function') continue;
          if (isRecord(value)) walk(value, `${prefix}${key}.`);
          else expect(value, `${name}.ca.${prefix}${key}`).toBeTruthy();
        }
      };
      walk(copy.ca);
    });
  }
});
