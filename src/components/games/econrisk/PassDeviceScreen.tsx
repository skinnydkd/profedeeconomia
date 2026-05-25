/** @jsxImportSource preact */
// PassDeviceScreen — shown between human turns so players can cover the screen.
// Props: { factionLabel, factionColor, onReady }

interface Props {
  factionLabel: string;
  factionColor: string;
  onReady: () => void;
}

export function PassDeviceScreen({ factionLabel, factionColor, onReady }: Props) {
  return (
    <div class="er-pass">
      <div class="er-pass-card">
        <div class="er-pass-eyebrow">Cambio de turno</div>
        <h2 class="er-pass-headline">
          Pasa el dispositivo a{' '}
          <span style={{ color: factionColor }}>{factionLabel}</span>
        </h2>
        <p class="er-pass-sub">
          El jugador anterior ya ha terminado. Entrega el dispositivo al siguiente jugador humano.
          Cuando estés listo, pulsa el botón.
        </p>
        <button class="er-pass-cta" onClick={onReady}>
          Estoy listo
        </button>
      </div>
    </div>
  );
}
