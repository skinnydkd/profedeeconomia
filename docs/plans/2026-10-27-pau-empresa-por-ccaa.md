# Pla: pàgines d'exàmens de PAU d'Empresa per comunitat (EDMN 2BACH)

*Data: 27/10/2026 · Estat: **proposta, pendent d'aprovació de Pau** · Origen: recomanació 1 de `docs/recerca-paraules-clau-professorat-alumnat-2026-10.md`.*

## Per què

- Google Autocomplete (27/10/2026) mostra «examen pau empresa [CCAA] 2026» per a 9 comunitats (Andalucía, Madrid, C. Valenciana, Castilla y León, Catalunya, Canarias, Galicia, Extremadura i Murcia), més «selectividad economía de la empresa» i «examen pau funcionament de l'empresa».
- GSC (27/04–25/10/2026): el clúster PAU té **0 impressions**. La pàgina actual `/edmn-2bach/ebau/examenes/` en té 44 (posició 2,2), però només per a consultes de marca o genèriques.
- Ja tenim el material: hi ha 126 PDF oficials (examen i criteris de correcció) de 17 comunitats, de 2024 i 2025, a `public/ebau-examenes/`. Tot va en **una sola pàgina**, i per això no podem respondre una cerca que nomena una comunitat.
- Falten els exàmens de **2026**. Ja estan publicats als portals oficials (per exemple, USAL ha publicat l'examen de juliol de 2026 de Castilla y León), i el registre ja preveu l'any 2026 (`ANIOS`).

## Objectiu i criteri d'èxit

Que hi haja una pàgina per comunitat que responga «examen PAU Empresa {CCAA} {any}» amb els PDF oficials de 2024 a 2026 i informació pròpia de cada comunitat. Ha d'estar indexada **abans de febrer de 2027**, a temps per a la campanya de maig–juny.

Mesura: impressions a GSC del clúster PAU i de les URL `/edmn-2bach/ebau/examenes/*`, comparant maig–juny de 2027 amb el zero actual. Punt de control intermedi el 15/03/2027 (indexació i primeres impressions).

## Abast

**Entra:**
1. Ruta nova `/[asignatura]/ebau/examenes/[ccaa]/`, que es genera per a les 17 comunitats d'`edmn-2bach` (l'única assignatura amb `ebau`).
2. Afegir els PDF de 2026 (juny i juliol, examen i criteris) des de fonts oficials, amb la mateixa convenció de noms. Després s'han de pujar a Blob amb `npm run upload:pdfs`, perquè `vercel.json` redirigeix `/ebau-examenes/*.pdf` a Blob.
3. Per a cada comunitat, dades **verificades amb font oficial**:
   - nom local de la prova (PAU, PEvAU, EvAU, EBAU…);
   - nom local de l'assignatura (per exemple, a la C. Valenciana «Empresa i Disseny de Models de Negoci», a Catalunya el nom que use l'organisme);
   - estructura de l'examen (parts, puntuació, opcionalitat) segons les orientacions del curs 2025-26;
   - URL de l'organisme coordinador;
   - data de la convocatòria de 2027 si ja s'ha publicat.
4. Convertir la pàgina actual `/edmn-2bach/ebau/examenes/` en un índex que enllace les 17 pàgines, i millorar-ne el title.
5. Afegir enllaços interns cap a la pàgina de la comunitat des de `/edmn-2bach/ebau/` i des de les 5 famílies de problemes resolts («Practica con los exámenes de tu comunidad»).

**No entra:**
- Resoldre els exàmens nosaltres. Només allotgem els PDF oficials, igual que s'ha fet fins ara (spec `docs/superpowers/specs/2026-06-07-ebau-examenes-ccaa-design.md`).
- Anys anteriors a 2024.
- Altres assignatures.
- Traduir les pàgines al valencià. El `/ca/` continua amb canonical a ES, com la pàgina actual. Vegeu la pregunta 2.

## Disseny de la pàgina de comunitat

Contingut, de dalt a baix. Segueix `docs/design-system.md`: una sola columna, sense ratlles d'accent laterals, color terracota d'EDMN.

1. **H1:** «Exámenes de la PAU de Empresa en {CCAA}», amb l'any i el nom local de la prova al subtítol.
2. **Taula 2026 · 2025 · 2024 × juny/juliol**, amb un botó per a l'examen i un altre per als criteris. Reutilitza la `Fila` de la pàgina actual. Si falta algun PDF, la cel·la diu «próximamente», com ara.
3. **«Cómo es el examen en {CCAA}»**: 3–5 línies amb l'estructura oficial i l'enllaç a la font, amb la data de consulta. És el contingut únic de cada pàgina i evita que totes 17 siguen la mateixa plantilla amb un nom canviat.
4. **«Cómo prepararlo»**: enllaços a les 5 famílies de problemes resolts, als simulacres i al quadern EBAU en PDF.
5. **Altres comunitats**: llista curta d'enllaços a la resta de pàgines.

SEO:
- **Title** (màxim 60 caràcters, ho comprova un test): «Exámenes PAU Empresa {CCAA}: 2024–2026 con soluciones». Per a les comunitats de nom llarg, una variant curta.
- **Description**: nom local de la prova, el de l'assignatura i quants PDF hi ha.
- **Schema**: `BreadcrumbList`. No hi afegim res més: no hi ha cap tipus de schema que encaixe millor i no volem marcatge buit.
- **Fil d'Ariadna**: Inicio › EDMN 2BACH › Preparación EBAU › Exámenes por comunidad › {CCAA}.
- **Sitemap**: entra sol pel filtre actual. Afegir `lastmod` amb la data de l'últim PDF.
- **Pàgines amb poc material**: una pàgina amb **menys de 2 exàmens** va amb `noindex` fins que en tinga més. Ara mateix totes en tenen almenys 2 (Madrid i Navarra en tenen 2).

## Dades

Ampliar el registre que ja existeix, `src/lib/ebau-examenes.ts`, en lloc de fer-ne un de nou:

```ts
export interface Ccaa {
  slug: string;
  label: string;
  prueba: string;          // 'PEvAU', 'EvAU', 'PAU', 'EBAU'…, verificat
  materia: string;         // nom oficial local de l'assignatura
  estructura: string;      // 1–3 frases, de les orientacions 2025-26
  fuente: { url: string; consultado: string }; // organisme coordinador
}
```

Els camps verificats els omplirà un subagent (Sonnet) que treballe **només amb fonts oficials** (universitats coordinadores i conselleries) i que retorne cada dada amb la URL d'on l'ha tret. Pau revisa la taula abans de publicar-la.

## Passos (TDD on hi ha lògica)

| # | Pas | Qui | Verificació |
|---|---|---|---|
| 1 | Tests primer: les 17 comunitats tenen tots els camps; cada slug té directori a `public/ebau-examenes/`; title ≤ 60; `getStaticPaths` genera 17 rutes; regla de `noindex` amb menys de 2 exàmens | Claude | Tests en roig |
| 2 | Recerca de les dades verificades per comunitat (taula amb URL) | Subagent Sonnet | Revisió de Pau |
| 3 | Descarregar els PDF de 2026 de fonts oficials; registrar l'origen de cada fitxer a `docs/ebau-examenes-fuentes.md` | Subagent Sonnet | `file` ha de dir `application/pdf`; una mostra oberta a mà |
| 4 | Ampliar el registre i crear `ebau/examenes/[ccaa].astro` | Claude | Tests en verd |
| 5 | Índex, enllaços interns i title de la pàgina actual | Claude | Build i navegació a la previsualització |
| 6 | `npm run upload:pdfs` (necessita `BLOB_READ_WRITE_TOKEN`) | Pau o Claude amb el seu permís | Les URL dels PDF de 2026 responen 200 |
| 7 | PR a `main`, revisió i merge | Pau | CI en verd |
| 8 | Sol·licitar la indexació de 3 comunitats prioritàries (Andalucía, Madrid, C. Valenciana) i deixar la resta al sitemap; quota diària de GSC | Claude amb Chrome | Inspecció d'URL «indexada» |

Estimació: 1 PR, uns 400–600 línies, la majoria de dades i tests.

## Riscos

- **Pàgines massa semblants (thin content):** es mitiga amb la secció «Cómo es el examen» verificada per comunitat, el nom local de la prova i la regla de `noindex`.
- **Dades errònies sobre el format:** només s'hi posen dades amb font oficial i data de consulta; si no n'hi ha, la secció ho diu i enllaça l'organisme.
- **Drets dels PDF:** són documents oficials publicats per les administracions, i ja es va decidir allotjar-los. Fem constar l'origen de cada fitxer.
- **Canvis de format el 2027:** a la secció d'estructura posem «curso 2025-26» i la revisem a l'octubre.

## Preguntes per a Pau

1. **Ruta:** `/edmn-2bach/ebau/examenes/{ccaa}/` (recomanat, penja de la pàgina actual) o una ruta més curta tipus `/edmn-2bach/pau/{ccaa}/`?
2. **Valencià:** les pàgines `/ca/` es mantenen amb canonical a ES (recomanat ara), o traduïm almenys la de la C. Valenciana i la de Catalunya, on la cerca en català existeix («examen pau funcionament de l'empresa»)?
3. **Pujada a Blob:** la fas tu o em dones permís per a executar `npm run upload:pdfs` amb el token del `.env`?
