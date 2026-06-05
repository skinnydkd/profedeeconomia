# Enriquir els decks d'Eco 1BACH amb diagrames — Disseny

> Pilot de la iniciativa «pujar els 8 llibres no-EDMN al nivell keynote d'EDMN». Eco 1BACH és el llibre pilot.

**Data:** 2026-06-05
**Estat:** disseny aprovat (enfocament + profunditat), pendent de revisió de l'spec

## Context i la troballa que reemmarca la tasca

La idea de partida era «enriquir el contingut dels 8 llibres no-EDMN perquè els seus decks arriben al nivell keynote d'EDMN 2BACH». Dues troballes de l'auditoria canvien l'abast:

1. **El motor de slides és 100% content-driven i uniforme.** No hi ha cap codi especial per a EDMN. Els decks es deriven del MDX del llibre: més components rics al MDX → deck més ric. «Regenerar els decks» no canvia res; cal actuar sobre el contingut.

2. **Eco 1BACH NO està pobre de contingut.** Comparat amb EDMN (la referència), Eco 1BACH ja té **més** exercicis resolts (25 vs 15) i exemples reals (22 vs 18), i el mateix esquelet narratiu (1 `CasoDilema`, 1 `TldrUnidad`, 1 `KeyTakeaways` per unitat). L'**única** dimensió on va per darrere és **diagrames**: 13 contra 21.

Conclusió: la feina real és quirúrgica i de baix risc. **No es toca la prosa revisada ni s'afegeixen exercicis** (ja n'hi ha de sobra; afegir-ne seria sobrecarregar). Es creen els diagrames que falten i es munten a la unitat corresponent. Els slides de tipus `diagram` són precisament els més distintius visualment — són la diferència keynote que es percebia.

## Abast del pilot

Crear **8 diagrames nous** per a Eco 1BACH, passant de 13 a 21 diagrames (densitat 1,75/unitat, igualant EDMN). Distribució per unitats segons el dèficit detectat a l'auditoria:

| # | Diagrama (nom de component) | Unitat | Concepte | Tipus |
|---|---|---|---|---|
| 1 | `EstructurasMercado` | 04 — Microeconomia I | Competència perfecta vs monopoli vs oligopoli (forma de la corba i quota) | Adaptació del patró oferta-demanda |
| 2 | `Externalidad` | 06 — Fallos de mercado | Externalitat negativa: cost privat vs cost social, sobreproducció de mercat | Adaptació d'`OfertaDemanda` |
| 3 | `MercadoTrabajo` | 09 — Mercat de treball | Oferta i demanda de treball, salari d'equilibri W\*/L\*, efecte d'un salari mínim per damunt | Adaptació d'`OfertaDemanda` |
| 4 | `AgregadosMonetarios` | 10 — Diners i banca | M0 ⊂ M1 ⊂ M2 ⊂ M3 (capes de liquiditat) | Nou |
| 5 | `CreacionDinero` | 10 — Diners i banca | Multiplicador bancari: cascada de dipòsits, reserves i préstecs successius | Nou |
| 6 | `MultiplicadorFiscal` | 11 — Polítiques econòmiques | Rondes successives de despesa → renda → consum sumant al PIB | Nou |
| 7 | `TransmisionMonetaria` | 11 — Polítiques econòmiques | Flux: tipus d'interès → crèdit → inversió/consum → demanda agregada → PIB i inflació | Nou |
| 8 | `VentajaComparativa` | 12 — Globalització | Guanys del comerç: cost d'oportunitat i especialització | Nou |

Tots són conceptes econòmics estàndard del currículum LOMLOE de Batxillerat (RD 243/2022); cap afirmació nova arriscada, només representació visual de models canònics.

## Arquitectura tècnica

El sistema ja existeix; només s'hi afegeixen peces seguint els patrons establerts. No hi ha canvis de motor.

### Patró de component de diagrama

Cada diagrama és un fitxer `src/components/diagrams/<Nom>.astro` que conté **un únic `<svg viewBox>` pur** (sense props), seguint exactament el patró d'`OfertaDemanda.astro`:

- `viewBox` ampli (p. ex. `0 0 800 500`), `role="img"` amb `aria-labelledby` apuntant a un `<title>` i `<desc>` interns.
- Paleta **hardcoded amb els tokens del design system** dins d'un `<style>` al `<defs>`: fons `#FBF6EC`, tinta `#2A1F18`/`#5C4A3D`/`#8A7868`, terracota `#C44E2C`, mostassa `#D4A24C`/`#A87A2A`, línia `#E5D4BD`. Color-coding coherent (demanda terracota, oferta mostassa, com a la resta).
- Tipografia: Switzer (etiquetes d'eix, sans), Fraunces italic (etiquetes de corba/punt), JetBrains Mono (ticks numèrics).
- Comentaris HTML `<!-- -->` permesos (és `.astro`, no MDX).

### Registre nom→component (auto-generat)

El deck builder (`src/lib/slides/build-deck.ts`) llig el **nom** del component fill de `<Diagram>` i el guarda com `slide.diagrama`. `SlideDiagramMount.astro` el resol a un component real. Aquest fitxer és **auto-generat** per `scripts/gen-slide-diagram-mount.mjs`, que escaneja `src/components/diagrams/`. Per tant, després de crear els 8 fitxers cal **re-executar el generador una vegada**; cap edició manual de registres.

### Muntatge al MDX del llibre

A la unitat corresponent d'Eco 1BACH s'insereix el diagrama amb el wrapper existent, a un punt pedagògicament adequat de la secció:

```mdx
<Diagram caption="Texto del peu que explica qué muestra el diagrama" source="...">
  <EstructurasMercado />
</Diagram>
```

És **l'única edició al contingut del llibre**: la inserció del bloc `<Diagram>` + el seu peu (i `source` si escau). No es reescriu prosa adjacent.

### Regeneració del deck i guarda d'overflow

`npm run build:decks eco-1bach` regenera els 12 decks d'Eco 1BACH a `public/slides/eco-1bach/`. L'script (`scripts/build-deck-pdf.mjs`) ja inclou la **guarda d'overflow** (falla si algun `.slide` desborda a 1280×720). Tots els slides de diagrama nous han de passar-la.

## Restriccions

- **Correcció conceptual**: cada diagrama representa un model econòmic estàndard correcte. Pau revisa els 8 abans del merge.
- **Design system**: paleta i tipografia validades (Variant C). Sense gradients cridaners, sense emojis. Coherència cromàtica amb els diagrames existents.
- **Accessibilitat**: `<title>` + `<desc>` a cada SVG; contrast suficient.
- **MDX-safe**: cap `$`/LaTeX a la prosa; els diagrames són SVG, no fórmules KaTeX.
- **No tocar**: prosa, exercicis, exemples, frontmatter. Només s'afegeixen blocs `<Diagram>`.

## Criteris d'èxit

1. Existeixen 8 components nous a `src/components/diagrams/`, cadascun amb SVG vàlid i accessible.
2. `SlideDiagramMount.astro` regenerat inclou els 8.
3. Les 6 unitats afectades (04, 06, 09, 10, 11, 12) munten els seus diagrames; Eco 1BACH passa de 13 a 21 diagrames.
4. `astro build` verd.
5. `npm run build:decks eco-1bach` regenera els 12 decks sense overflow.
6. Inspecció visual: els slides de diagrama nous es veuen nets i llegibles al deck.
7. Pau valida la correcció conceptual dels 8 diagrames.

## Fora d'abast (explícit)

- **No** es modifica la prosa ni s'afegeixen exercicis/exemples a Eco 1BACH.
- **No** es toquen els altres 7 llibres en aquest pilot. Quan el pilot estiga validat, cada llibre tindrà el seu cicle (auditoria → diagrames que falten → decks). El patró i les decisions de fons es fixen ací una vegada.
- **No** es canvia el motor de slides ni els arquetips.

## Replicació futura (post-pilot)

Per als altres 7 llibres (eco-4eso, fopp-4eso, eeae-bach, taller-eco-3eso, ipe1-fp, ipe2-fp, gpe-bach): auditar la densitat de diagrames vs el seu nivell, crear els que falten i regenerar decks. Probablement el patró és el mateix (narrativa ja homogènia, dèficit de diagrames), però es confirma llibre a llibre. Molts diagrames creats ací (mercat de treball, externalitats, estructures de mercat, multiplicadors) seran **reutilitzables** a ESO/FP.
