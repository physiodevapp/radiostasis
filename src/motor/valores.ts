/**
 * Valores orientativos (fase 6, punto 5): traduce la escala del modelo (−1 a 1
 * respecto a lo normal) a una cifra clínica típica, por interpolación lineal
 * entre cinco anclas (v = −1, −0,5, 0, +0,5 y +1). Es una capa de vista, como
 * datos del tema: no cambia el cálculo. Fuentes y criterios en
 * docs/valores-orientativos.md.
 */
export interface ValorOrientativo {
  unidad: string;
  /** Rango normal del adulto, corto, para la celda («135–145»). */
  normal: string;
  /** Aclaración del rango para la ficha («según lo que se beba», «depende del laboratorio»). */
  aclaracion?: string;
  /** Valores en v = −1, −0,5, 0, +0,5 y +1. */
  anclas: [number, number, number, number, number];
  /**
   * «numero»: cifra interpolada y redondeada. «banda»: categoría con su intervalo
   * fijo (sin cifra interpolada, que podría contradecir la banda).
   */
  modo: 'numero' | 'banda';
  /** Paso de redondeo (5 mmHg, 0,1 mmol/L…). */
  paso: number;
  /** Bandas por v: la primera cuyo `hasta` sea ≥ v. La última, sin `hasta`. */
  bandas?: { hasta?: number; texto: string; intervalo?: string }[];
  /** Por debajo de este v la magnitud no se traduce y se dice «normal» (p. ej. la creatinina baja). */
  minimo?: number;
  /** Texto en lugar de la cifra en una sesión de fuerza (la presión se sale de la escala). */
  enSesionFuerza?: string;
}

const XS = [-1, -0.5, 0, 0.5, 1];

/** Interpolación lineal entre anclas; fuera de [−1, 1] se queda en el extremo. */
export function interpolar(v: number, anclas: readonly number[]): number {
  if (v <= -1) return anclas[0];
  if (v >= 1) return anclas[4];
  for (let i = 0; i < 4; i++) {
    if (v <= XS[i + 1]) return anclas[i] + ((anclas[i + 1] - anclas[i]) * (v - XS[i])) / (XS[i + 1] - XS[i]);
  }
  return anclas[4];
}

/** Redondeo al paso, con coma decimal española. */
export function formatear(x: number, paso: number): string {
  const r = Math.round(x / paso) * paso;
  const decimales = paso >= 1 ? 0 : Math.max(0, Math.ceil(-Math.log10(paso) - 1e-9));
  return r.toLocaleString('es-ES', { minimumFractionDigits: decimales, maximumFractionDigits: decimales, useGrouping: r >= 10000 });
}

export interface Traduccion {
  /** Lo que se muestra: «≈ 145 mmol/L», «suprimida (≈ 0,2–0,5 ng/mL/h)», «muy concentrada», «normal». */
  texto: string;
  /** La cifra, si la hay. */
  valor?: number;
  banda?: string;
}

/**
 * Traduce un valor del modelo. En el tope de escala (|v| ≥ 0,95) la cifra va con
 * «≥» o «≤»: el simulador no distingue más allá.
 */
export function traducir(v: number, def: ValorOrientativo, tope = 0.95): Traduccion {
  if (def.minimo !== undefined && v < def.minimo) return { texto: 'normal' };
  // En el tope de escala, siempre el ancla del extremo: la cifra es única y es la documentada.
  const enTope = Math.abs(v) >= tope - 1e-9;
  const x = interpolar(enTope ? Math.sign(v) : v, def.anclas);
  const signo = enTope ? (v > 0 ? '≥ ' : '≤ ') : '≈ ';
  const cifra = `${signo}${formatear(x, def.paso)} ${def.unidad}`;
  if (def.modo === 'banda' && def.bandas?.length) {
    const b = def.bandas.find((x) => x.hasta === undefined || v <= x.hasta) ?? def.bandas[def.bandas.length - 1];
    return { texto: b.intervalo ? `${b.texto} (${b.intervalo} ${def.unidad})` : b.texto, valor: x, banda: b.texto };
  }
  return { texto: cifra, valor: x };
}
