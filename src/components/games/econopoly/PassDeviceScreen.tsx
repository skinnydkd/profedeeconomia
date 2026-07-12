/** @jsxImportSource preact */
// PassDeviceScreen — interstitial shown before each human turn.
// Props: { playerName, color, onReady }

import { useGameLocale } from '../locale-context';

interface Props {
  playerName: string;
  color: string;
  onReady: () => void;
}

export const COPY = {
  es: {
    eyebrow: 'Cambio de turno',
    pasa: 'Pasa el dispositivo a',
    sub: 'El jugador anterior ya ha terminado su turno. Entrega el dispositivo al siguiente jugador humano. Cuando estés listo, pulsa el botón.',
    ready: 'Estoy listo',
  },
  ca: {
    eyebrow: 'Canvi de torn',
    pasa: 'Passa el dispositiu a',
    sub: 'El jugador anterior ja ha acabat el seu torn. Entrega el dispositiu al següent jugador humà. Quan estigues a punt, prem el botó.',
    ready: 'Estic a punt',
  },
};

export function PassDeviceScreen({ playerName, color, onReady }: Props) {
  const c = COPY[useGameLocale()];
  return (
    <div class="ep2-pass">
      <div class="ep2-pass-card">
        <div class="ep2-pass-eyebrow">{c.eyebrow}</div>
        <h2 class="ep2-pass-headline">
          {c.pasa}{' '}
          <span style={{ color }}>{playerName}</span>
        </h2>
        <p class="ep2-pass-sub">{c.sub}</p>
        <button class="ep2-pass-cta" onClick={onReady}>
          {c.ready}
        </button>
      </div>
    </div>
  );
}
