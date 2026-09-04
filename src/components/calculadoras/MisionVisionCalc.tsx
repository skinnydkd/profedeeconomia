/** @jsxImportSource preact */
import { useMemo, useState } from 'preact/hooks';
import { type Locale } from '@/i18n/locale';
import { evaluar, type Tipo, type Fallo } from '../../lib/calc/mision-vision';

/** UI strings, Valencian (AVL) alongside the ES source. */
export const COPY = {
  es: {
    intro: 'El test es de una sola pregunta: ¿podría firmar esta frase cualquier empresa de cualquier sector sin cambiar una palabra? Si la respuesta es sí, la frase no dice nada. Escribe las tuyas y compruébalo.',
    tipos: { mision: 'Misión', vision: 'Visión', valor: 'Un valor' },
    ayudas: {
      mision: 'Para qué existís hoy: qué hacéis y para quién',
      vision: 'Hacia dónde vais, con un horizonte temporal',
      valor: 'Una regla de comportamiento que se pueda comprobar',
    },
    placeholders: {
      mision: 'Reparamos bicicletas a precio accesible para vecinos del barrio y formamos en mecánica a jóvenes sin empleo',
      vision: 'Que en 2032 ningún joven del distrito salga del sistema educativo sin una salida profesional',
      valor: 'Publicamos cada año cuántas personas hemos formado y cuántas encontraron empleo',
    },
    resultadoTitulo: 'Qué pasa el test',
    aprobado: 'Pasa',
    suspenso: 'No pasa',
    fallos: {
      vacio: 'Todavía no hay frase, o es demasiado corta para decir nada.',
      'palabra-hueca': 'Está construida solo con palabras que valen para cualquiera. Excelencia, calidad, liderazgo o compromiso no informan de nada por sí solas: hay que decir qué hacéis exactamente.',
      'sin-para-quien': 'Dice qué hacéis pero no para quién. Una misión sin destinatario no permite decidir nada, porque no se sabe a quién hay que servir cuando haya que elegir.',
      'sin-horizonte': 'Una visión sin horizonte temporal es un deseo. Ponle un año o un plazo: es lo que la convierte en algo que se puede revisar.',
      'no-comprobable': 'Un valor es una regla de conducta, no una declaración de intenciones. «Creemos en la transparencia» no se puede comprobar; «publicamos cada año nuestros datos» sí.',
    },
    huecasEncontradas: 'Palabras que no aportan',
    resumen: 'Frases que pasan el test',
    consejoTitulo: 'La prueba definitiva',
    consejo: 'Tapa el nombre de tu proyecto y enséñale la frase a alguien de otro equipo. Si no puede adivinar de qué va vuestro proyecto, la frase no es vuestra: es de cualquiera. Y si la puede adivinar, ya tenéis una misión.',
    limiteTitulo: 'Lo que esto no comprueba',
    limite: 'Si la misión es la correcta, eso no lo sabe una pantalla. Una frase puede pasar el test y describir un proyecto que no debería existir. Lo que la herramienta garantiza es que la frase habla de vosotros y no de todo el mundo.',
    presets: 'Ejemplos',
    presetHueco: 'Las frases de siempre',
    presetBueno: 'Frases que aguantan',
    limpiar: 'Empezar de cero',
  },
  ca: {
    intro: "El test és d'una sola pregunta: podria signar esta frase qualsevol empresa de qualsevol sector sense canviar una paraula? Si la resposta és sí, la frase no diu res. Escriu les teues i comprova-ho.",
    tipos: { mision: 'Missió', vision: 'Visió', valor: 'Un valor' },
    ayudas: {
      mision: 'Per a què existiu hui: què feu i per a qui',
      vision: 'Cap on aneu, amb un horitzó temporal',
      valor: 'Una regla de comportament que es puga comprovar',
    },
    placeholders: {
      mision: 'Reparem bicicletes a preu accessible per a veïns del barri i formem en mecànica joves sense faena',
      vision: 'Que en 2032 cap jove del districte no isca del sistema educatiu sense una eixida professional',
      valor: 'Publiquem cada any quantes persones hem format i quantes van trobar faena',
    },
    resultadoTitulo: 'Què passa el test',
    aprobado: 'Passa',
    suspenso: 'No passa',
    fallos: {
      vacio: 'Encara no hi ha frase, o és massa curta per a dir res.',
      'palabra-hueca': "Està construïda només amb paraules que valen per a qualsevol. Excel·lència, qualitat, lideratge o compromís no informen de res per si soles: cal dir què feu exactament.",
      'sin-para-quien': "Diu què feu però no per a qui. Una missió sense destinatari no permet decidir res, perquè no se sap a qui cal servir quan calga triar.",
      'sin-horizonte': "Una visió sense horitzó temporal és un desig. Posa-li un any o un termini: és el que la convertix en una cosa que es pot revisar.",
      'no-comprobable': "Un valor és una regla de conducta, no una declaració d'intencions. «Creiem en la transparència» no es pot comprovar; «publiquem cada any les nostres dades» sí.",
    },
    huecasEncontradas: 'Paraules que no aporten',
    resumen: 'Frases que passen el test',
    consejoTitulo: 'La prova definitiva',
    consejo: "Tapa el nom del teu projecte i ensenya-li la frase a algú d'un altre equip. Si no pot endevinar de què va el vostre projecte, la frase no és vostra: és de qualsevol. I si la pot endevinar, ja teniu una missió.",
    limiteTitulo: 'El que això no comprova',
    limite: "Si la missió és la correcta, això no ho sap una pantalla. Una frase pot passar el test i descriure un projecte que no hauria d'existir. El que la ferramenta garantix és que la frase parla de vosaltres i no de tothom.",
    presets: 'Exemples',
    presetHueco: 'Les frases de sempre',
    presetBueno: 'Frases que aguanten',
    limpiar: 'Començar de zero',
  },
} as const;

interface Props { locale?: Locale }
const txt = (e: Event) => (e.currentTarget as HTMLTextAreaElement).value;
const TIPOS: Tipo[] = ['mision', 'vision', 'valor'];

const HUECO: Record<Tipo, string> = {
  mision: 'Ser líderes en excelencia y calidad',
  vision: 'Queremos ser una empresa que transforme el sector',
  valor: 'Creemos firmemente en la transparencia y el compromiso',
};
const BUENO: Record<Tipo, string> = {
  mision: 'Reparamos bicicletas a precio accesible para vecinos del barrio y formamos en mecánica a jóvenes sin empleo',
  vision: 'Que en 2032 ningún joven del distrito salga del sistema educativo sin una salida profesional',
  valor: 'Publicamos cada año cuántas personas hemos formado y cuántas encontraron empleo',
};

export default function MisionVisionCalc({ locale = 'es' }: Props) {
  const t = COPY[locale];
  const [textos, setTextos] = useState<Record<Tipo, string>>({ mision: '', vision: '', valor: '' });

  const r = useMemo(
    () => evaluar(TIPOS.map((tipo) => ({ tipo, texto: textos[tipo] }))),
    [textos],
  );

  return (
    <div class="calc">
      <p class="mv__intro">{t.intro}</p>

      <div class="calc__presets">
        <button type="button" class="calc__btn calc__btn--ghost" onClick={() => setTextos(HUECO)}>{t.presetHueco}</button>
        <button type="button" class="calc__btn calc__btn--ghost" onClick={() => setTextos(BUENO)}>{t.presetBueno}</button>
        <button type="button" class="calc__btn calc__btn--ghost" onClick={() => setTextos({ mision: '', vision: '', valor: '' })}>{t.limpiar}</button>
      </div>

      {TIPOS.map((tipo) => {
        const a = r.analisis.find((x) => x.tipo === tipo);
        return (
          <section class="mv__bloque" key={tipo}>
            <label class="calc__field mv__wide">
              <span class="calc__label">
                {t.tipos[tipo]} <span class="mv__ayuda">{t.ayudas[tipo]}</span>
              </span>
              <textarea rows={2} value={textos[tipo]} placeholder={t.placeholders[tipo]}
                onInput={(e) => setTextos((p) => ({ ...p, [tipo]: txt(e) }))} />
            </label>
            {a && textos[tipo].trim().length > 0 && (
              <div class={`calc__tip ${a.aprobado ? 'calc__tip--ok' : 'calc__tip--warn'}`}>
                <strong>{a.aprobado ? t.aprobado : t.suspenso}.</strong>{' '}
                {a.fallos.map((f: Fallo) => t.fallos[f]).join(' ')}
                {a.huecasEncontradas.length > 0 && !a.aprobado && (
                  <span class="mv__huecas"> {t.huecasEncontradas}: {a.huecasEncontradas.join(', ')}.</span>
                )}
              </div>
            )}
          </section>
        );
      })}

      <div class="calc__results">
        <div class="calc__metric calc__metric--primary">
          <span class="calc__metric-label">{t.resumen}</span>
          <span class="calc__metric-value">{r.aprobados} / {r.total}</span>
        </div>
        <div class="calc__tip calc__tip--info">
          <strong>{t.consejoTitulo}</strong> {t.consejo}
        </div>
        <div class="calc__tip calc__tip--info">
          <strong>{t.limiteTitulo}</strong> {t.limite}
        </div>
      </div>

      <style>{`
        .mv__intro { font-family: var(--font-sans); font-size: 0.95rem; color: var(--color-ink-soft, #5C4A3D); margin: 0 0 1rem; }
        .mv__bloque { margin-top: 1.2rem; }
        .mv__wide { width: 100%; }
        .mv__ayuda { display: block; font-weight: 400; font-size: 0.82rem; color: var(--color-ink-mute, #8A7868); text-transform: none; letter-spacing: 0; }
        .mv__bloque textarea {
          width: 100%; font-family: var(--font-sans); font-size: 0.95rem;
          padding: 0.6rem 0.7rem; border: 1px solid var(--color-line, #E5D4BD);
          border-radius: 6px; background: var(--color-paper, #FFFFFF);
          color: inherit; resize: vertical;
        }
        .mv__huecas { font-style: italic; }
      `}</style>
    </div>
  );
}
