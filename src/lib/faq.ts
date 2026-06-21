/**
 * Per-subject FAQ, derived from the asignatura data so the answers can't drift
 * from reality (no hand-written facts to keep in sync). Feeds both the visible
 * FAQ block on the subject hub and the FAQPage JSON-LD (see faqLd in seo.ts).
 */
import type { Asignatura } from './asignaturas';

export type Faq = { q: string; a: string };

export function subjectFaqs(a: Asignatura): Faq[] {
  return [
    {
      q: `¿Qué es ${a.title} (${a.level})?`,
      a: a.tagline,
    },
    {
      q: `¿Qué normativa regula ${a.title}?`,
      a: `Esta materia se basa en el currículo básico estatal LOMLOE, establecido en el ${a.marcoNormativo}. Cada comunidad autónoma puede fijar concreciones propias en su currículo, así que conviene consultar la de tu comunidad para ajustar la programación a tu centro.`,
    },
    {
      q: `¿El material de ${a.shortLabel} es gratuito?`,
      a: 'Sí. Todo el material es gratuito, sin publicidad ni muro de pago sobre el contenido, y se publica bajo licencia Creative Commons (BY-NC-SA).',
    },
    {
      q: '¿Qué incluye?',
      a: 'Cada asignatura reúne el libro completo (descargable en PDF), diapositivas, actividades, tests de autoevaluación y recursos interactivos, organizados por unidad.',
    },
  ];
}
