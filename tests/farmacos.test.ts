import { describe, expect, it } from 'vitest';
import { interaccionesActivas } from '../src/motor/avisos';
import { evaluar } from '../src/motor/evaluar';
import { origenBloqueado, simular } from '../src/motor/motor';
import { hipertension as modelo } from '../src/temas/hipertension';
import { nodosFarmacos, ordenFarmacos, relacionesFarmacos } from '../src/temas/hipertension/farmacos';

const reglas = modelo.avisos!;
const interacciones = (e: Record<string, number>, variantes: Record<string, string> = {}) =>
  interaccionesActivas(e, reglas, 'antes', reglas.interacciones, variantes).map((i) => i.id);

describe('fármacos (fase 4)', () => {
  it('hay 8 fármacos con rueda de 0 a 1', () => {
    expect(nodosFarmacos).toHaveLength(8);
    for (const n of nodosFarmacos) {
      expect(n.tipo).toBe('farmaco');
      expect(n.rango).toEqual([0, 1]);
    }
    expect(ordenFarmacos).toEqual(nodosFarmacos.map((n) => n.id));
  });

  it('las relaciones marcadas como bloqueables coinciden con los bloqueos de los fármacos', () => {
    const nombre = new Map(nodosFarmacos.map((n) => [n.id, n.nombre.toLowerCase()]));
    const aplazados = ['aliskireno', 'vaptanes'];
    const bloqueadas = new Map<number, Set<string>>();
    for (const r of relacionesFarmacos)
      if (r.tipo === 'bloquea') for (const n of r.relaciones) bloqueadas.set(n, new Set([...(bloqueadas.get(n) ?? []), nombre.get(r.origen)!]));
    for (const r of modelo.relaciones) {
      const marcados = (r.bloqueable ?? []).map((x) => x.toLowerCase()).filter((x) => !aplazados.includes(x));
      expect(marcados.sort(), `relación ${r.n}`).toEqual([...(bloqueadas.get(r.n) ?? [])].sort());
    }
  });

  it('con dosis 0 nada cambia', () => {
    for (const c of modelo.casos.filter((x) => !x.farmacos)) {
      const sin = simular(modelo, c.causas, 'estable').valores;
      const cero = simular(modelo, { ...c.causas, ...Object.fromEntries(ordenFarmacos.map((id) => [id, 0])) }, 'estable').valores;
      for (const id of Object.keys(sin)) expect(cero[id], `caso ${c.id} ${id}`).toBeCloseTo(sin[id], 12);
    }
  });

  it('cada fármaco baja la presión media de una persona sana', () => {
    for (const id of ordenFarmacos) expect(simular(modelo, { [id]: 1 }, 'estable').valores.pam, id).toBeLessThan(-0.02);
  });

  it('el IECA baja la angiotensina II y el ARA-II la sube; los dos suben la renina', () => {
    const ieca = simular(modelo, { ieca: 1 }, 'estable').valores;
    const ara2 = simular(modelo, { ara2: 1 }, 'estable').valores;
    expect(ieca.angII).toBeLessThan(0);
    expect(ara2.angII).toBeGreaterThan(0.15);
    expect(ieca.renina).toBeGreaterThan(0.15);
    expect(ara2.renina).toBeGreaterThan(0.15);
  });

  it('la tiazida baja el potasio más que el diurético de asa (Fable 5.2, PMID 7388366)', () => {
    expect(simular(modelo, { tiazida: 1 }, 'estable').valores.potasio).toBeLessThan(simular(modelo, { diureticoAsa: 1 }, 'estable').valores.potasio);
  });

  it('el calcioantagonista baja la sistólica de una persona sana (Fable 5.2)', () => {
    expect(simular(modelo, { calcioantagonista: 1 }, 'estable').valores.pas).toBeLessThan(-0.15);
    expect(simular(modelo, { calcioantagonista: 1 }, 'dias').valores.pas).toBeLessThan(0.15);
  });

  it('los diuréticos bajan el potasio y la espironolactona no', () => {
    expect(simular(modelo, { tiazida: 1 }, 'estable').valores.potasio).toBeLessThan(-0.15);
    expect(simular(modelo, { diureticoAsa: 1 }, 'estable').valores.potasio).toBeLessThan(-0.15);
    expect(simular(modelo, { espironolactona: 1, ieca: 1 }, 'estable').valores.potasio).toBeGreaterThan(0.15);
  });

  it('la diuresis del caso 13 sigue en lo esperado (+0,141 en la fase 4)', () => {
    const c = evaluar(modelo).find((x) => x.caso === 13 && x.nodo === 'diuresis')!;
    expect(c.valor).toBeCloseTo(0.141, 3);
  });

  it('bloquear una causa solo recorta su desviación; un mecanismo pierde también el tono', () => {
    expect(origenBloqueado(0, 0.5, false)).toBe(0);
    expect(origenBloqueado(1, 0.5, false)).toBe(0.5);
    expect(origenBloqueado(0, 0.5, true)).toBe(-0.5);
    expect(origenBloqueado(0.4, 0.5, true)).toBeCloseTo(-0.3);
    expect(origenBloqueado(0.4, 0, true)).toBe(0.4);
  });
});

describe('interacciones', () => {
  it('IECA o ARA-II en la estenosis', () => {
    expect(interacciones({ estenosis: 1, ieca: 1 })).toEqual(['estenosis-sraa']);
    expect(interacciones({ estenosis: 1, ara2: 0.5 })).toEqual(['estenosis-sraa']);
    expect(interacciones({ estenosis: 1 })).toEqual([]);
  });
  it('betabloqueante sin alfabloqueante en el feocromocitoma', () => {
    expect(interacciones({ feo: 1, betabloqueante: 1 })).toEqual(['feo-beta']);
    expect(interacciones({ feo: 1, betabloqueante: 1, alfabloqueante: 1 })).toEqual([]);
    expect(interacciones({ betabloqueante: 1 })).toEqual([]);
  });
  it('deshidratación con fármacos que dependen del volumen o de la angiotensina II', () => {
    expect(interacciones({ accesoAgua: -1, ieca: 1 })).toEqual(['deshidratacion']);
    expect(interacciones({ accesoAgua: -1, tiazida: 0.5 })).toEqual(['deshidratacion']);
    expect(interacciones({ accesoAgua: -1, calcioantagonista: 1 })).toEqual([]);
    expect(interacciones({ accesoAgua: -1 })).toEqual([]);
  });
  it('doble bloqueo y potasio', () => {
    expect(interacciones({ ieca: 1, ara2: 1 })).toEqual(['doble-bloqueo']);
    expect(interacciones({ ieca: 1, espironolactona: 1 })).toEqual(['potasio']);
  });
  it('ningún caso de la clase con fármaco salta salvo los que enseñan la contraindicación', () => {
    const conAviso = modelo.casos.filter((c) => c.farmacos && interacciones({ ...c.causas, ...c.farmacos }, c.variantes).length).map((c) => c.id);
    expect(conAviso).toEqual([15, 19, 35]);
  });
});
