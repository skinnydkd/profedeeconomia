// src/lib/games/stonks/data/life-events.ts
import type { LifeEvent } from '../types';

/**
 * Amounts are in euros of the window's START YEAR; the engine inflates them to
 * the semester's money. A fixed 3.000 € would be a fortune in 1971 and pocket
 * change in 2024, and the game would swing on which window you were dealt.
 */
export const LIFE_EVENTS: LifeEvent[] = [
  { id: 'coche',      text: 'Avería del coche.',                   amount: -1500 },
  { id: 'medico',     text: 'Gasto médico inesperado.',            amount: -3000 },
  { id: 'multa',      text: 'Multa de tráfico.',                   amount:  -400 },
  { id: 'electrodom', text: 'Avería de electrodomésticos.',        amount:  -800 },
  { id: 'reforma',    text: 'Reparación en casa.',                 amount: -2500 },
  { id: 'dental',     text: 'Gasto dental imprevisto.',            amount: -1000 },
  { id: 'viaje',      text: 'Viaje inesperado.',                   amount: -1800 },
  { id: 'paga',       text: 'Paga extra de Navidad.',              amount:  2000 },
  { id: 'herencia',   text: 'Herencia familiar.',                  amount:  8000 },
  { id: 'loteria',    text: '¡Premio de lotería!',                 amount:  5000 },
  { id: 'devolucion', text: 'Devolución de Hacienda.',             amount:  1200 },
  { id: 'premio',     text: 'Premio por objetivos en el trabajo.', amount:  3000 },
  { id: 'cumple',     text: 'Regalo de cumpleaños.',               amount:   500 },
  { id: 'ropausada',  text: 'Venta de ropa usada.',                amount:   300 },
];

/** Per semester. The old 0.3 was per YEAR; over 50 rounds it would fire 15 times. */
export const LIFE_EVENT_CHANCE = 0.2;
