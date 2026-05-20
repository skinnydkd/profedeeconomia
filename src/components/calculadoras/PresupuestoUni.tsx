/** @jsxImportSource preact */
import { useMemo, useState } from 'preact/hooks';
import { formatEUR } from '../../lib/calc/format';
import {
  DEFAULTS,
  presupuestoGrado,
  type BecaModo,
} from '../../lib/calc/presupuesto-uni';

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

export default function PresupuestoUni() {
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
          Vivo en casa
        </button>
        <button
          type="button"
          class={`calc__btn ${modo === 'fuera' ? '' : 'calc__btn--ghost'}`}
          onClick={() => setEscenario('fuera')}
        >
          Vivo fuera (residencia / piso)
        </button>
        <button type="button" class="calc__btn calc__btn--ghost" onClick={reset}>
          Reiniciar
        </button>
      </div>

      <div class="calc__form">
        <label class="calc__field">
          <span class="calc__label">Matrícula pública (por curso)</span>
          <div class="calc__input-wrap">
            <input
              type="number"
              min={0}
              step={50}
              value={matricula}
              onInput={(e) => setMatricula(num(e))}
            />
            <span class="calc__unit">€/curso</span>
          </div>
        </label>

        {!viveEnCasa && (
          <label class="calc__field">
            <span class="calc__label">Alojamiento (residencia o piso compartido)</span>
            <div class="calc__input-wrap">
              <input
                type="number"
                min={0}
                step={100}
                value={alojamiento}
                onInput={(e) => setAlojamiento(num(e))}
              />
              <span class="calc__unit">€/curso</span>
            </div>
          </label>
        )}

        {viveEnCasa && (
          <label class="calc__field">
            <span class="calc__label">Parte de gastos del hogar (opcional)</span>
            <div class="calc__input-wrap">
              <input
                type="number"
                min={0}
                step={50}
                value={alojamiento}
                onInput={(e) => setAlojamiento(num(e))}
              />
              <span class="calc__unit">€/curso</span>
            </div>
          </label>
        )}

        <label class="calc__field">
          <span class="calc__label">Manutención (comida y día a día)</span>
          <div class="calc__input-wrap">
            <input
              type="number"
              min={0}
              step={100}
              value={manutencion}
              onInput={(e) => setManutencion(num(e))}
            />
            <span class="calc__unit">€/curso</span>
          </div>
        </label>

        <label class="calc__field">
          <span class="calc__label">Material (libros, software…)</span>
          <div class="calc__input-wrap">
            <input
              type="number"
              min={0}
              step={50}
              value={material}
              onInput={(e) => setMaterial(num(e))}
            />
            <span class="calc__unit">€/curso</span>
          </div>
        </label>

        <label class="calc__field">
          <span class="calc__label">Transporte</span>
          <div class="calc__input-wrap">
            <input
              type="number"
              min={0}
              step={50}
              value={transporte}
              onInput={(e) => setTransporte(num(e))}
            />
            <span class="calc__unit">€/curso</span>
          </div>
        </label>

        <label class="calc__field">
          <span class="calc__label">Duración del grado</span>
          <div class="calc__input-wrap">
            <input
              type="number"
              min={1}
              max={7}
              step={1}
              value={anos}
              onInput={(e) => setAnos(parseInt((e.target as HTMLInputElement).value) || 1)}
            />
            <span class="calc__unit">años</span>
          </div>
        </label>

        <label class="calc__field">
          <span class="calc__label">Beca (MEC / general)</span>
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
          <span class="calc__label">La beca es…</span>
          <div class="calc__input-wrap">
            <select
              value={becaModo}
              onChange={(e) => setBecaModo((e.target as HTMLSelectElement).value as BecaModo)}
            >
              <option value="anual">por año</option>
              <option value="total">para todo el grado</option>
            </select>
          </div>
        </label>
      </div>

      <div class="calc__results">
        <p class="calc__sub">
          Coste de {result.anos} {result.anos === 1 ? 'año' : 'años'} de grado público —
          {viveEnCasa ? ' viviendo en casa' : ' viviendo fuera'}
        </p>

        <div class="calc__metric-grid">
          <div class="calc__metric-mini">
            <span class="calc__metric-mini-label">Coste total ({result.anos} años)</span>
            <span class="calc__metric-mini-value">{formatEUR(result.totalBruto)}</span>
          </div>
          <div class="calc__metric-mini">
            <span class="calc__metric-mini-label">Beca aplicada</span>
            <span class="calc__metric-mini-value">{formatEUR(result.becaTotal)}</span>
          </div>
          <div class="calc__metric-mini">
            <span class="calc__metric-mini-label">Coste neto tras la beca</span>
            <span class="calc__metric-mini-value ok">{formatEUR(result.totalNeto)}</span>
          </div>
        </div>

        {/* Highlighted headline figure. */}
        <div class="calc__warning is-ok" style="margin-top: 1rem;">
          Estudiar este grado te costaría <strong>{formatEUR(result.totalNeto)}</strong> en
          total tras la beca
          {result.becaTotal > 0
            ? `, frente a ${formatEUR(result.totalBruto)} sin beca.`
            : ` (${formatEUR(result.anual.total)} al año).`}
        </div>

        <p class="calc__sub">Comparativa: vivir en casa vs vivir fuera (coste bruto del grado)</p>
        <div class="calc__stack-bars">
          <div class="calc__stack-bar">
            <span class="calc__stack-bar-label">En casa</span>
            <div class="calc__stack">
              <div
                class="calc__stack-seg calc__stack-seg--aho"
                style={{ width: `${(comparativa.casa / comparativa.max) * 100}%` }}
                title={`En casa: ${formatEUR(comparativa.casa)}`}
              />
            </div>
            <span class="calc__stack-bar-label">{formatEUR(comparativa.casa)}</span>
          </div>
          <div class="calc__stack-bar">
            <span class="calc__stack-bar-label">Fuera</span>
            <div class="calc__stack">
              <div
                class="calc__stack-seg calc__stack-seg--nec"
                style={{ width: `${(comparativa.fuera / comparativa.max) * 100}%` }}
                title={`Fuera: ${formatEUR(comparativa.fuera)}`}
              />
            </div>
            <span class="calc__stack-bar-label">{formatEUR(comparativa.fuera)}</span>
          </div>
        </div>

        <p class="calc__sub">Desglose anual ({viveEnCasa ? 'en casa' : 'fuera'})</p>
        <table class="calc__table">
          <tbody>
            <tr>
              <td>Matrícula</td>
              <td>{formatEUR(d.matricula)}</td>
            </tr>
            <tr>
              <td>Alojamiento</td>
              <td>{formatEUR(d.alojamiento)}</td>
            </tr>
            <tr>
              <td>Manutención</td>
              <td>{formatEUR(d.manutencion)}</td>
            </tr>
            <tr>
              <td>Material</td>
              <td>{formatEUR(d.material)}</td>
            </tr>
            <tr>
              <td>Transporte</td>
              <td>{formatEUR(d.transporte)}</td>
            </tr>
            <tr>
              <td>
                <strong>Total al año</strong>
              </td>
              <td>
                <strong>{formatEUR(result.anual.total)}</strong>
              </td>
            </tr>
          </tbody>
        </table>

        <div class="calc__warning" style="margin-top: 1rem;">
          Los importes son <strong>orientativos</strong>. La matrícula pública la fija cada
          comunidad autónoma por créditos y varía mucho (aprox. 700–1.700 € por curso).
          Consulta el precio real en tu CCAA o universidad antes de decidir.
        </div>

        <details class="calc__details">
          <summary>Cómo funciona el cálculo</summary>
          <div class="calc__formula">
            <p>
              Sumamos las partidas de un curso (matrícula, alojamiento, manutención, material y
              transporte) para obtener el <strong>coste anual</strong>. Si vives en casa, el
              alojamiento de residencia o piso desaparece y la manutención y el transporte
              suelen cambiar.
            </p>
            <p>
              Multiplicamos el coste anual por los años del grado y restamos la{' '}
              <strong>beca</strong>. Una beca grande puede cubrirlo casi todo: el coste neto
              nunca baja de 0 €. La universidad pública española es, de media, mucho más
              asequible de lo que parece, sobre todo si vives en casa y obtienes beca.
            </p>
          </div>
        </details>
      </div>
    </div>
  );
}
