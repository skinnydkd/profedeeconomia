# Situaciones de aprendizaje — diseño

*2026-10-22 · brainstorming con Pau · estado: pendiente de aprobación*

## Intención

Pau tiene en `C:\dev\docencia` (repo privado `skinnydkd/docencia`) el material con el que
da clase este curso en el IES Ramón Cid: casos, fichas, dossiers, dinámicas, concursos,
cuestionarios, simulacros, exámenes, solucionarios, rúbricas y guías del profesorado.
Está organizado por **situaciones de aprendizaje (SA)**: cada unidad de su programación de
aula es una SA con nombre propio, un reto y un producto final evaluado con rúbrica.

Quiere publicar todo ese material en profedeeconomia.es, y quiere que la asignatura se
recorra **por SA, en el orden en que él las da en clase**. Motivo: con la LOMLOE el
profesorado programa por SA, y lo que más cuesta encontrar hecho es una SA completa,
lista para llevar al aula, con sus materiales y su evaluación.

## Objetivos

1. Nueva sección `/[asignatura]/situaciones/` con la lista de SA en el orden de clase de
   Pau, y una página por SA (`/[asignatura]/situaciones/[slug]/`).
2. Cada página de SA reúne:
   - nombre propio y reto (la situación de partida);
   - producto final y cómo se evalúa (rúbrica);
   - la secuencia de sesiones, en orden;
   - todos los materiales de la SA, cada uno en su paso de la secuencia;
   - enlaces a las secciones del libro de la web que la SA usa;
   - enlaces a tests, retos, actividades y recursos ya publicados que encajan.
3. En el hub de la asignatura, las SA son la puerta principal: el primer bloque bajo la
   cabecera con ilustración.
4. Paridad ES/CA: cada material se traduce al castellano y se publica en las dos lenguas.
5. Flujo de publicación casi automático (ver «Flujo» abajo): Pau no copia ni traduce a mano;
   su revisión es hacer merge de la PR.

## No objetivos

- **El libro no se toca**: mismas unidades, mismas URL, mismo PDF, mismas diapositivas. Las
  SA enlazan a él; la relación SA ↔ unidad del libro es muchos a muchos. (Se valoró
  reescribir el libro al orden de clase; descartado por ahora: los temarios no coinciden,
  sería reescribir, no reordenar.)
- No se mueven ni se borran los tests, retos, actividades y recursos existentes.
- Nada de premium/paywall. Se publica todo, solucionarios y guías incluidos. Si resulta
  demasiado, se planteará el «premium profesor» (fase 2) más adelante.
- Ninguna adaptación por CCAA.

## Anti-objetivos (sería un fracaso aunque funcione)

- Que se publique algo que identifique al centro, a la comarca o al alumnado.
- Que llegue a producción una traducción que Pau no ha visto.
- Que el material de la web y el de `docencia` acaben siendo dos versiones que divergen sin
  que se note.
- Que las SA rompan la regla de «misma estructura interna» entre asignaturas.

## Alcance

- **Primera tanda**: Eco 4ESO (11 SA) y Eco 1BACH (14 SA).
- Después: EDMN 2BACH (12 SA) y CJD (14 SA), que también están en `docencia`.
- La sección `situaciones` existe en las 10 asignaturas (regla de estructura del CLAUDE.md)
  y se oculta donde aún no hay SA, como ya hacen las secciones vacías
  (`src/pages/[asignatura]/_secciones-vacias.test.ts`).

## Restricciones

- Cambio de estructura: Pau lo aprueba explícitamente al aprobar este documento.
- Sistema visual del CLAUDE.md y `docs/design-system.md` (paleta, Fraunces/Switzer, nada de
  emojis, cajas con borde simétrico).
- Contenido original o derivado de fuentes oficiales. La secuencia de Pau sigue el libro de
  texto adoptado en su centro: el orden y los títulos genéricos sirven, el contenido tiene
  que seguir siendo de Pau.
- `docencia` es privado. Nada de ese repo se publica sin pasar por el filtro de anonimización.

## Fuente de los datos

- `docencia/<materia>/programacio/programacio-aula.md` (castellano): por unidad, título,
  temporalización, «Situación de aprendizaje y producto final», metodología (pasos),
  tabla de evaluación (instrumentos), recursos. Es la fuente de verdad de la SA.
- `docencia/<materia>/{unitats,activitats,avaluacio}/`: materiales en valenciano, casi
  todos como HTML autónomo imprimible + PDF, algunos `.docx`; los solucionarios y guías
  en `.md` (`*-SOLUCIONARI.md`, `*-GUIA.md`). Los nombres llevan el prefijo de unidad
  (`ud01-`, `ud01-02-` para material compartido por dos unidades).
- **Excluir siempre** lo marcado como privado (`*-privat*`, p. ej. vídeos grabados en
  clase y sus guiones) y los `.mp4`.

## Anonimización

Antes de publicar, quitar o generalizar: nombre del centro (IES Ramón Cid), localidad y
comarca (Benicarló, Baix Maestrat), código de centro, Aules/ITACA/Drive, calendario y
normas propias del centro, nombres de alumnado. Los ejemplos locales («el tejido
productivo de la comarca») pasan a genéricos («el tejido productivo de vuestra comarca»).

## Flujo de publicación

1. Pau marca un material o una SA como lista en `docencia`.
2. Un proceso lo importa a profedeeconomia: copia, anonimiza, traduce al castellano
   (la IA traduce), pasa el agente `content-reviewer`.
3. Todo acaba en una PR contra `main`. **El merge de la PR es la revisión de Pau**; nada
   se publica sin él (regla «no auto-publish» del CLAUDE.md).

## Decisiones de Pau

- **Rúbrica y secuencia**: no existen escritas en `docencia`. La IA propone la rúbrica del
  producto final y asigna cada material a su paso de la secuencia a partir de la
  programación y de las guías; Pau lo revisa en la PR.
- **SA sin materiales**: se publican ya las 25 páginas de SA de la primera tanda a partir de
  la programación (reto, producto final, secuencia, enlaces al libro y a piezas existentes).
  Los materiales se añaden a cada SA a medida que Pau los marca como listos. Hoy hay
  materiales de 4ESO hasta la UD2 y de 1BACH hasta la UD4.
- **Los materiales que faltan** los irá haciendo Pau en `docencia` a lo largo del curso y
  se irán subiendo con el flujo de publicación; no forman parte de este proyecto. Por eso
  el flujo tiene que ser cómodo de repetir muchas veces, SA a SA.

## Decisiones tomadas por Claude (Pau puede corregirlas)

- **Lenguas**: los textos de la SA (reto, producto, secuencia) parten de la programación,
  en castellano; la versión `ca` se traduce de ahí. Los materiales parten del original en
  valenciano anonimizado (versión `ca`); la versión `es` es la traducción. Las dos lenguas
  entran en la misma PR (paridad completa, como el resto del sitio).
- **Reimportación**: `docencia` es la única fuente. Las copias de la web se regeneran en
  cada importación y no se editan a mano; una corrección se hace en `docencia` (o en la
  traducción, que se guarda junto al material para no perderla al reimportar).
- **`docencia/transversal/`** queda fuera de esta tanda.
- **CJD** (8 bloques · 14 SA) se cierra cuando le toque, en la segunda tanda.

## Lo que queda al constructor

- Cómo se marca «listo» en `docencia` y qué dispara la importación (comando local que
  ejecuta Claude Code, GitHub Action, etc.).
- Modelo de datos: colección de contenido nueva para SA y forma de referenciar materiales,
  unidades del libro y piezas existentes.
- Formato de cada material en la web: página propia, HTML imprimible servido tal cual,
  PDF descargable, o combinación. Los HTML de Pau están pensados para imprimir a doble
  cara; eso tiene que seguir funcionando.
- Cómo se generan los PDF de la versión castellana.
- Diseño visual de la lista de SA y de la página de SA, dentro del sistema existente.
- Qué hacer con la lista genérica de SA que ya hay en las páginas `programacion` de cada
  asignatura (enlazarla a la nueva sección, sustituirla…).
- Orden de trabajo y troceado en PRs.
