/** @jsxImportSource preact */
import { useState } from 'preact/hooks';

/**
 * Simplified Europass-style CV builder. The output is an HTML preview that
 * students can print (window.print()) or copy. We deliberately avoid real
 * PDF generation to keep the dependency surface small.
 *
 * Fields are intentionally minimal — enough to cover the FOPP curriculum's
 * "first CV" learning outcome without overwhelming students.
 */

interface ExperienciaItem {
  puesto: string;
  empresa: string;
  fechas: string;
  descripcion: string;
}

interface FormacionItem {
  titulo: string;
  centro: string;
  anio: string;
}

interface IdiomaItem {
  idioma: string;
  nivel: string;
}

const NIVELES_MCER = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

const PERSONALES_INI = {
  nombre: '',
  ciudad: '',
  email: '',
  movil: '',
  linkedin: '',
};

export default function GeneradorCVEuropass() {
  const [personales, setPersonales] = useState({ ...PERSONALES_INI });
  const [resumen, setResumen] = useState('');
  const [experiencia, setExperiencia] = useState<ExperienciaItem[]>([
    { puesto: '', empresa: '', fechas: '', descripcion: '' },
  ]);
  const [formacion, setFormacion] = useState<FormacionItem[]>([
    { titulo: '', centro: '', anio: '' },
  ]);
  const [idiomas, setIdiomas] = useState<IdiomaItem[]>([{ idioma: '', nivel: 'A2' }]);
  const [habilidades, setHabilidades] = useState('');
  const [voluntariado, setVoluntariado] = useState('');

  function reset() {
    setPersonales({ ...PERSONALES_INI });
    setResumen('');
    setExperiencia([{ puesto: '', empresa: '', fechas: '', descripcion: '' }]);
    setFormacion([{ titulo: '', centro: '', anio: '' }]);
    setIdiomas([{ idioma: '', nivel: 'A2' }]);
    setHabilidades('');
    setVoluntariado('');
  }

  function updateExperiencia(i: number, patch: Partial<ExperienciaItem>) {
    setExperiencia((prev) => prev.map((x, idx) => (idx === i ? { ...x, ...patch } : x)));
  }
  function addExperiencia() {
    setExperiencia((prev) => [...prev, { puesto: '', empresa: '', fechas: '', descripcion: '' }]);
  }
  function removeExperiencia(i: number) {
    setExperiencia((prev) => (prev.length > 1 ? prev.filter((_, idx) => idx !== i) : prev));
  }

  function updateFormacion(i: number, patch: Partial<FormacionItem>) {
    setFormacion((prev) => prev.map((x, idx) => (idx === i ? { ...x, ...patch } : x)));
  }
  function addFormacion() {
    setFormacion((prev) => [...prev, { titulo: '', centro: '', anio: '' }]);
  }
  function removeFormacion(i: number) {
    setFormacion((prev) => (prev.length > 1 ? prev.filter((_, idx) => idx !== i) : prev));
  }

  function updateIdioma(i: number, patch: Partial<IdiomaItem>) {
    setIdiomas((prev) => prev.map((x, idx) => (idx === i ? { ...x, ...patch } : x)));
  }
  function addIdioma() {
    setIdiomas((prev) => [...prev, { idioma: '', nivel: 'A2' }]);
  }
  function removeIdioma(i: number) {
    setIdiomas((prev) => (prev.length > 1 ? prev.filter((_, idx) => idx !== i) : prev));
  }

  return (
    <div class="calc">
      <p class="cv__intro">
        Rellena los campos y verás abajo una previsualización del CV con estilo Europass.
        Cuando esté listo, pulsa <strong>Imprimir</strong> (puedes guardarlo como PDF desde el
        propio diálogo de impresión).
      </p>

      <p class="calc__sub">1 · Datos personales</p>
      <div class="calc__form">
        <CVInput
          label="Nombre y apellidos"
          value={personales.nombre}
          onInput={(v) => setPersonales({ ...personales, nombre: v })}
        />
        <CVInput
          label="Ciudad"
          value={personales.ciudad}
          onInput={(v) => setPersonales({ ...personales, ciudad: v })}
        />
        <CVInput
          label="Email"
          value={personales.email}
          onInput={(v) => setPersonales({ ...personales, email: v })}
        />
        <CVInput
          label="Móvil"
          value={personales.movil}
          onInput={(v) => setPersonales({ ...personales, movil: v })}
        />
        <CVInput
          label="LinkedIn (opcional)"
          value={personales.linkedin}
          onInput={(v) => setPersonales({ ...personales, linkedin: v })}
        />
      </div>

      <p class="calc__sub">2 · Resumen profesional (3-4 líneas)</p>
      <textarea
        class="cv__textarea"
        rows={3}
        value={resumen}
        placeholder="Estudiante de 4º ESO con interés en…"
        onInput={(e) => setResumen((e.target as HTMLTextAreaElement).value)}
      />

      <p class="calc__sub">3 · Experiencia laboral / prácticas</p>
      {experiencia.map((it, i) => (
        <div class="cv__list-item">
          <div class="calc__form">
            <CVInput
              label="Puesto"
              value={it.puesto}
              onInput={(v) => updateExperiencia(i, { puesto: v })}
            />
            <CVInput
              label="Empresa / centro"
              value={it.empresa}
              onInput={(v) => updateExperiencia(i, { empresa: v })}
            />
            <CVInput
              label="Fechas (ej. 06/2025 - 09/2025)"
              value={it.fechas}
              onInput={(v) => updateExperiencia(i, { fechas: v })}
            />
          </div>
          <textarea
            class="cv__textarea"
            rows={2}
            value={it.descripcion}
            placeholder="Tareas principales en 2-3 líneas…"
            onInput={(e) =>
              updateExperiencia(i, { descripcion: (e.target as HTMLTextAreaElement).value })
            }
          />
          <div class="cv__row-actions">
            <button
              type="button"
              class="calc__btn calc__btn--ghost"
              onClick={() => removeExperiencia(i)}
              disabled={experiencia.length <= 1}
            >
              − Quitar
            </button>
          </div>
        </div>
      ))}
      <button type="button" class="calc__btn calc__btn--ghost" onClick={addExperiencia}>
        + Añadir experiencia
      </button>

      <p class="calc__sub">4 · Formación</p>
      {formacion.map((it, i) => (
        <div class="cv__list-item">
          <div class="calc__form">
            <CVInput
              label="Título"
              value={it.titulo}
              onInput={(v) => updateFormacion(i, { titulo: v })}
            />
            <CVInput
              label="Centro"
              value={it.centro}
              onInput={(v) => updateFormacion(i, { centro: v })}
            />
            <CVInput
              label="Año"
              value={it.anio}
              onInput={(v) => updateFormacion(i, { anio: v })}
            />
          </div>
          <div class="cv__row-actions">
            <button
              type="button"
              class="calc__btn calc__btn--ghost"
              onClick={() => removeFormacion(i)}
              disabled={formacion.length <= 1}
            >
              − Quitar
            </button>
          </div>
        </div>
      ))}
      <button type="button" class="calc__btn calc__btn--ghost" onClick={addFormacion}>
        + Añadir formación
      </button>

      <p class="calc__sub">5 · Idiomas (nivel MCER)</p>
      {idiomas.map((it, i) => (
        <div class="cv__list-item cv__list-item--inline">
          <CVInput
            label="Idioma"
            value={it.idioma}
            onInput={(v) => updateIdioma(i, { idioma: v })}
          />
          <label class="calc__field">
            <span class="calc__label">Nivel</span>
            <div class="calc__input-wrap">
              <select
                value={it.nivel}
                onChange={(e) =>
                  updateIdioma(i, { nivel: (e.target as HTMLSelectElement).value })
                }
                class="cv__select"
              >
                {NIVELES_MCER.map((n) => (
                  <option value={n}>{n}</option>
                ))}
              </select>
            </div>
          </label>
          <div class="cv__row-actions">
            <button
              type="button"
              class="calc__btn calc__btn--ghost"
              onClick={() => removeIdioma(i)}
              disabled={idiomas.length <= 1}
            >
              − Quitar
            </button>
          </div>
        </div>
      ))}
      <button type="button" class="calc__btn calc__btn--ghost" onClick={addIdioma}>
        + Añadir idioma
      </button>

      <p class="calc__sub">6 · Habilidades digitales</p>
      <textarea
        class="cv__textarea"
        rows={2}
        value={habilidades}
        placeholder="Ofimática (Word, Excel, Drive), edición de imagen (Canva), redes sociales…"
        onInput={(e) => setHabilidades((e.target as HTMLTextAreaElement).value)}
      />

      <p class="calc__sub">7 · Voluntariado y aficiones</p>
      <textarea
        class="cv__textarea"
        rows={2}
        value={voluntariado}
        placeholder="Banco de alimentos, club deportivo, monitor de tiempo libre, lectura…"
        onInput={(e) => setVoluntariado((e.target as HTMLTextAreaElement).value)}
      />

      <div class="cv__actions">
        <button
          type="button"
          class="bi__btn bi__btn--primary"
          onClick={() => window.print()}
        >
          Imprimir / Guardar como PDF
        </button>
        <button type="button" class="calc__btn calc__btn--ghost" onClick={reset}>
          Reiniciar
        </button>
      </div>

      <div class="cv__preview" id="cv-preview">
        <header class="cv__preview-head">
          <h2 class="cv__preview-name">
            {personales.nombre || <span class="cv__placeholder">Tu nombre y apellidos</span>}
          </h2>
          <div class="cv__preview-contact">
            {personales.ciudad && <span>{personales.ciudad}</span>}
            {personales.email && <span>{personales.email}</span>}
            {personales.movil && <span>{personales.movil}</span>}
            {personales.linkedin && <span>{personales.linkedin}</span>}
          </div>
        </header>

        <div class="cv__preview-grid">
          <aside class="cv__preview-side">
            <section>
              <h3 class="cv__preview-h3">Idiomas</h3>
              {idiomas.some((x) => x.idioma) ? (
                <ul>
                  {idiomas
                    .filter((x) => x.idioma)
                    .map((x) => (
                      <li>
                        <strong>{x.idioma}</strong> — {x.nivel}
                      </li>
                    ))}
                </ul>
              ) : (
                <p class="cv__placeholder">Aún sin idiomas.</p>
              )}
            </section>

            <section>
              <h3 class="cv__preview-h3">Habilidades digitales</h3>
              {habilidades ? (
                <p>{habilidades}</p>
              ) : (
                <p class="cv__placeholder">Aún sin habilidades.</p>
              )}
            </section>

            <section>
              <h3 class="cv__preview-h3">Voluntariado / aficiones</h3>
              {voluntariado ? (
                <p>{voluntariado}</p>
              ) : (
                <p class="cv__placeholder">Aún sin entradas.</p>
              )}
            </section>
          </aside>

          <main class="cv__preview-main">
            <section>
              <h3 class="cv__preview-h3">Resumen profesional</h3>
              {resumen ? (
                <p>{resumen}</p>
              ) : (
                <p class="cv__placeholder">Aún sin resumen.</p>
              )}
            </section>

            <section>
              <h3 class="cv__preview-h3">Experiencia</h3>
              {experiencia.some((x) => x.puesto || x.empresa) ? (
                <ul class="cv__preview-list">
                  {experiencia
                    .filter((x) => x.puesto || x.empresa)
                    .map((x) => (
                      <li>
                        <div class="cv__preview-line1">
                          <strong>{x.puesto || '—'}</strong>
                          {x.empresa && <span> · {x.empresa}</span>}
                        </div>
                        {x.fechas && <div class="cv__preview-line2">{x.fechas}</div>}
                        {x.descripcion && <p>{x.descripcion}</p>}
                      </li>
                    ))}
                </ul>
              ) : (
                <p class="cv__placeholder">Aún sin experiencia.</p>
              )}
            </section>

            <section>
              <h3 class="cv__preview-h3">Formación</h3>
              {formacion.some((x) => x.titulo || x.centro) ? (
                <ul class="cv__preview-list">
                  {formacion
                    .filter((x) => x.titulo || x.centro)
                    .map((x) => (
                      <li>
                        <div class="cv__preview-line1">
                          <strong>{x.titulo || '—'}</strong>
                          {x.centro && <span> · {x.centro}</span>}
                        </div>
                        {x.anio && <div class="cv__preview-line2">{x.anio}</div>}
                      </li>
                    ))}
                </ul>
              ) : (
                <p class="cv__placeholder">Aún sin formación.</p>
              )}
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}

function CVInput(props: { label: string; value: string; onInput: (v: string) => void }) {
  return (
    <label class="calc__field">
      <span class="calc__label">{props.label}</span>
      <div class="calc__input-wrap">
        <input
          type="text"
          value={props.value}
          onInput={(e) => props.onInput((e.target as HTMLInputElement).value)}
        />
      </div>
    </label>
  );
}
