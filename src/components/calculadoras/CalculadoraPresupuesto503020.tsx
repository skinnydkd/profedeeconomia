/** @jsxImportSource preact */
import { useMemo, useState } from 'preact/hooks';
import { type Locale } from '@/i18n/locale';

/**
 * Calculadora del presupuesto 50-30-20 (regla de Elizabeth Warren) para Eco 4ESO.
 *
 *   50 % necesidades · 30 % deseos · 20 % ahorro/inversión
 *
 * Compara la situación real del alumnado con el reparto ideal y emite consejos
 * automáticos cuando las desviaciones son significativas.
 */

/**
 * UI strings, Valencian (AVL) alongside the ES source. The 50/30/20 split,
 * percentages and € are not translated. Guarded by copy-parity.test.ts.
 */
export const COPY = {
  es: {
    reiniciar: 'Reiniciar',
    presets: {
      estudiante: 'Estudiante 17 años con paga',
      adultoJoven: 'Adulto joven primer sueldo',
    },
    introduceIngresos: 'Introduce unos ingresos mensuales mayores que 0.',
    consejoNecesidadesAltas: (pct: string) =>
      `Las necesidades se llevan ${pct} % de tus ingresos. Cuando superan el 60 %, te queda muy poco margen para ahorrar o imprevistos.`,
    consejoAhorroBajo: (pct: string) =>
      `Solo ahorras ${pct} % de los ingresos. Por debajo del 10 % cuesta mucho formar un colchón para imprevistos.`,
    consejoAhorroOk:
      'Buen trabajo: ahorras al menos el 20 % recomendado. Plantéate qué quieres hacer con ese dinero a medio plazo.',
    consejoDeficit: (money: string) =>
      `Gastas ${money} más de lo que ingresas. Recortar deseos suele ser el camino más rápido para equilibrar.`,
    consejoSobrante: (money: string) =>
      `Te sobran ${money} sin asignar. Decide adónde van: ¿más ahorro, un capricho consciente o un fondo de emergencia?`,
    ingresosMensuales: 'Ingresos mensuales',
    euroMes: '€/mes',
    necesidadesLabel: 'Necesidades (vivienda, comida, transporte…)',
    deseosLabel: 'Deseos (ocio, ropa no esencial…)',
    ahorroLabel: 'Ahorro / inversión',
    repartoReal: 'Tu reparto real frente al ideal 50-30-20',
    real: 'Real',
    ideal: 'Ideal',
    titleNecesidades: (pct: string) => `Necesidades ${pct} %`,
    titleDeseos: (pct: string) => `Deseos ${pct} %`,
    titleAhorro: (pct: string) => `Ahorro ${pct} %`,
    legendNecesidades: 'Necesidades',
    legendDeseos: 'Deseos',
    legendAhorro: 'Ahorro',
    ingresosTotales: 'Ingresos totales',
    necesidadesIdeal: 'Necesidades (ideal 50 %)',
    deseosIdeal: 'Deseos (ideal 30 %)',
    ahorroIdeal: 'Ahorro (ideal 20 %)',
    resumenSobrante: (total: string, sobra: string) =>
      `Total asignado: ${total}. Te sobran ${sobra} sin clasificar.`,
    resumenDeficit: (total: string, deficit: string) =>
      `Total asignado: ${total}. Vas en déficit de ${deficit} este mes.`,
    consejosAutomaticos: 'Consejos automáticos',
    sobreLaRegla: 'Sobre la regla 50-30-20',
    regla1a: 'La regla la popularizó la senadora estadounidense Elizabeth Warren en el libro ',
    regla1b: ' (2005). Reparte los ingresos netos en tres bolsillos: ',
    regla1c: ' para necesidades (alquiler, comida, transporte básico), ',
    regla1d: ' para deseos (ocio, ropa no esencial, suscripciones) y ',
    regla1e: ' para ahorro o pago de deudas.',
    regla2a: 'Es una ',
    reglaOrientativa: 'guía orientativa',
    regla2b:
      ', no una norma rígida. En ciudades caras es habitual que las necesidades superen el 50 %; lo importante es que el porcentaje de ahorro nunca quede a 0.',
  },
  ca: {
    reiniciar: 'Reiniciar',
    presets: {
      estudiante: 'Estudiant de 17 anys amb paga',
      adultoJoven: 'Adult jove primer sou',
    },
    introduceIngresos: 'Introduïx uns ingressos mensuals majors que 0.',
    consejoNecesidadesAltas: (pct: string) =>
      `Les necessitats s'emporten ${pct} % dels teus ingressos. Quan superen el 60 %, et queda molt poc marge per a estalviar o imprevistos.`,
    consejoAhorroBajo: (pct: string) =>
      `Només estalvies ${pct} % dels ingressos. Per davall del 10 % costa molt formar un coixí per a imprevistos.`,
    consejoAhorroOk:
      "Bon treball: estalvies almenys el 20 % recomanat. Planteja't què vols fer amb eixos diners a mitjà termini.",
    consejoDeficit: (money: string) =>
      `Gastes ${money} més del que ingresses. Retallar desitjos sol ser el camí més ràpid per a equilibrar.`,
    consejoSobrante: (money: string) =>
      `Et sobren ${money} sense assignar. Decidix on van: més estalvi, un caprici conscient o un fons d'emergència?`,
    ingresosMensuales: 'Ingressos mensuals',
    euroMes: '€/mes',
    necesidadesLabel: 'Necessitats (habitatge, menjar, transport…)',
    deseosLabel: 'Desitjos (oci, roba no essencial…)',
    ahorroLabel: 'Estalvi / inversió',
    repartoReal: "El teu repartiment real enfront de l'ideal 50-30-20",
    real: 'Real',
    ideal: 'Ideal',
    titleNecesidades: (pct: string) => `Necessitats ${pct} %`,
    titleDeseos: (pct: string) => `Desitjos ${pct} %`,
    titleAhorro: (pct: string) => `Estalvi ${pct} %`,
    legendNecesidades: 'Necessitats',
    legendDeseos: 'Desitjos',
    legendAhorro: 'Estalvi',
    ingresosTotales: 'Ingressos totals',
    necesidadesIdeal: 'Necessitats (ideal 50 %)',
    deseosIdeal: 'Desitjos (ideal 30 %)',
    ahorroIdeal: 'Estalvi (ideal 20 %)',
    resumenSobrante: (total: string, sobra: string) =>
      `Total assignat: ${total}. Et sobren ${sobra} sense classificar.`,
    resumenDeficit: (total: string, deficit: string) =>
      `Total assignat: ${total}. Vas en dèficit de ${deficit} este mes.`,
    consejosAutomaticos: 'Consells automàtics',
    sobreLaRegla: 'Sobre la regla 50-30-20',
    regla1a: 'La regla la va popularitzar la senadora estatunidenca Elizabeth Warren en el llibre ',
    regla1b: ' (2005). Repartix els ingressos nets en tres butxaques: ',
    regla1c: ' per a necessitats (lloguer, menjar, transport bàsic), ',
    regla1d: ' per a desitjos (oci, roba no essencial, subscripcions) i ',
    regla1e: ' per a estalvi o pagament de deutes.',
    regla2a: 'És una ',
    reglaOrientativa: 'guia orientativa',
    regla2b:
      ", no una norma rígida. En ciutats cares és habitual que les necessitats superen el 50 %; l'important és que el percentatge d'estalvi mai quede a 0.",
  },
} as const;

interface Props { locale?: Locale }

type Preset = {
  id: 'estudiante' | 'adultoJoven';
  ingresos: number;
  necesidades: number;
  deseos: number;
  ahorro: number;
};

const PRESETS: Preset[] = [
  { id: 'estudiante', ingresos: 300, necesidades: 250, deseos: 30, ahorro: 20 },
  { id: 'adultoJoven', ingresos: 1500, necesidades: 900, deseos: 450, ahorro: 150 },
];

export default function CalculadoraPresupuesto503020({ locale = 'es' }: Props) {
  const c = COPY[locale];
  const [ingresos, setIngresos] = useState<number>(1000);
  const [necesidades, setNecesidades] = useState<number>(600);
  const [deseos, setDeseos] = useState<number>(250);
  const [ahorro, setAhorro] = useState<number>(150);

  const result = useMemo(() => {
    if (ingresos <= 0) {
      return { valido: false as const, mensaje: c.introduceIngresos };
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
        texto: c.consejoNecesidadesAltas(pctNecesidades.toFixed(0)),
      });
    }
    if (pctAhorro < 10) {
      consejos.push({
        tono: 'warn',
        texto: c.consejoAhorroBajo(pctAhorro.toFixed(0)),
      });
    }
    if (pctAhorro >= 20) {
      consejos.push({
        tono: 'ok',
        texto: c.consejoAhorroOk,
      });
    }
    if (sobrante < 0) {
      consejos.push({
        tono: 'warn',
        texto: c.consejoDeficit(fmtMoney(Math.abs(sobrante))),
      });
    } else if (sobrante > ingresos * 0.05) {
      consejos.push({
        tono: 'info',
        texto: c.consejoSobrante(fmtMoney(sobrante)),
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
  }, [ingresos, necesidades, deseos, ahorro, c]);

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
            {c.presets[p.id]}
          </button>
        ))}
        <button type="button" class="calc__btn calc__btn--ghost" onClick={reset}>
          {c.reiniciar}
        </button>
      </div>

      <div class="calc__form">
        <label class="calc__field">
          <span class="calc__label">{c.ingresosMensuales}</span>
          <div class="calc__input-wrap">
            <input
              type="number"
              min={0}
              step={50}
              value={ingresos}
              onInput={(e) => setIngresos(parseFloat((e.target as HTMLInputElement).value) || 0)}
            />
            <span class="calc__unit">{c.euroMes}</span>
          </div>
        </label>

        <label class="calc__field">
          <span class="calc__label">{c.necesidadesLabel}</span>
          <div class="calc__input-wrap">
            <input
              type="number"
              min={0}
              step={10}
              value={necesidades}
              onInput={(e) => setNecesidades(parseFloat((e.target as HTMLInputElement).value) || 0)}
            />
            <span class="calc__unit">{c.euroMes}</span>
          </div>
        </label>

        <label class="calc__field">
          <span class="calc__label">{c.deseosLabel}</span>
          <div class="calc__input-wrap">
            <input
              type="number"
              min={0}
              step={10}
              value={deseos}
              onInput={(e) => setDeseos(parseFloat((e.target as HTMLInputElement).value) || 0)}
            />
            <span class="calc__unit">{c.euroMes}</span>
          </div>
        </label>

        <label class="calc__field">
          <span class="calc__label">{c.ahorroLabel}</span>
          <div class="calc__input-wrap">
            <input
              type="number"
              min={0}
              step={10}
              value={ahorro}
              onInput={(e) => setAhorro(parseFloat((e.target as HTMLInputElement).value) || 0)}
            />
            <span class="calc__unit">{c.euroMes}</span>
          </div>
        </label>
      </div>

      <div class="calc__results">
        {!result.valido ? (
          <div class="calc__warning">{result.mensaje}</div>
        ) : (
          <>
            <p class="calc__sub">{c.repartoReal}</p>
            <div class="calc__stack-bars">
              <div class="calc__stack-bar">
                <span class="calc__stack-bar-label">{c.real}</span>
                <div class="calc__stack">
                  <div
                    class="calc__stack-seg calc__stack-seg--nec"
                    style={{ width: `${Math.min(100, result.pctNecesidades)}%` }}
                    title={c.titleNecesidades(result.pctNecesidades.toFixed(0))}
                  />
                  <div
                    class="calc__stack-seg calc__stack-seg--des"
                    style={{ width: `${Math.min(100, result.pctDeseos)}%` }}
                    title={c.titleDeseos(result.pctDeseos.toFixed(0))}
                  />
                  <div
                    class="calc__stack-seg calc__stack-seg--aho"
                    style={{ width: `${Math.min(100, result.pctAhorro)}%` }}
                    title={c.titleAhorro(result.pctAhorro.toFixed(0))}
                  />
                </div>
              </div>
              <div class="calc__stack-bar">
                <span class="calc__stack-bar-label">{c.ideal}</span>
                <div class="calc__stack">
                  <div class="calc__stack-seg calc__stack-seg--nec" style={{ width: '50%' }} />
                  <div class="calc__stack-seg calc__stack-seg--des" style={{ width: '30%' }} />
                  <div class="calc__stack-seg calc__stack-seg--aho" style={{ width: '20%' }} />
                </div>
              </div>
              <div class="calc__stack-legend">
                <span><i class="calc__dot calc__dot--nec" /> {c.legendNecesidades}</span>
                <span><i class="calc__dot calc__dot--des" /> {c.legendDeseos}</span>
                <span><i class="calc__dot calc__dot--aho" /> {c.legendAhorro}</span>
              </div>
            </div>

            <div class="calc__metric-grid">
              <div class="calc__metric-mini">
                <span class="calc__metric-mini-label">{c.ingresosTotales}</span>
                <span class="calc__metric-mini-value">{fmtMoney(ingresos)}</span>
              </div>
              <div class="calc__metric-mini">
                <span class="calc__metric-mini-label">{c.necesidadesIdeal}</span>
                <span
                  class={`calc__metric-mini-value ${
                    result.pctNecesidades > 60 ? 'fail' : result.pctNecesidades <= 50 ? 'ok' : ''
                  }`}
                >
                  {result.pctNecesidades.toFixed(0)} %
                </span>
              </div>
              <div class="calc__metric-mini">
                <span class="calc__metric-mini-label">{c.deseosIdeal}</span>
                <span
                  class={`calc__metric-mini-value ${
                    result.pctDeseos > 40 ? 'fail' : result.pctDeseos <= 30 ? 'ok' : ''
                  }`}
                >
                  {result.pctDeseos.toFixed(0)} %
                </span>
              </div>
              <div class="calc__metric-mini">
                <span class="calc__metric-mini-label">{c.ahorroIdeal}</span>
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
                ? c.resumenSobrante(fmtMoney(result.total), fmtMoney(result.sobrante))
                : c.resumenDeficit(fmtMoney(result.total), fmtMoney(Math.abs(result.sobrante)))}
            </div>

            {result.consejos.length > 0 && (
              <>
                <p class="calc__sub">{c.consejosAutomaticos}</p>
                <ul class="calc__tips">
                  {result.consejos.map((consejo) => (
                    <li class={`calc__tip calc__tip--${consejo.tono}`}>{consejo.texto}</li>
                  ))}
                </ul>
              </>
            )}

            <details class="calc__details">
              <summary>{c.sobreLaRegla}</summary>
              <div class="calc__formula">
                <p>
                  {c.regla1a}<em>All Your Worth</em>{c.regla1b}<strong>50 %</strong>{c.regla1c}
                  <strong>30 %</strong>{c.regla1d}<strong>20 %</strong>{c.regla1e}
                </p>
                <p>
                  {c.regla2a}<strong>{c.reglaOrientativa}</strong>{c.regla2b}
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
