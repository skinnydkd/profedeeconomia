/** @jsxImportSource preact */
import { useMemo, useState } from 'preact/hooks';
import { valorarDCF } from '../../lib/calc/dcf';
import { formatEUR, formatPercent, formatNumber } from '../../lib/calc/format';

/**
 * DCF (descuento de flujos de caja) calculator for EDMN 2BACH.
 *
 * Discounts up to 10 projected free cash flows at a WACC and adds a terminal
 * value (Gordon perpetuity from the perpetual growth rate g) to obtain the
 * enterprise value. Mirrors the .calc__* layout of the other calculators.
 */
export default function DCFCalc() {
  const [wacc, setWacc] = useState<number>(10);
  const [g, setG] = useState<number>(2);
  const [flujos, setFlujos] = useState<number[]>([50000, 60000, 70000, 80000, 90000]);

  const result = useMemo(
    () =>
      valorarDCF({
        flujos,
        wacc: wacc / 100,
        crecimientoPerpetuo: g / 100,
      }),
    [flujos, wacc, g]
  );

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

  const n = flujos.length;

  return (
    <div class="calc">
      <div class="calc__form">
        <label class="calc__field">
          <span class="calc__label">Coste medio del capital (WACC)</span>
          <div class="calc__input-wrap">
            <input
              type="number"
              min={-99}
              step={0.5}
              value={wacc}
              onInput={(e) => setWacc(parseFloat((e.target as HTMLInputElement).value) || 0)}
            />
            <span class="calc__unit">% anual</span>
          </div>
        </label>

        <label class="calc__field">
          <span class="calc__label">Crecimiento perpetuo (g)</span>
          <div class="calc__input-wrap">
            <input
              type="number"
              min={-50}
              step={0.5}
              value={g}
              onInput={(e) => setG(parseFloat((e.target as HTMLInputElement).value) || 0)}
            />
            <span class="calc__unit">% anual</span>
          </div>
        </label>

        <div class="calc__field" style="grid-column: 1 / -1;">
          <span class="calc__label">Flujos de caja libres proyectados</span>
          <div class="calc__flujos">
            {flujos.map((f, i) => (
              <label class="calc__flujo">
                <span class="calc__flujo-label">Año {i + 1}</span>
                <div class="calc__input-wrap">
                  <input
                    type="number"
                    step={1000}
                    value={f}
                    onInput={(e) => setFlujo(i, parseFloat((e.target as HTMLInputElement).value) || 0)}
                  />
                  <span class="calc__unit">€</span>
                </div>
              </label>
            ))}
          </div>
          <div class="calc__flujo-actions">
            <button
              type="button"
              class="calc__btn calc__btn--ghost"
              onClick={removeAnio}
              disabled={flujos.length <= 1}
            >
              − Año
            </button>
            <button
              type="button"
              class="calc__btn calc__btn--ghost"
              onClick={addAnio}
              disabled={flujos.length >= 10}
            >
              + Año
            </button>
          </div>
        </div>
      </div>

      <div class="calc__results">
        {!result.valido ? (
          <div class="calc__warning">{result.aviso}</div>
        ) : (
          <>
            <div class="calc__metric-grid calc__metric-grid--three">
              <div class="calc__metric calc__metric--primary">
                <span class="calc__metric-label">Valor de empresa</span>
                <span class="calc__metric-value">{formatEUR(result.valorEmpresa)}</span>
                <span class="calc__metric-detail">
                  Suma de los flujos descontados más el valor residual actualizado
                </span>
              </div>

              <div class="calc__metric">
                <span class="calc__metric-label">Flujos descontados</span>
                <span class="calc__metric-value">{formatEUR(result.valorActualFlujos)}</span>
                <span class="calc__metric-detail">Valor actual de los {n} años proyectados</span>
              </div>

              <div class="calc__metric">
                <span class="calc__metric-label">Valor residual (hoy)</span>
                <span class="calc__metric-value">{formatEUR(result.valorActualResidual)}</span>
                <span class="calc__metric-detail">
                  {result.valorActualResidual > 0
                    ? 'Renta perpetua de Gordon, traída al presente'
                    : 'Sin valor residual aplicable'}
                </span>
              </div>
            </div>

            {result.aviso && <div class="calc__warning">{result.aviso}</div>}

            <details class="calc__details">
              <summary>Detalle del descuento año a año</summary>
              <div class="calc__formula">
                <p>
                  VA(flujo<sub>t</sub>) = flujo<sub>t</sub> / (1 + WACC)<sup>t</sup> &nbsp;·&nbsp;
                  Valor residual = flujo<sub>n</sub> · (1 + g) / (WACC − g)
                </p>
                <table class="calc__table">
                  <thead>
                    <tr>
                      <th>Año</th>
                      <th>Flujo</th>
                      <th>Factor (1+WACC)^t</th>
                      <th>Valor actual</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.desglose.map((d) => (
                      <tr>
                        <td>{d.anio}</td>
                        <td>{formatEUR(d.flujo)}</td>
                        <td>{formatNumber(d.factor, 4)}</td>
                        <td>{formatEUR(d.valorActual)}</td>
                      </tr>
                    ))}
                    <tr>
                      <td colSpan={3}>
                        <strong>Suma de flujos descontados</strong>
                      </td>
                      <td>
                        <strong>{formatEUR(result.valorActualFlujos)}</strong>
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={3}>
                        Valor residual en el año {n} ({formatEUR(result.valorResidual)}),
                        actualizado a hoy
                      </td>
                      <td>{formatEUR(result.valorActualResidual)}</td>
                    </tr>
                    <tr>
                      <td colSpan={3}>
                        <strong>= Valor de empresa</strong>
                      </td>
                      <td>
                        <strong>{formatEUR(result.valorEmpresa)}</strong>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <p>
                  WACC = {formatPercent(wacc, 1, false)} &nbsp;·&nbsp; g ={' '}
                  {formatPercent(g, 1, false)}. El valor residual recoge todos los flujos
                  posteriores al horizonte como una renta perpetua creciente.
                </p>
              </div>
            </details>
          </>
        )}
      </div>
    </div>
  );
}
