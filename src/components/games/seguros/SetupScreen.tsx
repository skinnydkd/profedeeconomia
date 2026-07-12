/** @jsxImportSource preact */
import { useState } from 'preact/hooks';
import type { GameConfig } from '@/lib/games/seguros/types';
import { DEFAULT_CONFIG } from '@/lib/games/seguros/data';
import { useGameLocale } from '../locale-context';

interface Props {
  hasSave: boolean;
  onStart: (config: GameConfig) => void;
  onResume: () => void;
}

export const COPY = {
  es: {
    kicker: 'Juego de clase · proyector',
    title: 'Asegurados',
    intro:
      'Cada equipo decide qué seguros paga cada ronda. Cuando ocurre un imprevisto, quien está cubierto no paga nada; quien no, paga el daño. Gana quien acabe con más dinero… si la suerte acompaña.',
    resume: 'Reanudar partida guardada',
    numTeams: 'Número de equipos (2–8)',
    rounds: 'Rondas',
    startingCash: 'Saldo inicial (€)',
    income: 'Ingreso por ronda (€)',
    start: 'Empezar partida',
  },
  ca: {
    kicker: 'Joc de classe · projector',
    title: 'Assegurats',
    intro:
      'Cada equip decidix quins segurs paga cada ronda. Quan ocorre un imprevist, qui està cobert no paga res; qui no, paga el dany. Guanya qui acabe amb més diners… si la sort acompanya.',
    resume: 'Reprén la partida guardada',
    numTeams: 'Nombre d\'equips (2–8)',
    rounds: 'Rondes',
    startingCash: 'Saldo inicial (€)',
    income: 'Ingrés per ronda (€)',
    start: 'Comença la partida',
  },
};

export default function SetupScreen({ hasSave, onStart, onResume }: Props) {
  const c = COPY[useGameLocale()];
  const [numTeams, setNumTeams] = useState(DEFAULT_CONFIG.numTeams);
  const [rounds, setRounds] = useState(DEFAULT_CONFIG.rounds);
  const [startingCash, setStartingCash] = useState(DEFAULT_CONFIG.startingCash);
  const [income, setIncome] = useState(DEFAULT_CONFIG.income);

  const num = (v: number, fallback: number) => (Number.isFinite(v) ? v : fallback);

  const start = () => {
    const n = Math.max(2, Math.min(8, num(numTeams, DEFAULT_CONFIG.numTeams)));
    onStart({
      ...DEFAULT_CONFIG,
      numTeams: n,
      teamNames: DEFAULT_CONFIG.teamNames.slice(0, n),
      rounds: Math.max(1, num(rounds, DEFAULT_CONFIG.rounds)),
      startingCash: Math.max(0, num(startingCash, DEFAULT_CONFIG.startingCash)),
      income: Math.max(0, num(income, DEFAULT_CONFIG.income)),
    });
  };

  return (
    <div class="sg">
      <span class="sg__kicker">{c.kicker}</span>
      <h1>{c.title}</h1>
      <p>{c.intro}</p>

      {hasSave && (
        <p><button class="sg-btn sg-btn--ghost" onClick={onResume}>{c.resume}</button></p>
      )}

      <div class="sg-field">
        <label>{c.numTeams}</label>
        <input type="number" min={2} max={8} value={numTeams}
          onInput={(e) => setNumTeams(parseInt((e.target as HTMLInputElement).value || '4', 10))} />
      </div>
      <div class="sg-field">
        <label>{c.rounds}</label>
        <input type="number" min={1} value={rounds}
          onInput={(e) => setRounds(parseInt((e.target as HTMLInputElement).value || '10', 10))} />
      </div>
      <div class="sg-field">
        <label>{c.startingCash}</label>
        <input type="number" min={0} value={startingCash}
          onInput={(e) => setStartingCash(parseInt((e.target as HTMLInputElement).value || '1000', 10))} />
      </div>
      <div class="sg-field">
        <label>{c.income}</label>
        <input type="number" min={0} value={income}
          onInput={(e) => setIncome(parseInt((e.target as HTMLInputElement).value || '350', 10))} />
      </div>

      <button class="sg-btn" onClick={start}>{c.start}</button>
    </div>
  );
}
