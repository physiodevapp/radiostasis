import { describe, expect, it } from 'vitest';
import { codificar, decodificar, limpiarPregunta, MAX_PREGUNTA, type EstadoCompartido, type MandosEnlace } from '../src/app/enlace-caso';
import { hipertension as modelo } from '../src/temas/hipertension';
import { ordenEjercicio, ordenSesion } from '../src/temas/hipertension/ejercicio';
import { ordenFarmacos } from '../src/temas/hipertension/farmacos';
import { ordenCausas } from '../src/temas/hipertension/vista';

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

describe('casos por enlace (fase 6)', () => {
  it('ida y vuelta con todos los casos del tema', () => {
    for (const c of modelo.casos) {
      for (const escala of ['minutos', 'dias', 'estable'] as const) {
        const e: EstadoCompartido = { causas: c.causas, farmacos: c.farmacos ?? {}, ejercicio: c.ejercicio ?? {}, momento: c.momento ?? 'antes', escala, variantes: c.variantes ?? {}, pregunta: '' };
        const d = decodificar(`#${codificar(e, mandos)}`, mandos);
        expect(d, `caso ${c.id}`).toEqual(e);
      }
    }
  });

  it('no escribe lo que vale lo de siempre', () => {
    expect(codificar({ ...vacio(), causas: { hiperaldo: 1 }, farmacos: { espironolactona: 1 } }, mandos)).toBe('c=hiperaldo:1&f=espironolactona:1');
    expect(codificar(vacio(), mandos)).toBe('c=');
    expect(decodificar('#c=', mandos)).toEqual(vacio());
  });

  it('la lateralidad de la estenosis viaja en «v» y la bilateral no se escribe (fase 7)', () => {
    expect(codificar({ ...vacio(), causas: { estenosis: 1 }, variantes: { estenosis: 'unilateral' } }, mandos)).toBe('c=estenosis:1&v=estenosis:unilateral');
    expect(codificar({ ...vacio(), causas: { estenosis: 1 }, variantes: { estenosis: 'bilateral' } }, mandos)).toBe('c=estenosis:1');
    expect(decodificar('#c=estenosis:1&v=estenosis:unico', mandos)?.variantes).toEqual({ estenosis: 'unico' });
    // Lo que no se reconoce se ignora sin error; un enlace antiguo abre la bilateral.
    expect(decodificar('#c=estenosis:1&v=estenosis:triple,sal:alta,estenosis', mandos)?.variantes).toEqual({});
    expect(decodificar('#c=estenosis:1', mandos)?.variantes).toEqual({});
  });

  it('la pregunta viaja con tildes, signos y espacios', () => {
    const pregunta = '¿Qué pasa con el potasio & la renina? «Compáralo» con el caso 8 #2';
    const d = decodificar(codificar({ ...vacio(), causas: { hiperaldo: 1 }, pregunta }, mandos), mandos);
    expect(d?.pregunta).toBe(pregunta);
  });

  it('la pregunta es texto plano de una línea y de largo limitado', () => {
    expect(limpiarPregunta('  uno\n\tdos\u0000 tres  ')).toBe('uno dos tres');
    expect(limpiarPregunta('a'.repeat(500))).toHaveLength(MAX_PREGUNTA);
    expect(decodificar('#p=%E0%A4%A', mandos)?.pregunta).toBe('');
  });

  it('ignora lo que no reconoce sin dar error', () => {
    const d = decodificar('#c=hiperaldo:1,inventada:1,sal:7,edad:-1,feo:abc,tiroides:0.5:1&f=sal:1,ieca:0.5&m=luego&t=años&x=1', mandos);
    expect(d).toEqual({ ...vacio(), causas: { hiperaldo: 1 }, farmacos: { ieca: 0.5 } });
  });

  it('sin una clave conocida no es un caso compartido', () => {
    expect(decodificar('', mandos)).toBeNull();
    expect(decodificar('#', mandos)).toBeNull();
    expect(decodificar('#ficha-renina', mandos)).toBeNull();
    expect(decodificar('#x=1&y=2', mandos)).toBeNull();
  });

  it('el momento solo cuenta con una sesión activa', () => {
    expect(decodificar('#m=durante', mandos)?.momento).toBe('antes');
    expect(decodificar('#e=entrenoAerobico:1&m=durante', mandos)?.momento).toBe('antes');
    expect(decodificar('#e=sesionAerobica:0.5&m=despues', mandos)?.momento).toBe('despues');
  });

  it('redondea a la centésima, como los mandos', () => {
    expect(decodificar('#c=sal:0.333333', mandos)?.causas).toEqual({ sal: 0.33 });
    expect(decodificar('#c=sal:-0.5', mandos)?.causas).toEqual({ sal: -0.5 });
  });
});
