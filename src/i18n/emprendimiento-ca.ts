import { type Itinerario } from '@/lib/emprendimiento';
import { type Locale } from './locale';

type ItinerarioCA = Partial<Pick<Itinerario, 'label' | 'descripcion'>>;

// Valencian (AVL) overlay for the three itineraries through «De cero a empresa».
// Structural fields (id, fases) stay in the ES source of truth.
export const ITINERARIOS_CA: Partial<Record<string, ItinerarioCA>> = {
  'sprint-eso': {
    label: 'Sprint ESO',
    descripcion:
      'Cinc fases lean, sense planificació pesada. Un mes aproximadament. Pensat per a 3r i 4t d\'ESO.',
  },
  'bach-fp': {
    label: 'Projecte Batx/FP',
    descripcion:
      "Les onze fases, amb l'aprofundiment d'empresa (operacions, persones, finançament). El projecte complet.",
  },
  'a-la-carta': {
    label: 'A la carta',
    descripcion:
      'Tria les fases que encaixen en la teua assignatura i el teu temps. Cada fase és un mòdul independent.',
  },
};

/** Overlay the Valencian strings onto an itinerary when locale is 'ca'. */
export function localizeItinerario(it: Itinerario, locale: Locale): Itinerario {
  return locale === 'es' ? it : { ...it, ...ITINERARIOS_CA[it.id] };
}
