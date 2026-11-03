# Auditoria de codi — Servidor, dades, seguretat, privacitat i pipeline

> Annex de l'[auditoria de programació i bugs](./README.md) · setembre de 2026 · revisió de només lectura sobre `main` (`876e002`).

**Resum**

La capa de servidor està ben plantejada: els secrets només viuen al servidor, els JWT tenen l'algorisme fixat, les taules de Supabase deneguen per defecte (RLS sense polítiques), la lògica dels jocs és pura i té tests, i el pas i18n del build no deixa cap enllaç /ca/ trencat. Els problemes greus es concentren en tres fronts. **Privacitat**: el lloc publica i conserva sense límit noms i centres d'alumnat menor i carrega Vercel Analytics abans del consentiment, mentre la política afirma que no hi ha backend ni dades personals. **Integritat dels jocs de classe**: PartyKit es creu l'id que envia el client (suplantació i revelació del rol a Insider), Cajút deixa veure qui encerta mentre la pregunta està oberta, i Jocs Econòmics puntua el temps esgotat com si s'haguera triat l'opció A. **Robustesa operativa**: el rate limit bloqueja aules darrere d'una NAT, i Business Game té tokens de 30 dies sense renovació, entrades de mida il·limitada i un tancament de ronda que es pot quedar bloquejat per sempre.
21 troballes: **1 Crític, 7 Alt, 9 Mitjà, 4 Baix**. Les troballes de joc, de temps i de rate limit s'han verificat amb proves executades fora del repositori (vitest amb una configuració pròpia) i la resta llegint el codi de punta a punta i el build de `.vercel/output`.

**Punts forts**

- Secrets només al servidor: `SUPABASE_SERVICE_ROLE_KEY` i `JOCS_TOKEN_SECRET` es llegixen amb `process.env` en temps d'execució (no s'insereixen al build) i només els importen rutes `src/pages/api/**`. S'ha comprovat que ni els secrets ni el banc privat (`eco-1000-…`) apareixen a `.vercel/output/static`; el banc només és a `functions/_render.func/.../bank_*.mjs`. L'historial de git no conté claus.
- JWT: `jwt.verify(..., { algorithms: ['HS256'] })` als dos tipus de token, amb comprovació de la forma del payload. Un token de Jocs no val com a token de Business Game ni a l'inrevés.
- Anti-trampes ben encaminat: `toPublicQuestion` no envia mai `correcta` ni `explicacion` abans de respondre, el temps i la puntuació es calculen al servidor (Jocs i Cajút) i la màquina de fases és pura i té tests.
- RLS activat a les 7 taules (3 de Jocs i 4 de Business Game) i cap política: `anon` no pot llegir ni escriure res. La service role només s'usa al servidor.
- `cerrar` de Business Game reclama la ronda amb un `UPDATE … WHERE fase='decisiones'` condicional (evita el doble tancament), i els resultats es guarden amb `upsert` idempotent.
- GA4 exemplar: no es fa cap petició a Google abans del consentiment, els dos botons tenen el mateix pes (AEPD), es pot revocar des de la política i tot l'accés a `localStorage` està protegit amb `try/catch`.
- `localize-links.mjs` i `sitemap-i18n.mjs` són funcions pures amb tests. Sobre el build actual, **0 enllaços /ca/ trencats** en 34.852 enllaços de 1.705 pàgines, i tots els destins interns de les 143 redireccions de `vercel.json` existixen, sense bucles ni orígens duplicats.
- Scripts de PDF: comproven el servidor local abans de llançar pagedjs, acumulen els errors i ixen amb un codi diferent de zero. CI arreplega explícitament els desbordaments de diapositives (no depén de `set -e`).
- No hi ha cap sink `innerHTML` en tot `src/`. `jsonLdToString` escapa `<`, i els noms que escriuen els usuaris es pinten amb Preact (escapats). La façana de PartyKit captura les excepcions de cada missatge, així que un missatge mal format no fa caure la sala.

## Troballes

#### CODE-SRV-01 · Crític · privacitat — Noms i centres d'alumnat menor es publiquen i es guarden per sempre, mentre la política diu que no hi ha backend ni dades personals
- **On**: `src/pages/legal/privacidad.astro:25,28,54,64` (i en CA: `:74,77,103,113`); `src/pages/api/jocs/start.ts:86-107`; `src/pages/api/jocs/answer.ts:139-148`; `src/pages/api/jocs/leaderboard.ts:22-47`; `src/pages/api/business-game/unirse.ts:16,31-39`; `supabase/migrations/20260527_init_jocs.sql:37-48,137-144`; `supabase/migrations/20260606_init_business_game.sql:31-43`; `src/components/jocs-economics/screens/Welcome.tsx:56-85`.
- **Problema**:
  - Jocs Econòmics, enllaçat des de la portada i la capçalera, demana «Tu nombre» i l'institut. Ho guarda a Supabase (`active_games`, `scores`, `institutes`) i ho publica en un rànquing obert i en caché pública (`player_name`, `institute_display`, `finished_at`, i `top_player_name` al rànquing per centres).
  - Business Game guarda el nom d'equip, l'institut i `miembros` (els noms dels integrants), un camp que cap endpoint no llig mai.
  - Cap cron esborra `scores`, `institutes` ni `bg_*`: l'únic esborrat és el d'`active_games`. Tampoc no hi ha cap via per a exercir el dret de supressió.
  - La política diu literalment «El sitio es estático y no dispone de backend que recoja o almacene datos personales» i «La única recogida de datos es una analítica… solo se activa si tú la aceptas». Assegura també que el que es guarda en `localStorage` «nunca sale de tu dispositivo», però la identitat de Jocs i la sessió de Business Game sí que ixen.
  - No nomena Supabase, Vercel (funcions) ni PartyKit/Cloudflare, ni cap base jurídica ni termini de conservació. Promet actualitzar-se «antes de recoger ningún dato», que és el que exigix CLAUDE.md.
- **Escenari de fallada**: Una alumna de 4t d'ESO escriu «Laura Martínez» i «IES Lluís Vives». En acabar la partida es crea una fila a `scores`, i `GET /api/jocs/leaderboard?type=individual` la servix a qualsevol persona, indefinidament. Si la família en demana la supressió, no hi ha procediment ni eina, i la política diu que eixes dades no existixen. Això vulnera l'RGPD (art. 5.1.c i 5.1.e: minimització i conservació; art. 12-13: transparència; art. 17: supressió) i l'art. 7 de la LOPDGDD (menors de 14 anys).
- **Evidència**:
  ```ts
  // leaderboard.ts:22-24
  .from('scores')
  .select('player_name, institute_display, score, questions_answered, time_total_ms, finished_at')
  ```
  ```sql
  -- 20260527_init_jocs.sql:140-142: l'únic esborrat programat
  delete from active_games where finished = true or last_action_at < now() - interval '30 minutes';
  ```
- **Proposta**:
  1. Reescriure `/legal/privacidad/` (ES i CA) amb el responsable, la finalitat (concurs), la base jurídica, els encarregats (Supabase i la seua regió, Vercel, Cloudflare/PartyKit), el termini de conservació i els drets, amb la manera d'exercir-los.
  2. Minimitzar les dades: demanar un «àlies» en lloc del nom, no guardar `miembros` (o deixar de demanar-lo) i ensenyar només l'àlies o les inicials al rànquing.
  3. Conservació: un cron que tanque les «edicions» i esborre `scores` i `institutes` de més d'un curs, i les lligues `bg_*` inactives durant més de 6 mesos.
  4. Supressió: un procediment documentat (correu i script per `game_id`).
  5. Al formulari: enllaç a la política i avís per als menors de 14 anys.
- **Confiança**: Alta

#### CODE-SRV-02 · Alt · privacitat — Vercel Web Analytics es carrega a totes les pàgines abans del consentiment i la política no el menciona
- **On**: `astro.config.mjs:162-166`; injecció de `node_modules/@astrojs/vercel/dist/index.js:124-130` i `lib/web-analytics.js`; `src/pages/legal/privacidad.astro:25,30-37`.
- **Problema**: `webAnalytics: { enabled: true }` fa que l'adaptador injecte al `<head>` de cada pàgina un script que carrega `/_vercel/insights/script.js` i envia pàgines vistes a Vercel sense cap condició. S'ha comprovat al build: és a `.vercel/output/static/index.html` i fins i tot a `legal/privacidad/index.html`. CLAUDE.md diu que «Qualsevol tracker de tercers (GA4 inclòs) va darrere de consentiment previ… res es carrega fins que la persona accepta», i la política afirma que l'única analítica és la que s'accepta.
- **Escenari de fallada**: Un visitant nou rebutja el banner (o no respon). Igualment fa `GET /_vercel/insights/script.js` i envia la URL, el referrer i la seua IP a Vercel, mentre la política li diu que no se n'ha recollit res.
- **Evidència**:
  ```js
  // astro.config.mjs:162-166
  adapter: vercel({ webAnalytics: { enabled: true } }),
  ```
- **Proposta**: Hi ha dues opcions. (a) Desactivar la injecció de l'adaptador i carregar Vercel Analytics des de `__pdeLoadAnalytics`, és a dir, només després del consentiment. (b) Mantindre'l com a mesura d'audiència exempta (sense cookies i agregada), però declarar-lo a la política (Vercel Inc. com a encarregat, quines dades i amb quina base) i ajustar CLAUDE.md. En qualsevol cas, afegir un test que falle si el HTML conté `_vercel/insights` i la política no el menciona.
- **Confiança**: Alta

#### CODE-SRV-03 · Alt · seguretat — PartyKit es creu l'identitat que envia el client: es pot suplantar un company (Insider revela el rol i la paraula; Cajút permet respondre per altres)
- **On**: `party/insider/server.ts:327,335-357,388,466-503`; `party/insider/state.ts:139`; `party/cajut/server.ts:56-67,181-186`; clients a `src/lib/games-multi/insider/client.ts:43-47,77-85` i `src/lib/games-multi/cajut/client.ts:23-29`.
- **Problema**: L'id de jugador el tria el client (`?playerId=` o `msg.playerId` a Insider; `?id=` o `_pk` a Cajút), i els ids de tots els jugadors viatgen a l'estat públic (`players[].id`, `speakerOrder`, `top5`). Qualsevol connexió que porte un id que ja existix es tracta com una reconnexió legítima: rep l'estat privat d'eixe jugador i pot actuar en nom seu. No hi ha cap secret de sessió.
- **Escenari de fallada** (verificat amb una prova):
  - **Insider**, sala amb 4 alumnes: des de la consola, per a cada id de la llista pública, `new WebSocket('wss://<host>/parties/insider/ABCD?playerId=<id>&name=x')`. Cada connexió rep `{type:'private', state:{role, word}}`: la prova va obtindre `role:'impostor'` d'un jugador i `word:'Economías de escala'` dels altres tres. L'impostor aconseguix la paraula i qualsevol pot descobrir qui és l'impostor.
  - Amb la mateixa suplantació es pot votar en nom d'un altre i canviar-li el nom (`existing.name = name`, l. 480).
  - Si el profe es desconnecta més de 2 minuts, `hostPlayerId` passa a `null` i el primer alumne que envie `join` amb `asHost:true` es queda amb el control de la sala.
  - Els empats s'eliminen per «id més baix alfabèticament» (`state.ts:139`), així que qui es pose `playerId='zzzz…'` no perd mai un empat.
  - **Cajút**: una connexió amb `?_pk=x&id=<víctima>` que envie `submitAnswer` amb una opció errònia deixa registrada la resposta de la víctima (confirmat), i la víctima rep `already-answered`.
- **Evidència**:
  ```ts
  // party/insider/server.ts:327 i 388
  const playerId = url.searchParams.get('playerId') ?? conn.id;
  this.handleJoin(sender.id, msg.playerId ?? playerId, msg.name, msg.asHost ?? false);
  // party/cajut/server.ts:56
  const playerId = url.searchParams.get('id') ?? conn.id ?? randomUUID();
  ```
- **Proposta**:
  - Identitat emesa pel servidor: en el primer `join`, generar un `playerId` i un `sessionSecret` aleatori, enviar-los només pel canal privat (el client els guarda a `sessionStorage`) i exigir el secret per a reconnectar, comparant-lo en temps constant. Ignorar `msg.playerId`.
  - Host: generar un secret de host en crear la sala, exigir-lo per a recuperar el control i no donar mai el rol de host a un participant.
  - Desfer els empats amb un ordre que fixe el servidor (d'entrada o aleatori), no per l'id.
- **Confiança**: Alta

#### CODE-SRV-04 · Alt · seguretat — Cajút mostra qui encerta mentre la pregunta està oberta, i això revela la resposta correcta
- **On**: `party/cajut/state.ts:182-186,304-311`; `party/cajut/server.ts:181-197`.
- **Problema**: `recordAnswer` suma els punts a `player.score` en el mateix moment de respondre, i `handleSubmitAnswer` fa `broadcastPublic()` amb el `score` de tothom mentre la fase encara és `question` (a més, envia el `myScore` privat ja actualitzat). Qualsevol amb les DevTools obertes (pestanya WS) veu qui acaba d'encertar. Amb 3 o 4 connexions titella, una per opció, sap en mil·lisegons quina és la correcta i respon amb un bonus de velocitat quasi màxim.
- **Escenari de fallada** (verificat): quatre titelles, p0 a p3, responen les opcions 0 a 3. L'estat públic, encara en fase `question`, mostra `score>0` només per a `p<correcta>`, i l'atacant respon eixa opció.
- **Evidència**:
  ```ts
  // state.ts:184
  players.set(playerId, { ...player, score: player.score + gained });
  // state.ts:305-311 (projecció pública)
  const players = [...state.players.values()].map((p) => ({ id: p.id, nick: p.nick, score: p.score, ... }));
  ```
- **Proposta**: Guardar el guany a l'`AnswerRecord` i sumar-lo a `score` a `advanceToReveal`. Durant `question`, publicar només `hasAnswered`, i enviar `myScore` a partir de `reveal`. Afegir un test que comprove que en fase `question` no canvia cap `score` públic.
- **Confiança**: Alta

#### CODE-SRV-05 · Alt · correcció — Jocs Econòmics: quan s'acaba el temps, el client envia l'opció A i el servidor la corregix com una resposta (el 43 % del banc té `correcta: 0`)
- **On**: `src/components/jocs-economics/screens/Playing.tsx:40-47`; `src/components/jocs-economics/JocsApp.tsx:104-109`; `src/pages/api/jocs/answer.ts:112-127,264-276`; `src/pages/api/jocs/start.ts:118-125`.
- **Problema**:
  - El comentari de `Playing.tsx` suposa que el servidor detectarà `serverElapsedMs > 50s` i forçarà la resposta com a incorrecta. No passa: el rellotge del servidor comença quan es genera la pregunta, i el client no comença el compte enrere fins que la mostra, després dels 3 s de la pantalla de resultat i de la latència.
  - El `onAnswer(0)` automàtic arriba al servidor als ~45,3 s (primera pregunta) o als ~48,3 s (la resta), per davall del llindar de 50 s, i el servidor corregix `0 === correcta`.
  - Al banc actual, 78 de les 180 preguntes tenen `correcta: 0`, i les opcions no es barregen (Cajút sí que les barreja).
- **Escenari de fallada** (verificat sobre `answer.ts`): una pregunta amb `correcta:0` i un alumne que no toca res. El client envia 0 automàticament amb `clientElapsedMs=45100`; el servidor en compta ~48,3 s i respon `{"isCorrect":true,"scoreGain":100,"livesLeft":3}`. Un alumne que no contesta res encerta al voltant del 43 %, i qui respon sempre A també encerta el 43 %, no el 25 % esperat.
- **Evidència**:
  ```tsx
  // Playing.tsx:41-47
  // Send optionIdx=0 (valid value); the server detects serverElapsedMs > 50s
  if (remainingMs === 0 && selected === null) { setSelected(0); onAnswer(0); }
  ```
- **Proposta**:
  1. En el client, quan s'acaba el temps, enviar `optionIdx: -1` (o `timeout: true`), i que el servidor ho tracte com a incorrecta abans de validar el rang.
  2. En el servidor, fixar `current_question_started_at = now + 3000` (la durada de la pantalla de resultat) perquè els dos rellotges coincidisquen.
  3. Barrejar les opcions per partida, com fa `shuffleOptions` a Cajút, guardant la permutació a `active_games`. Reequilibrar `correcta` al banc i afegir a `src/content/jocs-preguntas.test.ts` un avís si una mateixa posició supera el 35 %.
- **Confiança**: Alta

#### CODE-SRV-06 · Alt · robustesa — El límit de 20 partides per hora i IP bloqueja classes senceres darrere de la NAT del centre
- **On**: `src/middleware.ts:10-30`.
- **Problema**: El límit es compta per `clientAddress`, que a Vercel és la IP pública (`x-forwarded-for`). Un aula comparteix IP, i sovint tot el centre (o molts centres, en xarxes educatives amb eixida centralitzada). El joc es presenta com a «concurso de economía para clase» i convida a tornar a jugar. A més, el `Map` viu en cada instància: no protegix contra un abús distribuït i no es buida mai.
- **Escenari de fallada** (verificat): 25 inicis des de `88.12.34.56` en una hora donen 20 respostes 200 i 5 respostes 429. En una classe de 25 alumnes que juguen 2 partides en 50 minuts, a partir de la 21a partida tota la classe rep `alert("Error: rate-limited")` durant fins a una hora.
- **Evidència**:
  ```ts
  const MAX_STARTS_PER_HOUR = 20;
  const ip = context.clientAddress || 'unknown';
  if (recent.length >= MAX_STARTS_PER_HOUR) { return new Response(JSON.stringify({ error: 'rate-limited' }), { status: 429 }); }
  ```
- **Proposta**: Limitar les ràfegues (per exemple, 30 per minut i IP) en lloc de 20 per hora, o comptar per IP + `institute_norm` + `playerName`. Per a un límit real, usar un magatzem compartit (Upstash o Vercel KV) i aplicar-lo també a `crear` i `unirse` (SRV-08). Mostrar un missatge comprensible quan la resposta siga 429.
- **Confiança**: Alta (mitjana quant a la magnitud: depén de quantes instàncies atenguen la classe)

#### CODE-SRV-07 · Alt · correcció — Business Game: els tokens del profe i dels equips caduquen als 30 dies i no es poden renovar
- **On**: `src/lib/business-game/server/tokens.ts:7,23-25`; `src/lib/business-game/server/api.ts:19-25`; `src/pages/api/business-game/crear.ts:46`; `src/pages/api/business-game/unirse.ts:48`.
- **Problema**: El comentari del codi diu «30 dies: una partida dura mesos», i la pàgina presenta el joc com a «simulador de empresa de curso completo». El token només s'emet en crear la lliga o en unir-s'hi. Quan caduca, `auth()` torna `null` (401), i el profe no té cap altra credencial: el codi de 6 lletres no l'identifica com a profe.
- **Escenari de fallada**: Una lliga creada l'1 d'octubre amb una ronda cada dues setmanes. El 31 d'octubre «Cerrar la ronda» respon 401 «No autorizado», i els equips tampoc poden enviar decisions. L'únic botó disponible és «Salir», que esborra la sessió, i la lliga queda òrfena per sempre.
- **Evidència**:
  ```ts
  const DEFAULT_EXPIRY_SECONDS = 60 * 60 * 24 * 30; // 30 dies: una partida dura mesos
  ```
- **Proposta**: Hi ha tres opcions, combinables. (a) Renovació lliscant: cada crida autenticada torna un token nou que el client guarda. (b) Una caducitat alineada amb la lliga (per exemple, 12 mesos), amb revocació per `token_version` a `bg_ligas`. (c) Per al profe, un codi d'administració secret, mostrat en crear la lliga, que permeta recuperar el token des d'un altre dispositiu.
- **Confiança**: Alta

#### CODE-SRV-08 · Alt · seguretat — Business Game accepta camps sense mida màxima i crides sense límit: qualsevol pot omplir la base de dades compartida o saturar una classe
- **On**: `src/pages/api/business-game/crear.ts:14-20,27-40`; `src/pages/api/business-game/unirse.ts:13-19,31-41`; `src/pages/api/business-game/estado.ts:22-27`; `supabase/migrations/20260606_init_business_game.sql:11-43`.
- **Problema**: Només es comprova la longitud mínima (`nombre.length < 2`); `nombre`, `instituto` i `miembros` no tenen màxim. `params` es copia sense validar al JSONB. No hi ha límit d'equips per lliga ni de lligues per IP, ni cap rate limit (el middleware només protegix `/api/jocs/start`). I és la mateixa instància de Supabase que usa Jocs Econòmics.
- **Escenari de fallada**:
  - (a) Un script anònim crida `POST /api/business-game/crear` en bucle amb un `nombre` de ~4 MB (el límit de cos de Vercel). Amb unes 120 crides s'arriba als ~500 MB i, al pla gratuït de Supabase, la base de dades passa a només lectura: també deixen de funcionar `start` i `answer` de Jocs.
  - (b) Un alumne que té el codi de la lliga crea un equip amb un nom d'1 MB. Cada dispositiu de la classe el descarrega amb `estado` cada 4 s (~15 MB per minut i dispositiu), i la taula del rànquing es penja.
  - (c) El mateix alumne crea 5.000 equips, i `cerrar` supera el temps màxim de la funció (vegeu SRV-09).
- **Evidència**:
  ```ts
  const nombre = String(body?.nombre ?? '').trim();                 // sense màxim
  const params = { ...DEFAULT_PARAMS, ...(body?.params && typeof body.params === 'object' ? body.params : {}) };
  ```
- **Proposta**: Validar amb límits: nom ≤ 60, institut ≤ 80, `miembros` ≤ 200 (o eliminar el camp), i `params` amb una llista blanca de claus numèriques dins de rangs. Màxim d'uns 40 equips per lliga. Rate limit per IP a `crear` i `unirse` amb un magatzem compartit. `CHECK (char_length(...) <= N)` a la base de dades com a segona barrera, i un cron que netege les lligues inactives.
- **Confiança**: Alta (mitjana quant al llindar exacte, que depén del pla de Supabase)

#### CODE-SRV-09 · Mitjà · robustesa — `cerrar` pot deixar la lliga bloquejada per sempre en `fase='resultados'` si falla res després de reclamar la ronda
- **On**: `src/pages/api/business-game/cerrar.ts:33-49,80-95`.
- **Problema**: La reclamació canvia `fase` a `resultados`. Tots els camins d'error posteriors fan `return bad(...)` sense tornar-la a `decisiones`. El bucle d'`update` per equip i l'`update` final de `bg_ligas` no comproven errors, i no hi ha cap endpoint ni botó per a desbloquejar-la.
- **Escenari de fallada**:
  - Un error transitori de Supabase (en el `select` de `bg_equipos` o en l'`upsert` de resultats), o un timeout de la funció perquè la lliga té milers d'equips (SRV-08), deixa la lliga en `resultados`.
  - Des d'aleshores, `decisiones` respon sempre 409 «La ronda no está abierta…» i `cerrar` respon sempre 409 «ya se está cerrando».
  - Si la fallada arriba a mig bucle, uns equips tenen la caixa actualitzada i d'altres no.
  - Passa el mateix amb uns `params` no numèrics, que `crear` accepta: donen `NaN`, que es convertix en `null` en columnes `not null`, error 500 i lliga bloquejada.
- **Evidència**:
  ```ts
  .update({ fase: 'resultados', ... }).eq('id', liga.id).eq('ronda', ronda).eq('fase', 'decisiones') // reclamació
  if (eqErr || !equipos || equipos.length === 0) return bad('No hay equipos en la liga', 409);        // no es desfà
  ```
- **Proposta**: Fer el tancament en una funció de Postgres (RPC) dins d'una sola transacció. Com a mínim, un `try/finally` que torne `fase` a `'decisiones'` si el tancament no acaba, comprovar els errors de cada `update` i oferir al profe un botó per a desbloquejar la ronda.
- **Confiança**: Alta

#### CODE-SRV-10 · Mitjà · seguretat — Jocs: el client decidix el temps que es registra (un `clientElapsedMs` negatiu dona 0 ms) i pot guanyar tots els desempats del rànquing
- **On**: `src/lib/jocs-economics/server/elapsed.ts:7-13`; `src/pages/api/jocs/answer.ts:126`.
- **Problema**: `max(0, min(server, client + 2000))` només acota el valor per dalt: qualsevol valor igual o inferior a −2000 dona 0. El temps total és el tercer criteri del rànquing individual i també se suma al rànquing de centres.
- **Escenari de fallada** (verificat): amb `clientElapsedMs: -999999`, el servidor registra `elapsedMsRecorded: 0` i `time_total_ms: 0`. Si dos alumnes empaten en punts i en preguntes, guanya el que edita la petició (DevTools, «Edit and resend»).
- **Evidència**: `return Math.max(0, Math.min(serverElapsedMs, clientElapsedMs + toleranceMs));`
- **Proposta**: `clamp(clientElapsedMs, serverElapsedMs - MAX_LATENCY_MS, serverElapsedMs)`, amb `MAX_LATENCY_MS` al voltant de 1500 i descomptant la pantalla de resultat (SRV-05).
- **Confiança**: Alta

#### CODE-SRV-11 · Mitjà · seguretat — Rànquing públic sense moderació: qualsevol pot reescriure el nom visible d'un altre institut
- **On**: `src/lib/jocs-economics/server/institutes.ts:15-22`; `src/pages/api/jocs/start.ts:69-93`; `supabase/migrations/20260527_init_jocs.sql:115-126`; `src/pages/api/jocs/institutes.ts:17-22`.
- **Problema**: La clau normalitzada descarta tot el que no és `[a-z0-9]` (emojis, ciríl·lic, signes…), i l'`upsert` amb `ignoreDuplicates:false` sobreescriu `institute_display` amb l'última variant rebuda. El rànquing de centres i l'autocompletat mostren eixe `institute_display`. Els noms de jugador (1-40 caràcters) tampoc es filtren. I una clau normalitzada buida («学校», «!!») agrupa centres diferents sota la mateixa clau.
- **Escenari de fallada** (verificat): `normalizeInstitute('IES Lluís Vives — ¡¡¡ПОЗОР!!!') === normalizeInstitute('IES Lluís Vives')`. Un alumne d'un altre centre juga amb eixe text i, en el següent refresc de la vista materialitzada (5 minuts com a màxim), el centre apareix així al rànquing públic i als suggeriments de tots els alumnes que escriguen «lluis». Amb el camp del nom de jugador, a més, es poden publicar insults acompanyats del nom d'un company.
- **Evidència**: `.upsert({ institute_norm: instituteNorm, institute_display: institute, ... }, { onConflict: 'institute_norm', ignoreDuplicates: false })`
- **Proposta**: No sobreescriure `institute_display` (conservar la primera variant o la més freqüent). Rebutjar els noms amb clau normalitzada buida o massa curta, eliminar els caràcters de control i bidi, i afegir una llista de paraules vetades. Una eina mínima de moderació (columna `hidden` i un script) i una via per a demanar retirades.
- **Confiança**: Alta

#### CODE-SRV-12 · Mitjà · correcció — Cajút: expulsar un jugador al lobby no funciona, perquè el client es reconnecta sol i torna a entrar
- **On**: `party/cajut/server.ts:205-217`; `src/lib/games-multi/cajut/client.ts:32-39`; `node_modules/partysocket/dist/ws.js:409-412`.
- **Problema**: `doKick` elimina el jugador i tanca la connexió des del servidor. Però PartySocket es reconnecta automàticament després de qualsevol tancament que no haja iniciat el mateix client, i el seu `onOpen` torna a enviar `join` amb el mateix nick. En fase `lobby`, `addPlayer` l'accepta de nou. No hi ha cap llista d'expulsats.
- **Escenari de fallada** (verificat al servidor): un alumne entra amb un nick ofensiu, el profe l'expulsa des del projector i, en un segon, torna a aparéixer amb el mateix nick. No deixa d'entrar fins que comença la partida.
- **Evidència**: `this.room.getConnection(connId)?.close();` + `_handleClose = (event) => { this._clearTimeouts(); if (this._shouldReconnect) this._connect(); ... }`
- **Proposta**: Un `banned: Set<string>` per sala que rebutge `onConnect` i `join` dels ids expulsats, i un missatge `kicked` perquè el client cride `socket.close()`. Com que ara l'id el tria el client (SRV-03), cal combinar-ho amb la identitat emesa pel servidor.
- **Confiança**: Alta

#### CODE-SRV-13 · Mitjà · robustesa — Insider no valida els missatges: un impostor eliminat pot congelar la partida i una sola connexió pot registrar jugadors sense límit
- **On**: `party/insider/server.ts:466-550,673-709`; `party/insider/state.ts:181-183`.
- **Problema**: `handleGuess` crida `clearPhaseTimer()` abans d'`applyGuess`, que fa `guessWord.trim()` sense comprovar el tipus. Si falla, la sala es queda en `guess` sense temporitzador, i `advancePhase` no té cap cas per a `guess`. A més, `handleJoin` accepta qualsevol `msg.playerId` nou des de la mateixa connexió, sense límit de jugadors i sense validar el tipus ni la longitud de `name`.
- **Escenari de fallada** (verificat):
  - L'impostor atrapat envia `{"type":"guess","word":42}` i es produïx una excepció (PartyKit la registra). Deu minuts després la fase continua sent `guess`, i el profe rep «Cannot advance from phase: guess». Només pot fer `restart`, i es perden les puntuacions.
  - Una sola connexió que envia 500 `join` amb ids nous i noms de 1.000 caràcters deixa 504 jugadors registrats, i cada `broadcastPublic` envia la llista sencera a tots els mòbils de la classe.
- **Evidència**:
  ```ts
  this.clearPhaseTimer();
  const { state: stateAfterGuess, guessCorrect } = applyGuess(this.state, word); // word sense validar
  ```
- **Proposta**: Validar cada `ClientMsg` en entrar amb un esquema de tipus i longituds (`name` d'1 a 20 caràcters; `word` un string de com a màxim 40). Moure `clearPhaseTimer` després de la validació. Afegir `MAX_PLAYERS` (40, com a Cajút) i un sol jugador per connexió, i tractar `guess` a `handleAdvancePhase`.
- **Confiança**: Alta

#### CODE-SRV-14 · Mitjà · privacitat — A Insider, el nom de l'alumne va a la URL (`?name=`) i, si s'ha acceptat l'analítica, arriba a Google Analytics
- **On**: `src/components/games/insider/PlayerApp.tsx:147-152`; `src/components/Analytics.astro:37`.
- **Problema**: `handleJoin` navega a `?room=ABCD&name=<nom>`. `gtag('config', id)` envia per defecte `page_location` amb la URL completa, query inclosa. A més, el nom queda a l'historial de l'ordinador compartit de l'aula.
- **Escenari de fallada**: En un ordinador d'aula on algú va acceptar l'analítica, una alumna escriu «Laura García». GA4 rep `page_location=…/juegos/insider/?room=ABCD&name=Laura%20Garc%C3%ADa`: una dada personal d'una menor enviada a Google, contra les condicions de GA i contra la política («métricas agregadas, nunca fichas individuales»).
- **Evidència**: `url.searchParams.set('name', name); window.location.href = url.toString();`
- **Proposta**: Guardar el nom a `sessionStorage` (com ja fa Cajút) i no posar-lo a la URL. A més, configurar `gtag('config', id, { page_location: location.origin + location.pathname })` perquè no s'envie mai la query.
- **Confiança**: Alta

#### CODE-SRV-15 · Mitjà · rendiment — Business Game consulta el servidor cada 4 s indefinidament, també amb la lliga tancada o la pestanya amagada
- **On**: `src/components/business-game/BusinessGameOnline.tsx:43-71`; `src/pages/api/business-game/estado.ts:22-27`; `src/lib/business-game/server/api.ts:10`.
- **Problema**: L'interval no té en compte ni la `fase` ni `document.hidden`. La sessió es recupera de `localStorage`, així que si es torna a obrir la pàgina setmanes després, el polling es reprén. Cada consulta és una invocació de funció amb 4 consultes a Supabase (entre elles un `select('*')` de tots els resultats de totes les rondes) i `cache-control: no-store`.
- **Escenari de fallada**: 30 portàtils amb la pàgina oberta durant una hora fan 27.000 invocacions. Si queden oberts en una aula d'informàtica un cap de setmana, en fan més d'1,5 milions, de l'ordre de la quota mensual d'invocacions del pla gratuït de Vercel. La transferència de Supabase també creix amb el nombre d'equips per rondes.
- **Evidència**: `const id = setInterval(() => refrescar(sesion.codigo), 4000);`
- **Proposta**: Aturar el polling quan `fase === 'cerrada'` i pausar-lo amb `visibilitychange`. Fer l'interval adaptatiu (4 s en `resultados`, entre 15 i 30 s en `decisiones`). Seleccionar només les columnes necessàries i posar `s-maxage=3, stale-while-revalidate` a `estado` perquè tota la classe compartisca la mateixa resposta.
- **Confiança**: Alta (les xifres de cost són estimacions)

#### CODE-SRV-16 · Mitjà · seguretat — Script de tercers sense versió fixada ni SRI (`unpkg.com/pagedjs`) en pàgines públiques
- **On**:
  - Es carrega sempre: `src/pages/emprendimiento/entrevista-emprendedores/imprimir.astro:101`.
  - Es carrega amb `?preview`: `src/pages/[asignatura]/libro/imprimir.astro:1122`, `[asignatura]/actividades/imprimir/[modo].astro:720`, `[asignatura]/programacion/imprimir.astro:129`, `[asignatura]/proyecto/imprimir.astro:145`, `[asignatura]/ebau/imprimir.astro:156` i `emprendimiento/proyecto/imprimir.astro:136`.
- **Problema**: Es carrega `https://unpkg.com/pagedjs/dist/paged.polyfill.js` sense fixar la versió ni l'`integrity`, i s'executa amb l'origen de profedeeconomia.es. Per tant, té accés a `localStorage`, on hi ha els tokens de Business Game i les identitats de Jocs. La pàgina de l'entrevista el carrega sempre, contra el que diu la política («cargar una página no comunica tu IP a ningún proveedor externo»). A més, segons el comentari del llibre, carregar-lo al mateix temps que pagedjs-cli provoca conflictes.
- **Escenari de fallada**: npm publica una nova versió major de `pagedjs`, o algú compromet el paquet: totes les pàgines d'impressió executen codi nou o aliè sense cap canvi al repositori. I cada visita a `/emprendimiento/entrevista-emprendedores/imprimir/` envia la IP del visitant a unpkg/Cloudflare sense consentiment.
- **Evidència**: `<script src="https://unpkg.com/pagedjs/dist/paged.polyfill.js"></script>`
- **Proposta**: Servir el polyfill des del domini propi, copiant `node_modules/pagedjs/dist/paged.polyfill.js` a `public/vendor/pagedjs@x.y.z/`, i aplicar també a l'entrevista el patró de `?preview`.
- **Confiança**: Alta

#### CODE-SRV-17 · Mitjà · build/CI — El manifest públic de Cajút i el banc de preguntes del servidor es despleguen per camins diferents i poden quedar desquadrats sense cap avís
- **On**: `package.json:10,33,39` (`prebuild`, `deploy:cajut`, `party:deploy`); `scripts/build-cajut-manifest.mjs`; `party/cajut/server.ts:167-168`.
- **Problema**: `public/games-multi/cajut/manifest.json`, la llista d'unitats que veu el profe, es regenera en cada deploy de Vercel. En canvi, `party/cajut/questions.generated.json` només s'actualitza quan algú executa a mà `npm run deploy:cajut` (i `party:deploy` ni tan sols el regenera). Si el servidor no té la unitat triada, `handleStartMatch` fa `return` sense avisar.
- **Escenari de fallada**: El PR #263 (2026-09-16) va substituir tots els tests d'Eco 4ESO (unitats 1-12 noves). Si PartyKit no s'ha tornat a desplegar després, el profe tria «Unidad 11» al projector, prem «Començar» i no passa res: el banc no té preguntes per a eixa unitat i no hi ha cap missatge. Les unitats 1-10 servixen preguntes del temari antic amb els títols nous.
- **Evidència**: `const pool = getPool(asignaturaSlug, unidades); if (pool.length === 0) return;`
- **Proposta**: Desplegar PartyKit des de CI a `main` quan canvien `party/**` o `src/content/asignaturas/*/tests/**`. Incloure un hash `bankVersion` al manifest i al servidor, i avisar quan no coincidisquen. Enviar al host un error `empty-pool` en lloc de callar.
- **Confiança**: Mitjana (el mecanisme és segur; l'estat actual depén de l'últim deploy manual)

#### CODE-SRV-18 · Baix · correcció — El rànquing de centres diu «participantes», però compta noms diferents entre les 5 millors partides (sempre ≤ 5), i un sol alumne pot omplir el top 5 del seu centre
- **On**: `supabase/migrations/20260527_init_jocs.sql:78-106`; `src/components/jocs-economics/screens/Leaderboard.tsx:96`; `src/pages/jocs-economics/index.astro:24` («la media de tu instituto»).
- **Problema**: `top5` es calcula per partida (files de `scores`), no per alumne, i `players_count = count(distinct player_name) from top5`. A més, la pàgina parla d'una «media» quan és una suma.
- **Escenari de fallada**: Un centre amb 200 participants mostra «5 participantes». Un alumne que juga 5 bones partides fa ell sol tot el total del centre, que mostra «1 participantes».
- **Proposta**: Quedar-se primer amb la millor partida de cada parella (institut, jugador) i després fer el top 5. Calcular `players_count` sobre tot `scores` i corregir el text («suma de les 5 millors»).
- **Confiança**: Alta

#### CODE-SRV-19 · Baix · SEO — Les redireccions de `/[asignatura]/tests` només funcionen sense la barra final
- **On**: `astro.config.mjs:215-226`, que genera en `.vercel/output/config.json` rutes com `"src": "^/edmn-2bach/tests$"`.
- **Problema**: La ruta generada no admet la barra final. `/edmn-2bach/tests/`, la forma que usa el lloc i la que tenia indexada Google, servix la pàgina antiga amb `noindex,nofollow`, que encara està enllaçada des del hub de cada assignatura. Les URL `/ca/*/tests` no tenen cap redirecció. La configuració diu una cosa i el lloc en fa una altra.
- **Escenari de fallada**: Un enllaç extern o un marcador a `https://www.profedeeconomia.es/eco-1bach/tests/` rep un 200 amb `noindex,nofollow` en lloc del 301 cap a `/eco-1bach/actividades-dinamicas/`, i l'autoritat de la URL antiga no es transferix.
- **Proposta**: Triar una de les dues opcions. (a) Si es manté el hub `/tests/`, eliminar eixes entrades de `redirects`. (b) Si no, eliminar la pàgina i passar la redirecció a `vercel.json` amb `/:slug/tests/?` més les variants `/ca/`.
- **Confiança**: Alta

#### CODE-SRV-20 · Baix · build/CI — El filtre de CI que decidix quins decks comprovar ignora `global.css`, la ruta del deck i els diagrames que es pinten dins de les diapositives
- **On**: `scripts/ci-changed-decks.mjs:31-36`; `src/pages/[asignatura]/diapositivas/[unidad].astro:6-10`; `src/components/slides/SlideDiagramMount.astro:4-…`.
- **Problema**: `ENGINE_PREFIXES` només inclou `src/lib/slides/`, `src/components/slides/`, `slides.css` i el mateix script. Però les diapositives també depenen de `src/styles/global.css` (tokens i fonts), de la ruta `[unidad].astro`, de les dotzenes de `src/components/diagrams/*` i de les dependències de `package-lock.json`.
- **Escenari de fallada**: Un PR que amplia un diagrama (`src/components/diagrams/BreakEvenChart.astro`) o que augmenta la mida de la lletra a `global.css`. CI imprimix «No deck can have moved — skipping the overflow check», i el PR es fusiona amb diapositives que desborden.
- **Proposta**: Afegir a `ENGINE_PREFIXES` `src/styles/global.css`, `src/components/diagrams/`, `src/pages/[asignatura]/diapositivas/` i `package-lock.json`, amb el test corresponent.
- **Confiança**: Alta

#### CODE-SRV-21 · Baix · correcció — Cajút no fa servir mai les traduccions `.ca.md` dels tests: `/ca/juegos/cajut/` sempre juga en castellà
- **On**: `scripts/build-cajut-manifest.mjs:66-68,80-81`.
- **Problema**: El script llig tots els `.md` de `tests/`, inclosos els 90 `.ca.md`, i els agrupa per (assignatura, unitat) amb `Map.set`, sense mirar `lang`. Per a cada unitat es queda amb l'últim fitxer llegit. Amb l'ordre de `strcmp` de `scandir`, `NN-slug.ca.md` va abans que `NN-slug.md` i per això sempre guanya el castellà: els 90 parells col·lisionen i les traduccions es descarten en silenci. Les preguntes i els títols de les unitats del manifest ixen en castellà també a la interfície CA, i el resultat depén d'un ordre de fitxers implícit.
- **Escenari de fallada**: Un profe obri `/ca/juegos/cajut/host/`: la interfície és en valencià, però la llista d'unitats i totes les preguntes ixen en castellà, tot i que les traduccions existixen.
- **Proposta**: Filtrar per `lang` i generar un banc per idioma (claus `${lang}:${slug}/${n}`), fer que el host envie el `locale` en `startMatch`, i afegir un fixture `.ca.md` a `scripts/build-cajut-manifest.test.mjs`.
- **Confiança**: Alta

## Deute tècnic i millores

- **Dependències** (`npm audit`: 41 avisos, 2 crítics i 23 alts).
  - En temps d'execució: `astro@5.18.1` (GHSA-j687-52p2-xcff, XSS a `define:vars`; XSS per noms d'atribut en *spread*; *replay* de server islands) i `@astrojs/vercel@9.0.5` (GHSA-mr6q-rp88-fx84: canvi de ruta sense autenticar amb `x-astro-path`, codi visible a `serverless/entrypoint.js`). L'exposició pràctica és baixa: les rutes SSR només tornen JSON i cap dada d'usuari arriba a `define:vars` ni a server islands. Tot i això, cal planificar l'actualització major.
  - En build i desenvolupament: `pagedjs-cli@0.4.3` porta `puppeteer@20` (tar-fs, ws, extract-zip); també `partykit` (esbuild, miniflare) i `vitest`.
- **Dependències no declarades**: `puppeteer`, que arriba de rebot per `pagedjs-cli`, s'importa directament a `scripts/build-deck-pdf.mjs`, `build-og-images.mjs`, `build-logo.mjs` i `build-screenshots.mjs`. `yaml` s'importa a `build-deck-pdf.mjs` i als tests. `@astrojs/check` i `typescript` haurien d'anar a `devDependencies`. `html2canvas` i `jspdf` sí que s'usen (`src/lib/plantillas/export.ts`, `GeneradorCVEuropass.tsx`), però millor amb `import()` dinàmic.
- **Observabilitat**: Sentry apareix a CLAUDE.md però no està connectat, i cap ruta de `src/pages/api/**` registra els errors de Supabase: la majoria es descarten sense ni un `console.error`.
- **Capçaleres** (`vercel.json`): només hi ha `nosniff`, `X-Frame-Options: SAMEORIGIN` i `Referrer-Policy`. Falten una CSP (almenys `script-src 'self' 'unsafe-inline' https://www.googletagmanager.com`) i `Permissions-Policy`, i cal confirmar amb `curl -I` que el domini servix HSTS. `SAMEORIGIN` impedix incrustar recursos a Aules, Moodle o Google Sites; si es vol permetre, cal `frame-ancestors` per a `/recursos/` i `/juegos/`.
- **`/_image`**: queda exposat a la funció SSR amb sharp (`.vercel/output/config.json`) i permet transformacions d'imatge a demanda per a qualsevol. Si no cal en temps d'execució, desactivar-lo.
- **Regió de les funcions**: no està fixada en el codi (`_render.func/.vc-config.json` no té `regions`), mentre que Supabase és a `eu-central-1`. Si el projecte està en `iad1`, cada consulta travessa l'Atlàntic. Fixar `fra1`.
- **Supabase**:
  - La vista materialitzada `institute_leaderboard` no té RLS i queda exposada a `anon` via PostgREST: cal un `revoke select … from anon, authenticated`.
  - `pg_trgm` està instal·lat a `public`, i l'índex `bg_ligas_codigo_idx` és redundant amb la restricció `unique`.
  - Les variables `PUBLIC_SUPABASE_*` de `.env.example` i de la documentació no s'usen enlloc: millor eliminar-les.
  - `docs/jocs-economics-deploy.md` posa la service role també a Preview i Development, de manera que els *previews* escriuen al rànquing de producció.
- **JWT**: el mateix `JOCS_TOKEN_SECRET` signa dos tipus de token. Afegir claims `aud`/`typ` i verificar-los.
- **Jocs**:
  - Els errors d'`insert`/`update` es descarten a `answer.ts` i `finish.ts`, i la seqüència lectura-modificació-escriptura no és atòmica (caldria afegir `.eq('questions_answered', n)`).
  - `start.ts` i `answer.ts` responen 500 si el cos JSON és `null`.
  - `leaderboard.ts` amb `limit=abc` calcula `NaN` i respon 500, i les respostes d'error no porten `Content-Type`.
- **Business Game**: cap test dels endpoints (només n'hi ha del motor i de la validació). El token del profe es queda 30 dies a `localStorage`, també en ordinadors compartits.
- **Incident 2026-09-05**: no s'ha trobat la causa arrel i no hi ha cap guarda automàtica. Proposta: un hook `astro:build:done` que falle si una entrada publicada de `libro` o d'`actividades-dinamicas` no té la seua pàgina a `dist/`.
- **Scripts i config que han quedat enrere**:
  - `scripts/check-pdf-deploy.sh` és obsolet (ja no hi ha LFS a `.gitattributes`) i no inclou `cjd-bach`.
  - `.gitignore` conté entrades que ja no s'usen (`public/slides-assets/`, `capture:diagrams`) i `.vercel` repetit.
  - `scripts/ci-changed-decks.mjs:76` usa la guarda `file://${argv[1]}`, que falla a Windows (en els altres scripts ja s'ha canviat per `pathToFileURL`).
- **Builds que haurien de fallar i no fallen**:
  - Si falta `PUBLIC_PARTYKIT_HOST`, les pàgines de producció apunten en silenci a `127.0.0.1:1999`: el build de producció hauria de fallar.
  - `build-og-images.mjs` manté a mà la llista d'assignatures (la mateixa deriva que ja va afectar `cjd-bach`).
  - Els servidors estàtics dels scripts de PDF només registren els 404 d'assets (`[server] 404`), així que un PDF pot eixir amb imatges o fonts trencades sense fallar.
  - Els PDF comitejats (fins a 57 MB) no tenen cap comprovació d'actualitat a CI.
  - `astro.config.mjs:33`: `new Date(d).toISOString()` llança un `RangeError` en carregar la config si `actualizado_en` no és una data.
- **Menors**: el codi de sala que arriba per URL a Insider no es passa a majúscules (`PlayerApp.tsx:99-103`), i el `Map` del rate limit no es buida mai.

## Top 5

1. **CODE-SRV-01** (Crític): noms i centres de menors publicats i conservats indefinidament, amb una política de privacitat que en nega l'existència. Cal reescriure la política, minimitzar les dades (àlies) i posar conservació i una via de supressió. Revisar-ho al mateix temps que **CODE-SRV-02** (Vercel Analytics sense consentiment).
2. **CODE-SRV-06** (Alt): el rate limit de 20 partides per hora i IP trenca Jocs Econòmics en qualsevol classe que comparteix IP. És el cas d'ús principal i l'arreglada és d'una línia.
3. **CODE-SRV-03** (Alt): identitat controlada pel client a PartyKit, que permet suplantar companys, veure el rol i la paraula a Insider i respondre per altres a Cajút. Juntament amb **CODE-SRV-04** (Cajút mostra qui encerta durant la pregunta).
4. **CODE-SRV-05** (Alt): a Jocs Econòmics, deixar córrer el temps compta com triar A, i el 43 % de les preguntes tenen A com a resposta correcta. Cal marcar el timeout explícitament, alinear els rellotges i barrejar les opcions.
5. **CODE-SRV-08** i **CODE-SRV-07** (Alt): Business Game accepta entrades sense límit (pot tombar la base de dades que compartix amb Jocs) i els tokens de 30 dies deixen òrfenes les lligues de curs complet. Cal arreglar també **CODE-SRV-09** perquè una fallada no bloquege la lliga per sempre.
