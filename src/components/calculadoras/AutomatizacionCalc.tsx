/** @jsxImportSource preact */
import { useMemo, useState } from 'preact/hooks';
import { type Locale } from '@/i18n/locale';
import { formatNumber, formatPercent } from '../../lib/calc/format';
import { evaluar, type Tarea } from '../../lib/calc/automatizacion';

/** UI strings, Valencian (AVL) alongside the ES source. IA stays IA. */
export const COPY = {
  es: {
    intro: 'La pregunta «¿me va a sustituir una máquina?» está mal formulada. La automatización sustituye tareas, no ocupaciones: describe en qué se te van las horas y mira qué parte es rutina y qué parte no lo es.',
    tareasTitulo: 'En qué se van las horas',
    colTarea: 'Tarea',
    colHoras: 'Horas/semana',
    colRutinaria: 'Siempre igual',
    colCriterio: 'Hay que decidir',
    colTrato: 'Hay trato con gente',
    colManos: 'Manos, en sitio imprevisible',
    colExposicion: 'Exposición',
    tareaPlaceholder: 'Una tarea concreta, no el nombre del puesto',
    anyadir: 'Añadir tarea',
    quitar: 'Quitar la última',
    resultadoTitulo: 'Cómo queda',
    exposicionMedia: 'Exposición media',
    horasAlta: 'Horas en tareas rutinarias',
    horasNucleo: 'Horas que no lo son',
    nucleoTitulo: 'En qué se convierte el puesto',
    nucleoTexto: 'Si la parte rutinaria se automatiza, esto es lo que queda y lo que la ocupación pasa a ser. No es lo que se pierde: es lo que crece.',
    nucleoVacio: 'Con lo descrito, casi todas las horas están en tareas repetitivas. Eso no significa que la ocupación desaparezca, sino que va a cambiar mucho: la pregunta útil es qué tareas nuevas aparecen alrededor de la herramienta que las automatice, porque alguien tiene que configurarla, comprobarla y responder cuando falle.',
    interpretacionTitulo: 'Cómo leer el número',
    interpretacion: 'La exposición no es una probabilidad ni una predicción: es una heurística de clase construida a partir de si la tarea es siempre igual y de si exige criterio, trato con gente o manos en un sitio imprevisible. Sirve para ordenar una conversación, no para decidir un futuro.',
    tresCosasTitulo: 'Tres cosas que el número no dice',
    tresCosas: 'Primero, que una tarea sea automatizable no significa que vaya a automatizarse: hace falta que salga a cuenta. Segundo, la automatización de una parte suele aumentar la demanda del resto, no reducirla. Y tercero, las ocupaciones que más cambian no son las que desaparecen: son las que se rehacen, y quien se ha formado a tiempo las ocupa.',
    accionTitulo: 'Y la pregunta que sí sirve',
    accion: 'No «¿me sustituirán?», sino «¿qué parte de lo que hago es la que no se automatiza, y qué me falta para que sea la mayor parte de mi trabajo?». Esa respuesta se convierte en un plan de formación concreto.',
    sinDatos: 'Añade al menos una tarea con horas mayores que cero.',
    presets: 'Ejemplos',
    presetAdministrativo: 'Puesto administrativo',
    presetTecnico: 'Puesto técnico de campo',
  },
  ca: {
    intro: "La pregunta «em substituirà una màquina?» està mal formulada. L'automatització substituïx tasques, no ocupacions: descriu en què se't van les hores i mira quina part és rutina i quina no ho és.",
    tareasTitulo: 'En què se’n van les hores',
    colTarea: 'Tasca',
    colHoras: 'Hores/setmana',
    colRutinaria: 'Sempre igual',
    colCriterio: 'Cal decidir',
    colTrato: 'Hi ha tracte amb gent',
    colManos: 'Mans, en lloc imprevisible',
    colExposicion: 'Exposició',
    tareaPlaceholder: 'Una tasca concreta, no el nom del lloc',
    anyadir: 'Afegir tasca',
    quitar: "Llevar l'última",
    resultadoTitulo: 'Com queda',
    exposicionMedia: 'Exposició mitjana',
    horasAlta: 'Hores en tasques rutinàries',
    horasNucleo: 'Hores que no ho són',
    nucleoTitulo: 'En què es convertix el lloc',
    nucleoTexto: "Si la part rutinària s'automatitza, això és el que queda i el que l'ocupació passa a ser. No és el que es perd: és el que creix.",
    nucleoVacio: "Amb el que s'ha descrit, quasi totes les hores estan en tasques repetitives. Això no vol dir que l'ocupació desaparega, sinó que canviarà molt: la pregunta útil és quines tasques noves apareixen al voltant de la ferramenta que les automatitze, perquè algú l'ha de configurar, comprovar i respondre quan falle.",
    interpretacionTitulo: 'Com llegir el número',
    interpretacion: "L'exposició no és una probabilitat ni una predicció: és una heurística de classe construïda a partir de si la tasca és sempre igual i de si exigix criteri, tracte amb gent o mans en un lloc imprevisible. Servix per a ordenar una conversa, no per a decidir un futur.",
    tresCosasTitulo: 'Tres coses que el número no diu',
    tresCosas: "Primer, que una tasca siga automatitzable no vol dir que s'automatitze: cal que isca a compte. Segon, l'automatització d'una part sol augmentar la demanda de la resta, no reduir-la. I tercer, les ocupacions que més canvien no són les que desapareixen: són les que es refan, i qui s'ha format a temps les ocupa.",
    accionTitulo: 'I la pregunta que sí que servix',
    accion: "No «em substituiran?», sinó «quina part del que faig és la que no s'automatitza, i què em falta perquè siga la major part de la meua faena?». Eixa resposta es convertix en un pla de formació concret.",
    sinDatos: 'Afig almenys una tasca amb hores majors que zero.',
    presets: 'Exemples',
    presetAdministrativo: 'Lloc administratiu',
    presetTecnico: 'Lloc tècnic de camp',
  },
} as const;

interface Props { locale?: Locale }
const num = (e: Event) => Number((e.currentTarget as HTMLInputElement).value);
const txt = (e: Event) => (e.currentTarget as HTMLInputElement).value;
const chk = (e: Event) => (e.currentTarget as HTMLInputElement).checked;

const PRESET_ADMIN: Tarea[] = [
  { nombre: 'Pasar albaranes a la hoja de cálculo', horas: 10, rutinaria: true, requiereCriterio: false, requiereTrato: false, requiereManos: false },
  { nombre: 'Archivar y clasificar documentación', horas: 6, rutinaria: true, requiereCriterio: false, requiereTrato: false, requiereManos: false },
  { nombre: 'Atender incidencias de clientes', horas: 14, rutinaria: false, requiereCriterio: true, requiereTrato: true, requiereManos: false },
  { nombre: 'Preparar el cierre mensual y explicarlo', horas: 10, rutinaria: false, requiereCriterio: true, requiereTrato: true, requiereManos: false },
];
const PRESET_TECNICO: Tarea[] = [
  { nombre: 'Rellenar partes de trabajo', horas: 5, rutinaria: true, requiereCriterio: false, requiereTrato: false, requiereManos: false },
  { nombre: 'Mantenimiento preventivo programado', horas: 12, rutinaria: true, requiereCriterio: false, requiereTrato: false, requiereManos: true },
  { nombre: 'Diagnosticar averías imprevistas', horas: 15, rutinaria: false, requiereCriterio: true, requiereTrato: false, requiereManos: true },
  { nombre: 'Explicar al cliente qué ha pasado', horas: 8, rutinaria: false, requiereCriterio: true, requiereTrato: true, requiereManos: false },
];

export default function AutomatizacionCalc({ locale = 'es' }: Props) {
  const t = COPY[locale];
  const [tareas, setTareas] = useState<Tarea[]>(PRESET_ADMIN);
  const r = useMemo(() => evaluar(tareas), [tareas]);

  const set = (i: number, campo: keyof Tarea, v: string | number | boolean) =>
    setTareas((p) => p.map((x, j) => (j === i ? { ...x, [campo]: v } : x)));

  return (
    <div class="calc">
      <p class="au__intro">{t.intro}</p>

      <div class="calc__presets">
        <button type="button" class="calc__btn calc__btn--ghost" onClick={() => setTareas(PRESET_ADMIN)}>{t.presetAdministrativo}</button>
        <button type="button" class="calc__btn calc__btn--ghost" onClick={() => setTareas(PRESET_TECNICO)}>{t.presetTecnico}</button>
      </div>

      <div class="au__label">{t.tareasTitulo}</div>
      <div class="au__scroll">
        <table class="calc__table">
          <thead>
            <tr>
              <th scope="col">{t.colTarea}</th>
              <th scope="col">{t.colHoras}</th>
              <th scope="col">{t.colRutinaria}</th>
              <th scope="col">{t.colCriterio}</th>
              <th scope="col">{t.colTrato}</th>
              <th scope="col">{t.colManos}</th>
            </tr>
          </thead>
          <tbody>
            {tareas.map((x, i) => (
              <tr key={i}>
                <td><input type="text" value={x.nombre} placeholder={t.tareaPlaceholder} onInput={(e) => set(i, 'nombre', txt(e))} /></td>
                <td><input type="number" min={0} step={1} value={x.horas} onInput={(e) => set(i, 'horas', num(e))} /></td>
                <td><input type="checkbox" checked={x.rutinaria} onChange={(e) => set(i, 'rutinaria', chk(e))} /></td>
                <td><input type="checkbox" checked={x.requiereCriterio} onChange={(e) => set(i, 'requiereCriterio', chk(e))} /></td>
                <td><input type="checkbox" checked={x.requiereTrato} onChange={(e) => set(i, 'requiereTrato', chk(e))} /></td>
                <td><input type="checkbox" checked={x.requiereManos} onChange={(e) => set(i, 'requiereManos', chk(e))} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div class="calc__presets">
        <button type="button" class="calc__btn calc__btn--ghost"
          onClick={() => setTareas((p) => [...p, { nombre: '', horas: 4, rutinaria: false, requiereCriterio: false, requiereTrato: false, requiereManos: false }])}>
          {t.anyadir}
        </button>
        <button type="button" class="calc__btn calc__btn--ghost" disabled={tareas.length <= 1}
          onClick={() => setTareas((p) => p.slice(0, -1))}>{t.quitar}</button>
      </div>

      <div class="calc__results">
        {!r.valido ? (
          <div class="calc__warning">{t.sinDatos}</div>
        ) : (
          <>
            <div class="au__label">{t.resultadoTitulo}</div>
            <div class="calc__metric-grid calc__metric-grid--three">
              <div class="calc__metric-mini">
                <span class="calc__metric-mini-label">{t.exposicionMedia}</span>
                <span class="calc__metric-mini-value">{formatPercent(r.exposicionMedia, 0)}</span>
              </div>
              <div class="calc__metric-mini">
                <span class="calc__metric-mini-label">{t.horasAlta}</span>
                <span class="calc__metric-mini-value">{formatNumber(r.horasAltaExposicion, 0)} h</span>
              </div>
              <div class="calc__metric-mini">
                <span class="calc__metric-mini-label">{t.horasNucleo}</span>
                <span class="calc__metric-mini-value ok">{formatNumber(r.horasNucleo, 0)} h</span>
              </div>
            </div>

            <div class="au__panel">
              <div class="au__label">{t.nucleoTitulo}</div>
              {r.nucleo.length > 0 ? (
                <>
                  <ul class="au__nucleo">
                    {r.nucleo.map((x, i) => (
                      <li key={i}>
                        <strong>{x.nombre || '—'}</strong> — {formatNumber(x.horas, 0)} h ·{' '}
                        {t.colExposicion}: {formatPercent(x.exposicion, 0)}
                      </li>
                    ))}
                  </ul>
                  <p class="au__note">{t.nucleoTexto}</p>
                </>
              ) : (
                <p class="au__note">{t.nucleoVacio}</p>
              )}
            </div>

            <div class="calc__tip calc__tip--info">
              <strong>{t.interpretacionTitulo}</strong> {t.interpretacion}
            </div>
            <div class="calc__tip calc__tip--warn">
              <strong>{t.tresCosasTitulo}</strong> {t.tresCosas}
            </div>
            <div class="calc__tip calc__tip--ok">
              <strong>{t.accionTitulo}</strong> {t.accion}
            </div>
          </>
        )}
      </div>

      <style>{`
        .au__intro { font-family: var(--font-sans); font-size: 0.95rem; color: var(--color-ink-soft, #5C4A3D); margin: 0 0 1rem; }
        .au__label {
          font-family: var(--font-sans); font-size: 0.8rem; font-weight: 600;
          letter-spacing: 0.04em; text-transform: uppercase;
          color: var(--color-ink-mute, #8A7868); margin: 1.2rem 0 0.5rem;
        }
        .au__note { font-family: var(--font-sans); font-size: 0.89rem; color: var(--color-ink-soft, #5C4A3D); margin-top: 0.7rem; }
        .au__scroll { overflow-x: auto; }
        .au__panel {
          margin-top: 1.2rem; padding: 1rem 1.1rem;
          background: var(--color-paper, #FFFFFF);
          border: 1px solid var(--color-line, #E5D4BD);
          border-radius: 8px;
        }
        .au__nucleo { list-style: none; margin: 0.3rem 0 0; padding: 0; font-family: var(--font-sans); font-size: 0.92rem; display: grid; gap: 0.35rem; }
      `}</style>
    </div>
  );
}
