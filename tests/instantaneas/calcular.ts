/**
 * Simulaciones de la instantánea numérica de la hipertensión (ver
 * scripts/instantanea.ts). El mismo cálculo genera el archivo y lo comprueba.
 */
import { simular } from '../../src/motor/motor';
import type { Escala, Modelo, Momento, Variantes } from '../../src/motor/tipos';
import { hipertension, hipertensionDocumento, hipertensionSinCalibrar } from '../../src/temas/hipertension';
import { retos } from '../../src/temas/hipertension/retos';

export interface Simulacion {
  /** Qué se simula («caso 3», «reto 2», «sesión»…). */
  id: string;
  modelo: 'hipertension' | 'sinCalibrar' | 'documento';
  entradas: Record<string, number>;
  escala: Escala;
  momento?: Momento;
  variantes?: Variantes;
}

/** Valores en el orden de `Instantanea.nodos` (así el archivo ocupa la mitad). */
export interface Resultado extends Simulacion {
  valores: number[];
  iteraciones: number;
  convergido: boolean;
  base?: number[];
}

export interface Instantanea {
  /** Ids de los nodos del modelo de hipertensión, en orden. */
  nodos: string[];
  /** El modelo como datos (nodos, relaciones, casos, parámetros y avisos). */
  modelos: Record<Simulacion['modelo'], unknown>;
  simulaciones: Resultado[];
}

const MODELOS: Record<Simulacion['modelo'], Modelo> = {
  hipertension,
  sinCalibrar: hipertensionSinCalibrar,
  documento: hipertensionDocumento,
};

const ESCALAS: Escala[] = ['minutos', 'dias', 'estable'];
const SESIONES = ['sesionAerobica', 'sesionFuerza'];
const ENTRENAMIENTOS = ['entrenoAerobico', 'entrenoFuerza', 'entrenoIsometrico'];

/** Lista de simulaciones, siempre en el mismo orden. */
export function simulaciones(): Simulacion[] {
  const l: Simulacion[] = [];
  const m = hipertension;
  for (const c of m.casos) {
    const entradas = { ...c.causas, ...c.farmacos, ...c.ejercicio };
    for (const escala of ESCALAS) l.push({ id: `caso ${c.id}`, modelo: 'hipertension', entradas, escala, momento: c.momento, variantes: c.variantes });
    if (c.ejercicio) for (const momento of ['antes', 'durante', 'despues'] as Momento[])
      l.push({ id: `caso ${c.id} sesión`, modelo: 'hipertension', entradas, escala: 'estable', momento, variantes: c.variantes });
    c.esperado.forEach((e, i) => {
      if (!e.ajustes) return;
      for (const escala of ESCALAS)
        l.push({ id: `caso ${c.id} expectativa ${i}`, modelo: 'hipertension', entradas: { ...entradas, ...e.ajustes }, escala, momento: e.momento, variantes: c.variantes });
    });
    // Sin fármacos ni ejercicio, el caso en los modelos sin calibrar y del documento.
    for (const modelo of ['sinCalibrar', 'documento'] as const)
      l.push({ id: `caso ${c.id} causas`, modelo, entradas: { ...c.causas }, escala: 'estable', variantes: c.variantes });
  }
  for (const r of retos)
    for (const escala of ESCALAS)
      l.push({ id: `reto ${r.id}`, modelo: 'hipertension', entradas: { ...r.causas, ...r.farmacos }, escala, variantes: r.variantes });
  // Variantes de la estenosis (fase 7).
  for (const v of ['bilateral', 'unilateral', 'unico'])
    for (const escala of ESCALAS)
      l.push({ id: `estenosis ${v}`, modelo: 'hipertension', entradas: { estenosis: 1 }, escala, variantes: { estenosis: v } });
  // Sesiones de ejercicio (fase 5): sano y cada caso, durante y al terminar, y el entrenamiento solo.
  const pacientes: [string, Record<string, number>][] = [['sano', {}], ...m.casos.map((c) => [`caso ${c.id}`, { ...c.causas, ...c.farmacos }] as [string, Record<string, number>])];
  for (const [nombre, base] of pacientes)
    for (const s of SESIONES)
      for (const intensidad of [0.5, 1])
        for (const momento of ['durante', 'despues'] as Momento[])
          l.push({ id: `sesión ${s} ${intensidad} · ${nombre}`, modelo: 'hipertension', entradas: { ...base, [s]: intensidad }, escala: 'estable', momento });
  for (const e of ENTRENAMIENTOS)
    for (const escala of ESCALAS) {
      l.push({ id: `entrenamiento ${e}`, modelo: 'hipertension', entradas: { [e]: 1 }, escala });
      l.push({ id: `entrenamiento ${e} con sal`, modelo: 'hipertension', entradas: { [e]: 1, sal: 1 }, escala });
    }
  for (const e of ENTRENAMIENTOS)
    for (const s of SESIONES)
      for (const momento of ['durante', 'despues'] as Momento[])
        l.push({ id: `entrenamiento ${e} y ${s}`, modelo: 'hipertension', entradas: { [e]: 1, [s]: 1 }, escala: 'estable', momento });
  return l;
}

export const nodos = () => hipertension.nodos.map((n) => n.id);

export function calcular(s: Simulacion): Resultado {
  const r = simular(MODELOS[s.modelo], s.entradas, s.escala, { momento: s.momento, variantes: s.variantes });
  const ids = nodos();
  const lista = (v: Record<string, number>) => {
    if (Object.keys(v).length !== ids.length) throw new Error(`${s.id}: los nodos no coinciden`);
    return ids.map((id) => v[id]);
  };
  return { ...s, valores: lista(r.valores), iteraciones: r.iteraciones, convergido: r.convergido, ...(r.base ? { base: lista(r.base) } : {}) };
}

/** El modelo como datos JSON (sin funciones ni valores indefinidos). */
export const comoDatos = (m: Modelo): unknown => JSON.parse(JSON.stringify(m));

export const calcularModelos = (): Instantanea['modelos'] => ({
  hipertension: comoDatos(hipertension),
  sinCalibrar: comoDatos(hipertensionSinCalibrar),
  documento: comoDatos(hipertensionDocumento),
});

export function calcularInstantanea(): Instantanea {
  return {
    nodos: nodos(),
    modelos: calcularModelos(),
    simulaciones: simulaciones().map(calcular),
  };
}
