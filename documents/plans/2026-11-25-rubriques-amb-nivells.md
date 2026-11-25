# Rúbriques amb nivells (resta del lot F)

*Aprovat per Pau el 2026-11-25. Ve de `2026-11-24-millora-contingut-no-grafic.md`, lot F.*

**Correcció en executar-lo (2026-11-25):** els projectes ja porten els quatre nivells de cada criteri al cos del text (secció «Niveles de logro»), així que no s'hi duplica res: només una guarda que comprova que cada criteri hi apareix. La mesura inicial mirava només el frontmatter.

## El problema, mesurat

| On | Què hi ha hui | Què falta |
|---|---|---|
| Debats (26) | 104 criteris. 61 ja tenen quatre nivells, perquè usen un dels quatre criteris compartits de `src/lib/debates-niveles.ts` | 43 usos (36 criteris propis) ixen al full d'avaluació amb les caselles buides |
| Projectes (18) | 72 criteris amb criteri, descripció i competència | Cap té nivells: és una llista del que es valora, no una rúbrica |
| Activitats (345) | 39 demanen una «rúbrica impresa» com a material; 12 la porten al cos del text | 38 la citen i no la donen. L'esquema d'activitats no té camp de rúbrica |
| Situacions (25) | Totes amb rúbrica de quatre nivells i total de sessions | El repartiment de sessions per pas |

Sense descriptors, dos professors puntuen diferent la mateixa intervenció i l'alumne no sap què li demana un «3».

## Què es fa

### 1. Esquema i components (codi, poc)

- `src/content.config.ts`: camp opcional `niveles` (quatre textos) a cada criteri de la rúbrica de debats i projectes. Camp nou `rubrica` a activitats, amb la mateixa forma que la de situacions (`criterio` + `niveles` de quatre).
- `HojaEvaluacion.astro` i `NivelesRubrica.astro`: usen `niveles` del fitxer i, si no n'hi ha, els compartits de `debates-niveles.ts` (com ara).
- Projectes: la pàgina i el PDF mostren la graella de nivells que ja tenen els debats, en lloc de la taula de tres columnes.
- Activitats: la rúbrica es pinta al final de la fitxa web i al quadern imprimible, amb la mateixa taula que les situacions. Cap component visual nou.

### 2. Redacció dels nivells (el gros de la feina)

- 36 criteris propis de debats, 69 de projectes i les rúbriques de 38 activitats (tres o quatre criteris cadascuna), en castellà i valencià.
- Regles: cada nivell descriu una conducta observable, no un adjectiu («cita dos dades amb la font» i no «usa bé les dades»); el nivell 3 és el que demana la descripció actual del criteri; el 4 afig alguna cosa concreta, no «excel·lent».
- Subagents per bloc (debats, projectes per matèria, activitats per assignatura), i jo revise una mostra de cada bloc abans d'acceptar-lo.

### 3. Guardes de CI

- Tot criteri d'un debat o projecte publicat té nivells (propis o compartits).
- Tota activitat que cita una rúbrica als materials porta `rubrica`.
- Paritat: el bessó valencià té els mateixos criteris.

### 4. Sessions per pas a les situacions

Camp opcional `sesiones` a cada pas de `secuencia` i guarda que la suma coincidisca amb el total. **El repartiment és dada de Pau**: o me'l passa, o en faig una proposta a partir de les descripcions i ell la corregeix. No entra fins que ell la valide.

## Què no es fa

- No s'unifiquen les etiquetes dels nivells: els debats diuen «Inicio, En proceso, Bien, Excelente» i les situacions «Insuficiente, Suficiente, Notable, Excelente». Les activitats usaran les de les situacions. Unificar-les és una decisió a banda.
- No es toca el sistema visual: es reutilitzen les taules que ja existeixen.
- No s'afigen rúbriques a les activitats que no en demanen.

## Entrega

Un sol PR. Proves, `astro check`, build, i regeneració dels PDF de debats, projectes i activitats tocades, pujats a Blob després de fusionar.

## Decisions de Pau

1. Aprovar el pla.
2. Sessions per pas: les passa ell, o vol una proposta meua per corregir.
3. Etiquetes dels nivells: deixar-les com estan (proposta) o unificar-les.
