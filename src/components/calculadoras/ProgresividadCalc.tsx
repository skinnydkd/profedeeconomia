/** @jsxImportSource preact */
import { useMemo, useState } from 'preact/hooks';
import { type Locale } from '@/i18n/locale';
import { formatEUR, formatPercent } from '../../lib/calc/format';
import { comparar, type Persona, type Tramo } from '../../lib/calc/progresividad';

/** UI strings, Valencian (AVL) alongside the ES source. IRPF and IVA stay as-is. */
export const COPY = {
  es: {
    intro: 'Dos personas, la misma compra y dos impuestos distintos. Mira qué porcentaje de su dinero se lleva cada uno: ahí está toda la diferencia entre un impuesto progresivo y uno que no lo es.',
    personasTitulo: 'Dos personas',
    colNombre: 'Quién',
    colRenta: 'Gana al año (€)',
    impuestoTitulo: 'El impuesto sobre lo que se gana',
    tramoHasta: 'Hasta (€)',
    tramoTipo: 'Tipo (%)',
    anyadirTramo: 'Añadir tramo',
    quitarTramo: 'Quitar el último',
    tramosAyuda: 'Los tramos son un ejemplo para clase, no la escala real de ningún impuesto. Cámbialos y mira qué pasa: es más útil que memorizar unos concretos.',
    consumoTitulo: 'El impuesto sobre lo que se compra',
    compra: 'Los dos compran lo mismo (€)',
    tipoConsumo: 'Tipo del impuesto (%)',
    resultadoTitulo: 'Qué paga cada una',
    colCuotaRenta: 'Impuesto sobre la renta',
    colTipoMedio: '% de su dinero',
    colCuotaConsumo: 'Impuesto de la compra',
    colPesoConsumo: '% de su dinero',
    colPesoTotal: 'Los dos juntos',
    progresivoTitulo: 'El impuesto sobre la renta es progresivo',
    progresivoTexto: 'Quien más gana no solo paga más euros: paga un porcentaje mayor de lo que gana. Eso es lo que significa progresivo, y es la diferencia con pagar simplemente más.',
    noProgresivo: 'Con estos tramos, las dos pagan el mismo porcentaje de lo que ganan. El impuesto es proporcional, no progresivo: cambia los tipos y mira qué hace falta para que lo sea.',
    regresivoTitulo: 'El impuesto de la compra es regresivo en la práctica',
    regresivoTexto: 'Los dos pagan exactamente los mismos euros, pero esos euros son una parte mucho mayor del dinero de quien menos gana. Por eso los productos básicos —pan, leche, fruta, medicamentos— tienen tipos reducidos.',
    noRegresivo: 'Sin compra no hay nada que comparar en el impuesto sobre el consumo. Pon un importe y vuelve a mirar.',
    directosTitulo: 'Directos e indirectos',
    directosTexto: 'El de la renta es un impuesto directo: grava lo que ganas y puede ajustarse a tu situación. El de la compra es indirecto: grava lo que consumes y es igual para todo el mundo, mire lo que mire tu nómina.',
    avisoTitulo: 'Ojo con la conclusión',
    aviso: 'Que un impuesto sea regresivo no significa que esté mal ni que haya que eliminarlo: los impuestos sobre el consumo recaudan mucho y son difíciles de evadir. Lo que dice el cálculo es a quién pesa más, que es información para decidir, no una sentencia.',
    sinDatos: 'Revisa los datos: las rentas tienen que ser mayores que cero, los tramos tienen que ir de menor a mayor y los tipos, entre 0 y 100 %.',
    presets: 'Ejemplos',
    presetBasico: 'Ejemplo de clase',
    presetPlano: 'Y si fuera un tipo único',
  },
  ca: {
    intro: "Dues persones, la mateixa compra i dos impostos diferents. Mira quin percentatge dels seus diners s'emporta cadascun: ahí està tota la diferència entre un impost progressiu i un que no ho és.",
    personasTitulo: 'Dues persones',
    colNombre: 'Qui',
    colRenta: "Guanya a l'any (€)",
    impuestoTitulo: 'L\'impost sobre el que es guanya',
    tramoHasta: 'Fins a (€)',
    tramoTipo: 'Tipus (%)',
    anyadirTramo: 'Afegir tram',
    quitarTramo: "Llevar l'últim",
    tramosAyuda: "Els trams són un exemple per a classe, no l'escala real de cap impost. Canvia'ls i mira què passa: és més útil que memoritzar-ne uns de concrets.",
    consumoTitulo: 'L\'impost sobre el que es compra',
    compra: 'Les dues compren el mateix (€)',
    tipoConsumo: "Tipus de l'impost (%)",
    resultadoTitulo: 'Què paga cadascuna',
    colCuotaRenta: 'Impost sobre la renda',
    colTipoMedio: '% dels seus diners',
    colCuotaConsumo: 'Impost de la compra',
    colPesoConsumo: '% dels seus diners',
    colPesoTotal: 'Els dos junts',
    progresivoTitulo: "L'impost sobre la renda és progressiu",
    progresivoTexto: 'Qui més guanya no només paga més euros: paga un percentatge major del que guanya. Això és el que vol dir progressiu, i és la diferència amb pagar simplement més.',
    noProgresivo: "Amb estos trams, les dues paguen el mateix percentatge del que guanyen. L'impost és proporcional, no progressiu: canvia els tipus i mira què cal perquè ho siga.",
    regresivoTitulo: "L'impost de la compra és regressiu a la pràctica",
    regresivoTexto: 'Les dues paguen exactament els mateixos euros, però eixos euros són una part molt major dels diners de qui menys guanya. Per això els productes bàsics —pa, llet, fruita, medicaments— tenen tipus reduïts.',
    noRegresivo: "Sense compra no hi ha res a comparar a l'impost sobre el consum. Posa un import i torna a mirar.",
    directosTitulo: 'Directes i indirectes',
    directosTexto: "El de la renda és un impost directe: grava el que guanyes i es pot ajustar a la teua situació. El de la compra és indirecte: grava el que consumixes i és igual per a tothom, mire el que mire la teua nòmina.",
    avisoTitulo: 'Compte amb la conclusió',
    aviso: "Que un impost siga regressiu no vol dir que estiga malament ni que calga eliminar-lo: els impostos sobre el consum recapten molt i són difícils d'evadir. El que diu el càlcul és a qui pesa més, que és informació per a decidir, no una sentència.",
    sinDatos: 'Revisa les dades: les rendes han de ser majors que zero, els trams han d\'anar de menor a major i els tipus, entre 0 i 100 %.',
    presets: 'Exemples',
    presetBasico: 'Exemple de classe',
    presetPlano: 'I si fora un tipus únic',
  },
} as const;

interface Props { locale?: Locale }
const num = (e: Event) => Number((e.currentTarget as HTMLInputElement).value);
const txt = (e: Event) => (e.currentTarget as HTMLInputElement).value;

const TRAMOS_BASE: Tramo[] = [
  { hasta: 12000, tipo: 0 },
  { hasta: 30000, tipo: 0.2 },
  { hasta: Infinity, tipo: 0.35 },
];
const TRAMOS_PLANO: Tramo[] = [{ hasta: Infinity, tipo: 0.2 }];

export default function ProgresividadCalc({ locale = 'es' }: Props) {
  const t = COPY[locale];
  const [personas, setPersonas] = useState<Persona[]>([
    { nombre: 'Ana', renta: 15000 },
    { nombre: 'Marcos', renta: 60000 },
  ]);
  const [tramos, setTramos] = useState<Tramo[]>(TRAMOS_BASE);
  const [compra, setCompra] = useState(300);
  const [tipoConsumo, setTipoConsumo] = useState(21);

  const r = useMemo(
    () => comparar(personas, tramos, compra, tipoConsumo / 100),
    [personas, tramos, compra, tipoConsumo],
  );

  const setP = (i: number, campo: keyof Persona, v: string | number) =>
    setPersonas((p) => p.map((x, j) => (j === i ? { ...x, [campo]: v } : x)));
  const setT = (i: number, campo: keyof Tramo, v: number) =>
    setTramos((p) => p.map((x, j) => (j === i ? { ...x, [campo]: v } : x)));

  return (
    <div class="calc">
      <p class="pg__intro">{t.intro}</p>

      <div class="calc__presets">
        <button type="button" class="calc__btn calc__btn--ghost" onClick={() => setTramos(TRAMOS_BASE)}>{t.presetBasico}</button>
        <button type="button" class="calc__btn calc__btn--ghost" onClick={() => setTramos(TRAMOS_PLANO)}>{t.presetPlano}</button>
      </div>

      <div class="pg__label">{t.personasTitulo}</div>
      <div class="pg__scroll">
        <table class="calc__table">
          <thead><tr><th scope="col">{t.colNombre}</th><th scope="col">{t.colRenta}</th></tr></thead>
          <tbody>
            {personas.map((p, i) => (
              <tr key={i}>
                <td><input type="text" value={p.nombre} onInput={(e) => setP(i, 'nombre', txt(e))} /></td>
                <td><input type="number" min={1} step={1000} value={p.renta} onInput={(e) => setP(i, 'renta', num(e))} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div class="pg__label">{t.impuestoTitulo}</div>
      <div class="pg__scroll">
        <table class="calc__table">
          <thead><tr><th scope="col">{t.tramoHasta}</th><th scope="col">{t.tramoTipo}</th></tr></thead>
          <tbody>
            {tramos.map((tr, i) => (
              <tr key={i}>
                <td>
                  {Number.isFinite(tr.hasta)
                    ? <input type="number" min={1} step={1000} value={tr.hasta} onInput={(e) => setT(i, 'hasta', num(e))} />
                    : <span class="pg__infinito">∞</span>}
                </td>
                <td><input type="number" min={0} max={100} step={1} value={Math.round(tr.tipo * 100)} onInput={(e) => setT(i, 'tipo', num(e) / 100)} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p class="pg__note">{t.tramosAyuda}</p>

      <div class="pg__label">{t.consumoTitulo}</div>
      <div class="calc__form pg__row">
        <label class="calc__field">
          <span class="calc__label">{t.compra}</span>
          <div class="calc__input-wrap"><input type="number" min={0} step={10} value={compra} onInput={(e) => setCompra(num(e))} /></div>
        </label>
        <label class="calc__field">
          <span class="calc__label">{t.tipoConsumo}</span>
          <div class="calc__input-wrap"><input type="number" min={0} max={100} step={1} value={tipoConsumo} onInput={(e) => setTipoConsumo(num(e))} /></div>
        </label>
      </div>

      <div class="calc__results">
        {!r.valido ? (
          <div class="calc__warning">{t.sinDatos}</div>
        ) : (
          <>
            <div class="pg__label">{t.resultadoTitulo}</div>
            <div class="pg__scroll">
              <table class="calc__table">
                <thead>
                  <tr>
                    <th scope="col">{t.colNombre}</th>
                    <th scope="col">{t.colCuotaRenta}</th>
                    <th scope="col">{t.colTipoMedio}</th>
                    <th scope="col">{t.colCuotaConsumo}</th>
                    <th scope="col">{t.colPesoConsumo}</th>
                    <th scope="col">{t.colPesoTotal}</th>
                  </tr>
                </thead>
                <tbody>
                  {r.personas.map((p, i) => (
                    <tr key={i}>
                      <th scope="row">{p.nombre}</th>
                      <td>{formatEUR(p.cuotaRenta, 0)}</td>
                      <td>{formatPercent(p.tipoMedioRenta, 1)}</td>
                      <td>{formatEUR(p.cuotaConsumo, 2)}</td>
                      <td>{formatPercent(p.pesoConsumo, 2)}</td>
                      <td>{formatPercent(p.pesoTotal, 1)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div class={`calc__tip ${r.rentaEsProgresiva ? 'calc__tip--ok' : 'calc__tip--info'}`}>
              <strong>{r.rentaEsProgresiva ? t.progresivoTitulo : ''}</strong>{' '}
              {r.rentaEsProgresiva ? t.progresivoTexto : t.noProgresivo}
            </div>

            <div class={`calc__tip ${r.consumoEsRegresivo ? 'calc__tip--warn' : 'calc__tip--info'}`}>
              <strong>{r.consumoEsRegresivo ? t.regresivoTitulo : ''}</strong>{' '}
              {r.consumoEsRegresivo ? t.regresivoTexto : t.noRegresivo}
            </div>

            <div class="calc__tip calc__tip--info">
              <strong>{t.directosTitulo}</strong> {t.directosTexto}
            </div>
            <div class="calc__tip calc__tip--info">
              <strong>{t.avisoTitulo}</strong> {t.aviso}
            </div>
          </>
        )}
      </div>

      <style>{`
        .pg__intro { font-family: var(--font-sans); font-size: 0.95rem; color: var(--color-ink-soft, #5C4A3D); margin: 0 0 1rem; }
        .pg__label {
          font-family: var(--font-sans); font-size: 0.8rem; font-weight: 600;
          letter-spacing: 0.04em; text-transform: uppercase;
          color: var(--color-ink-mute, #8A7868); margin: 1.2rem 0 0.5rem;
        }
        .pg__note { font-family: var(--font-sans); font-size: 0.87rem; color: var(--color-ink-soft, #5C4A3D); margin-top: 0.6rem; }
        .pg__scroll { overflow-x: auto; }
        .pg__row { display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.5rem 1rem; }
        @media (max-width: 560px) { .pg__row { grid-template-columns: 1fr; } }
        .pg__infinito { font-family: var(--font-mono, monospace); font-size: 1.1rem; color: var(--color-ink-mute, #8A7868); }
      `}</style>
    </div>
  );
}
