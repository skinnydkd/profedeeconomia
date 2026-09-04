/** @jsxImportSource preact */
import { useMemo, useState } from 'preact/hooks';
import {
  criterioDecisivo,
  resolverMatriz,
  NOTA_MAX,
  NOTA_MIN,
  type Criterio,
  type Opcion,
} from '../../lib/calc/matriz-decision';
import { type Locale } from '@/i18n/locale';

/**
 * UI strings, Valencian (AVL) alongside the ES source.
 * Guarded by copy-parity.test.ts.
 */
export const COPY = {
  es: {
    intro: 'Escribe las opciones que estás valorando, los criterios que de verdad te importan y cuánto pesa cada uno. Puntúa del 1 al 5. La matriz no decide por ti: sirve para ver en qué se diferencian de verdad.',
    criterios: 'Tus criterios y cuánto pesan',
    opciones: 'Tus opciones',
    pesoCol: 'Peso',
    nuevoCriterio: 'Añadir criterio',
    nuevaOpcion: 'Añadir opción',
    quitar: 'Quitar',
    quitarCriterio: 'Quitar este criterio',
    quitarOpcion: 'Quitar esta opción',
    tabla: 'Puntúa cada opción en cada criterio (1 a 5)',
    resultado: 'Resultado',
    ganadora: 'La mejor puntuada',
    sinPeso: 'Ponle peso a algún criterio para poder comparar: si todo pesa cero, no hay nada que sopesar.',
    sinOpciones: 'Añade al menos dos opciones para compararlas.',
    empate: 'Empate técnico. La diferencia entre las dos primeras es tan pequeña que la matriz no ha decidido nada: o te faltan criterios importantes, o de verdad te da igual y puedes elegir por otra razón.',
    margen: 'Ventaja sobre la segunda',
    decisivo: 'El criterio que más la separa de la segunda',
    reset: 'Volver al ejemplo',
    comoSeCalcula: 'Cómo se calcula',
    formula: 'Puntuación = suma de (peso del criterio ÷ peso total) × nota de esa opción en ese criterio.',
    formulaNota: 'Los pesos se reparten solos, así que no hace falta que sumen 10 ni 100: puedes poner 5, 3 y 2, o 1, 1 y 8. La puntuación final queda en la misma escala de 1 a 5 que las notas.',
    aviso: 'Una matriz de decisión ordena tus razones, no las sustituye. Si el resultado te sienta mal, eso también es información: quizá había un criterio que no habías escrito.',
    ejCriterio: 'Criterio nuevo',
    ejOpcion: 'Opción nueva',
  },
  ca: {
    intro: "Escriu les opcions que estàs valorant, els criteris que de veritat t'importen i quant pesa cadascun. Puntua de l'1 al 5. La matriu no decidix per tu: servix per a veure en què es diferencien de veritat.",
    criterios: 'Els teus criteris i quant pesen',
    opciones: 'Les teues opcions',
    pesoCol: 'Pes',
    nuevoCriterio: 'Afegir criteri',
    nuevaOpcion: 'Afegir opció',
    quitar: 'Llevar',
    quitarCriterio: 'Llevar este criteri',
    quitarOpcion: 'Llevar esta opció',
    tabla: "Puntua cada opció en cada criteri (1 a 5)",
    resultado: 'Resultat',
    ganadora: 'La millor puntuada',
    sinPeso: 'Posa-li pes a algun criteri per a poder comparar: si tot pesa zero, no hi ha res a sospesar.',
    sinOpciones: 'Afig almenys dues opcions per a comparar-les.',
    empate: "Empat tècnic. La diferència entre les dues primeres és tan xicoteta que la matriu no ha decidit res: o et falten criteris importants, o de veritat t'és igual i pots triar per una altra raó.",
    margen: 'Avantatge sobre la segona',
    decisivo: 'El criteri que més la separa de la segona',
    reset: "Tornar a l'exemple",
    comoSeCalcula: 'Com es calcula',
    formula: 'Puntuació = suma de (pes del criteri ÷ pes total) × nota  d\'eixa opció en eixe criteri.',
    formulaNota: "Els pesos es reparteixen sols, així que no cal que sumen 10 ni 100: pots posar 5, 3 i 2, o 1, 1 i 8. La puntuació final queda en la mateixa escala d'1 a 5 que les notes.",
    aviso: "Una matriu de decisió ordena les teues raons, no les substituïx. Si el resultat et senta malament, això també és informació: potser hi havia un criteri que no havies escrit.",
    ejCriterio: 'Criteri nou',
    ejOpcion: 'Opció nova',
  },
} as const;

interface Props { locale?: Locale }

/** The example the unit uses: Bachillerato against a Grado Medio. */
const CRITERIOS_ES: Criterio[] = [
  { id: 'c1', nombre: 'Me gusta lo que estudiaría', peso: 5 },
  { id: 'c2', nombre: 'Salidas laborales en mi zona', peso: 3 },
  { id: 'c3', nombre: 'Lo tengo cerca de casa', peso: 2 },
];
const CRITERIOS_CA: Criterio[] = [
  { id: 'c1', nombre: "M'agrada el que estudiaria", peso: 5 },
  { id: 'c2', nombre: 'Eixides laborals a la meua zona', peso: 3 },
  { id: 'c3', nombre: 'El tinc prop de casa', peso: 2 },
];
const OPCIONES_ES: Opcion[] = [
  { id: 'o1', nombre: 'Bachillerato de Ciencias', notas: { c1: 4, c2: 4, c3: 5 } },
  { id: 'o2', nombre: 'Grado Medio de Sanidad', notas: { c1: 5, c2: 5, c3: 2 } },
];
const OPCIONES_CA: Opcion[] = [
  { id: 'o1', nombre: 'Batxillerat de Ciències', notas: { c1: 4, c2: 4, c3: 5 } },
  { id: 'o2', nombre: 'Grau Mitjà de Sanitat', notas: { c1: 5, c2: 5, c3: 2 } },
];

/**
 * Weighted decision matrix — name the criteria, weigh them, score each option.
 * Reports the ranking, how close the top two are and which criterion decided,
 * so a near-tie reads as "undecided" rather than as a verdict.
 * FOPP 4ESO · Unidad 4.
 */
export default function MatrizDecision({ locale = 'es' }: Props) {
  const c = COPY[locale];
  const seed = () => ({
    criterios: (locale === 'ca' ? CRITERIOS_CA : CRITERIOS_ES).map((x) => ({ ...x })),
    opciones: (locale === 'ca' ? OPCIONES_CA : OPCIONES_ES).map((x) => ({ ...x, notas: { ...x.notas } })),
  });

  const [criterios, setCriterios] = useState<Criterio[]>(() => seed().criterios);
  const [opciones, setOpciones] = useState<Opcion[]>(() => seed().opciones);
  const [nextId, setNextId] = useState(10);

  const r = useMemo(() => resolverMatriz(criterios, opciones), [criterios, opciones]);
  const decisivoId = useMemo(() => criterioDecisivo(r), [r]);
  const decisivo = criterios.find((x) => x.id === decisivoId);

  const setCriterio = (id: string, patch: Partial<Criterio>) =>
    setCriterios(criterios.map((x) => (x.id === id ? { ...x, ...patch } : x)));

  const setNota = (opcionId: string, criterioId: string, nota: number) =>
    setOpciones(opciones.map((o) =>
      o.id === opcionId ? { ...o, notas: { ...o.notas, [criterioId]: nota } } : o));

  const addCriterio = () => {
    const id = `c${nextId}`;
    setNextId(nextId + 1);
    setCriterios([...criterios, { id, nombre: c.ejCriterio, peso: 1 }]);
  };
  const addOpcion = () => {
    const id = `o${nextId}`;
    setNextId(nextId + 1);
    setOpciones([...opciones, { id, nombre: c.ejOpcion, notas: {} }]);
  };
  const delCriterio = (id: string) => setCriterios(criterios.filter((x) => x.id !== id));
  const delOpcion = (id: string) => setOpciones(opciones.filter((x) => x.id !== id));
  const reset = () => {
    const s = seed();
    setCriterios(s.criterios);
    setOpciones(s.opciones);
  };

  const ganadora = r.ranking[0];

  return (
    <div class="calc">
      <p class="md__intro">{c.intro}</p>

      <h3 class="md__section-title">{c.criterios}</h3>
      <ul class="md__criterios">
        {criterios.map((cr) => (
          <li class="md__criterio" key={cr.id}>
            <input
              class="md__text"
              type="text"
              value={cr.nombre}
              aria-label={c.criterios}
              onInput={(e) => setCriterio(cr.id, { nombre: (e.target as HTMLInputElement).value })}
            />
            <label class="md__peso">
              <span class="md__peso-label">{c.pesoCol}</span>
              <input
                type="number"
                min={0}
                max={10}
                step={1}
                value={cr.peso}
                onInput={(e) => setCriterio(cr.id, { peso: clampPeso((e.target as HTMLInputElement).value) })}
              />
            </label>
            <button
              type="button"
              class="md__del"
              title={c.quitarCriterio}
              aria-label={c.quitarCriterio}
              onClick={() => delCriterio(cr.id)}
            >
              ×
            </button>
          </li>
        ))}
      </ul>
      <button type="button" class="md__add" onClick={addCriterio}>{c.nuevoCriterio}</button>

      <h3 class="md__section-title">{c.tabla}</h3>
      <div class="md__table-wrap">
        <table class="md__table">
          <thead>
            <tr>
              <th scope="col">{c.opciones}</th>
              {criterios.map((cr) => (
                <th scope="col" key={cr.id}>{cr.nombre}</th>
              ))}
              <th scope="col">{c.resultado}</th>
              <th scope="col"><span class="md__sr">{c.quitar}</span></th>
            </tr>
          </thead>
          <tbody>
            {opciones.map((o) => {
              const p = r.ranking.find((x) => x.opcionId === o.id);
              return (
                <tr key={o.id}>
                  <th scope="row">
                    <input
                      class="md__text"
                      type="text"
                      value={o.nombre}
                      aria-label={c.opciones}
                      onInput={(e) =>
                        setOpciones(opciones.map((x) =>
                          x.id === o.id ? { ...x, nombre: (e.target as HTMLInputElement).value } : x))}
                    />
                  </th>
                  {criterios.map((cr) => (
                    <td key={cr.id}>
                      <input
                        class="md__nota"
                        type="number"
                        min={NOTA_MIN}
                        max={NOTA_MAX}
                        step={1}
                        value={o.notas[cr.id] ?? NOTA_MIN}
                        aria-label={`${o.nombre} · ${cr.nombre}`}
                        onInput={(e) => setNota(o.id, cr.id, clampNota((e.target as HTMLInputElement).value))}
                      />
                    </td>
                  ))}
                  <td class="md__total">{p?.total === null || p === undefined ? '—' : fmt(p.total)}</td>
                  <td>
                    <button
                      type="button"
                      class="md__del"
                      title={c.quitarOpcion}
                      aria-label={c.quitarOpcion}
                      onClick={() => delOpcion(o.id)}
                    >
                      ×
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div class="md__actions">
        <button type="button" class="md__add" onClick={addOpcion}>{c.nuevaOpcion}</button>
        <button type="button" class="md__add" onClick={reset}>{c.reset}</button>
      </div>

      {r.pesoTotal <= 0 && <p class="calc__warning">{c.sinPeso}</p>}
      {opciones.length < 2 && <p class="calc__warning">{c.sinOpciones}</p>}

      {ganadora && ganadora.total !== null && (
        <>
          <div class="calc__metric calc__metric--primary">
            <span class="calc__metric-label">{c.ganadora}</span>
            <span class="calc__metric-value">{ganadora.nombre}</span>
            <span class="calc__metric-detail">{fmt(ganadora.total)} / 5</span>
          </div>

          <div class="calc__metric-grid">
            {r.margen !== null && (
              <div class="calc__metric">
                <span class="calc__metric-label">{c.margen}</span>
                <span class="calc__metric-value">{fmt(r.margen)}</span>
              </div>
            )}
            {decisivo && (
              <div class="calc__metric">
                <span class="calc__metric-label">{c.decisivo}</span>
                <span class="calc__metric-value md__decisivo">{decisivo.nombre}</span>
              </div>
            )}
          </div>

          {r.esEmpateTecnico && <p class="calc__warning">{c.empate}</p>}
        </>
      )}

      <details class="calc__details">
        <summary>{c.comoSeCalcula}</summary>
        <div class="calc__formula">
          <p>{c.formula}</p>
          <p>{c.formulaNota}</p>
          <p>{c.aviso}</p>
        </div>
      </details>

      <style>{`
        .md__intro {
          font-family: var(--font-serif);
          font-size: 1.02rem;
          line-height: 1.6;
          color: var(--color-ink-soft, #5C4A3D);
          margin: 0 0 1.1rem;
        }
        .md__section-title {
          font-family: var(--font-sans);
          font-size: 0.82rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.09em;
          color: var(--color-ink-mute, #8A7868);
          margin: 1.5rem 0 0.7rem;
        }
        .md__criterios { list-style: none; padding: 0; margin: 0 0 0.7rem; display: grid; gap: 0.5rem; }
        .md__criterio { display: flex; align-items: center; gap: 0.6rem; }
        .md__text {
          flex: 1 1 auto;
          min-width: 0;
          font-family: var(--font-sans);
          font-size: 0.95rem;
          padding: 0.45rem 0.6rem;
          border: 1px solid var(--color-line, #E5D4BD);
          border-radius: 6px;
          background: var(--color-paper, #FFFFFF);
          color: var(--color-ink, #2A1F18);
        }
        .md__peso { display: flex; align-items: center; gap: 0.4rem; flex: 0 0 auto; }
        .md__peso-label {
          font-family: var(--font-sans);
          font-size: 0.72rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--color-ink-mute, #8A7868);
        }
        .md__peso input { width: 4.2rem; }
        .md__del {
          flex: 0 0 auto;
          width: 1.9rem;
          height: 1.9rem;
          line-height: 1;
          font-size: 1.1rem;
          color: var(--color-ink-mute, #8A7868);
          background: var(--color-paper, #FFFFFF);
          border: 1px solid var(--color-line, #E5D4BD);
          border-radius: 6px;
          cursor: pointer;
        }
        .md__del:hover { color: #B83A3A; border-color: #B83A3A; }
        .md__add {
          font-family: var(--font-sans);
          font-size: 0.86rem;
          font-weight: 600;
          color: var(--color-terra, #C44E2C);
          background: var(--color-paper, #FFFFFF);
          border: 1px solid var(--color-line, #E5D4BD);
          border-radius: 6px;
          padding: 0.4rem 0.85rem;
          cursor: pointer;
        }
        .md__add:hover { border-color: var(--color-terra, #C44E2C); }
        .md__actions { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 0.7rem; }
        .md__table-wrap { overflow-x: auto; }
        .md__table { width: 100%; border-collapse: collapse; font-family: var(--font-sans); font-size: 0.9rem; }
        .md__table th, .md__table td {
          border: 1px solid var(--color-line, #E5D4BD);
          padding: 0.4rem 0.5rem;
          text-align: left;
          vertical-align: middle;
        }
        .md__table thead th {
          font-size: 0.74rem;
          text-transform: uppercase;
          letter-spacing: 0.07em;
          color: var(--color-ink-mute, #8A7868);
          background: var(--color-bg, #FBF6EC);
        }
        .md__nota { width: 3.6rem; }
        .md__total {
          font-weight: 700;
          font-variant-numeric: tabular-nums;
          color: var(--color-ink, #2A1F18);
          background: var(--color-cream, #F5EDD9);
        }
        .md__decisivo { font-size: 1.2rem; line-height: 1.3; }
        .md__sr {
          position: absolute;
          width: 1px; height: 1px;
          padding: 0; margin: -1px;
          overflow: hidden;
          clip: rect(0 0 0 0);
          white-space: nowrap;
          border: 0;
        }
      `}</style>
    </div>
  );
}

/* ── Pure helpers ────────────────────────────────────────────────────────── */

function clampPeso(raw: string): number {
  const n = parseFloat(raw);
  if (!Number.isFinite(n)) return 0;
  return Math.min(10, Math.max(0, n));
}

function clampNota(raw: string): number {
  const n = parseFloat(raw);
  if (!Number.isFinite(n)) return NOTA_MIN;
  return Math.min(NOTA_MAX, Math.max(NOTA_MIN, n));
}

function fmt(n: number): string {
  return n.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
