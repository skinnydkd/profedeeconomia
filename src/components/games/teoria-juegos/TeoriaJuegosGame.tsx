/** @jsxImportSource preact */
import { useState } from 'preact/hooks';
import type { MiniId, Modo } from '@/lib/games/teoria-juegos/types';
import { GameLocaleContext } from '../locale-context';
import { DEFAULT_LOCALE, type Locale } from '@/i18n/locale';
import HubScreen from './HubScreen';
import MiniShell from './MiniShell';
import MatrizGame from './MatrizGame';
import BellezaGame from './BellezaGame';
import RepartoGame from './RepartoGame';
import BienPublicoGame from './BienPublicoGame';
import SubastasGame from './SubastasGame';
import './teoria-juegos.css';

export default function TeoriaJuegosGame({ locale = DEFAULT_LOCALE }: { locale?: Locale }) {
  return (
    <GameLocaleContext.Provider value={locale}>
      <TeoriaJuegosInner />
    </GameLocaleContext.Provider>
  );
}

function TeoriaJuegosInner() {
  const [activo, setActivo] = useState<MiniId | null>(null);
  const [modo, setModo] = useState<Modo>('solo');

  if (!activo) return <HubScreen modo={modo} onModo={setModo} onAbrir={setActivo} />;

  return (
    <MiniShell id={activo} modo={modo} onModo={setModo} onVolver={() => setActivo(null)}>
      {/* Remounting on mode change keeps a half-played solo game from leaking
          into the class screen (and the other way round). */}
      <Mini id={activo} modo={modo} key={`${activo}-${modo}`} />
    </MiniShell>
  );
}

function Mini({ id, modo }: { id: MiniId; modo: Modo }) {
  switch (id) {
    case 'dilema':
    case 'cazaciervo':
      return <MatrizGame juego={id} modo={modo} />;
    case 'belleza':
      return <BellezaGame modo={modo} />;
    case 'reparto':
      return <RepartoGame modo={modo} />;
    case 'bien-publico':
      return <BienPublicoGame modo={modo} />;
    case 'subastas':
      return <SubastasGame modo={modo} />;
  }
}
