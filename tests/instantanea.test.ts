import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { calcular, calcularModelos, nodos, simulaciones, type Instantanea } from './instantaneas/calcular';

/**
 * Fase N2 (M8 de la revisión de Fable): la hipertensión, idéntica en valores
 * numéricos. tests/instantaneas/hipertension.json se generó con el código de la
 * v0.7.0, antes de la biblioteca común (scripts/instantanea.ts). Con la
 * biblioteca común, el registro de temas y los ajustes por tema, cada valor de
 * cada simulación tiene que coincidir (diferencia máxima 1e-12) y el modelo,
 * como datos, tiene que ser el mismo.
 */
const guardada: Instantanea = JSON.parse(readFileSync(new URL('./instantaneas/hipertension.json', import.meta.url), 'utf8'));
const TOLERANCIA = 1e-12;

describe('instantánea numérica de la hipertensión', () => {
  it('el modelo como datos es el mismo (nodos, relaciones, casos, parámetros y avisos)', () => {
    expect(nodos()).toEqual(guardada.nodos);
    const actuales = calcularModelos();
    for (const k of Object.keys(guardada.modelos) as (keyof Instantanea['modelos'])[]) expect(actuales[k], k).toEqual(guardada.modelos[k]);
  });

  it('se simulan las mismas situaciones', () => {
    const lista = simulaciones();
    expect(lista.length).toBe(guardada.simulaciones.length);
    lista.forEach((s, i) => {
      const { valores, iteraciones, convergido, base, ...g } = guardada.simulaciones[i];
      expect(JSON.parse(JSON.stringify(s)), s.id).toEqual(g);
    });
  });

  it('cada valor coincide en los casos, los retos y las sesiones de ejercicio, en las tres escalas', () => {
    let peor = 0;
    guardada.simulaciones.forEach((g) => {
      const r = calcular(g);
      expect(r.iteraciones, g.id).toBe(g.iteraciones);
      expect(r.convergido, g.id).toBe(g.convergido);
      const comparar = (a: number[], b: number[]) =>
        a.forEach((v, j) => {
          const d = Math.abs(v - b[j]);
          peor = Math.max(peor, d);
          if (d > TOLERANCIA) expect.fail(`${g.id} (${g.escala}${g.momento ? `, ${g.momento}` : ''}): ${guardada.nodos[j]} ${v} ≠ ${b[j]}`);
        });
      comparar(r.valores, g.valores);
      if (g.base || r.base) comparar(r.base ?? [], g.base ?? []);
    });
    expect(peor).toBeLessThanOrEqual(TOLERANCIA);
  }, 120_000);
});
