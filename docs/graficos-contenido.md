# Gràfics al contingut: estàndard i ús

Regla: **tot model que s'explica es dibuixa.** Si un apartat descriu una corba, una relació entre dues variables o un resultat numèric que es pot representar, porta figura. Cada exercici resolt amb un model gràfic porta la seua.

## Què triar, per ordre

1. **Diagrama ja existent** a `src/components/diagrams/` (FPP, CurvaPhillips, BreakEvenChart, ADAS, CurvaLorenz…) si diu exactament el que diu el text.
2. **`MercadoGrafico`** per a oferta i demanda (corbes lineals `Q = q0 + m·P`, equilibris, desplaçaments, preus màxims i mínims).
3. **`GraficoXY`** per a qualsevol altre model amb dades: sèries de punts `[x, y]`, punts amb guies, fletxes, àrees i notes.
4. **`HerramientaIsland`** quan hi ha una calculadora de la unitat (`src/components/calculadoras/`).

No es creen components nous per a un sol gràfic. Si cap dels anteriors servix, s'anota com a pendent.

## Com s'escriu

Sempre dins de `<Diagram caption="…">`, amb línia en blanc abans i després, i amb l'`import` al capdamunt del MDX.

```mdx
<Diagram caption="Peu que diu què s'ha de mirar, amb les xifres del text.">
  <GraficoXY id="g-costes" titulo="Costes fijos, variables y totales" desc="Frase per a lector de pantalla que conta el gràfic amb xifres."
    xMax={1000} yMax={50000} ejeX="Unidades" ejeY="Euros" simboloX="Q" simboloY="€"
    xTicks={[250, 500, 750]} yTicks={[10000, 20000, 30000, 40000]}
    series={[
      { label: 'CF', color: 'mustard', puntos: [[0, 10000], [950, 10000]] },
      { label: 'CT', color: 'terra', puntos: [[0, 10000], [950, 38500]] },
    ]}
    puntos={[{ x: 500, y: 25000, label: 'A', xLabel: '500', yLabel: '25 000' }]}
  />
</Diagram>
```

- `id` únic dins de la pàgina (prefix `g-` o `mg-`).
- Corbes no lineals: es mostregen amb una expressió, `puntos: Array.from({ length: 41 }, (_, i) => [i * 2.5, 100 - 0.01 * (i * 2.5) ** 2])`.
- Colors: `terra`, `mustard`, `teal`, `ink`, `aubergine`. La corba d'abans d'un canvi va amb `tenue: true`.
- Les etiquetes que xafen una corba es mouen amb `dx`/`dy`. Deixa marge: les corbes no han d'arribar a `xMax`/`yMax` (l'etiqueta es pinta a la dreta de l'últim punt).
- Text de dins del gràfic (títol, descripció, eixos, notes, peu) en la llengua del fitxer. El bessó `.ca.mdx` porta la mateixa figura traduïda, amb el mateix `id` i les mateixes dades.

## Exactitud

- Les xifres del gràfic són les del text i les de l'exercici: es recalculen, no s'estimen. Un equilibri dibuixat ha de ser la intersecció real de les corbes donades.
- Si en dibuixar es veu que el text es contradiu (una taula que no seguix la seua fórmula), es corregix el text en les dues llengües i a la diapositiva del bloc `deck`, i s'anota al resum del canvi.
- Cap dada inventada: els gràfics esquemàtics van sense xifres (etiquetes P₁, Q₁); els gràfics amb xifres usen les del text.
