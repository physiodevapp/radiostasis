/**
 * Poda de una calibración (herramienta de desarrollo).
 *
 * 1. Redondea cada peso a centésimas.
 * 2. Revierte al valor del documento todo ajuste cuya ausencia no añade fallos.
 * 3. Para cada ajuste que queda, anota qué comprobaciones fallan sin él.
 *
 * Uso: npx tsx scripts/podar.ts pesos.json > propuesta.ts
 */
import { readFileSync } from 'node:fs';
import { flecha, simular } from '../src/motor/motor';
import type { Modelo, Relacion, RelacionSuma } from '../src/motor/tipos';
import { hipertensionSinCalibrar as base } from '../src/temas/hipertension';

type Campo = 'intensidad' | 'intensidadNegativa';
const clave = (n: number, c: Campo) => `${n}:${c}`;

const doc = new Map<string, number>();
for (const r of base.relaciones) {
  if (r.tipo !== 'suma') continue;
  doc.set(clave(r.n, 'intensidad'), r.intensidad);
  doc.set(clave(r.n, 'intensidadNegativa'), r.intensidadNegativa ?? r.intensidad);
}

/** Pesos fijados a mano que la poda no puede tocar: `--congeladas 40:intensidad,54:intensidad`. */
const iC = process.argv.indexOf('--congeladas');
const CONGELADAS = new Set(iC >= 0 ? process.argv[iC + 1].split(',') : []);

const entrada = new Map(JSON.parse(readFileSync(process.argv[2], 'utf8')) as [string, number][]);
const pesos = new Map<string, number>();
for (const [k, v] of entrada) {
  const redondeado = Math.round(v * 1000) / 1000;
  // Una asimetría nueva (la relación no la tiene en la base) se conserva aunque coincida con el valor del documento:
  // quitarla no es «volver al documento», sino usar el peso de por encima de 0 también por debajo.
  const [n, campo] = k.split(':');
  const asimetriaNueva =
    campo === 'intensidadNegativa' &&
    !base.relaciones.some((r) => r.n === Number(n) && r.tipo === 'suma' && r.intensidadNegativa !== undefined);
  if (asimetriaNueva || Math.abs(redondeado - doc.get(k)!) > 1e-9) pesos.set(k, redondeado);
}

function construir(p: Map<string, number>): Modelo {
  const relaciones: Relacion[] = base.relaciones.map((r) => {
    if (r.tipo !== 'suma') return r;
    const c: RelacionSuma = { ...r };
    const i = p.get(clave(r.n, 'intensidad'));
    if (i !== undefined) c.intensidad = i;
    const n = p.get(clave(r.n, 'intensidadNegativa'));
    if (n !== undefined) c.intensidadNegativa = n;
    return c;
  });
  return { ...base, relaciones };
}

function fallos(p: Map<string, number>): string[] {
  const m = construir(p);
  const lista: string[] = [];
  for (const caso of m.casos)
    for (const e of caso.esperado) {
      const { valores, convergido } = simular(m, { ...caso.causas, ...e.ajustes }, e.escala);
      if (!convergido) {
        lista.push(`caso ${caso.id} no converge`);
        continue;
      }
      for (const [nodo, esp] of Object.entries(e.valores)) {
        if (e.pendientes?.[nodo]) continue;
        const ok = (Array.isArray(esp) ? esp : [esp]).includes(flecha(valores[nodo]));
        if (!ok) lista.push(`${caso.id}${e.escala === 'estable' ? '' : ' ' + e.escala}${e.condicion ? ' ' + e.condicion : ''} ${nodo}`);
      }
    }
  return lista;
}

const inicial = fallos(pesos);
console.error(`tras redondear: ${inicial.length} fallos: ${inicial.join(', ')}`);

// Poda: de los cambios más pequeños a los más grandes.
const orden = [...pesos.keys()].sort(
  (a, b) => Math.abs(Math.log(pesos.get(a)! / doc.get(a)!)) - Math.abs(Math.log(pesos.get(b)! / doc.get(b)!)),
);
let actuales = inicial.length;
for (const k of orden) {
  if (CONGELADAS.has(k)) continue;
  const v = pesos.get(k)!;
  pesos.delete(k);
  const f = fallos(pesos).length;
  if (f <= actuales) {
    actuales = f;
    console.error(`  revertido ${k} (${v} → ${doc.get(k)})`);
  } else pesos.set(k, v);
}
// Valores redondos: se prueba el más cercano de una escala legible.
const REDONDOS = [0.05, 0.1, 0.15, 0.2, 0.3, 0.45, 0.6, 0.8, 1, 1.25, 1.5, 2, 2.5, 3];
for (const k of [...pesos.keys()]) {
  if (CONGELADAS.has(k)) continue;
  const v = pesos.get(k)!;
  const candidatos = [...REDONDOS].sort((a, b) => Math.abs(Math.log(a / v)) - Math.abs(Math.log(b / v))).slice(0, 2);
  for (const c of candidatos) {
    if (c === v) break;
    if (Math.abs(c - doc.get(k)!) < 1e-9) pesos.delete(k);
    else pesos.set(k, c);
    if (fallos(pesos).length <= actuales) {
      console.error(`  redondeado ${k} (${v} → ${c})`);
      break;
    }
    pesos.set(k, v);
  }
}
const restantes = fallos(pesos);
console.error(`tras podar: ${pesos.size} ajustes, ${restantes.length} fallos: ${restantes.join(', ')}`);

// Motivo automático: qué falla sin cada ajuste.
const filas: string[] = [];
const ordenados = [...pesos.keys()].sort((a, b) => parseFloat(a) - parseFloat(b) || a.localeCompare(b));
for (const k of ordenados) {
  const v = pesos.get(k)!;
  pesos.delete(k);
  const sin = fallos(pesos).filter((f) => !restantes.includes(f));
  pesos.set(k, v);
  const [n, campo] = k.split(':');
  if (CONGELADAS.has(k)) {
    filas.push(`  { n: ${n}, campo: '${campo}', antes: ${doc.get(k)}, despues: ${v}, motivo: 'FIJADO', sinEsteAjuste: [] },`);
    continue;
  }
  const antes = campo === 'intensidadNegativa' && !base.relaciones.some((r) => r.n === Number(n) && r.tipo === 'suma' && r.intensidadNegativa !== undefined)
    ? undefined
    : doc.get(k);
  filas.push(
    `  { n: ${n}, campo: '${campo}', antes: ${antes}, despues: ${v}, motivo: '', sinEsteAjuste: ${JSON.stringify(sin)} },`,
  );
}
console.log(filas.join('\n'));
