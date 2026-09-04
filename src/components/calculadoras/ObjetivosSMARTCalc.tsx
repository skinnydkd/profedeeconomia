/** @jsxImportSource preact */
import { useMemo, useState } from 'preact/hooks';
import { type Locale } from '@/i18n/locale';
import { formatNumber } from '../../lib/calc/format';
import { evaluar, type Objetivo, type Letra } from '../../lib/calc/objetivos-smart';

/** UI strings, Valencian (AVL) alongside the ES source. SMART stays SMART. */
export const COPY = {
  es: {
    intro: 'Un objetivo que no se puede comprobar no es un objetivo, es una intención. Escribe el tuyo y mira qué letras aguanta: la herramienta revisa la forma, no la ambición.',
    formTitulo: 'Tu objetivo',
    accion: 'Qué vas a hacer',
    accionPlaceholder: 'Terminar el módulo de administración de sistemas',
    indicador: 'Qué cuentas para saber si avanzas',
    indicadorPlaceholder: 'temas aprobados',
    valorInicial: 'Dónde estás hoy',
    valorObjetivo: 'Dónde quieres estar',
    semanas: 'Semanas de plazo',
    ritmoActual: 'Ritmo que ya llevas (por semana)',
    ritmoAyuda: 'Si no lo sabes, deja 0: la herramienta no juzgará si es alcanzable, y lo dirá.',
    motivo: 'Por qué te importa a ti',
    motivoPlaceholder: 'Es el requisito para presentarme a las prácticas que quiero',
    resultadoTitulo: 'Las cinco letras',
    letras: {
      especifico: 'Específico',
      medible: 'Medible',
      alcanzable: 'Alcanzable',
      relevante: 'Relevante',
      temporal: 'Con plazo',
    },
    motivos: {
      ok: 'Correcto',
      vacio: 'Falta por escribir',
      'verbo-vago': 'Empieza por un verbo que describe una intención, no una acción: «mejorar» o «esforzarme» no se pueden marcar como hechos. Di qué harás exactamente.',
      'sin-avance': 'El punto de partida y el objetivo son el mismo número: no hay nada que medir.',
      'sin-plazo': 'Sin fecha, un objetivo se aplaza indefinidamente. Ponle semanas.',
      'ritmo-imposible': 'El ritmo que exige es más del triple del que ya llevas. Puede pasar, pero conviene mirarlo: o el plazo es corto o el objetivo es demasiado grande de una vez.',
    },
    puntuacion: 'Letras que cumple',
    ritmoTitulo: 'El ritmo que exige',
    ritmoNecesario: 'Por semana',
    exigencia: 'Frente al ritmo actual',
    avance: 'Avance total pedido',
    veces: 'veces',
    sinRitmo: 'Sin plazo no se puede calcular ningún ritmo.',
    sinComparacion: 'No has indicado el ritmo que llevas, así que no se compara nada. La letra A queda sin comprobar, no aprobada.',
    avisoTitulo: 'Lo que esto no revisa',
    aviso: 'La herramienta comprueba la forma del objetivo, nunca si vale la pena. Un objetivo puede pasar las cinco letras y ser el objetivo equivocado; y uno que suspenda la M puede ser el más importante de tu vida. Para eso está la conversación, no la pantalla.',
    presets: 'Ejemplos',
    presetBueno: 'Un objetivo que aguanta',
    presetVago: 'Un propósito de los de siempre',
    presetImposible: 'Ambicioso de más',
    comoSeCalcula: 'Cómo se calcula',
    formulaRitmoTitle: 'Ritmo necesario',
    formulaRitmoDesc: ': (objetivo − punto de partida) ÷ semanas.',
    formulaExigenciaTitle: 'Exigencia',
    formulaExigenciaDesc: ': ritmo necesario ÷ ritmo actual. Por encima de 3 se marca como aviso, no como error.',
  },
  ca: {
    intro: 'Un objectiu que no es pot comprovar no és un objectiu, és una intenció. Escriu el teu i mira quines lletres aguanta: la ferramenta revisa la forma, no l\'ambició.',
    formTitulo: 'El teu objectiu',
    accion: 'Què faràs',
    accionPlaceholder: "Acabar el mòdul d'administració de sistemes",
    indicador: 'Què comptes per a saber si avances',
    indicadorPlaceholder: 'temes aprovats',
    valorInicial: 'On estàs hui',
    valorObjetivo: 'On vols estar',
    semanas: 'Setmanes de termini',
    ritmoActual: 'Ritme que ja portes (per setmana)',
    ritmoAyuda: 'Si no ho saps, deixa 0: la ferramenta no jutjarà si és assolible, i ho dirà.',
    motivo: "Per què t'importa a tu",
    motivoPlaceholder: 'És el requisit per a presentar-me a les pràctiques que vull',
    resultadoTitulo: 'Les cinc lletres',
    letras: {
      especifico: 'Específic',
      medible: 'Mesurable',
      alcanzable: 'Assolible',
      relevante: 'Rellevant',
      temporal: 'Amb termini',
    },
    motivos: {
      ok: 'Correcte',
      vacio: 'Falta per escriure',
      'verbo-vago': "Comença per un verb que descriu una intenció, no una acció: «millorar» o «esforçar-me» no es poden marcar com a fets. Digues què faràs exactament.",
      'sin-avance': 'El punt de partida i l\'objectiu són el mateix número: no hi ha res a mesurar.',
      'sin-plazo': "Sense data, un objectiu s'ajorna indefinidament. Posa-li setmanes.",
      'ritmo-imposible': "El ritme que exigix és més del triple del que ja portes. Pot passar, però convé mirar-ho: o el termini és curt o l'objectiu és massa gran de colp.",
    },
    puntuacion: 'Lletres que complix',
    ritmoTitulo: 'El ritme que exigix',
    ritmoNecesario: 'Per setmana',
    exigencia: 'Enfront del ritme actual',
    avance: 'Avanç total demanat',
    veces: 'vegades',
    sinRitmo: 'Sense termini no es pot calcular cap ritme.',
    sinComparacion: "No has indicat el ritme que portes, així que no es compara res. La lletra A queda sense comprovar, no aprovada.",
    avisoTitulo: 'El que això no revisa',
    aviso: "La ferramenta comprova la forma de l'objectiu, mai si val la pena. Un objectiu pot passar les cinc lletres i ser l'objectiu equivocat; i un que suspenga la M pot ser el més important de la teua vida. Per a això està la conversa, no la pantalla.",
    presets: 'Exemples',
    presetBueno: 'Un objectiu que aguanta',
    presetVago: 'Un propòsit dels de sempre',
    presetImposible: 'Ambiciós de més',
    comoSeCalcula: 'Com es calcula',
    formulaRitmoTitle: 'Ritme necessari',
    formulaRitmoDesc: ': (objectiu − punt de partida) ÷ setmanes.',
    formulaExigenciaTitle: 'Exigència',
    formulaExigenciaDesc: ": ritme necessari ÷ ritme actual. Per damunt de 3 es marca com a avís, no com a error.",
  },
} as const;

interface Props { locale?: Locale }
const num = (e: Event) => Number((e.currentTarget as HTMLInputElement).value);
const txt = (e: Event) => (e.currentTarget as HTMLInputElement).value;
const ORDEN: Letra[] = ['especifico', 'medible', 'alcanzable', 'relevante', 'temporal'];

const PRESET_BUENO: Objetivo = {
  accion: 'Terminar el módulo de administración de sistemas',
  indicador: 'temas aprobados', valorInicial: 2, valorObjetivo: 10,
  semanas: 16, ritmoActual: 0.4,
  motivo: 'Es el requisito para presentarme a las prácticas que quiero',
};
const PRESET_VAGO: Objetivo = {
  accion: 'Mejorar en clase', indicador: '', valorInicial: 0, valorObjetivo: 0,
  semanas: 0, ritmoActual: 0, motivo: '',
};
const PRESET_IMPOSIBLE: Objetivo = {
  ...PRESET_BUENO, valorObjetivo: 10, semanas: 4, ritmoActual: 0.4,
};

export default function ObjetivosSMARTCalc({ locale = 'es' }: Props) {
  const t = COPY[locale];
  const [o, setO] = useState<Objetivo>(PRESET_BUENO);
  const r = useMemo(() => evaluar(o), [o]);
  const set = (k: keyof Objetivo, v: string | number) => setO((p) => ({ ...p, [k]: v }));

  return (
    <div class="calc">
      <p class="sm__intro">{t.intro}</p>

      <div class="calc__presets">
        <button type="button" class="calc__btn calc__btn--ghost" onClick={() => setO(PRESET_BUENO)}>{t.presetBueno}</button>
        <button type="button" class="calc__btn calc__btn--ghost" onClick={() => setO(PRESET_VAGO)}>{t.presetVago}</button>
        <button type="button" class="calc__btn calc__btn--ghost" onClick={() => setO(PRESET_IMPOSIBLE)}>{t.presetImposible}</button>
      </div>

      <div class="sm__label">{t.formTitulo}</div>
      <div class="calc__form">
        <label class="calc__field sm__wide">
          <span class="calc__label">{t.accion}</span>
          <div class="calc__input-wrap">
            <input type="text" value={o.accion} placeholder={t.accionPlaceholder} onInput={(e) => set('accion', txt(e))} />
          </div>
        </label>
        <label class="calc__field sm__wide">
          <span class="calc__label">{t.motivo}</span>
          <div class="calc__input-wrap">
            <input type="text" value={o.motivo} placeholder={t.motivoPlaceholder} onInput={(e) => set('motivo', txt(e))} />
          </div>
        </label>
      </div>
      <div class="calc__form sm__row">
        <label class="calc__field">
          <span class="calc__label">{t.indicador}</span>
          <div class="calc__input-wrap">
            <input type="text" value={o.indicador} placeholder={t.indicadorPlaceholder} onInput={(e) => set('indicador', txt(e))} />
          </div>
        </label>
        <label class="calc__field">
          <span class="calc__label">{t.valorInicial}</span>
          <div class="calc__input-wrap"><input type="number" step={1} value={o.valorInicial} onInput={(e) => set('valorInicial', num(e))} /></div>
        </label>
        <label class="calc__field">
          <span class="calc__label">{t.valorObjetivo}</span>
          <div class="calc__input-wrap"><input type="number" step={1} value={o.valorObjetivo} onInput={(e) => set('valorObjetivo', num(e))} /></div>
        </label>
        <label class="calc__field">
          <span class="calc__label">{t.semanas}</span>
          <div class="calc__input-wrap"><input type="number" min={0} step={1} value={o.semanas} onInput={(e) => set('semanas', num(e))} /></div>
        </label>
        <label class="calc__field">
          <span class="calc__label">{t.ritmoActual}</span>
          <div class="calc__input-wrap"><input type="number" min={0} step={0.1} value={o.ritmoActual} onInput={(e) => set('ritmoActual', num(e))} /></div>
        </label>
      </div>
      <p class="sm__note">{t.ritmoAyuda}</p>

      <div class="calc__results">
        <div class="sm__label">{t.resultadoTitulo}</div>
        <ul class="sm__letras">
          {ORDEN.map((l) => {
            const c = r.chequeos.find((x) => x.letra === l);
            return (
              <li class="sm__letra" key={l}>
                <span class={`sm__badge ${c?.cumple ? 'sm__badge--ok' : 'sm__badge--fail'}`}>
                  {t.letras[l].charAt(0)}
                </span>
                <div>
                  <strong>{t.letras[l]}</strong>
                  <p class="sm__motivo">{t.motivos[c?.motivo ?? 'vacio']}</p>
                </div>
              </li>
            );
          })}
        </ul>

        <div class="calc__metric-grid calc__metric-grid--three">
          <div class="calc__metric-mini">
            <span class="calc__metric-mini-label">{t.puntuacion}</span>
            <span class={`calc__metric-mini-value ${r.puntuacion === 5 ? 'ok' : ''}`}>{r.puntuacion} / 5</span>
          </div>
          <div class="calc__metric-mini">
            <span class="calc__metric-mini-label">{t.avance}</span>
            <span class="calc__metric-mini-value">{formatNumber(r.avance, 1)}</span>
          </div>
          <div class="calc__metric-mini">
            <span class="calc__metric-mini-label">{t.ritmoNecesario}</span>
            <span class="calc__metric-mini-value">{formatNumber(r.ritmoNecesario, 2)}</span>
          </div>
        </div>

        {!Number.isFinite(r.ritmoNecesario) ? (
          <div class="calc__tip calc__tip--warn">{t.sinRitmo}</div>
        ) : !Number.isFinite(r.exigencia) ? (
          <div class="calc__tip calc__tip--info">{t.sinComparacion}</div>
        ) : (
          <div class={`calc__tip ${r.exigencia > 3 ? 'calc__tip--warn' : 'calc__tip--ok'}`}>
            <strong>{t.exigencia}:</strong> × {formatNumber(r.exigencia, 2)} {t.veces}
          </div>
        )}

        <div class="calc__tip calc__tip--info">
          <strong>{t.avisoTitulo}</strong> {t.aviso}
        </div>
      </div>

      <details class="calc__details">
        <summary>{t.comoSeCalcula}</summary>
        <ul class="calc__formula">
          <li><strong>{t.formulaRitmoTitle}</strong>{t.formulaRitmoDesc}</li>
          <li><strong>{t.formulaExigenciaTitle}</strong>{t.formulaExigenciaDesc}</li>
        </ul>
      </details>

      <style>{`
        .sm__intro { font-family: var(--font-sans); font-size: 0.95rem; color: var(--color-ink-soft, #5C4A3D); margin: 0 0 1rem; }
        .sm__label {
          font-family: var(--font-sans); font-size: 0.8rem; font-weight: 600;
          letter-spacing: 0.04em; text-transform: uppercase;
          color: var(--color-ink-mute, #8A7868); margin: 1.2rem 0 0.5rem;
        }
        .sm__note { font-family: var(--font-sans); font-size: 0.87rem; color: var(--color-ink-soft, #5C4A3D); margin-top: 0.6rem; }
        .sm__row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.5rem 1rem; }
        @media (max-width: 640px) { .sm__row { grid-template-columns: 1fr; } }
        .sm__wide { width: 100%; }
        .sm__letras { list-style: none; margin: 0.4rem 0 1.2rem; padding: 0; display: grid; gap: 0.7rem; }
        .sm__letra {
          display: flex; gap: 0.8rem; align-items: flex-start;
          padding: 0.75rem 0.9rem;
          background: var(--color-paper, #FFFFFF);
          border: 1px solid var(--color-line, #E5D4BD);
          border-radius: 6px;
          font-family: var(--font-sans);
        }
        .sm__badge {
          flex: 0 0 auto;
          width: 26px; height: 26px;
          display: grid; place-items: center;
          border-radius: 50%;
          font-weight: 700; font-size: 0.85rem;
          color: var(--color-paper, #FFFFFF);
        }
        .sm__badge--ok { background: var(--color-eco1, #1F6E6E); }
        .sm__badge--fail { background: var(--color-terracotta, #C44E2C); }
        .sm__motivo { margin: 0.2rem 0 0; font-size: 0.87rem; color: var(--color-ink-soft, #5C4A3D); }
      `}</style>
    </div>
  );
}
