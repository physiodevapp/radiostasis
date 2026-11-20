import { describe, expect, it } from 'vitest';
import { combinacionHipotetica, fueraDeRango } from '../src/motor/avisos';
import { flecha, simular } from '../src/motor/motor';
import { causasDeReto, corregirReto } from '../src/motor/reto';
import { hipertension as modelo } from '../src/temas/hipertension';
import { retos } from '../src/temas/hipertension/retos';

const reglas = modelo.avisos!;
const tipo = (id: string) => modelo.nodos.find((n) => n.id === id)?.tipo;

describe('modo reto (fase 6)', () => {
  it('once retos: cuatro de una causa, cuatro de dos, dos con fármaco y el de la lateralidad (fase 7), con números seguidos', () => {
    expect(retos.map((r) => r.id)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
    expect(retos.map((r) => r.nivel)).toEqual(['una', 'una', 'una', 'una', 'dos', 'dos', 'dos', 'dos', 'farmaco', 'farmaco', 'una']);
    for (const r of retos) {
      expect(causasDeReto(r).length, `reto ${r.id}`).toBe(r.nivel === 'dos' ? 2 : 1);
      for (const id of causasDeReto(r)) expect(tipo(id), `reto ${r.id}: ${id}`).toBe('causa');
      for (const id of Object.keys(r.farmacos ?? {})) expect(tipo(id), `reto ${r.id}: ${id}`).toBe('farmaco');
      expect(!!r.farmacos, `reto ${r.id}`).toBe(r.nivel === 'farmaco');
      expect(r.pistas.length, `reto ${r.id}`).toBe(2);
      expect(r.delata.length, `reto ${r.id}`).toBeGreaterThanOrEqual(2);
      expect(Object.keys(r.claves).length, `reto ${r.id}`).toBeGreaterThanOrEqual(3);
    }
  });

  it('ninguno es una combinación hipotética', () => {
    for (const r of retos) expect(combinacionHipotetica(modelo, r.causas, reglas), `reto ${r.id}`).toEqual([]);
  });

  it('las claves se ven en el modelo y ninguna está en el tope de escala', () => {
    for (const r of retos) {
      const v = simular(modelo, { ...r.causas, ...r.farmacos }, 'estable', { variantes: r.variantes }).valores;
      const tope = new Set(fueraDeRango(v, reglas));
      for (const [id, esperada] of Object.entries(r.claves)) {
        expect(flecha(v[id]), `reto ${r.id}: ${id}`).toBe(esperada);
        expect(tope.has(id), `reto ${r.id}: ${id} en el tope`).toBe(false);
      }
    }
  });

  it('reto 11: las claves separan la estenosis unilateral del tumor de renina y de la bilateral', () => {
    const r = retos.find((x) => x.id === 11)!;
    const distinta = (v: Record<string, number>) => Object.entries(r.claves).some(([id, f]) => flecha(v[id]) !== f);
    expect(distinta(simular(modelo, { tumorRenina: 1 }, 'estable').valores)).toBe(true);
    expect(distinta(simular(modelo, { estenosis: 1 }, 'estable').valores)).toBe(true);
  });

  it('corrige acierto, parcial y fallo', () => {
    const r = retos.find((x) => x.id === 6)!;
    expect(corregirReto(['sal', 'caidaFiltracion'], r)).toEqual({ resultado: 'acierto', aciertos: ['sal', 'caidaFiltracion'], sobran: [], faltan: [] });
    expect(corregirReto(['sal'], r)).toEqual({ resultado: 'parcial', aciertos: ['sal'], sobran: [], faltan: ['caidaFiltracion'] });
    expect(corregirReto(['sal', 'feo'], r)).toEqual({ resultado: 'parcial', aciertos: ['sal'], sobran: ['feo'], faltan: ['caidaFiltracion'] });
    expect(corregirReto(['feo'], r)).toEqual({ resultado: 'fallo', aciertos: [], sobran: ['feo'], faltan: ['caidaFiltracion', 'sal'] });
    expect(corregirReto([], r).resultado).toBe('fallo');
  });
});
