/** @jsxImportSource preact */
import { MINIS } from '@/lib/games/teoria-juegos/registry';
import type { MiniId, Modo } from '@/lib/games/teoria-juegos/types';
import { useGameLocale } from '../locale-context';
import { COPY } from './copy';
import ModoSwitch from './ModoSwitch';

export default function HubScreen({
  modo,
  onModo,
  onAbrir,
}: {
  modo: Modo;
  onModo: (m: Modo) => void;
  onAbrir: (id: MiniId) => void;
}) {
  const c = COPY[useGameLocale()];
  return (
    <div class="tj">
      <span class="tj__kicker">{c.kicker}</span>
      <h1>{c.title}</h1>
      <p class="tj__lede">{c.lede}</p>

      <ModoSwitch modo={modo} onModo={onModo} />

      <div class="tj-hub">
        {MINIS.map((m, i) => {
          const t = c.minis[m.id];
          return (
            <button
              type="button"
              class="tj-card"
              key={m.id}
              style={`--tj-card-color: var(${m.colorVar})`}
              onClick={() => onAbrir(m.id)}
            >
              <span class="tj-card__n">{String(i + 1).padStart(2, '0')}</span>
              <span class="tj-card__t">{t.title}</span>
              <p class="tj-card__d">{t.tagline}</p>
              <p class="tj-card__d">{modo === 'solo' ? t.solo : t.aula}</p>
              <span class="tj-card__cta">{c.elegir}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
