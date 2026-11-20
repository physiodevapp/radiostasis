import { describe, expect, it } from 'vitest';
import { interaccionesActivas } from '../src/motor/avisos';
import { aplicarVariantes, simular, varianteDe } from '../src/motor/motor';
import type { RelacionSuma } from '../src/motor/tipos';
import { hipertension as modelo } from '../src/temas/hipertension';

/** Fase 7: lateralidad de la estenosis renal (docs/modelo-v2.1.md, «Cambios de la fase 7»). */
const reglas = modelo.avisos!;
const sim = (entradas: Record<string, number>, estenosis?: string, escala: 'estable' | 'dias' | 'minutos' = 'estable') =>
  simular(modelo, entradas, escala, { variantes: estenosis ? { estenosis } : {} }).valores;
const avisos = (entradas: Record<string, number>, estenosis?: string) =>
  interaccionesActivas(entradas, reglas, 'antes', reglas.interacciones, estenosis ? { estenosis } : {}).map((i) => i.id);

describe('lateralidad de la estenosis', () => {
  it('la variante de siempre es la bilateral, en el nodo y en los avisos', () => {
    expect(varianteDe(modelo, 'estenosis')).toBe('bilateral');
    expect(varianteDe(modelo, 'estenosis', { estenosis: 'no-existe' })).toBe('bilateral');
    for (const n of modelo.nodos.filter((x) => x.variantes)) expect(reglas.variantesPorDefecto?.[n.id], n.id).toBe(n.variantes![0].id);
  });

  it('sin variante elegida, el modelo es el de antes de la fase 7', () => {
    const m = aplicarVariantes(modelo);
    expect(m.relaciones.some((r) => r.n === 119 || r.n === 120)).toBe(false);
    expect((m.relaciones.find((r) => r.n === 38) as RelacionSuma).intensidad).toBe(1);
    expect(sim({ estenosis: 1 })).toEqual(sim({ estenosis: 1 }, 'bilateral'));
  });

  it('el riñón único se calcula igual que la bilateral', () => {
    const lista: Record<string, number>[] = [{ estenosis: 1 }, { estenosis: 1, ieca: 1 }, { estenosis: 0.5, ara2: 1 }, { estenosis: 1, sal: 1 }];
    for (const e of lista)
      for (const escala of ['estable', 'dias', 'minutos'] as const)
        expect(sim(e, 'unico', escala)).toEqual(sim(e, 'bilateral', escala));
  });

  it('las relaciones 119 y 120 solo actúan en la unilateral, y la 38 se debilita', () => {
    const m = aplicarVariantes(modelo, { estenosis: 'unilateral' });
    expect(m.relaciones.filter((r) => r.n === 119 || r.n === 120)).toHaveLength(2);
    expect((m.relaciones.find((r) => r.n === 38) as RelacionSuma).intensidad).toBe(0.3);
    // Aplicarla dos veces da lo mismo.
    expect(aplicarVariantes(m, { estenosis: 'bilateral' }).relaciones).toEqual(m.relaciones);
  });

  it('unilateral frente a bilateral: más renina, sin volumen de más ni creatinina alta', () => {
    const uni = sim({ estenosis: 1 }, 'unilateral');
    const bi = sim({ estenosis: 1 }, 'bilateral');
    expect(uni.renina).toBeGreaterThan(bi.renina);
    expect(uni.volemia).toBeLessThan(bi.volemia);
    expect(uni.creatinina).toBeLessThan(bi.creatinina);
  });

  it('con IECA la creatinina de la unilateral sube menos de la mitad que en la bilateral (casos 35 y 15)', () => {
    expect(sim({ estenosis: 1, ieca: 1 }, 'unilateral').creatinina).toBeLessThan(sim({ estenosis: 1, ieca: 1 }, 'bilateral').creatinina / 2);
  });

  it('el aviso de IECA o ARA-II cambia con la variante', () => {
    expect(avisos({ estenosis: 1, ieca: 1 })).toEqual(['estenosis-sraa']);
    expect(avisos({ estenosis: 1, ieca: 1 }, 'unico')).toEqual(['estenosis-sraa']);
    expect(avisos({ estenosis: 1, ara2: 1 }, 'unilateral')).toEqual(['estenosis-unilateral-sraa']);
    expect(avisos({ estenosis: 1 }, 'unilateral')).toEqual([]);
  });

  it('la diuresis del caso 13 no se mueve (+0,141)', () => {
    const c13 = modelo.casos.find((c) => c.id === 13)!;
    expect(sim({ ...c13.causas }).diuresis).toBeCloseTo(0.141, 3);
  });
});
