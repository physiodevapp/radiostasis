import { escalarConsulta, ZOOM_GRANDE } from '../compartido/tamano';
import { claveDelTema } from '../temas/registro';

/**
 * Ajustes que se recuerdan entre visitas (hito 3e): tema, tamaño y sonido.
 * Como en physiq-assessment, son preferencias de interfaz de este dispositivo
 * en localStorage, con prefijo propio. El script de <head> de index.html lee el
 * tema y el tamaño antes de pintar (sin parpadeo); aquí se guardan y aplican.
 * Aquí «tema» es el aspecto (retro o clásico), no el tema del simulador.
 *
 * Fase N2 (M10): lo que depende del tema del simulador (hoy, ver los valores
 * orientativos) se guarda aparte para cada tema, con `claveDelTema`. La
 * hipertensión conserva la clave de siempre. El aspecto, el tamaño y el sonido
 * son del dispositivo y valen para todos los temas.
 */
export type Tema = 'retro' | 'clasico';
export type Tamano = 'normal' | 'grande';

export const CLAVES = {
  tema: 'radiostasis-tema',
  tamano: 'radiostasis-tamano',
  sonido: 'radiostasis-sonido',
} as const;

function leer(clave: string): string | null {
  try {
    return localStorage.getItem(clave);
  } catch {
    return null;
  }
}
function guardar(clave: string, valor: string) {
  try {
    localStorage.setItem(clave, valor);
  } catch {
    // Sin almacenamiento (modo privado, bloqueado): se usa sin recordar.
  }
}

// Se lee al usarlo (no al importar): los tests importan módulos sin documento.
const raiz = () => document.documentElement;

export const temaActual = (): Tema => (raiz().dataset.tema === 'clasico' ? 'clasico' : 'retro');
export const tamanoActual = (): Tamano =>
  typeof document !== 'undefined' && raiz().dataset.tamano === 'grande' ? 'grande' : 'normal';
/** Zoom de toda la página: 1 o 1,25 con «Grande». */
export const zoomPagina = () => (tamanoActual() === 'grande' ? ZOOM_GRANDE : 1);

export function ponerTema(t: Tema) {
  raiz().dataset.tema = t;
  guardar(CLAVES.tema, t);
}

const alCambiarTamano = new Set<() => void>();
export function ponerTamano(t: Tamano) {
  if (t === tamanoActual()) return;
  raiz().dataset.tamano = t;
  guardar(CLAVES.tamano, t);
  for (const f of alCambiarTamano) f();
  window.dispatchEvent(new Event('resize'));
}

export const sonidoGuardado = () => leer(CLAVES.sonido) === 'si';
export const guardarSonido = (si: boolean) => guardar(CLAVES.sonido, si ? 'si' : 'no');
/** Fase 6, punto 5: valores orientativos (desactivados por defecto). Fase N2: por tema del simulador. */
export const valoresGuardados = (tema: string) => leer(claveDelTema(tema, 'valores')) === 'si';
export const guardarValores = (tema: string, si: boolean) => guardar(claveDelTema(tema, 'valores'), si ? 'si' : 'no');

/**
 * Como `matchMedia`, pero con «Grande» evalúa la consulta escalada (igual que
 * las media queries de la hoja de estilos, ver src/compartido/tamano.ts).
 */
export interface Consulta {
  readonly matches: boolean;
  addEventListener(tipo: 'change', f: () => void): void;
}
export function consulta(texto: string): Consulta {
  const normal = window.matchMedia(texto);
  const grande = window.matchMedia(escalarConsulta(texto));
  const oyentes = new Set<() => void>();
  let ultimo: boolean | null = null;
  const actual = () => (tamanoActual() === 'grande' ? grande : normal).matches;
  const avisar = () => {
    const m = actual();
    if (m === ultimo) return;
    ultimo = m;
    for (const f of oyentes) f();
  };
  normal.addEventListener('change', avisar);
  grande.addEventListener('change', avisar);
  alCambiarTamano.add(avisar);
  return {
    get matches() {
      return actual();
    },
    addEventListener(_tipo, f) {
      ultimo = actual();
      oyentes.add(f);
    },
  };
}

/**
 * Con «Grande» (zoom en <html>), getBoundingClientRect, innerWidth/innerHeight y
 * scrollX/scrollY vienen en píxeles de pantalla, pero style.left/top y
 * offsetWidth van en píxeles CSS. Estas funciones pasan lo primero a lo segundo.
 */
export function rectCss(r: DOMRect): DOMRect {
  const z = zoomPagina();
  return z === 1 ? r : new DOMRect(r.x / z, r.y / z, r.width / z, r.height / z);
}
export const anchoVentana = () => window.innerWidth / zoomPagina();
export const altoVentana = () => window.innerHeight / zoomPagina();
export const scrollCss = () => ({ x: window.scrollX / zoomPagina(), y: window.scrollY / zoomPagina() });
