/** @jsxImportSource preact */
import { useMemo, useState } from 'preact/hooks';
import { type Locale } from '@/i18n/locale';
import { formatEUR, formatNumber, formatPercent } from '../../lib/calc/format';
import {
  compararOpciones, costeAplazamiento, opcionValida,
  type Opcion, type OpcionValorada,
} from '../../lib/calc/compra-inteligente';

/** UI strings, Valencian (AVL) alongside the ES source. TAE is kept as-is. */
export const COPY = {
  es: {
    unitarioTitulo: 'Precio por unidad',
    unitarioAyuda: 'Escribe lo que cuesta cada formato y cuánto lleva —gramos, mililitros, unidades— y compara con el mismo rasero. La etiqueta del lineal lo pone en letra pequeña; esto lo pone grande.',
    colNombre: 'Producto o formato',
    colPrecio: 'Precio (€)',
    colCantidad: 'Contenido',
    colUnitario: 'Por unidad',
    colSobrecoste: 'Más caro que el mejor',
    unidad: 'Unidad de medida',
    anadir: 'Añadir una opción',
    quitar: 'Quitar',
    masBarata: 'La más barata',
    sinOpciones: 'Añade al menos una opción con precio y contenido mayores que cero.',
    lecturaUnitario: 'El formato grande no siempre sale mejor. Cuando no sale, la diferencia se nota poco por compra y mucho a final de mes, que es exactamente donde deja de verse.',
    aplazadoTitulo: 'Lo que cuesta pagar a plazos',
    precio: 'Precio al contado (€)',
    entrada: 'Entrada que pagas al momento (€)',
    cuotas: 'Número de cuotas mensuales',
    cuota: 'Importe de cada cuota (€)',
    sinAplazado: 'Revisa los datos: el precio y la cuota tienen que ser positivos, la entrada menor que el precio, y las cuotas deben llegar como mínimo a cubrir lo que financias.',
    totalPagado: 'Total que acabas pagando',
    coste: 'Lo que te cobran de más',
    costeSobrePrecio: 'Sobre el precio al contado',
    tae: 'Coste anual equivalente (TAE)',
    sinIntereses: 'Este aplazamiento no cobra nada: las cuotas suman exactamente el precio. Existe, y conviene saber reconocerlo.',
    conIntereses: 'Fíjate en la diferencia entre lo que te cobran de más y la TAE. Un 10 % de recargo pagado en doce meses es una TAE bastante mayor del 10 %, porque vas devolviendo el dinero mes a mes y nunca llegas a deber el total durante todo el año.',
    avisoTitulo: 'Lo que hay que mirar siempre',
    aviso: 'La cuota mensual está pensada para parecer pequeña. Las tres cifras que deciden son el total pagado, lo que te cobran de más y la TAE, y ninguna de las tres suele aparecer en el cartel. Por ley tienen que dártelas antes de firmar: pídelas.',
    presets: 'Ejemplos',
    presetSupermercado: 'Tres formatos en el súper',
    presetMovil: 'Un móvil a plazos',
    presetSinIntereses: 'Aplazamiento sin intereses',
    comoSeCalcula: 'Cómo se calcula',
    formulaUnitarioTitle: 'Precio por unidad',
    formulaUnitarioDesc: ': precio ÷ contenido. Comparar dos formatos exige que la unidad sea la misma en los dos.',
    formulaTotalTitle: 'Total pagado',
    formulaTotalDesc: ': entrada + cuota × número de cuotas. Lo que te cobran de más es esa suma menos el precio al contado.',
    formulaTaeTitle: 'TAE',
    formulaTaeDesc: ': el tipo mensual que iguala el valor actual de las cuotas con lo que financias, elevado a doce. No hay fórmula cerrada; se busca por aproximación.',
  },
  ca: {
    unitarioTitulo: 'Preu per unitat',
    unitarioAyuda: "Escriu el que costa cada format i quant porta —grams, mil·lilitres, unitats— i compara amb la mateixa vara. L'etiqueta del lineal ho posa en lletra xicoteta; això ho posa gran.",
    colNombre: 'Producte o format',
    colPrecio: 'Preu (€)',
    colCantidad: 'Contingut',
    colUnitario: 'Per unitat',
    colSobrecoste: 'Més car que el millor',
    unidad: 'Unitat de mesura',
    anadir: 'Afegir una opció',
    quitar: 'Llevar',
    masBarata: 'La més barata',
    sinOpciones: 'Afig almenys una opció amb preu i contingut majors que zero.',
    lecturaUnitario: "El format gran no sempre ix millor. Quan no ix, la diferència es nota poc per compra i molt a final de mes, que és exactament on deixa de vore's.",
    aplazadoTitulo: 'El que costa pagar a terminis',
    precio: 'Preu al comptat (€)',
    entrada: 'Entrada que pagues al moment (€)',
    cuotas: 'Nombre de quotes mensuals',
    cuota: 'Import de cada quota (€)',
    sinAplazado: "Revisa les dades: el preu i la quota han de ser positius, l'entrada menor que el preu, i les quotes han d'arribar com a mínim a cobrir el que finances.",
    totalPagado: 'Total que acabes pagant',
    coste: 'El que et cobren de més',
    costeSobrePrecio: 'Sobre el preu al comptat',
    tae: 'Cost anual equivalent (TAE)',
    sinIntereses: 'Este ajornament no cobra res: les quotes sumen exactament el preu. Existix, i convé saber reconéixer-lo.',
    conIntereses: "Fixa't en la diferència entre el que et cobren de més i la TAE. Un 10 % de recàrrec pagat en dotze mesos és una TAE prou major del 10 %, perquè vas tornant els diners mes a mes i mai arribes a deure el total durant tot l'any.",
    avisoTitulo: 'El que cal mirar sempre',
    aviso: "La quota mensual està pensada per a paréixer xicoteta. Les tres xifres que decidixen són el total pagat, el que et cobren de més i la TAE, i cap de les tres sol aparéixer al cartell. Per llei te les han de donar abans de signar: demana-les.",
    presets: 'Exemples',
    presetSupermercado: 'Tres formats al súper',
    presetMovil: 'Un mòbil a terminis',
    presetSinIntereses: 'Ajornament sense interessos',
    comoSeCalcula: 'Com es calcula',
    formulaUnitarioTitle: 'Preu per unitat',
    formulaUnitarioDesc: ': preu ÷ contingut. Comparar dos formats exigix que la unitat siga la mateixa en els dos.',
    formulaTotalTitle: 'Total pagat',
    formulaTotalDesc: ': entrada + quota × nombre de quotes. El que et cobren de més és eixa suma menys el preu al comptat.',
    formulaTaeTitle: 'TAE',
    formulaTaeDesc: ": el tipus mensual que iguala el valor actual de les quotes amb el que finances, elevat a dotze. No hi ha fórmula tancada; es busca per aproximació.",
  },
} as const;

interface Props { locale?: Locale }

const num = (e: Event) => parseFloat((e.target as HTMLInputElement).value) || 0;
const texto = (e: Event) => (e.target as HTMLInputElement).value;

/**
 * Two comparisons a shop never makes for the customer: price per unit across
 * pack sizes, and what an instalment plan costs once it is annualised.
 *
 * Eco 4ESO · Unit 5.
 */
export default function CompraInteligenteCalc({ locale = 'es' }: Props) {
  const t = COPY[locale];

  const [unidad, setUnidad] = useState<string>('g');
  const [opciones, setOpciones] = useState<Opcion[]>([
    { nombre: locale === 'ca' ? 'Paquet xicotet' : 'Paquete pequeño', precio: 2.4, cantidad: 375 },
    { nombre: locale === 'ca' ? 'Paquet gran' : 'Paquete grande', precio: 4.2, cantidad: 750 },
    { nombre: locale === 'ca' ? 'Format familiar' : 'Formato familiar', precio: 6.9, cantidad: 1000 },
  ]);

  const [precio, setPrecio] = useState<number>(600);
  const [entrada, setEntrada] = useState<number>(0);
  const [cuotas, setCuotas] = useState<number>(12);
  const [cuota, setCuota] = useState<number>(55);

  const valoradas = useMemo(() => compararOpciones(opciones), [opciones]);
  /**
   * compararOpciones drops the rows it cannot compare, so its results no
   * longer line up with the table. Walk both in order to pair them back up —
   * matching by name would break the moment two rows are called the same.
   */
  const porFila = useMemo(() => {
    let k = 0;
    return opciones.map((o) => (opcionValida(o) ? valoradas[k++] : undefined));
  }, [opciones, valoradas]);
  const credito = useMemo(
    () => costeAplazamiento(precio, entrada, Math.round(cuotas), cuota),
    [precio, entrada, cuotas, cuota],
  );

  const editar = (i: number, campo: keyof Opcion, valor: string | number) => {
    setOpciones((prev) => prev.map((o, j) => (j === i ? { ...o, [campo]: valor } : o)));
  };
  const anadir = () => setOpciones((prev) => [...prev, { nombre: '', precio: 0, cantidad: 0 }]);
  const quitar = (i: number) => setOpciones((prev) => prev.filter((_, j) => j !== i));

  return (
    <div class="calc">
      <div class="calc__presets">
        <button type="button" class="calc__btn calc__btn--ghost"
          onClick={() => {
            setUnidad('g');
            setOpciones([
              { nombre: locale === 'ca' ? 'Paquet xicotet' : 'Paquete pequeño', precio: 2.4, cantidad: 375 },
              { nombre: locale === 'ca' ? 'Paquet gran' : 'Paquete grande', precio: 4.2, cantidad: 750 },
              { nombre: locale === 'ca' ? 'Format familiar' : 'Formato familiar', precio: 6.9, cantidad: 1000 },
            ]);
          }}>{t.presetSupermercado}</button>
        <button type="button" class="calc__btn calc__btn--ghost"
          onClick={() => { setPrecio(600); setEntrada(0); setCuotas(12); setCuota(55); }}>{t.presetMovil}</button>
        <button type="button" class="calc__btn calc__btn--ghost"
          onClick={() => { setPrecio(300); setEntrada(0); setCuotas(3); setCuota(100); }}>{t.presetSinIntereses}</button>
      </div>

      <div class="ci__label">{t.unitarioTitulo}</div>
      <p class="ci__note">{t.unitarioAyuda}</p>
      <div class="calc__form ci__row">
        <label class="calc__field">
          <span class="calc__label">{t.unidad}</span>
          <div class="calc__input-wrap">
            <input type="text" value={unidad} onInput={(e) => setUnidad(texto(e))} />
          </div>
        </label>
      </div>

      <div class="ci__scroll">
        <table class="calc__table">
          <thead>
            <tr>
              <th>{t.colNombre}</th>
              <th>{t.colPrecio}</th>
              <th>{t.colCantidad}</th>
              <th>{t.colUnitario}</th>
              <th>{t.colSobrecoste}</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {opciones.map((o, i) => {
              const v: OpcionValorada | undefined = porFila[i];
              return (
                <tr key={i} class={v?.esMasBarata ? 'ci__best' : ''}>
                  <td>
                    <input class="ci__cell ci__cell--wide" type="text" value={o.nombre}
                      onInput={(e) => editar(i, 'nombre', texto(e))} />
                  </td>
                  <td>
                    <input class="ci__cell" type="number" min={0} step={0.1} value={o.precio}
                      onInput={(e) => editar(i, 'precio', num(e))} />
                  </td>
                  <td>
                    <input class="ci__cell" type="number" min={0} step={25} value={o.cantidad}
                      onInput={(e) => editar(i, 'cantidad', num(e))} />
                  </td>
                  <td>{v ? `${formatNumber(v.precioUnitario, 4)} €/${unidad}` : '—'}</td>
                  <td>{v ? (v.esMasBarata ? t.masBarata : formatPercent(v.sobrecoste)) : '—'}</td>
                  <td>
                    {opciones.length > 1 && (
                      <button type="button" class="calc__btn calc__btn--ghost" onClick={() => quitar(i)}>{t.quitar}</button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <button type="button" class="calc__btn" onClick={anadir}>{t.anadir}</button>
      {valoradas.length === 0 ? (
        <div class="calc__warning">{t.sinOpciones}</div>
      ) : (
        <p class="ci__note">{t.lecturaUnitario}</p>
      )}

      <div class="ci__label">{t.aplazadoTitulo}</div>
      <div class="calc__form ci__row">
        <label class="calc__field">
          <span class="calc__label">{t.precio}</span>
          <div class="calc__input-wrap">
            <input type="number" min={1} step={10} value={precio} onInput={(e) => setPrecio(num(e))} />
          </div>
        </label>
        <label class="calc__field">
          <span class="calc__label">{t.entrada}</span>
          <div class="calc__input-wrap">
            <input type="number" min={0} step={10} value={entrada} onInput={(e) => setEntrada(num(e))} />
          </div>
        </label>
        <label class="calc__field">
          <span class="calc__label">{t.cuotas}</span>
          <div class="calc__input-wrap">
            <input type="number" min={1} max={120} step={1} value={cuotas} onInput={(e) => setCuotas(num(e))} />
          </div>
        </label>
        <label class="calc__field">
          <span class="calc__label">{t.cuota}</span>
          <div class="calc__input-wrap">
            <input type="number" min={1} step={5} value={cuota} onInput={(e) => setCuota(num(e))} />
          </div>
        </label>
      </div>

      <div class="calc__results">
        {!credito.valido ? (
          <div class="calc__warning">{t.sinAplazado}</div>
        ) : (
          <>
            <div class="calc__metric-grid calc__metric-grid--three">
              <div class="calc__metric-mini">
                <span class="calc__metric-mini-label">{t.totalPagado}</span>
                <span class="calc__metric-mini-value">{formatEUR(credito.totalPagado)}</span>
              </div>
              <div class="calc__metric-mini">
                <span class="calc__metric-mini-label">{t.coste}</span>
                <span class={`calc__metric-mini-value ${credito.sinIntereses ? 'ok' : 'fail'}`}>
                  {formatEUR(credito.coste)}
                </span>
              </div>
              <div class="calc__metric-mini">
                <span class="calc__metric-mini-label">{t.tae}</span>
                <span class={`calc__metric-mini-value ${credito.sinIntereses ? 'ok' : 'fail'}`}>
                  {formatPercent(credito.tae)}
                </span>
              </div>
            </div>
            <div class="calc__metric-grid">
              <div class="calc__metric-mini">
                <span class="calc__metric-mini-label">{t.costeSobrePrecio}</span>
                <span class="calc__metric-mini-value">{formatPercent(credito.costeSobrePrecio)}</span>
              </div>
            </div>
            <p class="ci__note">{credito.sinIntereses ? t.sinIntereses : t.conIntereses}</p>

            <div class="ci__panel">
              <div class="ci__label">{t.avisoTitulo}</div>
              <p class="ci__note">{t.aviso}</p>
            </div>
          </>
        )}

        <details class="calc__details">
          <summary>{t.comoSeCalcula}</summary>
          <div class="calc__formula">
            <p><strong>{t.formulaUnitarioTitle}</strong>{t.formulaUnitarioDesc}</p>
            <p><strong>{t.formulaTotalTitle}</strong>{t.formulaTotalDesc}</p>
            <p><strong>{t.formulaTaeTitle}</strong>{t.formulaTaeDesc}</p>
          </div>
        </details>
      </div>

      <style>{`
        .ci__label {
          font-family: var(--font-sans);
          font-size: 0.82rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.07em;
          color: var(--color-terra, #C44E2C);
          margin: 1.4rem 0 0.5rem;
        }
        .ci__row { display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.5rem 1rem; }
        @media (max-width: 480px) { .ci__row { grid-template-columns: 1fr; } }
        .ci__panel {
          margin-top: 1.4rem;
          padding: 1rem 1.1rem;
          background: var(--color-paper, #FFFFFF);
          border: 1px solid var(--color-line, #E5D4BD);
          border-radius: 8px;
        }
        .ci__note {
          margin-top: 0.7rem;
          font-family: var(--font-sans);
          font-size: 0.87rem;
          color: var(--color-ink-soft, #5C4A3D);
        }
        .ci__scroll { overflow-x: auto; }
        .ci__cell {
          width: 6rem;
          padding: 0.2rem 0.35rem;
          font-family: var(--font-mono, monospace);
          font-size: 0.8rem;
          border: 1px solid var(--color-line, #E5D4BD);
          border-radius: 3px;
          background: var(--color-bg, #FBF6EC);
          color: inherit;
        }
        .ci__cell--wide { width: 10rem; font-family: var(--font-sans); }
        .ci__best { background: var(--color-cream, #F5EDD9); }
      `}</style>
    </div>
  );
}
