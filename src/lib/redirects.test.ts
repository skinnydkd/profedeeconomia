import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path/posix'; // '/' on Windows too: the paths are matched against '/' patterns

/**
 * An Astro `redirects` entry on a path that a page also generates makes both
 * write the same index.html, and which one wins changes between /es and /ca.
 * That is how /ca/<asig>/tests/ ended up as a stub to the Castilian dynamics
 * hub while /<asig>/tests/ stayed a page. Redirects must live elsewhere.
 */

/** Keys of the `redirects` block in astro.config.mjs, read statically. */
function redirectKeys(): string[] {
  const config = readFileSync('astro.config.mjs', 'utf8');
  const block = config.match(/^\s*redirects\s*:\s*\{([\s\S]*?)\}/m);
  if (!block) return [];
  return [...block[1].matchAll(/['"](\/[^'"]*)['"]\s*:/g)].map((m) => m[1]);
}

/** One pattern per page file; dynamic segments match any single segment. */
function pageRoutes(dir = 'src/pages'): RegExp[] {
  const out: RegExp[] = [];
  const walk = (d: string) => {
    for (const name of readdirSync(d)) {
      const path = join(d, name);
      if (statSync(path).isDirectory()) {
        walk(path);
        continue;
      }
      if (!/\.(astro|md|mdx|ts)$/.test(name) || /\.test\.ts$/.test(name)) continue;
      const route = relative('src/pages', path)
        .replace(/\.(astro|md|mdx|ts)$/, '')
        .replace(/(^|\/)index$/, '')
        .split('/')
        .map((seg) =>
          seg.startsWith('[...') ? '.*' : seg.startsWith('[') ? '[^/]+' : seg.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
        )
        .join('/');
      out.push(new RegExp(`^/${route}${route ? '/?' : ''}$`));
    }
  };
  walk(dir);
  return out;
}

/**
 * URLs Google still requests and that answered 404 in Search Console
 * (Nov 2026). Each needs a permanent redirect in vercel.json.
 */
describe('vercel.json legacy redirects', () => {
  const redirects: { source: string; destination: string; permanent?: boolean }[] = JSON.parse(
    readFileSync('vercel.json', 'utf8'),
  ).redirects;
  const bySource = new Map(redirects.map((r) => [r.source, r]));

  /** Both locales, with and without the trailing slash, like the libro entries. */
  const variants = (from: string, to: string): [string, string][] =>
    ['', '/ca'].flatMap((p) => [
      [`${p}${from}`, `${p}${to}/`],
      [`${p}${from}/`, `${p}${to}/`],
    ]);

  it('old webpde pages redirect without the .html extension too', () => {
    for (const r of redirects.filter((x) => /^\/[a-z0-9-]+\.html$/.test(x.source) && x.source !== '/index.html')) {
      const bare = bySource.get(r.source.replace(/\.html$/, ''));
      expect(bare?.destination, `${r.source} redirects but its extensionless URL does not`).toBe(r.destination);
      expect(bare?.permanent).toBe(true);
    }
  });

  it('eco-4eso units renamed in #263 redirect their actividades-dinamicas page', () => {
    const libro = redirects.filter((r) => /^\/eco-4eso\/libro\/[^/]+$/.test(r.source));
    expect(libro.length).toBeGreaterThan(0);
    for (const r of libro) {
      const from = r.source.replace('/libro/', '/actividades-dinamicas/');
      const to = r.destination.replace('/libro/', '/actividades-dinamicas/').replace(/\/$/, '');
      for (const [source, destination] of variants(from, to)) {
        expect(bySource.get(source)?.destination, source).toBe(destination);
        expect(bySource.get(source)?.permanent, source).toBe(true);
      }
    }
  });

  it('eco-4eso activities renumbered in #263 redirect to their new slug', () => {
    const RENAMED: [string, string][] = [
      ['03-detectar-greenwashing', '02-detectar-greenwashing'],
      ['08-analisis-nominas-reales', '05-analisis-nominas-reales'],
      ['18-debate-mileurista-falso-autonomo', '05-debate-mileurista-falso-autonomo'],
      ['ejercicio-u8-nomina-bruto-neto', '05-ejercicio-nomina-bruto-neto'],
      ['05-cazadores-dark-patterns', '07-cazadores-dark-patterns'],
      ['ejercicio-u7-presupuesto-ahorro', '07-ejercicio-presupuesto-ahorro'],
      ['15-ejercicio-reclamacion-consumidor', '07-ejercicio-reclamacion-consumidor'],
      ['21-proyecto-consumo-inteligente-familia', '07-proyecto-consumo-inteligente-familia'],
      ['22-ejercicio-interes-prestamo-tarjeta', '08-ejercicio-interes-prestamo-tarjeta'],
      ['01-caso-bar-catorce-meses', '10-caso-bar-catorce-meses'],
      ['16-caso-conflicto-de-equipo', '10-caso-conflicto-de-equipo'],
      ['13-debate-empresa-social-vs-tradicional', '10-debate-empresa-social-vs-tradicional'],
      ['06-debate-equipo-puede-despedir', '10-debate-equipo-puede-despedir'],
      ['06-equipo-aula-roles-belbin-sprint', '10-equipo-aula-roles-belbin-sprint'],
      ['12-caso-fracaso-que-ensena', '11-caso-fracaso-que-ensena'],
      ['14-caso-oportunidad-de-un-cambio', '11-caso-oportunidad-de-un-cambio'],
      ['04-debate-negocios-que-no-deberian-existir', '11-debate-negocios-que-no-deberian-existir'],
      ['04-diario-molestias-oportunidades', '11-diario-molestias-oportunidades'],
      ['03-ejercicio-medir-impacto-social', '11-ejercicio-medir-impacto-social'],
      ['02-ejercicio-scamper-mochila', '11-ejercicio-scamper-mochila'],
      ['01-mitos-emprendedor', '11-mitos-emprendedor'],
      ['02-scamper-objeto-cotidiano', '11-scamper-objeto-cotidiano'],
      ['09-caso-mercadona-cambia-de-canal', '12-caso-mercadona-cambia-de-canal'],
      ['10-demo-day-aula', '12-demo-day-aula'],
      ['17-dinamica-financiar-mi-idea', '12-dinamica-financiar-mi-idea'],
      ['20-dinamica-pitch-30-segundos', '12-dinamica-pitch-30-segundos'],
      ['19-ejercicio-bmc-relampago', '12-ejercicio-bmc-relampago'],
      ['10-ejercicio-metricas-vanidad-accionables', '12-ejercicio-metricas-vanidad-accionables'],
      ['09-capstone-parte1-diseno-proyecto-emprendedor', '12-proyecto-diseno-proyecto-emprendedor'],
    ];
    const dir = 'src/content/asignaturas/eco-4eso/actividades';
    const live = new Set(readdirSync(dir).map((f) => f.replace(/(\.ca)?\.mdx?$/, '')));
    for (const [oldSlug, newSlug] of RENAMED) {
      expect(live.has(newSlug), `${newSlug} is not a published activity`).toBe(true);
      // An old slug that a current activity reuses must stay a page, not a redirect.
      if (live.has(oldSlug)) continue;
      for (const [source, destination] of variants(
        `/eco-4eso/actividades/${oldSlug}`,
        `/eco-4eso/actividades/${newSlug}`,
      )) {
        expect(bySource.get(source)?.destination, source).toBe(destination);
        expect(bySource.get(source)?.permanent, source).toBe(true);
      }
    }
  });
});

describe('astro redirects', () => {
  const routes = pageRoutes();

  it('the route walker sees the pages it has to protect', () => {
    expect(routes.some((r) => r.test('/edmn-2bach/tests/'))).toBe(true);
    expect(routes.some((r) => r.test('/eco-1bach/libro/01-economia-ciencia-social/'))).toBe(true);
  });

  it('no redirect sits on a path a page already generates', () => {
    for (const key of redirectKeys()) {
      const clash = routes.find((r) => r.test(key) || r.test(`${key}/`));
      expect(clash, `redirect ${key} collides with page route ${clash}`).toBeUndefined();
    }
  });
});
