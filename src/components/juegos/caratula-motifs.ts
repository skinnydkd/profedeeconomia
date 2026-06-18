/**
 * Cover-plate motifs for the games on the /juegos/ hub. Each entry is the INNER
 * SVG markup (paths/shapes only) for a plate with viewBox "0 0 320 132"; the
 * <svg> wrapper and the cream stroke live in JuegoCaratula.astro. Ported from the
 * validated mockup at mockups/juegos-caratulas/index.html (direction A).
 */
const CREAM = '#FBF6EC';

/** 6×3 dot grid with one highlighted dot — Insider's "hidden one". */
function insiderGrid(): string {
  let dots = '';
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 6; c++) {
      const x = 50 + c * 44;
      const y = 36 + r * 30;
      dots += `<circle cx="${x}" cy="${y}" r="4" fill="${CREAM}" stroke="none" opacity="0.55"/>`;
    }
  }
  return `${dots}<circle cx="182" cy="66" r="4" fill="${CREAM}" stroke="none"/><circle cx="182" cy="66" r="12" stroke-width="2"/>`;
}

export const MOTIFS: Record<string, string> = {
  // Rising stepped market line + vertices.
  stonks: `
    <g stroke="${CREAM}" opacity="0.28" stroke-width="1"><line x1="28" y1="104" x2="292" y2="104"/></g>
    <polyline points="28,96 78,80 118,86 162,52 206,60 250,32 292,18" stroke-width="3"/>
    <g fill="${CREAM}" stroke="none"><rect x="74" y="76" width="8" height="8"/><rect x="158" y="48" width="8" height="8"/><rect x="246" y="28" width="8" height="8"/><rect x="288" y="14" width="8" height="8"/></g>`,
  // Tessellated territory triangles, a couple filled.
  econrisk: `
    <g stroke-width="1.5" opacity="0.85"><path d="M40 96 L80 40 L120 96 Z"/><path d="M120 96 L80 40 L160 40 L120 96"/><path d="M120 96 L160 40 L200 96 Z"/><path d="M200 96 L160 40 L240 40 L200 96"/><path d="M200 96 L240 40 L280 96 Z"/></g>
    <path d="M120 96 L80 40 L160 40 L120 96" fill="${CREAM}" opacity="0.9" stroke="none"/>
    <path d="M200 96 L240 40 L280 96 Z" fill="${CREAM}" opacity="0.4" stroke="none"/>`,
  // Square spiral board with a marked node.
  econopoly: `
    <g stroke-width="2"><rect x="40" y="22" width="240" height="88"/><rect x="64" y="36" width="192" height="60"/><rect x="88" y="50" width="144" height="32"/></g>
    <circle cx="40" cy="22" r="6" fill="${CREAM}" stroke="none"/>
    <circle cx="280" cy="110" r="6" fill="${CREAM}" stroke="none" opacity="0.5"/>`,
  // Concentric signal arcs (quiz buzz).
  cajut: `
    <g stroke-width="2.5"><path d="M46 110 A 28 28 0 0 1 74 82"/><path d="M46 110 A 58 58 0 0 1 104 52"/><path d="M46 110 A 88 88 0 0 1 134 22"/></g>
    <circle cx="46" cy="110" r="6" fill="${CREAM}" stroke="none"/>`,
  // Shelter dome over dots (covered vs exposed).
  seguros: `
    <path d="M70 92 A 90 90 0 0 1 250 92" stroke-width="3"/>
    <line x1="160" y1="20" x2="160" y2="44" stroke-width="2.5"/>
    <g fill="${CREAM}" stroke="none"><circle cx="120" cy="84" r="5"/><circle cx="160" cy="80" r="5"/><circle cx="200" cy="84" r="5"/></g>
    <g fill="${CREAM}" stroke="none" opacity="0.4"><circle cx="60" cy="104" r="5"/><circle cx="270" cy="104" r="5"/></g>`,
  // Regular dot grid with one singled out.
  insider: insiderGrid(),
};

/** Neutral motif for games without a bespoke one (e.g. future "próximamente"). */
export const FALLBACK_MOTIF = `
  <circle cx="160" cy="66" r="34" stroke-width="2"/>
  <circle cx="160" cy="66" r="6" fill="${CREAM}" stroke="none"/>`;

export const MOTIF_SLUGS: Set<string> = new Set(Object.keys(MOTIFS));

export function getMotif(slug: string): string {
  return MOTIFS[slug] ?? FALLBACK_MOTIF;
}
