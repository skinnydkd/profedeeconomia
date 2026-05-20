/** @jsxImportSource preact */
import { useMemo, useState } from 'preact/hooks';
import {
  CCAA,
  recomendarItinerarios,
  type CCAAId,
  type Duracion,
  type EstiloEstudio,
  type GustaTrabajar,
  type Materia,
  type PerfilAlumno,
  type Prioridad,
} from '../../lib/calc/itinerarios';

/**
 * Itinerary finder for FOPP 4ESO students. Six questions + an optional CCAA
 * selector. All the data and scoring lives in `lib/calc/itinerarios.ts` (pure,
 * unit-tested); this component is only the UI: it builds a `PerfilAlumno`,
 * calls `recomendarItinerarios`, and renders the ranked cards with `.bi__*`
 * styles. The goal is orientation, not deterministic vocational guidance.
 */

const PERFIL_INICIAL: PerfilAlumno = {
  materias: [],
  estilo: null,
  duracion: null,
  gusta: [],
  prioridad: null,
  ccaa: null,
};

const MATERIAS: { id: Materia; label: string }[] = [
  { id: 'matematicas', label: 'Matemáticas' },
  { id: 'lengua', label: 'Lengua / Literatura' },
  { id: 'ingles', label: 'Inglés' },
  { id: 'ciencias', label: 'Ciencias (Bio/Quim/Fis)' },
  { id: 'tecnologia', label: 'Tecnología / Digitalización' },
  { id: 'artes', label: 'Artes' },
  { id: 'edFisica', label: 'Educación Física' },
  { id: 'sociales', label: 'Geografía e Historia' },
];

const GUSTA: { id: GustaTrabajar; label: string }[] = [
  { id: 'personas', label: 'Personas' },
  { id: 'datos', label: 'Datos / números' },
  { id: 'maquinas', label: 'Máquinas y equipos' },
  { id: 'ideas', label: 'Ideas / creatividad' },
  { id: 'naturaleza', label: 'Animales / naturaleza' },
  { id: 'manos', label: 'Las manos (oficio manual)' },
];

export default function BuscadorItinerarios() {
  const [r, setR] = useState<PerfilAlumno>(PERFIL_INICIAL);
  const [submitted, setSubmitted] = useState(false);

  const ranking = useMemo(() => {
    if (!submitted) return [];
    return recomendarItinerarios(r, { limite: 4 });
  }, [submitted, r]);

  function toggleMateria(m: Materia) {
    setR((prev) => ({
      ...prev,
      materias: prev.materias.includes(m)
        ? prev.materias.filter((x) => x !== m)
        : [...prev.materias, m],
    }));
  }
  function toggleGusta(g: GustaTrabajar) {
    setR((prev) => ({
      ...prev,
      gusta: prev.gusta.includes(g) ? prev.gusta.filter((x) => x !== g) : [...prev.gusta, g],
    }));
  }
  function reset() {
    setR(PERFIL_INICIAL);
    setSubmitted(false);
  }

  const puedeEnviar =
    r.materias.length > 0 &&
    r.estilo !== null &&
    r.duracion !== null &&
    r.gusta.length > 0 &&
    r.prioridad !== null;

  const comunidadSel = r.ccaa ? CCAA.find((c) => c.id === r.ccaa) ?? null : null;

  return (
    <div class="calc">
      {!submitted ? (
        <>
          <p class="calc__sub">1 · Materias en las que has rendido mejor este curso</p>
          <p class="bi__hint">Marca todas las que apliquen.</p>
          <div class="bi__chips">
            {MATERIAS.map((m) => (
              <button
                type="button"
                class={`bi__chip ${r.materias.includes(m.id) ? 'is-on' : ''}`}
                onClick={() => toggleMateria(m.id)}
              >
                {m.label}
              </button>
            ))}
          </div>

          <p class="calc__sub">2 · ¿Qué prefieres?</p>
          <div class="bi__radios">
            <RadioOption
              checked={r.estilo === 'teoria'}
              onChange={() => setR({ ...r, estilo: 'teoria' })}
              label="Estudiar más años teoría antes de trabajar"
            />
            <RadioOption
              checked={r.estilo === 'practico'}
              onChange={() => setR({ ...r, estilo: 'practico' })}
              label="Aprender un oficio práctico cuanto antes"
            />
            <RadioOption
              checked={r.estilo === 'noSeguro'}
              onChange={() => setR({ ...r, estilo: 'noSeguro' })}
              label="No estoy seguro/a todavía"
            />
          </div>

          <p class="calc__sub">3 · Tiempo de formación antes de trabajar</p>
          <div class="bi__radios">
            <RadioOption
              checked={r.duracion === '1-2'}
              onChange={() => setR({ ...r, duracion: '1-2' })}
              label="1-2 años"
            />
            <RadioOption
              checked={r.duracion === '3-4'}
              onChange={() => setR({ ...r, duracion: '3-4' })}
              label="3-4 años"
            />
            <RadioOption
              checked={r.duracion === '5+'}
              onChange={() => setR({ ...r, duracion: '5+' })}
              label="5+ años"
            />
            <RadioOption
              checked={r.duracion === 'daIgual'}
              onChange={() => setR({ ...r, duracion: 'daIgual' })}
              label="Da igual si me gusta"
            />
          </div>

          <p class="calc__sub">4 · ¿Te gusta trabajar con…?</p>
          <p class="bi__hint">Marca todas las que apliquen.</p>
          <div class="bi__chips">
            {GUSTA.map((g) => (
              <button
                type="button"
                class={`bi__chip ${r.gusta.includes(g.id) ? 'is-on' : ''}`}
                onClick={() => toggleGusta(g.id)}
              >
                {g.label}
              </button>
            ))}
          </div>

          <p class="calc__sub">5 · ¿En qué comunidad autónoma estudias? (opcional)</p>
          <p class="bi__hint">
            La oferta de cada vía varía por comunidad. Si la indicas, te enlazamos el catálogo
            oficial donde consultar la oferta concreta.
          </p>
          <label class="calc__field">
            <div class="calc__input-wrap">
              <select
                class="cv__select"
                value={r.ccaa ?? ''}
                onChange={(e) =>
                  setR({
                    ...r,
                    ccaa: ((e.target as HTMLSelectElement).value || null) as CCAAId | null,
                  })
                }
              >
                <option value="">— Selecciona (opcional) —</option>
                {CCAA.map((c) => (
                  <option value={c.id}>{c.nombre}</option>
                ))}
              </select>
            </div>
          </label>

          <p class="calc__sub">6 · Tu prioridad principal</p>
          <div class="bi__radios">
            <RadioOption
              checked={r.prioridad === 'salario'}
              onChange={() => setR({ ...r, prioridad: 'salario' })}
              label="Salario alto"
            />
            <RadioOption
              checked={r.prioridad === 'vocacion'}
              onChange={() => setR({ ...r, prioridad: 'vocacion' })}
              label="Vocación"
            />
            <RadioOption
              checked={r.prioridad === 'estabilidad'}
              onChange={() => setR({ ...r, prioridad: 'estabilidad' })}
              label="Estabilidad"
            />
            <RadioOption
              checked={r.prioridad === 'flexibilidad'}
              onChange={() => setR({ ...r, prioridad: 'flexibilidad' })}
              label="Flexibilidad"
            />
            <RadioOption
              checked={r.prioridad === 'ayudar'}
              onChange={() => setR({ ...r, prioridad: 'ayudar' })}
              label="Ayudar a otros"
            />
          </div>

          <div class="bi__actions">
            <button
              type="button"
              class="bi__btn bi__btn--primary"
              disabled={!puedeEnviar}
              onClick={() => setSubmitted(true)}
            >
              Ver mis itinerarios
            </button>
            <button type="button" class="calc__btn calc__btn--ghost" onClick={reset}>
              Reiniciar
            </button>
          </div>
        </>
      ) : (
        <>
          <div class="calc__results" style="margin-top:0; padding-top:0; border-top:none;">
            <p class="calc__sub" style="margin-top:0;">
              Tus itinerarios más coherentes
            </p>

            {ranking.length === 0 ? (
              <div class="calc__warning">
                No se han encontrado coincidencias claras. Prueba a marcar más materias o
                intereses.
              </div>
            ) : (
              <div class="bi__cards">
                {ranking.map((rk) => (
                  <div class="bi__card">
                    <div class="bi__card-rank">#{rk.rango}</div>
                    <h3 class="bi__card-title">{rk.itinerario.titulo}</h3>

                    {rk.razones.length > 0 && (
                      <>
                        <p class="bi__card-section">Por qué encaja contigo</p>
                        <ul class="bi__card-list">
                          {rk.razones.map((rz) => (
                            <li>{rz}</li>
                          ))}
                        </ul>
                      </>
                    )}

                    <div class="bi__card-meta">
                      <div>
                        <span class="bi__card-meta-label">Duración</span>
                        <span class="bi__card-meta-val">{rk.itinerario.duracion}</span>
                      </div>
                      <div>
                        <span class="bi__card-meta-label">Empleabilidad</span>
                        <span class="bi__card-meta-val">{rk.itinerario.empleabilidad}</span>
                      </div>
                    </div>

                    <p class="bi__card-section">A qué da acceso</p>
                    <ul class="bi__card-list">
                      <li>{rk.itinerario.salidas}</li>
                    </ul>

                    <p class="bi__card-section">Ocupaciones de ejemplo</p>
                    <ul class="bi__card-list">
                      <li>{rk.itinerario.ocupaciones}</li>
                    </ul>

                    <p class="bi__card-section">Pasos siguientes</p>
                    <ul class="bi__card-list">
                      <li>
                        Habla con tu tutor/a y con orientación del centro para validar la vía.
                      </li>
                      <li>
                        Consulta la oferta general en{' '}
                        <a
                          href={rk.itinerario.enlace.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {rk.itinerario.enlace.texto}
                        </a>
                        .
                      </li>
                      {comunidadSel && (
                        <li>
                          La oferta concreta en <strong>{comunidadSel.nombre}</strong> varía
                          cada curso: consúltala en el catálogo oficial,{' '}
                          <a
                            href={comunidadSel.portal.url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {comunidadSel.portal.texto}
                          </a>
                          .
                        </li>
                      )}
                    </ul>
                  </div>
                ))}
              </div>
            )}

            <div class="bi__actions" style="margin-top:1.4rem;">
              <button type="button" class="calc__btn calc__btn--ghost" onClick={reset}>
                Volver a empezar
              </button>
              <button
                type="button"
                class="calc__btn calc__btn--ghost"
                onClick={() => setSubmitted(false)}
              >
                Editar respuestas
              </button>
            </div>

            <details class="calc__details">
              <summary>Cómo funciona este buscador</summary>
              <div class="calc__formula">
                <p>
                  Cada itinerario tiene una matriz de pesos en función de las materias en las
                  que rindes mejor, tu estilo de estudio, la duración deseada, el tipo de
                  trabajo que te gusta y tu prioridad principal. Sumamos los pesos y mostramos
                  los itinerarios con mayor puntuación. La comunidad autónoma no cambia el
                  orden: solo añade el enlace al catálogo oficial donde consultar la oferta
                  concreta de tu territorio. Es una orientación, <em>no</em> una predicción.
                </p>
              </div>
            </details>
          </div>
        </>
      )}
    </div>
  );
}

function RadioOption(props: { checked: boolean; onChange: () => void; label: string }) {
  return (
    <label class={`bi__radio ${props.checked ? 'is-on' : ''}`}>
      <input type="radio" checked={props.checked} onChange={props.onChange} />
      <span>{props.label}</span>
    </label>
  );
}
