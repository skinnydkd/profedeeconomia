import { type Asignatura, type AsignaturaSlug } from '@/lib/asignaturas';
import { type Locale } from './locale';

type CAOverlay = Partial<Pick<Asignatura, 'level' | 'title' | 'tagline' | 'modalidad' | 'marcoNormativo'>>;

// Valencian (AVL) overlay for the user-facing asignatura strings. Structural
// fields (slug, color, etapa, curso, num, estado, shortLabel) stay in the ES
// source of truth. Taglines authored for Pau's review (glossary-consistent).
export const ASIGNATURAS_CA: Partial<Record<AsignaturaSlug, CAOverlay>> = {
  'edmn-2bach': {
    level: '2n Batxillerat',
    title: 'Empresa i Disseny de Models de Negoci',
    tagline:
      'Dotze unitats al voltant del Business Model Canvas, les àrees funcionals i un projecte capstone de pla d\'empresa que recorre tot el curs.',
    modalidad: 'Modalitat Humanitats i CC. Socials',
    marcoNormativo: 'Reial Decret 243/2022',
  },
  'eco-1bach': {
    level: '1r Batxillerat',
    title: 'Economia',
    tagline:
      'Microeconomia, macroeconomia, sistemes i introducció a les finances. Amb simulador AD-AS i la teoria de la decisió, que quasi sempre se\'ns queda fora del temari.',
    modalidad: 'Modalitat Humanitats i CC. Socials',
    marcoNormativo: 'Reial Decret 243/2022',
  },
  'eco-4eso': {
    level: '4t ESO',
    title: 'Economia i Emprenedoria',
    tagline:
      'Economia bàsica amb la mirada posada en el que l\'alumnat es trobarà fora: nòmina, IRPF, contractes, decisions de consum.',
    marcoNormativo: 'Reial Decret 217/2022',
  },
  'fopp-4eso': {
    level: '4t ESO',
    title: 'Formació i Orientació Personal i Professional',
    tagline:
      'Itineraris, drets laborals i orientació. L\'assignatura nova de la LOMLOE, sense material decent disponible. Fins ara.',
    marcoNormativo: 'Reial Decret 217/2022',
  },
  'taller-eco-3eso': {
    level: '3r ESO',
    title: "Taller d'Economia",
    tagline:
      'Primer contacte amb l\'economia: consum responsable, diners i estalvi, empreses i emprenedoria, treball i impostos. L\'optativa que obri el camí cap a 4t ESO.',
    marcoNormativo: 'Reial Decret 217/2022 (optativa d\'iniciació econòmica i emprenedora)',
  },
  'ipe1-fp': {
    level: 'FP — Grau Mitjà i Superior',
    title: "Itinerari Personal per a l'Ocupabilitat I",
    tagline:
      'El mòdul que substitueix la FOL en primer curs: autoconeixement professional, prevenció de riscos laborals, contracte i drets, i salut psicosocial.',
    marcoNormativo: 'Llei Orgànica 3/2022 (LOFP) · RD 659/2023, Annex V',
  },
  'ipe2-fp': {
    level: 'FP — Grau Mitjà i Superior',
    title: "Itinerari Personal per a l'Ocupabilitat II",
    tagline:
      'Continuació d\'IPE I en segon curs: busca activa d\'ocupació, marca personal, competències per a l\'ocupació i un projecte emprenedor d\'innovació social.',
    marcoNormativo: 'Llei Orgànica 3/2022 (LOFP) · RD 659/2023, Annex V',
  },
  'eeae-bach': {
    level: '1r Batxillerat',
    title: 'Economia, Emprenedoria i Activitat Empresarial',
    tagline:
      'La matèria de modalitat General que ajunta economia, iniciativa emprenedora i activitat empresarial. Per a entendre com es crea valor abans de triar itinerari.',
    modalidad: 'Modalitat General',
    marcoNormativo: 'Reial Decret 243/2022 · Decret 108/2022, mod. Decret 103/2026 (CV)',
  },
  'gpe-bach': {
    level: 'Batxillerat (1r/2n)',
    title: 'Gestió de Projectes d\'Emprenedoria',
    tagline:
      'Una matèria de projecte: l\'alumnat munta la seua pròpia iniciativa emprenedora lligada al territori. Porta llibre teòric i quadern de projecte guiat per fases.',
    modalidad: 'Optativa (1r o 2n)',
    marcoNormativo: 'Decret 108/2022, mod. Decret 103/2026 (CV) — optativa',
  },
};

/** Overlay the Valencian strings onto an asignatura when locale is 'ca'. */
export function localizeAsignatura(a: Asignatura, locale: Locale): Asignatura {
  if (locale === 'es') return a;
  return { ...a, ...ASIGNATURAS_CA[a.slug] };
}
