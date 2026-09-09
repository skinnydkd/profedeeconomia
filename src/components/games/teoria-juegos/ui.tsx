/** @jsxImportSource preact */
/**
 * Small presentational pieces shared by the six experiments: a bar list, a row
 * of headline figures and the class-data textarea. Charts are plain divs — the
 * numbers here are always few enough that a chart library would be dead weight.
 */
import type { ComponentChildren } from 'preact';
import { leerNumeros } from '@/lib/games/teoria-juegos/aula';

export interface BarraItem {
  etiqueta: string;
  valor: number;
  /** Text shown at the end of the bar; defaults to the rounded value. */
  texto?: string;
  tenue?: boolean;
}

export function Barras({ items, max }: { items: BarraItem[]; max?: number }) {
  const tope = Math.max(max ?? 0, ...items.map((i) => i.valor), 1);
  return (
    <ul class="tj-barras">
      {items.map((i) => (
        <li class={`tj-barra${i.tenue ? ' tj-barra--tenue' : ''}`} key={i.etiqueta}>
          <span>{i.etiqueta}</span>
          <span class="tj-barra__pista">
            <span
              class="tj-barra__valor"
              style={`width: ${Math.max(0, Math.min(100, (i.valor / tope) * 100))}%`}
            />
          </span>
          <span class="tj-barra__n">{i.texto ?? Math.round(i.valor)}</span>
        </li>
      ))}
    </ul>
  );
}

export function Datos({ items }: { items: { etiqueta: string; valor: string }[] }) {
  return (
    <dl class="tj-datos">
      {items.map((d) => (
        <div key={d.etiqueta}>
          <dt>{d.etiqueta}</dt>
          <dd>{d.valor}</dd>
        </div>
      ))}
    </dl>
  );
}

export function Nota({ titulo, children }: { titulo: string; children: ComponentChildren }) {
  return (
    <div class="tj-caja tj-caja--nota">
      <h3>{titulo}</h3>
      {children}
    </div>
  );
}

/**
 * The textarea every `aula` screen uses: the teacher types the class's numbers
 * however they like and gets back a parsed list.
 */
export function EntradaClase({
  etiqueta,
  pista,
  valor,
  onValor,
  onLimpiar,
  limpiarTexto,
}: {
  etiqueta: string;
  pista: string;
  valor: string;
  onValor: (raw: string, numeros: number[]) => void;
  onLimpiar: () => void;
  limpiarTexto: string;
}) {
  return (
    <div class="tj-campo tj-campo--ancho">
      <label for="tj-clase">{etiqueta}</label>
      <textarea
        id="tj-clase"
        value={valor}
        placeholder="34 22 50 12 8 …"
        onInput={(e) => {
          const raw = (e.target as HTMLTextAreaElement).value;
          onValor(raw, leerNumeros(raw));
        }}
      />
      <p class="tj-pista">
        {pista}{' '}
        <button type="button" class="tj-link" onClick={onLimpiar}>
          {limpiarTexto}
        </button>
      </p>
    </div>
  );
}
