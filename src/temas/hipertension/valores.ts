import type { ValorOrientativo } from '../../motor/valores';

/**
 * Valores orientativos del tema (fase 6, punto 5). Anclas y fuentes en
 * docs/valores-orientativos.md (32 referencias verificadas en PubMed el 17 nov
 * 2026). Revisados por Fable 5.2 (docs/revision-valores-fable.md) y validados por
 * Edu el 17 nov 2026, con los dos cambios que propuso Fable: presión en +0,5 a
 * 160/100 (cada flecha coincide con una categoría de la ESH 2023) y potasio en
 * −0,5 a 3,0 mmol/L (↓↓ empieza donde acaba la hipopotasemia leve).
 *
 * Cambio sobre la propuesta del documento: el ancla +0,5 de la natremia pasa de
 * 150 a 146 mmol/L (y la de la osmolaridad plasmática, de 305 a 297, para que
 * sigan cuadrando: osm ≈ 2 × Na + 5). El modelo sube el sodio con la sal y en la
 * diabetes insípida con agua más que en el paciente; así la sal queda en ≈ 145 y
 * no en 148, sin tocar el SIADH (≈ 129) ni la diabetes insípida sin agua (≈ 153).
 *
 * Bandas (por el valor del modelo, con los umbrales de las flechas): «muy baja»
 * hasta −0,5, «baja» hasta −0,15, «normal» hasta 0,15, «alta» hasta 0,5 y «muy
 * alta» por encima, con los nombres de cada magnitud y un intervalo fijo. En
 * modo banda las anclas no se muestran, y sus intervalos son más extremos que
 * ellas a propósito (diuresis: el ancla de −0,5 es 800 mL/día y la banda
 * «oliguria» empieza ahí con < 500): cada banda describe el cuadro típico de esa
 * flecha. Si algún día se muestra la cifra, hay que alinearlas antes. La
 * osmolaridad urinaria va sin intervalo: en el SIADH la orina está concentrada
 * para un plasma diluido, no en términos absolutos, y una cifra engañaría.
 */
const BANDAS = (nombres: [string, string, string, string, string], intervalos?: [string, string, string, string, string]) =>
  [-0.5, -0.15, 0.15, 0.5, undefined].map((hasta, i) => ({ hasta, texto: nombres[i], intervalo: intervalos?.[i] }));

export const valoresOrientativos: Record<string, ValorOrientativo> = {
  pas: { unidad: 'mmHg', normal: '< 130', aclaracion: 'en reposo y en consulta; óptima < 120, normal 120–129, normal-alta 130–139 e hipertensión desde 140 (ESH 2023)', anclas: [80, 100, 120, 160, 180], modo: 'numero', paso: 5, enSesionFuerza: 'muy alta durante el esfuerzo' },
  pad: { unidad: 'mmHg', normal: '< 85', aclaracion: 'en reposo y en consulta; óptima < 80, normal 80–84, normal-alta 85–89 e hipertensión desde 90 (ESH 2023)', anclas: [50, 65, 80, 100, 110], modo: 'numero', paso: 5, enSesionFuerza: 'muy alta durante el esfuerzo' },
  creatinina: { unidad: 'mg/dL', normal: '0,6–1,2', aclaracion: 'depende del sexo, la masa muscular y el laboratorio', anclas: [0.4, 0.6, 0.9, 1.5, 3.0], modo: 'numero', paso: 0.1, minimo: -0.15 },
  natremia: { unidad: 'mmol/L', normal: '135–145', aclaracion: 'en el paciente, la sal de la dieta la mueve muy poco: entre 0,4 y 3 mmol/L', anclas: [120, 130, 140, 146, 160], modo: 'numero', paso: 1 },
  potasio: { unidad: 'mmol/L', normal: '3,5–5,0', aclaracion: 'depende del laboratorio', anclas: [2.5, 3.0, 4.2, 5.5, 6.5], modo: 'numero', paso: 0.1 },
  osmP: { unidad: 'mOsm/kg', normal: '275–295', anclas: [245, 265, 285, 297, 325], modo: 'numero', paso: 5 },
  osmU: {
    unidad: 'mOsm/kg', normal: '50–1200', aclaracion: 'según lo que se beba; se interpreta junto con la osmolaridad del plasma', anclas: [100, 250, 600, 800, 1000], modo: 'banda', paso: 50,
    bandas: BANDAS(['muy diluida', 'diluida', 'intermedia', 'concentrada', 'muy concentrada']),
  },
  diuresis: {
    unidad: 'mL/día', normal: '800–2000', aclaracion: 'depende sobre todo de lo que se beba', anclas: [400, 800, 1500, 3000, 6000], modo: 'banda', paso: 100,
    bandas: BANDAS(['oliguria', 'escasa', 'normal', 'abundante', 'poliuria'], ['< 500', '≈ 500–800', '≈ 800–2000', '≈ 2000–3000', '> 3000']),
  },
  renina: {
    unidad: 'ng/mL/h', normal: '0,5–3', aclaracion: 'actividad de renina plasmática, con la persona sentada; depende del laboratorio, la postura, la sal y los fármacos', anclas: [0.1, 0.3, 1.5, 5, 15], modo: 'banda', paso: 0.1,
    bandas: BANDAS(['muy suprimida', 'suprimida', 'normal', 'alta', 'muy alta'], ['< 0,2', '≈ 0,2–0,5', '≈ 0,5–3', '≈ 3–10', '> 10']),
  },
  aldo: {
    unidad: 'ng/dL', normal: '5–20', aclaracion: 'con la persona sentada y una dieta con sal normal; el rango de cada laboratorio suele ser más ancho y cambia con la postura, la sal y el método', anclas: [2, 4, 10, 20, 40], modo: 'banda', paso: 1,
    bandas: BANDAS(['muy suprimida', 'suprimida', 'normal', 'alta', 'muy alta'], ['< 3', '≈ 3–5', '≈ 5–20', '≈ 20–30', '> 30']),
  },
};

/** Nota fija de la opción en Ajustes (revisada por Fable 5.2). */
export const notaValores =
  'El simulador solo calcula hacia dónde y cuánto se mueve cada valor (las flechas). Con esta opción, cada flecha se traduce a una cifra o a un intervalo típicos, para hacerse una idea del orden de magnitud. No es el valor que tendría un paciente, ni sirve para interpretar una analítica o una toma de presión reales. Los rangos normales cambian según el laboratorio.';
