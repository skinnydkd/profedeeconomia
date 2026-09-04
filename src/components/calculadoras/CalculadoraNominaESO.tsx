/** @jsxImportSource preact */
import { useMemo, useState } from 'preact/hooks';
import { calcularNomina, type Contrato } from '../../lib/calc/nomina';
import type { Discapacidad } from '../../lib/calc/irpf';
import { formatEUR, formatPercent } from '../../lib/calc/format';
import { type Locale } from '@/i18n/locale';

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

/**
 * UI strings, Valencian (AVL) alongside the ES source. Economic notation
 * (IRPF, MEI, €, %, contribution rates) is not translated. Contract types and
 * disability grades keep a structural (ES) id; only their label is localized.
 * Guarded by copy-parity.test.ts.
 */
export const COPY = {
  es: {
    presets: {
      auxiliar: 'Auxiliar admin (1.500 €/mes)',
      programador: 'Programador junior (2.500 €/mes)',
      camarero: 'Camarero temporal (900 €/mes)',
      familia: 'Padre/madre con 2 hijos (2.000 €/mes)',
    },
    reiniciar: 'Reiniciar',
    tusDatos: 'Tus datos',
    salarioBrutoMensual: 'Salario bruto mensual',
    unitEuroMes: '€/mes',
    pagasAlAnio: 'Pagas al año',
    docePagas: '12 pagas',
    catorcePagas: '14 pagas',
    tipoContrato: 'Tipo de contrato',
    indefinido: 'Indefinido',
    temporal: 'Temporal',
    hijosACargo: 'Hijos a tu cargo',
    unitHijos: 'hijos',
    gradoDiscapacidad: 'Grado de discapacidad',
    discapacidadOpciones: {
      ninguna: 'Sin discapacidad',
      media: '33 % – 65 %',
      alta: '65 % o más',
    },
    otrasDeducciones: 'Otras deducciones IRPF',
    unitEuroAnio: '€/año',
    errorBruto: 'Introduce un salario bruto mensual mayor que 0.',
    brutoMensual: 'Bruto mensual',
    loQueFirma: 'Lo que firma el contrato',
    seguridadSocial: 'Seguridad Social',
    delBruto: 'del bruto',
    irpfMensual: 'IRPF mensual',
    tipoMedio: 'Tipo medio',
    liquidoMensual: 'Líquido mensual',
    loQueIngresas: 'Lo que realmente ingresas cada mes en tu cuenta',
    brutoAnual: 'Bruto anual',
    liquidoAnual: 'Líquido anual',
    porcentajeEstado: '% que se queda el Estado',
    desgloseCompleto: 'Desglose completo de la nómina',
    thConcepto: 'Concepto',
    thImporteAnual: 'Importe anual',
    salarioBrutoAnual: 'Salario bruto anual',
    contingenciasComunes: 'Contingencias comunes',
    desempleo: (temporal: boolean) =>
      temporal ? 'Desempleo (temporal)' : 'Desempleo (indefinido)',
    formacionProfesional: 'Formación profesional',
    totalSeguridadSocial: 'Total Seguridad Social',
    baseIRPF: 'Base para el IRPF',
    retencionIRPF: 'Retención IRPF',
    liquidoAnualPercibir: 'Líquido anual a percibir',
    minimoTitulo: 'Mínimo personal y familiar aplicado:',
    minimoDetalle:
      '(parte de tu sueldo que no paga IRPF gracias a tu situación personal y a los hijos a tu cargo).',
    notaOrientativa:
      'Datos 2026. Usamos la escala estatal del IRPF; la retención real también depende de tu comunidad autónoma y de otras circunstancias, así que esta cifra es orientativa.',
    queSignifica: '¿Qué significa cada concepto?',
    tipCotiTitle: 'Cotizaciones a la Seguridad Social:',
    tipCotiText:
      'dinero que pagas cada mes para tener derecho a sanidad, paro, baja por enfermedad y, en el futuro, pensión de jubilación.',
    tipIrpfTitle: 'IRPF:',
    tipIrpfText:
      'el impuesto sobre la renta. Cuanto más ganas, mayor porcentaje retienes. Tener hijos o una discapacidad reduce lo que pagas, porque parte de tu sueldo queda exenta.',
    tipLiquidoTitle: 'Líquido (o neto):',
    tipLiquidoText:
      'lo que de verdad llega a tu cuenta después de restar la Seguridad Social y el IRPF. Por eso el sueldo "real" siempre es menor que el bruto del contrato.',
  },
  ca: {
    presets: {
      auxiliar: 'Auxiliar admin (1.500 €/mes)',
      programador: 'Programador júnior (2.500 €/mes)',
      camarero: 'Cambrer temporal (900 €/mes)',
      familia: 'Pare/mare amb 2 fills (2.000 €/mes)',
    },
    reiniciar: 'Reiniciar',
    tusDatos: 'Les teues dades',
    salarioBrutoMensual: 'Salari brut mensual',
    unitEuroMes: '€/mes',
    pagasAlAnio: "Pagues a l'any",
    docePagas: '12 pagues',
    catorcePagas: '14 pagues',
    tipoContrato: 'Tipus de contracte',
    indefinido: 'Indefinit',
    temporal: 'Temporal',
    hijosACargo: 'Fills al teu càrrec',
    unitHijos: 'fills',
    gradoDiscapacidad: 'Grau de discapacitat',
    discapacidadOpciones: {
      ninguna: 'Sense discapacitat',
      media: '33 % – 65 %',
      alta: '65 % o més',
    },
    otrasDeducciones: 'Altres deduccions IRPF',
    unitEuroAnio: '€/any',
    errorBruto: 'Introduïx un salari brut mensual major que 0.',
    brutoMensual: 'Brut mensual',
    loQueFirma: 'El que firma el contracte',
    seguridadSocial: 'Seguretat Social',
    delBruto: 'del brut',
    irpfMensual: 'IRPF mensual',
    tipoMedio: 'Tipus mitjà',
    liquidoMensual: 'Líquid mensual',
    loQueIngresas: 'El que realment ingresses cada mes al teu compte',
    brutoAnual: 'Brut anual',
    liquidoAnual: 'Líquid anual',
    porcentajeEstado: "% que es queda l'Estat",
    desgloseCompleto: 'Desglossament complet de la nòmina',
    thConcepto: 'Concepte',
    thImporteAnual: 'Import anual',
    salarioBrutoAnual: 'Salari brut anual',
    contingenciasComunes: 'Contingències comunes',
    desempleo: (temporal: boolean) =>
      temporal ? 'Desocupació (temporal)' : 'Desocupació (indefinit)',
    formacionProfesional: 'Formació professional',
    totalSeguridadSocial: 'Total Seguretat Social',
    baseIRPF: "Base per a l'IRPF",
    retencionIRPF: 'Retenció IRPF',
    liquidoAnualPercibir: 'Líquid anual a percebre',
    minimoTitulo: 'Mínim personal i familiar aplicat:',
    minimoDetalle:
      '(part del teu sou que no paga IRPF gràcies a la teua situació personal i als fills al teu càrrec).',
    notaOrientativa:
      "Dades 2026. Fem servir l'escala estatal de l'IRPF; la retenció real també depén de la teua comunitat autònoma i d'altres circumstàncies, així que esta xifra és orientativa.",
    queSignifica: 'Què significa cada concepte?',
    tipCotiTitle: 'Cotitzacions a la Seguretat Social:',
    tipCotiText:
      'diners que pagues cada mes per a tindre dret a sanitat, atur, baixa per malaltia i, en el futur, pensió de jubilació.',
    tipIrpfTitle: 'IRPF:',
    tipIrpfText:
      "l'impost sobre la renda. Com més guanyes, major percentatge retens. Tindre fills o una discapacitat reduïx el que pagues, perquè part del teu sou queda exempta.",
    tipLiquidoTitle: 'Líquid (o net):',
    tipLiquidoText:
      'el que de veritat arriba al teu compte després de restar la Seguretat Social i l\'IRPF. Per això el sou "real" sempre és menor que el brut del contracte.',
  },
} as const;

type Preset = {
  id: 'auxiliar' | 'programador' | 'camarero' | 'familia';
  brutoAnual: number;
  pagas: 12 | 14;
  contrato: Contrato;
  hijos: number;
};

const PRESETS: Preset[] = [
  { id: 'auxiliar', brutoAnual: 1500 * 14, pagas: 14, contrato: 'indefinido', hijos: 0 },
  { id: 'programador', brutoAnual: 2500 * 12, pagas: 12, contrato: 'indefinido', hijos: 0 },
  { id: 'camarero', brutoAnual: 900 * 14, pagas: 14, contrato: 'temporal', hijos: 0 },
  { id: 'familia', brutoAnual: 2000 * 14, pagas: 14, contrato: 'indefinido', hijos: 2 },
];

const DISCAPACIDAD_OPCIONES: { value: Discapacidad }[] = [
  { value: 'ninguna' },
  { value: 'media' },
  { value: 'alta' },
];

interface Props { locale?: Locale }

export default function CalculadoraNominaESO({ locale = 'es' }: Props) {
  const c = COPY[locale];
  const [brutoMensual, setBrutoMensual] = useState<number>(1500);
  const [pagas, setPagas] = useState<12 | 14>(14);
  const [contrato, setContrato] = useState<Contrato>('indefinido');
  const [hijos, setHijos] = useState<number>(0);
  const [discapacidad, setDiscapacidad] = useState<Discapacidad>('ninguna');
  const [deducciones, setDeducciones] = useState<number>(0);

  const brutoAnual = brutoMensual * pagas;

  const result = useMemo(() => {
    if (brutoMensual <= 0) {
      return { valido: false as const, mensaje: c.errorBruto };
    }
    const n = calcularNomina(brutoAnual, { pagas, contrato, hijos, discapacidad, deducciones });
    return { valido: true as const, n };
  }, [brutoAnual, brutoMensual, pagas, contrato, hijos, discapacidad, deducciones, c]);

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
            {c.presets[p.id]}
          </button>
        ))}
        <button type="button" class="calc__btn calc__btn--ghost" onClick={reset}>
          {c.reiniciar}
        </button>
      </div>

      <p class="calc__sub">{c.tusDatos}</p>
      <div class="calc__form">
        <label class="calc__field">
          <span class="calc__label">{c.salarioBrutoMensual}</span>
          <div class="calc__input-wrap">
            <input
              type="number"
              min={0}
              step={50}
              value={brutoMensual}
              onInput={(e) => setBrutoMensual(parseFloat((e.target as HTMLInputElement).value) || 0)}
            />
            <span class="calc__unit">{c.unitEuroMes}</span>
          </div>
        </label>

        <div class="calc__field">
          <span class="calc__label">{c.pagasAlAnio}</span>
          <div class="calc__radio-group">
            <label class={`calc__radio ${pagas === 12 ? 'is-active' : ''}`}>
              <input type="radio" name="pagas" checked={pagas === 12} onChange={() => setPagas(12)} />
              <span>{c.docePagas}</span>
            </label>
            <label class={`calc__radio ${pagas === 14 ? 'is-active' : ''}`}>
              <input type="radio" name="pagas" checked={pagas === 14} onChange={() => setPagas(14)} />
              <span>{c.catorcePagas}</span>
            </label>
          </div>
        </div>

        <div class="calc__field">
          <span class="calc__label">{c.tipoContrato}</span>
          <div class="calc__radio-group">
            <label class={`calc__radio ${contrato === 'indefinido' ? 'is-active' : ''}`}>
              <input
                type="radio"
                name="contrato"
                checked={contrato === 'indefinido'}
                onChange={() => setContrato('indefinido')}
              />
              <span>{c.indefinido}</span>
            </label>
            <label class={`calc__radio ${contrato === 'temporal' ? 'is-active' : ''}`}>
              <input
                type="radio"
                name="contrato"
                checked={contrato === 'temporal'}
                onChange={() => setContrato('temporal')}
              />
              <span>{c.temporal}</span>
            </label>
          </div>
        </div>

        <label class="calc__field">
          <span class="calc__label">{c.hijosACargo}</span>
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
            <span class="calc__unit">{c.unitHijos}</span>
          </div>
        </label>

        <label class="calc__field">
          <span class="calc__label">{c.gradoDiscapacidad}</span>
          <div class="calc__input-wrap">
            <select
              value={discapacidad}
              onChange={(e) => setDiscapacidad((e.target as HTMLSelectElement).value as Discapacidad)}
              style="flex:1; border:none; background:transparent; font-family:var(--font-sans); font-size:0.95rem; color:var(--color-ink); outline:none;"
            >
              {DISCAPACIDAD_OPCIONES.map((o) => (
                <option value={o.value}>{c.discapacidadOpciones[o.value]}</option>
              ))}
            </select>
          </div>
        </label>

        <label class="calc__field">
          <span class="calc__label">{c.otrasDeducciones}</span>
          <div class="calc__input-wrap">
            <input
              type="number"
              min={0}
              step={50}
              value={deducciones}
              onInput={(e) => setDeducciones(Math.max(0, parseFloat((e.target as HTMLInputElement).value) || 0))}
            />
            <span class="calc__unit">{c.unitEuroAnio}</span>
          </div>
        </label>
      </div>

      <div class="calc__results">
        {!result.valido ? (
          <div class="calc__warning">{result.mensaje}</div>
        ) : (
          <Resultado n={result.n} locale={locale} />
        )}
      </div>
    </div>
  );
}

function Resultado({ n, locale }: { n: ReturnType<typeof calcularNomina>; locale: Locale }) {
  const c = n.cotizaciones;
  const t = COPY[locale];
  return (
    <>
      <div class="calc__metric-grid calc__metric-grid--three">
        <div class="calc__metric">
          <span class="calc__metric-label">{t.brutoMensual}</span>
          <span class="calc__metric-value">{formatEUR(n.brutoMensual)}</span>
          <span class="calc__metric-detail">{t.loQueFirma}</span>
        </div>
        <div class="calc__metric calc__metric--fail">
          <span class="calc__metric-label">{t.seguridadSocial}</span>
          <span class="calc__metric-value">−{formatEUR(c.mensual)}</span>
          <span class="calc__metric-detail">
            {formatPercent(c.total / n.brutoAnual)} {t.delBruto}
          </span>
        </div>
        <div class="calc__metric calc__metric--fail">
          <span class="calc__metric-label">{t.irpfMensual}</span>
          <span class="calc__metric-value">−{formatEUR(n.irpf.cuota / n.pagas)}</span>
          <span class="calc__metric-detail">{t.tipoMedio} {formatPercent(n.irpf.tipoMedio, 1, false)}</span>
        </div>
      </div>

      <div class="calc__metric calc__metric--primary">
        <span class="calc__metric-label">{t.liquidoMensual}</span>
        <span class="calc__metric-value">{formatEUR(n.liquidoMensual)}</span>
        <span class="calc__metric-detail">{t.loQueIngresas}</span>
      </div>

      <div class="calc__metric-grid">
        <div class="calc__metric-mini">
          <span class="calc__metric-mini-label">{t.brutoAnual}</span>
          <span class="calc__metric-mini-value">{formatEUR(n.brutoAnual)}</span>
        </div>
        <div class="calc__metric-mini">
          <span class="calc__metric-mini-label">{t.liquidoAnual}</span>
          <span class="calc__metric-mini-value ok">{formatEUR(n.liquidoAnual)}</span>
        </div>
        <div class="calc__metric-mini">
          <span class="calc__metric-mini-label">{t.porcentajeEstado}</span>
          <span class="calc__metric-mini-value fail">
            {formatPercent((c.total + n.irpf.cuota) / n.brutoAnual)}
          </span>
        </div>
      </div>

      <details class="calc__details" open>
        <summary>{t.desgloseCompleto}</summary>
        <div class="calc__formula">
          <table class="calc__table">
            <thead>
              <tr>
                <th>{t.thConcepto}</th>
                <th>%</th>
                <th>{t.thImporteAnual}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>{t.salarioBrutoAnual}</strong></td>
                <td>100 %</td>
                <td><strong>{formatEUR(n.brutoAnual)}</strong></td>
              </tr>
              <tr>
                <td>{t.contingenciasComunes}</td>
                <td>4,70 %</td>
                <td>−{formatEUR(c.contingenciasComunes)}</td>
              </tr>
              <tr>
                <td>{t.desempleo(n.contrato === 'temporal')}</td>
                <td>{n.contrato === 'temporal' ? '1,60 %' : '1,55 %'}</td>
                <td>−{formatEUR(c.desempleo)}</td>
              </tr>
              <tr>
                <td>{t.formacionProfesional}</td>
                <td>0,10 %</td>
                <td>−{formatEUR(c.formacionProfesional)}</td>
              </tr>
              <tr>
                <td>MEI</td>
                <td>0,15 %</td>
                <td>−{formatEUR(c.mei)}</td>
              </tr>
              <tr>
                <td><strong>{t.totalSeguridadSocial}</strong></td>
                <td><strong>{formatPercent(c.total / n.brutoAnual)}</strong></td>
                <td><strong>−{formatEUR(c.total)}</strong></td>
              </tr>
              <tr>
                <td><strong>{t.baseIRPF}</strong></td>
                <td>—</td>
                <td><strong>{formatEUR(n.baseIRPF)}</strong></td>
              </tr>
              <tr>
                <td>{t.retencionIRPF}</td>
                <td>{formatPercent(n.irpf.tipoMedio, 1, false)}</td>
                <td>−{formatEUR(n.irpf.cuota)}</td>
              </tr>
              <tr>
                <td><strong>{t.liquidoAnualPercibir}</strong></td>
                <td>—</td>
                <td><strong class="ok">{formatEUR(n.liquidoAnual)}</strong></td>
              </tr>
            </tbody>
          </table>

          <p style="margin-top: 0.9rem;">
            <strong>{t.minimoTitulo}</strong>{' '}
            {formatEUR(n.irpf.minimo)} {t.minimoDetalle}
          </p>
          <p>
            <em>
              {t.notaOrientativa}
            </em>
          </p>
        </div>
      </details>

      <p class="calc__sub">{t.queSignifica}</p>
      <ul class="calc__tips">
        <li class="calc__tip calc__tip--info">
          <strong>{t.tipCotiTitle}</strong> {t.tipCotiText}
        </li>
        <li class="calc__tip calc__tip--info">
          <strong>{t.tipIrpfTitle}</strong> {t.tipIrpfText}
        </li>
        <li class="calc__tip calc__tip--info">
          <strong>{t.tipLiquidoTitle}</strong> {t.tipLiquidoText}
        </li>
      </ul>
    </>
  );
}
