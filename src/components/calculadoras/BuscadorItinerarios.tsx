/** @jsxImportSource preact */
import { useMemo, useState } from 'preact/hooks';

/**
 * Itinerary finder for FOPP 4ESO students. Six questions, weighted scoring
 * across 8 hardcoded post-ESO pathways. Returns the top 3-4 ranked matches
 * with explanation tags derived from the user's answers.
 *
 * The scoring matrix is intentionally simple (sum of weights) so a student
 * can predict roughly why a result appears. The goal is orientation, not
 * deterministic vocational guidance.
 */

type Materia =
  | 'matematicas'
  | 'lengua'
  | 'ingles'
  | 'ciencias'
  | 'tecnologia'
  | 'artes'
  | 'edFisica'
  | 'sociales';

type EstiloEstudio = 'teoria' | 'practico' | 'noSeguro';
type Duracion = '1-2' | '3-4' | '5+' | 'daIgual';
type GustaTrabajar =
  | 'personas'
  | 'datos'
  | 'maquinas'
  | 'ideas'
  | 'naturaleza'
  | 'manos';
type Prioridad = 'salario' | 'vocacion' | 'estabilidad' | 'flexibilidad' | 'ayudar';

interface Itinerario {
  id: string;
  titulo: string;
  duracion: string;
  empleabilidad: string;
  // Suggested next-step URL.
  enlace: { url: string; texto: string };
  // Weights per axis. Higher = stronger fit signal.
  pesos: {
    materias?: Partial<Record<Materia, number>>;
    estilo?: Partial<Record<EstiloEstudio, number>>;
    duracion?: Partial<Record<Duracion, number>>;
    gusta?: Partial<Record<GustaTrabajar, number>>;
    prioridad?: Partial<Record<Prioridad, number>>;
  };
  // Reasons to surface when the itinerary matches each axis.
  razones: {
    materias?: Partial<Record<Materia, string>>;
    estilo?: Partial<Record<EstiloEstudio, string>>;
    duracion?: Partial<Record<Duracion, string>>;
    gusta?: Partial<Record<GustaTrabajar, string>>;
    prioridad?: Partial<Record<Prioridad, string>>;
  };
}

const ITINERARIOS: Itinerario[] = [
  {
    id: 'bach-ciencias-ing',
    titulo: 'Bachillerato de Ciencias → Ingenierías',
    duracion: '2 años Bachillerato + 4 años Grado (≈ 6 años en total)',
    empleabilidad: 'Alta. Demanda sostenida en industria, energía, software y construcción.',
    enlace: {
      url: 'https://www.universidades.gob.es/',
      texto: 'Buscar grados de ingeniería',
    },
    pesos: {
      materias: { matematicas: 3, ciencias: 2, tecnologia: 3 },
      estilo: { teoria: 2, noSeguro: 1 },
      duracion: { '5+': 2, daIgual: 1 },
      gusta: { maquinas: 2, datos: 2, ideas: 1 },
      prioridad: { salario: 2, estabilidad: 1 },
    },
    razones: {
      materias: {
        matematicas: 'Rendir bien en Matemáticas es la mejor señal para una ingeniería.',
        tecnologia: 'Tu interés por Tecnología encaja con la base ingenieril.',
        ciencias: 'Las Ciencias son el suelo común de las ingenierías.',
      },
      gusta: {
        maquinas: 'Te gusta trabajar con máquinas y equipos: corazón de la ingeniería.',
        datos: 'Las ingenierías cuantitativas (industrial, telecos, datos) viven del análisis.',
      },
      prioridad: {
        salario: 'Las ingenierías ofrecen, de media, sueldos por encima de la media nacional.',
      },
      duracion: { '5+': 'Aceptas un recorrido largo, lo que esta vía exige.' },
    },
  },
  {
    id: 'bach-ciencias-sanidad',
    titulo: 'Bachillerato de Ciencias → Sanidad (Medicina, Enfermería, Fisio…)',
    duracion: '2 años Bach + 4-6 años Grado (+ MIR/EIR en algunos casos)',
    empleabilidad: 'Muy alta. La sanidad pública y privada absorbe casi toda la oferta.',
    enlace: {
      url: 'https://www.universidades.gob.es/',
      texto: 'Buscar grados sanitarios',
    },
    pesos: {
      materias: { ciencias: 3, matematicas: 1, ingles: 1 },
      estilo: { teoria: 2 },
      duracion: { '5+': 2, daIgual: 1 },
      gusta: { personas: 3, datos: 1 },
      prioridad: { ayudar: 3, vocacion: 2, estabilidad: 2 },
    },
    razones: {
      materias: {
        ciencias: 'Biología y Química son la puerta de entrada a la rama sanitaria.',
      },
      gusta: { personas: 'El trato con pacientes es central en sanidad.' },
      prioridad: {
        ayudar: 'Ayudar a otros está en el ADN de la profesión sanitaria.',
        vocacion: 'Las profesiones sanitarias suelen elegirse por vocación clara.',
        estabilidad: 'La sanidad pública ofrece estabilidad laboral notable.',
      },
    },
  },
  {
    id: 'bach-hccss',
    titulo: 'Bachillerato Humanidades y CCSS → Derecho, ADE o Magisterio',
    duracion: '2 años Bach + 4 años Grado (≈ 6 años en total)',
    empleabilidad: 'Media-alta. Depende mucho de idiomas y prácticas.',
    enlace: {
      url: 'https://www.universidades.gob.es/',
      texto: 'Explorar grados sociales y humanísticos',
    },
    pesos: {
      materias: { sociales: 3, lengua: 3, ingles: 2, matematicas: 1 },
      estilo: { teoria: 2, noSeguro: 1 },
      duracion: { '5+': 1, '3-4': 2, daIgual: 1 },
      gusta: { personas: 2, ideas: 2, datos: 1 },
      prioridad: { vocacion: 1, estabilidad: 1, ayudar: 2, salario: 1 },
    },
    razones: {
      materias: {
        sociales: 'Tu interés por Sociales encaja con Derecho, ADE o Magisterio.',
        lengua: 'Una buena base lingüística es clave en estas carreras.',
        ingles: 'El inglés multiplica oportunidades en empresas y consultoría.',
      },
      gusta: {
        personas: 'Magisterio y Derecho son profesiones de trato con personas.',
        ideas: 'Estas carreras trabajan con conceptos, normas y argumentos.',
      },
    },
  },
  {
    id: 'bach-artes',
    titulo: 'Bachillerato de Artes → Diseño, BBAA o Audiovisual',
    duracion: '2 años Bach + 4 años Grado',
    empleabilidad: 'Variable. Alta en diseño UX/UI y audiovisual; media en BBAA.',
    enlace: {
      url: 'https://www.universidades.gob.es/',
      texto: 'Explorar grados de Arte y Diseño',
    },
    pesos: {
      materias: { artes: 3, lengua: 1, tecnologia: 1 },
      estilo: { teoria: 1, noSeguro: 1 },
      duracion: { '5+': 1, '3-4': 2, daIgual: 1 },
      gusta: { ideas: 3, manos: 2, personas: 1 },
      prioridad: { vocacion: 3, flexibilidad: 2 },
    },
    razones: {
      materias: { artes: 'Rendir bien en Artes es la señal más directa para esta vía.' },
      gusta: {
        ideas: 'Las artes viven de ideas, conceptos y procesos creativos.',
        manos: 'Trabajar con las manos encaja con BBAA, escultura o cerámica.',
      },
      prioridad: {
        vocacion: 'Es una vía claramente vocacional; merece la pena si te llama.',
        flexibilidad: 'Mucho trabajo autónomo y proyectos: alta flexibilidad horaria.',
      },
    },
  },
  {
    id: 'fpgm-sanidad',
    titulo: 'FP Grado Medio Sanidad (Farmacia, Emergencias, Cuidados Auxiliares)',
    duracion: '2 años (1 700-2 000 h) — incluye FCT en empresa',
    empleabilidad: 'Muy alta. Sector con demanda constante en farmacia, hospitales y residencias.',
    enlace: { url: 'https://www.todofp.es/', texto: 'Ver familia Sanidad en TodoFP' },
    pesos: {
      materias: { ciencias: 2, matematicas: 1 },
      estilo: { practico: 3, noSeguro: 1 },
      duracion: { '1-2': 3, '3-4': 1, daIgual: 1 },
      gusta: { personas: 3, manos: 1 },
      prioridad: { ayudar: 3, estabilidad: 2, vocacion: 1 },
    },
    razones: {
      estilo: { practico: 'Quieres formación práctica y rápida: el formato FP encaja.' },
      duracion: { '1-2': 'Te incorporas al mercado en 2 años con titulación oficial.' },
      gusta: { personas: 'Atención directa a pacientes y usuarios.' },
      prioridad: { ayudar: 'Es una profesión orientada al cuidado.' },
    },
  },
  {
    id: 'fpgm-smr',
    titulo: 'FP Grado Medio Informática (SMR — Sistemas Microinformáticos y Redes)',
    duracion: '2 años (2 000 h) — incluye FCT en empresa',
    empleabilidad: 'Alta. Soporte IT, infraestructura y administración de sistemas.',
    enlace: { url: 'https://www.todofp.es/', texto: 'Ver familia Informática y Comunicaciones' },
    pesos: {
      materias: { matematicas: 1, tecnologia: 3, ingles: 1 },
      estilo: { practico: 3, noSeguro: 1 },
      duracion: { '1-2': 3, daIgual: 1 },
      gusta: { maquinas: 3, datos: 2, ideas: 1 },
      prioridad: { salario: 1, estabilidad: 2, flexibilidad: 1 },
    },
    razones: {
      materias: { tecnologia: 'Tu interés por Tecnología es el mejor indicador para SMR.' },
      estilo: { practico: 'SMR es muy práctico: montas, configuras y reparas.' },
      gusta: {
        maquinas: 'Trabajas con equipos, redes y dispositivos a diario.',
        datos: 'Buena base si luego quieres pasar a DAW/DAM (Grado Superior).',
      },
      duracion: { '1-2': 'En 2 años puedes acceder a un primer empleo IT.' },
    },
  },
  {
    id: 'fpgm-admon',
    titulo: 'FP Grado Medio Gestión Administrativa',
    duracion: '2 años (2 000 h) — incluye FCT en empresa',
    empleabilidad: 'Media-alta. Empleo administrativo transversal a casi todos los sectores.',
    enlace: { url: 'https://www.todofp.es/', texto: 'Ver familia Administración y Gestión' },
    pesos: {
      materias: { matematicas: 1, lengua: 2, ingles: 1, sociales: 1 },
      estilo: { practico: 3, noSeguro: 2 },
      duracion: { '1-2': 3, daIgual: 1 },
      gusta: { datos: 2, personas: 1, ideas: 1 },
      prioridad: { estabilidad: 3, salario: 1 },
    },
    razones: {
      estilo: { practico: 'Formación práctica con FCT en empresa real.' },
      duracion: { '1-2': 'En 2 años titulas y puedes incorporarte a una oficina.' },
      prioridad: {
        estabilidad: 'El perfil administrativo da empleo estable en muchos sectores.',
      },
    },
  },
  {
    id: 'fpgm-sociocultural',
    titulo: 'FP Grado Medio Servicios Socioculturales (Atención a Personas en Situación de Dependencia)',
    duracion: '2 años (2 000 h) — incluye FCT en empresa',
    empleabilidad: 'Alta. Sector con demanda creciente por envejecimiento poblacional.',
    enlace: { url: 'https://www.todofp.es/', texto: 'Ver familia Servicios Socioculturales' },
    pesos: {
      materias: { sociales: 2, lengua: 1, edFisica: 1 },
      estilo: { practico: 3 },
      duracion: { '1-2': 3, daIgual: 1 },
      gusta: { personas: 3, manos: 1 },
      prioridad: { ayudar: 3, vocacion: 2, estabilidad: 1 },
    },
    razones: {
      gusta: { personas: 'Trabajo directo con personas mayores o en situación de dependencia.' },
      prioridad: {
        ayudar: 'Es una de las profesiones más claramente orientadas al cuidado.',
        vocacion: 'Pide vocación; el día a día es exigente pero significativo.',
      },
      estilo: { practico: 'Formación muy práctica y con FCT desde el primer año.' },
    },
  },
];

interface Respuestas {
  materias: Materia[];
  estilo: EstiloEstudio | null;
  duracion: Duracion | null;
  gusta: GustaTrabajar[];
  ciudad: string;
  prioridad: Prioridad | null;
}

const RESPUESTAS_INICIALES: Respuestas = {
  materias: [],
  estilo: null,
  duracion: null,
  gusta: [],
  ciudad: '',
  prioridad: null,
};

export default function BuscadorItinerarios() {
  const [r, setR] = useState<Respuestas>(RESPUESTAS_INICIALES);
  const [submitted, setSubmitted] = useState(false);

  const ranking = useMemo(() => {
    if (!submitted) return [];
    return ITINERARIOS.map((it) => {
      let score = 0;
      const razones: string[] = [];

      for (const m of r.materias) {
        const w = it.pesos.materias?.[m] ?? 0;
        score += w;
        if (w >= 2 && it.razones.materias?.[m]) razones.push(it.razones.materias[m]!);
      }
      if (r.estilo) {
        const w = it.pesos.estilo?.[r.estilo] ?? 0;
        score += w;
        if (w >= 2 && it.razones.estilo?.[r.estilo]) razones.push(it.razones.estilo[r.estilo]!);
      }
      if (r.duracion) {
        const w = it.pesos.duracion?.[r.duracion] ?? 0;
        score += w;
        if (w >= 2 && it.razones.duracion?.[r.duracion]) razones.push(it.razones.duracion[r.duracion]!);
      }
      for (const g of r.gusta) {
        const w = it.pesos.gusta?.[g] ?? 0;
        score += w;
        if (w >= 2 && it.razones.gusta?.[g]) razones.push(it.razones.gusta[g]!);
      }
      if (r.prioridad) {
        const w = it.pesos.prioridad?.[r.prioridad] ?? 0;
        score += w;
        if (w >= 2 && it.razones.prioridad?.[r.prioridad]) razones.push(it.razones.prioridad[r.prioridad]!);
      }

      // Cap reasons at 3 to keep cards readable.
      return { it, score, razones: razones.slice(0, 3) };
    })
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 4);
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
    setR(RESPUESTAS_INICIALES);
    setSubmitted(false);
  }

  const puedeEnviar =
    r.materias.length > 0 &&
    r.estilo !== null &&
    r.duracion !== null &&
    r.gusta.length > 0 &&
    r.prioridad !== null;

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

          <p class="calc__sub">5 · ¿Alguna ciudad o región en mente? (opcional)</p>
          <label class="calc__field">
            <div class="calc__input-wrap">
              <input
                type="text"
                placeholder="Ej. Valencia, Madrid, mi pueblo…"
                value={r.ciudad}
                onInput={(e) => setR({ ...r, ciudad: (e.target as HTMLInputElement).value })}
              />
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
            <p class="calc__sub" style="margin-top:0;">Tus 3-4 itinerarios más coherentes</p>

            {ranking.length === 0 ? (
              <div class="calc__warning">
                No se han encontrado coincidencias claras. Prueba a marcar más materias o
                intereses.
              </div>
            ) : (
              <div class="bi__cards">
                {ranking.map((rk, idx) => (
                  <div class="bi__card">
                    <div class="bi__card-rank">#{idx + 1}</div>
                    <h3 class="bi__card-title">{rk.it.titulo}</h3>

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
                        <span class="bi__card-meta-val">{rk.it.duracion}</span>
                      </div>
                      <div>
                        <span class="bi__card-meta-label">Empleabilidad</span>
                        <span class="bi__card-meta-val">{rk.it.empleabilidad}</span>
                      </div>
                    </div>

                    <p class="bi__card-section">Pasos siguientes</p>
                    <ul class="bi__card-list">
                      <li>
                        Habla con tu tutor/a y con orientación del centro para validar la vía.
                      </li>
                      <li>
                        Consulta la oferta concreta en{' '}
                        <a href={rk.it.enlace.url} target="_blank" rel="noopener noreferrer">
                          {rk.it.enlace.texto}
                        </a>
                        .
                      </li>
                      {r.ciudad.trim().length > 0 && (
                        <li>
                          Busca centros o universidades que ofrezcan esta vía en{' '}
                          <strong>{r.ciudad.trim()}</strong>.
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
                  que rindes mejor, tu estilo de estudio, duración deseada, tipo de trabajo que
                  te gusta y tu prioridad principal. Sumamos los pesos y mostramos los 4
                  itinerarios con mayor puntuación. Es una orientación, <em>no</em> una
                  predicción.
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
      <input
        type="radio"
        checked={props.checked}
        onChange={props.onChange}
      />
      <span>{props.label}</span>
    </label>
  );
}
