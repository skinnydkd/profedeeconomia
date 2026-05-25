import type { FactionId } from './types';

export interface FactionMeta { id: FactionId; label: string; school: string; color: string; power: string; }

export const FACTIONS: FactionMeta[] = [
  { id: 'keynes',     label: 'Keynesianos', school: 'Keynesianismo',       color: '#1F6E6E', power: '+2 unidades gratis cada 3 turnos (estímulo fiscal).' },
  { id: 'marx',       label: 'Marxistas',   school: 'Marxismo',            color: '#8C2F39', power: 'Conquistan automáticamente territorios enemigos defendidos por 1 unidad.' },
  { id: 'austrian',   label: 'Austríacos',  school: 'Escuela austríaca',   color: '#A87A2A', power: '+1 a la defensa en todos sus territorios (dinero sólido).' },
  { id: 'neoclassic', label: 'Neoclásicos', school: 'Economía neoclásica', color: '#2E5E3A', power: 'Pueden atacar 1 territorio no adyacente por turno (ventaja comparativa).' },
];

export const FACTION_IDS = FACTIONS.map((f) => f.id) as FactionId[];
export const factionMeta = Object.fromEntries(FACTIONS.map((f) => [f.id, f])) as Record<FactionId, FactionMeta>;
