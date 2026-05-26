# Jocs multijugador en xarxa — Dev i desplegament

> Document intern. Última actualització: 2026-05-26.

## Arquitectura

El lloc (Astro) es desplega a **Vercel** com sempre.
El servidor de jocs multijugador (PartyKit) es desplega **independentment** a **Cloudflare Workers/Durable Objects** via la CLI de PartyKit.

La variable d'entorn `PUBLIC_PARTYKIT_HOST` connecta tots dos:
- En dev local: `127.0.0.1:1999`
- En producció: `pde-games.<user>.partykit.dev`

---

## Dev local — dos terminals

**Terminal 1 — servidor PartyKit:**

```bash
npm run party:dev
# Inicia a http://127.0.0.1:1999
```

**Terminal 2 — Astro:**

```bash
npm run dev
# Inicia a http://localhost:4321
```

**Fitxer `.env.local`** (no es commiteja; crear-lo manualment):

```env
PUBLIC_PARTYKIT_HOST=127.0.0.1:1999
```

Obertura de prova:
- `/juegos/insider/host/` → sala del professor (projector)
- `/juegos/insider/` → entrada de l'alumne (mòbil)

---

## Primer desplegament a producció

### 1. Desplegar el servidor PartyKit

```bash
npm run party:deploy
```

La primera vegada, la CLI de PartyKit demana autenticació amb Cloudflare (s'obre el navegador automàticament). Cal tenir un compte Cloudflare (pla free és suficient).

Quan acaba, la CLI imprimeix el host del projecte, per exemple:

```
Deployed: pde-games.skinny.partykit.dev
```

### 2. Afegir la variable a Vercel

A Vercel → Settings → Environment Variables:

| Nom | Valor | Entorns |
|---|---|---|
| `PUBLIC_PARTYKIT_HOST` | `pde-games.skinny.partykit.dev` | Production, Preview |

Després de guardar-la, cal fer un nou desplegament de l'Astro perquè Vercel la injecte al build.

### 3. Verificar

Obrir `https://profedeeconomia.es/juegos/insider/host/` → ha d'aparèixer la sala del professor amb un codi de 4 caràcters.

---

## Notes de cost

PartyKit funciona sobre **Cloudflare Workers + Durable Objects**. El pla free de Cloudflare Workers inclou:

- 100.000 peticions/dia gratuïtes
- Durable Objects: 400.000 GB·s/mes gratuïts

Per a ús de classe (poques dotzenes de partides simultànies, missatges de baixa freqüència), el free tier és molt generós i cobreix perfectament la càrrega esperada. No cal configurar mètode de pagament per al MVP.

Si en el futur l'ús creix significativament (tornejos grans, ús simultani de molts centres), revisar els límits al panell de Cloudflare.

---

## Com s'uneixen els jugadors

1. El **professor** obre `/juegos/insider/host/` al projector.
2. La sala genera un **codi de 4 caràcters** (ex. `3K7P`) visible en pantalla gran.
3. Els **alumnes** obren `/juegos/insider/` al seu mòbil i introdueixen el codi.
4. El professor veu aparèixer els noms dels alumnes al lobby i inicia la partida.

Els alumnes no necessiten cap compte ni app; el mòbil necessita connexió a Internet i un navegador modern.

---

## Desplegaments posteriors del servidor

Si es fan canvis a `party/insider/server.ts` o fitxers de lògica de servidor:

```bash
npm run party:deploy
```

El servidor de PartyKit es desplega de forma independent a Astro. No cal tornar a desplegar Vercel si el canvi és només al servidor de joc (i viceversa).
