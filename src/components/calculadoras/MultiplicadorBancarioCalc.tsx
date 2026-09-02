/** @jsxImportSource preact */
import { useMemo, useState } from 'preact/hooks';
import { type Locale } from '@/i18n/locale';
import { formatEUR, formatNumber } from '../../lib/calc/format';
import { creacion, rondas } from '../../lib/calc/multiplicador-bancario';

/**
 * UI strings, Valencian (AVL) alongside the ES source. Monetary aggregate
 * names (M1, M3) and € are not translated.
 */
export const COPY = {
  es: {
    entradaTitulo: 'El depósito de partida',
    deposito: 'Depósito inicial (€)',
    coeficiente: 'Coeficiente de caja (%)',
    filtracion: 'Filtración de efectivo (%)',
    filtracionAyuda: 'Qué parte de cada préstamo se queda en efectivo en el bolsillo de la gente y no vuelve al banco como depósito. Con 0 % se obtiene el multiplicador clásico de los manuales.',
    sinDatos: 'Con estos datos el proceso no converge. El coeficiente de caja y la filtración no pueden ser los dos cero: si nada sale del circuito, la creación de dinero no tendría fin.',
    multiplicador: 'Multiplicador de los depósitos',
    depositosTotales: 'Depósitos totales del sistema',
    dineroCreado: 'Dinero creado por los bancos',
    reservas: 'Reservas inmovilizadas',
    prestamos: 'Préstamos concedidos',
    efectivo: 'Efectivo en manos del público',
    ofertaMonetaria: 'Dinero total en circulación',
    lecturaBase: 'De cada euro depositado, el banco guarda una parte y presta el resto. Ese resto vuelve a depositarse en otro banco, que guarda una parte y presta el resto, y así sucesivamente. Ningún banco crea dinero por su cuenta: lo crea el sistema entero, ronda a ronda.',
    lecturaReservas: 'Fíjate en que las reservas totales acaban coincidiendo con el depósito inicial: todo el dinero de partida termina inmovilizado, y lo que circula por encima son depósitos creados.',
    lecturaFiltracion: 'Con filtración de efectivo el proceso se apaga antes: cada ronda pierde por dos sitios, el coeficiente de caja y el dinero que la gente se queda en el bolsillo.',
    tablaTitulo: 'Las primeras rondas',
    colRonda: 'Ronda',
    colDeposito: 'Depósito',
    colReservas: 'Reservas',
    colPrestamo: 'Préstamo',
    colEfectivo: 'Efectivo',
    tablaPie: 'Cada ronda es la anterior multiplicada por (1 − coeficiente) · (1 − filtración). La suma de infinitas rondas es el total de arriba.',
    limitesTitulo: 'Los límites del modelo',
    limites: 'El modelo supone que los bancos prestan todo lo que pueden y que el dinero prestado se deposita de nuevo. Cuando la economía va mal las dos cosas fallan: los bancos guardan reservas de más y hay menos gente pidiendo crédito. Por eso el banco central puede ampliar la base monetaria sin que la cantidad de dinero crezca lo que dice la fórmula.',
    presets: 'Ejemplos',
    presetManual: 'Manual clásico (10 %)',
    presetBCE: 'Coeficiente del BCE (1 %)',
    presetFiltracion: 'Con filtración de efectivo',
    comoSeCalcula: 'Cómo se calcula',
    formulaMultTitle: 'Multiplicador',
    formulaMultDesc: ': 1 / (1 − (1 − r)(1 − f)), donde r es el coeficiente de caja y f la filtración de efectivo. Con f = 0 queda el clásico 1 / r.',
    formulaDepTitle: 'Depósitos totales',
    formulaDepDesc: ': depósito inicial × multiplicador.',
    formulaCreadoTitle: 'Dinero creado',
    formulaCreadoDesc: ': depósitos totales − depósito inicial. El depósito de partida ya existía; lo demás no.',
    formulaOfertaTitle: 'Dinero en circulación',
    formulaOfertaDesc: ': depósitos totales + efectivo en manos del público.',
  },
  ca: {
    entradaTitulo: 'El depòsit de partida',
    deposito: 'Depòsit inicial (€)',
    coeficiente: 'Coeficient de caixa (%)',
    filtracion: "Filtració d'efectiu (%)",
    filtracionAyuda: "Quina part de cada préstec es queda en efectiu a la butxaca de la gent i no torna al banc com a depòsit. Amb 0 % s'obté el multiplicador clàssic dels manuals.",
    sinDatos: 'Amb estes dades el procés no convergix. El coeficient de caixa i la filtració no poden ser els dos zero: si res ix del circuit, la creació de diners no tindria fi.',
    multiplicador: 'Multiplicador dels depòsits',
    depositosTotales: 'Depòsits totals del sistema',
    dineroCreado: 'Diners creats pels bancs',
    reservas: 'Reserves immobilitzades',
    prestamos: 'Préstecs concedits',
    efectivo: 'Efectiu en mans del públic',
    ofertaMonetaria: 'Diners totals en circulació',
    lecturaBase: 'De cada euro depositat, el banc en guarda una part i presta la resta. Eixa resta torna a depositar-se en un altre banc, que en guarda una part i presta la resta, i així successivament. Cap banc crea diners pel seu compte: els crea el sistema sencer, ronda a ronda.',
    lecturaReservas: "Fixa-t'hi: les reserves totals acaben coincidint amb el depòsit inicial. Tots els diners de partida acaben immobilitzats, i el que circula per damunt són depòsits creats.",
    lecturaFiltracion: "Amb filtració d'efectiu el procés s'apaga abans: cada ronda perd per dos llocs, el coeficient de caixa i els diners que la gent es queda a la butxaca.",
    tablaTitulo: 'Les primeres rondes',
    colRonda: 'Ronda',
    colDeposito: 'Depòsit',
    colReservas: 'Reserves',
    colPrestamo: 'Préstec',
    colEfectivo: 'Efectiu',
    tablaPie: "Cada ronda és l'anterior multiplicada per (1 − coeficient) · (1 − filtració). La suma d'infinites rondes és el total de dalt.",
    limitesTitulo: 'Els límits del model',
    limites: "El model suposa que els bancs presten tot el que poden i que els diners prestats es depositen de nou. Quan l'economia va malament les dues coses fallen: els bancs guarden reserves de més i hi ha menys gent demanant crèdit. Per això el banc central pot ampliar la base monetària sense que la quantitat de diners cresca el que diu la fórmula.",
    presets: 'Exemples',
    presetManual: 'Manual clàssic (10 %)',
    presetBCE: 'Coeficient del BCE (1 %)',
    presetFiltracion: "Amb filtració d'efectiu",
    comoSeCalcula: 'Com es calcula',
    formulaMultTitle: 'Multiplicador',
    formulaMultDesc: ": 1 / (1 − (1 − r)(1 − f)), on r és el coeficient de caixa i f la filtració d'efectiu. Amb f = 0 queda el clàssic 1 / r.",
    formulaDepTitle: 'Depòsits totals',
    formulaDepDesc: ': depòsit inicial × multiplicador.',
    formulaCreadoTitle: 'Diners creats',
    formulaCreadoDesc: ': depòsits totals − depòsit inicial. El depòsit de partida ja existia; la resta no.',
    formulaOfertaTitle: 'Diners en circulació',
    formulaOfertaDesc: ": depòsits totals + efectiu en mans del públic.",
  },
} as const;

interface Props { locale?: Locale }

const num = (e: Event) => parseFloat((e.target as HTMLInputElement).value) || 0;

/**
 * Money creation by the banking system.
 *
 * The point of the round-by-round table next to the closed form is that no
 * single bank ever creates money: the geometric series does.
 *
 * Eco 1BACH · Unit 10.
 */
export default function MultiplicadorBancarioCalc({ locale = 'es' }: Props) {
  const t = COPY[locale];

  const [deposito, setDeposito] = useState<number>(1000);
  const [coefPct, setCoefPct] = useState<number>(10);
  const [filtPct, setFiltPct] = useState<number>(0);

  const r = coefPct / 100;
  const f = filtPct / 100;

  const total = useMemo(() => creacion(deposito, r, f), [deposito, r, f]);
  const filas = useMemo(() => rondas(deposito, r, f, 8), [deposito, r, f]);

  const maxDeposito = filas.length > 0 ? filas[0].deposito : 1;

  return (
    <div class="calc">
      <div class="calc__presets">
        <button type="button" class="calc__btn calc__btn--ghost"
          onClick={() => { setDeposito(1000); setCoefPct(10); setFiltPct(0); }}>{t.presetManual}</button>
        <button type="button" class="calc__btn calc__btn--ghost"
          onClick={() => { setDeposito(1000); setCoefPct(1); setFiltPct(0); }}>{t.presetBCE}</button>
        <button type="button" class="calc__btn calc__btn--ghost"
          onClick={() => { setDeposito(1000); setCoefPct(10); setFiltPct(15); }}>{t.presetFiltracion}</button>
      </div>

      <div class="mb__label">{t.entradaTitulo}</div>
      <div class="calc__form mb__row">
        <label class="calc__field">
          <span class="calc__label">{t.deposito}</span>
          <div class="calc__input-wrap">
            <input type="number" min={1} step={100} value={deposito} onInput={(e) => setDeposito(num(e))} />
          </div>
        </label>
        <label class="calc__field">
          <span class="calc__label">{t.coeficiente}</span>
          <div class="calc__input-wrap">
            <input type="number" min={0} max={100} step={1} value={coefPct} onInput={(e) => setCoefPct(num(e))} />
          </div>
        </label>
        <label class="calc__field">
          <span class="calc__label">{t.filtracion}</span>
          <div class="calc__input-wrap">
            <input type="number" min={0} max={99} step={5} value={filtPct} onInput={(e) => setFiltPct(num(e))} />
          </div>
        </label>
      </div>
      <p class="mb__note">{t.filtracionAyuda}</p>

      <div class="calc__results">
        {!total.valido ? (
          <div class="calc__warning">{t.sinDatos}</div>
        ) : (
          <>
            <div class="calc__metric-grid calc__metric-grid--three">
              <div class="calc__metric-mini">
                <span class="calc__metric-mini-label">{t.multiplicador}</span>
                <span class="calc__metric-mini-value">× {formatNumber(total.multiplicador, 2)}</span>
              </div>
              <div class="calc__metric-mini">
                <span class="calc__metric-mini-label">{t.depositosTotales}</span>
                <span class="calc__metric-mini-value">{formatEUR(total.depositosTotales, 0)}</span>
              </div>
              <div class="calc__metric-mini">
                <span class="calc__metric-mini-label">{t.dineroCreado}</span>
                <span class="calc__metric-mini-value ok">{formatEUR(total.dineroCreado, 0)}</span>
              </div>
            </div>

            <div class="calc__metric-grid calc__metric-grid--three">
              <div class="calc__metric-mini">
                <span class="calc__metric-mini-label">{t.reservas}</span>
                <span class="calc__metric-mini-value">{formatEUR(total.reservasTotales, 0)}</span>
              </div>
              <div class="calc__metric-mini">
                <span class="calc__metric-mini-label">{t.prestamos}</span>
                <span class="calc__metric-mini-value">{formatEUR(total.prestamosTotales, 0)}</span>
              </div>
              <div class="calc__metric-mini">
                <span class="calc__metric-mini-label">{f > 0 ? t.efectivo : t.ofertaMonetaria}</span>
                <span class="calc__metric-mini-value">
                  {formatEUR(f > 0 ? total.efectivoTotal : total.ofertaMonetaria, 0)}
                </span>
              </div>
            </div>

            {f > 0 && (
              <div class="calc__metric-grid">
                <div class="calc__metric-mini">
                  <span class="calc__metric-mini-label">{t.ofertaMonetaria}</span>
                  <span class="calc__metric-mini-value">{formatEUR(total.ofertaMonetaria, 0)}</span>
                </div>
              </div>
            )}

            <p class="mb__note">{t.lecturaBase}</p>
            <p class="mb__note">{f > 0 ? t.lecturaFiltracion : t.lecturaReservas}</p>

            <div class="mb__panel">
              <div class="mb__label">{t.tablaTitulo}</div>
              <div class="mb__scroll">
                <table class="calc__table">
                  <thead>
                    <tr>
                      <th>{t.colRonda}</th>
                      <th>{t.colDeposito}</th>
                      <th>{t.colReservas}</th>
                      <th>{t.colPrestamo}</th>
                      {f > 0 && <th>{t.colEfectivo}</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {filas.map((fila) => (
                      <tr key={fila.n}>
                        <td>{fila.n}</td>
                        <td>
                          <span class="mb__bar" style={`width:${(fila.deposito / maxDeposito) * 100}%`} />
                          {formatEUR(fila.deposito, 0)}
                        </td>
                        <td>{formatEUR(fila.reservas, 0)}</td>
                        <td>{formatEUR(fila.prestamo, 0)}</td>
                        {f > 0 && <td>{formatEUR(fila.efectivo, 0)}</td>}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p class="mb__note">{t.tablaPie}</p>
            </div>

            <div class="mb__panel">
              <div class="mb__label">{t.limitesTitulo}</div>
              <p class="mb__note">{t.limites}</p>
            </div>
          </>
        )}

        <details class="calc__details">
          <summary>{t.comoSeCalcula}</summary>
          <div class="calc__formula">
            <p><strong>{t.formulaMultTitle}</strong>{t.formulaMultDesc}</p>
            <p><strong>{t.formulaDepTitle}</strong>{t.formulaDepDesc}</p>
            <p><strong>{t.formulaCreadoTitle}</strong>{t.formulaCreadoDesc}</p>
            <p><strong>{t.formulaOfertaTitle}</strong>{t.formulaOfertaDesc}</p>
          </div>
        </details>
      </div>

      <style>{`
        .mb__label {
          font-family: var(--font-sans);
          font-size: 0.82rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.07em;
          color: var(--color-terra, #C44E2C);
          margin: 1rem 0 0.5rem;
        }
        .mb__row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.5rem 1rem; }
        @media (max-width: 560px) { .mb__row { grid-template-columns: 1fr; } }
        .mb__panel {
          margin-top: 1.4rem;
          padding: 1rem 1.1rem;
          background: var(--color-paper, #FFFFFF);
          border: 1px solid var(--color-line, #E5D4BD);
          border-radius: 8px;
        }
        .mb__note {
          margin-top: 0.7rem;
          font-family: var(--font-sans);
          font-size: 0.87rem;
          color: var(--color-ink-soft, #5C4A3D);
        }
        .mb__scroll { overflow-x: auto; }
        .mb__bar {
          display: block;
          height: 3px;
          background: var(--color-mustard, #D4A24C);
          border-radius: 2px;
          margin-bottom: 3px;
          min-width: 2px;
        }
      `}</style>
    </div>
  );
}
