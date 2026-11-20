import { describe, expect, it } from 'vitest';
import { entradaEfectiva, flecha, relacionActiva, simular } from '../src/motor/motor';
import type { Modelo, Nodo, Relacion, RelacionSuma } from '../src/motor/tipos';

const parametros = { amortiguacion: 0.5, paso: 0.02, horizonteDias: 1, tolerancia: 1e-9, maxIteraciones: 100000 };
const causa = (id: string, rango: [number, number] = [-1, 1]): Nodo =>
  ({ id, codigo: id, nombre: id, tipo: 'causa', calculo: 'entrada', rango });
const suma = (id: string): Nodo => ({ id, codigo: id, nombre: id, tipo: 'mecanismo', calculo: 'suma', rango: [-1, 1] });
const rel = (n: number, origen: string, destino: string, intensidad: number, extra: Partial<RelacionSuma> = {}): RelacionSuma =>
  ({ n, tipo: 'suma', origen, destino, signo: '+', intensidad, tiempo: 'minutos', explicacion: '', fuente: '', ...extra });
const modelo = (nodos: Nodo[], relaciones: Relacion[]): Modelo =>
  ({ id: 't', nombre: 't', nodos, relaciones, casos: [], parametros });

describe('flechas', () => {
  it('usa los umbrales 0,15 y 0,5', () => {
    expect(flecha(0)).toBe('=');
    expect(flecha(0.149)).toBe('=');
    expect(flecha(-0.149)).toBe('=');
    expect(flecha(0.15)).toBe('↑');
    expect(flecha(-0.3)).toBe('↓');
    expect(flecha(0.5)).toBe('↑↑');
    expect(flecha(-0.9)).toBe('↓↓');
  });
});

describe('relaciones', () => {
  it('suma con tanh y signo', () => {
    const m = modelo([causa('a'), suma('b'), suma('c')], [rel(1, 'a', 'b', 1), rel(2, 'a', 'c', 0.6, { signo: '-' })]);
    const { valores, convergido } = simular(m, { a: 1 }, 'minutos');
    expect(convergido).toBe(true);
    expect(valores.b).toBeCloseTo(Math.tanh(1), 6);
    expect(valores.c).toBeCloseTo(Math.tanh(-0.6), 6);
  });

  it('asimetría: otra intensidad por debajo de 0', () => {
    const r = rel(1, 'a', 'b', 1, { intensidadNegativa: 0.3 });
    expect(entradaEfectiva(r, 0.5)).toBeCloseTo(0.5);
    expect(entradaEfectiva(r, -0.5)).toBeCloseTo(-0.15);
  });

  it('umbral negativo: solo actúa por debajo, y desde el umbral', () => {
    const r = rel(1, 'a', 'b', 1, { signo: '-', umbral: -0.3 });
    expect(entradaEfectiva(r, -0.2)).toBe(0);
    expect(entradaEfectiva(r, 0.8)).toBe(0);
    expect(entradaEfectiva(r, -0.8)).toBeCloseTo(0.5);
  });

  it('fija: fuera de 0 sustituye al destino', () => {
    const m = modelo([causa('a'), causa('f'), suma('b')], [rel(1, 'a', 'b', 1), { n: 2, tipo: 'fija', origen: 'f', destino: 'b', explicacion: '', fuente: '' }]);
    expect(simular(m, { a: 1, f: 0 }, 'minutos').valores.b).toBeCloseTo(Math.tanh(1), 6);
    expect(simular(m, { a: 1, f: -0.7 }, 'minutos').valores.b).toBe(-0.7);
  });

  it('modula: multiplica por (1 + origen)', () => {
    const m = modelo([causa('a'), causa('acc', [-1, 0]), suma('b')], [
      rel(1, 'a', 'b', 1),
      { n: 2, tipo: 'modula', origen: 'acc', destino: 'b', relaciones: [1], explicacion: '', fuente: '' },
    ]);
    expect(simular(m, { a: 1, acc: 0 }, 'minutos').valores.b).toBeCloseTo(Math.tanh(1), 6);
    expect(simular(m, { a: 1, acc: -0.5 }, 'minutos').valores.b).toBeCloseTo(Math.tanh(0.5), 6);
    expect(simular(m, { a: 1, acc: -1 }, 'minutos').valores.b).toBeCloseTo(0, 6);
  });

  it('modula con intensidad y signo: 1 ± intensidad × origen (revisión del modelo)', () => {
    const m = (signo: '+' | '-', intensidad: number) => modelo([causa('a'), causa('edad'), suma('b')], [
      rel(1, 'a', 'b', 1),
      { n: 2, tipo: 'modula', origen: 'edad', destino: 'b', relaciones: [1], signo, intensidad, explicacion: '', fuente: '' },
    ]);
    expect(simular(m('+', 0.5), { a: 0.4, edad: 1 }, 'minutos').valores.b).toBeCloseTo(Math.tanh(0.6), 6);
    expect(simular(m('-', 0.5), { a: 0.4, edad: 1 }, 'minutos').valores.b).toBeCloseTo(Math.tanh(0.2), 6);
    expect(simular(m('-', 2), { a: 0.4, edad: 1 }, 'minutos').valores.b).toBeCloseTo(0, 6);
    expect(simular(m('+', 0.5), { a: 0.4, edad: 0 }, 'minutos').valores.b).toBeCloseTo(Math.tanh(0.4), 6);
  });

  it('escalas de tiempo y «hasta»', () => {
    const r = rel(1, 'a', 'b', 1, { tiempo: 'dias', hasta: 'dias' });
    expect(relacionActiva(r, 'minutos')).toBe(false);
    expect(relacionActiva(r, 'dias')).toBe(true);
    expect(relacionActiva(r, 'estable')).toBe(false);
    expect(relacionActiva(rel(2, 'a', 'b', 1, { tiempo: 'estable' }), 'dias')).toBe(false);
  });
});

describe('acumulador y derivado', () => {
  // Entrada constante y salida que crece con el propio volumen: equilibrio en V = 0,5.
  const nodos: Nodo[] = [
    causa('ingesta'),
    { id: 'v', codigo: 'v', nombre: 'v', tipo: 'salida', calculo: 'acumulador', rango: [-1, 1] },
    suma('salida'),
    { id: 'd', codigo: 'd', nombre: 'd', tipo: 'salida', calculo: 'derivado', rango: [-1, 1], formula: { v: 1 / 3, salida: 2 / 3 } },
  ];
  const relaciones = [
    rel(1, 'ingesta', 'v', 1, { tiempo: 'dias' }),
    rel(2, 'salida', 'v', 1, { tiempo: 'dias', signo: '-' }),
    rel(3, 'v', 'salida', 1),
  ];
  const m = modelo(nodos, relaciones);

  it('en minutos no se mueve', () => {
    expect(simular(m, { ingesta: 0.5 }, 'minutos').valores.v).toBe(0);
  });

  it('en estado estable llega al equilibrio entrada = salida', () => {
    const { valores, convergido } = simular(m, { ingesta: 0.5 }, 'estable');
    expect(convergido).toBe(true);
    expect(valores.salida).toBeCloseTo(0.5, 4);
    expect(valores.v).toBeCloseTo(Math.atanh(0.5), 3);
    expect(valores.d).toBeCloseTo(valores.v / 3 + (2 * valores.salida) / 3, 6);
  });

  it('en días va de camino: entre 0 y el equilibrio', () => {
    const dias = simular(m, { ingesta: 0.5 }, 'dias').valores.v;
    expect(dias).toBeGreaterThan(0.1);
    expect(dias).toBeLessThan(Math.atanh(0.5) - 0.05);
  });

  it('se satura en su rango', () => {
    const m2 = modelo(nodos, [rel(1, 'ingesta', 'v', 1, { tiempo: 'dias' })]);
    expect(simular(m2, { ingesta: -1 }, 'estable').valores.v).toBe(-1);
  });
});

describe('errores de datos', () => {
  it('detecta ids desconocidos', () => {
    expect(() => simular(modelo([causa('a')], [rel(1, 'a', 'x', 1)]), {}, 'minutos')).toThrow(/destino desconocido/);
    expect(() => simular(modelo([causa('a')], []), { z: 1 }, 'minutos')).toThrow(/Causa desconocida/);
  });
});

describe('modificador: bloquea (fase 4)', () => {
  const farm: Nodo = { id: 'f', codigo: 'f', nombre: 'f', tipo: 'farmaco', calculo: 'entrada', rango: [0, 1] };
  const nodos: Nodo[] = [causa('a'), suma('m'), suma('b'), farm];
  const relaciones: Relacion[] = [
    rel(1, 'a', 'm', 1),
    rel(2, 'm', 'b', 1),
    { n: 3, tipo: 'bloquea', origen: 'f', destino: 'b', relaciones: [2], maximo: 0.5, explicacion: '', fuente: '' },
  ];
  const m = modelo(nodos, relaciones);

  it('sin dosis no cambia nada', () => {
    expect(simular(m, { a: 0.5 }, 'minutos').valores.b).toBeCloseTo(simular(m, { a: 0.5, f: 0 }, 'minutos').valores.b, 12);
  });

  it('corta también el tono normal: con todo normal, el destino baja', () => {
    expect(simular(m, { f: 1 }, 'minutos').valores.b).toBeCloseTo(Math.tanh(-0.5), 4);
  });

  it('detecta bloqueos de relaciones que no existen', () => {
    const mal = modelo(nodos, [{ ...relaciones[2], relaciones: [9] } as Relacion]);
    expect(() => simular(mal, {}, 'minutos')).toThrow(/bloquea la 9/);
  });
});
