import { renderTitle } from './title-slide.mjs';
import { renderSectionCover } from './section-cover.mjs';
import { renderObjetivos, renderConceptos } from '../slide-parsers/frontmatter.mjs';
import { renderTldr } from '../slide-parsers/tldr.mjs';
import { renderCaso, renderVuelveAlCaso } from '../slide-parsers/caso.mjs';
import { renderFigure } from '../slide-parsers/figure.mjs';
import { renderRealExample } from '../slide-parsers/real-example.mjs';
import { renderCuriosity } from '../slide-parsers/curiosity.mjs';
import { renderCallout } from '../slide-parsers/callout.mjs';
import { renderSteps } from '../slide-parsers/steps.mjs';
import { renderSolvedExercise } from '../slide-parsers/solved-exercise.mjs';
import { renderDiagram } from '../slide-parsers/diagram.mjs';
import { renderVoces } from '../slide-parsers/voces.mjs';
import { renderPistaEbau } from '../slide-parsers/pista-ebau.mjs';
import { renderRetoEtapa } from '../slide-parsers/reto-etapa.mjs';
import { renderMirarFora } from '../slide-parsers/mirar-fora.mjs';
import { renderKeyTakeaways } from '../slide-parsers/key-takeaways.mjs';
import { renderConceptSlide } from '../slide-parsers/h2-section.mjs';
import { resolveAssetPath } from '../slide-parsers/imports.mjs';
import { getAttr, getText } from '../slide-parsers/ast.mjs';

const COMPONENT_RENDERERS = {
  TldrUnidad: (node) => [renderTldr(node)],
  CasoDilema: (node, ctx) => [renderCaso(node, { heroImageAbs: ctx.heroImageAbs })],
  VuelveAlCaso: (node, ctx) => [renderVuelveAlCaso(node, { heroImageAbs: ctx.heroImageAbs })],
  Figure: (node, ctx) => [renderFigure(node, ctx.importsMap)],
  RealExample: (node) => [renderRealExample(node)],
  Curiosity: (node) => [renderCuriosity(node)],
  Callout: (node) => [renderCallout(node)],
  Steps: (node) => [renderSteps(node)],
  SolvedExercise: (node) => renderSolvedExercise(node),
  Diagram: (node, ctx) => [renderDiagram(node, {
    asignatura: ctx.asignatura,
    unitSlug: ctx.unitSlug,
    positionalIndex: ctx.diagramIndex++,
  })],
  VocesDesacuerdo: (node) => [renderVoces(node)],
  PistaEbau: (node) => [renderPistaEbau(node)],
  RetoEtapa: (node) => [renderRetoEtapa(node)],
  MirarFora: (node) => [renderMirarFora(node)],
  KeyTakeaways: (node) => [renderKeyTakeaways(node)],
};

function isComponent(node) {
  return (node.type === 'mdxJsxFlowElement' || node.type === 'mdxJsxTextElement')
    && node.name && COMPONENT_RENDERERS[node.name];
}

function groupByH2(rootChildren) {
  const groups = [];
  let current = { heading: null, items: [] };
  for (const node of rootChildren) {
    if (node.type === 'heading' && node.depth === 2) {
      if (current.heading || current.items.length) groups.push(current);
      current = { heading: (node.children || []).map(getText).join(' ').trim(), items: [] };
    } else {
      current.items.push(node);
    }
  }
  if (current.heading || current.items.length) groups.push(current);
  return groups;
}

/**
 * Builds the full deck markdown.
 */
export function assembleDeck({ frontmatter, ast, asignatura, unitSlug, importsMap }) {
  const ctx = {
    asignatura,
    unitSlug,
    importsMap,
    diagramIndex: 0,
    heroImageAbs: null,
  };

  // resolve the first <Figure> import as the hero image for caso/vuelve
  const figures = (ast.children || []).filter((n) => n.type === 'mdxJsxFlowElement' && n.name === 'Figure');
  if (figures.length) {
    const ident = getAttr(figures[0], 'src');
    const importPath = importsMap.get(String(ident || '').trim());
    ctx.heroImageAbs = resolveAssetPath(importPath);
  }

  const groups = groupByH2(ast.children || []);
  const slides = [];

  // 1. Title slide
  slides.push(renderTitle(frontmatter));

  // 2. Preamble components (TldrUnidad, CasoDilema, top-of-doc Figures)
  const preamble = groups.find((g) => g.heading === null);
  if (preamble) {
    for (const item of preamble.items) {
      if (isComponent(item)) {
        const rendered = COMPONENT_RENDERERS[item.name](item, ctx).filter(Boolean);
        slides.push(...rendered);
      }
    }
  }

  // 3. Objetivos, 4. Conceptos
  const o = renderObjetivos(frontmatter); if (o) slides.push(o);
  const c = renderConceptos(frontmatter); if (c) slides.push(c);

  // 5. Per-H2 groups (skipping preamble already handled)
  const keyTakeawaysSlides = [];
  const vuelveSlides = [];
  const mirarForaSlides = [];
  const retoSlides = [];

  for (const group of groups) {
    if (group.heading === null) continue;
    slides.push(renderSectionCover(group.heading));

    let proseBuffer = [];
    const flushProse = () => {
      if (!proseBuffer.length) return;
      const md = renderConceptSlide(group.heading, proseBuffer);
      if (md) slides.push(md);
      proseBuffer = [];
    };

    for (const item of group.items) {
      if (isComponent(item)) {
        flushProse();
        const rendered = COMPONENT_RENDERERS[item.name](item, ctx).filter(Boolean);
        // Tail components go at the end of the deck:
        if (item.name === 'KeyTakeaways') keyTakeawaysSlides.push(...rendered);
        else if (item.name === 'VuelveAlCaso') vuelveSlides.push(...rendered);
        else if (item.name === 'MirarFora') mirarForaSlides.push(...rendered);
        else if (item.name === 'RetoEtapa') retoSlides.push(...rendered);
        else slides.push(...rendered);
      } else {
        proseBuffer.push(item);
      }
    }
    flushProse();
  }

  // 6. Tail slides in the spec'd order
  slides.push(...vuelveSlides);
  slides.push(...retoSlides);
  slides.push(...keyTakeawaysSlides);
  slides.push(...mirarForaSlides);

  // 7. Close slide
  slides.push([
    '<!-- _class: close -->',
    '<!-- _paginate: false -->',
    '',
    '# Hasta aquí la teoría.',
    '',
    '<p>Continúa en el libro · profedeeconomia.es</p>',
  ].join('\n'));

  return slides.filter(Boolean);
}
