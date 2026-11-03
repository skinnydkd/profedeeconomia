// src/lib/games/seguros/data.ts
import type { Insurance, EventCard, GameConfig, InsuranceKey } from './types';

export const INSURANCES: Insurance[] = [
  { key: 'movil', label: 'Móvil',       prima: 40 },
  { key: 'coche', label: 'Coche/Moto',  prima: 85 },
  { key: 'hogar', label: 'Hogar',       prima: 100 },
  { key: 'salud', label: 'Salud',       prima: 75 },
  { key: 'rc',    label: 'Resp. civil', prima: 115 },
];

export const INSURANCE_KEYS: InsuranceKey[] = INSURANCES.map((i) => i.key);

// Deck weights sum to 100. Each round draws exactly one card.
// Premiums carry a loading of about 20 % over the expected loss (peso/100 × dano),
// as real insurers do: insuring has a negative expected value, and what a team
// buys is protection against a large loss.
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
