// Business Game — constantes y utilidades de UI compartidas por el prototipo
// local y la versión online.
import { DEFAULT_PARAMS, type TeamDecision } from './engine';

export const AREAS = ['Comercial', 'Operaciones', 'RR. HH.', 'Finanzas'] as const;

export const CAMPOS: { key: keyof TeamDecision; label: string; area: string; step: number; unidad: string }[] = [
  { key: 'precio', label: 'Precio de venta', area: 'Comercial', step: 0.5, unidad: '€/ud' },
  { key: 'marketing', label: 'Gasto en marketing', area: 'Comercial', step: 1000, unidad: '€' },
  { key: 'produccion', label: 'Unidades a producir', area: 'Operaciones', step: 100, unidad: 'ud' },
  { key: 'calidad', label: 'Inversión en calidad', area: 'Operaciones', step: 1000, unidad: '€' },
  { key: 'rrhh', label: 'Inversión en RR. HH.', area: 'RR. HH.', step: 1000, unidad: '€' },
  { key: 'prestamo', label: 'Préstamo solicitado', area: 'Finanzas', step: 1000, unidad: '€' },
];

export const decisionPorDefecto = (): TeamDecision => ({
  precio: DEFAULT_PARAMS.precioReferencia,
  marketing: 20000,
  produccion: 5000,
  calidad: 15000,
  rrhh: 15000,
  prestamo: 0,
});

export const eur = (n: number) => n.toLocaleString('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });
export const num = (n: number) => n.toLocaleString('es-ES');
