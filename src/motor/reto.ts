import { flecha, UMBRAL_IGUAL } from './motor';
import type { CorreccionReto, Flecha, Reto } from './tipos';

/** Causas del reto (las que se apartan de lo normal). */
export const causasDeReto = (r: Reto) => Object.keys(r.causas).filter((id) => r.causas[id] !== 0);

/**
 * Corrige la respuesta de un reto: acierto si coincide exactamente, parcial si
 * acierta alguna causa (aunque sobre o falte otra), fallo si no acierta ninguna.
 */
export function corregirReto(elegidas: readonly string[], reto: Reto): CorreccionReto {
  const reales = causasDeReto(reto);
  const aciertos = elegidas.filter((id) => reales.includes(id));
  const sobran = elegidas.filter((id) => !reales.includes(id));
  const faltan = reales.filter((id) => !elegidas.includes(id));
  const resultado = !sobran.length && !faltan.length ? 'acierto' : aciertos.length ? 'parcial' : 'fallo';
  return { resultado, aciertos, sobran, faltan };
}

/**
 * Claves de un reto del profesor (retos por enlace): las flechas que más se
 * mueven, sin las que quedan en «=». De cada grupo (p. ej. la analítica, y los
 * mecanismos con los determinantes de la presión) se toman las `porGrupo` mayores;
 * si no se llega a `total`, se completa con las mayores del resto. A igual
 * valor, manda el orden de la lista. Van ordenadas por grupo.
 */
export function clavesAutomaticas(
  valores: Readonly<Record<string, number>>,
  grupos: readonly (readonly string[])[],
  porGrupo = 2,
  total = 4,
): Record<string, Flecha> {
  const ordenar = (ids: readonly string[]) =>
    ids
      .map((id, i) => ({ id, i, v: valores[id] ?? 0 }))
      .filter((x) => Math.abs(x.v) >= UMBRAL_IGUAL)
      .sort((a, b) => Math.abs(b.v) - Math.abs(a.v) || a.i - b.i)
      .map((x) => x.id);
  const elegidas: string[] = [];
  for (const g of grupos) elegidas.push(...ordenar(g).filter((id) => !elegidas.includes(id)).slice(0, porGrupo));
  const resto = ordenar(grupos.flat()).filter((id) => !elegidas.includes(id));
  elegidas.push(...resto.slice(0, Math.max(0, total - elegidas.length)));
  return Object.fromEntries(elegidas.slice(0, total).map((id) => [id, flecha(valores[id])]));
}

/**
 * Valores que nombra la pista automática del reto de un profesor: el mayor de
 * cada grupo (o los dos mayores, si solo hay de uno), sin los que se llaman como
 * una causa (`evita`), que casi darían la respuesta: se pasa al siguiente.
 */
export function valoresPista(
  valores: Readonly<Record<string, number>>,
  grupos: readonly (readonly string[])[],
  evita: readonly string[],
): string[] {
  const sinEvitar = grupos.map((g) => g.filter((id) => !evita.includes(id)));
  const ids = Object.keys(clavesAutomaticas(valores, sinEvitar));
  const primeras = sinEvitar.map((g) => ids.find((id) => g.includes(id))).filter((id): id is string => !!id);
  return primeras.length > 1 ? primeras : ids.slice(0, 2);
}
