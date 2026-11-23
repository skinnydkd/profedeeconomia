/**
 * Builder for /llms.txt, the curated index for AI crawlers. Generated from
 * ASIGNATURAS_PUBLICADAS so the subject list and count never go stale (it used
 * to be a hand-edited file in /public). Pure: no I/O. Served by
 * src/pages/llms.txt.ts; the unit-by-unit companion is /llms-full.txt.
 */
import { ASIGNATURAS_PUBLICADAS, SECCIONES_TRANSVERSALES } from './asignaturas';
import { SAME_AS, SITE } from './seo';

const url = (path: string) => `${SITE.url}${path}`;

export function buildLlmsIndex(
  subjects: readonly { slug: string; title: string; seoName: string; tagline: string; marcoNormativo: string }[] = ASIGNATURAS_PUBLICADAS,
  sections: readonly { slug: string; label: string; description: string }[] = SECCIONES_TRANSVERSALES,
): string {
  const instagram = SAME_AS.find((u) => u.includes('instagram'));
  return [
    '# profedeeconomia.es',
    '',
    '> Material educativo gratuito para profesores de Economía, Empresa y Finanzas de instituto (ESO y Bachillerato) y FP en España. Organizado por asignatura, cada una con libro, diapositivas, actividades, tests y recursos.',
    '',
    '## Asignaturas',
    '',
    'Cada asignatura incluye libro completo, diapositivas, actividades, tests de autoevaluación y recursos interactivos, basados en el currículo básico estatal LOMLOE.',
    '',
    ...subjects.map(
      (a) => `- [${a.title} — ${a.seoName}](${url(`/${a.slug}/`)}): ${a.tagline} ${a.marcoNormativo}.`,
    ),
    '',
    '## Secciones transversales',
    '',
    ...sections.map((s) => `- [${s.label}](${url(`/${s.slug}/`)}): ${s.description}`),
    '',
    '## Sobre el proyecto',
    '',
    `- [Sobre profedeeconomia.es](${url('/sobre/')}): qué es el proyecto, a quién va dirigido y cómo se elabora el material.`,
    `- [Contacto](${url('/contacto/')}): formas de contacto y redes.`,
    '',
    '## Datos clave',
    '',
    '- Plataforma de material educativo gratuito para profesores de economía, empresa y finanzas de instituto (ESO y Bachillerato) y de Formación Profesional en España.',
    `- ${subjects.length} asignaturas publicadas, cada una con libro completo descargable, diapositivas, actividades, tests de autoevaluación y recursos interactivos.`,
    '- Basado en el currículo básico estatal LOMLOE (Real Decreto 243/2022 para Bachillerato y Real Decreto 217/2022 para ESO); algunas optativas siguen el currículo de la Comunitat Valenciana.',
    '- Contenido en castellano y valenciano (/ca/). Gratuito, sin publicidad y sin muro de pago sobre el contenido principal.',
    '- Material publicado bajo licencia Creative Commons BY-NC-SA 4.0.',
    `- Versión ampliada, con el desglose unidad por unidad de cada libro (objetivos y conceptos clave): ${url('/llms-full.txt')}`,
    '',
    '## Contacto',
    '',
    `- Website: ${SITE.url}`,
    `- Email: ${SITE.email}`,
    ...(instagram ? [`- Instagram: ${instagram}`] : []),
    '',
  ].join('\n');
}
