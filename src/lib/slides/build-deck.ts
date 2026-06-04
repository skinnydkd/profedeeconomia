/**
 * Pure MDX -> Deck builder for the native Astro slide renderer.
 * Walks the top-level MDX blocks in document order and maps them to typed
 * slides, condensing prose so a unit lands in the tight ~18-28 range.
 * Book-only blocks (exam tips, cross-refs, step lists, figures, calculators,
 * bibliography) are dropped from the deck — they live in the book.
 */
import { parseMdx, getText, getAttr, firstJsxChildName, type MdxNode } from './ast.ts';
import type { Slide, Deck } from './types.ts';

const DROP = new Set([
  'PistaEbau', 'MirarFora', 'RetoEtapa', 'Steps', 'VocesDesacuerdo',
  'Bibliography', 'Figure', 'HerramientaIsland',
]);
const CONCEPT_COMPONENTS = new Set(['Callout', 'Curiosity', 'RealExample', 'VuelveAlCaso']);

const MAX_BODY = 340;

/** Truncate to a sentence boundary near MAX_BODY without cutting a word ugly. */
function condense(text: string): string {
  const t = text.replace(/\s+/g, ' ').trim();
  if (t.length <= MAX_BODY) return t;
  const slice = t.slice(0, MAX_BODY);
  const lastStop = Math.max(slice.lastIndexOf('. '), slice.lastIndexOf('; '));
  return (lastStop > MAX_BODY * 0.5 ? slice.slice(0, lastStop + 1) : slice.trimEnd() + '…');
}

/** Split a long body into at most 2 sentence-aligned chunks of <= MAX_BODY. */
function chunkBody(text: string): string[] {
  const t = text.replace(/\s+/g, ' ').trim();
  if (!t) return [];
  if (t.length <= MAX_BODY) return [t];
  const sentences = t.split(/(?<=[.;])\s+/);
  const chunks: string[] = [];
  let cur = '';
  for (const s of sentences) {
    if ((cur + ' ' + s).trim().length > MAX_BODY && cur) { chunks.push(cur.trim()); cur = s; }
    else cur = (cur + ' ' + s).trim();
    if (chunks.length === 1 && (cur + ' ').length > MAX_BODY) break; // cap at 2 chunks
  }
  if (cur) chunks.push(cur.trim());
  return chunks.slice(0, 2).map(condense);
}

/** Split a SolvedExercise into enunciado text + solution steps. */
function exerciseFrom(node: MdxNode): Slide {
  const number = getAttr(node, 'number');
  const titleAttr = getAttr(node, 'title') || getAttr(node, 'titulo') || 'Ejercicio resuelto';
  const title = number ? `${number} · ${titleAttr}` : titleAttr;
  const children = node.children || [];
  let splitIdx = children.findIndex(
    (c) => c.type === 'thematicBreak' || /^\**\s*soluci[oó]n/i.test(getText(c)),
  );
  if (splitIdx < 0) splitIdx = Math.ceil(children.length / 2);
  const enunciado = condense(children.slice(0, splitIdx).map(getText).join(' '));
  const after = children.slice(splitIdx);
  const pasos: string[] = [];
  for (const c of after) {
    if (c.type === 'list' && Array.isArray(c.children)) {
      for (const li of c.children) pasos.push(getText(li));
    }
  }
  if (pasos.length === 0) {
    const sol = after.map(getText).join(' ').replace(/^\**\s*soluci[oó]n\s*/i, '').trim();
    if (sol) pasos.push(condense(sol));
  }
  return { tipo: 'exercise', title, enunciado, pasos: pasos.slice(0, 6).map((p) => condense(p)) };
}

const MIN_CONCEPT = 70;
const TARGET_MAX = 24;

/** Post-build cleanup to land in the tight presentation range. */
function condenseDeck(slides: Slide[]): Slide[] {
  // 1. Drop trivial concepts (no title and barely any body).
  let out = slides.filter(
    (s) => !(s.tipo === 'concept' && !s.title && (!s.body || s.body.length < MIN_CONCEPT)),
  );

  // 2. Drop a §-section cover immediately followed by another cover or the close
  //    (the section produced no content slide).
  out = out.filter((s, i) => {
    if (s.tipo === 'cover' && s.eyebrow?.startsWith('§')) {
      const next = out[i + 1];
      if (!next || next.tipo === 'cover' || next.tipo === 'close') return false;
    }
    return true;
  });

  // 3. Merge consecutive concept slides while they fit.
  const merged: Slide[] = [];
  for (const s of out) {
    const prev = merged[merged.length - 1];
    if (
      prev && prev.tipo === 'concept' && s.tipo === 'concept' &&
      ((prev.body?.length ?? 0) + (s.body?.length ?? 0)) <= MAX_BODY
    ) {
      prev.body = [prev.body, s.body].filter(Boolean).join(' ');
      prev.title = prev.title || s.title;
      prev.pull = prev.pull || s.pull;
    } else {
      merged.push({ ...s });
    }
  }
  out = merged;

  // 4. Hard cap: until within target, either merge the smallest adjacent
  //    concept pair, or fold a §-section cover into the concept that follows it
  //    (the section title becomes that concept's heading). Prefer concept pairs.
  while (out.length > TARGET_MAX) {
    let pairI = -1, pairLen = Infinity;
    for (let i = 0; i < out.length - 1; i++) {
      if (out[i].tipo === 'concept' && out[i + 1].tipo === 'concept') {
        const len = ((out[i] as any).body?.length ?? 0) + ((out[i + 1] as any).body?.length ?? 0);
        if (len < pairLen) { pairLen = len; pairI = i; }
      }
    }
    if (pairI >= 0) {
      const a = out[pairI] as any, b = out[pairI + 1] as any;
      a.body = condense([a.body, b.body].filter(Boolean).join(' '));
      a.title = a.title || b.title;
      out.splice(pairI + 1, 1);
      continue;
    }
    // No concept pair left — fold a §-cover into the next concept.
    const coverI = out.findIndex(
      (s, i) => s.tipo === 'cover' && s.eyebrow?.startsWith('§') && out[i + 1]?.tipo === 'concept',
    );
    if (coverI < 0) break;
    const cover = out[coverI] as any, c = out[coverI + 1] as any;
    c.eyebrow = c.eyebrow || cover.eyebrow;
    c.title = cover.title || c.title;
    out.splice(coverI, 1);
  }
  return out;
}

export function buildDeck(rawMdx: string): Deck {
  const { frontmatter: fm, ast } = parseMdx(rawMdx);
  const slides: Slide[] = [];

  // Cover from frontmatter.
  slides.push({
    tipo: 'cover',
    eyebrow: fm.bloque ? String(fm.bloque) : undefined,
    title: String(fm.title ?? 'Unidad'),
    subtitle: fm.lema ? String(fm.lema).replace(/\s+/g, ' ').trim() : undefined,
  });

  // H2 sections that are book apparatus, not presentation content.
  const DROP_SECTION = /glosario|para profundizar|preguntas para reflexion|conexi[oó]n con el proyecto|bibliograf/i;

  let sectionN = 0;
  let pending: { title?: string; body: string } | null = null;
  let skipping = false;

  const flush = () => {
    if (!pending) return;
    const chunks = chunkBody(pending.body);
    chunks.forEach((body, i) => {
      slides.push({ tipo: 'concept', title: i === 0 ? pending!.title : undefined, body });
    });
    if (chunks.length === 0 && pending.title) {
      slides.push({ tipo: 'concept', title: pending.title });
    }
    pending = null;
  };

  for (const node of ast.children || []) {
    if (node.type === 'heading' && node.depth === 2) {
      flush();
      const title = getText(node);
      if (DROP_SECTION.test(title)) { skipping = true; continue; }
      skipping = false;
      sectionN += 1;
      slides.push({ tipo: 'cover', eyebrow: `§${sectionN}`, title });
      continue;
    }
    if (skipping) continue;
    if (node.type === 'heading' && node.depth === 3) {
      // Fold the H3 into the current section concept (tight philosophy: one
      // concept per section, not one per sub-heading). First H3 names it.
      if (!pending) pending = { title: getText(node), body: '' };
      else pending.body += ` ${getText(node)}.`;
      continue;
    }
    if (node.type === 'paragraph' || node.type === 'list' || node.type === 'blockquote') {
      if (!pending) pending = { body: '' };
      pending.body += ' ' + getText(node);
      continue;
    }
    if (node.type === 'mdxJsxFlowElement') {
      const name = node.name || '';
      if (DROP.has(name)) continue;
      flush();
      if (name === 'TldrUnidad') {
        slides.push({ tipo: 'quote', texto: condense(getText(node)) });
      } else if (name === 'CasoDilema') {
        slides.push({
          tipo: 'concept',
          eyebrow: 'El caso',
          title: getAttr(node, 'titular') || 'El caso',
          pull: getAttr(node, 'pregunta') || undefined,
          body: getAttr(node, 'pregunta') ? undefined : condense(getText(node)),
        });
      } else if (name === 'Diagram') {
        const diagrama = firstJsxChildName(node);
        if (diagrama) {
          slides.push({ tipo: 'diagram', diagrama, caption: getAttr(node, 'caption') || undefined });
        }
      } else if (name === 'SolvedExercise') {
        slides.push(exerciseFrom(node));
      } else if (name === 'KeyTakeaways') {
        slides.push({ tipo: 'concept', eyebrow: 'Lo esencial', title: getAttr(node, 'title') || 'Lo esencial', body: condense(getText(node)) });
      } else if (CONCEPT_COMPONENTS.has(name)) {
        slides.push({ tipo: 'concept', title: getAttr(node, 'title') || undefined, body: condense(getText(node)) });
      }
      continue;
    }
  }
  flush();

  const cleaned = condenseDeck(slides);
  cleaned.push({
    tipo: 'close',
    title: 'Hasta aquí la teoría',
    nota: 'Continúa en el libro de la unidad.',
  });

  return {
    asignatura: String(fm.asignatura ?? ''),
    unidad: Number(fm.unidad ?? 0),
    title: String(fm.title ?? ''),
    slides: cleaned,
  };
}
