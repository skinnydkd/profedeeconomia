/**
 * Post-4ESO itinerary data and matching logic for FOPP 4ESO (Unit 5).
 *
 * Pure module (no Preact): the dataset + a `recomendarItinerarios(perfil)`
 * function that scores every pathway against the student's profile and returns
 * the best matches, ranked, with short human-readable reasons.
 *
 * Data is grounded in the Spanish 2022 reform (LOMLOE — RD 217/2022 for ESO;
 * LOFP — Ley Orgánica 3/2022 de FP). It describes the *state-level* catalogue
 * of pathways available after passing (or leaving) 4º ESO. Regional offer
 * varies, so the CCAA filter never invents specific courses: it points the
 * student to the official regional catalogue (see CCAA below).
 */

/* -------------------------------------------------------------------------- */
/*  Profile axes                                                              */
/* -------------------------------------------------------------------------- */

export type Materia =
  | 'matematicas'
  | 'lengua'
  | 'ingles'
  | 'ciencias'
  | 'tecnologia'
  | 'artes'
  | 'edFisica'
  | 'sociales';

export type EstiloEstudio = 'teoria' | 'practico' | 'noSeguro';
export type Duracion = '1-2' | '3-4' | '5+' | 'daIgual';
export type GustaTrabajar =
  | 'personas'
  | 'datos'
  | 'maquinas'
  | 'ideas'
  | 'naturaleza'
  | 'manos';
export type Prioridad =
  | 'salario'
  | 'vocacion'
  | 'estabilidad'
  | 'flexibilidad'
  | 'ayudar';

/** Coarse family of each pathway. Used by tests and for grouping. */
export type TipoItinerario =
  | 'bachillerato'
  | 'fp-medio'
  | 'fp-basico'
  | 'artisticos-deportivos'
  | 'certificado'
  | 'laboral';

export interface Itinerario {
  id: string;
  titulo: string;
  tipo: TipoItinerario;
  duracion: string;
  /** What the pathway gives access to next (continuity). */
  salidas: string;
  /** Student profile that fits well (one sentence). */
  perfil: string;
  /** Example real occupations / next studies. */
  ocupaciones: string;
  empleabilidad: string;
  /** Suggested official next-step link. */
  enlace: { url: string; texto: string };
  /** Scoring weights per axis. Higher = stronger fit signal. */
  pesos: {
    materias?: Partial<Record<Materia, number>>;
    estilo?: Partial<Record<EstiloEstudio, number>>;
    duracion?: Partial<Record<Duracion, number>>;
    gusta?: Partial<Record<GustaTrabajar, number>>;
    prioridad?: Partial<Record<Prioridad, number>>;
  };
  /** Reasons surfaced when a high-weight axis matches. */
  razones: {
    materias?: Partial<Record<Materia, string>>;
    estilo?: Partial<Record<EstiloEstudio, string>>;
    duracion?: Partial<Record<Duracion, string>>;
    gusta?: Partial<Record<GustaTrabajar, string>>;
    prioridad?: Partial<Record<Prioridad, string>>;
  };
}

export interface PerfilAlumno {
  materias: Materia[];
  estilo: EstiloEstudio | null;
  duracion: Duracion | null;
  gusta: GustaTrabajar[];
  prioridad: Prioridad | null;
  /** Selected autonomous community, or null if none. */
  ccaa: CCAAId | null;
}

export interface ResultadoItinerario {
  itinerario: Itinerario;
  score: number;
  rango: number;
  razones: string[];
  /** Territorial note when a CCAA is selected, else null. */
  notaCCAA: string | null;
}

/* -------------------------------------------------------------------------- */
/*  CCAA catalogue (honest: official portals, no invented course lists)       */
/* -------------------------------------------------------------------------- */

export type CCAAId =
  | 'andalucia'
  | 'aragon'
  | 'asturias'
  | 'baleares'
  | 'canarias'
  | 'cantabria'
  | 'castillaLeon'
  | 'castillaMancha'
  | 'cataluna'
  | 'valenciana'
  | 'extremadura'
  | 'galicia'
  | 'madrid'
  | 'murcia'
  | 'navarra'
  | 'paisVasco'
  | 'rioja'
  | 'ceuta'
  | 'melilla';

export interface ComunidadAutonoma {
  id: CCAAId;
  nombre: string;
  /** Official regional education / FP catalogue. */
  portal: { url: string; texto: string };
}

/**
 * The 17 autonomous communities + Ceuta and Melilla. The `portal` is the
 * official site where the *real* current offer for that territory is published.
 * Ceuta and Melilla are managed by the Ministry of Education (TodoFP / sede).
 */
export const CCAA: readonly ComunidadAutonoma[] = [
  {
    id: 'andalucia',
    nombre: 'Andalucía',
    portal: { url: 'https://www.juntadeandalucia.es/educacion/', texto: 'Consejería de Educación de Andalucía' },
  },
  {
    id: 'aragon',
    nombre: 'Aragón',
    portal: { url: 'https://educa.aragon.es/', texto: 'Educaragón' },
  },
  {
    id: 'asturias',
    nombre: 'Asturias',
    portal: { url: 'https://www.educastur.es/', texto: 'Educastur' },
  },
  {
    id: 'baleares',
    nombre: 'Illes Balears',
    portal: { url: 'https://www.caib.es/govern/organigrama/area.do?coduo=36', texto: 'Conselleria d’Educació (CAIB)' },
  },
  {
    id: 'canarias',
    nombre: 'Canarias',
    portal: { url: 'https://www.gobiernodecanarias.org/educacion/', texto: 'Consejería de Educación de Canarias' },
  },
  {
    id: 'cantabria',
    nombre: 'Cantabria',
    portal: { url: 'https://www.educantabria.es/', texto: 'Educantabria' },
  },
  {
    id: 'castillaLeon',
    nombre: 'Castilla y León',
    portal: { url: 'https://www.educa.jcyl.es/', texto: 'Portal de Educación JCyL' },
  },
  {
    id: 'castillaMancha',
    nombre: 'Castilla-La Mancha',
    portal: { url: 'https://www.educa.jccm.es/', texto: 'Educación CLM' },
  },
  {
    id: 'cataluna',
    nombre: 'Cataluña',
    portal: { url: 'https://educacio.gencat.cat/', texto: 'Departament d’Educació (Gencat)' },
  },
  {
    id: 'valenciana',
    nombre: 'Comunitat Valenciana',
    portal: { url: 'https://ceice.gva.es/', texto: 'Conselleria d’Educació (GVA)' },
  },
  {
    id: 'extremadura',
    nombre: 'Extremadura',
    portal: { url: 'https://www.educarex.es/', texto: 'Educarex' },
  },
  {
    id: 'galicia',
    nombre: 'Galicia',
    portal: { url: 'https://www.edu.xunta.gal/fp/', texto: 'FP da Xunta de Galicia' },
  },
  {
    id: 'madrid',
    nombre: 'Comunidad de Madrid',
    portal: { url: 'https://www.comunidad.madrid/servicios/educacion', texto: 'Educación Comunidad de Madrid' },
  },
  {
    id: 'murcia',
    nombre: 'Región de Murcia',
    portal: { url: 'https://www.murciaeduca.es/', texto: 'Murciaeduca' },
  },
  {
    id: 'navarra',
    nombre: 'Navarra',
    portal: { url: 'https://www.educacion.navarra.es/', texto: 'Departamento de Educación de Navarra' },
  },
  {
    id: 'paisVasco',
    nombre: 'País Vasco',
    portal: { url: 'https://www.euskadi.eus/educacion/', texto: 'Departamento de Educación (Eusko Jaurlaritza)' },
  },
  {
    id: 'rioja',
    nombre: 'La Rioja',
    portal: { url: 'https://www.larioja.org/educacion/es', texto: 'Educación de La Rioja' },
  },
  {
    id: 'ceuta',
    nombre: 'Ceuta',
    portal: { url: 'https://www.todofp.es/', texto: 'TodoFP (Ministerio — gestión directa)' },
  },
  {
    id: 'melilla',
    nombre: 'Melilla',
    portal: { url: 'https://www.todofp.es/', texto: 'TodoFP (Ministerio — gestión directa)' },
  },
] as const;

const CCAA_BY_ID = new Map<CCAAId, ComunidadAutonoma>(CCAA.map((c) => [c.id, c]));

/* -------------------------------------------------------------------------- */
/*  Itinerary dataset (18 pathways)                                           */
/* -------------------------------------------------------------------------- */

const TODOFP = 'https://www.todofp.es/';
const UNIS = 'https://www.universidades.gob.es/';

export const ITINERARIOS: Itinerario[] = [
  /* --- Bachillerato (4 modalidades LOMLOE + vía General) --- */
  {
    id: 'bach-ciencias',
    titulo: 'Bachillerato de Ciencias y Tecnología',
    tipo: 'bachillerato',
    duracion: '2 años + grado universitario (4 años) o FP de Grado Superior',
    salidas: 'Grados de Ingeniería, Ciencias, Matemáticas, Sanidad (Medicina, Enfermería, Fisioterapia), Arquitectura; o FP Superior técnica.',
    perfil: 'Te gustan las matemáticas y las ciencias y aceptas un recorrido largo de estudio.',
    ocupaciones: 'Ingeniero/a, médico/a, enfermero/a, físico/a, programador/a, arquitecto/a.',
    empleabilidad: 'Muy alta en ingenierías, sanidad y tecnología; demanda sostenida.',
    enlace: { url: UNIS, texto: 'Buscar grados de ciencias e ingeniería' },
    pesos: {
      materias: { matematicas: 3, ciencias: 3, tecnologia: 2 },
      estilo: { teoria: 2, noSeguro: 1 },
      duracion: { '5+': 2, daIgual: 1 },
      gusta: { datos: 2, maquinas: 2, ideas: 1, naturaleza: 1 },
      prioridad: { salario: 2, estabilidad: 1 },
    },
    razones: {
      materias: {
        matematicas: 'Rendir en Matemáticas es la mejor señal para ciencias e ingeniería.',
        ciencias: 'Biología, Física o Química abren toda la rama científico-sanitaria.',
        tecnologia: 'Tu interés por Tecnología conecta con la base ingenieril.',
      },
      estilo: { teoria: 'Encaja con quien prefiere asentar teoría antes de aplicarla.' },
      duracion: { '5+': 'Aceptas un recorrido largo, lo que esta vía exige.' },
      gusta: {
        datos: 'Las disciplinas cuantitativas viven del análisis de datos.',
        maquinas: 'La ingeniería trabaja con máquinas, sistemas y procesos.',
      },
      prioridad: { salario: 'De media ofrece sueldos por encima de la media nacional.' },
    },
  },
  {
    id: 'bach-humanidades-ccss',
    titulo: 'Bachillerato de Humanidades y Ciencias Sociales',
    tipo: 'bachillerato',
    duracion: '2 años + grado universitario (4 años) o FP de Grado Superior',
    salidas: 'Grados de Derecho, ADE, Economía, Magisterio, Psicología, Historia, Periodismo, Traducción.',
    perfil: 'Te interesan las personas, la sociedad, los idiomas o el mundo de la empresa.',
    ocupaciones: 'Abogado/a, economista, docente, psicólogo/a, periodista, gestor/a.',
    empleabilidad: 'Media-alta; mejora mucho con idiomas, prácticas y especialización.',
    enlace: { url: UNIS, texto: 'Explorar grados sociales y humanísticos' },
    pesos: {
      materias: { sociales: 3, lengua: 3, ingles: 2, matematicas: 1 },
      estilo: { teoria: 2, noSeguro: 1 },
      duracion: { '5+': 1, '3-4': 2, daIgual: 1 },
      gusta: { personas: 2, ideas: 2, datos: 1 },
      prioridad: { vocacion: 1, estabilidad: 1, ayudar: 2, salario: 1 },
    },
    razones: {
      materias: {
        sociales: 'Geografía e Historia es el suelo común de Derecho, ADE o Magisterio.',
        lengua: 'Una base lingüística sólida es clave en estas carreras.',
        ingles: 'El inglés multiplica oportunidades en empresa y consultoría.',
      },
      gusta: {
        personas: 'Magisterio, Derecho o Psicología son profesiones de trato con personas.',
        ideas: 'Se trabaja con conceptos, normas y argumentos.',
      },
      prioridad: { ayudar: 'Magisterio y Psicología están orientadas a ayudar.' },
    },
  },
  {
    id: 'bach-artes',
    titulo: 'Bachillerato de Artes',
    tipo: 'bachillerato',
    duracion: '2 años + grado universitario o Enseñanzas Artísticas Superiores',
    salidas: 'Grados y Estudios Superiores de Bellas Artes, Diseño, Audiovisual, Música, Danza o Arte Dramático.',
    perfil: 'Rindes en Artes y disfrutas creando, diseñando o expresándote.',
    ocupaciones: 'Diseñador/a, ilustrador/a, realizador/a audiovisual, músico/a, artista.',
    empleabilidad: 'Variable: alta en diseño UX/UI y audiovisual, media en bellas artes.',
    enlace: { url: UNIS, texto: 'Explorar grados de arte y diseño' },
    pesos: {
      materias: { artes: 3, lengua: 1, tecnologia: 1 },
      estilo: { teoria: 1, noSeguro: 1 },
      duracion: { '5+': 1, '3-4': 2, daIgual: 1 },
      gusta: { ideas: 3, manos: 2, personas: 1 },
      prioridad: { vocacion: 3, flexibilidad: 2 },
    },
    razones: {
      materias: { artes: 'Rendir en Artes es la señal más directa para esta vía.' },
      gusta: {
        ideas: 'Vive de ideas, conceptos y procesos creativos.',
        manos: 'Trabajar con las manos encaja con bellas artes, escultura o cerámica.',
      },
      prioridad: {
        vocacion: 'Es una vía claramente vocacional; merece la pena si te llama.',
        flexibilidad: 'Mucho trabajo por proyectos y autónomo: gran flexibilidad.',
      },
    },
  },
  {
    id: 'bach-general',
    titulo: 'Bachillerato General',
    tipo: 'bachillerato',
    duracion: '2 años + grado universitario o FP de Grado Superior',
    salidas: 'Modalidad flexible que mantiene abiertas muchas ramas universitarias y de FP Superior.',
    perfil: 'Quieres ir a la universidad pero aún no tienes clara la rama; buscas flexibilidad.',
    ocupaciones: 'Mantiene abierto un abanico amplio antes de especializarte.',
    empleabilidad: 'Depende del grado posterior; la modalidad da margen para decidir.',
    enlace: { url: UNIS, texto: 'Cómo elegir grado universitario' },
    pesos: {
      materias: { lengua: 1, matematicas: 1, sociales: 1, ciencias: 1 },
      estilo: { teoria: 1, noSeguro: 3 },
      duracion: { '5+': 1, '3-4': 1, daIgual: 1 },
      gusta: { ideas: 1, personas: 1, datos: 1 },
      prioridad: { flexibilidad: 3, vocacion: 1 },
    },
    razones: {
      estilo: { noSeguro: 'Si aún no lo tienes claro, mantiene abiertas muchas puertas.' },
      prioridad: {
        flexibilidad: 'Es la modalidad pensada para no cerrarte ninguna rama todavía.',
      },
    },
  },

  /* --- FP de Grado Medio (varias familias profesionales LOFP) --- */
  {
    id: 'fpgm-sanidad',
    titulo: 'FP Grado Medio — Sanidad (Cuidados Auxiliares, Farmacia, Emergencias)',
    tipo: 'fp-medio',
    duracion: '2 cursos (2.000 h) con prácticas en empresa (FCT/dual)',
    salidas: 'Empleo cualificado y acceso a FP de Grado Superior sanitaria.',
    perfil: 'Te gustan las ciencias aplicadas y atender a personas, y quieres trabajar pronto.',
    ocupaciones: 'Aux. de enfermería, técnico/a en farmacia, técnico/a en emergencias sanitarias.',
    empleabilidad: 'Muy alta: hospitales, residencias, farmacias y servicios de emergencia.',
    enlace: { url: TODOFP, texto: 'Ver familia Sanidad en TodoFP' },
    pesos: {
      materias: { ciencias: 2, matematicas: 1 },
      estilo: { practico: 3, noSeguro: 1 },
      duracion: { '1-2': 3, daIgual: 1 },
      gusta: { personas: 3, manos: 1 },
      prioridad: { ayudar: 3, estabilidad: 2, vocacion: 1 },
    },
    razones: {
      estilo: { practico: 'Formación muy práctica y con prácticas reales en empresa.' },
      duracion: { '1-2': 'Te incorporas al mercado en 2 años con título oficial.' },
      gusta: { personas: 'Atención directa a pacientes y usuarios.' },
      prioridad: { ayudar: 'Es una profesión orientada al cuidado.' },
    },
  },
  {
    id: 'fpgm-informatica',
    titulo: 'FP Grado Medio — Informática (Sistemas Microinformáticos y Redes)',
    tipo: 'fp-medio',
    duracion: '2 cursos (2.000 h) con prácticas en empresa (FCT/dual)',
    salidas: 'Empleo IT y acceso a FP Superior (DAW, DAM, ASIR).',
    perfil: 'Te gusta la tecnología, montar equipos y resolver problemas prácticos.',
    ocupaciones: 'Técnico/a de soporte, instalador/a de redes, administrador/a de sistemas junior.',
    empleabilidad: 'Alta: soporte IT, infraestructura y administración de sistemas.',
    enlace: { url: TODOFP, texto: 'Ver familia Informática y Comunicaciones' },
    pesos: {
      materias: { tecnologia: 3, matematicas: 1, ingles: 1 },
      estilo: { practico: 3, noSeguro: 1 },
      duracion: { '1-2': 3, daIgual: 1 },
      gusta: { maquinas: 3, datos: 2, ideas: 1 },
      prioridad: { salario: 1, estabilidad: 2, flexibilidad: 1 },
    },
    razones: {
      materias: { tecnologia: 'Tu interés por Tecnología es el mejor indicador para esta vía.' },
      estilo: { practico: 'Muy práctico: montas, configuras y reparas equipos y redes.' },
      gusta: {
        maquinas: 'Trabajas con equipos, redes y dispositivos a diario.',
        datos: 'Buena base para pasar luego a DAW/DAM (Grado Superior).',
      },
      duracion: { '1-2': 'En 2 años puedes acceder a un primer empleo IT.' },
    },
  },
  {
    id: 'fpgm-administracion',
    titulo: 'FP Grado Medio — Gestión Administrativa',
    tipo: 'fp-medio',
    duracion: '2 cursos (2.000 h) con prácticas en empresa (FCT/dual)',
    salidas: 'Empleo administrativo y acceso a FP Superior (Administración y Finanzas).',
    perfil: 'Eres organizado/a, te manejas con números y documentos y buscas empleo estable.',
    ocupaciones: 'Auxiliar administrativo/a, gestor/a de oficina, atención al cliente.',
    empleabilidad: 'Media-alta: empleo administrativo transversal a casi todos los sectores.',
    enlace: { url: TODOFP, texto: 'Ver familia Administración y Gestión' },
    pesos: {
      materias: { lengua: 2, matematicas: 1, ingles: 1, sociales: 1 },
      estilo: { practico: 3, noSeguro: 2 },
      duracion: { '1-2': 3, daIgual: 1 },
      gusta: { datos: 2, personas: 1, ideas: 1 },
      prioridad: { estabilidad: 3, salario: 1 },
    },
    razones: {
      estilo: { practico: 'Formación práctica con prácticas en empresa real.' },
      duracion: { '1-2': 'En 2 años titulas y puedes incorporarte a una oficina.' },
      prioridad: { estabilidad: 'Da empleo estable en muchísimos sectores.' },
    },
  },
  {
    id: 'fpgm-electromecanica',
    titulo: 'FP Grado Medio — Electromecánica de Vehículos / Instalaciones Eléctricas',
    tipo: 'fp-medio',
    duracion: '2 cursos (2.000 h) con prácticas en empresa (FCT/dual)',
    salidas: 'Empleo técnico-industrial y acceso a FP Superior (Automoción, Mecatrónica).',
    perfil: 'Te gusta el trabajo manual técnico, los motores y las instalaciones.',
    ocupaciones: 'Mecánico/a de vehículos, electricista, electromecánico/a, instalador/a.',
    empleabilidad: 'Alta: talleres, mantenimiento industrial e instalaciones; mucha demanda.',
    enlace: { url: TODOFP, texto: 'Ver familias Transporte / Electricidad' },
    pesos: {
      materias: { tecnologia: 3, matematicas: 1, ciencias: 1 },
      estilo: { practico: 3 },
      duracion: { '1-2': 3, daIgual: 1 },
      gusta: { maquinas: 3, manos: 3 },
      prioridad: { estabilidad: 2, salario: 1, vocacion: 1 },
    },
    razones: {
      estilo: { practico: 'Aprendizaje en taller, muy práctico desde el primer día.' },
      gusta: {
        maquinas: 'Trabajas con motores, sistemas eléctricos y maquinaria.',
        manos: 'Es un oficio manual técnico muy demandado.',
      },
      duracion: { '1-2': 'En 2 años titulas con un oficio con salida real.' },
    },
  },
  {
    id: 'fpgm-hosteleria',
    titulo: 'FP Grado Medio — Hostelería y Turismo (Cocina, Servicios)',
    tipo: 'fp-medio',
    duracion: '2 cursos (2.000 h) con prácticas en empresa (FCT/dual)',
    salidas: 'Empleo en hostelería y acceso a FP Superior (Dirección de Cocina, Guía).',
    perfil: 'Disfrutas del trabajo en equipo, el trato con clientes y el oficio práctico.',
    ocupaciones: 'Cocinero/a, camarero/a profesional, jefe/a de partida, recepcionista.',
    empleabilidad: 'Alta y muy estacional; gran peso del turismo en España.',
    enlace: { url: TODOFP, texto: 'Ver familia Hostelería y Turismo' },
    pesos: {
      materias: { lengua: 1, ingles: 2, artes: 1 },
      estilo: { practico: 3 },
      duracion: { '1-2': 3, daIgual: 1 },
      gusta: { personas: 2, manos: 2, ideas: 1 },
      prioridad: { flexibilidad: 2, vocacion: 2, salario: 1 },
    },
    razones: {
      estilo: { practico: 'Oficio práctico que se aprende haciendo, en cocina o sala.' },
      gusta: {
        personas: 'Trato constante con clientes y trabajo en equipo.',
        manos: 'La cocina y el servicio son oficios manuales y creativos.',
      },
      duracion: { '1-2': 'En 2 años tienes un oficio con empleo en toda España.' },
    },
  },
  {
    id: 'fpgm-dependencia',
    titulo: 'FP Grado Medio — Atención a Personas en Situación de Dependencia',
    tipo: 'fp-medio',
    duracion: '2 cursos (2.000 h) con prácticas en empresa (FCT/dual)',
    salidas: 'Empleo socio-sanitario y acceso a FP Superior (Integración Social, TASOC).',
    perfil: 'Quieres cuidar y acompañar a personas mayores o con discapacidad.',
    ocupaciones: 'Auxiliar de ayuda a domicilio, cuidador/a en residencias y centros de día.',
    empleabilidad: 'Alta y creciente por el envejecimiento de la población.',
    enlace: { url: TODOFP, texto: 'Ver familia Servicios Socioculturales' },
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
        ayudar: 'Es de las profesiones más claramente orientadas al cuidado.',
        vocacion: 'Exige vocación; el día a día es duro pero significativo.',
      },
      estilo: { practico: 'Formación muy práctica desde el primer curso.' },
    },
  },
  {
    id: 'fpgm-agraria',
    titulo: 'FP Grado Medio — Agraria / Forestal y Medio Natural',
    tipo: 'fp-medio',
    duracion: '2 cursos (2.000 h) con prácticas en empresa (FCT/dual)',
    salidas: 'Empleo en el sector primario y acceso a FP Superior (Paisajismo, Ganadería).',
    perfil: 'Te gusta el trabajo al aire libre, los animales, las plantas o el medio natural.',
    ocupaciones: 'Operario/a agrícola o ganadero/a, jardinero/a, agente forestal de apoyo.',
    empleabilidad: 'Media-alta en zonas rurales; clave en transición ecológica.',
    enlace: { url: TODOFP, texto: 'Ver familias Agraria / Marítimo-pesquera' },
    pesos: {
      materias: { ciencias: 2, tecnologia: 1, edFisica: 1 },
      estilo: { practico: 3 },
      duracion: { '1-2': 3, daIgual: 1 },
      gusta: { naturaleza: 3, manos: 2, maquinas: 1 },
      prioridad: { vocacion: 2, flexibilidad: 1, estabilidad: 1 },
    },
    razones: {
      gusta: {
        naturaleza: 'Trabajo con animales, plantas o el medio natural.',
        manos: 'Oficio al aire libre, muy manual.',
      },
      estilo: { practico: 'Se aprende en el campo, la granja o el vivero.' },
    },
  },

  /* --- FP de Grado Básico (LOFP, antes FP Básica) --- */
  {
    id: 'fpgb',
    titulo: 'FP de Grado Básico',
    tipo: 'fp-basico',
    duracion: '2 cursos; permite obtener el título de la ESO',
    salidas: 'Título profesional básico + título de ESO, con acceso a FP de Grado Medio.',
    perfil: 'Buscas una vía muy práctica para titular y aprender un oficio si la ESO se te resiste.',
    ocupaciones: 'Ayudante en peluquería, cocina, electricidad, informática, jardinería, comercio.',
    empleabilidad: 'Da una primera cualificación y, sobre todo, abre la puerta a FP de Grado Medio.',
    enlace: { url: TODOFP, texto: 'Ver Grado Básico en TodoFP' },
    pesos: {
      materias: { tecnologia: 1, artes: 1 },
      estilo: { practico: 3, noSeguro: 2 },
      duracion: { '1-2': 2, daIgual: 1 },
      gusta: { manos: 3, maquinas: 1, personas: 1 },
      prioridad: { estabilidad: 1, vocacion: 1 },
    },
    razones: {
      estilo: {
        practico: 'Es la vía más práctica y manual del sistema, ideal para aprender un oficio.',
        noSeguro: 'Permite titular en ESO mientras descubres un oficio.',
      },
      gusta: { manos: 'Aprendizaje muy manual y aplicado.' },
    },
  },

  /* --- Enseñanzas artísticas y deportivas de régimen especial --- */
  {
    id: 'artes-plasticas-medio',
    titulo: 'Ciclo de Artes Plásticas y Diseño (Grado Medio)',
    tipo: 'artisticos-deportivos',
    duracion: '2 cursos; enseñanza de régimen especial en Escuelas de Arte',
    salidas: 'Empleo artesanal-creativo y acceso a Grado Superior de Artes Plásticas y Diseño.',
    perfil: 'Te apasiona crear con las manos: cerámica, joyería, ilustración, artesanía.',
    ocupaciones: 'Ceramista, joyero/a, ilustrador/a, artesano/a, técnico/a de artes aplicadas.',
    empleabilidad: 'Variable; muy ligada al trabajo por encargo, taller propio y mercado creativo.',
    enlace: { url: TODOFP, texto: 'Ver enseñanzas de Artes Plásticas y Diseño' },
    pesos: {
      materias: { artes: 3 },
      estilo: { practico: 2, noSeguro: 1 },
      duracion: { '1-2': 2, daIgual: 1 },
      gusta: { manos: 3, ideas: 2 },
      prioridad: { vocacion: 3, flexibilidad: 2 },
    },
    razones: {
      materias: { artes: 'Tu interés por las Artes es la señal directa para esta vía.' },
      gusta: {
        manos: 'Es un oficio creativo profundamente manual.',
        ideas: 'Une creatividad y técnica artesanal.',
      },
      prioridad: { vocacion: 'Claramente vocacional; ideal si te llama el oficio artístico.' },
    },
  },
  {
    id: 'ensenanzas-deportivas',
    titulo: 'Enseñanzas Deportivas (Grado Medio — técnico/a deportivo/a)',
    tipo: 'artisticos-deportivos',
    duracion: '1-2 cursos según la modalidad deportiva',
    salidas: 'Titulación oficial para entrenar e instruir, con acceso a Grado Superior deportivo.',
    perfil: 'Te gusta el deporte y enseñar o entrenar a otras personas.',
    ocupaciones: 'Monitor/a o entrenador/a deportivo/a, técnico/a de un deporte (fútbol, esquí…).',
    empleabilidad: 'Media; clubes, escuelas deportivas, turismo activo y ocio.',
    enlace: { url: TODOFP, texto: 'Ver Enseñanzas Deportivas' },
    pesos: {
      materias: { edFisica: 3, ciencias: 1 },
      estilo: { practico: 2 },
      duracion: { '1-2': 2, daIgual: 1 },
      gusta: { personas: 2, manos: 1 },
      prioridad: { vocacion: 2, flexibilidad: 1, ayudar: 1 },
    },
    razones: {
      materias: { edFisica: 'Tu interés por la Educación Física encaja de lleno aquí.' },
      gusta: { personas: 'Entrenas, enseñas y motivas a deportistas.' },
      prioridad: { vocacion: 'Para quien vive el deporte y quiere transmitirlo.' },
    },
  },

  /* --- Certificados de profesionalidad (formación para el empleo) --- */
  {
    id: 'certificado-profesionalidad',
    titulo: 'Certificado de Profesionalidad (formación para el empleo)',
    tipo: 'certificado',
    duracion: 'Variable (semanas/meses), por niveles 1, 2 y 3; cursos cortos',
    salidas: 'Acredita una cualificación profesional concreta para acceder a un puesto.',
    perfil: 'Quieres una cualificación oficial rápida y muy enfocada a un empleo concreto.',
    ocupaciones: 'Múltiples: atención sociosanitaria, hostelería, comercio, informática básica…',
    empleabilidad: 'Buena para cubrir un puesto concreto; muy ligado a la demanda local.',
    enlace: {
      url: 'https://www.sepe.es/HomeSepe/Personas/formacion/certificados-profesionalidad.html',
      texto: 'Certificados de profesionalidad (SEPE)',
    },
    pesos: {
      estilo: { practico: 3, noSeguro: 1 },
      duracion: { '1-2': 3 },
      gusta: { manos: 1, personas: 1, datos: 1 },
      prioridad: { estabilidad: 1, salario: 1 },
    },
    razones: {
      estilo: { practico: 'Formación corta, práctica y dirigida a un empleo concreto.' },
      duracion: { '1-2': 'La vía más rápida para acreditar una cualificación.' },
    },
  },

  /* --- Bachillerato a distancia / nocturno (continuar estudiando trabajando) --- */
  {
    id: 'bach-distancia',
    titulo: 'Bachillerato a distancia o nocturno',
    tipo: 'bachillerato',
    duracion: '2-3 años, compatible con trabajo u otras responsabilidades',
    salidas: 'Mismo título de Bachillerato: acceso a universidad y FP Superior.',
    perfil: 'Quieres el Bachillerato pero necesitas estudiar a tu ritmo o compaginarlo.',
    ocupaciones: 'Continúa estudios universitarios o de FP Superior con más flexibilidad.',
    empleabilidad: 'La del Bachillerato, con la ventaja de poder compaginarlo con un empleo.',
    enlace: { url: UNIS, texto: 'Cómo continuar tras el Bachillerato' },
    pesos: {
      materias: { lengua: 1, sociales: 1, ciencias: 1, matematicas: 1 },
      estilo: { teoria: 1, noSeguro: 1 },
      duracion: { '3-4': 2, '5+': 1, daIgual: 1 },
      gusta: { ideas: 1, datos: 1 },
      prioridad: { flexibilidad: 3, estabilidad: 1 },
    },
    razones: {
      prioridad: {
        flexibilidad: 'Te permite cursar el Bachillerato a tu ritmo o trabajando.',
      },
      duracion: { '3-4': 'Puedes repartir los cursos en más tiempo si lo necesitas.' },
    },
  },

  /* --- Mercado laboral directo --- */
  {
    id: 'mercado-laboral',
    titulo: 'Incorporación al mercado laboral',
    tipo: 'laboral',
    duracion: 'Inmediata; con formación posterior recomendable para mejorar',
    salidas: 'Empleo desde ya; conviene formarte en paralelo (certificados, FP a distancia).',
    perfil: 'Necesitas o prefieres trabajar ya, manteniendo abierta la formación futura.',
    ocupaciones: 'Empleos de entrada en comercio, hostelería, logística, atención al cliente.',
    empleabilidad: 'Acceso rápido a empleos de entrada; la cualificación mejora el recorrido.',
    enlace: {
      url: 'https://www.sepe.es/',
      texto: 'Servicio Público de Empleo (SEPE)',
    },
    pesos: {
      estilo: { practico: 2 },
      duracion: { '1-2': 3 },
      gusta: { personas: 1, manos: 1 },
      prioridad: { salario: 2, flexibilidad: 1 },
    },
    razones: {
      duracion: { '1-2': 'Es la vía más inmediata para empezar a trabajar.' },
      prioridad: { salario: 'Generas ingresos ya, aunque conviene formarte en paralelo.' },
    },
  },
];

/* -------------------------------------------------------------------------- */
/*  Matching                                                                   */
/* -------------------------------------------------------------------------- */

const REASON_WEIGHT_THRESHOLD = 2;
const MAX_REASONS = 3;
const DEFAULT_LIMIT = 4;

export interface RecomendarOpciones {
  /** Max number of itineraries to return (default 4). */
  limite?: number;
}

/**
 * Score every itinerary against the profile (sum of matched axis weights) and
 * return them ranked, highest first. Always returns at least one result: with
 * an empty profile every score is 0, so we fall back to the dataset order so
 * the student still sees options. The CCAA filter never removes itineraries; it
 * only attaches an honest territorial note pointing to the official catalogue.
 */
export function recomendarItinerarios(
  perfil: PerfilAlumno,
  opciones: RecomendarOpciones = {}
): ResultadoItinerario[] {
  const limite = opciones.limite ?? DEFAULT_LIMIT;
  const comunidad = perfil.ccaa ? CCAA_BY_ID.get(perfil.ccaa) ?? null : null;

  const scored = ITINERARIOS.map((it, index) => {
    let score = 0;
    const razones: string[] = [];

    const acc = <K extends string>(
      key: K | null,
      pesos: Partial<Record<K, number>> | undefined,
      razonesMap: Partial<Record<K, string>> | undefined
    ) => {
      if (!key) return;
      const w = pesos?.[key] ?? 0;
      score += w;
      if (w >= REASON_WEIGHT_THRESHOLD && razonesMap?.[key]) {
        razones.push(razonesMap[key]!);
      }
    };

    for (const m of perfil.materias) acc(m, it.pesos.materias, it.razones.materias);
    acc(perfil.estilo, it.pesos.estilo, it.razones.estilo);
    acc(perfil.duracion, it.pesos.duracion, it.razones.duracion);
    for (const g of perfil.gusta) acc(g, it.pesos.gusta, it.razones.gusta);
    acc(perfil.prioridad, it.pesos.prioridad, it.razones.prioridad);

    return { itinerario: it, score, razones: razones.slice(0, MAX_REASONS), index };
  });

  // Sort by score desc; ties keep dataset order (stable via original index).
  scored.sort((a, b) => b.score - a.score || a.index - b.index);

  return scored.slice(0, Math.max(1, limite)).map((s, i) => ({
    itinerario: s.itinerario,
    score: s.score,
    rango: i + 1,
    razones: s.razones,
    notaCCAA: comunidad ? buildNotaCCAA(comunidad) : null,
  }));
}

/**
 * Honest territorial note: we do not claim a specific course exists in the
 * region. We tell the student where the *real* current offer is published.
 */
function buildNotaCCAA(c: ComunidadAutonoma): string {
  return `La oferta concreta de esta vía en ${c.nombre} varía cada curso. Consulta el catálogo oficial actualizado en ${c.portal.texto} (${c.portal.url}).`;
}
