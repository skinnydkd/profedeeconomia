---
asignatura: eco-4eso
material: ud01-02-concurs
title: "El gran concurso UD1–UD2 · guía docente"
tipo: guia
lang: es
estado: publicado
---

**No lo compartáis con el alumnado.** Acompaña a `ud01-02-concurs.html`.
Economía y Emprendimiento · 4.º de ESO.

Mismo motor que el concurso de 1.º de Bachillerato; cambian el color de la materia, las gráficas y
**todas** las preguntas.

## Cómo se usa

Archivo HTML autónomo para **proyectar**. Doble clic y el navegador a pantalla completa (**F11**).
No necesita internet.

1. **Marca los tipos de prueba** que quieres jugar. El contador de abajo dice cuántas preguntas son y
   cuántos minutos dura. Vienen tres marcadas por defecto (**unos 30 minutos**).
2. Elige **cuántos equipos** (de 2 a 6) y pulsa **Empezar**.
3. Lee la pregunta en voz alta. Los equipos la contestan **en el papel**, no la gritan.
4. **Espacio** revela la respuesta y el «por qué».
5. Da el punto con la tecla **1-6** del equipo, o con el botón **+**. El **−** lo quita.

| Tecla | Hace |
|---|---|
| `espacio` o `→` | Revela la respuesta; si ya está revelada, pasa a la siguiente |
| `←` | Vuelve a la pregunta anterior |
| `1` – `6` | Suma un acierto a ese equipo |

## Los ocho tipos de prueba

**42 preguntas en total.** Elige las que te caben en la sesión.

| Prueba | Preg. | Vale | Min. | Qué mide |
|---|---|---|---|---|
| 1 · Relevo | 8 | 1 | 6 | Definiciones de memoria: bienes, factores, agentes, FPP, especialización |
| 2 · Encuentra el intruso | 5 | 1 | 8 | Clasificar, y saber **por qué criterio** |
| 3 · Ordénalo | 4 | 2 | 8 | Procesos: tramos de la FPP, el ajuste del precio, el flujo circular |
| 4 · Apuesta | 5 | 1-3 | 15 | Casos aplicados. Apuestan antes de ver la pregunta |
| 5 · Tres pistas | 5 | 5/3/1 | 13 | Reconocer el concepto cuanto antes mejor |
| 6 · El dibujo | 4 | 3 | 16 | **FPP y mercado**: dibujan todos los equipos a la vez |
| 7 · Juicio a la respuesta | 6 | 3 | 18 | Encontrar el error en una respuesta mal hecha |
| 8 · Subasta a la baja | 5 | 10↓ | 10 | Preguntas grandes. Vale 10 y baja 1 cada 10 segundos |

**Selección por defecto: relevo + el dibujo + la subasta**, unos 32 minutos. Cubre lo que más pesa en la
prueba escrita: recuerdo rápido, la frontera dibujada y las preguntas de desarrollar.

Si tienes poco tiempo, **relevo + intruso** son 14 minutos y ya remueven media unidad.

**Ninguna pregunta del concurso sale en el control ni en el simulacro.** Los temas sí; los ítems, no.

## Las trampas que hay plantadas

Son las que deciden aprobados. Conviene no pasar de largo cuando caigan.

| Prueba | Dónde | La trampa |
|---|---|---|
| 2 | Tierra · trabajo · capital · **beneficio** | El beneficio no es un factor: es la **renta** de quien arriesga |
| 2 | El horno del panadero / el pan que cenas | Mismo tipo de objeto, dos categorías. **El criterio es el uso** |
| 4 | Las 5 horas del sábado | Solo **la mejor** alternativa, nunca la suma de todas |
| 4 | La harina del horno / la de la despensa | Lo mismo: intermedio o de consumo según quién lo use |
| 7 | «El coste de oportunidad son 120 €» | Va en **unidades del otro bien**. Es el error que más se repite |
| 7 | «Ahora hace más camisetas: ha crecido» | Moverse por la frontera **no es crecer** |
| 7 | «La oferta es el pan del mostrador» | La oferta es una **lista**, precio a precio; no es el stock |
| 7 | «Un punto de dentro es inalcanzable» | Es **ineficiente**. Dentro se está cuando sobran recursos sin usar |

## Las sesiones antes de la prueba

| Sesión | Qué | Material |
|---|---|---|
| **1** | Repaso guiado de la unidad 2 con el dossier: apuntes, anexo y los ejercicios de dibujar | `apunts-mercat.pdf` |
| **2** | **El concurso**, 30 min. Los últimos 15, repasar lo que ha fallado media clase | `ud01-02-concurs.html` |
| **3** | Corrección del simulacro, hecho en clase, cronometrado, en la sesión anterior | — |

El **simulacro** se hace en clase, cronometrado, en la sesión anterior a su corrección, y el solucionario se retiene hasta esa corrección.

## El reparto de equipos

En 4.º el equipo que siempre pierde desconecta en la tercera pregunta. Dos cosas que lo evitan:

- **Equipos mezclados, no los de siempre.** Merece la pena hacerlos tú con la lista en la mano.
- **La subasta y la apuesta reparten suerte**: un equipo que va por detrás puede arriesgar 3 puntos o
  reclamar la subasta pronto y darle la vuelta. Deja alguna para el final.

## Si quieres cambiar preguntas

Todas están en el array `RONDES` del `<script>`, al final del archivo. Cada prueba tiene su formato
(`q`/`items`/`pistes`/`mal`/`fig`), pero dentro de una prueba todas las preguntas son iguales: copia una
y cámbiale el texto. El contador de minutos y la barra se recalculan solos.
