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
      'Invierte durante 25 años (2000–2024) repartiendo tu patrimonio entre distintos activos. Tu objetivo: terminar con más que «El Mercat», una IA que invierte siempre en un índice. ¿Lo conseguirás?',
    continue: 'Continuar partida',
    start: 'Empezar',
  },
  ca: {
    title: 'Stonks',
    intro:
      'Invertix durant 25 anys (2000–2024) repartint el teu patrimoni entre distints actius. El teu objectiu: acabar amb més que «El Mercat», una IA que invertix sempre en un índex. Ho aconseguiràs?',
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
