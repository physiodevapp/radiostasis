const SVG_NS = 'http://www.w3.org/2000/svg';

type Atributos = Record<string, string | number | boolean | undefined>;

function poner(el: Element, attrs: Atributos) {
  for (const [k, v] of Object.entries(attrs)) {
    if (v === undefined || v === false) continue;
    el.setAttribute(k, v === true ? '' : String(v));
  }
}

/** Crea un elemento HTML con atributos e hijos. */
export function h<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  attrs: Atributos = {},
  ...hijos: (Node | string | null | undefined)[]
): HTMLElementTagNameMap[K] {
  const el = document.createElement(tag);
  poner(el, attrs);
  for (const c of hijos) if (c != null) el.append(c);
  return el;
}

/** Crea un elemento SVG con atributos e hijos. */
export function s<K extends keyof SVGElementTagNameMap>(
  tag: K,
  attrs: Atributos = {},
  ...hijos: (Node | string | null | undefined)[]
): SVGElementTagNameMap[K] {
  const el = document.createElementNS(SVG_NS, tag);
  poner(el, attrs);
  for (const c of hijos) if (c != null) el.append(c);
  return el;
}

let contador = 0;
/** Id único para gradientes, recortes y etiquetas. */
export const idUnico = (base: string) => `${base}-${++contador}`;
