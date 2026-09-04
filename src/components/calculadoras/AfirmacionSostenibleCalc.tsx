/** @jsxImportSource preact */
import { useMemo, useState } from 'preact/hooks';
import { type Locale } from '@/i18n/locale';
import { analizar, type Afirmacion, type Senal } from '../../lib/calc/afirmacion-sostenible';

/** UI strings, Valencian (AVL) alongside the ES source. */
export const COPY = {
  es: {
    intro: 'Coge una afirmación de sostenibilidad real —de un envase, un anuncio, una web— y comprueba si se puede comprobar. Esto no dice si es verdad: dice si alguien podría verificarla.',
    afirmacionTitulo: 'La afirmación que estás analizando',
    afirmacionPlaceholder: 'Ejemplo: «Envase 100 % reciclable»',
    preguntasTitulo: 'Siete preguntas',
    preguntas: {
      tieneDato: '¿Da una cifra concreta, en lugar de un adjetivo?',
      defineAlcance: '¿Dice a qué parte del producto o de la actividad se refiere?',
      tieneReferencia: '¿Dice comparado con qué: un año base, un modelo anterior, la media del sector?',
      certificacionIndependiente: '¿La verifica un tercero independiente, o se la pone la propia empresa?',
      parteRelevante: '¿Se refiere a lo que más impacto tiene, o a un detalle?',
      masAllaDeLaLey: '¿Va más allá de lo que la ley ya obliga a hacer?',
      terminosVagos: '¿Usa términos sin definición: «eco», «natural», «verde», «responsable»?',
    },
    si: 'Sí',
    no: 'No',
    resultadoTitulo: 'Qué se puede decir',
    puntuacion: 'Preguntas que supera',
    lecturas: {
      verificable: 'Es una afirmación verificable: da datos, alcance, referencia y respaldo independiente. Que sea verificable no significa que sea cierta, pero al menos alguien puede comprobarlo.',
      incompleta: 'Le faltan piezas para poder comprobarla. No es necesariamente falsa ni malintencionada: muchas empresas honestas comunican mal. Pero tal como está, hay que creérsela.',
      'no-verificable': 'Con lo que dice, nadie puede comprobar nada. Eso no prueba que la empresa esté mintiendo, pero sí que la afirmación no sirve para decidir una compra informada.',
    },
    senalesTitulo: 'Lo que falta',
    senales: {
      'sin-dato': 'No hay ninguna cifra. Un adjetivo no se puede comprobar.',
      'sin-alcance': 'No se sabe a qué parte se refiere: ¿al envase, al producto, a la fábrica, a toda la empresa?',
      'sin-referencia': 'No dice comparado con qué. «Reducimos un 30 %» necesita un año base para significar algo.',
      'sin-certificacion': 'Es una autodeclaración. No es lo mismo que un sello verificado por un tercero independiente.',
      'parte-por-el-todo': 'Habla de un detalle mientras el grueso del impacto queda fuera. Es la forma más común de greenwashing y la más difícil de ver.',
      'cumplir-la-ley': 'Presenta como mérito algo que la normativa ya obliga a hacer.',
      'termino-vago': 'Usa palabras sin definición legal ni técnica. «Natural» no significa nada por sí solo.',
    },
    avisoTitulo: 'Lo que esta herramienta no hace',
    aviso: 'No verifica si la afirmación es cierta: comprueba si está formulada de manera que alguien pueda verificarla. Una empresa puede comunicar mal algo que hace de verdad, y otra puede escribir una afirmación impecable y falsa. Para saber cuál es cuál hay que ir a la fuente, no a la etiqueta.',
    contextoTitulo: 'Un matiz que conviene',
    contexto: 'Detectar greenwashing no es concluir que toda la sostenibilidad empresarial es mentira. Es exigir lo mismo que se exige a cualquier otra afirmación: datos, alcance y quién lo comprueba. Las empresas que lo hacen bien salen ganando con este criterio, no perdiendo.',
    presets: 'Ejemplos',
    presetVaga: '«Producto natural y respetuoso»',
    presetSolida: '«−32 % de agua por prenda frente a 2019, verificado»',
    presetParcial: '«Tapón reciclable» en una botella de un solo uso',
  },
  ca: {
    intro: "Agafa una afirmació de sostenibilitat real —d'un envàs, un anunci, una web— i comprova si es pot comprovar. Això no diu si és veritat: diu si algú la podria verificar.",
    afirmacionTitulo: 'L\'afirmació que estàs analitzant',
    afirmacionPlaceholder: 'Exemple: «Envàs 100 % reciclable»',
    preguntasTitulo: 'Set preguntes',
    preguntas: {
      tieneDato: 'Dona una xifra concreta, en compte d\'un adjectiu?',
      defineAlcance: "Diu a quina part del producte o de l'activitat es referix?",
      tieneReferencia: 'Diu comparat amb què: un any base, un model anterior, la mitjana del sector?',
      certificacionIndependiente: 'La verifica un tercer independent, o se la posa la mateixa empresa?',
      parteRelevante: 'Es referix al que més impacte té, o a un detall?',
      masAllaDeLaLey: 'Va més enllà del que la llei ja obliga a fer?',
      terminosVagos: 'Fa servir termes sense definició: «eco», «natural», «verd», «responsable»?',
    },
    si: 'Sí',
    no: 'No',
    resultadoTitulo: 'Què es pot dir',
    puntuacion: 'Preguntes que supera',
    lecturas: {
      verificable: 'És una afirmació verificable: dona dades, abast, referència i suport independent. Que siga verificable no vol dir que siga certa, però almenys algú ho pot comprovar.',
      incompleta: 'Li falten peces per a poder comprovar-la. No és necessàriament falsa ni malintencionada: moltes empreses honestes comuniquen malament. Però tal com està, cal creure-se-la.',
      'no-verificable': "Amb el que diu, ningú no pot comprovar res. Això no prova que l'empresa estiga mentint, però sí que l'afirmació no servix per a decidir una compra informada.",
    },
    senalesTitulo: 'El que falta',
    senales: {
      'sin-dato': 'No hi ha cap xifra. Un adjectiu no es pot comprovar.',
      'sin-alcance': "No se sap a quina part es referix: a l'envàs, al producte, a la fàbrica, a tota l'empresa?",
      'sin-referencia': 'No diu comparat amb què. «Reduïm un 30 %» necessita un any base per a significar alguna cosa.',
      'sin-certificacion': 'És una autodeclaració. No és el mateix que un segell verificat per un tercer independent.',
      'parte-por-el-todo': "Parla d'un detall mentres el gros de l'impacte queda fora. És la forma més comuna de greenwashing i la més difícil de vore.",
      'cumplir-la-ley': 'Presenta com a mèrit una cosa que la normativa ja obliga a fer.',
      'termino-vago': 'Fa servir paraules sense definició legal ni tècnica. «Natural» no significa res per si sol.',
    },
    avisoTitulo: 'El que esta ferramenta no fa',
    aviso: "No verifica si l'afirmació és certa: comprova si està formulada de manera que algú la puga verificar. Una empresa pot comunicar malament una cosa que fa de veritat, i una altra pot escriure una afirmació impecable i falsa. Per a saber quina és quina cal anar a la font, no a l'etiqueta.",
    contextoTitulo: 'Un matís que convé',
    contexto: "Detectar greenwashing no és concloure que tota la sostenibilitat empresarial és mentida. És exigir el mateix que s'exigix a qualsevol altra afirmació: dades, abast i qui ho comprova. Les empreses que ho fan bé ixen guanyant amb este criteri, no perdent.",
    presets: 'Exemples',
    presetVaga: '«Producte natural i respectuós»',
    presetSolida: '«−32 % d\'aigua per peça enfront de 2019, verificat»',
    presetParcial: '«Tap reciclable» en una botella d\'un sol ús',
  },
} as const;

interface Props { locale?: Locale }
type Clave = keyof Afirmacion;
const CLAVES: Clave[] = [
  'tieneDato', 'defineAlcance', 'tieneReferencia', 'certificacionIndependiente',
  'parteRelevante', 'masAllaDeLaLey', 'terminosVagos',
];

const PRESET_VAGA: Afirmacion = {
  tieneDato: false, defineAlcance: false, tieneReferencia: false,
  certificacionIndependiente: false, parteRelevante: false, masAllaDeLaLey: false, terminosVagos: true,
};
const PRESET_SOLIDA: Afirmacion = {
  tieneDato: true, defineAlcance: true, tieneReferencia: true,
  certificacionIndependiente: true, parteRelevante: true, masAllaDeLaLey: true, terminosVagos: false,
};
const PRESET_PARCIAL: Afirmacion = {
  tieneDato: true, defineAlcance: true, tieneReferencia: false,
  certificacionIndependiente: false, parteRelevante: false, masAllaDeLaLey: true, terminosVagos: false,
};

export default function AfirmacionSostenibleCalc({ locale = 'es' }: Props) {
  const t = COPY[locale];
  const [texto, setTexto] = useState('');
  const [a, setA] = useState<Afirmacion>(PRESET_VAGA);
  const r = useMemo(() => analizar(a), [a]);

  const cargar = (preset: Afirmacion, etiqueta: string) => { setA(preset); setTexto(etiqueta); };

  return (
    <div class="calc">
      <p class="as__intro">{t.intro}</p>

      <div class="calc__presets">
        <button type="button" class="calc__btn calc__btn--ghost" onClick={() => cargar(PRESET_VAGA, t.presetVaga)}>{t.presetVaga}</button>
        <button type="button" class="calc__btn calc__btn--ghost" onClick={() => cargar(PRESET_SOLIDA, t.presetSolida)}>{t.presetSolida}</button>
        <button type="button" class="calc__btn calc__btn--ghost" onClick={() => cargar(PRESET_PARCIAL, t.presetParcial)}>{t.presetParcial}</button>
      </div>

      <label class="calc__field as__wide">
        <span class="calc__label">{t.afirmacionTitulo}</span>
        <div class="calc__input-wrap">
          <input type="text" value={texto} placeholder={t.afirmacionPlaceholder}
            onInput={(e) => setTexto((e.currentTarget as HTMLInputElement).value)} />
        </div>
      </label>

      <div class="as__label">{t.preguntasTitulo}</div>
      <ul class="as__preguntas">
        {CLAVES.map((k) => (
          <li class="as__pregunta" key={k}>
            <span>{t.preguntas[k]}</span>
            <span class="as__toggle">
              <button type="button"
                class={`calc__btn calc__btn--ghost ${a[k] ? 'as__on' : ''}`}
                aria-pressed={a[k]}
                onClick={() => setA((p) => ({ ...p, [k]: true }))}>{t.si}</button>
              <button type="button"
                class={`calc__btn calc__btn--ghost ${!a[k] ? 'as__on' : ''}`}
                aria-pressed={!a[k]}
                onClick={() => setA((p) => ({ ...p, [k]: false }))}>{t.no}</button>
            </span>
          </li>
        ))}
      </ul>

      <div class="calc__results">
        <div class="as__label">{t.resultadoTitulo}</div>
        <div class="calc__metric calc__metric--primary">
          <span class="calc__metric-label">{t.puntuacion}</span>
          <span class="calc__metric-value">{r.puntuacion} / {r.total}</span>
        </div>

        <div class={`calc__tip ${r.lectura === 'verificable' ? 'calc__tip--ok' : r.lectura === 'incompleta' ? 'calc__tip--info' : 'calc__tip--warn'}`}>
          {t.lecturas[r.lectura]}
        </div>

        {r.senales.length > 0 && (
          <div class="as__panel">
            <div class="as__label">{t.senalesTitulo}</div>
            <ul class="as__senales">
              {r.senales.map((s: Senal) => <li key={s}>{t.senales[s]}</li>)}
            </ul>
          </div>
        )}

        <div class="calc__tip calc__tip--info">
          <strong>{t.avisoTitulo}</strong> {t.aviso}
        </div>
        <div class="calc__tip calc__tip--info">
          <strong>{t.contextoTitulo}</strong> {t.contexto}
        </div>
      </div>

      <style>{`
        .as__intro { font-family: var(--font-sans); font-size: 0.95rem; color: var(--color-ink-soft, #5C4A3D); margin: 0 0 1rem; }
        .as__label {
          font-family: var(--font-sans); font-size: 0.8rem; font-weight: 600;
          letter-spacing: 0.04em; text-transform: uppercase;
          color: var(--color-ink-mute, #8A7868); margin: 1.2rem 0 0.5rem;
        }
        .as__wide { width: 100%; }
        .as__preguntas { list-style: none; margin: 0; padding: 0; display: grid; gap: 0.4rem; }
        .as__pregunta {
          display: flex; align-items: center; justify-content: space-between; gap: 1rem;
          padding: 0.65rem 0.85rem;
          background: var(--color-paper, #FFFFFF);
          border: 1px solid var(--color-line, #E5D4BD);
          border-radius: 6px;
          font-family: var(--font-sans); font-size: 0.92rem;
        }
        .as__toggle { display: flex; gap: 0.3rem; flex: 0 0 auto; }
        .as__on {
          background: var(--color-terracotta, #C44E2C);
          border-color: var(--color-terracotta, #C44E2C);
          color: var(--color-paper, #FFFFFF);
        }
        .as__panel {
          margin-top: 1rem; padding: 1rem 1.1rem;
          background: var(--color-paper, #FFFFFF);
          border: 1px solid var(--color-line, #E5D4BD);
          border-radius: 8px;
        }
        .as__senales { margin: 0.3rem 0 0; padding-left: 1.2rem; font-family: var(--font-sans); font-size: 0.92rem; display: grid; gap: 0.35rem; }
      `}</style>
    </div>
  );
}
