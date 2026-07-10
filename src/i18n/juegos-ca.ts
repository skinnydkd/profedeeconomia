import { type Juego } from '@/lib/juegos';
import { type Locale } from './locale';

type JuegoCA = Partial<Pick<Juego, 'title' | 'descripcion' | 'nota_aula' | 'modo'>>;

// Valencian (AVL) overlay for the /juegos/ hub cards. Structural fields (slug,
// color, tipo, nivel, estado, href, imprimible, unidades_relacionadas,
// competencias_clave) stay in the ES source of truth. Game brand names
// (Stonks, Econrisk, Econopoly, Cajút, Insider) are proper nouns and are not
// translated; «Asegurados» is a plain descriptive title and is translated.
export const JUEGOS_CA: Partial<Record<string, JuegoCA>> = {
  stonks: {
    title: 'Stonks',
    descripcion:
      'Inverteix durant 25 anys repartint el teu patrimoni entre diferents actius. Acabaràs amb més que la IA?',
    modo: '1 jugador',
  },
  econrisk: {
    title: 'Econrisk',
    descripcion:
      "Joc d'estratègia: conquesta territoris amb les grans escoles del pensament econòmic.",
    modo: '1 jugador contra la IA',
  },
  econopoly: {
    title: 'Econopoly',
    descripcion:
      'Monopoly econòmic hot-seat 1-6: monopolis, R+D, cicles, Banc Central i fiscalitat progressiva.',
    modo: '1-6 hot-seat',
  },
  cajut: {
    title: 'Cajút',
    descripcion:
      "Quiz d'aula multijugador. El profe tria assignatura i unitats; l'alumnat respon des del mòbil amb un codi de sala.",
    modo: 'multijugador (party)',
    nota_aula:
      "El professor obri aquesta pàgina al projector. L'alumnat entra a /juegos/cajut/ amb el codi de sala des del mòbil.",
  },
  seguros: {
    title: 'Assegurats',
    descripcion:
      "Cada equip decideix quines assegurances paga. Quan arriba l'imprevist, qui està cobert respira; qui no, paga. Guanya qui més s'assegura o qui més arrisca?",
    modo: 'classe per equips · projector',
    nota_aula:
      'El professor projecta la pantalla i porta el marcador; cada equip decideix la seua cobertura ronda a ronda.',
  },
  insider: {
    title: 'Insider',
    descripcion:
      'Deducció social: el grup endevina una paraula; algú sap la resposta… i ningú ho ha de notar.',
    modo: 'multijugador (party)',
    nota_aula:
      "El professor obri aquesta pàgina al projector i veu un codi de 4 lletres. L'alumnat entra a /juegos/insider/ amb aquest codi des del mòbil.",
  },
};

/** Overlay the Valencian strings onto a game when locale is 'ca'. */
export function localizeJuego(j: Juego, locale: Locale): Juego {
  return locale === 'es' ? j : { ...j, ...JUEGOS_CA[j.slug] };
}
