import { flecha } from '../motor/motor';
import type { Escala, Flecha, Nodo } from '../motor/tipos';

export const NOMBRE_ESCALA: Record<Escala, string> = {
  minutos: 'Minutos',
  dias: 'Días',
  estable: 'Estado estable',
};

const PALABRA: Record<Flecha, string> = {
  '↑↑': 'sube mucho',
  '↑': 'sube',
  '=': 'normal',
  '↓': 'baja',
  '↓↓': 'baja mucho',
};

/** Flecha en palabras, para lectores de pantalla. */
export const enPalabras = (v: number): string => PALABRA[flecha(v)];

/** Tono de una flecha: sube, baja o neutro. Siempre va acompañado de la flecha. */
export function tono(v: number): 'sube' | 'baja' | 'neutro' {
  const f = flecha(v);
  return f === '=' ? 'neutro' : f.startsWith('↑') ? 'sube' : 'baja';
}

/** Número con coma decimal y signo tipográfico («+0,5», «−1»). */
export function numero(v: number): string {
  const r = Math.round(v * 100) / 100;
  if (r === 0) return '0';
  const s = Math.abs(r).toLocaleString('es-ES', { maximumFractionDigits: 2 });
  return (r > 0 ? '+' : '−') + s;
}

/** Tipo de mando según el rango de la causa. */
export function tipoMando(n: Nodo): 'bipolar' | 'unipolar' | 'inverso' {
  const [min, max] = n.rango;
  if (min < 0 && max > 0) return 'bipolar';
  return max <= 0 ? 'inverso' : 'unipolar';
}

/** Texto del valor en la placa del mando («normal», «no», «joven», «libre», «+1»…). */
export function textoMando(n: Nodo, v: number): string {
  if (n.tipo === 'farmaco') return textoDosis(v);
  if (n.niveles) return [...n.niveles].reverse().find(([desde]) => v >= desde - 1e-9)?.[1] ?? n.niveles[0][1];
  if (Math.abs(v) < 1e-9) {
    const tipo = tipoMando(n);
    if (tipo === 'bipolar') return 'normal';
    if (tipo === 'inverso') return n.etiquetas?.[1] ?? '0';
    return n.etiquetas?.[0] ?? '0';
  }
  return numero(v);
}

/** Dosis de un fármaco: «sin», «50 %», «dosis plena». */
export function textoDosis(v: number): string {
  if (v < 0.005) return 'sin';
  if (v > 0.995) return 'dosis plena';
  return `${Math.round(v * 100)} %`;
}

/** Texto para `aria-valuetext`: valor y hacia qué extremo va. */
export function textoAccesibleMando(n: Nodo, v: number): string {
  if (n.tipo === 'farmaco') {
    const t = textoDosis(v);
    return t.endsWith('%') ? `${t} de la dosis plena` : t;
  }
  if (n.niveles) return textoMando(n, v);
  const base = textoMando(n, v);
  if (Math.abs(v) < 1e-9) return base;
  const [min, max] = n.rango;
  const etiqueta = v > 0 ? n.etiquetas?.[1] : n.etiquetas?.[0];
  if (!etiqueta) return base;
  if (tipoMando(n) === 'unipolar' && n.etiquetas?.[1] === 'sí') return v >= max ? `${base}, presente` : `${base}, en parte`;
  return v === max || v === min ? `${base}, ${etiqueta}` : `${base}, hacia ${etiqueta}`;
}
