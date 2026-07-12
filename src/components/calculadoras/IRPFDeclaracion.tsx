/** @jsxImportSource preact */
import { useMemo, useState } from 'preact/hooks';
import { simularDeclaracion } from '../../lib/calc/declaracion-irpf';
import type { Discapacidad } from '../../lib/calc/irpf';
import { formatEUR, formatPercent } from '../../lib/calc/format';
import { type Locale } from '@/i18n/locale';

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

/**
 * UI strings, Valencian (AVL) alongside the ES source. Fiscal notation
 * (IRPF, €, %) is not translated. Guarded by copy-parity.test.ts.
 */
export const COPY = {
  es: {
    reiniciar: 'Reiniciar',
    tusDatos: 'Tus datos del año',
    ingresosTrabajoLabel: 'Ingresos íntegros del trabajo',
    eurAnio: '€/año',
    retencionesLabel: 'Retenciones ya practicadas',
    interesesLabel: 'Intereses y dividendos (opcional)',
    hijosLabel: 'Hijos a tu cargo',
    hijosUnit: 'hijos',
    gradoLabel: 'Grado de discapacidad',
    mensajeVacio: 'Introduce tus ingresos del año para hacer la declaración.',
    presetSueldoMedio: 'Sueldo medio, retuvo de más',
    presetDosPagadores: 'Dos pagadores, retuvo de menos',
    presetFamilia2Hijos: 'Familia con 2 hijos',
    presetPrimerEmpleo: 'Primer empleo (jornada parcial)',
    discapacidadNinguna: 'Sin discapacidad',
    discapacidadMedia: '33 % – 65 %',
    discapacidadAlta: '65 % o más',
    tituloPagar: 'A PAGAR',
    tituloDevolver: 'A DEVOLVER',
    tituloSinResultado: 'SIN RESULTADO',
    detallePagar: 'Te retuvieron menos de lo que tocaba: tienes que pagar la diferencia a Hacienda.',
    detalleDevolver: 'Te retuvieron de más durante el año: Hacienda te devuelve la diferencia.',
    detalleNeutro: 'Las retenciones coinciden con tu cuota: no pagas ni te devuelven.',
    resultadoLabel: 'Resultado de tu declaración',
    cuotaLabel: 'Cuota de IRPF (lo que debías)',
    tipoMedio: (p: string) => `Tipo medio ${p}`,
    retencionesMetricLabel: 'Retenciones practicadas',
    retencionesMetricDetail: 'Lo que ya te quitaron las nóminas',
    diferenciaLabel: 'Diferencia',
    diferenciaDetail: 'Cuota − retenciones',
    comoSale: '¿Cómo sale este resultado?',
    thConcepto: 'Concepto',
    thImporte: 'Importe anual',
    interesesRow: 'Intereses y dividendos',
    cotizacionesRow: 'Cotizaciones a la Seguridad Social',
    baseImponibleRow: 'Base imponible',
    minimoRow: 'Mínimo personal y familiar (no paga IRPF)',
    cuotaAnioRow: 'Cuota de IRPF del año',
    resultadoRow: 'Resultado de la declaración',
    parenPagar: '(a pagar)',
    parenDevolver: '(a devolver)',
    nota: 'Datos 2026. Usamos la escala estatal del IRPF; el resultado real también depende de tu comunidad autónoma y de otras circunstancias, así que esta cifra es orientativa.',
    queEs: '¿Qué es hacer la declaración de la renta?',
    tip1a: 'Durante el año',
    tip1b: ' tu empresa te adelanta el IRPF: te quita un poco de cada nómina (las ',
    tip1c: 'retenciones',
    tip1d: ') y se lo entrega a Hacienda en tu nombre.',
    tip2a: 'Al terminar el año',
    tip2b: ' haces la declaración: se calcula la ',
    tip2c: 'cuota',
    tip2d: ' que de verdad te correspondía y se compara con lo que ya te habían retenido.',
    tip3a: 'Si te retuvieron de más',
    tip3b: ', sale ',
    tip3c: 'a devolver',
    tip3d: ': Hacienda te ingresa la diferencia. ',
    tip3e: 'Si te retuvieron de menos',
    tip3g: 'a pagar',
    tip3h: ': tienes que abonar lo que falta.',
  },
  ca: {
    reiniciar: 'Reiniciar',
    tusDatos: "Les teues dades de l'any",
    ingresosTrabajoLabel: 'Ingressos íntegres del treball',
    eurAnio: '€/any',
    retencionesLabel: 'Retencions ja practicades',
    interesesLabel: 'Interessos i dividends (opcional)',
    hijosLabel: 'Fills al teu càrrec',
    hijosUnit: 'fills',
    gradoLabel: 'Grau de discapacitat',
    mensajeVacio: "Introduïx els teus ingressos de l'any per a fer la declaració.",
    presetSueldoMedio: 'Sou mitjà, va retindre de més',
    presetDosPagadores: 'Dos pagadors, va retindre de menys',
    presetFamilia2Hijos: 'Família amb 2 fills',
    presetPrimerEmpleo: 'Primera faena (jornada parcial)',
    discapacidadNinguna: 'Sense discapacitat',
    discapacidadMedia: '33 % – 65 %',
    discapacidadAlta: '65 % o més',
    tituloPagar: 'A PAGAR',
    tituloDevolver: 'A TORNAR',
    tituloSinResultado: 'SENSE RESULTAT',
    detallePagar: 'Et van retindre menys del que tocava: has de pagar la diferència a Hisenda.',
    detalleDevolver: "Et van retindre de més durant l'any: Hisenda et torna la diferència.",
    detalleNeutro: 'Les retencions coincidixen amb la teua quota: no pagues ni et tornen.',
    resultadoLabel: 'Resultat de la teua declaració',
    cuotaLabel: "Quota d'IRPF (el que devies)",
    tipoMedio: (p: string) => `Tipus mitjà ${p}`,
    retencionesMetricLabel: 'Retencions practicades',
    retencionesMetricDetail: 'El que ja et van llevar les nòmines',
    diferenciaLabel: 'Diferència',
    diferenciaDetail: 'Quota − retencions',
    comoSale: 'Com ix este resultat?',
    thConcepto: 'Concepte',
    thImporte: 'Import anual',
    interesesRow: 'Interessos i dividends',
    cotizacionesRow: 'Cotitzacions a la Seguretat Social',
    baseImponibleRow: 'Base imposable',
    minimoRow: 'Mínim personal i familiar (no paga IRPF)',
    cuotaAnioRow: "Quota d'IRPF de l'any",
    resultadoRow: 'Resultat de la declaració',
    parenPagar: '(a pagar)',
    parenDevolver: '(a tornar)',
    nota: "Dades 2026. Usem l'escala estatal de l'IRPF; el resultat real també depèn de la teua comunitat autònoma i d'altres circumstàncies, així que esta xifra és orientativa.",
    queEs: 'Què és fer la declaració de la renda?',
    tip1a: "Durant l'any",
    tip1b: " la teua empresa t'avança l'IRPF: et lleva un poc de cada nòmina (les ",
    tip1c: 'retencions',
    tip1d: ") i l'entrega a Hisenda en el teu nom.",
    tip2a: "En acabar l'any",
    tip2b: ' fas la declaració: es calcula la ',
    tip2c: 'quota',
    tip2d: " que de veritat et corresponia i es compara amb el que ja t'havien retingut.",
    tip3a: 'Si et van retindre de més',
    tip3b: ', ix ',
    tip3c: 'a tornar',
    tip3d: ": Hisenda t'ingressa la diferència. ",
    tip3e: 'Si et van retindre de menys',
    tip3g: 'a pagar',
    tip3h: ": has d'abonar el que falta.",
  },
} as const;

interface Props { locale?: Locale }

type Preset = {
  id: string;
  rendimientosTrabajo: number;
  retencionesPracticadas: number;
  hijos: number;
};

const PRESETS: Preset[] = [
  // Slightly over-withheld worker => típico "a devolver".
  { id: 'sueldo-medio', rendimientosTrabajo: 24000, retencionesPracticadas: 3000, hijos: 0 },
  // Under-withheld => "a pagar".
  { id: 'dos-pagadores', rendimientosTrabajo: 28000, retencionesPracticadas: 2200, hijos: 0 },
  // With children, lower quota => more refund.
  { id: 'familia-2-hijos', rendimientosTrabajo: 30000, retencionesPracticadas: 4500, hijos: 2 },
  // First job, low income => casi todo a devolver.
  { id: 'primer-empleo', rendimientosTrabajo: 11000, retencionesPracticadas: 300, hijos: 0 },
];

const DISCAPACIDAD_OPCIONES: { value: Discapacidad }[] = [
  { value: 'ninguna' },
  { value: 'media' },
  { value: 'alta' },
];

export default function IRPFDeclaracion({ locale = 'es' }: Props) {
  const c = COPY[locale];
  const [rendimientosTrabajo, setRendimientosTrabajo] = useState<number>(24000);
  const [retencionesPracticadas, setRetencionesPracticadas] = useState<number>(3000);
  const [rendimientosCapital, setRendimientosCapital] = useState<number>(0);
  const [hijos, setHijos] = useState<number>(0);
  const [discapacidad, setDiscapacidad] = useState<Discapacidad>('ninguna');

  const presetLabel: Record<string, string> = {
    'sueldo-medio': c.presetSueldoMedio,
    'dos-pagadores': c.presetDosPagadores,
    'familia-2-hijos': c.presetFamilia2Hijos,
    'primer-empleo': c.presetPrimerEmpleo,
  };
  const discapacidadLabel: Record<Discapacidad, string> = {
    ninguna: c.discapacidadNinguna,
    media: c.discapacidadMedia,
    alta: c.discapacidadAlta,
  };

  const result = useMemo(() => {
    if (rendimientosTrabajo <= 0 && rendimientosCapital <= 0 && retencionesPracticadas <= 0) {
      return { valido: false as const, mensaje: c.mensajeVacio };
    }
    const d = simularDeclaracion({
      rendimientosTrabajo,
      retencionesPracticadas,
      rendimientosCapital,
      hijos,
      discapacidad,
    });
    return { valido: true as const, d };
  }, [rendimientosTrabajo, retencionesPracticadas, rendimientosCapital, hijos, discapacidad, c]);

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
            {presetLabel[p.id]}
          </button>
        ))}
        <button type="button" class="calc__btn calc__btn--ghost" onClick={reset}>
          {c.reiniciar}
        </button>
      </div>

      <p class="calc__sub">{c.tusDatos}</p>
      <div class="calc__form">
        <label class="calc__field">
          <span class="calc__label">{c.ingresosTrabajoLabel}</span>
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
            <span class="calc__unit">{c.eurAnio}</span>
          </div>
        </label>

        <label class="calc__field">
          <span class="calc__label">{c.retencionesLabel}</span>
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
            <span class="calc__unit">{c.eurAnio}</span>
          </div>
        </label>

        <label class="calc__field">
          <span class="calc__label">{c.interesesLabel}</span>
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
            <span class="calc__unit">{c.eurAnio}</span>
          </div>
        </label>

        <label class="calc__field">
          <span class="calc__label">{c.hijosLabel}</span>
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
            <span class="calc__unit">{c.hijosUnit}</span>
          </div>
        </label>

        <label class="calc__field">
          <span class="calc__label">{c.gradoLabel}</span>
          <div class="calc__input-wrap">
            <select
              value={discapacidad}
              onChange={(e) => setDiscapacidad((e.target as HTMLSelectElement).value as Discapacidad)}
              style="flex:1; border:none; background:transparent; font-family:var(--font-sans); font-size:0.95rem; color:var(--color-ink); outline:none;"
            >
              {DISCAPACIDAD_OPCIONES.map((o) => (
                <option value={o.value}>{discapacidadLabel[o.value]}</option>
              ))}
            </select>
          </div>
        </label>
      </div>

      <div class="calc__results">
        {!result.valido ? (
          <div class="calc__warning">{result.mensaje}</div>
        ) : (
          <Resultado d={result.d} locale={locale} />
        )}
      </div>
    </div>
  );
}

function Resultado({ d, locale }: { d: ReturnType<typeof simularDeclaracion>; locale: Locale }) {
  const c = COPY[locale];
  // Color the headline metric: green when Hacienda refunds, red when you owe.
  const claseDestacada = d.aPagar ? 'calc__metric--fail' : 'calc__metric--ok';
  const titulo = d.aPagar ? c.tituloPagar : d.aDevolver ? c.tituloDevolver : c.tituloSinResultado;
  const signo = d.aPagar ? '+' : d.aDevolver ? '−' : '';
  const detalle = d.aPagar
    ? c.detallePagar
    : d.aDevolver
      ? c.detalleDevolver
      : c.detalleNeutro;

  return (
    <>
      <div class={`calc__metric ${claseDestacada}`}>
        <span class="calc__metric-label">{c.resultadoLabel}</span>
        <span class="calc__metric-value">
          {titulo} {signo}
          {formatEUR(d.importe)}
        </span>
        <span class="calc__metric-detail">{detalle}</span>
      </div>

      <div class="calc__metric-grid calc__metric-grid--three">
        <div class="calc__metric">
          <span class="calc__metric-label">{c.cuotaLabel}</span>
          <span class="calc__metric-value">{formatEUR(d.cuotaIRPF)}</span>
          <span class="calc__metric-detail">{c.tipoMedio(formatPercent(d.tipoMedio, 1, false))}</span>
        </div>
        <div class="calc__metric">
          <span class="calc__metric-label">{c.retencionesMetricLabel}</span>
          <span class="calc__metric-value">{formatEUR(d.retenciones)}</span>
          <span class="calc__metric-detail">{c.retencionesMetricDetail}</span>
        </div>
        <div class={`calc__metric ${claseDestacada}`}>
          <span class="calc__metric-label">{c.diferenciaLabel}</span>
          <span class="calc__metric-value">
            {signo}
            {formatEUR(d.importe)}
          </span>
          <span class="calc__metric-detail">{c.diferenciaDetail}</span>
        </div>
      </div>

      <details class="calc__details" open>
        <summary>{c.comoSale}</summary>
        <div class="calc__formula">
          <table class="calc__table">
            <thead>
              <tr>
                <th>{c.thConcepto}</th>
                <th>{c.thImporte}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{c.ingresosTrabajoLabel}</td>
                <td>{formatEUR(d.rendimientosTrabajo)}</td>
              </tr>
              {d.rendimientosCapital > 0 && (
                <tr>
                  <td>{c.interesesRow}</td>
                  <td>{formatEUR(d.rendimientosCapital)}</td>
                </tr>
              )}
              <tr>
                <td>{c.cotizacionesRow}</td>
                <td>−{formatEUR(d.cotizaciones)}</td>
              </tr>
              <tr>
                <td><strong>{c.baseImponibleRow}</strong></td>
                <td><strong>{formatEUR(d.baseImponible)}</strong></td>
              </tr>
              <tr>
                <td>{c.minimoRow}</td>
                <td>{formatEUR(d.minimo)}</td>
              </tr>
              <tr>
                <td><strong>{c.cuotaAnioRow}</strong></td>
                <td><strong>{formatEUR(d.cuotaIRPF)}</strong></td>
              </tr>
              <tr>
                <td>{c.retencionesLabel}</td>
                <td>−{formatEUR(d.retenciones)}</td>
              </tr>
              <tr>
                <td><strong>{c.resultadoRow}</strong></td>
                <td>
                  <strong class={d.aPagar ? 'fail' : 'ok'}>
                    {signo}
                    {formatEUR(d.importe)} {d.aPagar ? c.parenPagar : d.aDevolver ? c.parenDevolver : ''}
                  </strong>
                </td>
              </tr>
            </tbody>
          </table>

          <p style="margin-top: 0.9rem;">
            <em>{c.nota}</em>
          </p>
        </div>
      </details>

      <p class="calc__sub">{c.queEs}</p>
      <ul class="calc__tips">
        <li class="calc__tip calc__tip--info">
          <strong>{c.tip1a}</strong>{c.tip1b}<strong>{c.tip1c}</strong>{c.tip1d}
        </li>
        <li class="calc__tip calc__tip--info">
          <strong>{c.tip2a}</strong>{c.tip2b}<strong>{c.tip2c}</strong>{c.tip2d}
        </li>
        <li class="calc__tip calc__tip--info">
          <strong>{c.tip3a}</strong>{c.tip3b}<strong>{c.tip3c}</strong>{c.tip3d}<strong>{c.tip3e}</strong>{c.tip3b}<strong>{c.tip3g}</strong>{c.tip3h}
        </li>
      </ul>
    </>
  );
}
