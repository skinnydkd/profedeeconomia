#!/usr/bin/env bash
#
# check-pdf-deploy.sh — verifica que producción sirve los PDFs de libros como
# PDF reales y NO como punteros de Git LFS.
#
# Tras mover public/downloads/*-libro.pdf a Git LFS, si la plataforma de
# despliegue (Vercel) no resuelve LFS al clonar, serviría el "puntero" de LFS
# (un fichero de texto de ~130 bytes) en lugar del PDF. Este script lo detecta:
# un PDF real pesa MB; un puntero LFS pesa ~130 bytes.
#
# Uso:
#   bash scripts/check-pdf-deploy.sh                 # comprueba producción
#   bash scripts/check-pdf-deploy.sh https://otro    # otra base URL
#
# Sale con código 0 si todo OK, 1 si algún libro no es un PDF real.

set -u
BASE="${1:-https://www.profedeeconomia.es}"
SLUGS=(edmn-2bach eco-1bach eco-4eso fopp-4eso eeae-bach gpe-bach taller-eco-3eso ipe1-fp ipe2-fp)
MIN_BYTES=100000   # un PDF de libro pesa MB; un puntero LFS ~130 bytes

echo "Comprobando libros en: $BASE/downloads/<slug>-libro.pdf"
echo
fail=0
for s in "${SLUGS[@]}"; do
  url="$BASE/downloads/$s-libro.pdf"
  # Cabeceras (siguiendo redirects). Tomamos el último status, content-type y length.
  hdr=$(curl -fsSIL "$url" 2>/dev/null)
  status=$(printf '%s\n' "$hdr" | awk 'BEGIN{IGNORECASE=1}/^HTTP/{s=$2}END{print s}')
  ctype=$(printf '%s\n' "$hdr" | awk 'BEGIN{IGNORECASE=1}/^content-type:/{print $2}' | tail -1 | tr -d '\r')
  clen=$(printf '%s\n'  "$hdr" | awk 'BEGIN{IGNORECASE=1}/^content-length:/{print $2}' | tail -1 | tr -d '\r')
  clen=${clen:-0}

  if [[ "${status:-000}" == "200" && "$clen" -ge "$MIN_BYTES" ]]; then
    printf "  OK    %-18s %8s bytes  %s\n" "$s" "$clen" "$ctype"
  else
    printf "  FAIL  %-18s status=%s len=%s type=%s\n" "$s" "${status:-?}" "$clen" "${ctype:-?}"
    fail=1
  fi
done

echo
if [[ $fail -eq 0 ]]; then
  echo "✓ Todos los libros se sirven como PDF real — Vercel resuelve Git LFS correctamente."
else
  echo "✗ Algún libro NO es un PDF real (tamaño minúsculo = puntero LFS, o 404)."
  echo "  Probable causa: Vercel no está haciendo checkout de los objetos LFS."
  echo "  Soluciones: activar LFS en el despliegue, o revertir el tracking LFS de los libros."
fi
exit $fail
