import { describe, it, expect } from 'vitest';
import { h } from 'preact';
import { renderToString } from 'preact-render-to-string';
import { createInitialState } from '@/lib/games/econopoly/engine';
import { SetupScreen } from './SetupScreen';
import { EndScreen } from './EndScreen';
import { PassDeviceScreen } from './PassDeviceScreen';

// The design tokens live under `.ep2`; a screen rendered outside it loses them
// (the «Empezar» button was white on cream in production).
const noop = () => {};
const state = createInitialState([
  { name: 'A', color: '#1F6E6E', isHuman: true },
  { name: 'B', color: '#C44E2C', isHuman: false },
]);

describe('econopoly screens render inside the .ep2 token root', () => {
  const cases: [string, () => string][] = [
    ['SetupScreen', () => renderToString(h(SetupScreen, { hasSave: false, onStart: noop, onContinue: noop }))],
    ['EndScreen', () => renderToString(h(EndScreen, { state, onRestart: noop }))],
    ['PassDeviceScreen', () => renderToString(h(PassDeviceScreen, { playerName: 'A', color: '#000', onReady: noop }))],
  ];
  for (const [name, render] of cases) {
    it(name, () => expect(render()).toMatch(/^<div class="ep2"/));
  }
});
