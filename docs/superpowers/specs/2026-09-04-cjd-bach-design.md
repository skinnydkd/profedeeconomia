# Cultura Jurídica i Democràtica (`cjd-bach`) — assignatura 10

**Data**: 2026-09-04
**Estat**: aprovat, pendent de pla d'implementació
**Font primària**: [Currículum oficial CEICE (PDF, castellà)](https://ceice.gva.es/documents/162640733/364026431/Cultura+jur%C3%ADdica+y+democr%C3%A1tica.pdf/de0eece7-43d4-92e6-5d11-4cd15ad85db7?t=1663312633685)

## Context

El web té 9 assignatures. Pau imparteix (o impartirà) **Cultura Jurídica i Democràtica**, optativa autonòmica de Batxillerat de la Comunitat Valenciana, i demana material propi. Seria la desena.

Encaix amb l'audiència: dos dels vuit blocs oficials (**5. Persona y relaciones laborales** i **6. Persona e impuestos**) són territori directe de professorat d'economia i solapen amb material que el web ja té a FOPP 4ESO i IPE I/II. Els altres sis blocs són dret pur (constitucional, internacional, civil, penal, administratiu, processal) i són contingut nou. És honest dir que la meitat llarga del llibre no es recicla de res.

## Correcció de la premissa inicial

El brief deia «assignatura de 1r Batxillerat anomenada Cultura Jurídica». Verificat contra la font oficial:

- El nom oficial és **Cultura Jurídica i Democràtica** / *Cultura Jurídica y Democrática*.
- **No està fixada a 1r**: és oferible en **1r o 2n**, en qualsevol modalitat, i l'alumnat només la pot cursar en un dels dos cursos. Per tant `curso: 'bach'` (grup «Optativas (1.º/2.º)»), com `gpe-bach` — no `curso: '1bach'`.

## Marc normatiu

- **Decret 108/2022**, de 5 d'agost, del Consell (CV), annex de matèries optatives autonòmiques.
- **Sense base estatal**: no apareix al RD 243/2022. La font és exclusivament el DOGV / CEICE.
- El **Decret 103/2026**, de 26 de juny, modifica el 108/2022 però **només substitueix l'annex II** (matèries comunes i de modalitat). El currículum d'aquesta optativa **no canvia**; sí canvia l'ordenació d'optatives (art. 16), aplicable des del curs 2026-2027.
- Cadena `marcoNormativo` al registre: `'Decret 108/2022, mod. Decret 103/2026 (CV) — optativa'` (idèntica a GPE).

## Decisions preses (brainstorm)

1. **Abast**: assignatura completa amb llibre — no es queda en placeholder permanent. Però `estado` **naix `'proximamente'`** i es gira a `'publicado'` com a últim pas de la Fase B. Motiu: `[asignatura]/index.astro` condiciona cada secció del hub a que existisca contingut publicat (`hasLibro`, `hasTests`…), així que un `'publicado'` amb zero unitats deixaria una pàgina viva i buida a producció. Amb `'proximamente'` el hub mostra l'etiqueta «Próximamente» i la Fase A pot fer merge a main sense publicar un buit.
2. **Slug**: `cjd-bach`. `shortLabel: 'CJD'`, `num: '10'`.
3. **Color**: **índigo `#4A3B8F`**, soft `#E0DCF0`. Única família cromàtica lliure (ja hi ha terracota, teal, mostassa, berengà, oliva, blau pissarra, blau profund, verd pi i granat). Distint del berengà de FOPP (`#5B3A4E`, més marró) i dels dos blaus d'IPE.
4. **Llibre**: **8 unitats, 1:1 amb els 8 blocs oficials**. No s'inventa granularitat pròpia; l'estructura oficial ja és coherent i evita discussions de cobertura curricular.
5. **Anti-solapament**: les unitats 5 i 6 s'escriuen des de l'angle **jurídic** i a nivell de Batxillerat. El càlcul de nòmina i d'IRPF **no es reescriu**; s'enllaça al material existent de FOPP/IPE via `recursos-relacionados`.
6. **Refactor d'`ACCENTS`**: centralitzar els mapes de color d'impressió, que avui estan duplicats i incomplets (veure §Arquitectura 3).

## Currículum oficial (verificat contra el PDF del DOGV)

**6 competències específiques.** CE1 valors de llibertat, justícia i igualtat en la cultura democràtica · CE2 investigar l'ordenament jurídic estatal i autonòmic · CE3 marc jurídic internacional i Unió Europea · CE4 reconèixer i denunciar atacs als valors, i proposar solucions · CE5 expressió i argumentació amb llenguatge jurídic · CE6 cerca i ús responsable d'informació jurídica i TIC.

**8 blocs de sabers bàsics.** Els blocs 1 i 2 són transversals a totes les competències; els blocs 3–8 s'associen a C1, C2, C4, C5 i C6.

| Bloc oficial | Disciplina jurídica | Sabers nuclears |
|---|---|---|
| 1. Sociedad y Derecho | Introducció | Dret com a marc de convivència, conceptes jurídics bàsics, fonts del dret, disciplines jurídiques |
| 2. Persona y relaciones supranacionales | Internacional | Ciutadania global, subjectes del dret internacional, drets humans i ONU, Unió Europea i acervo comunitari |
| 3. Persona y poderes del Estado | Constitucional | CE 1978 i Estat social i democràtic de dret, Corts Generals, poder executiu i potestat reglamentària, Corona, organització territorial i Estatut d'Autonomia |
| 4. Persona y relaciones interpersonales | Civil | Responsabilitat civil, drets de la personalitat, família i successions, propietat i contractes (compravenda, arrendament, préstec, donació), propietat intel·lectual, propietat horitzontal |
| 5. Persona y relaciones laborales | Laboral i SS | Compte d'altri vs propi, contracte de treball i modalitats, salari i nòmina, acomiadament i quitança, Seguretat Social i prestacions, desocupació |
| 6. Persona e impuestos | Tributari | Deure de contribuir, impostos directes vs indirectes, IRPF i IS, IVA, ITP-AJD, IBI, especials |
| 7. Persona y comportamientos sociales | Penal, adm., digital, ambiental | Delictes, dret administratiu i sancions, identitat digital i protecció de dades, dret ambiental i canvi climàtic |
| 8. Persona y tutela judicial efectiva | Processal | Estructura de jutjats i tribunals, procés judicial, justícia gratuïta, demanda/sentència/recursos, mediació, arbitratge i conciliació |

El detall complet (sabers literals, descripcions de competència i criteris d'avaluació) va al document de currículum de la Fase A, no ací.

## Arquitectura

### 1. Registre de l'assignatura

- `src/lib/asignaturas.ts`
  - `ASIGNATURA_SLUGS` += `'cjd-bach'`
  - Type `color` += `'cjd'`
  - Entrada a `ASIGNATURAS`:
    ```
    slug: 'cjd-bach', level: 'Bachillerato (1.º/2.º)', shortLabel: 'CJD',
    title: 'Cultura Jurídica y Democrática', num: '10', color: 'cjd',
    marcoNormativo: 'Decret 108/2022, mod. Decret 103/2026 (CV) — optativa',
    modalidad: 'Optativa (1.º o 2.º)', etapa: 'bach', curso: 'bach',
    estado: 'proximamente'   // → 'publicado' al final de la Fase B
    ```
  - `ASIGNATURAS_POR_ETAPA.bach.cursos.bach` la recull sola (filtre `curso === 'bach'`); cap canvi d'estructura.
- `src/i18n/asignaturas-ca.ts`: overlay CA amb `level: 'Batxillerat (1r/2n)'`, `title: 'Cultura Jurídica i Democràtica'`, `modalidad: 'Optativa (1r o 2n)'`, tagline traduïda.
- `src/content.config.ts`: `'cjd-bach'` a la llista de slugs de l'esquema.

Taglines (to del web: plural, realitat d'aula, sense vendre):

- ES: «Ocho bloques de Derecho —constitucional, civil, laboral, tributario, penal y procesal— para una optativa que suele caer sin material. Laboral y fiscal enlazan con lo que ya tenemos en FOPP e IPE.»
- CA: «Huit blocs de Dret —constitucional, civil, laboral, tributari, penal i processal— per a una optativa que sol caure sense material. Laboral i fiscal enllacen amb el que ja tenim a FOPP i IPE.»

### 2. Tokens de color

`src/styles/global.css`, als **tres** blocs on viuen els altres:

```
--color-cjd: #4A3B8F;         /* índigo — CJD Bach */
--color-cjd-soft: #E0DCF0;
--color-cjd-ink: #4A3B8F;     /* base ja compleix AA sobre cream */
```

`src/styles/slides.css`: `[data-asig="cjd-bach"] .slide { --accent: var(--color-cjd); --accent-ink: var(--color-cjd); }`.

Mapes `c-{color}` → `var(--color-cjd)` als 12 fitxers que ja tenen el patró: `SiteHeader.astro`, `SubjectCard.astro`, `lib/debates.ts`, `lib/dinamicas.ts`, `lib/herramientas.ts`, `lib/olimpiada.ts`, `lib/proyectos.ts`, `pages/index.astro`, `[asignatura]/index.astro`, `[asignatura]/evaluacion/index.astro`, `[asignatura]/refuerzo/index.astro`, `[asignatura]/proyecto/index.astro`.

### 3. Refactor d'`ACCENTS` — bug existent, fix a l'arrel

**Problema trobat durant el disseny.** El mapa `ACCENTS` (hex literals per als PDF, que no poden usar `var()`) està **copiat en 6 rutes d'impressió** i tres còpies estan desincronitzades:

| Ruta | Colors definits | Falten |
|---|---|---|
| `[asignatura]/libro/imprimir.astro` | edmn eco1 eco4 fopp eeae gpe | **taller3, ipe1, ipe2** |
| `[asignatura]/actividades/imprimir/[modo].astro` | edmn eco1 eco4 fopp eeae gpe | **taller3, ipe1, ipe2** |
| `[asignatura]/ebau/imprimir.astro` | edmn eco1 eco4 fopp eeae gpe | **taller3, ipe1, ipe2** |
| `[asignatura]/programacion/imprimir.astro` | complet | — |
| `[asignatura]/proyecto/imprimir.astro` | complet | — |
| `[asignatura]/proyecto/cuaderno/imprimir/[modo].astro` | complet | — |

Conseqüència viva: els PDF de **llibre i activitats de Taller 3ESO, IPE I i IPE II** s'imprimeixen en terracota d'EDMN, perquè el `?? ACCENTS.edmn` final ho amaga en silenci. Ningú se n'assabenta fins que mira el PDF.

Afegir `cjd` a les sis còpies perpetuaria el problema. **Fix**: un únic mapa exportat des de `src/lib/asignaturas.ts`, al costat del registre:

```ts
export const ACCENTS: Record<Asignatura['color'], { base: string; deep: string; soft: string }> = { … };
```

Tipat com `Record<Asignatura['color'], …>`, TypeScript exigeix exhaustivitat: **afegir un color al union sense definir-lo aquí és un error de compilació**, no un PDF silenciosament terracota. Cal una entrada per a `'proximamente'` (gris, `--color-ink-mute`).

Les 6 rutes importen `ACCENTS` i esborren la còpia local. `ACCENTS[a.color] ?? ACCENTS.edmn` passa a ser `ACCENTS[a.color]` (l'accés ja és total). Taller 3ESO, IPE I i IPE II recuperen el seu color de franc, i cada assignatura futura és una línia en compte de sis.

Fora d'abast del refactor: `src/pages/emprendimiento/index.astro` té un `#8C2F39` literal a `.card--gpe .card__eyebrow`, però és una targeta específica de GPE, no un mapa per assignatura. No es toca.

### 4. Contingut — estructura del llibre

`src/content/asignaturas/cjd-bach/libro/`, ES + germà `.ca.mdx` per a cadascuna:

| # | Fitxer | Bloc oficial |
|---|---|---|
| 01 | `01-sociedad-y-derecho` | 1 |
| 02 | `02-ciudadania-global-y-union-europea` | 2 |
| 03 | `03-constitucion-y-poderes-del-estado` | 3 |
| 04 | `04-derecho-civil-persona-familia-propiedad` | 4 |
| 05 | `05-derecho-laboral-y-seguridad-social` | 5 |
| 06 | `06-derecho-tributario-y-sistema-fiscal` | 6 |
| 07 | `07-derecho-penal-administrativo-y-digital` | 7 |
| 08 | `08-tutela-judicial-y-resolucion-de-conflictos` | 8 |

Nota d'introducció del llibre, com la resta: basat en el currículum autonòmic valencià (Decret 108/2022); cada centre concreta la seua programació.

### 5. Anti-solapament amb FOPP 4ESO i IPE I/II

Les unitats 05 i 06 cobreixen sabers que el web ja tracta. Regla:

- **Angle**: jurídic, no d'orientació laboral. U05 entra per fonts del dret laboral, l'Estatut dels Treballadors com a norma, el contracte com a negoci jurídic i la jurisdicció social. U06 entra pel deure constitucional de contribuir i el sistema tributari com a ordenament, no per «com omplir la renda».
- **Nivell**: Batxillerat. FOPP és 4t d'ESO i IPE és FP; el tractament és més abstracte i normatiu.
- **Reutilització, no duplicació**: el càlcul de nòmina, quitança i IRPF **no es reescriu**. S'enllaça amb el material existent via `recursos-relacionados` (`src/lib/recursos-relacionados-sources.ts`). Regla d'or de CLAUDE.md: una sola font per peça de contingut.

## Fases

- **Fase A — esquelet i currículum** ← *el pla d'implementació que segueix cobreix només aquesta fase*. `docs/curriculum-cjd-bach.md` (format de `docs/curriculum-gpe-bach.md`: 6 CE amb descripció, 8 blocs amb sabers literals, criteris d'avaluació, secció d'anti-solapament). Registre amb `estado: 'proximamente'`, tokens de color, refactor d'`ACCENTS`, propagació de `c-cjd`, test. El hub mostra l'etiqueta «Próximamente»; cap pàgina buida en directe.
- **Fase B — llibre**. 8 unitats × 2 idiomes ≈ 16 MDX. Diverses sessions. **Últim pas: girar `estado` a `'publicado'`.**
- **Fase C — la resta**. Activitats, activitats dinàmiques, tests, recursos, reforç, reptes, avaluació, programació.

## Verificació

1. **Compilació**: el `Record<Asignatura['color'], …>` fa que oblidar-se d'un color siga error de build. Cobreix les 6 rutes d'impressió d'un colp.
2. **Test nou** a `src/lib/asignaturas.test.ts`: llegir `src/styles/global.css` i assertar que cada `color` distint del registre té definits `--color-{c}` i `--color-{c}-soft`. El CSS no el comprova el compilador, i és l'altra meitat del mateix bug.
3. **Regressió del fix**: assertar que `ACCENTS.taller3`, `ACCENTS.ipe1` i `ACCENTS.ipe2` existeixen i no són iguals a `ACCENTS.edmn` — falla amb el codi d'avui, passa amb el refactor.
4. **Manual**: `npm run build` i mirar un PDF de llibre d'IPE I (ha de ser blau pissarra, no terracota).

## Riscos i fora d'abast

- **Volum de contingut**. Sis dels vuit blocs són dret pur, sense res reciclable al web. És l'assignatura amb menys reaprofitament de les deu. Fase B és llarga.
- **Precisió jurídica**. El contingut normatiu envelleix (reformes laborals, fiscals, penals). Cada unitat ha de citar la norma amb data i el llibre ha de portar avís de vigència. Revisió manual de Pau abans de publicar, com la resta.
- **Fora d'abast**: quadern de projecte (això és de GPE), EBAU (no és matèria d'EBAU), adaptacions per a altres CCAA (és optativa exclusivament valenciana).

## Fonts

- [Currículum oficial de la matèria, CEICE (PDF)](https://ceice.gva.es/documents/162640733/364026431/Cultura+jur%C3%ADdica+y+democr%C3%A1tica.pdf/de0eece7-43d4-92e6-5d11-4cd15ad85db7?t=1663312633685)
- [Currículum de Batxillerat, CEICE](https://ceice.gva.es/va/web/ordenacion-academica/bachillerato/curriculo)
- [Decret 103/2026, de 26 de juny (DOGV)](https://dogv.gva.es/va/eli/es-vc/d/2026/06/26/103/dof/vci/html)
- Precedent intern: [docs/nuevas-asignaturas-bach-emprendimiento-2026.md](../../nuevas-asignaturas-bach-emprendimiento-2026.md)
