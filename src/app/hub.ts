/**
 * Enlace desde el hub PhysiQ (convención propuesta el 17 nov 2026; ver
 * docs/hub-physiq.md). Dentro del hub, «Compartir» escribe un enlace que abre
 * el hub con Radiostasis dentro y el caso cargado:
 *
 *   https://…/physiq/?sat=radiostasis#c=hiperaldo:1
 *
 * El hub se anuncia con un mensaje (`PHYSIQ_HUB` al cargar el iframe, o el
 * campo `hub` de `PHYSIQ_SAT_VISIBLE`) que lleva su dirección y el nombre del
 * satélite. Sin ese aviso (un hub que aún no pasa el fragmento al iframe, o
 * Radiostasis sola), el enlace es el de Radiostasis, como antes.
 */

export interface AvisoHub {
  /** Dirección del hub, sin «?» ni «#» (p. ej. https://physiodevapp.github.io/physiq/). */
  hub: string;
  /** Nombre del satélite en el hub (`?sat=`). */
  sat: string;
}

/** Lee un mensaje del hub; null si no es un aviso válido. */
export function leerAvisoHub(datos: unknown, origenPagina: string): AvisoHub | null {
  if (!datos || typeof datos !== 'object') return null;
  const d = datos as Record<string, unknown>;
  if (d.type !== 'PHYSIQ_HUB' && d.type !== 'PHYSIQ_SAT_VISIBLE') return null;
  if (typeof d.hub !== 'string') return null;
  let url: URL;
  try {
    url = new URL(d.hub, origenPagina);
  } catch {
    return null;
  }
  // Solo https (o http en el propio equipo, para las pruebas): nunca javascript: ni data:.
  const local = url.hostname === 'localhost' || url.hostname === '127.0.0.1';
  if (url.protocol !== 'https:' && !(url.protocol === 'http:' && local)) return null;
  const sat = typeof d.sat === 'string' && /^[a-z0-9-]{1,40}$/.test(d.sat) ? d.sat : 'radiostasis';
  return { hub: `${url.origin}${url.pathname}`, sat };
}

/** Dirección del enlace para un fragmento (sin «#»): la del hub si se ha anunciado. */
export function direccionEnlace(fragmento: string, aviso: AvisoHub | null, paginaSinFragmento: string): string {
  return aviso ? `${aviso.hub}?sat=${aviso.sat}#${fragmento}` : `${paginaSinFragmento}#${fragmento}`;
}

/** Escucha los avisos del hub (solo de la ventana que contiene a Radiostasis). */
export function escucharHub(alCambiar: (aviso: AvisoHub) => void) {
  if (window.self === window.top) return;
  window.addEventListener('message', (e) => {
    if (e.source !== window.parent) return;
    const aviso = leerAvisoHub(e.data, location.href);
    if (aviso) alCambiar(aviso);
  });
}
