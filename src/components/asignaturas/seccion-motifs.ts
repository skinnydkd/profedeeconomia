/**
 * Illustrations for the section cards of the subject hub (Libro, Diapositivas,
 * Tests…). Same flat layered style as the subject covers (caratula-motifs.ts):
 * one motif per section type, drawn in the subject's own tones, so the ten
 * hubs share the drawings but keep their colour. Validated in
 * mockups/hub-ilustraciones/ on 2026-10-25. Each entry returns the full inner
 * markup (background included) for an SVG with viewBox "0 0 320 110".
 */
import { ACCENTS, type Asignatura } from '@/lib/asignaturas';

const CREAM = '#FBF6EC';
const MUSTARD = '#D4A24C';

type Tones = { base: string; deep: string; soft: string };
type Motif = (c: Tones) => string;

export const SECCION_SLUGS = [
  'libro', 'diapositivas', 'actividades', 'refuerzo', 'proyecto',
  'tests', 'recursos', 'retos', 'actividades-dinamicas', 'ebau', 'ebau/examenes',
  'evaluacion', 'programacion',
] as const;
export type SeccionSlug = (typeof SECCION_SLUGS)[number];

const bg = (c: Tones) => `<rect width="320" height="110" fill="${c.base}"/>`;
const tick = (x: number, y: number, color: string) =>
  `<path d="M${x} ${y} l4 4 l8 -10" stroke="${color}" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;

// Keyed by section slug so a new section without a motif is a compile error.
export const SECCION_MOTIFS: Record<SeccionSlug, Motif> = {
  // An open book.
  'libro': (c) => `${bg(c)}
    <circle cx="290" cy="0" r="62" fill="${c.deep}"/>
    <path d="M160 30 Q120 18 84 26 L84 92 Q120 84 160 96Z" fill="${CREAM}"/>
    <path d="M160 30 Q200 18 236 26 L236 92 Q200 84 160 96Z" fill="${c.soft}"/>
    <rect x="158" y="30" width="4" height="66" fill="${c.deep}"/>
    <g stroke="${c.base}" stroke-width="2"><line x1="98" y1="44" x2="146" y2="48"/><line x1="98" y1="56" x2="146" y2="60"/><line x1="98" y1="68" x2="134" y2="71"/><line x1="174" y1="48" x2="222" y2="44"/><line x1="174" y1="60" x2="222" y2="56"/></g>
    <rect x="186" y="66" width="22" height="14" fill="${MUSTARD}"/>`,

  // A projection screen with a rising bar chart.
  'diapositivas': (c) => `${bg(c)}
    <circle cx="30" cy="110" r="64" fill="${c.deep}"/>
    <rect x="92" y="14" width="136" height="6" rx="3" fill="${c.deep}"/>
    <rect x="100" y="20" width="120" height="68" fill="${CREAM}"/>
    <g fill="${c.base}"><rect x="118" y="62" width="16" height="16"/><rect x="142" y="52" width="16" height="26"/><rect x="166" y="42" width="16" height="36"/></g>
    <rect x="190" y="32" width="16" height="46" fill="${MUSTARD}"/>
    <rect x="158" y="88" width="4" height="14" fill="${c.soft}"/>
    <rect x="140" y="100" width="40" height="4" fill="${c.soft}"/>`,

  // A printed worksheet with ticked boxes and a pencil.
  'actividades': (c) => `${bg(c)}
    <circle cx="300" cy="104" r="58" fill="${c.deep}"/>
    <rect x="104" y="12" width="86" height="98" fill="${CREAM}"/>
    <g fill="${c.soft}" stroke="${c.base}" stroke-width="2"><rect x="116" y="28" width="12" height="12"/><rect x="116" y="50" width="12" height="12"/><rect x="116" y="72" width="12" height="12"/></g>
    <g stroke="${c.base}" stroke-width="2"><line x1="136" y1="34" x2="178" y2="34"/><line x1="136" y1="56" x2="172" y2="56"/><line x1="136" y1="78" x2="176" y2="78"/></g>
    ${tick(118, 33, MUSTARD)}${tick(118, 55, MUSTARD)}
    <g transform="rotate(35 220 60)"><rect x="212" y="22" width="14" height="66" fill="${MUSTARD}"/><path d="M212 88 L226 88 L219 102Z" fill="${c.soft}"/><rect x="212" y="22" width="14" height="10" fill="${c.soft}"/></g>`,

  // Two steps from one base: a short one and a tall one with a flag.
  'refuerzo': (c) => `${bg(c)}
    <circle cx="20" cy="0" r="60" fill="${c.deep}"/>
    <rect x="70" y="82" width="180" height="16" fill="${c.soft}"/>
    <rect x="90" y="60" width="50" height="22" fill="${CREAM}"/>
    <rect x="170" y="38" width="60" height="44" fill="${CREAM}"/>
    <rect x="186" y="16" width="3" height="22" fill="${c.soft}"/>
    <path d="M189 16 L208 22 L189 28Z" fill="${MUSTARD}"/>
    <circle cx="115" cy="48" r="8" fill="${MUSTARD}"/>`,

  // A spiral notebook with a route of milestones.
  'proyecto': (c) => `${bg(c)}
    <circle cx="296" cy="96" r="60" fill="${c.deep}"/>
    <rect x="96" y="14" width="128" height="86" rx="3" fill="${CREAM}"/>
    <g fill="${c.deep}"><circle cx="110" cy="26" r="3"/><circle cx="110" cy="44" r="3"/><circle cx="110" cy="62" r="3"/><circle cx="110" cy="80" r="3"/></g>
    <polyline points="132,82 158,62 184,70 208,36" fill="none" stroke="${c.soft}" stroke-width="3" stroke-dasharray="5 4"/>
    <g fill="${c.base}"><circle cx="132" cy="82" r="5"/><circle cx="158" cy="62" r="5"/><circle cx="184" cy="70" r="5"/></g>
    <rect x="207" y="22" width="2.5" height="16" fill="${c.deep}"/>
    <path d="M209.5 22 L222 26 L209.5 30Z" fill="${MUSTARD}"/>`,

  // A quiz card with options, one ticked, and a score badge.
  'tests': (c) => `${bg(c)}
    <circle cx="24" cy="104" r="58" fill="${c.deep}"/>
    <rect x="92" y="14" width="120" height="84" rx="4" fill="${CREAM}"/>
    <g fill="${c.soft}"><rect x="104" y="28" width="96" height="14" rx="2"/><rect x="104" y="48" width="96" height="14" rx="2"/><rect x="104" y="68" width="96" height="14" rx="2"/></g>
    <rect x="104" y="48" width="96" height="14" rx="2" fill="${MUSTARD}"/>
    ${tick(108, 55, CREAM)}
    <circle cx="232" cy="36" r="20" fill="${c.soft}"/>
    <g stroke="${c.base}" stroke-width="3" stroke-linecap="round"><line x1="224" y1="36" x2="240" y2="36"/><line x1="232" y1="28" x2="232" y2="44"/></g>`,

  // A chart with two crossing curves and a slider below.
  'recursos': (c) => `${bg(c)}
    <circle cx="300" cy="8" r="58" fill="${c.deep}"/>
    <rect x="96" y="12" width="128" height="68" fill="${CREAM}"/>
    <g stroke="${c.base}" stroke-width="2"><line x1="108" y1="20" x2="108" y2="72"/><line x1="108" y1="72" x2="214" y2="72"/></g>
    <line x1="116" y1="24" x2="206" y2="66" stroke="${c.base}" stroke-width="3"/>
    <line x1="116" y1="66" x2="206" y2="24" stroke="${MUSTARD}" stroke-width="3"/>
    <circle cx="161" cy="45" r="4" fill="${c.deep}"/>
    <rect x="96" y="92" width="128" height="4" rx="2" fill="${c.soft}"/>
    <circle cx="176" cy="94" r="7" fill="${MUSTARD}"/>`,

  // A target with an arrow in the bullseye.
  'retos': (c) => `${bg(c)}
    <circle cx="28" cy="6" r="58" fill="${c.deep}"/>
    <circle cx="160" cy="56" r="42" fill="${CREAM}"/>
    <circle cx="160" cy="56" r="30" fill="${c.soft}"/>
    <circle cx="160" cy="56" r="18" fill="${CREAM}"/>
    <circle cx="160" cy="56" r="8" fill="${MUSTARD}"/>
    <line x1="160" y1="56" x2="236" y2="20" stroke="${c.deep}" stroke-width="3"/>
    <path d="M236 20 L248 12 L246 22 L256 24 L244 30Z" fill="${MUSTARD}"/>`,

  // A decision tree: one node branching into two, then four.
  'actividades-dinamicas': (c) => `${bg(c)}
    <circle cx="296" cy="104" r="58" fill="${c.deep}"/>
    <g stroke="${c.soft}" stroke-width="3" fill="none"><path d="M100 55 L150 30 M100 55 L150 80 M150 30 L210 18 M150 30 L210 42 M150 80 L210 68 M150 80 L210 92"/></g>
    <circle cx="100" cy="55" r="12" fill="${CREAM}"/>
    <g fill="${CREAM}"><circle cx="150" cy="30" r="9"/><circle cx="150" cy="80" r="9"/></g>
    <g fill="${c.soft}"><circle cx="210" cy="18" r="7"/><circle cx="210" cy="68" r="7"/><circle cx="210" cy="92" r="7"/></g>
    <circle cx="210" cy="42" r="7" fill="${MUSTARD}"/>`,

  // An exam sheet next to a stopwatch.
  'ebau': (c) => `${bg(c)}
    <circle cx="22" cy="8" r="58" fill="${c.deep}"/>
    <rect x="96" y="12" width="84" height="94" fill="${CREAM}"/>
    <rect x="106" y="22" width="40" height="8" fill="${c.base}"/>
    <g stroke="${c.soft}" stroke-width="3"><line x1="106" y1="42" x2="170" y2="42"/><line x1="106" y1="54" x2="164" y2="54"/><line x1="106" y1="66" x2="170" y2="66"/><line x1="106" y1="78" x2="150" y2="78"/></g>
    <circle cx="226" cy="62" r="28" fill="${c.soft}"/>
    <circle cx="226" cy="62" r="21" fill="${CREAM}"/>
    <rect x="221" y="26" width="10" height="8" fill="${c.soft}"/>
    <path d="M226 62 L226 46 A16 16 0 0 1 240 56Z" fill="${MUSTARD}"/>`,

  // A stack of past papers with a download arrow.
  'ebau/examenes': (c) => `${bg(c)}
    <circle cx="300" cy="106" r="60" fill="${c.deep}"/>
    <rect x="112" y="24" width="80" height="80" fill="${c.soft}" transform="rotate(-6 152 64)"/>
    <rect x="118" y="18" width="80" height="80" fill="${CREAM}"/>
    <g stroke="${c.soft}" stroke-width="3"><line x1="128" y1="32" x2="188" y2="32"/><line x1="128" y1="44" x2="180" y2="44"/><line x1="128" y1="56" x2="186" y2="56"/></g>
    <circle cx="214" cy="82" r="16" fill="${MUSTARD}"/>
    <path d="M214 73 L214 88 M207 82 L214 89 L221 82" stroke="${CREAM}" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`,

  // A rubric grid with one achievement level highlighted per row.
  'evaluacion': (c) => `${bg(c)}
    <circle cx="26" cy="104" r="58" fill="${c.deep}"/>
    <rect x="92" y="16" width="136" height="80" fill="${CREAM}"/>
    <g fill="${c.soft}">
      <rect x="100" y="24" width="28" height="18"/><rect x="132" y="24" width="28" height="18"/><rect x="164" y="24" width="28" height="18"/><rect x="196" y="24" width="24" height="18"/>
      <rect x="100" y="47" width="28" height="18"/><rect x="132" y="47" width="28" height="18"/><rect x="164" y="47" width="28" height="18"/><rect x="196" y="47" width="24" height="18"/>
      <rect x="100" y="70" width="28" height="18"/><rect x="132" y="70" width="28" height="18"/><rect x="164" y="70" width="28" height="18"/><rect x="196" y="70" width="24" height="18"/>
    </g>
    <rect x="164" y="24" width="28" height="18" fill="${MUSTARD}"/>
    <rect x="132" y="47" width="28" height="18" fill="${c.base}"/>
    <rect x="196" y="70" width="24" height="18" fill="${MUSTARD}"/>`,

  // A term calendar with scheduled blocks.
  'programacion': (c) => `${bg(c)}
    <circle cx="298" cy="6" r="58" fill="${c.deep}"/>
    <rect x="96" y="18" width="128" height="84" rx="3" fill="${CREAM}"/>
    <rect x="96" y="18" width="128" height="16" rx="3" fill="${c.soft}"/>
    <g fill="${c.deep}"><rect x="118" y="12" width="4" height="12" rx="2"/><rect x="198" y="12" width="4" height="12" rx="2"/></g>
    <rect x="106" y="44" width="54" height="10" rx="2" fill="${c.base}"/>
    <rect x="150" y="62" width="64" height="10" rx="2" fill="${MUSTARD}"/>
    <rect x="106" y="80" width="80" height="10" rx="2" fill="${c.soft}"/>`,
};

/** Inner SVG markup for a hub section card, in the subject's colour tones. */
export function seccionMarkup(seccion: SeccionSlug, color: Asignatura['color']): string {
  return SECCION_MOTIFS[seccion](ACCENTS[color]);
}
