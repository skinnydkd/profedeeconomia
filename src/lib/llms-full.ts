/**
 * Builder for /llms-full.txt — the expanded companion to the curated
 * public/llms.txt. Where llms.txt lists subjects with one-line descriptions,
 * this file breaks every published book down unit by unit, surfacing each
 * unit's learning objectives and key concepts. All of it is derived from the
 * MDX single source of truth (the `libro` collection frontmatter), so it never
 * drifts from the content. Emitted as a static endpoint (see
 * src/pages/llms-full.txt.ts).
 */
import { SITE } from './seo';

export type LlmsUnit = {
  unidad: number;
  title: string;
  lema?: string;
  objetivos: string[];
  conceptos_clave: string[];
  sabers: string[];
  slug: string;
};

export type LlmsSubject = {
  slug: string;
  title: string;
  level: string;
  marcoNormativo: string;
  modalidad?: string;
  units: LlmsUnit[];
};

export type LlmsSection = { label: string; slug: string; description: string };

const INTRO =
  'Material educativo gratuito para profesores de Economía, Empresa y Finanzas de instituto (ESO y Bachillerato) y FP en España. Organizado por asignatura, cada una con libro, diapositivas, actividades, tests y recursos.';

/** Build the full plain-text llms-full.txt body. Pure: no I/O. */
export function buildLlmsFull(subjects: LlmsSubject[], sections: LlmsSection[] = []): string {
  const lines: string[] = [];
  const url = (path: string) => `${SITE.url}${path}`;

  lines.push('# profedeeconomia.es — contenido completo');
  lines.push('');
  lines.push(`> ${INTRO}`);
  lines.push('');
  lines.push(
    'Este archivo amplía llms.txt: desglosa los libros unidad por unidad con sus objetivos de aprendizaje y conceptos clave, derivados directamente del MDX de origen (currículo básico estatal LOMLOE). Para el índice resumido, ver https://www.profedeeconomia.es/llms.txt'
  );

  for (const s of subjects) {
    lines.push('');
    const modalidad = s.modalidad ? ` · ${s.modalidad}` : '';
    lines.push(`## ${s.title} — ${s.level}${modalidad} (${s.marcoNormativo})`);
    lines.push(`Hub: ${url(`/${s.slug}/`)} · Libro: ${url(`/${s.slug}/libro/`)}`);

    for (const u of s.units) {
      lines.push('');
      lines.push(`### Unidad ${u.unidad}. ${u.title}`);
      if (u.lema) lines.push(u.lema);
      lines.push(`URL: ${url(`/${s.slug}/libro/${u.slug}/`)}`);
      if (u.objetivos.length) {
        lines.push('Objetivos de aprendizaje:');
        for (const o of u.objetivos) lines.push(`- ${o}`);
      }
      if (u.conceptos_clave.length) {
        lines.push(`Conceptos clave: ${u.conceptos_clave.join(', ')}.`);
      }
      if (u.sabers.length) {
        lines.push(`Saberes básicos (LOMLOE): ${u.sabers.join(', ')}.`);
      }
    }
  }

  if (sections.length) {
    lines.push('');
    lines.push('## Secciones transversales');
    for (const sec of sections) {
      lines.push(`- [${sec.label}](${url(`/${sec.slug}/`)}): ${sec.description}`);
    }
  }

  lines.push('');
  return lines.join('\n');
}
