/** @jsxImportSource preact */
import { useGameLocale } from '../locale-context';

// Start / continue screen. Shown when phase === 'start'.

interface Props {
  hasSave: boolean;
  onStart: () => void;
  onContinue: () => void;
}

export const COPY = {
  es: {
    title: 'Stonks',
    intro:
      'Te tocan 25 años al azar entre 1971 y 2025, y decides cada seis meses cómo repartir tu dinero. ' +
      'Enfrente tienes a «El Mercado», que se limita a comprar el índice mundial y no vender nunca. ' +
      'Mover la cartera cuesta comisiones e impuestos, y la inflación se lleva su parte de todo.',
    continue: 'Continuar partida',
    start: 'Empezar',
  },
  ca: {
    title: 'Stonks',
    intro:
      'Et toquen 25 anys a l’atzar entre 1971 i 2025, i decidixes cada sis mesos com repartir els diners. ' +
      'Enfront tens «El Mercat», que es limita a comprar l’índex mundial i no ven mai. ' +
      'Moure la cartera costa comissions i impostos, i la inflació se’n du la seua part de tot.',
    continue: 'Continua la partida',
    start: 'Comença',
  },
};

export function StartScreen({ hasSave, onStart, onContinue }: Props) {
  const c = COPY[useGameLocale()];
  return (
    <div class="sk-phone sk-start">
      <h1 class="sk-year serif">{c.title}</h1>
      <p class="sk-intro">{c.intro}</p>
      {hasSave && (
        <button class="sk-cta ghost" onClick={onContinue}>
          {c.continue}
        </button>
      )}
      <button class="sk-cta" onClick={onStart}>
        {c.start}
      </button>
    </div>
  );
}
