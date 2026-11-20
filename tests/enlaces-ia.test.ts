import { describe, expect, it } from 'vitest';
import { DESTINOS_IA, INSTRUCCION_FUENTES, MAX_TEXTO_IA, ORIENTACION_FISIO, promptIA, recortarTextoIA } from '../src/app/ampliar-ia';
import { hipertension as modelo } from '../src/temas/hipertension';
import { terminos } from '../src/temas/hipertension/terminos';

describe('términos de los enlaces internos', () => {
  it('hay una entrada por nodo y todos los ids existen', () => {
    expect(Object.keys(terminos).sort()).toEqual(modelo.nodos.map((n) => n.id).sort());
  });
  it('ningún término apunta a dos nodos', () => {
    const vistos = new Map<string, string>();
    for (const [id, ts] of Object.entries(terminos)) {
      for (const t of ts) {
        const clave = t.toLocaleLowerCase('es');
        expect(vistos.get(clave), `«${t}» en ${id} y ${vistos.get(clave)}`).toBeUndefined();
        vistos.set(clave, id);
      }
    }
  });
  it('quedan fuera los términos demasiado genéricos', () => {
    const todos = Object.values(terminos).flat().map((t) => t.toLocaleLowerCase('es'));
    for (const g of ['presión', 'riñón', 'sangre', 'volumen', 'filtración']) expect(todos).not.toContain(g);
  });
});

describe('«Ampliar con IA»', () => {
  it('la pregunta lleva el fragmento, el contexto, la orientación a la fisioterapia y las fuentes', () => {
    const q = promptIA({ contexto: 'la ficha «Aldosterona»', apartado: 'Qué hace', texto: 'Se reabsorbe sodio.' });
    expect(q).toContain('fisioterapia');
    expect(q).toContain('la ficha «Aldosterona» (apartado «Qué hace»)');
    expect(q).toContain('«Se reabsorbe sodio.»');
    expect(q).toContain(ORIENTACION_FISIO);
    expect(q).toContain(INSTRUCCION_FUENTES);
  });
  it('recorta los fragmentos largos por una palabra', () => {
    const largo = 'palabra '.repeat(300);
    const r = recortarTextoIA(largo);
    expect(r.length).toBeLessThanOrEqual(MAX_TEXTO_IA + 1);
    expect(r.endsWith('…')).toBe(true);
  });
  it('las URL de las tres IA llevan la pregunta codificada y caben en un enlace', () => {
    const q = promptIA({ contexto: 'x', texto: 'ñ & ? « »'.repeat(100) });
    for (const d of Object.values(DESTINOS_IA)) {
      const url = d.url(q);
      expect(url).toMatch(/^https:\/\//);
      expect(url).not.toContain(' ');
      expect(url.length).toBeLessThan(8000);
    }
  });
});
