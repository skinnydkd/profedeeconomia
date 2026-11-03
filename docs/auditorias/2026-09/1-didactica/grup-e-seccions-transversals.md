# Auditoria didàctica — Grup E: Seccions transversals

> Annex de l'[auditoria didàctica](./README.md) · setembre de 2026 · revisió de només lectura sobre `main` (`876e002`).

> **Data**: 28-09-2026 (inici del curs 2026-27) · **Abast**: Debats, Dinàmiques, Emprenedoria, Olimpíada, Projectes interdisciplinaris, Jocs (inclòs el banc de preguntes de «Juegos Económicos») i Eines docents / Generadors · **Tipus**: auditoria només de lectura (cap fitxer del repo modificat).
>
> **Mètode**: 2-3 peces llegides a fons per secció (contingut + pàgina que el renderitza + components/lògica quan calia) i passada ràpida de la resta amb scripts de lectura (frontmatter, nivells, ponts curriculars, competències, bessons ES↔CA, xifres). He refet tots els càlculs que assenyale. Bancs de preguntes: **180/180** ítems de «Juegos Económicos» i **142/142** del banc de l'Olimpíada revisats amb la clau.
>
> **Recompte de troballes**: Crític 9 · Alt 13 · Mitjà 31 · Baix 9 (total 62).
>
> | Secció | Crític | Alt | Mitjà | Baix |
> |---|---|---|---|---|
> | Debats | 1 | 2 | 7 | 2 |
> | Dinàmiques | 4 | 1 | 7 | 1 |
> | Emprenedoria | 0 | 1 | 5 | 2 |
> | Olimpíada | 2 | 3 | 4 | 0 |
> | Projectes | 0 | 1 | 3 | 1 |
> | Jocs | 1 | 5 | 3 | 2 |
> | Eines / Generadors | 1 | 0 | 2 | 1 |

---

## Debats (`/debates/`)

**Resum**. Secció sòlida en estructura i volum (26 debats en 7 famílies, amb bessó CA per a tots): moció, postures, argumentari per bàndol, fases amb temps que quadren en 50-60 min, rúbrica, ponts a unitats i paquet PDF imprimible. Els argumentaris són, en general, equilibrats i «steelman». La família més nova (Dret i democràcia) està al dia i és jurídicament precisa. Els punts febles són de fons: un error institucional greu (Senat), cap debat aporta dades ni fonts per al debrief ni per al criteri «Uso de evidencia», alguns arguments estan desfasats (CSRD) o descontextualitzats per a Espanya, i l'alineació LOMLOE és nominal (competències específiques buides).

**Punts forts**
- Estructura uniforme i completa en 26/26: moció, 2+ postures amb síntesi, argumentari de 3-4 arguments per bàndol, fases cronometrades (p. ex. salari mínim 12+8+12+8+6+8 = 54 min), rúbrica i ponts curriculars.
- Paquet de materials imprimibles coherent (guia del professor + full d'avaluació + targetes de postura + fitxa de preparació): 52 PDFs presents a `public/downloads/` (ES i CA).
- Varietat de formats reals (parlamentari, taula redona, judici simulat, dilema ètic, fishbowl) i rols de moderació/observació.
- La família «Derecho y democracia» està actualitzada i és precisa: la mediació obligatòria reflecteix el requisit de MASC vigent des de 2025, el debat de reconeixement facial cita els límits del Reglament d'IA i el del repartidor cita la STS de 2020 i la «ley rider» de 2021.
- Bessons ES↔CA idèntics en estructura (nivell, durada, format, ponts) i en totes les xifres del cos (26/26).

**Peces revisades a fons**: `src/content/debates/mercado-estado/01-salario-minimo.mdx`, `trabajo-desigualdad/01-jornada-4-dias.mdx`, `trabajo-desigualdad/02-impuesto-grandes-fortunas.mdx`, `derecho-democracia/03-suprimir-el-senado.mdx`, `derecho-democracia/08-mediacion-obligatoria.mdx` (+ lectura completa de l'argumentari de `01-obedecer-ley-injusta`, `03-impuesto-sucesiones`, `02-tope-alquileres`, `03-renta-basica`, `01-rsc-vs-greenwashing`, `02-ia-y-empleo`); pàgines `src/pages/debates/index.astro`, `[familia]/[slug].astro`, `[familia]/[slug]/imprimir.astro`; components `src/components/debates/**`.

### Troballes

#### DEB-D01 · Crític · Rigor i dades + Coherència — El procediment per a suprimir el Senat és el de l'art. 167, no l'agreujat
- **On**: `src/content/debates/derecho-democracia/03-suprimir-el-senado.mdx:62-64` (i bessó `.ca.mdx:63-65`); contradicció interna a la línia 97-98 (`/debates/derecho-democracia/03-suprimir-el-senado/`).
- **Evidència**: «El debate tiene además una trampa que conviene descubrir en clase: suprimirlo exigiría el procedimiento **agravado** de reforma constitucional, con disolución de las Cortes y referéndum.» Però l'argumentari del mateix debat diu: «exigiría una reforma con mayorías reforzadas y probablemente referéndum». I el llibre de CJD (`src/content/asignaturas/cjd-bach/libro/03-constitucion-y-poderes-del-estado.mdx:125`): «El procedimiento **agravado** se aplica cuando se toca el Título Preliminar, los derechos fundamentales o la Corona».
- **Per què importa**: és el punt d'aprenentatge que el debat marca com a «trampa» i amb què el professorat tanca la sessió (fase final: «El profe cierra con el procedimiento de reforma que haría falta»). El Senat està al Títol III, fora de la llista de l'art. 168: l'alumnat aprendria una regla falsa i contrària al seu propi llibre.
- **Proposta**: reescriure: «suprimirlo exigiría una reforma por la vía del art. 167: tres quintos de cada Cámara —incluido el propio Senado— y referéndum solo si lo pide una décima parte de los miembros de cualquiera de ellas». La trampa de veritat és que el Senat ha de votar la seua pròpia supressió (3/5, o almenys majoria absoluta del Senat + 2/3 del Congrés, art. 167.2). Aplicar el mateix canvi al bessó CA.
- **Confiança**: Alta.

#### DEB-D02 · Alt · Disseny didàctic — El debrief i el criteri «Uso de evidencia» no tenen evidència darrere
- **On**: patró en 26/26 debats (tots tenen només «De qué va / Argumentario / Cómo se desarrolla»). Exemples: `mercado-estado/01-salario-minimo.mdx:99`, `mercado-estado/02-tope-alquileres.mdx:122`, `trabajo-desigualdad/01-jornada-4-dias.mdx:113`, `trabajo-desigualdad/03-impuesto-sucesiones.mdx:120`.
- **Evidència**: debrief del salari mínim: «El profe deshace el rol: ¿qué dice la evidencia? Distinguir efecto-salario de efecto-empleo.»; lloguers: «¿qué dice la evidencia empírica? Casos de Berlín, Cataluña, San Francisco.»; rúbrica: «Uso de evidencia — Apoya las afirmaciones con datos, ejemplos o comparativas.» El debat del salari mínim no dona ni tan sols la xifra de l'SMI 2026.
- **Per què importa**: el moment d'aprenentatge (el debrief) i un dels quatre criteris avaluats depenen d'un contingut que la pàgina no aporta. Un docent que no domine el tema no pot tancar bé la sessió, i l'alumnat argumenta sense fonts. Les afirmacions dels argumentaris queden sense referència.
- **Proposta**: afegir a cada debat un bloc plegable «Para el debrief: qué dice la evidencia» (4-6 punts amb font i any) i un «Dossier de datos» per a l'alumnat (3-5 dades amb font oficial: INE, Banco de España, AIReF, Eurostat, BOE). Per al salari mínim, p. ex.: SMI 2026 = 1.221 €/mes en 14 pagues (el llibre de FOPP ja la cita, `fopp-4eso/libro/08-derechos-laborales.mdx:334`), pujada de 2019, Card i Krueger (1994) i estudis posteriors.
- **Confiança**: Alta.

#### DEB-D03 · Alt · Rigor i dades — L'argument sobre la CSRD i els fons ESG està desfasat a setembre de 2026
- **On**: `src/content/debates/etica-empresa-consumo/01-rsc-vs-greenwashing.mdx:97-104`.
- **Evidència**: «Los fondos ESG han crecido de forma sostenida» i «La Directiva CSRD obliga a las grandes empresas de la UE a publicar informes de sostenibilidad con el mismo rigor que los financieros, auditados externamente.»
- **Per què importa**: la CSRD exigeix *verificació limitada* (no el mateix nivell d'auditoria que els comptes); la Directiva «stop-the-clock» (UE) 2025/794 va ajornar dos anys les onades 2 i 3, i el paquet Òmnibus ha reduït l'abast a les empreses molt grans. Els fons ESG han tingut sortides netes el 2024-2025. Com que el debrief «introduce los conceptos de CSRD», l'alumnat repetiria una regulació que ja no és així.
- **Proposta**: reformular: «La CSRD obliga a las grandes empresas de la UE a publicar información de sostenibilidad con verificación externa limitada; su calendario y su alcance se han recortado con el paquete Ómnibus (2025)». Canviar la frase dels fons ESG per una dada amb font i any (o treure-la). Posar data de revisió al debat.
- **Confiança**: Alta (verificació limitada i ajornament); Mitjana (llindars finals de l'Òmnibus).

#### DEB-D04 · Mitjà · Rigor i dades — Jornada de 4 dies: l'exemple d'Islàndia és imprecís i falta el context espanyol
- **On**: `src/content/debates/trabajo-desigualdad/01-jornada-4-dias.mdx:71-73` i `58-65`.
- **Evidència**: «Varios pilotos —en empresas de Islandia, Reino Unido y Japón— han reportado menor estrés [...] sin reducción de la producción».
- **Per què importa**: les proves d'Islàndia (2015-2019) van ser al sector públic (Ajuntament de Reykjavík i Govern) i van reduir la jornada de 40 a 35-36 hores, no a quatre dies. És un error clàssic que l'alumnat repetirà. A més, el debat no esmenta el cas espanyol (el projecte de llei de 37,5 hores va ser tombat al Congrés el setembre de 2025; el programa pilot estatal per a pimes).
- **Proposta**: «Varios pilotos —en la administración pública islandesa (35-36 horas), en empresas de Reino Unido (2022)…» i afegir un paràgraf «En España» amb la jornada legal vigent (40 h de mitjana anual, coherent amb l'ítem `emp-1302` del banc de JE) i l'estat del debat.
- **Confiança**: Alta.

#### DEB-D05 · Mitjà · Rigor i dades — Successions: l'argument de l'empresa familiar ignora la reducció del 95 %
- **On**: `src/content/debates/trabajo-desigualdad/03-impuesto-sucesiones.mdx:100-103` i fase `:114` («Contextualización»).
- **Evidència**: «**Destruye empresas y explotaciones familiares.** [...] El impuesto puede forzar su liquidación y la pérdida de empleos.»
- **Per què importa**: la Llei 29/1987 (art. 20.2.c) ja preveu una reducció del 95 % per a l'empresa familiar i l'habitatge habitual. És legítim que un bàndol ho argumente, però ni el context ni el debrief donen al docent la dada per a contrastar-ho, i la «Contextualización» de 5 min no té contingut.
- **Proposta**: afegir al «De qué va» o al debrief: reduccions estatals (95 % empresa familiar i habitatge habitual) i 3-4 exemples de bonificacions autonòmiques, amb font; convertir l'argument en «incluso con la reducción del 95 %, …» per fer-lo honest.
- **Confiança**: Alta.

#### DEB-D06 · Mitjà · Rigor i dades — Grans fortunes: el context no diu que Espanya ja té dos impostos sobre la riquesa
- **On**: `src/content/debates/trabajo-desigualdad/02-impuesto-grandes-fortunas.mdx:60-65`, `:117`, `:103`.
- **Evidència**: «varios gobiernos europeos han aprobado o debatido impuestos específicos sobre grandes fortunas»; debrief: «Revisar experiencias de países nórdicos que lo han implantado y los que lo abandonaron (Suecia, Francia)»; «con pocos desgravamientos».
- **Per què importa**: per a una classe espanyola, el punt de partida és l'Impost sobre el Patrimoni (cedit a les CCAA, amb bonificacions desiguals) i l'Impost Temporal de Solidaritat de les Grans Fortunes (Llei 38/2022). Sense això, la moció «deberían pagar más» es debat en el buit. El debrief és ambigu (dels nòrdics, només Noruega el manté).
- **Proposta**: afegir 2-3 línies de context espanyol amb les dues figures i la seua recaptació; precisar el debrief («Noruega y Suiza lo mantienen; Suecia (2007) y Francia (2018, sustituido por el IFI) lo abandonaron»); corregir «desgravamientos» → «desgravaciones».
- **Confiança**: Alta (existència de les figures); Mitjana (detall de la pròrroga de l'ITSGF).

#### DEB-D07 · Mitjà · Disseny didàctic — Fases clau que depenen de materials que no es donen
- **On**: `derecho-democracia/01-obedecer-ley-injusta.mdx:116`, `derecho-democracia/03-suprimir-el-senado.mdx:109`, `trabajo-desigualdad/03-impuesto-sucesiones.mdx:114`.
- **Evidència**: «Cada grupo debe responder a dos casos que el profe reparte: uno donde incumplir parece claramente justificado y otro donde claramente no»; «La presidencia formula dos preguntas incómodas a cada equipo, preparadas de antemano por el profe»; «El profe explica brevemente qué es el impuesto de sucesiones en España…».
- **Per què importa**: són fases de 5-10 min que sostenen l'objectiu del debat (trobar la línia, contrastar amb dades) i el material «llest per a l'aula» no les cobreix. En el cas de la llei injusta, a més, elegir bé els casos és delicat (cal evitar conflictes polítics actuals que polaritzen l'aula).
- **Proposta**: afegir els materials: dos casos límit redactats (p. ex. un cas històric consensuat i una norma escolar), dues preguntes per equip per a la presidència, i un guió de 5 línies per a la contextualització. Incloure'ls també al PDF.
- **Confiança**: Alta.

#### DEB-D08 · Mitjà · Disseny didàctic — Rúbrica genèrica sense descriptors de nivell
- **On**: `src/components/debates/materiales/HojaEvaluacion.astro:3-6`; frontmatter `rubrica` de tots els debats (p. ex. `mercado-estado/01-salario-minimo.mdx:38-50`).
- **Evidència**: «Levels are generic (the rubric schema stores no per-level descriptors)»; nivells «1 Inicio / 2 En proceso / 3 Bien / 4 Excelente»; els mateixos 4 criteris es repeteixen a la majoria de debats, amb «Uso de evidencia» associat a «CPSAA».
- **Per què importa**: sense descriptors per nivell és una escala de valoració, no una rúbrica analítica: dos docents puntuaran diferent i l'alumnat no sap què és un «3». El mapatge competencial és discutible (buscar i contrastar fonts és CCL3/CD1 més que CPSAA).
- **Proposta**: ampliar l'esquema amb `niveles: [{nivel, descriptor}]` i escriure descriptors per als 4 criteris comuns (una vegada, reutilitzables); revisar el mapatge («Uso de evidencia» → CCL3/CD1; «Refutación» → CCL1/CC3).
- **Confiança**: Alta.

#### DEB-D09 · Mitjà · Alineació LOMLOE — Competències específiques buides i «nivel» incoherent amb els ponts
- **On**: frontmatter dels 26 debats (`competencias_especificas: []` a nivell de debat i de cada unitat); p. ex. `mercado-estado/01-salario-minimo.mdx:10` i `:28-35`.
- **Evidència**: salari mínim `nivel: [bach, fp]` però ponts a `fopp-4eso` U7 i U8; el mateix passa en 5 debats (criptomonedes, IA i ocupació, publicitat a menors, salari mínim, renda bàsica). En 9 debats el nivell inclou `fp` sense cap unitat d'IPE I/II (en total, 11/26 debats amb alguna incoherència).
- **Per què importa**: el professorat no pot justificar el debat a la programació (quina competència específica i quin criteri treballa) i els filtres per nivell el despisten.
- **Proposta**: omplir `competencias_especificas` per unitat amb la numeració oficial de cada matèria (la que ja hi ha a `src/content/asignaturas/*/evaluacion/`), i alinear `nivel` amb els ponts (afegir `eso` on hi ha unitats d'ESO; afegir ponts a `ipe1-fp`/`ipe2-fp` o treure `fp`). Afegir un test que detecte etapa-de-pont ∉ `nivel`.
- **Confiança**: Alta.

#### DEB-D10 · Mitjà · Coherència — Debats duplicats amb dinàmiques i activitats d'assignatura, sense enllaç creuat
- **On**: `debates/mercado-estado/03-renta-basica.mdx` vs `dinamicas/sistemas-debates/04-renta-basica.mdx`; `debates/mercado-estado/01-salario-minimo.mdx` vs `asignaturas/eco-1bach/actividades/09-debate-salario-minimo.md`; `debates/mercado-estado/02-tope-alquileres.mdx` vs `eco-1bach/actividades/05-debate-control-alquileres.md`; `debates/dinero-tecnologia-futuro/01-criptomonedas.mdx` vs `eco-1bach/actividades/10-debate-bitcoin-es-dinero.md`.
- **Evidència**: la dinàmica de renda bàsica («Con datos y argumentos de ambos lados», amb full d'arguments i full d'observació) i el debat homònim (sense dades) no s'enllacen; cap activitat d'Eco 1BACH enllaça a `/debates/` ni a `/dinamicas/`.
- **Per què importa**: dos materials sobre el mateix tema amb profunditat diferent fan perdre el millor al docent que en troba només un, i poden donar xifres o marcs diferents.
- **Proposta**: afegir un bloc «También en…» als dos costats (camp `relacionados` al frontmatter) o fusionar: el debat enllaça al dossier de dades de la dinàmica, i l'activitat d'assignatura remet al debat transversal com a versió ampliada.
- **Confiança**: Alta.

#### DEB-D11 · Baix · Rigor i dades — IA i ocupació: premissa discutible presentada com a fet en la introducció neutral
- **On**: `src/content/debates/dinero-tecnologia-futuro/02-ia-y-empleo.mdx:60-63`.
- **Evidència**: «En ambos casos, la economía generó nuevos empleos que compensaron los perdidos.»
- **Per què importa**: és la tesi d'un dels bàndols («la historia tecnológica no avala el apocalipsis laboral») dita pel narrador neutral; per als teixidors manuals la transició va ser llarga i dura. Inclina el debat abans de començar.
- **Proposta**: «En ambos casos, a largo plazo el empleo total siguió creciendo, aunque muchos de los trabajadores desplazados no encontraron un empleo equivalente.»
- **Confiança**: Mitjana.

#### DEB-D12 · Baix · Coherència (ES↔CA) — El bloc de ponts surt en castellà a les pàgines en valencià
- **On**: `src/components/emprendimiento/PuenteUnidades.astro:30,36,40,45` (verificat a `dist/client/ca/debates/mercado-estado/01-salario-minimo/index.html`). Afecta també Dinàmiques, Projectes, Emprenedoria, Jocs i Eines.
- **Evidència**: cadenes fixes «Esto se trabaja en…», «Unidad», «Competencias específicas:» a totes les rutes `/ca/`.
- **Per què importa**: trenca la paritat ES↔CA justament al bloc que mostra l'encaix curricular.
- **Proposta**: passar `locale` al component i afegir `copy` es/ca («Això es treballa en…», «Unitat», «Competències específiques:»).
- **Confiança**: Alta.

### Patrons de la passada ràpida
- Els 26 debats tenen la mateixa plantilla i duracions realistes (50-60 min); cap té secció de fonts ni data de revisió, i les dades actuals (SMI, lleis vigents) quasi no hi apareixen (vegeu DEB-D02).
- Els argumentaris són equilibrats en nombre i força; el biaix, quan n'hi ha, és en la introducció (DEB-D11) o en afirmacions factuals d'un bàndol que el debrief no contrasta (DEB-D03, DEB-D05).
- La família «Derecho y democracia» (8 debats) té millor qualitat mitjana (rúbriques específiques del tema, fets jurídics precisos) que les famílies més antigues d'economia (rúbrica clonada de 4 criteris).
- `competencias_especificas` buit en 26/26; incoherències `nivel` ↔ ponts en 11/26 (DEB-D09).
- Cap pauta DUA (0/26): no hi ha alternatives de participació per a alumnat amb ansietat social, TEA o dificultats d'expressió oral (rol de relator escrit, cronometrador, fitxa d'arguments amb suport visual). Patró comú a totes les seccions.

---

## Dinàmiques (`/dinamicas/`)

**Resum**. És la secció amb millor guia docent (preparació, gestió de l'aula, debrief, errors comuns, targetes de rol i fitxes imprimibles a les 25 dinàmiques) i amb una bona tria d'experiments clàssics. Però la família «Mercados y precios» i dues peces més tenen errors de clau numèrica que invaliden la conclusió de l'activitat (excedent, monopoli, valor afegit, autarquia). Els codis de competència específica d'Eco 1BACH estan desplaçats respecte a la numeració oficial. Falten instruments d'avaluació i pautes DUA, i hi ha duplicats amb activitats de les assignatures.

**Punts forts**
- Guia del professor completa i útil en 25/25: passos cronometrats, «Gestión en el aula», «El debrief (lo más importante)» amb preguntes ordenades i «Errores comunes».
- Materials repartibles llestos (RoleCard, FichaAlumno) que s'imprimeixen aïllats (mode `@media print`).
- Experiments ben triats i en la seua major part ben calibrats: béns públics (4 jugadors, multiplicador 1,6 → MPCR 0,4; l'exemple de 7,2 fitxes és correcte), càrtel (matriu amb estratègia dominant correcta), tragèdia dels comuns (regla de regeneració explícita), subhastes (equivalència d'ingressos i Vickrey ben explicats).
- Enllaç bidireccional amb el joc digital de Teoria de jocs (`src/lib/games/teoria-juegos/registry.ts`, camp `papel`).
- Callouts d'«Equilibrio obligatorio» en temes ideològics (renda bàsica, mercat vs planificació).
- Bessons ES↔CA idèntics en estructura i xifres (25/25).

**Peces revisades a fons**: `src/content/dinamicas/mercats-preus/01-doble-subasta.mdx`, `02-monopolista.mdx`, `03-cartel.mdx`, `decisiones-comunes/04-ventaja-comparativa.mdx`, `distribucion-produccion/01-cadena-plusvalias.mdx`, `sistemas-debates/04-renta-basica.mdx`; pàgina `src/pages/dinamicas/[familia]/[slug].astro`; lectura parcial de `01-mercado-vs-planificacion`, `04-reparto-fiscal`, `02-bienes-publicos`, `01-tragedia-comunes`, `03-dilema-prisionero`, `02-ultimatum`, `mercat-treball/01-entrevista-trabajo`, `04-proceso-seleccion`, `teoria-juegos/01` i `02`.

### Troballes

#### DIN-D01 · Crític · Rigor i dades — Doble subhasta: l'excedent total màxim és 32 €, no 24 €
- **On**: `src/content/dinamicas/mercats-preus/01-doble-subasta.mdx:68`, `:139`, `:154` (i bessó CA `:74`, `:145`, `:160`); arrossegat a `02-monopolista.mdx:55` i `:141`.
- **Evidència**: «El excedente total máximo es de **24 €** (12 € para compradores + 12 € para vendedores).»; fitxa de l'alumne: «¿Se acercó al máximo teórico de 24 €?»
- **Per què importa**: amb 2 compradors per valor (9, 8, 7, 6) i 2 venedors per cost (2, 3, 4, 5), els 8 intercanvis eficients sumen 60 − 28 = **32 €** (16 € consumidors + 16 € productors a 5,50 €). Una classe que negocie bé superarà el «màxim teòric» (eficiència > 100 %) i el debrief sobre excedents perd tot el sentit.
- **Proposta**: canviar les tres mencions a «32 € (16 € + 16 €)» a ES i CA, i a la taula comparativa del monopolista (`02-monopolista.mdx:139-141`: «16 € / 16 € / 32 €»).
- **Confiança**: Alta.

#### DIN-D02 · Crític · Rigor i dades — Monopolista: la taula marca malament els màxims i la comparació amb la subhasta no s'aguanta
- **On**: `src/content/dinamicas/mercats-preus/02-monopolista.mdx:69-70`, `:74`, `:87`, `:91`, `:93`, `:105`.
- **Evidència**: «| 7 | 6 | 42 | **30** ← máximo |» i «| 6 | 8 | 48 | 32 ← *ingreso max.* |»; «El monopolista elige **precio = 7 €** (máximo beneficio) o **precio = 6 €** (máximo ingreso)»; debrief: «La reducción de cantidad es el núcleo del análisis» i «el pastel total es más pequeño».
- **Per què importa**: amb cost de 2 €/u, el benefici màxim és a **6 €** (32 €) i l'ingrés màxim a **5 €** (50 €). A 6 € es venen 8 unitats, les mateixes que en la subhasta: no hi ha reducció de quantitat. I com que el monopolista té tots els costos a 2 € (els venedors de la subhasta tenien 2-7 €), l'excedent total en monopoli (12 + 32 = 44 €) supera el de la subhasta (32 €): la dinàmica «demostraria» que el monopoli és més eficient. Les tres conclusions del debrief són falses amb les xifres donades.
- **Proposta**: (a) canvi mínim que manté el «7 €»: el monopolista hereta l'oferta de la subhasta (els 12 costos 2, 2, 3, 3, …, 7, 7); aleshores el benefici és 14/22/**24**/20/10/−6 per a preus 9…4, l'òptim és 7 € amb 6 unitats, EC = 6 €, EP = 24 €, total 30 € enfront de 32 € → pèrdua d'eficiència 2 €; o (b) mantenir cost 2 €, corregir les etiquetes (benefici màxim a 6 €, ingrés màxim a 5 €) i canviar el referent competitiu a P = CMg = 2 € (12 unitats, excedent 54 €; monopoli 44 € → pèrdua 10 €). Actualitzar RoleCard, taula i fitxa en ES i CA.
- **Confiança**: Alta.

#### DIN-D03 · Crític · Rigor i dades — Cadena de valor: tres totals diferents i un debrief amb xifres que no són les de la fitxa
- **On**: `src/content/dinamicas/distribucion-produccion/01-cadena-plusvalias.mdx:61`, `:84`, `:86`, `:166` (i bessó CA `:67`, `:91`, `:96`, `:187`).
- **Evidència**: guia: «El valor añadido total es 25,00 − 0,80 = **24,20 €**»; fitxa: «| **TOTAL** | | | **24,40** |»; debrief: «El trabajador que fabrica la camiseta recibe 1,20 € de los 2,40 € de valor añadido en su eslabón» i «La tienda compra a 7 € y vende a 25 €».
- **Per què importa**: la suma dels valors afegits de la mateixa taula (0,80 + 1,60 + 1,60 + 1,20 + 19,80) és **25,00 €**, igual al preu final: és justament la identitat que connecta amb el PIB pel mètode del valor afegit (Eco 1BACH U7). El VA del fabricant és 1,60 € (no 2,40) i la botiga compra a 5,20 € (no a 7). L'alumnat comprova la taula i troba tres respostes incompatibles.
- **Proposta**: TOTAL = 25,00 €, i afegir la frase clau «la suma de los valores añadidos es igual al precio final»; debrief: «de los 1,60 € de su eslabón, con un reparto 50/50 recibe 0,80 €» i «la tienda compra a 5,20 €». Corregir ES i CA.
- **Confiança**: Alta.

#### DIN-D04 · Crític · Rigor i dades — Avantatge comparatiu: el País A sí que pot cobrir l'objectiu en autarquia
- **On**: `src/content/dinamicas/decisiones-comunes/04-ventaja-comparativa.mdx:81-84` (bessó CA `:89`), `:96-97`, `:71-73`, `:104`.
- **Evidència**: «producir 30 kg de trigo y 15 m de tela a la vez requiere más tiempo del disponible. Eso es exactamente el punto»; «¿Qué habría pasado si País A se hubiera especializado en telas (su ventaja absoluta)…»; «resuelve los cálculos por adelantado».
- **Per què importa**: el País A necessita 3 h (30 kg) + 3 h (15 m) = 6 h de les 10 disponibles; només el B no hi arriba (7,5 + 3,75 = 11,25 h). La meitat de la classe arribarà a la conclusió contrària a la clau, i el «moment eureka» previst falla. A més, A té avantatge absolut en els dos béns (no només en tela), i la guia no dona el solucionari que demana preparar.
- **Proposta**: canviar la guia: «El País B no puede; el País A sí, pero a costa de…», o bé pujar l'objectiu de A. Afegir un solucionari: a 1 m = 1,5 kg, B produïx 40 m, exporta 20 m i consumix 30 kg + 20 m (en autarquia, amb 30 kg només podia tindre 10 m: +10 m); A produïx 100 kg, exporta 30 kg i consumix 70 kg + 20 m (en autarquia, amb 20 m només tenia 60 kg: +10 kg). Canviar «su ventaja absoluta» per «el bien en el que su ventaja absoluta es menor», i «England» per «Inglaterra».
- **Confiança**: Alta.

#### DIN-D05 · Alt · Alineació LOMLOE — Codis de competència específica d'Eco 1BACH desplaçats respecte a la numeració oficial
- **On**: `unidades_relacionadas.competencias_especificas` de les dinàmiques (p. ex. `mercats-preus/01-doble-subasta.mdx:31,35`, `distribucion-produccion/01-cadena-plusvalias.mdx:25,27`) i `src/lib/juegos.ts` (Stonks, Econopoly, Assegurats, Teoria de jocs).
- **Evidència**: mercats i fallades (U4-U6) → «CE3»; flux circular (U7) → «CE4»; mercat de treball i política fiscal (U9, U11) → «CE5»; finances personals (U3) → «CE2» a `juegos.ts`. Però la numeració oficial del RD 243/2022 que el mateix web reprodueix (`src/content/asignaturas/eco-1bach/evaluacion/evaluacion.mdx:21-62`) és: CE2 = mercat i fallades; CE3 = flux circular; CE4 = sistema financer i finances personals; CE5 = reptes (globalització, equitat…).
- **Per què importa**: el docent que copie el codi a la programació atribuirà l'activitat a una competència que no correspon. Una dinàmica de mercat marcada com a «CE3» es justificaria amb la competència del flux circular. (El document intern `docs/curriculum-eco-1bach.md` usa una altra numeració resumida, que probablement ha originat la confusió.)
- **Proposta**: recodificar amb la taula oficial (U1-2 → CE1; U4-6 → CE2; U7-8 → CE3; U3 i U10 → CE4; U11-12 → CE5; experiments i estudis de cas → CE6, com a complement) i afegir un test que valide els codis contra `evaluacion.mdx`. Revisar també `docs/curriculum-eco-1bach.md`.
- **Confiança**: Alta.

#### DIN-D06 · Mitjà · Rigor i dades — «Plusvalía» sense definir i una «Idea clave» normativa presentada com a conclusió
- **On**: `distribucion-produccion/01-cadena-plusvalias.mdx:2`, `:13`, `:52`, `:88-93`.
- **Evidència**: objectiu «Relacionar los conceptos de plusvalía y margen comercial…»; debrief «qué significa «plusvalía»»; callout: «El valor no está en el objeto, está en quién tiene poder para fijar el precio».
- **Per què importa**: «plusvàlua» té dos sentits (guany patrimonial / plusvàlua marxiana) i la dinàmica no en dona cap; el títol del callout és una tesi normativa forta (nega el paper dels costos i de la valoració del client) presentada com la lliçó.
- **Proposta**: definir-la («aquí usamos plusvalía en el sentido de…; en fiscalidad significa…») o retitular com «La cadena del valor añadido»; reformular: «Quién se queda con más valor añadido depende también del poder de mercado, no solo del esfuerzo o del coste». Afegir una pregunta de debrief amb la visió contrària (riscos, marca, estocs no venuts).
- **Confiança**: Mitjana.

#### DIN-D07 · Mitjà · Rigor i dades — Mercat vs planificació: el disseny decidix el guanyador abans de jugar
- **On**: `sistemas-debates/01-mercado-vs-planificacion.mdx:22`, `:50`, `:67`, `:106`, `:97-101`.
- **Evidència**: «Fichas de moneda para la economía de mercado (20-30 unidades por participante)»; «el comité no puede preguntar a nadie qué necesita»; «Prohíbelo explícitamente»; i a la vegada «Equilibrio obligatorio».
- **Per què importa**: amb dotacions iguals no pot aparéixer cap problema d'equitat del mercat, i un comité sense cap informació sempre perd. La pregunta del debrief «¿también hubo diferencias en equidad?» no té material; l'alumnat pot prendre un experiment trucat per evidència general.
- **Proposta**: donar dotacions desiguals (p. ex. 10/25/40 fitxes) i una necessitat essencial («Medicamento») per fer visible l'equitat; permetre al comité un cens de 2 minuts (cost de temps) en una segona ronda; afegir al debrief: «¿qué parte del resultado se debe al diseño del juego?».
- **Confiança**: Alta.

#### DIN-D08 · Mitjà · Rigor i dades — Repartiment fiscal: un municipi no pot tocar l'IRPF, l'IVA ni crear un impost de patrimoni
- **On**: `distribucion-produccion/04-reparto-fiscal.mdx:38`, `:49`, `:63`, `:190-193`.
- **Evidència**: «El municipio de Econovilla…»; «Subir IRPF tramo superior», «Ampliar IVA a productos de lujo», «Crear impuesto de patrimonio», «Gravar beneficios empresariales extra»; «El total supera en un 40 % el presupuesto disponible».
- **Per què importa**: contradiu el que ensenya el llibre de Taller/Eco 4ESO sobre qui recapta cada impost (IRPF Estat/CCAA; IVA i IS, Estat; Patrimoni cedit a les CCAA; els ajuntaments tenen IBI, IVTM, IAE, ICIO, plusvàlua municipal i taxes). A més, l'«IVA de lujo» no existix, l'ambulatori i l'hospital són competència autonòmica, i 120 M€ sobre 100 M€ és un 20 %, no un 40 %.
- **Proposta**: convertir Econovilla en una comunitat autònoma o un país fictici, o bé canviar les targetes d'ingressos per impostos municipals (IBI, IVTM, taxa turística, ICIO); corregir «40 %» → «20 %».
- **Confiança**: Alta.

#### DIN-D09 · Mitjà · Rigor i dades — Renda bàsica: una font que no es pot verificar i una comparació de cost enganyosa
- **On**: `sistemas-debates/04-renta-basica.mdx:73`, `:75`, `:155`.
- **Evidència**: «Estudios del MIT (Autor et al.) cuestionan que reduzca la desigualdad más que programas focalizados de igual coste.»; «aproximadamente 450.000 M€/año, más del doble del presupuesto del Estado».
- **Per què importa**: no conec cap treball d'Autor et al. sobre renda bàsica i programes focalitzats; atribuir-lo al MIT en les «datos de referencia equilibrados» del docent és arriscat. «Presupuesto del Estado» és ambigu (el sostre de despesa estatal ronda els 200.000 M€; la despesa de totes les administracions ronda el 45 % del PIB), i la xifra bruta no descompta prestacions substituïdes ni la recuperació via impostos.
- **Proposta**: substituir per fonts contrastables (OCDE, 2017, «Basic income as a policy option: Can it add up?»; Hoynes i Rothstein, 2019, *Annual Review of Economics*) i expressar el cost en % del PIB («≈ 28-30 % del PIB en bruto; el coste neto depende de qué prestaciones sustituya y de cómo se grave»).
- **Confiança**: Mitjana (no he pogut verificar la inexistència de l'estudi citat; sí que la comparació és ambigua).

#### DIN-D10 · Mitjà · Disseny didàctic — 21/25 dinàmiques sense instrument d'avaluació i 0/25 amb pautes DUA
- **On**: esquema `dinamicas` (`src/content.config.ts:375-408`, sense camp `rubrica`); només 4 dinàmiques inclouen alguna fitxa d'avaluació al cos (p. ex. `mercat-treball/02-dinamica-grupo`, `sistemas-debates/02-mas-estado-mas-mercado`).
- **Evidència**: cap menció a DUA, NEE/NEAE o accessibilitat en les 25; activitats amb moviment lliure per l'aula («Los alumnos se mueven por el aula», doble subhasta).
- **Per què importa**: sense rúbrica el docent no pot avaluar competencialment una activitat d'una o dues sessions; sense pautes DUA, alumnat amb mobilitat reduïda, TEA o ansietat queda fora de dinàmiques basades en negociació oral i moviment.
- **Proposta**: afegir el camp `rubrica` (reutilitzant el component `Rubrica` dels debats) i un bloc breu «Adaptaciones (DUA)» a cada dinàmica: rol alternatiu (registrador, analista de dades), versió asseguda (ofertes per escrit a la pissarra), suport visual a les targetes.
- **Confiança**: Alta.

#### DIN-D11 · Mitjà · Coherència — Tres versions de la doble subhasta (i altres duplicats) amb valors diferents i sense enllaç
- **On**: `dinamicas/mercats-preus/01-doble-subasta.mdx:64-66` (compradors 9-4, venedors 2-7); `asignaturas/eco-1bach/actividades/04-dinamica-mercado-doble-subasta.md:32` (8-4 i 2-6); `emprendimiento/actividades/un-mercado-en-vivo.mdx:33-34` (10-6 i 4-8). També avantatge comparatiu (`eco-1bach/actividades/12-ventaja-comparativa-dos-paises.md`) i ultimàtum (`eco-1bach/actividades/02-juego-ultimatum-homo-economicus.md`).
- **Evidència**: l'activitat d'Eco 1BACH té rúbrica amb pesos (25/30/25/20 %) i la dinàmica transversal no; cap de les tres versions enllaça les altres.
- **Per què importa**: el docent no sap quina triar i pot barrejar xifres (equilibris de 5,50 €, ≈5 € o 7 € segons la versió); es multiplica el manteniment (l'error de DIN-D01 només és en una).
- **Proposta**: declarar la dinàmica transversal com a versió canònica (amb les xifres corregides) i convertir les altres en enllaços o variants breus («versión rápida de 45 min»), amb un camp `relacionados` visible.
- **Confiança**: Alta.

#### DIN-D12 · Mitjà · Disseny didàctic — Dinàmiques de selecció de personal sense el marc legal de no discriminació
- **On**: `mercat-treball/01-entrevista-trabajo.mdx:46-72`, `04-proceso-seleccion.mdx:12-24`.
- **Evidència**: l'entrevistador «prepara 5 preguntas» lliurement; cap menció a preguntes prohibides (embaràs, estat civil, religió, orientació sexual, discapacitat).
- **Per què importa**: és l'oportunitat natural (FOPP U8, IPE I U6) per a aprendre que certes preguntes són il·legals (ET art. 4.2.c i 17; Llei 15/2022) i evita que el rol reproduïsca estereotips amb companys reals.
- **Proposta**: afegir a la targeta de l'entrevistador una llista «Preguntas que no se pueden hacer» i una pregunta de debrief («¿Alguien ha hecho una pregunta ilegal? ¿Cómo responder?»); fer servir sempre perfils ficticis a l'entrevista.
- **Confiança**: Alta.

#### DIN-D13 · Baix · Rigor i dades — Petites incoherències de càlcul i redacció
- **On**: `mercats-preus/03-cartel.mdx:74`; `decisiones-comunes/01-tragedia-comunes.mdx:47-53`; `mercats-preus/01-doble-subasta.mdx:83` vs `:60`.
- **Evidència**: «(50 > 30 si los demás cumplen; 20 > 15 si los demás traicionan)»; regla «Si capturas totales ≥ stock inicial → colapso total» sense dir com es repartixen els peixos; «los cinco minutos de conversación posterior» vs «Comparación y debrief (15 min)».
- **Per què importa**: la comparació del càrtel barreja casos (si un altre traïx: 25 > 15; si traïxen els dos: 20 > 5; la fitxa final ho diu bé); a la tragèdia, sense regla de racionament no es pot puntuar la ronda del col·lapse.
- **Proposta**: corregir el parèntesi del càrtel; afegir «si se pide más de lo que hay, se reparte a partes iguales lo que quede»; unificar la durada del debrief.
- **Confiança**: Alta.

### Patrons de la passada ràpida
- Les guies docents són riques i el to és l'adequat (plural, de col·lega a col·lega, «Errores comunes» honestos).
- `duracion` expressada com «1 sesión / 1-2 sesiones» sense minuts; en algunes, la suma dels passos supera els 55 min (renda bàsica 49-63 min, «1 sesión»).
- Els codis de CE van per unitat (bé) però amb numeració desplaçada (DIN-D05); `competencias_especificas` de primer nivell buit en 25/25.
- Incoherències `nivel` ↔ ponts en 10/25 (p. ex. `02-bienes-publicos` és `[bach]` amb pont a Taller 3r ESO U8; `mercat-treball/03-negociacion-salarial` és `[bach, fp]` amb pont a FOPP 4t ESO U8).
- La família «Sistemas y debates» fa de debats dins de Dinàmiques: solapament conceptual amb la secció Debats (vegeu DEB-D10).

---

## Emprenedoria (`/emprendimiento/`)

**Resum**. «De cero a empresa» té una arquitectura clara (11 fases + ★, tres itineraris, quadern alumne/professor, rúbriques de 3 nivells) i fases ben resoltes (números i punt mort, venda real). Els problemes principals són de viabilitat i seguretat a l'ESO (eixir al carrer a entrevistar desconeguts sense cap pauta), una incoherència en l'itinerari ESO (el dossier final demana números que l'Sprint no calcula), ponts curriculars escassos i exemples d'empreses reals amb dades sense font o incorrectes.

**Punts forts**
- Arquitectura modular i honesta: fases «Núcleo»/«Profundización», itineraris «Sprint ESO», «Batx/FP» i «A la carta» (`src/lib/emprendimiento.ts:18-40`), quadern únic per a web i PDF.
- La Fase 9 és correcta i ben pautada: punt mort amb exemple verificat (150 / (14 − 4) = 15 agendes), marge de contribució explícit, avís contra inflar ingressos i rúbrica.
- La fase ★ «Lanza» té un marc de seguretat i responsabilitat modèlic (menors, permisos, caixa única, destí de l'excedent, fiscalitat amb avís de «no es asesoramiento»).
- El kit d'actitud oferix «Variante suave / difícil» en 12/12 activitats (disseny multinivell).
- Exemples ficticis clarament etiquetats com a «ficticia / inventada».

**Peces revisades a fons**: `src/content/emprendimiento/proyecto/09-numeros-viabilidad.mdx`, `99-lanza-valiente.mdx`, `11-pitch-dossier.mdx` (i `04-valida.mdx` parcial); `actividades/reto-del-cafe.mdx`, `un-mercado-en-vivo.mdx`, `dirige-la-empresa.mdx`, `fracasa-rapido.mdx`, `silla-caliente.mdx`; `ejemplos/spotify.mdx`, `mercadona.mdx`, `netflix.mdx`, `hawkers.mdx`, `excusas-pro.mdx`; pàgines `src/pages/emprendimiento/index.astro`, `proyecto/index.astro`, `entrevista-emprendedores/index.astro`; `src/lib/emprendimiento.ts`.

### Troballes

#### EMP-D01 · Alt · Disseny didàctic (seguretat) — Eixides al carrer amb menors sense cap pauta de seguretat ni d'autorització
- **On**: `proyecto/04-valida.mdx:15`, `:58` (fase «Núcleo», inclosa a l'Sprint ESO); `src/pages/emprendimiento/entrevista-emprendedores/index.astro:69-70`, `:96`; `actividades/reto-del-cafe.mdx:4`, `:14`, `:21`.
- **Evidència**: «salid a la calle a **preguntar a personas reales** (no a vuestros amigos)»; «Hablad con al menos diez personas que tengan el problema»; «Individual o por parejas. Visita tres negocios diferentes»; «la valentía de hablar con desconocidos»; «20 min en clase + reto fuera»; «pide algo gratis e inofensivo — la hora, una recomendación, indicaciones para llegar a un sitio».
- **Per què importa**: són tasques per a alumnat de 14-16 anys fora del centre i amb desconeguts; en horari lectiu són activitats complementàries que requerixen autorització familiar i del centre. La fase ★ ja té un bon model de seguretat, però justament les tasques obligatòries per a ESO no en tenen.
- **Proposta**: afegir un callout «Antes de salir» reutilitzable (sempre en parelles o grups; espais oberts al públic i en horari diürn; autorització de família i centre si és en horari lectiu; entrevistes també possibles a familiars, personal del centre o per videotrucada supervisada; mai dades personals dels entrevistats). A l'entrevista, recomanar parelles per defecte i un full d'autorització.
- **Confiança**: Alta.

#### EMP-D02 · Mitjà · Disseny didàctic — L'Sprint ESO acaba en un dossier que demana números que no ha calculat
- **On**: `src/lib/emprendimiento.ts:22-24`; `proyecto/11-pitch-dossier.mdx:8`, `:14`; `proyecto/09-numeros-viabilidad.mdx:5-6`.
- **Evidència**: Sprint ESO = «Cinco fases lean […] `fases: [1, 2, 3, 4, 11]`»; entregable de la Fase 11: «(problema → solución → modelo → validación → números)», plantilla amb diapositiva «números»; la Fase 9 està marcada `nucleo: true, nivel: todos`.
- **Per què importa**: l'alumnat d'ESO arriba al pitch sense haver fet el punt mort; les etiquetes «Núcleo» de les fases 5 i 9 contradiuen que l'Sprint siga «el nucli».
- **Proposta**: incloure la Fase 9 a l'Sprint (6 fases, «unas 5-6 semanas») o preveure una «Fase 9 exprés» d'una sessió; alternativament, que l'entregable de la Fase 11 diga «números (solo Batx/FP)».
- **Confiança**: Alta.

#### EMP-D03 · Mitjà · Disseny didàctic (seguretat) — La venda real no parla de seguretat alimentària, al·lèrgens ni venda en línia
- **On**: `proyecto/99-lanza-valiente.mdx:56-65`, `:79`, `:86-152`.
- **Evidència**: «Vender fuera del centro: en una feria local, en un mercado de barrio, en un evento público o a través de una tienda online sencilla»; la llista de riscos cobrix menors, permisos, diners, fiscalitat i responsabilitat, però no aliments.
- **Per què importa**: molts projectes escolars venen menjar casolà; vendre'l al públic té requisits d'higiene i d'informació d'al·lèrgens, i la venda a distància implica dret de desistiment i plataformes de pagament que exigixen majoria d'edat.
- **Proposta**: afegir dos apartats breus: «Si vendéis comida» (preferir productes envasats i etiquetats; informar dels 14 al·lèrgens; consultar el centre) i «Si vendéis online» (la gestiona un adult; desistiment de 14 dies; no recollir dades personals).
- **Confiança**: Alta.

#### EMP-D04 · Mitjà · Alineació LOMLOE — Ponts curriculars escassos i esbiaixats cap a EDMN i GPE
- **On**: frontmatter de `proyecto/*.mdx` (p. ex. `02-idea-equipo.mdx`, `03-modelo-negocio.mdx`, `11-pitch-dossier.mdx:9-10`).
- **Evidència**: 1-2 ponts per fase; fases de l'Sprint ESO enllaçades a GPE i EDMN (Batxillerat); cap pont a `ipe2-fp` (unitats 4-9: mentalitat emprenedora, idea, entorn i model, màrqueting i validació, viabilitat), cap a `eeae-bach`, i `competencias_especificas: []` en 12/12.
- **Per què importa**: el projecte es presenta «transversal a todas las asignaturas» i té un itinerari «Batx/FP», però el docent d'Eco 4ESO, IPE II o EEAE no troba on encaixa cada fase.
- **Proposta**: afegir per fase els ponts a `eco-4eso` U11-U12, `taller-eco-3eso` U6, `ipe2-fp` U4-U9 i `eeae-bach` U5-U9, amb la CE oficial de cada matèria.
- **Confiança**: Alta.

#### EMP-D05 · Mitjà · Rigor i dades — Exemples d'empreses reals amb afirmacions errònies o sense font
- **On**: `ejemplos/spotify.mdx:9`, `:11`; `ejemplos/netflix.mdx:5`, `:12`; `ejemplos/mercadona.mdx:8`; `ejemplos/hawkers.mdx:11-12`.
- **Evidència**: Spotify: «Casi cero publicidad pagada» i «Premium ~10,99 €/mes»; Netflix: «sin anuncios»; Mercadona: «Eliminaron miles de referencias»; Hawkers: «Cristiano Ronaldo, Steve Aoki […] recibieron gafas gratis».
- **Per què importa**: Spotify declara més de 1.000 M€ anuals en vendes i màrqueting; Netflix té pla amb anuncis a Espanya des de 2022; la retirada de referències de Mercadona (2008-2009) va ser d'uns centenars, no de milers; la dada de Hawkers i CR7 no l'he poguda verificar. Són «espejos para vuestro proyecto»: l'alumnat en trau la lliçó falsa que «lo viral sustituye a la publicidad».
- **Proposta**: afegir camps `fuente` i `consultado` a l'esquema d'exemples reals, verificar-los i reformular (p. ex. «Además de su gran inversión en marketing, Wrapped le da difusión gratuita cada diciembre»); preu de Spotify amb data o sense xifra.
- **Confiança**: Alta (Spotify, Netflix); Mitjana (Mercadona, Hawkers, preu actual de Spotify).

#### EMP-D06 · Mitjà · Disseny didàctic — «Dirige la empresa»: invertir en eficiència mai compensa amb tres rondes, i ningú ho diu
- **On**: `actividades/dirige-la-empresa.mdx:19-21`, `:28`, `:56`.
- **Evidència**: «Eficiencia — cuesta 300 €, es permanente […] desde la ronda siguiente»; «a 30 € pasarían a ganar 24 × 40 − 100 = **860 €** cada ronda»; fórmula «Beneficio de la ronda = (precio − 10) × unidades vendidas − 100 − inversión» amb «Cada unidad producida cuesta 10 €, se venda o no».
- **Per què importa**: la màquina guanya 160 €/ronda i costa 300 € (recuperació en 1,9 rondes), però només s'usa una ronda (la 3a): sempre perd enfront de no invertir (1.260 € enfront de 1.400 €) i enfront de fer màrqueting dues rondes (1.900 €). La lliçó «gastar hoy para ganar más mañana» queda desmentida sense explicació. La fórmula no resta el cost de les unitats no venudes.
- **Proposta**: allargar a 5 rondes o permetre invertir en la ronda 1; afegir al debrief el càlcul del termini de recuperació («300 / 160 ≈ 1,9 rondas»); fórmula: «precio × vendidas − 10 × producidas − 100 − inversión».
- **Confiança**: Alta.

#### EMP-D07 · Baix · Coherència (to) — Primera persona del singular, xifres de fases i itineraris sense traduir
- **On**: `src/pages/emprendimiento/index.astro:27`, `:31`; `src/lib/emprendimiento.ts:23`, `:28`, `:30`; `src/pages/emprendimiento/proyecto/index.astro:8` (usa `ITINERARIOS` sense localitzar).
- **Evidència**: «El emprendimiento atraviesa todas mis asignaturas.»; «Doce fases» (portada) vs «Las once fases» (itinerari); «Proyecto Batx/FP» en una pàgina en castellà; a `/ca/emprendimiento/proyecto/` es veu «Cinco fases lean, sin planificación pesada…».
- **Per què importa**: CLAUDE.md prohibix el to personal («No personal de Pau»); les incoherències de recompte i idioma resten credibilitat.
- **Proposta**: «El emprendimiento atraviesa todas las asignaturas de economía»; unificar «once fases + una opcional»; «Proyecto Bach/FP»; localitzar `ITINERARIOS` a la pàgina del projecte com ja es fa a la portada.
- **Confiança**: Alta.

#### EMP-D08 · Baix · Disseny didàctic (valors) — ExcusasPro: un model de negoci d'engany adreçat a «estudiantes con entregas pendientes»
- **On**: `ejemplos/excusas-pro.mdx:9-21`, `:25`.
- **Evidència**: «una red de actores de voz para la modalidad «llamada de familiar en apuros»»; segment «Estudiantes con entregas pendientes»; «debe resolver su propio contradición interna».
- **Per què importa**: l'humor funciona, però l'exemple normalitza l'engany a docents i famílies en material per a l'aula; el text ja apunta a l'ètica i no ho explota.
- **Proposta**: afegir una pregunta de debat explícita («¿Debería existir? ¿Es legal simular la llamada de un familiar?») o canviar el segment a adults; corregir «su propia contradicción».
- **Confiança**: Mitjana.

### Patrons de la passada ràpida
- Les 12 fases (11 + ★) tenen `duracion`, `entregable`, `cuaderno` (tasca, reflexió, orientació docent) i una taula «Para evaluar esta fase» de 3 nivells (12/12): el patró és bo i consistent.
- El kit d'actitud (12 activitats, 14-53 línies) no té esquema curricular (sense `nivel`, ponts, competències ni debrief/avaluació); són «càpsules» útils però aïllades.
- Els exemples reals (Mercadona, Netflix, Spotify, Hawkers) no tenen font ni data (EMP-D05); els ficticis estan ben etiquetats.
- La pàgina d'entrevistes té preguntes obligatòries sensibles per a un comerç de barri («¿Cuánta [financiación] y cómo la conseguiste?», «¿Cuánto tiempo tardaste en obtener beneficios?»): millor fer-les optatives o per trams.
- Bessons ES↔CA idèntics (33/33 peces de contingut).

---

## Olimpíada d'Economia (`/olimpiada/`)

**Resum**. Bona base: 12 fitxes amb exemples resolts (les de punt mort i comptabilitat són rigoroses), banc interactiu de 142 preguntes amb explicació, taller de textos amb pautes i simulacres oficials de la fase nacional i de 9 CCAA. Però el banc té errors de clau (EPA/atur registrat, PIB per la despesa) i un biaix de posició que el fa endevinable (la correcta no és mai la «d»); la fitxa de política monetària té l'objectiu del BCE anterior a 2021; i la pàgina presenta el format d'una fase local com si fora el de l'Olimpíada.

**Punts forts**
- Fitxes ben estructurades: «De qué va», fórmula i derivació, gràfic canònic, variants d'examen i errors freqüents; tots els càlculs de la fitxa de punt mort (21.000; 24.000; 26.000; ≈19.091; 16.800; 28.000; 27.000) són correctes.
- La fitxa de comptabilitat explica bé l'efecte palanquejament i per què la RF (15 %) queda per davall de la RE (16 %) només per l'impost.
- Banc: totes les preguntes tenen explicació i només 2 claus són clarament errònies (#54, #46); 3 ítems més tenen l'explicació o l'enunciat erroni (vegeu OLI-D01 i OLI-D02); bona cobertura de micro, macro i empresa.
- Textos per a la Part III amb preguntes graduades i pauta de correcció (p. ex. el del salari mínim, equilibrat entre model competitiu, monopsoni i evidència).
- Simulacres agrupats per àmbit amb exàmens oficials recents i reconeixement explícit que «el formato varía según la comunidad» (al codi).

**Peces revisades a fons**: `src/content/olimpiada/fichas/03-punto-muerto.mdx`, `04-politica-economica.mdx`, `06-contabilidad.mdx` (exemple resolt), `05-mercado-trabajo.mdx` (definicions i exemple); `textos/03-salario-minimo-empleo.mdx` (i `04-aranceles-guerra-comercial.mdx` parcial); `src/lib/olimpiada.ts` (GUIA, AMBITOS, SIMULACROS, LECTURAS); `src/lib/olimpiada/banco.ts` (142/142 ítems); pàgines `src/pages/olimpiada/index.astro` i `banco/index.astro`.

### Troballes

#### OLI-D01 · Crític · Rigor i dades + Coherència — EPA i atur registrat: el banc i la fitxa es contradiuen, i la clau del banc és falsa
- **On**: `src/lib/olimpiada/banco.ts:463` (ítem #54); `src/content/olimpiada/fichas/05-mercado-trabajo.mdx:44`.
- **Evidència**: clau del banc: «Suele arrojar datos de parados más bajos que el SEPE y es el instrumento usado para comparaciones internacionales»; fitxa: «El **paro registrado** del SEPE es una fuente complementaria, siempre inferior al paro EPA».
- **Per què importa**: en els darrers anys l'EPA dona més aturats que l'atur registrat (p. ex. 2T 2025: ≈2,55 milions EPA enfront de ≈2,41 milions registrats al juny), de manera que la clau del banc ensenya l'inrevés; i la fitxa generalitza massa («siempre»: el 2005-2007 va ser a l'inrevés). L'ítem `eco-1202` de Juegos Económicos ho explica bé. És pregunta típica de test.
- **Proposta**: clau: «Suele arrojar más parados que el paro registrado, porque cuenta a quien busca empleo aunque no esté inscrito, y sigue criterios de la OIT comparables internacionalmente»; fitxa: «habitualmente inferior (no siempre: en 2005-2007 fue superior)».
- **Confiança**: Alta.

#### OLI-D02 · Crític · Rigor i dades — Altres ítems del banc amb clau o explicació errònia (taxa d'error observada)
- **On**: `src/lib/olimpiada/banco.ts:395-396` (#46), `:205-208` (#23), `:783-786` (#93), `:58` (#5).
- **Evidència**: #46 «En el cálculo del PIB por el método del gasto, ¿cuál de las siguientes partidas se suma al PIB español?», amb clau «Lo que produce un inglés residente en España» i distractor «Las exportaciones netas de España»; #23 (motos i salaris dels mecànics) amb clau «Aumenta la cantidad, pero no sabemos qué pasará con el precio» i explicació «Los menores salarios de mecánicos bajan costes de reparación de coches, pudiendo desplazar la demanda de coches también a la derecha»; #93 «El precio del bono se calcula como cupón / tipo de mercado = 40 / 0,05 = 800 €»; #5 «La FPP tiene forma cóncava (curvada hacia el origen)».
- **Per què importa**: #46 té dues opcions correctes (en el mètode de la despesa, X − M se suma); a #23, si els dos efectes desplacen la demanda, pugen preu i quantitat (seria la d); la clau només és correcta si el salari és cost de producció; #93 només val per a un bo perpetu i s'ensenya com a fórmula general; #5 descriu una FPP convexa (el #6 diu bé «arqueada hacia fuera»). **Taxa observada en tot el banc (142/142 revisats, comptant el #54 d'OLI-D01): 4 ítems amb error substantiu en la clau o l'explicació (#54, #46, #23, #93 = 2,8 %) + 1 enunciat erroni (#5 = 0,7 %)**; menors: #43 ambigu (100.000 o 90.000 € «creados»; el #87 sí que aclarix «incluyendo el depósito inicial»), #60 «nunca antes» (excepció dels espectacles públics, ET art. 6.4), #128 «la negociación es costeable» (ha de dir «sin costes»).
- **Proposta**: #46 → canviar el distractor d per «Las importaciones de bienes intermedios» o reformular l'enunciat («¿cuál se incluye por el criterio territorial?»); #23 → «bajan los salarios de los operarios que fabrican coches» i explicació d'oferta cap a la dreta; #93 → «un bono perpetuo» o opcions amb rang (entre 800 i 1.000 €); #5 → «cóncava (arqueada hacia fuera)»; corregir els menors. Afegir un test de revisió de claus amb doble lector.
- **Confiança**: Alta.

#### OLI-D03 · Alt · Rigor i dades + Coherència — L'objectiu del BCE és el d'abans de 2021 i la política monetària s'atura el 2023
- **On**: `src/content/olimpiada/fichas/04-politica-economica.mdx:42`, `:64`, `:77` (i bessó CA `:48`).
- **Evidència**: «definida como una tasa de inflación próxima pero inferior al **2 % a medio plazo**»; «El BCE redujo los tipos al 0 % entre 2016 y 2022»; l'última dada és «subió los tipos del 0 % al 4,5 % entre julio de 2022 y septiembre de 2023».
- **Per què importa**: des de la revisió estratègica de 2021 (confirmada el 2025) l'objectiu és un 2 % simètric; el llibre d'Eco 1BACH ja ho diu bé (`eco-1bach/libro/10-sistema-financiero-dinero.mdx:270`). És pregunta de test clàssica. A més, la fitxa no esmenta les baixades de 2024-2025 (facilitat de dipòsit del 4 % al 2 % entre juny de 2024 i juny de 2025), necessàries per a comentar l'actualitat en 2027; i durant 2016-2022 el tipus de dipòsit, que la mateixa fitxa diu que és «el más relevante», era negatiu (−0,5 %), no 0 %.
- **Proposta**: «inflación del 2 % a medio plazo, objetivo simétrico (revisión estratégica de 2021)»; «MRO al 0 % y facilidad de depósito en negativo (hasta −0,5 %)»; afegir un paràgraf «2024-2025: bajadas hasta el 2 %» amb data de revisió.
- **Confiança**: Alta.

#### OLI-D04 · Alt · Disseny didàctic — La resposta correcta no és mai la «d»: el banc és endevinable
- **On**: `src/lib/olimpiada/banco.ts` (142 ítems); `src/components/QuizPlayer.tsx` i `src/components/olimpiada/BancoIsland.tsx` (no barregen opcions).
- **Evidència**: distribució de la clau: a = 12, **b = 74 (52 %)**, c = 56, **d = 0**; tots els ítems tenen 4 opcions.
- **Per què importa**: qui marque sempre «b» encerta la meitat, i qui descarte la «d» millora molt; amb la penalització de la Part I («tres incorrectas restan una correcta») això entrena una estratègia que l'examen real no premia, i falseja l'autoavaluació.
- **Proposta**: barrejar les opcions en temps d'execució al QuizPlayer (remapejant `correcta`), o reordenar el banc perquè cada posició ronde el 25 %; afegir un test que falle si alguna posició supera el 35 %.
- **Confiança**: Alta.

#### OLI-D05 · Alt · Alineació — El format d'una fase local es presenta com «l'examen», i el temari té buits
- **On**: `src/lib/olimpiada.ts:38`, `:255-262`; `src/pages/olimpiada/index.astro:19`, `:22`, `:37`, `:126-140`.
- **Evidència**: bloc «Cómo es el examen»: «2 horas», «Dieciséis preguntas tipo test […] tres incorrectas restan una correcta» sense dir que és el format de la fase de la Universitat d'Alacant (ho diu només `AMBITOS.cv`: «Es el formato que describe la guía»); «los 6 bloques del temario» (n'hi ha 12); «Nivel 2.º Bach y primer curso de carrera».
- **Per què importa**: un docent de Madrid, Andalusia o la fase nacional prepararia l'alumnat per a un format que no és el seu; «6 bloques» contradiu les 12 fitxes. A més, no hi ha fitxa ni preguntes de selecció d'inversions (VAN, TIR, termini de recuperació), productivitat o període mitjà de maduració, habituals en les proves d'Empresa.
- **Proposta**: titular «Cómo es el examen (fase local de la Universidad de Alicante)», afegir «Cada universidad fija su formato: consulta las bases de tu fase local» i una taula resum per àmbit; «12 bloques»; treure «primer curso de carrera»; afegir un bloc «Inversión y productividad» (fitxa + 10-12 preguntes) reutilitzant les calculadores VAN/TIR i Productividad.
- **Confiança**: Alta (incoherències); Mitjana (freqüència de VAN/TIR segons la fase).

#### OLI-D06 · Mitjà · Rigor i dades + Coherència — Card i Krueger: la pauta diu 1994 (la pujada va ser el 1992) i el monopsoni queda imprecís
- **On**: `src/content/olimpiada/textos/03-salario-minimo-empleo.mdx:66`, `:60`.
- **Evidència**: «Diseño: NJ sube el SMI en abril de 1994»; «el empleador ya no puede reducir el salario, así que contrata más hasta que el SMI iguale el VPMgL».
- **Per què importa**: la pujada de Nova Jersey va ser l'1 d'abril de 1992 (l'article és de 1994); l'ítem `eco-1207` de Juegos Económicos diu bé 1992, de manera que el web es contradiu. Amb un mínim entre el salari de monopsoni i el competitiu, l'ocupació la limita l'oferta de treball a eixe salari, no la igualtat SMI = VPMgL. A més, «SMI» és un terme espanyol aplicat a un salari mínim estatal dels EUA.
- **Proposta**: «NJ sube su salario mínimo el 1 de abril de 1992 (de 4,25 a 5,05 $)»; «contrata hasta donde la oferta de trabajo a ese salario lo permite, más que antes»; «salario mínimo estatal» en lloc de «SMI».
- **Confiança**: Alta.

#### OLI-D07 · Mitjà · Disseny didàctic — Simulacres sense solucionari (llevat de Madrid) i sense les convocatòries de 2026
- **On**: `src/lib/olimpiada.ts:58-92`; `public/olimpiada/`.
- **Evidència**: només els exàmens de Madrid porten «(con soluciones)»; els més recents de la Comunitat Valenciana i de la fase nacional són de 2025; els PDFs de tercers estan allotjats al web.
- **Per què importa**: entrenar «en condiciones reales» sense solució redueix molt el valor per a l'alumnat i obliga el docent a resoldre'ls; a l'inici del curs 2026-27 falten les convocatòries de 2026. Allotjar PDFs d'altres institucions sense citar-ne la llicència pot xocar amb les salvaguardes del projecte.
- **Proposta**: afegir pautes de resolució pròpies (almenys CV i nacional) com a fitxers derivats; incorporar 2026; enllaçar a la pàgina oficial de cada universitat i indicar la procedència.
- **Confiança**: Alta (solucionaris i 2026); Mitjana (drets d'allotjament).

#### OLI-D08 · Mitjà · Rigor i dades — Lectures: un recurs no verificable, comentaris inexactes i cap manual tècnic
- **On**: `src/lib/olimpiada.ts:248`, `:216-219`, `:205`, `:181`.
- **Evidència**: «Destripando la Economía (YouTube)»; «Principios» (Ray Dalio): «Ofrece una visión de la máquina económica desde dentro de un fondo global»; «El precio de la desigualdad» «con datos recientes»; Keynes: «la introducción y los capítulos sobre demanda agregada son asequibles para un buen alumno de Bachillerato».
- **Per què importa**: no he pogut verificar el canal (pot ser una confusió amb «Destripando la Historia»); *Principles* és sobretot un llibre de gestió personal i d'empresa; el llibre de Stiglitz és de 2012. La llista és de cultura econòmica, però l'Olimpíada demana tècnica (punt mort, comptabilitat, micro) i no hi ha cap manual.
- **Proposta**: verificar o treure el canal; corregir els comentaris; afegir un manual (p. ex. Mankiw, *Principios de economía*) i els llibres d'Eco 1BACH i EDMN del mateix web com a primera lectura.
- **Confiança**: Mitjana (el canal); Alta (la resta).

#### OLI-D09 · Mitjà · Rigor i dades — Textos de la Part III poc actuals per al curs 2026-27
- **On**: `src/content/olimpiada/textos/04-aranceles-guerra-comercial.mdx:4`, `:21`; `03-salario-minimo-empleo.mdx:4`.
- **Evidència**: «En la primavera de 2018, la administración estadounidense anunció aranceles…» (text datat el 2024); el text del salari mínim no dona cap dada d'Espanya.
- **Per què importa**: la Part III és de «texto de actualidad económica»; l'escalada aranzelària de 2025 i les pujades de l'SMI espanyol (2019-2026) són els temes que més probablement apareixeran, i l'alumnat necessita practicar amb dades del seu país.
- **Proposta**: afegir un paràgraf d'actualització a cada text (aranzels de 2025 i l'acord UE-EUA; SMI 2026 de 1.221 € en 14 pagues, amb font) o crear dos textos nous de 2025-2026; mostrar una data de revisió.
- **Confiança**: Alta.

### Patrons de la passada ràpida
- Les 12 fitxes segueixen la mateixa plantilla i tenen «preguntas típicas»; les de continguts d'actualitat (política econòmica, sistema financer) són les que envelleixen: cal data de revisió visible.
- El banc cobrix els 12 blocs de manera equilibrada (11-13 ítems per bloc) i està només en castellà també a `/ca/` (reconegut al codi).
- A banda de la taxa d'error d'OLI-D02, alguns enunciats fan servir dades fictícies amb dates reals (#77: IPC de 108 a 113,4 i «inflación del 5,0 %» el gener de 2024, quan la real va ser del 3,4 %): millor dates fictícies o dades reals.
- Bessons ES↔CA idèntics en fitxes i textos (16/16).

---

## Projectes interdisciplinaris (`/proyectos/`)

**Resum**. 18 projectes ABP ben plantejats (repte, producte final, «Qué aporta cada materia», fases per sessions i rúbrica) i amb qualitat de redacció alta; els números que he revisat són correctes i el projecte de justícia distributiva és un model d'equilibri. Els buits són d'alineació i de materials: cap projecte diu què treballa de l'altra matèria segons el seu currículum, i són guions sense textos, fonts de dades ni fitxes per a l'alumnat.

**Punts forts**
- Estructura completa en 18/18: repte, producte final, objectius, «Qué aporta cada materia», seqüència de 4-6 sessions i rúbrica de 4 criteris.
- «Justicia distributiva e impuestos» planteja Rawls i Nozick amb honestedat i diu explícitament que «ni Rawls ni Nozick ganan por decreto del aula».
- Càlculs verificats: interés compost (1.300 € simple; 1.343,92 € compost; 1,06^12 ≈ 2,01; 50 €/mes al 5 % durant 30 anys ≈ 41.613 €); equilibri de mercat (100 − 2P = −20 + 4P → P = 20, Q = 60).
- Productes finals variats i comunicables (museu del diner, simulador, podcast, dissertació).
- Bessons ES↔CA idèntics (18/18).

**Peces revisades a fons**: `src/content/proyectos/matematicas/02-interes-compuesto-poder-ahorro.mdx`, `historia/02-del-trueque-a-las-criptomonedas.mdx`, `filosofia/02-justicia-distributiva-impuestos.mdx` (+ `matematicas/03-punto-de-equilibrio-del-mercado.mdx` parcial); pàgina `src/pages/proyectos/[materia]/[slug].astro`; `src/lib/proyectos.ts`.

### Troballes

#### PRO-D01 · Alt · Alineació LOMLOE — Cap projecte diu què treballa de l'altra matèria segons el seu currículum
- **On**: frontmatter dels 18 projectes (`unidades_relacionadas` només d'economia; `competencias_especificas: []`); p. ex. `matematicas/02-interes-compuesto-poder-ahorro.mdx:8`, `:17-25`.
- **Evidència**: cap menció a competències o sabers de Matemàtiques, Història, Filosofia, Llengua, Geografia o Tecnologia (RD 217/2022 i RD 243/2022); el `nivel` inclou l'ESO en 14 projectes, 6 dels quals només tenen ponts a unitats de Batxillerat (p. ex. l'interés compost, amb ponts a Eco 1BACH U3 i U10); a l'inrevés, `filosofia/02` és `[bach]` amb pont a Taller 3r ESO U8.
- **Per què importa**: un projecte interdisciplinari es programa amb un altre departament; sense la seua competència i el seu curs, el company de Matemàtiques o Història no el pot justificar, i el docent d'ESO no sap on l'encaixa.
- **Proposta**: afegir un camp `materia_socia: { curso, competencias_especificas, saberes }` (p. ex. Matemàtiques 4t ESO: funcions exponencials i sentit numèric; Filosofia 1r Batx: bloc d'ètica i política), mostrar-lo a la pàgina i als filtres, i alinear `nivel` amb els ponts (afegir unitats d'Eco 4ESO/Taller o restringir a Batx).
- **Confiança**: Alta.

#### PRO-D02 · Mitjà · Disseny didàctic — Guions de 5-6 sessions sense materials per a l'alumnat
- **On**: pàgina `src/pages/proyectos/[materia]/[slug].astro` (sense bloc imprimible); `filosofia/02-justicia-distributiva-impuestos.mdx` (fase «Leer a Rawls y a Nozick»); rúbriques de 4 criteris sense descriptors.
- **Evidència**: «Cada equipo trabaja una selección de textos breves: Rawls sobre la posición original […], Nozick sobre la teoría de los títulos y el ejemplo de Wilt Chamberlain» (no es donen ni es referencien); els projectes de dades (IPC, recursos estratègics) no indiquen fonts (INE, Banco de España, Eurostat, IEA).
- **Per què importa**: a diferència de Debats i Dinàmiques, ací el docent ha de fabricar tot el material; en projectes llargs això és el que més temps costa.
- **Proposta**: afegir per projecte una fitxa d'equip imprimible, 2-3 fonts de dades amb enllaç institucional, fragments breus (o la referència exacta) dels textos clau, i descriptors de nivell a la rúbrica.
- **Confiança**: Alta.

#### PRO-D03 · Mitjà · Rigor i dades — «Del trueque a las criptomonedas» presenta la seqüència bescanvi → diner com a fet històric
- **On**: `historia/02-del-trueque-a-las-criptomonedas.mdx` (fase «El dinero antes del dinero» i «El producto final»).
- **Evidència**: «se discute por qué el trueque es incómodo (la doble coincidencia de necesidades)»; «cómo la humanidad pasó del trueque al dinero digital».
- **Per què importa**: l'antropologia econòmica (Humphrey, 1985; Graeber, 2011) no troba societats basades en el bescanvi abans del diner: van ser habituals el crèdit i els deutes. En un projecte amb Història, és un debat historiogràfic que el company de departament coneixerà.
- **Proposta**: afegir a la fase 1 o al debat final: «La doble coincidencia explica por qué el dinero es útil, pero los historiadores discuten que existiera una “economía del trueque” previa: ¿qué dicen las fuentes?».
- **Confiança**: Alta.

#### PRO-D04 · Mitjà · Rigor i dades — Interés compost sense inflació, risc ni comissions
- **On**: `matematicas/02-interes-compuesto-poder-ahorro.mdx:2`, `:66-70`.
- **Evidència**: «la magia del interés compuesto»; «Ahorrando 50 €/mes al 5% durante 30 años aportan 18 000 € y acumulan ≈ 41 613 €».
- **Per què importa**: un 5 % sostingut durant 30 anys no l'oferix un compte d'estalvi; implica actius amb risc. Sense la distinció nominal/real, l'alumnat sobreestima el poder de compra (amb un 2 % d'inflació, 41.613 € equivalen a ≈22.970 € d'avui).
- **Proposta**: afegir a la fase 5 un escenari «real» (rendibilitat − inflació) i un «con comisiones del 1 %», i una frase sobre risc i horitzó; coherent amb la unitat 3 d'Eco 1BACH.
- **Confiança**: Alta.

#### PRO-D05 · Baix · Rigor i dades — Una frase normativa presentada com a veritat econòmica
- **On**: `filosofia/02-justicia-distributiva-impuestos.mdx` (secció «Qué aporta cada materia», paràgraf d'Economia).
- **Evidència**: «el mercado, aun funcionando perfectamente, no produce un reparto justo —solo un reparto eficiente—».
- **Per què importa**: si el repartiment del mercat és just o no és justament el que discuteixen Rawls i Nozick; dit com a fet des d'Economia, inclina el projecte que després demana neutralitat.
- **Proposta**: «el mercado, aun funcionando perfectamente, no garantiza un reparto que la sociedad considere justo: eficiencia y equidad son criterios distintos».
- **Confiança**: Mitjana.

### Patrons de la passada ràpida
- Duracions de 4-6 sessions coherents amb les fases; agrupació en equips de 3-4 en quasi tots.
- Rúbrica sempre de 4 criteris i sense descriptors; mapatge competencial clau raonable (STEM, CCL, CD…) però sense competències específiques.
- Cap projecte inclou pautes DUA ni rols diferenciats per a alumnat amb NEE.
- Els projectes són rics en idees i pobres en dades: quan demanen investigar (recursos estratègics, crisis), no suggerixen fonts fiables.

---

## Jocs (`/juegos/` i `/jocs-economics/`)

**Resum**. Oferta àmplia i treballada tècnicament (simuladors, taulers, jocs de festa, sis experiments de teoria de jocs, banc de 180 preguntes amb 0 claus errònies). Però la lectura econòmica dels jocs té problemes greus: Econopoly ensenya el mite del «salt de tram» fiscal que el llibre d'Eco 4ESO desmunta; Stonks té dades errònies o incoherents i dona «lliçons» d'inversió sense matisos; Econrisk definix malament l'avantatge comparatiu. A «Juegos Económicos» es publiquen nom i institut de menors, el concurs s'anomena «Olimpiadas de Economía» (confusió amb l'oficial) i el banc està només en valencià a la pàgina en castellà.

**Punts forts**
- Varietat i qualitat tècnica: motors amb tests unitaris, mode projector, versions imprimibles per a Econopoly, Econrisk, Cajút i Insider.
- Teoria de jocs: sis experiments amb mode «solo» i «con la clase», notes «Para comentar en clase» i enllaç a la dinàmica en paper equivalent.
- Stonks usa sèries històriques reals en la major part (S&P 500 i IBEX 35 coincidixen amb els rendiments coneguts de 2000-2024; l'or també).
- Assegurats tanca amb una lliçó clara: «El seguro no sirve para ganar dinero: sirve para que un golpe de mala suerte no te arruine».
- Banc de Juegos Económicos: 180/180 claus correctes, explicacions riques i dades laborals actualitzades (p. ex. `fin-1100`: cotització del 6,5 % el 2026 amb el MEI; `eco-1016` desmunta el mite del salt de tram).

**Peces revisades a fons**: `src/lib/juegos.ts`; `src/components/games/GameShell.astro`; Stonks (`src/lib/games/stonks/data.ts`, `src/components/games/stonks/FinalScreen.tsx`); Econopoly (`src/lib/games/econopoly/constants.ts`, `engine.ts:357-385`); Econrisk (`src/lib/games/econrisk/factions.ts`, `events.ts`, `src/components/games/econrisk/EndScreen.tsx`); Assegurats (`src/lib/games/seguros/data.ts`, `engine.ts`, `DebriefScreen.tsx`); Teoria de jocs (`registry.ts`, `copy.ts`); `src/pages/jocs-economics/index.astro`, `src/components/jocs-economics/screens/Welcome.tsx`, `src/lib/jocs-economics/server/bank.ts`; banc `src/content/jocs-economics/preguntas/*.md` (180/180).

### Troballes

#### JOC-D01 · Crític · Rigor i dades + Coherència — Econopoly aplica el tipus del tram a tot el patrimoni: ensenya el mite del «salt de tram»
- **On**: `src/lib/games/econopoly/constants.ts:8-12`; `src/lib/games/econopoly/engine.ts:357-385` (`/juegos/econopoly/`); descripció a `src/lib/juegos.ts:97`.
- **Evidència**: `TAX_BRACKETS` 5 % (< 500), 10 % (< 1.000), 15 % (resta) i `const tax = Math.floor(nw * rate);` → un jugador amb 999 € paga 99 € (en queda amb 900) i un amb 1.000 € paga 150 € (en queda amb 850). El joc s'anuncia amb «fiscalidad progresiva».
- **Per què importa**: és exactament l'error que el llibre d'Eco 4ESO desmunta (`eco-4eso/libro/06-estado-impuestos-gasto-publico-desigualdad.mdx:212`: «Cada tipo se aplica solo a la parte de renta que cae dentro de su tramo […] Subir de tramo nunca hace que cobres menos») i el que l'ítem `eco-1016` de Juegos Económicos marca com a incorrecte. Un joc per a ESO/Batx el reforça amb l'experiència.
- **Proposta**: impost marginal per trams: 5 % dels primers 500 €, 10 % de 500 a 1.000 €, 15 % de la resta (1.000 € → 25 + 50 = 75 €); mostrar el desglossament al registre de partida; anomenar-lo «impuesto sobre el patrimonio» (grava patrimoni net, no renda). Afegir un test que garantisca que el patrimoni net després d'impostos és creixent.
- **Confiança**: Alta.

#### JOC-D02 · Alt · Rigor i dades — Stonks: dades errònies o incoherents i «lliçons» d'inversió sense matisos
- **On**: `src/lib/games/stonks/data.ts:59-60`, `:67` (sèrie `bonos`), `:92`; `src/components/games/stonks/FinalScreen.tsx:22-29`.
- **Evidència**: Bitcoin 2014 `-0.173` i 2015 `1.240`; `bonos` sempre positiu (2022: `0.025`); IBEX com a índex de preus i S&P 500 com a rendibilitat total en dòlars; notícia 2014: «primeras bajadas de tipos del BCE»; lliçons: «El interés compuesto es la fuerza más poderosa de las finanzas», «El 80% de los fondos activos no baten al índice a largo plazo».
- **Per què importa**: Bitcoin va caure ≈58 % el 2014 i va pujar ≈35 % el 2015 (el valor de 2015 duplica el de 2016); la sèrie de bons és de rendiments, no de rendibilitat, i ignora que el 2022 els bons van perdre fortament (contradiu el text de l'Olimpíada sobre SVB i l'ítem #89 del banc); barrejar un índex sense dividends en euros amb un de rendibilitat total en dòlars exagera la diferència IBEX-S&P; la IA inverteix en el mercat que millor ha anat, triat a posteriori (biaix retrospectiu). Les lliçons són consells sense «rentabilidades pasadas no garantizan…».
- **Proposta**: corregir Bitcoin 2014-2015; fer servir un índex de rendibilitat total de bons (amb 2022 negatiu) o anomenar-lo «Depósito a plazo»; IBEX amb dividends (IBEX 35 con dividendos) o S&P en euros; afegir una lliçó sobre biaix retrospectiu i un avís de rendibilitats passades; citar la font del «80 %» (SPIVA) o treure-la; corregir la notícia de 2014 («el BCE introduce tipos negativos»).
- **Confiança**: Alta (Bitcoin 2014, bons 2022, barreja d'índexs); Mitjana (valor exacte de Bitcoin 2015).

#### JOC-D03 · Alt · Rigor i dades — Econrisk: avantatge comparatiu mal definit, Keynes «demostra» i escoles caricaturitzades
- **On**: `src/components/games/econrisk/EndScreen.tsx:14`, `:20`; `src/lib/games/econrisk/factions.ts:7`; pont curricular a Eco 1BACH U1 (`src/lib/juegos.ts`).
- **Evidència**: «La economía neoclásica usa el concepto de ventaja comparativa: especializarse donde eres más eficiente maximiza el bienestar global.»; «El keynesianismo demuestra que la inversión pública puede estabilizar la economía en crisis»; Marxistes: «Conquistan automáticamente territorios enemigos defendidos por 1 unidad».
- **Per què importa**: «donde eres más eficiente» és la definició d'avantatge absolut (el web ho distingix bé a la dinàmica i al banc #95-#96) i Ricardo és un clàssic, no un neoclàssic; «demuestra» presenta una tesi discutida com a fet (a la resta d'escoles es diu «defiende/analiza»). Les mecàniques no ensenyen què defensa cada escola: el lligam amb «escuelas de pensamiento» és nominal.
- **Proposta**: «La ventaja comparativa (Ricardo, economía clásica): especializarse donde el coste de oportunidad es menor»; «El keynesianismo sostiene que…»; afegir a cada facció una targeta amb 3 idees clau i una pregunta de debrief («¿qué poder del juego representa bien la escuela y cuál la caricaturiza?»).
- **Confiança**: Alta.

#### JOC-D04 · Alt · Coherència — El concurs propi s'anomena «Olimpiadas de Economía»
- **On**: `src/pages/jocs-economics/index.astro:15`, `:20`, `:26`; `src/pages/juegos/index.astro:27-28`.
- **Evidència**: H1 «Las **Olimpiadas de Economía**.»; hub de jocs: «¿Buscas el concurso competitivo? Está en las Olimpiadas de Economía»; «Premios: reconocimiento al mejor alumno y al mejor instituto de cada edición»; «Participa, sube en la clasificación y lleva a tu centro a lo más alto.»
- **Per què importa**: l'Olimpíada d'Economia és el concurs oficial de les universitats, amb secció pròpia al web (`/olimpiada/`); l'alumnat i les famílies poden creure que el rànquing és l'oficial. Els «premios» d'unes «ediciones» que no es definixen són una promesa, contrària al to del projecte («Mai prometre, mai promocionar»).
- **Proposta**: usar sempre «Juegos Económicos» (H1 i enllaç del hub) i afegir una nota «No es la Olimpiada de Economía oficial; para prepararla, ve a /olimpiada/»; treure «Premios» fins que hi haja edicions i bases publicades.
- **Confiança**: Alta.

#### JOC-D05 · Alt · Disseny didàctic (seguretat i privacitat) — Nom i institut de menors en un rànquing públic
- **On**: `src/components/jocs-economics/screens/Welcome.tsx:58`, `:65`, `:84`; `src/pages/juegos/business-game/index.astro:24`.
- **Evidència**: camps «Tu nombre» i «Instituto o centro»; avís en lletra de 11 px: «Tu nombre e instituto aparecerán públicamente en el ranking.»; el Business Game reutilitza «nombre e instituto, como en «Juegos Económicos»».
- **Per què importa**: l'alumnat té 14-18 anys; publicar nom real + centre facilita identificar-lo i és una dada personal de menors (i el camp lliure permet noms ofensius visibles a tothom). El docent no rep cap orientació per a usar-lo a classe.
- **Proposta**: demanar un àlies (no el nom) amb validació i filtre de paraulotes; mostrar el centre només com a agregat; afegir una nota per al professorat («pedid que usen un alias; no pongáis nombres completos») i revisar `/legal/privacidad/`.
- **Confiança**: Alta.

#### JOC-D06 · Alt · Coherència + DUA — El banc de Juegos Económicos està 100 % en valencià a la pàgina en castellà
- **On**: `src/content/jocs-economics/preguntas/*.md` (180/180); `src/server-only/jocs-bank.json`; `Welcome.tsx:42`.
- **Evidència**: p. ex. `eco-1000`: «L'economia existix perquè hi ha un desajust de fons entre dues coses. Quines?»; títol «Jocs Econòmics» a la pantalla d'inici de `/jocs-economics/`, que és en castellà.
- **Per què importa**: el públic és tot l'Estat i el MVP publica en castellà (CLAUDE.md); per a alumnat fora de territoris de parla catalana és una barrera d'accés a un concurs amb rànquing, i posa en desigualtat els centres.
- **Proposta**: traduir el banc al castellà i servir-lo segons el locale (el valencià, a `/ca/jocs-economics/`); unificar el títol.
- **Confiança**: Alta.

#### JOC-D07 · Mitjà · Disseny didàctic + Rigor — Banc de Juegos Económicos: biaix de posició, fonts desquadrades i tres imprecisions (taxa d'error)
- **On**: `src/content/jocs-economics/preguntas/`; `src/lib/jocs-economics/server/bank.ts` (sense barreja d'opcions); `eco-1211-deute-comu-ue.md:11,16`; `fin-1017-trampa-revolving.md:10`; `fin-1301-qui-cotitza.md:11`; `fin-1106-nomina-de-vicent.md:13`.
- **Evidència**: clau en «a» en 78/180 ítems (esperat per atzar ≈48; en els de 4 opcions, 45 %); «la UE es va endeutar per primera vegada com a conjunt»; «pagant només el mínim, el saldo es duplica en uns tres anys»; «El treballador paga al voltant d'un 6,35 %» (però `fin-1100` diu «≈ 6,5 % en 2026, MEI inclòs»); `font: "eco-4eso U8 — Nòmina, IRPF i contractes"` (la nòmina és la U5 d'Eco 4ESO; la U8 és banca, crèdit i assegurances).
- **Per què importa**: **Taxa observada: 180/180 revisats; 0 claus incorrectes; 3 ítems (1,7 %) amb imprecisions factuals en l'enunciat o l'explicació.** La UE ja s'havia endeutat en comú (MEEF 2010-2014, SURE 2020); la normativa espanyola obliga que la quota mínima de les revolving amortitze capital; el 6,35 % és anterior al MEI. El biaix cap a «a» dona avantatge a qui endevina en un concurs amb rànquing.
- **Proposta**: barrejar opcions en servidor (remapant `correcta`); «per primera vegada a esta escala i per a finançar subvencions»; «si no pagues res, el deute es duplica en uns tres anys»; unificar al 6,5 %; corregir les `font` d'Eco 4ESO (U5 i U7/U8). Nota: `eco-1212` («superàvit per compte corrent des de 2012») és coherent amb el llibre, però convé verificar-ho (probablement 2013).
- **Confiança**: Alta.

#### JOC-D08 · Mitjà · Disseny didàctic — Els jocs no tenen guia docent: objectius, temps, agrupació i debrief
- **On**: `src/components/games/GameShell.astro:21-30` (secció «Para el profe»); Stonks, Econopoly i Econrisk.
- **Evidència**: «Para el profe» només mostra ponts, competències clau i l'enllaç a imprimir; no hi ha objectius d'aprenentatge, durada per a una sessió de 50-55 min, agrupació (Econopoly és «1-6 hot-seat» per a classes de 25-30) ni preguntes de debrief (Assegurats i Teoria de jocs sí que en tenen).
- **Per què importa**: sense debrief, un joc és entreteniment; justament els que tenen problemes de model (JOC-D01 a D03) són els que no tenen debrief que els corregisca.
- **Proposta**: afegir a `juegos.ts` els camps `objetivos`, `duracion_aula`, `agrupacion`, `debrief[]` i mostrar-los a «Para el profe»; per a Econopoly, proposta de gestió amb equips de 4-5 per jugador.
- **Confiança**: Alta.

#### JOC-D09 · Mitjà · Rigor i dades — Assegurats: les primes són més baixes que la pèrdua esperada
- **On**: `src/lib/games/seguros/data.ts:5-9`, `:15-23`; `src/components/games/seguros/DebriefScreen.tsx:23`.
- **Evidència**: «Premiums are calibrated so prima ≈ (peso/100) × dano (roughly fair)»; RC: prima 90 € enfront de 0,08 × 1.200 = 96 €; mòbil 30 enfront de 32; les cinc primes queden per davall (330 € enfront de 348 € per ronda).
- **Per què importa**: assegurar-ho tot té valor esperat positiu, i la lliçó real (pagues un recàrrec per sobre de la pèrdua esperada per eliminar risc; les franquícies) no apareix. El debrief diu «cuesta parecido», però el model premia assegurar-ho tot.
- **Proposta**: primes amb recàrrec del 20-30 % i una ronda amb franquícia; al debrief, calcular la pèrdua esperada d'un risc i comparar-la amb la prima (connecta amb `fin-1114`, «assegurar el gran, autoassegurar el xicotet»).
- **Confiança**: Alta.

#### JOC-D10 · Baix · Coherència — Errates i eslògans imprecisos
- **On**: `src/components/games/stonks/FinalScreen.tsx:13-18`, `:72`; `src/components/games/teoria-juegos/copy.ts` (taglines de «dilema» i «subastas»).
- **Evidència**: es renderitza «Has ganado al el Mercado» i, en la versió CA, «Has guanyat al el Mercat»; «IA «El Mercat»» a la interfície en castellà; «Traicionar siempre compensa»; «Distinta puja, misma recaudación».
- **Per què importa**: en el dilema repetit, trair sempre no compensa (és el que mostra el joc de rondes); l'equivalència d'ingressos només es complix en mitjana i sota supòsits.
- **Proposta**: «Has ganado al Mercado» / «Has guanyat el Mercat»; «IA «El Mercado»» en ES; «En una sola ronda, traicionar compensa»; «Distinta puja; en promedio, la misma recaudación».
- **Confiança**: Alta.

#### JOC-D11 · Baix · Disseny didàctic — Jocs amb mòbil sense avís de la normativa de cada centre
- **On**: `src/lib/juegos.ts` (`nota_aula` de Cajút i Insider).
- **Evidència**: «Los alumnos entran en /juegos/cajut/ con el código de sala desde su móvil.»
- **Per què importa**: diverses CCAA i molts centres restringixen el mòbil a l'ESO; el docent ha de saber que hi ha versió imprimible.
- **Proposta**: afegir a la `nota_aula`: «Si en tu centro no se usa el móvil, tienes la versión para imprimir» amb l'enllaç.
- **Confiança**: Alta.

### Patrons de la passada ràpida
- Els ponts curriculars dels jocs són pocs (1-2 per joc) i amb codis CE desplaçats (vegeu DIN-D05).
- Business Game està etiquetat com a prototip i és honest; hereta el problema de dades personals de JOC-D05.
- Banc de JE: 62/56/62 preguntes d'economia, finances i empresa; dificultats d'1 a 9; cap ítem porta els camps `revisat_per`/`revisat_at` que preveu l'esquema (no hi ha traça de la revisió manual que exigix CLAUDE.md per a «publicado»).
- Els jocs de Teoria de jocs són els millor resolts didàcticament (modes, notes de debrief, pont al paper): convé estendre el seu patró als altres.

---

## Eines docents i Generadors (`/herramientas/`, `/generadores/`)

**Resum**. Caixa d'eines molt àmplia (50 calculadores, simuladors i plantilles) i sis generadors per al professorat, amb lògica provada per tests i paràmetres de cotització de 2026 correctes. Però la calculadora de nòmina i el simulador de la declaració de l'IRPF, incrustats als llibres d'Eco 4ESO i IPE I, sobreestimen l'IRPF per a salaris baixos i mitjans (fins a 4-5 vegades a nivell de l'SMI). La calculadora de qualificacions proposa per defecte un model anterior a la LOMLOE, i les plantilles guarden dades d'alumnat sense avís. Els generadors LOMLOE principals (SA i programació) són externs i no s'han pogut auditar ací.

**Punts forts**
- Registre únic i ordenat per famílies (`src/lib/herramientas.ts`), amb ponts derivats dels recursos que incrusten cada eina i canònic cap al recurs de l'assignatura quan hi ha duplicat.
- Paràmetres de 2026 correctes a la nòmina (treballador 4,70 + 1,55/1,60 + 0,10 + MEI 0,15 = 6,50 %) i al cost de contractació (empresa 23,60 + 5,50/6,70 + 0,20 + 0,60 + MEI 0,75 %).
- Generador de rúbriques amb competència per criteri i exportació; plantilla DUA amb els tres principis (representació, acció i expressió, implicació).
- Transparència sobre l'emmagatzematge a la rúbrica: «Se guarda automáticamente en tu navegador».

**Peces revisades a fons**: `src/lib/calc/irpf.ts`, `nomina.ts`, `declaracion-irpf.ts`, `coste-contratacion.ts`, `forma-juridica.ts` (paràmetres); `src/components/calculadoras/CalculadoraNominaESO.tsx` (avís); `src/components/generadores/CalificacionesCalc.tsx`, `RegistroAula.tsx`, `MedidasDUA.tsx`, `RubricaGenerator.tsx`; `src/lib/generadores.ts`, `src/lib/herramientas.ts`; pàgines `src/pages/generadores/index.astro`, `src/pages/herramientas/[familia]/[slug].astro`.

### Troballes

#### EIN-D01 · Crític · Rigor i dades + Coherència — La calculadora de nòmina i el simulador de l'IRPF sobreestimen l'IRPF (fins a 4-5 vegades a nivell de l'SMI)
- **On**: `src/lib/calc/irpf.ts:89-100`, `:110-116`; `src/lib/calc/nomina.ts:104-110`; `src/lib/calc/declaracion-irpf.ts:13-23`; avís a `src/components/calculadoras/CalculadoraNominaESO.tsx:83-84`. Incrustades a `eco-4eso/libro/05-…:374`, `eco-4eso/libro/06-…:262` i `ipe1-fp/libro/06-contrato-derechos.mdx:241` (`/herramientas/finanzas-personales/nomina/`, `/irpf/`).
- **Evidència**: base = «gross − SS contributions» sense restar els 2.000 € d'«otros gastos deducibles»; reducció per rendiments del treball amb una sola pendent: `return Math.max(0, 7302 - 1.75 * (rendimientoNeto - 14852));` fins a 19.747,5 €; comentari i avís: «Usamos la escala estatal del IRPF», però l'escala aplicada és la general completa (19, 24, 30, 37, 45, 47 %). Resultats que he reproduït amb el codi: SMI 2026 (17.094 €) → **971 €** d'IRPF (≈215 € amb el càlcul legal abans de la deducció específica per a perceptors de l'SMI, i 0 € amb ella); 18.000 € → 1.440 € (≈376 €); 20.000 € → 2.675 € (≈1.355 €).
- **Per què importa**: l'alumnat usa l'eina per entendre la seua primera nòmina i conclouria que amb l'SMI es paga IRPF i que un sou de 20.000 € en perd el 13 % (és prop del 7 %). A més, el llibre d'Eco 4ESO dona xifres diferents per al mateix cas (exercici 6.1), i el simulador de la declaració diu calcular «the real annual IRPF quota» i barreja rendiments de l'estalvi a la base general.
- **Proposta**: (1) restar 2.000 € del rendiment net; (2) reducció en dos trams: 7.302 − 1,75 × (RN − 14.852) fins a 17.673,52 € i 2.364,34 − 1,14 × (RN − 17.673,52) fins a 19.747,5 €; (3) etiquetar l'escala com a «escala general (estatal + autonómica tipo)»; (4) modelar la deducció per a perceptors de l'SMI o avisar-ne; (5) base de l'estalvi separada (19-30 %); (6) tests amb casos de referència (SMI 2026 ≈ 0 €; 20.000 € ≈ 1.355 €) i alinear l'exercici 6.1 del llibre.
- **Confiança**: Alta (2.000 €, pendent i etiqueta de l'escala); Mitjana (detall de la deducció de l'SMI el 2026).

#### EIN-D02 · Mitjà · Alineació LOMLOE — La calculadora de qualificacions proposa per defecte «Examen 50 / Trabajo 30 / Actitud 20»
- **On**: `src/components/generadores/CalificacionesCalc.tsx:18`, `:83-85`; descripció a `src/lib/generadores.ts` («Media ponderada de instrumentos o competencias»).
- **Evidència**: `filasDefault: ['Examen', 'Trabajo', 'Actitud']` amb pesos 50, 30 i 20.
- **Per què importa**: amb la LOMLOE la qualificació s'ha de referir als criteris d'avaluació de les competències específiques; qualificar l'«actitud» com a instrument amb un 20 % és el model anterior, i una eina «LOMLOE» que el proposa per defecte el normalitza. El mateix web té, per a cada assignatura, una pàgina d'avaluació per competències.
- **Proposta**: per defecte, files per competència específica (p. ex. «CE1 · 20 %», «CE2 · 25 %», …) amb un selector «por instrumentos / por competencias»; treure «Actitud» del valor per defecte i afegir una nota sobre l'avaluació criterial.
- **Confiança**: Alta.

#### EIN-D03 · Mitjà · Disseny didàctic (privacitat) — Les plantilles guarden dades d'alumnat sense cap avís
- **On**: `src/components/generadores/RegistroAula.tsx:28-32`, `:101`; `MedidasDUA.tsx:110`; `PlanRefuerzo.tsx:112` (`usePersistentState` a `localStorage`).
- **Evidència**: camps «Nombre», «Actitud 1–5», «Observaciones» per alumne; la plantilla DUA recull barreres i ajustos d'un alumne concret (sovint vinculats a diagnòstics).
- **Per què importa**: són dades personals de menors (algunes de salut); es queden al navegador, cosa que està bé, però en ordinadors compartits (sala del professorat, aula) les pot veure qualsevol, i el docent no ho sap.
- **Proposta**: avís visible a les tres plantilles: «Los datos se guardan solo en este navegador; usa iniciales o un código, no nombres completos ni diagnósticos; borra al terminar en equipos compartidos», amb un botó «Borrar datos».
- **Confiança**: Alta.

#### EIN-D04 · Baix · Coherència (to) — La portada dels generadors parla en primera persona del singular
- **On**: `src/pages/generadores/index.astro:44` (i CA `:56`).
- **Evidència**: «Lo que uso para preparar las clases: los generadores LOMLOE de mi proyecto hermano…»
- **Per què importa**: CLAUDE.md demana plural i to no personal.
- **Proposta**: «Lo que usamos para preparar las clases: los generadores LOMLOE de nuestro proyecto hermano, oposicioneseconomia.es, y…».
- **Confiança**: Alta.

### Patrons de la passada ràpida
- `competencias_especificas` buit en 50/50 eines; els ponts es deriven dels recursos (bé), però sense competència específica.
- Els dos generadors LOMLOE que més valor curricular tenen (Situacions d'Aprenentatge i Programació) viuen a oposicioneseconomia.es: fora de l'abast d'esta auditoria; convé auditar-los a banda perquè la pàgina els presenta com a eines del web.
- Les calculadores tenen avís d'«orientativa», però en el cas de l'IRPF l'avís descriu una simplificació (escala estatal) que no és la que s'aplica (EIN-D01).
- La família «orientacion-fp» conté eines que no són de FP (p. ex. «Las tres tasas de la EPA», «Matriz de decisión»): ajustar la família o el nom.

---

## Top 5 del grup

1. **EIN-D01** — Corregir la calculadora de nòmina i el simulador de l'IRPF (2.000 € de gastos deducibles, reducció en dos trams, etiqueta de l'escala, cas de l'SMI): ara diuen que amb l'SMI de 2026 es paguen 971 € d'IRPF, i són als llibres d'Eco 4ESO i IPE I.
2. **DIN-D01, DIN-D02, DIN-D03, DIN-D04** — Refer les claus numèriques de quatre dinàmiques insígnia (excedent 32 €, no 24 €; òptim del monopolista i referent competitiu; valor afegit total 25 €; autarquia del País A), a ES i CA.
3. **JOC-D01** — Canviar l'impost d'Econopoly a trams marginals: el joc ensenya el mite del «salt de tram» que el llibre d'Eco 4ESO i el banc de Juegos Económicos desmunten.
4. **OLI-D01, OLI-D02, OLI-D04** — Corregir les claus del banc de l'Olimpíada (EPA/atur registrat, PIB per la despesa, #23, #93, #5) i barrejar les opcions: la correcta no és mai la «d» i és la «b» en el 52 % dels casos.
5. **JOC-D05** — Deixar de publicar nom i institut de menors al rànquing de Juegos Económicos (i del Business Game): àlies obligatori, filtre de noms i nota per al professorat.
