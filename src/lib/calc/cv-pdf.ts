/**
 * Pure CV → layout logic for the Europass-style CV generator (FOPP 4ESO U9).
 *
 * This module contains NO direct DOM/jsPDF calls. It transforms the raw CV
 * form data into a normalised model and then into an ordered list of "blocks"
 * (sections + lines) ready to be painted by a thin renderer that injects a
 * jsPDF `doc`. Keeping it pure makes the layout logic unit-testable.
 *
 * The text painting itself (jsPDF) is a side effect handled separately, but a
 * latin1-safe sanitiser lives here too because it is pure and easy to test.
 */

export interface ExperienciaItem {
  puesto: string;
  empresa: string;
  fechas: string;
  descripcion: string;
}

export interface FormacionItem {
  titulo: string;
  centro: string;
  anio: string;
}

export interface IdiomaItem {
  idioma: string;
  nivel: string;
}

export interface CVData {
  personales: {
    nombre: string;
    ciudad: string;
    email: string;
    movil: string;
    linkedin: string;
  };
  resumen: string;
  experiencia: ExperienciaItem[];
  formacion: FormacionItem[];
  idiomas: IdiomaItem[];
  habilidades: string;
  voluntariado: string;
}

/** Which logical column a block belongs to in the two-column Europass layout. */
export type CVColumn = 'side' | 'main';

export type CVLineStyle = 'title' | 'subtitle' | 'meta' | 'body' | 'bullet';

export interface CVLine {
  text: string;
  style: CVLineStyle;
}

export interface CVBlock {
  /** Stable id useful for tests and debugging. */
  id: string;
  /** Section heading shown above the lines. */
  heading: string;
  column: CVColumn;
  lines: CVLine[];
}

export interface CVHeader {
  nombre: string;
  /** Pre-joined contact line (ciudad · email · móvil · linkedin). */
  contacto: string;
}

export interface CVLayout {
  header: CVHeader;
  blocks: CVBlock[];
}

export interface CVValidation {
  ok: boolean;
  errors: string[];
}

const trim = (s: string | undefined): string => (s ?? '').trim();

/** Join non-empty contact parts with a middle dot separator. */
function buildContacto(p: CVData['personales']): string {
  return [trim(p.ciudad), trim(p.email), trim(p.movil), trim(p.linkedin)]
    .filter(Boolean)
    .join(' · ');
}

/**
 * Minimum-fields validation. A CV is only considered printable if it has a
 * name — everything else is optional for a 4º ESO "first CV".
 */
export function validateCV(data: CVData): CVValidation {
  const errors: string[] = [];
  if (!trim(data.personales?.nombre)) {
    errors.push('Falta el nombre y apellidos.');
  }
  return { ok: errors.length === 0, errors };
}

/**
 * Format a free-text date range. Students type things like "06/2025 - 09/2025"
 * or "junio 2025 a septiembre 2025"; we normalise the separator and collapse
 * whitespace so the PDF is consistent. Returns '' for empty input.
 */
export function formatDateRange(raw: string): string {
  const s = trim(raw);
  if (!s) return '';
  return s
    .replace(/\s*(?:-|–|—|hasta|a)\s+/i, ' – ')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

/**
 * Extract a sortable year from a free-text date string. Picks the LAST 4-digit
 * year found (so "06/2024 - 09/2025" sorts by 2025, its end date). Returns 0
 * when no year is present so undated items sink to the bottom.
 */
export function endYearOf(raw: string): number {
  const matches = trim(raw).match(/\b(19|20)\d{2}\b/g);
  if (!matches || matches.length === 0) return 0;
  return Number(matches[matches.length - 1]);
}

/** Truncate a string to maxLen, adding an ellipsis when cut. */
export function truncate(raw: string, maxLen: number): string {
  const s = trim(raw);
  if (s.length <= maxLen) return s;
  if (maxLen <= 1) return s.slice(0, maxLen);
  return s.slice(0, maxLen - 1).trimEnd() + '…';
}

/**
 * Sort experience newest-first by end year. Stable for equal years so the
 * original input order is preserved within a year.
 */
export function sortExperiencia(items: ExperienciaItem[]): ExperienciaItem[] {
  return items
    .map((item, idx) => ({ item, idx, year: endYearOf(item.fechas) }))
    .sort((a, b) => b.year - a.year || a.idx - b.idx)
    .map((x) => x.item);
}

const hasExperiencia = (x: ExperienciaItem) =>
  Boolean(trim(x.puesto) || trim(x.empresa));
const hasFormacion = (x: FormacionItem) =>
  Boolean(trim(x.titulo) || trim(x.centro));

/**
 * Build the side column: datos personales summary, idiomas, habilidades,
 * voluntariado. Empty sections are omitted entirely.
 */
function buildSideBlocks(data: CVData): CVBlock[] {
  const blocks: CVBlock[] = [];

  const idiomas = data.idiomas.filter((x) => trim(x.idioma));
  if (idiomas.length > 0) {
    blocks.push({
      id: 'idiomas',
      heading: 'Idiomas',
      column: 'side',
      lines: idiomas.map((x) => ({
        text: `${trim(x.idioma)} — ${trim(x.nivel)}`,
        style: 'bullet',
      })),
    });
  }

  if (trim(data.habilidades)) {
    blocks.push({
      id: 'habilidades',
      heading: 'Habilidades digitales',
      column: 'side',
      lines: [{ text: trim(data.habilidades), style: 'body' }],
    });
  }

  if (trim(data.voluntariado)) {
    blocks.push({
      id: 'voluntariado',
      heading: 'Voluntariado y aficiones',
      column: 'side',
      lines: [{ text: trim(data.voluntariado), style: 'body' }],
    });
  }

  return blocks;
}

/**
 * Build the main column: resumen, experiencia (sorted newest-first),
 * formación. Empty sections are omitted entirely.
 */
function buildMainBlocks(data: CVData): CVBlock[] {
  const blocks: CVBlock[] = [];

  if (trim(data.resumen)) {
    blocks.push({
      id: 'resumen',
      heading: 'Perfil profesional',
      column: 'main',
      lines: [{ text: trim(data.resumen), style: 'body' }],
    });
  }

  const exp = sortExperiencia(data.experiencia.filter(hasExperiencia));
  if (exp.length > 0) {
    const lines: CVLine[] = [];
    for (const x of exp) {
      const puesto = trim(x.puesto) || '—';
      const empresa = trim(x.empresa);
      lines.push({
        text: empresa ? `${puesto} · ${empresa}` : puesto,
        style: 'subtitle',
      });
      const fechas = formatDateRange(x.fechas);
      if (fechas) lines.push({ text: fechas, style: 'meta' });
      if (trim(x.descripcion)) lines.push({ text: trim(x.descripcion), style: 'body' });
    }
    blocks.push({ id: 'experiencia', heading: 'Experiencia', column: 'main', lines });
  }

  const form = data.formacion.filter(hasFormacion);
  if (form.length > 0) {
    const lines: CVLine[] = [];
    for (const x of form) {
      const titulo = trim(x.titulo) || '—';
      const centro = trim(x.centro);
      lines.push({
        text: centro ? `${titulo} · ${centro}` : titulo,
        style: 'subtitle',
      });
      if (trim(x.anio)) lines.push({ text: trim(x.anio), style: 'meta' });
    }
    blocks.push({ id: 'formacion', heading: 'Formación', column: 'main', lines });
  }

  return blocks;
}

/**
 * Compose the full CV layout from raw form data. Side blocks come first, then
 * main blocks, so consumers can split by `column` while keeping a deterministic
 * order. Empty sections are dropped.
 */
export function composeCVLayout(data: CVData): CVLayout {
  return {
    header: {
      nombre: trim(data.personales?.nombre),
      contacto: buildContacto(data.personales),
    },
    blocks: [...buildSideBlocks(data), ...buildMainBlocks(data)],
  };
}

/**
 * Sanitise text for jsPDF's built-in helvetica font. Accented Spanish
 * characters (a-acute, n-tilde, dieresis, inverted marks, euro sign) live in
 * WinAnsi/Latin-1 and paint fine. jsPDF's standard-font glyph table is
 * unreliable for the typographic dashes, smart quotes and ellipsis we use
 * internally, so we down-convert just those to plain ASCII. NBSP -> space.
 */
export function sanitizeForPdf(raw: string): string {
  return (raw ?? '')
    .replace(/[—–]/g, '-') // em/en dash -> hyphen (reliable in standard fonts)
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/…/g, '...')
    .replace(/ /g, ' '); // NBSP → regular space
}
