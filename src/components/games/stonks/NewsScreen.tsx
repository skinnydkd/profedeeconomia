/** @jsxImportSource preact */
import { YEAR_NEWS } from '@/lib/games/stonks/data';

// Year news screen. Shows the historical context before the player allocates.

interface Props {
  year: number;
  onContinue: () => void;
}

export function NewsScreen({ year, onContinue }: Props) {
  return (
    <div class="sk-phone">
      <div class="sk-news">
        <div class="eyebrow">Noticia del año {year}</div>
        <div class="t serif">{YEAR_NEWS[year]}</div>
      </div>
      <button class="sk-cta" onClick={onContinue}>
        Invertir
      </button>
    </div>
  );
}
