# Diagnóstico de las 5 asignaturas nuevas — Fase 0 ampliada (2026-05-24)

> Documento mestre que recull les findings dels 5 diagnòstics individuals de les assignatures **incorporades després dels 4 llibres originals**, realitzats per sub-agents en paral·lel el 2026-05-24. Estén la metodologia de la [Fase 0 del plan de mejora 2026](./plan-mejora-libros-2026.md) a les assignatures que no van passar pel diagnòstic original ni pel pla de millora (Fases 1-4 només es van aplicar a EDMN, Eco 1BACH, Eco 4ESO i FOPP 4ESO).
>
> Encàrrec de Pau (2026-05-24): **A1** revisió editorial completa d'EEAE i GPE (mai revisades per humà) + **A2** sweep de rigor estès a les 5 noves. Flux acordat: **auditar primer → Pau prioritza → arreglar en PRs**.

## Documentos individuals associats

- [`diagnostico-taller-eco-3eso-2026.md`](./diagnostico-taller-eco-3eso-2026.md) — 9 units (rigor)
- [`diagnostico-ipe1-fp-2026.md`](./diagnostico-ipe1-fp-2026.md) — 9 units (rigor)
- [`diagnostico-ipe2-fp-2026.md`](./diagnostico-ipe2-fp-2026.md) — 9 units (rigor)
- [`diagnostico-eeae-bach-2026.md`](./diagnostico-eeae-bach-2026.md) — 10 units (editorial completa: rigor + pedagogia + to)
- [`diagnostico-gpe-bach-2026.md`](./diagnostico-gpe-bach-2026.md) — 7 units llibre + 6 fases cuaderno (editorial completa)

## Resum executiu

Les 5 assignatures noves estan, en conjunt, **en millor estat de sortida que els 4 llibres originals** en el seu moment. Cap cas inventat com el "Bitwise" d'Eco 4ESO, **zero emojis pictogràfics** a totes 5 (compleixen el CLAUDE.md), i el to coral sòbri es manté. Les noves de Batxillerat (EEAE, GPE) ja porten incorporat l'aparell pedagògic de la Fase 2 (reading time, objectius, glossari, "para profundizar", preguntes de reflexió) — encara que de forma **desigual a GPE**.

Però hi ha **errors crítics puntuals** (un error mèdic, valors legals 2026 desfasats, una forma jurídica derogada) i un **problema transversal d'emprenedoria**: IPE II, EEAE i GPE reexpliquen eines que ja tenen owner doctrinal a EDMN 2BACH, i en alguns casos sense cross-references explícites.

## Problemes CRÍTICS (corregir abans de res)

| # | Assignatura | Problema | Acció |
|---|---|---|---|
| C1 | **IPE I** U8 | "maniobra de **Heimdal**" en comptes de **Heimlich** (procediment mèdic erroni, en producció) | Corregir terme |
| C2 | **IPE I** U6/U7 | **MEI 2026 = 0,90 %** (no 0,80 %); **cotització treballador = 6,50 %** (no 6,35 %, MEI 0,15 % inclòs). Afecta el SolvedExercise 6.1 (nòmina d'Aitana: SS=117,00 €, net=1.521,00 €) | Actualitzar valors 2026 + recalcular l'exercici |
| C3 | **GPE** U3 | **SLNE llistada com a forma jurídica vigent**, però derogada per la **Ley 18/2022 (Crea y Crece)** — la mateixa llei que la unitat cita per a la SL d'1 €. Contradicció interna (el SVG i el cuaderno ja no la inclouen → error aïllat al text d'U3) | Eliminar SLNE del text i frontmatter d'U3 |
| C4 | **GPE** | Laguna de cobertura: la **Fase 2 del cuaderno** diu recolzar-se en "la Unidad 2" per al **BMC**, però **cap unitat del llibre explica el BMC** | Afegir el BMC a la unitat de teoria corresponent o redirigir el cross-ref |

## Problema transversal: solapament d'emprenedoria

Tot el bloc d'emprenedoria del projecte (EDMN 2BACH, Eco 4ESO, EEAE, GPE, IPE II) comparteix les mateixes eines: **BMC, DAFO, design thinking/doble diamant, mapa d'empatia, proposta de valor, 4P, punt mort, pitch, formes jurídiques**. Owner doctrinal de la teoria = **EDMN 2BACH**. La diferenciació de nivell/enfocament *existeix* però no sempre és visible al text.

| Assignatura | Estat del solapament | Acció |
|---|---|---|
| **IPE II** | ⚠️ **El pitjor**. El bloc U5-U9 reexplica BMC, doble diamant, mapa d'empatia, 4P i formes jurídiques **sense cross-references** a EDMN. A més, diagrames duplicats *interns*: `DoubleDiamond` a U5 i U8; `EconomiaCircular` a U6 i U8 | Afegir notes sistemàtiques "per a la teoria completa, veure EDMN U4/U6; ací l'apliquem al projecte de FP". Substituir els diagrames duplicats d'U8 per cross-refs |
| **EEAE** | ✅ Solapa per disseny però **ben diferenciat i declarat al text** (panoràmic/perfil/casos vs detallat/funcional/mètode d'EDMN) | Cross-references explícites (no retallar). Repartir només el cas **Spotify** amb EDMN |
| **GPE** | ✅ **Ben gestionat**: aplica en comptes de reexplicar ("densitat mínima, aplicació màxima"). Sense duplicació textual amb EEAE (la germana CV); diferenciació estructural (EEAE analitza casos aliens, GPE construeix projecte propi) | Mantenir; només resoldre la laguna del BMC (C4) |

## Rigor i actualitat (cifres a actualitzar)

Sitio EN PRODUCCIÓ (2026) → les cifres 2023-2024 es perceben com a antigues.

**Taller 3ESO** (el més net): Bizum 28M → **30,6M (2025)**; afegir nota SMI 2026 = **1.221 €** a U7 (ara s'omet); ancorar fonts amb any (INE DIRCE, ONU-Agua).

**IPE I**: cotització empresa "≈30 %" → **30,65 %** (uniformar U6/U7); afegir excepció període de prova empreses <25 treballadors (art. 14 ET); "Ley 3/2012" → afegir data i el RD-Ley 13/2022 a `<Bibliography>`; EPI → **Reglament UE 2016/425** (RD 773/1997 parcialment obsolet); Leymann (1996) sense any.

**IPE II**: WEF *Future of Jobs* **2023 → 2025**; Mercadona 35.529M → **38.811M (2024)** (coordinar amb EDMN U6); Mondragón ~70.000 → memòria 2024; Kotler & Armstrong **13ª → 16ª (2022)**; quota autònom del SolvedEx 9.1 (aclarir tarifa reduïda 1r any / sistema progressiu 2025-26).

**EEAE** (~20-25 cifres, gairebé totes "actualitzar a l'últim any"): IA en empreses UE **13,5 % (2024) → 20 % (2025)** [Eurostat] a U10; Spotify "+200M premium" → **263M (2024)/~290M (2025)** [SEC] a U9; DIRCE 2024 → 2025 a U8.

**GPE**: economia sumergida "~20 %" → **~24 % (GESTHA 2024-25, ~330.000 M€)** a U6, ancorar any; Kotler & Armstrong **13ª → 14ª**; WEF **2023 → 2025**; biblio U3 ref.3: el "RD-ley 1/2023" sobra (el d'1 € és Ley 18/2022).

## Citas apócrifas / sospitoses

- **IPE II** U2: frase atribuïda a **Jeff Bezos** sobre marca personal → **apòcrifa**, eliminar atribució. CareerBuilder/Harris Poll 2023 (biblio U2) → verificar existència. "60-70 % vacants al mercat ocult" i "LinkedIn +15M perfils Espanya" → sense font, afegir o suavitzar.
- **EEAE**: **cap apòcrifa confirmada** (verificació molt positiva). Únic error d'atribució: U6 atribueix el **DAFO a Osterwalder** (incorrecte).
- **GPE**: **cap apòcrifa**. Evita el gènere "frase motivacional".
- **Taller**: **cap apòcrifa**.

## Pedagogia i to (EEAE i GPE)

- **EEAE**: aparell pedagògic **pràcticament complet** d'origen. Falta la **nota LOMLOE** a la intro (citar RD 243/2022 + Decret 108/2022 CV) a U1; frontmatter U6 amb "esperit emprendedor" en valencià (passar a castellà); títol RealExample U6 col·loquial. Lagunas visuals: **U7 i U10** úniques sense `Diagram` propi (U10 és el capstone). Repeticions internes: Patagonia ×3, Kodak ×2, lideratge ×2, RSC/stakeholders ×2.
- **GPE**: **asimetria de patró** al llibre — U1/U2/U7 tenen glossari + "para profundizar" + preguntes de reflexió; **U3/U4/U5/U6 no** (la més greu, U6, és la unitat quantitativa amb més termes). Falta nota LOMLOE a la intro del llibre (la de cobertura adaptada CV està a la programació). **Cuaderno de proyecto: excel·lent** (plantilles, rúbriques de 3 nivells a les 6 fases, rúbrica de pitch i de document final, coavaluació, DUA).

## Backlog prioritzat proposat

### Bloc 1 — Crítics (PR ràpid, alta prioritat)
- [ ] C1: IPE I "Heimdal" → "Heimlich"
- [ ] C2: IPE I MEI 0,90 % + cotització 6,50 % + recalcular SolvedExercise 6.1
- [ ] C3: GPE eliminar SLNE derogada d'U3 (text + frontmatter)
- [ ] C4: GPE resoldre laguna BMC (afegir teoria o redirigir cross-ref de la Fase 2)
- [ ] IPE II: eliminar atribució apòcrifa a Bezos (U2)
- [ ] EEAE: corregir atribució DAFO→Osterwalder (U6)

### Bloc 2 — Rigor / cifres (1 PR per assignatura o agrupat)
- [ ] Sweep de cifres de les 5 (Taller, IPE I, IPE II, EEAE, GPE) segons la secció "Rigor i actualitat"
- [ ] Verificar/eliminar cites sense font d'IPE II (CareerBuilder, mercat ocult, LinkedIn)
- [ ] Cites legals d'IPE I (data Ley 3/2012, RD-Ley 13/2022 a biblio, EPI Reglament UE 2016/425, excepció període de prova)
- [ ] Coordinar Mercadona/Mondragón entre IPE II i EDMN (cifres 2024)

### Bloc 3 — Solapament emprenedoria
- [ ] IPE II: cross-references sistemàtiques a EDMN al bloc U5-U9 + substituir diagrames duplicats interns (U8)
- [ ] EEAE: cross-references explícites + repartir Spotify amb EDMN + reduir repeticions internes (Patagonia, Kodak)

### Bloc 4 — Pedagogia / to (EEAE, GPE) i compliance
- [ ] GPE: homogeneïtzar U3/U4/U5/U6 amb glossari + "para profundizar" + preguntes de reflexió
- [ ] Nota LOMLOE a la intro d'EEAE (U1) i GPE (llibre)
- [ ] EEAE: frontmatter U6 al castellà + títol RealExample U6
- [ ] Taller: afegir callout SMI 2026 a U7

### Bloc 5 — Visualitat (opcional, Fase 3 estesa)
- [ ] EEAE: diagrames propis a U7 i U10 (capstone)
- [ ] Imatges/diagrames febles segons diagnòstics individuals

## Regeneració d'outputs

Després d'aplicar canvis de contingut: **regenerar PDFs i diapositives afectats** (`npm run build:all` o els scripts específics per slug). C2 (GPE/IPE) i el sweep de cifres afecten libro + workbook + slides de les assignatures tocades.

## Nota

Imatges de Taller/IPE: **ja estan totes incorporades** (la nota antiga de memòria que deia que faltaven està obsoleta). Build verd i 258 tests en verd al moment de l'auditoria.
