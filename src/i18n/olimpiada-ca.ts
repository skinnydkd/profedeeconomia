import { GUIA } from '@/lib/olimpiada';
import { type Locale } from './locale';

type Guia = typeof GUIA;

// GUIA has no slug, so the Valencian version is a full positional copy: same
// shape, same number of `partes`, same order. Scores ('4 pts') are structural.
const GUIA_CA: Guia = {
  duracion: '2 hores',
  total: '10 punts',
  partes: [
    {
      nombre: 'Part I — Test teòric',
      puntos: '4 pts',
      descripcion:
        "Setze preguntes tipus test amb una sola opció correcta, sobre Economia de 1r i Empresa (EDMN) de 2n. Penalitzen els errors: tres incorrectes resten una correcta; les no contestades ni sumen ni resten.",
    },
    {
      nombre: 'Part II — Exercici pràctic',
      puntos: '3 pts',
      descripcion:
        "Dos exercicis, un d'Economia i un altre d'Empresa; tries i resols només un. El punt mort apareix quasi sempre; també FPP, oferta-demanda algebraica o comptabilitat.",
    },
    {
      nombre: 'Part III — Comentari de text',
      puntos: '3 pts',
      descripcion:
        "Text d'actualitat econòmica amb preguntes que connecten cada paràgraf amb un concepte del temari.",
    },
  ],
};

/** Return the Valencian exam guide when locale is 'ca'. */
export function localizeGuia(guia: Guia, locale: Locale): Guia {
  return locale === 'es' ? guia : GUIA_CA;
}
