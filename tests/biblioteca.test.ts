import { describe, expect, it } from 'vitest';
import { articulos, biblioteca, frases, nodoDe, relacionDe } from '../src/fisiologia';
import {
  cambiosNoDeclarados, filtrarReferencias, importarNodos, importarRelaciones, referenciasMuertas,
} from '../src/fisiologia/importar';
import { aplicarAjustes } from '../src/motor/ajustes';
import type { RelacionModula, RelacionSuma } from '../src/motor/tipos';

/** Fase N2: biblioteca común de fisiología y su importación por tema. */
describe('biblioteca común', () => {
  it('cada nodo y cada relación están una sola vez', () => {
    const ids = biblioteca.nodos.map((n) => n.id);
    expect(new Set(ids).size).toBe(ids.length);
    const ns = biblioteca.relaciones.map((r) => r.n);
    expect(new Set(ns).size).toBe(ns.length);
  });

  it('los orígenes y destinos de las relaciones son nodos de la biblioteca, y las listas de modula y bloquea, relaciones suyas', () => {
    const ids = new Set(biblioteca.nodos.map((n) => n.id));
    for (const r of biblioteca.relaciones) {
      expect(ids.has(r.origen), `relación ${r.n}: ${r.origen}`).toBe(true);
      expect(ids.has(r.destino), `relación ${r.n}: ${r.destino}`).toBe(true);
    }
    expect(referenciasMuertas(biblioteca.relaciones)).toEqual([]);
  });

  it('cada relación cita PMID con su artículo y tiene su frase, de un artículo que cita', () => {
    for (const r of biblioteca.relaciones) {
      expect(r.fuente, `relación ${r.n}`).toBe('PubMed');
      expect(r.pmid?.length ?? 0, `relación ${r.n}`).toBeGreaterThan(0);
      for (const p of r.pmid ?? []) expect(articulos, `PMID ${p}`).toHaveProperty(p);
      expect(frases[r.n]?.length ?? 0, `frase de la ${r.n}`).toBeGreaterThan(0);
      for (const f of frases[r.n] ?? []) expect(r.pmid, `frase de la ${r.n}`).toContain(f.pmid);
    }
    for (const n of Object.keys(frases)) expect(() => relacionDe(Number(n)), `frase de la ${n}`).not.toThrow();
  });
});

describe('importar nodos', () => {
  it('sin cambios, el nodo es el de la biblioteca', () => {
    const [sal] = importarNodos(biblioteca, ['sal']);
    expect(sal).toBe(nodoDe('sal'));
  });

  it('el tema cambia nombre, etiquetas, frecuencia y explicación, y nada más', () => {
    const [sal] = importarNodos(biblioteca, [{ id: 'sal', nombre: 'Sal de la dieta', etiquetas: ['poca', 'mucha'], frecuencia: 'rara', explicacion: 'Otra.' }]);
    const original = nodoDe('sal');
    expect(sal).toEqual({ ...original, nombre: 'Sal de la dieta', etiquetas: ['poca', 'mucha'], frecuencia: 'rara', explicacion: 'Otra.' });
    expect(original.nombre).toBe('Ingesta de sal');
  });

  it('un nodo que no está en la biblioteca, o repetido, es un error', () => {
    expect(() => importarNodos(biblioteca, ['vce'])).toThrow(/no está en la biblioteca/);
    expect(() => importarNodos(biblioteca, ['sal', 'sal'])).toThrow(/dos veces/);
  });
});

describe('importar relaciones', () => {
  it('sin cambios, la relación es la de la biblioteca', () => {
    const [r] = importarRelaciones(biblioteca, [63]);
    expect(r).toBe(relacionDe(63));
  });

  it('con asterisco: cambia el origen declarado y la explicación, y conserva número, signo y PMID', () => {
    const original = relacionDe(63) as RelacionSuma;
    const [r] = importarRelaciones(biblioteca, [{ n: 63, reasignar: { volemia: 'vce' }, explicacion: 'ADH no osmótica' }]) as RelacionSuma[];
    expect(r).not.toBe(original);
    expect(r).toEqual({ ...original, origen: 'vce', explicacion: 'ADH no osmótica', reasignada: { origen: 'volemia' } });
    expect(cambiosNoDeclarados(original, r)).toEqual([]);
    expect(original.origen).toBe('volemia');
  });

  it('la reasignación puede tocar el destino', () => {
    const [r] = importarRelaciones(biblioteca, [{ n: 19, reasignar: { volemia: 'agua' }, explicacion: 'Lo que se orina sale del agua corporal' }]);
    expect(r.destino).toBe('agua');
    expect(r.reasignada).toEqual({ destino: 'volemia' });
    expect(cambiosNoDeclarados(relacionDe(19), r)).toEqual([]);
  });

  it('reasignar sin explicación, cambiar la explicación sin asterisco o reasignar un nodo que no está, es un error', () => {
    expect(() => importarRelaciones(biblioteca, [{ n: 63, reasignar: { volemia: 'vce' } }])).toThrow(/explicación/);
    expect(() => importarRelaciones(biblioteca, [{ n: 63, explicacion: 'Otra' }])).toThrow(/asterisco/);
    expect(() => importarRelaciones(biblioteca, [{ n: 63, reasignar: { sal: 'x' }, explicacion: 'x' }])).toThrow(/no es su origen ni su destino/);
    expect(() => importarRelaciones(biblioteca, [999])).toThrow(/no está en la biblioteca/);
  });

  it('el tema pone su intensidad, su umbral y su escala; el signo y los PMID no se tocan', () => {
    const original = relacionDe(63) as RelacionSuma;
    const [r] = importarRelaciones(biblioteca, [{ n: 63, cambios: { intensidad: 0.3, intensidadNegativa: 1, umbral: 0, tiempo: 'dias' } }]) as RelacionSuma[];
    expect(r).toEqual({ ...original, intensidad: 0.3, intensidadNegativa: 1, umbral: 0, tiempo: 'dias' });
    expect(cambiosNoDeclarados(original, r)).toEqual([]);
    expect(() => importarRelaciones(biblioteca, [{ n: 63, cambios: { maximo: 0.5 } }])).toThrow(/no es un campo/);
    expect(() => importarRelaciones(biblioteca, [{ n: 88, cambios: { intensidad: 0.5 } }])).toThrow(/no es un campo/);
  });

  it('cambiosNoDeclarados detecta lo que no le toca al tema', () => {
    const o = relacionDe(63) as RelacionSuma;
    expect(cambiosNoDeclarados(o, { ...o, signo: '+' })).toEqual(['signo cambia']);
    expect(cambiosNoDeclarados(o, { ...o, pmid: ['1'] })).toEqual(['pmid cambia']);
    expect(cambiosNoDeclarados(o, { ...o, origen: 'vce' })).toEqual(['origen cambia sin asterisco']);
    expect(cambiosNoDeclarados(o, { ...o, explicacion: 'Otra' })).toEqual(['explicación cambia sin asterisco']);
    expect(cambiosNoDeclarados(o, { ...o, origen: 'vce', reasignada: { origen: 'adh' } })).toEqual(['origen no coincide con lo declarado']);
    const m = relacionDe(121) as RelacionModula;
    expect(cambiosNoDeclarados(m, { ...m, relaciones: [68, 67] })).toEqual(['la lista de relaciones no es parte de la original']);
  });
});

describe('referencias de modula y bloquea (M2)', () => {
  it('al importar, la lista se queda con las relaciones presentes y no queda ninguna referencia muerta', () => {
    // La 121 (edad) modula la 67 y la 68; la natremia no tendrá la 68.
    const sin68 = importarRelaciones(biblioteca, [67, 121]);
    expect(referenciasMuertas(sin68)).toEqual(['relación 121 → 68']);
    const filtradas = filtrarReferencias(sin68);
    expect(referenciasMuertas(filtradas)).toEqual([]);
    expect((filtradas[1] as RelacionModula).relaciones).toEqual([67]);
    expect((relacionDe(121) as RelacionModula).relaciones).toEqual([67, 68]);
    expect(cambiosNoDeclarados(relacionDe(121), filtradas[1])).toEqual([]);
  });

  it('un bloqueo se queda con las relaciones presentes; sin ninguna, es un error', () => {
    const r = filtrarReferencias(importarRelaciones(biblioteca, [27, 28, 88]));
    expect(r[2]).toMatchObject({ n: 88, relaciones: [27, 28] });
    expect(() => filtrarReferencias(importarRelaciones(biblioteca, [88]))).toThrow(/ninguna de las relaciones que bloquea/);
  });

  it('sin nada que quitar, devuelve los mismos objetos', () => {
    const lista = importarRelaciones(biblioteca, [67, 68, 121]);
    filtrarReferencias(lista).forEach((r, i) => expect(r).toBe(lista[i]));
  });
});

describe('ajustes por tema', () => {
  it('aplicarAjustes cambia solo la relación y el campo del ajuste, en una copia', () => {
    const base = importarRelaciones(biblioteca, [7, 8]);
    const r = aplicarAjustes(base, [{ n: 8, campo: 'intensidad', antes: 1, despues: 3, motivo: 'prueba' }]);
    expect(r[0]).toBe(base[0]);
    expect(r[1]).toEqual({ ...base[1], intensidad: 3 });
    expect((base[1] as RelacionSuma).intensidad).toBe(1);
    expect(() => aplicarAjustes(importarRelaciones(biblioteca, [121]), [{ n: 121, campo: 'intensidad', antes: 0.5, despues: 1, motivo: '' }])).toThrow();
  });
});
