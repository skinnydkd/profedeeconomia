/** @jsxImportSource preact */
import { useMemo, useState } from 'preact/hooks';

/**
 * Calculadora de nómina española simplificada para Eco 4ESO.
 *
 * Calcula el salario neto a partir del bruto mensual aplicando:
 *  - IRPF por tramos estatales 2024 (escala simplificada)
 *  - Cotización del trabajador a la Seguridad Social (6,35 %)
 *
 * Pensada para que el alumnado entienda por qué su primer sueldo "real" siempre
 * es menor que el bruto firmado en el contrato.
 */

type Tramo = { hasta: number; tipo: number; etiqueta: string };

const TRAMOS_IRPF_2024: Tramo[] = [
  { hasta: 12450, tipo: 0.19, etiqueta: '0 – 12.450 €' },
  { hasta: 20200, tipo: 0.24, etiqueta: '12.450 – 20.200 €' },
  { hasta: 35200, tipo: 0.30, etiqueta: '20.200 – 35.200 €' },
  { hasta: 60000, tipo: 0.37, etiqueta: '35.200 – 60.000 €' },
  { hasta: Infinity, tipo: 0.45, etiqueta: '60.000 € en adelante' },
];

type Preset = { label: string; bruto: number; pagas: 12 | 14 };
const PRESETS: Preset[] = [
  { label: 'Auxiliar admin típico', bruto: 1500, pagas: 14 },
  { label: 'Programador junior', bruto: 2500, pagas: 12 },
  { label: 'Camarero a tiempo parcial', bruto: 900, pagas: 14 },
];

export default function CalculadoraNominaESO() {
  const [bruto, setBruto] = useState<number>(1500);
  const [pagas, setPagas] = useState<12 | 14>(14);
  const [rentaManual, setRentaManual] = useState<number | null>(null);

  const rentaAuto = bruto * pagas;
  const renta = rentaManual !== null ? rentaManual : rentaAuto;

  const result = useMemo(() => {
    if (bruto <= 0) {
      return { valido: false as const, mensaje: 'Introduce un salario bruto mensual mayor que 0.' };
    }

    // IRPF por tramos sobre la renta anual estimada
    let restante = renta;
    let irpfAnual = 0;
    let inicio = 0;
    const desglose: { etiqueta: string; tipo: number; baseEnTramo: number; cuota: number }[] = [];
    for (const t of TRAMOS_IRPF_2024) {
      const ancho = t.hasta - inicio;
      const baseEnTramo = Math.max(0, Math.min(restante, ancho));
      const cuota = baseEnTramo * t.tipo;
      irpfAnual += cuota;
      desglose.push({ etiqueta: t.etiqueta, tipo: t.tipo, baseEnTramo, cuota });
      restante -= baseEnTramo;
      inicio = t.hasta;
      if (restante <= 0) break;
    }

    const irpfMedio = renta > 0 ? (irpfAnual / renta) * 100 : 0;
    const irpfMensual = irpfAnual / pagas;
    const ssMensual = bruto * 0.0635;
    const liquidoMensual = bruto - irpfMensual - ssMensual;
    const liquidoAnual = liquidoMensual * pagas;
    const brutoAnual = bruto * pagas;

    return {
      valido: true as const,
      brutoAnual,
      irpfAnual,
      irpfMedio,
      irpfMensual,
      ssMensual,
      liquidoMensual,
      liquidoAnual,
      desglose,
    };
  }, [bruto, pagas, renta]);

  function applyPreset(p: Preset) {
    setBruto(p.bruto);
    setPagas(p.pagas);
    setRentaManual(null);
  }
  function reset() {
    setBruto(1500);
    setPagas(14);
    setRentaManual(null);
  }

  return (
    <div class="calc">
      <div class="calc__presets">
        {PRESETS.map((p) => (
          <button type="button" class="calc__btn calc__btn--ghost" onClick={() => applyPreset(p)}>
            {p.label}
          </button>
        ))}
        <button type="button" class="calc__btn calc__btn--ghost" onClick={reset}>
          Reiniciar
        </button>
      </div>

      <div class="calc__form">
        <label class="calc__field">
          <span class="calc__label">Salario bruto mensual</span>
          <div class="calc__input-wrap">
            <input
              type="number"
              min={0}
              step={50}
              value={bruto}
              onInput={(e) => {
                setBruto(parseFloat((e.target as HTMLInputElement).value) || 0);
                setRentaManual(null);
              }}
            />
            <span class="calc__unit">€/mes</span>
          </div>
        </label>

        <div class="calc__field">
          <span class="calc__label">Pagas extras al año</span>
          <div class="calc__radio-group">
            <label class={`calc__radio ${pagas === 12 ? 'is-active' : ''}`}>
              <input
                type="radio"
                name="pagas"
                checked={pagas === 12}
                onChange={() => {
                  setPagas(12);
                  setRentaManual(null);
                }}
              />
              <span>12 pagas</span>
            </label>
            <label class={`calc__radio ${pagas === 14 ? 'is-active' : ''}`}>
              <input
                type="radio"
                name="pagas"
                checked={pagas === 14}
                onChange={() => {
                  setPagas(14);
                  setRentaManual(null);
                }}
              />
              <span>14 pagas</span>
            </label>
          </div>
        </div>

        <label class="calc__field">
          <span class="calc__label">Renta anual estimada (editable)</span>
          <div class="calc__input-wrap">
            <input
              type="number"
              min={0}
              step={500}
              value={renta}
              onInput={(e) =>
                setRentaManual(parseFloat((e.target as HTMLInputElement).value) || 0)
              }
            />
            <span class="calc__unit">€/año</span>
          </div>
        </label>
      </div>

      <div class="calc__results">
        {!result.valido ? (
          <div class="calc__warning">{result.mensaje}</div>
        ) : (
          <>
            <div class="calc__metric-grid calc__metric-grid--three">
              <div class="calc__metric">
                <span class="calc__metric-label">Bruto mensual</span>
                <span class="calc__metric-value">{fmtMoney(bruto)}</span>
                <span class="calc__metric-detail">Lo que firma el contrato</span>
              </div>
              <div class="calc__metric calc__metric--fail">
                <span class="calc__metric-label">IRPF mensual</span>
                <span class="calc__metric-value">−{fmtMoney(result.irpfMensual)}</span>
                <span class="calc__metric-detail">
                  Tipo medio {result.irpfMedio.toFixed(2).replace('.', ',')} %
                </span>
              </div>
              <div class="calc__metric calc__metric--fail">
                <span class="calc__metric-label">Seguridad Social</span>
                <span class="calc__metric-value">−{fmtMoney(result.ssMensual)}</span>
                <span class="calc__metric-detail">6,35 % del bruto</span>
              </div>
            </div>

            <div class="calc__metric calc__metric--primary">
              <span class="calc__metric-label">Líquido mensual</span>
              <span class="calc__metric-value">{fmtMoney(result.liquidoMensual)}</span>
              <span class="calc__metric-detail">
                Lo que realmente ingresas cada mes en tu cuenta
              </span>
            </div>

            <div class="calc__metric-grid">
              <div class="calc__metric-mini">
                <span class="calc__metric-mini-label">% IRPF medio</span>
                <span class="calc__metric-mini-value">
                  {result.irpfMedio.toFixed(2).replace('.', ',')} %
                </span>
              </div>
              <div class="calc__metric-mini">
                <span class="calc__metric-mini-label">Bruto anual</span>
                <span class="calc__metric-mini-value">{fmtMoney(result.brutoAnual)}</span>
              </div>
              <div class="calc__metric-mini">
                <span class="calc__metric-mini-label">Líquido anual</span>
                <span class="calc__metric-mini-value ok">{fmtMoney(result.liquidoAnual)}</span>
              </div>
            </div>

            <details class="calc__details" open>
              <summary>Descomposición del IRPF por tramos</summary>
              <div class="calc__formula">
                <table class="calc__table">
                  <thead>
                    <tr>
                      <th>Tramo</th>
                      <th>Tipo</th>
                      <th>Base en este tramo</th>
                      <th>Cuota</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.desglose.map((d) => (
                      <tr>
                        <td>{d.etiqueta}</td>
                        <td>{(d.tipo * 100).toFixed(0)} %</td>
                        <td>{fmtMoney(d.baseEnTramo)}</td>
                        <td>{fmtMoney(d.cuota)}</td>
                      </tr>
                    ))}
                    <tr>
                      <td colSpan={3}>
                        <strong>Total IRPF anual</strong>
                      </td>
                      <td>
                        <strong>{fmtMoney(result.irpfAnual)}</strong>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <p style="margin-top: 0.8rem;">
                  <em>Escala estatal 2024 simplificada. La cifra real depende de tu
                  comunidad autónoma, situación familiar y deducciones aplicables.</em>
                </p>
              </div>
            </details>
          </>
        )}
      </div>
    </div>
  );
}

function fmtMoney(n: number): string {
  return n.toLocaleString('es-ES', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
