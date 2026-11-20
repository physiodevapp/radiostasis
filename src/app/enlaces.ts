import { h } from './dom';

/**
 * Enlaces internos (fichas y «Qué mirar»): convierte en enlaces los términos de
 * un tema dentro de un texto. Palabras completas (sin partir palabras ni
 * acentos), primero la frase más larga, una sola vez por nodo en cada apartado
 * (`usados`) y nunca hacia la propia ficha (`propio`).
 */
export function crearEnlazador(terminos: Record<string, string[]>, alAbrir: (id: string) => void) {
  const lista = Object.entries(terminos)
    .flatMap(([id, ts]) => ts.map((t) => ({ id, t, clave: t.toLocaleLowerCase('es') })))
    .sort((a, b) => b.t.length - a.t.length);
  const escapar = (t: string) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const patron = lista.length
    ? new RegExp(`(?<![\\p{L}\\p{N}])(${lista.map((x) => escapar(x.t)).join('|')})(?![\\p{L}\\p{N}])`, 'giu')
    : null;
  const idDe = (m: string) => lista.find((x) => x.clave === m.toLocaleLowerCase('es'))?.id;

  /** Devuelve los nodos (texto y enlaces) de `texto`. */
  return function enlazar(texto: string, propio?: string, usados: Set<string> = new Set()): (Node | string)[] {
    if (!patron) return [texto];
    const partes: (Node | string)[] = [];
    let ultimo = 0;
    for (const m of texto.matchAll(patron)) {
      const id = idDe(m[1]);
      if (!id || id === propio || usados.has(id)) continue;
      usados.add(id);
      partes.push(texto.slice(ultimo, m.index));
      const a = h('a', { href: `#ficha-${id}`, class: 'enlace-ficha', 'data-ir': id }, m[1]);
      a.addEventListener('click', (e) => {
        e.preventDefault();
        alAbrir(id);
      });
      partes.push(a);
      ultimo = (m.index ?? 0) + m[1].length;
    }
    partes.push(texto.slice(ultimo));
    return partes.filter((p) => p !== '');
  };
}

export type Enlazar = ReturnType<typeof crearEnlazador>;
