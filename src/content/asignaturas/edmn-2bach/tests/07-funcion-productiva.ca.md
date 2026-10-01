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
      - "No arriba a vendre tot el pa que cou cada dia."
      - "Ven tot el pa que cou, però amb un cost excessiu."
      - "Cou molt de pa per treballador, encara que es quede sense vendre."
      - "Usa la farina justa i sense minva, però cou un pa que ningú compra."
    correcta: 1
    explicacion: "Eficaç = assolir l'objectiu (vendre tot el pa). Eficient = assolir-lo amb pocs recursos. Eficaç però no eficient = arriba a la meta cremant més recursos dels necessaris. Usar la farina justa per a un pa que ningú compra és el contrari (eficient però no eficaç), i coure molt per treballador sense vendre és ser productiu però no eficaç."
  - enunciado: "El sistema *Lean Manufacturing* identifica set tipus de malbaratament (*muda*). Quin d'estos NO està en la llista?"
    opciones:
      - "Sobreproducció."
      - "Moviments innecessaris."
      - "Inventari excessiu."
      - "Talent no aprofitat."
    correcta: 3
    explicacion: "Els set *muda* de Toyota són sobreproducció, esperes, transport, processos innecessaris, inventari excessiu, moviments innecessaris i defectes. El talent no aprofitat és un «huité malbaratament» que alguns autors van afegir després, però no forma part de la llista original."
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
      - "Una tècnica de control d'estoc que fixa lots mínims de comanda."
      - "Una senyalització visual del flux de treball amb targetes o columnes."
      - "Un programa informàtic de Toyota per a planificar la producció."
      - "Un mètode de qualitat que busca 3,4 defectes per milió d'unitats."
    correcta: 1
    explicacion: "Kanban és senyalització visual: targetes o columnes (pendent, en preparació, llest) que deixen vore el coll d'ampolla del procés sense necessitat d'informes. Hui s'usa en cuines, hospitals i equips de programari, no només en fàbriques. Els 3,4 defectes per milió són la meta de Six Sigma, un altre corrent distint."
  - enunciado: "Una empresa amb molts costos fixos respecte als variables té…"
    opciones:
      - "Baix palanquejament operatiu."
      - "Alt palanquejament operatiu."
      - "Més flexibilitat per a adaptar-se a caigudes de la demanda."
      - "Un benefici que quasi no varia quan canvien les vendes."
    correcta: 1
    explicacion: "Palanquejament operatiu = sensibilitat del benefici als canvis de volum. Molt CF i poc CV = benefici explosiu si es ven molt i pèrdues explosives si es ven poc (aerolínies, cines, programari B2B). Per això no guanya flexibilitat davant de les caigudes de demanda ni té un benefici estable: això descriu el palanquejament baix."
  - enunciado: "El marge de contribució unitari es definix com…"
    opciones:
      - "Preu de venda menys cost fix total."
      - "Preu de venda menys cost variable unitari."
      - "Benefici net dividit pel nombre d'unitats venudes."
      - "Cost fix dividit pel nombre d'unitats venudes."
    correcta: 1
    explicacion: "MC = P − CVu. És el que cada unitat aporta per a cobrir els costos fixos i, una vegada coberts, generar benefici."
  - tipo: verdadero-falso
    enunciado: "En augmentar la producció, el cost mitjà per unitat tendix a baixar perquè els costos fixos es reparteixen entre més unitats, almenys fins al límit de capacitat."
    correcta: true
    explicacion: "Verdader. CMe = CT / Q = CF / Q + CVu: en créixer Q, la part fixa que suporta cada unitat és menor. Són les economies d'escala, que s'acaben quan s'arriba al límit de capacitat i cal obrir un altre local o contractar una altra persona estructural."
  - tipo: numerico
    enunciado: "Un taller produïx 480 peces emprant 4 treballadors durant 6 hores cadascun. Quina és la productivitat per hora de treball en peces/hora (sense decimals)?"
    respuesta: 20
    tolerancia: 0
    unidad: "peces/hora"
    explicacion: "Hores totals = 4 × 6 = 24 h. Productivitat = 480 / 24 = 20 peces per hora de treball."
  - tipo: relacionar
    enunciado: "Associa cada modalitat de producció amb la seua descripció:"
    izquierda: ["Per projecte", "Per lots", "En cadena", "Contínua"]
    derecha: ["Operacions idèntiques que es repetixen sense pausa per unitats", "Sèries limitades de productes similars", "Cada output és únic, com un edifici", "Procés que no s'atura, com una refineria"]
    correctas: [2, 1, 0, 3]
    explicacion: "Per projecte → output únic; per lots → sèries limitades; en cadena → operacions idèntiques repetides; contínua → procés que no s'atura."
  - tipo: numerico
    enunciado: "Una empresa té 12.000 € de costos fixos al mes, ven el seu producte a 8 € i li costa 5 € de cost variable unitari. Si preveu vendre 5.000 unitats al mes, quin és el seu marge de seguretat, en % (sense decimals)?"
    respuesta: 20
    tolerancia: 0.5
    unidad: "%"
    explicacion: "Primer, el punt mort: Q* = CF / (P − CVu) = 12.000 / (8 − 5) = 4.000 unitats. Marge de seguretat = (Demanda − Q*) / Demanda × 100 = (5.000 − 4.000) / 5.000 × 100 = 20 %. Les vendes podrien caure un 20 % abans d'entrar en pèrdues: per damunt del 10 % que marca la vulnerabilitat, però lluny del 30 % d'un negoci raonablement estable."
---

Test d'autoavaluació de la Unitat 7 del llibre d'EDMN 2BACH.
