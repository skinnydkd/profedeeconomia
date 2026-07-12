/** @jsxImportSource preact */
import { useMemo, useState } from 'preact/hooks';
import { type Locale } from '@/i18n/locale';
import { formatEUR } from '../../lib/calc/format';
import {
  DEFAULTS,
  presupuestoGrado,
  type BecaModo,
} from '../../lib/calc/presupuesto-uni';

/**
 * UI strings, Valencian (AVL) alongside the ES source. Currency/notation
 * (€, %) is not translated. Mirrors the sibling calculators.
 */
export const COPY = {
  es: {
    vivoEnCasa: 'Vivo en casa',
    vivoFuera: 'Vivo fuera (residencia / piso)',
    reiniciar: 'Reiniciar',
    labelMatricula: 'Matrícula pública (por curso)',
    unitEurCurso: '€/curso',
    labelAlojamientoFuera: 'Alojamiento (residencia o piso compartido)',
    labelAlojamientoCasa: 'Parte de gastos del hogar (opcional)',
    labelManutencion: 'Manutención (comida y día a día)',
    labelMaterial: 'Material (libros, software…)',
    labelTransporte: 'Transporte',
    labelDuracion: 'Duración del grado',
    unitAnos: 'años',
    labelBeca: 'Beca (MEC / general)',
    labelBecaEs: 'La beca es…',
    optPorAno: 'por año',
    optTodoGrado: 'para todo el grado',
    costeDe: 'Coste de ',
    anoSingular: 'año',
    anoPlural: 'años',
    deGradoPublico: ' de grado público —',
    viviendoEnCasa: ' viviendo en casa',
    viviendoFuera: ' viviendo fuera',
    costeTotal: (anos: number) => `Coste total (${anos} años)`,
    becaAplicada: 'Beca aplicada',
    costeNeto: 'Coste neto tras la beca',
    estudiarCostaria: 'Estudiar este grado te costaría ',
    enTotalTrasBeca: ' en total tras la beca',
    frenteASinBeca: (bruto: string) => `, frente a ${bruto} sin beca.`,
    alAno: (anual: string) => ` (${anual} al año).`,
    comparativaTitle: 'Comparativa: vivir en casa vs vivir fuera (coste bruto del grado)',
    enCasa: 'En casa',
    enCasaTitle: (v: string) => `En casa: ${v}`,
    fuera: 'Fuera',
    fueraTitle: (v: string) => `Fuera: ${v}`,
    desgloseAnualCasa: 'Desglose anual (en casa)',
    desgloseAnualFuera: 'Desglose anual (fuera)',
    rowMatricula: 'Matrícula',
    rowAlojamiento: 'Alojamiento',
    rowManutencion: 'Manutención',
    rowMaterial: 'Material',
    rowTransporte: 'Transporte',
    rowTotalAno: 'Total al año',
    importesSon: 'Los importes son ',
    orientativos: 'orientativos',
    importesNota: '. La matrícula pública la fija cada comunidad autónoma por créditos y varía mucho (aprox. 700–1.700 € por curso). Consulta el precio real en tu CCAA o universidad antes de decidir.',
    comoFunciona: 'Cómo funciona el cálculo',
    explP1Before: 'Sumamos las partidas de un curso (matrícula, alojamiento, manutención, material y transporte) para obtener el ',
    explP1Strong: 'coste anual',
    explP1After: '. Si vives en casa, el alojamiento de residencia o piso desaparece y la manutención y el transporte suelen cambiar.',
    explP2Before: 'Multiplicamos el coste anual por los años del grado y restamos la ',
    explP2Strong: 'beca',
    explP2After: '. Una beca grande puede cubrirlo casi todo: el coste neto nunca baja de 0 €. La universidad pública española es, de media, mucho más asequible de lo que parece, sobre todo si vives en casa y obtienes beca.',
  },
  ca: {
    vivoEnCasa: 'Visc a casa',
    vivoFuera: 'Visc fora (residència / pis)',
    reiniciar: 'Reiniciar',
    labelMatricula: 'Matrícula pública (per curs)',
    unitEurCurso: '€/curs',
    labelAlojamientoFuera: 'Allotjament (residència o pis compartit)',
    labelAlojamientoCasa: 'Part de les despeses de la llar (opcional)',
    labelManutencion: 'Manutenció (menjar i dia a dia)',
    labelMaterial: 'Material (llibres, programari…)',
    labelTransporte: 'Transport',
    labelDuracion: 'Duració del grau',
    unitAnos: 'anys',
    labelBeca: 'Beca (MEC / general)',
    labelBecaEs: 'La beca és…',
    optPorAno: 'per any',
    optTodoGrado: 'per a tot el grau',
    costeDe: 'Cost de ',
    anoSingular: 'any',
    anoPlural: 'anys',
    deGradoPublico: ' de grau públic —',
    viviendoEnCasa: ' vivint a casa',
    viviendoFuera: ' vivint fora',
    costeTotal: (anos: number) => `Cost total (${anos} anys)`,
    becaAplicada: 'Beca aplicada',
    costeNeto: 'Cost net després de la beca',
    estudiarCostaria: 'Estudiar este grau et costaria ',
    enTotalTrasBeca: ' en total després de la beca',
    frenteASinBeca: (bruto: string) => `, enfront de ${bruto} sense beca.`,
    alAno: (anual: string) => ` (${anual} a l'any).`,
    comparativaTitle: 'Comparativa: viure a casa vs viure fora (cost brut del grau)',
    enCasa: 'A casa',
    enCasaTitle: (v: string) => `A casa: ${v}`,
    fuera: 'Fora',
    fueraTitle: (v: string) => `Fora: ${v}`,
    desgloseAnualCasa: 'Desglossament anual (a casa)',
    desgloseAnualFuera: 'Desglossament anual (fora)',
    rowMatricula: 'Matrícula',
    rowAlojamiento: 'Allotjament',
    rowManutencion: 'Manutenció',
    rowMaterial: 'Material',
    rowTransporte: 'Transport',
    rowTotalAno: "Total a l'any",
    importesSon: 'Els imports són ',
    orientativos: 'orientatius',
    importesNota: '. La matrícula pública la fixa cada comunitat autònoma per crèdits i varia molt (aprox. 700–1.700 € per curs). Consulta el preu real a la teua CCAA o universitat abans de decidir.',
    comoFunciona: 'Com funciona el càlcul',
    explP1Before: "Sumem les partides d'un curs (matrícula, allotjament, manutenció, material i transport) per a obtindre el ",
    explP1Strong: 'cost anual',
    explP1After: ". Si vius a casa, l'allotjament de residència o pis desapareix i la manutenció i el transport solen canviar.",
    explP2Before: 'Multipliquem el cost anual pels anys del grau i restem la ',
    explP2Strong: 'beca',
    explP2After: '. Una beca gran pot cobrir-ho quasi tot: el cost net mai baixa de 0 €. La universitat pública espanyola és, de mitjana, molt més assequible del que sembla, sobretot si vius a casa i obtens beca.',
  },
} as const;

interface Props { locale?: Locale }

/**
 * Presupuesto de universidad a 4 años — FOPP 4ESO (Unit 6: FP / Universidad /
 * becas).
 *
 * Lets a 4º-ESO student estimate the full cost of a public degree depending on
 * living at home vs away, edit each yearly amount, and see how a grant (beca)
 * changes the net cost. The teaching goal: public university is affordable, and
 * the beca changes the picture a lot.
 *
 * All numbers shown are *orientativos*; the real tuition must be checked in the
 * student's CCAA / university price decree (see the note at the bottom).
 */

type Modo = 'casa' | 'fuera';

export default function PresupuestoUni({ locale = 'es' }: Props) {
  const c = COPY[locale];
  const [modo, setModo] = useState<Modo>('fuera');

  // Editable yearly amounts (defaults are orientative, see DEFAULTS).
  const [matricula, setMatricula] = useState<number>(DEFAULTS.matricula);
  const [alojamiento, setAlojamiento] = useState<number>(DEFAULTS.alojamientoFuera);
  const [manutencion, setManutencion] = useState<number>(DEFAULTS.manutencionFuera);
  const [material, setMaterial] = useState<number>(DEFAULTS.material);
  const [transporte, setTransporte] = useState<number>(DEFAULTS.transporteFuera);
  const [anos, setAnos] = useState<number>(DEFAULTS.anos);

  // Grant.
  const [beca, setBeca] = useState<number>(0);
  const [becaModo, setBecaModo] = useState<BecaModo>('anual');

  const viveEnCasa = modo === 'casa';

  // Net cost of the chosen scenario (home or away).
  const result = useMemo(
    () =>
      presupuestoGrado({
        matricula,
        alojamiento,
        manutencion,
        material,
        transporte,
        viveEnCasa,
        anos,
        beca,
        becaModo,
      }),
    [matricula, alojamiento, manutencion, material, transporte, viveEnCasa, anos, beca, becaModo]
  );

  // Comparison: same amounts, both scenarios, gross (before grant) over the
  // whole degree, so the bar shows the structural home-vs-away difference.
  const comparativa = useMemo(() => {
    const base = { matricula, alojamiento, manutencion, material, transporte, anos };
    const casa = presupuestoGrado({ ...base, viveEnCasa: true }).totalBruto;
    const fuera = presupuestoGrado({ ...base, viveEnCasa: false }).totalBruto;
    const max = Math.max(casa, fuera, 1);
    return { casa, fuera, max };
  }, [matricula, alojamiento, manutencion, material, transporte, anos]);

  function setEscenario(m: Modo) {
    setModo(m);
    // Adjust the defaults that change with the scenario, only if untouched-ish:
    // simplest pedagogical behaviour is to reset those concepts to the new
    // scenario's orientative defaults.
    if (m === 'casa') {
      setAlojamiento(DEFAULTS.alojamientoCasa);
      setManutencion(DEFAULTS.manutencionCasa);
      setTransporte(DEFAULTS.transporteCasa);
    } else {
      setAlojamiento(DEFAULTS.alojamientoFuera);
      setManutencion(DEFAULTS.manutencionFuera);
      setTransporte(DEFAULTS.transporteFuera);
    }
  }

  function reset() {
    setModo('fuera');
    setMatricula(DEFAULTS.matricula);
    setAlojamiento(DEFAULTS.alojamientoFuera);
    setManutencion(DEFAULTS.manutencionFuera);
    setMaterial(DEFAULTS.material);
    setTransporte(DEFAULTS.transporteFuera);
    setAnos(DEFAULTS.anos);
    setBeca(0);
    setBecaModo('anual');
  }

  const num = (e: Event) => parseFloat((e.target as HTMLInputElement).value) || 0;

  const d = result.anual.desglose;

  return (
    <div class="calc">
      <div class="calc__presets">
        <button
          type="button"
          class={`calc__btn ${modo === 'casa' ? '' : 'calc__btn--ghost'}`}
          onClick={() => setEscenario('casa')}
        >
          {c.vivoEnCasa}
        </button>
        <button
          type="button"
          class={`calc__btn ${modo === 'fuera' ? '' : 'calc__btn--ghost'}`}
          onClick={() => setEscenario('fuera')}
        >
          {c.vivoFuera}
        </button>
        <button type="button" class="calc__btn calc__btn--ghost" onClick={reset}>
          {c.reiniciar}
        </button>
      </div>

      <div class="calc__form">
        <label class="calc__field">
          <span class="calc__label">{c.labelMatricula}</span>
          <div class="calc__input-wrap">
            <input
              type="number"
              min={0}
              step={50}
              value={matricula}
              onInput={(e) => setMatricula(num(e))}
            />
            <span class="calc__unit">{c.unitEurCurso}</span>
          </div>
        </label>

        {!viveEnCasa && (
          <label class="calc__field">
            <span class="calc__label">{c.labelAlojamientoFuera}</span>
            <div class="calc__input-wrap">
              <input
                type="number"
                min={0}
                step={100}
                value={alojamiento}
                onInput={(e) => setAlojamiento(num(e))}
              />
              <span class="calc__unit">{c.unitEurCurso}</span>
            </div>
          </label>
        )}

        {viveEnCasa && (
          <label class="calc__field">
            <span class="calc__label">{c.labelAlojamientoCasa}</span>
            <div class="calc__input-wrap">
              <input
                type="number"
                min={0}
                step={50}
                value={alojamiento}
                onInput={(e) => setAlojamiento(num(e))}
              />
              <span class="calc__unit">{c.unitEurCurso}</span>
            </div>
          </label>
        )}

        <label class="calc__field">
          <span class="calc__label">{c.labelManutencion}</span>
          <div class="calc__input-wrap">
            <input
              type="number"
              min={0}
              step={100}
              value={manutencion}
              onInput={(e) => setManutencion(num(e))}
            />
            <span class="calc__unit">{c.unitEurCurso}</span>
          </div>
        </label>

        <label class="calc__field">
          <span class="calc__label">{c.labelMaterial}</span>
          <div class="calc__input-wrap">
            <input
              type="number"
              min={0}
              step={50}
              value={material}
              onInput={(e) => setMaterial(num(e))}
            />
            <span class="calc__unit">{c.unitEurCurso}</span>
          </div>
        </label>

        <label class="calc__field">
          <span class="calc__label">{c.labelTransporte}</span>
          <div class="calc__input-wrap">
            <input
              type="number"
              min={0}
              step={50}
              value={transporte}
              onInput={(e) => setTransporte(num(e))}
            />
            <span class="calc__unit">{c.unitEurCurso}</span>
          </div>
        </label>

        <label class="calc__field">
          <span class="calc__label">{c.labelDuracion}</span>
          <div class="calc__input-wrap">
            <input
              type="number"
              min={1}
              max={7}
              step={1}
              value={anos}
              onInput={(e) => setAnos(parseInt((e.target as HTMLInputElement).value) || 1)}
            />
            <span class="calc__unit">{c.unitAnos}</span>
          </div>
        </label>

        <label class="calc__field">
          <span class="calc__label">{c.labelBeca}</span>
          <div class="calc__input-wrap">
            <input
              type="number"
              min={0}
              step={100}
              value={beca}
              onInput={(e) => setBeca(num(e))}
            />
            <span class="calc__unit">€</span>
          </div>
        </label>

        <label class="calc__field">
          <span class="calc__label">{c.labelBecaEs}</span>
          <div class="calc__input-wrap">
            <select
              value={becaModo}
              onChange={(e) => setBecaModo((e.target as HTMLSelectElement).value as BecaModo)}
            >
              <option value="anual">{c.optPorAno}</option>
              <option value="total">{c.optTodoGrado}</option>
            </select>
          </div>
        </label>
      </div>

      <div class="calc__results">
        <p class="calc__sub">
          {c.costeDe}{result.anos} {result.anos === 1 ? c.anoSingular : c.anoPlural}{c.deGradoPublico}
          {viveEnCasa ? c.viviendoEnCasa : c.viviendoFuera}
        </p>

        <div class="calc__metric-grid">
          <div class="calc__metric-mini">
            <span class="calc__metric-mini-label">{c.costeTotal(result.anos)}</span>
            <span class="calc__metric-mini-value">{formatEUR(result.totalBruto)}</span>
          </div>
          <div class="calc__metric-mini">
            <span class="calc__metric-mini-label">{c.becaAplicada}</span>
            <span class="calc__metric-mini-value">{formatEUR(result.becaTotal)}</span>
          </div>
          <div class="calc__metric-mini">
            <span class="calc__metric-mini-label">{c.costeNeto}</span>
            <span class="calc__metric-mini-value ok">{formatEUR(result.totalNeto)}</span>
          </div>
        </div>

        {/* Highlighted headline figure. */}
        <div class="calc__warning is-ok" style="margin-top: 1rem;">
          {c.estudiarCostaria}<strong>{formatEUR(result.totalNeto)}</strong>{c.enTotalTrasBeca}
          {result.becaTotal > 0
            ? c.frenteASinBeca(formatEUR(result.totalBruto))
            : c.alAno(formatEUR(result.anual.total))}
        </div>

        <p class="calc__sub">{c.comparativaTitle}</p>
        <div class="calc__stack-bars">
          <div class="calc__stack-bar">
            <span class="calc__stack-bar-label">{c.enCasa}</span>
            <div class="calc__stack">
              <div
                class="calc__stack-seg calc__stack-seg--aho"
                style={{ width: `${(comparativa.casa / comparativa.max) * 100}%` }}
                title={c.enCasaTitle(formatEUR(comparativa.casa))}
              />
            </div>
            <span class="calc__stack-bar-label">{formatEUR(comparativa.casa)}</span>
          </div>
          <div class="calc__stack-bar">
            <span class="calc__stack-bar-label">{c.fuera}</span>
            <div class="calc__stack">
              <div
                class="calc__stack-seg calc__stack-seg--nec"
                style={{ width: `${(comparativa.fuera / comparativa.max) * 100}%` }}
                title={c.fueraTitle(formatEUR(comparativa.fuera))}
              />
            </div>
            <span class="calc__stack-bar-label">{formatEUR(comparativa.fuera)}</span>
          </div>
        </div>

        <p class="calc__sub">{viveEnCasa ? c.desgloseAnualCasa : c.desgloseAnualFuera}</p>
        <table class="calc__table">
          <tbody>
            <tr>
              <td>{c.rowMatricula}</td>
              <td>{formatEUR(d.matricula)}</td>
            </tr>
            <tr>
              <td>{c.rowAlojamiento}</td>
              <td>{formatEUR(d.alojamiento)}</td>
            </tr>
            <tr>
              <td>{c.rowManutencion}</td>
              <td>{formatEUR(d.manutencion)}</td>
            </tr>
            <tr>
              <td>{c.rowMaterial}</td>
              <td>{formatEUR(d.material)}</td>
            </tr>
            <tr>
              <td>{c.rowTransporte}</td>
              <td>{formatEUR(d.transporte)}</td>
            </tr>
            <tr>
              <td>
                <strong>{c.rowTotalAno}</strong>
              </td>
              <td>
                <strong>{formatEUR(result.anual.total)}</strong>
              </td>
            </tr>
          </tbody>
        </table>

        <div class="calc__warning" style="margin-top: 1rem;">
          {c.importesSon}<strong>{c.orientativos}</strong>{c.importesNota}
        </div>

        <details class="calc__details">
          <summary>{c.comoFunciona}</summary>
          <div class="calc__formula">
            <p>
              {c.explP1Before}<strong>{c.explP1Strong}</strong>{c.explP1After}
            </p>
            <p>
              {c.explP2Before}<strong>{c.explP2Strong}</strong>{c.explP2After}
            </p>
          </div>
        </details>
      </div>
    </div>
  );
}
