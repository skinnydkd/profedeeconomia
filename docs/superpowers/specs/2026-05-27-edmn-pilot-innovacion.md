# EDMN 2BACH · Pilot d'innovació editorial

> Data: 2026-05-27 · Llibre pilot: Economía de la Empresa, 2º Bachillerato
> Estat: spec validat — pendent d'implementació
>
> **Què és açò.** El primer disseny editorial complet per a separar
> els llibres de profedeeconomia.es del llibre de text clàssic. Es
> proven sis innovacions sobre EDMN 2BACH. Si funcionen, es plantilla
> i es replica als 10 llibres restants.

## 1 · Context i decisions de partida

Disposem de 11 llibres en producció amb estètica editorial sòbria
(Variant C) ja consolidada. El contingut té bona qualitat però segueix
patrons de llibre de text tradicional: lema → contingut → exercicis.
Pau ha demanat (i) revisar i fixar errors a tots els llibres, (ii)
incorporar la guia EBAU que ja té com a PDF independent, (iii) afegir
recomanacions de llibres/vídeos amb activitats lligades, (iv)
diferenciar-se del llibre de text clàssic amb innovació editorial.

Decisions de seqüència preses al brainstorm:

| Decisió | Resolució |
|---|---|
| Ordre d'atac | Pilot complet sobre **1 llibre** abans de tocar la resta |
| Llibre pilot | **EDMN 2BACH** — té EBAU, és la seua especialitat, té el PDF d'Empresa ja escrit |
| Arquitectura del bloc 'Mirar fora' | Per unitat, **1 pàgina al final**, 1 llibre + 1 vídeo + 1 compte/podcast + 1 activitat |
| Veu de l'activitat | A l'estudiant, **amb tip lateral "Para clase"** per al profe |
| EBAU | **Apèndix complet** de 8-10 pàg. + **pistes EBAU inline** a unitats clau |
| Diferenciadors addicionals | 4 escollits: Caso real con dilema · Reto del curso · Voces en desacuerdo · TL;DR de 90 segons |

Tot el que no estiga aquí s'exclou del pilot conscientment (per
exemple: "Errores que cuestan", "El paper que cambió esto", reverse
classroom marks, errata pública nominal, mapa del libro no lineal van
fora del pilot — es valoraran després si el pilot pega).

## 2 · Èxit del pilot — criteris

Considerem el pilot un èxit si, en acabar:

1. **El llibre EDMN 2BACH compleix el patró editorial nou** a les 12
   unitats sense excepcions.
2. **No hi ha bugs visuals al PDF** generat amb paged.js (zero overflows,
   zero figures fora de bloc, TOC net).
3. **L'apèndix EBAU substitueix el PDF independent** — l'estudiant que
   tinga el llibre no necessita res més per preparar l'examen.
4. **El Reto del curso es pot seguir d'una unitat a l'altra** com a fil
   continu, no com a etapes desconnectades.
5. **El cost d'aplicar el patró als 10 llibres restants és estimable**
   amb error baix després del pilot.

No considerem èxit la quantitat de recomanacions, la longitud del
llibre, ni la quantitat de "voces en desacuerdo" — la qualitat de
cada peça pesa més que la quantitat.

## 3 · Anatomia d'una unitat

Una unitat passa de 4 blocs (lema → contingut → takeaways →
actividades) a aquest patró:

```
[1] TL;DR de 90 segons                  ½ pàgina
    Caixa estilitzada amb 2 paràgrafs. Què aprens
    i per què importa. Lectura ràpida pre/post.

[2] Caso real con dilema (opener)       ½–1 pàgina
    Notícia datada + font + 1-2 preguntes sense
    resposta. Substitueix el camp `lema` actual.

[3] Contingut de la unitat              ~igual que ara
    Amb dos sidebars nous quan toque:
    · "Voces en desacuerdo"  (debats no resolts)
    · "Pista EBAU"           (truc d'examen)

[4] Vuelve al caso                      ½ pàgina
    Resposta argumentada al dilema d'obertura
    amb les eines de la unitat. Tanca el bucle.

[5] Takeaways + Actividades             ~igual que ara
    Inclou una activitat etiquetada
    "Reto · Etapa N" que avança el projecte continu.

[6] Mirar fora                          1 pàgina
    1 llibre + 1 vídeo + 1 compte/podcast +
    1 activitat (self-study, tip lateral "Para clase").
```

Impacte estimat: **+2 pàg/unitat** × 12 + apèndix EBAU 8-10 pàg.
Total nou per al pilot: **\~+35 pàgines** sobre l'edició actual.

## 4 · Estructura del llibre

```
Coberta                                 existent
Crèdits                                 existent
Reto del curso · introducció            2 pàg.  NOU
TOC                                     existent (fix bug, secció 9)
Unitats 1-12                            patró nou (secció 3)
Apèndix · Guía EBAU                     8-10 pàg. NOU
Glosario                                existent
Errata                                  1 pàg. NOU (opt-in)
```

## 5 · Reto del curso — mapping de 12 etapes

| Unitat | Etapa | Entregable de l'estudiant |
|--------|-------|---------------------------|
| U1 Persona emprendedora | Idea + per què tu | Fitxa 1 pàg.: idea, problema, motivació, competències |
| U2 Tipos de empresa | Forma jurídica | Decisió justificada (SL/autònom/cooperativa) |
| U3 Entorno y estrategia | DAFO + PESTEL | Anàlisi extern + intern del projecte |
| U4 Modelos de negocio | BMC v1 | 9 blocs amb hipòtesis marcades a validar |
| U5 Diseño creativo | Value Proposition Canvas + prototip | Què entregues, a qui, per què preferiran |
| U6 Función comercial · marketing | Estratègia comercial | Segments, preu, canals, briefing de campanya |
| U7 Función productiva | Procés + costes + umbral | Estructura de costes + Q\* calculat |
| U8 RRHH | Equip mínim + costos | Organigrama + cost salarial any 1 |
| U9 Función financiera | Pla d'inversió + finançament | VAN + TIR del projecte amb dades pròpies |
| U10 Información contable | Balance + tresoreria previsional | Balance + pressupost de caixa any 1 |
| U11 Análisis EEFF | Ratios + pla de mitigació | Liquidesa, solvència, endeutament, RE, RF |
| U12 Comunicación · pitch | Pitch 3 min + dossier 5 pàg. | Defensa pública a classe amb rúbrica |

**Forma editorial:** El Reto té 2 pàgines d'obertura al principi del
llibre (mapa de les 12 etapes + rúbrica final), i a cada unitat una
**fitxa de mitja pàgina** dins del bloc d'Actividades, etiquetada
"Reto · Etapa N". No té lloc separat: viu dins de cada unitat amb
estètica diferenciada (kicker, accent terracota).

## 6 · Guia EBAU integrada

### 6.1 Apèndix

Adaptació del PDF actual reformatada amb les fonts i paleta del llibre.
Mateixa estructura, mateixos consells, mateix to:

```
Apèndix · Guía EBAU
  D.1  Teoría — cómo responder
  D.2  Umbral de rentabilidad
  D.3  Balance y Cuenta de PyG
  D.4  Ratios — calcular e interpretar
  D.5  Inversiones — VAN, TIR, Payback
  D.6  Gestión del tiempo en el examen
  D.7  Errores típicos — cheatsheet final
```

### 6.2 Pistes EBAU inline

Sidebar nou (terracota), curt (3-4 línies), apunta a la secció completa
de l'apèndix. Repartiment previst:

| Unitat | Tipus | Pista |
|--------|-------|-------|
| U1 | Teòrica | productividad ≠ rentabilidad |
| U3 | Teòrica | distinció anàlisi intern / extern |
| U7 | Pràctica | umbral: redondear ↑ + marcar Q\* + frase |
| U9 | Teòrica | autofinanciación ⊂ financiación propia |
| U9 | Pràctica | VAN — descontar sempre + TIR vs k |
| U10 | Pràctica | negatius entre parèntesis + amortització acumulada |
| U11 | Pràctica | RE = BAII/AT vs RF = BN/PN + palanquejament |

## 7 · Plantilla "Mirar fora"

### 7.1 Format de pàgina

```
─────────────────────────────────────────
            MIRAR FORA · Un                    kicker terracota
─────────────────────────────────────────

  LIBRO
    [Títol · Autor]
    [2-3 frases de per què connecta]
    [Capítols / pàgines suggerides]

  VÍDEO  (durada)
    [Títol · Canal]
    [Frase de gancho]
    [Link curt]

  CUENTA / PODCAST / WEB
    [@handle o domini]
    [Una línia de descripció]

─────────────────────────────────────────

  ACTIVIDAD · 20-30 min                        per a l'estudiant
  [Tasca self-study lligada a un dels recursos]

  ┌─ PARA CLASE ──────────────────────┐         tip lateral
  │ [Variant en grup, durada,         │
  │ materials, agrupament]            │
  └────────────────────────────────────┘
```

### 7.2 Criteris de selecció vinculants

- **Llibre**: ≤350 pàg. recomanat. Preferent dels que apareixen al PDF
  *Recomendaciones sobre Economía* que Pau ha facilitat (Ariely,
  Kahneman, Porter, Kotler, Thaler, Chang, etc.).
- **Vídeo**: ≤20 min, accessible en obert, castellà preferent o
  anglès amb subs en castellà. Verificat que l'URL viu en publicar.
- **Compte/Podcast/Web**: castellà/català preferent. La llista del PDF
  inclou comptes X/Twitter — vàlid per a Batx 2 (els alumnes ja tenen
  accés). Webs com econgraphs.org, marketingexamples.com, finviz.com
  van bé per a unitats específiques.
- **Activitat**: 20-30 min self-study + variant "Para clase" de 45 min.
  Ha de **usar** el recurs com a input, no només referenciar-lo.

### 7.3 Mapping inicial de recursos per unitat

Aquest mapping es valida durant la implementació. És el punt de
partida per a les 12 picks. **Cap recurs final s'inclou sense que Pau
l'aprove personalment.**

| Unitat | Llibre candidat | Vídeo candidat | Compte/podcast/web |
|--------|-----------------|----------------|---------------------|
| U1 Persona emprendedora | *Antifrágil* — Taleb | Tengo un plan (capítol pilot) | @joantubau |
| U2 Tipos de empresa | (a triar — temàtic) | Why Banks Fail | @businessbarista |
| U3 Entorno y estrategia | *Ser competitivo* — Porter | Pensar estratégicamente (Dixit/Nalebuff) | finviz.com/map.ashx |
| U4 Modelos de negocio | *Fifty Things…* — Harford | New Money (canal) | spicy4tuna podcast |
| U5 Diseño creativo | *Cisne Negro* — Taleb | "los precios no existen…" — econoTube | marketingexamples.com |
| U6 Función comercial | *Las trampas del deseo* — Ariely | "ALL OF ECONOMICS explained FAST" | @The_AdProfessor |
| U7 Función productiva | *Economics: The User's Guide* — Chang | "mi problema con nespresso" | @TrungTPhan |
| U8 RRHH | *Ruido* — Kahneman/Sibony | "Why You're Thinking About Unemployment Wrong" | @netcapgirl |
| U9 Función financiera | *La psicología del dinero* | Two Cents (canal) | The Plain Bagel |
| U10 Información contable | *Finanzas para no financieros* — Pidelaserra | "Why Banks Fail" | @ProfesorDiv |
| U11 Análisis EEFF | *Principios* — Ray Dalio | New Money — anàlisi d'empresa | finviz.com |
| U12 Comunicación · pitch | *Posicionamiento* — Ries/Trout | "La historia de GameStop…" | @brandemia\_ |

## 8 · Voces en desacuerdo — sidebars de debats

Caixes "vs" amb dues postures etiquetades quan un concepte té escoles
enfrontades. **Tirada inicial: 5-8 sidebars al llarg del llibre**,
mai forçats. Candidats:

- U3 Entorn: **Productivisme vs descreixement** (Solow vs Raworth)
- U4 Modelos: **Disrupció bona vs explotativa** (Schumpeter vs crítics
  de la *gig economy*)
- U6 Marketing: **Necessitat creada vs descoberta** (Galbraith vs Kotler)
- U7 Productiva: **Eficiència vs sostenibilitat** (lean vs cradle-to-cradle)
- U8 RRHH: **Salari mínim — protecció vs desocupació** (Card-Krueger vs
  visió neoclàssica)
- U9 Finances: **Mercat eficient vs ineficient** (Fama vs Shiller)
- U11 EEFF: **Maximitzar valor de l'accionista vs *stakeholders*** (Friedman vs Mazzucato)

## 9 · Bug audit

Abans d'afegir res, **dues passades** per netejar:

### 9.1 Visual / paged.js

Generem el PDF actual d'EDMN 2BACH + un llibre de control (Eco 1BACH).
Per a cada pàgina:

- TOC: items que es trenquen de pàgina o desborden a columna estreta.
  **Causa coneguda del bug de la captura**: a `imprimir.astro` línia
  437 `.toc__item` usa `grid-template-columns: 16mm 1fr auto`. Quan
  paged.js trenca de pàgina un item amb `lema` llarg, el grid item
  re-flueix amb un ample collapse i el `lema` queda en columna
  vertical. **Fix proposat**: aplicar `break-inside: avoid` al
  `.toc__item` i `text-wrap: balance` + `max-lines: 2` amb ellipsis
  sobre `.toc__lede` per al print, o canviar `.toc__lede` a una
  representació compacta inline (mai més de 2 línies).
- Drop caps: orphans, duplicats després de subtítols.
- Figures: que escapen del bloc de text o trenquen de pàgina.
- Sidebars (callout/curiosity/real-example/takeaways/steps): que es
  trenquen de pàgina malgrat el `break-inside: avoid`.
- Apèndix: numeració de pàgines i headers consistents.

### 9.2 Contingut

- Errata ortotipogràfica i d'accents.
- Errors conceptuals (especialment confusions com
  productividad/rentabilidad, autofinanciación/financiación propia).
- Coherència de fórmules amb la guia EBAU.
- Cites mal atribuïdes o sense font.
- Decimals i unitats inconsistents.

**Output:** una llista d'issues a `/documents/issues-pilot-edmn.md`.
Es resolen abans de qualsevol commit de contingut nou.

## 10 · Cost editorial estimat

Treball per unitat (per a Pau, no per a Claude):

| Peça | Cost estimat |
|------|--------------|
| TL;DR (2 paràgrafs) | 15 min |
| Caso real con dilema + Vuelve al caso | 1 h |
| Fitxa Reto · Etapa N | 30 min |
| Mirar fora — selecció recursos + redacció + activitat | 1.5 h |
| Voces en desacuerdo (només a 5-8 unitats) | 45 min × 7 ≈ 5 h al llibre |
| Pistes EBAU inline (5-7 línies cadascuna) | 15 min × 7 ≈ 2 h al llibre |
| **Total per unitat** | **~3 h** |
| **Total per al llibre (12 unitats)** | **~36 h** |
| Apèndix EBAU (adaptació del PDF existent) | 4 h |
| Reto del curso — pàgines d'obertura + rúbrica | 3 h |
| **Total pilot** | **~43 h** |

Treball per a Claude: implementar els nous components MDX/Astro,
adaptar `imprimir.astro` per als nous patrons, fixar bugs visuals,
maquetar l'apèndix. Estimació separada al pla d'implementació.

## 11 · Fora d'abast

Es deixen explícitament fora d'aquest pilot:

- Aplicar el patró als 10 llibres restants (es planifica després de
  validar el pilot).
- "Errores que cuestan" sidebars (es valora a la fase 2 si pega
  *Voces en desacuerdo*).
- "El paper que cambió esto" (idem).
- Mapa del libro no lineal al principi (es queda en *Reto del curso*
  com a substitut funcional).
- Errata pública amb noms (es queda en *Errata* anònima per ara).
- Reverse-classroom marks.
- Capa web interactiva diferenciada (el pilot va sobre tots dos formats:
  PDF i web mantenen paritat).

## 12 · Pla d'implementació

S'elabora a una propera sessió de `writing-plans`. Esbós:

1. **Fase 0** — Bug audit visual + contingut. Resoldre el bug del TOC.
   Tancar la llista d'issues abans de commitejar contingut nou.
2. **Fase 1** — Components: definir MDX components/macros per a
   TL;DR, Caso real, Vuelve al caso, Reto · Etapa, Pista EBAU,
   Voces en desacuerdo, Mirar fora. Estètica al `global.css` i a
   `imprimir.astro`. Tests visuals.
3. **Fase 2** — Reto del curso: les 2 pàgines d'obertura + rúbrica
   final.
4. **Fase 3** — Apèndix EBAU: maquetar les 8-10 pàgines integrades al
   build del PDF.
5. **Fase 4** — Pilotar amb una unitat (U6 Función comercial, on els
   recursos d'Ariely/Kotler/Twitter encaixen amb la màxima força).
   Generar PDF, validar visualment, iterar.
6. **Fase 5** — Aplicar a les 11 unitats restants amb Pau aportant el
   contingut editorial (recursos, dilemes, voces).
7. **Fase 6** — Generar PDF final, revisar pàgina a pàgina, polir.

## 13 · Riscos i mitigacions

| Risc | Mitigació |
|------|-----------|
| El llibre infla massa (+35 pàg.) i perd compactació | Aplicar al pilot, comprovar al PDF final, ajustar densitats si cal. Patrons opt-out: si una unitat no té un debat clar, no es força *Voces en desacuerdo*. |
| Les recomanacions caduquen (links morts, autors cancel·lats) | Format que permet substitució unitària. Revisió anual al començament del curs. |
| El *Reto del curso* es percep com a feina extra obligatòria | Format opcional per al profe: els takeaways i exercicis funcionen sense el Reto. El Reto és un camí addicional, no obligatori. |
| *Voces en desacuerdo* podria semblar partidista | Etiquetatge per escola/autor, no opinió personal. Es presenten les dues postures amb el mateix tracte editorial. |
| El bug del TOC es repeteix en altres patrons grid nous | Test visual de cada nou component sota paged.js abans d'integrar al llibre. |

---

> **Pròxim pas:** revisió formal d'aquest spec per Pau. Si OK, passa
> a `superpowers:writing-plans` per generar el pla detallat
> d'implementació.
