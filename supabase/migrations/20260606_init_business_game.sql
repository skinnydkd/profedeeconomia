-- Business Game — schema inicial
-- Aplicar manualment al SQL editor de Supabase Studio (mateixa instància que Jocs Econòmics).
--
-- Una "liga" és una partida que crea el profe i a la qual s'uneixen els equips
-- amb un codi. Cada ronda els equips envien decisions; el profe tanca la ronda i
-- el servidor executa el motor (src/lib/business-game/engine.ts) i guarda resultats.

-- ──────────────────────────────────────────────────────────────────────
-- 1. bg_ligas — partida del profe
-- ──────────────────────────────────────────────────────────────────────
create table if not exists bg_ligas (
  id uuid primary key default gen_random_uuid(),
  codigo text not null unique,                 -- codi d'unió curt (p. ex. "K7P2QX")
  nombre text not null,
  institute_norm text not null,
  institute_display text not null,
  params jsonb not null,                        -- MarketParams
  num_rondas smallint not null default 8 check (num_rondas between 1 and 20),
  ronda smallint not null default 1,
  fase text not null default 'decisiones' check (fase in ('decisiones', 'resultados', 'cerrada')),
  created_at timestamptz not null default now(),
  last_action_at timestamptz not null default now()
);

create index if not exists bg_ligas_codigo_idx on bg_ligas (codigo);
alter table bg_ligas enable row level security;

-- ──────────────────────────────────────────────────────────────────────
-- 2. bg_equipos — empresa de cada equip dins d'una liga
-- ──────────────────────────────────────────────────────────────────────
create table if not exists bg_equipos (
  id uuid primary key default gen_random_uuid(),
  liga_id uuid not null references bg_ligas (id) on delete cascade,
  nombre text not null,
  institute_norm text not null default '',
  institute_display text not null default '',
  miembros text not null default '',
  caja numeric not null default 0,
  beneficio_acumulado numeric not null default 0,
  deuda numeric not null default 0,
  created_at timestamptz not null default now(),
  unique (liga_id, nombre)
);

create index if not exists bg_equipos_liga_idx on bg_equipos (liga_id);
alter table bg_equipos enable row level security;

-- ──────────────────────────────────────────────────────────────────────
-- 3. bg_decisiones — decisions d'un equip en una ronda (les 4 àrees)
-- ──────────────────────────────────────────────────────────────────────
create table if not exists bg_decisiones (
  id bigserial primary key,
  liga_id uuid not null references bg_ligas (id) on delete cascade,
  equipo_id uuid not null references bg_equipos (id) on delete cascade,
  ronda smallint not null,
  precio numeric not null,
  marketing numeric not null,
  produccion numeric not null,
  calidad numeric not null,
  rrhh numeric not null,
  prestamo numeric not null,
  created_at timestamptz not null default now(),
  unique (equipo_id, ronda)
);

create index if not exists bg_decisiones_ronda_idx on bg_decisiones (liga_id, ronda);
alter table bg_decisiones enable row level security;

-- ──────────────────────────────────────────────────────────────────────
-- 4. bg_resultados — resultat d'un equip en una ronda (sortida del motor)
-- ──────────────────────────────────────────────────────────────────────
create table if not exists bg_resultados (
  id bigserial primary key,
  liga_id uuid not null references bg_ligas (id) on delete cascade,
  equipo_id uuid not null references bg_equipos (id) on delete cascade,
  ronda smallint not null,
  calidad numeric not null,
  cvu numeric not null,
  atractivo numeric not null,
  cuota numeric not null,
  demanda numeric not null,
  ventas numeric not null,
  stock numeric not null,
  ingresos numeric not null,
  costes numeric not null,
  beneficio numeric not null,
  caja numeric not null,
  beneficio_acumulado numeric not null,
  deuda numeric not null,
  created_at timestamptz not null default now(),
  unique (equipo_id, ronda)
);

create index if not exists bg_resultados_ronda_idx on bg_resultados (liga_id, ronda);
alter table bg_resultados enable row level security;
