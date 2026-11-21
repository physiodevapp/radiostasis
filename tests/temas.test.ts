import { describe, expect, it } from 'vitest';
import { articulos, biblioteca, frases } from '../src/fisiologia';
import { cambiosNoDeclarados, referenciasMuertas } from '../src/fisiologia/importar';
import { ESCALAS } from '../src/app/enlace-caso';
import { topesNoDeclarados } from '../src/motor/evaluar';
import { claveDelTema, TEMA_POR_DEFECTO, temaPorId, temas } from '../src/temas/registro';

/**
 * Fase N2: lo que tiene que cumplir cada tema del registro. Las comprobaciones
 * propias de cada tema (casos, retos, fichas…) están en sus tests.
 */
const NODO_LIBRE = new Set(['codigo', 'nombre', 'etiquetas', 'frecuencia', 'frecuenciaExtremos', 'explicacion']);

describe('registro de temas', () => {
  it('ids únicos, válidos en la dirección y distintos de las escalas (comparten «t=»)', () => {
    const ids = temas.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) {
      expect(id).toMatch(/^[a-z][a-z0-9-]{0,39}$/);
      expect(ESCALAS).not.toContain(id);
      expect(temaPorId(id).modelo.id).toBe(id);
    }
  });

  it('sin tema, o con uno que no existe, la hipertensión', () => {
    expect(TEMA_POR_DEFECTO.id).toBe('hipertension');
    expect(temaPorId(null).id).toBe('hipertension');
    expect(temaPorId('natremia').id).toBe('hipertension');
  });

  it('lo guardado en el dispositivo va por tema, y la hipertensión conserva sus claves', () => {
    expect(claveDelTema('hipertension', 'valores')).toBe('radiostasis-valores');
    expect(claveDelTema('natremia', 'valores')).toBe('radiostasis-natremia-valores');
  });
});

describe.each(temas.map((t) => [t.id, t] as const))('tema %s', (_id, tema) => {
  const m = tema.modelo;
  const nodos = new Map(m.nodos.map((n) => [n.id, n]));

  it('sus nodos son de la biblioteca y solo cambian nombre, etiquetas, frecuencia, explicación o código', () => {
    for (const n of m.nodos) {
      const o = biblioteca.nodos.find((x) => x.id === n.id);
      expect(o, n.id).toBeDefined();
      for (const k of new Set([...Object.keys(o!), ...Object.keys(n)]))
        if (!NODO_LIBRE.has(k)) expect((n as unknown as Record<string, unknown>)[k], `${n.id}.${k}`).toEqual((o as unknown as Record<string, unknown>)[k]);
    }
  });

  it('sus relaciones son de la biblioteca y la copia solo cambia lo declarado (M1–M3)', () => {
    const ns = m.relaciones.map((r) => r.n);
    expect(new Set(ns).size).toBe(ns.length);
    for (const r of m.relaciones) {
      const o = biblioteca.relaciones.find((x) => x.n === r.n);
      expect(o, `relación ${r.n}`).toBeDefined();
      expect(cambiosNoDeclarados(o!, r), `relación ${r.n}`).toEqual([]);
    }
  });

  it('no queda ninguna referencia muerta en modula ni en bloquea (M2)', () => {
    expect(referenciasMuertas(m.relaciones)).toEqual([]);
  });

  it('cada relación tiene su frase: la común, o la del tema si tiene asterisco', () => {
    for (const r of m.relaciones) {
      const lista = r.reasignada ? m.frases?.[r.n] : frases[r.n];
      expect(lista?.length ?? 0, `relación ${r.n}${r.reasignada ? '*' : ''}`).toBeGreaterThan(0);
      for (const f of lista ?? []) {
        expect(r.pmid, `relación ${r.n}`).toContain(f.pmid);
        expect(articulos, `PMID ${f.pmid}`).toHaveProperty(f.pmid);
      }
    }
    // Las frases propias del tema son de relaciones con asterisco.
    for (const n of Object.keys(m.frases ?? {})) expect(m.relaciones.find((r) => r.n === Number(n))?.reasignada, `frase del tema para la ${n}`).toBeDefined();
  });

  it('tiene sus parámetros del motor', () => {
    for (const k of ['amortiguacion', 'paso', 'horizonteDias', 'tolerancia', 'maxIteraciones'] as const)
      expect(m.parametros[k], k).toBeGreaterThan(0);
  });

  it('los mandos, el panel de analítica, los valores, las fichas y los términos nombran nodos del tema', () => {
    const tipo = (id: string) => nodos.get(id)?.tipo;
    for (const id of tema.mandos.causas) expect(tipo(id), id).toBe('causa');
    for (const id of tema.mandos.farmacos) expect(tipo(id), id).toBe('farmaco');
    for (const id of [...tema.mandos.sesion, ...tema.mandos.entrenamiento]) expect(tipo(id), id).toBe('ejercicio');
    for (const id of [...tema.panelAnalitica, ...Object.keys(tema.valores.orientativos), ...Object.keys(tema.fichas), ...Object.keys(tema.terminos)])
      expect(nodos.has(id), id).toBe(true);
  });

  it('los topes de los casos: los vigilados son nodos del tema y, si se declaran, ninguno sobra ni falta (M7)', () => {
    const reglas = m.avisos?.fueraDeRango;
    for (const id of [...(reglas?.nodos ?? []), ...Object.keys(reglas?.umbralNodo ?? {})]) expect(nodos.has(id), id).toBe(true);
    for (const c of m.casos)
      for (const id of Object.keys(c.topes ?? {})) expect(reglas?.nodos, `caso ${c.id}: ${id}`).toContain(id);
    expect(topesNoDeclarados(m)).toEqual([]);
  });
});
