/** @jsxImportSource preact */
import { useMemo, useState } from 'preact/hooks';
import { calcularNomina, type Contrato } from '../../lib/calc/nomina';
import type { Discapacidad } from '../../lib/calc/irpf';
import { formatEUR, formatPercent } from '../../lib/calc/format';

/**
 * Calculadora de nómina española para Eco 4ESO.
 *
 * Calcula el salario neto a partir del bruto aplicando, con datos 2026:
 *  - Cotizaciones del trabajador a la Seguridad Social (contingencias comunes,
 *    desempleo, formación profesional y MEI).
 *  - Retención de IRPF por la escala estatal, con mínimo personal y familiar
 *    (hijos, discapacidad), reducción por rendimientos del trabajo y
 *    deducciones extra.
 *
 * Toda la aritmética vive en módulos puros y testeados (lib/calc/nomina.ts y
 * lib/calc/irpf.ts); este componente solo gestiona la interfaz.
 */

type Preset = {
  label: string;
  brutoAnual: number;
  pagas: 12 | 14;
  contrato: Contrato;
  hijos: number;
};

const PRESETS: Preset[] = [
  { label: 'Auxiliar admin (1.500 €/mes)', brutoAnual: 1500 * 14, pagas: 14, contrato: 'indefinido', hijos: 0 },
  { label: 'Programador junior (2.500 €/mes)', brutoAnual: 2500 * 12, pagas: 12, contrato: 'indefinido', hijos: 0 },
  { label: 'Camarero temporal (900 €/mes)', brutoAnual: 900 * 14, pagas: 14, contrato: 'temporal', hijos: 0 },
  { label: 'Padre/madre con 2 hijos (2.000 €/mes)', brutoAnual: 2000 * 14, pagas: 14, contrato: 'indefinido', hijos: 2 },
];

const DISCAPACIDAD_OPCIONES: { value: Discapacidad; label: string }[] = [
  { value: 'ninguna', label: 'Sin discapacidad' },
  { value: 'media', label: '33 % – 65 %' },
  { value: 'alta', label: '65 % o más' },
];

export default function CalculadoraNominaESO() {
  const [brutoMensual, setBrutoMensual] = useState<number>(1500);
  const [pagas, setPagas] = useState<12 | 14>(14);
  const [contrato, setContrato] = useState<Contrato>('indefinido');
  const [hijos, setHijos] = useState<number>(0);
  const [discapacidad, setDiscapacidad] = useState<Discapacidad>('ninguna');
  const [deducciones, setDeducciones] = useState<number>(0);

  const brutoAnual = brutoMensual * pagas;

  const result = useMemo(() => {
    if (brutoMensual <= 0) {
      return { valido: false as const, mensaje: 'Introduce un salario bruto mensual mayor que 0.' };
    }
    const n = calcularNomina(brutoAnual, { pagas, contrato, hijos, discapacidad, deducciones });
    return { valido: true as const, n };
  }, [brutoAnual, brutoMensual, pagas, contrato, hijos, discapacidad, deducciones]);

  function applyPreset(p: Preset) {
    setBrutoMensual(p.brutoAnual / p.pagas);
    setPagas(p.pagas);
    setContrato(p.contrato);
    setHijos(p.hijos);
    setDiscapacidad('ninguna');
    setDeducciones(0);
  }
  function reset() {
    setBrutoMensual(1500);
    setPagas(14);
    setContrato('indefinido');
    setHijos(0);
    setDiscapacidad('ninguna');
    setDeducciones(0);
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

      <p class="calc__sub">Tus datos</p>
      <div class="calc__form">
        <label class="calc__field">
          <span class="calc__label">Salario bruto mensual</span>
          <div class="calc__input-wrap">
            <input
              type="number"
              min={0}
              step={50}
              value={brutoMensual}
              onInput={(e) => setBrutoMensual(parseFloat((e.target as HTMLInputElement).value) || 0)}
            />
            <span class="calc__unit">€/mes</span>
          </div>
        </label>

        <div class="calc__field">
          <span class="calc__label">Pagas al año</span>
          <div class="calc__radio-group">
            <label class={`calc__radio ${pagas === 12 ? 'is-active' : ''}`}>
              <input type="radio" name="pagas" checked={pagas === 12} onChange={() => setPagas(12)} />
              <span>12 pagas</span>
            </label>
            <label class={`calc__radio ${pagas === 14 ? 'is-active' : ''}`}>
              <input type="radio" name="pagas" checked={pagas === 14} onChange={() => setPagas(14)} />
              <span>14 pagas</span>
            </label>
          </div>
        </div>

        <div class="calc__field">
          <span class="calc__label">Tipo de contrato</span>
          <div class="calc__radio-group">
            <label class={`calc__radio ${contrato === 'indefinido' ? 'is-active' : ''}`}>
              <input
                type="radio"
                name="contrato"
                checked={contrato === 'indefinido'}
                onChange={() => setContrato('indefinido')}
              />
              <span>Indefinido</span>
            </label>
            <label class={`calc__radio ${contrato === 'temporal' ? 'is-active' : ''}`}>
              <input
                type="radio"
                name="contrato"
                checked={contrato === 'temporal'}
                onChange={() => setContrato('temporal')}
              />
              <span>Temporal</span>
            </label>
          </div>
        </div>

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

        <label class="calc__field">
          <span class="calc__label">Otras deducciones IRPF</span>
          <div class="calc__input-wrap">
            <input
              type="number"
              min={0}
              step={50}
              value={deducciones}
              onInput={(e) => setDeducciones(Math.max(0, parseFloat((e.target as HTMLInputElement).value) || 0))}
            />
            <span class="calc__unit">€/año</span>
          </div>
        </label>
      </div>

      <div class="calc__results">
        {!result.valido ? (
          <div class="calc__warning">{result.mensaje}</div>
        ) : (
          <Resultado n={result.n} />
        )}
      </div>
    </div>
  );
}

function Resultado({ n }: { n: ReturnType<typeof calcularNomina> }) {
  const c = n.cotizaciones;
  return (
    <>
      <div class="calc__metric-grid calc__metric-grid--three">
        <div class="calc__metric">
          <span class="calc__metric-label">Bruto mensual</span>
          <span class="calc__metric-value">{formatEUR(n.brutoMensual)}</span>
          <span class="calc__metric-detail">Lo que firma el contrato</span>
        </div>
        <div class="calc__metric calc__metric--fail">
          <span class="calc__metric-label">Seguridad Social</span>
          <span class="calc__metric-value">−{formatEUR(c.mensual)}</span>
          <span class="calc__metric-detail">
            {formatPercent(c.total / n.brutoAnual)} del bruto
          </span>
        </div>
        <div class="calc__metric calc__metric--fail">
          <span class="calc__metric-label">IRPF mensual</span>
          <span class="calc__metric-value">−{formatEUR(n.irpf.cuota / n.pagas)}</span>
          <span class="calc__metric-detail">Tipo medio {formatPercent(n.irpf.tipoMedio, 1, false)}</span>
        </div>
      </div>

      <div class="calc__metric calc__metric--primary">
        <span class="calc__metric-label">Líquido mensual</span>
        <span class="calc__metric-value">{formatEUR(n.liquidoMensual)}</span>
        <span class="calc__metric-detail">Lo que realmente ingresas cada mes en tu cuenta</span>
      </div>

      <div class="calc__metric-grid">
        <div class="calc__metric-mini">
          <span class="calc__metric-mini-label">Bruto anual</span>
          <span class="calc__metric-mini-value">{formatEUR(n.brutoAnual)}</span>
        </div>
        <div class="calc__metric-mini">
          <span class="calc__metric-mini-label">Líquido anual</span>
          <span class="calc__metric-mini-value ok">{formatEUR(n.liquidoAnual)}</span>
        </div>
        <div class="calc__metric-mini">
          <span class="calc__metric-mini-label">% que se queda el Estado</span>
          <span class="calc__metric-mini-value fail">
            {formatPercent((c.total + n.irpf.cuota) / n.brutoAnual)}
          </span>
        </div>
      </div>

      <details class="calc__details" open>
        <summary>Desglose completo de la nómina</summary>
        <div class="calc__formula">
          <table class="calc__table">
            <thead>
              <tr>
                <th>Concepto</th>
                <th>%</th>
                <th>Importe anual</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Salario bruto anual</strong></td>
                <td>100 %</td>
                <td><strong>{formatEUR(n.brutoAnual)}</strong></td>
              </tr>
              <tr>
                <td>Contingencias comunes</td>
                <td>4,70 %</td>
                <td>−{formatEUR(c.contingenciasComunes)}</td>
              </tr>
              <tr>
                <td>Desempleo ({n.contrato === 'temporal' ? 'temporal' : 'indefinido'})</td>
                <td>{n.contrato === 'temporal' ? '1,60 %' : '1,55 %'}</td>
                <td>−{formatEUR(c.desempleo)}</td>
              </tr>
              <tr>
                <td>Formación profesional</td>
                <td>0,10 %</td>
                <td>−{formatEUR(c.formacionProfesional)}</td>
              </tr>
              <tr>
                <td>MEI</td>
                <td>0,13 %</td>
                <td>−{formatEUR(c.mei)}</td>
              </tr>
              <tr>
                <td><strong>Total Seguridad Social</strong></td>
                <td><strong>{formatPercent(c.total / n.brutoAnual)}</strong></td>
                <td><strong>−{formatEUR(c.total)}</strong></td>
              </tr>
              <tr>
                <td><strong>Base para el IRPF</strong></td>
                <td>—</td>
                <td><strong>{formatEUR(n.baseIRPF)}</strong></td>
              </tr>
              <tr>
                <td>Retención IRPF</td>
                <td>{formatPercent(n.irpf.tipoMedio, 1, false)}</td>
                <td>−{formatEUR(n.irpf.cuota)}</td>
              </tr>
              <tr>
                <td><strong>Líquido anual a percibir</strong></td>
                <td>—</td>
                <td><strong class="ok">{formatEUR(n.liquidoAnual)}</strong></td>
              </tr>
            </tbody>
          </table>

          <p style="margin-top: 0.9rem;">
            <strong>Mínimo personal y familiar aplicado:</strong>{' '}
            {formatEUR(n.irpf.minimo)} (parte de tu sueldo que no paga IRPF
            gracias a tu situación personal y a los hijos a tu cargo).
          </p>
          <p>
            <em>
              Datos 2026. Usamos la escala estatal del IRPF; la retención real
              también depende de tu comunidad autónoma y de otras circunstancias,
              así que esta cifra es orientativa.
            </em>
          </p>
        </div>
      </details>

      <p class="calc__sub">¿Qué significa cada concepto?</p>
      <ul class="calc__tips">
        <li class="calc__tip calc__tip--info">
          <strong>Cotizaciones a la Seguridad Social:</strong> dinero que pagas
          cada mes para tener derecho a sanidad, paro, baja por enfermedad y, en
          el futuro, pensión de jubilación.
        </li>
        <li class="calc__tip calc__tip--info">
          <strong>IRPF:</strong> el impuesto sobre la renta. Cuanto más ganas,
          mayor porcentaje retienes. Tener hijos o una discapacidad reduce lo que
          pagas, porque parte de tu sueldo queda exenta.
        </li>
        <li class="calc__tip calc__tip--info">
          <strong>Líquido (o neto):</strong> lo que de verdad llega a tu cuenta
          después de restar la Seguridad Social y el IRPF. Por eso el sueldo
          "real" siempre es menor que el bruto del contrato.
        </li>
      </ul>
    </>
  );
}
