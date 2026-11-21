import type { Frecuencia, Nodo, Relacion, RelacionSuma } from '../motor/tipos';

/**
 * Importación de la biblioteca común por tema (fase N2; puntos 2 a 5 de
 * docs/natremia/propuesta-modelo.md, «Qué necesita el motor», y M1–M5 de
 * docs/natremia/revision-n1-fable.md).
 *
 * Qué es común y qué es de cada tema:
 * - Común: el nodo (qué es), y de cada relación el número, el tipo, el signo, los
 *   PMID y la frase.
 * - De cada tema: nombre, etiquetas, frecuencia, explicación y código del nodo;
 *   intensidad, `intensidadNegativa`, umbral, escala (`tiempo`, `hasta`),
 *   variante y fracción bloqueada de la relación (aquí, en `cambios`, o con
 *   `aplicarAjustes` y la tabla de motivos de la calibración del tema); y el
 *   origen o el destino reasignado (relaciones con asterisco), con su propia
 *   explicación y su propia frase.
 *
 * Si se corrige un signo en la biblioteca, cambia en todos los temas, y los
 * tests de cada tema lo vigilan.
 */

/** Lo que un tema puede cambiar de un nodo al importarlo (M5). */
export interface ImportacionNodo {
  id: string;
  codigo?: string;
  nombre?: string;
  etiquetas?: [string, string];
  frecuencia?: Frecuencia;
  frecuenciaExtremos?: [Frecuencia, Frecuencia];
  explicacion?: string;
}

/** Campos de una relación que son de cada tema (M3). */
export const CAMPOS_DEL_TEMA = ['intensidad', 'intensidadNegativa', 'umbral', 'tiempo', 'hasta', 'variante', 'maximo'] as const;
export type CambiosRelacion = Partial<Pick<RelacionSuma, 'intensidad' | 'intensidadNegativa' | 'umbral' | 'tiempo' | 'hasta' | 'variante'>> & {
  /** Solo en `bloquea`: fracción bloqueada con la dosis plena. */
  maximo?: number;
};

/** Lo que un tema puede cambiar de una relación al importarla. */
export interface ImportacionRelacion {
  n: number;
  /**
   * Relación con asterisco (M1): nodos de la biblioteca → nodos del tema, en el
   * origen y en el destino. `{ volemia: 'vce' }` copia la 63 (Volemia → ADH)
   * como Volumen circulante efectivo → ADH, con el mismo número y los mismos PMID.
   */
  reasignar?: Record<string, string>;
  /** Explicación del tema. Obligatoria si se reasigna: la de la biblioteca habla de otro nodo. */
  explicacion?: string;
  cambios?: CambiosRelacion;
}

export interface Biblioteca {
  nodos: readonly Nodo[];
  relaciones: readonly Relacion[];
}

/** Nodos del tema, en el orden pedido, con lo que el tema cambia de cada uno. */
export function importarNodos(b: Biblioteca, lista: readonly (string | ImportacionNodo)[]): Nodo[] {
  const vistos = new Set<string>();
  return lista.map((x) => {
    const d: ImportacionNodo = typeof x === 'string' ? { id: x } : x;
    const original = b.nodos.find((n) => n.id === d.id);
    if (!original) throw new Error(`El nodo «${d.id}» no está en la biblioteca`);
    if (vistos.has(d.id)) throw new Error(`El nodo «${d.id}» se importa dos veces`);
    vistos.add(d.id);
    const { id, ...cambios } = d;
    if (!Object.keys(cambios).length) return original;
    return { ...original, ...cambios };
  });
}

/**
 * Relaciones del tema, en el orden pedido. Sin cambios, la relación es la de la
 * biblioteca (el mismo objeto). Con `reasignar`, una copia con el asterisco
 * (`reasignada`). Las listas de `modula` y `bloquea` no se tocan aquí: se
 * filtran con `filtrarReferencias` cuando el tema tiene todas sus relaciones.
 */
export function importarRelaciones(b: Biblioteca, lista: readonly (number | ImportacionRelacion)[]): Relacion[] {
  const vistos = new Set<number>();
  return lista.map((x) => {
    const d: ImportacionRelacion = typeof x === 'number' ? { n: x } : x;
    const original = b.relaciones.find((r) => r.n === d.n);
    if (!original) throw new Error(`La relación ${d.n} no está en la biblioteca`);
    if (vistos.has(d.n)) throw new Error(`La relación ${d.n} se importa dos veces`);
    vistos.add(d.n);
    if (!d.reasignar && d.explicacion === undefined && !d.cambios) return original;
    const copia = { ...original } as Relacion;
    if (d.reasignar) {
      const reasignada: { origen?: string; destino?: string } = {};
      for (const [de, a] of Object.entries(d.reasignar)) {
        let usado = false;
        if (copia.origen === de) {
          reasignada.origen = de;
          copia.origen = a;
          usado = true;
        }
        if (copia.destino === de) {
          reasignada.destino = de;
          copia.destino = a;
          usado = true;
        }
        if (!usado) throw new Error(`Relación ${d.n}: «${de}» no es su origen ni su destino`);
      }
      if (d.explicacion === undefined) throw new Error(`Relación ${d.n}: al reasignarla hace falta la explicación del tema`);
      copia.reasignada = reasignada;
    } else if (d.explicacion !== undefined) {
      throw new Error(`Relación ${d.n}: solo cambia la explicación una relación reasignada (con asterisco)`);
    }
    if (d.explicacion !== undefined) copia.explicacion = d.explicacion;
    for (const [campo, valor] of Object.entries(d.cambios ?? {})) {
      if (campo === 'maximo' ? copia.tipo !== 'bloquea' : copia.tipo !== 'suma')
        throw new Error(`Relación ${d.n}: «${campo}» no es un campo de una relación de tipo ${copia.tipo}`);
      (copia as unknown as Record<string, unknown>)[campo] = valor;
    }
    return copia;
  });
}

/**
 * M2: las listas de `modula` y `bloquea` se quedan con las relaciones presentes
 * en el tema (la 15 modula la 13 y la 14; si el tema no tiene la 14, solo la 13).
 * Una relación cuya lista queda vacía no tiene sobre qué actuar: es un error de
 * la importación. Sin nada que quitar, devuelve los mismos objetos.
 */
export function filtrarReferencias(relaciones: readonly Relacion[]): Relacion[] {
  const presentes = new Set(relaciones.map((r) => r.n));
  return relaciones.map((r) => {
    if (r.tipo !== 'modula' && r.tipo !== 'bloquea') return r;
    const lista = r.relaciones.filter((n) => presentes.has(n));
    if (lista.length === r.relaciones.length) return r;
    if (!lista.length) throw new Error(`Relación ${r.n}: ninguna de las relaciones que ${r.tipo === 'modula' ? 'modula' : 'bloquea'} (${r.relaciones.join(', ')}) está en el tema`);
    return { ...r, relaciones: lista };
  });
}

/** Referencias de `modula` y `bloquea` a relaciones que no están en el modelo («relación 15 → 14»). */
export function referenciasMuertas(relaciones: readonly Relacion[]): string[] {
  const presentes = new Set(relaciones.map((r) => r.n));
  return relaciones.flatMap((r) =>
    r.tipo === 'modula' || r.tipo === 'bloquea' ? r.relaciones.filter((n) => !presentes.has(n)).map((n) => `relación ${r.n} → ${n}`) : [],
  );
}

/**
 * Diferencias entre una relación del tema y la de la biblioteca que no le están
 * permitidas al tema (M3): cambiar el tipo, el signo, los PMID, la fuente, el
 * momento o lo que bloquea; cambiar el origen o el destino sin el asterisco (o
 * distinto de lo declarado); cambiar la explicación sin el asterisco; o una lista
 * de `modula`/`bloquea` que no sea parte de la original. Lista vacía si la copia
 * solo cambia lo declarado.
 */
export function cambiosNoDeclarados(original: Relacion, copia: Relacion): string[] {
  const fallos: string[] = [];
  const o = original as unknown as Record<string, unknown>;
  const c = copia as unknown as Record<string, unknown>;
  const libres = new Set<string>([...CAMPOS_DEL_TEMA, 'origen', 'destino', 'explicacion', 'relaciones', 'reasignada']);
  for (const k of new Set([...Object.keys(o), ...Object.keys(c)])) {
    if (libres.has(k)) continue;
    if (JSON.stringify(o[k]) !== JSON.stringify(c[k])) fallos.push(`${k} cambia`);
  }
  const r = copia.reasignada;
  for (const lado of ['origen', 'destino'] as const) {
    const declarado = r?.[lado];
    if (declarado === undefined) {
      if (copia[lado] !== original[lado]) fallos.push(`${lado} cambia sin asterisco`);
    } else if (declarado !== original[lado] || copia[lado] === original[lado]) fallos.push(`${lado} no coincide con lo declarado`);
  }
  if (!r && copia.explicacion !== original.explicacion) fallos.push('explicación cambia sin asterisco');
  if ((copia.tipo === 'modula' || copia.tipo === 'bloquea') && (original.tipo === 'modula' || original.tipo === 'bloquea')) {
    const resto = original.relaciones.filter((n) => copia.relaciones.includes(n));
    if (JSON.stringify(resto) !== JSON.stringify(copia.relaciones)) fallos.push('la lista de relaciones no es parte de la original');
  }
  return fallos;
}
