import { describe, expect, it } from 'vitest';
import { hipertension as modelo } from '../src/temas/hipertension';
import { articulos, frases } from '../src/temas/hipertension/fuentes';
import { relaciones } from '../src/temas/hipertension/relaciones';

// 19 nov 2026: solo PubMed. Cada relación del tema cita artículos con su cita
// en la bibliografía (docs/fuentes.md); ya no hay relaciones «Fisiología».
describe('fuentes de las relaciones', () => {
  it('cada relación del modelo v2.1 cita al menos un PMID y dice «PubMed»', () => {
    for (const r of relaciones) {
      expect(r.pmid?.length ?? 0, `relación ${r.n}`).toBeGreaterThan(0);
      expect(r.fuente, `relación ${r.n}`).toBe('PubMed');
    }
  });

  it('todas las relaciones del tema (fármacos, ejercicio y revisiones incluidos) citan al menos un PMID', () => {
    for (const r of modelo.relaciones) {
      expect(r.pmid?.length ?? 0, `relación ${r.n}`).toBeGreaterThan(0);
      expect(r.fuente, `relación ${r.n}`).toBe('PubMed');
    }
  });

  it('cada PMID del tema tiene su cita, y no hay citas sin usar', () => {
    const usados = new Set(modelo.relaciones.flatMap((r) => r.pmid ?? []));
    for (const p of usados) expect(articulos, `PMID ${p}`).toHaveProperty(p);
    for (const p of Object.keys(articulos)) expect(usados, `PMID ${p} sin usar`).toContain(p);
  });

  it('cada relación tiene su frase, de un artículo de la bibliografía citado por ella', () => {
    for (const r of modelo.relaciones) expect(frases[r.n]?.length ?? 0, `relación ${r.n}`).toBeGreaterThan(0);
    for (const [n, lista] of Object.entries(frases)) {
      const r = modelo.relaciones.find((x) => x.n === Number(n));
      for (const f of lista) {
        expect(r?.pmid, `relación ${n}`).toContain(f.pmid);
        expect(articulos, `PMID ${f.pmid}`).toHaveProperty(f.pmid);
      }
    }
  });

  it('los PMID son números', () => {
    for (const r of modelo.relaciones) for (const p of r.pmid ?? []) expect(p, `relación ${r.n}`).toMatch(/^\d{5,9}$/);
  });
});
