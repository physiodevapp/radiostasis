import type { Relacion } from './tipos';

/**
 * Ajustes de intensidad de la calibración de un tema (fase N2: por tema). Cada
 * ajuste dice qué cambia respecto a la intensidad de partida (la de la
 * biblioteca común) y por qué. La hipertensión tiene los suyos en
 * src/temas/hipertension/calibracion.ts.
 */
export interface Ajuste {
  n: number;
  campo: 'intensidad' | 'intensidadNegativa';
  antes: number | undefined;
  despues: number;
  motivo: string;
}

/** Aplica los ajustes de un tema a sus relaciones (copias; las demás, tal cual). */
export function aplicarAjustes(base: Relacion[], lista: readonly Ajuste[]): Relacion[] {
  return base.map((r) => {
    const propios = lista.filter((a) => a.n === r.n);
    if (propios.length === 0) return r;
    if (r.tipo !== 'suma') throw new Error(`La relación ${r.n} no tiene intensidad`);
    const copia = { ...r };
    for (const a of propios) copia[a.campo] = a.despues;
    return copia;
  });
}
