/** @jsxImportSource preact */
import type { GameState } from '@/lib/games/seguros/types';
import { debriefStats, ranking } from '@/lib/games/seguros/engine';

interface Props {
  state: GameState;
  onRestart: () => void;
}

function verdict(net: number, damages: number): string {
  if (damages === 0 && net < 0) return 'Pagó seguros pero no tuvo ningún imprevisto: tranquilidad que no necesitó… esta vez.';
  if (net > 0) return 'Estar asegurado le salió a cuenta: evitó más de lo que pagó en primas.';
  if (net < 0) return 'Pagó más en primas de lo que le habría costado el riesgo… esta partida.';
  return 'Quedó en tablas entre primas y daños.';
}

export default function DebriefScreen({ state, onRestart }: Props) {
  const winner = ranking(state)[0];
  const rows = debriefStats(state).sort((a, b) => b.cash - a.cash);
  return (
    <div class="sg">
      <span class="sg__kicker">Fin de la partida</span>
      <h1>Gana {winner.name} con {winner.cash} €</h1>

      <table class="sg-grid">
        <thead>
          <tr><th>Equipo</th><th>Saldo</th><th>Primas</th><th>Daños pagados</th><th>Daños evitados</th></tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id}>
              <td>{r.name}</td>
              <td class="cash">{r.cash} €</td>
              <td class="prima">{r.premiums} €</td>
              <td class="prima">{r.damages} €</td>
              <td class="prima">{r.avoided} €</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Para debatir en clase</h2>
      <ul>
        {rows.map((r) => <li key={r.id}><strong>{r.name}:</strong> {verdict(r.net, r.damages)}</li>)}
      </ul>
      <p><em>El seguro no sirve para ganar dinero: sirve para que un golpe de mala suerte no te
        arruine. De media cuesta parecido asegurarse que no hacerlo; lo que cambia es el riesgo.</em></p>

      <button class="sg-btn sg-btn--ghost" onClick={onRestart}>Nueva partida</button>
    </div>
  );
}
