/**
 * Per-subject FAQ, derived from the asignatura data so the answers can't drift
 * from reality (no hand-written facts to keep in sync). Feeds both the visible
 * FAQ block on the subject hub and the FAQPage JSON-LD (see faqLd in seo.ts).
 */
import type { Asignatura, AsignaturaSlug } from './asignaturas';

export type Faq = { q: string; a: string };


/**
 * Naming questions, per subject. Teachers reach these pages searching the old
 * name or asking what the acronym even is — `asignatura fol 4 eso` (48
 * impressions at position 6.94), `ipe fol`, `que es fopp`, `asignatura ipe fp`,
 * `itinerario personal para la empleabilidad es lo mismo que fol`. Answering
 * that plainly on the hub is the cheapest way to own the cluster, and it is
 * exactly the shape an AI answer-extractor lifts.
 * See docs/seo-estrategia-2026.md §5.4.
 */
const NAMING_FAQS: Partial<Record<AsignaturaSlug, Faq[]>> = {
  'ipe1-fp': [
    {
      q: '¿IPE es lo mismo que FOL?',
      a: 'No exactamente. Itinerario Personal para la Empleabilidad (IPE) es el módulo que sustituye a FOL en el nuevo sistema de FP (Ley Orgánica 3/2022 y RD 659/2023). Recoge lo que FOL cubría —relaciones laborales, contrato, Seguridad Social, prevención de riesgos— pero lo reorganiza alrededor del itinerario profesional de cada alumno y añade autoconocimiento, identidad digital y aprendizaje a lo largo de la vida. Si venías de dar FOL, buena parte del temario te sonará; el enfoque y la secuencia, no.',
    },
    {
      q: '¿Qué se da en IPE I y en qué se diferencia de IPE II?',
      a: 'IPE I es el módulo de primer curso: reto de empleabilidad, autoconocimiento y competencias, DAFO y proyecto profesional, sector productivo, identidad digital, contrato y derechos, Seguridad Social, prevención de riesgos laborales y salud psicosocial. IPE II va en segundo curso y gira hacia la búsqueda activa de empleo, la marca personal y un proyecto emprendedor completo.',
    },
    {
      q: '¿IPE se imparte en Grado Medio y en Grado Superior?',
      a: 'Sí. IPE I e IPE II son módulos transversales de los ciclos de Grado Medio y de Grado Superior. El material está escrito para ambos: los casos y los datos son los mismos, y el nivel de exigencia lo ajusta el profesorado en las actividades.',
    },
  ],
  'ipe2-fp': [
    {
      q: '¿IPE II es lo mismo que la antigua FOL de segundo?',
      a: 'No. Itinerario Personal para la Empleabilidad II es el módulo de segundo curso del nuevo sistema de FP (Ley Orgánica 3/2022 y RD 659/2023). La parte laboral clásica de FOL —contrato, Seguridad Social, prevención— se concentra en IPE I; IPE II se dedica a la búsqueda activa de empleo, la marca personal, las competencias profesionales y un proyecto emprendedor que se defiende al final del curso.',
    },
    {
      q: '¿Hace falta haber dado IPE I para seguir IPE II?',
      a: 'Ayuda, pero el material no lo da por supuesto. Cada unidad de IPE II arranca desde cero en lo que necesita y enlaza con la unidad de IPE I correspondiente cuando conviene repasarla.',
    },
  ],
  'fopp-4eso': [
    {
      q: '¿Qué es FOPP y por qué mucha gente la busca como «FOL de 4.º ESO»?',
      a: 'FOPP son las siglas de Formación y Orientación Personal y Profesional, una materia optativa de 4.º de ESO que llegó con la LOMLOE (Real Decreto 217/2022). Se busca a menudo como «FOL de 4.º ESO» porque comparte terreno con aquella: mundo del trabajo, derechos laborales, itinerarios. Pero FOPP no es FOL: parte del autoconocimiento del alumnado y del diseño de un proyecto de vida, y FOL era un módulo de Formación Profesional, hoy sustituido por IPE.',
    },
    {
      q: '¿En qué se diferencia FOPP de Economía y Emprendimiento de 4.º ESO?',
      a: 'Son dos optativas distintas del mismo curso. Economía y Emprendimiento mira hacia fuera: mercados, consumo, empresa, finanzas personales. FOPP mira hacia dentro: quién soy, qué se me da bien, qué itinerario me encaja y qué derechos tengo cuando empiece a trabajar. Se pueden cursar por separado y el material de cada una es independiente.',
    },
  ],
};

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
    ...(NAMING_FAQS[a.slug] ?? []),
  ];
}
