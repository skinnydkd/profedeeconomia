# Juegos: pedagogía, Olimpiadas e imprimibles — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Añadir justificación pedagógica (competencias específicas + mapa curricular) a dinámicas y juegos, reposicionar «Jocs Econòmics» como sección «Olimpiadas» propia, y crear versiones imprimibles de los 4 juegos de tablero/party.

**Architecture:** Se extiende el sub-schema `unidades_relacionadas` con competencias por unidad y se amplía `PuenteUnidades` para mostrarlas (PR A). Se crea un registro `src/lib/juegos.ts` que vuelve data-driven el hub de juegos y alimenta una ficha pedagógica inyectada en `GameShell` (PR B). Se añade «Jocs Econòmics» al menú con una landing de Olimpiadas sobre el leaderboard existente (PR D-pos). Los imprimibles reutilizan el patrón `@media print` de las dinámicas, derivando componentes de los datos ya presentes en `src/lib/games/` y `party/` (PR C).

**Tech Stack:** Astro 5, content collections, TypeScript estricto, Vitest, CSS `@media print`. Sin backend.

**Reference:** `docs/superpowers/specs/2026-06-02-juegos-pedagogia-olimpiadas.md`.

Patrones reutilizados (leer antes de empezar):
- `src/components/emprendimiento/PuenteUnidades.astro` — render del mapa curricular (lo ampliamos).
- `src/lib/dinamicas.ts` — `findBrokenUnidadRefs` (helper a generalizar/reutilizar).
- `src/pages/dinamicas/[...slug].astro` — `@media print` de aislamiento (origen del patrón de imprimibles).
- `src/components/games/GameShell.astro` — shell de cada juego (le inyectamos la ficha).
- `src/pages/juegos/index.astro` — hub actual hardcodeado (lo volvemos data-driven).
- `src/lib/asignaturas.ts` — `SECCIONES_TRANSVERSALES`, `ASIGNATURA_SLUGS`.

**Scope of THIS plan:** PRs A, B, D-pos como ingeniería bite-sized + una pieza de contenido piloto por cada uno. El relleno masivo de competencias en las 25 dinámicas y el contenido de los imprimibles (PR C) son autoría repetitiva: van en el Apéndice como workflow, no como tareas numeradas.

---

## PR A — Modelo de competencias por unidad + render

### Task A1: Extender el sub-schema `unidades_relacionadas` de `dinamicas`

**Files:**
- Modify: `src/content.config.ts` (colección `dinamicas`, objeto de `unidades_relacionadas`)

- [ ] **Step 1: Añadir el campo**

En la colección `dinamicas`, dentro de `unidades_relacionadas: z.array(z.object({ ... }))`, añade `competencias_especificas`:

```ts
    unidades_relacionadas: z.array(z.object({
      asignatura: z.enum(ASIGNATURA_SLUGS),
      unidad: z.number().int().min(1),
      nota: z.string().optional(),
      competencias_especificas: z.array(z.string()).default([]),
    })).default([]),
```

- [ ] **Step 2: Verificar que el schema sincroniza**

Run: `npx astro sync`
Expected: sin errores; las dinámicas existentes (sin el campo) siguen validando por el `.default([])`.

- [ ] **Step 3: Commit**

```bash
git add src/content.config.ts
git commit -m "feat(dinamicas): competencias específicas por unidad relacionada"
```

### Task A2: Renderizar las competencias por unidad en `PuenteUnidades`

**Files:**
- Modify: `src/components/emprendimiento/PuenteUnidades.astro`

- [ ] **Step 1: Aceptar y mostrar el nuevo campo**

El componente recibe `unidades: Bridge[]`. Amplía la interfaz `Bridge` y el bloque de cada `<li>` para mostrar los códigos. Cambia la interfaz y el `.map` así (mantén el resto del archivo igual):

```astro
interface Bridge { asignatura: string; unidad: number; nota?: string; competencias_especificas?: string[]; }
```

Y dentro del `<li>`, tras el bloque de `b.nota`, añade:

```astro
          {b.competencias_especificas && b.competencias_especificas.length > 0 && (
            <span class="puente__comp">Competencias específicas: {b.competencias_especificas.join(', ')}</span>
          )}
```

Y en el `<style>` añade:

```css
  .puente__comp { display: block; font-family: var(--font-sans); font-size: 0.78rem; color: var(--color-ink-mute); margin-top: 0.2rem; }
```

- [ ] **Step 2: Verificar build**

Run: `npx astro build`
Expected: build limpio (`Complete!`). El componente sigue renderizando dinámicas que no traen competencias (campo opcional).

- [ ] **Step 3: Commit**

```bash
git add src/components/emprendimiento/PuenteUnidades.astro
git commit -m "feat(dinamicas): muestra las competencias específicas por unidad"
```

### Task A3: Rellenar competencias en las 25 dinámicas

Contenido repetitivo — ver **Apéndice 1**. No es una tarea de ingeniería.

---

## PR B — Registro de juegos, hub data-driven y ficha pedagógica

### Task B1: Crear el registro `src/lib/juegos.ts`

**Files:**
- Create: `src/lib/juegos.ts`
- Test: `src/lib/juegos.test.ts`

- [ ] **Step 1: Escribir el test que falla**

```ts
// src/lib/juegos.test.ts
import { describe, it, expect } from 'vitest';
import { JUEGOS, findBrokenJuegoRefs } from './juegos.ts';

describe('JUEGOS', () => {
  it('declares the 5 games with unique slugs', () => {
    const slugs = JUEGOS.map((j) => j.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    expect(slugs).toEqual(expect.arrayContaining(['stonks', 'econrisk', 'econopoly', 'cajut', 'insider']));
  });
  it('marks exactly the four tablero/party games as imprimible', () => {
    const printables = JUEGOS.filter((j) => j.imprimible).map((j) => j.slug).sort();
    expect(printables).toEqual(['cajut', 'econopoly', 'econrisk', 'insider']);
  });
  it('gives every game at least one curriculum bridge', () => {
    for (const j of JUEGOS) expect(j.unidades_relacionadas.length).toBeGreaterThan(0);
  });
});

describe('findBrokenJuegoRefs', () => {
  const libroUnits = new Set(['eco-1bach#4', 'eco-1bach#6']);
  it('returns nothing when refs exist', () => {
    const games = [{ slug: 'g', unidades_relacionadas: [{ asignatura: 'eco-1bach', unidad: 4 }] }];
    expect(findBrokenJuegoRefs(games as any, libroUnits)).toEqual([]);
  });
  it('flags a missing unit', () => {
    const games = [{ slug: 'g', unidades_relacionadas: [{ asignatura: 'eco-1bach', unidad: 9 }] }];
    expect(findBrokenJuegoRefs(games as any, libroUnits)).toEqual([{ slug: 'g', asignatura: 'eco-1bach', unidad: 9 }]);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/juegos.test.ts`
Expected: FAIL — `Cannot find module './juegos.ts'`.

- [ ] **Step 3: Implementar el registro**

```ts
// src/lib/juegos.ts
/**
 * Single source of truth for the 5 games under /juegos/. Mirrors the metadata
 * approach of dinámicas: each game carries its curriculum map and competences,
 * so the hub and each game page can show the pedagogical justification.
 * NOTE: «Jocs Econòmics» (the Olympiad quiz) is NOT here — it is its own section.
 */
import type { AsignaturaSlug } from './asignaturas';

export interface JuegoBridge {
  asignatura: AsignaturaSlug;
  unidad: number;
  nota?: string;
  competencias_especificas?: string[];
}

export interface Juego {
  slug: string;
  title: string;
  descripcion: string;
  tipo: 'simulador' | 'estrategia' | 'tablero' | 'party';
  nivel: ('eso' | 'bach' | 'fp')[];
  modo: string;
  estado: 'disponible' | 'proximamente';
  imprimible: boolean;
  unidades_relacionadas: JuegoBridge[];
  competencias_clave: string[];
}

export const JUEGOS: Juego[] = [
  {
    slug: 'stonks', title: 'Stonks',
    descripcion: 'Invierte durante 25 años repartiendo tu patrimonio entre activos. ¿Acabarás con más que la IA?',
    tipo: 'simulador', nivel: ['bach', 'fp'], modo: '1 jugador', estado: 'disponible', imprimible: false,
    unidades_relacionadas: [
      { asignatura: 'eco-1bach', unidad: 3, nota: 'Planificación financiera y carteras de inversión.', competencias_especificas: [] },
      { asignatura: 'eco-1bach', unidad: 10, nota: 'Sistema financiero, riesgo y rentabilidad.', competencias_especificas: [] },
    ],
    competencias_clave: ['STEM', 'CD', 'CPSAA', 'CE'],
  },
  {
    slug: 'econrisk', title: 'Econrisk',
    descripcion: 'Juego de estrategia: conquista territorios con las grandes escuelas del pensamiento económico.',
    tipo: 'estrategia', nivel: ['bach'], modo: '1 jugador vs IA', estado: 'disponible', imprimible: true,
    unidades_relacionadas: [
      { asignatura: 'eco-1bach', unidad: 1, nota: 'La economía como ciencia social: escuelas de pensamiento.', competencias_especificas: [] },
    ],
    competencias_clave: ['CCL', 'CPSAA', 'CC', 'CE'],
  },
  {
    slug: 'econopoly', title: 'Econopoly',
    descripcion: 'Monopoly económico hot-seat 1-6: monopolios, R+D, ciclos, Banco Central y fiscalidad progresiva.',
    tipo: 'tablero', nivel: ['eso', 'bach'], modo: '1-6 hot-seat', estado: 'disponible', imprimible: true,
    unidades_relacionadas: [
      { asignatura: 'eco-1bach', unidad: 4, nota: 'Mercado, precios y competencia.', competencias_especificas: [] },
      { asignatura: 'eco-1bach', unidad: 11, nota: 'Política fiscal y monetaria, Banco Central.', competencias_especificas: [] },
    ],
    competencias_clave: ['STEM', 'CPSAA', 'CC', 'CE'],
  },
  {
    slug: 'cajut', title: 'Cajut',
    descripcion: 'Party de economía por equipos: preguntas rápidas para repasar conceptos en grupo.',
    tipo: 'party', nivel: ['eso', 'bach'], modo: 'multijugador (party)', estado: 'disponible', imprimible: true,
    unidades_relacionadas: [
      { asignatura: 'taller-eco-3eso', unidad: 1, nota: 'Repaso de conceptos básicos de economía.', competencias_especificas: [] },
    ],
    competencias_clave: ['CCL', 'STEM', 'CPSAA', 'CE'],
  },
  {
    slug: 'insider', title: 'Insider',
    descripcion: 'Deducción social: el grupo adivina una palabra; alguien sabe la respuesta… y nadie debe notarlo.',
    tipo: 'party', nivel: ['eso', 'bach', 'fp'], modo: 'multijugador (party)', estado: 'disponible', imprimible: true,
    unidades_relacionadas: [
      { asignatura: 'taller-eco-3eso', unidad: 1, nota: 'Vocabulario económico básico, de forma lúdica.', competencias_especificas: [] },
    ],
    competencias_clave: ['CCL', 'CPSAA', 'CC'],
  },
];

export interface BrokenJuegoRef { slug: string; asignatura: string; unidad: number; }

/** Return every game curriculum bridge that does not match an existing published unit. */
export function findBrokenJuegoRefs(
  games: { slug: string; unidades_relacionadas: { asignatura: string; unidad: number }[] }[],
  libroUnits: Set<string>,
): BrokenJuegoRef[] {
  const broken: BrokenJuegoRef[] = [];
  for (const g of games) {
    for (const u of g.unidades_relacionadas) {
      if (!libroUnits.has(`${u.asignatura}#${u.unidad}`)) {
        broken.push({ slug: g.slug, asignatura: u.asignatura, unidad: u.unidad });
      }
    }
  }
  return broken;
}
```

> Las `competencias_especificas` van vacías aquí; se rellenan en el Apéndice 2 (revisión de Pau). Las unidades elegidas son reales y publicadas (verificar contra `src/content/asignaturas/*/libro/`).

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/lib/juegos.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/juegos.ts src/lib/juegos.test.ts
git commit -m "feat(juegos): registro de juegos con metadatos pedagógicos"
```

### Task B2: Hub de juegos data-driven

**Files:**
- Modify: `src/pages/juegos/index.astro`

- [ ] **Step 1: Sustituir las cards hardcodeadas por el registro**

Reemplaza el bloque `<div class="game-grid"> … </div>` (las cards escritas a mano) por uno generado desde `JUEGOS`, y el párrafo del «quiz competitivo» por un enlace a la nueva sección. En el frontmatter del archivo añade:

```astro
import { JUEGOS } from '@/lib/juegos';
const NIVEL_LABEL: Record<string, string> = { eso: 'ESO', bach: 'Bachillerato', fp: 'FP' };
```

Sustituye la rejilla por:

```astro
      <div class="game-grid">
        {JUEGOS.map((j) => (
          <a class={`game-card ${j.estado}`} href={`/juegos/${j.slug}/`}>
            <div class="gc-eyebrow">{j.estado === 'disponible' ? 'Disponible' : 'Próximamente'}{j.imprimible && ' · Imprimible'}</div>
            <div class="gc-title serif">{j.title}</div>
            <p class="gc-desc">{j.descripcion}</p>
            <span class="gc-meta">{j.nivel.map((n) => NIVEL_LABEL[n]).join(' · ')} · {j.modo}</span>
            <span class="gc-cta">Jugar →</span>
          </a>
        ))}
      </div>
```

Y sustituye la frase del quiz competitivo en la `.lede` por un enlace a Olimpiadas:

```astro
      <p class="lede">
        Simuladores, juegos de tablero y party para una clase activa. ¿Buscas el
        concurso competitivo? Está en <a href="/jocs-economics/" class="editorial-link">nuestras Olimpiadas de Economía</a>.
      </p>
```

Añade al `<style>` la regla `.gc-meta` si no existe:

```css
  .gc-meta { display:block; font-family: var(--font-mono); font-size:.74rem; color: var(--color-ink-mute); margin:.3rem 0; }
```

- [ ] **Step 2: Verificar build y que lista los 5 juegos**

Run: `npx astro build`
Then: `node -e "const fs=require('fs');const h=fs.readFileSync('dist/client/juegos/index.html','utf8');['Stonks','Econrisk','Econopoly','Cajut','Insider','Olimpiadas'].forEach(s=>{if(!h.includes(s)){console.error('MISSING',s);process.exit(1)}});console.log('OK')"`
Expected: `OK`.

- [ ] **Step 3: Commit**

```bash
git add src/pages/juegos/index.astro
git commit -m "feat(juegos): hub data-driven desde el registro JUEGOS"
```

### Task B3: Ficha pedagógica en `GameShell`

**Files:**
- Modify: `src/components/games/GameShell.astro`
- Modify: las 5 páginas `src/pages/juegos/{stonks,econrisk,econopoly,cajut,insider}/index.astro` (pasar `slug`)

- [ ] **Step 1: Ampliar `GameShell` para mostrar la ficha**

Reemplaza el frontmatter y el cuerpo de `GameShell.astro` por:

```astro
---
import BaseLayout from '@layouts/BaseLayout.astro';
import PuenteUnidades from '@components/emprendimiento/PuenteUnidades.astro';
import { JUEGOS } from '@/lib/juegos';
interface Props { title: string; wide?: boolean; slug?: string; }
const { title, wide = false, slug } = Astro.props;
const juego = slug ? JUEGOS.find((j) => j.slug === slug) : undefined;
---
<BaseLayout title={title} description={`${title} — juego de profedeeconomia.es`}>
  <div class={`game-shell${wide ? ' game-shell--wide' : ''}`}>
    <a class="game-exit" href="/juegos/">← Volver a Juegos</a>
    <slot />
    {juego && (
      <section class="game-ficha">
        <h2>Para el profe</h2>
        <PuenteUnidades unidades={juego.unidades_relacionadas} />
        {juego.competencias_clave.length > 0 && (
          <p class="game-comp"><strong>Competencias clave:</strong> {juego.competencias_clave.join(' · ')}</p>
        )}
      </section>
    )}
  </div>
</BaseLayout>
<style>
  .game-shell { max-width: 720px; margin: 0 auto; padding: 1rem clamp(1rem, 4vw, 2rem) 4rem; }
  .game-shell--wide { max-width: 1180px; }
  .game-exit { display: inline-block; margin: 1rem 0; color: var(--color-ink-mute); text-decoration: none; font-size: .92rem; }
  .game-exit:hover { color: var(--color-terra); }
  .game-ficha { max-width: 820px; margin: 3rem auto 0; padding-top: 1.5rem; border-top: 1px solid var(--color-line); }
  .game-ficha h2 { font-family: var(--font-serif); font-size: 1.4rem; font-weight: 500; margin: 0 0 0.5rem; }
  .game-comp { color: var(--color-ink-soft); margin-top: 0.8rem; }
</style>
```

- [ ] **Step 2: Pasar `slug` en las 5 páginas de juego**

En cada `src/pages/juegos/{slug}/index.astro`, añade el atributo `slug` al `<GameShell>`. Ejemplo para stonks:

```astro
<GameShell title="Stonks" slug="stonks">
  <StonksGame client:load />
</GameShell>
```

Haz lo equivalente en econrisk (`slug="econrisk"`), econopoly (`slug="econopoly"` — conserva `wide`), cajut (`slug="cajut"`) e insider (`slug="insider"`). Mantén el resto de cada archivo igual.

- [ ] **Step 3: Verificar build y que la ficha aparece**

Run: `npx astro build`
Then: `node -e "const fs=require('fs');const h=fs.readFileSync('dist/client/juegos/stonks/index.html','utf8');['Para el profe','Esto se trabaja en','Competencias clave'].forEach(s=>{if(!h.includes(s)){console.error('MISSING',s);process.exit(1)}});console.log('OK')"`
Expected: `OK`.

- [ ] **Step 4: Commit**

```bash
git add src/components/games/GameShell.astro src/pages/juegos/
git commit -m "feat(juegos): ficha pedagógica (encaje curricular + competencias) por juego"
```

---

## PR D-pos — «Jocs Econòmics» como sección Olimpiadas

### Task D1: Añadir la sección al menú «Otros»

**Files:**
- Modify: `src/lib/asignaturas.ts` (`SECCIONES_TRANSVERSALES`)
- Test: `src/lib/asignaturas.test.ts` (ya existe; añadir casos)

- [ ] **Step 1: Escribir el test que falla**

Añade a `src/lib/asignaturas.test.ts` un nuevo `describe`:

```ts
import { SECCIONES_TRANSVERSALES as ST } from './asignaturas.ts';
describe('SECCIONES_TRANSVERSALES — jocs-economics', () => {
  it('incluye jocs-economics tras dinamicas', () => {
    const slugs = ST.map((s) => s.slug);
    expect(slugs).toContain('jocs-economics');
    expect(slugs.indexOf('jocs-economics')).toBe(slugs.indexOf('dinamicas') + 1);
  });
  it('lo presenta como las Olimpiadas', () => {
    const s = ST.find((x) => x.slug === 'jocs-economics');
    expect(s?.label).toBe('Jocs Econòmics');
    expect(s?.description.toLowerCase()).toContain('olimpiada');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/asignaturas.test.ts`
Expected: FAIL — `jocs-economics` no está.

- [ ] **Step 3: Añadir la entrada**

Modifica `SECCIONES_TRANSVERSALES` para que la lista termine así:

```ts
  { slug: 'dinamicas',      label: 'Dinámicas',      description: 'Role-plays y simulaciones para hacer en clase.' },
  { slug: 'jocs-economics', label: 'Jocs Econòmics', description: 'Nuestras Olimpiadas de Economía.' },
] as const;
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/lib/asignaturas.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/asignaturas.ts src/lib/asignaturas.test.ts
git commit -m "feat(jocs-economics): añade la sección Olimpiadas al menú Otros"
```

### Task D2: Landing de Olimpiadas

**Files:**
- Modify: `src/pages/jocs-economics/index.astro`

- [ ] **Step 1: Añadir una portada editorial sobre el juego**

La página actual solo monta `<JocsApp client:only="preact" />`. Envuélvela con una portada que presente las Olimpiadas, manteniendo el juego accesible. Reemplaza el cuerpo por:

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import JocsApp from '../../components/jocs-economics/JocsApp';
---
<BaseLayout title="Jocs Econòmics — nuestras Olimpiadas de Economía" description="Nuestras Olimpiadas de Economía: un quiz competitivo de economía, finanzas y empresa con ranking por alumno y por instituto. Participa y compite por ser el mejor alumno y el mejor instituto.">
  <main class="olimpiadas">
    <div class="container">
      <nav class="breadcrumb"><a href="/">Inicio</a> <span class="sep">›</span> <span>Jocs Econòmics</span></nav>
      <span class="kicker">Nuestras Olimpiadas</span>
      <h1>Las <span class="serif-italic-wonk accent">Olimpiadas de Economía</span>.</h1>
      <p class="lede">
        Un quiz competitivo de economía, finanzas y empresa: tres vidas, dificultad
        creciente y un ranking que premia al <strong>mejor alumno</strong> y al
        <strong>mejor instituto</strong>. Participa, sube en la clasificación y
        lleva a tu centro a lo más alto.
      </p>
      <ul class="como">
        <li><strong>Cómo se juega:</strong> responde preguntas cada vez más difíciles; fallar cuesta una vida.</li>
        <li><strong>Cómo se gana:</strong> tu puntuación cuenta para tu ranking individual y para la media de tu instituto.</li>
        <li><strong>Premios:</strong> reconocimiento al mejor alumno y al mejor instituto de cada edición.</li>
      </ul>
      <a class="ver-ranking" href="/jocs-economics/leaderboard/">Ver la clasificación →</a>
    </div>
    <div class="game-mount"><JocsApp client:only="preact" /></div>
  </main>
</BaseLayout>
<style is:global> body { margin: 0; } </style>
<style>
  .olimpiadas .container { max-width: 820px; margin: 0 auto; padding: 0 clamp(1.5rem, 4vw, 3rem); }
  .breadcrumb { font-size: .92rem; color: var(--color-ink-mute); margin: 2rem 0; }
  .breadcrumb a { color: var(--color-ink-mute); text-decoration: none; }
  .breadcrumb .sep { margin: 0 .5em; color: var(--color-mustard); }
  .kicker { font-family: var(--font-sans); font-size: .8rem; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: var(--color-terra); }
  h1 { margin: .6rem 0 .8rem; }
  .accent { color: var(--color-terra); }
  .lede { font-size: 1.2rem; color: var(--color-ink-soft); line-height: 1.55; }
  .como { list-style: none; padding: 0; margin: 1.5rem 0; display: flex; flex-direction: column; gap: .6rem; }
  .como li { padding-left: 1.1rem; position: relative; color: var(--color-ink); }
  .como li::before { content: "→"; position: absolute; left: 0; color: var(--color-mustard); }
  .ver-ranking { display: inline-block; margin: 0 0 2rem; color: var(--color-terra); font-weight: 600; text-decoration: none; }
  .ver-ranking:hover { text-decoration: underline; }
  .game-mount { margin-top: 1rem; }
</style>
```

- [ ] **Step 2: Verificar build y framing**

Run: `npx astro build`
Then: `node -e "const fs=require('fs');const h=fs.readFileSync('dist/client/jocs-economics/index.html','utf8');['Olimpiadas de Economía','mejor instituto','Ver la clasificación'].forEach(s=>{if(!h.includes(s)){console.error('MISSING',s);process.exit(1)}});console.log('OK')"`
Expected: `OK`.

- [ ] **Step 3: Commit**

```bash
git add src/pages/jocs-economics/index.astro
git commit -m "feat(jocs-economics): landing de Olimpiadas sobre el juego existente"
```

---

## Self-Review notes (addressed)

- **Spec coverage:** A (§3) → Tasks A1–A3; B (§4) → Tasks B1–B3; D-pos (§6) → Tasks D1–D2; C (§5) → Apéndice 3. Competencias en juegos (§4.1) → registro B1 + Apéndice 2. Testing (§7) → tests en A2(build), B1, D1, y print guard en Apéndice 3.
- **Type consistency:** `JuegoBridge`/`Juego`/`findBrokenJuegoRefs` y `Bridge` (PuenteUnidades) comparten la forma `{asignatura, unidad, nota?, competencias_especificas?}`. `slug` prop de `GameShell` coincide con `JUEGOS[].slug`.
- **No placeholders:** competencias vacías en B1 son intencionales (se rellenan con revisión de Pau, Apéndice 2), marcado explícitamente.

---

## Apéndice 1 — Rellenar competencias en las 25 dinámicas (PR A, contenido)

No es ingeniería: por cada dinámica MDX en `src/content/dinamicas/**`, añadir `competencias_especificas: [...]` a cada entrada de `unidades_relacionadas`, con los códigos CE (ESO/Bach) o RA (FP) reales de esa asignatura, consultando su `src/content/asignaturas/{asignatura}/programacion/programacion.mdx` y el currículo LOMLOE. Workflow recomendado: subagents en paralelo, uno por familia de dinámicas, **sin tocar `estado`** (las publicadas siguen publicadas; el añadido de competencias también lo revisa Pau). Verificar con `astro build` al final.

## Apéndice 2 — Rellenar competencias en los 5 juegos (PR B, contenido)

Editar `src/lib/juegos.ts`: rellenar `competencias_especificas` en cada `unidades_relacionadas` de los 5 juegos, con los códigos reales de la asignatura referida. Una sola edición revisable por Pau.

## Apéndice 3 — Imprimibles print-and-play (PR C)

Para cada uno de Econopoly, Econrisk, Cajut, Insider: crear `src/pages/juegos/{slug}/imprimir.astro` que reúna **reglas + componentes** como bloques `.print-block`, con `PrintButton` y el mismo `@media print` de aislamiento que `src/pages/dinamicas/[...slug].astro` (copiar esas reglas; mostrar solo `.print-block` en impresión, una por A4). Derivar los componentes de los datos existentes:
- Econopoly: `src/lib/games/econopoly/board.ts` (tablero), `events.ts` (cartas).
- Econrisk: `src/lib/games/econrisk/map.ts`, `factions.ts`, `events.ts`.
- Cajut: banco de preguntas en `party/cajut/`.
- Insider: roles/palabras en `party/insider/`.
Cada imprimible: un test de aislamiento de print (guard como `src/pages/dinamicas/print-isolation.test.ts`). Un PR por juego o por par. Enlazar el imprimible desde la ficha del juego (`GameShell`) con un enlace «Versión para imprimir».
