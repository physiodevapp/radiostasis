import { describe, expect, it } from 'vitest';
import { hipertension as modelo } from '../src/temas/hipertension';
import { fichas } from '../src/temas/hipertension/fichas';
import { retos } from '../src/temas/hipertension/retos';
import * as vista from '../src/temas/hipertension/vista';

const casos = new Set(modelo.casos.map((c) => c.id));
/** Ids del registro de animaciones (src/app/animaciones.ts), sin cargar el DOM. */
const ANIMACIONES = ['adh', 'aldosterona', 'regaliz', 'renina', 'placa'];

describe('fichas del tema', () => {
  it('hay una ficha por nodo y ninguna de más', () => {
    expect(Object.keys(fichas).sort()).toEqual(modelo.nodos.map((n) => n.id).sort());
  });

  it('ningún texto del tema cita un vídeo ni sus minutos (19 nov 2026: el tema no depende de ningún vídeo)', () => {
    const video = /v[íi]deo|youtu|pizarra/i;
    const minuto = /\b\d\d:\d\d\b/;
    const textos = JSON.stringify([modelo, fichas, retos, vista]);
    expect(textos).not.toMatch(video);
    for (const r of modelo.relaciones) expect(r.fuente, `relación ${r.n}`).not.toMatch(minuto);
    for (const [id, f] of Object.entries(fichas)) {
      const visibles = [f.queEs, f.queHace, f.aviso ?? '', f.consulta ?? '', ...Object.values(f.enCaso ?? {})];
      for (const t of visibles) expect(t, id).not.toMatch(minuto);
    }
    for (const c of modelo.casos) expect(c.nota ?? '', `caso ${c.id}`).not.toMatch(minuto);
  });

  it('los textos «En este caso» son de casos que existen', () => {
    for (const [id, f] of Object.entries(fichas)) {
      for (const c of Object.keys(f.enCaso ?? {})) expect(casos, `${id} · caso ${c}`).toContain(Number(c));
    }
  });

  it('cada causa tiene texto para su caso, y cada fármaco para los suyos', () => {
    for (const caso of modelo.casos) {
      // En los casos con ejercicio (fase 5) el texto escrito es el del ejercicio;
      // en los casos con fármaco (fase 4), el del fármaco.
      const ids = Object.keys(caso.ejercicio ?? caso.farmacos ?? caso.causas);
      for (const id of ids) expect(fichas[id].enCaso?.[caso.id], `${id} · caso ${caso.id}`).toBeTruthy();
    }
  });

  it('cada fármaco y cada ejercicio tiene su apartado de consulta de fisioterapia', () => {
    for (const n of modelo.nodos.filter((x) => x.tipo === 'farmaco' || x.tipo === 'ejercicio')) expect(fichas[n.id].consulta, n.id).toBeTruthy();
  });

  it('las animaciones existen', () => {
    for (const [id, f] of Object.entries(fichas)) if (f.animacion) expect(ANIMACIONES, id).toContain(f.animacion);
  });

  it('las capas rotuladas tienen ids únicos', () => {
    const ids = vista.capasVaso.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
