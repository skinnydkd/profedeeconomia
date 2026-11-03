// src/i18n/games/stonks-cards-ca.ts
// Valencian (AVL) bodies of the Stonks deep cards, keyed by card id.
// Mirrors CARDS in src/lib/games/stonks/data/cards.ts one to one: same ids,
// same number of paragraphs per card, in the same order.
export const CARD_BODIES_CA: Record<string, { title: string; body: string[] }> = {
  // ── Base assets ─────────────────────────────────────────────────────────
  efectivo: {
    title: 'Efectiu',
    body: [
      'Diners disponibles a l’instant: al compte corrent o davall del matalaf. No estan invertits en res, així que no poden caure de valor en euros. Ni un cèntim de risc de mercat.',
      'No produïx res. Eixe és el tracte: renuncies a qualsevol rendiment a canvi de poder-lo usar hui mateix sense avisar ningú i sense vendre res.',
      'El risc de l’efectiu no es veu en el saldo, perquè el saldo mai no baixa. Es veu en el que eixe saldo compra. Amb una inflació del 5 % anual, 1.000 € guardats deu anys continuen sent 1.000 € i compren el que abans costava 614.',
      'Entre 1974 i 1982 els preus espanyols es van multiplicar per més de tres. Qui va tindre els diners parats tota aquella dècada va perdre dos terços del seu poder de compra sense que el banc li cobrara res ni l’avisara de res.',
      'No servix per a fer créixer un patrimoni. Servix per a dos coses concretes: la despesa dels pròxims mesos i l’imprevist que no vols cobrir venent justament quan el mercat està en mínims.',
    ],
  },
  deposito: {
    title: 'Depòsit a termini',
    body: [
      'Li deixes diners al banc durant un termini fix i ell et paga un interés pactat per endavant. No pots recuperar-los abans sense penalització: eixa immobilització és justament el que et paguen.',
      'El rendiment ix del negoci bancari. El banc presta eixos diners a un tipus més alt del que et paga a tu i es queda la diferència. Per això els depòsits rendixen més quan els tipus d’interés estan alts.',
      'El risc no és que el banc no et torne els diners: a Espanya el Fons de Garantia de Depòsits cobrix 100.000 € per titular i entitat. El risc és la inflació. Si et paguen un 4 % i els preus pugen un 14 %, has perdut un 10 % de poder de compra amb els diners perfectament a salvo.',
      'Durant els anys setanta i huitanta els depòsits espanyols pagaven interessos de dos dígits, i tot i això van perdre davant de l’IPC quasi tots els anys. Guanyar euros i perdre poder de compra alhora no és una raresa de manual: va ser el normal durant una dècada sencera.',
      'No servix per a fer créixer un patrimoni a llarg termini. Servix per als diners que necessitaràs d’ací a un o dos anys i que no et pots permetre veure caure.',
    ],
  },
  deuda: {
    title: 'Deute públic espanyol',
    body: [
      'Li deixes diners a l’Estat a canvi d’un cupó anual i la devolució del capital al venciment. El bo a deu anys és el de referència i es pot vendre abans d’hora al mercat, al preu que hi haja eixe dia.',
      'El rendiment té dos parts. El cupó, que és fix i conegut. I la variació del preu, que no ho és: quan els tipus d’interés baixen, els bons antics que paguen més es tornen més valuosos, i quan pugen, passa el contrari.',
      'Ací està el risc, i sorprén molta gent que compra deute públic pensant que no pot perdre. El 2022 els bancs centrals van pujar els tipus amb força i el deute europeu va tindre el pitjor any en dècades. Un actiu «segur» pot caure amb força si el vens en el moment equivocat.',
      'Durant la crisi de l’euro, entre 2010 i 2012, el deute espanyol va arribar a pagar més d’un 7 % perquè els inversors dubtaven que Espanya el poguera tornar. Qui va comprar aleshores va cobrar molt; qui ja el tenia va veure caure el seu valor de mercat.',
      'No servix per a batre la borsa a trenta anys. Servix per a donar estabilitat a una cartera i per a cobrar una renda previsible, si aguantes fins al venciment.',
    ],
  },
  oro: {
    title: 'Or',
    body: [
      'Compres un metall. No una empresa que fabrica, ni un Estat que et paga interessos: un metall que està guardat en algun lloc. El seu preu és exactament el que una altra persona estiga disposada a pagar per ell.',
      'No genera res. No paga dividends ni cupons i s’ha de custodiar. Tot el seu rendiment ve que algú pague més del que vas pagar tu, normalment perquè té por: a la inflació, a una guerra, o a que la seua moneda perda valor.',
      'Per això es mou a bots i en trams molt llargs. Pot pujar un 125 % en un any, com el 1979, i després passar-se vint anys sense recuperar eixe nivell. Qui va comprar or en el màxim de gener de 1980 va tardar quasi tres dècades a tornar a vore eixe preu.',
      'Va ser el gran refugi dels anys setanta, quan el dòlar va deixar de ser convertible en or i la inflació es va descontrolar a Occident. I va ser una inversió mediocre durant els huitanta i noranta, quan la inflació es va domar.',
      'No servix com a motor d’una cartera ni com a font de rendes. Servix com a assegurança contra escenaris extrems, i les assegurances normalment costen diners mentre no les necessites.',
    ],
  },
  vivienda: {
    title: 'Habitatge a Espanya',
    body: [
      'Compres un immoble per a llogar-lo. És l’actiu més familiar de tots a Espanya i també el més particular: entra en trossos molt grans, no es pot vendre per parts i tarda mesos a vendre’s.',
      'El rendiment té dos potes. El lloguer, que és una renda periòdica més o menys estable. I la revalorització de l’immoble, que depén del cicle. D’ací cal descomptar l’IBI, la comunitat, les reformes i els mesos en què el pis està buit.',
      'El gran risc és la falta de liquiditat combinada amb la concentració: quasi tot el teu patrimoni en un sol bé, en una sola ciutat, en un sol país. Si necessites els diners, no pots vendre mitja casa, i vendre-la sencera et pot portar mig any.',
      'Entre 1997 i 2007 el preu de l’habitatge a Espanya es va multiplicar per més de tres, i Espanya va arribar a construir més habitatges que Alemanya, França i Itàlia juntes. Entre 2008 i 2013 els preus van caure al voltant d’un terç i molts propietaris van descobrir que un actiu que «mai no baixa» sí que baixa.',
      'No servix per a tindre els diners disponibles ni per a diversificar amb poc capital. Servix per a generar rendes a llarg termini si pots permetre’t no vendre’l en el pitjor moment.',
    ],
  },
  bolsa_es: {
    title: 'Borsa espanyola',
    body: [
      'Compres una participació en les empreses cotitzades més grans d’Espanya alhora. En aquest joc la referència és l’Índex General de la Borsa de Madrid fins al 1991 i l’IBEX 35 amb dividends des del 1992, que és quan es va crear.',
      'El rendiment ve dels beneficis d’eixes empreses: una part es repartix com a dividend i una part es reinvertix i fa créixer el negoci. Comprar l’índex és comprar un tros menut de l’economia espanyola cotitzada.',
      'El risc és doble. Hi ha la volatilitat, que és normal en qualsevol borsa. I hi ha la concentració sectorial: l’índex espanyol pesa molt en bancs, energia i construcció, així que no està tan diversificat com pareix pel fet de tindre 35 noms.',
      'La borsa espanyola va perdre diners quasi tots els anys entre 1974 i 1982, i després es va multiplicar per més de dos només el 1986, l’any de l’entrada a la CEE. Els mateixos trenta-cinc noms poden ser una ruïna una dècada i una fortuna la següent.',
      'No servix per a diners que necessites en els pròxims anys. I no servix com a cartera única: és un sol país, i bastant xicotet en el conjunt mundial.',
    ],
  },
  sp500: {
    title: 'Borsa dels EUA',
    body: [
      'Compres alhora les cinc-centes empreses cotitzades més grans dels Estats Units. És l’índex més seguit del planeta i el que se sol usar com a sinònim de «la borsa» sense més.',
      'El rendiment ix dels beneficis d’eixes empreses, igual que en qualsevol índex. El que el distingix és el pes de la tecnologia i la grandària del seu mercat interior.',
      'Ací hi ha un risc que sovint s’oblida: la divisa. Tu invertixes en euros i eixes empreses guanyen en dòlars, així que el teu resultat depén també de com es moguen les dues monedes. Pot sumar molt, com als primers huitanta, i restar molt, com a mitjan d’aquella mateixa dècada.',
      'Entre 2000 i 2002 l’índex va perdre prop de la meitat del seu valor i va tardar set anys a recuperar-se. Després va arribar el 2008 i va tornar a caure un 37 % en dotze mesos. El que fa convincent la seua història a llarg termini és precisament que inclou eixos trams.',
      'No servix per al curt termini ni com a cartera única. És un sol país, encara que siga el més gran, i el seu bon comportament de les últimes dècades és un fet del passat, no una llei de la naturalesa.',
    ],
  },
  mundial: {
    title: 'Borsa mundial',
    body: [
      'Compres un poc de les principals empreses cotitzades dels països desenvolupats alhora: els Estats Units, Europa, el Japó i la resta, cadascun segons el seu pes. És la forma més simple que existix de no apostar per un país concret.',
      'El rendiment ix dels beneficis de milers d’empreses repartides pel món. No depens que l’encerte un sector, ni un país, ni un gestor.',
      'Continua sent borsa, així que cau quan cau el món: el 2008 va perdre al voltant d’un 38 %. El que la diversificació elimina no és el risc de mercat, sinó el risc d’haver triat malament el lloc.',
      'La composició canvia sola amb el temps. Als anys huitanta el Japó va arribar a pesar quasi tant com els Estats Units en els índexs mundials; hui pesa una fracció d’aquell pes. Comprar el món sencer t’estalvia haver d’endevinar eixos canvis.',
      'No servix per a diners a curt termini ni per a fer-se ric prompte. Servix com a columna vertebral d’una cartera a vint o trenta anys, que és exactament per al que l’usa «El Mercat» en esta partida.',
    ],
  },
  bitcoin: {
    title: 'Criptomoneda',
    body: [
      'Compres una anotació en un registre digital descentralitzat. No hi ha empresa darrere, ni beneficis, ni banc central que la respalde: existix des del 2009 i el seu valor és exactament el que una altra persona pague per ella.',
      'No genera res en absolut. Ni interessos, ni dividends, ni lloguers. El cent per cent del rendiment depén que aparega algú disposat a pagar més del que vas pagar tu.',
      'La volatilitat no s’assembla a la de cap altre actiu del tauler. Ha multiplicat el seu valor per més de deu en un sol any i ha perdut més del 70 % en un altre. Cap de les dos coses va ser un error del mercat: és el seu comportament normal.',
      'El 2017 va passar d’uns 1.000 a quasi 20.000 dòlars i el 2018 va tornar a caure per davall de 4.000. Qui va entrar en el punt més alt de l’eufòria va tardar tres anys a recuperar el que havia invertit, si és que va aguantar.',
      'No servix per a res que s’assemble a l’estalvi planificat, ni per a diners que puguis necessitar. Si apareix en una cartera, apareix com una aposta xicoteta i conscient, no com un pla.',
    ],
  },

  // ── The shared lesson about buying one company ──────────────────────────
  clase_empresa: {
    title: 'Comprar una sola empresa',
    body: [
      'Fins ara has comprat índexs: centenars d’empreses alhora. A partir d’ací pots comprar accions d’una sola. És una decisió distinta, no una versió més concentrada de la mateixa.',
      'Quan compres un índex, que una empresa faça fallida et costa la part que pesava i poc més. Quan compres una sola empresa, que faça fallida et costa tot el que hi vas posar. Això s’anomena risc específic, i és l’únic risc que la diversificació sí que elimina per complet i de franc.',
      'A canvi, una sola empresa pot multiplicar per cinquanta el que cap índex multiplicarà mai. Les dos cares venen juntes: no existix la versió que només puja.',
      'En este joc les empreses es presenten sense nom, només amb el seu sector, el seu país i l’any en què van eixir a borsa. No és un capritx. Si et diguérem el nom, no estaries decidint: estaries recordant com va acabar la història, que és justament el que cap inversor sap quan decidix. Els noms es revelen al final.',
    ],
  },

  // ── Company profiles, shown during play (no names) ──────────────────────
  e_apple: {
    title: 'Electrònica de consum · EUA',
    body: [
      'Una empresa que dissenya i ven aparells electrònics al consumidor final. Va eixir a borsa el 1980, en ple naixement de l’ordinador personal, quan ningú no sabia encara si allò seria un mercat de masses o una joguina per a aficionats.',
      'El seu benefici depén de vendre aparells amb marge. Això significa dependre de l’encert de cada producte nou, que la fàbrica lliure a temps i que el consumidor preferisca el seu disseny al del competidor de l’altre costat.',
      'És un negoci brutalment cíclic i de moda canviant. En electrònica de consum, el líder d’una dècada pot desaparéixer en la següent sense haver fet res evidentment mal, simplement perquè va canviar el que la gent volia comprar.',
      'Durant els anys huitanta i noranta este tipus de companyia va viure una guerra de preus ferotge contra fabricants més barats. Sobreviure no estava garantit, i diverses de les marques més conegudes d’aleshores ja no existixen.',
    ],
  },
  e_msft: {
    title: 'Programari · EUA',
    body: [
      'Una empresa que ven programes informàtics. Va eixir a borsa el 1986, quan el programari començava a separar-se del maquinari i a vendre’s com un producte amb vida pròpia.',
      'El programari té una economia peculiar: fabricar la primera còpia costa una fortuna i les següents són quasi gratis. Si aconseguixes que molta gent use el teu, cada client addicional és quasi tot benefici.',
      'El risc és que eixa mateixa lògica premia el que arriba primer i castiga el segon. I que un canvi de plataforma —de l’escriptori al mòbil, del programa al núvol— pot deixar obsoleta una posició que paregue inexpugnable.',
      'Als anys noranta este sector va generar les fortunes més grans de la borsa estatunidenca i també les desaparicions més grans. Que una empresa domine el seu mercat hui no diu res sobre quin mercat existirà d’ací a quinze anys.',
    ],
  },
  e_amzn: {
    title: 'Comerç electrònic · EUA',
    body: [
      'Una empresa que ven productes per internet. Va eixir a borsa el 1997, en ple arrancada de la xarxa comercial, quan comprar sense vore el producte encara li pareixia extravagant a la majoria de la gent.',
      'El model consistix a vendre molt amb marges molt xicotets i reinvertir tot el que entra a créixer més de pressa. Durant anys, una empresa així pot facturar quantitats enormes i no donar cap benefici, a propòsit.',
      'Eixe és exactament el risc: si el creixement s’atura abans que l’escala compense els marges, el que queda és una empresa gran que perd diners. Moltes de les botigues en línia de finals dels noranta van acabar així.',
      'El 2000 i el 2001 la majoria de les empreses d’internet que havien eixit a borsa van desaparéixer o van perdre més del 90 % del seu valor. Unes poques van sobreviure a la rebentada. Des de dins de l’any 2000 no hi havia manera de saber quines.',
    ],
  },
  e_nvda: {
    title: 'Semiconductors · EUA',
    body: [
      'Una empresa que dissenya xips especialitzats. Va eixir a borsa el 1999, quan el seu mercat principal eren les targetes gràfiques per a videojocs, un nínxol respectable i no molt més.',
      'Guanya diners dissenyant xips que fabriquen uns altres i venent-los a fabricants d’ordinadors. Si el seu disseny és millor que el de la competència en la generació que toca, s’emporta el mercat; si no, es queda amb el magatzem ple.',
      'Els semiconductors són el sector més cíclic de la borsa. Alternen anys d’escassesa amb preus altíssims i anys d’excés de capacitat en què ningú no compra. Caigudes del 70 % i pujades del 200 % conviuen en la mateixa dècada.',
      'Este tipus de companyia depén a més que l’ús principal dels seus xips continue existint. Un canvi en per a què servix el producte pot transformar un nínxol en un mercat gegantesc, o al revés, i rarament s’anuncia amb antelació.',
    ],
  },
  e_itx: {
    title: 'Tèxtil · Espanya',
    body: [
      'Una empresa espanyola de moda amb botigues pròpies. Va eixir a borsa el 2001, amb un model de producció ràpida que reposava els aparadors en setmanes en lloc de en temporades.',
      'Guanya diners venent roba amb marge i rotant l’inventari molt de pressa. Com menys temps passa una peça a la botiga, menys rebaixes calen i més net queda el benefici.',
      'El risc del tèxtil és que depén del gust del client, que canvia sense avisar, i del consum de les famílies, que s’enfonsa en les recessions. A més, expandir-se fora del país obliga a encertar en mercats que no coneixes.',
      'El sector tèxtil espanyol venia de dos dècades dures: la competència asiàtica havia tancat bona part de la producció nacional. Que una empresa d’este ram isquera a borsa el 2001 no pareixia, des de fora, una història de creixement.',
    ],
  },
  e_nokia: {
    title: 'Telefonia mòbil · Finlàndia',
    body: [
      'Una empresa finlandesa que fabrica telèfons mòbils. Cotitza en les borses internacionals des del 1994, just quan el mòbil passava de ser una eina de treball cara a un objecte de consum massiu.',
      'Guanya diners venent aparells en volums enormes. Un mercat que creix a este ritme permet créixer sense llevar-li clients a ningú: basta que cada any hi haja més gent que vulga un telèfon.',
      'El risc arriba el dia que tot el món ja en té un. Aleshores l’única manera de créixer és que el client canvie d’aparell, i ací el que mana deixa de ser la fabricació i passa a ser el programari i el disseny.',
      'La història de l’electrònica de consum està plena de líders absoluts que van perdre el seu mercat en cinc anys per no vore vindre un canvi de tecnologia. Dominar hui no protegix de res demà.',
    ],
  },
  e_terra: {
    title: 'Portal d’internet · Espanya',
    body: [
      'Un portal d’internet espanyol, filial d’una gran empresa de telecomunicacions. Va eixir a borsa el 1999, en el moment de màxim entusiasme per qualsevol negoci relacionat amb la xarxa.',
      'El seu model era atraure visites i monetitzar-les amb publicitat i serveis. El 1999 ningú no sabia encara quant valia realment una visita, i les valoracions es feien comptant usuaris en lloc de beneficis.',
      'Eixe és el risc sencer: una empresa valorada per allò que promet i no per allò que ingressa depén que el relat aguante. El dia que el mercat comença a demanar beneficis, no hi ha sòl per davall.',
      'Els portals d’internet de 1999 van eixir a borsa a preus que implicaven que quasi tots ells serien enormes. Aritmèticament no ho podien ser tots, i el mercat va tardar uns mesos a fer eixe compte.',
    ],
  },
  e_enron: {
    title: 'Energia · EUA',
    body: [
      'Una companyia energètica estatunidenca que cotitza des de mitjan huitanta. Va començar transportant gas i es va anar transformant en alguna cosa més paregut a una empresa financera que comerciava amb contractes d’energia.',
      'Un negoci així guanya diners per diferències entre el que compra i el que ven, i per operacions complexes que són difícils d’explicar en una junta d’accionistes. Els seus comptes són, per naturalesa, complicats de llegir.',
      'Ací està el risc específic d’este perfil: quan ni els analistes que la cobrixen saben explicar d’on ix el benefici, ningú no està vigilant de debò. La confiança substituïx la comprensió.',
      'Durant els anys noranta va ser una de les empreses més admirades dels Estats Units i va guanyar premis a la innovació empresarial any rere any. Ser la favorita de tot el món no és informació sobre la solidesa de res.',
    ],
  },
  e_popular: {
    title: 'Banca · Espanya',
    body: [
      'Un banc comercial espanyol, cotitzat des de fa dècades i amb fama de gestió prudent i rendible. El seu negoci és el de sempre: captar depòsits, donar crèdits i viure de la diferència.',
      'El benefici depén del marge entre el que paga pels diners i el que cobra per prestar-los, i que els crèdits es tornen. Un banc ben gestionat en un país que creix és una màquina de guanyar diners molt estable.',
      'El risc d’un banc no s’assembla al de cap altra empresa. Treballa amb moltíssims diners prestats sobre molt poc capital propi, així que una part xicoteta de crèdits impagats pot endur-se per davant tot el capital.',
      'La banca espanyola va concentrar durant anys bona part de la seua cartera en promoció immobiliària. Mentre els pisos pujaven, eixos crèdits eren els més rendibles del balanç.',
    ],
  },

  // ── Reveals, shown only at the end ──────────────────────────────────────
  e_apple_reveal: {
    title: 'Era Apple',
    body: [
      'L’empresa d’electrònica de consum que va eixir a borsa el 1980 era Apple. Durant quinze anys va ser una inversió mediocre i a mitjan dels noranta va estar a punt de quedar-se sense diners.',
      'La companyia que va estar a punt de desaparéixer el 1997 es va convertir després en la més valuosa del món, amb l’iPod, l’iPhone i tot el que va vindre darrere. Qui la va comprar el 1980 i no la va vendre mai va multiplicar els seus diners per milers.',
      'El detall incòmode és que per a aconseguir-ho calia aguantar caigudes superiors al 70 % en tres ocasions distintes, inclosa una època en què la premsa especialitzada donava l’empresa per morta.',
      'La lliçó no és «calia comprar Apple». És que les grans revalorizacions exigixen suportar trams en què tot el món, amb arguments raonables, et diu que t’has equivocat.',
    ],
  },
  e_msft_reveal: {
    title: 'Era Microsoft',
    body: [
      'L’empresa de programari que va eixir a borsa el 1986 era Microsoft. En tretze anys va multiplicar el seu valor per més de tres-cents i va convertir en milionaris bona part dels seus primers empleats.',
      'Després va vindre l’altra meitat de la història: des del màxim de l’any 2000 va tardar més de setze anys a tornar a valer el mateix. Qui la va comprar al cim de l’entusiasme va tindre raó sobre l’empresa i tot i això va perdre diners durant mitja vida laboral.',
      'La companyia va continuar guanyant diners tots eixos anys. El que estava car no era el negoci: era el preu que el mercat li havia posat al negoci.',
      'Encertar amb l’empresa i equivocar-se amb el preu d’entrada són coses distintes, i la segona costa tant com la primera.',
    ],
  },
  e_amzn_reveal: {
    title: 'Era Amazon',
    body: [
      'La botiga en línia que va eixir a borsa el 1997 era Amazon. El 1998 va multiplicar el seu valor per deu i el 2000 i el 2001 ho va perdre quasi tot: va arribar a caure més d’un 90 % des del seu màxim.',
      'Molts accionistes van vendre en aquella caiguda, i tenien motius: l’empresa perdia diners, la premsa donava per fet que faria fallida i totes les seues competidores estaven desapareixent de veritat.',
      'Qui va aguantar va veure l’empresa convertir-se en una de les més grans del món. Però «qui va aguantar» amaga el problema: era impossible distingir des de l’any 2001 esta història de les desenes de puntcom que sí que se’n van anar a zero.',
      'Sobreviure a una caiguda del 90 % només es veu fàcil en el gràfic, i només després. En directe és indistingible d’estar-ho perdent tot.',
    ],
  },
  e_nvda_reveal: {
    title: 'Era Nvidia',
    body: [
      'L’empresa de semiconductors que va eixir a borsa el 1999 era Nvidia. Durant vint anys va ser una companyia cíclica de targetes gràfiques, amb pujades i caigudes espectaculars i cap destí evident.',
      'A partir del 2016, els seus xips van resultar ser l’eina que necessitava la intel·ligència artificial. L’empresa va passar de ser un fabricant de components per a videojocs a una de les companyies més valuoses del planeta.',
      'Res d’això figurava en el pla. L’ús que la va convertir en gegant no existia quan va eixir a borsa, i la mateixa empresa va tardar anys a entendre-ho del tot.',
      'La lliçó és incòmoda per a qualsevol que vulga vendre mètode: les revalorizacions més grans de la borsa solen vindre d’usos que ningú no havia previst, i això no es pot seleccionar per endavant.',
    ],
  },
  e_itx_reveal: {
    title: 'Era Inditex',
    body: [
      'La tèxtil espanyola que va eixir a borsa el 2001 era Inditex, la propietària de Zara. Va eixir al mercat en un sector que es donava per enfonsat a Espanya, amb un model de reposició ràpida que quasi ningú del sector creia sostenible.',
      'Dos dècades després s’havia convertit en la major empresa de moda del món per facturació i en una de les majors companyies de la borsa espanyola.',
      'És el contraexemple útil d’este joc: no calia encertar amb una tecnològica americana. Una empresa de roba, d’un país xicotet, en un sector madur i aparentment sense futur.',
      'El que va fer la diferència no va ser el sector sinó la manera d’operar dins d’ell. Això no es veu en l’etiqueta de la indústria, que és l’únic que un inversor mira de lluny.',
    ],
  },
  e_nokia_reveal: {
    title: 'Era Nokia',
    body: [
      'L’empresa finlandesa de telefonia era Nokia. Entre 1994 i 2000 va multiplicar el seu valor per més de cinquanta i va arribar a vendre un de cada tres telèfons mòbils del món.',
      'Des d’aquell màxim va perdre més del 90 % del seu valor. No va fer fallida, i continua existint, però qui va comprar l’any 2000 no ha recuperat mai el que va invertir.',
      'La companyia no va cometre cap error escandalós ni hi va haver frau. Simplement el telèfon va deixar de ser un aparell i va passar a ser un ordinador amb programari, i l’avantatge que tenia en fabricar aparells va deixar de servir de res.',
      'És el cas més útil dels nou: es pot perdre quasi tot en una empresa que mai no fa fallida, que continua venent i que tot el món coneix.',
    ],
  },
  e_terra_reveal: {
    title: 'Era Terra',
    body: [
      'El portal espanyol que va eixir a borsa el 1999 era Terra Networks, la filial d’internet de Telefónica. Va eixir a 11,81 € per acció i al febrer del 2000 va arribar a superar els 157 €.',
      'Milers de xicotets estalviadors espanyols van comprar prop d’aquell màxim, molts d’ells per primera vegada a la vida i animats per una campanya que estava per tot arreu.',
      'El 2005 Telefónica la va absorbir pagant una mica més de 3 € per acció. Qui va comprar en el màxim va perdre al voltant del 98 % dels seus diners en cinc anys.',
      'Terra és el recordatori espanyol que una empresa pot ser coneguda, estar respatllada per una gran companyia i aparéixer en tots els telediaris, i tot i això endur-se quasi tot el que hi poses.',
    ],
  },
  e_enron_reveal: {
    title: 'Era Enron',
    body: [
      'L’energètica estatunidenca era Enron. Va arribar a ser la setena empresa més gran dels Estats Units i va ser triada durant sis anys seguits la companyia més innovadora del país.',
      'A l’octubre del 2001 es va descobrir que havia ocultat milers de milions de deute en societats fora de balanç. Al desembre va presentar la major fallida de la història empresarial estatunidenca fins aleshores.',
      'Les accions van passar de més de 90 dòlars a valer zero. Molts empleats tenien a més el seu pla de pensions invertit en accions de la mateixa empresa i van perdre la faena i l’estalvi el mateix dia.',
      'La lliçó pràctica: els mateixos analistes que la recomanaven admetien no entendre del tot els seus comptes. Quan ningú no sap explicar d’on ix el benefici, la resposta prudent no és confiar, i no posar en la mateixa empresa el sou i l’estalvi és més que un consell.',
    ],
  },
  e_popular_reveal: {
    title: 'Era el Banc Popular',
    body: [
      'El banc espanyol era el Banc Popular. Durant dècades va ser considerat un dels bancs més rendibles i millor gestionats d’Europa, i una inversió conservadora de manual.',
      'La crisi immobiliària va deixar el seu balanç ple de crèdits a promotors que no es tornarien. El banc va tardar anys a reconéixer la magnitud del forat i va anar perdent valor caiguda rere caiguda.',
      'Al juny del 2017 les autoritats europees el van resoldre en una nit i el van vendre per un euro. Les accions es van cancel·lar: prop de 300.000 accionistes, molts d’ells clients de tota la vida, van perdre el cent per cent.',
      'És el desmentiment més clar que existix a la idea que les accions d’un banc gran i conegut són una inversió segura. Un banc pot desaparéixer en un cap de setmana, i l’accionista és el primer que ho paga.',
    ],
  },
};
