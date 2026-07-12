/** @jsxImportSource preact */
// PassDeviceScreen — shown between human turns so players can cover the screen.
// Props: { factionLabel, factionColor, onReady }

import { useGameLocale } from '../locale-context';

interface Props {
  factionLabel: string;
  factionColor: string;
  onReady: () => void;
}

export const COPY = {
  es: {
    eyebrow: 'Cambio de turno',
    headline: 'Pasa el dispositivo a',
    sub: 'El jugador anterior ya ha terminado. Entrega el dispositivo al siguiente jugador humano. Cuando estés listo, pulsa el botón.',
    cta: 'Estoy listo',
  },
  ca: {
    eyebrow: 'Canvi de torn',
    headline: 'Passa el dispositiu a',
    sub: 'El jugador anterior ja ha acabat. Entrega el dispositiu al següent jugador humà. Quan estigues llest, prem el botó.',
    cta: 'Estic llest',
  },
};

export function PassDeviceScreen({ factionLabel, factionColor, onReady }: Props) {
  const c = COPY[useGameLocale()];
  return (
    <div class="er-pass">
      <div class="er-pass-card">
        <div class="er-pass-eyebrow">{c.eyebrow}</div>
        <h2 class="er-pass-headline">
          {c.headline}{' '}
          <span style={{ color: factionColor }}>{factionLabel}</span>
        </h2>
        <p class="er-pass-sub">{c.sub}</p>
        <button class="er-pass-cta" onClick={onReady}>
          {c.cta}
        </button>
      </div>
    </div>
  );
}
