/**
 * Per-subject FAQ, derived from the asignatura data so the answers can't drift
 * from reality (no hand-written facts to keep in sync). Feeds both the visible
 * FAQ block on the subject hub and the FAQPage JSON-LD (see faqLd in seo.ts).
 *
 * Localised: a `lang="ca"` hub used to render this block entirely in Spanish,
 * heading included, and emit Spanish FAQPage JSON-LD with it — the exact
 * relevance leak that keeps a Valencian page from reading as Valencian.
 * See docs/seo-estrategia-2026.md §5.8.
 */
import type { Asignatura, AsignaturaSlug } from './asignaturas';
import type { Locale } from '@/i18n/locale';

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
const NAMING_FAQS: Record<Locale, Partial<Record<AsignaturaSlug, Faq[]>>> = {
  es: {
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
  },
  ca: {
    'ipe1-fp': [
      {
        q: 'IPE és el mateix que FOL?',
        a: 'No exactament. Itinerari Personal per a l\'Ocupabilitat (IPE) és el mòdul que substitueix la FOL al nou sistema de FP (Llei Orgànica 3/2022 i RD 659/2023). Arreplega el que la FOL cobria —relacions laborals, contracte, Seguretat Social, prevenció de riscos— però ho reorganitza al voltant de l\'itinerari professional de cada alumne i hi afig autoconeixement, identitat digital i aprenentatge al llarg de la vida. Si véns de fer FOL, bona part del temari et sonarà; l\'enfocament i la seqüència, no.',
      },
      {
        q: 'Què es fa a IPE I i en què es diferencia d\'IPE II?',
        a: 'IPE I és el mòdul de primer curs: repte d\'ocupabilitat, autoconeixement i competències, DAFO i projecte professional, sector productiu, identitat digital, contracte i drets, Seguretat Social, prevenció de riscos laborals i salut psicosocial. IPE II va en segon curs i gira cap a la busca activa d\'ocupació, la marca personal i un projecte emprenedor complet.',
      },
      {
        q: 'IPE s\'imparteix a Grau Mitjà i a Grau Superior?',
        a: 'Sí. IPE I i IPE II són mòduls transversals dels cicles de Grau Mitjà i de Grau Superior. El material està escrit per als dos: els casos i les dades són els mateixos, i el nivell d\'exigència l\'ajusta el professorat a les activitats.',
      },
    ],
    'ipe2-fp': [
      {
        q: 'IPE II és el mateix que l\'antiga FOL de segon?',
        a: 'No. Itinerari Personal per a l\'Ocupabilitat II és el mòdul de segon curs del nou sistema de FP (Llei Orgànica 3/2022 i RD 659/2023). La part laboral clàssica de la FOL —contracte, Seguretat Social, prevenció— es concentra a IPE I; IPE II es dedica a la busca activa d\'ocupació, la marca personal, les competències professionals i un projecte emprenedor que es defén al final del curs.',
      },
      {
        q: 'Cal haver fet IPE I per a seguir IPE II?',
        a: 'Ajuda, però el material no ho dona per suposat. Cada unitat d\'IPE II arranca de zero en el que necessita i enllaça amb la unitat d\'IPE I corresponent quan convé repassar-la.',
      },
    ],
    'fopp-4eso': [
      {
        q: 'Què és FOPP i per què molta gent la busca com a «FOL de 4t d\'ESO»?',
        a: 'FOPP són les sigles de Formació i Orientació Personal i Professional, una matèria optativa de 4t d\'ESO que va arribar amb la LOMLOE (Reial Decret 217/2022). Es busca sovint com a «FOL de 4t d\'ESO» perquè comparteix terreny amb aquella: món del treball, drets laborals, itineraris. Però FOPP no és FOL: part de l\'autoconeixement de l\'alumnat i del disseny d\'un projecte de vida, i la FOL era un mòdul de Formació Professional, hui substituït per IPE.',
      },
      {
        q: 'En què es diferencia FOPP d\'Economia i Emprenedoria de 4t d\'ESO?',
        a: 'Són dues optatives distintes del mateix curs. Economia i Emprenedoria mira cap a fora: mercats, consum, empresa, finances personals. FOPP mira cap a dins: qui soc, què se\'m dona bé, quin itinerari m\'encaixa i quins drets tinc quan comence a treballar. Es poden cursar per separat i el material de cada una és independent.',
      },
    ],
  },
};

export function subjectFaqs(a: Asignatura, locale: Locale = 'es'): Faq[] {
  const generic: Record<Locale, Faq[]> = {
    es: [
      { q: `¿Qué es ${a.title} (${a.level})?`, a: a.tagline },
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
    ],
    ca: [
      { q: `Què és ${a.title} (${a.level})?`, a: a.tagline },
      {
        q: `Quina normativa regula ${a.title}?`,
        a: `Esta matèria es basa en el currículum bàsic estatal LOMLOE, establit en el ${a.marcoNormativo}. Cada comunitat autònoma pot fixar concrecions pròpies al seu currículum, així que convé consultar la de la teua comunitat per a ajustar la programació al teu centre.`,
      },
      {
        q: `El material de ${a.shortLabel} és gratuït?`,
        a: 'Sí. Tot el material és gratuït, sense publicitat ni mur de pagament sobre el contingut, i es publica amb llicència Creative Commons (BY-NC-SA).',
      },
      {
        q: 'Què inclou?',
        a: 'Cada assignatura reuneix el llibre complet (descarregable en PDF), diapositives, activitats, tests d\'autoavaluació i recursos interactius, organitzats per unitat.',
      },
    ],
  };
  return [...generic[locale], ...(NAMING_FAQS[locale][a.slug] ?? [])];
}
