# Tests enriquidos: tipos de pregunta variados — Diseño (Fase 1: sistema + pilot Eco 1BACH)

**Data:** 2026-06-06
**Estat:** disseny aprovat (pendent revisió de l'spec per Pau)

## Context i objectiu

Els 88 tests d'autoavaluació dels 9 llibres són de bona qualitat (enunciat + 4 opcions + correcta + explicació pedagògica), però **tots són del mateix format** (opció múltiple). Açò els fa plans i avalua sobretot reconeixement. Volem **enriquir-los amb varietat de format** —verdader/fals raonat, càlcul numèric i relacionar/emparellar— i pujar-los a **~12 preguntes**.

És una feature gran (sistema + 88 tests), així que es decompon:
- **Fase 1 (aquest spec)**: construir el sistema (esquema + illa interactiva + render d'impressió per als nous tipus) i enriquir **un llibre sencer (Eco 1BACH, 12 tests)** per validar-ho extrem a extrem.
- **Fase 2 (spec/pla a part)**: estendre l'enriquiment als altres 8 llibres (només autoria; el sistema ja hi serà).

## Sistema actual (resum)

- **Esquema** (`tests` a `src/content.config.ts`): `preguntas[]` amb `enunciado`, `opciones[2-6]`, `correcta` (índex), `explicacion?`. Cap camp `tipo`.
- **Illa interactiva** `src/components/QuizPlayer.tsx` (Preact, `client:load`): renderitza preguntes, corregeix per coincidència d'índex (`r === correcta`), calcula nota/10 i guarda la millor al `localStorage`.
- **Ruta web** `src/pages/[asignatura]/tests/[slug].astro`: passa `test.data.preguntas` a `QuizPlayer`.
- **Render d'impressió** a `src/pages/[asignatura]/actividades/imprimir/[modo].astro`: preguntes + opcions estàtiques + **solucionari** (lletra correcta + explicació) a l'edició profesor.

## 1. Esquema — unió discriminada per `tipo`

Quatre variants, totes amb `enunciado: string` i `explicacion?: string`:

- **`opcion-multiple`**: `opciones: string[] (2..6)`, `correcta: number` (índex).
- **`verdadero-falso`**: `correcta: boolean`.
- **`numerico`**: `respuesta: number`, `tolerancia: number` (default 0), `unidad?: string`.
- **`relacionar`**: `izquierda: string[]`, `derecha: string[]`, `correctas: number[]` (per a cada índex `i` de `izquierda`, `correctas[i]` és l'índex de `derecha` que li correspon). Restricció: `correctas.length === izquierda.length`; cada element de `derecha` s'usa una vegada (parella 1-a-1) — `izquierda` i `derecha` tenen la mateixa longitud.

**Retrocompatibilitat (vinculant)**: una pregunta **sense `tipo`** s'interpreta com `opcion-multiple`. S'implementa amb un `z.preprocess` que injecta `tipo: 'opcion-multiple'` quan falta, abans de la `z.discriminatedUnion('tipo', […])`. Així **els 88 tests existents segueixen vàlids sense editar-los**.

S'exporta un tipus `Pregunta` (unió) reutilitzable per l'illa i el render.

## 2. `QuizPlayer` type-aware (illa interactiva)

Una sola illa que **despatxa per `pregunta.tipo`** per renderitzar i corregir. L'estat de resposta per pregunta passa a ser `number | boolean | number | number[] | null` segons el tipus:

- **`opcion-multiple`**: com ara (botons A/B/C…); encert si índex coincideix.
- **`verdadero-falso`**: dos botons (Verdadero / Falso); encert si booleà coincideix.
- **`numerico`**: `<input type="number">` (+ unitat si n'hi ha) i botó comprovar; encert si `|valor − respuesta| ≤ tolerancia`. Accepta coma o punt decimal.
- **`relacionar`**: cada element de `izquierda` mostra una fila amb un `<select>` (etiquetat) amb les opcions de `derecha`; encert de la pregunta **només si totes les parelles** són correctes, però el **feedback mostra quines parelles van fallar** i la correcta.

La nota segueix sent **1 punt per pregunta** (relacionar tot-o-res per a la nota; feedback parcial). La lògica d'`aciertos`, el resum final i el `localStorage` (per `storageKey` = slug del test) es generalitzen però mantenen la mateixa forma de sortida.

**Accessibilitat**: `<label>` associat a cada input/select; navegació i activació per teclat; estats de focus visibles (ja hi ha `:focus-visible` global).

## 3. Render d'impressió (cuaderno profesor/alumno)

A `actividades/imprimir/[modo].astro`, el bloc de test renderitza segons el tipus:
- **MC**: llista d'opcions a/b/c (com ara).
- **`verdadero-falso`**: «**V** / **F**» (dues caselles per encerclar).
- **`numerico`**: una línia en blanc per a la resposta + la unitat si n'hi ha.
- **`relacionar`**: dues columnes (esquerra numerada 1,2,3… · dreta amb lletres a,b,c…) perquè l'alumne escriga la lletra/traç parella.

El **solucionari** (edició profesor) mostra la resposta correcta per tipus: MC → lletra; V/F → V o F; numèric → valor + unitat; relacionar → les parelles correctes (1→c, 2→a…). Sempre amb l'`explicacion`.

## 4. Contingut del pilot — Eco 1BACH (12 tests)

Enriquir cada un dels 12 tests d'Eco 1BACH a **~12 preguntes** amb una **barreja adequada a la unitat**:
- Mantenir les MC actuals de qualitat.
- Afegir **verdader/fals** raonat a totes.
- Afegir **numèric** on la unitat té contingut quantitatiu (u3 finances/interès, u4-5 oferta-demanda/elasticitat, u7-8 macro/PIB, u9 paro, u10 multiplicador bancari, u11 multiplicador fiscal).
- Afegir **un relacionar** on hi haja conceptes a aparellar (tipus de mercat, fallos de mercado, tipus de paro, agregats monetaris…).
- No tots els tipus a cada test: els que encaixen amb el tema. Mantenir el to i la qualitat de les explicacions.

## Criteris d'èxit

1. L'esquema accepta els 4 tipus; **els 88 tests existents segueixen validant** sense canvis.
2. `QuizPlayer` renderitza i corregeix correctament els 4 tipus (web), amb feedback i nota.
3. El render d'impressió i el solucionari mostren els 4 tipus correctament.
4. Els 12 tests d'Eco 1BACH tenen ~12 preguntes amb barreja de tipus.
5. `astro build` verd; el test `QuizPlayer.test.ts` segueix passant (o s'actualitza); el PDF del cuaderno d'Eco 1BACH es regenera sense problemes.

## Fora d'abast (Fase 1)

- Els **altres 8 llibres** (només autoria) → Fase 2.
- Tipus addicionals (resposta curta, ordenar, etc.): no.
- Nota parcial al relacionar: no (tot-o-res per a la nota, feedback per parella sí).
- Banc de preguntes aleatori / barreja: no (fora d'abast).
