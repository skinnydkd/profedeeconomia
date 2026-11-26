# Caixes dels llibres: de quinze tipus a quatre famílies (proposta D)

Estat: **pendent d'aprovació de Pau** (canvia el sistema visual i tots els PDF).

## Problema

Dins dels llibres hi ha 15 components de caixa i 7 fons diferents (terra-soft, mustard-soft, bg-cream, bg-soft, paper, fopp-soft i combinacions). El mateix color vol dir coses diferents: terra-soft és alhora «concepte clau», «pista EBAU», «torna al cas» i «errors». `RealExample` usa el color de FOPP a totes les assignatures. `Callout` rep `variant="warning"` (26 usos) i `variant="info"` (8) que no tenen estil propi.

## Proposta: quatre famílies, un significat cadascuna

| Família | Significat per a qui llig | Superfície | Components |
|---|---|---|---|
| Definició | Açò cal saber-ho | `terra-soft`, sense vora | `Callout` (concept), `TldrUnidad`, `KeyTakeaways` |
| Digressió | Es pot botar sense perdre el fil | `bg-cream`, sense vora | `Curiosity`, `RealExample`, `CasoReal`, `CasoDilema`, `VuelveAlCaso`, `MirarFora`, `VocesDesacuerdo`, `EnEstaFase`, `Callout` (info) |
| Pràctica | Ací es fa alguna cosa | `paper` amb vora 1px `line` | `SolvedExercise`, `Steps`, `Callout` (example), `PistaEbau` |
| Avís | Compte amb açò | `mustard-soft`, sense vora | `ErroresQueCuestan`, `Callout` (warning) |

Queden 4 superfícies en compte de 7. No es reescriu contingut ni es canvia cap nom de component al MDX: només l'estil. L'etiqueta de cada caixa («Caso real», «¿Sabías que…?») es manté, de manera que la família la dona el fons i el tipus concret l'etiqueta.

## Passos

1. Quatre classes de superfície a `src/styles/global.css` (`.caja--definicion`, `--digresion`, `--practica`, `--aviso`) amb una sola mida de cos i el mateix padding i radi.
2. Cada component aplica la seua família i perd el fons propi. `Callout` accepta `warning` i `info` al tipus.
3. Estils d'impressió: mateixes quatre famílies en gris/tinta per al PDF.
4. `docs/design-system.md`: taula de famílies com a regla.
5. Guarda (vitest): cap component de caixa declara un `background` propi fora de les quatre classes.
6. Verificar a 375, 768 i 1440 en tres unitats (Eco 1r Batx. U4, EDMN, FOPP) i revisió externa.
7. Regenerar els PDF dels 10 llibres i quaderns, pujar-los a Blob després del merge. PR propi (el push de PDF va a trossos).

## Decisions que demanem a Pau

- El repartiment de la taula (sobretot `VuelveAlCaso` i `CasoDilema` com a digressió, i `PistaEbau` com a pràctica).
- Avís en mostassa i definició en terracota, o al revés.

Maqueta: captures abans/després d'Eco 1r Batx. U4 amb una caixa de cada tipus (sessió del 2026-11-25).
