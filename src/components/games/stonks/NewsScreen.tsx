/** @jsxImportSource preact */
import type { Half } from '@/lib/games/stonks/types';
import { newsFor } from '@/lib/games/stonks/data/news';
import { useGameLocale } from '../locale-context';
import { localizeNews } from '@/i18n/games/stonks-ca';

// The semester's headline. Shown before the player allocates, and deliberately
// factual: it says what happened, never what to do about it.

interface Props {
  year: number;
  half: Half;
  onContinue: () => void;
}

export const COPY = {
  es: {
    eyebrow: (h: Half, y: number) => `${h === 0 ? '1.er' : '2.º'} semestre de ${y}`,
    invest: 'Invertir',
  },
  ca: {
    eyebrow: (h: Half, y: number) => `${h === 0 ? '1r' : '2n'} semestre de ${y}`,
    invest: 'Invertir',
  },
};

export function NewsScreen({ year, half, onContinue }: Props) {
  const locale = useGameLocale();
  const c = COPY[locale];
  return (
    <div class="sk-phone">
      <div class="sk-news">
        <div class="eyebrow">{c.eyebrow(half, year)}</div>
        <div class="t serif">{localizeNews(year, half, newsFor(year, half), locale)}</div>
      </div>
      <button class="sk-cta" onClick={onContinue}>
        {c.invest}
      </button>
    </div>
  );
}
