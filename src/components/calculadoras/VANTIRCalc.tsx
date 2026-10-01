/** @jsxImportSource preact */
import { useMemo, useState } from 'preact/hooks';
import { type Locale } from '@/i18n/locale';
import { formatNumber } from '../../lib/calc/format';
import {
  calcularTIR,
  cambiosDeSigno,
  van as vanCalc,
  TIR_MAX,
  TIR_MIN,
  type ResultadoTIR,
} from '../../lib/calc/van-tir';
import NumberInput from '../NumberInput';
import LiveSummary from '../LiveSummary';

/**
 * UI strings, Valencian (AVL) alongside the ES source. Economic notation
 * (VAN, TIR, PayBack, I₀, k, €, %) is not translated. Guarded by copy-parity.test.ts.
 */
export const COPY = {
  es: {
    avisoInversion: 'La inversión inicial debe ser mayor que cero.',
    avisoTasa: 'La tasa de descuento debe ser mayor que −50%.',
    inversionLabel: 'Inversión inicial (I₀)',
    tasaLabel: 'Tasa de descuento exigida (k)',
    tasaUnit: '% anual',
    flujosLabel: 'Flujos netos anuales',
    anioLabel: (n: number) => `Año ${n}`,
    quitarAnio: '− Año',
    agregarAnio: '+ Año',
    vanCrea: 'Crea valor: aceptar',
    vanDestruye: 'Destruye valor: rechazar',
    tirNinguna: 'No existe TIR: el VAN no se anula con ninguna tasa',
    tirSuperior: (limite: string) => `TIR superior al ${limite}`,
    tirInferior: (limite: string) => `TIR inferior al ${limite}`,
    tirVarias: (tirs: readonly string[]) => `Varias TIR: ${enumerar(tirs, 'y')}`,
    avisoSignos:
      'Los flujos cambian de signo más de una vez, así que puede haber más de una TIR o ninguna, y la regla «TIR > k» deja de servir. Decide con el VAN.',
    tirPorEncima: (k: number) => `Por encima del ${k}% exigido`,
    tirPorDebajo: (k: number) => `Por debajo del ${k}% exigido`,
    paybackUnit: 'años',
    paybackNoRecupera: 'No se recupera dentro del horizonte',
    paybackRecupera: 'Recuperación de la inversión inicial',
    detalleSummary: 'Detalle de los flujos actualizados',
    thAnio: 'Año',
    thFlujo: 'Flujo',
    thFactor: 'Factor (1+k)^t',
    thFlujoActualizado: 'Flujo actualizado',
    sumaActualizada: 'Suma actualizada',
    filaInversion: '(−) Inversión inicial',
  },
  ca: {
    avisoInversion: 'La inversió inicial ha de ser major que zero.',
    avisoTasa: 'La taxa de descompte ha de ser major que −50%.',
    inversionLabel: 'Inversió inicial (I₀)',
    tasaLabel: 'Taxa de descompte exigida (k)',
    tasaUnit: '% anual',
    flujosLabel: 'Fluxos nets anuals',
    anioLabel: (n: number) => `Any ${n}`,
    quitarAnio: '− Any',
    agregarAnio: '+ Any',
    vanCrea: 'Crea valor: acceptar',
    vanDestruye: 'Destruïx valor: rebutjar',
    tirNinguna: "No hi ha TIR: el VAN no s'anul·la amb cap taxa",
    tirSuperior: (limite: string) => `TIR superior al ${limite}`,
    tirInferior: (limite: string) => `TIR inferior al ${limite}`,
    tirVarias: (tirs: readonly string[]) => `Diverses TIR: ${enumerar(tirs, 'i')}`,
    avisoSignos:
      "Els fluxos canvien de signe més d'una vegada, així que pot haver-hi més d'una TIR o cap, i la regla «TIR > k» deixa de servir. Decidix amb el VAN.",
    tirPorEncima: (k: number) => `Per damunt del ${k}% exigit`,
    tirPorDebajo: (k: number) => `Per davall del ${k}% exigit`,
    paybackUnit: 'anys',
    paybackNoRecupera: "No es recupera dins de l'horitzó",
    paybackRecupera: 'Recuperació de la inversió inicial',
    detalleSummary: 'Detall dels fluxos actualitzats',
    thAnio: 'Any',
    thFlujo: 'Flux',
    thFactor: 'Factor (1+k)^t',
    thFlujoActualizado: 'Flux actualitzat',
    sumaActualizada: 'Suma actualitzada',
    filaInversion: '(−) Inversió inicial',
  },
} as const;

interface Props { locale?: Locale }

/**
 * VAN, TIR and PayBack calculator for an investment with up to 10 yearly flows.
 *
 *   VAN = -I0 + Σ Ft / (1 + k)^t
 *   TIR = tasa que hace VAN = 0  (buscada en una malla de tasas: puede haber
 *         una, varias o ninguna; ver lib/calc/van-tir.ts)
 *   PayBack = año (parcial) en el que la suma de flujos cubre I0
 */
export default function VANTIRCalc({ locale = 'es' }: Props) {
  const c = COPY[locale];
  const [inversion, setInversion] = useState<number>(120000);
  const [k, setK] = useState<number>(8);
  const [flujos, setFlujos] = useState<number[]>([20000, 30000, 50000, 60000, 50000]);

  const result = useMemo(() => {
    const r = k / 100;
    if (inversion <= 0) {
      return { valido: false as const, mensaje: c.avisoInversion };
    }
    if (r < -0.5) {
      return { valido: false as const, mensaje: c.avisoTasa };
    }
    const van = vanCalc(inversion, flujos, r);
    const tir = tarjetaTIR(calcularTIR(inversion, flujos), k, c);
    const variosSignos = cambiosDeSigno(inversion, flujos) > 1;
    const payback = paybackCalc(inversion, flujos);
    const sumaActualizada = flujos.reduce((acc, f, i) => acc + f / Math.pow(1 + r, i + 1), 0);
    return { valido: true as const, van, tir, variosSignos, payback, sumaActualizada, r };
  }, [inversion, k, flujos, c]);

  const resumen = !result.valido
    ? result.mensaje
    : [
        `VAN: ${fmtMoney(result.van)}.`,
        `${result.van >= 0 ? c.vanCrea : c.vanDestruye}.`,
        result.tir.valor === '—' ? `${result.tir.detalle}.` : `TIR: ${result.tir.valor}. ${result.tir.detalle}.`,
      ].join(' ');

  function setFlujo(i: number, value: number) {
    const next = [...flujos];
    next[i] = value;
    setFlujos(next);
  }
  function addAnio() {
    if (flujos.length < 10) setFlujos([...flujos, 0]);
  }
  function removeAnio() {
    if (flujos.length > 1) setFlujos(flujos.slice(0, -1));
  }

  return (
    <div class="calc">
      <div class="calc__form">
        <label class="calc__field">
          <span class="calc__label">{c.inversionLabel}</span>
          <div class="calc__input-wrap">
            <NumberInput
              min={0}
              step={1000}
              value={inversion}
              onValue={setInversion}
            />
            <span class="calc__unit">€</span>
          </div>
        </label>

        <label class="calc__field">
          <span class="calc__label">{c.tasaLabel}</span>
          <div class="calc__input-wrap">
            <NumberInput
              min={-100}
              step={0.5}
              value={k}
              onValue={setK}
            />
            <span class="calc__unit">{c.tasaUnit}</span>
          </div>
        </label>

        <div class="calc__field" style="grid-column: 1 / -1;">
          <span class="calc__label">{c.flujosLabel}</span>
          <div class="calc__flujos">
            {flujos.map((f, i) => (
              <label class="calc__flujo">
                <span class="calc__flujo-label">{c.anioLabel(i + 1)}</span>
                <div class="calc__input-wrap">
                  <NumberInput
                    step={500}
                    value={f}
                    onValue={(v) => setFlujo(i, v)}
                  />
                  <span class="calc__unit">€</span>
                </div>
              </label>
            ))}
          </div>
          <div class="calc__flujo-actions">
            <button type="button" class="calc__btn calc__btn--ghost" onClick={removeAnio} disabled={flujos.length <= 1}>{c.quitarAnio}</button>
            <button type="button" class="calc__btn calc__btn--ghost" onClick={addAnio} disabled={flujos.length >= 10}>{c.agregarAnio}</button>
          </div>
        </div>
      </div>

      <div class="calc__results">
        <LiveSummary text={resumen} />
        {!result.valido ? (
          <div class="calc__warning">{result.mensaje}</div>
        ) : (
          <>
            <div class="calc__metric-grid calc__metric-grid--three">
              <div class={`calc__metric ${result.van >= 0 ? 'calc__metric--ok' : 'calc__metric--fail'}`}>
                <span class="calc__metric-label">VAN</span>
                <span class="calc__metric-value">{fmtMoney(result.van)}</span>
                <span class="calc__metric-detail">
                  {result.van >= 0 ? c.vanCrea : c.vanDestruye}
                </span>
              </div>

              <div class={`calc__metric ${result.tir.clase}`}>
                <span class="calc__metric-label">TIR</span>
                <span class="calc__metric-value">{result.tir.valor}</span>
                <span class="calc__metric-detail">{result.tir.detalle}</span>
              </div>

              <div class={`calc__metric ${result.payback !== null && result.payback <= flujos.length ? 'calc__metric--ok' : 'calc__metric--fail'}`}>
                <span class="calc__metric-label">PayBack</span>
                <span class="calc__metric-value">
                  {result.payback === null ? '> ' + flujos.length : result.payback.toFixed(2).replace('.', ',')}
                </span>
                <span class="calc__metric-unit">{c.paybackUnit}</span>
                <span class="calc__metric-detail">
                  {result.payback === null
                    ? c.paybackNoRecupera
                    : c.paybackRecupera}
                </span>
              </div>
            </div>

            {result.variosSignos && <div class="calc__warning">{c.avisoSignos}</div>}

            <details class="calc__details">
              <summary>{c.detalleSummary}</summary>
              <div class="calc__formula">
                <table class="calc__table">
                  <thead>
                    <tr><th>{c.thAnio}</th><th>{c.thFlujo}</th><th>{c.thFactor}</th><th>{c.thFlujoActualizado}</th></tr>
                  </thead>
                  <tbody>
                    {flujos.map((f, i) => {
                      const factor = Math.pow(1 + result.r, i + 1);
                      const fa = f / factor;
                      return (
                        <tr>
                          <td>{i + 1}</td>
                          <td>{fmtMoney(f)}</td>
                          <td>{factor.toFixed(4)}</td>
                          <td>{fmtMoney(fa)}</td>
                        </tr>
                      );
                    })}
                    <tr>
                      <td colSpan={3}><strong>{c.sumaActualizada}</strong></td>
                      <td><strong>{fmtMoney(result.sumaActualizada)}</strong></td>
                    </tr>
                    <tr>
                      <td colSpan={3}>{c.filaInversion}</td>
                      <td>{fmtMoney(-inversion)}</td>
                    </tr>
                    <tr>
                      <td colSpan={3}><strong>= VAN</strong></td>
                      <td><strong>{fmtMoney(result.van)}</strong></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </details>
          </>
        )}
      </div>
    </div>
  );
}

/** Value, verdict and border of the TIR card for each outcome of the search. */
function tarjetaTIR(
  tir: ResultadoTIR,
  k: number,
  c: (typeof COPY)[Locale],
): { valor: string; detalle: string; clase: string } {
  switch (tir.tipo) {
    case 'unica': {
      const supera = tir.tir >= k / 100;
      return {
        valor: fmtTasa(tir.tir),
        detalle: supera ? c.tirPorEncima(k) : c.tirPorDebajo(k),
        clase: supera ? 'calc__metric--ok' : 'calc__metric--fail',
      };
    }
    case 'varias':
      // With several TIRs the rule «TIR > k» says nothing: no verdict colour.
      return { valor: '—', detalle: c.tirVarias(tir.tirs.map(fmtTasa)), clase: '' };
    case 'fueraDeRango':
      return tir.lado === 'superior'
        ? { valor: `> ${fmtLimite(TIR_MAX)}`, detalle: c.tirSuperior(fmtLimite(TIR_MAX)), clase: 'calc__metric--ok' }
        : { valor: `< ${fmtLimite(TIR_MIN)}`, detalle: c.tirInferior(fmtLimite(TIR_MIN)), clase: 'calc__metric--fail' };
    case 'ninguna':
      return { valor: '—', detalle: c.tirNinguna, clase: 'calc__metric--fail' };
  }
}

/** A rate as a percentage with two decimals (0,1234 → "12,34 %"). */
function fmtTasa(r: number): string {
  return `${(r * 100).toFixed(2).replace('.', ',')} %`;
}

/** A search limit as a whole percentage (100 → "10.000 %", −0,99 → "−99 %"). */
function fmtLimite(r: number): string {
  return `${formatNumber(r * 100, 0).replace('-', '−')} %`;
}

/** "a", "a y b", "a, b y c". */
function enumerar(items: readonly string[], y: string): string {
  return items.length < 2 ? items.join('') : `${items.slice(0, -1).join(', ')} ${y} ${items[items.length - 1]}`;
}

function paybackCalc(inversion: number, flujos: number[]): number | null {
  let acumulado = 0;
  for (let i = 0; i < flujos.length; i++) {
    const previo = acumulado;
    acumulado += flujos[i];
    if (acumulado >= inversion) {
      const faltaba = inversion - previo;
      const fraccion = flujos[i] > 0 ? faltaba / flujos[i] : 0;
      return i + fraccion;
    }
  }
  return null;
}

function fmtMoney(n: number): string {
  return n.toLocaleString('es-ES', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
