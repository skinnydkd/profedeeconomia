/** @jsxImportSource preact */
import { useMemo, useState } from 'preact/hooks';
import { valorarDCF } from '../../lib/calc/dcf';
import { formatEUR, formatPercent, formatNumber } from '../../lib/calc/format';
import { type Locale } from '@/i18n/locale';

/**
 * UI strings, Valencian (AVL) alongside the ES source. Economic notation
 * (WACC, g, VAN, TIR, €, %) is not translated. Guarded by copy-parity.test.ts.
 */
export const COPY = {
  es: {
    waccLabel: 'Coste medio del capital (WACC)',
    porcentajeUnit: '% anual',
    gLabel: 'Crecimiento perpetuo (g)',
    flujosLabel: 'Flujos de caja libres proyectados',
    anio: (n: number) => `Año ${n}`,
    btnRemoveAnio: '− Año',
    btnAddAnio: '+ Año',
    valorEmpresaLabel: 'Valor de empresa',
    valorEmpresaDetail: 'Suma de los flujos descontados más el valor residual actualizado',
    flujosDescontadosLabel: 'Flujos descontados',
    flujosDescontadosDetail: (n: number) => `Valor actual de los ${n} años proyectados`,
    valorResidualLabel: 'Valor residual (hoy)',
    valorResidualConDetail: 'Renta perpetua de Gordon, traída al presente',
    valorResidualSinDetail: 'Sin valor residual aplicable',
    detalleSummary: 'Detalle del descuento año a año',
    thAnio: 'Año',
    thFlujo: 'Flujo',
    thFactor: 'Factor (1+WACC)^t',
    thValorActual: 'Valor actual',
    sumaFlujosDescontados: 'Suma de flujos descontados',
    valorResidualRow: (n: number, money: string) =>
      `Valor residual en el año ${n} (${money}), actualizado a hoy`,
    valorEmpresaRow: '= Valor de empresa',
    resumenResidual:
      'El valor residual recoge todos los flujos posteriores al horizonte como una renta perpetua creciente.',
  },
  ca: {
    waccLabel: 'Cost mitjà del capital (WACC)',
    porcentajeUnit: '% anual',
    gLabel: 'Creixement perpetu (g)',
    flujosLabel: 'Fluxos de caixa lliures projectats',
    anio: (n: number) => `Any ${n}`,
    btnRemoveAnio: '− Any',
    btnAddAnio: '+ Any',
    valorEmpresaLabel: "Valor d'empresa",
    valorEmpresaDetail: 'Suma dels fluxos descomptats més el valor residual actualitzat',
    flujosDescontadosLabel: 'Fluxos descomptats',
    flujosDescontadosDetail: (n: number) => `Valor actual dels ${n} anys projectats`,
    valorResidualLabel: 'Valor residual (hui)',
    valorResidualConDetail: 'Renda perpètua de Gordon, portada al present',
    valorResidualSinDetail: 'Sense valor residual aplicable',
    detalleSummary: 'Detall del descompte any a any',
    thAnio: 'Any',
    thFlujo: 'Flux',
    thFactor: 'Factor (1+WACC)^t',
    thValorActual: 'Valor actual',
    sumaFlujosDescontados: 'Suma de fluxos descomptats',
    valorResidualRow: (n: number, money: string) =>
      `Valor residual en l'any ${n} (${money}), actualitzat a hui`,
    valorEmpresaRow: "= Valor d'empresa",
    resumenResidual:
      "El valor residual recull tots els fluxos posteriors a l'horitzó com una renda perpètua creixent.",
  },
} as const;

interface Props { locale?: Locale }

/**
 * DCF (descuento de flujos de caja) calculator for EDMN 2BACH.
 *
 * Discounts up to 10 projected free cash flows at a WACC and adds a terminal
 * value (Gordon perpetuity from the perpetual growth rate g) to obtain the
 * enterprise value. Mirrors the .calc__* layout of the other calculators.
 */
export default function DCFCalc({ locale = 'es' }: Props) {
  const c = COPY[locale];
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
          <span class="calc__label">{c.waccLabel}</span>
          <div class="calc__input-wrap">
            <input
              type="number"
              min={-99}
              step={0.5}
              value={wacc}
              onInput={(e) => setWacc(parseFloat((e.target as HTMLInputElement).value) || 0)}
            />
            <span class="calc__unit">{c.porcentajeUnit}</span>
          </div>
        </label>

        <label class="calc__field">
          <span class="calc__label">{c.gLabel}</span>
          <div class="calc__input-wrap">
            <input
              type="number"
              min={-50}
              step={0.5}
              value={g}
              onInput={(e) => setG(parseFloat((e.target as HTMLInputElement).value) || 0)}
            />
            <span class="calc__unit">{c.porcentajeUnit}</span>
          </div>
        </label>

        <div class="calc__field" style="grid-column: 1 / -1;">
          <span class="calc__label">{c.flujosLabel}</span>
          <div class="calc__flujos">
            {flujos.map((f, i) => (
              <label class="calc__flujo">
                <span class="calc__flujo-label">{c.anio(i + 1)}</span>
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
              {c.btnRemoveAnio}
            </button>
            <button
              type="button"
              class="calc__btn calc__btn--ghost"
              onClick={addAnio}
              disabled={flujos.length >= 10}
            >
              {c.btnAddAnio}
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
                <span class="calc__metric-label">{c.valorEmpresaLabel}</span>
                <span class="calc__metric-value">{formatEUR(result.valorEmpresa)}</span>
                <span class="calc__metric-detail">
                  {c.valorEmpresaDetail}
                </span>
              </div>

              <div class="calc__metric">
                <span class="calc__metric-label">{c.flujosDescontadosLabel}</span>
                <span class="calc__metric-value">{formatEUR(result.valorActualFlujos)}</span>
                <span class="calc__metric-detail">{c.flujosDescontadosDetail(n)}</span>
              </div>

              <div class="calc__metric">
                <span class="calc__metric-label">{c.valorResidualLabel}</span>
                <span class="calc__metric-value">{formatEUR(result.valorActualResidual)}</span>
                <span class="calc__metric-detail">
                  {result.valorActualResidual > 0
                    ? c.valorResidualConDetail
                    : c.valorResidualSinDetail}
                </span>
              </div>
            </div>

            {result.aviso && <div class="calc__warning">{result.aviso}</div>}

            <details class="calc__details">
              <summary>{c.detalleSummary}</summary>
              <div class="calc__formula">
                <p>
                  VA(flujo<sub>t</sub>) = flujo<sub>t</sub> / (1 + WACC)<sup>t</sup> &nbsp;·&nbsp;
                  Valor residual = flujo<sub>n</sub> · (1 + g) / (WACC − g)
                </p>
                <table class="calc__table">
                  <thead>
                    <tr>
                      <th>{c.thAnio}</th>
                      <th>{c.thFlujo}</th>
                      <th>{c.thFactor}</th>
                      <th>{c.thValorActual}</th>
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
                        <strong>{c.sumaFlujosDescontados}</strong>
                      </td>
                      <td>
                        <strong>{formatEUR(result.valorActualFlujos)}</strong>
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={3}>
                        {c.valorResidualRow(n, formatEUR(result.valorResidual))}
                      </td>
                      <td>{formatEUR(result.valorActualResidual)}</td>
                    </tr>
                    <tr>
                      <td colSpan={3}>
                        <strong>{c.valorEmpresaRow}</strong>
                      </td>
                      <td>
                        <strong>{formatEUR(result.valorEmpresa)}</strong>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <p>
                  WACC = {formatPercent(wacc, 1, false)} &nbsp;·&nbsp; g ={' '}
                  {formatPercent(g, 1, false)}. {c.resumenResidual}
                </p>
              </div>
            </details>
          </>
        )}
      </div>
    </div>
  );
}
