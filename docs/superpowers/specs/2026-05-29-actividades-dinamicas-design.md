# Actividades Dinámicas · pilot EDMN 2BACH U6

**Estat**: aprovat per Pau el 2026-05-29
**Autor**: Pau Monterde
**Pilot**: EDMN 2BACH · Unidad 6 (Función comercial · marketing)

## Context

La web té tres seccions actuals que ofereixen contingut interactiu o avaluatiu:

- `/[asignatura]/tests/` — preguntes opció múltiple per unitat. UI Preact ja construïda.
- `/[asignatura]/recursos/` — HTMLs interactius (calculadores DCF/VAN-TIR/ratios, simulador AD-AS, etc.). **No agrupats per unitat** — són globals dins l'assignatura.
- `/[asignatura]/actividades/` — guies de dinàmiques de classe (debate, caso, dinámica) — text estàtic per a professors.

Pau vol agrupar el contingut INTERACTIU PER A ALUMNAT (tests + recursos + nous simuladors) en una sola secció **dividida per unitat**, perquè un alumne que estudia la U6 trobe en un sol lloc el seu test, el seu simulador de decisions i les calculadores d'aquesta unitat.

`/actividades/` (la guia per a professors amb debats i casos de classe) **es manté separada** — té audiència distinta.

## Objectius

1. Crear `/[asignatura]/actividades-dinamicas/` com a punt d'entrada unificat al contingut interactiu d'una assignatura.
2. Estructurar-lo **per unitat**, amb una pàgina per cada unitat que agrupa Test + Simuladors + Recursos.
3. Afegir un nou tipus d'activitat: **Simulador de decisions** (arbre de decisions amb conseqüències i feedback pedagògic).
4. Pilot sobre EDMN 2BACH U6 abans d'escalar.

## Decisions vinculants

- **Estructura**: `/actividades-dinamicas/` substitueix `/tests` + `/recursos` (redirects 301). `/actividades/` resta com a guia per a professors.
- **Format simulador**: arbre de decisions amb conseqüències (no simulador numèric, no quiz). Component Preact + JSON.
- **Abast pilot**: EDMN 2BACH · U6 sencera (test + simulador "cafeteria" + recursos). Les altres 11 unitats d'EDMN tenen pàgina creada amb estat "pròximament" excepte el test traslladat.
- **Cas del simulador**: cas nou, **no** reciclant el Nespresso del llibre. Cas escollit: "Has heredado la cafetería del barrio".
- **Layout pàgina d'unitat**: seccions verticals, no tabs (mostra tot, scroll natural).
- **Persistència**: només `sessionStorage` al pilot. Cap backend.

## Arquitectura

### Rutes noves

```
/[asignatura]/actividades-dinamicas/                       Hub assignatura
  - llistat de N unitats amb chips per unitat:
    [Test ✓] [N simuladors] [N recursos]

/[asignatura]/actividades-dinamicas/[unidad-slug]/         Pàgina d'unitat
  3 seccions verticals (no tabs):
    1. Test d'autoavaluació
    2. Simuladores de decisión
    3. Recursos interactivos
```

### Col·lecció MDX nova `actividadDinamica`

Defineix-se a `src/content.config.ts` com a nova col·lecció. Frontmatter:

```yaml
asignatura: edmn-2bach
unidad_relacionada: 6
title: "El dilema de la cafetería del barrio"
tipo: arbol-decisiones                      # única opció al pilot
duracion: "15-20 min"
componente: ArbolDecisiones                  # component Preact a renderitzar
competencias_clave: [CPSAA, CE, CD]
competencias_especificas: [CE3]
estado: publicado
publicado_en: 2026-05-30
```

El cos del MDX és **JSON dins d'un bloc de codi** que el frontend parseja:

````mdx
```json
{
  "intro": { … },
  "nodes": { … },
  "finales": { … }
}
```
````

### JSON de l'arbre

```jsonc
{
  "intro": {
    "kicker": "Caso · Marketing",
    "titulo": "Has heredado la cafetería del barrio",
    "contexto": "…",
    "kpi_inicial": { "caja": 8000, "clientes_mes": 240, "satisfaccion": 8.5 }
  },
  "nodes": {
    "n1": {
      "titulo": "Tu primera decisión",
      "situacion": "…",
      "opciones": [
        { "label": "…", "kpi_delta": { "caja": 600, "satisfaccion": -1 },
          "feedback": "…", "next": "n2a" },
        { "label": "…", "kpi_delta": { …  }, "feedback": "…", "next": "n2b" }
      ]
    },
    "n2a": { … },
    "n2b": { … },
    "n3a": { … },
    "n3b": { … }
  },
  "finales": {
    "exito": {
      "titulo": "Has reflotado la cafetería",
      "resumen": "Ventas +24%, satisfacción 9.1, caja sostenible.",
      "lecciones_clave": ["…", "…", "…"]
    },
    "fracaso_parcial": {
      "titulo": "La cafetería sobrevive, justa",
      "resumen": "Has evitado el cierre pero el negocio se ha vuelto frágil.",
      "lecciones_clave": ["…", "…"]
    }
  }
}
```

### Component Preact `<ArbolDecisiones>`

Fitxers:
- `src/components/actividades/ArbolDecisiones.astro` — wrapper, rep `data` i passa al island.
- `src/components/actividades/ArbolDecisionesIsland.tsx` — Preact island amb estat.

Estat:
- `currentNodeId: string` (`"intro"` → `"n1"` → ...)
- `kpis: Record<string, number>` (acumulats)
- `historia: Array<{ nodeId, opcionEscogida }>` (per al recap final i sessionStorage)

UI:
- Tarjeta principal amb titular + situació + 2-3 botons d'opció.
- Barra de KPIs a la part superior amb pills (caja / clientes / satisfacció) amb color codificat (verd si puja respecte inici, vermell si baixa).
- Al clicar opció: animació subtil (fade), apareix panel inferior amb `feedback` mostassa-soft + botó "Siguiente".
- En arribar a un `next` que apunta a `finales.*`: pantalla resum amb KPIs finals + `lecciones_clave` + botó "Reiniciar".
- Persistència: `sessionStorage` per node actual + KPIs (si recàrrega, restaura).

Estètica:
- Paleta Variant C (cream + terracota + mostassa).
- Tipografies del projecte (Fraunces titulars, Switzer cos).
- Coherent amb el llibre (mateixos accents que la unitat).

### Hub assignatura `/actividades-dinamicas/`

Llistat de les N unitats publicades, cada una mostrant:
- Número + títol
- 3 chips de comptadors: `Test ✓`, `N simuladores`, `N recursos`
- Si la unitat no té cap activitat → chip "pròximament"

### Pàgina d'unitat `/actividades-dinamicas/[unidad-slug]/`

Layout: una columna, 3 seccions verticals separades per regles editorials.

1. **Test d'autoavaluació** — pestanya retallable amb el component `<Test>` existent.
2. **Simuladores de decisión** — llistat de simuladors d'aquesta unitat. Si N=1, el simulador es renderitza directament a la pàgina (no fa falta clic per entrar).
3. **Recursos interactivos** — cards amb les calculadores/eines associades a aquesta unitat. Click → obre la calculadora a banda (ruta `/recursos/<slug>/` existent o nova).

### Migració del contingut existent

- `/[asignatura]/tests/` — la col·lecció `tests` segueix existint. La pàgina llista de tests es **redirecciona** a `/actividades-dinamicas/`. Les pàgines individuals `/tests/[slug]/` redirigeixen a `/actividades-dinamicas/[unidad]/`.
- `/[asignatura]/recursos/` — la col·lecció `recursos` segueix existint. La pàgina llista es manté (no rep redirect) perquè continua sent útil com a llistat global de calculadores. La pàgina individual `/recursos/[slug]/` no es toca. La pàgina d'unitat dins de `/actividades-dinamicas/` filtra els recursos via `unidad_relacionada`. **Cal afegir `unidad_relacionada` als recursos existents** que actualment no el tinguin.

## Pilot — Què entrega exactament

1. **Estructura completa per a EDMN 2BACH**:
   - Hub `/edmn-2bach/actividades-dinamicas/` amb 12 unitats llistades.
   - Pàgina individual per a les 12 unitats. Les 11 que no són U6 mostren el test existent + "Pròximament: simulador i recursos d'aquesta unitat".

2. **U6 completa**:
   - Test d'autoavaluació (existent, traslladat).
   - Simulador "Has heredado la cafetería del barrio" amb ~6 nodes de decisió, 2 finals (èxit / fracàs parcial), conseqüències KPI.
   - Recursos: el Marketing Mix 4P existent + qualsevol calculadora rellevant amb `unidad_relacionada: 6`.

3. **Component `<ArbolDecisiones>` reutilitzable**:
   - Wrapper Astro + island Preact amb `client:visible`.
   - Estat amb `sessionStorage` per a no perdre progrés si l'alumne recarrega.
   - Tests unitaris (Vitest) bàsics: navegació entre nodes, càlcul de KPIs, reinici.

4. **Col·lecció `actividadDinamica` a `content.config.ts`** amb el schema dalt.

5. **Migració mínima**:
   - Redirects de `/tests/` cap a `/actividades-dinamicas/`.
   - Camp `unidad_relacionada` afegit als recursos existents d'EDMN 2BACH (els que falten).

6. **Estètica i UX**:
   - Coherent amb la resta del web (Variant C, tipografies del projecte).
   - Mobile-friendly: el simulador funciona en mòbil (touch, no requereix hover).

## Fora d'abast (no fer en aquest pilot)

- Simuladors per a les altres 11 unitats d'EDMN.
- Simuladors per a les 8 assignatures restants.
- Editor visual del JSON (es manté l'autoria via MDX manual).
- Multijugador / classroom mode.
- Persistència backend / cuentes d'usuari.
- Estadístiques agregades de respostes.
- Recompenses, badges, gamificació "fort".
- Versions traduïdes a català/valencià (idioma castellà al MVP global).

## Criteris d'èxit

- **Funcional**: pots executar el simulador U6 d'inici a final, prendre 3 camins diferents, veure els 2 finals possibles. KPIs s'actualitzen correctament.
- **Usabilitat**: una alumna de Bachillerato pot completar el simulador sense ajuda en <20 min i articular què ha après.
- **Replicabilitat**: el patró MDX + JSON permet escriure un segon simulador en <1 hora sense tocar codi del component.
- **Cap regressió**: tests, recursos, llibre, slides, workbooks, programació segueixen funcionant exactament igual.

## Stack tècnic

- **Component**: Preact (`client:visible` island).
- **Estat**: `useState` + `sessionStorage`.
- **Estils**: scoped al component, amb les CSS vars globals del projecte.
- **Test**: Vitest unit tests.
- **Sense backend**: tot client-side.

## Riscos identificats

- **L'arbre de decisions amb cas fix pot ser repetitiu** si l'alumne el fa més d'una vegada. Mitigat: introducció de cert atzar petit (no afecta KPIs però varia detalls del context).
- **Sobreingenieria del JSON**: format massa rígid podria limitar tipus futurs (numèric, drag-drop). Mitigat: el camp `tipo` al frontmatter permet branca per tipus al futur.
- **Mobile**: text llarg en mòbil pot ser pesat. Mitigat: `kpi_delta` i `feedback` són curts; situacions ≤ 80 paraules.
- **Migració tests/recursos**: redirects mal configurats trenquen SEO. Mitigat: redirects 301 explícits a `astro.config.mjs` + comprovació pre-merge.

## Notes operatives

- **Single source of truth**: cap contingut nou específic per a simuladors a fitxers separats del MDX. Tot dins de la mateixa estructura.
- **Coherència amb llibre**: el simulador no requereix haver llegit el llibre, però referencia els conceptes amb el mateix vocabulari (4P, segmentació, propuesta de valor).
- **Idioma castellà** al pilot (la web és tota en castellà).

## Pendent abans d'implementar

- Plan d'implementació detallat (writing-plans skill).
- Decidir el JSON concret de l'arbre "cafetería" (Pau aprova el cas i opcions abans de escriure el JSON definitiu).
- Inventariar quins `recursos` existents d'EDMN 2BACH no tenen `unidad_relacionada` i mapejar-los.
