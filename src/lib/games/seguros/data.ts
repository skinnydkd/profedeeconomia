// src/lib/games/seguros/data.ts
import type { Insurance, EventCard, GameConfig, InsuranceKey } from './types';

export const INSURANCES: Insurance[] = [
  { key: 'movil', label: 'Móvil',       prima: 30 },
  { key: 'coche', label: 'Coche/Moto',  prima: 70 },
  { key: 'hogar', label: 'Hogar',       prima: 80 },
  { key: 'salud', label: 'Salud',       prima: 60 },
  { key: 'rc',    label: 'Resp. civil', prima: 90 },
];

export const INSURANCE_KEYS: InsuranceKey[] = INSURANCES.map((i) => i.key);

// Deck weights sum to 100. Each round draws exactly one card.
// Premiums are calibrated so prima ≈ (peso/100) × dano (roughly fair).
export const EVENT_DECK: EventCard[] = [
  { key: 'calma', label: 'Todo tranquilo: no pasa nada', cubre: null,    dano: 0,    peso: 30 },
  { key: 'movil', label: 'Pantalla rota / robo del móvil', cubre: 'movil', dano: 200,  peso: 16 },
  { key: 'coche', label: 'Accidente de coche o moto',      cubre: 'coche', dano: 450,  peso: 16 },
  { key: 'salud', label: 'Gasto médico inesperado',        cubre: 'salud', dano: 400,  peso: 16 },
  { key: 'hogar', label: 'Incendio o inundación en casa',  cubre: 'hogar', dano: 600,  peso: 14 },
  { key: 'rc',    label: 'Te reclaman judicialmente',      cubre: 'rc',    dano: 1200, peso: 8  },
];

export const DEFAULT_CONFIG: GameConfig = {
  numTeams: 4,
  teamNames: ['Equipo A', 'Equipo B', 'Equipo C', 'Equipo D', 'Equipo E', 'Equipo F', 'Equipo G', 'Equipo H'],
  rounds: 10,
  startingCash: 1000,
  income: 350,
};
