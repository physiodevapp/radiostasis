import { describe, expect, it } from 'vitest';
import { notasActivas } from '../src/motor/avisos';
import { simular } from '../src/motor/motor';
import { hipertension as modelo } from '../src/temas/hipertension';

const reglas = modelo.avisos!;
const notas = (e: Record<string, number>) => notasActivas(e, reglas).map((n) => n.id);
const v = (e: Record<string, number>) => simular(modelo, e, 'estable').valores;

describe('notas de interacción entre causas (fase 6)', () => {
  it('son once, con título, texto breve y fuentes', () => {
    expect(reglas.notas).toHaveLength(11);
    for (const n of reglas.notas!) {
      expect(n.nivel).toBe('nota');
      expect(n.titulo.length).toBeGreaterThan(0);
      expect(n.texto.length, n.id).toBeLessThanOrEqual(260);
      expect(n.fuentes?.length, n.id).toBeGreaterThan(0);
    }
  });

  it('cada nota salta con su pareja y no con una sola causa', () => {
    const parejas: [string, Record<string, number>][] = [
      ['edad-factores', { edad: 1, factores: 1 }],
      ['edad-hipertiroidismo', { edad: 1, tiroides: 1 }],
      ['edad-sal', { edad: 1, sal: 1 }],
      ['edad-agua', { edad: 1, accesoAgua: -1 }],
      ['estenosis-aterosclerosis', { estenosis: 1, factores: 1 }],
      ['mineralocorticoide-sal-alta', { hiperaldo: 1, sal: 1 }],
      ['mineralocorticoide-sal-baja', { regaliz: 1, sal: -1 }],
      ['filtracion-sal', { caidaFiltracion: 1, sal: 1 }],
      ['diabetes-insipida-agua', { adhAutonoma: -1, accesoAgua: -1 }],
      ['siadh-agua', { adhAutonoma: 1, accesoAgua: -0.5 }],
      ['siadh-sal-baja', { adhAutonoma: 1, sal: -1 }],
    ];
    for (const [id, e] of parejas) {
      expect(notas(e), id).toContain(id);
      for (const k of Object.keys(e)) expect(notas({ [k]: e[k] }), `${id} solo con ${k}`).not.toContain(id);
    }
    expect(notas({})).toEqual([]);
  });

  it('el extremo de la rueda cuenta', () => {
    expect(notas({ edad: 1, tiroides: -1 })).not.toContain('edad-hipertiroidismo');
    expect(notas({ edad: 1, sal: -1 })).not.toContain('edad-sal');
    expect(notas({ hiperaldo: 1, sal: 1 })).not.toContain('mineralocorticoide-sal-baja');
    expect(notas({ adhAutonoma: 1, accesoAgua: -1 })).not.toContain('diabetes-insipida-agua');
    expect(notas({ adhAutonoma: -1, sal: -1 })).not.toContain('siadh-sal-baja');
    expect(notas({ edad: 0.1, factores: 1 })).toEqual([]);
  });

  // Lo que cada nota dice del modelo: si una recalibración lo cambia, hay que reescribir la nota.
  describe('el modelo muestra lo que cuentan las notas', () => {
    it('edad y factores: más sistólica, diastólica baja', () => {
      const r = v({ edad: 1, factores: 1 });
      expect(r.pas).toBeGreaterThan(Math.max(v({ edad: 1 }).pas, v({ factores: 1 }).pas));
      expect(r.pad).toBeLessThan(-0.15);
    });
    it('hipertiroidismo con la edad: sistólica mucho más alta, diastólica baja', () => {
      const r = v({ edad: 1, tiroides: 1 });
      expect(r.pas).toBeGreaterThan(v({ tiroides: 1 }).pas + 0.2);
      expect(r.pas).toBeGreaterThan(v({ edad: 1 }).pas);
      expect(r.pad).toBeLessThan(-0.15);
    });
    it('exceso mineralocorticoide y sal alta: volemia y presión más altas que por separado', () => {
      for (const c of ['hiperaldo', 'regaliz']) {
        const r = v({ [c]: 1, sal: 1 });
        expect(r.pas, c).toBeGreaterThan(Math.max(v({ [c]: 1 }).pas, v({ sal: 1 }).pas) + 0.2);
        expect(r.volemia, c).toBeGreaterThan(Math.max(v({ [c]: 1 }).volemia, v({ sal: 1 }).volemia) + 0.2);
      }
    });
    it('exceso mineralocorticoide y sal baja: presión casi normal, potasio todavía bajo (límite del modelo)', () => {
      for (const c of ['hiperaldo', 'regaliz']) {
        const r = v({ [c]: 1, sal: -1 });
        expect(Math.abs(r.pas), c).toBeLessThan(0.15);
        expect(r.potasio, c).toBeLessThan(-0.15);
      }
    });
    it('caída de la filtración y sal alta: más presión y volemia que por separado', () => {
      const r = v({ caidaFiltracion: 1, sal: 1 });
      expect(r.pas).toBeGreaterThan(Math.max(v({ caidaFiltracion: 1 }).pas, v({ sal: 1 }).pas) + 0.15);
      expect(r.volemia).toBeGreaterThan(Math.max(v({ caidaFiltracion: 1 }).volemia, v({ sal: 1 }).volemia) + 0.15);
    });
    it('diabetes insípida: con agua, creatinina normal; sin agua, sodio muy alto, volemia baja y creatinina alta', () => {
      const conAgua = v({ adhAutonoma: -1 });
      const sinAgua = v({ adhAutonoma: -1, accesoAgua: -1 });
      expect(Math.abs(conAgua.creatinina)).toBeLessThan(0.15);
      expect(sinAgua.natremia).toBeGreaterThanOrEqual(0.5);
      expect(sinAgua.volemia).toBeLessThanOrEqual(-0.5);
      expect(sinAgua.creatinina).toBeGreaterThanOrEqual(0.15);
    });
    it('SIADH: restringir el agua sube el sodio; quitarla del todo deshidrata', () => {
      const base = v({ adhAutonoma: 1 }).natremia;
      expect(v({ adhAutonoma: 1, accesoAgua: -0.3 }).natremia).toBeGreaterThan(base + 0.1);
      expect(v({ adhAutonoma: 1, accesoAgua: -0.5 }).natremia).toBeGreaterThan(base + 0.2);
      expect(v({ adhAutonoma: 1, accesoAgua: -1 }).volemia).toBeLessThan(-0.5);
    });
    it('SIADH con poca sal: el sodio baja más', () => {
      expect(v({ adhAutonoma: 1, sal: -1 }).natremia).toBeLessThan(v({ adhAutonoma: 1 }).natremia - 0.1);
    });
    it('edad y agua: con la edad la falta de agua sube más la natremia (relación 121, nota 4)', () => {
      for (const agua of [-0.5, -1]) {
        expect(v({ edad: 1, accesoAgua: agua }).natremia, `agua ${agua}`).toBeGreaterThan(v({ accesoAgua: agua }).natremia + 0.05);
      }
    });
    it('edad y sal: el modelo no la hace más sensible a la sal (lo dice la nota 3)', () => {
      // La misma sal sube la sistólica menos en la persona mayor que la suma de los dos efectos: no hay sensibilidad añadida.
      expect(v({ edad: 1, sal: 1 }).pas).toBeLessThanOrEqual(v({ edad: 1 }).pas + v({ sal: 1 }).pas);
    });
  });
});
