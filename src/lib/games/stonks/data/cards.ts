// src/lib/games/stonks/data/cards.ts
import type { AssetCard } from '../types';

/** Shown once, the first time any company unlocks. */
export const CLASS_CARD_ID = 'clase_empresa';

/**
 * Deep cards, shown when an asset first unlocks and re-openable from the row.
 *
 * Every card follows the same five moves: what it is as a MECHANISM, where the
 * return actually comes from, the concrete risk, something that happened in the
 * period, and — the part no commercial leaflet ever writes — what it is not for.
 *
 * Company cards come in two pieces. The one shown during play describes the
 * SECTOR and the era, never the company: a test asserts the real name never
 * appears. The `_reveal` card tells the story afterwards.
 */
export const CARDS: AssetCard[] = [
  // ── Base assets ─────────────────────────────────────────────────────────
  {
    id: 'efectivo',
    title: 'Efectivo',
    body: [
      'Dinero disponible al instante: en la cuenta corriente o debajo del colchón. No está invertido en nada, así que no puede caer de valor en euros. Ni un céntimo de riesgo de mercado.',
      'No produce nada. Ese es el trato: renuncias a cualquier rendimiento a cambio de poder usarlo hoy mismo sin avisar a nadie y sin vender nada.',
      'El riesgo del efectivo no se ve en el saldo, porque el saldo nunca baja. Se ve en lo que ese saldo compra. Con una inflación del 5 % anual, 1.000 € guardados diez años siguen siendo 1.000 € y compran lo que antes costaba 614.',
      'Entre 1974 y 1982 los precios españoles se multiplicaron por más de tres. Quien tuvo el dinero parado toda esa década perdió dos tercios de su poder de compra sin que el banco le cobrara nada ni le avisara de nada.',
      'No sirve para hacer crecer un patrimonio. Sirve para dos cosas concretas: el gasto de los próximos meses y el imprevisto que no quieres cubrir vendiendo justo cuando el mercado está en mínimos.',
    ],
  },
  {
    id: 'deposito',
    title: 'Depósito a plazo',
    body: [
      'Le prestas dinero al banco durante un plazo fijo y él te paga un interés pactado de antemano. No puedes recuperarlo antes sin penalización: esa inmovilización es justamente lo que te pagan.',
      'El rendimiento sale del negocio bancario. El banco presta ese dinero a un tipo más alto del que te paga a ti y se queda la diferencia. Por eso los depósitos rinden más cuando los tipos de interés están altos.',
      'El riesgo no es que el banco no te devuelva el dinero: en España el Fondo de Garantía cubre 100.000 € por titular y entidad. El riesgo es la inflación. Si te pagan un 4 % y los precios suben un 14 %, has perdido un 10 % de poder de compra con el dinero perfectamente a salvo.',
      'Durante los años setenta y ochenta los depósitos españoles pagaban intereses de dos dígitos, y aun así perdieron frente al IPC casi todos los años. Ganar euros y perder poder de compra a la vez no es una rareza de manual: fue lo normal durante una década entera.',
      'No sirve para hacer crecer un patrimonio a largo plazo. Sirve para el dinero que vas a necesitar dentro de uno o dos años y que no te puedes permitir ver caer.',
    ],
  },
  {
    id: 'deuda',
    title: 'Deuda pública española',
    body: [
      'Le prestas dinero al Estado a cambio de un cupón anual y la devolución del capital al vencimiento. El bono a diez años es el de referencia y se puede vender antes de tiempo en el mercado, al precio que haya ese día.',
      'El rendimiento tiene dos partes. El cupón, que es fijo y conocido. Y la variación del precio, que no lo es: cuando los tipos de interés bajan, los bonos antiguos que pagan más se vuelven más valiosos, y cuando suben, pasa lo contrario.',
      'Ahí está el riesgo, y sorprende a mucha gente que compra deuda pública creyendo que no puede perder. En 2022 los bancos centrales subieron los tipos con fuerza y la deuda europea tuvo su peor año en décadas. Un activo «seguro» puede caer con fuerza si lo vendes en el momento equivocado.',
      'Durante la crisis del euro, entre 2010 y 2012, la deuda española llegó a pagar más de un 7 % porque los inversores dudaban de que España pudiera devolverla. Quien compró entonces cobró mucho; quien ya la tenía vio caer su valor de mercado.',
      'No sirve para batir a la bolsa a treinta años. Sirve para dar estabilidad a una cartera y para cobrar una renta previsible, si aguantas hasta el vencimiento.',
    ],
  },
  {
    id: 'oro',
    title: 'Oro',
    body: [
      'Compras un metal. No una empresa que fabrica, ni un Estado que te paga intereses: un metal que está guardado en algún sitio. Su precio es exactamente lo que otra persona esté dispuesta a pagar por él.',
      'No genera nada. No paga dividendos ni cupones y hay que custodiarlo. Todo su rendimiento viene de que alguien pague más de lo que pagaste tú, normalmente porque tiene miedo: a la inflación, a una guerra, o a que su moneda pierda valor.',
      'Por eso se mueve a saltos y en tramos muy largos. Puede subir un 125 % en un año, como en 1979, y luego pasarse veinte años sin recuperar ese nivel. Quien compró oro en el máximo de enero de 1980 tardó casi tres décadas en volver a ver ese precio.',
      'Fue el gran refugio de los años setenta, cuando el dólar dejó de ser convertible en oro y la inflación se descontroló en Occidente. Y fue una inversión mediocre durante los ochenta y noventa, cuando la inflación se domó.',
      'No sirve como motor de una cartera ni como fuente de rentas. Sirve como seguro contra escenarios extremos, y los seguros normalmente cuestan dinero mientras no los necesitas.',
    ],
  },
  {
    id: 'vivienda',
    title: 'Vivienda en España',
    body: [
      'Compras un inmueble para alquilarlo. Es el activo más familiar de todos en España y también el más particular: entra en trozos muy grandes, no se puede vender por partes y tarda meses en venderse.',
      'El rendimiento tiene dos patas. El alquiler, que es una renta periódica más o menos estable. Y la revalorización del inmueble, que depende del ciclo. De ahí hay que descontar el IBI, la comunidad, las reformas y los meses en que el piso está vacío.',
      'El riesgo grande es la falta de liquidez combinada con la concentración: casi todo tu patrimonio en un solo bien, en una sola ciudad, en un solo país. Si necesitas el dinero, no puedes vender media casa, y venderla entera puede llevarte medio año.',
      'Entre 1997 y 2007 el precio de la vivienda en España se multiplicó por más de tres, y España llegó a construir más viviendas que Alemania, Francia e Italia juntas. Entre 2008 y 2013 los precios cayeron alrededor de un tercio y muchos propietarios descubrieron que un activo que «nunca baja» sí baja.',
      'No sirve para tener el dinero disponible ni para diversificar con poco capital. Sirve para generar rentas a largo plazo si puedes permitirte no venderlo en el peor momento.',
    ],
  },
  {
    id: 'bolsa_es',
    title: 'Bolsa española',
    body: [
      'Compras una participación en las mayores empresas cotizadas de España a la vez. En este juego la referencia es el Índice General de la Bolsa de Madrid hasta 1991 y el IBEX 35 con dividendos desde 1992, que es cuando se creó.',
      'El rendimiento viene de los beneficios de esas empresas: parte se reparte como dividendo y parte se reinvierte y hace crecer el negocio. Comprar el índice es comprar un trozo pequeño de la economía española cotizada.',
      'El riesgo es doble. Está la volatilidad, que es normal en cualquier bolsa. Y está la concentración sectorial: el índice español pesa mucho en bancos, energía y construcción, así que no está tan diversificado como parece por tener 35 nombres.',
      'La bolsa española perdió dinero casi todos los años entre 1974 y 1982, y luego se multiplicó por más de dos solo en 1986, el año de la entrada en la CEE. Los mismos treinta y cinco nombres pueden ser una ruina una década y una fortuna la siguiente.',
      'No sirve para dinero que necesites en los próximos años. Y no sirve como cartera única: es un solo país, y bastante pequeño en el conjunto mundial.',
    ],
  },
  {
    id: 'sp500',
    title: 'Bolsa de EE. UU.',
    body: [
      'Compras a la vez las quinientas mayores empresas cotizadas de Estados Unidos. Es el índice más seguido del planeta y el que suele usarse como sinónimo de «la bolsa» sin más.',
      'El rendimiento sale de los beneficios de esas empresas, igual que en cualquier índice. Lo que lo distingue es el peso de la tecnología y el tamaño de su mercado interior.',
      'Aquí hay un riesgo que a menudo se olvida: la divisa. Tú inviertes en euros y esas empresas ganan en dólares, así que tu resultado depende también de cómo se muevan las dos monedas. Puede sumar mucho, como en los primeros ochenta, y restar mucho, como a mediados de esa misma década.',
      'Entre 2000 y 2002 el índice perdió cerca de la mitad de su valor y tardó siete años en recuperarse. Luego llegó 2008 y volvió a caer un 37 % en doce meses. Lo que hace convincente su historia a largo plazo es precisamente que incluye esos tramos.',
      'No sirve para el corto plazo ni como cartera única. Es un solo país, aunque sea el más grande, y su buen comportamiento de las últimas décadas es un hecho del pasado, no una ley de la naturaleza.',
    ],
  },
  {
    id: 'mundial',
    title: 'Bolsa mundial',
    body: [
      'Compras un poco de las principales empresas cotizadas de los países desarrollados a la vez: Estados Unidos, Europa, Japón y el resto, cada uno según su peso. Es la forma más simple que existe de no apostar por un país concreto.',
      'El rendimiento sale de los beneficios de miles de empresas repartidas por el mundo. No dependes de que acierte un sector, ni un país, ni un gestor.',
      'Sigue siendo bolsa, así que cae cuando cae el mundo: en 2008 perdió alrededor de un 38 %. Lo que la diversificación elimina no es el riesgo de mercado, sino el riesgo de haber elegido mal el sitio.',
      'La composición cambia sola con el tiempo. En los años ochenta Japón llegó a pesar casi tanto como Estados Unidos en los índices mundiales; hoy pesa una fracción de aquello. Comprar el mundo entero te ahorra tener que adivinar esos cambios.',
      'No sirve para dinero a corto plazo ni para hacerse rico rápido. Sirve como columna vertebral de una cartera a veinte o treinta años, que es exactamente para lo que la usa «El Mercado» en esta partida.',
    ],
  },
  {
    id: 'bitcoin',
    title: 'Criptomoneda',
    body: [
      'Compras una anotación en un registro digital descentralizado. No hay empresa detrás, ni beneficios, ni banco central que la respalde: existe desde 2009 y su valor es exactamente lo que otra persona pague por ella.',
      'No genera nada en absoluto. Ni intereses, ni dividendos, ni alquileres. El cien por cien del rendimiento depende de que aparezca alguien dispuesto a pagar más de lo que pagaste tú.',
      'La volatilidad no se parece a la de ningún otro activo del tablero. Ha multiplicado su valor por más de diez en un solo año y ha perdido más del 70 % en otro. Ninguna de las dos cosas fue un error del mercado: es su comportamiento normal.',
      'En 2017 pasó de unos 1.000 a casi 20.000 dólares y en 2018 volvió a caer por debajo de 4.000. Quien entró en el punto más alto de la euforia tardó tres años en recuperar lo invertido, si es que aguantó.',
      'No sirve para nada que se parezca al ahorro planificado, ni para dinero que puedas necesitar. Si aparece en una cartera, aparece como una apuesta pequeña y consciente, no como un plan.',
    ],
  },

  // ── The shared lesson about buying one company ──────────────────────────
  {
    id: CLASS_CARD_ID,
    title: 'Comprar una sola empresa',
    body: [
      'Hasta ahora has comprado índices: cientos de empresas a la vez. A partir de aquí puedes comprar acciones de una sola. Es una decisión distinta, no una versión más concentrada de la misma.',
      'Cuando compras un índice, que una empresa quiebre te cuesta la parte que pesaba y poco más. Cuando compras una sola empresa, que quiebre te cuesta todo lo que pusiste en ella. Eso se llama riesgo específico, y es el único riesgo que la diversificación sí elimina por completo y gratis.',
      'A cambio, una sola empresa puede multiplicar por cincuenta lo que ningún índice multiplicará jamás. Las dos caras vienen juntas: no existe la versión que solo sube.',
      'En este juego las empresas se presentan sin nombre, solo con su sector, su país y el año en que salió a bolsa. No es un capricho. Si te dijéramos el nombre, no estarías decidiendo: estarías recordando cómo acabó la historia, que es justo lo que ningún inversor sabe cuando decide. Los nombres se revelan al final.',
    ],
  },

  // ── Company profiles, shown during play (no names) ──────────────────────
  {
    id: 'e_apple',
    title: 'Electrónica de consumo · EE. UU.',
    body: [
      'Una empresa que diseña y vende aparatos electrónicos al consumidor final. Salió a bolsa en 1980, en pleno nacimiento del ordenador personal, cuando nadie sabía todavía si aquello sería un mercado de masas o un juguete para aficionados.',
      'Su beneficio depende de vender aparatos con margen. Eso significa depender del acierto de cada producto nuevo, de que la fábrica entregue a tiempo y de que el consumidor prefiera su diseño al del competidor de al lado.',
      'Es un negocio brutalmente cíclico y de moda cambiante. En electrónica de consumo, el líder de una década puede desaparecer en la siguiente sin haber hecho nada obviamente mal, simplemente porque cambió lo que la gente quería comprar.',
      'Durante los años ochenta y noventa este tipo de compañía vivió una guerra de precios feroz contra fabricantes más baratos. Sobrevivir no estaba garantizado, y varias de las marcas más conocidas de entonces ya no existen.',
    ],
  },
  {
    id: 'e_msft',
    title: 'Software · EE. UU.',
    body: [
      'Una empresa que vende programas informáticos. Salió a bolsa en 1986, cuando el software empezaba a separarse del hardware y a venderse como un producto con vida propia.',
      'El software tiene una economía peculiar: fabricar la primera copia cuesta una fortuna y las siguientes son casi gratis. Si consigues que mucha gente use el tuyo, cada cliente adicional es casi todo beneficio.',
      'El riesgo es que esa misma lógica premia al que llega primero y castiga al segundo. Y que un cambio de plataforma —del escritorio al móvil, del programa a la nube— puede dejar obsoleta una posición que parecía inexpugnable.',
      'En los años noventa este sector generó las mayores fortunas de la bolsa estadounidense y también sus mayores desapariciones. Que una empresa domine su mercado hoy no dice nada sobre qué mercado existirá dentro de quince años.',
    ],
  },
  {
    id: 'e_amzn',
    title: 'Comercio electrónico · EE. UU.',
    body: [
      'Una empresa que vende productos por internet. Salió a bolsa en 1997, en pleno arranque de la red comercial, cuando comprar sin ver el producto todavía le parecía extravagante a la mayoría de la gente.',
      'El modelo consiste en vender mucho con márgenes muy pequeños y reinvertir todo lo que entra en crecer más deprisa. Durante años, una empresa así puede facturar cantidades enormes y no dar beneficio ninguno, a propósito.',
      'Ese es exactamente el riesgo: si el crecimiento se detiene antes de que la escala compense los márgenes, lo que queda es una empresa grande que pierde dinero. Muchas de las tiendas online de finales de los noventa acabaron así.',
      'En 2000 y 2001 la mayoría de las empresas de internet que habían salido a bolsa desaparecieron o perdieron más del 90 % de su valor. Unas pocas sobrevivieron al pinchazo. Desde dentro del año 2000 no había forma de saber cuáles.',
    ],
  },
  {
    id: 'e_nvda',
    title: 'Semiconductores · EE. UU.',
    body: [
      'Una empresa que diseña chips especializados. Salió a bolsa en 1999, cuando su mercado principal eran las tarjetas gráficas para videojuegos, un nicho respetable y no mucho más.',
      'Gana dinero diseñando chips que fabrican otros y vendiéndolos a fabricantes de ordenadores. Si su diseño es mejor que el de la competencia en la generación que toca, se lleva el mercado; si no, se queda con el almacén lleno.',
      'Los semiconductores son el sector más cíclico de la bolsa. Alternan años de escasez con precios altísimos y años de exceso de capacidad en que nadie compra. Caídas del 70 % y subidas del 200 % conviven en la misma década.',
      'Este tipo de compañía depende además de que el uso principal de sus chips siga existiendo. Un cambio en para qué sirve el producto puede transformar un nicho en un mercado gigantesco, o al revés, y rara vez se anuncia con antelación.',
    ],
  },
  {
    id: 'e_itx',
    title: 'Textil · España',
    body: [
      'Una empresa española de moda con tiendas propias. Salió a bolsa en 2001, con un modelo de producción rápida que reponía los escaparates en semanas en lugar de en temporadas.',
      'Gana dinero vendiendo ropa con margen y rotando el inventario muy deprisa. Cuanto menos tiempo pasa una prenda en la tienda, menos rebajas hacen falta y más limpio queda el beneficio.',
      'El riesgo del textil es que depende del gusto del cliente, que cambia sin avisar, y del consumo de las familias, que se hunde en las recesiones. Además, expandirse fuera del país obliga a acertar en mercados que no conoces.',
      'El sector textil español venía de dos décadas duras: la competencia asiática había cerrado buena parte de la producción nacional. Que una empresa de este ramo saliera a bolsa en 2001 no parecía, desde fuera, una historia de crecimiento.',
    ],
  },
  {
    id: 'e_nokia',
    title: 'Telefonía móvil · Finlandia',
    body: [
      'Una empresa finlandesa que fabrica teléfonos móviles. Cotiza en las bolsas internacionales desde 1994, justo cuando el móvil pasaba de ser una herramienta de trabajo cara a un objeto de consumo masivo.',
      'Gana dinero vendiendo aparatos en volúmenes enormes. Un mercado que crece a este ritmo permite crecer sin quitarle clientes a nadie: basta con que cada año haya más gente que quiera un teléfono.',
      'El riesgo llega el día en que todo el mundo ya tiene uno. Entonces la única forma de crecer es que el cliente cambie de aparato, y ahí lo que manda deja de ser la fabricación y pasa a ser el software y el diseño.',
      'La historia de la electrónica de consumo está llena de líderes absolutos que perdieron su mercado en cinco años por no ver venir un cambio de tecnología. Dominar hoy no protege de nada mañana.',
    ],
  },
  {
    id: 'e_terra',
    title: 'Portal de internet · España',
    body: [
      'Un portal de internet español, filial de una gran empresa de telecomunicaciones. Salió a bolsa en 1999, en el momento de máximo entusiasmo por cualquier negocio relacionado con la red.',
      'Su modelo era atraer visitas y monetizarlas con publicidad y servicios. En 1999 nadie sabía todavía cuánto valía realmente una visita, y las valoraciones se hacían contando usuarios en lugar de beneficios.',
      'Ese es el riesgo entero: una empresa valorada por lo que promete y no por lo que ingresa depende de que el relato aguante. El día que el mercado empieza a pedir beneficios, no hay suelo por debajo.',
      'Los portales de internet de 1999 salieron a bolsa a precios que implicaban que casi todos ellos serían enormes. Aritméticamente no podían serlo todos, y el mercado tardó unos meses en hacer esa cuenta.',
    ],
  },
  {
    id: 'e_enron',
    title: 'Energía · EE. UU.',
    body: [
      'Una compañía energética estadounidense que cotiza desde mediados de los ochenta. Empezó transportando gas y fue transformándose en algo más parecido a una empresa financiera que comerciaba con contratos de energía.',
      'Un negocio así gana dinero por diferencias entre lo que compra y lo que vende, y por operaciones complejas que son difíciles de explicar en una junta de accionistas. Sus cuentas son, por naturaleza, complicadas de leer.',
      'Ahí está el riesgo específico de este perfil: cuando ni los analistas que la cubren saben explicar de dónde sale el beneficio, nadie está vigilando de verdad. La confianza sustituye a la comprensión.',
      'Durante los años noventa fue una de las empresas más admiradas de Estados Unidos y ganó premios a la innovación empresarial año tras año. Ser la favorita de todo el mundo no es información sobre la solidez de nada.',
    ],
  },
  {
    id: 'e_popular',
    title: 'Banca · España',
    body: [
      'Un banco comercial español, cotizado desde hace décadas y con fama de gestión prudente y rentable. Su negocio es el de siempre: captar depósitos, dar créditos y vivir de la diferencia.',
      'El beneficio depende del margen entre lo que paga por el dinero y lo que cobra por prestarlo, y de que los créditos se devuelvan. Un banco bien gestionado en un país que crece es una máquina de ganar dinero muy estable.',
      'El riesgo de un banco no se parece al de ninguna otra empresa. Trabaja con muchísimo dinero prestado sobre muy poco capital propio, así que una parte pequeña de créditos impagados puede llevarse por delante todo el capital.',
      'La banca española concentró durante años buena parte de su cartera en promoción inmobiliaria. Mientras los pisos subían, esos créditos eran los más rentables del balance.',
    ],
  },

  // ── Reveals, shown only at the end ──────────────────────────────────────
  {
    id: 'e_apple_reveal',
    title: 'Era Apple',
    body: [
      'La empresa de electrónica de consumo que salió a bolsa en 1980 era Apple. Durante quince años fue una inversión mediocre y a mediados de los noventa estuvo cerca de quedarse sin dinero.',
      'La compañía que estuvo a punto de desaparecer en 1997 se convirtió después en la más valiosa del mundo, con el iPod, el iPhone y todo lo que vino detrás. Quien la compró en 1980 y no la vendió nunca multiplicó su dinero por miles.',
      'El detalle incómodo es que para conseguirlo había que aguantar caídas superiores al 70 % en tres ocasiones distintas, incluida una época en que la prensa especializada daba la empresa por muerta.',
      'La lección no es «había que comprar Apple». Es que las grandes revalorizaciones exigen soportar tramos en los que todo el mundo, con argumentos razonables, te dice que te has equivocado.',
    ],
  },
  {
    id: 'e_msft_reveal',
    title: 'Era Microsoft',
    body: [
      'La empresa de software que salió a bolsa en 1986 era Microsoft. En trece años multiplicó su valor por más de trescientos y convirtió en millonarios a buena parte de sus primeros empleados.',
      'Después vino la otra mitad de la historia: desde el máximo del año 2000 tardó más de dieciséis años en volver a valer lo mismo. Quien la compró en la cima del entusiasmo tuvo razón sobre la empresa y aun así perdió dinero durante media vida laboral.',
      'La compañía siguió ganando dinero todos esos años. Lo que estaba caro no era el negocio: era el precio que el mercado le había puesto al negocio.',
      'Acertar con la empresa y equivocarse con el precio de entrada son cosas distintas, y la segunda cuesta tanto como la primera.',
    ],
  },
  {
    id: 'e_amzn_reveal',
    title: 'Era Amazon',
    body: [
      'La tienda online que salió a bolsa en 1997 era Amazon. En 1998 multiplicó su valor por diez y en 2000 y 2001 lo perdió casi todo: llegó a caer más de un 90 % desde su máximo.',
      'Muchos accionistas vendieron en aquella caída, y tenían motivos: la empresa perdía dinero, la prensa daba por hecho que quebraría y todas sus competidoras estaban desapareciendo de verdad.',
      'Quien aguantó vio a la empresa convertirse en una de las mayores del mundo. Pero «quien aguantó» esconde el problema: era imposible distinguir desde el año 2001 esta historia de las decenas de puntocom que sí se fueron a cero.',
      'Sobrevivir a una caída del 90 % solo se ve fácil en el gráfico, y solo después. En directo es indistinguible de estar perdiéndolo todo.',
    ],
  },
  {
    id: 'e_nvda_reveal',
    title: 'Era Nvidia',
    body: [
      'La empresa de semiconductores que salió a bolsa en 1999 era Nvidia. Durante veinte años fue una compañía cíclica de tarjetas gráficas, con subidas y caídas espectaculares y ningún destino evidente.',
      'A partir de 2016, sus chips resultaron ser la herramienta que necesitaba la inteligencia artificial. La empresa pasó de ser un fabricante de componentes para videojuegos a una de las compañías más valiosas del planeta.',
      'Nada de eso figuraba en el plan. El uso que la convirtió en gigante no existía cuando salió a bolsa, y la propia empresa tardó años en entenderlo del todo.',
      'La lección es incómoda para cualquiera que quiera vender método: las mayores revalorizaciones de la bolsa suelen venir de usos que nadie había previsto, y eso no se puede seleccionar de antemano.',
    ],
  },
  {
    id: 'e_itx_reveal',
    title: 'Era Inditex',
    body: [
      'La textil española que salió a bolsa en 2001 era Inditex, la dueña de Zara. Salió al mercado en un sector que se daba por hundido en España, con un modelo de reposición rápida que casi nadie del sector creía sostenible.',
      'Dos décadas después se había convertido en la mayor empresa de moda del mundo por facturación y en una de las mayores compañías de la bolsa española.',
      'Es el contraejemplo útil de este juego: no hacía falta acertar con una tecnológica americana. Una empresa de ropa, de un país pequeño, en un sector maduro y aparentemente sin futuro.',
      'Lo que hizo la diferencia no fue el sector sino la forma de operar dentro de él. Eso no se ve en la etiqueta de la industria, que es lo único que un inversor mira de lejos.',
    ],
  },
  {
    id: 'e_nokia_reveal',
    title: 'Era Nokia',
    body: [
      'La empresa finlandesa de telefonía era Nokia. Entre 1994 y 2000 multiplicó su valor por más de cincuenta y llegó a vender uno de cada tres teléfonos móviles del mundo.',
      'Desde aquel máximo perdió más del 90 % de su valor. No quebró, y sigue existiendo, pero quien compró en el año 2000 no ha recuperado nunca lo invertido.',
      'La compañía no cometió un error escandaloso ni hubo fraude. Simplemente el teléfono dejó de ser un aparato y pasó a ser un ordenador con software, y la ventaja que tenía en fabricar aparatos dejó de servir de nada.',
      'Es el caso más útil de los nueve: se puede perder casi todo en una empresa que nunca quiebra, que sigue vendiendo y que todo el mundo conoce.',
    ],
  },
  {
    id: 'e_terra_reveal',
    title: 'Era Terra',
    body: [
      'El portal español que salió a bolsa en 1999 era Terra Networks, la filial de internet de Telefónica. Salió a 11,81 € por acción y en febrero de 2000 llegó a superar los 157 €.',
      'Miles de pequeños ahorradores españoles compraron cerca de aquel máximo, muchos de ellos por primera vez en su vida y animados por una campaña que estaba en todas partes.',
      'En 2005 Telefónica la absorbió pagando algo más de 3 € por acción. Quien compró en el máximo perdió alrededor del 98 % de su dinero en cinco años.',
      'Terra es el recordatorio español de que una empresa puede ser conocida, estar respaldada por una gran compañía y aparecer en todos los telediarios, y aun así llevarse casi todo lo que pongas en ella.',
    ],
  },
  {
    id: 'e_enron_reveal',
    title: 'Era Enron',
    body: [
      'La energética estadounidense era Enron. Llegó a ser la séptima mayor empresa de Estados Unidos y fue elegida durante seis años seguidos la compañía más innovadora del país.',
      'En octubre de 2001 se descubrió que había ocultado miles de millones de deuda en sociedades fuera de balance. En diciembre presentó la mayor quiebra de la historia empresarial estadounidense hasta entonces.',
      'Las acciones pasaron de más de 90 dólares a valer cero. Muchos empleados tenían además su plan de pensiones invertido en acciones de la propia empresa y perdieron el trabajo y el ahorro el mismo día.',
      'La lección práctica: los mismos analistas que la recomendaban admitían no entender del todo sus cuentas. Cuando nadie sabe explicar de dónde sale el beneficio, la respuesta prudente no es confiar, y no poner en la misma empresa el sueldo y el ahorro es más que un consejo.',
    ],
  },
  {
    id: 'e_popular_reveal',
    title: 'Era el Banco Popular',
    body: [
      'El banco español era el Banco Popular. Durante décadas fue considerado uno de los bancos más rentables y mejor gestionados de Europa, y una inversión conservadora de manual.',
      'La crisis inmobiliaria dejó su balance lleno de créditos a promotores que no se iban a devolver. El banco tardó años en reconocer la magnitud del agujero y fue perdiendo valor caída tras caída.',
      'En junio de 2017 las autoridades europeas lo resolvieron en una noche y lo vendieron por un euro. Las acciones se cancelaron: cerca de 300.000 accionistas, muchos de ellos clientes de toda la vida, perdieron el cien por cien.',
      'Es el desmentido más claro que existe a la idea de que las acciones de un banco grande y conocido son una inversión segura. Un banco puede desaparecer en un fin de semana, y el accionista es el primero que lo paga.',
    ],
  },
];

const byId = new Map(CARDS.map((c) => [c.id, c]));

export const cardFor = (id: string): AssetCard | undefined => byId.get(id);
