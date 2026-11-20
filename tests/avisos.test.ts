import { describe, expect, it } from 'vitest';
import { causasNoComunes, combinacionHipotetica, frecuenciaDe, fueraDeRango } from '../src/motor/avisos';
import { simular } from '../src/motor/motor';
import { hipertension as modelo } from '../src/temas/hipertension';

const reglas = modelo.avisos!;
const hipotetica = (causas: Record<string, number>) => combinacionHipotetica(modelo, causas, reglas).map((c) => c.id);

describe('avisos de realismo', () => {
  it('cada causa no común tiene etiqueta de frecuencia', () => {
    for (const n of modelo.nodos.filter((x) => x.tipo === 'causa')) {
      expect(n.frecuencia, n.id).toBeDefined();
      if (n.frecuencia !== 'comun') expect(reglas.frecuencia[n.frecuencia!].pastilla).toBeTruthy();
    }
  });

  it('el hiperaldosteronismo es poco frecuente (hito 3d)', () => {
    expect(modelo.nodos.find((n) => n.id === 'hiperaldo')?.frecuencia).toBe('poco_frecuente');
  });

  it('ningún caso de la clase es una combinación hipotética', () => {
    for (const c of modelo.casos) expect(hipotetica(c.causas), `caso ${c.id}`).toEqual([]);
  });

  it('dos causas raras: combinación hipotética con las dos', () => {
    expect(hipotetica({ tumorRenina: 1, feo: 1 })).toEqual(['tumorRenina', 'feo']);
    expect(hipotetica({ adhAutonoma: -1, feo: 0.5 })).toEqual(['adhAutonoma', 'feo']);
  });

  it('ADH autónoma: la diabetes insípida es rara y el SIADH poco frecuente (Fable 5.2)', () => {
    const adh = modelo.nodos.find((n) => n.id === 'adhAutonoma')!;
    expect(frecuenciaDe(adh, -1)).toBe('rara');
    expect(frecuenciaDe(adh, 1)).toBe('poco_frecuente');
    expect(hipotetica({ adhAutonoma: 1, feo: 1 })).toEqual([]);
    expect(hipotetica({ adhAutonoma: -1, feo: 1 })).toEqual(['adhAutonoma', 'feo']);
    expect(hipotetica({ adhAutonoma: 1, regaliz: 1, estenosis: 1 })).toEqual(['adhAutonoma', 'estenosis', 'regaliz']);
  });

  it('tres no comunes: hipotética; dos poco frecuentes o una rara y una poco frecuente: no', () => {
    expect(hipotetica({ estenosis: 1, regaliz: 1, tiroides: -1 })).toEqual(['tiroides', 'estenosis', 'regaliz']);
    expect(hipotetica({ estenosis: 1, regaliz: 1 })).toEqual([]);
    expect(hipotetica({ feo: 1, regaliz: 1 })).toEqual([]);
  });

  it('un mando apenas girado no cuenta como causa activa', () => {
    expect(hipotetica({ tumorRenina: 1, feo: 0.1 })).toEqual([]);
    expect(causasNoComunes(modelo, { feo: 0.15 }, reglas).map((c) => c.id)).toEqual(['feo']);
  });

  it('fuera de rango: la aldosterona del caso 8 y la volemia del caso 11, en estado estable', () => {
    const caso = (id: number) => modelo.casos.find((c) => c.id === id)!.causas;
    expect(fueraDeRango(simular(modelo, caso(8), 'estable').valores, reglas)).toEqual(['aldo']);
    expect(fueraDeRango(simular(modelo, caso(11), 'estable').valores, reglas)).toEqual(['volemia']);
    expect(fueraDeRango(simular(modelo, {}, 'estable').valores, reglas)).toEqual([]);
  });

  it('solo vigila salidas y analítica', () => {
    const tipos = new Set(reglas.fueraDeRango.nodos.map((id) => modelo.nodos.find((n) => n.id === id)?.tipo));
    expect([...tipos].every((t) => t === 'salida' || t === 'analitica' || t === 'mecanismo')).toBe(true);
    expect(reglas.fueraDeRango.nodos).not.toContain('placa');
  });
});
