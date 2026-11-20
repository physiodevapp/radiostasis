import { describe, expect, it } from 'vitest';
import { interaccionesActivas } from '../src/motor/avisos';
import { evaluar } from '../src/motor/evaluar';
import { aporteRelacion, simular } from '../src/motor/motor';
import type { RelacionSuma } from '../src/motor/tipos';
import { hipertension as modelo } from '../src/temas/hipertension';
import { nodosEjercicio, ordenEjercicio, relacionesEjercicio } from '../src/temas/hipertension/ejercicio';

const reglas = modelo.avisos!;
const est = (e: Record<string, number>, momento?: 'antes' | 'durante' | 'despues') => simular(modelo, e, 'estable', { momento }).valores;
const interacciones = (e: Record<string, number>, m: 'antes' | 'durante' | 'despues') => interaccionesActivas(e, reglas, m).map((i) => i.id);

describe('ejercicio (fase 5)', () => {
  it('hay 5 modificadores de ejercicio con rueda de 0 a 1', () => {
    expect(nodosEjercicio).toHaveLength(5);
    for (const n of nodosEjercicio) {
      expect(n.tipo).toBe('ejercicio');
      expect(n.rango).toEqual([0, 1]);
    }
    expect([...ordenEjercicio].sort()).toEqual(nodosEjercicio.map((n) => n.id).sort());
  });

  it('las relaciones del ejercicio tienen números únicos, distintos de los del resto', () => {
    const todos = modelo.relaciones.map((r) => r.n);
    expect(new Set(todos).size).toBe(todos.length);
    for (const r of relacionesEjercicio) expect(r.n).toBeGreaterThanOrEqual(94);
  });

  it('sin ejercicio (y con la sesión en «antes») nada cambia', () => {
    for (const c of modelo.casos.filter((x) => !x.ejercicio)) {
      const e = { ...c.causas, ...c.farmacos };
      const sin = est(e);
      const sesionAntes = est({ ...e, sesionAerobica: 1, sesionFuerza: 1 }, 'antes');
      for (const id of Object.keys(sin)) if (!id.startsWith('sesion')) expect(sesionAntes[id], `caso ${c.id} ${id}`).toBeCloseTo(sin[id], 12);
    }
  });

  it('una sesión a intensidad 0 deja al paciente como antes', () => {
    for (const m of ['durante', 'despues'] as const) {
      const r = simular(modelo, { sal: 1 }, 'estable', { momento: m });
      for (const id of Object.keys(r.valores)) expect(r.valores[id], `${m} ${id}`).toBeCloseTo(r.base![id], 4);
    }
  });

  it('la sesión parte del estado estable: el mayor conserva su rigidez', () => {
    const r = simular(modelo, { edad: 1, factores: 1, sesionAerobica: 0.5 }, 'minutos', { momento: 'durante' });
    expect(r.valores.rigidez).toBeGreaterThan(0.5);
    expect(r.valores.volemia).toBeCloseTo(r.base!.volemia, 12);
  });

  it('todos los casos de ejercicio convergen', () => {
    for (const c of modelo.casos.filter((x) => x.ejercicio))
      expect(simular(modelo, { ...c.causas, ...c.farmacos, ...c.ejercicio }, 'estable', { momento: c.momento }).convergido, `caso ${c.id}`).toBe(true);
  });

  it('en el aeróbico la diastólica no sube; en la fuerza sí', () => {
    const aer = est({ sesionAerobica: 1 }, 'durante');
    const fue = est({ sesionFuerza: 1 }, 'durante');
    expect(aer.pad).toBeLessThan(0.15);
    expect(fue.pad).toBeGreaterThan(0.5);
  });

  it('el betabloqueante limita la subida de la frecuencia en el esfuerzo', () => {
    expect(est({ sesionAerobica: 0.5, betabloqueante: 1 }, 'durante').fc).toBeLessThan(est({ sesionAerobica: 0.5 }, 'durante').fc - 0.3);
  });

  it('al terminar una sesión aeróbica la presión baja respecto a antes', () => {
    for (const causas of [{}, { sal: 1 }, { hiperaldo: 1 }] as Record<string, number>[]) {
      const r = simular(modelo, { ...causas, sesionAerobica: 0.75 }, 'estable', { momento: 'despues' });
      expect(r.valores.pam, JSON.stringify(causas)).toBeLessThan(r.base!.pam - 0.1);
    }
  });

  it('el entrenamiento no cambia la presión de una persona sana y baja la diastólica del hipertenso', () => {
    for (const id of ['entrenoAerobico', 'entrenoFuerza', 'entrenoIsometrico']) {
      expect(Math.abs(est({ [id]: 1 }).pas), id).toBeLessThan(0.15);
      expect(est({ sal: 1, [id]: 1 }).pad, id).toBeLessThan(est({ sal: 1 }).pad - 0.08);
    }
  });

  it('el isométrico es el entrenamiento que más baja la diastólica (Edwards 2023, PMID 37491419)', () => {
    const pad = (id: string) => est({ sal: 1, [id]: 1 }).pad;
    expect(pad('entrenoIsometrico')).toBeLessThan(pad('entrenoAerobico'));
    expect(pad('entrenoIsometrico')).toBeLessThan(pad('entrenoFuerza'));
  });

  it('solo el aeróbico baja la sistólica de la dieta alta en sal (cambio 1 de Fable 5.2)', () => {
    expect(est({ sal: 1, entrenoAerobico: 1 }).pas).toBeLessThan(0.15);
    expect(est({ sal: 1, entrenoAerobico: 1, entrenoFuerza: 1, entrenoIsometrico: 1 }).pas).toBeLessThan(0.15);
    expect(Math.abs(est({ entrenoAerobico: 1, entrenoFuerza: 1, entrenoIsometrico: 1 }).pas)).toBeLessThan(0.15);
  });

  it('la perfusión renal no sube en la sesión (cambios 2 y 3 de Fable 5.2, PMID 29525855)', () => {
    expect(est({ sesionAerobica: 0.5 }, 'durante').perfRenal).toBeLessThan(0.15);
    expect(est({ sesionAerobica: 1 }, 'durante').perfRenal).toBeLessThan(-0.15);
    expect(est({ sesionFuerza: 1 }, 'durante').perfRenal).toBeLessThan(0.15);
  });

  it('en la sesión, el barorreflejo de la ficha frena la subida de la presión (como en el motor)', () => {
    const r = simular(modelo, { sal: 1, sesionFuerza: 0.5 }, 'estable', { momento: 'durante' });
    const baro = modelo.relaciones.find((x) => x.n === 65) as RelacionSuma;
    expect(r.valores.pam).toBeGreaterThan(r.base!.pam);
    expect(aporteRelacion(modelo, baro, r.valores, 'durante', r.base)).toBeLessThan(0);
  });

  it('la diuresis del caso 13 sigue en lo esperado (+0,141)', () => {
    const c = evaluar(modelo).find((x) => x.caso === 13 && x.nodo === 'diuresis')!;
    expect(c.valor).toBeCloseTo(0.141, 3);
  });
});

describe('avisos del ejercicio', () => {
  it('solo saltan en su momento', () => {
    expect(interacciones({ betabloqueante: 1, sesionAerobica: 0.5 }, 'durante')).toEqual(['ejercicio-beta']);
    expect(interacciones({ betabloqueante: 1, sesionAerobica: 0.5 }, 'antes')).toEqual([]);
    expect(interacciones({ alfabloqueante: 1, sesionAerobica: 0.5 }, 'despues')).toEqual(['ejercicio-alfa']);
    expect(interacciones({ alfabloqueante: 1, sesionAerobica: 0.5 }, 'durante')).toEqual([]);
  });
  it('feocromocitoma, tiroides, deshidratación y Valsalva', () => {
    expect(interacciones({ feo: 1, sesionAerobica: 0.5 }, 'durante')).toEqual(['ejercicio-feo']);
    expect(interacciones({ tiroides: 1, sesionAerobica: 1 }, 'durante')).toEqual(['ejercicio-tiroides']);
    expect(interacciones({ tiazida: 1, sesionAerobica: 0.5 }, 'durante')).toEqual(['ejercicio-deshidratacion']);
    expect(interacciones({ tiazida: 1 }, 'durante')).toEqual([]);
    expect(interacciones({ sesionFuerza: 1 }, 'durante')).toEqual(['ejercicio-valsalva']);
  });
  it('el entrenamiento con feocromocitoma avisa en cualquier momento (corrección 30 de Fable 5.2)', () => {
    expect(interacciones({ feo: 1, entrenoAerobico: 1 }, 'antes')).toEqual(['entreno-feo']);
    expect(interacciones({ entrenoAerobico: 1 }, 'antes')).toEqual([]);
  });
  it('sin sesión no salta ninguno', () => {
    for (const c of modelo.casos) expect(interacciones({ ...c.causas, ...c.farmacos }, 'durante').filter((x) => x.startsWith('ejercicio')), `caso ${c.id}`).toEqual([]);
  });
});
