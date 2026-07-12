/** @jsxImportSource preact */
import { useGameLocale } from '../locale-context';
import { localizeYearNews } from '@/i18n/games/stonks-ca';

// Year news screen. Shows the historical context before the player allocates.

interface Props {
  year: number;
  onContinue: () => void;
}

export const COPY = {
  es: {
    eyebrow: (year: number) => `Noticia del año ${year}`,
    invest: 'Invertir',
  },
  ca: {
    eyebrow: (year: number) => `Notícia de l'any ${year}`,
    invest: 'Invertir',
  },
};

export function NewsScreen({ year, onContinue }: Props) {
  const locale = useGameLocale();
  const c = COPY[locale];
  return (
    <div class="sk-phone">
      <div class="sk-news">
        <div class="eyebrow">{c.eyebrow(year)}</div>
        <div class="t serif">{localizeYearNews(year, locale)}</div>
      </div>
      <button class="sk-cta" onClick={onContinue}>
        {c.invest}
      </button>
    </div>
  );
}
