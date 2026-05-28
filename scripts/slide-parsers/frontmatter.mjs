export function renderObjetivos(fm) {
  if (!Array.isArray(fm.objetivos) || !fm.objetivos.length) return null;
  return ['## Objetivos de la unidad', '', ...fm.objetivos.map((o) => `- ${o}`)].join('\n');
}

export function renderConceptos(fm) {
  if (!Array.isArray(fm.conceptos_clave) || !fm.conceptos_clave.length) return null;
  return ['## Conceptos clave', '', ...fm.conceptos_clave.map((c) => `- **${c}**`)].join('\n');
}
