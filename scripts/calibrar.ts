/**
 * Calibrador de intensidades (herramienta de desarrollo, no se usa en la app).
 *
 * Búsqueda por coordenadas sobre una rejilla de pesos. Minimiza:
 *   Σ distancia de cada valor a su intervalo esperado (con margen)
 *   + λ · Σ |log(peso / peso del documento)|   (preferir pocos cambios)
 *
 * Uso: npm run calibrar -- [tema] [--negativas 13,14] [--lambda 0.02] [--pasadas 6]
 * Fase N2: el tema va primero (sin él, la hipertensión) y se parte de su modelo
 * sin calibrar (scripts/temas.ts). Escribe la propuesta en la consola; los
 * ajustes se copian a mano a la calibración del tema (en la hipertensión,
 * src/temas/hipertension/calibracion.ts) con su motivo.
 */
import { flecha, simular } from '../src/motor/motor';
import type { Flecha, Modelo, Relacion, RelacionSuma } from '../src/motor/tipos';
import { readFileSync, writeFileSync } from 'node:fs';
import { temaDelScript } from './temas';

const { tema, sinCalibrar } = temaDelScript();

const arg = (k: string, d: string) => {
  const i = process.argv.indexOf(k);
  return i >= 0 ? process.argv[i + 1] : d;
};
const LAMBDA = Number(arg('--lambda', '0.02'));
const PASADAS = Number(arg('--pasadas', '6'));
const MARGEN = Number(arg('--margen', '0.04'));
const NEGATIVAS = arg('--negativas', '').split(',').filter(Boolean).map(Number);
const DESDE_CALIBRADO = process.argv.includes('--desde-calibrado');
const FIJAS = arg('--fijas', '').split(',').filter(Boolean).map(Number);
const SALIDA = arg('--salida', '');
const DESDE = arg('--desde', '');
/** Pesos que la búsqueda no puede mover (por ejemplo «40:intensidad,54:intensidad»). */
const CONGELADAS = new Set(arg('--congeladas', '').split(',').filter(Boolean));
/** Mínimos por peso: «27:intensidad=0.6,39:intensidad=0.3». */
const MINIMOS = new Map(
  arg('--minimos', '').split(',').filter(Boolean).map((x) => {
    const [k, v] = x.split('=');
    return [k, Number(v)] as [string, number];
  }),
);

const REJILLA = [0.1, 0.15, 0.2, 0.3, 0.4, 0.5, 0.6, 0.8, 1.0, 1.25, 1.5, 2.0];

const INTERVALO: Record<Flecha, [number, number]> = {
  '↓↓': [-Infinity, -0.5],
  '↓': [-0.5, -0.15],
  '=': [-0.15, 0.15],
  '↑': [0.15, 0.5],
  '↑↑': [0.5, Infinity],
};

function distancia(v: number, permitidas: Flecha[]): number {
  let mejor = Infinity;
  for (const f of permitidas) {
    const [a, b] = INTERVALO[f];
    const lo = a === -Infinity ? a : a + MARGEN;
    const hi = b === Infinity ? b : b - MARGEN;
    const d = v < lo ? lo - v : v > hi ? v - hi : 0;
    mejor = Math.min(mejor, d);
  }
  return mejor;
}

type Clave = `${number}:${'intensidad' | 'intensidadNegativa'}`;
const base = sinCalibrar;
const inicial = DESDE_CALIBRADO ? tema.modelo : base;

const pesos = new Map<Clave, number>();
const pesosDoc = new Map<Clave, number>();
for (const r of inicial.relaciones) {
  if (r.tipo !== 'suma' || FIJAS.includes(r.n)) continue;
  const doc = base.relaciones.find((b) => b.n === r.n) as RelacionSuma;
  pesos.set(`${r.n}:intensidad`, r.intensidad);
  pesosDoc.set(`${r.n}:intensidad`, doc.intensidad);
  if (r.intensidadNegativa !== undefined || NEGATIVAS.includes(r.n)) {
    pesos.set(`${r.n}:intensidadNegativa`, r.intensidadNegativa ?? r.intensidad);
    pesosDoc.set(`${r.n}:intensidadNegativa`, doc.intensidadNegativa ?? doc.intensidad);
  }
}

if (DESDE) {
  for (const [k, v] of JSON.parse(readFileSync(DESDE, 'utf8')) as [Clave, number][]) {
    if (!pesosDoc.has(k)) pesosDoc.set(k, v);
    pesos.set(k, v);
  }
}

function construir(p: Map<Clave, number>): Modelo {
  const relaciones: Relacion[] = base.relaciones.map((r) => {
    if (r.tipo !== 'suma') return r;
    const c: RelacionSuma = { ...r };
    const i = p.get(`${r.n}:intensidad`);
    if (i !== undefined) c.intensidad = i;
    const ineg = p.get(`${r.n}:intensidadNegativa`);
    if (ineg !== undefined) c.intensidadNegativa = ineg;
    else if (!FIJAS.includes(r.n)) delete c.intensidadNegativa;
    const fija = inicial.relaciones.find((x) => x.n === r.n) as RelacionSuma;
    if (FIJAS.includes(r.n)) return fija;
    return c;
  });
  return { ...base, relaciones, parametros: { ...base.parametros, maxIteraciones: 30000 } };
}

function evaluarPerdida(m: Modelo): { error: number; fallos: number } {
  let error = 0;
  let fallos = 0;
  for (const caso of m.casos) {
    for (const e of caso.esperado) {
      const { valores, convergido } = simular(m, { ...caso.causas, ...e.ajustes }, e.escala);
      if (!convergido) {
        error += 100;
        fallos += 100;
        continue;
      }
      for (const [nodo, esp] of Object.entries(e.valores)) {
        if (e.pendientes?.[nodo]) continue;
        const permitidas = Array.isArray(esp) ? esp : [esp];
        error += distancia(valores[nodo], permitidas);
        if (!permitidas.includes(flecha(valores[nodo]))) fallos++;
      }
    }
  }
  return { error, fallos };
}

function penalizacion(p: Map<Clave, number>): number {
  let s = 0;
  for (const [k, v] of p) if (!CONGELADAS.has(k)) s += Math.abs(Math.log(v / pesosDoc.get(k)!));
  return LAMBDA * s;
}

const total = (p: Map<Clave, number>) => {
  const { error, fallos } = evaluarPerdida(construir(p));
  // Cada fallo real pesa mucho más que acercarse al margen.
  return { coste: error + 0.5 * fallos + penalizacion(p), error, fallos };
};

const METODO = arg('--metodo', 'coordenadas');
const EVALUACIONES = Number(arg('--evaluaciones', '3000'));
const SEMILLA = Number(arg('--semilla', '1'));
let semilla = SEMILLA;
const azar = () => ((semilla = (semilla * 1103515245 + 12345) % 2147483648) / 2147483648);
const normal = () => Math.sqrt(-2 * Math.log(azar() + 1e-12)) * Math.cos(2 * Math.PI * azar());

let actual = total(pesos);
console.log(`inicio: coste ${actual.coste.toFixed(4)} · error ${actual.error.toFixed(4)} · fallos ${actual.fallos}`);
if (METODO === 'es') {
  // Estrategia evolutiva (1+1): perturba de 1 a 4 pesos a la vez en escala logarítmica.
  const claves = [...pesos.keys()].filter((k) => !CONGELADAS.has(k));
  let sigma = 0.4;
  for (let ev = 1; ev <= EVALUACIONES; ev++) {
    const prueba = new Map(pesos);
    const cuantos = 1 + Math.floor(azar() * 4);
    for (let i = 0; i < cuantos; i++) {
      const k = claves[Math.floor(azar() * claves.length)];
      prueba.set(k, Math.min(3, Math.max(MINIMOS.get(k) ?? 0.03, prueba.get(k)! * Math.exp(sigma * normal()))));
    }
    const t = total(prueba);
    if (t.coste < actual.coste) {
      actual = t;
      for (const [k, v] of prueba) pesos.set(k, v);
      sigma = Math.min(1, sigma * 1.5);
    } else sigma = Math.max(0.05, sigma * 0.97);
    if (ev % 250 === 0) {
      if (SALIDA) writeFileSync(SALIDA, JSON.stringify([...pesos]));
      console.log(`evaluación ${ev}: coste ${actual.coste.toFixed(4)} · error ${actual.error.toFixed(4)} · fallos ${actual.fallos} · sigma ${sigma.toFixed(2)}`);
    }
  }
}

for (let pasada = 1; pasada <= (METODO === 'es' ? 0 : PASADAS); pasada++) {
  let mejoras = 0;
  for (const k of pesos.keys()) {
    if (CONGELADAS.has(k)) continue;
    const original = pesos.get(k)!;
    let mejorV = original;
    for (const v of REJILLA) {
      if (v === original) continue;
      pesos.set(k, v);
      const t = total(pesos);
      if (t.coste < actual.coste - 1e-9) {
        actual = t;
        mejorV = v;
      }
    }
    pesos.set(k, mejorV);
    if (mejorV !== original) mejoras++;
  }
  if (SALIDA) writeFileSync(SALIDA, JSON.stringify([...pesos]));
  console.log(`pasada ${pasada}: coste ${actual.coste.toFixed(4)} · error ${actual.error.toFixed(4)} · fallos ${actual.fallos} · cambios ${mejoras}`);
  if (mejoras === 0) break;
}

console.log('\nCambios respecto al documento:');
for (const [k, v] of pesos) {
  const d = pesosDoc.get(k)!;
  if (v !== d) console.log(`  ${k}  ${d} → ${v}`);
}
const final = construir(pesos);
for (const caso of final.casos)
  for (const e of caso.esperado) {
    const { valores } = simular(final, { ...caso.causas, ...e.ajustes }, e.escala);
    for (const [nodo, esp] of Object.entries(e.valores)) {
      if (e.pendientes?.[nodo]) continue;
      const permitidas = Array.isArray(esp) ? esp : [esp];
      if (!permitidas.includes(flecha(valores[nodo])))
        console.log(`  FALLO caso ${caso.id} ${e.escala}${e.condicion ? ' ' + e.condicion : ''} ${nodo}: ${valores[nodo].toFixed(2)} (esperado ${permitidas.join('/')})`);
    }
  }
console.log('\nJSON:', JSON.stringify([...pesos].filter(([k, v]) => v !== pesosDoc.get(k))));
