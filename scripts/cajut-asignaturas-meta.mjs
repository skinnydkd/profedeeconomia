// scripts/cajut-asignaturas-meta.mjs
// Metadades de les 9 asignatures (colors canònics: src/styles/global.css)

export const ASIGNATURAS_META = [
  { slug: 'edmn-2bach',     name: 'Economía y Administración de Empresas (2º Bach)', shortName: 'EDMN 2BACH',  color: '#C44E2C' },
  { slug: 'eco-1bach',      name: 'Economía (1º Bach)',                              shortName: 'Eco 1BACH',   color: '#1F6E6E' },
  { slug: 'eco-4eso',       name: 'Economía (4º ESO)',                               shortName: 'Eco 4ESO',    color: '#D4A24C' },
  { slug: 'fopp-4eso',      name: 'Formación y Orientación Personal y Profesional (4º ESO)', shortName: 'FOPP 4ESO', color: '#5B3A4E' },
  { slug: 'taller-eco-3eso',name: 'Taller de Economía (3º ESO)',                     shortName: 'Taller 3ESO', color: '#6B8E23' },
  { slug: 'ipe1-fp',        name: 'Iniciativa Personal y Emprendedora I (FP)',       shortName: 'IPE I',       color: '#4A6FA5' },
  { slug: 'ipe2-fp',        name: 'Iniciativa Personal y Emprendedora II (FP)',      shortName: 'IPE II',      color: '#2F4F7F' },
  { slug: 'eeae-bach',      name: 'Economía Empresarial y Análisis Económico (Bach)',shortName: 'EEAE',        color: '#2E5E3A' },
  { slug: 'gpe-bach',       name: 'Gestión de Proyectos Emprendedores (Bach)',       shortName: 'GPE',         color: '#8C2F39' },
];

export function metaFor(slug) {
  return ASIGNATURAS_META.find((a) => a.slug === slug);
}
