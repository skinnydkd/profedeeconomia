/** @jsxImportSource preact */
// PlayerReveal — Shown during phase === 'reveal' on the player's phone.
// Shows who was eliminated and whether they were the impostor.

import type { PublicState, PrivateState } from '@/lib/games-multi/insider/types';
import { useGameLocale } from '../../locale-context';

interface Props {
  publicState: PublicState;
  privateState: PrivateState | null;
}

export const COPY = {
  es: {
    revelando: 'Revelando resultado…',
    resultadoVotacion: 'Resultado de la votación',
    eliminado: 'Eliminado',
    eraImpostor: 'Era el impostor',
    eraCiudadano: 'Era ciudadano',
    laPalabraEra: 'La palabra era: ',
    ciudadanosPuntos: 'Los ciudadanos que votaron correctamente han ganado puntos.',
    impostorSobrevive: 'El impostor sobrevive y gana puntos extra.',
    esperandoFase: 'Esperando la siguiente fase…',
  },
  ca: {
    revelando: 'Revelant el resultat…',
    resultadoVotacion: 'Resultat de la votació',
    eliminado: 'Eliminat',
    eraImpostor: "Era l'impostor",
    eraCiudadano: 'Era ciutadà',
    laPalabraEra: 'La paraula era: ',
    ciudadanosPuntos: 'Els ciutadans que han votat correctament han guanyat punts.',
    impostorSobrevive: "L'impostor sobreviu i guanya punts extra.",
    esperandoFase: 'Esperant la fase següent…',
  },
};

export function PlayerReveal({ publicState, privateState: _privateState }: Props) {
  const c = COPY[useGameLocale()];
  const lastReveal = publicState.lastReveal;
  const eliminated = lastReveal
    ? publicState.players.find((p) => p.id === lastReveal.eliminatedId)
    : null;

  if (!lastReveal || !eliminated) {
    return (
      <div class="ins-player-lobby">
        <div class="waiting">{c.revelando}</div>
      </div>
    );
  }

  return (
    <>
      <div class="ins-eyebrow" style="text-align:center;">{c.resultadoVotacion}</div>

      <div class="ins-reveal-box" style="margin:0;">
        <div class="lab">{c.eliminado}</div>
        <div class="name serif">{eliminated.name}</div>
        <div class={`verdict ${lastReveal.wasImpostor ? 'impostor' : 'citizen'}`}>
          {lastReveal.wasImpostor ? c.eraImpostor : c.eraCiudadano}
        </div>
        {publicState.word && lastReveal.wasImpostor && (
          <div class="word-reveal">
            {c.laPalabraEra}<strong>{publicState.word}</strong>
          </div>
        )}
      </div>

      {/* Score update hint */}
      <div class="ins-hint" style="text-align:center;">
        {lastReveal.wasImpostor
          ? c.ciudadanosPuntos
          : c.impostorSobrevive}
      </div>

      <div class="ins-notice" style="text-align:center;">
        {c.esperandoFase}
      </div>
    </>
  );
}
