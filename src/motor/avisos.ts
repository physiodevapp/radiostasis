import type { AvisosTema, Estado, Frecuencia, Interaccion, Modelo, Momento, Nodo, Variantes } from './tipos';

/** Frecuencia de una causa con la rueda en `valor` (según el extremo, si difiere). */
export function frecuenciaDe(nodo: Nodo, valor: number): Frecuencia | undefined {
  if (nodo.frecuenciaExtremos && valor !== 0) return nodo.frecuenciaExtremos[valor < 0 ? 0 : 1];
  return nodo.frecuencia;
}

export interface CausaNoComun {
  id: string;
  frecuencia: Exclude<Frecuencia, 'comun'>;
}

/** Causas activas que no son comunes, en el orden del modelo. */
export function causasNoComunes(modelo: Modelo, causas: Estado, reglas: AvisosTema): CausaNoComun[] {
  return modelo.nodos
    .filter((n) => n.tipo === 'causa' && Math.abs(causas[n.id] ?? 0) >= reglas.causaActiva)
    .map((n) => ({ id: n.id, frecuencia: frecuenciaDe(n, causas[n.id]) }))
    .filter((c): c is CausaNoComun => !!c.frecuencia && c.frecuencia !== 'comun');
}

/**
 * «Combinación hipotética»: dos o más causas raras activas, o tres o más no
 * comunes. Devuelve las causas implicadas, o una lista vacía si no salta.
 */
export function combinacionHipotetica(modelo: Modelo, causas: Estado, reglas: AvisosTema): CausaNoComun[] {
  const lista = causasNoComunes(modelo, causas, reglas);
  const raras = lista.filter((c) => c.frecuencia === 'rara').length;
  const salta = raras >= reglas.hipotetica.minRaras || lista.length >= reglas.hipotetica.minNoComunes;
  return salta ? lista : [];
}

/** Nodos vigilados que llegan al tope del modelo («fuera de rango»). */
export function fueraDeRango(valores: Estado, reglas: AvisosTema): string[] {
  const { nodos, umbral } = reglas.fueraDeRango;
  // Pequeño margen por el redondeo: 0,9499… cuenta como 0,95.
  return nodos.filter((id) => Math.abs(valores[id] ?? 0) >= umbral - 1e-9);
}

/**
 * Interacciones que saltan con estas entradas (causas, dosis y ejercicio), en el
 * orden del tema. Las que tienen `momentos` solo saltan en esos momentos de la sesión.
 */
export function interaccionesActivas(entradas: Estado, reglas: AvisosTema, momento: Momento = 'antes', lista: Interaccion[] = reglas.interacciones ?? [], variantes: Variantes = {}): Interaccion[] {
  return lista.filter((i) => {
    // Fase 7: con «variantes», solo salta con esas variantes de la causa (sin elegir, la de siempre).
    if (i.variantes && !Object.entries(i.variantes).every(([id, vs]) => vs.includes(variantes[id] ?? reglas.variantesPorDefecto?.[id] ?? ''))) return false;
    // Con «signo», el mando tiene que estar girado hacia ese extremo.
    const activa = (id: string) => {
      const v = entradas[id] ?? 0;
      return Math.abs(v) >= reglas.causaActiva && (!i.signo?.[id] || Math.sign(v) === i.signo[id]);
    };
    return cumple(i, activa, momento);
  });
}

/** Notas de interacción entre causas activas (fase 6), con las mismas reglas que las interacciones. */
export function notasActivas(entradas: Estado, reglas: AvisosTema, variantes: Variantes = {}): Interaccion[] {
  return interaccionesActivas(entradas, reglas, 'antes', reglas.notas ?? [], variantes);
}

function cumple(i: Interaccion, activa: (id: string) => boolean, momento: Momento): boolean {
  return (!i.momentos || i.momentos.includes(momento))
    && i.todas.every(activa) && (!i.alguna || i.alguna.some(activa)) && (!i.requiere || i.requiere.some(activa))
    && !(i.ninguna ?? []).some(activa);
}
