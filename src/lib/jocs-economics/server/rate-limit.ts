// src/lib/jocs-economics/server/rate-limit.ts
// Burst limit for /api/jocs/start, per IP. A whole class (often a whole school)
// shares one public IP behind the centre's NAT, so the old 20 starts per hour
// locked 25 students out after their first round. This only stops floods:
// 30 starts in any minute. In-memory and per instance, as before; a real
// limit across instances would need a shared store (Vercel KV, Upstash).

export const VENTANA_MS = 60 * 1000;
export const MAX_INICIOS_POR_VENTANA = 30;
/** Past this many tracked IPs, stale ones are swept so the map cannot grow forever. */
const LIMPIAR_A_PARTIR_DE = 5000;

/** Records a start for `ip` at `now` and says whether it is allowed. */
export function permitirInicio(store: Map<string, number[]>, ip: string, now: number): boolean {
  const recientes = (store.get(ip) ?? []).filter((t) => now - t < VENTANA_MS);
  if (recientes.length >= MAX_INICIOS_POR_VENTANA) {
    store.set(ip, recientes);
    return false;
  }
  recientes.push(now);
  store.set(ip, recientes);
  if (store.size > LIMPIAR_A_PARTIR_DE) {
    for (const [clave, marcas] of store) {
      if (marcas.every((t) => now - t >= VENTANA_MS)) store.delete(clave);
    }
  }
  return true;
}
