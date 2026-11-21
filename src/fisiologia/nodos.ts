import type { Nodo, Variante } from '../motor/tipos';

/**
 * Biblioteca común de fisiología (fase N2): nodos compartibles entre temas.
 * Regla: se comparte el nodo (qué es); sus entradas (las relaciones que llegan a
 * él) son de cada tema. Al importarlo, un tema puede cambiar su nombre, sus
 * etiquetas, su frecuencia, su explicación y su código (`importar.ts`). Un nodo
 * que cambia de significado en otro tema (la volemia) no se comparte: ese tema
 * tiene el suyo.
 *
 * Los textos son los de la hipertensión, el primer tema.
 */

/**
 * Fase 7: variantes de la estenosis renal. «Bilateral» es la de siempre;
 * «unilateral» cambia tres relaciones (ver src/temas/hipertension/lateralidad.ts).
 */
export const variantesEstenosis: Variante[] = [
  { id: 'bilateral', nombre: 'Bilateral', corto: 'bilateral' },
  { id: 'unilateral', nombre: 'Unilateral', corto: 'unilateral' },
  { id: 'unico', nombre: 'Riñón único', corto: 'riñón único' },
];

const BI: [number, number] = [-1, 1];
const UNI: [number, number] = [0, 1];

/** 12 causas (ruedas que gira el usuario). */
const causas: Nodo[] = [
  { id: 'edad', codigo: 'C1', nombre: 'Edad', tipo: 'causa', calculo: 'entrada', rango: UNI, etiquetas: ['joven', 'mayor'], frecuencia: 'comun' },
  { id: 'factores', codigo: 'C2', nombre: 'Factores de riesgo vascular', tipo: 'causa', calculo: 'entrada', rango: UNI, etiquetas: ['no', 'sí'], frecuencia: 'comun',
    explicacion: 'Tabaco, LDL, diabetes, obesidad, sedentarismo.' },
  { id: 'sal', codigo: 'C3', nombre: 'Ingesta de sal', tipo: 'causa', calculo: 'entrada', rango: BI, etiquetas: ['baja', 'alta'], frecuencia: 'comun' },
  { id: 'tiroides', codigo: 'C4', nombre: 'Hormonas tiroideas', tipo: 'causa', calculo: 'entrada', rango: BI, etiquetas: ['hipotiroidismo', 'hipertiroidismo'], frecuencia: 'poco_frecuente' },
  { id: 'adhAutonoma', codigo: 'C5', nombre: 'Secreción de ADH autónoma', tipo: 'causa', calculo: 'entrada', rango: BI, etiquetas: ['diabetes insípida central', 'SIADH'], frecuencia: 'poco_frecuente',
    // Revisión de Fable 5.2 (hito 3e): el SIADH es la causa más frecuente de
    // hiponatremia hipotónica; la diabetes insípida central sí es rara.
    frecuenciaExtremos: ['rara', 'poco_frecuente'] },
  { id: 'estenosis', codigo: 'C6', nombre: 'Estenosis de arteria renal', tipo: 'causa', calculo: 'entrada', rango: UNI, etiquetas: ['no', 'sí'], frecuencia: 'poco_frecuente', variantes: variantesEstenosis },
  { id: 'caidaFiltracion', codigo: 'C7', nombre: 'Caída de la filtración renal', tipo: 'causa', calculo: 'entrada', rango: UNI, etiquetas: ['no', 'sí'], frecuencia: 'poco_frecuente',
    explicacion: 'Dos mecanismos distintos que bajan la TFG: daño de la membrana (glomerulonefritis) y obstrucción de la salida de la orina, que sube la presión en la cápsula de Bowman (cálculos).' },
  { id: 'tumorRenina', codigo: 'C8', nombre: 'Tumor secretor de renina', tipo: 'causa', calculo: 'entrada', rango: UNI, etiquetas: ['no', 'sí'], frecuencia: 'rara' },
  { id: 'hiperaldo', codigo: 'C9', nombre: 'Hiperaldosteronismo primario', tipo: 'causa', calculo: 'entrada', rango: UNI, etiquetas: ['no', 'sí'], frecuencia: 'poco_frecuente' },
  { id: 'feo', codigo: 'C10', nombre: 'Feocromocitoma', tipo: 'causa', calculo: 'entrada', rango: UNI, etiquetas: ['no', 'sí'], frecuencia: 'rara' },
  { id: 'regaliz', codigo: 'C11', nombre: 'Regaliz (ácido glicirrícico)', tipo: 'causa', calculo: 'entrada', rango: UNI, etiquetas: ['no', 'sí'], frecuencia: 'poco_frecuente' },
  { id: 'accesoAgua', codigo: 'C12', nombre: 'Acceso al agua', tipo: 'causa', calculo: 'entrada', rango: [-1, 0], etiquetas: ['nulo', 'libre'], frecuencia: 'comun' },
];

const mecanismo = (id: string, codigo: string, nombre: string, explicacion?: string): Nodo => ({
  id, codigo, nombre, tipo: 'mecanismo', calculo: 'suma', rango: BI, explicacion,
});

/** 17 mecanismos (se mueven solos). */
const mecanismos: Nodo[] = [
  mecanismo('osmP', 'M1', 'Osmolaridad plasmática', 'Concentración de solutos; la detectan los osmorreceptores.'),
  mecanismo('adh', 'M2', 'ADH (vasopresina)', 'Secreción hipotalámica.'),
  mecanismo('sed', 'M3', 'Sed', 'Centro de la sed del hipotálamo.'),
  mecanismo('renina', 'M4', 'Renina', 'Liberada por el aparato yuxtaglomerular.'),
  mecanismo('angII', 'M5', 'Angiotensina II', 'Producto activo del sistema.'),
  mecanismo('aldo', 'M6', 'Aldosterona', 'Secreción suprarrenal.'),
  mecanismo('mineralo', 'M7', 'Actividad mineralocorticoide', 'Activación del receptor renal, por aldosterona o por cortisol (regaliz).'),
  mecanismo('simpatico', 'M8', 'Actividad simpática', 'Tónica simpática y catecolaminas circulantes.'),
  mecanismo('perfRenal', 'M9', 'Perfusión renal', 'Presión en la arteriola aferente.'),
  mecanismo('tfg', 'M10', 'Tasa de filtración glomerular (TFG)', 'Filtración de ambos riñones.'),
  mecanismo('reabNa', 'M11', 'Reabsorción tubular de Na', 'Túbulo proximal, distal y colector.'),
  mecanismo('reabAgua', 'M12', 'Reabsorción de agua', 'Acuaporinas del colector.'),
  mecanismo('diuresis', 'M13', 'Diuresis', 'Volumen de orina; también se ve en la analítica.'),
  mecanismo('fc', 'M14', 'Frecuencia cardíaca'),
  mecanismo('contractilidad', 'M15', 'Contractilidad', 'Fuerza de contracción del miocardio.'),
  mecanismo('rigidez', 'M16', 'Rigidez arterial', 'Pérdida de distensibilidad de la pared.'),
  mecanismo('placa', 'M17', 'Placa de ateroma', 'Engrosamiento de la pared; solo actúa a través de la rigidez.'),
];

/** 6 salidas. */
const salidas: Nodo[] = [
  { id: 'volemia', codigo: 'S1', nombre: 'Volemia', tipo: 'salida', calculo: 'acumulador', rango: BI,
    explicacion: 'Agua que entra menos agua que sale.' },
  { id: 'gc', codigo: 'S2', nombre: 'Gasto cardíaco (GC)', tipo: 'salida', calculo: 'suma', rango: BI },
  { id: 'rvp', codigo: 'S3', nombre: 'Resistencia vascular periférica (RVP)', tipo: 'salida', calculo: 'suma', rango: BI },
  { id: 'pas', codigo: 'S4', nombre: 'Presión sistólica (PAS)', tipo: 'salida', calculo: 'suma', rango: BI },
  { id: 'pad', codigo: 'S5', nombre: 'Presión diastólica (PAD)', tipo: 'salida', calculo: 'suma', rango: BI },
  { id: 'pam', codigo: 'S6', nombre: 'Presión arterial media (PAM)', tipo: 'salida', calculo: 'derivado', rango: BI,
    // PAM = PAD + ⅓ (PAS − PAD) = ⅓ PAS + ⅔ PAD
    formula: { pas: 1 / 3, pad: 2 / 3 } },
];

/** 4 nodos propios de analítica (los otros 4 valores del panel son mecanismos). */
const analitica: Nodo[] = [
  { id: 'creatinina', codigo: 'A1', nombre: 'Creatinina plasmática', tipo: 'analitica', calculo: 'suma', rango: BI },
  { id: 'natremia', codigo: 'A2', nombre: 'Natremia', tipo: 'analitica', calculo: 'suma', rango: BI },
  { id: 'osmU', codigo: 'A3', nombre: 'Osmolaridad urinaria', tipo: 'analitica', calculo: 'suma', rango: BI },
  { id: 'potasio', codigo: 'A4', nombre: 'Potasio plasmático', tipo: 'analitica', calculo: 'suma', rango: BI },
];

/** Causas, mecanismos, salidas y analítica de la hipertensión (fármacos y ejercicio, en sus archivos). */
export const nodosBase: Nodo[] = [...causas, ...mecanismos, ...salidas, ...analitica];
