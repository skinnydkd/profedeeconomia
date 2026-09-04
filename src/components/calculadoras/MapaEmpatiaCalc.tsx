/** @jsxImportSource preact */
import { useMemo, useState } from 'preact/hooks';
import { type Locale } from '@/i18n/locale';
import { evaluar, ZONAS, type Entrada, type Zona } from '../../lib/calc/mapa-empatia';

/** UI strings, Valencian (AVL) alongside the ES source. */
export const COPY = {
  es: {
    intro: 'Un mapa de empatía describe a una persona concreta, no a un público objetivo. Ponle nombre, edad y situación: en cuanto se convierte en «los jóvenes» deja de servir para decidir nada.',
    personaTitulo: 'De quién estás hablando',
    personaPlaceholder: 'Marta, 34 años, trabaja fuera del pueblo y come cada día en la oficina',
    sinNombre: 'Todavía no has descrito a nadie. Un mapa sin persona acaba siendo una lista de suposiciones sobre todo el mundo.',
    zonas: {
      'piensa-siente': 'Qué piensa y siente',
      ve: 'Qué ve',
      oye: 'Qué oye',
      'dice-hace': 'Qué dice y hace',
      dolores: 'Qué le duele',
      ganancias: 'Qué querría conseguir',
    },
    preguntas: {
      'piensa-siente': 'Lo que de verdad le preocupa y no dice en voz alta',
      ve: 'Su entorno, lo que ve hacer a los demás, la oferta que tiene alrededor',
      oye: 'Qué le dicen sus amigos, su familia, quién le influye',
      'dice-hace': 'Cómo se comporta en público y qué contradice de lo que piensa',
      dolores: 'Frustraciones, obstáculos, riesgos que le dan miedo',
      ganancias: 'Qué considera un éxito, qué le facilitaría la vida de verdad',
    },
    anyadir: 'Añadir',
    entradaPlaceholder: 'Una observación por línea, corta',
    quitar: 'Quitar',
    resumenTitulo: 'Cómo va el mapa',
    total: 'Observaciones',
    vacias: 'Zonas sin nada',
    avisoObservable: 'Has descrito lo que se ve por fuera pero no lo que le duele ni lo que querría conseguir. Ese es el fallo más común: el mapa retrata a una persona y no dice qué necesita, así que no se puede derivar ninguna propuesta de valor de él.',
    listoTitulo: 'Ya se puede pasar a la propuesta',
    listoTexto: 'Con dolores y ganancias escritos, la propuesta de valor sale sola: es lo que quita uno de esos dolores o consigue una de esas ganancias mejor que lo que esa persona usa hoy.',
    faltanClaves: 'Faltan las dos zonas que alimentan la propuesta de valor: qué le duele y qué querría conseguir.',
    erroresTitulo: 'Los dos errores de siempre',
    errores: 'El primero es describir el producto en lugar de a la persona: si en alguna casilla aparece tu proyecto, esa observación sobra. El segundo es inventar: un mapa de empatía se rellena con lo que has oído en entrevistas, no con lo que supones. Marca de otro color lo que no has comprobado.',
    presets: 'Ejemplos',
    presetVacio: 'Empezar de cero',
    presetEjemplo: 'Un mapa a medias',
  },
  ca: {
    intro: "Un mapa d'empatia descriu una persona concreta, no un públic objectiu. Posa-li nom, edat i situació: tan bon punt es convertix en «els jóvens» deixa de servir per a decidir res.",
    personaTitulo: 'De qui estàs parlant',
    personaPlaceholder: 'Marta, 34 anys, treballa fora del poble i menja cada dia a l\'oficina',
    sinNombre: "Encara no has descrit ningú. Un mapa sense persona acaba sent una llista de suposicions sobre tothom.",
    zonas: {
      'piensa-siente': 'Què pensa i sent',
      ve: 'Què veu',
      oye: 'Què sent',
      'dice-hace': 'Què diu i fa',
      dolores: 'Què li fa mal',
      ganancias: 'Què voldria aconseguir',
    },
    preguntas: {
      'piensa-siente': 'El que de veritat li preocupa i no diu en veu alta',
      ve: "El seu entorn, el que veu fer als altres, l'oferta que té al voltant",
      oye: 'Què li diuen els seus amics, la seua família, qui li influïx',
      'dice-hace': 'Com es comporta en públic i què contradiu del que pensa',
      dolores: 'Frustracions, obstacles, riscos que li fan por',
      ganancias: 'Què considera un èxit, què li facilitaria la vida de veritat',
    },
    anyadir: 'Afegir',
    entradaPlaceholder: 'Una observació per línia, curta',
    quitar: 'Llevar',
    resumenTitulo: 'Com va el mapa',
    total: 'Observacions',
    vacias: 'Zones sense res',
    avisoObservable: "Has descrit el que es veu per fora però no el que li fa mal ni el que voldria aconseguir. Eixe és l'error més comú: el mapa retrata una persona i no diu què necessita, així que no se'n pot derivar cap proposta de valor.",
    listoTitulo: 'Ja es pot passar a la proposta',
    listoTexto: 'Amb dolors i guanys escrits, la proposta de valor ix sola: és el que lleva un d\'eixos dolors o aconseguix un d\'eixos guanys millor que el que eixa persona fa servir hui.',
    faltanClaves: 'Falten les dues zones que alimenten la proposta de valor: què li fa mal i què voldria aconseguir.',
    erroresTitulo: 'Els dos errors de sempre',
    errores: "El primer és descriure el producte en compte de la persona: si en alguna casella apareix el teu projecte, eixa observació sobra. El segon és inventar: un mapa d'empatia s'ompli amb el que has sentit en entrevistes, no amb el que supose. Marca d'un altre color el que no has comprovat.",
    presets: 'Exemples',
    presetVacio: 'Començar de zero',
    presetEjemplo: 'Un mapa a mitges',
  },
} as const;

interface Props { locale?: Locale }
const txt = (e: Event) => (e.currentTarget as HTMLInputElement).value;

const EJEMPLO: Entrada[] = [
  { zona: 've', texto: 'Compañeros que traen táper y otros que piden a domicilio cada día' },
  { zona: 'oye', texto: 'Que comer fuera cada día sale carísimo' },
  { zona: 'dice-hace', texto: 'Dice que va a organizarse el domingo y acaba pidiendo comida' },
];

export default function MapaEmpatiaCalc({ locale = 'es' }: Props) {
  const t = COPY[locale];
  const [persona, setPersona] = useState('');
  const [entradas, setEntradas] = useState<Entrada[]>(EJEMPLO);
  const [borrador, setBorrador] = useState<Record<string, string>>({});

  const r = useMemo(() => evaluar(persona, entradas), [persona, entradas]);

  const anyadir = (z: Zona) => {
    const texto = (borrador[z] ?? '').trim();
    if (!texto) return;
    setEntradas((prev) => [...prev, { zona: z, texto }]);
    setBorrador((b) => ({ ...b, [z]: '' }));
  };

  return (
    <div class="calc">
      <p class="me__intro">{t.intro}</p>

      <div class="calc__presets">
        <button type="button" class="calc__btn calc__btn--ghost" onClick={() => { setEntradas([]); setPersona(''); }}>{t.presetVacio}</button>
        <button type="button" class="calc__btn calc__btn--ghost" onClick={() => setEntradas(EJEMPLO)}>{t.presetEjemplo}</button>
      </div>

      <label class="calc__field me__wide">
        <span class="calc__label">{t.personaTitulo}</span>
        <div class="calc__input-wrap">
          <input type="text" value={persona} placeholder={t.personaPlaceholder} onInput={(e) => setPersona(txt(e))} />
        </div>
      </label>
      {!r.tieneNombre && <div class="calc__tip calc__tip--warn">{t.sinNombre}</div>}

      <div class="me__grid">
        {ZONAS.map((z) => (
          <section class={`me__zona ${z === 'dolores' || z === 'ganancias' ? 'me__zona--clave' : ''}`} key={z}>
            <h3 class="me__zona-title">
              {t.zonas[z]}
              <span class="me__badge">{r.porZona[z]}</span>
            </h3>
            <p class="me__pregunta">{t.preguntas[z]}</p>
            <ul class="me__entradas">
              {entradas.map((e, i) => e.zona === z && (
                <li key={i}>
                  <span>{e.texto}</span>
                  <button type="button" class="me__quitar" aria-label={t.quitar}
                    onClick={() => setEntradas((prev) => prev.filter((_, j) => j !== i))}>×</button>
                </li>
              ))}
            </ul>
            <div class="me__add">
              <input type="text" value={borrador[z] ?? ''} placeholder={t.entradaPlaceholder}
                onInput={(e) => setBorrador((b) => ({ ...b, [z]: txt(e) }))}
                onKeyDown={(e) => { if ((e as KeyboardEvent).key === 'Enter') anyadir(z); }} />
              <button type="button" class="calc__btn calc__btn--ghost" onClick={() => anyadir(z)}>{t.anyadir}</button>
            </div>
          </section>
        ))}
      </div>

      <div class="calc__results">
        <div class="me__label">{t.resumenTitulo}</div>
        <div class="calc__metric-grid calc__metric-grid--three">
          <div class="calc__metric-mini">
            <span class="calc__metric-mini-label">{t.total}</span>
            <span class="calc__metric-mini-value">{r.total}</span>
          </div>
          <div class="calc__metric-mini">
            <span class="calc__metric-mini-label">{t.vacias}</span>
            <span class={`calc__metric-mini-value ${r.zonasVacias.length === 0 ? 'ok' : ''}`}>{r.zonasVacias.length}</span>
          </div>
          <div class="calc__metric-mini">
            <span class="calc__metric-mini-label">{t.listoTitulo}</span>
            <span class={`calc__metric-mini-value ${r.listoParaPropuesta ? 'ok' : 'fail'}`}>
              {r.listoParaPropuesta ? '✓' : '—'}
            </span>
          </div>
        </div>

        {r.soloObservable ? (
          <div class="calc__tip calc__tip--warn">{t.avisoObservable}</div>
        ) : r.listoParaPropuesta ? (
          <div class="calc__tip calc__tip--ok">{t.listoTexto}</div>
        ) : (
          <div class="calc__tip calc__tip--info">{t.faltanClaves}</div>
        )}

        <div class="calc__tip calc__tip--info">
          <strong>{t.erroresTitulo}</strong> {t.errores}
        </div>
      </div>

      <style>{`
        .me__intro { font-family: var(--font-sans); font-size: 0.95rem; color: var(--color-ink-soft, #5C4A3D); margin: 0 0 1rem; }
        .me__label {
          font-family: var(--font-sans); font-size: 0.8rem; font-weight: 600;
          letter-spacing: 0.04em; text-transform: uppercase;
          color: var(--color-ink-mute, #8A7868); margin: 1.2rem 0 0.5rem;
        }
        .me__wide { width: 100%; }
        .me__grid { display: grid; gap: 0.8rem; margin-top: 1.2rem; }
        @media (min-width: 720px) { .me__grid { grid-template-columns: repeat(2, 1fr); } }
        .me__zona {
          padding: 0.9rem 1rem;
          background: var(--color-paper, #FFFFFF);
          border: 1px solid var(--color-line, #E5D4BD);
          border-radius: 8px;
        }
        .me__zona--clave { background: var(--color-cream, #F5EDD9); }
        .me__zona-title {
          display: flex; align-items: center; justify-content: space-between; gap: 0.6rem;
          font-family: var(--font-sans); font-size: 0.95rem; font-weight: 700; margin: 0 0 0.25rem;
        }
        .me__badge {
          font-family: var(--font-mono, monospace); font-size: 0.75rem;
          background: var(--color-bg, #FBF6EC);
          border: 1px solid var(--color-line, #E5D4BD);
          border-radius: 10px; padding: 0.05rem 0.45rem;
        }
        .me__pregunta { font-family: var(--font-sans); font-size: 0.85rem; color: var(--color-ink-soft, #5C4A3D); margin: 0 0 0.6rem; }
        .me__entradas { list-style: none; margin: 0 0 0.6rem; padding: 0; display: grid; gap: 0.3rem; font-family: var(--font-sans); font-size: 0.88rem; }
        .me__entradas li { display: flex; gap: 0.5rem; align-items: flex-start; }
        .me__entradas li span { flex: 1; }
        .me__quitar {
          border: 1px solid var(--color-line, #E5D4BD); background: transparent;
          border-radius: 4px; cursor: pointer; line-height: 1; padding: 0 0.35rem;
          color: var(--color-ink-mute, #8A7868);
        }
        .me__add { display: flex; gap: 0.4rem; }
        .me__add input { flex: 1; min-width: 0; }
      `}</style>
    </div>
  );
}
