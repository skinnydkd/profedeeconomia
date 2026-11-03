/** @jsxImportSource preact */
import { useGameLocale } from '../locale-context';
import { WINDOW_YEARS } from '@/lib/games/stonks/engine';

// Shown once, right after the window is drawn. Frames the 25 years the player
// was dealt and states the rule that makes the game a game: no hindsight.

interface Props {
  startYear: number;
  onContinue: () => void;
}

export const COPY = {
  es: {
    eyebrow: 'Te han tocado',
    lede:
      'Vas a invertir durante 25 años, decidiendo cada seis meses. No sabes lo que viene: ' +
      'cada semestre verás una noticia de la época y tendrás que repartir tu dinero con eso y nada más.',
    note: 'Cada partida sortea 25 años distintos y cinco empresas distintas.',
    start: 'Empezar',
  },
  ca: {
    eyebrow: 'T’han tocat',
    lede:
      'Invertiràs durant 25 anys, decidint cada sis mesos. No saps què ve: ' +
      'cada semestre veuràs una notícia de l’època i hauràs de repartir els diners amb això i res més.',
    note: 'Cada partida sorteja 25 anys distints i cinc empreses distintes.',
    start: 'Comença',
  },
};

export function WindowIntro({ startYear, onContinue }: Props) {
  const c = COPY[useGameLocale()];
  const endYear = startYear + WINDOW_YEARS - 1;

  return (
    <div class="sk-phone sk-start">
      <div class="sk-eyebrow">{c.eyebrow}</div>
      <h1 class="sk-window serif">
        {startYear}–{endYear}
      </h1>
      <p class="sk-intro">{c.lede}</p>
      <p class="sk-note">{c.note}</p>
      <button class="sk-cta" onClick={onContinue}>
        {c.start}
      </button>
    </div>
  );
}
