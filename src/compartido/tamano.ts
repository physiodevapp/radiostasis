/**
 * Tamaño «Grande» (hito 3e): amplía toda la interfaz, también los textos de los
 * SVG, como la ampliación del navegador. Se hace con `zoom` en <html>; como las
 * media queries no ven ese zoom, la build duplica cada una de ancho o alto con
 * sus medidas multiplicadas (así, con 1366 px y «Grande», la página se maqueta
 * como en 1093 px, igual que el navegador al 125 %).
 *
 * Sin dependencias del navegador: lo usan vite.config.ts, la app y los tests.
 */
export const ZOOM_GRANDE = 1.25;

const SELECTOR_NORMAL = ":where(html:not([data-tamano='grande']))";
const SELECTOR_GRANDE = ":where(html[data-tamano='grande'])";

/** Multiplica las medidas en px de las condiciones de ancho y alto. */
export function escalarConsulta(consulta: string, factor = ZOOM_GRANDE): string {
  return consulta.replace(
    /((?:min-|max-)?(?:width|height)\s*:\s*)(\d+(?:\.\d+)?)px/g,
    (_, prop: string, n: string) => `${prop}${Math.round(Number(n) * factor * 100) / 100}px`,
  );
}

const DEPENDE_DEL_TAMANO = /\b(?:min-|max-)?(?:width|height)\s*:/;

/**
 * Duplica las @media de primer nivel que dependen del ancho o del alto: la
 * original solo con tamaño normal y una copia escalada solo con «Grande».
 * Las reglas de dentro se anidan bajo un :where() (sin cambiar su especificidad).
 */
export function duplicarMediaQueries(css: string, factor = ZOOM_GRANDE): string {
  let salida = '';
  let i = 0;
  while (i < css.length) {
    const inicio = css.indexOf('@media', i);
    if (inicio < 0) {
      salida += css.slice(i);
      break;
    }
    // Solo las de primer nivel: profundidad de llaves 0 en este punto.
    if (profundidad(css, inicio) !== 0) {
      salida += css.slice(i, inicio + 6);
      i = inicio + 6;
      continue;
    }
    salida += css.slice(i, inicio);
    const llave = css.indexOf('{', inicio);
    const consulta = css.slice(inicio + 6, llave).trim();
    const fin = cierre(css, llave);
    const cuerpo = css.slice(llave + 1, fin);
    if (DEPENDE_DEL_TAMANO.test(consulta)) {
      salida +=
        `@media ${consulta} {\n${SELECTOR_NORMAL} {${cuerpo}}\n}\n` +
        `@media ${escalarConsulta(consulta, factor)} {\n${SELECTOR_GRANDE} {${cuerpo}}\n}`;
    } else {
      salida += css.slice(inicio, fin + 1);
    }
    i = fin + 1;
  }
  return salida;
}

/** Profundidad de llaves en una posición (ignora comentarios). */
function profundidad(css: string, hasta: number): number {
  let d = 0;
  for (let i = 0; i < hasta; i++) {
    if (css[i] === '/' && css[i + 1] === '*') {
      const f = css.indexOf('*/', i + 2);
      i = f < 0 ? hasta : f + 1;
      continue;
    }
    if (css[i] === '{') d++;
    else if (css[i] === '}') d--;
  }
  return d;
}

/** Posición de la llave que cierra la abierta en `abre`. */
function cierre(css: string, abre: number): number {
  let d = 0;
  for (let i = abre; i < css.length; i++) {
    if (css[i] === '/' && css[i + 1] === '*') {
      const f = css.indexOf('*/', i + 2);
      i = f < 0 ? css.length : f + 1;
      continue;
    }
    if (css[i] === '{') d++;
    else if (css[i] === '}' && --d === 0) return i;
  }
  throw new Error('CSS sin cerrar en la posición ' + abre);
}
