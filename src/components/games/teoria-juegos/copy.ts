// src/components/games/teoria-juegos/copy.ts
/**
 * Hub and shell wording for /juegos/teoria-juegos/, ES + CA. Each experiment's
 * own screen copy lives next to its component; what is shared — the hub cards,
 * the mode switch and the buttons every screen uses — is here so the six read
 * as one game rather than six.
 */
import type { MiniId } from '@/lib/games/teoria-juegos/types';
import type { Locale } from '@/i18n/locale';

export interface MiniCopy {
  title: string;
  /** One line on the hub card. */
  tagline: string;
  /** What the two modes do, shown on the card and in the shell. */
  solo: string;
  aula: string;
}

export interface HubCopy {
  kicker: string;
  title: string;
  lede: string;
  modoSolo: string;
  modoAula: string;
  modoSoloPie: string;
  modoAulaPie: string;
  elegir: string;
  volver: string;
  enPapel: string;
  minis: Record<MiniId, MiniCopy>;
}

export const COPY: Record<Locale, HubCopy> = {
  es: {
    kicker: 'Seis clásicos · 1 jugador o clase entera',
    title: 'Teoría de juegos',
    lede:
      'Los experimentos que fundaron la teoría de juegos, jugables en clase. Cada uno se puede jugar en solitario contra estrategias programadas o proyectarlo y hacerlo con toda la clase a mano alzada.',
    modoSolo: 'Yo solo',
    modoAula: 'Con la clase',
    modoSoloPie: 'Juegas contra estrategias programadas. Sirve para prepararlo antes de llevarlo a clase.',
    modoAulaPie:
      'Proyecta la pantalla, el alumnado vota a mano alzada y tú escribes los números. La pantalla hace el análisis.',
    elegir: 'Abrir →',
    volver: '← Todos los experimentos',
    enPapel: 'También en papel:',
    minis: {
      dilema: {
        title: 'El dilema del prisionero',
        tagline: 'Traicionar siempre compensa. Si todos traicionan, todos pierden.',
        solo: 'Rondas contra una estrategia rival: tú eliges cooperar o traicionar.',
        aula: 'La clase vota y la pantalla calcula a quién le sale a cuenta cada opción.',
      },
      cazaciervo: {
        title: 'La caza del ciervo',
        tagline: 'Cooperar es lo mejor… si el otro coopera. Aquí el problema es fiarse.',
        solo: 'La misma mecánica que el dilema, con los pagos cambiados: dos equilibrios.',
        aula: 'La clase vota y se ve cómo el resultado depende de lo que hagan los demás.',
      },
      belleza: {
        title: 'El concurso de belleza',
        tagline: 'Elige un número. Gana quien más se acerque a 2/3 de la media.',
        solo: 'Cuatro rondas contra rivales que van razonando cada vez un paso más.',
        aula: 'Escribe los números de la clase y verás en qué escalón de razonamiento está cada cual.',
      },
      reparto: {
        title: 'Ultimátum y dictador',
        tagline: 'Repartes 100 €. En el ultimátum, el otro puede quemarlo todo.',
        solo: 'Puedes jugar de proponente o de quien decide si acepta.',
        aula: 'Con las ofertas y los mínimos de la clase sale la oferta que más renta.',
      },
      'bien-publico': {
        title: 'El bien público',
        tagline: 'Aportar al fondo común mejora al grupo y empeora a quien aporta.',
        solo: 'Ocho rondas con gorrones, altruistas y cooperadores condicionales.',
        aula: 'Escribe lo que ha aportado cada cual y se ve lo que la clase deja sobre la mesa.',
      },
      subastas: {
        title: 'Las cuatro subastas',
        tagline: 'Inglesa, holandesa y sobre cerrado. Distinta puja, misma recaudación.',
        solo: 'Ocho lotes con tu valor privado, rotando entre los cuatro formatos.',
        aula: 'Con las pujas de la clase, quién gana y cuánto paga bajo cada reglamento.',
      },
    },
  },
  ca: {
    kicker: 'Sis clàssics · 1 jugador o classe sencera',
    title: 'Teoria de jocs',
    lede:
      "Els experiments que van fundar la teoria de jocs, jugables a classe. Cadascun es pot jugar en solitari contra estratègies programades o projectar-lo i fer-lo amb tota la classe a mà alçada.",
    modoSolo: 'Jo tot sol',
    modoAula: 'Amb la classe',
    modoSoloPie: "Jugues contra estratègies programades. Serveix per a preparar-ho abans de portar-ho a classe.",
    modoAulaPie:
      "Projecta la pantalla, l'alumnat vota a mà alçada i tu escrius els números. La pantalla fa l'anàlisi.",
    elegir: 'Obri →',
    volver: '← Tots els experiments',
    enPapel: 'També en paper:',
    minis: {
      dilema: {
        title: 'El dilema del presoner',
        tagline: 'Trair sempre compensa. Si tots traeixen, tots perden.',
        solo: 'Rondes contra una estratègia rival: tries cooperar o trair.',
        aula: 'La classe vota i la pantalla calcula a qui li ix a compte cada opció.',
      },
      cazaciervo: {
        title: 'La caça del cérvol',
        tagline: "Cooperar és el millor… si l'altre coopera. Ací el problema és fiar-se'n.",
        solo: 'La mateixa mecànica que el dilema, amb els pagaments canviats: dos equilibris.',
        aula: 'La classe vota i es veu com el resultat depén del que facen els altres.',
      },
      belleza: {
        title: 'El concurs de bellesa',
        tagline: "Tria un número. Guanya qui més s'acoste a 2/3 de la mitjana.",
        solo: 'Quatre rondes contra rivals que van raonant cada vegada un pas més.',
        aula: "Escriu els números de la classe i veuràs en quin escaló de raonament està cadascú.",
      },
      reparto: {
        title: 'Ultimàtum i dictador',
        tagline: "Reparteixes 100 €. A l'ultimàtum, l'altre ho pot cremar tot.",
        solo: 'Pots jugar de proponent o de qui decideix si accepta.',
        aula: 'Amb les ofertes i els mínims de la classe ix la oferta que més renda.',
      },
      'bien-publico': {
        title: 'El bé públic',
        tagline: 'Aportar al fons comú millora el grup i empitjora qui aporta.',
        solo: 'Huit rondes amb gorrers, altruistes i cooperadors condicionals.',
        aula: 'Escriu el que ha aportat cadascú i es veu el que la classe deixa damunt la taula.',
      },
      subastas: {
        title: 'Les quatre subhastes',
        tagline: 'Anglesa, holandesa i sobre tancat. Distinta puja, mateixa recaptació.',
        solo: 'Huit lots amb el teu valor privat, rotant entre els quatre formats.',
        aula: 'Amb les pujes de la classe, qui guanya i quant paga sota cada reglament.',
      },
    },
  },
};

/** Buttons and labels every screen shares. */
export const BOTONES: Record<Locale, Record<string, string>> = {
  es: {
    jugar: 'Jugar',
    siguiente: 'Siguiente ronda',
    reiniciar: 'Volver a empezar',
    empezar: 'Empezar',
    calcular: 'Calcular',
    limpiar: 'Limpiar',
    ronda: 'Ronda',
    de: 'de',
    tu: 'Tú',
    rival: 'Rival',
    total: 'Total',
    media: 'Media',
    clase: 'Datos de la clase',
    resultado: 'Resultado',
    debrief: 'Para comentar en clase',
    sinDatos: 'Escribe los números de la clase para ver el análisis.',
  },
  ca: {
    jugar: 'Jugar',
    siguiente: 'Ronda següent',
    reiniciar: 'Torna a començar',
    empezar: 'Comença',
    calcular: 'Calcula',
    limpiar: 'Neteja',
    ronda: 'Ronda',
    de: 'de',
    tu: 'Tu',
    rival: 'Rival',
    total: 'Total',
    media: 'Mitjana',
    clase: 'Dades de la classe',
    resultado: 'Resultat',
    debrief: 'Per a comentar a classe',
    sinDatos: "Escriu els números de la classe per a veure l'anàlisi.",
  },
};
