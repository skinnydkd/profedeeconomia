/** @jsxImportSource preact */
import { useMemo, useState } from 'preact/hooks';
import { type Locale } from '@/i18n/locale';
import { formatEUR, formatPercent } from '../../lib/calc/format';
import { calcularCoste, tasaTotalEmpresa, TASA_AT_EP_POR_DEFECTO } from '../../lib/calc/coste-contratacion';
import { type Contrato } from '../../lib/calc/nomina';

/**
 * UI strings, Valencian (AVL) alongside the ES source. Institutional names
 * (FOGASA, MEI, AT/EP, IRPF) are not translated.
 */
export const COPY = {
  es: {
    puestoTitulo: 'El puesto',
    bruto: 'Salario bruto anual (€)',
    contrato: 'Tipo de contrato',
    indefinido: 'Indefinido',
    temporal: 'Temporal',
    atEp: 'Tipo de accidentes y enfermedad profesional (%)',
    atEpAyuda: 'Depende de la actividad de la empresa: una oficina cotiza alrededor del 1,5 % y la construcción o el campo bastante más. Se consulta en la tarifa de primas vigente.',
    jornadaTitulo: 'La jornada',
    horasSemana: 'Horas por semana',
    semanas: 'Semanas trabajadas al año',
    semanasAyuda: 'Descontando vacaciones y festivos. Con 30 días naturales de vacaciones y los festivos del año, 46 semanas es una estimación razonable.',
    sinDatos: 'Revisa los datos: el salario tiene que ser positivo, el tipo de accidentes razonable y la jornada mayor que cero.',
    resumenTitulo: 'Lo que cuesta y lo que se cobra',
    costeTotal: 'Coste total para la empresa',
    costeMensual: 'Coste mensual',
    brutoLabel: 'Salario bruto',
    liquido: 'Lo que cobra la persona',
    costeHora: 'Coste por hora efectiva',
    horasEfectivas: 'Horas efectivas al año',
    sobrecoste: 'Sobrecoste sobre el bruto',
    desgloseTitulo: 'Cotizaciones a cargo de la empresa',
    colConcepto: 'Concepto',
    colTipo: 'Tipo',
    colImporte: 'Importe anual',
    contingencias: 'Contingencias comunes',
    desempleo: 'Desempleo',
    atEpFila: 'Accidentes y enfermedad profesional',
    fogasa: 'FOGASA',
    fp: 'Formación profesional',
    mei: 'MEI',
    totalFila: 'Total',
    cunaTitulo: 'La distancia entre las dos cifras',
    cunaLabel: 'Diferencia entre coste y líquido',
    cunaPorcentaje: 'Sobre el coste total',
    cunaTexto: 'Entre lo que paga la empresa y lo que llega a la cuenta de la persona hay cotizaciones —de la empresa y de la persona— e IRPF. Ni la empresa se lo queda ni la persona lo recibe: financia pensiones, desempleo, sanidad y el resto del gasto público. Conviene enseñar las tres cifras juntas, porque en clase casi siempre se conoce solo la del medio.',
    avisoTitulo: 'Antes de usarlo en un plan de empresa',
    aviso: 'Los tipos de cotización cambian cada año y aquí están los de 2026. La base de cotización se toma igual al salario bruto, sin aplicar bases mínimas ni máximas, y la retención de IRPF se calcula con la escala estatal. Para una nómina real hay que ir a la Tesorería General de la Seguridad Social y a la AEAT.',
    presets: 'Ejemplos',
    presetPrimerEmpleo: 'Primer empleo (18.000 €)',
    presetTecnico: 'Técnico (28.000 €)',
    presetObra: 'Peón de obra, temporal',
    comoSeCalcula: 'Cómo se calcula',
    formulaCosteTitle: 'Coste total',
    formulaCosteDesc: ': salario bruto + cotizaciones de la empresa. En 2026, con un indefinido y un 1,5 % de accidentes, esas cotizaciones suman el 32,15 % del bruto.',
    formulaHoraTitle: 'Coste por hora',
    formulaHoraDesc: ': coste total ÷ horas efectivas. Las horas efectivas son las de la jornada por las semanas realmente trabajadas, no por 52.',
    formulaCunaTitle: 'Diferencia',
    formulaCunaDesc: ': coste total − líquido anual. Recoge las cotizaciones de las dos partes y el IRPF.',
  },
  ca: {
    puestoTitulo: 'El lloc',
    bruto: 'Salari brut anual (€)',
    contrato: 'Tipus de contracte',
    indefinido: 'Indefinit',
    temporal: 'Temporal',
    atEp: "Tipus d'accidents i malaltia professional (%)",
    atEpAyuda: "Depén de l'activitat de l'empresa: una oficina cotitza al voltant de l'1,5 % i la construcció o el camp prou més. Es consulta a la tarifa de primes vigent.",
    jornadaTitulo: 'La jornada',
    horasSemana: 'Hores per setmana',
    semanas: "Setmanes treballades a l'any",
    semanasAyuda: "Descomptant vacances i festius. Amb 30 dies naturals de vacances i els festius de l'any, 46 setmanes és una estimació raonable.",
    sinDatos: "Revisa les dades: el salari ha de ser positiu, el tipus d'accidents raonable i la jornada major que zero.",
    resumenTitulo: 'El que costa i el que es cobra',
    costeTotal: "Cost total per a l'empresa",
    costeMensual: 'Cost mensual',
    brutoLabel: 'Salari brut',
    liquido: 'El que cobra la persona',
    costeHora: 'Cost per hora efectiva',
    horasEfectivas: "Hores efectives a l'any",
    sobrecoste: 'Sobrecost sobre el brut',
    desgloseTitulo: "Cotitzacions a càrrec de l'empresa",
    colConcepto: 'Concepte',
    colTipo: 'Tipus',
    colImporte: 'Import anual',
    contingencias: 'Contingències comunes',
    desempleo: 'Atur',
    atEpFila: 'Accidents i malaltia professional',
    fogasa: 'FOGASA',
    fp: 'Formació professional',
    mei: 'MEI',
    totalFila: 'Total',
    cunaTitulo: 'La distància entre les dues xifres',
    cunaLabel: 'Diferència entre cost i líquid',
    cunaPorcentaje: 'Sobre el cost total',
    cunaTexto: "Entre el que paga l'empresa i el que arriba al compte de la persona hi ha cotitzacions —de l'empresa i de la persona— i IRPF. Ni l'empresa s'ho queda ni la persona ho rep: finança pensions, atur, sanitat i la resta de la despesa pública. Convé ensenyar les tres xifres juntes, perquè a classe quasi sempre es coneix només la del mig.",
    avisoTitulo: "Abans d'usar-ho en un pla d'empresa",
    aviso: "Els tipus de cotització canvien cada any i ací hi ha els de 2026. La base de cotització es pren igual al salari brut, sense aplicar bases mínimes ni màximes, i la retenció d'IRPF es calcula amb l'escala estatal. Per a una nòmina real cal anar a la Tresoreria General de la Seguretat Social i a l'AEAT.",
    presets: 'Exemples',
    presetPrimerEmpleo: 'Primera faena (18.000 €)',
    presetTecnico: 'Tècnic (28.000 €)',
    presetObra: "Peó d'obra, temporal",
    comoSeCalcula: 'Com es calcula',
    formulaCosteTitle: 'Cost total',
    formulaCosteDesc: ": salari brut + cotitzacions de l'empresa. El 2026, amb un indefinit i un 1,5 % d'accidents, eixes cotitzacions sumen el 32,15 % del brut.",
    formulaHoraTitle: 'Cost per hora',
    formulaHoraDesc: ': cost total ÷ hores efectives. Les hores efectives són les de la jornada per les setmanes realment treballades, no per 52.',
    formulaCunaTitle: 'Diferència',
    formulaCunaDesc: ": cost total − líquid anual. Arreplega les cotitzacions de les dues parts i l'IRPF.",
  },
} as const;

interface Props { locale?: Locale }

const num = (e: Event) => parseFloat((e.target as HTMLInputElement).value) || 0;

/**
 * What a hire costs the company, next to what the worker takes home.
 *
 * Showing the three figures together — cost, gross, net — is the whole point:
 * a class that only ever sees the middle one reads the other two as a trick.
 *
 * EDMN 2BACH · Unit 8.
 */
export default function CosteContratacionCalc({ locale = 'es' }: Props) {
  const t = COPY[locale];

  const [bruto, setBruto] = useState<number>(24000);
  const [contrato, setContrato] = useState<Contrato>('indefinido');
  const [atEpPct, setAtEpPct] = useState<number>(TASA_AT_EP_POR_DEFECTO * 100);
  const [horasSemana, setHorasSemana] = useState<number>(40);
  const [semanas, setSemanas] = useState<number>(46);

  const r = useMemo(
    () => calcularCoste(bruto, { contrato, tasaAtEp: atEpPct / 100, horasSemana, semanasTrabajadas: semanas }),
    [bruto, contrato, atEpPct, horasSemana, semanas],
  );

  const filas = r.valido
    ? [
        { label: t.contingencias, tipo: 0.236, importe: r.cotizacionesEmpresa.contingenciasComunes },
        { label: t.desempleo, tipo: contrato === 'temporal' ? 0.067 : 0.055, importe: r.cotizacionesEmpresa.desempleo },
        { label: t.atEpFila, tipo: atEpPct / 100, importe: r.cotizacionesEmpresa.atEp },
        { label: t.fogasa, tipo: 0.002, importe: r.cotizacionesEmpresa.fogasa },
        { label: t.fp, tipo: 0.006, importe: r.cotizacionesEmpresa.formacionProfesional },
        { label: t.mei, tipo: 0.0075, importe: r.cotizacionesEmpresa.mei },
      ]
    : [];

  return (
    <div class="calc">
      <div class="calc__presets">
        <button type="button" class="calc__btn calc__btn--ghost"
          onClick={() => { setBruto(18000); setContrato('indefinido'); setAtEpPct(1.5); }}>{t.presetPrimerEmpleo}</button>
        <button type="button" class="calc__btn calc__btn--ghost"
          onClick={() => { setBruto(28000); setContrato('indefinido'); setAtEpPct(1.5); }}>{t.presetTecnico}</button>
        <button type="button" class="calc__btn calc__btn--ghost"
          onClick={() => { setBruto(21000); setContrato('temporal'); setAtEpPct(6.7); }}>{t.presetObra}</button>
      </div>

      <div class="cc__label">{t.puestoTitulo}</div>
      <div class="calc__form cc__row">
        <label class="calc__field">
          <span class="calc__label">{t.bruto}</span>
          <div class="calc__input-wrap">
            <input type="number" min={1} step={1000} value={bruto} onInput={(e) => setBruto(num(e))} />
          </div>
        </label>
        <label class="calc__field">
          <span class="calc__label">{t.contrato}</span>
          <div class="calc__input-wrap">
            <select value={contrato} onChange={(e) => setContrato((e.target as HTMLSelectElement).value as Contrato)}>
              <option value="indefinido">{t.indefinido}</option>
              <option value="temporal">{t.temporal}</option>
            </select>
          </div>
        </label>
        <label class="calc__field">
          <span class="calc__label">{t.atEp}</span>
          <div class="calc__input-wrap">
            <input type="number" min={0} max={25} step={0.1} value={atEpPct} onInput={(e) => setAtEpPct(num(e))} />
          </div>
        </label>
      </div>
      <p class="cc__note">{t.atEpAyuda}</p>

      <div class="cc__label">{t.jornadaTitulo}</div>
      <div class="calc__form cc__row">
        <label class="calc__field">
          <span class="calc__label">{t.horasSemana}</span>
          <div class="calc__input-wrap">
            <input type="number" min={1} max={60} step={1} value={horasSemana} onInput={(e) => setHorasSemana(num(e))} />
          </div>
        </label>
        <label class="calc__field">
          <span class="calc__label">{t.semanas}</span>
          <div class="calc__input-wrap">
            <input type="number" min={1} max={52} step={1} value={semanas} onInput={(e) => setSemanas(num(e))} />
          </div>
        </label>
      </div>
      <p class="cc__note">{t.semanasAyuda}</p>

      <div class="calc__results">
        {!r.valido ? (
          <div class="calc__warning">{t.sinDatos}</div>
        ) : (
          <>
            <div class="cc__label">{t.resumenTitulo}</div>
            <div class="cc__three">
              <div class="cc__figure cc__figure--coste">
                <span class="cc__figure-label">{t.costeTotal}</span>
                <span class="cc__figure-value">{formatEUR(r.costeTotalAnual, 0)}</span>
              </div>
              <div class="cc__figure">
                <span class="cc__figure-label">{t.brutoLabel}</span>
                <span class="cc__figure-value">{formatEUR(r.brutoAnual, 0)}</span>
              </div>
              <div class="cc__figure cc__figure--liquido">
                <span class="cc__figure-label">{t.liquido}</span>
                <span class="cc__figure-value">{formatEUR(r.liquidoAnual, 0)}</span>
              </div>
            </div>

            <div class="calc__metric-grid calc__metric-grid--three">
              <div class="calc__metric-mini">
                <span class="calc__metric-mini-label">{t.costeMensual}</span>
                <span class="calc__metric-mini-value">{formatEUR(r.costeTotalMensual, 0)}</span>
              </div>
              <div class="calc__metric-mini">
                <span class="calc__metric-mini-label">{t.costeHora}</span>
                <span class="calc__metric-mini-value">{formatEUR(r.costePorHora)}</span>
              </div>
              <div class="calc__metric-mini">
                <span class="calc__metric-mini-label">{t.sobrecoste}</span>
                <span class="calc__metric-mini-value">{formatPercent(r.sobrecosteSobreBruto)}</span>
              </div>
            </div>

            <div class="cc__panel">
              <div class="cc__label">{t.desgloseTitulo}</div>
              <div class="cc__scroll">
                <table class="calc__table">
                  <thead>
                    <tr>
                      <th>{t.colConcepto}</th>
                      <th>{t.colTipo}</th>
                      <th>{t.colImporte}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filas.map((f) => (
                      <tr key={f.label}>
                        <td>{f.label}</td>
                        <td>{formatPercent(f.tipo, 2)}</td>
                        <td>{formatEUR(f.importe, 0)}</td>
                      </tr>
                    ))}
                    <tr>
                      <td><strong>{t.totalFila}</strong></td>
                      <td><strong>{formatPercent(tasaTotalEmpresa(contrato, atEpPct / 100), 2)}</strong></td>
                      <td><strong>{formatEUR(r.cotizacionesEmpresa.total, 0)}</strong></td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p class="cc__note">{t.horasEfectivas}: {r.horasEfectivas}</p>
            </div>

            <div class="cc__panel">
              <div class="cc__label">{t.cunaTitulo}</div>
              <div class="calc__metric-grid">
                <div class="calc__metric-mini">
                  <span class="calc__metric-mini-label">{t.cunaLabel}</span>
                  <span class="calc__metric-mini-value">{formatEUR(r.cunaFiscal, 0)}</span>
                </div>
                <div class="calc__metric-mini">
                  <span class="calc__metric-mini-label">{t.cunaPorcentaje}</span>
                  <span class="calc__metric-mini-value">{formatPercent(r.cunaFiscalPorcentaje)}</span>
                </div>
              </div>
              <p class="cc__note">{t.cunaTexto}</p>
            </div>

            <div class="cc__panel">
              <div class="cc__label">{t.avisoTitulo}</div>
              <p class="cc__note">{t.aviso}</p>
            </div>
          </>
        )}

        <details class="calc__details">
          <summary>{t.comoSeCalcula}</summary>
          <div class="calc__formula">
            <p><strong>{t.formulaCosteTitle}</strong>{t.formulaCosteDesc}</p>
            <p><strong>{t.formulaHoraTitle}</strong>{t.formulaHoraDesc}</p>
            <p><strong>{t.formulaCunaTitle}</strong>{t.formulaCunaDesc}</p>
          </div>
        </details>
      </div>

      <style>{`
        .cc__label {
          font-family: var(--font-sans);
          font-size: 0.82rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.07em;
          color: var(--color-terra, #C44E2C);
          margin: 1rem 0 0.5rem;
        }
        .cc__row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.5rem 1rem; }
        @media (max-width: 560px) { .cc__row { grid-template-columns: 1fr; } }
        .cc__panel {
          margin-top: 1.4rem;
          padding: 1rem 1.1rem;
          background: var(--color-paper, #FFFFFF);
          border: 1px solid var(--color-line, #E5D4BD);
          border-radius: 8px;
        }
        .cc__note {
          margin-top: 0.7rem;
          font-family: var(--font-sans);
          font-size: 0.87rem;
          color: var(--color-ink-soft, #5C4A3D);
        }
        .cc__scroll { overflow-x: auto; }
        .cc__three { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.6rem; }
        @media (max-width: 560px) { .cc__three { grid-template-columns: 1fr; } }
        .cc__figure {
          padding: 0.9rem 1rem;
          background: var(--color-paper, #FFFFFF);
          border: 1px solid var(--color-line, #E5D4BD);
          border-radius: 8px;
          text-align: center;
        }
        .cc__figure--coste { border-color: var(--color-terra, #C44E2C); }
        .cc__figure--liquido { border-color: #1F6E6E; }
        .cc__figure-label {
          display: block;
          font-family: var(--font-sans);
          font-size: 0.78rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--color-ink-mute, #8A7868);
        }
        .cc__figure-value {
          display: block;
          margin-top: 0.3rem;
          font-family: var(--font-display, serif);
          font-size: 1.35rem;
          font-weight: 600;
          color: var(--color-ink, #2A1F18);
        }
      `}</style>
    </div>
  );
}
