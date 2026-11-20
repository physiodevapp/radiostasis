/**
 * Datos de presentación del tema de hipertensión: nombres cortos para los
 * mandos y las ventanas, grupos de mecanismos, propiedades del vaso y textos
 * «Qué mirar en este caso». No contiene lógica ni toca el DOM: la interfaz
 * los lee igual que lee el modelo.
 */
import { panelAnalitica } from './nodos';

/**
 * Fuentes del tema (19 nov 2026): se citan en el pie de la página y en el de la
 * ficha de estudio. El detalle, relación por relación, está en
 * docs/fuentes.md.
 */
export const fuentes =
  'Basado en artículos científicos indexados en PubMed.';

/** Nombre corto en la placa del mando o dentro de la ventana. */
export const nombreCorto: Record<string, string> = {
  edad: 'Edad',
  factores: 'Factores de riesgo',
  sal: 'Sal',
  tiroides: 'Hormonas tiroideas',
  adhAutonoma: 'ADH autónoma',
  estenosis: 'Estenosis renal',
  caidaFiltracion: 'Caída de la filtración',
  tumorRenina: 'Tumor de renina',
  // Guiones blandos (\u00AD) en las palabras largas: si no caben, se parten por
  // sílabas con guion en lugar de dejar letras sueltas. Sin cortes que dejen
  // menos de tres letras a un lado («-mo», «Hi-»).
  hiperaldo: 'Hiper\u00ADal\u00ADdos\u00ADte\u00ADro\u00ADnismo',
  feo: 'Feo\u00ADcro\u00ADmo\u00ADcitoma',
  regaliz: 'Regaliz',
  accesoAgua: 'Acceso al agua',

  osmP: 'Osmolaridad',
  adh: 'ADH',
  sed: 'Sed',
  reabAgua: 'Reabs. agua',
  diuresis: 'Diuresis',
  renina: 'Renina',
  angII: 'Angiotensina II',
  aldo: 'Aldosterona',
  mineralo: 'Act. mineralocort.',
  perfRenal: 'Perfusión renal',
  tfg: 'TFG',
  reabNa: 'Reabs. Na',
  simpatico: 'Simpático',
  fc: 'Frecuencia',
  contractilidad: 'Contractilidad',
  rigidez: 'Rigidez',
  placa: 'Placa',

  volemia: 'Volemia',
  gc: 'Gasto cardíaco',
  rvp: 'Resistencia vascular periférica',
  pas: 'Sistólica',
  pad: 'Diastólica',
  pam: 'Media',

  creatinina: 'Creatinina',
  natremia: 'Natremia',
  osmU: 'Osm. urinaria',
  potasio: 'Potasio',

  ieca: 'IECA',
  ara2: 'ARA-II',
  betabloqueante: 'Beta\u00ADblo\u00ADqueante',
  alfabloqueante: 'Alfa\u00ADblo\u00ADqueante',
  tiazida: 'Tiazida',
  diureticoAsa: 'Diurético de asa',
  espironolactona: 'Espiro\u00ADno\u00ADlactona',
  calcioantagonista: 'Calcio\u00ADan\u00ADta\u00ADgo\u00ADnista',

  // Ejercicio (fase 5): en el panel van bajo los rótulos «Sesión» y «Entrenamiento».
  sesionAerobica: 'Aeróbica',
  sesionFuerza: 'Fuerza',
  entrenoAerobico: 'Aeróbico',
  entrenoFuerza: 'Fuerza',
  entrenoIsometrico: 'Isométrico',
};

/**
 * Fármacos (fase 4): pastilla de cada mando con dónde actúa, e insignia que se
 * pone en las ventanas de los nodos sobre los que actúa (el `destino` de sus
 * relaciones). «⊘» si bloquea, «↓» si baja el nodo.
 */
export const farmacosVista: Record<string, { pastilla: string; insignia: string }> = {
  ieca: { pastilla: 'SRAA', insignia: 'IECA' },
  ara2: { pastilla: 'SRAA', insignia: 'ARA-II' },
  betabloqueante: { pastilla: 'β1 · β2', insignia: 'β' },
  alfabloqueante: { pastilla: 'α1', insignia: 'α1' },
  tiazida: { pastilla: 'túbulo distal', insignia: 'tiazida' },
  diureticoAsa: { pastilla: 'asa de Henle', insignia: 'asa' },
  espironolactona: { pastilla: 'receptor MR', insignia: 'espiro.' },
  calcioantagonista: { pastilla: 'arteriola', insignia: 'Ca' },
};

/** Nombre en el panel de analítica, si difiere del corto. */
export const nombreAnalitica: Record<string, string> = {
  osmP: 'Osm. plasmática',
};

/** Orden de los 12 mandos en la rejilla de 3. */
export const ordenCausas = [
  'edad', 'factores', 'sal',
  'tiroides', 'adhAutonoma', 'estenosis',
  'caidaFiltracion', 'tumorRenina', 'hiperaldo',
  'feo', 'regaliz', 'accesoAgua',
];

/** Los 17 mecanismos agrupados por sistema. */
export const gruposMecanismos: { nombre: string; nodos: string[] }[] = [
  { nombre: 'Agua y ADH', nodos: ['osmP', 'adh', 'sed', 'reabAgua', 'diuresis'] },
  { nombre: 'Renina-angiotensina-aldosterona', nodos: ['renina', 'angII', 'aldo', 'mineralo'] },
  { nombre: 'Riñón', nodos: ['perfRenal', 'tfg', 'reabNa'] },
  { nombre: 'Corazón y simpático', nodos: ['simpatico', 'fc', 'contractilidad'] },
  { nombre: 'Vasos', nodos: ['rigidez', 'placa'] },
];

/** Las tres salidas que determinan la presión (ventanas anchas). */
export const determinantes = ['volemia', 'gc', 'rvp'];

/**
 * Retos por enlace: grupos de los que salen las claves del reto de un profesor
 * (dos de cada uno). La analítica, y los determinantes de la presión con los
 * mecanismos que no están en la analítica.
 */
/**
 * Retos por enlace: la pista automática no nombra estos valores, que se llaman
 * como una causa y casi darían la respuesta (ADH → ADH autónoma, renina → tumor
 * de renina, aldosterona → hiperaldosteronismo, TFG → caída de la filtración).
 * Siguen pudiendo ser claves al corregir.
 */
export const evitaEnPista = ['adh', 'renina', 'aldo', 'tfg'];

export const gruposClavesReto: string[][] = [
  panelAnalitica,
  [...determinantes, ...gruposMecanismos.flatMap((g) => g.nodos).filter((id) => !panelAnalitica.includes(id))],
];

/** Propiedades que muestran los vasos, con el nodo que las mueve. */
export const propiedadesVaso: { propiedad: string; nodo: string; texto: string }[] = [
  { propiedad: 'Luz de la arteriola', nodo: 'rvp', texto: 'RVP' },
  { propiedad: 'Placas', nodo: 'placa', texto: 'arteria grande' },
  { propiedad: 'Latido', nodo: 'rigidez', texto: 'rigidez' },
  { propiedad: 'Llenado', nodo: 'volemia', texto: 'volemia' },
  { propiedad: 'Velocidad', nodo: 'gc', texto: 'gasto cardíaco' },
  { propiedad: 'Ritmo', nodo: 'fc', texto: 'frecuencia' },
];

/**
 * «Qué mirar en este caso», por id de caso.
 *
 * BORRADOR del hito 3b, redactado a partir de lo que muestra el modelo
 * calibrado. Pendiente de revisión docente (con Fable 5.2, en una sesión
 * aparte, junto con los textos de las fichas del hito 3d). El texto del caso 8
 * viene del prototipo.
 */
export const queMirar: Record<number, string> = {
  1: 'La sistólica sube mucho y la diastólica baja: se ensancha la presión de pulso. Mira el latido de la arteria grande: con la rigidez apenas se distiende. La analítica es normal.',
  2: 'El gasto y la frecuencia suben mucho y la RVP cae: sube la sistólica y baja la diastólica. La renina y la aldosterona suben: aumenta la respuesta de los receptores β del riñón, que liberan renina, y la renina arrastra a la aldosterona.',
  3: 'En «Minutos» solo se mueve el agua: sube la osmolaridad, con sed, ADH y orina concentrada, pero la presión no cambia. En «Días» el volumen sube el gasto; en estado estable el gasto vuelve a lo normal y es la RVP la que sostiene la presión. Renina y aldosterona bajan.',
  4: 'La presión apenas cambia: el riñón escapa del exceso de volumen. Lo que queda está en la analítica: natremia muy baja con orina muy concentrada.',
  5: 'Renina, aldosterona y creatinina altas: el riñón recibe poca presión y responde como si faltara volumen. La presión sube por volumen y por RVP.',
  6: 'La creatinina sube mucho y el potasio sube: el problema es el riñón. La presión sube por el volumen retenido. Compara la diuresis en «Días» y en estado estable.',
  7: 'Renina y aldosterona muy altas, con potasio bajo. Es la hipertensión más intensa de las de origen renal: la angiotensina II contrae las arteriolas (mira la luz de la arteriola).',
  8: 'Renina baja, aldosterona alta y potasio bajo: la aldosterona no viene del sistema renina-angiotensina. Compáralo con el tumor de renina (las dos altas) y con el regaliz (las dos bajas).',
  9: 'El simpático dispara la frecuencia, el gasto y la RVP: las dos presiones suben mucho ya en «Minutos». La volemia baja porque la presión alta hace orinar más sodio.',
  10: 'Renina y aldosterona bajas con potasio bajo: el receptor mineralocorticoide se activa sin aldosterona. Compáralo con el hiperaldosteronismo, donde la aldosterona está alta.',
  11: 'La volemia cae mucho y la sistólica baja, pero la diastólica se mantiene: el simpático y la RVP compensan. Orina escasa y muy concentrada; renina y aldosterona muy altas.',
  12: 'Mucha orina y muy diluida. Mientras hay agua, la sed compensa y la presión apenas baja. Gira la rueda de acceso al agua hasta «nulo» para ver qué pasa sin beber.',
  13: 'Hipertensión diastólica: la RVP sube y el gasto y la frecuencia bajan. La diastólica sube y la sistólica se queda casi normal: la presión de pulso se estrecha.',
  14: 'Renina y aldosterona suben para conservar sodio y la presión apenas baja. La natremia no cambia.',
  // Fase 4: casos con fármaco. Revisados por Fable 5.2 (docs/revision-fase-4-fable.md).
  15: 'Mira la TFG y la creatinina: con el IECA la filtración se hunde y el potasio sube. La presión baja, pero a costa del riñón. La renina sube más y, aun así, la angiotensina II no sube. Gira el IECA a 0 y compara.',
  16: 'La presión baja de ↑↑ a ↑ y el potasio se normaliza. La renina sigue muy alta, pero la angiotensina II vuelve a lo normal: el IECA corta la cascada después de la renina.',
  17: 'Presión normal con la renina y la angiotensina II muy altas: el ARA-II bloquea el receptor, no la hormona. Compáralo con el caso 16, el mismo tumor con IECA.',
  18: 'Presión y potasio normales con la aldosterona todavía muy alta: el receptor está ocupado. Mira la actividad mineralocorticoide, que queda algo baja, y la renina, que deja de estar baja.',
  19: 'La frecuencia y el gasto vuelven a lo normal y, con ellos, la sistólica. No te fíes: la RVP sigue muy alta, incluso algo más, y la diastólica sigue alta. En el paciente el betabloqueante solo puede disparar la presión, y eso el modelo no lo muestra. Lee el aviso.',
  20: 'La presión, la RVP, el gasto y la frecuencia vuelven a lo normal: el alfabloqueante dilata las arteriolas y el betabloqueante frena el corazón. La actividad simpática sigue muy alta: el tumor sigue ahí. Quita el alfabloqueante y mira qué pasa con la RVP.',
  21: 'La volemia, la RVP y la presión vuelven a lo normal y el potasio baja. Casi siempre pasa sin síntomas; si baja mucho, da debilidad y palpitaciones.',
  22: 'El gasto vuelve a lo normal y, con él, la sistólica; la frecuencia queda incluso algo baja. La RVP y la diastólica siguen bajas: el betabloqueante no corrige el hipertiroidismo.',
  23: 'La presión vuelve a lo normal y el potasio, que estaba alto, también. La volemia pasa de alta a baja y la renina sube: a dosis plena el diurético se pasa. Prueba con media dosis. La creatinina sigue alta.',
  24: 'La RVP y la presión vuelven a lo normal, pero la volemia sigue alta y el gasto sube algo: el calcioantagonista dilata, no saca el volumen. Compáralo con el caso 21, la misma dieta con tiazida.',
  // Fase 5: ejercicio. Revisados por Fable 5.2 (docs/revision-fase-5-fable.md).
  25: 'Mira el dial: la sistólica sube y la diastólica se queda donde estaba. El gasto y la frecuencia suben mucho y la luz de la arteriola se abre: el músculo que trabaja se dilata. Cambia el momento a «Al terminar»: la aguja queda un poco por debajo de la de antes.',
  26: 'Compáralo con el caso 25 y mira la aguja de antes. Con el betabloqueante la frecuencia ya era baja en reposo y, con el mismo esfuerzo, se queda en lo normal; sin fármaco está muy alta. La sistólica también sube menos. Por eso la intensidad se dosifica con la escala de Borg y no con la frecuencia.',
  27: 'Aquí sube también la diastólica: la RVP sube en lugar de bajar. Compáralo con el caso 25, el ejercicio aeróbico.',
  28: 'La presión, alta antes de la sesión, queda normal al terminar. Cambia entre «Antes», «Durante» y «Al terminar» y mira la aguja tenue del dial: es la presión de antes.',
  29: 'La RVP queda por debajo de lo normal: se suman el alfabloqueante y la dilatación del final de la sesión. Lee el aviso: el riesgo está al levantarse.',
  30: 'La presión, la RVP y la volemia vuelven a lo normal y aparece bradicardia de reposo. Prueba los otros dos entrenamientos: bajan la RVP y la diastólica, pero no dan bradicardia, y en el modelo no bajan la sistólica.',
  31: 'Solo cambia la frecuencia de reposo, que baja. El gasto no cambia: cada latido expulsa más sangre.',
  32: 'El simpático llega al tope con un esfuerzo moderado. No te fíes del dial: la sistólica ya estaba cerca del tope y apenas se mueve, y la diastólica incluso baja, porque el músculo se dilata. En el paciente el esfuerzo puede disparar la presión, y eso el modelo no lo muestra. Lee el aviso: hasta tratar el tumor, nada de ejercicio intenso.',
  33: 'La frecuencia y el gasto llegan al tope de escala. Lee el aviso: con el hipertiroidismo sin controlar, ejercicio suave.',
  34: 'Renina muy alta con creatinina y volemia normales: el riñón sano compensa al afectado. Cambia a «Bilateral» en la franja de la estenosis y compara la creatinina, la volemia, la renina y la presión.',
  35: 'Con el IECA la presión vuelve a lo normal. La filtración baja algo, pero la creatinina apenas se mueve. Cambia a «Bilateral» o «Riñón único»: la filtración se hunde, sube la creatinina y salta la contraindicación.',
};

/** Segundo párrafo común: en estado estable la diuresis vuelve a lo normal. */
export const notaRetencion =
  'La diuresis es normal porque en estado estable se orina lo que se ingiere. Cambia a «Días» para ver la fase de retención.';

/** Casos en los que se muestra `notaRetencion` (retención con diuresis «=» en estado estable). */
export const casosConRetencion = [2, 3, 5, 6, 7, 8, 10];

/**
 * «Rotular capas» (hito 3d): capas de la pared que se numeran en los dibujos
 * de los vasos. Revisado por Fable 5.2 (14 nov 2026).
 */
export const capasVaso: { id: string; vaso: 'arteria' | 'arteriola'; nombre: string; texto: string }[] = [
  { id: 'intima', vaso: 'arteria', nombre: 'Íntima', texto: 'endotelio que tapiza la luz, sobre una capa fina de tejido conjuntivo. La lámina elástica interna la separa de la media.' },
  { id: 'media', vaso: 'arteria', nombre: 'Media', texto: 'muchas láminas elásticas con músculo liso entre ellas. Con la edad se fragmentan y la pared se vuelve rígida.' },
  { id: 'adventicia', vaso: 'arteria', nombre: 'Adventicia', texto: 'tejido conjuntivo que envuelve el vaso.' },
  { id: 'placa', vaso: 'arteria', nombre: 'Placa de ateroma', texto: 'crece en la íntima y hace la pared más gruesa y rígida (solo se ve si hay placa).' },
  { id: 'endotelio', vaso: 'arteriola', nombre: 'Endotelio', texto: 'una sola capa de células que tapiza la luz.' },
  { id: 'musculo', vaso: 'arteriola', nombre: 'Media', texto: 'una o dos capas de músculo liso, sin láminas elásticas gruesas. Al contraerse estrecha la luz y sube la RVP.' },
  { id: 'adventiciaArteriola', vaso: 'arteriola', nombre: 'Adventicia', texto: 'tejido conjuntivo fino.' },
];
