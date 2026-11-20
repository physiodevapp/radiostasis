/**
 * Genera docs/revision-fichas-3d.md con todos los textos docentes del hito 3d
 * (fichas, rótulos de las capas y pasos de las animaciones) para revisarlos
 * con Fable 5.2 en una sesión aparte. Uso: npm run revision-fichas
 */
import { writeFileSync } from 'node:fs';
import { animaciones } from '../src/app/animaciones';
import { hipertension as modelo } from '../src/temas/hipertension';
import { fichas } from '../src/temas/hipertension/fichas';
import { capasVaso, queMirar } from '../src/temas/hipertension/vista';

const casos = new Map(modelo.casos.map((c) => [c.id, c.nombre]));
const TIPOS = { causa: 'Causas', mecanismo: 'Mecanismos', salida: 'Salidas', analitica: 'Analítica', farmaco: 'Fármacos (fase 4)', ejercicio: 'Ejercicio (fase 5)' } as const;

const l: string[] = [];
l.push(
  '# Revisión de los textos del hito 3d (fichas)',
  '',
  'Documento generado con `npm run revision-fichas` a partir de `src/temas/hipertension/fichas.ts`, `src/temas/hipertension/vista.ts` (capas) y `src/app/animaciones.ts` (pasos). No lo edites a mano: corrige los datos y vuelve a generarlo.',
  '',
  '## Para la sesión de revisión (Fable 5.2)',
  '',
  '**Estado:** revisado por Fable 5.2 el 14 nov 2026 (`docs/revision-fichas-3d-fable.md`). Las correcciones de texto están aplicadas; de los cuatro «Cambios que tocarían el modelo», el 1 (frecuencia del hiperaldosteronismo) y el 4 (texto de la relación 39) están aplicados; el 2 (sistólica del hipotiroidismo) queda para una recalibración y el 3 (diabetes insípida) se deja como está. La lista siguiente sirve para revisiones futuras.',
  '',
  'Redactado por Opus 5.5 el 14 nov 2026 a partir de `docs/modelo-v2.1.md` (matices D1–D6 y decisiones O1–O6) y de la fisiología estándar; fuentes de cada relación en `docs/fuentes.md`. El 19 nov 2026 los avisos se reescribieron como matices clínicos, errores frecuentes o límites del modelo (`docs/revision-fuentes-fable.md`).',
  '',
  'Qué revisar en cada ficha:',
  '',
  '1. **Exactitud fisiológica** de «Qué es», «Qué hace» y «En este caso». «En este caso» debe cuadrar con las flechas del modelo calibrado en estado estable (tabla de casos de `docs/modelo-v2.1.md`).',
  '2. **Avisos (⚠)**: que recojan un matiz clínico, un error frecuente o un límite del modelo, y que sean correctos.',
  '3. **Tono y extensión**: español de España, frases cortas, para estudiantes de grado; 150–200 palabras por ficha. Sin cifras clínicas que el modelo no tiene.',
  '4. **Puntos dudosos** que conviene mirar en especial:',
  '   - Regaliz: el umbral (unos 50 g de regaliz o 100 mg de ácido glicirrícico al día durante dos semanas); comprobar la cifra y su fuente.',
  '   - Estenosis: displasia fibromuscular «en mujeres jóvenes».',
  '   - Hiperaldosteronismo: «causa endocrina más frecuente de hipertensión secundaria» frente a la etiqueta «rara» de la rueda.',
  '   - Caída de la filtración: que una obstrucción por cálculos tenga que ser bilateral (o en riñón único) para bajar la TFG total.',
  '   - SIADH: el texto de la sed (límite del modelo).',
  '   - Animaciones: secuencia de la aldosterona (receptor citoplasmático → núcleo → canales ENaC y bombas), 11β-HSD2, mácula densa y células granulares, y la formación de la placa.',
  '',
  'El texto «En este caso» que no está escrito a mano lo genera la interfaz a partir del modelo, con estas plantillas (en `src/app/ficha.ts`): «Sube. Tira hacia arriba sobre todo X (↑). Frena Y (↓).», «Normal: X tira hacia arriba e Y hacia abajo, y se compensan.» y «Normal: en este caso nada lo mueve de forma apreciable.». Cada relación lleva una etiqueta: «tira hacia arriba», «tira hacia abajo», «la que más pesa», «casi no influye ahora», «actúa desde «Días»».',
  '',
  'Devuelve las correcciones como una tabla (nodo, apartado, texto actual, propuesta, motivo) para que Edu las valide antes de aplicarlas.',
  '',
  '### Fase 4: fármacos (revisada)',
  '',
  '**Estado:** revisado por Fable 5.2 el 16 nov 2026 (`docs/revision-fase-4-fable.md`); las 46 correcciones, el aviso «Cuidado con la deshidratación» y los cambios del modelo 1, 2, 4 y 6 están aplicados con el visto bueno de Edu (el 3 y el 5, no). La lista siguiente sirve para revisiones futuras.',
  '',
  'Redactado por Opus 5.5 el 16 nov 2026: las 8 fichas de la sección «Fármacos», con el apartado «En la consulta de fisioterapia»; los textos de los casos 15 a 24 («Qué mirar» y nota, en `src/temas/hipertension/vista.ts` y `casos.ts`) y los avisos de interacción (`src/temas/hipertension/avisos.ts`) van al final de este documento. Qué revisar además de lo anterior:',
  '',
  '1. **Farmacología**: mecanismo, lugar de acción y efectos en la analítica de cada familia; que «En este caso» cuadre con las flechas de los casos 15 a 24.',
  '2. **Orientación a la fisioterapia**: que «En la consulta de fisioterapia» recoja lo que importa en la sesión (hipotensión ortostática, frecuencia cardíaca y ejercicio con betabloqueantes, calambres con diuréticos, edemas con calcioantagonistas…), sin consejos que correspondan al médico.',
  '3. **Avisos de interacción**: que el nivel («Contraindicado», «No se asocian», «Vigilar el potasio») y el texto sean correctos.',
  '4. **Límites del modelo** que conviene contar o no: el feocromocitoma con solo betabloqueante no muestra la crisis; en la hipertensión sistólica del mayor el calcioantagonista baja sobre todo la diastólica.',
  '',
  '### Fase 5: ejercicio (revisada)',
  '',
  '**Estado:** revisado por Fable 5.2 el 16 nov 2026 (`docs/revision-fase-5-fable.md`); las 34 correcciones, el aviso «El entrenamiento no trata el tumor» y los cambios del modelo 1 a 4 están aplicados con el visto bueno de Edu (el 5 se cuenta en los textos). La lista siguiente sirve para revisiones futuras.',
  '',
  'Redactado por Opus 5.5 el 16 nov 2026: las 5 fichas de la sección «Ejercicio», con «En la consulta de fisioterapia»; los textos de los casos 25 a 33 («Qué mirar» y nota) y los avisos del ejercicio van al final de este documento. Modelo y fuentes en `docs/modelo-v2.1.md` («Cambios de la fase 5»). Qué revisar además de lo anterior:',
  '',
  '1. **Fisiología del ejercicio**: respuesta aguda (simpático, retirada vagal, vasodilatación del músculo, sistólica y diastólica en el aeróbico y en la fuerza), hipotensión postejercicio y adaptaciones del entrenamiento; que «En este caso» cuadre con las flechas de los casos 25 a 33.',
  '2. **Dosificación y seguridad** en «En la consulta de fisioterapia»: pautas (150 min/semana, Borg 11–13, fuerza al 60–80 % de 1RM, isométrico 4 × 2 min), señales para parar, umbrales del ACSM (250/115, «establecidos de forma arbitraria» según Edwards 2024, PMID 38762832) y cuándo no hacer ejercicio intenso. No se ha encontrado en texto completo el umbral de 200/110 en reposo ni la caída de la sistólica de más de 10 mmHg: no se citan.',
  '3. **Avisos del ejercicio**: nivel y texto (feocromocitoma, tiroides, betabloqueante y Borg, alfabloqueante al terminar, deshidratación y calor, Valsalva).',
  '4. **Límites que conviene contar**: el modelo no tiene postura (la hipotensión ortostática del alfabloqueante solo la cuenta el aviso); la fuerza y el isométrico bajan la diastólica pero no la sistólica; con la rigidez de la edad el entrenamiento casi no baja la sistólica.',
  '',
);

for (const [tipo, titulo] of Object.entries(TIPOS)) {
  l.push(`## ${titulo}`, '');
  for (const n of modelo.nodos.filter((x) => x.tipo === tipo)) {
    const f = fichas[n.id];
    l.push(`### ${n.codigo} · ${n.nombre}`, '');
    l.push(`**Qué es.** ${f.queEs}`, '');
    l.push(`**Qué hace.** ${f.queHace}`, '');
    if (f.animacion) l.push(`**Animación:** ${f.animacion}${f.capas ? ' · botón «Ver las capas en el vaso»' : ''}`, '');
    else if (f.capas) l.push('**Botón** «Ver las capas en el vaso»', '');
    const enCaso = Object.entries(f.enCaso ?? {});
    if (enCaso.length) {
      l.push('**En este caso**', '');
      for (const [id, t] of enCaso) l.push(`- Caso ${id} (${casos.get(Number(id))}): ${t}`);
      l.push('');
    }
    if (f.consulta) l.push(`**En la consulta de fisioterapia.** ${f.consulta}`, '');
    if (f.aviso) l.push(`> ⚠ ${f.aviso}`, '');
  }
}

l.push('## Casos con fármacos (fase 4)', '');
for (const c of modelo.casos.filter((x) => x.farmacos && !x.ejercicio)) {
  l.push(`### ${c.id} · ${c.nombre}`, '', `**Qué mirar.** ${queMirar[c.id] ?? '—'}`, '', `**El fármaco.** ${c.nota ?? '—'}`, '');
}
l.push('## Casos con ejercicio (fase 5)', '');
for (const c of modelo.casos.filter((x) => x.ejercicio)) {
  l.push(`### ${c.id} · ${c.nombre}`, '', `**Qué mirar.** ${queMirar[c.id] ?? '—'}`, '', `**El ejercicio.** ${c.nota ?? '—'}`, '');
}
l.push('## Avisos de interacción (fases 4 y 5)', '');
for (const i of modelo.avisos?.interacciones ?? []) l.push(`- **${i.titulo}** (${i.nivel}; ${[...i.todas, ...(i.alguna ? [`alguno de ${i.alguna.join(' o ')}`] : []), ...(i.requiere ? [`alguno de ${i.requiere.join(' o ')}`] : []), ...(i.ninguna ? [`sin ${i.ninguna.join(', ')}`] : []), ...(i.momentos ? [`solo ${i.momentos.join(' o ')}`] : [])].join(' + ')}): ${i.texto}`);
l.push('');

l.push('## Rotular capas', '');
capasVaso.forEach((c, i) => l.push(`${i + 1}. **${c.nombre}** (${c.vaso}): ${c.texto}`));
l.push('');

l.push('## Animaciones', '');
for (const [id, a] of Object.entries(animaciones)) {
  l.push(`### ${id} · ${a.titulo}`, '', `Descripción para lector de pantalla: ${a.descripcion}`, '');
  a.pasos.forEach((p, i) => l.push(`${i + 1}. ${p.texto}`));
  l.push('', `> ${a.nota}`, '');
}

writeFileSync(new URL('../docs/revision-fichas-3d.md', import.meta.url), l.join('\n'));
console.log('docs/revision-fichas-3d.md generado');
