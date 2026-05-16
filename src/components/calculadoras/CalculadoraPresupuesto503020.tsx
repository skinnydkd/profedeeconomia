/** @jsxImportSource preact */
import { useMemo, useState } from 'preact/hooks';

/**
 * Calculadora del presupuesto 50-30-20 (regla de Elizabeth Warren) para Eco 4ESO.
 *
 *   50 % necesidades · 30 % deseos · 20 % ahorro/inversión
 *
 * Compara la situación real del alumnado con el reparto ideal y emite consejos
 * automáticos cuando las desviaciones son significativas.
 */

type Preset = {
  label: string;
  ingresos: number;
  necesidades: number;
  deseos: number;
  ahorro: number;
};

const PRESETS: Preset[] = [
  { label: 'Estudiante 17 años con paga', ingresos: 300, necesidades: 250, deseos: 30, ahorro: 20 },
  { label: 'Adulto joven primer sueldo', ingresos: 1500, necesidades: 900, deseos: 450, ahorro: 150 },
];

export default function CalculadoraPresupuesto503020() {
  const [ingresos, setIngresos] = useState<number>(1000);
  const [necesidades, setNecesidades] = useState<number>(600);
  const [deseos, setDeseos] = useState<number>(250);
  const [ahorro, setAhorro] = useState<number>(150);

  const result = useMemo(() => {
    if (ingresos <= 0) {
      return { valido: false as const, mensaje: 'Introduce unos ingresos mensuales mayores que 0.' };
    }
    const total = necesidades + deseos + ahorro;
    const sobrante = ingresos - total;
    const pctNecesidades = (necesidades / ingresos) * 100;
    const pctDeseos = (deseos / ingresos) * 100;
    const pctAhorro = (ahorro / ingresos) * 100;
    const idealNecesidades = ingresos * 0.5;
    const idealDeseos = ingresos * 0.3;
    const idealAhorro = ingresos * 0.2;

    const consejos: { tono: 'warn' | 'ok' | 'info'; texto: string }[] = [];
    if (pctNecesidades > 60) {
      consejos.push({
        tono: 'warn',
        texto: `Las necesidades se llevan ${pctNecesidades.toFixed(0)} % de tus ingresos. Cuando superan el 60 %, te queda muy poco margen para ahorrar o imprevistos.`,
      });
    }
    if (pctAhorro < 10) {
      consejos.push({
        tono: 'warn',
        texto: `Solo ahorras ${pctAhorro.toFixed(0)} % de los ingresos. Por debajo del 10 % cuesta mucho formar un colchón para imprevistos.`,
      });
    }
    if (pctAhorro >= 20) {
      consejos.push({
        tono: 'ok',
        texto: `Buen trabajo: ahorras al menos el 20 % recomendado. Plantéate qué quieres hacer con ese dinero a medio plazo.`,
      });
    }
    if (sobrante < 0) {
      consejos.push({
        tono: 'warn',
        texto: `Gastas ${fmtMoney(Math.abs(sobrante))} más de lo que ingresas. Recortar deseos suele ser el camino más rápido para equilibrar.`,
      });
    } else if (sobrante > ingresos * 0.05) {
      consejos.push({
        tono: 'info',
        texto: `Te sobran ${fmtMoney(sobrante)} sin asignar. Decide adónde van: ¿más ahorro, un capricho consciente o un fondo de emergencia?`,
      });
    }

    return {
      valido: true as const,
      total,
      sobrante,
      pctNecesidades,
      pctDeseos,
      pctAhorro,
      idealNecesidades,
      idealDeseos,
      idealAhorro,
      consejos,
    };
  }, [ingresos, necesidades, deseos, ahorro]);

  function applyPreset(p: Preset) {
    setIngresos(p.ingresos);
    setNecesidades(p.necesidades);
    setDeseos(p.deseos);
    setAhorro(p.ahorro);
  }
  function reset() {
    setIngresos(1000);
    setNecesidades(600);
    setDeseos(250);
    setAhorro(150);
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
          <span class="calc__label">Ingresos mensuales</span>
          <div class="calc__input-wrap">
            <input
              type="number"
              min={0}
              step={50}
              value={ingresos}
              onInput={(e) => setIngresos(parseFloat((e.target as HTMLInputElement).value) || 0)}
            />
            <span class="calc__unit">€/mes</span>
          </div>
        </label>

        <label class="calc__field">
          <span class="calc__label">Necesidades (vivienda, comida, transporte…)</span>
          <div class="calc__input-wrap">
            <input
              type="number"
              min={0}
              step={10}
              value={necesidades}
              onInput={(e) => setNecesidades(parseFloat((e.target as HTMLInputElement).value) || 0)}
            />
            <span class="calc__unit">€/mes</span>
          </div>
        </label>

        <label class="calc__field">
          <span class="calc__label">Deseos (ocio, ropa no esencial…)</span>
          <div class="calc__input-wrap">
            <input
              type="number"
              min={0}
              step={10}
              value={deseos}
              onInput={(e) => setDeseos(parseFloat((e.target as HTMLInputElement).value) || 0)}
            />
            <span class="calc__unit">€/mes</span>
          </div>
        </label>

        <label class="calc__field">
          <span class="calc__label">Ahorro / inversión</span>
          <div class="calc__input-wrap">
            <input
              type="number"
              min={0}
              step={10}
              value={ahorro}
              onInput={(e) => setAhorro(parseFloat((e.target as HTMLInputElement).value) || 0)}
            />
            <span class="calc__unit">€/mes</span>
          </div>
        </label>
      </div>

      <div class="calc__results">
        {!result.valido ? (
          <div class="calc__warning">{result.mensaje}</div>
        ) : (
          <>
            <p class="calc__sub">Tu reparto real frente al ideal 50-30-20</p>
            <div class="calc__stack-bars">
              <div class="calc__stack-bar">
                <span class="calc__stack-bar-label">Real</span>
                <div class="calc__stack">
                  <div
                    class="calc__stack-seg calc__stack-seg--nec"
                    style={{ width: `${Math.min(100, result.pctNecesidades)}%` }}
                    title={`Necesidades ${result.pctNecesidades.toFixed(0)} %`}
                  />
                  <div
                    class="calc__stack-seg calc__stack-seg--des"
                    style={{ width: `${Math.min(100, result.pctDeseos)}%` }}
                    title={`Deseos ${result.pctDeseos.toFixed(0)} %`}
                  />
                  <div
                    class="calc__stack-seg calc__stack-seg--aho"
                    style={{ width: `${Math.min(100, result.pctAhorro)}%` }}
                    title={`Ahorro ${result.pctAhorro.toFixed(0)} %`}
                  />
                </div>
              </div>
              <div class="calc__stack-bar">
                <span class="calc__stack-bar-label">Ideal</span>
                <div class="calc__stack">
                  <div class="calc__stack-seg calc__stack-seg--nec" style={{ width: '50%' }} />
                  <div class="calc__stack-seg calc__stack-seg--des" style={{ width: '30%' }} />
                  <div class="calc__stack-seg calc__stack-seg--aho" style={{ width: '20%' }} />
                </div>
              </div>
              <div class="calc__stack-legend">
                <span><i class="calc__dot calc__dot--nec" /> Necesidades</span>
                <span><i class="calc__dot calc__dot--des" /> Deseos</span>
                <span><i class="calc__dot calc__dot--aho" /> Ahorro</span>
              </div>
            </div>

            <div class="calc__metric-grid">
              <div class="calc__metric-mini">
                <span class="calc__metric-mini-label">Ingresos totales</span>
                <span class="calc__metric-mini-value">{fmtMoney(ingresos)}</span>
              </div>
              <div class="calc__metric-mini">
                <span class="calc__metric-mini-label">Necesidades (ideal 50 %)</span>
                <span
                  class={`calc__metric-mini-value ${
                    result.pctNecesidades > 60 ? 'fail' : result.pctNecesidades <= 50 ? 'ok' : ''
                  }`}
                >
                  {result.pctNecesidades.toFixed(0)} %
                </span>
              </div>
              <div class="calc__metric-mini">
                <span class="calc__metric-mini-label">Deseos (ideal 30 %)</span>
                <span
                  class={`calc__metric-mini-value ${
                    result.pctDeseos > 40 ? 'fail' : result.pctDeseos <= 30 ? 'ok' : ''
                  }`}
                >
                  {result.pctDeseos.toFixed(0)} %
                </span>
              </div>
              <div class="calc__metric-mini">
                <span class="calc__metric-mini-label">Ahorro (ideal 20 %)</span>
                <span
                  class={`calc__metric-mini-value ${
                    result.pctAhorro >= 20 ? 'ok' : result.pctAhorro < 10 ? 'fail' : ''
                  }`}
                >
                  {result.pctAhorro.toFixed(0)} %
                </span>
              </div>
            </div>

            <div
              class={`calc__warning ${result.sobrante >= 0 ? 'is-ok' : ''}`}
              style="margin-top: 1rem;"
            >
              {result.sobrante >= 0
                ? `Total asignado: ${fmtMoney(result.total)}. Te sobran ${fmtMoney(result.sobrante)} sin clasificar.`
                : `Total asignado: ${fmtMoney(result.total)}. Vas en déficit de ${fmtMoney(Math.abs(result.sobrante))} este mes.`}
            </div>

            {result.consejos.length > 0 && (
              <>
                <p class="calc__sub">Consejos automáticos</p>
                <ul class="calc__tips">
                  {result.consejos.map((c) => (
                    <li class={`calc__tip calc__tip--${c.tono}`}>{c.texto}</li>
                  ))}
                </ul>
              </>
            )}

            <details class="calc__details">
              <summary>Sobre la regla 50-30-20</summary>
              <div class="calc__formula">
                <p>
                  La regla la popularizó la senadora estadounidense Elizabeth Warren
                  en el libro <em>All Your Worth</em> (2005). Reparte los ingresos
                  netos en tres bolsillos: <strong>50 %</strong> para necesidades
                  (alquiler, comida, transporte básico), <strong>30 %</strong> para
                  deseos (ocio, ropa no esencial, suscripciones) y <strong>20 %</strong>
                  para ahorro o pago de deudas.
                </p>
                <p>
                  Es una <strong>guía orientativa</strong>, no una norma rígida. En
                  ciudades caras es habitual que las necesidades superen el 50 %; lo
                  importante es que el porcentaje de ahorro nunca quede a 0.
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
