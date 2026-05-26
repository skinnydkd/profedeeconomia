/** @jsxImportSource preact */

// Start / continue screen. Shown when phase === 'start'.

interface Props {
  hasSave: boolean;
  onStart: () => void;
  onContinue: () => void;
}

export function StartScreen({ hasSave, onStart, onContinue }: Props) {
  return (
    <div class="sk-phone sk-start">
      <h1 class="sk-year serif">Stonks</h1>
      <p class="sk-intro">
        Invierte durante 25 años (2000–2024) repartiendo tu patrimonio entre
        distintos activos. Tu objetivo: terminar con más que «El Mercat», una
        IA que invierte siempre en un índice. ¿Lo conseguirás?
      </p>
      {hasSave && (
        <button class="sk-cta ghost" onClick={onContinue}>
          Continuar partida
        </button>
      )}
      <button class="sk-cta" onClick={onStart}>
        Empezar
      </button>
    </div>
  );
}
