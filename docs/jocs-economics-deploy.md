# Jocs Econòmics — Deploy & Setup

## Resum

Jocs Econòmics necessita un projecte Supabase + 5 env vars al deploy de Vercel.

## Setup Supabase (manual, un cop)

1. Crea un projecte gratuït a [supabase.com](https://supabase.com) (regió `eu-central-1` recomanada per latència a Espanya).
2. Project Settings → API: copia `URL`, `anon public key`, `service_role secret key`.
3. SQL Editor → New query → enganxa el contingut de `supabase/migrations/20260527_init_jocs.sql` → Run. Verifica que totes les taules apareixen al Table editor.
4. Verifica els cron jobs: `select * from cron.job;` → han d'aparèixer 2 (`jocs-cleanup-active-games`, `jocs-refresh-institute-leaderboard`).

## Env vars al Vercel

Project Settings → Environment Variables → afegir:

| Nom | Scope | Valor |
|---|---|---|
| `SUPABASE_URL` | Production + Preview + Development | URL del projecte (https://\<proj\>.supabase.co) |
| `SUPABASE_SERVICE_ROLE_KEY` | Production + Preview + Development | service_role secret (server-only) |
| `PUBLIC_SUPABASE_URL` | Production + Preview + Development | Igual que SUPABASE_URL (per al client si calgués) |
| `PUBLIC_SUPABASE_ANON_KEY` | Production + Preview + Development | anon public key (per al client si calgués) |
| `JOCS_TOKEN_SECRET` | Production + Preview + Development | Random 48 bytes base64. Genera amb: `openssl rand -base64 48` |

**Crític**: `SUPABASE_SERVICE_ROLE_KEY` i `JOCS_TOKEN_SECRET` NO van prefixades amb `PUBLIC_` → Astro no les envia al bundle del client.

## Env vars en local

Copia `.env.example` → `.env` i ompli els valors. `.env` està gitignored.

```bash
cp .env.example .env
# edita .env amb els valors reals
openssl rand -base64 48  # genera el JOCS_TOKEN_SECRET
```

## Verificació post-deploy

1. Visita `https://profedeeconomia.es/jocs-economics/` — la pantalla Welcome ha de carregar.
2. Començar una partida → ha de retornar una pregunta (banc poblat al prebuild).
3. Veure `https://profedeeconomia.es/jocs-economics/leaderboard/` — buit al primer cop, dades després.

## Backup del banc

El banc viu al repo (`src/content/jocs-economics/preguntas/*.md`) → backup ja és Git. El JSON generat es regenera al prebuild, no cal backup.

Els `scores` viuen a Supabase. Supabase fa daily snapshots gratuits dels últims 7 dies; per a retencions més llargues, configurar pg_dump cron o pujar al pla Pro.

## Migracions futures

Crear `supabase/migrations/YYYYMMDD_<descripció>.sql` i aplicar al SQL editor manualment. (No automatitzem CI/CD de migracions al MVP.)
