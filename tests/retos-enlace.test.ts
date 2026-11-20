import { describe, expect, it } from 'vitest';
import {
  codificar,
  codificarReto,
  decodificar,
  decodificarReto,
  MAX_ENUNCIADO,
  MAX_EXPLICACION,
  type EstadoCompartido,
  type MandosEnlace,
} from '../src/app/enlace-caso';
import { simular, UMBRAL_IGUAL } from '../src/motor/motor';
import { clavesAutomaticas, valoresPista } from '../src/motor/reto';
import { hipertension as modelo } from '../src/temas/hipertension';
import { ordenEjercicio, ordenSesion } from '../src/temas/hipertension/ejercicio';
import { ordenFarmacos } from '../src/temas/hipertension/farmacos';
import { retos } from '../src/temas/hipertension/retos';
import { evitaEnPista, gruposClavesReto, ordenCausas } from '../src/temas/hipertension/vista';

const porId = new Map(modelo.nodos.map((n) => [n.id, n]));
const mandos: MandosEnlace = {
  causas: ordenCausas,
  farmacos: ordenFarmacos,
  ejercicio: ordenEjercicio,
  sesion: ordenSesion,
  rango: (id) => porId.get(id)!.rango,
  variantes: Object.fromEntries(modelo.nodos.filter((n) => n.variantes).map((n) => [n.id, n.variantes!.map((v) => v.id)])),
};
const vacio = (): EstadoCompartido => ({ causas: {}, farmacos: {}, ejercicio: {}, momento: 'antes', escala: 'estable', variantes: {}, pregunta: '' });

describe('retos por enlace', () => {
  it('ida y vuelta: causas, variante, fármaco, ejercicio, escala, enunciado y explicación', () => {
    const e: EstadoCompartido = {
      causas: { estenosis: 1, sal: 0.5 },
      farmacos: { ieca: 1 },
      ejercicio: { sesionAerobica: 0.5 },
      momento: 'durante',
      escala: 'estable',
      variantes: { estenosis: 'unilateral' },
      pregunta: 'Varón de 58 años, fumador: ¿qué le pasa? 50% + 3 & Ñandú «ü» 😀 a=b',
    };
    const f = codificarReto(e, 'La renina muy alta con la creatinina normal…', mandos);
    expect(f).toMatch(/^reto=[A-Za-z0-9_-]+$/);
    expect(decodificarReto(`#${f}`, mandos, retos.length)).toEqual({ tipo: 'profesor', estado: e, explicacion: 'La renina muy alta con la creatinina normal…' });
  });

  it('las causas no se leen en el enlace', () => {
    const f = codificarReto({ ...vacio(), causas: { hiperaldo: 0.7 } }, '', mandos);
    expect(f).not.toMatch(/hiperaldo|c=/);
  });

  it('todos los retos de la lista caben como reto del profesor', () => {
    for (const r of retos) {
      const e: EstadoCompartido = { ...vacio(), causas: r.causas, farmacos: r.farmacos ?? {}, variantes: r.variantes ?? {}, pregunta: r.enunciado };
      const d = decodificarReto(codificarReto(e, '', mandos), mandos, retos.length);
      expect(d, `reto ${r.id}`).toEqual({ tipo: 'profesor', estado: e, explicacion: '' });
    }
  });

  it('#reto=N abre un reto de la lista', () => {
    expect(decodificarReto('#reto=3', mandos, retos.length)).toEqual({ tipo: 'lista', numero: 3 });
    expect(decodificarReto(`reto=${retos.length}`, mandos, retos.length)).toEqual({ tipo: 'lista', numero: retos.length });
    expect(decodificarReto('#reto=0', mandos, retos.length)).toBeNull();
    expect(decodificarReto(`#reto=${retos.length + 1}`, mandos, retos.length)).toBeNull();
  });

  it('descarta lo que no vale: sin causas, más de tres, texto roto u otra clave', () => {
    const reto = (e: EstadoCompartido) => decodificarReto(codificarReto(e, '', mandos), mandos, retos.length);
    expect(reto({ ...vacio(), farmacos: { ieca: 1 } })).toBeNull();
    expect(reto({ ...vacio(), causas: { edad: 1, factores: 1, sal: 1, hiperaldo: 1 } })).toBeNull();
    expect(reto({ ...vacio(), causas: { edad: 1, factores: 1, sal: 1 } })).not.toBeNull();
    expect(decodificarReto('#reto=@@@', mandos, retos.length)).toBeNull();
    expect(decodificarReto('#reto=____', mandos, retos.length)).toBeNull();
    expect(decodificarReto('#reto=', mandos, retos.length)).toBeNull();
    expect(decodificarReto('#reto=3&c=sal:1', mandos, retos.length)).toBeNull();
    expect(decodificarReto('#c=hiperaldo:1', mandos, retos.length)).toBeNull();
    // Y un enlace de reto no se confunde con un caso compartido.
    expect(decodificar('#reto=3', mandos)).toBeNull();
    expect(decodificar(`#${codificarReto({ ...vacio(), causas: { sal: 1 } }, '', mandos)}`, mandos)).toBeNull();
  });

  it('enunciado y explicación: una línea, con su máximo', () => {
    const largo = 'a'.repeat(MAX_ENUNCIADO + 50);
    const d = decodificarReto(codificarReto({ ...vacio(), causas: { sal: 1 }, pregunta: `uno\ndos ${largo}` }, `x\n${largo}`, mandos), mandos, retos.length);
    expect(d?.tipo).toBe('profesor');
    if (d?.tipo !== 'profesor') return;
    expect(d.estado.pregunta.startsWith('uno dos a')).toBe(true);
    expect(d.estado.pregunta.length).toBe(MAX_ENUNCIADO);
    expect(d.explicacion.length).toBe(MAX_EXPLICACION);
  });

  it('el enlace del caso sigue igual (la pregunta del caso no pasa de 200)', () => {
    expect(codificar({ ...vacio(), causas: { hiperaldo: 1 } }, mandos)).toBe('c=hiperaldo:1');
  });
});

describe('claves automáticas del reto del profesor', () => {
  it('dos de cada grupo, de mayor a menor, sin las que quedan en «=»', () => {
    const v = { a: 0.9, b: -0.6, c: 0.3, x: 0.1, m: 0.8, n: -0.2, o: 0.14 };
    expect(clavesAutomaticas(v, [['a', 'b', 'c', 'x'], ['m', 'n', 'o']])).toEqual({ a: '↑↑', b: '↓↓', m: '↑↑', n: '↓' });
    // Si un grupo no llega, se completa con las mayores del resto.
    expect(clavesAutomaticas(v, [['x', 'o'], ['a', 'b', 'c', 'm']])).toEqual({ a: '↑↑', m: '↑↑', b: '↓↓', c: '↑' });
    expect(clavesAutomaticas({ a: 0.1 }, [['a'], ['b']])).toEqual({});
  });

  it('en los retos de la lista, cada clave automática se mueve y la mayoría coincide con las del reto', () => {
    let coinciden = 0;
    for (const r of retos) {
      const { valores } = simular(modelo, { ...r.causas, ...r.farmacos }, 'estable', { variantes: r.variantes });
      const claves = clavesAutomaticas(valores, gruposClavesReto);
      expect(Object.keys(claves).length, `reto ${r.id}`).toBeGreaterThan(0);
      for (const id of Object.keys(claves)) expect(Math.abs(valores[id]), `reto ${r.id}, ${id}`).toBeGreaterThanOrEqual(UMBRAL_IGUAL);
      if (Object.keys(claves).some((id) => r.claves[id] && r.claves[id] !== '=')) coinciden++;
    }
    // Al menos una clave en común con las del reto escrito a mano, en todos.
    expect(coinciden).toBe(retos.length);
  });
});

describe('pista automática del reto del profesor', () => {
  const pista = (causas: Record<string, number>, variantes?: Record<string, string>) =>
    valoresPista(simular(modelo, causas, 'estable', { variantes }).valores, gruposClavesReto, evitaEnPista);

  it('no nombra valores que se llaman como una causa (ADH, renina, aldosterona, TFG)', () => {
    // El ejemplo del SIADH con dieta sin sal: antes nombraba la ADH.
    expect(pista({ adhAutonoma: 1, sal: -1 })).toEqual(['osmP', 'reabAgua']);
    for (const r of retos) {
      const ids = pista({ ...r.causas, ...r.farmacos }, r.variantes);
      expect(ids.length, `reto ${r.id}`).toBeGreaterThan(0);
      for (const id of ids) expect(evitaEnPista, `reto ${r.id}: ${id}`).not.toContain(id);
    }
  });
});
