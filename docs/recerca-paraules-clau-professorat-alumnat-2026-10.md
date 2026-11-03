# Recerca de paraules clau: professorat i alumnat d'Economia

*Data: 27/10/2026. Web analitzat: www.profedeeconomia.es. Informe germà per a opositors: `oposicioneseconomia/docs/recerca-paraules-clau-opositors-2026-10.md`. Complementa `docs/seo-estrategia-2026.md`, que recull el que ja s'ha fet.*

Objectiu: saber què busquen professorat i alumnat d'Economia d'ESO, Batxillerat i FP i on encara no responem. Aquest document no crea pàgines; només prioritza.

## Fonts i limitacions

| Codi | Font | Què dona |
|---|---|---|
| **GSC** | Google Search Console, `sc-domain:profedeeconomia.es`, web, **27/04/2026–25/10/2026**, llegit el 27/10/2026 | Impressions (impr.) i posició mitjana reals. Totals: 10,8 mil clics i 148 mil impr. Les 898 consultes visibles sumen 50.646 impr.; la resta són consultes anonimitzades per Google. |
| **AC** | Google Autocomplete (`hl=es`, `gl=es`), 27/10/2026, sembres + «alphabet soup» | Existència de la cerca, **sense volum**. Dades crues fora del repo (scratchpad de la sessió). |
| **WS** | Cerques web (WebSearch) del 27/10/2026 | Qui ocupa la SERP. |

Limitacions: no hi ha eina de volum, així que fora de GSC tot és «sense dada» de volum. «People also ask» i fòrums: **sense dada**.

### Demanda per clúster (GSC, consultes visibles)

| Clúster | Consultes | Impr. | Clics |
|---|---|---|---|
| IPE I/II (FP) | 316 | 28.046 | 2.067 |
| FOPP 4t ESO | 63 | 11.100 | 732 |
| Economia i Emprenedoria 4t ESO | 65 | 6.725 | 609 |
| Marca («profe de economía») | 2 | 636 | 507 |
| Exercicis resolts | 15 | 414 | 1 |
| EDMN 2n BACH | 7 | 346 | 9 |
| Taller d'Economia 3r ESO | 12 | 209 | 22 |
| Economia 1r BACH | 14 | 106 | 14 |
| EEAE | 1 | 98 | 0 |
| Oposicions | 9 | 48 | 6 |
| SdA / programació | 2 | 39 | 5 |
| Jocs | 6 | 23 | 0 |
| PAU / EBAU / selectivitat | 0 | 0 | 0 |

Classificació per expressions regulars sobre el text de la consulta; una consulta pot caure en més d'un clúster.

## Taula d'anàlisi de buits

Prioritat: **A** = fer primer, **B** = després, **C** = vigilar o no fer.

| Paraula clau o grup | Intenció | Volum o senyal de demanda (font) | La cobrim? URL | Tipus de pàgina recomanada | Prioritat |
|---|---|---|---|---|---|
| «examen pau empresa [CCAA] 2026», «examen pau empresa y diseño de modelos de negocio 2026», «ebau empresa murcia», «selectividad economía de la empresa», «examen pau funcionament de l'empresa» | Informativa + descàrrega (alumnat de 2n) | AC: suggeriments per a Andalucía, Madrid, C. Valenciana, Castilla y León, Catalunya, Canarias, Galicia, Extremadura i Murcia. GSC: **0 impr.** en tot el clúster PAU | Parcial: `/edmn-2bach/ebau/examenes/` (una pàgina amb totes les CCAA) i `/edmn-2bach/ebau/` | Una pàgina per CCAA (`/edmn-2bach/ebau/examenes/[ccaa]/`) amb els exàmens oficials i el model de prova, començant per Andalucía, Madrid i C. Valenciana | **A** |
| «economía de la empresa 2 bachillerato (ejercicios resueltos pdf)», «empresa y diseño de modelos de negocio (2 bachillerato / apuntes / pau)», «edmn» | Navegacional/informativa | GSC: «libro empresa y diseño de modelos de negocio 2 bachillerato» 192 impr. pos. 7,9 · «edmn» 111 pos. 3,2 · «empresa y diseño de modelos de negocio 2 bachillerato» 17 pos. 28,5 i 10 pos. 25,4. AC: el nom antic «economía de la empresa» encara apareix | Sí: `/edmn-2bach/` | Afegir «Economía de la Empresa» al title i la descripció del hub i d'`/edmn-2bach/ebau/` | **A** |
| «ratio calidad de la deuda» | Informativa (alumnat) | GSC: 347 impr. pos. 47,3 | **No**: el terme no apareix a cap MDX | Afegir el ratio a `/edmn-2bach/ebau/ratios-fondo-maniobra-ejercicios-resueltos/` (fórmula + exemple) | **A** |
| «ejercicios punto muerto (resueltos pdf / selectividad andalucia / 4 eso / 1 bachillerato)», «punto muerto economia», «punt mort» | Informativa + pràctica | GSC: «punto muerto economia» 24 impr. pos. 33,8 · «punt mort» 36 pos. 10,2. AC: variants *pdf*, *selectividad andalucia*, *4 eso*, *1 bachillerato*, *econosublime* | Sí: `/edmn-2bach/ebau/punto-muerto-ejercicios-resueltos/` (publicada el 22–27/10) | Esperar el checkpoint del 26/11/2026; després, versió PDF i enllaç des d'Eco 4t ESO i 1r BACH | **B** |
| «ejercicios van tir y payback resueltos (excel / evau madrid)», «ratios financieros ejercicios resueltos pdf», «ejercicios productividad (2 bachillerato / selectividad andalucia)» | Informativa + pràctica | AC: totes aquestes cadenes existeixen; Econosublime surt a totes les famílies. GSC: clúster exercicis 414 impr., 1 clic | Sí: famílies `/edmn-2bach/ebau/[slug]/` | Mantindre; afegir «PDF» i «selectividad/PAU» als titles després del checkpoint | **B** |
| «economía 1 bachillerato (pdf / apuntes / temario / ejercicios resueltos pdf)», «libro economía 1 bachillerato pdf gratis», «ejercicios resueltos economia 1 bachillerato oferta y demanda» | Informativa + descàrrega | GSC: clúster Eco 1r BACH només 106 impr.; «libro economía 1 bachillerato pdf gratis» 7 impr. pos. 6,3. AC: les sis variants existeixen | Sí: `/eco-1bach/` i `/eco-1bach/libro/` | Revisar indexació i titles del hub i del llibre («apuntes», «PDF»); és l'assignatura del MVP amb menys visibilitat | **A** |
| «libro (de) economia 4 eso», «economia 4 eso (temario / diapositivas / examen tipo test / criterios de evaluacion / competencias especificas)», «ejercicios beneficio economía 4 eso», «problemas de costes economia 4 eso» | Informativa + descàrrega | GSC: «economia y emprendimiento 4 eso» 1.150 impr. pos. 5,1 · «libro economia 4 eso» 527 pos. 10,0 · «libro de economia 4 eso» 237 pos. 9,7 · «economia 4 eso» 282 pos. 8,1 · «economia 4 eso temario» 8 pos. 14,9. AC: totes les variants | Sí: `/eco-4eso/` + `libro/`, `diapositivas/`, `tests/`, `programacion/` | Pujar «libro economía 4 ESO» a la primera posició amb el title del llibre; enllaçar tests i diapositives des del hub | **B** |
| «fop asignatura», «que es fop asignatura», «foop asignatura», «asignatura fol 4 eso», «que se da en fopp 4 eso», «examen / test fopp 4 eso», «programacion fopp 4 eso» | Informativa (què és l'assignatura) | GSC: 554 impr. pos. 7,6 · 121 pos. 7,8 · 185 pos. 3,0 · 134 pos. 4,3 · «programacion fopp 4 eso» 25 pos. 3,4. AC: «que se da», «examen», «test» | Sí: `/fopp-4eso/` amb FAQ (§5.4) | Mantindre; afegir «examen/test» al title de `/fopp-4eso/tests/` | **C** |
| «itinerario personal para la empleabilidad i/ii pdf (gratis)», «ipe ii [editorial] pdf», «tu libro de fp ipe pdf gratis» | Descàrrega del llibre d'una editorial | GSC: és el clúster més gran (28.046 impr., 2.067 clics, posicions 4–8) | Sí: `/ipe1-fp/`, `/ipe2-fp/` (llibre propi) | No apuntar a noms d'editorial (igual que amb Econosublime); mantindre el «PDF gratis» propi | **C** |
| «situaciones de aprendizaje economía 1 bachillerato lomloe», «situaciones de aprendizaje economia y emprendimiento 4 eso», «programacion didactica economia (1 bachillerato / madrid / 4 eso lomloe)» | Informativa (professorat) | AC: les cadenes existeixen. GSC: clúster 39 impr. WS: SERP amb programacions de centre i TFM | Sí: `/eco-1bach/situaciones/`, `/eco-4eso/situaciones/`, `/[asignatura]/programacion/` | Titles amb «LOMLOE» i el curs; no fan falta pàgines noves | **B** |
| «plan de empresa bachillerato» | Informativa + pràctica | GSC: 31 impr. pos. 44,0 | Sí: `/edmn-2bach/proyecto/` i `/emprendimiento/proyecto/` | Posar «plan de empresa» al title de `/edmn-2bach/proyecto/` | **B** |
| «profesor de economia», «profesora de economia» | Mixta (opositors / navegacional) | GSC: 66 impr. pos. 18,9 · 47 pos. 3,7 | Parcial (la marca); l'opositor va a oposicioneseconomia.es | Enllaç visible a oposicioneseconomia.es des de `/sobre/` o el peu; no fer pàgina | **C** |
| «agentes economicos», «cuales son los 3 agentes economicos», «esquema (del) flujo circular de la renta», «como funciona el flujo circular», «frontera de possibilitats de producció», «escassetat economica» | Definicional | GSC: 347 impr. pos. 7,6 · 150 pos. 9,1 · 46 pos. 6,0 · 49 pos. 10,8 · 43 pos. 5,7 · 61 pos. 7,6 · 103 pos. 6,5; quasi 0 clics | Sí: `/taller-eco-3eso/libro/02-agentes-flujo-circular/` i unitats d'1r BACH | Cap acció (decisió ja presa a `seo-estrategia-2026.md`: no optimitzar definicions) | **C** |
| «autoconeixement», «emprenedoria» | Informativa (valencià) | GSC: 245 impr. pos. 41,5 · 63 pos. 33,4 | Sí, a `/ca/` | Esperar que les URL `/ca/` passen de «Descubierta, sin indexar» a indexades | **C** |
| «juegos de economía para clase», «juegos para clase de economia» | Informativa (professorat) | AC: només 2 suggeriments. GSC: clúster jocs 23 impr. | Sí: `/juegos/`, `/dinamicas/` | Cap acció | **C** |

## Recomanacions prioritzades

1. **(A) Exàmens de PAU d'Empresa per CCAA.** Autocomplete mostra cerques per a 9 CCAA i GSC no registra ni una impressió del clúster: hui no hi som. Tenim una sola pàgina amb tots els exàmens. Una pàgina per CCAA, a temps per a la campanya de maig–juny de 2027, és el buit més clar.
2. **(A) Afegir el ratio de calidad de la deuda a la família de ratios.** Són 347 impr. a la posició 47 i el terme no apareix enlloc del web. És un canvi xicotet en una pàgina que ja existeix.
3. **(A) Recuperar el nom «Economía de la Empresa» a EDMN.** Autocomplete encara el fa servir i les consultes amb el nom LOMLOE complet estan a la posició 25–28. Cal afegir-lo al title i la descripció del hub i d'EBAU.
4. **(A) Diagnosticar Eco 1r BACH.** Té 106 impr. en 6 mesos, molt per davall de les altres assignatures del MVP, tot i que Autocomplete confirma cerques de «PDF», «apuntes», «temario» i «ejercicios resueltos». Primer cal mirar la indexació a GSC i després els titles.
5. **(B) Fer pujar «libro economía 4 ESO».** Són 527 + 237 impr. a la posició 10. El clúster ja converteix bé; és qüestió de title i d'enllaços interns.
6. **(B) Revisar les famílies d'exercicis resolts al checkpoint del 26/11/2026.** Després, afegir «PDF» i «selectividad/PAU» als titles i enllaçar punt mort i costos des d'Eco 4t ESO i 1r BACH, que també tenen cerques pròpies.
7. **(B) Titles de SdA i programació amb «LOMLOE» i el curs.** La demanda és baixa però és exactament el nostre públic professor.
8. **(B) «plan de empresa bachillerato» al title de `/edmn-2bach/proyecto/`.** Hi ha 31 impr. a la posició 44.
9. **(C) No fer pàgines per a definicions, noms d'editorial d'IPE ni jocs.** La demanda és definicional, és d'un producte d'una altra editorial o és molt baixa.
10. **(C) Derivar «profesor de economía» a oposicioneseconomia.es** amb un enllaç visible; el redirect de `/oposiciones` ja existeix.

## Com mesurar

Repetir la lectura de GSC el 27/01/2027 amb el mateix rang de 6 mesos i comparar impressions i posició de cada fila de la taula. Per al clúster PAU, la mesura bona és maig–juny de 2027.
