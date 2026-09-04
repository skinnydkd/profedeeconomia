---
asignatura: edmn-2bach
unidad_relacionada: 7
lang: ca
slug: "asignaturas/edmn-2bach/tests/07-funcion-productiva.ca"
title: "Test · Unitat 7 — La funció productiva"
duracion_estimada: "10-15 min"
estado: publicado
preguntas:
  - enunciado: "Un forn té CF = 3.000 €/mes, ven cada barra a 1,50 € i CVu = 0,50 €. El seu punt mort mensual és…"
    opciones:
      - "1.500 barres."
      - "2.000 barres."
      - "3.000 barres."
      - "6.000 barres."
    correcta: 2
    explicacion: "Q* = CF / (P − CVu) = 3.000 / (1,50 − 0,50) = 3.000 barres al mes. Marge de contribució unitari = 1 €."
  - enunciado: "La producció on cada output és únic —construcció d'un edifici, programari a mesura— s'anomena…"
    opciones:
      - "Producció per projecte."
      - "Producció per lots."
      - "Producció en cadena."
      - "Producció contínua."
    correcta: 0
    explicacion: "Les quatre modalitats: per projecte (única), per lots (sèries limitades), en cadena (operacions idèntiques contínues) i contínua (no s'atura, com una refineria)."
  - enunciado: "Eficàcia, eficiència i productivitat NO són sinònims. Un forn *eficaç però no eficient*…"
    opciones:
      - "No ven tot el pa que couen."
      - "Ven tot el pa que couen però cremant massa recursos per a arribar a l'objectiu."
      - "És molt productiu per treballador."
      - "Té marge unitari alt."
    correcta: 1
    explicacion: "Eficaç = assolir l'objectiu. Eficient = assolir-lo amb pocs recursos. Eficaç però no eficient = arribes a la meta però cremant més recursos del necessari."
  - enunciado: "El sistema *Lean Manufacturing* identifica set tipus de malbaratament (*muda*). Quin d'estos NO està en la llista?"
    opciones:
      - "Sobreproducció."
      - "Esperes."
      - "Defectes."
      - "Ineficiència administrativa."
    correcta: 3
    explicacion: "Els set *muda* són sobreproducció, esperes, transport, processos innecessaris, inventari excessiu, moviments innecessaris i defectes. La ineficiència administrativa no hi és com a categoria autònoma."
  - enunciado: "Un fabricant compara dos plans: Pla A (CF=12.000, CVu=0,30 €) i Pla B (CF=28.000, CVu=0,10 €). Ven a P=0,50 €. En quin volum són indiferents?"
    opciones:
      - "60.000 unitats/mes."
      - "70.000 unitats/mes."
      - "80.000 unitats/mes."
      - "100.000 unitats/mes."
    correcta: 2
    explicacion: "Punt d'indiferència: 0,20·Q − 12.000 = 0,40·Q − 28.000 → Q = 80.000 unitats/mes. Per davall Pla A; per damunt Pla B (major palanquejament operatiu)."
  - enunciado: "Toyota va desenvolupar *Just in Time* i *Kanban* dins del sistema Lean. Què és Kanban?"
    opciones:
      - "Una tècnica de control d'estoc per lots mínims."
      - "Una senyalització visual del flux de treball, normalment amb targetes o columnes (pendent, en preparació, llest)."
      - "Un programari propietari de Toyota."
      - "Un sistema de qualitat ISO."
    correcta: 1
    explicacion: "Kanban és senyalització visual: el coll d'ampolla del procés es veu sense necessitat d'informes. Hui s'usa en cuines, hospitals, equips de programari, no només en fàbriques."
  - enunciado: "Una empresa amb molts costos fixos respecte als variables té…"
    opciones:
      - "Baix palanquejament operatiu."
      - "Alt palanquejament operatiu: enorme potencial de benefici quan el volum creix, alt risc quan cau."
      - "Més facilitat per a canviar de model de negoci."
      - "Menor punt mort."
    correcta: 1
    explicacion: "Palanquejament operatiu = sensibilitat del benefici a canvis en el volum. Molt CF + poc CV = benefici explosiu si venem molt, pèrdues explosives si venem poc."
  - enunciado: "El marge de contribució unitari es definix com…"
    opciones:
      - "Preu de venda menys cost fix total."
      - "Preu de venda menys cost variable unitari."
      - "Benefici net dividit pel nombre d'unitats venudes."
      - "Cost fix dividit pel nombre d'unitats venudes."
    correcta: 1
    explicacion: "MC = P − CVu. És el que cada unitat aporta per a cobrir els costos fixos i, una vegada coberts, generar benefici."
  - tipo: verdadero-falso
    enunciado: "Una empresa amb un elevat pes de costos fixos respecte als variables té un alt palanquejament operatiu, la qual cosa augmenta el benefici quan creix el volum però també el risc quan cau."
    correcta: true
    explicacion: "Verdader. Molt cost fix i poc variable amplifica la sensibilitat del benefici al volum: guanys explosius si es ven molt, pèrdues explosives si es ven poc."
  - tipo: numerico
    enunciado: "Un taller produïx 480 peces emprant 4 treballadors durant 6 hores cadascun. Quina és la productivitat per hora de treball en peces/hora (sense decimals)?"
    respuesta: 20
    tolerancia: 0
    unidad: "unitats"
    explicacion: "Hores totals = 4 × 6 = 24 h. Productivitat = 480 / 24 = 20 peces per hora de treball."
  - tipo: relacionar
    enunciado: "Associa cada modalitat de producció amb la seua descripció:"
    izquierda: ["Per projecte", "Per lots", "En cadena", "Contínua"]
    derecha: ["Operacions idèntiques que es repetixen sense pausa per unitats", "Sèries limitades de productes similars", "Cada output és únic, com un edifici", "Procés que no s'atura, com una refineria"]
    correctas: [2, 1, 0, 3]
    explicacion: "Per projecte → output únic; per lots → sèries limitades; en cadena → operacions idèntiques repetides; contínua → procés que no s'atura."
  - tipo: numerico
    enunciado: "Una empresa té 12.000 € de costos fixos al mes, ven el seu producte a 8 € i li costa 5 € de cost variable unitari. Quin és el seu punt mort, en unitats al mes?"
    respuesta: 4000
    tolerancia: 1
    unidad: "unitats"
    explicacion: "Q* = CF / (P − CVu) = 12.000 / (8 − 5) = 12.000 / 3 = 4.000 unitats. El denominador és el marge de contribució: cada unitat venuda aporta 3 € a cobrir els fixos. Des de la unitat 4.001, cada venda és benefici."
---

Test d'autoavaluació de la Unitat 7 del llibre d'EDMN 2BACH.
