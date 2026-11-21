import type { Nodo, Relacion, RelacionBloquea, RelacionSuma } from '../motor/tipos';

/**
 * Biblioteca común (fase N2): ejercicio (fase 5). Cinco modificadores con su rueda, como los fármacos:
 * - dos de la sesión (minutos): sus relaciones solo actúan «durante» o «al
 *   terminar» (`momento`) y se calculan sobre el estado estable del paciente
 *   (`simular` con `momento`);
 * - tres de entrenamiento (meses): relaciones de estado estable, como la edad.
 *
 * Alcance y relaciones aprobados por Edu el 16 nov 2026 (docs/propuesta-fase-5.md).
 * Las intensidades salen de la calibración con los casos 25 a 33.
 */

const nodo = (id: string, codigo: string, nombre: string, etiquetas: [string, string], explicacion: string): Nodo => ({
  id, codigo, nombre, tipo: 'ejercicio', calculo: 'entrada', rango: [0, 1], etiquetas, explicacion,
  niveles: id.startsWith('sesion') ? (id === 'sesionFuerza' ? NIVELES_FUERZA : NIVELES_AEROBICA) : NIVELES_ENTRENO,
});

/** Texto del valor de cada rueda (placa del mando y ficha). */
const NIVELES_AEROBICA: [number, string][] = [[0, 'reposo'], [0.01, 'suave'], [0.35, 'moderada'], [0.65, 'intensa'], [0.9, 'vigorosa']];
const NIVELES_FUERZA: [number, string][] = [[0, 'reposo'], [0.01, 'ligera'], [0.35, 'moderada'], [0.65, 'alta'], [0.9, 'intensa']];
const NIVELES_ENTRENO: [number, string][] = [[0, 'sedentario'], [0.01, 'ocasional'], [0.35, 'regular'], [0.8, 'entrenado']];

export const nodosEjercicio: Nodo[] = [
  nodo('sesionAerobica', 'E1', 'Sesión aeróbica', ['reposo', 'vigorosa'],
    'Ejercicio dinámico con grandes grupos musculares: andar rápido, bicicleta, correr, nadar. La rueda es la intensidad.'),
  nodo('sesionFuerza', 'E2', 'Sesión de fuerza', ['reposo', 'intensa'],
    'Ejercicio contra resistencia: pesas, máquinas, bandas o contracciones isométricas. La rueda es la intensidad (con cargas altas, maniobra de Valsalva).'),
  nodo('entrenoAerobico', 'E3', 'Entrenamiento aeróbico', ['sedentario', 'entrenado'],
    'Ejercicio aeróbico regular, casi todos los días, mantenido durante semanas o meses.'),
  nodo('entrenoFuerza', 'E4', 'Entrenamiento de fuerza', ['sedentario', 'entrenado'],
    'Ejercicio de fuerza dinámica regular durante meses, 2 o 3 días a la semana.'),
  nodo('entrenoIsometrico', 'E5', 'Entrenamiento isométrico', ['sedentario', 'entrenado'],
    'Contracciones isométricas mantenidas (prensión de mano, sentadilla en pared), 3 días a la semana durante semanas.'),
];

type Opciones = Pick<RelacionSuma, 'momento' | 'pmid'> & { tiempo?: RelacionSuma['tiempo'] };

function efecto(n: number, origen: string, destino: string, peso: number, explicacion: string, o: Opciones = {}): RelacionSuma {
  return {
    n, tipo: 'suma', origen, destino, signo: peso < 0 ? '-' : '+', intensidad: Math.abs(peso),
    tiempo: o.tiempo ?? 'minutos', momento: o.momento, pmid: o.pmid, fuente: o.pmid?.length ? 'PubMed' : 'Fisiología', explicacion,
  };
}

function bloquea(n: number, origen: string, destino: string, relaciones: number[], maximo: number, explicacion: string,
  o: Pick<RelacionBloquea, 'momento' | 'pmid' | 'soloExceso'> = {}): RelacionBloquea {
  return { n, tipo: 'bloquea', origen, destino, relaciones, maximo, fuente: o.pmid?.length ? 'PubMed' : 'Fisiología', explicacion, ...o };
}

/** Salidas del simpático: renina (β1), frecuencia y contractilidad (β1), RVP (α1 y β2). */
const SIMPATICO = [23, 51, 52, 53, 79];

const durante = { momento: 'durante' } as const;
const despues = { momento: 'despues' } as const;
const estable = { tiempo: 'estable' } as const;

export const relacionesEjercicio: Relacion[] = [
  // Sesión aeróbica, durante.
  efecto(94, 'sesionAerobica', 'simpatico', 0.8, 'Orden central desde la corteza motora y metaborreflejo del músculo que trabaja', { ...durante, pmid: ['32861944', '26024683'] }),
  // PMID 14555886 mide la frecuencia con betabloqueante, no la retirada vagal (revisión de Fable 5.2).
  efecto(95, 'sesionAerobica', 'fc', 0.9, 'Retirada del tono vagal: la frecuencia sube aunque los receptores β estén bloqueados', { ...durante, pmid: ['24756637', '14555886'] }),
  efecto(96, 'sesionAerobica', 'gc', 0.5, 'Más retorno venoso: el músculo que trabaja se dilata y deja pasar más sangre, que vuelve al corazón. La bomba muscular ayuda, pero pesa menos que esa vasodilatación', { ...durante, pmid: ['18339690', '11719890', '8847255'] }),
  efecto(97, 'sesionAerobica', 'rvp', -1.2, 'Vasodilatación metabólica del músculo que trabaja, que vence la vasoconstricción simpática', { ...durante, pmid: ['9457657', '25834232'] }),
  // Revisión de Fable 5.2 (cambio 2), aprobada por Edu: −0,4 → −0,8. Con −0,4 la
  // perfusión renal subía con el esfuerzo moderado.
  efecto(98, 'sesionAerobica', 'perfRenal', -0.8, 'Vasoconstricción renal: la sangre se desvía al músculo. El flujo renal no cambia con el esfuerzo moderado y cae con el intenso', { ...durante, pmid: ['29525855'] }),
  bloquea(99, 'sesionAerobica', 'simpatico', [65], 0.4, 'El barorreflejo se reajusta al alza: deja subir la presión durante el esfuerzo, pero sigue regulándola', { ...durante, pmid: ['22002871', '26024683'] }),
  // 99 y 103: 70 % → 40 % el 20 nov 2026, validado por Edu: el barorreflejo se desplaza pero
  // sigue regulando (Fadel y Raven 2012, PMID 22002871).
  // Sesión de fuerza, durante.
  efecto(100, 'sesionFuerza', 'simpatico', 0.8, 'Metaborreflejo: los metabolitos que se acumulan en el músculo en tensión activan el simpático. La orden central apenas sube el simpático que va a los vasos del músculo', { ...durante, pmid: ['1936089', '4028348'] }),
  efecto(101, 'sesionFuerza', 'fc', 0.45, 'Retirada vagal, sobre todo en los primeros 30 segundos. Después la frecuencia sigue subiendo por el simpático, que el modelo cuenta aparte (relaciones 100 y 51)', { ...durante, pmid: ['4600046'] }),
  efecto(102, 'sesionFuerza', 'rvp', 0.5, 'El músculo contraído comprime sus vasos y, con la maniobra de Valsalva, sube la diastólica', { ...durante, pmid: ['3980383'] }),
  bloquea(103, 'sesionFuerza', 'simpatico', [65], 0.4, 'El barorreflejo se reajusta al alza durante el esfuerzo, pero sigue regulando', { ...durante, pmid: ['22002871'] }),
  // Revisión de Fable 5.2 (cambio 3), aprobada por Edu: sin ella la perfusión renal
  // salía ↑↑ en la sesión de fuerza. Fuentes: Momen 2003 y Drew 2017 (19 nov 2026).
  efecto(118, 'sesionFuerza', 'perfRenal', -1.2, 'Vasoconstricción renal durante el esfuerzo (mecanorreflejo del músculo y simpático renal)', { ...durante, pmid: ['12750063', '28855178'] }),
  // Al terminar (hipotensión postejercicio).
  efecto(104, 'sesionAerobica', 'rvp', -0.3, 'Vasodilatación sostenida del músculo ejercitado por receptores de histamina H1 y H2', { ...despues, pmid: ['22872658'] }),
  efecto(105, 'sesionAerobica', 'simpatico', -0.2, 'El barorreflejo se reajusta a la baja y baja la actividad simpática', { ...despues, pmid: ['22872658', '15076798'] }),
  bloquea(106, 'sesionAerobica', 'simpatico', [65], 0.5, 'El barorreflejo reajustado defiende menos la presión durante unas horas', { ...despues, pmid: ['22872658'] }),

  // Entrenamiento aeróbico (meses).
  bloquea(107, 'entrenoAerobico', 'simpatico', SIMPATICO, 0.4, 'Baja la actividad simpática de los hipertensos hasta valores normales; si es normal, no la cambia',
    { soloExceso: true, pmid: ['17438307'] }),
  efecto(108, 'entrenoAerobico', 'fc', -0.3, 'Bradicardia de reposo: el nódulo sinusal late más despacio', { ...estable, pmid: ['24825544'] }),
  efecto(109, 'entrenoAerobico', 'gc', 0.3, 'Más volumen sistólico: con menos latidos, el gasto de reposo no baja', { ...estable, pmid: ['2000315'] }),
  bloquea(110, 'entrenoAerobico', 'rigidez', [1, 4, 5, 78], 0.2, 'Las arterias rígidas se vuelven algo más distensibles (velocidad de onda de pulso −0,6 m/s; −1 m/s si eran más rígidas, de 8 m/s o más)',
    { soloExceso: true, pmid: ['25333969'] }),
  bloquea(111, 'entrenoAerobico', 'rvp', [71, 72], 0.7, 'Mejora el endotelio (más óxido nítrico) y atenúa la RVP alta: baja más la presión de quien la tiene alta',
    { soloExceso: true, pmid: ['10484540', '23525435'] }),
  // Revisión de Fable 5.2 (cambio 1, opción a + h), aprobada por Edu: sin ellas el
  // entrenamiento no bajaba la sistólica de la dieta alta en sal (caso 30).
  efecto(116, 'entrenoAerobico', 'reabNa', -0.2, 'El riñón entrenado recibe menos actividad simpática y menos renina: excreta la misma sal con menos presión',
    { ...estable, pmid: ['1937659', '16157788'] }),
  bloquea(117, 'entrenoAerobico', 'osmP', [7], 0.3, 'Menos sensibilidad a la sal: la misma sal sube menos la presión', { soloExceso: true, pmid: ['23035134'] }),
  // Entrenamiento de fuerza (meses).
  // La 112 (atenúa el exceso simpático) se quitó el 20 nov 2026, validado por Edu: sin
  // respaldo en PubMed; un estudio encontró más actividad simpática en los entrenados en fuerza.
  // Revisión de Fable 5.2 (cambio 4), aprobada por Edu: 50 % → 70 %, como el aeróbico.
  bloquea(113, 'entrenoFuerza', 'rvp', [71, 72], 0.7, 'Atenúa la RVP alta: baja la presión de reposo como el aeróbico', { soloExceso: true, pmid: ['37975709', '37491419'] }),
  // Entrenamiento isométrico (meses).
  bloquea(114, 'entrenoIsometrico', 'simpatico', SIMPATICO, 0.25, 'Atenúa algo el exceso de actividad simpática; el mecanismo no está claro', { soloExceso: true, pmid: ['35950976', '24174307'] }),
  bloquea(115, 'entrenoIsometrico', 'rvp', [71, 72], 1, 'Atenúa la RVP alta: es el entrenamiento que más baja la presión de reposo', { soloExceso: true, pmid: ['37491419'] }),
];
