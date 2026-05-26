import type { Territory, ContinentId } from './types';

// Continent bonuses ported from webpde/econrisk.html
export const CONTINENT_BONUS: Record<ContinentId, number> = {
  norteamerica: 5,
  sudamerica:   3,
  europa:       5,
  africa:       3,
  asia:         7,
  oceania:      2,
};

// 24 territories ported from webpde/econrisk.html
// Schematic node coordinates (600×360 viewBox) — NOT geographic; 6 clusters:
//   Norteamérica: top-left  (~x 30-160, y 30-130)
//   Sudamérica:   bottom-left (~x 30-160, y 195-320)
//   Europa:       top-mid   (~x 210-360, y 25-165)
//   África:       bottom-mid (~x 210-360, y 195-320)
//   Asia:         top-right (~x 400-570, y 25-165)
//   Oceanía:      bottom-right (~x 440-590, y 220-320)
// Labels in Spanish (castellano).
export const TERRITORIES: Territory[] = [
  // --- Norteamérica (top-left) ---
  { id: 'canada',        label: 'Canadá',            continent: 'norteamerica', adj: ['usa_east', 'usa_west', 'nordics'],                                    x:  80, y:  40 },
  { id: 'usa_west',      label: 'EE.UU. Oeste',      continent: 'norteamerica', adj: ['canada', 'usa_east', 'mexico', 'japo'],                               x:  45, y:  90 },
  { id: 'usa_east',      label: 'EE.UU. Este',       continent: 'norteamerica', adj: ['canada', 'usa_west', 'mexico', 'europa_occ'],                         x: 130, y:  90 },
  { id: 'mexico',        label: 'México',             continent: 'norteamerica', adj: ['usa_west', 'usa_east', 'andes', 'brasil'],                            x:  85, y: 145 },

  // --- Sudamérica (bottom-left) ---
  { id: 'andes',         label: 'Andes',              continent: 'sudamerica',   adj: ['mexico', 'brasil', 'argentina'],                                       x:  55, y: 220 },
  { id: 'brasil',        label: 'Brasil',             continent: 'sudamerica',   adj: ['mexico', 'andes', 'argentina', 'africa_occ'],                         x: 135, y: 230 },
  { id: 'argentina',     label: 'Argentina',          continent: 'sudamerica',   adj: ['andes', 'brasil'],                                                     x:  90, y: 305 },

  // --- Europa (top-mid) ---
  { id: 'nordics',       label: 'Nórdicos',           continent: 'europa',       adj: ['canada', 'europa_occ', 'europa_central', 'europa_est'],                x: 245, y:  35 },
  { id: 'europa_occ',    label: 'Europa Occ.',        continent: 'europa',       adj: ['nordics', 'europa_central', 'mediterrani', 'usa_east', 'africa_nord'], x: 215, y:  95 },
  { id: 'europa_central',label: 'Europa Central',     continent: 'europa',       adj: ['nordics', 'europa_occ', 'europa_est', 'mediterrani'],                  x: 280, y:  85 },
  { id: 'europa_est',    label: 'Europa Est',         continent: 'europa',       adj: ['nordics', 'europa_central', 'orient_mitja', 'xina'],                   x: 340, y:  65 },
  { id: 'mediterrani',   label: 'Mediterráneo',       continent: 'europa',       adj: ['europa_occ', 'europa_central', 'africa_nord', 'orient_mitja'],         x: 265, y: 155 },

  // --- África (bottom-mid) ---
  { id: 'africa_nord',   label: 'África Norte',       continent: 'africa',       adj: ['europa_occ', 'mediterrani', 'orient_mitja', 'africa_occ', 'africa_est'], x: 245, y: 215 },
  { id: 'africa_occ',    label: 'África Occ.',        continent: 'africa',       adj: ['africa_nord', 'africa_est', 'africa_sud', 'brasil'],                   x: 210, y: 275 },
  { id: 'africa_est',    label: 'África Est',         continent: 'africa',       adj: ['africa_nord', 'africa_occ', 'africa_sud', 'orient_mitja', 'india'],    x: 305, y: 265 },
  { id: 'africa_sud',    label: 'África Sur',         continent: 'africa',       adj: ['africa_occ', 'africa_est', 'australia'],                               x: 255, y: 325 },

  // --- Asia (top-right) ---
  { id: 'orient_mitja',  label: 'Oriente Medio',      continent: 'asia',         adj: ['europa_est', 'mediterrani', 'africa_nord', 'africa_est', 'india'],    x: 395, y: 130 },
  { id: 'india',         label: 'India',              continent: 'asia',         adj: ['orient_mitja', 'xina', 'sudest_asia', 'africa_est'],                   x: 455, y: 165 },
  { id: 'xina',          label: 'China',              continent: 'asia',         adj: ['europa_est', 'india', 'japo', 'sudest_asia'],                          x: 500, y:  90 },
  { id: 'japo',          label: 'Japón',              continent: 'asia',         adj: ['xina', 'usa_west', 'illes_pacific'],                                   x: 565, y:  55 },
  { id: 'sudest_asia',   label: 'Sudeste Asiático',   continent: 'asia',         adj: ['india', 'xina', 'australia', 'illes_pacific'],                         x: 530, y: 155 },

  // --- Oceanía (bottom-right) ---
  { id: 'illes_pacific', label: 'Islas Pacífico',    continent: 'oceania',      adj: ['japo', 'sudest_asia', 'australia', 'nova_zelanda'],                    x: 570, y: 235 },
  { id: 'australia',     label: 'Australia',          continent: 'oceania',      adj: ['sudest_asia', 'illes_pacific', 'nova_zelanda', 'africa_sud'],           x: 510, y: 290 },
  { id: 'nova_zelanda',  label: 'Nueva Zelanda',      continent: 'oceania',      adj: ['illes_pacific', 'australia'],                                           x: 570, y: 330 },
];

export const TERRITORY_IDS = TERRITORIES.map((t) => t.id);
export const byId = Object.fromEntries(TERRITORIES.map((t) => [t.id, t]));
export const CONTINENTS: ContinentId[] = ['norteamerica', 'sudamerica', 'europa', 'africa', 'asia', 'oceania'];
export const continentTerritories = (c: ContinentId) => TERRITORIES.filter((t) => t.continent === c);
