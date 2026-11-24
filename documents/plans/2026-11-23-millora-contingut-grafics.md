# Millora del contingut: gràfics, interactius i PDF

Aprovat per Pau el 2026-11-23 (pilot primer; assignatures i llibres abans que les seccions transversals).

## Estàndard
- Tot model que s'explica es dibuixa: cada apartat amb un model i cada exercici resolt porta el seu gràfic.
- Els gràfics es fan amb dades (`MercadoGrafico.astro`: corbes Q = q0 + m·P, punts, fletxes, preu intervingut), no amb SVG fixos, i valen per a web, PDF i diapositives.
- On hi ha una eina interactiva de la unitat, s'incrusta amb `HerramientaIsland`.
- Paritat ES/CA en cada figura (títol, descripció i peu).

## Ordre
0. Pilot: Eco 1BACH U4 (oferta, demanda i mercat). Fet.
1. Llibres de les 10 assignatures: fet en esta branca (168 gràfics, ES i CA).

2. Refuerzo i problemes EBAU.
3. Olimpíada (12 fitxes, 4 textos): gràfics, itinerari i enllaços entre fitxes.
4. Situaciones.
5. PDF per apartat (scripts `build:*` + Blob) i test de CI amb un mínim de figures.
