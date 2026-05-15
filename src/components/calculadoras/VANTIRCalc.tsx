/** @jsxImportSource preact */
import { useMemo, useState } from 'preact/hooks';

/**
 * VAN, TIR and PayBack calculator for an investment with up to 10 yearly flows.
 *
 *   VAN = -I0 + Σ Ft / (1 + k)^t
 *   TIR = tasa que hace VAN = 0  (calculada por bisección)
 *   PayBack = año (parcial) en el que la suma de flujos cubre I0
 */
export default function VANTIRCalc() {
  const [inversion, setInversion] = useState<number>(120000);
  const [k, setK] = useState<number>(8);
  const [flujos, setFlujos] = useState<number[]>([20000, 30000, 50000, 60000, 50000]);

  const result = useMemo(() => {
    const r = k / 100;
    if (inversion <= 0 || r <= -1) {
      return { valido: false as const, mensaje: 'Inversión y tasa de descuento deben ser válidas.' };
    }
    const van = vanCalc(inversion, flujos, r);
    const tir = tirCalc(inversion, flujos);
    const payback = paybackCalc(inversion, flujos);
    const sumaActualizada = flujos.reduce((acc, f, i) => acc + f / Math.pow(1 + r, i + 1), 0);
    return { valido: true as const, van, tir, payback, sumaActualizada, r };
  }, [inversion, k, flujos]);

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
          <span class="calc__label">Inversión inicial (I₀)</span>
          <div class="calc__input-wrap">
            <input
              type="number"
              min={0}
              step={1000}
              value={inversion}
              onInput={(e) => setInversion(parseFloat((e.target as HTMLInputElement).value) || 0)}
            />
            <span class="calc__unit">€</span>
          </div>
        </label>

        <label class="calc__field">
          <span class="calc__label">Tasa de descuento exigida (k)</span>
          <div class="calc__input-wrap">
            <input
              type="number"
              min={-100}
              step={0.5}
              value={k}
              onInput={(e) => setK(parseFloat((e.target as HTMLInputElement).value) || 0)}
            />
            <span class="calc__unit">% anual</span>
          </div>
        </label>

        <div class="calc__field" style="grid-column: 1 / -1;">
          <span class="calc__label">Flujos netos anuales</span>
          <div class="calc__flujos">
            {flujos.map((f, i) => (
              <label class="calc__flujo">
                <span class="calc__flujo-label">Año {i + 1}</span>
                <div class="calc__input-wrap">
                  <input
                    type="number"
                    step={500}
                    value={f}
                    onInput={(e) => setFlujo(i, parseFloat((e.target as HTMLInputElement).value) || 0)}
                  />
                  <span class="calc__unit">€</span>
                </div>
              </label>
            ))}
          </div>
          <div class="calc__flujo-actions">
            <button type="button" class="calc__btn calc__btn--ghost" onClick={removeAnio} disabled={flujos.length <= 1}>− Año</button>
            <button type="button" class="calc__btn calc__btn--ghost" onClick={addAnio} disabled={flujos.length >= 10}>+ Año</button>
          </div>
        </div>
      </div>

      <div class="calc__results">
        {!result.valido ? (
          <div class="calc__warning">{result.mensaje}</div>
        ) : (
          <>
            <div class="calc__metric-grid calc__metric-grid--three">
              <div class={`calc__metric ${result.van >= 0 ? 'calc__metric--ok' : 'calc__metric--fail'}`}>
                <span class="calc__metric-label">VAN</span>
                <span class="calc__metric-value">{fmtMoney(result.van)}</span>
                <span class="calc__metric-detail">
                  {result.van >= 0 ? 'Crea valor: aceptar' : 'Destruye valor: rechazar'}
                </span>
              </div>

              <div class={`calc__metric ${result.tir !== null && result.tir >= k / 100 ? 'calc__metric--ok' : 'calc__metric--fail'}`}>
                <span class="calc__metric-label">TIR</span>
                <span class="calc__metric-value">
                  {result.tir === null ? '—' : `${(result.tir * 100).toFixed(2).replace('.', ',')} %`}
                </span>
                <span class="calc__metric-detail">
                  {result.tir === null
                    ? 'No converge'
                    : result.tir >= k / 100
                    ? `Por encima del ${k}% exigido`
                    : `Por debajo del ${k}% exigido`}
                </span>
              </div>

              <div class={`calc__metric ${result.payback !== null && result.payback <= flujos.length ? 'calc__metric--ok' : 'calc__metric--fail'}`}>
                <span class="calc__metric-label">PayBack</span>
                <span class="calc__metric-value">
                  {result.payback === null ? '> ' + flujos.length : result.payback.toFixed(2).replace('.', ',')}
                </span>
                <span class="calc__metric-unit">años</span>
                <span class="calc__metric-detail">
                  {result.payback === null
                    ? 'No se recupera dentro del horizonte'
                    : 'Recuperación de la inversión inicial'}
                </span>
              </div>
            </div>

            <details class="calc__details">
              <summary>Detalle de los flujos actualizados</summary>
              <div class="calc__formula">
                <table class="calc__table">
                  <thead>
                    <tr><th>Año</th><th>Flujo</th><th>Factor (1+k)^t</th><th>Flujo actualizado</th></tr>
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
                      <td colSpan={3}><strong>Suma actualizada</strong></td>
                      <td><strong>{fmtMoney(result.sumaActualizada)}</strong></td>
                    </tr>
                    <tr>
                      <td colSpan={3}>(−) Inversión inicial</td>
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

function vanCalc(inversion: number, flujos: number[], k: number): number {
  return -inversion + flujos.reduce((acc, f, i) => acc + f / Math.pow(1 + k, i + 1), 0);
}

/** TIR by bisection. Returns null if no root in [-0.99, 5]. */
function tirCalc(inversion: number, flujos: number[]): number | null {
  let lo = -0.99;
  let hi = 5;
  let fLo = vanCalc(inversion, flujos, lo);
  let fHi = vanCalc(inversion, flujos, hi);
  if (fLo * fHi > 0) return null;
  for (let i = 0; i < 80; i++) {
    const mid = (lo + hi) / 2;
    const fMid = vanCalc(inversion, flujos, mid);
    if (Math.abs(fMid) < 0.01) return mid;
    if (fMid * fLo < 0) {
      hi = mid;
      fHi = fMid;
    } else {
      lo = mid;
      fLo = fMid;
    }
  }
  return (lo + hi) / 2;
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
