/** @jsxImportSource preact */
import { useMemo, useState } from 'preact/hooks';
import { type Locale } from '@/i18n/locale';
import { formatEUR, formatNumber } from '../../lib/calc/format';
import { proyectar, ventasConCrecimiento, MESES, type Supuestos } from '../../lib/calc/tesoreria';

/** UI strings, Valencian (AVL) alongside the ES source. */
export const COPY = {
  es: {
    partidaTitulo: 'Punto de partida',
    saldoInicial: 'Dinero en caja al empezar (€)',
    ventasIniciales: 'Ventas del primer mes (€)',
    crecimiento: 'Crecimiento mensual de las ventas (%)',
    regenerar: 'Rehacer la fila de ventas',
    regenerarAyuda: 'Rehace los doce meses con el crecimiento indicado. Después puedes cambiar a mano el mes que quieras: rebajas, verano, campaña de Navidad.',
    cobrosTitulo: 'Cuándo entra el dinero',
    cobroContado: 'Parte que se cobra al momento (%)',
    mesesCobro: 'El resto se cobra a los… (meses)',
    pagosTitulo: 'Cuándo sale el dinero',
    comprasSobreVentas: 'Compras sobre las ventas del mes (%)',
    pagoContado: 'Parte de las compras que se paga al momento (%)',
    mesesPago: 'El resto se paga a los… (meses)',
    gastosFijos: 'Gastos fijos mensuales (€)',
    gastosAyuda: 'Alquiler, sueldos, suministros, seguros: lo que se paga cada mes se venda o no se venda.',
    sinDatos: 'Revisa los datos: las ventas no pueden ser negativas, los porcentajes van entre 0 y 100 % y el aplazamiento entre 0 y 6 meses.',
    resumenTitulo: 'Cómo acaba el año',
    saldoFinal: 'Caja al terminar',
    beneficio: 'Beneficio del periodo',
    saldoMinimo: 'Peor momento de caja',
    enMes: 'en el mes',
    mesesNegativo: 'Meses cerrando en negativo',
    necesidad: 'Financiación necesaria para no caer bajo cero',
    puenteTitulo: 'Por qué el beneficio no es la caja',
    puenteTexto: 'La caja final es el dinero de partida más el beneficio, menos lo que se ha vendido y todavía no se ha cobrado, más lo que se ha comprado y todavía no se ha pagado. Cuadra siempre, y explica de una vez por qué una empresa con beneficios puede quedarse sin dinero.',
    pendienteCobro: 'Vendido y no cobrado',
    pendientePago: 'Comprado y no pagado',
    graficoTitulo: 'El saldo mes a mes',
    graficoAria: 'Gráfico del saldo de tesorería mes a mes con la línea del cero',
    tablaTitulo: 'La previsión completa',
    colMes: 'Mes',
    colVentas: 'Ventas',
    colCobros: 'Cobros',
    colPagos: 'Pagos',
    colFlujo: 'Flujo',
    colSaldo: 'Saldo',
    meses: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
    avisoTitulo: 'Para el plan de empresa',
    aviso: 'Un plan que solo enseña beneficios no está terminado. La pregunta que hay que responder es cuántos euros hacen falta y en qué mes: ese es el número que se lleva al banco o a la ronda de financiación, y sale de la fila del saldo, no de la del beneficio.',
    presets: 'Ejemplos',
    presetTienda: 'Comercio que cobra al contado',
    presetB2B: 'Vende a empresas, cobra a 60 días',
    presetEstacional: 'Negocio de temporada',
    comoSeCalcula: 'Cómo se calcula',
    formulaCobrosTitle: 'Cobros del mes',
    formulaCobrosDesc: ': la parte al contado de las ventas de ese mes, más la parte aplazada de las ventas de hace N meses.',
    formulaPagosTitle: 'Pagos del mes',
    formulaPagosDesc: ': gastos fijos, más la parte al contado de las compras del mes, más la parte aplazada de las compras de hace M meses.',
    formulaSaldoTitle: 'Saldo',
    formulaSaldoDesc: ': saldo del mes anterior + cobros − pagos. El primer mes parte del dinero en caja.',
    formulaPuenteTitle: 'Puente',
    formulaPuenteDesc: ': saldo final = saldo inicial + beneficio − pendiente de cobro + pendiente de pago.',
  },
  ca: {
    partidaTitulo: 'Punt de partida',
    saldoInicial: 'Diners en caixa en començar (€)',
    ventasIniciales: 'Vendes del primer mes (€)',
    crecimiento: 'Creixement mensual de les vendes (%)',
    regenerar: 'Refer la fila de vendes',
    regenerarAyuda: 'Refà els dotze mesos amb el creixement indicat. Després pots canviar a mà el mes que vulgues: rebaixes, estiu, campanya de Nadal.',
    cobrosTitulo: 'Quan entren els diners',
    cobroContado: 'Part que es cobra al moment (%)',
    mesesCobro: 'La resta es cobra als… (mesos)',
    pagosTitulo: 'Quan ixen els diners',
    comprasSobreVentas: 'Compres sobre les vendes del mes (%)',
    pagoContado: 'Part de les compres que es paga al moment (%)',
    mesesPago: 'La resta es paga als… (mesos)',
    gastosFijos: 'Despeses fixes mensuals (€)',
    gastosAyuda: 'Lloguer, sous, subministraments, assegurances: el que es paga cada mes es venga o no es venga.',
    sinDatos: "Revisa les dades: les vendes no poden ser negatives, els percentatges van entre 0 i 100 % i l'ajornament entre 0 i 6 mesos.",
    resumenTitulo: "Com acaba l'any",
    saldoFinal: 'Caixa en acabar',
    beneficio: 'Benefici del període',
    saldoMinimo: 'Pitjor moment de caixa',
    enMes: 'en el mes',
    mesesNegativo: 'Mesos tancant en negatiu',
    necesidad: 'Finançament necessari per a no caure per davall de zero',
    puenteTitulo: 'Per què el benefici no és la caixa',
    puenteTexto: "La caixa final són els diners de partida més el benefici, menys el que s'ha venut i encara no s'ha cobrat, més el que s'ha comprat i encara no s'ha pagat. Quadra sempre, i explica d'una vegada per què una empresa amb beneficis pot quedar-se sense diners.",
    pendienteCobro: 'Venut i no cobrat',
    pendientePago: 'Comprat i no pagat',
    graficoTitulo: 'El saldo mes a mes',
    graficoAria: 'Gràfic del saldo de tresoreria mes a mes amb la línia del zero',
    tablaTitulo: 'La previsió completa',
    colMes: 'Mes',
    colVentas: 'Vendes',
    colCobros: 'Cobraments',
    colPagos: 'Pagaments',
    colFlujo: 'Flux',
    colSaldo: 'Saldo',
    meses: ['Gen', 'Feb', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Oct', 'Nov', 'Des'],
    avisoTitulo: "Per al pla d'empresa",
    aviso: "Un pla que només ensenya beneficis no està acabat. La pregunta que cal respondre és quants euros fan falta i en quin mes: eixe és el número que es porta al banc o a la ronda de finançament, i ix de la fila del saldo, no de la del benefici.",
    presets: 'Exemples',
    presetTienda: 'Comerç que cobra al comptat',
    presetB2B: 'Ven a empreses, cobra a 60 dies',
    presetEstacional: 'Negoci de temporada',
    comoSeCalcula: 'Com es calcula',
    formulaCobrosTitle: 'Cobraments del mes',
    formulaCobrosDesc: ": la part al comptat de les vendes d'eixe mes, més la part ajornada de les vendes de fa N mesos.",
    formulaPagosTitle: 'Pagaments del mes',
    formulaPagosDesc: ': despeses fixes, més la part al comptat de les compres del mes, més la part ajornada de les compres de fa M mesos.',
    formulaSaldoTitle: 'Saldo',
    formulaSaldoDesc: ': saldo del mes anterior + cobraments − pagaments. El primer mes parteix dels diners en caixa.',
    formulaPuenteTitle: 'Pont',
    formulaPuenteDesc: ': saldo final = saldo inicial + benefici − pendent de cobrament + pendent de pagament.',
  },
} as const;

interface Props { locale?: Locale }

const num = (e: Event) => parseFloat((e.target as HTMLInputElement).value) || 0;

/**
 * Twelve-month cash forecast for a business plan.
 *
 * The table is the deliverable, but the point is the bridge underneath it:
 * profit and cash are different numbers, and the gap has a name and an amount.
 *
 * EDMN 2BACH · Unit 12.
 */
export default function TesoreriaCalc({ locale = 'es' }: Props) {
  const t = COPY[locale];

  const [saldoInicial, setSaldoInicial] = useState<number>(10000);
  const [ventasIniciales, setVentasIniciales] = useState<number>(20000);
  const [crecimientoPct, setCrecimientoPct] = useState<number>(0);
  const [ventas, setVentas] = useState<number[]>(() => new Array(MESES).fill(20000));

  const [cobroContadoPct, setCobroContadoPct] = useState<number>(40);
  const [mesesCobro, setMesesCobro] = useState<number>(2);
  const [comprasPct, setComprasPct] = useState<number>(50);
  const [pagoContadoPct, setPagoContadoPct] = useState<number>(50);
  const [mesesPago, setMesesPago] = useState<number>(1);
  const [gastosFijos, setGastosFijos] = useState<number>(6000);

  const supuestos: Supuestos = {
    saldoInicial,
    ventas,
    cobroContado: cobroContadoPct / 100,
    mesesCobro,
    comprasSobreVentas: comprasPct / 100,
    pagoContado: pagoContadoPct / 100,
    mesesPago,
    gastosFijos,
  };
  const r = useMemo(
    () => proyectar(supuestos),
    [saldoInicial, ventas, cobroContadoPct, mesesCobro, comprasPct, pagoContadoPct, mesesPago, gastosFijos],
  );

  const rehacerVentas = () => setVentas(ventasConCrecimiento(ventasIniciales, crecimientoPct / 100));

  const editarMes = (i: number, valor: number) => {
    setVentas((prev) => prev.map((v, j) => (j === i ? valor : v)));
  };

  const aplicar = (
    saldo: number, serie: number[], cobro: number, mCobro: number,
    compras: number, pago: number, mPago: number, fijos: number,
  ) => {
    setSaldoInicial(saldo); setVentas(serie); setCobroContadoPct(cobro); setMesesCobro(mCobro);
    setComprasPct(compras); setPagoContadoPct(pago); setMesesPago(mPago); setGastosFijos(fijos);
    setVentasIniciales(serie[0]);
  };

  // A seasonal shop: dead in summer, everything in November and December.
  const estacional = [8000, 7000, 9000, 10000, 11000, 9000, 6000, 5000, 12000, 14000, 26000, 34000];

  return (
    <div class="calc">
      <div class="calc__presets">
        <button type="button" class="calc__btn calc__btn--ghost"
          onClick={() => aplicar(10000, new Array(MESES).fill(20000), 100, 0, 50, 50, 1, 6000)}>{t.presetTienda}</button>
        <button type="button" class="calc__btn calc__btn--ghost"
          onClick={() => aplicar(10000, new Array(MESES).fill(20000), 0, 2, 50, 100, 0, 6000)}>{t.presetB2B}</button>
        <button type="button" class="calc__btn calc__btn--ghost"
          onClick={() => aplicar(6000, estacional, 60, 1, 55, 40, 2, 5000)}>{t.presetEstacional}</button>
      </div>

      <div class="tz__label">{t.partidaTitulo}</div>
      <div class="calc__form tz__row">
        <label class="calc__field">
          <span class="calc__label">{t.saldoInicial}</span>
          <div class="calc__input-wrap">
            <input type="number" step={1000} value={saldoInicial} onInput={(e) => setSaldoInicial(num(e))} />
          </div>
        </label>
        <label class="calc__field">
          <span class="calc__label">{t.ventasIniciales}</span>
          <div class="calc__input-wrap">
            <input type="number" min={0} step={1000} value={ventasIniciales} onInput={(e) => setVentasIniciales(num(e))} />
          </div>
        </label>
        <label class="calc__field">
          <span class="calc__label">{t.crecimiento}</span>
          <div class="calc__input-wrap">
            <input type="number" step={1} value={crecimientoPct} onInput={(e) => setCrecimientoPct(num(e))} />
          </div>
        </label>
      </div>
      <button type="button" class="calc__btn" onClick={rehacerVentas}>{t.regenerar}</button>
      <p class="tz__note">{t.regenerarAyuda}</p>

      <div class="tz__label">{t.cobrosTitulo}</div>
      <div class="calc__form tz__row">
        <label class="calc__field">
          <span class="calc__label">{t.cobroContado}</span>
          <div class="calc__input-wrap">
            <input type="number" min={0} max={100} step={5} value={cobroContadoPct} onInput={(e) => setCobroContadoPct(num(e))} />
          </div>
        </label>
        <label class="calc__field">
          <span class="calc__label">{t.mesesCobro}</span>
          <div class="calc__input-wrap">
            <input type="number" min={0} max={6} step={1} value={mesesCobro} onInput={(e) => setMesesCobro(Math.round(num(e)))} />
          </div>
        </label>
      </div>

      <div class="tz__label">{t.pagosTitulo}</div>
      <div class="calc__form tz__row">
        <label class="calc__field">
          <span class="calc__label">{t.comprasSobreVentas}</span>
          <div class="calc__input-wrap">
            <input type="number" min={0} max={100} step={5} value={comprasPct} onInput={(e) => setComprasPct(num(e))} />
          </div>
        </label>
        <label class="calc__field">
          <span class="calc__label">{t.pagoContado}</span>
          <div class="calc__input-wrap">
            <input type="number" min={0} max={100} step={5} value={pagoContadoPct} onInput={(e) => setPagoContadoPct(num(e))} />
          </div>
        </label>
        <label class="calc__field">
          <span class="calc__label">{t.mesesPago}</span>
          <div class="calc__input-wrap">
            <input type="number" min={0} max={6} step={1} value={mesesPago} onInput={(e) => setMesesPago(Math.round(num(e)))} />
          </div>
        </label>
        <label class="calc__field">
          <span class="calc__label">{t.gastosFijos}</span>
          <div class="calc__input-wrap">
            <input type="number" min={0} step={500} value={gastosFijos} onInput={(e) => setGastosFijos(num(e))} />
          </div>
        </label>
      </div>
      <p class="tz__note">{t.gastosAyuda}</p>

      <div class="calc__results">
        {!r.valido ? (
          <div class="calc__warning">{t.sinDatos}</div>
        ) : (
          <>
            <div class="tz__label">{t.resumenTitulo}</div>
            <div class="calc__metric-grid calc__metric-grid--three">
              <div class="calc__metric-mini">
                <span class="calc__metric-mini-label">{t.saldoFinal}</span>
                <span class={`calc__metric-mini-value ${r.saldoFinal >= 0 ? 'ok' : 'fail'}`}>{formatEUR(r.saldoFinal, 0)}</span>
              </div>
              <div class="calc__metric-mini">
                <span class="calc__metric-mini-label">{t.beneficio}</span>
                <span class="calc__metric-mini-value">{formatEUR(r.beneficioPeriodo, 0)}</span>
              </div>
              <div class="calc__metric-mini">
                <span class="calc__metric-mini-label">{t.saldoMinimo} · {t.enMes} {t.meses[r.mesSaldoMinimo - 1]}</span>
                <span class={`calc__metric-mini-value ${r.saldoMinimo >= 0 ? '' : 'fail'}`}>{formatEUR(r.saldoMinimo, 0)}</span>
              </div>
            </div>

            <div class="calc__metric-grid">
              <div class="calc__metric-mini">
                <span class="calc__metric-mini-label">{t.mesesNegativo}</span>
                <span class={`calc__metric-mini-value ${r.mesesEnNegativo > 0 ? 'fail' : 'ok'}`}>{r.mesesEnNegativo}</span>
              </div>
              <div class="calc__metric-mini">
                <span class="calc__metric-mini-label">{t.necesidad}</span>
                <span class={`calc__metric-mini-value ${r.necesidadFinanciacion > 0 ? 'fail' : 'ok'}`}>
                  {formatEUR(r.necesidadFinanciacion, 0)}
                </span>
              </div>
            </div>

            <div class="tz__panel">
              <div class="tz__label">{t.graficoTitulo}</div>
              <SaldoChart meses={r.meses} etiquetas={t.meses} aria={t.graficoAria} />
            </div>

            <div class="tz__panel">
              <div class="tz__label">{t.puenteTitulo}</div>
              <div class="calc__metric-grid">
                <div class="calc__metric-mini">
                  <span class="calc__metric-mini-label">{t.pendienteCobro}</span>
                  <span class="calc__metric-mini-value">{formatEUR(r.cobrosPendientes, 0)}</span>
                </div>
                <div class="calc__metric-mini">
                  <span class="calc__metric-mini-label">{t.pendientePago}</span>
                  <span class="calc__metric-mini-value">{formatEUR(r.pagosPendientes, 0)}</span>
                </div>
              </div>
              <p class="tz__note">{t.puenteTexto}</p>
              <p class="tz__bridge">
                {formatEUR(r.saldoFinal, 0)} = {formatEUR(saldoInicial, 0)} + {formatEUR(r.beneficioPeriodo, 0)} − {formatEUR(r.cobrosPendientes, 0)} + {formatEUR(r.pagosPendientes, 0)}
              </p>
            </div>

            <div class="tz__panel">
              <div class="tz__label">{t.tablaTitulo}</div>
              <div class="tz__scroll">
                <table class="calc__table">
                  <thead>
                    <tr>
                      <th>{t.colMes}</th>
                      <th>{t.colVentas}</th>
                      <th>{t.colCobros}</th>
                      <th>{t.colPagos}</th>
                      <th>{t.colFlujo}</th>
                      <th>{t.colSaldo}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {r.meses.map((m, i) => (
                      <tr key={m.n}>
                        <td>{t.meses[i]}</td>
                        <td>
                          <input class="tz__cell" type="number" min={0} step={1000} value={ventas[i]}
                            onInput={(e) => editarMes(i, parseFloat((e.target as HTMLInputElement).value) || 0)} />
                        </td>
                        <td>{formatEUR(m.cobros, 0)}</td>
                        <td>{formatEUR(m.pagos, 0)}</td>
                        <td class={m.flujo < 0 ? 'tz__neg' : ''}>{formatEUR(m.flujo, 0)}</td>
                        <td class={m.saldo < 0 ? 'tz__neg' : ''}><strong>{formatEUR(m.saldo, 0)}</strong></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div class="tz__panel">
              <div class="tz__label">{t.avisoTitulo}</div>
              <p class="tz__note">{t.aviso}</p>
            </div>
          </>
        )}

        <details class="calc__details">
          <summary>{t.comoSeCalcula}</summary>
          <div class="calc__formula">
            <p><strong>{t.formulaCobrosTitle}</strong>{t.formulaCobrosDesc}</p>
            <p><strong>{t.formulaPagosTitle}</strong>{t.formulaPagosDesc}</p>
            <p><strong>{t.formulaSaldoTitle}</strong>{t.formulaSaldoDesc}</p>
            <p><strong>{t.formulaPuenteTitle}</strong>{t.formulaPuenteDesc}</p>
          </div>
        </details>
      </div>

      <style>{`
        .tz__label {
          font-family: var(--font-sans);
          font-size: 0.82rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.07em;
          color: var(--color-terra, #C44E2C);
          margin: 1rem 0 0.5rem;
        }
        .tz__row { display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.5rem 1rem; }
        @media (max-width: 480px) { .tz__row { grid-template-columns: 1fr; } }
        .tz__panel {
          margin-top: 1.4rem;
          padding: 1rem 1.1rem;
          background: var(--color-paper, #FFFFFF);
          border: 1px solid var(--color-line, #E5D4BD);
          border-radius: 8px;
        }
        .tz__note {
          margin-top: 0.7rem;
          font-family: var(--font-sans);
          font-size: 0.87rem;
          color: var(--color-ink-soft, #5C4A3D);
        }
        .tz__bridge {
          margin-top: 0.8rem;
          padding: 0.5rem 0.8rem;
          font-family: var(--font-mono, monospace);
          font-size: 0.8rem;
          color: var(--color-ink, #2A1F18);
          background: var(--color-cream, #F5EDD9);
          border: 1px solid var(--color-line, #E5D4BD);
          border-radius: 4px;
          overflow-x: auto;
        }
        .tz__scroll { overflow-x: auto; }
        .tz__cell {
          width: 7.5rem;
          padding: 0.2rem 0.35rem;
          font-family: var(--font-mono, monospace);
          font-size: 0.8rem;
          border: 1px solid var(--color-line, #E5D4BD);
          border-radius: 3px;
          background: var(--color-bg, #FBF6EC);
          color: inherit;
        }
        .tz__neg { color: #B83A3A; }
        .tz__chart {
          width: 100%;
          height: auto;
          background: var(--color-bg, #FBF6EC);
          border: 1px solid var(--color-line, #E5D4BD);
          border-radius: 6px;
          margin-top: 0.6rem;
        }
      `}</style>
    </div>
  );
}

/* ── SVG chart ─────────────────────────────────────────────────────────── */

interface ChartProps {
  meses: { n: number; saldo: number }[];
  etiquetas: readonly string[];
  aria: string;
}

/** Monthly closing balance as columns, with the zero line drawn across. */
function SaldoChart({ meses, etiquetas, aria }: ChartProps) {
  const W = 360, H = 190, ML = 46, MR = 10, MT = 12, MB = 26;
  const iW = W - ML - MR, iH = H - MT - MB;

  const saldos = meses.map((m) => m.saldo);
  const max = Math.max(0, ...saldos);
  const min = Math.min(0, ...saldos);
  const rango = max - min || 1;

  const yOf = (v: number) => MT + iH - ((v - min) / rango) * iH;
  const ancho = iW / meses.length;
  const cero = yOf(0);

  return (
    <svg class="tz__chart" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={aria}>
      <text x={ML - 6} y={yOf(max) + 3} text-anchor="end" font-size="9" fill="#8A7868">{formatNumber(max, 0)}</text>
      <text x={ML - 6} y={yOf(min) + 3} text-anchor="end" font-size="9" fill="#8A7868">{formatNumber(min, 0)}</text>

      {meses.map((m, i) => {
        const x = ML + i * ancho + ancho * 0.18;
        const w = ancho * 0.64;
        const y = m.saldo >= 0 ? yOf(m.saldo) : cero;
        const h = Math.max(1, Math.abs(cero - yOf(m.saldo)));
        return (
          <g key={m.n}>
            <rect x={x} y={y} width={w} height={h} fill={m.saldo >= 0 ? '#1F6E6E' : '#B83A3A'} rx="1.5" />
            <text x={x + w / 2} y={H - MB + 13} text-anchor="middle" font-size="8" fill="#8A7868">{etiquetas[i]}</text>
          </g>
        );
      })}

      <line x1={ML} y1={cero} x2={W - MR} y2={cero} stroke="#2A1F18" stroke-width="1" />
      <line x1={ML} y1={MT} x2={ML} y2={MT + iH} stroke="#2A1F18" stroke-width="1" />
    </svg>
  );
}
