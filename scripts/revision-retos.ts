/**
 * Genera el documento de retos de un tema a partir de sus datos (npm run
 * revision-retos -- [tema]). En la hipertensión, docs/retos.md a partir de
 * src/temas/hipertension/retos.ts. No se edita a mano.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { flecha, simular } from '../src/motor/motor';
import { rutaRepositorio, temaDelScript } from './temas';

const { tema, documentos, datos } = temaDelScript();
const m = tema.modelo;
const retos = tema.retos;
const nombre = (id: string) => m.nodos.find((n) => n.id === id)!.nombre;
const L: string[] = [];
if (tema.id === 'hipertension') {
  L.push('# Modo reto (fase 6, 17 nov 2026)', '');
  L.push('Once pacientes con las causas ocultas: cuatro de una causa, cuatro de dos y dos con un fármaco ya puesto, de menos a más difícil, y el de la lateralidad de la estenosis (fase 7). Son datos del tema (`src/temas/hipertension/retos.ts`). Este documento se genera a partir de ellos (`npm run revision-retos`); si se cambia un reto, hay que regenerarlo. Revisados por Fable 5.2 (`docs/revision-fase-6-fable.md`).', '');
  L.push('**Reglas** (vigiladas por `tests/retos.test.ts`): ningún reto es una «Combinación hipotética»; las claves son flechas del modelo en estado estable y ninguna está en el tope de escala; si una recalibración cambia una clave, el test falla.', '');
} else {
  L.push(`# Modo reto: ${tema.nombre}`, '');
  L.push(`${retos.length} pacientes con las causas ocultas. Son datos del tema (\`${datos.retos}\`). Este documento se genera a partir de ellos (\`npm run revision-retos -- ${tema.id}\`); si se cambia un reto, hay que regenerarlo.`, '');
}
L.push('**Corrección:** acierto si la respuesta coincide con las causas; a medias si acierta alguna (aunque falte o sobre otra); fallo si no acierta ninguna. Se eligen una o dos causas.', '');
for (const r of retos) {
  const v = simular(m, { ...r.causas, ...r.farmacos }, 'estable', { variantes: r.variantes }).valores;
  const causas = Object.entries(r.causas).map(([id, x]) => `${nombre(id)} (${x}${r.variantes?.[id] ? `, ${m.nodos.find((n) => n.id === id)?.variantes?.find((va) => va.id === r.variantes![id])?.corto}` : ''})`).join(' + ');
  const farm = r.farmacos ? ` · fármaco: ${Object.keys(r.farmacos).map(nombre).join(', ')}` : '';
  L.push(`## Reto ${r.id} · ${r.nivel === 'una' ? 'una causa' : r.nivel === 'dos' ? 'dos causas' : 'con fármaco'}`, '');
  L.push(`**Solución:** ${causas}${farm}`, '');
  L.push(`**Enunciado:** ${r.enunciado}`, '');
  L.push('**Pistas:**', '', ...r.pistas.map((p, i) => `${i + 1}. ${p}`), '');
  L.push('**Lo que lo delataba:**', '', ...r.delata.map((d) => `- ${d}`), '');
  L.push(`**Claves (se marcan al corregir):** ${Object.entries(r.claves).map(([id, f]) => `${nombre(id)} ${f}`).join(' · ')}`, '');
  if (tema.id === 'hipertension') L.push(`**Presión en el modelo:** sistólica ${flecha(v.pas)}, diastólica ${flecha(v.pad)}`, '');
}
L.push('## Qué se oculta durante el reto', '');
L.push('- Los mandos de las causas, su valor y la pastilla de frecuencia: el panel de causas pasa a «Respuesta» y sus placas se eligen.');
if (m.nodos.some((n) => n.variantes?.length)) L.push('- La franja de la lateralidad de la estenosis y la variante en su placa (fase 7).');
L.push('- El selector de casos, «Compartir», la «Combinación hipotética», los avisos de interacción y las notas entre causas (nombrarían la causa).');
L.push('- En las fichas, el valor de todas las causas (activas o no, para que no se adivinen por eliminación), su peso en «La mueven» y «Mueve a», y su nombre en «En este caso» («una causa oculta»).');
L.push('- Al corregir aparece todo, y las claves se marcan en violeta en la analítica, los mecanismos y la leyenda del dial.', '');
const salida = rutaRepositorio(documentos.retos);
mkdirSync(dirname(fileURLToPath(salida)), { recursive: true });
writeFileSync(salida, L.join('\n') + '\n');
console.log(`${documentos.retos} generado`);
