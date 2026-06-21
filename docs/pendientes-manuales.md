# Pendientes manuales de Pau — profedeeconomia.es

> Todo lo que **no es código** y depende de una acción tuya (paneles externos, decisiones,
> subir ficheros, dar de alta cuentas). Actualizado: 2026-06-21.
> Cuando completes algo que requiera un cambio en el repo (p. ej. una URL nueva para `sameAs`),
> dímelo y lo cableo yo.

## 🔼 Rápidas y de alto impacto (paneles externos)

- [ ] **Bing Webmaster Tools** — registrar el sitio en bing.com/webmasters, copiar el token y
      ponerlo en la env var **`PUBLIC_BING_SITE_VERIFICATION`** (Vercel → Project → Settings →
      Environment Variables). Redeploy. Después, enviar el sitemap allí
      (`https://www.profedeeconomia.es/sitemap-index.xml`). *(El meta ya está cableado, PR #174.)*
- [ ] **Google Search Console** — si aún no está verificado: token en la env var
      **`PUBLIC_GOOGLE_SITE_VERIFICATION`** (mismo sitio). *(El meta ya está cableado.)*
- [ ] **Vercel Web Analytics** — activarlo en el dashboard (Vercel → Project → Analytics) para
      que empiecen a llegar datos. *(En el código ya está `webAnalytics: { enabled: true }`.)*

## 🎨 Decisión de marca pendiente

- [ ] **Licencia de Switzer (fuente del cuerpo)** — su licencia ITF Free Font License **no permite
      formalmente auto-alojarla**, y ahora la servimos desde `public/fonts/switzer/` (web + PDFs).
      No es exposición nueva (ya estaba así para los PDF desde mayo), pero conviene regularizarlo.
      Elige una vía:
      1. Pedir **permiso por escrito** a Indian Type Foundry (Fontshare) para auto-hosting; o
      2. **Sustituir** Switzer por una *grotesque* OFL auto-alojable. (Inter queda descartado por
         CLAUDE.md; candidatas: Hanken Grotesk, Schibsted Grotesk, Instrument Sans, Onest.)
      → Si eliges (2), lo implemento yo (es un cambio de `@font-face` + variable de fuente).

## 🚀 Brand Authority — ejecutar el plan (el "techo" de GEO, ~10/100)

Plan completo en **`docs/plans/brand-authority-geo.md`**. Es manual y se construye en meses.
Secuencia 30/60/90 días; lo más urgente:

- [ ] **Wikidata** — crear la ficha de entidad del sitio (campos en el plan). Pásame la `Q…` y la
      añado al `sameAs` del JSON-LD.
- [ ] **Procomún/INTEF** — dar de alta el sitio + 2-3 recursos clave.
- [ ] **Reciprocidad con oposicioneseconomia.es** — que el sitio hermano enlace a este (footer /
      recursos) y, a poder ser, lo incluya en su `sameAs`.
- [ ] Resto (directorios autonómicos, siembra en comunidades, YouTube): ver el plan.
- [ ] Cada perfil nuevo que crees (X/Bluesky, YouTube, Wikidata…) → **pásamelo para el `sameAs`**.

## 🎮 Business Game online (Fase 1b)

- [ ] Aplicar la migración **`supabase/migrations/20260606_init_business_game.sql`** en Supabase
      Studio (crea las tablas `bg_*`).
- [ ] Poner las **env vars de Supabase** (URL + claves) según **`docs/business-game-fase1b-setup.md`**.
- [ ] Verificar el juego online una vez aplicada la migración. *(El motor y el prototipo local ya
      funcionan.)*

## 📝 EBAU por comunidad (cuando tengas los PDFs)

- [ ] Subir los exámenes/resoluciones reales a
      **`public/ebau-examenes/{ccaa}/empresa-{anio}-{conv}-{tipo}.pdf`**
      (`{conv}` = `junio`|`julio`, `{tipo}` = `examen`|`solucion`). La web los detecta sola; lo que
      falte sigue mostrándose "próximamente". Años activos: 2024, 2025, 2026.

## 📦 Piezas grandes (requieren sesión dedicada / brainstorm)

- [ ] **Amazon KDP print-ready** — adaptar libros + cuadernos + cuaderno EBAU a impresión Amazon:
      trim size, bleed, márgenes de impresión, **portada con lomo**, ISBN/código de barras. Los PDF
      actuales son A5 de descarga web, no *print-ready*. Pieza grande → empezar con `/brainstorm`.
- [ ] **Juegos Económicos — "participa y gana premios"** — reforzar/crear el mensaje (contenido).

## 💡 Opcional / mantenimiento

- [ ] Cuando edites de forma significativa una unidad del libro, puedes poner
      **`actualizado_en: AAAA-MM-DD`** en su frontmatter: actualiza el `<lastmod>` del sitemap y el
      `dateModified` del JSON-LD (señal de frescura para IA/buscadores). Si no lo pones, usa
      `publicado_en`.

---

### Ya hecho esta tanda (2026-06-21), no requiere nada tuyo
EBAU 2026 (#170) · structured data / EducationalOrganization+Course+ItemList (#171) ·
auto-hosting de fuentes, fuera Google/Fontshare (#172) · `llms-full.txt` (#173) ·
sitemap `<lastmod>` + meta de Bing (#174) · plan de Brand Authority (#175).
