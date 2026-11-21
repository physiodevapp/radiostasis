/**
 * Genera el documento de fuentes de un tema (npm run fuentes -- [tema]) a partir
 * de la bibliografía común (src/fisiologia/bibliografia.ts) y de las relaciones
 * del tema. En la hipertensión, docs/fuentes.md. No se edita a mano.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { articulos, frases as frasesComunes } from '../src/fisiologia/bibliografia';
import type { Frase, Relacion } from '../src/motor/tipos';
import { rutaRepositorio, temaDelScript } from './temas';

const { tema, documentos, relacionesDocumento } = temaDelScript();
const m = tema.modelo;
const nombre = (id: string) => m.nodos.find((n) => n.id === id)?.nombre ?? id;
const enlace = (p: string) => `[${p}](https://pubmed.ncbi.nlm.nih.gov/${p}/)`;
/** Frase de una relación del tema: la suya si tiene asterisco; si no, la común. */
const frasesDe = (r: Relacion): Frase[] => (r.reasignada ? m.frases?.[r.n] : frasesComunes[r.n]) ?? [];
const usados = new Set(m.relaciones.flatMap((r) => r.pmid ?? []));
const delTema = Object.entries(articulos).filter(([pmid]) => usados.has(pmid));
const conFrase = m.relaciones.filter((r) => frasesDe(r).length);
const completos = delTema.filter(([, a]) => a.comprobado === 'texto completo').length;
const asterisco = m.relaciones.some((r) => r.reasignada);
const L: string[] = [];

/** Encabezado del documento: el de la hipertensión es el de siempre. */
const encabezado: Record<string, string[]> = {
  hipertension: [
    '# Fuentes del modelo de hipertensión',
    '',
    'Documento generado con `npm run fuentes` a partir de `src/fisiologia/bibliografia.ts` (bibliografía) y de las relaciones del tema. No lo edites a mano: corrige los datos y vuelve a generarlo.',
    '',
    `Solo PubMed. Cada una de las ${m.relaciones.length} relaciones del tema (modelo v2.1, revisiones, fármacos y ejercicio) cita en \`pmid\` uno o varios artículos que la respaldan. Cada PMID se comprobó en PubMed (título, autores, revista y año) el 19 nov 2026. ` +
      `De ${delTema.length} artículos, ${completos} se leyeron enteros en PubMed Central; de los demás se comprobó el resumen. ` +
      `En ${conFrase.length} relaciones se copia además la frase literal que las respalda, cotejada con el resumen o con el texto completo. Las fuentes no cambian el modelo: signos e intensidades son los de \`docs/modelo-v2.1.md\` y \`docs/calibracion.md\`.`,
  ],
};
L.push(
  ...(encabezado[tema.id] ?? [
    `# Fuentes del modelo: ${tema.nombre}`,
    '',
    `Documento generado con \`npm run fuentes -- ${tema.id}\` a partir de la bibliografía común (\`src/fisiologia/bibliografia.ts\`) y de las relaciones del tema. No lo edites a mano: corrige los datos y vuelve a generarlo.`,
    '',
    `Solo PubMed. Cada una de las ${m.relaciones.length} relaciones del tema cita en \`pmid\` uno o varios artículos que la respaldan. ` +
      `De ${delTema.length} artículos, ${completos} se leyeron enteros en PubMed Central; de los demás se comprobó el resumen. ` +
      `En ${conFrase.length} relaciones se copia además la frase literal que las respalda.` +
      (asterisco ? ' Las relaciones con asterisco (\\*) vienen de la biblioteca común con otro origen o destino: conservan su número y sus PMID, y su explicación y su frase son las de este tema.' : ''),
  ]),
  '',
  '## Artículos',
  '',
  ...delTema
    .sort((a, b) => a[1].cita.localeCompare(b[1].cita, 'es'))
    .map(([pmid, a]) => `- ${a.cita} PMID ${enlace(pmid)}. *Comprobado: ${a.comprobado}.*`),
  '',
);
const fila = (r: Relacion) => {
  const destino = r.tipo === 'modula' || r.tipo === 'bloquea' ? `relaciones ${r.relaciones.join(' y ')}` : nombre(r.destino);
  const pm = (r.pmid ?? []).map(enlace).join(', ') || r.fuente;
  return `| ${r.n}${r.reasignada ? '\\*' : ''} | ${nombre(r.origen)} → ${destino} | ${pm} | ${r.explicacion} |`;
};
const ordenadas = (lista: Relacion[]) => [...lista].sort((a, b) => a.n - b.n);
const tabla = ['| N.º | Relación | PMID | Explicación |', '| --- | --- | --- | --- |'];
if (relacionesDocumento) {
  L.push('## Relaciones del modelo v2.1', '', ...tabla);
  for (const r of ordenadas(m.relaciones.filter((x) => relacionesDocumento.has(x.n)))) L.push(fila(r));
} else {
  L.push('## Relaciones', '', ...tabla);
  for (const r of ordenadas(m.relaciones)) L.push(fila(r));
}
L.push('', '## Frases que respaldan cada relación', '');
for (const r of ordenadas(conFrase))
  for (const f of frasesDe(r)) L.push(`- **Relación ${r.n}${r.reasignada ? '\\*' : ''}** (PMID ${enlace(f.pmid)}): «${f.frase}»`);
if (relacionesDocumento) {
  L.push('', '## Relaciones añadidas después (fases 3e a 7 y revisión del modelo)', '', ...tabla);
  for (const r of ordenadas(m.relaciones.filter((x) => !relacionesDocumento.has(x.n)))) L.push(fila(r));
}
L.push('');

const salida = rutaRepositorio(documentos.fuentes);
mkdirSync(dirname(fileURLToPath(salida)), { recursive: true });
writeFileSync(salida, L.join('\n'));
console.log(`${documentos.fuentes} generado`);
