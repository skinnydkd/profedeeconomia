// Business Game — límite de llamadas por IP y minuto para crear y unirse.
// En memoria y por instancia, como el de Jocs Econòmics: frena un bucle desde
// un script, no un ataque distribuido (para eso haría falta Vercel KV).

const VENTANA_MS = 60 * 1000;
const registro = new Map<string, number[]>();

/** Registra una llamada de `ip` a `accion` y dice si entra en el límite. */
export function dentroDelLimite(accion: string, ip: string, maxPorMinuto: number, now = Date.now()): boolean {
  const clave = `${accion}:${ip}`;
  const recientes = (registro.get(clave) ?? []).filter((t) => now - t < VENTANA_MS);
  const permitido = recientes.length < maxPorMinuto;
  if (permitido) recientes.push(now);
  registro.set(clave, recientes);
  if (registro.size > 5000) {
    for (const [k, marcas] of registro) if (marcas.every((t) => now - t >= VENTANA_MS)) registro.delete(k);
  }
  return permitido;
}
