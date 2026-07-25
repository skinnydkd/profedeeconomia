---
asignatura: edmn-2bach
unidad_relacionada: 9
lang: ca
slug: "asignaturas/edmn-2bach/tests/09-funcion-financiera.ca"
title: "Test · Unitat 9 — La funció financera"
duracion_estimada: "10-15 min"
estado: publicado
preguntas:
  - enunciado: "L'estructura econòmica d'una empresa descriu…"
    opciones:
      - "D'on ve el diners."
      - "En què està invertit el diners (actiu): edificis, maquinària, estoc, caixa."
      - "El pla de màrqueting."
      - "L'històric de beneficis."
    correcta: 1
    explicacion: "Estructura econòmica = actiu (en què està invertit). Estructura financera = passiu + patrimoni net (d'on ve el diners)."
  - enunciado: "La regla bàsica de coherència financera diu que…"
    opciones:
      - "Les inversions a llarg termini s'han de finançar amb recursos a llarg termini."
      - "Les inversions a llarg s'han de finançar amb préstecs a curt."
      - "Cal evitar sempre el finançament aliè."
      - "El capital propi ha de ser superior a l'aliè."
    correcta: 0
    explicacion: "Pagar un edifici amb un préstec a un any és la recepta clàssica de l'asfíxia financera. Llarg amb llarg, curt amb curt."
  - enunciado: "Una inversió inicial de 10.000 € genera fluxos nets anuals de 4.000 €. El seu PayBack és…"
    opciones:
      - "1,5 anys."
      - "2 anys."
      - "2,5 anys."
      - "4 anys."
    correcta: 2
    explicacion: "PayBack = Inversió / Flux anual = 10.000 / 4.000 = 2,5 anys. Útil per a avaluar risc, però ignora el valor del diners en el temps."
  - enunciado: "El VAN corregix el principal defecte del PayBack, que és…"
    opciones:
      - "La seua complexitat de càlcul."
      - "Que ignora el que ocorre després del període de recuperació i el valor del diners en el temps."
      - "Que només s'aplica a empreses grans."
      - "Que requerix conéixer la TIR prèviament."
    correcta: 1
    explicacion: "El VAN actualitza tots els fluxos al present amb una taxa de descompte, capturant tant l'horitzó complet com el valor temporal del diners."
  - enunciado: "Si el VAN d'un projecte és positiu i la taxa de descompte és del 8 %, podem afirmar que…"
    opciones:
      - "El projecte destruïx valor."
      - "El projecte cobrix el rendiment mínim exigit i, a més, genera valor addicional."
      - "El PayBack és necessàriament menor de 4 anys."
      - "El projecte és indiferent."
    correcta: 1
    explicacion: "VAN > 0 significa que el projecte rendix més que la taxa exigida. La diferència és valor creat. VAN = 0 indiferent, VAN < 0 destruïx valor."
  - enunciado: "La Taxa Interna de Rendibilitat (TIR) és…"
    opciones:
      - "La taxa de descompte que fa el VAN zero."
      - "El percentatge de capital aliè respecte al propi."
      - "El tipus mitjà d'interés del banc."
      - "El benefici dividit per la inversió inicial."
    correcta: 0
    explicacion: "TIR = taxa que iguala els fluxos descomptats a la inversió inicial. Si TIR > rendibilitat mínima exigida → acceptar; si <, rebutjar."
  - enunciado: "Quina d'estes NO és finançament PROPI?"
    opciones:
      - "Aportació de capital d'un nou soci."
      - "Beneficis reinvertits (autofinançament)."
      - "Préstec bancari."
      - "Ampliació de capital."
    correcta: 2
    explicacion: "Préstec = finançament aliè (genera obligació de devolució i pagament d'interessos). Les altres tres són pròpies: no exigixen devolució, però diluïxen el control si entren nous socis."
  - enunciado: "*Verkami* i *Kickstarter* són exemples de…"
    opciones:
      - "Capital risc (*venture capital*)."
      - "Crowdfunding de recompensa."
      - "Business angels."
      - "Crowdlending."
    correcta: 1
    explicacion: "Crowdfunding de recompensa: molts xicotets aportants financen un projecte i reben el producte quan es fabrique. Altres variants: donació, préstec (crowdlending) i inversió (equity)."
  - enunciado: "Una oferta de finançament al *0 % interés* pot acabar sent més cara que un préstec bancari al 7 % perquè…"
    opciones:
      - "El comerç canvia el preu del producte."
      - "Sol incloure comissió d'obertura i una assegurança obligatòria la suma de les quals supera l'estalvi d'interessos."
      - "L'IVA es calcula diferent."
      - "El comerç cobra l'IVA dues vegades."
    correcta: 1
    explicacion: "Per això la llei obliga a publicitar la TAE (Taxa Anual Equivalent): permet comparar el cost real d'ofertes amb estructures distintes de comissions, assegurances i terminis."
  - tipo: verdadero-falso
    enunciado: "Si la TIR d'un projecte és superior a la rendibilitat mínima exigida per l'empresa, el projecte s'ha de rebutjar."
    correcta: false
    explicacion: "Fals. Si TIR > rendibilitat mínima exigida, el projecte s'accepta (és equivalent a tindre VAN positiu a eixa taxa). Es rebutja quan la TIR queda per davall del mínim exigit."
  - tipo: numerico
    enunciado: "Una inversió de 1.000 € genera fluxos nets de 600 € al final de l'any 1 i 600 € al final de l'any 2. Amb una taxa de descompte del 10 %, quin és el VAN en euros (2 decimals)?"
    respuesta: 41.32
    tolerancia: 0.5
    unidad: "€"
    explicacion: "VAN = −1.000 + 600/1,10 + 600/1,10² = −1.000 + 545,45 + 495,87 = 41,32 €. Com que VAN > 0, el projecte crea valor."
  - tipo: relacionar
    enunciado: "Classifica cada font de finançament com a pròpia o aliena i per la seua naturalesa:"
    izquierda: ["Préstec bancari", "Beneficis reinvertits", "Crowdlending", "Ampliació de capital"]
    derecha: ["Finançament propi intern (autofinançament)", "Finançament aliè de molts xicotets prestadors", "Finançament propi extern (nous fons de socis)", "Finançament aliè amb devolució i interessos"]
    correctas: [3, 0, 1, 2]
    explicacion: "Préstec bancari → aliè amb interessos; beneficis reinvertits → propi intern; crowdlending → aliè de molts prestadors; ampliació de capital → propi extern."
---

Test d'autoavaluació de la Unitat 9 del llibre d'EDMN 2BACH.
