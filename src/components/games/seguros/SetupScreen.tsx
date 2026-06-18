/** @jsxImportSource preact */
import { useState } from 'preact/hooks';
import type { GameConfig } from '@/lib/games/seguros/types';
import { DEFAULT_CONFIG } from '@/lib/games/seguros/data';

interface Props {
  hasSave: boolean;
  onStart: (config: GameConfig) => void;
  onResume: () => void;
}

export default function SetupScreen({ hasSave, onStart, onResume }: Props) {
  const [numTeams, setNumTeams] = useState(DEFAULT_CONFIG.numTeams);
  const [rounds, setRounds] = useState(DEFAULT_CONFIG.rounds);
  const [startingCash, setStartingCash] = useState(DEFAULT_CONFIG.startingCash);
  const [income, setIncome] = useState(DEFAULT_CONFIG.income);

  const start = () => {
    const n = Math.max(2, Math.min(8, numTeams));
    onStart({
      ...DEFAULT_CONFIG,
      numTeams: n,
      teamNames: DEFAULT_CONFIG.teamNames.slice(0, n),
      rounds: Math.max(1, rounds),
      startingCash: Math.max(0, startingCash),
      income: Math.max(0, income),
    });
  };

  return (
    <div class="sg">
      <span class="sg__kicker">Juego de clase · proyector</span>
      <h1>Asegurados</h1>
      <p>Cada equipo decide qué seguros paga cada ronda. Cuando ocurre un imprevisto, quien
        está cubierto no paga nada; quien no, paga el daño. Gana quien acabe con más dinero…
        si la suerte acompaña.</p>

      {hasSave && (
        <p><button class="sg-btn sg-btn--ghost" onClick={onResume}>Reanudar partida guardada</button></p>
      )}

      <div class="sg-field">
        <label>Número de equipos (2–8)</label>
        <input type="number" min={2} max={8} value={numTeams}
          onInput={(e) => setNumTeams(parseInt((e.target as HTMLInputElement).value || '4', 10))} />
      </div>
      <div class="sg-field">
        <label>Rondas</label>
        <input type="number" min={1} value={rounds}
          onInput={(e) => setRounds(parseInt((e.target as HTMLInputElement).value || '10', 10))} />
      </div>
      <div class="sg-field">
        <label>Saldo inicial (€)</label>
        <input type="number" min={0} value={startingCash}
          onInput={(e) => setStartingCash(parseInt((e.target as HTMLInputElement).value || '1000', 10))} />
      </div>
      <div class="sg-field">
        <label>Ingreso por ronda (€)</label>
        <input type="number" min={0} value={income}
          onInput={(e) => setIncome(parseInt((e.target as HTMLInputElement).value || '350', 10))} />
      </div>

      <button class="sg-btn" onClick={start}>Empezar partida</button>
    </div>
  );
}
