/** @jsxImportSource preact */
import { useMemo, useState } from 'preact/hooks';

/**
 * Punto muerto / umbral de rentabilidad calculator.
 *
 *   Q* = CF / (P − CVu)
 *
 * Useful for the capstone project when each team needs to estimate
 * the break-even of their proposed business.
 */
export default function PuntoMuertoCalc() {
  const [cf, setCf] = useState<number>(3000);
  const [precio, setPrecio] = useState<number>(1.5);
  const [cvu, setCvu] = useState<number>(0.5);
  const [demandaPrevista, setDemandaPrevista] = useState<number>(4000);

  const result = useMemo(() => {
    const margen = precio - cvu;
    if (margen <= 0) {
      return {
        valido: false,
        mensaje: 'El precio debe ser mayor que el coste variable unitario para tener punto muerto.',
        margen,
      };
    }
    const Q = cf / margen;
    const facturacionEnPM = Q * precio;
    const beneficioPrevisto = demandaPrevista * margen - cf;
    const margenSeguridad = demandaPrevista > 0 ? ((demandaPrevista - Q) / demandaPrevista) * 100 : 0;
    return {
      valido: true,
      margen,
      Q,
      facturacionEnPM,
      beneficioPrevisto,
      margenSeguridad,
      cubrePuntoMuerto: demandaPrevista >= Q,
    };
  }, [cf, precio, cvu, demandaPrevista]);
  return (
    <div class="calc">
      <div class="calc__form">
        <label class="calc__field">
          <span class="calc__label">Costes fijos mensuales (CF)</span>
          <div class="calc__input-wrap">
            <input
              type="number"
              min={0}
              step={50}
              value={cf}
              onInput={(e) => setCf(parseFloat((e.target as HTMLInputElement).value) || 0)}
            />
            <span class="calc__unit">€/mes</span>
          </div>
        </label>

        <label class="calc__field">
          <span class="calc__label">Precio de venta unitario (P)</span>
          <div class="calc__input-wrap">
            <input
              type="number"
              min={0}
              step={0.1}
              value={precio}
              onInput={(e) => setPrecio(parseFloat((e.target as HTMLInputElement).value) || 0)}
            />
            <span class="calc__unit">€/unidad</span>
          </div>
        </label>

        <label class="calc__field">
          <span class="calc__label">Coste variable unitario (CVu)</span>
          <div class="calc__input-wrap">
            <input
              type="number"
              min={0}
              step={0.1}
              value={cvu}
              onInput={(e) => setCvu(parseFloat((e.target as HTMLInputElement).value) || 0)}
            />
            <span class="calc__unit">€/unidad</span>
          </div>
        </label>

        <label class="calc__field">
          <span class="calc__label">Demanda prevista (opcional)</span>
          <div class="calc__input-wrap">
            <input
              type="number"
              min={0}
              step={50}
              value={demandaPrevista}
              onInput={(e) => setDemandaPrevista(parseFloat((e.target as HTMLInputElement).value) || 0)}
            />
            <span class="calc__unit">unidades/mes</span>
          </div>
        </label>
      </div>

      <div class="calc__results">
        {!result.valido ? (
          <div class="calc__warning">{result.mensaje}</div>
        ) : (
          <>
            <div class="calc__metric calc__metric--primary">
              <span class="calc__metric-label">Punto muerto</span>
              <span class="calc__metric-value">{Math.ceil(result.Q!).toLocaleString('es-ES')}</span>
              <span class="calc__metric-unit">unidades/mes</span>
              <span class="calc__metric-detail">
                ≈ {fmtMoney(result.facturacionEnPM!)} de facturación mensual
              </span>
            </div>

            <div class="calc__metric-grid">
              <div class="calc__metric-mini">
                <span class="calc__metric-mini-label">Margen contribución unitario</span>
                <span class="calc__metric-mini-value">{fmtMoney(result.margen!)}</span>
              </div>
              <div class="calc__metric-mini">
                <span class="calc__metric-mini-label">Beneficio previsto (con la demanda)</span>
                <span class={`calc__metric-mini-value ${result.beneficioPrevisto! >= 0 ? 'ok' : 'fail'}`}>
                  {fmtMoney(result.beneficioPrevisto!)}/mes
                </span>
              </div>
              <div class="calc__metric-mini">
                <span class="calc__metric-mini-label">Margen de seguridad</span>
                <span class={`calc__metric-mini-value ${result.cubrePuntoMuerto ? 'ok' : 'fail'}`}>
                  {result.margenSeguridad!.toFixed(1).replace('.', ',')} %
                </span>
              </div>
            </div>

            <div class="calc__bar">
              <div
                class="calc__bar-fill"
                style={{
                  width: `${Math.min(100, (demandaPrevista / Math.max(result.Q!, demandaPrevista || 1)) * 100)}%`,
                  background: result.cubrePuntoMuerto ? 'var(--color-terra)' : '#B83A3A',
                }}
              />
              <div
                class="calc__bar-marker"
                style={{
                  left: `${Math.min(100, (result.Q! / Math.max(result.Q!, demandaPrevista || 1)) * 100)}%`,
                }}
                title="Punto muerto"
              />
              <div class="calc__bar-legend">
                <span>0</span>
                <span class="calc__bar-pm">PM ≈ {Math.ceil(result.Q!).toLocaleString('es-ES')}</span>
                <span>{Math.max(result.Q!, demandaPrevista).toLocaleString('es-ES')}</span>
              </div>
            </div>

            <details class="calc__details">
              <summary>Cómo se calcula</summary>
              <div class="calc__formula">
                <p><strong>Margen de contribución unitario</strong> = P − CVu = {fmtMoney(precio)} − {fmtMoney(cvu)} = <strong>{fmtMoney(result.margen!)}</strong></p>
                <p><strong>Punto muerto</strong> = CF / (P − CVu) = {fmtMoney(cf)} / {fmtMoney(result.margen!)} = <strong>{Math.ceil(result.Q!).toLocaleString('es-ES')} unidades</strong></p>
                <p>El margen de seguridad indica cuánto puede caer la demanda antes de entrar en pérdidas. En este caso: {result.margenSeguridad! >= 0 ? 'sobran' : 'faltan'} {Math.abs(demandaPrevista - result.Q!).toFixed(0)} unidades para llegar al punto muerto.</p>
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
