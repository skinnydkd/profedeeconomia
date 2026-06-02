/**
 * Single source of truth for the 5 games under /juegos/. Mirrors the metadata
 * approach of dinámicas: each game carries its curriculum map and competences,
 * so the hub and each game page can show the pedagogical justification.
 *
 * NOTE: «Jocs Econòmics» (the Olympiad quiz) is NOT here — it is its own section
 * under /jocs-economics/.
 *
 * `href` is the canonical entry point from the hub. Multiplayer games (Cajút,
 * Insider) are projector + phone: the teacher opens the /host/ page, so their
 * hub link points there, with `nota_aula` explaining the flow.
 */
import type { AsignaturaSlug } from './asignaturas';

export interface JuegoBridge {
  asignatura: AsignaturaSlug;
  unidad: number;
  nota?: string;
  competencias_especificas?: string[];
}

export interface Juego {
  slug: string;
  title: string;
  descripcion: string;
  tipo: 'simulador' | 'estrategia' | 'tablero' | 'party';
  nivel: ('eso' | 'bach' | 'fp')[];
  modo: string;
  estado: 'disponible' | 'proximamente';
  imprimible: boolean;
  /** Canonical entry URL from the hub (the /host/ page for multiplayer games). */
  href: string;
  /** Projector/phone flow note, shown on the hub card for multiplayer games. */
  nota_aula?: string;
  unidades_relacionadas: JuegoBridge[];
  competencias_clave: string[];
}

export const JUEGOS: Juego[] = [
  {
    slug: 'stonks',
    title: 'Stonks',
    descripcion:
      'Invierte durante 25 años repartiendo tu patrimonio entre distintos activos. ¿Acabarás con más que la IA?',
    tipo: 'simulador',
    nivel: ['bach', 'fp'],
    modo: '1 jugador',
    estado: 'disponible',
    imprimible: false,
    href: '/juegos/stonks/',
    unidades_relacionadas: [
      {
        asignatura: 'eco-1bach',
        unidad: 3,
        nota: 'Planificación financiera y carteras de inversión.',
        competencias_especificas: [],
      },
      {
        asignatura: 'eco-1bach',
        unidad: 10,
        nota: 'Sistema financiero, riesgo y rentabilidad.',
        competencias_especificas: [],
      },
    ],
    competencias_clave: ['STEM', 'CD', 'CPSAA', 'CE'],
  },
  {
    slug: 'econrisk',
    title: 'Econrisk',
    descripcion:
      'Juego de estrategia: conquista territorios con las grandes escuelas del pensamiento económico.',
    tipo: 'estrategia',
    nivel: ['bach'],
    modo: '1 jugador vs IA',
    estado: 'disponible',
    imprimible: true,
    href: '/juegos/econrisk/',
    unidades_relacionadas: [
      {
        asignatura: 'eco-1bach',
        unidad: 1,
        nota: 'La economía como ciencia social: escuelas de pensamiento.',
        competencias_especificas: [],
      },
    ],
    competencias_clave: ['CCL', 'CPSAA', 'CC', 'CE'],
  },
  {
    slug: 'econopoly',
    title: 'Econopoly',
    descripcion:
      'Monopoly económico hot-seat 1-6: monopolios, R+D, ciclos, Banco Central y fiscalidad progresiva.',
    tipo: 'tablero',
    nivel: ['eso', 'bach'],
    modo: '1-6 hot-seat',
    estado: 'disponible',
    imprimible: true,
    href: '/juegos/econopoly/',
    unidades_relacionadas: [
      {
        asignatura: 'eco-1bach',
        unidad: 4,
        nota: 'Mercado, precios y competencia.',
        competencias_especificas: [],
      },
      {
        asignatura: 'eco-1bach',
        unidad: 11,
        nota: 'Política fiscal y monetaria, Banco Central.',
        competencias_especificas: [],
      },
    ],
    competencias_clave: ['STEM', 'CPSAA', 'CC', 'CE'],
  },
  {
    slug: 'cajut',
    title: 'Cajút',
    descripcion:
      'Quiz de aula multijugador. El profe elige asignatura y unidades; los alumnos responden desde el móvil con un código de sala.',
    tipo: 'party',
    nivel: ['eso', 'bach'],
    modo: 'multijugador (party)',
    estado: 'disponible',
    imprimible: true,
    href: '/juegos/cajut/host/',
    nota_aula:
      'El profesor abre esta página en el proyector. Los alumnos entran en /juegos/cajut/ con el código de sala desde su móvil.',
    unidades_relacionadas: [
      {
        asignatura: 'taller-eco-3eso',
        unidad: 1,
        nota: 'Repaso de conceptos básicos de economía.',
        competencias_especificas: [],
      },
    ],
    competencias_clave: ['CCL', 'STEM', 'CPSAA', 'CE'],
  },
  {
    slug: 'insider',
    title: 'Insider',
    descripcion:
      'Deducción social: el grupo adivina una palabra; alguien sabe la respuesta… y nadie debe notarlo.',
    tipo: 'party',
    nivel: ['eso', 'bach', 'fp'],
    modo: 'multijugador (party)',
    estado: 'disponible',
    imprimible: true,
    href: '/juegos/insider/host/',
    nota_aula:
      'El profesor abre esta página en el proyector y ve un código de 4 letras. Los alumnos entran en /juegos/insider/ con ese código desde su móvil.',
    unidades_relacionadas: [
      {
        asignatura: 'taller-eco-3eso',
        unidad: 1,
        nota: 'Vocabulario económico básico, de forma lúdica.',
        competencias_especificas: [],
      },
    ],
    competencias_clave: ['CCL', 'CPSAA', 'CC'],
  },
];

export interface BrokenJuegoRef {
  slug: string;
  asignatura: string;
  unidad: number;
}

/** Return every game curriculum bridge that does not match an existing published unit. */
export function findBrokenJuegoRefs(
  games: { slug: string; unidades_relacionadas: { asignatura: string; unidad: number }[] }[],
  libroUnits: Set<string>,
): BrokenJuegoRef[] {
  const broken: BrokenJuegoRef[] = [];
  for (const g of games) {
    for (const u of g.unidades_relacionadas) {
      if (!libroUnits.has(`${u.asignatura}#${u.unidad}`)) {
        broken.push({ slug: g.slug, asignatura: u.asignatura, unidad: u.unidad });
      }
    }
  }
  return broken;
}
