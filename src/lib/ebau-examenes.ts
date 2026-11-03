// src/lib/ebau-examenes.ts
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

export interface Ccaa {
  slug: string;
  label: string;
  /** Local name of the exam (PAU, PEvAU, EvAU, EBAU…), from the official source. */
  prueba: string;
  /** Local name of the subject, from the official source. */
  materia: string;
  /** 1–3 sentences on the exam structure, paraphrased from the official orientaciones; null when no official source states it. */
  estructura: string | null;
  fuente: { url: string; titulo: string; consultado: string };
}

/** Comunitat Valenciana first (Pau's region); the rest alphabetical by label. */
export const CCAA_LIST: Ccaa[] = [
  {
    slug: 'comunidad-valenciana',
    label: 'Comunitat Valenciana',
    prueba: 'PAU',
    materia: 'Empresa y Diseño de Modelos de Negocio',
    estructura: 'Dos partes. Parte I (6 puntos): seis cuestiones de los bloques 1-4; dos competenciales sin optatividad y cuatro con elección entre dos propuestas del mismo bloque. Parte II (4 puntos): dos ejercicios competenciales del bloque 3, uno sin opción y otro con elección entre dos propuestas.',
    fuente: { url: 'https://www.uv.es/econdocs/cooperacio_secundaria/PAU-26/REUNI%c3%93N%20CON%20PROFESORADO%202%c2%ba%20BACH_EMDI_PRESENTACI%c3%93N.pdf', titulo: 'Reunión con profesorado 2º BACH EMDI, presentación PAU 2026 (Universitat de València, comisión de materia, curso 2025/2026)', consultado: '2026-10-27' },
  },
  {
    slug: 'andalucia',
    label: 'Andalucía',
    prueba: 'PAU',
    materia: 'Empresa y Diseño de Modelos de Negocio',
    estructura: 'Primera parte: dos problemas sin optatividad (bloque C y bloque E), 2 puntos cada uno. Segunda parte: seis preguntas competenciales de 1 punto sobre teoría (una de dos en A, B, D y E; dos de tres en C). Duración máxima 1h30.',
    fuente: { url: 'https://www.juntadeandalucia.es/economiaconocimientoempresasyuniversidad/sguit/examanes_anios_anteriores/selectividad/sel_2025-2026-Orientaciones_empresa_diseno.pdf', titulo: 'Directrices y Orientaciones: Empresa y Diseño de Modelos de Negocio (2025-26), Junta de Andalucía / Distrito Único Andaluz', consultado: '2026-10-27' },
  },
  {
    slug: 'aragon',
    label: 'Aragón',
    prueba: 'PAU',
    materia: 'Empresa y Diseño de Modelos de Negocio',
    estructura: 'Dos partes, 90 minutos. Parte práctica o teórico-práctica (7 puntos): dos cuestiones de 3-4 puntos cada una, con apartados. Parte teórica (3 puntos): un texto con 6 cuestiones de las que se contestan 3, a 1 punto cada una. Se permite calculadora.',
    fuente: { url: 'https://academico.unizar.es/sites/academico/files/archivos/acceso/accescomis/reuni/20251103estru.pdf', titulo: 'Acuerdo de 3 de noviembre de 2025 de la Comisión Organizadora de la PAU: estructura básica y criterios generales de calificación, curso 2025-2026 (Universidad de Zaragoza)', consultado: '2026-10-27' },
  },
  {
    slug: 'asturias',
    label: 'Asturias',
    prueba: 'PAU',
    materia: 'Empresa y Diseño de Modelos de Negocio',
    estructura: 'Modelo único de 90 minutos con cinco preguntas (cada una con opción A o B). El alumnado responde a cuatro de las cinco, eligiendo una opción en cada una; cada pregunta vale 2,5 puntos.',
    fuente: { url: 'https://www.uniovi.es/documents/39158/38a0efa9-7b52-0e89-7336-4653ba795690', titulo: 'Información sobre la PAU curso 2025/2026: Empresa y Diseño de Modelos de Negocio (Universidad de Oviedo)', consultado: '2026-10-27' },
  },
  {
    slug: 'cantabria',
    label: 'Cantabria',
    prueba: 'PAU',
    materia: 'Empresa y Diseño de Modelos de Negocio',
    estructura: 'Cuatro apartados de respuesta obligatoria: los apartados 1 y 3 valen 2 puntos y los apartados 2 y 4 valen 3 puntos. El apartado 2 no tiene opcionalidad; en los otros tres hay elección entre subapartados u opciones.',
    fuente: { url: 'https://web.unican.es/consejo-direccion/vcestudiantes/DocumentosEBAU/Examenes/Empresa%20y%20Dise%C3%B1o%20de%20Modelos%20de%20Negocio_julio_2026.pdf', titulo: 'PAU Prueba Extraordinaria Julio 2026, Empresa y Diseño de Modelos de Negocio (Universidad de Cantabria)', consultado: '2026-10-27' },
  },
  {
    slug: 'castilla-la-mancha',
    label: 'Castilla-La Mancha',
    prueba: 'PAU',
    materia: 'Empresa y Diseño de Modelos de Negocio',
    estructura: 'Modelo único, 1h30. Primer apartado (4 puntos): dos preguntas de 2 puntos (bloque 1; bloques 3 y 4) con texto introductorio, con elección de un tema y de una pregunta corta. Segundo apartado (6 puntos): dos problemas obligatorios de 3 puntos, con una pregunta corta a elegir entre dos.',
    fuente: { url: 'https://www.uclm.es/-/media/Files/A04-Gestion-Academica/PDFEstudiantes/PDFEvAU/ReunionesMateria2526/InformacionMaterias/Empresa-Informacion.ashx?la=es', titulo: 'Directrices y orientaciones generales para la PAU: Empresa y Diseño de Modelos de Negocio, curso 2025/2026 (UCLM)', consultado: '2026-10-27' },
  },
  {
    slug: 'castilla-y-leon',
    label: 'Castilla y León',
    prueba: 'PAU',
    materia: 'Empresa y Diseño de Modelos de Negocio',
    estructura: 'Test (3 puntos): 8 de 12 preguntas, el error resta 0,5. Problemas (4): dos, cada uno a elegir entre A y B, 2 puntos cada uno. Definiciones (1): 4 de 6. Pregunta teórica (1): 1 de 2. Lectura económica comprensiva (1).',
    fuente: { url: 'https://usal.es/files/acceso/empesa_pau_julio_2026.pdf', titulo: 'Examen PAU extraordinaria julio 2026, Empresa y Diseño de Modelos de Negocio (Universidad de Salamanca, Castilla y León)', consultado: '2026-10-27' },
  },
  {
    slug: 'cataluna',
    label: 'Cataluña',
    prueba: 'PAU',
    materia: "Funcionament de l'empresa i disseny de models de negoci",
    estructura: 'Cuatro ejercicios obligatorios de 2,5 puntos cada uno. En el apartado 2.3 (dentro del ejercicio 2) se elige una de dos opciones (A o B). El ejercicio 4 es de tipo test: cada acierto suma 0,25 y cada error resta 0,08.',
    fuente: { url: 'https://universitats.gencat.cat/web/.content/06_pau/examens-correccions/2026/funcionament-empresa/ord/pau_femp26jl.pdf', titulo: "Proves d'accés a la universitat 2026, Funcionament de l'empresa i disseny de models de negoci, Sèrie 1 (Generalitat de Catalunya, Universitats)", consultado: '2026-10-27' },
  },
  {
    slug: 'extremadura',
    label: 'Extremadura',
    prueba: 'PAU',
    materia: 'Empresa y Diseño de Modelos de Negocio',
    estructura: 'Parte teórica: 6 preguntas de 1 punto, de las que se eligen 5 (al menos una por bloque). Parte práctica: 3 problemas de 2,5 puntos, de los que se eligen 2. Total 10 puntos.',
    fuente: { url: 'https://vrestudiantes.unex.es/wp-content/uploads/sites/23/2025/10/2025_26_Empresa_Orientaciones.pdf', titulo: 'Características de la PAU 2026, Empresa y Diseño de Modelos de Negocio (Universidad de Extremadura)', consultado: '2026-10-27' },
  },
  {
    slug: 'galicia',
    label: 'Galicia',
    prueba: 'PAU',
    materia: 'Empresa y Diseño de Modelos de Negocio',
    estructura: 'Cuatro preguntas obligatorias de 2,5 puntos. La 1 (valoración de existencias/ejercicio práctico) sin opciones; las otras tres con elección entre subapartados (1 punto fijo y 1,5 con elección). La 3 y la 4 parten de un texto. Duración 90 minutos.',
    fuente: { url: 'https://ciug.gal/PDF/2026/Grupos_Traballo/31_empresa_modelo_26_cast.pdf', titulo: 'PAU Convocatoria ordinaria 2026, Empresa y Diseño de Modelos de Negocio, código 31 (CiUG)', consultado: '2026-10-27' },
  },
  {
    slug: 'islas-baleares',
    label: 'Islas Baleares',
    prueba: 'PAU',
    materia: 'Empresa y Diseño de Modelos de Negocio',
    estructura: null,
    fuente: { url: 'https://estudis.uib.cat/estudis-de-grau/Com-hi-pots-accedir/acces/batxiller/materies/economia/', titulo: 'Empresa i Disseny de Models de Negoci, Estudis de la UIB (materias PAU)', consultado: '2026-10-27' },
  },
  {
    slug: 'islas-canarias',
    label: 'Islas Canarias',
    prueba: 'PAU',
    materia: 'Empresa y Diseño de Modelos de Negocio',
    estructura: 'Cinco preguntas: una obligatoria del bloque I (1,5), una a elegir entre dos del bloque I (1,5), una a elegir entre dos del bloque II (2) y dos ejercicios obligatorios del bloque III (2,5 cada uno). No se penaliza la ortografía.',
    fuente: { url: 'https://feet.ulpgc.es/wp-content/uploads/202510_estructura-y-contenidos-prueba-empresa-y-diseno-de-negocio-pau-26.pdf', titulo: 'PAU 2026 Empresa y Diseño de Modelos de Negocio: estructura de la prueba, contenidos y criterios (ULPGC, subcomisión de materia)', consultado: '2026-10-27' },
  },
  {
    slug: 'la-rioja',
    label: 'La Rioja',
    prueba: 'PAU',
    materia: 'Empresa y Diseño de Modelos de Negocio',
    estructura: null,
    fuente: { url: 'https://www.unirioja.es/administracion-y-servicios/oficina-de-estudiantes/pau/examenes-y-criterios/', titulo: 'Exámenes y criterios PAU 2026, Universidad de La Rioja (enlaza guía, estructura/criterios y exámenes de junio y julio 2026 en SharePoint)', consultado: '2026-10-27' },
  },
  {
    slug: 'madrid',
    label: 'Comunidad de Madrid',
    prueba: 'PAU',
    materia: 'Empresa y Diseño de Modelos de Negocio',
    estructura: 'Cuatro preguntas, 90 minutos. Preguntas 1 y 3 (2 puntos): primer apartado de 1 punto y un segundo apartado de 1 punto a elegir entre dos. Preguntas 2 y 4 (3 puntos): dos apartados fijos (1,5 en total) y un tercero de 1,5 a elegir entre dos.',
    fuente: { url: 'https://www.uc3m.es/pruebasacceso/media/pruebasacceso/doc/archivo/doc_empresa-26/criterios_empresa-y-modelos-de-negocio.pdf', titulo: 'Instrucciones generales y calificación, PAU curso 2025-2026, Empresa y Diseño de Modelos de Negocio (Universidades Públicas de la Comunidad de Madrid, publicado por UC3M)', consultado: '2026-10-27' },
  },
  {
    slug: 'murcia',
    label: 'Región de Murcia',
    prueba: 'PAU',
    materia: 'Empresa y Diseño de Modelos de Negocio',
    estructura: 'Dos bloques. Primero (6 puntos): 8 cuestiones cortas teórico-prácticas sobre una situación empresarial, se responden 6 a 1 punto. Segundo (4 puntos): dos problemas de 2 puntos (1,5 obligatorios y 0,5 a elegir entre dos cuestiones).',
    fuente: { url: 'https://www.um.es/documents/d/estudios/pau2026-315-empresa-orientaciones-pdf', titulo: 'PAU2026 Murcia, septiembre 2025: Empresa y Diseño de Modelos de Negocio, orientaciones (Universidad de Murcia)', consultado: '2026-10-27' },
  },
  {
    slug: 'navarra',
    label: 'Navarra',
    prueba: 'PAU',
    materia: 'Empresa y Diseño de Modelos de Negocio',
    estructura: null,
    fuente: { url: 'https://www2.unavarra.es/gesadj/Estudios/acceso_matricula/PAU/2026/ComisionOrganizadora/bilingue-Behin-betikoa-Acuerdo-Correccion-17032026.pdf', titulo: 'Acuerdo de instrucciones y criterios generales de corrección 2025-2026 (Universidad Pública de Navarra)', consultado: '2026-10-27' },
  },
  {
    slug: 'pais-vasco',
    label: 'País Vasco',
    prueba: 'PAU',
    materia: 'Empresa y Diseño de Modelos de Negocio',
    estructura: 'Cuatro preguntas: la 1 vale 4 puntos y la 2 vale 2 puntos, ambas obligatorias; la 3 (2 puntos) y la 4 (2 puntos) se contestan eligiendo la opción A o la B.',
    fuente: { url: 'https://www.ehu.eus/documents/d/unibertsitaterako-sarbidea/empresa-diseno-modelos-negocio-examen-ord-2026', titulo: 'Prueba de Acceso a la Universidad, convocatoria ordinaria 2026, Empresa y Diseño de Modelos de Negocio (UPV/EHU)', consultado: '2026-10-27' },
  },
];

export const ANIOS = [2026, 2025, 2024] as const;

export const CONVOCATORIAS = [
  { slug: 'junio', label: 'Junio (ordinaria)' },
  { slug: 'julio', label: 'Julio (extraordinaria)' },
] as const;

export type Tipo = 'examen' | 'solucion';

/** Path relative to public/ (no leading slash). Uniform filename across CCAA. */
export function ebauPdfRelPath(ccaa: string, anio: number, conv: string, tipo: Tipo): string {
  return `ebau-examenes/${ccaa}/empresa-${anio}-${conv}-${tipo}.pdf`;
}

/** Public URL (leading slash). */
export function ebauPdfHref(ccaa: string, anio: number, conv: string, tipo: Tipo): string {
  return `/${ebauPdfRelPath(ccaa, anio, conv, tipo)}`;
}

export interface Fila {
  anio: number;
  convLabel: string;
  examen: string | null;
  solucion: string | null;
}

const enPublic = (rel: string) => existsSync(resolve(process.cwd(), 'public', rel));

/** One row per año and convocatoria, newest first; a PDF is linked only if the file exists. */
export function filasCcaa(ccaa: string, exists: (rel: string) => boolean = enPublic): Fila[] {
  return ANIOS.flatMap((anio) =>
    CONVOCATORIAS.map((conv) => {
      const href = (tipo: Tipo) =>
        exists(ebauPdfRelPath(ccaa, anio, conv.slug, tipo)) ? ebauPdfHref(ccaa, anio, conv.slug, tipo) : null;
      return { anio, convLabel: conv.label, examen: href('examen'), solucion: href('solucion') };
    }),
  );
}

/** Below two exams a comunidad page is too thin to index. */
export const esIndexable = (filas: Fila[]) => filas.filter((f) => f.examen).length >= 2;

const RANGO = `${Math.min(...ANIOS)}–${Math.max(...ANIOS)}`;

/** Search title: "PAU" is what people type, whatever the local name of the exam. */
export function ccaaSeoTitle(c: Ccaa): string {
  const largo = `Exámenes PAU Empresa ${c.label}: ${RANGO} con soluciones`;
  return largo.length <= 60 ? largo : `Exámenes PAU Empresa ${c.label} (${RANGO})`;
}
