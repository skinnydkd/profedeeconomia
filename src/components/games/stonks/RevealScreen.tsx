/** @jsxImportSource preact */
import type { GameState } from '@/lib/games/stonks/types';
import { assetMeta } from '@/lib/games/stonks/data/assets';
import { cardFor } from '@/lib/games/stonks/data/cards';
import { useGameLocale } from '../locale-context';
import { localizeAsset, localizeCard } from '@/i18n/games/stonks-ca';

// The payoff of playing blind: the five companies get their names back, with
// what actually happened to each. Shown once, between the last semester and
// the final scoreboard.

interface Props {
  state: GameState;
  onContinue: () => void;
}

export const COPY = {
  es: {
    eyebrow: 'Y ahora sí',
    title: 'Las empresas eran estas',
    lede:
      'Durante la partida solo has visto el sector, el país y el año de salida a bolsa. ' +
      'Es la misma información que tiene cualquiera antes de que la historia ocurra.',
    played: 'Lo que veías',
    cta: 'Ver resultado',
  },
  ca: {
    eyebrow: 'I ara sí',
    title: 'Les empreses eren estes',
    lede:
      'Durant la partida només has vist el sector, el país i l’any d’eixida a borsa. ' +
      'És la mateixa informació que té qualsevol abans que la història passe.',
    played: 'El que veies',
    cta: 'Veure el resultat',
  },
};

export function RevealScreen({ state, onContinue }: Props) {
  const locale = useGameLocale();
  const c = COPY[locale];

  return (
    <div class="sk-phone sk-reveal">
      <div class="sk-eyebrow">{c.eyebrow}</div>
      <h2 class="serif sk-reveal-title">{c.title}</h2>
      <p class="sk-intro">{c.lede}</p>

      {state.stocks.map((id) => {
        const meta = localizeAsset(assetMeta[id], locale);
        const card = localizeCard(cardFor(`${id}_reveal`), locale);
        return (
          <article class="sk-reveal-card" key={id}>
            <div class="sk-reveal-blind">
              <span class="sk-reveal-lab">{c.played}</span>
              {meta.label} · {meta.profile}
            </div>
            <h3 class="serif">{assetMeta[id].realName}</h3>
            {card?.body.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </article>
        );
      })}

      <button class="sk-cta" onClick={onContinue}>
        {c.cta}
      </button>
    </div>
  );
}
