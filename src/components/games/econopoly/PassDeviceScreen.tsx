/** @jsxImportSource preact */
// PassDeviceScreen — interstitial shown before each human turn.
// Props: { playerName, color, onReady }

interface Props {
  playerName: string;
  color: string;
  onReady: () => void;
}

export function PassDeviceScreen({ playerName, color, onReady }: Props) {
  return (
    <div class="ep2-pass">
      <div class="ep2-pass-card">
        <div class="ep2-pass-eyebrow">Cambio de turno</div>
        <h2 class="ep2-pass-headline">
          Pasa el dispositivo a{' '}
          <span style={{ color }}>{playerName}</span>
        </h2>
        <p class="ep2-pass-sub">
          El jugador anterior ya ha terminado su turno. Entrega el dispositivo al siguiente jugador humano.
          Cuando estes listo, pulsa el boton.
        </p>
        <button class="ep2-pass-cta" onClick={onReady}>
          Estoy listo
        </button>
      </div>
    </div>
  );
}
