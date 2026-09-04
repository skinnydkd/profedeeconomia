/** @jsxImportSource preact */
import { useMemo, useState } from 'preact/hooks';
import { type Locale } from '@/i18n/locale';
import { formatNumber } from '../../lib/calc/format';
import { evaluar, PROMPTS, MINIMO_DIVERGENCIA, MINIMO_PROMPTS, type Idea, type Prompt } from '../../lib/calc/scamper';

/** UI strings, Valencian (AVL) alongside the ES source. SCAMPER stays SCAMPER. */
export const COPY = {
  es: {
    intro: 'Primero se abre y después se cierra: cuantas más ideas y desde más ángulos, mejor la que acabe ganando. La herramienta no te deja puntuar nada hasta que hay de dónde elegir, y esa es toda su gracia.',
    partidaTitulo: 'De qué partes',
    partidaPlaceholder: 'Un producto, un servicio o un proceso que ya exista',
    prompts: {
      sustituir: 'Sustituir',
      combinar: 'Combinar',
      adaptar: 'Adaptar',
      modificar: 'Modificar',
      'otros-usos': 'Otros usos',
      eliminar: 'Eliminar',
      reordenar: 'Reordenar',
    },
    preguntas: {
      sustituir: '¿Qué material, paso o persona se puede cambiar por otro?',
      combinar: '¿Qué se puede juntar con otra cosa que ya existe?',
      adaptar: '¿Qué idea de otro sector se puede traer aquí?',
      modificar: '¿Qué pasa si lo haces mucho más grande, más pequeño o más rápido?',
      'otros-usos': '¿Quién más podría usarlo, para algo que no habías pensado?',
      eliminar: '¿Qué parte se puede quitar entera sin que deje de servir?',
      reordenar: '¿Qué pasa si cambias el orden o lo haces al revés?',
    },
    anyadirIdea: 'Añadir idea',
    ideaPlaceholder: 'Escríbela corta. Ahora no se juzga.',
    quitar: 'Quitar',
    divergenciaTitulo: 'Fase de apertura',
    ideasTotales: 'Ideas',
    angulos: 'Ángulos usados',
    faltanIdeas: 'Faltan ideas',
    sinUsar: 'Todavía no has usado',
    reglaAbierta: 'Aún estás abriendo. Nada de juzgar: en esta fase una idea mala es tan útil como una buena, porque es la que hace que aparezca la siguiente. Hacen falta al menos {ideas} ideas desde {angulos} ángulos distintos.',
    reglaCerrada: 'Ya hay de dónde elegir. Ahora sí: puntúa cada idea del 1 al 5 en potencial y en esfuerzo, y ordena por la relación entre las dos.',
    convergenciaTitulo: 'Fase de cierre',
    colIdea: 'Idea',
    colPrompt: 'De dónde salió',
    colPotencial: 'Potencial',
    colEsfuerzo: 'Esfuerzo',
    colIndice: 'Potencial ÷ esfuerzo',
    rankingTitulo: 'Ordenadas',
    avisoTitulo: 'Por qué la herramienta no te deja puntuar antes',
    aviso: 'Porque juzgar mientras se generan ideas reduce drásticamente cuántas salen: la gente deja de proponer lo raro, y lo raro es donde suelen estar las buenas. Es el error más común de una lluvia de ideas y por eso está impedido a propósito, no por capricho.',
    ratioAviso: 'El índice ordena, no decide. Una idea con mucho potencial y mucho esfuerzo puede ser la correcta si es la única que resuelve el problema de verdad.',
    presets: 'Ejemplos',
    presetVacio: 'Empezar de cero',
    presetEjemplo: 'Una sesión a medias',
  },
  ca: {
    intro: "Primer s'obri i després es tanca: com més idees i des de més angles, millor la que acabe guanyant. La ferramenta no et deixa puntuar res fins que hi ha d'on triar, i eixa és tota la seua gràcia.",
    partidaTitulo: 'De què parteixes',
    partidaPlaceholder: 'Un producte, un servici o un procés que ja existisca',
    prompts: {
      sustituir: 'Substituir',
      combinar: 'Combinar',
      adaptar: 'Adaptar',
      modificar: 'Modificar',
      'otros-usos': 'Altres usos',
      eliminar: 'Eliminar',
      reordenar: 'Reordenar',
    },
    preguntas: {
      sustituir: 'Quin material, pas o persona es pot canviar per un altre?',
      combinar: 'Què es pot ajuntar amb una altra cosa que ja existix?',
      adaptar: "Quina idea d'un altre sector es pot portar ací?",
      modificar: 'Què passa si ho fas molt més gran, més xicotet o més ràpid?',
      'otros-usos': 'Qui més ho podria fer servir, per a alguna cosa que no havies pensat?',
      eliminar: 'Quina part es pot llevar sencera sense que deixe de servir?',
      reordenar: "Què passa si canvies l'orde o ho fas al revés?",
    },
    anyadirIdea: 'Afegir idea',
    ideaPlaceholder: 'Escriu-la curta. Ara no es jutja.',
    quitar: 'Llevar',
    divergenciaTitulo: "Fase d'obertura",
    ideasTotales: 'Idees',
    angulos: 'Angles utilitzats',
    faltanIdeas: 'Falten idees',
    sinUsar: 'Encara no has fet servir',
    reglaAbierta: "Encara estàs obrint. Res de jutjar: en esta fase una idea roïna és tan útil com una de bona, perquè és la que fa que aparega la següent. Calen almenys {ideas} idees des de {angulos} angles diferents.",
    reglaCerrada: "Ja hi ha d'on triar. Ara sí: puntua cada idea de l'1 al 5 en potencial i en esforç, i ordena per la relació entre les dues.",
    convergenciaTitulo: 'Fase de tancament',
    colIdea: 'Idea',
    colPrompt: "D'on va eixir",
    colPotencial: 'Potencial',
    colEsfuerzo: 'Esforç',
    colIndice: 'Potencial ÷ esforç',
    rankingTitulo: 'Ordenades',
    avisoTitulo: 'Per què la ferramenta no et deixa puntuar abans',
    aviso: "Perquè jutjar mentres es generen idees reduïx dràsticament quantes n'ixen: la gent deixa de proposar el rar, i el rar és on solen estar les bones. És l'error més comú d'una pluja d'idees i per això està impedit a propòsit, no per caprici.",
    ratioAviso: "L'índex ordena, no decidix. Una idea amb molt de potencial i molt d'esforç pot ser la correcta si és l'única que resol el problema de veritat.",
    presets: 'Exemples',
    presetVacio: 'Començar de zero',
    presetEjemplo: 'Una sessió a mitges',
  },
} as const;

interface Props { locale?: Locale }
const num = (e: Event) => Number((e.currentTarget as HTMLInputElement).value);
const txt = (e: Event) => (e.currentTarget as HTMLInputElement).value;

const EJEMPLO: Idea[] = [
  { prompt: 'sustituir', texto: 'Cambiar el envase de plástico por vidrio retornable' },
  { prompt: 'sustituir', texto: 'Que el reparto lo haga alguien del barrio en bici' },
  { prompt: 'combinar', texto: 'Juntarlo con el servicio de un comercio de al lado' },
  { prompt: 'adaptar', texto: 'Copiar el sistema de suscripción de las fruterías online' },
  { prompt: 'modificar', texto: 'Una versión de tamaño mínimo para probar' },
  { prompt: 'eliminar', texto: 'Quitar el catálogo entero y dejar solo tres opciones' },
];

export default function ScamperCalc({ locale = 'es' }: Props) {
  const t = COPY[locale];
  const [partida, setPartida] = useState('');
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [borrador, setBorrador] = useState<Record<string, string>>({});

  const r = useMemo(() => evaluar(ideas), [ideas]);

  const anyadir = (p: Prompt) => {
    const texto = (borrador[p] ?? '').trim();
    if (!texto) return;
    setIdeas((prev) => [...prev, { prompt: p, texto }]);
    setBorrador((b) => ({ ...b, [p]: '' }));
  };
  const puntuar = (i: number, campo: 'potencial' | 'esfuerzo', v: number) =>
    setIdeas((prev) => prev.map((x, j) => (j === i ? { ...x, [campo]: v } : x)));

  return (
    <div class="calc">
      <p class="sc__intro">{t.intro}</p>

      <div class="calc__presets">
        <button type="button" class="calc__btn calc__btn--ghost" onClick={() => { setIdeas([]); setPartida(''); }}>{t.presetVacio}</button>
        <button type="button" class="calc__btn calc__btn--ghost" onClick={() => setIdeas(EJEMPLO)}>{t.presetEjemplo}</button>
      </div>

      <label class="calc__field sc__wide">
        <span class="calc__label">{t.partidaTitulo}</span>
        <div class="calc__input-wrap">
          <input type="text" value={partida} placeholder={t.partidaPlaceholder} onInput={(e) => setPartida(txt(e))} />
        </div>
      </label>

      <div class="sc__label">{t.divergenciaTitulo}</div>
      <div class="calc__metric-grid calc__metric-grid--three">
        <div class="calc__metric-mini">
          <span class="calc__metric-mini-label">{t.ideasTotales}</span>
          <span class="calc__metric-mini-value">{r.total}</span>
        </div>
        <div class="calc__metric-mini">
          <span class="calc__metric-mini-label">{t.angulos}</span>
          <span class="calc__metric-mini-value">{r.promptsUsados} / {PROMPTS.length}</span>
        </div>
        <div class="calc__metric-mini">
          <span class="calc__metric-mini-label">{t.faltanIdeas}</span>
          <span class="calc__metric-mini-value">{Math.max(0, MINIMO_DIVERGENCIA - r.total)}</span>
        </div>
      </div>

      <div class={`calc__tip ${r.listoParaConverger ? 'calc__tip--ok' : 'calc__tip--info'}`}>
        {r.listoParaConverger
          ? t.reglaCerrada
          : t.reglaAbierta.replace('{ideas}', String(MINIMO_DIVERGENCIA)).replace('{angulos}', String(MINIMO_PROMPTS))}
      </div>

      {r.promptsSinUsar.length > 0 && (
        <p class="sc__note">
          {t.sinUsar}: {r.promptsSinUsar.map((p) => t.prompts[p]).join(', ')}.
        </p>
      )}

      <div class="sc__prompts">
        {PROMPTS.map((p) => (
          <section class="sc__prompt" key={p}>
            <h3 class="sc__prompt-title">
              {t.prompts[p]}
              <span class="sc__badge">{r.porPrompt[p]}</span>
            </h3>
            <p class="sc__pregunta">{t.preguntas[p]}</p>
            <ul class="sc__ideas">
              {ideas.map((idea, i) => idea.prompt === p && (
                <li key={i}>
                  <span>{idea.texto}</span>
                  <button type="button" class="sc__quitar" aria-label={t.quitar}
                    onClick={() => setIdeas((prev) => prev.filter((_, j) => j !== i))}>×</button>
                </li>
              ))}
            </ul>
            <div class="sc__add">
              <input type="text" value={borrador[p] ?? ''} placeholder={t.ideaPlaceholder}
                onInput={(e) => setBorrador((b) => ({ ...b, [p]: txt(e) }))}
                onKeyDown={(e) => { if ((e as KeyboardEvent).key === 'Enter') anyadir(p); }} />
              <button type="button" class="calc__btn calc__btn--ghost" onClick={() => anyadir(p)}>{t.anyadirIdea}</button>
            </div>
          </section>
        ))}
      </div>

      {r.listoParaConverger && (
        <div class="calc__results">
          <div class="sc__label">{t.convergenciaTitulo}</div>
          <div class="sc__scroll">
            <table class="calc__table">
              <thead>
                <tr>
                  <th scope="col">{t.colIdea}</th>
                  <th scope="col">{t.colPrompt}</th>
                  <th scope="col">{t.colPotencial}</th>
                  <th scope="col">{t.colEsfuerzo}</th>
                </tr>
              </thead>
              <tbody>
                {ideas.map((idea, i) => (
                  <tr key={i}>
                    <th scope="row">{idea.texto}</th>
                    <td>{t.prompts[idea.prompt]}</td>
                    <td><input type="number" min={1} max={5} step={1} value={idea.potencial ?? 0} onInput={(e) => puntuar(i, 'potencial', num(e))} /></td>
                    <td><input type="number" min={1} max={5} step={1} value={idea.esfuerzo ?? 0} onInput={(e) => puntuar(i, 'esfuerzo', num(e))} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div class="sc__label">{t.rankingTitulo}</div>
          <ol class="sc__ranking">
            {r.ranking.slice(0, 5).map((idea, i) => (
              <li key={i}>
                <strong>{idea.texto}</strong>{' — '}
                {t.colIndice}: {formatNumber(idea.indice, 2)}
              </li>
            ))}
          </ol>
          <div class="calc__tip calc__tip--info">{t.ratioAviso}</div>
        </div>
      )}

      <div class="calc__tip calc__tip--warn">
        <strong>{t.avisoTitulo}</strong> {t.aviso}
      </div>

      <style>{`
        .sc__intro { font-family: var(--font-sans); font-size: 0.95rem; color: var(--color-ink-soft, #5C4A3D); margin: 0 0 1rem; }
        .sc__label {
          font-family: var(--font-sans); font-size: 0.8rem; font-weight: 600;
          letter-spacing: 0.04em; text-transform: uppercase;
          color: var(--color-ink-mute, #8A7868); margin: 1.3rem 0 0.5rem;
        }
        .sc__note { font-family: var(--font-sans); font-size: 0.87rem; color: var(--color-ink-soft, #5C4A3D); margin: 0.6rem 0; }
        .sc__wide { width: 100%; }
        .sc__scroll { overflow-x: auto; }
        .sc__prompts { display: grid; gap: 0.8rem; margin-top: 1rem; }
        @media (min-width: 720px) { .sc__prompts { grid-template-columns: repeat(2, 1fr); } }
        .sc__prompt {
          padding: 0.9rem 1rem;
          background: var(--color-paper, #FFFFFF);
          border: 1px solid var(--color-line, #E5D4BD);
          border-radius: 8px;
        }
        .sc__prompt-title {
          display: flex; align-items: center; justify-content: space-between; gap: 0.6rem;
          font-family: var(--font-sans); font-size: 0.95rem; font-weight: 700;
          margin: 0 0 0.25rem;
        }
        .sc__badge {
          font-family: var(--font-mono, monospace); font-size: 0.75rem;
          background: var(--color-cream, #F5EDD9);
          border: 1px solid var(--color-line, #E5D4BD);
          border-radius: 10px; padding: 0.05rem 0.45rem;
        }
        .sc__pregunta { font-family: var(--font-sans); font-size: 0.85rem; color: var(--color-ink-soft, #5C4A3D); margin: 0 0 0.6rem; }
        .sc__ideas { list-style: none; margin: 0 0 0.6rem; padding: 0; display: grid; gap: 0.3rem; font-family: var(--font-sans); font-size: 0.88rem; }
        .sc__ideas li { display: flex; gap: 0.5rem; align-items: flex-start; }
        .sc__ideas li span { flex: 1; }
        .sc__quitar {
          border: 1px solid var(--color-line, #E5D4BD); background: transparent;
          border-radius: 4px; cursor: pointer; line-height: 1; padding: 0 0.35rem;
          color: var(--color-ink-mute, #8A7868);
        }
        .sc__add { display: flex; gap: 0.4rem; }
        .sc__add input { flex: 1; min-width: 0; }
        .sc__ranking { margin: 0.3rem 0 0.8rem; padding-left: 1.2rem; font-family: var(--font-sans); font-size: 0.93rem; display: grid; gap: 0.3rem; }
      `}</style>
    </div>
  );
}
