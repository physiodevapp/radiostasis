/** Genera docs/revision-fase-7.md: los textos de la fase 7 para revisarlos con Fable 5.2. */
import { writeFileSync } from 'node:fs';
import { hipertension as m } from '../src/temas/hipertension/index';
import { fichas } from '../src/temas/hipertension/fichas';
import { queMirar } from '../src/temas/hipertension/vista';
import { retos } from '../src/temas/hipertension/retos';
import { variantesEstenosis } from '../src/temas/hipertension/lateralidad';
const L: string[] = [];
const caso = (id: number) => m.casos.find((c) => c.id === id)!;
const aviso = (id: string) => m.avisos!.interacciones!.find((i) => i.id === id)!;
let n = 0;
const t = (donde: string, texto: string, estado: string) => L.push(`### ${++n}. ${donde} (${estado})`, '', `> ${texto}`, '');
L.push('# Revisión de los textos de la fase 7 (lateralidad de la estenosis)', '',
  'Para revisar con Fable 5.2 en una sesión aparte. Se genera con `npm run revision-fase-7` desde los datos del tema; no se edita a mano. Cada texto indica dónde aparece y si es nuevo, cambiado o sin cambios pero afectado por la lateralidad. Las flechas que debe respetar están en `docs/modelo-v2.1.md` («Cambios de la fase 7»). Fuentes: PMID 4332626, 16202699, 38006656, 3015794 y 6337327.', '',
  'Pide a Fable: errores fisiológicos, coherencia con las flechas del modelo, claridad para estudiantes de fisioterapia y estilo (español de España, frases cortas, sin anglicismos). Que proponga una opción principal para cada corrección.', '');
L.push('## Interfaz', '');
t('Franja del panel de causas: etiqueta y botones', `Estenosis renal · ${variantesEstenosis.map((v) => v.nombre).join(' · ')}`, 'nuevo');
t('Placa de la estenosis (línea bajo el valor)', variantesEstenosis.map((v) => v.corto).join(' / '), 'nuevo');
t('Selector de casos: título del grupo', 'Lateralidad de la estenosis', 'nuevo');
L.push('## Ficha de la estenosis', '');
t('Qué es', fichas.estenosis.queEs!, 'cambiado: sustituye «Aquí se simula bilateral»');
t('Qué hace', fichas.estenosis.queHace!, 'cambiado: añade la última frase');
t('En este caso · caso 34', fichas.estenosis.enCaso![34], 'nuevo');
t('En este caso · caso 5', fichas.estenosis.enCaso![5], 'sin cambios');
t('Aviso de la ficha', fichas.estenosis.aviso ?? '(Retirado el 19 nov 2026: solo decía de dónde salía cada dato.)', 'retirado');
L.push('## Ficha del IECA', '');
t('En este caso · caso 35', fichas.ieca.enCaso![35], 'nuevo');
t('En este caso · caso 15', fichas.ieca.enCaso![15], 'sin cambios');
L.push('## Casos', '');
for (const id of [34, 35]) {
  t(`Caso ${id} · nombre`, caso(id).nombre, 'nuevo');
  t(`Caso ${id} · Qué mirar`, queMirar[id], 'nuevo');
  t(`Caso ${id} · nota`, caso(id).nota!, 'nuevo');
}
t('Caso 5 · nota', caso(5).nota!, 'sin cambios: ¿conviene invitar a probar la unilateral?');
t('Caso 15 · nota', caso(15).nota!, 'sin cambios');
L.push('## Avisos', '');
t(`Aviso «${aviso('estenosis-unilateral-sraa').titulo}»`, aviso('estenosis-unilateral-sraa').texto, 'nuevo, precaución, solo en la unilateral');
t(`Aviso «${aviso('estenosis-sraa').titulo}»`, aviso('estenosis-sraa').texto, 'sin cambios; ahora solo salta en la bilateral y el riñón único');
const nota = m.avisos!.notas!.find((x) => x.id === 'estenosis-aterosclerosis')!;
t(`Nota «${nota.titulo}»`, nota.texto, 'sin cambios');
L.push('## Retos', '');
for (const id of [11, 9]) {
  const r = retos.find((x) => x.id === id)!;
  const estado = id === 11 ? 'nuevo' : 'sin cambios; sigue siendo bilateral';
  t(`Reto ${id} · enunciado`, r.enunciado, estado);
  r.pistas.forEach((p, i) => t(`Reto ${id} · pista ${i + 1}`, p, estado));
  r.delata.forEach((p, i) => t(`Reto ${id} · lo que lo delataba ${i + 1}`, p, estado));
}
L.push('## Relaciones (texto de «La mueven» y «Mueve a»)', '');
for (const r of m.relaciones.filter((x) => x.n === 119 || x.n === 120)) t(`Relación ${r.n}`, r.explicacion, 'nuevo');
writeFileSync(new URL('../docs/revision-fase-7.md', import.meta.url), L.join('\n'));
