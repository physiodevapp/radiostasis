import { describe, expect, it } from 'vitest';
import { simular } from '../src/motor/motor';
import { formatear, interpolar, traducir } from '../src/motor/valores';
import { hipertension as modelo } from '../src/temas/hipertension';
import { panelAnalitica } from '../src/temas/hipertension/nodos';
import { valoresOrientativos as V } from '../src/temas/hipertension/valores';

const v = (e: Record<string, number>) => simular(modelo, e, 'estable').valores;

describe('valores orientativos (fase 6, punto 5)', () => {
  it('hay valor para la presión y los ocho de la analítica, con anclas crecientes', () => {
    expect(Object.keys(V).sort()).toEqual(['pad', 'pas', ...panelAnalitica].sort());
    for (const [id, d] of Object.entries(V)) {
      for (let i = 0; i < 4; i++) expect(d.anclas[i], id).toBeLessThan(d.anclas[i + 1]);
      if (d.modo === 'banda') expect(d.bandas?.length, id).toBeGreaterThan(0);
    }
  });

  it('interpola en línea recta entre anclas y no extrapola', () => {
    const a = [120, 130, 140, 146, 160];
    expect(interpolar(0, a)).toBe(140);
    expect(interpolar(0.25, a)).toBe(143);
    expect(interpolar(-0.75, a)).toBe(125);
    expect(interpolar(2, a)).toBe(160);
    expect(interpolar(-2, a)).toBe(120);
  });

  it('redondea al paso con coma decimal', () => {
    expect(formatear(4.24, 0.1)).toBe('4,2');
    expect(formatear(147.6, 1)).toBe('148');
    expect(formatear(152, 5)).toBe('150');
  });

  it('la persona sana sale en el centro del rango normal; bandas con y sin intervalo', () => {
    expect(traducir(0, V.pas).texto).toBe('≈ 120 mmHg');
    expect(traducir(0, V.natremia).texto).toBe('≈ 140 mmol/L');
    expect(traducir(0, V.renina).texto).toBe('normal (≈ 0,5–3 ng/mL/h)');
    expect(traducir(-0.27, V.renina).texto).toBe('suprimida (≈ 0,2–0,5 ng/mL/h)');
    expect(traducir(0.6, V.osmU).texto).toBe('muy concentrada');
  });

  it('en el tope de escala, «≥» o «≤»; la creatinina baja no se traduce', () => {
    expect(traducir(0.97, V.aldo).texto).toBe('muy alta (> 30 ng/dL)');
    // En el tope, siempre el ancla del extremo (revisión de Fable 5.2).
    expect(traducir(0.95, V.pas).texto).toBe('≥ 180 mmHg');
    expect(traducir(0.99, V.pas).texto).toBe('≥ 180 mmHg');
    expect(traducir(-1, V.potasio).texto).toBe('≤ 2,5 mmol/L');
    expect(traducir(-0.3, V.creatinina).texto).toBe('normal');
  });

  it('el normal de la celda, el de la banda y el centro de la escala no se contradicen', () => {
    for (const [id, d] of Object.entries(V)) {
      // La banda «normal», si lleva intervalo, es el mismo rango que la línea gris.
      const normal = d.bandas?.find((b) => b.texto === 'normal');
      if (normal?.intervalo) expect(normal.intervalo.replace('≈ ', ''), id).toBe(d.normal);
    }
    // La persona sana cumple el «normal» de la presión (< 130/85).
    expect(V.pas.anclas[2]).toBeLessThan(130);
    expect(V.pad.anclas[2]).toBeLessThan(85);
    // Osmolaridad plasmática ≈ 2 × Na + 5 en las cinco anclas.
    V.natremia.anclas.forEach((na, i) => expect(V.osmP.anclas[i], `ancla ${i}`).toBe(2 * na + 5));
  });

  // Comprobación con los cuadros del simulador (docs/valores-orientativos.md): si una
  // recalibración mueve estos valores fuera de lo publicado, hay que revisar las anclas.
  it('los cuadros quedan cerca de lo publicado', () => {
    const na = (e: Record<string, number>) => interpolar(v(e).natremia, V.natremia.anclas);
    expect(na({ adhAutonoma: 1 })).toBeGreaterThan(125); // SIADH: mediana 127 (126–129)
    expect(na({ adhAutonoma: 1 })).toBeLessThan(132);
    expect(na({ sal: 1 })).toBeLessThan(146); // la sal apenas mueve el sodio
    expect(na({ adhAutonoma: -1 })).toBeLessThan(147); // diabetes insípida con agua: sodio alto-normal
    expect(na({ adhAutonoma: -1, accesoAgua: -1 })).toBeGreaterThan(150); // diabetes insípida sin agua
    const k = interpolar(v({ hiperaldo: 1 }).potasio, V.potasio.anclas);
    expect(k).toBeGreaterThan(2.8);
    expect(k).toBeLessThan(3.6); // hipopotasemia de la forma clásica
    const cr = interpolar(v({ estenosis: 1, ieca: 1 }).creatinina, V.creatinina.anclas);
    expect(cr).toBeGreaterThan(1.2); // sube al empezar el IECA
  });
});
