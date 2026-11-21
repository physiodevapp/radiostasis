/**
 * Genera docs/fuentes.md a partir de src/temas/hipertension/fuentes.ts y de las
 * relaciones del tema (npm run fuentes). No se edita a mano.
 */
import { writeFileSync } from 'node:fs';
import { hipertension as m } from '../src/temas/hipertension';
import { articulos, frases } from '../src/fisiologia/bibliografia';
import { relaciones as base } from '../src/temas/hipertension/relaciones';

const nombre = (id: string) => m.nodos.find((n) => n.id === id)?.nombre ?? id;
const enlace = (p: string) => `[${p}](https://pubmed.ncbi.nlm.nih.gov/${p}/)`;
const delModelo = new Set(base.map((r) => r.n));
const completos = Object.values(articulos).filter((a) => a.comprobado === 'texto completo').length;
const L: string[] = [];

L.push(
  '# Fuentes del modelo de hipertensión',
  '',
  'Documento generado con `npm run fuentes` a partir de `src/temas/hipertension/fuentes.ts` (bibliografía) y de las relaciones del tema. No lo edites a mano: corrige los datos y vuelve a generarlo.',
  '',
  `Solo PubMed. Cada una de las ${m.relaciones.length} relaciones del tema (modelo v2.1, revisiones, fármacos y ejercicio) cita en \`pmid\` uno o varios artículos que la respaldan. Cada PMID se comprobó en PubMed (título, autores, revista y año) el 19 nov 2026. ` +
    `De ${Object.keys(articulos).length} artículos, ${completos} se leyeron enteros en PubMed Central; de los demás se comprobó el resumen. ` +
    `En ${Object.keys(frases).length} relaciones se copia además la frase literal que las respalda, cotejada con el resumen o con el texto completo. Las fuentes no cambian el modelo: signos e intensidades son los de \`docs/modelo-v2.1.md\` y \`docs/calibracion.md\`.`,
  '',
  '## Artículos',
  '',
  ...Object.entries(articulos)
    .sort((a, b) => a[1].cita.localeCompare(b[1].cita, 'es'))
    .map(([pmid, a]) => `- ${a.cita} PMID ${enlace(pmid)}. *Comprobado: ${a.comprobado}.*`),
  '',
  '## Relaciones del modelo v2.1',
  '',
  '| N.º | Relación | PMID | Explicación |',
  '| --- | --- | --- | --- |',
);
const fila = (r: (typeof m.relaciones)[number]) => {
  const destino = r.tipo === 'modula' || r.tipo === 'bloquea' ? `relaciones ${r.relaciones.join(' y ')}` : nombre(r.destino);
  const pm = (r.pmid ?? []).map(enlace).join(', ') || r.fuente;
  return `| ${r.n} | ${nombre(r.origen)} → ${destino} | ${pm} | ${r.explicacion} |`;
};
for (const r of [...m.relaciones].filter((x) => delModelo.has(x.n)).sort((a, b) => a.n - b.n)) L.push(fila(r));
L.push('', '## Frases que respaldan cada relación', '');
for (const [n, lista] of Object.entries(frases).sort((a, b) => Number(a[0]) - Number(b[0])))
  for (const f of lista) L.push(`- **Relación ${n}** (PMID ${enlace(f.pmid)}): «${f.frase}»`);
L.push('', '## Relaciones añadidas después (fases 3e a 7 y revisión del modelo)', '', '| N.º | Relación | PMID | Explicación |', '| --- | --- | --- | --- |');
for (const r of [...m.relaciones].filter((x) => !delModelo.has(x.n)).sort((a, b) => a.n - b.n)) L.push(fila(r));
L.push('');

writeFileSync(new URL('../docs/fuentes.md', import.meta.url), L.join('\n'));
console.log('docs/fuentes.md generado');
