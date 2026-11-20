import { describe, expect, it } from 'vitest';
import { flecha, simular } from '../src/motor/motor';
import { hipertension as modelo } from '../src/temas/hipertension';

/** Revisión del nodo edad (17 nov 2026): relación 121, la edad refuerza la falta de agua. */
const sin121 = { ...modelo, relaciones: modelo.relaciones.filter((r) => r.n !== 121) };
const v = (m: typeof modelo, causas: Record<string, number>) => simular(m, causas, 'estable').valores;

describe('revisión del nodo edad: relación 121', () => {
  it('solo actúa con déficit de agua: la edad sola y la falta de agua sin edad no cambian', () => {
    const lista: Record<string, number>[] = [{ edad: 1 }, { edad: 1, sal: 1 }, { edad: 1, factores: 1 }, { accesoAgua: -0.5 }, { accesoAgua: -1 }];
    for (const causas of lista) {
      const a = v(modelo, causas);
      const b = v(sin121, causas);
      for (const id of ['pas', 'pad', 'volemia', 'natremia', 'creatinina', 'sed']) expect(a[id], `${JSON.stringify(causas)} ${id}`).toBeCloseTo(b[id], 6);
    }
  });

  it('con la edad y poca agua, la natremia sube antes (= → ↑ con acceso −0,5; ↑ → ↑↑ sin agua)', () => {
    expect(flecha(v(sin121, { edad: 1, accesoAgua: -0.5 }).natremia)).toBe('=');
    expect(flecha(v(modelo, { edad: 1, accesoAgua: -0.5 }).natremia)).toBe('↑');
    expect(flecha(v(sin121, { edad: 1, accesoAgua: -1 }).natremia)).toBe('↑');
    expect(flecha(v(modelo, { edad: 1, accesoAgua: -1 }).natremia)).toBe('↑↑');
    expect(v(modelo, { edad: 1, accesoAgua: -0.7 }).volemia).toBeLessThan(v(modelo, { accesoAgua: -0.7 }).volemia - 0.1);
  });
});
