/**
 * Enlaces internos de las fichas: palabras completas o frases con significado
 * concreto que abren la ficha de cada nodo. Se buscan de la más larga a la más
 * corta («osmolaridad del medio interno» antes que «osmolaridad»; «tumor de
 * renina» antes que «renina»). Quedan fuera, a propósito, términos demasiado
 * genéricos: «presión», «riñón», «sangre», «volumen», «filtración» a secas.
 * Datos del tema: la interfaz solo los lee.
 */
export const terminos: Record<string, string[]> = {
  // Causas
  edad: [],
  factores: ['factores de riesgo vascular', 'factores de riesgo'],
  sal: ['ingesta de sal', 'dieta alta en sal', 'dieta baja en sal'],
  tiroides: ['hormonas tiroideas', 'hipertiroidismo', 'hipotiroidismo'],
  adhAutonoma: ['SIADH', 'diabetes insípida'],
  estenosis: ['estenosis de arteria renal', 'estenosis de la arteria renal', 'estenosis renal'],
  caidaFiltracion: ['glomerulonefritis'],
  tumorRenina: ['tumor secretor de renina', 'tumor de renina', 'reninoma'],
  hiperaldo: ['hiperaldosteronismo primario', 'hiperaldosteronismo'],
  feo: ['feocromocitoma'],
  regaliz: ['regaliz'],
  accesoAgua: ['deshidratación', 'acceso al agua'],
  // Mecanismos
  osmP: ['osmolaridad plasmática', 'osmolaridad del plasma', 'osmolaridad del medio interno', 'osmolaridad de la sangre', 'osmolaridad'],
  adh: ['hormona antidiurética', 'vasopresina', 'ADH'],
  sed: ['centro de la sed', 'sed'],
  renina: ['sistema renina-angiotensina-aldosterona', 'sistema renina-angiotensina', 'renina'],
  angII: ['angiotensina II'],
  aldo: ['aldosterona'],
  mineralo: ['actividad mineralocorticoide', 'receptor mineralocorticoide', 'receptor de la aldosterona', 'receptores de aldosterona'],
  simpatico: ['sistema simpático', 'actividad simpática', 'simpático', 'catecolaminas'],
  perfRenal: ['perfusión renal', 'flujo renal'],
  tfg: ['tasa de filtración glomerular', 'filtración glomerular', 'TFG'],
  reabNa: ['reabsorción de sodio', 'reabsorción tubular de sodio'],
  reabAgua: ['reabsorción de agua', 'acuaporinas', 'acuaporina 2'],
  diuresis: ['diuresis', 'oliguria', 'poliuria'],
  fc: ['frecuencia cardíaca', 'taquicardia'],
  contractilidad: ['contractilidad'],
  rigidez: ['rigidez arterial', 'rigidez'],
  placa: ['placa de ateroma', 'placas de ateroma', 'aterosclerosis'],
  // Salidas
  volemia: ['volemia'],
  gc: ['gasto cardíaco', 'gasto'],
  rvp: ['resistencia vascular periférica', 'RVP'],
  pas: ['presión sistólica', 'sistólica'],
  pad: ['presión diastólica', 'diastólica'],
  pam: ['presión arterial media'],
  // Analítica
  creatinina: ['creatinina'],
  natremia: ['natremia', 'hiponatremia', 'hipernatremia'],
  osmU: ['osmolaridad urinaria', 'osmolaridad de la orina'],
  potasio: ['potasio', 'hipopotasemia', 'hiperpotasemia'],
  // Fármacos (fase 4)
  ieca: ['IECA'],
  ara2: ['ARA-II'],
  betabloqueante: ['betabloqueantes', 'betabloqueante'],
  alfabloqueante: ['alfabloqueantes', 'alfabloqueante'],
  tiazida: ['diurético tiazídico', 'tiazidas', 'tiazida'],
  diureticoAsa: ['diuréticos de asa', 'diurético de asa', 'furosemida'],
  espironolactona: ['espironolactona'],
  calcioantagonista: ['calcioantagonistas', 'calcioantagonista', 'amlodipino'],
  // Ejercicio (fase 5)
  sesionAerobica: ['ejercicio aeróbico', 'sesión aeróbica', 'hipotensión postejercicio'],
  sesionFuerza: ['ejercicio de fuerza', 'sesión de fuerza', 'maniobra de Valsalva'],
  entrenoAerobico: ['entrenamiento aeróbico'],
  entrenoFuerza: ['entrenamiento de fuerza'],
  entrenoIsometrico: ['entrenamiento isométrico'],
};
