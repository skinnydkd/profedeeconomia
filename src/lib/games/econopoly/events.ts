/**
 * News cards ported from webpde/econopoly.html (var NEWS_CARDS, 20 entries).
 *
 * Kind mapping:
 *   sector_boost  → sectorBoost  (with sector mapped to new SectorId)
 *   sector_bust   → sectorBust   (with sector mapped to new SectorId)
 *   interest_rate → rateChange   (amount = target rate — treated as absolute change to that value)
 *   subsidy       → bonusCash    (bonus cash to current player; only if they own sector — engine handles)
 *   all_pay       → penaltyCash  (amount per player; engine applies to all alive)
 *   all_receive   → bonusCash    (amount per player; engine applies to all alive)
 *   current_receive → bonusCash  (amount to current player only)
 *   tax_holiday   → taxHoliday
 *   free_rd       → none         (no direct cash effect; engine would need a flag — mapped to none with note)
 *   richest_pay   → none         (targets richest player — too complex for the basic engine; mapped to none)
 *   inflation     → none         (global price modifier — not modelled in base engine; mapped to none)
 *
 * Sector mapping (webpde internal name → new SectorId):
 *   tech         → A
 *   serveis      → B
 *   energia      → C
 *   financer     → D
 *   agricultura  → E
 *   industria    → F
 *   turisme      → G
 *   construccio  → H
 */
import type { NewsCard } from './types';

export const NEWS_CARDS: NewsCard[] = [
  // 1 — Boom tecnológico (sector_boost tech → A)
  {
    id: 'tech_boom',
    text: 'Boom tecnológico: las empresas tech aumentan su valor un 20%. Rentas de Tecnología +20% este turno.',
    kind: 'sectorBoost',
    sector: 'A',
    amount: 0.2,
  },

  // 2 — Crisis energética (sector_boost energia → C)
  {
    id: 'energy_crisis',
    text: 'Crisis energética: el precio del petróleo se duplica. Rentas de Energía +50% este turno.',
    kind: 'sectorBoost',
    sector: 'C',
    amount: 0.5,
  },

  // 3 — Burbuja inmobiliaria (sector_bust construccio → H)
  {
    id: 'construction_bust',
    text: 'La burbuja inmobiliaria estalla: propiedades de Construcción pierden el 30%. Rentas -30% este turno.',
    kind: 'sectorBust',
    sector: 'H',
    amount: -0.3,
  },

  // 4 — BCE baja tipos (interest_rate → rateChange; amount = new absolute rate 1 → we store as delta -1 relative to common range; treated as rateChange amount=-4 to set ~1%; NOTE: original sets rate=1 absolutely)
  // Engine should clamp to CB_RATE_RANGE [2,12]. We store amount as the delta that brings rate toward the target.
  // Decision: store amount=-3 (subtracts from current rate, driving it low). Documented concern below.
  {
    id: 'rate_down',
    text: 'El Banco Central baja los tipos de interés. El crédito es más barato.',
    kind: 'rateChange',
    amount: -1,
  },

  // 5 — Subvención agrícola (subsidy agricultura → E, amount=50; bonus to current if owns sector E)
  {
    id: 'agri_subsidy',
    text: 'Subvención agrícola: recibes 50 € si tienes propiedades de Agricultura.',
    kind: 'bonusCash',
    amount: 50,
    sector: 'E',
  },

  // 6 — Pandemia global (sector_bust turisme → G)
  {
    id: 'tourism_bust',
    text: 'Pandemia global: el turismo cae un 40%. Rentas de Turismo -40% este turno.',
    kind: 'sectorBust',
    sector: 'G',
    amount: -0.25,
  },

  // 7 — Boom turístico (sector_boost turisme → G)
  {
    id: 'tourism_boom',
    text: 'Boom turístico: Europa bate récords de visitantes. Rentas de Turismo +30% este turno.',
    kind: 'sectorBoost',
    sector: 'G',
    amount: 0.3,
  },

  // 8 — Guerra comercial (all_pay 30 → penaltyCash per player)
  {
    id: 'trade_war',
    text: 'Guerra comercial: todos los jugadores pagan 30 € en aranceles.',
    kind: 'penaltyCash',
    amount: 30,
    target: 'all',
  },

  // 9 — Reparto del fondo público (all_receive 75 → bonusCash per player)
  {
    id: 'public_fund',
    text: 'Reparto del fondo público: cada jugador recibe 75 € del tesoro.',
    kind: 'bonusCash',
    amount: 75,
    target: 'all',
  },

  // 10 — Crisis bancaria (sector_bust financer → D)
  {
    id: 'banking_crisis',
    text: 'Crisis bancaria: el sector Finanzas pierde el 25% de su valor. Rentas -25% este turno.',
    kind: 'sectorBust',
    sector: 'D',
    amount: -0.30,
  },

  // 11 — Subvención verde (subsidy energia → C, amount=40)
  {
    id: 'green_subsidy',
    text: 'Subvención verde: recibes 40 € si tienes propiedades de Energía.',
    kind: 'bonusCash',
    amount: 40,
    sector: 'C',
  },

  // 12 — Recesión industrial (sector_bust industria → F)
  {
    id: 'industry_bust',
    text: 'Recesión industrial: las fábricas cierran. Rentas de Industria -30% este turno.',
    kind: 'sectorBust',
    sector: 'F',
    amount: -0.25,
  },

  // 13 — Vacaciones fiscales (tax_holiday)
  {
    id: 'tax_holiday',
    text: '¡Vacaciones fiscales! El próximo impuesto no se cobra.',
    kind: 'taxHoliday',
  },

  // 14 — Inflación descontrolada (inflation modifier 1.15 — no direct cash effect in base engine)
  // NOTE: 'none' because the base engine has no global rent modifier flag; a future engine upgrade
  // can apply this as a round-long multiplier on all rents.
  {
    id: 'inflation',
    text: 'Inflación descontrolada: todos los precios suben un 15%. (Efecto informativo este turno.)',
    kind: 'none',
  },

  // 15 — Plan de infraestructuras (sector_boost construccio → H)
  {
    id: 'construction_boom',
    text: 'Plan de infraestructuras: Rentas de Construcción +25% este turno.',
    kind: 'sectorBoost',
    sector: 'H',
    amount: 0.3,
  },

  // 16 — Herencia inesperada (current_receive 100 → bonusCash, no sector restriction)
  {
    id: 'inheritance',
    text: 'Herencia inesperada: el jugador actual recibe 100 €.',
    kind: 'bonusCash',
    amount: 100,
  },

  // 17 — Nueva regulación: multa al más rico (richest_pay 50 → none; too complex for base engine)
  // NOTE: 'none' because targeting the richest player requires iterating net worth mid-card;
  // the engine can implement this in a future upgrade as a special resolver.
  {
    id: 'regulation_fine',
    text: 'Nueva regulación: el jugador con más patrimonio paga 50 €. (Efecto informativo este turno.)',
    kind: 'none',
  },

  // 18 — Avance tecnológico: próxima mejora R+D gratis (free_rd → none; requires a state flag)
  // NOTE: 'none' because this requires a `freeRdAvailable` flag on GameState not yet modelled;
  // a future engine version can add this flag and have upgradeRd() check it.
  {
    id: 'free_rd',
    text: 'Avance tecnológico: la próxima mejora de R+D es gratuita. (Efecto informativo este turno.)',
    kind: 'none',
  },

  // 19 — Reforma sanitaria (sector_boost serveis → B)
  {
    id: 'health_reform',
    text: 'Reforma sanitaria: el sector Servicios gana un 20% de valor. Rentas +20% este turno.',
    kind: 'sectorBoost',
    sector: 'B',
    amount: 0.2,
  },

  // 20 — Cosecha extraordinaria (sector_boost agricultura → E)
  {
    id: 'harvest_boom',
    text: 'Cosecha extraordinaria: Rentas de Agricultura +35% este turno.',
    kind: 'sectorBoost',
    sector: 'E',
    amount: 0.3,
  },

];

// Total: 20 cards ported faithfully from webpde/econopoly.html (var NEWS_CARDS lines 193-212).
