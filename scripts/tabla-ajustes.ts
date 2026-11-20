/** Imprime en Markdown la tabla de ajustes de calibración (para docs/calibracion.md). */
import { relaciones } from '../src/temas/hipertension/relaciones';
import { relacionesNuevas } from '../src/temas/hipertension/propuestas';
import { ajustes } from '../src/temas/hipertension/calibracion';
import { nodos } from '../src/temas/hipertension/nodos';

const nombre = (id: string) => nodos.find((n) => n.id === id)?.nombre ?? id;
const todas = [...relaciones, ...relacionesNuevas.map((p) => p.relacion)];
const f = (v: number | undefined) => (v === undefined ? '—' : v.toFixed(2).replace('.', ','));

console.log('| # | Relación | Peso | Antes | Después | Motivo | Sin este ajuste falla |');
console.log('| --- | --- | --- | --- | --- | --- | --- |');
for (const a of ajustes) {
  const r = todas.find((x) => x.n === a.n)!;
  const signo = r.tipo === 'suma' ? ` (${r.signo === '+' ? '+' : '−'})` : '';
  const peso = a.campo === 'intensidad' ? (r.tipo === 'suma' && r.intensidadNegativa !== undefined || ajustes.some((b) => b.n === a.n && b.campo === 'intensidadNegativa') ? 'por encima de 0' : 'única') : 'por debajo de 0';
  console.log(`| ${a.n} | ${nombre(r.origen)} → ${nombre(r.destino)}${signo} | ${peso} | ${f(a.antes)} | ${f(a.despues)} | ${a.motivo} | ${a.sinEsteAjuste.join(', ') || '— (mejora márgenes)'} |`);
}
