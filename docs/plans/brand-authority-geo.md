# Pla de Brand Authority (GEO) — profedeeconomia.es

> Pla d'execució **manual de Pau**. No és codi. Sorgeix de l'auditoria GEO del 2026-06-20,
> on *Brand Authority* va eixir **~10/100** — el component que més llasta la nota global
> i, alhora, l'únic que no es resol amb un commit. Es construeix amb mesos de presència
> externa, no amb codi.

## Per què importa

Els motors d'IA (ChatGPT, Perplexity, Claude, Gemini, Google AI Overviews) decideixen **a qui
citar** segons si reconeixen la marca com una **entitat real i autoritzada**. Eixe reconeixement
ve sobretot de **senyals de tercers**: mencions, enllaços, fitxes d'entitat (Wikidata), presència
en directoris i comunitats. Ara mateix profedeeconomia.es té el contingut i la base tècnica
excel·lents (Technical 92, Content 70), però com a *entitat* és gairebé invisible: cap fitxa a
Wikidata/Wikipedia, mencions de tercers mínimes. Per això la IA encara no "sap" que existim.

> **Dada d'Ahrefs (des. 2025):** per a la IA, les **mencions de marca** tenen una correlació
> ~3× més forta que els backlinks tradicionals. L'objectiu no és SEO de links: és que el nom
> "profedeeconomia" aparega en llocs que la IA llig.

## La restricció de marca (vinculant)

La marca és **deliberadament impersonal** (CLAUDE.md: al públic sempre "profedeeconomia.es",
mai el nom de Pau). Açò té un cost real d'E-E-A-T/autoria, però **no el trenquem**. La jugada és
construir autoritat **d'entitat editorial** (una organització de professorat d'economia), no
autoritat personal. Tot el que segueix respecta eixa regla.

Ja fet al codi (base sobre la qual construïm): `EducationalOrganization` + `sameAs`
(Instagram + oposicioneseconomia.es) al JSON-LD (PR #171), `llms.txt` + `llms-full.txt`.
El `sameAs` és el "pont" que connecta totes les peces d'aquest pla amb el graf d'entitat.

---

## Workstream 1 — Fitxa d'entitat a Wikidata · ALTA prioritat, esforç baix-mitjà

És la peça de més palanca: una fitxa a Wikidata és la font canònica d'entitat que llegeixen
Google Knowledge Graph, Gemini i molts pipelines d'IA. **Wikipedia** encara és inviable (llindar
de notabilitat: cal cobertura en mitjans independents que ara no tenim), però **un ítem de
Wikidata per al lloc web sí és factible** (Wikidata admet llocs web/projectes sense l'exigència
de notabilitat de Wikipedia).

**Passos concrets:**
1. Crear compte a wikidata.org i crear un ítem nou.
2. Camps mínims:
   - Label: `profedeeconomia.es` · Description: "plataforma de material educativo de economía para profesorado de instituto en España".
   - `instance of` (P31): *website* (Q35127) i/o *educational resource*.
   - `official website` (P856): https://www.profedeeconomia.es
   - `language of work` (P407): *Spanish* (Q1321).
   - `country` (P17): *Spain* (Q29).
   - `inception` (P571): any d'inici.
   - Enllaços: les mateixes URLs del `sameAs` (Instagram, oposicioneseconomia.es).
3. Quan existisca l'ítem, afegir la seua URL (`https://www.wikidata.org/wiki/Q…`) al `sameAs`
   del JSON-LD (un canvi d'una línia a `src/lib/seo.ts` → constant `SAME_AS`). **Açò ho faig jo
   quan em passes la Q.**

**Impacte:** alt (entitat desambiguada per a IA i Google). **Esforç:** ~1-2 h una vegada.

## Workstream 2 — Directoris i repositoris educatius oficials · ALTA, esforç mitjà (continu)

On el professorat (i els crawlers d'IA) busquen recursos. Cada alta és una menció autoritzada.

- **Procomún / INTEF** (procomun.intef.es) — repositori estatal de recursos educatius oberts.
  Donar d'alta el lloc i recursos clau (els llibres, els generadors LOMLOE). És públic i molt
  ben indexat. **Prioritari.**
- **Repositoris autonòmics:** Mestre a casa (CV), Agrega, i el de la teua CCAA. Comença per la CV.
- **Agregadors de recursos d'economia/empresa** per a docents (ex.: comunitats tipus
  *Aula Planeta*, *Tiching*, *Didactalia*). Alta del lloc + fitxes de material.
- **Bancos de recursos LOMLOE** que enllacen programacions/rúbriques (tenim `/generadores/`).

**Com:** una fitxa per plataforma amb la descripció d'entitat (no personal) + enllaç a la secció
concreta. **Cadència:** 1-2 altes/setmana fins esgotar la llista. **Impacte:** alt i durador.

## Workstream 3 — Enllaç recíproc amb oposicioneseconomia.es · ALTA, esforç baix

Ja són germans (mateix autor, `sameAs` apunta d'ací cap allà). Cal **reciprocitat real i visible**:

- Que oposicioneseconomia.es enllace profedeeconomia.es (footer "proyecto hermano" o secció de
  recursos) i, idealment, també l'incloga al seu `sameAs`.
- Una pàgina o secció a cada lloc explicant la relació entre els dos projectes.

**Impacte:** mitjà-alt (dues entitats que es validen mútuament reforcen el clúster). **Esforç:** baix.

## Workstream 4 — Sembra en comunitats docents · MITJANA, esforç continu

On Perplexity i ChatGPT pesen molt el contingut comunitari (Reddit, fòrums). **Valor genuí, mai
spam**: respondre dubtes reals enllaçant el recurs quan aporta.

- **Reddit:** r/profesores, r/opositores (per al germà), fils d'economia/ESO-Batx. Participació
  útil, no promocional.
- **Grups de Telegram/Facebook de professorat d'economia** (n'hi ha de molt actius a Espanya).
- **Comunitat de profes d'economia a X/Bluesky:** publicar material i interactuar (la marca, no Pau).
- **Col·laboració amb blogs de referència** (p. ex. econosublime i altres): no són competència,
  són veïns; una menció mútua o un recurs compartit val molt.

**Impacte:** mitjà, acumulatiu. **Esforç:** continu (30-60 min/setmana). **Avís:** la qualitat
mana; una sola intervenció spam fa més mal que bé.

## Workstream 5 — Actius multiformat (YouTube) · MITJANA-ALTA, esforç alt

L'agent de plataformes va marcar **YouTube** com l'actiu que més desbloqueja **Gemini** i obre
carrusels de vídeo a Google. Un canal de marca amb 1 vídeo curt per tema, incrustat a les unitats
(+ `VideoObject` al JSON-LD, que llavors faig jo). És la inversió més gran d'aquest pla; valorar
quan hi haja temps. **Impacte:** alt (Gemini + Google). **Esforç:** alt i sostingut.

---

## Seqüència recomanada (30 / 60 / 90 dies)

**Mes 1 (fonaments d'entitat, alt ROI, poc esforç):**
- [ ] Wikidata: crear ítem (WS1) → passar-me la Q per afegir-la al `sameAs`.
- [ ] Procomún/INTEF: alta del lloc + 2-3 recursos clau (WS2).
- [ ] Reciprocitat amb oposicioneseconomia.es (WS3).

**Mes 2 (amplitud de directoris + comunitat):**
- [ ] Repositori CV (Mestre a casa) + 2 agregadors docents (WS2).
- [ ] Obrir presència de marca a X/Bluesky i començar sembra a Reddit/Telegram (WS4).

**Mes 3 (consolidació + avaluació):**
- [ ] Continuar altes i sembra.
- [ ] Decidir si s'ataca YouTube (WS5).
- [ ] **Re-executar l'auditoria GEO** (`/geo`) i comparar el component Brand Authority.

## Com mesurar el progrés

- **Cerques de marca a Google Search Console:** "profedeeconomia" com a *query* hauria de pujar.
- **Mencions:** cerques periòdiques de `"profedeeconomia"` a Google/Bing/Reddit.
- **Graf d'entitat:** que aparega un Knowledge Panel o que la Q de Wikidata acumule enllaços.
- **Prova directa amb IA:** preguntar a ChatGPT/Perplexity "¿qué es profedeeconomia.es?" cada mes
  i veure si la reconeix i la descriu bé.
- **Re-auditoria GEO trimestral** per veure el delta del component (objectiu realista: 10 → 35-45
  en 3-6 mesos; és el component més lent de tots).

## Què faig jo (Claude) quan tu avances

- Afegir al `sameAs` (`src/lib/seo.ts`) cada perfil/fitxa nova que crees (Wikidata, X/Bluesky, YouTube…).
- `VideoObject` al JSON-LD si obrim YouTube.
- Una secció/pàgina de relació entre els dos llocs si decidim formalitzar-la.
- Re-córrer l'auditoria GEO quan vulgues mesurar.
