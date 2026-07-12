/** @jsxImportSource preact */
import type { GameState } from '@/lib/games/seguros/types';
import { debriefStats, ranking } from '@/lib/games/seguros/engine';
import { useGameLocale } from '../locale-context';
import { localizeTeamName } from '@/i18n/games/seguros-ca';

interface Props {
  state: GameState;
  onRestart: () => void;
}

export const COPY = {
  es: {
    kicker: 'Fin de la partida',
    gana: (name: string, cash: number) => `Gana ${name} con ${cash} €`,
    equipo: 'Equipo',
    saldo: 'Saldo',
    primas: 'Primas',
    danosPagados: 'Daños pagados',
    danosEvitados: 'Daños evitados',
    paraDebatir: 'Para debatir en clase',
    moraleja:
      'El seguro no sirve para ganar dinero: sirve para que un golpe de mala suerte no te arruine. De media cuesta parecido asegurarse que no hacerlo; lo que cambia es el riesgo.',
    nuevaPartida: 'Nueva partida',
    verdictSinImprevisto: 'Pagó seguros pero no tuvo ningún imprevisto: tranquilidad que no necesitó… esta vez.',
    verdictACuenta: 'Estar asegurado le salió a cuenta: evitó más de lo que pagó en primas.',
    verdictCaro: 'Pagó más en primas de lo que le habría costado el riesgo… esta partida.',
    verdictTablas: 'Quedó en tablas entre primas y daños.',
  },
  ca: {
    kicker: 'Fi de la partida',
    gana: (name: string, cash: number) => `Guanya ${name} amb ${cash} €`,
    equipo: 'Equip',
    saldo: 'Saldo',
    primas: 'Primes',
    danosPagados: 'Danys pagats',
    danosEvitados: 'Danys evitats',
    paraDebatir: 'Per a debatre a classe',
    moraleja:
      'L\'assegurança no servix per a guanyar diners: servix perquè un colp de mala sort no t\'arruïne. De mitjana costa paregut assegurar-se que no fer-ho; el que canvia és el risc.',
    nuevaPartida: 'Nova partida',
    verdictSinImprevisto: 'Va pagar segurs però no va tindre cap imprevist: tranquil·litat que no va necessitar… esta vegada.',
    verdictACuenta: 'Estar assegurat li va eixir a compte: va evitar més del que va pagar en primes.',
    verdictCaro: 'Va pagar més en primes del que li hauria costat el risc… esta partida.',
    verdictTablas: 'Va quedar en taules entre primes i danys.',
  },
};

function verdict(net: number, damages: number, c: typeof COPY['es']): string {
  if (damages === 0 && net < 0) return c.verdictSinImprevisto;
  if (net > 0) return c.verdictACuenta;
  if (net < 0) return c.verdictCaro;
  return c.verdictTablas;
}

export default function DebriefScreen({ state, onRestart }: Props) {
  const locale = useGameLocale();
  const c = COPY[locale];
  const winner = ranking(state)[0];
  const rows = debriefStats(state).sort((a, b) => b.cash - a.cash);
  return (
    <div class="sg">
      <span class="sg__kicker">{c.kicker}</span>
      <h1>{c.gana(localizeTeamName(winner.name, locale), winner.cash)}</h1>

      <table class="sg-grid">
        <thead>
          <tr><th>{c.equipo}</th><th>{c.saldo}</th><th>{c.primas}</th><th>{c.danosPagados}</th><th>{c.danosEvitados}</th></tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id}>
              <td>{localizeTeamName(r.name, locale)}</td>
              <td class="cash">{r.cash} €</td>
              <td class="prima">{r.premiums} €</td>
              <td class="prima">{r.damages} €</td>
              <td class="prima">{r.avoided} €</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>{c.paraDebatir}</h2>
      <ul>
        {rows.map((r) => <li key={r.id}><strong>{localizeTeamName(r.name, locale)}:</strong> {verdict(r.net, r.damages, c)}</li>)}
      </ul>
      <p><em>{c.moraleja}</em></p>

      <button class="sg-btn sg-btn--ghost" onClick={onRestart}>{c.nuevaPartida}</button>
    </div>
  );
}
