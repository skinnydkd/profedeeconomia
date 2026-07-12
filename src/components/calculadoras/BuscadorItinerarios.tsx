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
import { type Locale } from '@/i18n/locale';

/**
 * Itinerary finder for FOPP 4ESO students. Six questions + an optional CCAA
 * selector. All the data and scoring lives in `lib/calc/itinerarios.ts` (pure,
 * unit-tested); this component is only the UI: it builds a `PerfilAlumno`,
 * calls `recomendarItinerarios`, and renders the ranked cards with `.bi__*`
 * styles. The goal is orientation, not deterministic vocational guidance.
 */

/**
 * UI strings, Valencian (AVL) alongside the ES source. The itinerary catalogue
 * (course names, families, reasons, CCAA names) lives in
 * `lib/calc/itinerarios.ts` and is NOT translated here. Option lists keyed by a
 * structural id (materias, gusta) nest a record keyed by that id.
 */
export const COPY = {
  es: {
    materias: {
      matematicas: 'Matemáticas',
      lengua: 'Lengua / Literatura',
      ingles: 'Inglés',
      ciencias: 'Ciencias (Bio/Quim/Fis)',
      tecnologia: 'Tecnología / Digitalización',
      artes: 'Artes',
      edFisica: 'Educación Física',
      sociales: 'Geografía e Historia',
    },
    gusta: {
      personas: 'Personas',
      datos: 'Datos / números',
      maquinas: 'Máquinas y equipos',
      ideas: 'Ideas / creatividad',
      naturaleza: 'Animales / naturaleza',
      manos: 'Las manos (oficio manual)',
    },
    paso1: '1 · Materias en las que has rendido mejor este curso',
    marcaTodas: 'Marca todas las que apliquen.',
    paso2: '2 · ¿Qué prefieres?',
    estiloTeoria: 'Estudiar más años teoría antes de trabajar',
    estiloPractico: 'Aprender un oficio práctico cuanto antes',
    estiloNoSeguro: 'No estoy seguro/a todavía',
    paso3: '3 · Tiempo de formación antes de trabajar',
    dur12: '1-2 años',
    dur34: '3-4 años',
    dur5: '5+ años',
    durDaIgual: 'Da igual si me gusta',
    paso4: '4 · ¿Te gusta trabajar con…?',
    paso5: '5 · ¿En qué comunidad autónoma estudias? (opcional)',
    ccaaHint:
      'La oferta de cada vía varía por comunidad. Si la indicas, te enlazamos el catálogo oficial donde consultar la oferta concreta.',
    selecciona: '— Selecciona (opcional) —',
    paso6: '6 · Tu prioridad principal',
    priSalario: 'Salario alto',
    priVocacion: 'Vocación',
    priEstabilidad: 'Estabilidad',
    priFlexibilidad: 'Flexibilidad',
    priAyudar: 'Ayudar a otros',
    btnVer: 'Ver mis itinerarios',
    btnReiniciar: 'Reiniciar',
    resultTitulo: 'Tus itinerarios más coherentes',
    sinResultados:
      'No se han encontrado coincidencias claras. Prueba a marcar más materias o intereses.',
    porQueEncaja: 'Por qué encaja contigo',
    metaDuracion: 'Duración',
    metaEmpleabilidad: 'Empleabilidad',
    daAcceso: 'A qué da acceso',
    ocupacionesEjemplo: 'Ocupaciones de ejemplo',
    pasosSiguientes: 'Pasos siguientes',
    pasoTutor: 'Habla con tu tutor/a y con orientación del centro para validar la vía.',
    consultaOfertaGeneral: 'Consulta la oferta general en',
    ofertaConcretaPre: 'La oferta concreta en',
    ofertaConcretaPost: 'varía cada curso: consúltala en el catálogo oficial,',
    btnVolver: 'Volver a empezar',
    btnEditar: 'Editar respuestas',
    comoFuncionaSummary: 'Cómo funciona este buscador',
    comoFuncionaPre:
      'Cada itinerario tiene una matriz de pesos en función de las materias en las que rindes mejor, tu estilo de estudio, la duración deseada, el tipo de trabajo que te gusta y tu prioridad principal. Sumamos los pesos y mostramos los itinerarios con mayor puntuación. La comunidad autónoma no cambia el orden: solo añade el enlace al catálogo oficial donde consultar la oferta concreta de tu territorio. Es una orientación,',
    comoFuncionaEm: 'no',
    comoFuncionaPost: 'una predicción.',
  },
  ca: {
    materias: {
      matematicas: 'Matemàtiques',
      lengua: 'Llengua / Literatura',
      ingles: 'Anglés',
      ciencias: 'Ciències (Bio/Quím/Fís)',
      tecnologia: 'Tecnologia / Digitalització',
      artes: 'Arts',
      edFisica: 'Educació Física',
      sociales: 'Geografia i Història',
    },
    gusta: {
      personas: 'Persones',
      datos: 'Dades / números',
      maquinas: 'Màquines i equips',
      ideas: 'Idees / creativitat',
      naturaleza: 'Animals / naturalesa',
      manos: 'Les mans (ofici manual)',
    },
    paso1: '1 · Matèries en què has rendit millor este curs',
    marcaTodas: 'Marca totes les que corresponguen.',
    paso2: '2 · Què preferixes?',
    estiloTeoria: 'Estudiar més anys teoria abans de treballar',
    estiloPractico: 'Aprendre un ofici pràctic com més prompte millor',
    estiloNoSeguro: 'Encara no estic segur/a',
    paso3: '3 · Temps de formació abans de treballar',
    dur12: '1-2 anys',
    dur34: '3-4 anys',
    dur5: '5+ anys',
    durDaIgual: "M'és igual si m'agrada",
    paso4: "4 · T'agrada treballar amb…?",
    paso5: '5 · En quina comunitat autònoma estudies? (opcional)',
    ccaaHint:
      "L'oferta de cada via varia segons la comunitat. Si la indiques, t'enllacem el catàleg oficial on consultar l'oferta concreta.",
    selecciona: '— Selecciona (opcional) —',
    paso6: '6 · La teua prioritat principal',
    priSalario: 'Salari alt',
    priVocacion: 'Vocació',
    priEstabilidad: 'Estabilitat',
    priFlexibilidad: 'Flexibilitat',
    priAyudar: 'Ajudar els altres',
    btnVer: 'Veure els meus itineraris',
    btnReiniciar: 'Reiniciar',
    resultTitulo: 'Els teus itineraris més coherents',
    sinResultados:
      "No s'han trobat coincidències clares. Prova a marcar més matèries o interessos.",
    porQueEncaja: 'Per què encaixa amb tu',
    metaDuracion: 'Duració',
    metaEmpleabilidad: 'Ocupabilitat',
    daAcceso: 'A què dóna accés',
    ocupacionesEjemplo: "Ocupacions d'exemple",
    pasosSiguientes: 'Passos següents',
    pasoTutor: "Parla amb el teu tutor/a i amb l'orientació del centre per a validar la via.",
    consultaOfertaGeneral: "Consulta l'oferta general en",
    ofertaConcretaPre: "L'oferta concreta en",
    ofertaConcretaPost: 'varia cada curs: consulta-la en el catàleg oficial,',
    btnVolver: 'Tornar a començar',
    btnEditar: 'Editar respostes',
    comoFuncionaSummary: 'Com funciona este cercador',
    comoFuncionaPre:
      "Cada itinerari té una matriu de pesos en funció de les matèries en què rendixes millor, el teu estil d'estudi, la duració desitjada, el tipus de treball que t'agrada i la teua prioritat principal. Sumem els pesos i mostrem els itineraris amb major puntuació. La comunitat autònoma no canvia l'orde: només afig l'enllaç al catàleg oficial on consultar l'oferta concreta del teu territori. És una orientació,",
    comoFuncionaEm: 'no',
    comoFuncionaPost: 'una predicció.',
  },
} as const;

interface Props { locale?: Locale }

const PERFIL_INICIAL: PerfilAlumno = {
  materias: [],
  estilo: null,
  duracion: null,
  gusta: [],
  prioridad: null,
  ccaa: null,
};

const MATERIAS: { id: Materia }[] = [
  { id: 'matematicas' },
  { id: 'lengua' },
  { id: 'ingles' },
  { id: 'ciencias' },
  { id: 'tecnologia' },
  { id: 'artes' },
  { id: 'edFisica' },
  { id: 'sociales' },
];

const GUSTA: { id: GustaTrabajar }[] = [
  { id: 'personas' },
  { id: 'datos' },
  { id: 'maquinas' },
  { id: 'ideas' },
  { id: 'naturaleza' },
  { id: 'manos' },
];

export default function BuscadorItinerarios({ locale = 'es' }: Props) {
  const c = COPY[locale];
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

  const comunidadSel = r.ccaa ? CCAA.find((cc) => cc.id === r.ccaa) ?? null : null;

  return (
    <div class="calc">
      {!submitted ? (
        <>
          <p class="calc__sub">{c.paso1}</p>
          <p class="bi__hint">{c.marcaTodas}</p>
          <div class="bi__chips">
            {MATERIAS.map((m) => (
              <button
                type="button"
                class={`bi__chip ${r.materias.includes(m.id) ? 'is-on' : ''}`}
                onClick={() => toggleMateria(m.id)}
              >
                {c.materias[m.id]}
              </button>
            ))}
          </div>

          <p class="calc__sub">{c.paso2}</p>
          <div class="bi__radios">
            <RadioOption
              checked={r.estilo === 'teoria'}
              onChange={() => setR({ ...r, estilo: 'teoria' })}
              label={c.estiloTeoria}
            />
            <RadioOption
              checked={r.estilo === 'practico'}
              onChange={() => setR({ ...r, estilo: 'practico' })}
              label={c.estiloPractico}
            />
            <RadioOption
              checked={r.estilo === 'noSeguro'}
              onChange={() => setR({ ...r, estilo: 'noSeguro' })}
              label={c.estiloNoSeguro}
            />
          </div>

          <p class="calc__sub">{c.paso3}</p>
          <div class="bi__radios">
            <RadioOption
              checked={r.duracion === '1-2'}
              onChange={() => setR({ ...r, duracion: '1-2' })}
              label={c.dur12}
            />
            <RadioOption
              checked={r.duracion === '3-4'}
              onChange={() => setR({ ...r, duracion: '3-4' })}
              label={c.dur34}
            />
            <RadioOption
              checked={r.duracion === '5+'}
              onChange={() => setR({ ...r, duracion: '5+' })}
              label={c.dur5}
            />
            <RadioOption
              checked={r.duracion === 'daIgual'}
              onChange={() => setR({ ...r, duracion: 'daIgual' })}
              label={c.durDaIgual}
            />
          </div>

          <p class="calc__sub">{c.paso4}</p>
          <p class="bi__hint">{c.marcaTodas}</p>
          <div class="bi__chips">
            {GUSTA.map((g) => (
              <button
                type="button"
                class={`bi__chip ${r.gusta.includes(g.id) ? 'is-on' : ''}`}
                onClick={() => toggleGusta(g.id)}
              >
                {c.gusta[g.id]}
              </button>
            ))}
          </div>

          <p class="calc__sub">{c.paso5}</p>
          <p class="bi__hint">{c.ccaaHint}</p>
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
                <option value="">{c.selecciona}</option>
                {CCAA.map((cc) => (
                  <option value={cc.id}>{cc.nombre}</option>
                ))}
              </select>
            </div>
          </label>

          <p class="calc__sub">{c.paso6}</p>
          <div class="bi__radios">
            <RadioOption
              checked={r.prioridad === 'salario'}
              onChange={() => setR({ ...r, prioridad: 'salario' })}
              label={c.priSalario}
            />
            <RadioOption
              checked={r.prioridad === 'vocacion'}
              onChange={() => setR({ ...r, prioridad: 'vocacion' })}
              label={c.priVocacion}
            />
            <RadioOption
              checked={r.prioridad === 'estabilidad'}
              onChange={() => setR({ ...r, prioridad: 'estabilidad' })}
              label={c.priEstabilidad}
            />
            <RadioOption
              checked={r.prioridad === 'flexibilidad'}
              onChange={() => setR({ ...r, prioridad: 'flexibilidad' })}
              label={c.priFlexibilidad}
            />
            <RadioOption
              checked={r.prioridad === 'ayudar'}
              onChange={() => setR({ ...r, prioridad: 'ayudar' })}
              label={c.priAyudar}
            />
          </div>

          <div class="bi__actions">
            <button
              type="button"
              class="bi__btn bi__btn--primary"
              disabled={!puedeEnviar}
              onClick={() => setSubmitted(true)}
            >
              {c.btnVer}
            </button>
            <button type="button" class="calc__btn calc__btn--ghost" onClick={reset}>
              {c.btnReiniciar}
            </button>
          </div>
        </>
      ) : (
        <>
          <div class="calc__results" style="margin-top:0; padding-top:0; border-top:none;">
            <p class="calc__sub" style="margin-top:0;">
              {c.resultTitulo}
            </p>

            {ranking.length === 0 ? (
              <div class="calc__warning">{c.sinResultados}</div>
            ) : (
              <div class="bi__cards">
                {ranking.map((rk) => (
                  <div class="bi__card">
                    <div class="bi__card-rank">#{rk.rango}</div>
                    <h3 class="bi__card-title">{rk.itinerario.titulo}</h3>

                    {rk.razones.length > 0 && (
                      <>
                        <p class="bi__card-section">{c.porQueEncaja}</p>
                        <ul class="bi__card-list">
                          {rk.razones.map((rz) => (
                            <li>{rz}</li>
                          ))}
                        </ul>
                      </>
                    )}

                    <div class="bi__card-meta">
                      <div>
                        <span class="bi__card-meta-label">{c.metaDuracion}</span>
                        <span class="bi__card-meta-val">{rk.itinerario.duracion}</span>
                      </div>
                      <div>
                        <span class="bi__card-meta-label">{c.metaEmpleabilidad}</span>
                        <span class="bi__card-meta-val">{rk.itinerario.empleabilidad}</span>
                      </div>
                    </div>

                    <p class="bi__card-section">{c.daAcceso}</p>
                    <ul class="bi__card-list">
                      <li>{rk.itinerario.salidas}</li>
                    </ul>

                    <p class="bi__card-section">{c.ocupacionesEjemplo}</p>
                    <ul class="bi__card-list">
                      <li>{rk.itinerario.ocupaciones}</li>
                    </ul>

                    <p class="bi__card-section">{c.pasosSiguientes}</p>
                    <ul class="bi__card-list">
                      <li>{c.pasoTutor}</li>
                      <li>
                        {c.consultaOfertaGeneral}{' '}
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
                          {c.ofertaConcretaPre} <strong>{comunidadSel.nombre}</strong>{' '}
                          {c.ofertaConcretaPost}{' '}
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
                {c.btnVolver}
              </button>
              <button
                type="button"
                class="calc__btn calc__btn--ghost"
                onClick={() => setSubmitted(false)}
              >
                {c.btnEditar}
              </button>
            </div>

            <details class="calc__details">
              <summary>{c.comoFuncionaSummary}</summary>
              <div class="calc__formula">
                <p>
                  {c.comoFuncionaPre} <em>{c.comoFuncionaEm}</em> {c.comoFuncionaPost}
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
