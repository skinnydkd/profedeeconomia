/** @jsxImportSource preact */
import { useMemo, useState } from 'preact/hooks';
import { simularDeclaracion } from '../../lib/calc/declaracion-irpf';
import type { Discapacidad } from '../../lib/calc/irpf';
import { formatEUR, formatPercent } from '../../lib/calc/format';

/**
 * Simulador de la declaración de la renta (IRPF) para Eco 4ESO, Unidad 8.
 *
 * A diferencia de la nómina (que calcula la retención mensual), la declaración
 * compara la cuota anual real de IRPF con las retenciones ya practicadas a lo
 * largo del año y muestra el resultado: a pagar o a devolver.
 *
 * Toda la aritmética vive en módulos puros y testeados
 * (lib/calc/declaracion-irpf.ts, que reutiliza lib/calc/irpf.ts); este
 * componente solo gestiona la interfaz.
 */

type Preset = {
  label: string;
  rendimientosTrabajo: number;
  retencionesPracticadas: number;
  hijos: number;
};

const PRESETS: Preset[] = [
  // Slightly over-withheld worker => típico "a devolver".
  { label: 'Sueldo medio, retuvo de más', rendimientosTrabajo: 24000, retencionesPracticadas: 3000, hijos: 0 },
  // Under-withheld => "a pagar".
  { label: 'Dos pagadores, retuvo de menos', rendimientosTrabajo: 28000, retencionesPracticadas: 2200, hijos: 0 },
  // With children, lower quota => more refund.
  { label: 'Familia con 2 hijos', rendimientosTrabajo: 30000, retencionesPracticadas: 4500, hijos: 2 },
  // First job, low income => casi todo a devolver.
  { label: 'Primer empleo (jornada parcial)', rendimientosTrabajo: 11000, retencionesPracticadas: 300, hijos: 0 },
];

const DISCAPACIDAD_OPCIONES: { value: Discapacidad; label: string }[] = [
  { value: 'ninguna', label: 'Sin discapacidad' },
  { value: 'media', label: '33 % – 65 %' },
  { value: 'alta', label: '65 % o más' },
];

export default function IRPFDeclaracion() {
  const [rendimientosTrabajo, setRendimientosTrabajo] = useState<number>(24000);
  const [retencionesPracticadas, setRetencionesPracticadas] = useState<number>(3000);
  const [rendimientosCapital, setRendimientosCapital] = useState<number>(0);
  const [hijos, setHijos] = useState<number>(0);
  const [discapacidad, setDiscapacidad] = useState<Discapacidad>('ninguna');

  const result = useMemo(() => {
    if (rendimientosTrabajo <= 0 && rendimientosCapital <= 0 && retencionesPracticadas <= 0) {
      return { valido: false as const, mensaje: 'Introduce tus ingresos del año para hacer la declaración.' };
    }
    const d = simularDeclaracion({
      rendimientosTrabajo,
      retencionesPracticadas,
      rendimientosCapital,
      hijos,
      discapacidad,
    });
    return { valido: true as const, d };
  }, [rendimientosTrabajo, retencionesPracticadas, rendimientosCapital, hijos, discapacidad]);

  function applyPreset(p: Preset) {
    setRendimientosTrabajo(p.rendimientosTrabajo);
    setRetencionesPracticadas(p.retencionesPracticadas);
    setRendimientosCapital(0);
    setHijos(p.hijos);
    setDiscapacidad('ninguna');
  }
  function reset() {
    setRendimientosTrabajo(24000);
    setRetencionesPracticadas(3000);
    setRendimientosCapital(0);
    setHijos(0);
    setDiscapacidad('ninguna');
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

      <p class="calc__sub">Tus datos del año</p>
      <div class="calc__form">
        <label class="calc__field">
          <span class="calc__label">Ingresos íntegros del trabajo</span>
          <div class="calc__input-wrap">
            <input
              type="number"
              min={0}
              step={500}
              value={rendimientosTrabajo}
              onInput={(e) =>
                setRendimientosTrabajo(Math.max(0, parseFloat((e.target as HTMLInputElement).value) || 0))
              }
            />
            <span class="calc__unit">€/año</span>
          </div>
        </label>

        <label class="calc__field">
          <span class="calc__label">Retenciones ya practicadas</span>
          <div class="calc__input-wrap">
            <input
              type="number"
              min={0}
              step={100}
              value={retencionesPracticadas}
              onInput={(e) =>
                setRetencionesPracticadas(Math.max(0, parseFloat((e.target as HTMLInputElement).value) || 0))
              }
            />
            <span class="calc__unit">€/año</span>
          </div>
        </label>

        <label class="calc__field">
          <span class="calc__label">Intereses y dividendos (opcional)</span>
          <div class="calc__input-wrap">
            <input
              type="number"
              min={0}
              step={100}
              value={rendimientosCapital}
              onInput={(e) =>
                setRendimientosCapital(Math.max(0, parseFloat((e.target as HTMLInputElement).value) || 0))
              }
            />
            <span class="calc__unit">€/año</span>
          </div>
        </label>

        <label class="calc__field">
          <span class="calc__label">Hijos a tu cargo</span>
          <div class="calc__input-wrap">
            <input
              type="number"
              min={0}
              max={10}
              step={1}
              value={hijos}
              onInput={(e) =>
                setHijos(Math.max(0, Math.floor(parseFloat((e.target as HTMLInputElement).value) || 0)))
              }
            />
            <span class="calc__unit">hijos</span>
          </div>
        </label>

        <label class="calc__field">
          <span class="calc__label">Grado de discapacidad</span>
          <div class="calc__input-wrap">
            <select
              value={discapacidad}
              onChange={(e) => setDiscapacidad((e.target as HTMLSelectElement).value as Discapacidad)}
              style="flex:1; border:none; background:transparent; font-family:var(--font-sans); font-size:0.95rem; color:var(--color-ink); outline:none;"
            >
              {DISCAPACIDAD_OPCIONES.map((o) => (
                <option value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </label>
      </div>

      <div class="calc__results">
        {!result.valido ? (
          <div class="calc__warning">{result.mensaje}</div>
        ) : (
          <Resultado d={result.d} />
        )}
      </div>
    </div>
  );
}

function Resultado({ d }: { d: ReturnType<typeof simularDeclaracion> }) {
  // Color the headline metric: green when Hacienda refunds, red when you owe.
  const claseDestacada = d.aPagar ? 'calc__metric--fail' : 'calc__metric--ok';
  const titulo = d.aPagar ? 'A PAGAR' : d.aDevolver ? 'A DEVOLVER' : 'SIN RESULTADO';
  const signo = d.aPagar ? '+' : d.aDevolver ? '−' : '';
  const detalle = d.aPagar
    ? 'Te retuvieron menos de lo que tocaba: tienes que pagar la diferencia a Hacienda.'
    : d.aDevolver
      ? 'Te retuvieron de más durante el año: Hacienda te devuelve la diferencia.'
      : 'Las retenciones coinciden con tu cuota: no pagas ni te devuelven.';

  return (
    <>
      <div class={`calc__metric ${claseDestacada}`}>
        <span class="calc__metric-label">Resultado de tu declaración</span>
        <span class="calc__metric-value">
          {titulo} {signo}
          {formatEUR(d.importe)}
        </span>
        <span class="calc__metric-detail">{detalle}</span>
      </div>

      <div class="calc__metric-grid calc__metric-grid--three">
        <div class="calc__metric">
          <span class="calc__metric-label">Cuota de IRPF (lo que debías)</span>
          <span class="calc__metric-value">{formatEUR(d.cuotaIRPF)}</span>
          <span class="calc__metric-detail">Tipo medio {formatPercent(d.tipoMedio, 1, false)}</span>
        </div>
        <div class="calc__metric">
          <span class="calc__metric-label">Retenciones practicadas</span>
          <span class="calc__metric-value">{formatEUR(d.retenciones)}</span>
          <span class="calc__metric-detail">Lo que ya te quitaron las nóminas</span>
        </div>
        <div class={`calc__metric ${claseDestacada}`}>
          <span class="calc__metric-label">Diferencia</span>
          <span class="calc__metric-value">
            {signo}
            {formatEUR(d.importe)}
          </span>
          <span class="calc__metric-detail">Cuota − retenciones</span>
        </div>
      </div>

      <details class="calc__details" open>
        <summary>¿Cómo sale este resultado?</summary>
        <div class="calc__formula">
          <table class="calc__table">
            <thead>
              <tr>
                <th>Concepto</th>
                <th>Importe anual</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Ingresos íntegros del trabajo</td>
                <td>{formatEUR(d.rendimientosTrabajo)}</td>
              </tr>
              {d.rendimientosCapital > 0 && (
                <tr>
                  <td>Intereses y dividendos</td>
                  <td>{formatEUR(d.rendimientosCapital)}</td>
                </tr>
              )}
              <tr>
                <td>Cotizaciones a la Seguridad Social</td>
                <td>−{formatEUR(d.cotizaciones)}</td>
              </tr>
              <tr>
                <td><strong>Base imponible</strong></td>
                <td><strong>{formatEUR(d.baseImponible)}</strong></td>
              </tr>
              <tr>
                <td>Mínimo personal y familiar (no paga IRPF)</td>
                <td>{formatEUR(d.minimo)}</td>
              </tr>
              <tr>
                <td><strong>Cuota de IRPF del año</strong></td>
                <td><strong>{formatEUR(d.cuotaIRPF)}</strong></td>
              </tr>
              <tr>
                <td>Retenciones ya practicadas</td>
                <td>−{formatEUR(d.retenciones)}</td>
              </tr>
              <tr>
                <td><strong>Resultado de la declaración</strong></td>
                <td>
                  <strong class={d.aPagar ? 'fail' : 'ok'}>
                    {signo}
                    {formatEUR(d.importe)} {d.aPagar ? '(a pagar)' : d.aDevolver ? '(a devolver)' : ''}
                  </strong>
                </td>
              </tr>
            </tbody>
          </table>

          <p style="margin-top: 0.9rem;">
            <em>
              Datos 2026. Usamos la escala estatal del IRPF; el resultado real
              también depende de tu comunidad autónoma y de otras circunstancias,
              así que esta cifra es orientativa.
            </em>
          </p>
        </div>
      </details>

      <p class="calc__sub">¿Qué es hacer la declaración de la renta?</p>
      <ul class="calc__tips">
        <li class="calc__tip calc__tip--info">
          <strong>Durante el año</strong> tu empresa te adelanta el IRPF: te
          quita un poco de cada nómina (las <strong>retenciones</strong>) y se lo
          entrega a Hacienda en tu nombre.
        </li>
        <li class="calc__tip calc__tip--info">
          <strong>Al terminar el año</strong> haces la declaración: se calcula la
          <strong> cuota</strong> que de verdad te correspondía y se compara con
          lo que ya te habían retenido.
        </li>
        <li class="calc__tip calc__tip--info">
          <strong>Si te retuvieron de más</strong>, sale <strong>a devolver</strong>:
          Hacienda te ingresa la diferencia. <strong>Si te retuvieron de menos</strong>,
          sale <strong>a pagar</strong>: tienes que abonar lo que falta.
        </li>
      </ul>
    </>
  );
}
