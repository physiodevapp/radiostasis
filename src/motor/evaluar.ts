import { flecha, simular } from './motor';
import type { Caso, Escala, Expectativa, Flecha, Modelo } from './tipos';

export interface Comprobacion {
  caso: number;
  escala: Escala;
  condicion?: string;
  nodo: string;
  valor: number;
  obtenido: Flecha;
  esperado: Flecha[];
  ok: boolean;
  /** Motivo, si el resultado está pendiente de decisión (no cuenta como fallo). */
  pendiente?: string;
}

export function comprobarExpectativa(modelo: Modelo, caso: Caso, e: Expectativa): Comprobacion[] {
  const causas = { ...caso.causas, ...caso.farmacos, ...caso.ejercicio, ...e.ajustes };
  const { valores } = simular(modelo, causas, e.escala, { momento: e.momento, variantes: caso.variantes });
  return Object.entries(e.valores).map(([nodo, esp]) => {
    const esperado = Array.isArray(esp) ? esp : [esp];
    const obtenido = flecha(valores[nodo]);
    return {
      caso: caso.id, escala: e.escala, condicion: e.condicion, nodo,
      valor: valores[nodo], obtenido, esperado, ok: esperado.includes(obtenido),
      pendiente: e.pendientes?.[nodo],
    };
  });
}

/** Comprueba todos los casos del modelo. */
export function evaluar(modelo: Modelo): Comprobacion[] {
  return modelo.casos.flatMap((c) => c.esperado.flatMap((e) => comprobarExpectativa(modelo, c, e)));
}
