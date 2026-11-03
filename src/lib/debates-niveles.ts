/**
 * Level descriptors for the four criteria that most debates share (DEB-D08).
 *
 * The debate rubric stored only a criterion and what it values, so the
 * printable sheet was a rating scale: «1 Inicio … 4 Excelente» with empty
 * boxes. Two teachers could score the same speech differently and students
 * could not know what a «3» asks for. The descriptors are written once here
 * and reused by every debate whose rubric names the criterion; a debate with
 * its own criteria keeps the plain scale until someone writes its levels.
 *
 * Keys are the criterion names exactly as the debates spell them, in both
 * languages (two Valencian spellings exist for «Uso de evidencia»).
 */
import type { Locale } from '@/i18n/locale';

/** Four descriptors, from level 1 (Inicio) to level 4 (Excelente). */
export type Niveles = readonly [string, string, string, string];

interface Criterio { es: Niveles; ca: Niveles }

const ARGUMENTOS: Criterio = {
  es: [
    'Da opiniones sin razones, o con razones que no vienen al caso.',
    'Da alguna razón pertinente, pero no la conecta con conceptos económicos.',
    'Sus argumentos son pertinentes y usan algún concepto económico con corrección.',
    'Encadena argumentos claros apoyados en conceptos precisos y distingue lo que se sabe de lo que se opina.',
  ],
  ca: [
    'Dona opinions sense raons, o amb raons que no vénen al cas.',
    'Dona alguna raó pertinent, però no la connecta amb conceptes econòmics.',
    'Els seus arguments són pertinents i usen algun concepte econòmic amb correcció.',
    "Encadena arguments clars recolzats en conceptes precisos i distingix el que se sap del que s'opina.",
  ],
};

const EVIDENCIA: Criterio = {
  es: [
    'No aporta datos ni ejemplos, o los que da no se pueden comprobar.',
    'Aporta algún dato o ejemplo, sin fuente o sin relación clara con lo que defiende.',
    'Apoya sus afirmaciones principales con datos o ejemplos pertinentes y dice de dónde salen.',
    'Usa datos de fuentes fiables y con fecha, los interpreta bien y reconoce sus límites.',
  ],
  ca: [
    'No aporta dades ni exemples, o els que dona no es poden comprovar.',
    'Aporta alguna dada o exemple, sense font o sense relació clara amb el que defén.',
    "Recolza les seues afirmacions principals amb dades o exemples pertinents i diu d'on ixen.",
    'Usa dades de fonts fiables i amb data, les interpreta bé i en reconeix els límits.',
  ],
};

const REFUTACION: Criterio = {
  es: [
    'Repite sus argumentos sin responder a los del otro equipo.',
    'Responde a veces, pero sin entrar en el fondo del argumento contrario.',
    'Responde a los argumentos principales del otro equipo con razones propias.',
    'Localiza el punto débil del argumento contrario, lo rebate con razones o datos y reconoce lo que tiene de válido.',
  ],
  ca: [
    "Repetix els seus arguments sense respondre als de l'altre equip.",
    "Respon a vegades, però sense entrar en el fons de l'argument contrari.",
    "Respon als arguments principals de l'altre equip amb raons pròpies.",
    "Localitza el punt feble de l'argument contrari, el rebat amb raons o dades i reconeix el que té de vàlid.",
  ],
};

const EXPRESION: Criterio = {
  es: [
    'Cuesta seguir lo que dice, o no respeta el turno ni el tiempo.',
    'Se le entiende, pero lee o se alarga, y a veces interrumpe.',
    'Habla con claridad, se ajusta al tiempo y respeta el turno.',
    'Habla con claridad y seguridad, adapta el discurso a quien escucha, respeta el tiempo y escucha a los demás.',
  ],
  ca: [
    'Costa seguir el que diu, o no respecta el torn ni el temps.',
    "S'entén, però llig o s'allarga, i a vegades interromp.",
    "Parla amb claredat, s'ajusta al temps i respecta el torn.",
    'Parla amb claredat i seguretat, adapta el discurs a qui escolta, respecta el temps i escolta la resta.',
  ],
};

const POR_CRITERIO: Record<string, Criterio> = {
  'Calidad de los argumentos': ARGUMENTOS,
  'Qualitat dels arguments': ARGUMENTOS,
  'Uso de evidencia': EVIDENCIA,
  "Ús d'evidències": EVIDENCIA,
  "Ús d'evidència": EVIDENCIA,
  'Capacidad de refutación': REFUTACION,
  'Capacitat de refutació': REFUTACION,
  'Expresión oral y turnos': EXPRESION,
  'Expressió oral i torns': EXPRESION,
};

/** Level descriptors for a rubric criterion, or undefined when none are written. */
export function nivelesDe(criterio: string, locale: Locale = 'es'): Niveles | undefined {
  return POR_CRITERIO[criterio.trim()]?.[locale];
}

/** Criterion names that have descriptors (for tests and tooling). */
export const CRITERIOS_CON_NIVELES = Object.keys(POR_CRITERIO);
