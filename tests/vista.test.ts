import { describe, expect, it } from 'vitest';
import { hipertension as modelo } from '../src/temas/hipertension';
import { panelAnalitica } from '../src/temas/hipertension/nodos';
import {
  casosConRetencion, determinantes, gruposMecanismos, nombreCorto, ordenCausas, propiedadesVaso, queMirar,
} from '../src/temas/hipertension/vista';

const ids = new Set(modelo.nodos.map((n) => n.id));
const deTipo = (t: string) => modelo.nodos.filter((n) => n.tipo === t).map((n) => n.id).sort();

describe('datos de vista del tema', () => {
  it('los 12 mandos son exactamente las causas', () => {
    expect([...ordenCausas].sort()).toEqual(deTipo('causa'));
  });
  it('los grupos contienen los 17 mecanismos, una vez cada uno', () => {
    expect(gruposMecanismos.flatMap((g) => g.nodos).sort()).toEqual(deTipo('mecanismo'));
  });
  it('todos los ids de la vista existen en el modelo', () => {
    const usados = [...Object.keys(nombreCorto), ...determinantes, ...panelAnalitica, ...propiedadesVaso.map((p) => p.nodo)];
    for (const id of usados) expect(ids, id).toContain(id);
  });
  it('cada caso tiene su «Qué mirar» y no sobra ninguno', () => {
    const casos = modelo.casos.map((c) => c.id).sort((a, b) => a - b);
    expect(Object.keys(queMirar).map(Number).sort((a, b) => a - b)).toEqual(casos);
    for (const id of casosConRetencion) expect(casos).toContain(id);
  });
});
