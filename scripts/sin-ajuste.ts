/**
 * Recalcula el campo `sinEsteAjuste` de calibracion.ts: qué comprobaciones de la
 * tabla fallan si se quita solo ese ajuste. Reescribe el archivo.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { evaluar } from '../src/motor/evaluar';
import { aplicarAjustes, hipertension, relacionesPropuestas } from '../src/temas/hipertension';
import { ajustes } from '../src/temas/hipertension/calibracion';

const etiqueta = (c: { caso: number; escala: string; condicion?: string; nodo: string }) =>
  `${c.caso}${c.escala === 'estable' ? '' : ' ' + (c.escala === 'dias' ? 'días' : c.escala)}${c.condicion ? ' ' + c.condicion : ''} ${c.nodo}`;

const ruta = 'src/temas/hipertension/calibracion.ts';
let texto = readFileSync(ruta, 'utf8');
for (const a of ajustes) {
  const resto = ajustes.filter((b) => b !== a);
  const fallos = evaluar({ ...hipertension, relaciones: aplicarAjustes(relacionesPropuestas, resto) })
    .filter((c) => !c.ok && !c.pendiente)
    .map(etiqueta);
  const patron = new RegExp(`(\\{ n: ${a.n}, campo: '${a.campo}',[\\s\\S]*?sinEsteAjuste: )\\[[^\\]]*\\]`);
  texto = texto.replace(patron, `$1${JSON.stringify(fallos).replace(/","/g, '", "')}`);
  console.log(a.n, a.campo, fallos.length);
}
writeFileSync(ruta, texto);
