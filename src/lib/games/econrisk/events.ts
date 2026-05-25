import type { EventCard } from './types';

// 15 event cards ported from webpde/econrisk.html (original in Catalan, translated to Spanish).
// Effect-to-kind mapping notes:
//   - 'peace_continents' (two adjacent continents blocked) → 'peaceRound' (full-round peace; continent-scoped variant resolved in engine)
//   - 'peace_europe' (Europe only blocked) → 'peaceRound' (same; engine applies globally for simplicity; noted below)
//   - 'sanctions_leader' (leader loses 3 units) → 'penaltyUnits': engine targets the faction with most territories
//   - 'no_continent_bonus' (skip continent bonuses this round) → 'none' (no direct kind; engine must handle via log)
//   - 'extra_attacks' (2 extra attacks for first player) → 'none' (no direct kind; engine handles via log)
//   - 'industrial_revolution' (1 unit per 3 territories) → 'bonusUnits' amount=1 (engine applies per-3-territories scaling)
//   - 'help_two_weakest' (two weakest gain +2) → 'bonusUnits' amount=2 (engine targets two weakest)
//   - 'humanitarian_aid' (territories with 1 unit gain +1) → 'bonusUnits' amount=1 (engine applies conditionally)
//   - 'inflation_penalty' (territories with 3+ units lose 1) → 'penaltyUnits' amount=1 (engine applies conditionally)
//   - 'financial_crisis' (Europa + NorteAmérica lose 1 per territory) → 'penaltyUnits' amount=1 (continent-scoped)
export const EVENT_CARDS: EventCard[] = [
  {
    id: 'debt_crisis',
    text: 'Crisis de deuda: todos los jugadores pierden 2 unidades del territorio con más tropas.',
    kind: 'penaltyUnits',
    amount: 2,
  },
  {
    id: 'trade_deal',
    text: 'Acuerdo comercial: dos continentes adyacentes no pueden ser atacados este turno.',
    kind: 'peaceRound',
    // Note: original effect is continent-scoped; engine applies as full peace round for simplicity
  },
  {
    id: 'sanctions',
    text: 'Sanciones económicas: el jugador con más territorios pierde 3 unidades distribuidas.',
    kind: 'penaltyUnits',
    amount: 3,
    // Note: engine targets the faction with most territories
  },
  {
    id: 'export_boom',
    text: 'Boom exportador: quien controla un continente entero gana +3 unidades extra.',
    kind: 'bonusUnits',
    amount: 3,
    // Note: engine applies only to factions that fully control at least one continent
  },
  {
    id: 'global_recession',
    text: 'Recesión global: nadie recibe bonus de continente este turno.',
    kind: 'none',
    // Note: no direct kind; engine must suppress continent bonus during reinforce phase this round
  },
  {
    id: 'tech_advance',
    text: 'Avance tecnológico: el jugador con menos territorios gana 4 unidades.',
    kind: 'bonusUnits',
    amount: 4,
    // Note: engine targets the faction with fewest territories
  },
  {
    id: 'temp_alliance',
    text: 'Alianza temporal: los dos jugadores con menos territorios ganan +2 unidades.',
    kind: 'bonusUnits',
    amount: 2,
    // Note: engine targets the two factions with fewest territories
  },
  {
    id: 'hyperinflation',
    text: 'Hiperinflación: todos los jugadores pierden 1 unidad de cada territorio con 3 o más unidades.',
    kind: 'penaltyUnits',
    amount: 1,
    // Note: engine applies conditionally (only territories with units >= 3)
  },
  {
    id: 'humanitarian_aid',
    text: 'Ayuda humanitaria: todos los territorios con 1 sola unidad ganan +1.',
    kind: 'bonusUnits',
    amount: 1,
    // Note: engine applies conditionally (only territories with exactly 1 unit)
  },
  {
    id: 'trade_war',
    text: 'Guerra comercial: el jugador que va primero puede hacer 2 ataques extra este turno.',
    kind: 'none',
    // Note: no direct kind; engine grants extra attack allowance to the first-in-order faction
  },
  {
    id: 'industrial_revolution',
    text: 'Revolución industrial: todos los jugadores ganan 1 unidad por cada 3 territorios que controlan.',
    kind: 'bonusUnits',
    amount: 1,
    // Note: engine scales by Math.floor(ownedCount / 3) per faction
  },
  {
    id: 'capital_flight',
    text: 'Fuga de capitales: el jugador con más territorios transfiere 2 unidades al jugador con menos.',
    kind: 'redistribute',
    amount: 2,
  },
  {
    id: 'non_aggression',
    text: 'Pacto de no agresión: no se puede atacar en Europa este turno.',
    kind: 'peaceRound',
    // Note: original effect is Europe-scoped; engine applies as full peace round for simplicity
  },
  {
    id: 'economic_spring',
    text: 'Primavera económica: todos los jugadores ganan +2 unidades.',
    kind: 'bonusUnits',
    amount: 2,
  },
  {
    id: 'financial_crisis_2008',
    text: 'Crisis financiera de 2008: el sector financiero (Europa y América del Norte) pierde 1 unidad por territorio.',
    kind: 'penaltyUnits',
    amount: 1,
    // Note: original effect is continent-scoped (Europa + norteamerica); engine applies globally for simplicity
  },
];
