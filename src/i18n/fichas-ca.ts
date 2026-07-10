import { type Locale } from './locale';

/**
 * Valencian (AVL) overlay for the four frontmatter fields the transversal hub
 * cards render. Everything else in the frontmatter — and the MDX body — stays
 * in the ES source of truth; the detail pages are not localized, so they keep
 * an ES title over ES prose.
 *
 * Keyed by the entry's stripped id (`familia/nn-slug`), the same key the hubs
 * already use as `slug`. `duracion` is omitted when it reads the same in both
 * languages (e.g. "50-55 min").
 */
export type FichaCA = Partial<{
  title: string;
  descripcion: string;
  duracion: string;
  agrupacion: string;
}>;

export type FichaOverlay = Partial<Record<string, FichaCA>>;

export function localizeFicha<T extends { title: string; descripcion: string }>(
  data: T,
  slug: string,
  overlay: FichaOverlay,
  locale: Locale,
): T {
  return locale === 'es' ? data : { ...data, ...overlay[slug] };
}

export const DEBATES_CA: FichaOverlay = {
  'dinero-tecnologia-futuro/01-criptomonedas': {
    title: 'Les criptomonedes són el futur del diner o una bombolla?',
    descripcion:
      'Un debat de taula redona sobre si les criptomonedes poden complir les funcions del diner o si són, abans que res, un actiu especulatiu.',
    agrupacion: 'Grups de 4-6 participants + moderació',
  },
  'dinero-tecnologia-futuro/02-ia-y-empleo': {
    title: 'Destruirà la IA més ocupació de la que crea?',
    descripcion:
      "Un debat parlamentari sobre l'impacte net de la intel·ligència artificial en el mercat de treball: ruptura sense precedents o continuació de la història de la tecnologia?",
    agrupacion: 'Dos equips + moderació',
  },
  'dinero-tecnologia-futuro/03-sociedad-sin-efectivo': {
    title: 'Cap a una societat sense diners en efectiu?',
    descripcion:
      "Un debat de taula redona sobre la desaparició progressiva de l'efectiu: avanç cap a més transparència i eficiència o risc d'exclusió i pèrdua de privacitat?",
    agrupacion: 'Grups de 4-6 participants + moderació',
  },
  'etica-empresa-consumo/01-rsc-vs-greenwashing': {
    title: 'La responsabilitat social de les empreses és real o greenwashing?',
    descripcion:
      "Un debat tipus judici sobre si la RSC és un instrument de canvi genuí o una ferramenta d'imatge. Ideal per a treballar ètica empresarial i pensament crític.",
    agrupacion: 'Dos equips + moderació (jutge)',
  },
  'etica-empresa-consumo/02-publicidad-menores': {
    title: "S'ha de limitar la publicitat dirigida a menors?",
    descripcion:
      "Un debat parlamentari sobre els límits ètics i legals de la publicitat quan el destinatari és un menor: protecció enfront de llibertat d'empresa.",
    agrupacion: 'Dos equips + moderació',
  },
  'etica-empresa-consumo/03-tope-sueldos-directivos': {
    title: "Hi ha d'haver un topall als sous dels alts directius?",
    descripcion:
      "Un dilema ètic sobre desigualtat salarial interna: és just que el salari d'un CEO siga centenars de vegades el del treballador de base? I és eficient o necessari?",
    agrupacion: 'Grups xicotets + posada en comú',
  },
  'globalizacion-comercio/01-proteccionismo-libre-comercio': {
    title: 'Proteccionisme o lliure comerç?',
    descripcion:
      "Un debat parlamentari sobre si obrir les fronteres comercials enriquix tothom o si l'Estat ha de protegir sectors estratègics i ocupació nacional.",
    agrupacion: 'Dos equips + moderació',
  },
  'globalizacion-comercio/02-deslocalizacion': {
    title: 'Deslocalitzar la producció: bo o dolent?',
    descripcion:
      "Una taula redona on quatre perspectives —empresa, treballador del país d'origen, treballador del país receptor, consumidor— debaten si traslladar fàbriques a l'estranger genera o destruïx valor.",
    agrupacion: 'Quatre grups amb rol assignat + moderació',
  },
  'globalizacion-comercio/03-comprar-local-vs-barato': {
    title: 'Comprar local o comprar barat?',
    descripcion:
      "Un dilema ètic on l'alumnat reflexiona sobre el seu propi comportament com a consumidor: és responsable pagar més pel que és local, o fer-ho perjudica productors del sud global?",
    agrupacion: 'Individual → parelles → posada en comú',
  },
  'mercado-estado/01-salario-minimo': {
    title: "Ha de pujar l'Estat el salari mínim?",
    descripcion:
      "Un debat parlamentari sobre la intervenció de l'Estat en el mercat de treball: protegir salaris o no destruir ocupació?",
    agrupacion: 'Dos equips + moderació',
  },
  'mercado-estado/02-tope-alquileres': {
    title: "S'han de limitar per llei els preus del lloguer?",
    descripcion:
      "Un debat sobre si els topalls legals al lloguer protegixen els llogaters o reduïxen l'oferta i agreugen el problema d'accés a l'habitatge.",
    agrupacion: 'Dos equips + moderació',
  },
  'mercado-estado/03-renta-basica': {
    title: 'Seria bona idea una renda bàsica universal?',
    descripcion:
      "Un debat de taula redona sobre si una renda incondicional per a tots els ciutadans és la millor resposta a la pobresa, la desigualtat i l'automatització de l'ocupació.",
    agrupacion: 'Dos equips + moderació',
  },
  'sostenibilidad-crecimiento/01-decrecimiento-vs-crecimiento-verde': {
    title: 'Decreixement o creixement verd?',
    descripcion:
      "Un debat de taula redona sobre si la solució a l'emergència climàtica exigix reduir la producció i el consum o si n'hi ha prou de fer-los més eficients i nets.",
    agrupacion: 'Dos grups + moderació',
  },
  'sostenibilidad-crecimiento/02-vuelos-cortos': {
    title: 'Cal limitar els vols curts pel clima?',
    descripcion:
      'Un debat parlamentari sobre si prohibir vols curts amb alternativa ferroviària és una mesura climàtica justificada o una restricció desproporcionada.',
    agrupacion: 'Dos equips + moderació',
  },
  'sostenibilidad-crecimiento/03-quien-paga-transicion': {
    title: 'Qui ha de pagar la transició ecològica?',
    descripcion:
      "Un debat de taula redona sobre si el principi 'qui contamina paga' és just i eficaç, o si el repartiment del cost de la transició ecològica ha de ser més ampli i progressiu.",
    agrupacion: 'Dos grups + moderació',
  },
  'trabajo-desigualdad/01-jornada-4-dias': {
    title: 'Cal implantar la jornada laboral de 4 dies?',
    descripcion:
      'Un debat parlamentari sobre si reduir la setmana laboral a 4 dies millora el benestar i la productivitat o introduïx costos i rigideses insostenibles.',
    agrupacion: 'Dos equips + moderació',
  },
  'trabajo-desigualdad/02-impuesto-grandes-fortunas': {
    title: 'Han de pujar els impostos a les grans fortunes?',
    descripcion:
      'Un debat parlamentari sobre si gravar més el patrimoni i la renda alta reduïx la desigualtat i finança servicis públics o llastra la inversió i la competitivitat.',
    agrupacion: 'Dos equips + moderació',
  },
  'trabajo-desigualdad/03-impuesto-sucesiones': {
    title: "És just l'impost de successions?",
    descripcion:
      "Un dilema ètic sobre si heretar riquesa hauria de tributar per a garantir la igualtat d'oportunitats o si fer-ho suposa una doble imposició que penalitza l'estalvi i el negoci familiar.",
    agrupacion: 'Dos equips + moderació',
  },
};

export const DINAMICAS_CA: FichaOverlay = {
  'decisiones-comunes/01-tragedia-comunes': {
    title: 'La tragèdia dels comuns',
    descripcion:
      'Un recurs compartit —una pesquera, una pastura— pertany a tots. Cada grup decidix quant explotar pensant en el seu benefici… i entre tots poden esgotar-lo. Se salvarà el recurs?',
    duracion: '1 sessió',
    agrupacion: 'grups de 4-5',
  },
  'decisiones-comunes/02-bienes-publicos': {
    title: 'El joc dels béns públics',
    descripcion:
      "Cada persona decidix en secret quant aporta a un fons comú que després es multiplica i es repartix entre tots per igual. Contribuiràs… o t'aprofitaràs de l'esforç dels altres?",
    duracion: '1 sessió',
    agrupacion: 'grups de 4-6',
  },
  'decisiones-comunes/03-dilema-prisionero': {
    title: 'El dilema del presoner (repetit)',
    descripcion:
      'Dos jugadors trien en secret cooperar o trair, ronda rere ronda. Trair tempta sempre, però si tots dos ho fan perden els dos. Sorgirà la cooperació a la llarga?',
    duracion: '1 sessió',
    agrupacion: 'parelles (diverses rondes)',
  },
  'decisiones-comunes/04-ventaja-comparativa': {
    title: 'Avantatge comparatiu',
    descripcion:
      "Dos «països» produïxen dos béns amb distinta eficiència. Primer produïxen aïllats; després s'especialitzen i comercien. L'alumnat comprova amb números que tots dos guanyen amb el comerç.",
    duracion: '1 sessió',
    agrupacion: 'dos «països» (grups)',
  },
  'distribucion-produccion/01-cadena-plusvalias': {
    title: 'La cadena de plusvàlues',
    descripcion:
      "Una cadena de producció transforma matèria primera en producte final. En cada baula s'afig valor… i cal decidir qui es queda amb quina part: treball, capital i intermediaris.",
    duracion: '1-2 sessions',
    agrupacion: 'grups que formen una cadena (4-6 rols)',
  },
  'distribucion-produccion/02-ultimatum': {
    title: "El joc de l'ultimàtum",
    descripcion:
      "Una parella repartix una quantitat de diners: un proposa el repartiment i l'altre només pot acceptar o rebutjar. Si rebutja, cap dels dos guanya res. Mana la lògica o la justícia?",
    duracion: '1 sessió',
    agrupacion: 'parelles',
  },
  'distribucion-produccion/03-cadena-montaje': {
    title: 'La cadena de muntatge',
    descripcion:
      'Dos equips fabriquen el mateix producte: un en cadena, amb cada persona en una tasca; un altre de manera artesanal, cadascú el fa sencer. Es cronometra i es debat la divisió del treball.',
    duracion: '1 sessió',
    agrupacion: 'dos equips grans',
  },
  'distribucion-produccion/04-reparto-fiscal': {
    title: 'El repartiment del pastís fiscal',
    descripcion:
      "La classe és un municipi amb un pressupost limitat i moltes necessitats. En assemblea, els grups defenen les seues prioritats i han de decidir junts com repartir la despesa i d'on traure els impostos.",
    duracion: '1-2 sessions',
    agrupacion: "grups d'interés + assemblea",
  },
  'empresa-organizacion/01-junta-directiva': {
    title: 'La junta directiva',
    descripcion:
      'Una empresa està en crisi i el comité de direcció —direcció general, finances, màrqueting i RRHH— ha de decidir en una reunió què fer. Cada càrrec té les seues prioritats i les seues dades.',
    duracion: '1 sessió',
    agrupacion: 'comités de 4-5 (un càrrec cada un)',
  },
  'empresa-organizacion/02-cooperativa': {
    title: 'Fundar una cooperativa',
    descripcion:
      'El grup crea una cooperativa: repartix rols, decidix com es prenen les decisions (una persona, un vot?) i com es repartixen els beneficis. Democràcia econòmica en directe.',
    duracion: '1-2 sessions',
    agrupacion: 'cooperatives de 5-7',
  },
  'empresa-organizacion/03-beer-game': {
    title: 'El joc de la cervesa (cadena de subministrament)',
    descripcion:
      "Quatre baules —fàbrica, distribuïdor, majorista i botiga— gestionen estoc sense parlar entre elles, només passant comandes. Un xicotet canvi en la demanda provoca el caos: l'efecte fuet.",
    duracion: '2 sessions',
    agrupacion: 'cadenes de 4 equips',
  },
  'empresa-organizacion/04-negociacion-proveedores': {
    title: 'Negociació amb proveïdors',
    descripcion:
      "Una empresa i el seu proveïdor negocien preu, terminis i condicions d'una comanda gran. Cada part té objectius i límits secrets. Acabarà en un tracte win-win o en un pols?",
    duracion: '1 sessió',
    agrupacion: 'parelles empresa-proveïdor + observador',
  },
  'mercat-treball/01-entrevista-trabajo': {
    title: "L'entrevista de treball",
    descripcion:
      "Role-play d'una entrevista de selecció, amb entrevistador, candidat i observadors que avaluen amb rúbrica.",
    duracion: '1-2 sessions',
    agrupacion: 'trios (entrevistador, candidat, observador)',
  },
  'mercat-treball/02-dinamica-grupo': {
    title: 'La dinàmica de grup',
    descripcion:
      "Selecció grupal: l'alumnat resol un cas en equip mentres un panell observa i avalua amb rúbrica qui destaca i com.",
    duracion: '1 sessió',
    agrupacion: 'grups de 5-6 + panell observador',
  },
  'mercat-treball/03-negociacion-salarial': {
    title: 'Negociació salarial',
    descripcion:
      'Candidat i empresa negocien sou i condicions amb informació asimètrica: cada part té el seu marge secret i el seu punt de ruptura.',
    duracion: '1 sessió',
    agrupacion: 'parelles (candidat i RRHH) + observador',
  },
  'mercat-treball/04-proceso-seleccion': {
    title: 'El procés de selecció complet',
    descripcion:
      'Una simulació per estacions que recorre el procés sencer: cribratge de CV, prova, entrevista i decisió final del comité, amb els seus biaixos inclosos.',
    duracion: '2 sessions',
    agrupacion: 'classe per estacions; comité de selecció',
  },
  'mercats-preus/01-doble-subasta': {
    title: 'La doble subhasta',
    descripcion:
      "Compradors i venedors amb valors i costos secrets negocien en un mercat obert; el preu d'equilibri emergix sol, sense que ningú l'impose.",
    duracion: '1-2 sessions',
    agrupacion: 'grup classe (mitat compradors, mitat venedors)',
  },
  'mercats-preus/02-monopolista': {
    title: 'El monopolista',
    descripcion:
      "Un únic venedor controla tot el mercat i fixa el preu. L'alumnat descobrix el poder de mercat i per què el monopoli reduïx la quantitat i perjudica el consumidor.",
    duracion: '1 sessió',
    agrupacion: 'grup classe (1 monopolista rotatiu, resta compradors)',
  },
  'mercats-preus/03-cartel': {
    title: 'El càrtel',
    descripcion:
      'Diversos productors intenten posar-se d\'acord per a pujar el preu… però cada un té la temptació de trair la resta i vendre més barat a amagatons.',
    duracion: '1 sessió',
    agrupacion: 'grups de 3-4 productors + mercat',
  },
  'sistemas-debates/01-mercado-vs-planificacion': {
    title: 'Mercat contra planificació',
    descripcion:
      "La classe es dividix: una mitat assigna recursos per mercat (preus i lliure intercanvi), l'altra per un comité central que decidix què es produïx. Al final es comparen resultats, cues i satisfacció.",
    duracion: '1-2 sessions',
    agrupacion: 'dos mitats de la classe',
  },
  'sistemas-debates/02-mas-estado-mas-mercado': {
    title: 'Més Estat o més mercat?',
    descripcion:
      "Un debat estructurat amb rols, evidència i torns sobre el paper de l'Estat en l'economia. No es tracta de guanyar, sinó d'argumentar amb dades i escoltar l'altre.",
    duracion: '1-2 sessions',
    agrupacion: 'dos equips + jutges',
  },
  'sistemas-debates/03-presupuestos-participativos': {
    title: "L'assemblea de pressupostos participatius",
    descripcion:
      "L'alumnat és la ciutadania d'un municipi que ha de decidir, en assemblea i amb un pressupost real, en quins projectes s'invertix. Propostes, debat i votació.",
    duracion: '1-2 sessions',
    agrupacion: 'grups proponents + assemblea',
  },
  'sistemas-debates/04-renta-basica': {
    title: 'Renda bàsica: el debat (peixera)',
    descripcion:
      "Un debat de peixera (fishbowl): uns pocs discutixen al centre mentres la resta observa i va rellevant. Tema: hauria d'existir una renda bàsica universal? Amb dades i arguments d'ambdós costats.",
    duracion: '1 sessió',
    agrupacion: 'cercle central rotatiu + observadors',
  },
  'teoria-juegos/01-laboratorio-juegos': {
    title: 'Laboratori de teoria de jocs',
    descripcion:
      'Un circuit d\'estacions amb diversos jocs clàssics —gallina, falcó-colom, batalla dels sexes, centpeus i coordinació—. En cada un, una matriu de pagaments real i un debat sobre la millor estratègia.',
    duracion: '2 sessions',
    agrupacion: 'parelles que roten per estacions',
  },
  'teoria-juegos/02-tipos-subasta': {
    title: 'Tipus de subhasta',
    descripcion:
      "L'alumnat puja en els quatre formats de subhasta —anglesa, holandesa, sobre tancat a primer preu i Vickrey (segon preu)— i descobrix com canvia la seua estratègia i per què de vegades guanya… però paga de més.",
    duracion: '1-2 sessions',
    agrupacion: 'grup classe (postors)',
  },
};

export const PROYECTOS_CA: FichaOverlay = {
  'etica-valores/01-consumo-con-conciencia': {
    title: 'Consum amb consciència: el cost ocult del que compres',
    descripcion:
      "Economia × Ètica i Valors: l'alumnat investiga què hi ha darrere del preu de productes quotidians i construïx una guia de consum conscient.",
    duracion: '4-5 sessions',
    agrupacion: 'Equips de 3-4',
  },
  'etica-valores/02-quien-decide-el-futuro-del-trabajo': {
    title: 'Qui decidix el futur del treball? IA, ocupació i dignitat',
    descripcion:
      "Economia × Ètica i Valors: l'alumnat investiga com l'automatització i la intel·ligència artificial transformen l'ocupació i delibera sobre quines decisions són justes per a les persones afectades.",
    duracion: '5-6 sessions',
    agrupacion: 'Equips de 3-4',
  },
  'filosofia/01-dinero-y-felicidad': {
    title: 'El diner dóna la felicitat? Economia i bona vida',
    descripcion:
      "Economia × Filosofia: l'alumnat contrasta les teories filosòfiques de la bona vida amb els indicadors econòmics de benestar i construïx una proposta alternativa al PIB.",
    duracion: '4-5 sessions',
    agrupacion: 'Equips de 3-4',
  },
  'filosofia/02-justicia-distributiva-impuestos': {
    title: "Darrere del vel: justícia distributiva i disseny d'un sistema fiscal",
    descripcion:
      "Economia × Filosofia: l'alumnat confronta Rawls i Nozick sobre la justícia distributiva, aplica el vel de la ignorància al disseny d'impostos i defén un sistema fiscal raonat des d'una posició filosòfica.",
    duracion: '5-6 sessions',
    agrupacion: 'Equips de 3-4',
  },
  'filosofia/03-homo-economicus-racionalidad': {
    title: "El mite de l'homo economicus: som tan racionals com diu l'economia?",
    descripcion:
      "Economia × Filosofia: l'alumnat posa a prova el supòsit de l'agent racional confrontant l'economia del comportament (Kahneman, biaixos) amb les teories filosòfiques de la raó, la voluntat i la llibertat d'elecció.",
    duracion: '5-6 sessions',
    agrupacion: 'Equips de 3-4',
  },
  'geografia/01-el-viaje-de-un-producto': {
    title: "El viatge d'un producte: seguix la cadena global",
    descripcion:
      "Economia × Geografia: l'alumnat traça la cadena de valor global d'un producte real i analitza on es produïx cada fase, qui captura el valor i quin paper tenen els fluxos comercials.",
    duracion: '5-6 sessions',
    agrupacion: 'Equips de 3-4',
  },
  'geografia/02-recursos-estrategicos': {
    title: 'Recursos estratègics: el mapa del poder econòmic',
    descripcion:
      "Economia × Geografia: l'alumnat investiga un recurs natural estratègic (petroli, aigua, liti, terres rares…), localitza les seues reserves i esbrina com la seua geografia condiciona els preus, el comerç i les tensions geopolítiques.",
    duracion: '5-6 sessions',
    agrupacion: 'Equips de 3-4',
  },
  'geografia/03-donde-pongo-el-negocio': {
    title: 'On pose el negoci? El mapa de la millor ubicació',
    descripcion:
      "Economia × Geografia: l'alumnat actua com a consultor de localització i decidix, amb dades del territori, on obrir un negoci analitzant demanda, competència, accessibilitat i cost del sòl.",
    duracion: '5-6 sessions',
    agrupacion: 'Equips de 3-4',
  },
  'historia/01-anatomia-de-una-crisis': {
    title: "Anatomia d'una crisi econòmica",
    descripcion:
      "Economia × Història: l'alumnat dissecciona una crisi real del passat per a entendre com esclaten, com es viuen i quines lliçons deixen.",
    duracion: '5-6 sessions',
    agrupacion: 'Equips de 3-4',
  },
  'historia/02-del-trueque-a-las-criptomonedas': {
    title: 'Del bescanvi a les criptomonedes: una història del diner',
    descripcion:
      "Economia × Història: l'alumnat recorre com la humanitat va inventar i reinventar el diner, des del bescanvi fins a l'euro digital, per a entendre què és realment i per què funciona.",
    duracion: '5-6 sessions',
    agrupacion: 'Equips de 3-4',
  },
  'historia/03-la-fabrica-que-cambio-el-mundo': {
    title: 'La fàbrica que va canviar el món: la Revolució Industrial',
    descripcion:
      "Economia × Història: l'alumnat investiga com la Revolució Industrial va transformar el treball, els mercats i la vida quotidiana, i construïx un relat amb dades i testimonis de l'època.",
    duracion: '5-6 sessions',
    agrupacion: 'Equips de 3-4',
  },
  'lengua/01-podcast-de-economia': {
    title: "El podcast d'economia",
    descripcion:
      "Economia × Llengua: l'alumnat tria un concepte econòmic real i produïx un episodi de podcast que qualsevol puga entendre.",
    duracion: '5-6 sessions',
    agrupacion: 'Parelles o equips de 3',
  },
  'lengua/02-desmontar-publicidad-greenwashing': {
    title: "Desmuntar l'anunci: publicitat, persuasió i greenwashing",
    descripcion:
      "Economia × Llengua: l'alumnat analitza la retòrica de la publicitat real, detecta missatges enganyosos i greenwashing, i reescriu un anunci perquè diga la veritat sense deixar de persuadir.",
    duracion: '5-6 sessions',
    agrupacion: 'Equips de 3-4',
  },
  'matematicas/01-precio-de-la-cesta': {
    title: 'El preu de la cistella: una investigació sobre la inflació',
    descripcion:
      "Economia × Matemàtiques: l'alumnat mesura la pujada de preus amb dades reals i construïx el seu propi índex.",
    duracion: '5-6 sessions',
    agrupacion: 'Equips de 3-4',
  },
  'matematicas/02-interes-compuesto-poder-ahorro': {
    title: "El poder de l'estalvi: la màgia de l'interés compost",
    descripcion:
      "Economia × Matemàtiques: l'alumnat descobrix amb funcions exponencials com creix el diner estalviat i per què començar prompte importa tant.",
    duracion: '5-6 sessions',
    agrupacion: 'Equips de 3-4',
  },
  'matematicas/03-punto-de-equilibrio-del-mercado': {
    title: "On es creuen les corbes: el punt d'equilibri del mercat",
    descripcion:
      "Economia × Matemàtiques: l'alumnat modela l'oferta i la demanda com a funcions, resol el sistema i troba el preu i la quantitat d'equilibri.",
    duracion: '5-6 sessions',
    agrupacion: 'Equips de 3-4',
  },
  'tecnologia/01-construye-tu-calculadora': {
    title: 'Construïx la teua calculadora: un full de càlcul per a una decisió econòmica',
    descripcion:
      "Economia × Tecnologia: l'alumnat dissenya i construïx un full de càlcul que resol una decisió econòmica real amb fórmules, referències i un gràfic.",
    duracion: '4-5 sessions',
    agrupacion: 'Parelles o equips de 3',
  },
  'tecnologia/02-disena-prototipa-pon-precio': {
    title: 'Dissenya, prototipa i posa preu: un producte que cobrix els seus costos',
    descripcion:
      "Economia × Tecnologia: l'alumnat dissenya i construïx el prototip d'un producte real, estudia els seus costos (fixos i variables) i calcula a quin preu i a partir de quantes unitats comença a ser rendible (punt mort).",
    duracion: '5-6 sessions',
    agrupacion: 'Equips de 3-4',
  },
};
