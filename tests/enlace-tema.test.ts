import { describe, expect, it } from 'vitest';
import { codificar, codificarReto, conTema, decodificar, decodificarReto, leerTema, type MandosEnlace } from '../src/app/enlace-caso';

/** Fase N2: el tema en la dirección (#t=…), con los enlaces antiguos intactos. */
const mandos: MandosEnlace = {
  causas: ['sal', 'hiperaldo'],
  farmacos: [],
  ejercicio: [],
  sesion: [],
  rango: () => [-1, 1],
  variantes: {},
};

describe('tema en la dirección', () => {
  it('los enlaces antiguos no llevan tema y no cambian (t=dias es la escala)', () => {
    expect(leerTema('#c=sal:1&t=dias')).toEqual({ tema: null, resto: 'c=sal:1&t=dias' });
    expect(leerTema('#t=minutos')).toEqual({ tema: null, resto: 't=minutos' });
    expect(leerTema('#reto=3')).toEqual({ tema: null, resto: 'reto=3' });
    expect(leerTema('')).toEqual({ tema: null, resto: '' });
    expect(decodificar(leerTema('#c=sal:1&t=dias').resto, mandos)).toMatchObject({ causas: { sal: 1 }, escala: 'dias' });
  });

  it('con tema: se separa y el resto se lee igual', () => {
    expect(leerTema('#t=natremia')).toEqual({ tema: 'natremia', resto: '' });
    expect(leerTema('#t=natremia&c=sal:1&t=dias')).toEqual({ tema: 'natremia', resto: 'c=sal:1&t=dias' });
    expect(leerTema('t=dias&t=natremia&c=sal:1')).toEqual({ tema: 'natremia', resto: 't=dias&c=sal:1' });
    expect(leerTema('#t=natremia&reto=3')).toEqual({ tema: 'natremia', resto: 'reto=3' });
    // Lo que no es un id de tema se queda en el resto (y el caso lo ignora, como siempre).
    expect(leerTema('#t=<script>&c=sal:1')).toEqual({ tema: null, resto: 't=<script>&c=sal:1' });
  });

  it('el tema por defecto no se escribe: los enlaces de la hipertensión son los de siempre', () => {
    const f = codificar({ causas: { sal: 1 }, farmacos: {}, ejercicio: {}, momento: 'antes', escala: 'dias', variantes: {}, pregunta: '' }, mandos);
    expect(conTema(f, 'hipertension', 'hipertension')).toBe('c=sal:1&t=dias');
    expect(conTema(f, 'natremia', 'hipertension')).toBe('t=natremia&c=sal:1&t=dias');
    expect(conTema('', 'natremia', 'hipertension')).toBe('t=natremia');
  });

  it('el reto del profesor de otro tema lleva el tema fuera del texto codificado', () => {
    const e = { causas: { hiperaldo: 1 }, farmacos: {}, ejercicio: {}, momento: 'antes' as const, escala: 'estable' as const, variantes: {}, pregunta: 'Paciente' };
    const enlace = conTema(codificarReto(e, 'Explicación', mandos), 'natremia', 'hipertension');
    expect(enlace.startsWith('t=natremia&reto=')).toBe(true);
    const { tema, resto } = leerTema(`#${enlace}`);
    expect(tema).toBe('natremia');
    expect(decodificarReto(resto, mandos, 10)).toMatchObject({ tipo: 'profesor', explicacion: 'Explicación', estado: { causas: { hiperaldo: 1 } } });
  });
});
