# Brand Authority — kit copia-i-pega

> Materials llestos per executar el pla de [brand-authority-geo.md](./brand-authority-geo.md).
> **Regla d'or:** usa la **mateixa descripció d'entitat** a tot arreu (Wikidata, directoris, bios
> socials). La consistència del text entre fonts és, en si mateixa, un senyal que ajuda la IA a
> reconèixer "profedeeconomia.es" com una entitat única. Marca de l'autoria: **sempre
> "profedeeconomia.es", mai el nom personal.**

---

## 1. Descripció canònica d'entitat (reusar idèntica)

**Nombre de marca:** `profedeeconomia.es`

**Descripción muy corta (bios, ≤150 car.):**
> Material gratuito de economía, empresa y finanzas para profes de instituto (ESO, Bachillerato y FP). Por asignatura · LOMLOE · CC BY-NC-SA

**Descripción corta (directorios, meta, ≤160 car.):**
> Material educativo gratuito de economía, empresa y finanzas para profesorado de instituto (ESO y Bachillerato) y FP en España. Organizado por asignatura.

**Descripción media (1 párrafo, fichas de directorio):**
> profedeeconomia.es es una plataforma gratuita de material educativo de economía, empresa y
> finanzas para profesorado de instituto (ESO, Bachillerato y FP) en España. Cada asignatura
> reúne libro completo, diapositivas, actividades, tests de autoevaluación y recursos
> interactivos, basados en el currículo básico estatal LOMLOE. Publicado bajo licencia Creative
> Commons (BY-NC-SA), sin publicidad ni muro de pago sobre el contenido.

**Frase de relación con el sitio hermano (cuando aplique):**
> Proyecto hermano de oposicioneseconomia.es (preparación de oposiciones de profesorado de economía).

---

## 2. Wikidata — especificación lista para crear

**Vía recomendada:** usa la herramienta **Cradle** (https://www.wikidata.org/wiki/Wikidata:Cradle),
que permite crear el ítem con todas las declaraciones de una vez (más fácil que la interfaz por
defecto). Necesitas una cuenta de Wikidata (gratis).

### Labels y descripción
| Campo | Valor |
|---|---|
| Label (es) | `profedeeconomia.es` |
| Label (en) | `profedeeconomia.es` |
| Description (es) | `sitio web de material educativo de economía para profesorado de secundaria en España` |
| Description (en) | `educational website with free economics resources for secondary-school teachers in Spain` |
| Also known as (es) | `profe de economía`; `profedeeconomia` |

> Nota: la *description* de Wikidata va en minúscula, sin punto final y sin tono comercial
> (es la convención; un texto promocional puede ser revertido).

### Declaraciones (statements) — propiedad → valor
| Propiedad | Código | Valor | QID/valor |
|---|---|---|---|
| instance of | P31 | website | **Q35127** |
| official website | P856 | https://www.profedeeconomia.es | (URL) |
| language of work or name | P407 | Spanish | **Q1321** |
| country of origin | P495 | Spain | **Q29** |
| inception | P571 | año de lanzamiento del sitio | **[RELLENAR — año]** |
| field of work | P101 | economics | **Q8134** |
| field of work | P101 | education | **Q8434** |

**Opcionales (si quieres enriquecer):**
- `main subject` (P921): economics (Q8134), business/empresa, finance — los temas que cubre.
- `intended public` (P2360): profesorado de secundaria (buscar el QID en el buscador de Wikidata).
- Referencia: en `official website` añade la propia URL como fuente; ayuda a sostener la notabilidad.

> **Notabilidad:** Wikidata admite un ítem que sea una entidad claramente identificable con una
> URL oficial, así que un sitio web real cumple. (Wikipedia es otra cosa y aún no es viable.)

### Después de crearlo
Pásame el identificador **`Q…`** y lo añado al `SAME_AS` de `src/lib/seo.ts` (una línea), para
que el JSON-LD del sitio enlace su propia ficha de Wikidata. Cierra el círculo entidad ↔ sitio.

---

## 3. Bios de perfiles sociales (misma voz, por plataforma)

- **Instagram** (ya existe, revisa que coincida): usa la *descripción muy corta* + enlace al sitio.
- **X / Bluesky** (si abres perfil de marca): *descripción muy corta* + `🔗 profedeeconomia.es`.
- **YouTube** (si lo abres): *descripción media* en "Acerca de" + enlace.
- En **todas**: nombre de usuario `@profedeeconomia` si está libre, y enlace a `profedeeconomia.es`.
- Cada perfil nuevo → **pásamelo para el `sameAs`**.

---

## 4. Orden sugerido (esta semana)
1. Crear la cuenta de Wikidata y el ítem con la tabla de arriba (~30-45 min). → pásame la `Q…`.
2. Revisar que la bio de Instagram use la *descripción muy corta* exacta.
3. (Siguiente sesión) Te preparo el kit de **directorios** (Procomún/INTEF + autonómicos): URLs de
   alta y la ficha ya redactada para pegar.
