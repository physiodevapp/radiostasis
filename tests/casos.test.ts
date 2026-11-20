import { describe, expect, it } from 'vitest';
import { comprobarExpectativa } from '../src/motor/evaluar';
import { simular } from '../src/motor/motor';
import { hipertension, hipertensionDocumento, relacionesPropuestas } from '../src/temas/hipertension';
import { ajustes } from '../src/temas/hipertension/calibracion';
import { relaciones } from '../src/temas/hipertension/relaciones';

const NOMBRE_ESCALA = { minutos: 'minutos', dias: 'días', estable: 'estado estable' } as const;

describe('modelo de hipertensión: datos', () => {
  it('tiene 12 causas, 17 mecanismos, 6 salidas y 4 nodos de analítica', () => {
    const cuenta = (t: string) => hipertension.nodos.filter((n) => n.tipo === t).length;
    expect([cuenta('causa'), cuenta('mecanismo'), cuenta('salida'), cuenta('analitica')]).toEqual([12, 17, 6, 4]);
  });

  it('tiene las 73 relaciones activas, sin la 6, y números únicos', () => {
    const ns = relaciones.map((r) => r.n);
    expect(ns).toHaveLength(73);
    expect(new Set(ns).size).toBe(73);
    expect(ns).not.toContain(6);
  });

  it('cada ajuste de calibración parte del valor del documento', () => {
    for (const a of ajustes) {
      const r = relacionesPropuestas.find((x) => x.n === a.n);
      expect(r?.tipo, `relación ${a.n}`).toBe('suma');
      if (r?.tipo === 'suma') expect(r[a.campo], `relación ${a.n} ${a.campo}`).toBe(a.antes);
    }
  });

  it('todos los casos convergen en las tres escalas', () => {
    for (const c of hipertension.casos)
      for (const e of ['minutos', 'dias', 'estable'] as const)
        expect(simular(hipertension, { ...c.causas, ...c.farmacos }, e).convergido, `caso ${c.id} ${e}`).toBe(true);
  });

  it('sin causas, todo queda en 0', () => {
    const { valores } = simular(hipertension, {}, 'estable');
    for (const [id, v] of Object.entries(valores)) expect(Math.abs(v), id).toBeLessThan(1e-9);
  });

  it('el modelo del documento conserva sus relaciones intactas', () => {
    expect(hipertensionDocumento.relaciones).toBe(relaciones);
  });
});

describe('los casos (docs/modelo-v2.1.md y fármacos de la fase 4)', () => {
  for (const caso of hipertension.casos) {
    describe(`${caso.id}. ${caso.nombre}`, () => {
      for (const e of caso.esperado) {
        const titulo = `${NOMBRE_ESCALA[e.escala]}${e.condicion ? `, ${e.condicion}` : ''}`;
        for (const [nodo, motivo] of Object.entries(e.pendientes ?? {}))
          it.skip(`${titulo}: ${nodo} pendiente de decisión (${motivo.slice(0, 60)}…)`, () => {});
        it(titulo, () => {
          const r = comprobarExpectativa(hipertension, caso, e).filter((c) => !c.pendiente);
          const informe = r.map((c) => `${c.nodo}: ${c.obtenido} (${c.valor.toFixed(2)}), esperado ${c.esperado.join(' o ')}`);
          const obtenido = Object.fromEntries(r.map((c) => [c.nodo, c.ok ? 'ok' : informe[r.indexOf(c)]]));
          const esperado = Object.fromEntries(r.map((c) => [c.nodo, 'ok']));
          expect(obtenido).toEqual(esperado);
        });
      }
    });
  }
});
