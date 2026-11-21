import { INTENSIDAD, type Escala, type Relacion, type RelacionSuma, type Signo } from '../motor/tipos';

/**
 * Biblioteca común de fisiología (fase N2): relaciones compartibles entre temas.
 * Cada relación se escribe una sola vez, con su número, su signo y sus PMID (y su
 * frase en `bibliografia.ts`). Cada tema importa las que usa (`importar.ts`) y
 * pone encima sus intensidades, umbrales y escalas: lo común es el signo, los
 * PMID y la frase; lo de cada tema, el peso y cuándo actúa.
 *
 * Las intensidades escritas aquí son las de partida: las del documento del
 * modelo v2.1 (docs/modelo-v2.1.md) y, en las revisiones, las de su propuesta.
 * Los ajustes de la calibración de la hipertensión no se escriben aquí: están en
 * `src/temas/hipertension/calibracion.ts`, con su motivo, y se aplican encima.
 * Fase 4: `bloqueable` ya no marca la 36, la 37 ni la 43 (los diuréticos actúan
 * sobre la reabsorción de Na y la espironolactona sobre el receptor, en la 34 y
 * la 35; ver farmacos.ts).
 *
 * Fuentes (19 nov 2026): solo PubMed. `pmid` son los artículos que respaldan la
 * relación (citas en `bibliografia.ts` y docs/fuentes.md) y `fuente` vale «PubMed».
 */

const { debil: D, moderada: M, fuerte: F } = INTENSIDAD;

function s(
  n: number,
  origen: string,
  destino: string,
  signo: Signo,
  intensidad: number,
  tiempo: Escala,
  fuente: string,
  explicacion: string,
  extra: Partial<RelacionSuma> = {},
): RelacionSuma {
  return { n, tipo: 'suma', origen, destino, signo, intensidad, tiempo, fuente, explicacion, ...extra };
}

/** Las 73 relaciones del modelo v2.1 (docs/modelo-v2.1.md), con las intensidades del documento. */
export const relacionesV21: Relacion[] = [
  // Vasos y edad
  s(1, 'edad', 'rigidez', '+', M, 'estable', 'PubMed', 'Las arterias pierden distensibilidad con los años', { pmid: ['9236450', '15731494'] }),
  s(2, 'edad', 'placa', '+', D, 'estable', 'PubMed', 'La edad cuenta por sí misma: más años de exposición a los factores de riesgo y envejecimiento de las células de la pared', { pmid: ['22773427'] }),
  s(3, 'factores', 'placa', '+', F, 'estable', 'PubMed', 'Daño endotelial y LDL: inflamación, células espumosas, fibrosis', { pmid: ['31420554', '9887164'] }),
  s(4, 'factores', 'rigidez', '+', M, 'estable', 'PubMed', 'Aceleran la rigidez propia de la edad', { pmid: ['15731494', '18239908', '19884567'] }),
  s(5, 'placa', 'rigidez', '+', M, 'estable', 'PubMed', 'La pared engrosada y fibrosa se distiende menos', { pmid: ['24175067', '15731494'] }),
  s(72, 'factores', 'rvp', '+', D, 'estable', 'PubMed', 'Disfunción endotelial y remodelado de las arteriolas, donde está la resistencia', { pmid: ['11238267', '12588755'] }),

  // Sal, agua y ADH
  s(7, 'sal', 'osmP', '+', M, 'minutos', 'PubMed', 'El Na ingerido concentra el medio interno', { pmid: ['15557392'] }),
  s(8, 'osmP', 'adh', '+', F, 'minutos', 'PubMed', 'Osmorreceptores → hipotálamo', { pmid: ['18509340', '4750450'] }),
  s(9, 'osmP', 'sed', '+', F, 'minutos', 'PubMed', 'Los mismos osmorreceptores activan el centro de la sed', { pmid: ['14739394'] }),
  { n: 10, tipo: 'fija', origen: 'adhAutonoma', destino: 'adh', fuente: 'PubMed', pmid: ['17507705', '31395885', '36974717', '38693275'],
    explicacion: 'Fuera de 0, la ADH ignora sus estímulos (SIADH o diabetes insípida)' },
  s(11, 'adh', 'reabAgua', '+', F, 'minutos', 'PubMed', 'Inserta acuaporinas en el colector', { bloqueable: ['vaptanes'], pmid: ['11773613'] }),
  s(12, 'adh', 'rvp', '+', D, 'minutos', 'PubMed', 'Vasoconstricción V1, relevante solo con niveles altos', { pmid: ['11555538', '23073632'] }),
  s(13, 'sed', 'volemia', '+', M, 'dias', 'PubMed', 'Beber repone volumen', { pmid: ['18843231', '14739394'] }),
  s(14, 'sed', 'osmP', '-', M, 'dias', 'PubMed', 'El agua bebida diluye', { pmid: ['2669525', '14739394'] }),
  { n: 15, tipo: 'modula', origen: 'accesoAgua', destino: 'sed', relaciones: [13, 14], fuente: 'PubMed', pmid: ['12152926', '14739394', '20646222'],
    explicacion: 'Sin acceso al agua, la sed no se traduce en ingesta' },
  s(67, 'accesoAgua', 'volemia', '+', F, 'dias', 'PubMed', 'Sin ingesta basal se pierde volumen (respiración, sudor, orina obligada)', { pmid: ['20646222', '4750450'] }),
  s(68, 'accesoAgua', 'osmP', '-', M, 'dias', 'PubMed', 'Sin agua, el medio interno se concentra', { pmid: ['4750450', '20646222'] }),
  s(16, 'reabAgua', 'diuresis', '-', F, 'minutos', 'PubMed', 'Menos agua en la orina', { pmid: ['11773613', '31395885'] }),
  s(17, 'reabAgua', 'osmP', '-', M, 'dias', 'PubMed', 'Se recupera agua sin solutos: diluye', { pmid: ['23817822', '17507705'] }),
  s(18, 'reabAgua', 'osmU', '+', F, 'minutos', 'PubMed', 'La orina se concentra', { pmid: ['11773613', '31395885'] }),
  s(19, 'diuresis', 'volemia', '-', F, 'dias', 'PubMed', 'Lo que se orina sale del volumen', { pmid: ['2063193'] }),
  s(20, 'osmP', 'natremia', '+', F, 'minutos', 'PubMed', 'El Na es el principal soluto del plasma', { pmid: ['35779183', '27156756'] }),

  // Sistema renina-angiotensina-aldosterona
  s(21, 'perfRenal', 'renina', '-', F, 'minutos', 'PubMed', 'Barorreceptor de la arteriola aferente', { pmid: ['24944035', '20360309'] }),
  s(22, 'tfg', 'renina', '-', M, 'minutos', 'PubMed', 'Mácula densa: llega menos NaCl', { pmid: ['20360309'] }),
  s(69, 'volemia', 'renina', '-', M, 'dias', 'PubMed', 'Con volumen alto llega más NaCl a la mácula densa y baja el tono simpático renal', { pmid: ['24944035', '20360309'] }),
  s(23, 'simpatico', 'renina', '+', F, 'minutos', 'PubMed', 'Receptores β1 yuxtaglomerulares', { bloqueable: ['betabloqueante'], pmid: ['20360309'] }),
  s(24, 'tiroides', 'renina', '+', D, 'dias', 'PubMed', 'Más respuesta de los receptores β, que en el riñón liberan renina; el sistema renina-angiotensina queda más activo (D5)', { pmid: ['14594573', '11172193', '16452532', '7040892'] }),
  s(25, 'tumorRenina', 'renina', '+', F, 'estable', 'PubMed', 'Secreción autónoma', { pmid: ['38438720'] }),
  s(26, 'renina', 'angII', '+', F, 'minutos', 'PubMed', 'Cascada angiotensinógeno → I → II', { bloqueable: ['IECA', 'aliskireno'], pmid: ['17970613'] }),
  s(27, 'angII', 'rvp', '+', F, 'minutos', 'PubMed', 'Vasoconstricción generalizada; su ausencia vasodilata poco',
    { intensidadNegativa: D, bloqueable: ['ARA-II'], pmid: ['17970613'] }),
  s(28, 'angII', 'aldo', '+', F, 'dias', 'PubMed', 'Estimula la corteza suprarrenal', { intensidadNegativa: M, bloqueable: ['ARA-II'], pmid: ['10619573', '17970613'] }),
  s(73, 'potasio', 'aldo', '+', M, 'dias', 'PubMed', 'El K alto estimula la aldosterona directamente', { pmid: ['1167307', '15044681'] }),
  s(29, 'angII', 'reabNa', '+', M, 'dias', 'PubMed', 'Transportadores de Na en el túbulo', { bloqueable: ['ARA-II'], pmid: ['12642017', '17878513'] }),
  s(30, 'angII', 'adh', '+', D, 'minutos', 'PubMed', 'Activa el hipotálamo', { bloqueable: ['ARA-II'], pmid: ['15089972', '32736759'] }),
  s(31, 'angII', 'sed', '+', D, 'minutos', 'PubMed', 'Activa el centro de la sed', { bloqueable: ['ARA-II'], pmid: ['9674690', '14739394'] }),
  s(32, 'angII', 'simpatico', '+', D, 'minutos', 'PubMed', 'Potencia la actividad simpática', { bloqueable: ['ARA-II'], pmid: ['1616014', '32736759'] }),
  s(74, 'angII', 'tfg', '+', D, 'minutos', 'PubMed', 'Contrae la arteriola eferente y sostiene la filtración, sobre todo cuando llega poca presión al riñón', { bloqueable: ['ARA-II'], pmid: ['24944035', '32606889'] }),
  s(33, 'hiperaldo', 'aldo', '+', F, 'estable', 'PubMed', 'Secreción autónoma', { pmid: ['32724183', '26934393'] }),
  s(34, 'aldo', 'mineralo', '+', F, 'dias', 'PubMed', 'Activa su receptor renal', { bloqueable: ['espironolactona'], pmid: ['29982819', '25540145'] }),
  s(35, 'regaliz', 'mineralo', '+', M, 'dias', 'PubMed', 'Inhibe la 11β-HSD2: el cortisol activa el receptor de aldosterona', { bloqueable: ['espironolactona'], pmid: ['2889032', '11494093', '38246526'] }),
  s(36, 'mineralo', 'reabNa', '+', F, 'dias', 'PubMed', 'Canales y bombas de Na en el colector', { pmid: ['25540145'] }),
  s(37, 'mineralo', 'potasio', '-', M, 'dias', 'PubMed', 'Se secreta K a cambio del Na reabsorbido', { pmid: ['25903070', '25540145'] }),

  // Riñón
  s(38, 'estenosis', 'perfRenal', '-', F, 'estable', 'PubMed', 'Llega menos sangre al riñón', { pmid: ['23258796', '11172181'] }),
  s(39, 'pam', 'perfRenal', '+', D, 'minutos', 'PubMed', 'La presión de la aferente sigue a la arterial; la autorregulación protege la filtración', { pmid: ['40775567', '25834230'] }),
  s(70, 'pam', 'reabNa', '-', M, 'dias', 'PubMed', 'Natriuresis por presión: con presión alta el túbulo reabsorbe menos Na (O2)', { pmid: ['1730460', '2063193'] }),
  s(40, 'perfRenal', 'tfg', '+', F, 'minutos', 'PubMed', 'Menos flujo, menos filtración', { pmid: ['8574595', '25834230'] }),
  s(41, 'caidaFiltracion', 'tfg', '-', F, 'estable', 'PubMed', 'Membrana dañada u obstrucción de la salida de la orina', { pmid: ['3613404', '6522141'] }),
  s(42, 'tfg', 'diuresis', '+', M, 'minutos', 'PubMed', 'Se filtra menos líquido', { pmid: ['28271233', '25098598'] }),
  s(43, 'reabNa', 'diuresis', '-', M, 'dias', 'PubMed', 'El agua sigue al Na', { pmid: ['26240596', '2063193'] }),
  s(44, 'reabNa', 'osmP', '+', D, 'dias', 'PubMed', 'El Na retenido activa la ADH y arrastra agua: la natremia apenas cambia', { pmid: ['15557392'] }),
  s(45, 'tfg', 'creatinina', '-', F, 'dias', 'PubMed', 'La creatinina es el marcador de filtración; no se mueve con pequeñas variaciones', { umbral: -0.3, pmid: ['27647862', '1394976'] }),
  s(66, 'tfg', 'potasio', '-', M, 'estable', 'PubMed', 'Con mucha menos filtración se excreta menos K', { umbral: -0.3, pmid: ['19546417'] }),

  // Corazón y simpático
  s(46, 'feo', 'simpatico', '+', F, 'minutos', 'PubMed', 'Catecolaminas circulantes; los bloqueantes actúan en las relaciones 23 y 51–53', { pmid: ['16112304'] }),
  s(47, 'tiroides', 'fc', '+', F, 'dias', 'PubMed', 'Efecto cronotrópico directo', { pmid: ['11172193', '14594573'] }),
  s(48, 'tiroides', 'contractilidad', '+', F, 'dias', 'PubMed', 'Efecto inotrópico directo', { pmid: ['11172193', '14594573'] }),
  s(49, 'tiroides', 'rvp', '-', F, 'dias', 'PubMed', 'La T3 relaja el músculo liso de las arteriolas y el mayor metabolismo de los tejidos las dilata', { pmid: ['11172193', '16896276'] }),
  s(50, 'tiroides', 'simpatico', '+', D, 'dias', 'PubMed', 'Más respuesta a las catecolaminas, cuya concentración es normal o baja; el efecto es débil y discutido (D5)', { pmid: ['6263953', '11172193', '6317368'] }),
  s(51, 'simpatico', 'fc', '+', F, 'minutos', 'PubMed', 'β1 en el nódulo sinusal', { bloqueable: ['betabloqueante'], pmid: ['20713547', '10581327'] }),
  s(52, 'simpatico', 'contractilidad', '+', F, 'minutos', 'PubMed', 'β1 en el miocardio', { bloqueable: ['betabloqueante'], pmid: ['11527117', '10581327'] }),
  s(53, 'simpatico', 'rvp', '+', F, 'minutos', 'PubMed', 'α1 en las arteriolas', { bloqueable: ['alfabloqueante'], pmid: ['7491088', '11356987'] }),
  s(54, 'fc', 'gc', '+', F, 'minutos', 'PubMed', 'GC = FC × volumen sistólico', { pmid: ['18771592', '27613307'] }),
  s(55, 'contractilidad', 'gc', '+', M, 'minutos', 'PubMed', 'Más volumen sistólico', { pmid: ['18771592'] }),
  s(56, 'volemia', 'gc', '+', F, 'minutos', 'PubMed', 'Más precarga, más volumen sistólico (Frank-Starling)', { pmid: ['18771592', '27613307'] }),

  // Presiones
  s(57, 'gc', 'pas', '+', F, 'minutos', 'PubMed', 'Más sangre eyectada por latido', { pmid: ['16896276', '14594573'] }),
  s(58, 'gc', 'pad', '+', D, 'minutos', 'PubMed', 'Sube algo la presión de base', { pmid: ['30305136', '11263624'] }),
  s(59, 'rvp', 'pad', '+', F, 'minutos', 'PubMed', 'La sangre sale más despacio en diástole', { pmid: ['17515449', '9236450'] }),
  s(60, 'rvp', 'pas', '+', M, 'minutos', 'PubMed', 'Más poscarga', { pmid: ['30305136'] }),
  s(61, 'rigidez', 'pas', '+', F, 'estable', 'PubMed', 'La pared no amortigua la eyección', { pmid: ['9236450', '15731494'] }),
  s(62, 'rigidez', 'pad', '-', M, 'estable', 'PubMed', 'Se pierde el efecto Windkessel', { pmid: ['9236450'] }),
  s(71, 'volemia', 'rvp', '+', M, 'estable', 'PubMed',
    'Autorregulación a largo plazo: los tejidos limitan el exceso de flujo, el gasto vuelve a lo normal y la RVP sostiene la hipertensión', { pmid: ['2667575', '2063193'] }),

  // Retroalimentación
  s(63, 'volemia', 'adh', '-', M, 'minutos', 'PubMed', 'Barorreceptores de volumen frenan la ADH', { pmid: ['4750450'] }),
  s(64, 'volemia', 'sed', '-', M, 'minutos', 'PubMed', 'Con volumen alto no hay sed', { pmid: ['14739394'] }),
  s(65, 'pam', 'simpatico', '-', M, 'minutos', 'PubMed',
    'Barorreflejo. En la hipertensión mantenida se reajusta en buena parte: el modelo lo simplifica y no lo cuenta en estado estable (O1)', { hasta: 'dias', pmid: ['32736759', '25729060'] }),
];

/**
 * Relaciones nuevas de la calibración del hito 3a y de la fase 4, con la
 * intensidad de su propuesta. Su motivo está en
 * `src/temas/hipertension/propuestas.ts` (relacionesNuevas).
 */
export const relacionesPropuestas: RelacionSuma[] = [
  {
    n: 75, tipo: 'suma', origen: 'volemia', destino: 'reabAgua', signo: '-', intensidad: 0.6, umbral: 0,
    tiempo: 'estable', fuente: 'PubMed', pmid: ['9109429', '10026831'],
    explicacion: 'Escape: con volumen alto mantenido el riñón deja de retener agua (en el SIADH, el colector pierde acuaporina 2 aunque la ADH siga alta)',
  },
  {
    n: 76, tipo: 'suma', origen: 'volemia', destino: 'perfRenal', signo: '+', intensidad: 0, intensidadNegativa: 0.6,
    tiempo: 'dias', fuente: 'PubMed', pmid: ['2221095', '2750938'],
    explicacion: 'Con poco volumen, la vasoconstricción renal reduce el flujo al riñón (azotemia prerrenal)',
  },
  {
    n: 77, tipo: 'suma', origen: 'volemia', destino: 'simpatico', signo: '-', intensidad: 0, intensidadNegativa: 0.6,
    umbral: -0.4, tiempo: 'dias', fuente: 'PubMed', pmid: ['22557974'],
    explicacion: 'Reflejo de volumen bajo: cuando la pérdida de volumen es moderada o mayor, los receptores de baja presión activan el simpático',
  },
  {
    n: 78, tipo: 'suma', origen: 'tiroides', destino: 'rigidez', signo: '-', intensidad: 0, intensidadNegativa: 0.3,
    tiempo: 'estable', fuente: 'PubMed', pmid: ['12364455', '29545561'],
    explicacion: 'En el hipotiroidismo mantenido las arterias grandes se vuelven algo más rígidas (disfunción endotelial y cambios de la pared); revierte con el tratamiento',
  },
  {
    n: 79, tipo: 'suma', origen: 'simpatico', destino: 'rvp', signo: '-', intensidad: 0.3,
    tiempo: 'minutos', fuente: 'PubMed', pmid: ['39229379', '23817839'], bloqueable: ['betabloqueante'],
    explicacion: 'Receptores β2 de las arteriolas del músculo esquelético: la adrenalina las dilata',
  },
  {
    n: 81, tipo: 'suma', origen: 'mineralo', destino: 'potasio', signo: '-', intensidad: 0.6, umbral: -0.3,
    tiempo: 'dias', fuente: 'PubMed', pmid: ['26121445', '29540487'],
    explicacion: 'Con muy poca actividad mineralocorticoide el túbulo colector apenas secreta K: el potasio sube',
  },
];

const UNILATERAL = { nodo: 'estenosis', solo: ['unilateral'] };

/**
 * Fase 7: lateralidad de la estenosis renal (aprobada por Edu el 17 nov 2026).
 * Solo actúan en la estenosis unilateral (ver src/temas/hipertension/lateralidad.ts).
 */
export const relacionesLateralidad: Relacion[] = [
  {
    n: 119, tipo: 'suma', origen: 'estenosis', destino: 'renina', signo: '+', intensidad: M, tiempo: 'minutos',
    fuente: 'PubMed', variante: UNILATERAL, pmid: ['2652313', '4332626', '16202699'],
    explicacion: 'Solo en la unilateral: el riñón afectado sigue notando poca presión en su arteriola aferente y libera renina, aunque los dos riñones juntos filtren casi lo normal',
  },
  {
    n: 120, tipo: 'suma', origen: 'estenosis', destino: 'reabNa', signo: '-', intensidad: D, tiempo: 'dias',
    fuente: 'PubMed', variante: UNILATERAL, pmid: ['2652313', '4332626'],
    explicacion: 'Solo en la unilateral: el riñón sano, con la presión alta, expulsa el sodio y el volumen no crece',
  },
];

/**
 * Revisión del nodo edad (17 nov 2026, aprobada por Edu): la edad refuerza la
 * falta de agua (relaciones 67 y 68). Ver src/temas/hipertension/edad.ts.
 */
export const relacionesEdad: Relacion[] = [
  {
    n: 121, tipo: 'modula', origen: 'edad', destino: 'volemia', relaciones: [67, 68], signo: '+', intensidad: 0.5,
    fuente: 'PubMed', pmid: ['11528342', '9050029', '6472364'],
    explicacion: 'Con los años se nota menos la sed y el riñón concentra peor la orina: la misma falta de agua deshidrata más',
  },
];
