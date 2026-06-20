// src/lib/ebau-examenes.ts
export interface Ccaa { slug: string; label: string; }

/** Comunitat Valenciana first (Pau's region); the rest alphabetical by label. */
export const CCAA_LIST: Ccaa[] = [
  { slug: 'comunidad-valenciana', label: 'Comunitat Valenciana' },
  { slug: 'andalucia', label: 'Andalucía' },
  { slug: 'aragon', label: 'Aragón' },
  { slug: 'asturias', label: 'Asturias' },
  { slug: 'cantabria', label: 'Cantabria' },
  { slug: 'castilla-la-mancha', label: 'Castilla-La Mancha' },
  { slug: 'castilla-y-leon', label: 'Castilla y León' },
  { slug: 'cataluna', label: 'Cataluña' },
  { slug: 'extremadura', label: 'Extremadura' },
  { slug: 'galicia', label: 'Galicia' },
  { slug: 'islas-baleares', label: 'Islas Baleares' },
  { slug: 'islas-canarias', label: 'Islas Canarias' },
  { slug: 'la-rioja', label: 'La Rioja' },
  { slug: 'madrid', label: 'Comunidad de Madrid' },
  { slug: 'murcia', label: 'Región de Murcia' },
  { slug: 'navarra', label: 'Navarra' },
  { slug: 'pais-vasco', label: 'País Vasco' },
];

export const ANIOS = [2026, 2025, 2024] as const;

export const CONVOCATORIAS = [
  { slug: 'junio', label: 'Junio (ordinaria)' },
  { slug: 'julio', label: 'Julio (extraordinaria)' },
] as const;

export type Tipo = 'examen' | 'solucion';

/** Path relative to public/ (no leading slash). Uniform filename across CCAA. */
export function ebauPdfRelPath(ccaa: string, anio: number, conv: string, tipo: Tipo): string {
  return `ebau-examenes/${ccaa}/empresa-${anio}-${conv}-${tipo}.pdf`;
}

/** Public URL (leading slash). */
export function ebauPdfHref(ccaa: string, anio: number, conv: string, tipo: Tipo): string {
  return `/${ebauPdfRelPath(ccaa, anio, conv, tipo)}`;
}
