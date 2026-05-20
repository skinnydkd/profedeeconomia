import type { TimelineEvent } from '@components/Timeline.tsx';

/**
 * Shared timeline datasets used inside the MDX units. Keeping the data here (rather
 * than inline in each .mdx) makes the content testable and reusable across units.
 *
 * All dates are historical and verifiable; sources are the EU's official history
 * (european-union.europa.eu) for the integration timeline and the LOMLOE / LOFP
 * regulations (RD 243/2022, LO 3/2022, RD 659/2023) for the education itinerary.
 */

/** Key milestones of European integration, with Spain's place in the process. */
export const euIntegrationTimeline: TimelineEvent[] = [
  {
    year: 1951,
    title: 'CECA — Comunidad Europea del Carbón y del Acero',
    description:
      'El Tratado de París crea la CECA con seis miembros fundadores (Francia, Alemania, Italia, Bélgica, Países Bajos y Luxemburgo). Nace del plan Schuman de 1950: poner el carbón y el acero franco-alemanes bajo una autoridad común para hacer la guerra "materialmente imposible". La integración europea empieza como proyecto de paz, no como proyecto económico.',
  },
  {
    year: 1957,
    title: 'Tratados de Roma — nace la CEE',
    description:
      'Se firman los Tratados de Roma, que crean la Comunidad Económica Europea (CEE) —una unión aduanera con libre circulación parcial— y la Euratom para la energía nuclear civil. Es el embrión del mercado común europeo que conocemos hoy.',
  },
  {
    year: 1986,
    title: 'España y Portugal entran en la CEE',
    description:
      'El 1 de enero de 1986 España se incorpora a la Comunidad Económica Europea junto con Portugal. Ese mismo año se firma el Acta Única Europea, que fija el objetivo de completar el mercado interior en 1993. Desde entonces, la economía española queda integrada en el proyecto europeo.',
  },
  {
    year: 1992,
    title: 'Tratado de Maastricht — nace la Unión Europea',
    description:
      'El Tratado de Maastricht crea la Unión Europea propiamente dicha y sienta las bases de la Unión Económica y Monetaria (UEM). Define los criterios de convergencia (déficit, deuda, inflación y tipos de interés) que deberán cumplir los países aspirantes a la futura moneda única.',
  },
  {
    year: '1999-2002',
    title: 'El euro: primero contable, después físico',
    description:
      'En 1999 el euro entra en vigor como moneda escritural y los tipos de cambio entre las divisas nacionales quedan fijados de forma irrevocable. En 2002 los billetes y monedas en euros sustituyen a las divisas nacionales en doce países: España jubila la peseta.',
  },
  {
    year: 2009,
    title: 'Tratado de Lisboa',
    description:
      'El Tratado de Lisboa reforma el funcionamiento institucional de la UE: refuerza el Parlamento Europeo, crea la figura del presidente permanente del Consejo Europeo y el Alto Representante para la política exterior, y da carácter vinculante a la Carta de los Derechos Fundamentales.',
  },
  {
    year: 2020,
    title: 'Brexit y NextGenerationEU',
    description:
      'El Reino Unido abandona la UE tras el referéndum de 2016: es la primera salida de la historia del proyecto. Ese mismo año, en respuesta a la pandemia, la UE aprueba NextGenerationEU y emite deuda común por 750.000 millones de euros. Por primera vez la Unión se endeuda como bloque para financiar a sus Estados miembros.',
  },
];

/** Decision points and milestones along the path after finishing 4.º ESO (LOMLOE). */
export const itinerariosPostESOTimeline: TimelineEvent[] = [
  {
    year: '4.º ESO',
    title: 'Título de Graduado en ESO',
    description:
      'Al obtener el título de Graduado en ESO se llega a la primera bifurcación real del recorrido académico. Se abren, al menos, cuatro grandes vías: Bachillerato, FP de Grado Medio, FP de Grado Básico y las enseñanzas de régimen especial. Ninguna decisión aquí es irreversible: existen pasarelas entre vías.',
  },
  {
    year: 'Elección',
    title: 'Bachillerato o Formación Profesional',
    description:
      'El primer gran cruce. El Bachillerato (2 años) tiene cinco modalidades —Ciencias y Tecnología, Humanidades y Ciencias Sociales, Artes Plásticas, Música y Artes Escénicas, y la nueva modalidad General de la LOMLOE— y orienta principalmente a la universidad. La FP de Grado Medio (2 años) titula como técnico y da acceso al empleo o al Grado Superior.',
  },
  {
    year: '2 años',
    title: 'Cursar la etapa elegida (con pasarelas)',
    description:
      'Durante los dos cursos las vías siguen comunicadas: se puede pasar de FP Grado Medio a Bachillerato mediante prueba o convalidación, y de Bachillerato a FP de Grado Superior con acceso directo. Una decisión a los 16 años no condena a nada: reorientar a tiempo es signo de madurez, no de fracaso.',
  },
  {
    year: 'Prueba',
    title: 'EBAU (vía Bachillerato)',
    description:
      'Quien cursa Bachillerato realiza la EBAU (también llamada PEvAU, PAU o Selectividad). La nota de acceso = 0,6 × media del Bachillerato + 0,4 × fase obligatoria, con un máximo de 10. La fase voluntaria suma hasta 4 puntos por ponderaciones, de modo que la nota de admisión máxima es 14. La FP de Grado Superior accede a la universidad sin EBAU obligatoria.',
  },
  {
    year: 'Destino',
    title: 'Universidad, FP Superior o mundo laboral',
    description:
      'Se abre el último tramo: grado universitario (desde Bachillerato vía EBAU o desde FP Superior), FP de Grado Superior (técnico superior, con acceso posterior a la universidad sin EBAU obligatoria) o incorporación directa al mercado laboral. Las pasarelas siguen activas: desde FP Superior se puede ir a la universidad, y siempre cabe seguir formándose.',
  },
];
