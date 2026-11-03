# Auditoria de codi — Lògica interactiva (calculadores, simuladors, jocs, generadors)

> Annex de l'[auditoria de programació i bugs](./README.md) · setembre de 2026 · revisió de només lectura sobre `main` (`876e002`).

**Resum**
La lògica està ben separada en mòduls purs amb tests i els tipus de cotització 2026 són correctes, però hi ha dos errors crítics que arriben a l'alumnat. D'una banda, les preguntes numèriques dels tests i dels reptes no deixen escriure decimals ni negatius: «12,5» es converteix en «125» (verificat en Chromium). D'una altra, l'IRPF de la nòmina, de la declaració i del cost de contractació ix sistemàticament alt: falten els 2.000 € d'«altres despeses» i el segon tram de la reducció per rendiments del treball, i això suma uns +600 €/any en sous de 24.000–30.000 €. A més, els tests es poden aprovar sense llegir (el 70 % de les respostes correctes és la B i les opcions no es barregen), els camps numèrics perden el «−» mentre s'escriu, les plantilles desades semblen buides en recarregar i hi ha errors de lògica o de missatge a l'eina Cotxe, al Business Game i en l'etiqueta «escala estatal». En total, 20 troballes: 2 crítiques, 8 altes, 7 mitjanes i 3 baixes.

**Punts forts**
- La lògica pura està en mòduls separats amb tests (`src/lib/calc`, `src/lib/games`), i els motors de joc (Stonks, Econopoly, EconRisk, Seguros, teoria de jocs) accepten un RNG injectable, de manera que les partides es poden reproduir en els tests.
- Els paràmetres laborals de 2026 estan bé: contingències comunes 4,70/23,60 %, atur 1,55/5,50 % (indefinit) i 1,60/6,70 % (temporal), FP 0,10/0,60 %, FOGASA 0,20 % i MEI 0,15/0,75 % (0,90 % en total). També són correctes els mínims personals i familiars (5.550; 2.400/2.700/4.000/4.500; 3.000/12.000) i els llindars 14.852/7.302 de la reducció. L'AT/EP és una entrada de l'usuari, amb una justificació raonada. Les tres eines fiscals indiquen «Datos 2026».
- La validació és defensiva a tot arreu (`valido: false`, `Number.isFinite`), i `formatEUR`/`formatPercent` tornen «—» per a valors no finits. El DCF rebutja g ≥ WACC. `compra-inteligente` calcula la TAE com la TIR mensual capitalitzada, (1+i)^12 − 1.
- L'economia està ben modelada: l'elasticitat es calcula pel mètode del punt mitjà (coherent amb l'efecte sobre l'ingrés total), l'OA-DA desplaça les corbes en la direcció correcta i s'autocorregeix a llarg termini, el càlcul de Pigou/externalitats és exacte, la tresoreria separa benefici i caixa, i el multiplicador bancari té en compte la filtració.
- `UnitNotes` i `src/lib/storage.ts` segueixen un bon patró SSR-safe (closca inert fins a hidratar i `try/catch`). Els timers i els listeners es netegen (driver d'IA d'Econopoly/EconRisk, Cajút, Insider).
- Hi ha una bona base d'accessibilitat: el `Timeline` té navegació amb fletxes i `aria-expanded`, els sliders de teoria de jocs tenen `<label for>`, el QuizPlayer usa `aria-pressed` i Calificaciones posa `aria-label` a cada fila.

## Troballes

#### CODE-INT-01 · Crític · correcció — Les preguntes numèriques dels tests i dels reptes no admeten decimals ni negatius escrits a mà
- **On**: `src/components/QuizPlayer.tsx:342-351`; `src/components/retos/RetoPlayer.tsx:285-288` (el banc de l'Olimpíada també usa QuizPlayer)
- **Problema**: el camp és de text i controlat (`value={numComma(respuestaActual)}`), i cada tecla el converteix amb `Number`. L'estat intermedi «12,» es converteix en 12 i, en tornar a pintar, el camp mostra «12»: la coma desapareix. «-» dona `NaN` i el camp es buida; «0,0» dona 0 i el camp mostra «0».
- **Escenari de fallada**: reproduït en Chromium headless amb el component real.
  - Teclejar `1`, `2`, `,`, `5` fa que el camp mostre «1», «12», «12» i «125». La resposta es corregeix com 125 i apareix «Incorrecto. Respuesta correcta: 12,5».
  - «-3» queda en «3» i «0,05» queda en «5». Qui ho ha fet bé acaba amb una nota de 0,00/10.
  - Abast: 30 de les 164 preguntes numèriques dels tests (ES+CA) tenen resposta decimal. Per exemple, `eco-1bach/tests/05`: «elasticidad… (2 decimales)», resposta 1,5. Als reptes, 58 dels 410 ítems numèrics tenen resposta decimal i 4 la tenen negativa.
- **Evidència**:
  ```tsx
  value={typeof respuestaActual === 'number' && !Number.isNaN(respuestaActual) ? numComma(respuestaActual) : ''}
  onInput={(e) => { const raw = (e.currentTarget.value || '').replace(',', '.').trim();
    setRespuesta(raw === '' ? null : Number(raw)); }}
  ```
- **Proposta**: guardar el text cru a l'estat (`textoRespuesta[idx]: string`) i convertir-lo a número només a `respondida`, `esCorrecta` i `confirmar`, acceptant tant «,» com «.». `parseESNumber` no serveix tal com està, perquè «1.5» dona 15. Cal afegir un test de component que tecleje «12,5», «-3» i «0,05».
- **Confiança**: Alta

#### CODE-INT-02 · Crític · correcció — L'IRPF ix massa alt en la nòmina, la declaració i el cost de contractació
- **On**: `src/lib/calc/nomina.ts:103-111`; `src/lib/calc/declaracion-irpf.ts:104-118`; `src/lib/calc/irpf.ts:109-116, 160-166`. Per herència també `coste-contratacion.ts:125` (líquid i falca fiscal).
- **Problema**: hi ha dos errors.
  - (a) La base de l'IRPF és brut − cotitzacions, però no resta els 2.000 € anuals d'«otros gastos deducibles» (art. 19.2.f de la Llei 35/2006), als quals té dret tot treballador.
  - (b) La reducció per rendiments del treball (art. 20, redacció del RDL 4/2024) té dos trams de reducció progressiva:
    - un pendent de −1,75 fins a 17.673,52 €;
    - després, 2.364,34 − 1,14 × (RN − 17.673,52) fins a 19.747,5 €.

    El codi només aplica el pendent 1,75, que arriba a zero a 19.024,57 €. Això contradiu el seu propi comentari («phasing out linearly up to 19.747,5»).
- **Escenari de fallada**: la columna «correcta» aplica l'art. 19.2.f i l'art. 20 amb la mateixa escala i els mateixos mínims que l'eina, i s'ha executat amb els mòduls reals.

  | Cas | IRPF de l'eina | IRPF correcte | Diferència | Líquid mensual (eina → correcte) |
  |---|---|---|---|---|
  | SMI 2026 (1.221 € × 14 = 17.094 €) | 970,89 € | 590,89 € | +380 € | 1.072,29 € → 1.099,43 € |
  | Preset «Auxiliar» (1.500 € × 14) | 3.035,40 € | 2.524,62 € | +510,78 € | 1.185,69 € → 1.222,17 € |
  | 24.000 € | 3.843,00 € | 3.243,00 € | +600 € | — |
  | Preset «Programador» (2.500 € × 12) | 5.526,00 € | 4.926,00 € | +600 € | 1.877,00 € → 1.927,00 € |
  | 40.000 € | 8.485,00 € | 7.745,00 € | +740 € | — |

  - Amb un RN de 18.500 €, la reducció de l'eina és de 918 € i la correcta, de 1.422,15 €. Amb un RN de 19.500 €, l'eina dona 0 € i la correcta, 282,15 €.
  - En el cas de «Lucía» del llibre (eco-4eso U6, 20.000 € bruts), el simulador de la declaració dona 2.674,68 €. El llibre (línia 252) diu que, amb els 2.000 € i la reducció, la quota queda «alrededor de 2.200 €», una xifra que ix d'aplicar els 2.000 € amb la reducció d'un sol tram. Amb els dos trams, la quota correcta és 2.044,40 €.
- **Evidència**:
  ```ts
  const baseIRPF = Math.max(0, bruto - totalCotizaciones);
  const irpf = calcularIRPF(baseIRPF, { …, rendimientoNetoTrabajo: baseIRPF });
  // irpf.ts
  if (rendimientoNeto <= 19747.5) return Math.max(0, 7302 - 1.75 * (rendimientoNeto - 14852));
  ```
- **Proposta**:
  ```ts
  if (rn <= 14852) return 7302;
  if (rn <= 17673.52) return 7302 - 1.75 * (rn - 14852);
  if (rn <= 19747.5) return 2364.34 - 1.14 * (rn - 17673.52);
  return 0;
  ```
  - A `calcularIRPF`, restar a més `Math.min(2000, rendimientoNeto)` d'altres despeses. La reducció es calcula sobre el rendiment net previ (íntegres − SS).
  - Mostrar les files «Otros gastos (2.000 €)» i «Reducción por rendimientos del trabajo» a les taules de la nòmina i de la declaració, perquè ara no quadren amb la quota.
  - Afegir tests amb valors de referència (p. ex. 24.000 € → 3.243,00 € amb aquesta escala).
  - Des de 2025 existeix una deducció específica perquè l'SMI no tribute (confiança mitjana). Cal verificar-ne l'import vigent el 2026 abans de modelar-la.
- **Confiança**: Alta

#### CODE-INT-03 · Alt · correcció — Els tests d'autoavaluació es poden aprovar sense llegir: les opcions no es barregen i la correcta és quasi sempre la B
- **On**: `src/components/QuizPlayer.tsx:302-317`; RetoPlayer i el banc de l'Olimpíada; contingut de `src/content/asignaturas/*/tests/*.md`
- **Problema**: el QuizPlayer pinta `pregunta.opciones` en l'ordre del fitxer i compara la resposta amb `correcta`, sense barrejar res. El RetoPlayer només barreja els ítems «ordenar». A més, el contingut està molt esbiaixat.
- **Escenari de fallada**:
  - Els 90 tests en castellà tenen 791 preguntes d'opció múltiple, totes amb 4 opcions. La correcta és la B en 554 casos (70,0 %), la C en 169, l'A en 49 i la D en 19. A més, és l'opció més llarga en el 83 % de les preguntes.
  - En les de vertader/fals, 100 de 126 són «Falso».
  - Contestant sempre «B» i «Falso» s'obté «Apto» (≥ 5) en 63 dels 90 tests, amb una mediana de 5,83/10 i un màxim de 9,23.
  - Als reptes, 316 de 378 respostes correctes (84 %) són la B. Al banc de l'Olimpíada, 74 de 142.
- **Evidència**: `{pregunta.opciones.map((opt, i) => { … const corr = i === pregunta.correcta; …`
- **Proposta**:
  - Barrejar les opcions en cada intent amb una permutació guardada a l'estat (`orden: number[]` per pregunta). S'ha de generar en un `useEffect` perquè no desquadre la hidratació, i `correcta` s'ha de traduir a través de la permutació. Es pot reutilitzar `shuffle` de `retos/shuffle-utils.ts`.
  - Reequilibrar el contingut (posició i llargària de les opcions).
  - Afegir un test de contingut que falle si una posició supera, per exemple, el 40 % de les respostes correctes.
- **Confiança**: Alta

#### CODE-INT-04 · Alt · robustesa — Els camps numèrics controlats perden el «−» i el punt decimal mentre s'escriu
- **On**: el patró `parseFloat((e.target as HTMLInputElement).value) || 0` amb `value={estat}` apareix 58 vegades repartides en 21 illes. Exemples: `VANTIRCalc.tsx:147-150`, `PuntoMuertoCalc.tsx:132-133`, `EquilibrioCalc.tsx:181-182`, `DCFCalc.tsx:149`, el camp del tipus d'`InteresCompuestoCalc` i `ProgresividadCalc.tsx:148`.
- **Problema**: qualsevol estat intermedi no vàlid d'un `<input type="number">` («-», o «2.» en un navegador en castellà) fa que `.value === ''`. Llavors l'estat passa a 0, Preact reescriu el camp amb «0» i s'esborra el que s'estava escrivint.
- **Escenari de fallada**: verificat en Chromium amb locale es-ES i els components reals.
  - VAN/TIR, flux de l'any 3: en teclejar «-5000», el camp passa per «0», «5», «50», «500» i «5000». El flux queda en +5.000 i el VAN es calcula amb el signe canviat sense cap avís (6.338,80 €).
  - Punt mort, camp del preu: «2.5» passa per «2», «0» i «5». El preu queda en 5 € i el punt mort en 667 u en lloc de 1.500 u.
  - Equilibri, ordenada de l'oferta: «-20» (la forma habitual, Qs = −20 + 3P) deixa c = 0.
  - Progressivitat: el tipus es pinta amb `Math.round(tipo*100)`. Si s'escriu 18,5, el camp passa a mostrar 19 però el càlcul usa el 18,5 %.
- **Evidència**: `onInput={(e) => setFlujo(i, parseFloat((e.target as HTMLInputElement).value) || 0)}`
- **Proposta**:
  - Crear un component `NumberField` compartit que guarde el text cru, que actualitze l'estat numèric només quan el valor és vàlid (`!input.validity.badInput && input.value !== ''`) i que no reescriga el camp mentre té el focus. Una alternativa és usar inputs no controlats (`defaultValue`) i llegir-los amb `valueAsNumber`.
  - A Progressivitat, llevar l'arredoniment i posar `step="any"`.
- **Confiança**: Alta

#### CODE-INT-05 · Alt · correcció — Les plantilles desades semblen buides en recarregar, i escriure en un camp esborra el que hi havia
- **On**: `src/lib/plantillas/persistence.ts:9-13`. L'usen estes illes, totes amb `client:load`: RegistroAula, RubricaGenerator, PlanRefuerzo, MedidasDUA i Autoevaluacion (`GeneradorIsland.astro:19-23`); DAFOCanvas, BusinessModelCanvas i MatrizBCG (`HerramientaIsland.astro:91-93`).
- **Problema**: `useState(() => loadJSON(key, initial))` llig el localStorage durant la hidratació. Astro hidrata amb `hydrate()` (`@astrojs/preact/dist/client.js`), i Preact 10 no aplica `value` durant la hidratació (`node_modules/preact/src/diff/index.js:565`). Per tant, els inputs conserven el valor buit del SSR mentre l'estat ja té les dades desades.
- **Escenari de fallada**: reproduït amb SSR (`preact-render-to-string`) i `hydrate` en Chromium.
  - Amb `pde:generador:registro-aula` = {fecha: "01/10/2026", sesion: "Sesion 3", alumnes Ana/Pau/Joan…}, després de carregar la pàgina els 8 primers camps es veuen buits.
  - En escriure «!» al camp «Sesión», l'estat passa a `sesion: "!"` («Sesion 3» es perd) i, de sobte, la resta de camps tornen a aparéixer plens.
  - Un docent que creu que ha perdut la rúbrica i la torna a escriure sobreescriu el que tenia.
- **Evidència**: `const [value, setValue] = useState<T>(() => loadJSON<T>(key, initial));`
- **Proposta**: fer com a `UnitNotes`: estat inicial = `initial`, càrrega en un `useEffect` després del muntatge i una bandera `loaded` perquè l'efecte de desar no escriga `initial` damunt de les dades. Una altra opció és passar aquestes illes a `client:only="preact"`.
- **Confiança**: Alta

#### CODE-INT-06 · Alt · correcció — Cotxe o alternativa: el missatge del quilometratge d'equilibri diu el contrari del que calcula el model
- **On**: `src/lib/calc/coche.ts:185-193`; `src/components/calculadoras/CocheVsAlternativa.tsx:59-62, 538-541`
- **Problema**: el model fa que el cost de l'alternativa no depenga dels quilòmetres i que el del cotxe creixca amb els quilòmetres. Per tant, el cotxe és més barat per davall de `kmEquilibrio`. El text diu, en canvi: «A partir de unos X km al año el coche propio empezaría a salir más barato».
- **Escenari de fallada**:
  - Dades: el cotxe per defecte (18.000 € en 10 anys, 6 l/100 km, 1,55 €/l, 1.920 € de costos fixos) i una alternativa amb abonament de 40 €/mes, 20 taxis al mes a 12 € i 15 dies de lloguer a 45 € (4.035 €/any). L'eina calcula kmEquilibrio = 3.387 km.
  - A 12.000 km/any mostra «más barata: alternativa» (cotxe 4.836 € > alternativa 4.035 €) i, alhora, «A partir de unos 3.387 km al año el coche propio empezaría a salir más barato».
  - A 1.000 km passa al revés: el cotxe costa 3.813 € i és l'opció més barata.
- **Evidència**: `const km = (totalAlternativa - costesFijosCoche) / variableCochePorKm;` i `kmEquilibrioPost: ' el coche propio empezaría a salir más barato…'`
- **Proposta**:
  - Opció 1: canviar el text per «Per davall d'uns X km/any el cotxe ix més barat; per damunt, l'alternativa».
  - Opció 2: fer que el cost de l'alternativa creixca amb els quilòmetres (taxi o lloguer per km), perquè el missatge actual tinga sentit.
  - En tots dos casos, afegir un test del sentit del missatge: coche(km < kmEq) < alternativa.
- **Confiança**: Alta

#### CODE-INT-07 · Alt · correcció — Business Game: un equip amb un preu molt baix i sense producció s'emporta quasi tota la demanda i guanya la ronda
- **On**: `src/lib/business-game/engine.ts:132-139, 157-165`; `src/lib/business-game/decision-validacion.ts:29`
- **Problema**: hi ha tres causes.
  - L'atractiu per preu, `precioReferencia / precio`, no té límit: tendeix a ∞ quan el preu tendeix a 0.
  - El validador només exigeix `precio > 0`.
  - La demanda assignada a un equip que no produeix es perd: no es reparteix entre els altres.
- **Escenari de fallada**: provat amb el motor real.
  - Tres equips amb la decisió per defecte de l'API (preu 20, màrqueting 20.000, producció 5.000…) tenen cadascun 1/3 de quota, venen 3.333 u i obtenen −53.552,61 €.
  - Un quart equip posa un preu de 0,5 € (un pas vàlid de l'input), producció 0 i cap despesa. Capta el 86,1 % de la demanda sense vendre res.
  - Els altres equips cauen a 464 u i −116.670,61 €, mentre que el «trol» (−30.000 €) queda el primer del rànquing. Amb un preu de 5 € ja capta el 40 %.
- **Evidència**: `const compPrecio = d.precio > 0 ? params.precioReferencia / d.precio : 0;` i `const ventas = Math.round(Math.min(demanda, x.e.decision.produccion));`
- **Proposta**:
  - Fitar el component de preu, per exemple amb `Math.min(2, pRef/p)` o amb un logit d'elasticitat limitada.
  - Repartir de manera iterativa la demanda no servida entre els equips que tenen capacitat.
  - Afegir un preu mínim (p. ex. ≥ 0,5 × `costeVariableBase`) al validador i a l'input.
- **Confiança**: Alta

#### CODE-INT-08 · Alt · correcció — L'escala del 19–47 % s'anomena «escala estatal», i Forma jurídica afirma que «no incluye la mitad autonómica»
- **On**:
  - Codi: `src/lib/calc/irpf.ts:10-12, 88-101`; `src/lib/calc/forma-juridica.ts:14-16`.
  - Textos de la interfície: `CalculadoraNominaESO.tsx:84`, `IRPFDeclaracion.tsx:67`, `CosteContratacionCalc.tsx:50` i `FormaJuridicaCalc.tsx:46`, en ES i en CA.
  - Fora de l'àrea INT: `eco-4eso/recursos/calculadora-nomina.md:20`, `eco-4eso/tests/06` i `diagrams/IRPFTramos.astro:22`.
- **Problema**: l'escala estatal (art. 63 LIRPF) és del 9,5/12/15/18,5/22,5/24,5 %. Els valors del codi (19/24/30/37/45/47 %) són l'estatal més l'autonòmica supletòria (art. 74), cosa que delata el 47 % final (24,5 + 22,5). Els números són, per tant, una aproximació raonable de l'IRPF total, però els textos diuen el contrari. A més, el comentari del codi afirma que la part autonòmica «roughly doubles them».
- **Escenari de fallada**:
  - A Forma jurídica, amb un IS del 25 %, el punt de tall de ≈ 35.800 € existeix precisament perquè l'escala ja inclou la meitat autonòmica. Com que el text diu «no incluye la mitad autonómica», un docent en traurà que el tall real és encara més baix.
  - A la nòmina, «Usamos la escala estatal… la retención real también depende de tu comunidad» fa pensar que la part autonòmica s'afig damunt.
  - La pàgina de recurs de la nòmina parla, a més, d'«escala estatal 2024» i diu que cada comunitat aplica la seua escala «sobre la mitad de la base», quan en realitat l'escala autonòmica s'aplica a tota la base liquidable.
- **Evidència**: `{ desde: 300000, hasta: Infinity, tipo: 0.47 }` i `nota: 'Datos 2026. Usamos la escala estatal del IRPF; …'`
- **Proposta**:
  - Canviar el nom de `ESCALA_IRPF_2026` per un que en reflectisca el contingut, com ara `ESCALA_GENERAL_COMBINADA_2026`, o exposar les dues meitats per separat.
  - Corregir el comentari i els textos, per exemple: «Usamos la escala estatal más una escala autonómica tipo (la supletoria del art. 74 LIRPF); cada comunidad aplica la suya».
  - Eliminar «no incluye la mitad autonómica» de Forma jurídica.
- **Confiança**: Alta

#### CODE-INT-09 · Alt · accessibilitat — EconRisk no es pot jugar amb teclat ni amb lector de pantalla
- **On**: `src/components/games/econrisk/MapView.tsx:66-72, 130-136`; `EconriskGame.tsx:378`
- **Problema**: els territoris són `<g onClick>` dins d'un `<svg role="img">`. No tenen `tabIndex` ni `onKeyDown`, i el `role="img"` amaga als lectors de pantalla els `aria-label` dels nodes. Tampoc hi ha cap alternativa (llista o botons) per a triar territori.
- **Escenari de fallada**: una alumna que navega amb teclat arriba a la fase de reforç («Debes colocar todas») i no pot seleccionar cap territori. La partida queda bloquejada al primer torn.
- **Evidència**: `<g key={t.id} class="er-node" onClick={() => onSelect(t.id)} style={{ cursor: 'pointer' }} aria-label={…}>`
- **Proposta**: posar `role="button"`, `tabIndex={0}` i `onKeyDown` (Intro/Espai) a cada node, i `role="group"` a l'SVG en lloc d'`img`. Una alternativa és afegir al SidePanel una llista de territoris amb botons.
- **Confiança**: Alta

#### CODE-INT-10 · Alt · accessibilitat — Simulador OA-DA: els tres sliders no tenen nom accessible
- **On**: `src/components/calculadoras/ADASSimulator.tsx:562-577`
- **Problema**: l'`<input type="range">` no està dins de cap `<label>` ni té `aria-label` o `aria-labelledby`: l'etiqueta és un `<span>` germà. Per al potencial (OALP) és l'únic control que hi ha.
- **Escenari de fallada**: amb lector de pantalla se senten tres «control lliscant, 0» sense saber quin correspon a DA, a OA o a OALP.
- **Evidència**: `<span class="calc__label">{label}</span> … <input type="range" class={cls} min={min} max={max} … />`
- **Proposta**:
  - Crear un `id` amb `useId()` i associar-lo amb `<label for={id}>`. Afegir `aria-valuetext` amb el signe (p. ex. «+10»).
  - Fitar `adShift`/`srasShift` al rang del slider quan s'usen els botons de causa: ara poden passar de ±50 i el slider queda desquadrat respecte del valor mostrat.
- **Confiança**: Alta

#### CODE-INT-11 · Mitjà · correcció — Declaració de la renda: el preset «Sueldo medio, retuvo de más» ix «A PAGAR»
- **On**: `src/components/calculadoras/IRPFDeclaracion.tsx:156-165` (etiquetes a les línies 36-38)
- **Problema**: les dades dels presets no concorden amb la seua etiqueta, i cap test ho comprova.
- **Escenari de fallada**:
  - «Sueldo medio, retuvo de más» (24.000 €, 3.000 € de retencions) mostra «A PAGAR +843,00 € · Te retuvieron menos de lo que tocaba». Fins i tot amb l'IRPF corregit de CODE-INT-02 (3.243 €) continuaria sent a pagar (243 €).
  - «Familia con 2 hijos» (30.000 €, 4.500 €) mostra «A PAGAR +57 €», tot i que el comentari del codi espera una devolució. Amb l'IRPF corregit ixen 543 € a tornar.
- **Evidència**: `// Slightly over-withheld worker => típico "a devolver".` i `{ id: 'sueldo-medio', rendimientosTrabajo: 24000, retencionesPracticadas: 3000, hijos: 0 }`
- **Proposta**: fixar les retencions a partir de la quota (p. ex. 3.600 € per al sou mitjà, un cop aplicat CODE-INT-02) i afegir un test que comprove que, en cada preset, `aPagar`/`aDevolver` concorda amb l'etiqueta.
- **Confiança**: Alta

#### CODE-INT-12 · Mitjà · correcció — La nòmina no té base màxima de cotització, i no ho avisa
- **On**: `src/lib/calc/nomina.ts:19-23, 88-92`. L'avís falta a `CalculadoraNominaESO.tsx:84`, però `CosteContratacionCalc.tsx:50` sí que el té.
- **Problema**: les cotitzacions s'apliquen sobre tot el brut. La base màxima de 2026 és d'uns 5.101 €/mes, i per damunt s'aplica la cotització de solidaritat: el 2026 és de l'1,15/1,25/1,46 % i 1/6 va a càrrec del treballador.
- **Escenari de fallada**: amb 6.000 €/mes × 14 (84.000 €), l'eina resta al treballador 5.460 € de Seguretat Social. Amb la base màxima (61.214 €/any) i la solidaritat, serien ≈ 4.025 €, és a dir, ≈ 1.435 € de més a l'any. En el cost d'empresa per al mateix sou (84.000 €), l'eina dona 27.006 € davant de ≈ 19.913 €.
- **Proposta**: definir `BASE_MAXIMA_2026`, `BASE_MINIMA_2026` i la solidaritat, i aplicar `min(brut, baseMax × 12)`. Com a mínim, afegir l'avís a la nòmina i limitar l'input.
- **Confiança**: Alta per a l'error de càlcul; Mitjana per als valors de 2026 de la base màxima i de la solidaritat.

#### CODE-INT-13 · Mitjà · correcció — Equilibri de mercat: quantitats negatives amb preus intervinguts
- **On**: `src/lib/calc/equilibrio.ts:17-34`
- **Problema**: `qd`/`qs` no es limiten a ≥ 0. Amb una ordenada d'oferta negativa (la forma de llibre, Qs = −20 + 3P, que l'input permet), un preu màxim molt baix dona una quantitat intercanviada negativa.
- **Escenari de fallada**: amb a = 100, b = 2, c = −20 i d = 3, l'equilibri és P* = 24 i Q* = 52.
  - Preu màxim de 5 €: l'eina diu «Cantidad intercambiada −5 uds, escasez 95». El correcte és 0 i 90.
  - Preu mínim de 60 €: diu «intercambiada −20, excedente 180». El correcte és 0 i 160.
  - El panell d'inspecció mostra també Qs = −5.
- **Evidència**: `const qs = coef.c + coef.d * P;` … `intercambiada: Math.min(qd, qs)`
- **Proposta**: fer `qd = Math.max(0, a − bP)` i `qs = Math.max(0, c + dP)` a `evaluarPrecio`, cosa que també corregeix `intervencion`. Afegir tests amb ordenada negativa.
- **Confiança**: Alta

#### CODE-INT-14 · Mitjà · accessibilitat — Ràtios: el diagnòstic només es veu pel color i el llindar aplicat no és el rang que es mostra
- **On**: `src/components/calculadoras/RatiosCalc.tsx:249-253, 315-317`; `src/styles/calculadoras.css:126-127`
- **Problema**: el veredicte («sa» o no) només canvia el color de la vora (verd #4F8C3F o roig #B83A3A), i el text és fix («Sano: 1,5 – 2»). A més, `diagRatio` accepta valors fins a `hi × 1,2`.
- **Escenari de fallada**:
  - Una liquiditat de 2,3 dona vora verda amb el text «Sano: 1,5 – 2».
  - Un endeutament del 70 % (PN 78, PNC 122, PC 60) dona vora verda amb «Sano: 40 – 60 %».
  - Un alumne daltònic o que usa lector de pantalla no rep cap veredicte.
- **Evidència**: `return n !== null && n >= lo && n <= hi * 1.2;`
- **Proposta**: fer coincidir el llindar amb el text i afegir un veredicte textual («Dins del rang», «Per davall», «Per damunt»), com ja fa la calculadora VAN/TIR.
- **Confiança**: Alta

#### CODE-INT-15 · Mitjà · correcció — VAN/TIR: diu «No converge» en casos que no són de convergència
- **On**: `src/components/calculadoras/VANTIRCalc.tsx:252-270`, amb el missatge a la línia 22
- **Problema**: la bisecció només busca entre −99 % i 500 % i exigeix un canvi de signe entre els extrems. No detecta fluxos amb diversos canvis de signe ni distingeix el cas en què no existeix cap TIR.
- **Escenari de fallada**:
  - I0 = 100 i fluxos [230, −132]: hi ha dues TIR (10 % i 20 %), però l'eina mostra «TIR — No converge» i, amb k = 15 %, «Crea valor».
  - I0 = 1.000 i flux [10.000]: la TIR és del 900 %, però l'eina diu «No converge».
  - I0 = 100.000 i fluxos [50.000, 50.000, 50.000, −60.000]: el VAN és negatiu per a qualsevol taxa, de manera que no hi ha TIR, i l'eina diu «No converge».
- **Evidència**: `if (fLo * fHi > 0) return null;`
- **Proposta**:
  - Comptar els canvis de signe dels fluxos i, si n'hi ha més d'un, avisar que «pot haver-hi més d'una TIR».
  - Escanejar el VAN en una graella per a trobar tots els intervals amb arrel, i ampliar el límit superior de manera adaptativa.
  - Diferenciar els missatges: «No existeix TIR», «TIR > 500 %» i «Diverses TIR: …».
- **Confiança**: Alta

#### CODE-INT-16 · Mitjà · robustesa — Els jocs es trenquen si el navegador bloqueja l'emmagatzematge
- **On**:
  - `src/lib/games/storage.ts:3-16`, que s'instancia a nivell de mòdul a `StonksGame.tsx:30`, `EconopolyGame.tsx:56`, `EconriskGame.tsx:57` i `SegurosGame.tsx:14`.
  - Accessos sense `try/catch` també a `jocs-economics/JocsApp.tsx:43`, `games/cajut/PlayerApp.tsx:22-29`, `games/insider/PlayerApp.tsx:22-31` i `actividades/ArbolDecisionesIsland.tsx:35, 41`.
- **Problema**: `typeof localStorage !== 'undefined' ? localStorage : null` crida el *getter*, que llança un `SecurityError` quan el navegador bloqueja les cookies o les dades del lloc. Tampoc estan protegits `getItem` i `setItem`. `src/lib/storage.ts` ja resol aquest cas, però aquests mòduls no l'usen.
- **Escenari de fallada**: en Chromium amb «bloquejar totes les cookies», carregar Stonks provoca «SecurityError: Failed to read the 'localStorage' property from 'Window'» en avaluar el mòdul. L'illa no s'hidrata i els botons de la portada no fan res. Passa el mateix amb Econopoly, EconRisk i Seguros. A ArbolDecisiones l'error salta dins de l'inicialitzador de `useState`.
- **Evidència**: `backend: Storage | null = typeof localStorage !== 'undefined' ? localStorage : null,`
- **Proposta**: resoldre el *backend* de manera mandrosa dins d'un `try/catch` (o delegar en `loadJSON`/`saveJSON`) i embolcallar `getItem`, `setItem` i `removeItem`. Aplicar el mateix tractament a `sessionStorage`.
- **Confiança**: Alta

#### CODE-INT-17 · Mitjà · accessibilitat — Els lectors de pantalla no anuncien ni els resultats ni les correccions
- **On**: cap de les 56 illes de calculadores i generadors té `aria-live` o `role="status"`; `QuizPlayer.tsx:386-394` i el bloc de retroacció del RetoPlayer.
- **Problema**: els resultats es recalculen amb cada tecla, i la correcció «¡Correcto!/Incorrecto.» apareix en un `div` sense regió viva.
- **Escenari de fallada**: amb NVDA, prémer «Confirmar respuesta» no anuncia res, i l'alumne ha de recórrer la pàgina per a saber si ha encertat. De la mateixa manera, canviar el brut a la nòmina no anuncia el nou líquid (p. ex. 1.328,36 €).
- **Proposta**: posar `role="status"` (o `aria-live="polite"`) al bloc de retroacció del QuizPlayer i del RetoPlayer, i a una línia de resum de cada calculadora, amb *debounce*.
- **Confiança**: Alta

#### CODE-INT-18 · Baix · correcció — Calificaciones: «Los pesos suman 100.00000000000001 %»
- **On**: `src/components/generadores/CalificacionesCalc.tsx:30-31, 221-237`
- **Problema**: la suma de pesos amb decimals es compara amb `!== 100` i es mostra sense formatar.
- **Escenari de fallada**: amb pesos de 24,6 / 39,7 / 35,7, apareix l'avís «Los pesos suman 100.00000000000001 %, no 100 %» i la mètrica mostra «100.00000000000001 %», amb punt en lloc de coma.
- **Proposta**: comparar amb `Math.abs(totalPesos − 100) > 1e-6` i mostrar `formatNumber(totalPesos, 2)`.
- **Confiança**: Alta

#### CODE-INT-19 · Baix · correcció — Econopoly: l'últim postor que queda puja contra si mateix
- **On**: `src/lib/games/econopoly/engine.ts:254-272`
- **Problema**: després d'una puja, si tots els altres ja han passat, la subhasta no es tanca i el torn torna al mateix licitador, humà o IA.
- **Escenari de fallada**: provat amb el motor i la IA reals. L'IA cau en «Aseguradora» (300 €) i la trau a subhasta; el jugador humà passa. L'IA puja 300 €, torna a tindre el torn, puja 310 € contra si mateixa, després passa i paga 310 €. Un humà en la mateixa situació veu «Pujar/Pasar» i ha de passar per a guanyar.
- **Proposta**: extraure la resolució de la subhasta a una funció i cridar-la també des d'`auctionBid` quan no queden altres postors actius.
- **Confiança**: Alta

#### CODE-INT-20 · Baix · correcció — Stonks: es pot comprar Bitcoin el 2008–2011 i els diners desapareixen del resum
- **On**: `src/lib/games/stonks/data.ts:31` (`unlockRound: 8`, és a dir, 2008), mentre que `MARKET_DATA` té bitcoin a `null` fins al 2011; `ResultScreen.tsx:58`
- **Problema**: l'actiu es desbloqueja quatre anys abans de tindre dades. Amb `null`, el motor en manté el valor (0 %) i ResultScreen amaga les files amb `null`.
- **Escenari de fallada**: posar el 100 % en Bitcoin el 2008 dona un rendiment del 0 % en plena crisi, i el resum de l'any no mostra la fila de Bitcoin. Històricament, el 2008 Bitcoin no existia: el primer bloc és de gener de 2009. El test `engine.test.ts:66-76` fixa aquest comportament.
- **Proposta**: posar `unlockRound: 12` (2012) o filtrar a AllocateScreen els actius amb retorn `null` l'any en curs, i actualitzar el test.
- **Confiança**: Alta

## Deute tècnic i millores
- **Rendiment**: `HerramientaIsland.astro` i `GeneradorIsland.astro` hidraten les seues 56 illes amb `client:load`, i 80 fitxers de contingut (unitats de llibre incloses) les incrusten. Per a les illes que queden lluny de l'inici de la pàgina convé `client:visible`. Cada illa pesa entre 3 i 6 KB gz (ADASSimulator, 6,3 KB) i inclou els textos ES i CA alhora.
- `src/lib/calc/format.ts:56`: `parseESNumber` no s'usa enlloc i és ambigua («1.5» → 15). Cal eliminar-la o reescriure-la amb regles clares abans de reutilitzar-la al `NumberField` de CODE-INT-04.
- `declaracion-irpf.ts:109-110`: els rendiments del capital van a la base general, quan haurien d'anar a la base de l'estalvi (19–30 %). La taula «¿Cómo sale?» no mostra ni la reducció ni les altres despeses, de manera que no quadra amb la quota.
- **Nòmina en 14 pagues**: la cotització mensual real és el total dividit entre 12 (les pagues extra es prorrategen i no cotitzen el mes en què es cobren), no entre 14. A més, el % de retenció de l'IRPF es mostra sobre (brut − SS), mentre que les files de SS són sobre el brut.
- **Preset de la nòmina** «Camarero temporal (900 €/mes)»: en 14 pagues fa 12.600 €/any, per davall de l'SMI de 2026 (17.094 €) si és jornada completa. Convé indicar «jornada parcial», com ja fa el preset de la declaració.
- `CuentaResultadosCalc`: l'ajuda «tipo general 25 %» és correcta, però l'exemple per defecte (500.000 € de vendes) és una microempresa, que el 2026 tributa a tipus reduïts per la Llei 7/2024 (confiança mitjana).
- `compra-inteligente.ts:96-103`: la bisecció té un sostre del 100 % mensual (una TAE ≈ 409.500 %), i els casos degenerats queden tallats sense avís.
- **Modal de subhasta d'Econopoly** (`AuctionModal.tsx:78`): no té `role="dialog"` ni `aria-modal`, i no gestiona el focus.
- `UnitNotes`: «Borrar» elimina les notes sense demanar confirmació. L'indicador «Guardado» té un text fix i només canvia de classe, de manera que el seu `aria-live` no anuncia mai res.
- **i18n**: `dcf.ts:97, 111, 136-137` retorna avisos en castellà que es mostren a /ca/, i `Timeline.tsx:81` té com a `aria-label` per defecte «Línea de tiempo».
- **Desquadres d'hidratació**:
  - RetoPlayer crida `shuffleNoIdentidad` (que usa Math.random) dins de l'inicialitzador de `useState`, que s'executa tant en SSR com en el client, i això desquadra els ítems «ordenar».
  - `ArbolDecisionesIsland` llig `sessionStorage` en l'inicialitzador, cosa que desquadra la hidratació si hi ha estat desat.
- **Tests**:
  - `irpf.test.ts`, `nomina.test.ts` i `declaracion-irpf.test.ts` només comproven direccions («menor que», «entre 5 i 25 %»), no valors de referència. Per això no detecten CODE-INT-02.
  - `coche.test.ts` no comprova el sentit del missatge.
  - Cap test lliga els presets amb les seues etiquetes.
  - `stonks/engine.test.ts` consolida el comportament de CODE-INT-20.

## Top 5
1. **CODE-INT-01**: arreglar l'entrada de les preguntes numèriques. Hi ha 88 respostes decimals i 4 de negatives (ES+CA) que ara no es poden contestar bé, i l'alumnat rep notes injustes.
2. **CODE-INT-02**: IRPF amb els 2.000 € d'altres despeses i la reducció en dos trams, amb tests de valors de referència. Afecta la nòmina, la declaració i el cost de contractació (≈ +600 €/any per a sous mitjans).
3. **CODE-INT-03**: barrejar les opcions dels tests i reequilibrar el contingut. Ara, contestar sempre «B» aprova el 70 % dels tests.
4. **CODE-INT-04**: crear un `NumberField` compartit que no esborre el «−» ni el «.» (VAN/TIR, DCF, equilibri, interés compost…).
5. **CODE-INT-05**: carregar la persistència de les plantilles després del muntatge, per a no perdre la feina desada dels docents.
