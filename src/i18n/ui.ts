import { type Locale } from './locale';

// Chrome + shared UI strings. Keys are dot-namespaced by area.
export const ui = {
  es: {
    'skip.main': 'Saltar al contenido principal',
    'nav.aria': 'Navegación principal',
    'nav.eso': 'ESO',
    'nav.bach': 'BACH',
    'nav.fp': 'FP',
    'nav.otros': 'Otros',
    'nav.preparacion': 'Preparación',
    'nav.olimpiada': 'Olimpiada de Economía',
    'nav.proximamente': 'Próximamente',
    'nav.ipe.group': 'Itinerario Personal para la Empleabilidad',
    'nav.ipe1.desc': 'Primer curso · sustituye a la FOL',
    'nav.ipe2.desc': 'Segundo curso · búsqueda de empleo y proyecto',
    'nav.oposiciones': 'Oposiciones',
    'curso.3eso': '3.º ESO',
    'curso.4eso': '4.º ESO',
    'curso.1bach': '1.º Bach',
    'curso.2bach': '2.º Bach',
    'curso.optativas': 'Optativas (1.º/2.º)',
    'curso.fp': 'Grado Medio y Superior',
    'footer.tagline': 'material editorial para profesores de instituto',
    'footer.sobre': 'Sobre el proyecto',
    'footer.contacto': 'Contacto',
    'footer.avisoLegal': 'Aviso legal',
    'footer.privacidad': 'Privacidad',
    'lang.switch.aria': 'Cambiar idioma',
    'lang.es': 'ES',
    'lang.ca': 'VAL',
  },
  ca: {
    'skip.main': 'Salta al contingut principal',
    'nav.aria': 'Navegació principal',
    'nav.eso': 'ESO',
    'nav.bach': 'BATX',
    'nav.fp': 'FP',
    'nav.otros': 'Altres',
    'nav.preparacion': 'Preparació',
    'nav.olimpiada': "Olimpíada d'Economia",
    'nav.proximamente': 'Pròximament',
    'nav.ipe.group': "Itinerari Personal per a l'Ocupabilitat",
    'nav.ipe1.desc': 'Primer curs · substitueix la FOL',
    'nav.ipe2.desc': "Segon curs · busca d'ocupació i projecte",
    'nav.oposiciones': 'Oposicions',
    'curso.3eso': '3r ESO',
    'curso.4eso': '4t ESO',
    'curso.1bach': '1r Batx',
    'curso.2bach': '2n Batx',
    'curso.optativas': 'Optatives (1r/2n)',
    'curso.fp': 'Grau Mitjà i Superior',
    'footer.tagline': "material editorial per a professorat d'institut",
    'footer.sobre': 'Sobre el projecte',
    'footer.contacto': 'Contacte',
    'footer.avisoLegal': 'Avís legal',
    'footer.privacidad': 'Privacitat',
    'lang.switch.aria': "Canvia d'idioma",
    'lang.es': 'ES',
    'lang.ca': 'VAL',
  },
} as const;

export type UIKey = keyof (typeof ui)['es'];

export function t(key: UIKey, locale: Locale): string {
  return ui[locale][key] ?? ui.es[key];
}
