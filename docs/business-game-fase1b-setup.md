# Business Game — Fase 1b: puesta en marcha (Supabase)

La Fase 1b añade la persistencia y el multi-dispositivo, **reutilizando la misma
Supabase y el registro nombre/instituto de «Juegos Económicos»**. Como no se
puede probar contra la base de datos desde el entorno de desarrollo, aquí van los
pasos para activarlo y comprobarlo.

## 1. Aplicar la migración

En **Supabase Studio → SQL editor**, ejecuta el contenido de:

```
supabase/migrations/20260606_init_business_game.sql
```

Crea 4 tablas: `bg_ligas`, `bg_equipos`, `bg_decisiones`, `bg_resultados`
(todas con RLS activado; los endpoints usan la *service-role key*, que la
salta). Es la misma instancia que ya usa Jocs Econòmics.

## 2. Variables de entorno (ya deberían existir para jocs)

Los endpoints reutilizan exactamente las de «Juegos Económicos»:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `JOCS_TOKEN_SECRET` (se reutiliza para firmar los tokens de profe/equipo)

No hay que añadir ninguna nueva. Asegúrate de que están en Vercel (producción) y
en `.env` (local).

## 3. Cómo funciona

- Página: `/juegos/business-game/`.
- **Profe**: «Soy profe» → crea una liga (nombre, instituto, nº de rondas) y
  obtiene un **código** de 6 caracteres. Comparte el código con la clase.
- **Equipos**: «Soy un equipo» → entran con el código + nombre de la empresa +
  instituto. Cada ronda envían sus decisiones de las 4 áreas (pueden reenviar
  hasta que se cierre la ronda).
- El profe pulsa **«Cerrar la ronda»**: el servidor ejecuta el motor
  (`src/lib/business-game/engine.ts`, ya testeado), guarda los resultados,
  actualiza caja/beneficio/deuda de cada equipo y avanza a la ronda siguiente
  (o cierra la liga si era la última).
- Todos ven el **ranking** (por beneficio acumulado) y el histórico; las
  pantallas se refrescan solas por *polling* cada 4 s.
- **Modo práctica local** (sin registro): botón dentro de la misma página, para
  probar el modelo en un solo dispositivo (es el prototipo de la Fase 1a).

## 4. Endpoints (`src/pages/api/business-game/`)

- `POST /crear` — crea liga (profe). Devuelve `codigo` + `token`.
- `POST /unirse` — un equipo entra con el código. Devuelve `token`.
- `POST /decisiones` — el equipo envía sus decisiones de la ronda (token equipo).
- `POST /cerrar` — el profe cierra la ronda y corre el motor (token profe).
- `GET /estado?codigo=XXXXXX` — estado de la liga para *polling* (público).

## 5. Comprobación rápida

1. Aplica la migración.
2. Abre `/juegos/business-game/`, crea una liga, copia el código.
3. En otra pestaña/dispositivo, únete como equipo con ese código (hazlo 2-3
   veces con nombres distintos).
4. Envía decisiones en cada equipo.
5. Como profe, cierra la ronda y mira el ranking y el histórico.

## Pendiente (Fase 2)

Gráficos de evolución, varios mercados, informe/presentación final, validaciones
y límites (caja negativa, topes de préstamo), y pulido visual.
