// scripts/cajut-asignaturas-meta.mjs
// Metadades de les 9 asignatures (sync amb CLAUDE.md §"Color-coding per assignatura")

export const ASIGNATURAS_META = [
  { slug: 'edmn-2bach',     name: 'Economía y Administración de Empresas (2º Bach)', shortName: 'EDMN 2BACH',  color: '#C44E2C' },
  { slug: 'eco-1bach',      name: 'Economía (1º Bach)',                              shortName: 'Eco 1BACH',   color: '#1F6E6E' },
  { slug: 'eco-4eso',       name: 'Economía (4º ESO)',                               shortName: 'Eco 4ESO',    color: '#D4A24C' },
  { slug: 'fopp-4eso',      name: 'Formación y Orientación Personal y Profesional (4º ESO)', shortName: 'FOPP 4ESO', color: '#5B3A4E' },
  { slug: 'taller-eco-3eso',name: 'Taller de Economía (3º ESO)',                     shortName: 'Taller 3ESO', color: '#2E5E3A' },
  { slug: 'ipe1-fp',        name: 'Iniciativa Personal y Emprendedora I (FP)',       shortName: 'IPE I',       color: '#7A5840' },
  { slug: 'ipe2-fp',        name: 'Iniciativa Personal y Emprendedora II (FP)',      shortName: 'IPE II',      color: '#9C3A1C' },
  { slug: 'eeae-bach',      name: 'Economía Empresarial y Análisis Económico (Bach)',shortName: 'EEAE',        color: '#1F4E6E' },
  { slug: 'gpe-bach',       name: 'Gestión de Proyectos Emprendedores (Bach)',       shortName: 'GPE',         color: '#A87A2A' },
];

export function metaFor(slug) {
  return ASIGNATURAS_META.find((a) => a.slug === slug);
}
