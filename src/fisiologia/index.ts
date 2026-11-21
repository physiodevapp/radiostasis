import type { Nodo, Relacion } from '../motor/tipos';
import { nodosEjercicio, relacionesEjercicio } from './ejercicio';
import { nodosFarmacos, relacionesFarmacos } from './farmacos';
import type { Biblioteca } from './importar';
import { nodosBase } from './nodos';
import { relacionesEdad, relacionesLateralidad, relacionesPropuestas, relacionesV21 } from './relaciones';

/**
 * Biblioteca común de fisiología (fase N2): los nodos y las relaciones que
 * pueden compartir los temas, cada uno una sola vez, con su número, sus PMID y
 * su frase (`bibliografia.ts`). Cada tema importa lo que usa con `importar.ts`.
 * Hoy todo sale de la hipertensión, el primer tema.
 */
export const biblioteca: Biblioteca = {
  nodos: [...nodosBase, ...nodosFarmacos, ...nodosEjercicio],
  relaciones: [...relacionesV21, ...relacionesPropuestas, ...relacionesFarmacos, ...relacionesEjercicio, ...relacionesLateralidad, ...relacionesEdad],
};

const porN = new Map(biblioteca.relaciones.map((r) => [r.n, r]));
const porId = new Map(biblioteca.nodos.map((n) => [n.id, n]));

/** Relación de la biblioteca por su número. */
export function relacionDe(n: number): Relacion {
  const r = porN.get(n);
  if (!r) throw new Error(`La relación ${n} no está en la biblioteca`);
  return r;
}

/** Nodo de la biblioteca por su id. */
export function nodoDe(id: string): Nodo {
  const x = porId.get(id);
  if (!x) throw new Error(`El nodo «${id}» no está en la biblioteca`);
  return x;
}

export { articulos, frases } from './bibliografia';
export type { Articulo } from './bibliografia';
