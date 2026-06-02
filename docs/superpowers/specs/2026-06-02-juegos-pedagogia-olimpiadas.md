# Spec — Juegos: justificación pedagógica, reestructuración «Olimpiadas» e imprimibles

- **Fecha**: 2026-06-02
- **Autor**: Pau Monterde (profedeeconomia.es)
- **Estado del spec**: en revisión
- **Alcance**: A + B + C + posicionamiento de D (la pieza D-full de registro/premios queda para un spec propio posterior)

## 1. Objetivo

Cuatro mejoras sobre la sección de juegos, decididas en brainstorming:

- **A** — Añadir las **competencias específicas** (CE para ESO/Bach, RA para FP) que trabaja cada **dinámica** (las 25 ya existentes) y cada **juego**, para cerrar la justificación pedagógica.
- **B** — Dar a los juegos una **capa de metadatos** equivalente a la de las dinámicas: mapa de encaje curricular (`unidades_relacionadas`) y competencias, con una **ficha pedagógica** en cada juego y un hub data-driven.
- **C** — **Versiones imprimibles** (print-and-play) de los 4 juegos de tablero/party: Econopoly, Econrisk, Cajut, Insider.
- **D (posicionamiento)** — Reposicionar **«Jocs Econòmics»** como sección propia en «Otros», presentada como **«Nuestras Olimpiadas de Economía»** (participa y gana premios al mejor alumno y mejor instituto), sobre el leaderboard ya existente. **Sin** sistema de registro/premios gestionado (eso es D-full, spec aparte).

## 2. Decisiones de brainstorming

- **Modelo de competencias**: las competencias específicas se **atan a cada unidad relacionada** (no como lista plana), porque un mismo código («CE3») significa cosas distintas en cada asignatura. Así cada código queda inequívoco y pedagógicamente preciso.
- **Olimpiadas**: ahora solo **marco + posicionamiento**; el registro/premios gestionado (backend Supabase + datos de alumnos + GDPR) va a un spec propio posterior.
- **Imprimibles**: solo los 4 de tablero/party (Stonks queda fuera: simulación de 25 años con datos, inviable en físico).
- **Todo el contenido nuevo nace en `borrador`**: revisión manual de Pau antes de publicar (regla del proyecto; la precisión del contenido es crítica).
- **Sin cambios al sistema visual**: se reutilizan tokens y componentes existentes (`PuenteUnidades`, patrón de print de dinámicas).

## 3. A — Competencias específicas (modelo y datos)

### 3.1 Cambio de modelo

Se extiende la entrada de `unidades_relacionadas` (en la colección `dinamicas` y en el nuevo registro de juegos) con un campo opcional `competencias_especificas`:

```yaml
unidades_relacionadas:
  - { asignatura: "fopp-4eso", unidad: 9, nota: "…", competencias_especificas: ["CE5", "CE6"] }
  - { asignatura: "ipe2-fp",   unidad: 1, nota: "…", competencias_especificas: ["RA1", "RA4"] }
```

- Códigos por etapa: **CE1..CEn** (ESO/Bachillerato), **RA1..RAn** (FP). Cada asignatura tiene su propio conjunto; el código solo es inequívoco junto a su `asignatura`.
- Fuente de los códigos: la `programacion.mdx` de cada asignatura y el currículo LOMLOE (RD 217/2022 ESO, RD 243/2022 Bach; los RA de FP de los reales decretos de cada título). Convención ya usada por las `actividades` del proyecto.
- El campo top-level `competencias_especificas` (lista plana) de la colección `dinamicas` queda **obsoleto para visualización** (se mantiene en el schema por compatibilidad, pero la fuente de verdad pasa a ser la versión por-unidad). `competencias_clave` (las 8 LOMLOE) sigue como lista plana top-level: son universales e inequívocas.

### 3.2 Schema

- `src/content.config.ts` → colección `dinamicas` → cada item de `unidades_relacionadas` añade `competencias_especificas: z.array(z.string()).default([])`.
- El mismo sub-schema se usa en el registro de juegos (§4).

### 3.3 Render

- `src/components/emprendimiento/PuenteUnidades.astro` (reutilizado por dinámicas) se amplía para mostrar, bajo cada unidad, los códigos de competencia específica trabajados ahí (p. ej. «· CE5, CE6»). Cambio retrocompatible: si una entrada no trae competencias, se renderiza como ahora.

### 3.4 Datos a rellenar

- Las **25 dinámicas**: añadir `competencias_especificas` a cada entrada de `unidades_relacionadas`, verificadas contra la `programacion.mdx` de la asignatura correspondiente.

## 4. B — Capa de metadatos de los juegos

### 4.1 Registro

Nuevo `src/lib/juegos.ts`, fuente única de los 5 juegos de `/juegos/`:

```ts
export interface Juego {
  slug: string;            // 'stonks' | 'econrisk' | 'econopoly' | 'cajut' | 'insider'
  title: string;
  descripcion: string;     // una línea para la card del hub
  tipo: 'simulador' | 'estrategia' | 'tablero' | 'party';
  nivel: ('eso' | 'bach' | 'fp')[];
  modo: string;            // "1 jugador" / "1-6 hot-seat" / "multijugador (party)"
  estado: 'disponible' | 'proximamente';
  imprimible: boolean;     // true en econopoly, econrisk, cajut, insider
  unidades_relacionadas: {
    asignatura: AsignaturaSlug; unidad: number; nota?: string;
    competencias_especificas?: string[];
  }[];
  competencias_clave: string[];   // CCL, STEM, CPSAA, CC, CE…
}
export const JUEGOS: Juego[] = [ … ];   // 5 entradas
```

(Se valora compartir el sub-tipo de `unidades_relacionadas` con la colección `dinamicas` mediante un tipo común en `src/lib/`.)

### 4.2 Hub data-driven

- `src/pages/juegos/index.astro` deja de hardcodear las cards y las genera desde `JUEGOS`. Cada card enlaza a `/juegos/{slug}/` y muestra título, descripción, badges (tipo · nivel · modo) y, si `imprimible`, una etiqueta «Imprimible».
- El texto sobre «quiz competitivo» se sustituye por un enlace a la nueva sección «Jocs Econòmics» (§6), que sale de `/juegos/`.

### 4.3 Ficha pedagógica por juego

- Cada página de juego (`/juegos/{slug}/`) añade, fuera del propio juego interactivo, una sección con: mapa de encaje curricular (`PuenteUnidades` con `unidades_relacionadas`) y competencias (clave + específicas por unidad). Patrón idéntico al de la página de detalle de dinámica.

## 5. C — Versiones imprimibles (print-and-play)

Para **Econopoly, Econrisk, Cajut, Insider**: una ruta imprimible `/juegos/{slug}/imprimir/` (o sección con modo print) que reúne **reglas + componentes** como bloques `.print-block`, con botón «Imprimir» y `@media print` que aísla solo el material (mismo patrón que los materiales de las dinámicas; reutiliza esa CSS).

- **Econopoly**: tablero de 28 casillas (datos en `src/lib/games/econopoly/board.ts`), cartas de noticias (`events.ts`), dinero/fichas y hoja de reglas.
- **Econrisk**: mapa de territorios (`src/lib/games/econrisk/map.ts`), facciones (`factions.ts`), cartas de evento (`events.ts`) y reglas.
- **Cajut**: cartas (banco de preguntas en `party/cajut/`) y reglas.
- **Insider**: cartas de rol (roles en `party/insider/`) y reglas.

Cada imprimible deriva sus componentes de los datos ya existentes en el código (no se reinventan). El objetivo es que el profe imprima, recorte y juegue sin pantalla.

## 6. D (posicionamiento) — «Jocs Econòmics» como Olimpiadas

- Añadir `{ slug: 'jocs-economics', label: 'Jocs Econòmics', description: 'Nuestras Olimpiadas de Economía.' }` a `SECCIONES_TRANSVERSALES` (menú «Otros»), después de `dinamicas`.
- La landing `/jocs-economics/` gana una **portada editorial** sobre el juego: titular «Nuestras Olimpiadas de Economía», explicación de qué es, cómo participar, y los **premios al mejor alumno y al mejor instituto**, con acceso al juego (el `JocsApp` actual) y al **leaderboard existente** (individual + por instituto). Sin formularios de registro ni gestión de premios (D-full).
- El copy de premios se redacta de forma honesta y sin recoger datos personales en esta fase (los rankings ya existen vía el flujo actual del juego).

## 7. Testing (TDD para la lógica nueva)

1. **Registro `juegos.ts`**: los 5 juegos cargan; `imprimible` true solo en los 4 acordados; slugs únicos.
2. **Integridad curricular**: cada `unidades_relacionadas[].asignatura` existe y cada `unidad` está publicada (helper análogo a `findBrokenUnidadRefs` de dinámicas; idealmente compartido).
3. **Hub data-driven**: el hub lista los 5 juegos desde `JUEGOS`.
4. **Print isolation** (imprimibles): regla `@media print` que aísla `.print-block` (guard como el de dinámicas).
5. Contenido (competencias) en `borrador` / revisión manual de Pau.

## 8. Orden de entrega (PRs)

1. **PR A** — Modelo (`unidades_relacionadas.competencias_especificas`) + render en `PuenteUnidades` + rellenar competencias en las 25 dinámicas.
2. **PR B** — `src/lib/juegos.ts` + hub data-driven + ficha pedagógica en las 5 páginas de juego (con A aplicado a los 5 juegos).
3. **PR D-pos** — Sección «Jocs Econòmics» en «Otros» + landing Olimpiadas + sacar el quiz de `/juegos/`.
4. **PR C** — Imprimibles de los 4 juegos (lo más pesado; un PR por juego o por par).

## 9. Fuera de alcance (este spec)

- **D-full**: registro de participantes/institutos, gestión de premios, validación de centro, cualquier dato personal de alumnos (backend + GDPR). Spec propio posterior.
- Imprimible de Stonks o del quiz «Jocs Econòmics».
- Cambios al sistema visual o a la estructura por asignaturas.
- Traducción ca/va del contenido nuevo (estructura i18n sí, contenido no, según MVP).

## 10. Riesgos

- **Precisión de las competencias específicas**: correlación curricular extensa (25 dinámicas + 5 juegos × varias asignaturas). Se autora con subagents que consultan la `programacion.mdx` de cada asignatura; **es lo que más revisión manual de Pau requiere**. Mitiga: todo en `borrador`.
- **Imprimibles fieles al juego digital**: el print-and-play debe respetar las reglas reales; se derivan de los datos del código y se marcan como `borrador`/revisión.
- **Confusión de rutas**: al sacar «Jocs Econòmics» de `/juegos/`, dejar enlace claro para no romper la navegación mental del profe.
