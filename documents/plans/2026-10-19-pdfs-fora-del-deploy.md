# Pla: treure els PDF del deploy de Vercel

**Data:** 2026-10-19 · **Estat:** proposat, pendent d'aprovació

## Problema

Vercel cobra *Deployment Storage* a $0.10/GB-mes per cada deploy que conserva. Cada deploy de
profedeeconomia ocupa ~2,5 GB, i d'aquests ~1,4 GB són PDF que gairebé no canvien. La factura és de
$2.58/dia (~$77/mes), que equival a ~775 GB guardats, és a dir, uns 300 deploys sencers.

On són els PDF (1.289 en total):

| Carpeta a `public/` | PDF | Mida | D'on surten |
|---|---|---|---|
| `downloads/` | 938 | ~990 MB | scripts `build-*-pdf.mjs` (manuals, no corren a `npm run build`) |
| `slides/` | 196 | ~295 MB | `scripts/build-deck-pdf.mjs` |
| `ebau-examenes/` | 125 | ~57 MB | posats a mà |
| `olimpiada/` | 30 | ~14 MB | posats a mà (`src/lib/olimpiada.ts:58-94`) |

## Decisió: Vercel Blob (no R2)

- **R2** necessita un domini propi per a ús en producció (`r2.dev` té límit de peticions). El DNS
  de profedeeconomia.es és a sered.net, no a Cloudflare, i caldria migrar-lo.
- **Vercel Blob** és el mateix compte i és la solució que la mateixa Vercel recomana per a fitxers grans.
  Guardar 1,4 GB costa uns cèntims al mes, o res si entra en l'allotjament inclòs al Pro. Cal
  confirmar el preu a la pàgina oficial, perquè les fonts no coincideixen.

## Enfocament: redirect, sense tocar els enllaços

Els enllaços als PDF són en ~16 fitxers, i la majoria són literals. En lloc de reescriure'ls:

1. **Pujar els PDF a Blob** conservant la mateixa ruta (`downloads/x.pdf` → `<store>/downloads/x.pdf`),
   amb `addRandomSuffix: false`. Faria un script nou, `scripts/upload-pdfs-to-blob.mjs`, que només puja
   els fitxers nous o canviats (compara la mida/hash amb `list()`). Necessita `BLOB_READ_WRITE_TOKEN`
   a `.env`, que haurà de posar Pau.
2. **Redirects a `vercel.json`** (302, no permanents, per si es tornen a moure):
   `/downloads/(.*\.pdf)`, `/slides/(.*\.pdf)`, `/ebau-examenes/(.*\.pdf)`, `/olimpiada/(.*\.pdf)`
   → `https://<store>.public.blob.vercel-storage.com/<carpeta>/$1`.
   A Vercel, els redirects es resolen abans que els fitxers estàtics.
3. **Treure els PDF de la sortida només a Vercel:** un pas `postbuild` que esborra `*.pdf` de
   `.vercel/output/static` (i de `dist/client`) quan `VERCEL=1`. En local no canvia res: els
   scripts `build-*-pdf` i els `existsSync` de les pàgines continuen funcionant.
4. Els PDF **es queden a git** per ara. Netejar el repo (`.git` = 6,5 GB) és una feina separada.

Nou flux de treball: quan es regeneren PDF → `npm run build:pdfs-upload` (o l'script de l'1).

## Riscos a comprovar

- `<a download>` cap a un altre domini: el navegador ignora el nom suggerit. Cal mirar si alguna pàgina
  en depèn. Si cal, es pot pujar el fitxer amb `contentDisposition: attachment`.
- `scripts/check-pdf-deploy.sh` espera punters de Git LFS: cal adaptar-lo perquè segueixi el redirect.
- Transferència de Blob: el volum de descàrregues de PDF és desconegut. Cal mirar-lo al cap d'una setmana.

## Verificació

1. Test (`node:test`) del filtre del `postbuild`: esborra `.pdf` i no toca res més, i només quan `VERCEL=1`.
2. `vercel build` en local amb `VERCEL=1` → `.vercel/output` < 1,2 GB i sense cap `.pdf`.
3. Després del deploy: `curl -I https://www.profedeeconomia.es/downloads/eco-1bach-libro.pdf` →
   302 → 200 `application/pdf`, i el mateix per a un PDF de cada carpeta.
4. Al cap de 2–3 dies: Deployment Storage/dia baixa (sobretot quan s'apliqui la retenció).

## Git

Branca `chore/pdfs-a-blob` des de `main` (no des de `feat/seo-pendents-octubre`, que és la branca
local actual) → PR contra `main`, segons el CLAUDE.md del projecte.

## Fora d'aquest pla (ho fa Pau al dashboard)

- **Deployment Retention Policy** (Settings → Security): és el que esborra els ~775 GB ja acumulats.
- Build Machine → Standard (pendent des del 2026-09-29).
