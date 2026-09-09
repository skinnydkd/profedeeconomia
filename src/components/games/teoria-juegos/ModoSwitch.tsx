/** @jsxImportSource preact */
import type { Modo } from '@/lib/games/teoria-juegos/types';
import { useGameLocale } from '../locale-context';
import { COPY } from './copy';

/** Solo / class toggle. The same switch appears on the hub and inside every game. */
export default function ModoSwitch({ modo, onModo }: { modo: Modo; onModo: (m: Modo) => void }) {
  const c = COPY[useGameLocale()];
  return (
    <div>
      <div class="tj-modos" role="group">
        <button type="button" class="tj-modo" aria-pressed={modo === 'solo'} onClick={() => onModo('solo')}>
          {c.modoSolo}
        </button>
        <button type="button" class="tj-modo" aria-pressed={modo === 'aula'} onClick={() => onModo('aula')}>
          {c.modoAula}
        </button>
      </div>
      <p class="tj-modo-pie">{modo === 'solo' ? c.modoSoloPie : c.modoAulaPie}</p>
    </div>
  );
}
